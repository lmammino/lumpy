const { join, resolve } = require('path')
const { homedir } = require('os')
const { existsSync } = require('fs')
const rimraf = require('rimraf')

exports.command = 'clear-cache'

exports.aliases = ['cc']

exports.describe = 'Clear cache directory'

exports.builder = (yargs) =>
  yargs
    .option('cacheFolder', {
      describe: 'Specify a custom cache folder',
      alias: 'c',
      default: resolve(join(homedir(), '.lumpy-cache')),
      type: 'string'
    })

exports.handler = (opt) => {
  if (!existsSync(opt.cacheFolder)) {
    console.error(`Error: ${opt.cacheFolder} does not exist`)
    process.exit(1)
  }

  rimraf(join(opt.cacheFolder, '*'), (err) => {
    if (err) {
      console.error(`Error: ${err.toString()}`)
      process.exit(1)
    }
  })
}
