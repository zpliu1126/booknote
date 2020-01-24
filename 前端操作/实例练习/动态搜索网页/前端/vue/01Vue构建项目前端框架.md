# Vue 构建前端框架

### 1.安装

```bash
npm install vue --save 
```



### 2.基于webpack进行Vue开发

这里有一系列的插件要安装可以参考之前写的

+ webpack中的配置
+ `contentBase`参数是指定热重载的位置

```bash
ar path=require("path")
const VueLoaderPlugin = require(path.join(__dirname,'node_modules/vue-loader/lib/plugin'))
module.exports={
  entry: path.join(__dirname,"/src/main.js"),

  output:{
      path:path.join(__dirname,"/public"),
      filename:"bundle.js"
  },
  resolve:{
    alias:{
        vue$:path.join(__dirname,"/node_modules/vue/dist/vue.js")
    }
  },
  module:{
    rules:[
      {
        test:/\.vue$/,
        loader:'vue-loader'
      },
      {
        test:/\.js$/,loader:'babel-loader'
      },{
        test:/\.css$/,
        use:[{loader:'vue-style-loader'},{loader: 'css-loader'}]
      },
    ]
  },

  plugins:[
    new VueLoaderPlugin()
  ],
  mode: 'development',
  devServer:{
    port:81,
		host:'0.0.0.0',
		disableHostCheck: true,
		contentBase:path.join(__dirname,"/views"), //热重载模式下根文件
		hot:true
  }
}
```

### 3.`main.js`文件中加载前端所需的各种组件和插件

+ 也可以直接使用`render`函数渲染模板

```bash
import Vue from 'vue'
import App from "./App.vue"

var template=`<App></App>`
var app=new Vue({
  el:"#app",
  data:{'a':1},
  template:template,
  components:{
    'App':App,
  }
})
```



### 3.`App.vue`当做项目的根组件

+ 在`template`标签内只能有一个共同的父标签

```bash
<template>
  <div class="content">{{name}}</div>
</template>

<script>
  export default{
    data() {
      return {
        name:"zpliu"
      }
    },
  }
</script>
<style>

</style>
```



### 前端页面购建

+ Vue框架搭建好之后，使用web-dev-server进行实时页面更新
+ 前端在`81`端口进行测试
+ 后端接口仍旧在`80`接口进行测试
+ 之后使用webpack打包好之后，直接上线就行

**浏览器访问127.0.0.1:81`**

**接口访问`127.0.0.1:80`**

### 参考

1.  https://zpliu.gitbook.io/booknote/webpack/05vue-zu-jian-kai-fa 