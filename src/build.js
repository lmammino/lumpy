const { createWriteStream } = require('fs')
const uglify = require('uglify-stream')
const parseLumpyFile = require('./parseLumpyFile')
const DependenciesAssembler = require('./dependenciesAssembler')

const build = async (opt) => {
  const { cacheFolder, noCache } = opt
  // parse dependencies file
  const dependencies = await parseLumpyFile(opt.lumpyFile)
  // retrieve and assemble dependencies
  const depsAssembler = new DependenciesAssembler(dependencies, { cacheFolder, noCache })
  const destStream = opt.stdout ? process.stdout : createWriteStream(opt.destFile)

  // TODO use pump for proper error management
  depsAssembler
    .pipe(uglify())
    .on('error', console.error)
    .pipe(destStream)
    .on('close', () => console.log('--- CLOSING FROM BUILD'))

  // TODO disable minify
  // TODO uglify

  return Promise.resolve('TODO')
}

module.exports = build
