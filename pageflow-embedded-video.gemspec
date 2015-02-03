# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "pageflow-embedded-video"
  spec.version       = "0.1.0"
  spec.authors       = ["Stefan Schöttelndreyer"]
  spec.email         = ["sschoettelndreyer@codevise.de"]
  spec.summary       = "Pagetype for embedded youtube/vimeo videos"
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_runtime_dependency "pageflow", "~> 0.7"
  spec.add_runtime_dependency 'i18n-js'

  spec.add_development_dependency "bundler"
  spec.add_development_dependency "rake"
  spec.add_development_dependency "webmock"
end
