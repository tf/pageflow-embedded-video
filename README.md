# Pageflow Embedded Video

Page type showing Youtube/Vimeo videos in an embedded iframe.

## Installation

### Add this line to your application's Gemfile:

    # Gemfile
    gem 'pageflow-embedded-video'

bundle install


### Register the page type:

    # config/initializers/pageflow.rb
    Pageflow.configure do |config|
      config.register_page_type(Pageflow::EmbeddedVideo::PageType.new)
    end

### Include javascript/stylesheets:

    # app/assets/javascripts/pageflow/application.js
    //= require "pageflow/embedded_video"

    # app/assets/javascripts/pageflow/editor.js
    //= require pageflow/embedded_video/editor

    # app/assets/stylesheets/pageflow/application.scss.css;
    @import "pageflow/embedded_video";

    # app/assets/stylesheets/pageflow/editor.scss.css;
    @import "pageflow/embedded_video/editor";


## Configuration

Configure Pageflow Embedded Video by creating an initializer in your app
`config/initializers/pageflow_embedded_video.rb`.

Example:

    Pageflow::EmbeddedVideo.configure do |config|
      config.foo = 'bar'
    end

## Contributing Locales

Edit the translations directly on the
[pageflow-embedded-video](http://www.localeapp.com/projects/public?search=tf/pageflow-embedded-video)
locale project.
