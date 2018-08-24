pageflow.ConfigurationEditorView.register('embedded_video', {
  configure: function() {
    var supportedHosts = this.options.pageType.supportedHosts;

    this.tab('general', function() {
      this.group('general');
    });

    this.tab('topic', function() {
      this.input('embedded_video_id', pageflow.UrlInputView, {
        supportedHosts: supportedHosts,
        displayPropertyName: 'display_embedded_video_url',
        required: true,
        permitHttps: true
      });

      inputForProvider('youtube', this, 'embedded_video_hide_info', pageflow.CheckBoxInputView);
      inputForProvider('youtube', this, 'embedded_video_hide_controls', pageflow.CheckBoxInputView);

      inputForProvider('vimeo', this, 'embedded_video_hide_info', pageflow.CheckBoxInputView);
      inputForProvider('vimeo', this, 'embedded_video_hide_controls', pageflow.CheckBoxInputView, {
        disabled: true
      });

      this.input('video_caption', pageflow.TextInputView);
      this.input('full_width', pageflow.CheckBoxInputView);
      this.group('background');
      this.input('thumbnail_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        imagePositioning: false
      });
    });

    this.tab('options', function() {
      this.group('options');
    });

    function inputForProvider(provider, view, propertyName, inputView, options) {
      view.input(propertyName, inputView, _.extend({
        attributeTranslationKeyPrefixes: [
          'pageflow.embedded_video.page_attributes.' + provider,
          'pageflow.embedded_video.page_attributes'
        ],
        visibleBinding: 'display_embedded_video_url',
        visible: function(url) {
          return pageflow.embeddedVideo.providerFromUrl(url) === provider;
        }
      }, options));
    }
  }
});
