# 基于webpack的路由操作

### 1.引入vue-router

```javascript
//Vue 入口文件
import Vue from 'vue'

//导入路由插件
import VueRouter from 'vue-router'

Vue.use(VueRouter)
//导入组件
```



### 2.定义路由对象

```javascript
//导入定义好的组件
import Component22, {title as title1} from './components/index.vue'
//定义router对象和路径
const router=new VueRouter({
	routes:[
	{path:'/login',component:Component22} //使用上一步导入的组件

	]
})
```

### 3.路由挂载到Vue实例对象上

```javascript
//将实例对象的模板重新封装
var template=`<div> 
<Component22></Component22>
<router-link to="/login">Login</router-link>
<router-view></router-view>
</div>`
var app=new Vue({
	el:"#app",
	template:template,
	components:{
		Component22
	},
	router:router
})
```

