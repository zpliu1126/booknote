# 基于Webpack进行Vue开发

使用Vue-loader进行打包，将组件文件命名成vue结尾的文件

### 1.安装插件

+ vue-loader

+ vue-template-compiler 

+ "babel-loader": "^7.1.5"

+ vue-style-loader

+ "babel-core"

+ babel-preset-es2015

  `npm i -D `

参考 https://vue-loader.vuejs.org/zh/guide/#vue-cli



### 2.webpack中配置插件

+ 使用VueLoadPlugin 插件
+ 定制loader规则
+ 引用插件

```javascript
//webpack需要xue插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
//定制规则和引用插件
	module:{
		rules:[
			{
				test:/\.css$/,
				use:[
				{loader:'vue-style-loader'},
				{loader:'css-loader'}
				]
			},
			{test:/\.(jpg|png|gif|jpeg)$/,use: 'url-loader?limit=102400&name=[name].[ext]'},
			{test:/\.vue$/,use:'vue-loader'},
			{test:/\.js$/,use:'babel-loader'}
		]
	},
	plugins:[
		new VueLoaderPlugin()
	],
```





### 3.组件文件格式

+ template 标签内部放置模板

+ scripte 标签内部进行Vue组件的定义

+ stytle 标签内进行样式的定义

  》》》》在定义样式后报错了《《《《

  ```javascript
  RROR in /var/www/html/node/VueTest/node_modules/vue-style-loader/lib/listToStyles.js
  Module build failed (from /var/www/html/node/VueTest/node_modules/babel-loader/lib/index.js):
  ReferenceError: Unknown plugin "transform-es2015-modules-commonjs" specified in "/var/www/html/node/VueTest/node_modules/vue-style-loader/.babelrc" at 0, attempted to resolve relative to "/var/www/html/node/VueTest/node_modules/vue-style-loader"
  ```

  **原来是少了一个包 babel-preset-es2015**



+ 定义好的组件文件

```javascript
<template>
	<p>{{name}}</p>
</template>

<script>
	export default { //这里通过export default 进行导出
		data() {
			return {
				name: "111"
			}
		}
	}
</script>

<style>
p{
		color: red;
	}
	
</style>
```

+ 在入口文件中使用组件文件

  ```javascript
  //Vue 入口文件
  import Vue from 'vue'
  
  import Component22  from './index.vue'
  // 将html 页面中的入口标签替换
  var template=`<div> 
  <Component22></Component22>
  </div>`
  var app=new Vue({
  	el:"#app",
  	template:template,
  	components:{ //挂载组件
  		Component22
  	}
  })
  ```

+ export default 与export 

  **在Vue组件中一般使用export default {} 进行导出；但是也可以使用export var 变量名='' 进行导出**

  导出的变量使用import进行引用

  ```javascript
  import Component22, {title as title1} from './index.vue'
  ```

  **export default导出的对象在接收时，可以取任意名字，而export var 变量名导出的对象则必须取一样的名字，但是可以使用as选项将导出的名字进行修改**



































