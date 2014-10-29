pageflow.embeddedVideo.EmbeddedVideoStatusView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/embedded_video/editor/templates/embedded_video_status',
  className: 'embedded_video_status',

  modelEvents: {
    change: 'update'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    this.$el.toggleClass('processed', this.model.isProcessed());
    this.$el.toggleClass('failed', this.model.isFailed());
    this.$el.toggleClass('processing', this.model.isProcessing());
  }
});
