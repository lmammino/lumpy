const { createWriteStream } = require('fs')
const minify = require('babel-minify')
const streamAccumulator = require('./streamAccumulator')
const parseLumpyFile = require('./parseLumpyFile')
const DependenciesAssembler = require('./dependenciesAssembler')

const build = async (opt) => {
  const { cacheFolder, noCache } = opt

  // parse dependencies file
  const dependencies = await parseLumpyFile(opt.lumpyFile)

  // retrieve and assemble dependencies
  const depsAssembler = new DependenciesAssembler(dependencies, { cacheFolder, noCache })
  const assembledCode = await streamAccumulator.promise(depsAssembler)

  // minifies the output if needed
  const output = opt.noMinify ? assembledCode.toString() : minify(assembledCode.toString()).code

  // prints the output
  const destStream = opt.stdout ? process.stdout : createWriteStream(opt.destFile)
  destStream.write(output)
  if (!opt.stdout) {
    destStream.end()
  }
}

module.exports = build
