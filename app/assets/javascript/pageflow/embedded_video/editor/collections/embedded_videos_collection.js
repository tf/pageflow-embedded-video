pageflow.embeddedVideo.EmbeddedVideosCollection = Backbone.Collection.extend({
  model: pageflow.embeddedVideo.EmbeddedVideo,

  name: 'embedded_videos',

  getOrFetch: function(id, options) {
    options = options || {};
    var model = this.get(id);

    if (model) {
      if (options.success) {
        options.success(model);
      }
    }
    else {
      model = new pageflow.embeddedVideo.EmbeddedVideo({id: id});
      this.add(model);
      model.fetch(options);
    }

    return model;
  }
});
