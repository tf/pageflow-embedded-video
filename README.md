# Pageflow Embedded Video

[![Gem Version](https://badge.fury.io/rb/pageflow-embedded-video.svg)](http://badge.fury.io/rb/pageflow-embedded-video)

Page type showing Youtube/Vimeo videos in an embedded iframe.

## Installation

Add this line to your application's Gemfile:

    # Gemfile
    gem 'pageflow-embedded-video'

Run `bundle install`

Register the page type:

    # config/initializers/pageflow.rb
    Pageflow.configure do |config|
      config.page_types.register(Pageflow::EmbeddedVideo.page_type)
    end

Include javascript/stylesheets:

    # app/assets/javascripts/pageflow/application.js
    //= require pageflow/embedded_video

    # app/assets/javascripts/pageflow/editor.js
    //= require pageflow/embedded_video/editor

    # app/assets/stylesheets/pageflow/application.css.scss;
    @import "pageflow/embedded_video";

    # app/assets/stylesheets/pageflow/editor.css.scss;
    @import "pageflow/embedded_video/editor";

    # app/assets/stylesheets/pageflow/themes/default.css.scss
    @import "pageflow/embedded_video/themes/default";

## Configuration

Optionally, configure Pageflow Embedded Video by creating an initializer in your app
`config/initializers/pageflow_embedded_video.rb`.

Example:

    Pageflow::EmbeddedVideo.configure do |config|
      # Remove items to disallow hosts
      # The listed hosts are supported by default:
      # config.supported_hosts = %w(https://www.youtube.com http://www.youtube.com https://vimeo.com http://vimeo.com)
    end

## Troubleshooting

If you run into problems while installing the page type, please also refer to the
[Troubleshooting](https://github.com/codevise/pageflow/wiki/Troubleshooting) wiki
page in the [Pageflow  repository](https://github.com/codevise/pageflow). If that
doesn't help, consider
[filing an issue](https://github.com/codevise/pageflow-embedded-video/issues).


## Contributing Locales

Edit the translations directly on the
[pageflow-embedded-video](http://www.localeapp.com/projects/public?search=tf/pageflow-embedded-video)
locale project.
