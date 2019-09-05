# 在项目中使用v-router

### 1.加载路由组件

在main.js入口文件中为Vue挂载路由组件

```javascript
import VueRouter from 'vue-router'

//挂载路由
Vue.use(VueRouter)

//加载路由组件

import router from './routes.js'
```

### 3.路由文件的定义

+ 导入vue-router 插件
+ 从components文件夹中导入子组件
+ 定义路由对象
+ 使用`export default` 将路由对象发送出去

```javascript
//导入路由插件
import VueRouter from 'vue-router'

import login from './components/login.vue'
import register from './components/register.vue'

const router=new VueRouter({
	routes:[
	{path:'/login',component:login},
	{path:'/register',component:register}
	]
})

export default router
```



### 4. 挂载路由

在main.js入口文件中为Vue实例对象挂载路由对象

`new Vue({ router:router})`