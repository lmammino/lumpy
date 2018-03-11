const parseLumpyFile = require('./parseLumpyFile')
const DependenciesAssembler = require('./dependenciesAssembler')

const build = async (opt) => {
  const { cacheFolder, noCache } = opt
  const dependencies = await parseLumpyFile(opt.lumpyFile)
  console.log({ dependencies })
  // retrieve and assemble dependencies
  const depsAssembler = new DependenciesAssembler(dependencies, { cacheFolder, noCache })
  depsAssembler.pipe(process.stdout)

  // TODO minify
  // TODO save or print to std
}

module.exports = build
