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
  }
});