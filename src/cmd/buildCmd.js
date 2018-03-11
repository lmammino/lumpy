const { join, resolve } = require('path')
const { homedir } = require('os')
const build = require('../build')

exports.command = 'build [destFile]'

exports.aliases = ['b']

exports.describe = 'Build a vendor.js by combining the files in the current folder lumpy.txt'

exports.builder = (yargs) =>
  yargs
    .positional('destFile', {
      describe: 'The destination file',
      default: resolve(join(process.cwd(), 'vendors.js')),
      type: 'string'
    })
    .option('lumpyFile', {
      describe: 'The source lumpy file to use',
      alias: 'l',
      default: resolve(join(process.cwd(), 'lumpy.txt')),
      type: 'string'
    })
    .option('cacheFolder', {
      describe: 'Specify a custom cache folder',
      alias: 'c',
      default: resolve(join(homedir(), '.lumpy-cache')),
      type: 'string'
    })
    .option('noMinify', {
      describe: 'If set, does not minify the resulting file',
      alias: 'M',
      default: false,
      type: 'boolean'
    })
    .option('noCache', {
      describe: 'If set, does not use the cache',
      alias: 'C',
      default: false,
      type: 'boolean'
    })
    .option('stdout', {
      describe: 'If set, print the result in the standard output instead of saving to a file',
      alias: 'o',
      default: false,
      type: 'boolean'
    })

exports.handler = async (argv) => {
  await build(argv)
}
