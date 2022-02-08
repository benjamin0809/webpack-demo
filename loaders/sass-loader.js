/**
 * todo loader 必须有返回值，是string或者是buffer
 * todo loader本质是一个函数，但是不能是一个箭头函数
 * todo loader在webpack中给我们提供了很多的API，可以看看
 * todo this.callBack()这个是loader中的API，
 * todo sass--->css
 */
 let sass = require('node-sass'); 
 module.exports = function(source){
     console.log('通过自定义的sass-loader');//todo 这就是当前的入口文件中的所有内容
     const result = sass.renderSync({
         data:source
     });//这是sass文件中处理后返回给我们一个.css文件
     return result.css;
 }
 //! 这是less-loader处理的
 // const less = require("less");
 // module.exports = function (source) {
 //   less.render(source, (e, output) => {//方法是less文件中自带的
 //     this.callback(e, output.css);//this.callBack是loader中的API，返回多个值
 
 //   });
 // };