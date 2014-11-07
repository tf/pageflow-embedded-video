/*global YT, URI, $f */

pageflow.pageType.register('embedded_video', {

  enhance: function(pageElement, configuration) {
  },

  resize: function(pageElement, configuration) {
    var iframeWrapper = pageElement.find('.iframeWrapper'),
        pageHeader = pageElement.find('.page_header'),
        scroller = pageElement.find('.scroller'),
        widescreened = pageElement.width() > 1430,
        fullWidth;

    iframeWrapper.toggleClass('widescreened', widescreened);

    if (typeof configuration.get === 'function') {
      fullWidth = configuration.get('full_width');
    }
    else {
      fullWidth = configuration.full_width;
    }
    iframeWrapper.toggleClass('full_width', fullWidth);

    if (widescreened && !fullWidth) {
      iframeWrapper.insertAfter(scroller);
    }
    else {
      iframeWrapper.insertAfter(pageHeader);
    }

    scroller.scroller('refresh');
  },

  prepare: function(pageElement, configuration) {},

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {
    var that = this;

    this.listenTo(pageflow.settings, "change:volume", function(model, value) {
      that._setPlayerVolume(value);
    });

    if (pageElement.find('iframe').length === 0) {
      this._createPlayer(pageElement, configuration);
    }

    this.resize(pageElement, configuration);
  },

  activated: function(pageElement, configuration) {},

  deactivating: function(pageElement, configuration) {
    this.stopListening(pageflow.settings);
  },

  deactivated: function(pageElement, configuration) {
    this._removePlayer(pageElement);
  },

  update: function(pageElement, configuration) {
    pageElement.find('h2 .tagline').text(configuration.get('tagline') || '');
    pageElement.find('h2 .title').text(configuration.get('title') || '');
    pageElement.find('h2 .subtitle').text(configuration.get('subtitle') || '');
    pageElement.find('p').html(configuration.get('text') || '');

    var currentUrl = this._getCurrentUrl(pageElement),
      newUrl = configuration.get('display_embedded_video_url');

    if (this._urlOrigin(currentUrl) === this._urlOrigin(newUrl)) {
      this._updatePlayerSrc(pageElement, configuration);
    }
    else {
      this._createPlayer(pageElement, configuration);
    }

    pageElement.find('.shadow').css({
      opacity: configuration.get('gradient_opacity') / 100
    });

    this.resize(pageElement, configuration);
  },

  embeddedEditorViews: function() {
    return {
      '.background_image': {
        view: pageflow.BackgroundImageEmbeddedView,
        options: {propertyName: 'background_image_id'}
      }
    };
  },

  _createPlayer: function(pageElement, configuration) {
    var that = this,
        url;

    if (typeof configuration.get === 'function') {
      url = configuration.get('display_embedded_video_url');
    }
    else {
      url = configuration.display_embedded_video_url;
    }

    var origin = this._urlOrigin(url);

    this._removePlayer(pageElement);

    if (origin === 'youtube') {
      this.ytApiInitialize().done(function () {
        that._createYouTubePlayer(pageElement, url);
      });
    }
    else if (origin == 'vimeo') {
      that._createVimeoPlayer(pageElement, url);
    }
  },

  ytApiInitialize: function() {
    if (!window.youtubeInitialized) {
      var ytApi = new $.Deferred();
      window.youtubeInitialized = ytApi.promise();

      window.onYouTubeIframeAPIReady = function() {
        ytApi.resolve();
      };

      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    return window.youtubeInitialized;
  },

  _createYouTubePlayer: function(pageElement, url) {
    var that = this,
        div = document.createElement('div');

    this.playerId = 'youtube-player-' + this._getRandom(url);

    div.setAttribute('id', this.playerId);
    pageElement.find('.iframeWrapper').append(div);

    this.ytApiInitialize().done(function() {
      new YT.Player(that.playerId, {
        height: '100%',
        width: '100%',
        videoId: that._getVideoId(url),
        playerVars: {
          fs: false,
          rel: false
        },
        events: {
          'onReady': function(event) {
            that.player = event.target;
            that._setPlayerVolume(pageflow.settings.get('volume'));
          },
          'onStateChange': function(event) {
            if (event.data == YT.PlayerState.BUFFERING) {
              that._clearOverlayTimer(pageElement, event);
            }
            else if (event.data == YT.PlayerState.PLAYING) {
              that._clearOverlayTimer(pageElement, event);
            }
            else if (event.data == YT.PlayerState.PAUSED) {
              that._showOverlay(pageElement, event);
            }
            else if (event.data == YT.PlayerState.ENDED) {
              that._showOverlay(pageElement, event);
            }
          }
        }
      });
    });

    this._iframeOverlay(pageElement);
  },

  _createVimeoPlayer: function(pageElement, url) {
    var that = this,
        iframe = document.createElement('iframe'),
        uri = new URI('//player.vimeo.com/video/');

    this.playerId = 'vimeo-player-' + this._getRandom(url);

    uri.filename(that._getVideoId(url));
    uri.search({api: '1', player_id: this.playerId});

    $(iframe).attr({
      id: this.playerId,
      width: '100%',
      height: '100%',
      frameborder: '0',
      src: uri.toString()
    });

    pageElement.find('.iframeWrapper').append(iframe);

    this.player = $f(iframe);

    this.player.addEvent('ready', function() {
      that._setPlayerVolume(pageflow.settings.get('volume'));

      that.player.addEvent('play', function() {
        that._clearOverlayTimer(pageElement);
      });
      that.player.addEvent('pause', function() {
        that._showOverlay(pageElement);
      });
      that.player.addEvent('finish', function() {
        that._showOverlay(pageElement);
      });
    });

    this._iframeOverlay(pageElement);
  },

  _iframeOverlay: function(pageElement) {
    if(pageflow.features.has('mobile platform')) {
      var that = this,
        div = document.createElement('div'),
        wrapper = pageElement.find('.iframeWrapper');

      div.setAttribute('class', 'iframe_overlay');
      wrapper.append(div);

      $(div).click(function() {
        $(this).animate({opacity: 0}, 400).hide(400);
        that.overlayTimer = setTimeout(function() {
          that._showAnimated($(div));
        }, 5000);
      });

    }
  },

  _clearOverlayTimer: function () {
    clearTimeout(this.overlayTimer);
  },

  _showOverlay: function (pageElement) {
    this._showAnimated(pageElement.find('div.iframe_overlay'));
  },

  _showAnimated: function(element) {
    element.show().animate({opacity: 1}, 400);
  },

  _updatePlayerSrc: function(pageElement, configuration) {
    var that = this,
        newUrl = configuration.get('display_embedded_video_url'),
        p = pageElement.find('iframe'),
        url = new URI(p.attr('src'));

    p.attr('src', url.filename(that._getVideoId(newUrl)));
  },

  _setPlayerVolume: function(value) {
    if (this.player) {
      if (typeof this.player.setVolume === 'function') {
        this.player.setVolume(value * 100);
      } else if (typeof this.player.api === 'function') {
        this.player.api('setVolume', value);
      }
    }
  },

  _removePlayer: function (pageElement) {
    this.player = null;
    $('#' + this.playerId, pageElement).remove();
  },

  _getCurrentUrl: function(pageElement) {
    return pageElement.find('iframe').attr('src');
  },

  _urlOrigin: function(url) {
    var uri = new URI(url),
      domain = uri.domain(true);

    if (['youtu.be', 'youtube.com'].indexOf(domain) >= 0) {
      return 'youtube';
    }
    else if (domain === 'vimeo.com') {
      return 'vimeo';
    }

    return '';
  },

  _getVideoId: function(url) {
    var uri = new URI(url),
        domain = uri.domain(true);

    if (['youtu.be', 'vimeo.com'].indexOf(domain) >= 0) {
      return uri.filename();
    }
    else if (domain === 'youtube.com') {
      if (uri.directory() === '/embed') {
        return uri.filename();
      }
      else {
        return uri.search(true).v;
      }
    }

    return '';
  },

  _getRandom: function(string) {
    string = string + new Date().getTime();
    var hash = 0, i, chr, len;
    if (string === 0) return hash;
    for (i = 0, len = string.length; i < len; i++) {
      chr   = string.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
});