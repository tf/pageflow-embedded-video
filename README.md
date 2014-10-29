# Pageflow Embedded Video

Page type showing embedded Youtube/Vimeo videos.

## Installation

### Add this line to your application's Gemfile:

    # Gemfile
    gem 'pageflow-embedded-video'

### Mount the engine:

    # config/routes.rb
    mount Pageflow::EmbeddedVideo::Engine, :at => '/embedded_video'

### Register the page type:

    # config/initializers/pageflow.rb
    config.register_page_type(Pageflow::EmbeddedVideo::PageType.new)

### Include javascript/stylesheets:

    # app/assets/javascripts/pageflow/application.js
    //= require "pageflow/embedded_video"

    # app/assets/javascripts/pageflow/editor.js
    //= require pageflow/embedded_video/editor

    # app/assets/stylesheets/pageflow/application.scss.css;
    @import "pageflow/embedded_video";

    # app/assets/stylesheets/pageflow/editor.scss.css;
    @import "pageflow/embedded_video/editor";


### Create Proxy

Create a proxy (via Apache, Nginx, ...) from your domain to your configured
`S3_HOST_ALIAS` to circumvent the same-domain policy. Configure this
in your Pageflow Embedded Video initializer `config/initializers/pageflow_embedded_video.rb`.

Example conf snippet for Nginx:

    location /embedded_video/ {
      proxy_pass http://bucketname.s3-website-eu-west-1.amazonaws.com/;
      proxy_redirect http://bucketname.s3-website-eu-west-1.amazonaws.com/ $scheme://$host/embedded_video/;
    }

## Configuration

Configure Pageflow Embedded Video by creating an initializer in your app
`config/initializers/pageflow_embedded_video.rb`.

Example:

    Pageflow::EmbeddedVideo.configure do |config|
      config.foo = 'bar'
    end
