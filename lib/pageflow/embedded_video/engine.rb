require 'pageflow-public-i18n'

module Pageflow
  module EmbeddedVideo
    class Engine < Rails::Engine
      isolate_namespace Pageflow::EmbeddedVideo

      config.paths.add('lib', eager_load: true)
      config.i18n.load_path += Dir[config.root.join('config', 'locales', '**', '*.yml').to_s]
    end
  end
end
