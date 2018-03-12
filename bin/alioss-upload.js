#!/usr/bin/env node

const argv = require('yargs')
  .option('config', {
    describe: 'set your alioss config path',
    type: 'string',
  })
  .option('path', {
    describe: 'set your upload files path',
    type: 'string',
  })
  .help()
  .argv;

require('../lib/upload')({
  config: argv.config,
  baseDir: argv.path,
});
