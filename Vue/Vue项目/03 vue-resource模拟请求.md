# 使用vue-resource进行ajax请求

> 关于请求时的跨域问题

在node.js 服务端设定响应头为

`rep.header("Access-Control-Allow-Origin", "*"); //处理跨域请求`

### 1. vue-resource插件引入

在入口文件中引入和挂载vue-resource插件

```javascript
//加载viu-resource组件
import VueResource from 'vue-resource'

Vue.use(VueResource)
```

### 2. 在组件中进行ajax请求

####  2.1 定义一个ajax请求的方法

在进行ajax请求时，根据官方文档https://github.com/pagekit/vue-resource/blob/develop/docs/http.md，进行配置

+ **请求只有成功与失败，失败是获取不到响应对象的只能在客户端做出响应**
+ 数据请求成功后将数据赋值给对应的数据变量，交给组件进行渲染



#### 2.2 组件被创建时发起ajax请求

```javascript
methods: {
			getList() {
				this.$http.get('http://www.zpliublog.club:8080/API').then(reponse =>{
						this.requsetToast.close()
						this.datalist=reponse.body
						console.log(reponse)
					
				},response => {
				// error callback
				this.requsetToast.close()
				Toast({
				  message: '服务器开小差啦！',
				  position: 'middle',
				  duration: 4000
				});
			})
			}
		},
		created:function(){
			this.requsetToast=Toast({
			  message: '正在请求数据',
			  position: 'middle',
			  duration: -1
			});
			this.getList()
		}
```



### 3.提示插件toast的使用

由于Toast插件属于**js components** 因此在组件中还需要引用对应的js函数

`import { Toast } from 'mint-ui';`

**Toast函数**的调用会返回一个对象，它可以通过close方法将Toast提示框进行关闭



### 3. vue-resource全局配置

`Vue.http.options.root = '/root';`

之后再使用vue-resource去请求资源时不用写头部冗余的信息了

`this.$http.get('http://www.zpliublog.club:8080/API')`

等同于 **最前面不用加路径符号**

```javascript
Vue.http.options.root = '/root';
this.$http.get('API')
```



