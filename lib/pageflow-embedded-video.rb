require 'pageflow/embedded_video/engine'

module Pageflow
  module EmbeddedVideo
    def self.config
      @config ||= EmbeddedVideo::Configuration.new
    end

    def self.configure(&block)
      block.call(config)
    end

    def self.page_type
      EmbeddedVideo::PageType.new
    end
  end
end
