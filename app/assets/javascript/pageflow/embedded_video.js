//= require_self
//= require ./embedded_video/page_type
//= require ./URI.js
//= require ./froogaloop.js

pageflow.embeddedVideo = {
  providerFromUrl: function(url) {
    var domain = new URI(url).domain(true);

    if (['youtu.be', 'youtube.com'].indexOf(domain) >= 0) {
      return 'youtube';
    }
    else if (domain === 'vimeo.com') {
      return 'vimeo';
    }

    return '';
  }
};
