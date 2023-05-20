# frozen_string_literal: true

class DeployClient
  BUILD_DIRECTORY = 'client/build'
  PUBLIC_DIRECTORY = 'public'
  MOBILE_DIRECTORY = '../mykonote-app/www/'

  def deploy_public
    cleanup(PUBLIC_DIRECTORY)
    build
    deploy(PUBLIC_DIRECTORY)
  end

  def deploy_mobile
    cleanup(MOBILE_DIRECTORY)
    build
    deploy(MOBILE_DIRECTORY)
  end

  def cleanup_public
    cleanup(PUBLIC_DIRECTORY)
  end

  def cleanup_mobile
    cleanup(MOBILE_DIRECTORY)
  end

  def build
    success = system('cd client && npm run build')
    return false unless success

    @build_files_from_build = Dir['client/dist/*']
  end

  def deploy(directory)
    build_files_from_build.each do |file|
      FileUtils.cp_r(file, directory)
    end
  end

  def cleanup(directory)
    files =
      build_files_from_manifest(directory) +
      build_files_from_build.map do |file|
        file.sub(%r{^client/dist/}, "#{directory}/")
      end

    files.each do |file|
      FileUtils.rm_r(file) if File.exist?(file)
    end
  end

  def build_files_from_manifest(directory)
    manifest_file = File.join(directory, 'asset-manifest.json')

    return [] unless File.exist?(manifest_file)

    content = File.read(manifest_file)

    files = JSON.parse(content).values
    files.map { |file| File.join(directory, file) }
  end

  def build_files_from_build
    @build_files_from_build ||= build
  end
end
