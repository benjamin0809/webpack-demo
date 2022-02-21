/*
 * @Author: your name
 * @Date: 2022-02-09 19:21:53
 * @LastEditTime: 2022-02-09 22:37:49
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \webpack-demo\plugins\QiniuUploadPlugin.js
 */


const pluginName = "QiniuUploadPlugin";
const printHook = (compiler, hook) => {
    compiler.hooks[hook].tap(pluginName, (compilation) => {
        console.log(`webpack 构建正在${hook}！`);
      });
}

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
    compiler.hooks.emit.tap("QiniuUploadPlugin", () => {
      console.log('emit')
    })
    Object.keys(compiler.hooks).forEach((key) => {
            printHook(compiler, key)
        })  
    
    compiler.hooks.assetEmitted.tap(
      "QiniuUploadPlugin",
      (file, { content, source, outputPath, compilation, targetPath }) => {
        // content
        // console.log(file, { source, outputPath, compilation, targetPath });
        console.log('开始上传文件')
        if (!file.endsWith(".html")) {
          this.QN_Instance.put(content, file);
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
    compiler.hooks.done.tap("QiniuUploadPlugin", () => {
        console.log('done')
      })
  }
}

module.exports = QiniuUploadPlugin;
