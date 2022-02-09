const Qiniu = require('./qiniu')
const options = {
    accessKey : 'jfxJjeElvLIUgldn-OmFQrSL4x4WTbZNRSkxEWZP',
    secretKey : 'hCxKrvlFocCyjeP0WQ-gJerutHlb-_gG8-iUJ8S-',
    bucket : 'benjamin0809-cdn',
    publicBucketDomain: 'https://cdn.popochiu.com'
  }
const QN_Instance = new Qiniu(options)

// QN_Instance.uploadFile('index.b50e2e7d.css', 'D:\\projects\\webpack\\webpack-basic\\dist')
// .then(console.log)
// .catch(console.error)


QN_Instance.put(Buffer.from('index.b50e2e7d.css'), 'test.txt')
.then(console.log)
.catch(console.error)