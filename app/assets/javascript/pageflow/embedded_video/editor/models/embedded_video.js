pageflow.embeddedVideo.EmbeddedVideo = Backbone.Model.extend({
  modelName: 'embedded_video',
  paramRoot: 'embedded_video',

  initialize: function() {
    this.listenTo(this, 'sync', function() {
      if (this.isProcessing() && !this.pollingInterval) {
        this.pollUntilValidated();
      }
    });
  },

  urlRoot: function() {
    return '/embedded_video/embedded_videos';
  },

  isProcessed: function() {
    return this.get('state') === 'processed';
  },

  isProcessing: function() {
    return this.get('state') === 'processing';
  },

  isFailed: function() {
    return this.get('state') === 'processing_failed';
  },

  pollUntilValidated: function() {
    var model = this;

    if (model.isProcessed()) {
      return;
    }

    model.pollingInterval = setInterval(poll, 1000);

    function stopPolling() {
      if (model.pollingInterval) {
        clearInterval(model.pollingInterval);
        model.pollingInterval = null;
      }
    }

    function poll() {
      model.fetch({
        success: function() {
          if (!model.isProcessing()) {
            stopPolling();
          }
        }
      });
    }
  }
});
