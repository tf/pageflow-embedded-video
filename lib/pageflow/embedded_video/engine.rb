require 'pageflow-public-i18n'

module Pageflow
  module EmbeddedVideo
    class Engine < Rails::Engine
      isolate_namespace Pageflow::EmbeddedVideo

      config.autoload_paths << File.join(config.root, 'lib')
    end
  end
end
