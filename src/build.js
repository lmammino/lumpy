const { createWriteStream } = require('fs')
const minify = require('babel-minify')
const intoStream = require('into-stream')
const streamAccumulator = require('./streamAccumulator')
const parseLumpyFile = require('./parseLumpyFile')
const DependenciesAssembler = require('./dependenciesAssembler')

const build = async (opt) => {
  const { cacheFolder, noCache } = opt

  // parse dependencies file
  const dependencies = await parseLumpyFile(opt.lumpyFile)

  // retrieve and assemble dependencies
  const depsAssembler = new DependenciesAssembler(dependencies, { cacheFolder, noCache })

  let assembledCodeStream = depsAssembler

  if (!opt.noMinify) {
    // to minify the stream needs to be accumulated in memory and then passed to the minifier
    const assembledCode = minify(await streamAccumulator.promise(depsAssembler)).code
    // recreates a stream with the minified output
    assembledCodeStream = intoStream(assembledCode)
  }

  // prints the output
  const destStream = opt.stdout ? process.stdout : createWriteStream(opt.destFile)

  assembledCodeStream
    .pipe(destStream)
}

module.exports = build
