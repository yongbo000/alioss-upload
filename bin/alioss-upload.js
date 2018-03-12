#!/usr/bin/env node

const argv = require('yargs')
  .option('c', {
    describe: 'set your alioss config path',
    type: 'string',
    alias: 'config',
  })
  .option('p', {
    describe: 'set your upload files path',
    type: 'string',
    alias: 'path',
  })
  .help()
  .argv;

require('../lib/upload')({
  config: argv.config,
  baseDir: argv.path,
});
