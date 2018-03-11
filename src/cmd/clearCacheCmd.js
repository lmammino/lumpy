const { join, resolve } = require('path')
const { homedir } = require('os')

exports.command = 'clear-cache'

exports.aliases = ['cc']

exports.describe = 'Clear cache directory'

exports.builder = (yargs) =>
  yargs
    .option('lumpyFile', {
      alias: 'l',
      default: resolve(join(process.cwd(), 'lumpy.txt')),
      type: 'string'
    })
    .option('cacheFolder', {
      alias: 'c',
      default: resolve(join(homedir, '.lumpy-cache')),
      type: 'string'
    })
    .option('noMinify', {
      alias: 'M',
      default: false,
      type: 'boolean'
    })
    .option('noCache', {
      alias: 'C',
      default: false,
      type: 'boolean'
    })

exports.handler = (argv) => {

}
