module Pageflow
  module EmbeddedVideo
    class Configuration

      # White list of URL prefixes (including protocol) of embedded videos.
      # @return [Array<String>]
      attr_reader :supported_hosts

      def initialize
        @supported_hosts = %w(http://youtube.com https://youtube.com http://youtu.be https://www.youtube.com http://www.youtube.com)
      end

    end
  end
end
