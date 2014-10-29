pageflow.pageType.register('embedded_video', _.extend({

  enhance: function(pageElement, configuration) {
    var scroller = pageElement.find('.scroller');

    pageElement.find('.bigscreen_toggler').on('click', function() {
      $('body').toggleClass('bigScreen');
      scroller.scroller('refresh');
    });
  },

  resize: function(pageElement, configuration) {
    var iframeWrapper = pageElement.find('.iframeWrapper'),
      pageHeader = pageElement.find('.page_header'),
      scroller = pageElement.find('.scroller');

    var widescreened = configuration.full_width;

    iframeWrapper.toggleClass('widescreened', widescreened);

    if (widescreened) {
      iframeWrapper.insertAfter(scroller);
    }
    else {
      iframeWrapper.insertAfter(pageHeader);
    }
  },

  customizeLayout: function(pageElement, configuration) {
    if(!this.layoutCustomized) {
      var iframe = pageElement.find('iframe'),
       scroller = pageElement.find('.scroller'),
       iframeOverlay = pageElement.find('.iframe_overlay');

      iframe.load(function() {
        $(this).contents().find('.fs-btn').css('display','none');
        $(this).contents().find('body').addClass($("[data-theme]").attr('data-theme'));

        if(pageflow.features.has('mobile platform')) {
          setTimeout(function() {
            if(iframe) {
              iframe.attr("height", iframe.contents().height() + "px");
              pageElement.find('.iframeWrapper').height(iframe.contents().height());
              scroller.scroller('refresh');
            }
          }, 1000);
        }
        scroller.scroller('refresh');
        pageElement.find('.iframeWrapper').addClass('active');
      });
      this.layoutCustomized = true;
    }
  },

  _initEventSimulation: function(element, iframe, wrapper) {
    var propagatedEvents = 'click mousemove mouseup mouseover mousedown';
    var lastElement;
    element.on(propagatedEvents, function(event) {
      var contentElement = iframe.contents()[0];
      element.css('display','none');
      if (contentElement && event) {
        lastElement = $(contentElement.elementFromPoint(event.pageX-iframe.offset().left, event.pageY-iframe.offset().top));
        lastElement.simulate("mousedown", event);
        lastElement.simulate("mousemove", event);
        lastElement.simulate("click", event);

        element.css('cursor', lastElement.css('cursor'));
      }
      element.css('display','block');
      event.preventDefault();
      event.stopPropagation();
    });

    iframe.load(function() {
      iframe.contents().find('*').on('mousemove', function() {
        wrapper.addClass('hovering');
      });

      iframe.contents().on('mouseout', function() {
        wrapper.removeClass('hovering');
      });
    });
  },

  prepare: function(pageElement, configuration) {
    this._loadIframe(pageElement);
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {
    this._loadIframe(pageElement);
    this.resize(pageElement, configuration);
    this.customizeLayout(pageElement, configuration);
    this._initEventSimulation(pageElement.find('.iframe_overlay'), pageElement.find('iframe'), pageElement.find('.iframeWrapper'));
  },

  activated: function(pageElement, configuration) {},

  deactivating: function(pageElement, configuration) {
    $('body').removeClass('bigScreen');
  },

  deactivated: function(pageElement, configuration) {},

  update: function(pageElement, configuration) {
    pageElement.find('h2 .tagline').text(configuration.get('tagline') || '');
    pageElement.find('h2 .title').text(configuration.get('title') || '');
    pageElement.find('h2 .subtitle').text(configuration.get('subtitle') || '');
    pageElement.find('p').html(configuration.get('text') || '');

    this.updateCommonPageCssClasses(pageElement, configuration);

    pageElement.find('.shadow').css({
      opacity: configuration.get('gradient_opacity') / 100
    });
  },

  embeddedEditorViews: function() {
    return {
      '.background_image': {
        view: pageflow.BackgroundImageEmbeddedView,
        options: {propertyName: 'background_image_id'}
      },

      'iframe': {
        view: pageflow.embeddedVideo.IframeEmbeddedView,
        options: {propertyName: 'embedded_video_id'}
      }
    };
  },

  _loadIframe: function(pageElement) {
    pageElement.find('iframe[data-src]').each(function() {
      var iframe = $(this);

      if (!iframe.attr('src')) {
        iframe.attr('src', iframe.data('src'));
      }
    });
  }
}, pageflow.commonPageCssClasses));