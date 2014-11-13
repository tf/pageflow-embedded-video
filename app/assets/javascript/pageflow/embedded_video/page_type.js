/*global YT, URI, $f */

pageflow.pageType.register('embedded_video', _.extend({

  enhance: function(pageElement, configuration) {
    var that = this;

    if (pageflow.features.has('mobile platform')) {
      pageElement.find('.close_button, .iframe_container').click(function(event) {
        event.stopPropagation();
        pageElement.find('.iframe_container').removeClass('show');
        pageflow.hideText.deactivate();
      });

      this._initPlaceholderImage(pageElement, configuration);
    }

    this.fullscreen = document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    $(document).on('fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange', function() {
       that.fullscreen = !that.fullscreen;
    });
  },

  resize: function(pageElement, configuration) {
    var iframeWrapper = pageElement.find('.iframeWrapper'),
        pageHeader = pageElement.find('.page_header'),
        scroller = pageElement.find('.scroller'),
        container = pageElement.find('.iframe_container'),
        widescreened = pageElement.width() > 1430,
        fullWidth = configuration.full_width;

    iframeWrapper.toggleClass('widescreened', widescreened);

    if (fullWidth !== undefined) {
      iframeWrapper.toggleClass('full_width', fullWidth);
    }

    if (!this.fullscreen) {
      if ((fullWidth || !widescreened) && !pageflow.features.has('mobile platform')) {
        if(scroller.find('iframe').length === 0) {
          iframeWrapper.insertAfter(pageHeader);
        }
      }
      else {
        if(container.find('iframe').length === 0) {
          container.append(iframeWrapper);
        }
      }
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
      this._createPlayer(pageElement, configuration.attributes);
    }

    pageElement.find('.shadow').css({
      opacity: configuration.get('gradient_opacity') / 100
    });

    this.resize(pageElement, configuration.attributes);
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
        url = configuration.display_embedded_video_url,
        origin = this._urlOrigin(url);

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
      new YT.Player(div, {
        height: '100%',
        width: '100%',
        videoId: that._getVideoId(url),
        playerVars: {
          rel: false
        },
        events: {
          'onReady': function(event) {
            that.player = event.target;
            that._setPlayerVolume(pageflow.settings.get('volume'));
          }
        }
      });
    });
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
      webkitallowfullscreen: true,
      mozallowfullscreen: true,
      allowfullscreen: true,
      src: uri.toString()
    });

    pageElement.find('.iframeWrapper').append(iframe);

    this.player = $f(iframe);

    this.player.addEvent('ready', function() {
      that._setPlayerVolume(pageflow.settings.get('volume'));
    });
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
    if (this.player && typeof this.player.destroy === 'function') {
      this.player.destroy();
    }
    this.player = null;
    $('#' + this.playerId, pageElement).remove();
  },

  _initPlaceholderImage: function(pageElement, configuration) {
    var $div = $(document.createElement('div')),
      pageHeader = pageElement.find('.page_header'),
      container = pageElement.find('.iframe_container'),
      url = configuration.display_embedded_video_url;

    $div.attr('class', 'iframe_overlay');
    this._setBackgroundImage(url, $div);
    pageHeader.append($div);

    $div.click(function(event) {
      event.preventDefault();
      container.addClass('show');
      pageflow.hideText.activate();
    });
  },

  _setBackgroundImage: function(url, element) {
    var origin = this._urlOrigin(url),
        videoId = this._getVideoId(url),
        imageUrl = '';

    if (origin === 'youtube') {
      imageUrl = 'http://img.youtube.com/vi/' + videoId + '/hqdefault.jpg';
      element.css('background-image', 'url("' + imageUrl + '")');
    }
    else if (origin === 'vimeo') {
      var src = "http://vimeo.com/api/v2/video/" + videoId + ".json";

      $.getJSON(src, function(data) {
        element.css('background-image', 'url("' + data[0].thumbnail_large + '")');
      });
    }
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
}, pageflow.commonPageCssClasses));