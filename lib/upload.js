const co = require('co');
const clc = require('cli-color');
const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');
const globby = require('globby');
const assert = require('assert');
const debug = require('debug')('alioss-upload');

module.exports = (opts = {}) => {
  const baseDir = opts.baseDir && path.resolve(opts.baseDir) || path.join(process.cwd(), 'dist');
  const configPath = opts.config && path.resolve(opts.config) || path.join(process.cwd(), '.aliossrc');

  if (!fs.existsSync(configPath)) {
    throw new Error(`${configPath} is not found`);
  }

  const ossConfig = JSON.parse(fs.readFileSync(configPath, {
    encoding: 'utf8',
  }));

  assert(ossConfig.region, `should region require in ${configPath}`);
  assert(ossConfig.accessKeyId, `should accessKeyId require in ${configPath}`);
  assert(ossConfig.accessKeySecret, `should accessKeySecret require in ${configPath}`);
  assert(ossConfig.bucket, `should bucket require in ${configPath}`);
  assert(ossConfig.bucketPath, `should bucketPath require in ${configPath}`);

  const client = new OSS({
    region: ossConfig.region,
    accessKeyId: ossConfig.accessKeyId,
    accessKeySecret: ossConfig.accessKeySecret,
    bucket: ossConfig.bucket,
  });

  let uploadFiles;
  if (fs.statSync(baseDir).isFile()) {
    uploadFiles = [ baseDir ];
  } else {
    uploadFiles = globby.sync([ '**/*.js', '**/*.css' ], { cwd: baseDir }).map(p => {
      return p;
    });
  }

  debug('uploadFiles => %j', uploadFiles);

  return co(function* () {
    const successFiles = [];
    for (const filename of uploadFiles) {
      const start = Date.now();
      const filePath = path.join(baseDir, filename);
      const stream = fs.createReadStream(filePath);
      const size = fs.statSync(filePath).size;
      const bucketPath = ossConfig.bucketPath + '/' + filename;
      try {
        const result = yield client.putStream(bucketPath, stream, {
          contentLength: size,
        });
        successFiles.push({
          name: result.name,
          url: result.url,
        });
        console.log(`${filename} was uploaded successfully, take ${Date.now() - start}ms`);
      } catch (e) {
        console.log(clc.red(`${filename} upload fail, message: ${e.message}`));
      }
    }
    console.log(clc.green(`all files finished upload, total: ${uploadFiles.length}, success: ${successFiles.length}, fail: ${uploadFiles.length - successFiles.length}`));
    return successFiles;
  }).catch(e => {
    assert.ifError(e);
  });
};
