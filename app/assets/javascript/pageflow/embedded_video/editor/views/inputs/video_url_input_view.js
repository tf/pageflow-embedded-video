pageflow.embeddedVideo.VideoUrlInputView = pageflow.UrlInputView.extend({
  template: 'pageflow/embedded_video/editor/templates/url_input',

  regions: {
    statusContainer: '.status_container'
  },

  onLoad: function() {
    this.listenTo(this.model, 'change:' + this.options.propertyName, function() {
      this.updateValidationStatus();
    });

    this.updateValidationStatus();
  },

  updateValidationStatus: function() {
    var embeddedVideo = this.getEmbeddedVideo();

    if (embeddedVideo) {
      this.statusContainer.show(new pageflow.embeddedVideo.EmbeddedVideoStatusView({
        model: embeddedVideo
      }));
    }
    else {
      this.statusContainer.close();
    }
  },

  getEmbeddedVideo: function() {
    if (this.model.has(this.options.propertyName)) {
      return pageflow.embeddedVideo.embeddedVideos.getOrFetch(this.model.get(this.options.propertyName));
    }
  }
});