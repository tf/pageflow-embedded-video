module Pageflow
  module EmbeddedVideo
    class Configuration

      # White list of URL prefixes (including protocol) of embedded videos.
      # @return [Array<String>]
      attr_reader :supported_hosts

      def initialize
        @supported_hosts = %w(https://www.youtube.com http://www.youtube.com http://vimeo.com)
      end

    end
  end
end
