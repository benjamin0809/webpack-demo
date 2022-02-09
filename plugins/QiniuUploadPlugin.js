const { sources } = require("webpack");
const Qiniu = require("./qiniu");
class QiniuUploadPlugin {
  constructor(options = {}) {
    this.options = options;
    this.QN_Instance = new Qiniu(options);
    if (!options.accessKey) {
      throw `accessKey is must not empty!`;
    }

    if (!options.secretKey) {
      throw `secretKey is must not empty!`;
    }

    if (!options.bucket) {
      throw `bucket is must not empty!`;
    }

    if (!options.publicBucketDomain) {
      throw `publicBucketDomain is must not empty!`;
    }
  }
  apply(compiler) {
    compiler.hooks.assetEmitted.tap(
      "QiniuUploadPlugin",
      (file, { content, source, outputPath, compilation, targetPath }) => {
        // content
        // console.log(file, { source, outputPath, compilation, targetPath });
        if (file.endsWith(".js") || file.endsWith(".css")) {
          this.QN_Instance.put(content, file).then(console.log);
        }
        //   compilation.hooks.processAssets.tap(
        //     {
        //       name: "QiniuUploadPlugin",
        //       stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS,
        //     },
        //     (assets) => {
        //       console.log("List of assets and their sizes:");
        //       Object.entries(assets).forEach(([pathname, source]) => {
        //         console.log(`— ${pathname}: ${source.size()} bytes`);
        //       });
        //       for (const name in assets) {
        //         // 只对main.js做处理
        //         if (name.endsWith(".js") || name.endsWith(".css")) {
        //           if (Object.hasOwnProperty.call(assets, name)) {
        //             const asset = compilation.getAsset(name);
        //             const contents = asset.source.source();
        //             this.QN_Instance.put(Buffer.from(contents), name).then(
        //               console.log
        //             );
        //           }
        //         }
        //       }
        //     }
        //   );
      }
    );
  }
}

module.exports = QiniuUploadPlugin;
