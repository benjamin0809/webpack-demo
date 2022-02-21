const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const RmFilePlugin = require("./plugins/RmFilePlugin");
const DelCommentPlugin = require("./plugins/DelCommentPlugin");
const QiniuUploadPlugin = require("./plugins/QiniuUploadPlugin");

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin') 
const QiNiuUploadPlug = require('qiniu-upload-webpack-plugin')

const propPlugins = process.env.NODE_ENV === 'prod' ?
    [
    //     new QiniuUploadPlugin({
    //   accessKey : 'jfxJjeElvLIUgldn-O6mFQrSL4x4WTbZNRSkxEWZP',
    //   secretKey : 'hCxKrvlFocCyjeP0WQ-gJerutHlb-_gG86-iUJ8S-',
    //   bucket : 'benjamin0809-cdn',
    //   publicBucketDomain: 'https://cdn.popochiu.com'
    // }),
    // new QiNiuUploadPlug({
    //     host: 'https://cdn.popochiu.com',  // cdn域名 必填
    //     dirname: "webpack", // 项目前缀 必填
    //     bk: 'benjamin0809-cdn', // 七牛云bucket 必填
    //     ak: 'jfxJjeElvLIUgldn-O6mFQrSL4x4WTbZNRSkxEWZP', // 七牛云登陆 ak 必填
    //     sk: 'hCxKrvlFocCyjeP0WQ-gJerutHlb-_gG86-iUJ8S-', // 七牛云登陆 sk 必填
    //     limit: 100, // 超过100字节的文件才上传 默认100
    //     mimeType: [".jpg", ".png", ".gif", ".svg", ".webp"], // 上传的文件后缀（public模式无效）
    //     excludeType: [".html", ".json", ".map"], // 不上传的文件后缀
    //     zone: 'Zone_z2', // 储存机房 Zone_z0华东 Zone_z1华北 Zone_z2华南 Zone_na0北美
    //     includes: "/", // 筛选包含的路径
    //     excludes: [], // 排除的路径
    //     maxFile: 100, // 单次最大上传数量
    //     increment: true, // 是否是增量上传，默认为true，非增量上传时会删除云端dirname下旧的无用文件
    //     execution: true, // 是否开启插件，默认情况下只有production环境执行插件上传任务
    //     mode: "public" // 模式 public为上传全部资源，会替换掉项目的publicPath
    // })
  
  ] : [];
const config = {
  mode: "development",
  entry: { index: "./src/index.js", main: "./src/main.js" },
  output: {
    clean: true,
    filename: "[name].[contenthash].js",
    path: path.join(__dirname, "dist"),
    // publicPath: 'https://cdn.popochiu.com/',
  },
//   devtool: "source-map",
  devServer: {
    static: path.resolve(__dirname, "public"),
    compress: true,
    port: 8080,
    open: true,
  },
  resolve: {
    extensions: [".js", ".json", ".ts"],
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        vendor1: { // 主要模块
          chunks: 'all',
          test: /[\\/]node_modules[\\/](moment|vue|react|react-dom|antd)[\\/]/,
          name: 'vendor1',
          maxAsyncRequests: 5,
          priority: 10,
          enforce: true,
        },
        vendor2: { // 次要模块
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor2',
          maxAsyncRequests: 5,
          priority: 9,
          enforce: true,
          reuseExistingChunk: true,
        },
        commons: {
          chunks: 'all',
          name: "chunk-common",
          test: /[\\/]src\/common[\\/]/,
          minChunks: 2,
          priority: 8, 
          enforce: true,
          reuseExistingChunk: true,
        },
      },
    },
    // splitChunks: {
    //   chunks: "all",
    //   cacheGroups: {
    //     vendors: {
    //       name: "chunk-vendors",
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: -10,
    //       chunks: "all",
    //     },
    //     commons: {
    //       name: "chunk-common",
    //       //   test: /[\\/]src\/common[\\/]/,
    //       minChunks: 2,
    //       priority: -20,
    //       chunks: "all",
    //       reuseExistingChunk: true,
    //     },
    //   },
    // },
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: { 
    rules: [
      // {
      //   test: /\.ts$/,
      //   exclude: /node_modules/,
      //   use: "esbuild-loader",
      // },
      {
        test: /\.(s[ac]|c)ss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        exclude: /node_modules/,
        type: "asset",
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: "[name][hash:8][ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024, //超过50kb不转 base64
          },
        },
      },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: [
          // {
          //   loader: "thread-loader",
          //   options: {
          //     workers: 8,
          //   },
          // },
          {
            loader: "swc-loader", 
            options: {
              // presets: ["@babel/preset-env"],
            },
          },
          //   {
          //     loader: "replace-loader",
          //     options: {
          //       // 通过配置传入words来替换NAME为wei
          //       words: "Benjamin Chiu",
          //     },
          //   },
        ],
      },
    ],
  },// const accessKey = 'jfxJjeElvLIUgldn-OmFQrSL4x4WTbZNRSkxEWZP';
  // const secretKey = 'hCxKrvlFocCyjeP0WQ-gJerutHlb-_gG8-iUJ8S-';
  // const bucket = 'benjamin0809-cdn';
  plugins: [ 
    // new DelCommentPlugin(),
    // new RmFilePlugin(),
    new MomentLocalesPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[hash:8].css",
    }),
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    
    new BundleAnalyzerPlugin()
  ].concat(propPlugins),
    resolveLoader: {
      modules: ["loaders", "node_modules"],
    },
};

module.exports = (env, argv) => {
  console.log("argv.mode=", argv.mode);
  return config;
};
