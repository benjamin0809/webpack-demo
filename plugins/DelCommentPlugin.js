const { sources } = require("webpack");

class DelCommentPlugin {
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap("DelCommentPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "DelCommentPlugin",
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS,
        },
        (assets) => {
          for (const name in assets) {
            // 只对main.js做处理
            if (name.endsWith(".js") && /main.\w+.js/.test(name)) {
              if (Object.hasOwnProperty.call(assets, name)) {
                const asset = compilation.getAsset(name);
                const contents = asset.source.source();
                // console.log('before contents:', contents)
                const result = contents.replace(/\/\/.*/g, "").replace(/\/\*.*?\*\//g, "");//删除注释
                // console.log('after remove comment contents:', result)
                compilation.updateAsset(name, new sources.RawSource(result));
              }
            }
          }
        }
      );
    });

    compiler.hooks.initialize.tap("DelCommentPlugin", (compilation) => {
        console.log('初始化插件》》DelCommentPlugin')
    })

    compiler.hooks.run.tap("DelCommentPlugin", (compilation) => {
        console.log('run插件》》DelCommentPlugin')
    })
  }
}

module.exports = DelCommentPlugin;
