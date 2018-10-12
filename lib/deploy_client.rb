class DeployClient
  def run
    build
    deploy_public
  end

  def build
    `cd client && npm run build`

    @build_files = Dir['client/build/*']
  end

  def deploy_public
    @build_files.each do |file|
      FileUtils.cp_r(file, 'public')
    end
  end

  def cleanup_public
    @build_files.each do |file|
      file = file.sub(%r{^client/build/}, 'public/')
      FileUtils.rm_r(file)
    end
  end
end
