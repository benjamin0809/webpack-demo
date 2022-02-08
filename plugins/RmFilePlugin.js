const path = require('path')
const fs = require('fs')

class RmFilePlugin {
    constructor(options = {}) {
        // 插件的配置参数
        this.options = options
    }

    // webpack 会自动调用插件的apply方法，并给这个方法传入compiler参数
    apply(compiler) {
        // 拿到webpack的所有配置
        const webpackOptions = compiler.options
        // context 为webpack的执行环境（执行文件夹路径）
        const { context } = webpackOptions
        // 在compiler对象的beforeRun钩子上注册事件
        // 更多钩子请参阅 https://webpack.docschina.org/api/compiler-hooks/
        compiler.hooks.beforeRun.tap('RmFilePlugin', (compiler) => {
            // 获取打包输出路径，（默认dist目录）
            const outputPath = webpackOptions.output.path || path.resolve(context, 'dist')
            const fileList = fs.readdirSync(outputPath, {
                withFileTypes: true
            })
            fileList.forEach(item => {
                // 只删除文件，不对文件夹做递归删除，简化逻辑
                if(item.isFile()) {
                    const delPath = path.resolve(outputPath, item.name)
                    console.log('删除文件===》',delPath)
                    fs.unlinkSync(delPath)
                }
            })
        })
    }
}

module.exports = RmFilePlugin