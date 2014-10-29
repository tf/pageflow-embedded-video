pageflow.embeddedVideo.IframeEmbeddedView = Backbone.Marionette.View.extend({
  modelEvents: {
    'change': 'update'
  },

  render: function() {
    return this;
  },

  update: function() {
  }

});