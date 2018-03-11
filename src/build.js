const { createWriteStream } = require('fs')
const parseLumpyFile = require('./parseLumpyFile')
const DependenciesAssembler = require('./dependenciesAssembler')

const build = async (opt) => {
  const { cacheFolder, noCache } = opt
  // parse dependencies file
  const dependencies = await parseLumpyFile(opt.lumpyFile)
  // retrieve and assemble dependencies
  const depsAssembler = new DependenciesAssembler(dependencies, { cacheFolder, noCache })
  depsAssembler.pipe(createWriteStream(opt.destFile))
    .on('close', () => console.log('--- CLOSING FROM BUILD'))
  // depsAssembler.pipe(process.stdout)

  // TODO minify
  // TODO save or print to std
  return Promise.resolve('TODO')
}

module.exports = build
