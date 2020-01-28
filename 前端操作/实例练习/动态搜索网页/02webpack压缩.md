## 解决webpack打包后文件过大问题

### 1.剥离CSS

` DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead`

```bash
## 安装插件
npm install extract-text-webpack-plugin@next
## webpack中配置插件
const ExtractTextPlugin=require("extract-text-webpack-plugin")
test:/\.css$/,
        use:ExtractTextPlugin.extract({
          fallback: "vue-style-loader",
          use: "css-loader"
        })
plugins:[
    new ExtractTextPlugin("styles.css"),

  ],
```

### 2.js代码压缩

```bash
## 安装插件
npm install uglifyjs-webpack-plugin --save-dev
## webpack中配置
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') 
plugins:[
   new UglifyJsPlugin({
      parallel: 4,
      uglifyOptions: {
          output: {
              comments: false,
              beautify: false,
          }, 
      },
      sourceMap:false,
      cache: true,
  }),]
```

### 3.gzip压缩

```bash
## 安装插件
npm install compression-webpack-plugin --save-dev
const CompressionPlugin = require('compression-webpack-plugin')
new CompressionPlugin({
    // asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: new RegExp(
      '\\.(js)$' 
    ),
    threshold: 10240,
    minRatio: 0.8}),
```



### 4.生产模式打包

```bash
const webpack = require('webpack');
new webpack.DefinePlugin({
      "process.env":{
        NODE_ENV:JSON.stringify('production')
       }
    })
```



### 参考

1. css 剥离https://blog.csdn.net/u011215669/article/details/81269386 
2. webpack 压缩过大 https://juejin.im/post/5a9d17446fb9a028d374e733 
3. gzip 压缩  https://blog.csdn.net/abcde158308/article/details/94465771 