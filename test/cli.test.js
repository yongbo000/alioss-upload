const assert = require('assert');
// const coffee = require('coffee');
const fs = require('fs');
const path = require('path');
const OSS = require('ali-oss');
const sinon = require('sinon');

// const cliPath = require.resolve('../bin/alioss-upload');
const upload = require('../lib/upload');

describe('upload', () => {
  const cwd = path.join(__dirname, 'fixtures/app');
  before(() => {
    const configPath = path.join(cwd, '.aliossrc');
    const ossConfig = JSON.parse(fs.readFileSync(configPath, {
      encoding: 'utf8',
    }));
    sinon.stub(OSS.prototype, 'putStream').callsFake(function* (bucketPath) {
      assert([ 'index.js', 'index.css' ].map(p => `${ossConfig.bucketPath}/${p}`).indexOf(bucketPath) >= 0, 'should bucketPath right');
      return {
        name: bucketPath,
        url: `http://${ossConfig.bucket}.${ossConfig.region}.aliyuncs.com/${bucketPath}`,
      };
    });
  });
  it('上传成功', done => {
    upload({
      config: path.join(cwd, '.aliossrc'),
      baseDir: path.join(cwd, 'dist'),
    }).then(ret => {
      assert.deepEqual(ret, [
        {
          name: 'alioss/demo/index.js',
          url: 'http://your bucket.your region.aliyuncs.com/alioss/demo/index.js',
        },
        {
          name: 'alioss/demo/index.css',
          url: 'http://your bucket.your region.aliyuncs.com/alioss/demo/index.css',
        },
      ]);
      done();
    });
    // coffee.fork(cliPath, [], {
    //   cwd,
    // })
    //   .debug()
    //   .end(err => {
    //     assert.ifError(err);
    //     done();
    //   });
  });
});
