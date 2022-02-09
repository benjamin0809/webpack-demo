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

const config = {
  mode: "development",
  entry: { index: "./src/index.js", main: "./src/main.js" },
  output: {
    // clean: true,
    filename: "[name].[contenthash].js",
    path: path.join(__dirname, "dist"),
    publicPath: 'https://cdn.popochiu.com/',
  },
  devtool: "source-map",
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
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          name: "chunk-vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "all",
        },
        commons: {
          name: "chunk-common",
          //   test: /[\\/]src\/common[\\/]/,
          minChunks: 2,
          priority: -20,
          chunks: "all",
          reuseExistingChunk: true,
        },
      },
    },
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "esbuild-loader",
      },
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
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
      new QiniuUploadPlugin({
        accessKey : 'jfxJjeElvLIUgldn-OmFQrSL4x4WTbZNRSkxEWZP',
        secretKey : 'hCxKrvlFocCyjeP0WQ-gJerutHlb-_gG8-iUJ8S-',
        bucket : 'benjamin0809-cdn',
        publicBucketDomain: 'https://cdn.popochiu.com'
      }),
    new DelCommentPlugin(),
    new RmFilePlugin(),
    new MomentLocalesPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[hash:8].css",
    }),
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    // new BundleAnalyzerPlugin()
  ],
    resolveLoader: {
      modules: ["loaders", "node_modules"],
    },
};

module.exports = (env, argv) => {
  console.log("argv.mode=", argv.mode);
  return config;
};
