# webpack 打包Vue



#### 1.导入Vue 包

+ 导入规则

  - 寻找项目中node_modules目录

  - 寻找node_modules中的vue目录

  - 在Vue中寻找package.json文件

  - 找打main属性，作为webpackage的入口

    :warning:但是`"main": "dist/vue.runtime.common.js",
      "module": "dist/vue.runtime.esm.js",`

  这是导入的是runtime.common.js文件不是最全的vue.js文件

+ 解决

  1. 在入口文件中导入时，之间使用路径进行导入

  2. 在webpack配置文件中，使用resolve规则进行解析

     ```javascript
     	//当解析到vue结尾的路径时，到该路径的dist目录下加载vue.js文件
     resolve:{
     		alias:{
     			vue$:"vue/dist/vue.js"
     		}
     	}
     ```

+ 在Vue中使用**render**函数

  + render 函数参数为一个createElement
  + 调用createElement函数，传递模板对象

  ```javascript
  var login={
  	template:`<h1>11</h1>`
  }
  var app=new Vue({
  	el:"#app",
  	data:{
  		meg:"dsadsadas"
  	},
  	render(a){
  		return(a(login))
  
  	}
  })
  ```

  **render**函数调用时，会清空Vue的挂载对象，将login模板进行渲染

```
	<div id="app">  --------
		{{meg}}		--------<h1>111</h1>
	</div>			--------
```

