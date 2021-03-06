# alioss-upload

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/alioss-upload.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alioss-upload
[travis-image]: https://img.shields.io/travis/yongbo000/alioss-upload.svg?style=flat-square
[travis-url]: https://travis-ci.org/yongbo000/alioss-upload
[codecov-image]: https://img.shields.io/codecov/c/github/yongbo000/alioss-upload.svg?style=flat-square
[codecov-url]: https://codecov.io/github/yongbo000/alioss-upload?branch=master
[download-image]: https://img.shields.io/npm/dm/alioss-upload.svg?style=flat-square
[download-url]: https://npmjs.org/package/alioss-upload

## 安装

```sh
npm i alioss-upload --save
```

## 使用

`package.json`

```json
{
  "script": {
    "upload": "alioss-upload -c {{configPathForOss}} -p {{sourceDir}}"
  }
}
```

`configPathForOss`: 配置文件路径(可不传，默认值: {process.cwd()}/.aliossrc)，内容如下

```json
{
  "region": "your region",
  "bucket": "your bucket",
  "bucketPath": "your bucketPath",
  "accessKeyId": "your accessKeyId",
  "accessKeySecret": "your accessKeySecret"
}
```

`sourceDir`: 静态资源目录，也可为当个文件路径 (可不传，默认值: {process.cwd()}/dist)