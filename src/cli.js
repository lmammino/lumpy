#!/usr/bin/env node

const yargs = require('yargs')
const buildCmd = require('./cmd/buildCmd')
const clearCacheCmd = require('./cmd/clearCacheCmd')

const argv = yargs
  .usage('$0 <cmd> [args]')
  .command(buildCmd)
  .command(clearCacheCmd)
  .epilogue('~ For more information, find our manual at https://github.com/lmammino/lumpy')
  .example('$0 build dist/vendors.min.js', 'Creates a build file in the build folder')
  .demandCommand(1, 'Invalid command. Use option "--help" for help')
  .showHelpOnFail(false, 'Specify --help for available options')
  .help()
  .version()
  .argv

if (!argv._) {
  process.exit(1)
}
