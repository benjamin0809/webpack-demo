/*
 * @Author: your name
 * @Date: 2021-12-19 23:06:05
 * @LastEditTime: 2021-12-21 00:09:12
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \hupu-spider\src\utils\qiniu.ts
 */
const qiniu = require("qiniu");
// const ora = require('ora');
// const accessKey = 'jfxJjeElvLIUgldn-OmFQrSL4x4WTbZNRSkxEWZP';
// const secretKey = 'hCxKrvlFocCyjeP0WQ-gJerutHlb-_gG8-iUJ8S-';
// const bucket = 'benjamin0809-cdn';

// const publicBucketDomain = 'https://cdn.popochiu.com';

// const formUploader = new qiniu.form_up.FormUploader(config);
// const bucketManager = new qiniu.rs.BucketManager(mac, config);
// const putExtra = new qiniu.form_up.PutExtra();
class Qiniu {
  formUploader;
  bucketManager;
  putExtra;
  token;
  publicBucketDomain;
  bucket;
  constructor(options = {}) {
    if (!options.accessKey) {
      console.warn(`accessKey is must not empty!`);
    }

    if (!options.secretKey) {
      console.warn(`secretKey is must not empty!`);
    }

    if (!options.bucket) {
      console.warn(`bucket is must not empty!`);
    }

    if (!options.publicBucketDomain) {
      console.warn(`publicBucketDomain is must not empty!`);
    }
    this.bucket = options.bucket;
    this.publicBucketDomain = options.publicBucketDomain;

    const mac = new qiniu.auth.digest.Mac(options.accessKey, options.secretKey);
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: options.bucket,
    });

    const config = new qiniu.conf.Config({
      // 空间对应的机房
      zone: qiniu.zone.Zone_z2,
    });

    this.formUploader = new qiniu.form_up.FormUploader(config);
    this.bucketManager = new qiniu.rs.BucketManager(mac, config);
    this.putExtra = new qiniu.form_up.PutExtra();
    this.token = putPolicy.uploadToken(mac);
  }

  /**
   * 上传文件流 数据流上传（表单方式
   * @param {*} readableStream 文件流
   * @param {*} filename 文件名
   */
  putStream(readableStream, filename) {
    return new Promise((resolve, reject) => {
      this.formUploader.putStream(
        this.token,
        filename,
        readableStream,
        this.putExtra,
        async function (respErr, respBody, respInfo) {
          if (respErr) {
            reject(respErr);
            throw respErr;
          }
          if (respInfo.statusCode == 200) {
            resolve({
              hash: respBody.hash,
              key: respBody.key,
              url: await this.bucketManager.publicDownloadUrl(
                this.publicBucketDomain,
                filename
              ),
            });
          } else {
            console.error(respBody);
            reject(respBody);
          }
        }
      );
    });
  }

  /**
   * 字节数组上传（表单方式）
   * @param {*} data 字节
   * @param {*} filename 文件名
   */
  put(data, filename) {
     // 文件上传
    //  const spinner = ora(`上传文件${filename}...`).start();
    return new Promise((resolve, reject) => {
      this.formUploader.put(
        this.token,
        filename,
        data,
        this.putExtra,
        async  (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
            // spinner.fail(`文件：${key}，上传失败！`);
            throw respErr;
          }
          if (respInfo.statusCode == 200) {
            resolve({
              hash: respBody.hash,
              key: respBody.key,
              url: await this.bucketManager.publicDownloadUrl(
                this.publicBucketDomain,
                filename
              ),
            });
            // spinner.succeed(`文件：${key}，上传成功！`);
          } else {
            console.error(respBody);
            // spinner.fail(`文件：${key}，上传失败！`);
            reject(respBody);
          }
        }
      );
    });
  }

  /**
   * 上传本地文件到七牛云
   * @param filename 文件名称
   * @param localFile 本地文件路径
   * @returns 哈哈哈哈
   */
  uploadFile(filename, localFile) {
    return new Promise((resolve, reject) => {
      // 文件上传
      this.formUploader.putFile(
        this.token,
        filename,
        localFile,
        this.putExtra,
        async function (respErr, respBody, respInfo) {
          if (respErr) {
            console.error(respErr);
            reject(respErr);
          }
          if (respInfo.statusCode == 200) {
            resolve({
              hash: respBody.hash,
              key: respBody.key,
              url: await this.bucketManager.publicDownloadUrl(
                this.publicBucketDomain,
                respBody.key
              ),
            });
          } else {
            reject(respBody);
            console.error(respBody);
          }
        }
      );
    });
  }

  /**
   * 抓取网络资源后，上传到七牛云
   * @param resUrl 资源路径
   * @param key 七牛key（文件名）
   * @returns 七牛资源
   */
  fetchWebUrlPlus(resUrl, key) {
    return new Promise((resolve, reject) => {
      this.bucketManager.fetch(
        resUrl,
        this.bucket,
        key,
        async (err, respBody, respInfo) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            if (respInfo.statusCode == 200) {
              resolve({
                hash: respBody.hash,
                key: respBody.key,
                url: await this.bucketManager.publicDownloadUrl(
                  this.publicBucketDomain,
                  key
                ),
              });
            } else {
              reject(respBody);
              console.error(respBody);
            }
          }
        }
      );
    });
  }

  /**
   * 根据key获取七牛云资源链接
   * @param key keyName
   * @returns URL
   */
  getPublicDownloadUrl(key) {
    return this.bucketManager.publicDownloadUrl(this.publicBucketDomain, key);
  }
}

module.exports = Qiniu;
