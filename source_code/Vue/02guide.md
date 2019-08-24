+ ### 安装

  在html文件使用script引用Vue库文件

  ```html
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  压缩版
  <script src="https://cdn.jsdelivr.net/npm/vue"></script>
  ```

  

+ ### 声明式渲染

  + 首先声明DOM对象和对应的HTML字符串
  + 使用el获取对应的DOM对象，data中存储了关于DOM对象的数据，修改DOM对象的message就能动态的修改DOM中的值

  ```javascript
  <div id="app">{{message}}</div>
  
  var app=new Vue({
      el:"app",
      data:{
          message:"hello Vue!"
      }
  })
  ```

+ ### 动态的修改属性

  + 使用v-bind指令绑定值到title属性中
  + 在Vue对象中修改message属性则对应DOM中的title属性发生改变

  ```javascript
  <div id="app-2">
    <span v-bind:title="message">
      鼠标悬停几秒钟查看此处动态绑定的提示信息！
    </span>
  </div>
  var app2 = new Vue({
    el: '#app-2',
    data: {
      message: '页面加载于 ' + new Date().toLocaleString()
    }
  })
  ```

+ ### 条件与循环

  + v-if=true|false 指令能够动态的移除或者更新DOM结构

  + v-for="value in todos" ,获取单条数据然后，使用类似模板语法将对应的数据取出

    ```javascript
     <li v-for="todo in todos">
          {{ todo.text }}
     </li>
    ```

+ ### 处理用户输入

  + v-on:click="函数" ,绑定点击事件,对应的时间函数在methods属性中声明
  
    ```javascript
    <button type="" v-on:click="reverseMesage">反转消息</button>
    	var app=new Vue(
    	{
    		methods:{
    			reverseMesage:function(){
    				this.message=this.message.split('').reverse().join('')
    
    
    			}
    		}
    	})
    ```
  
+ ### 组件化

  + 使用component函数注册组件
  + props属性声明组件中属性

  ```javascript
  	Vue.component("todo-item",{
  		props:["todo"],
  		template:"<li>{{todo.text}}</li>"
  	})
  	Vue.component("to-item2",{
          props:["todos"],
          template:"<input>"
      })
  //在组件上将DOM组件化
  <div>
  <todo-item v-for="item in somethings" v-bind:todo="item" v-bind:key="item.id"></todo-item>
  <to-item2></to-item2>
  </div>
  ```

  > 通过组件化，能够将DOM进行组件化，将组件写入文件之间使用有利于代码维护

  ```javascript
  <div id="app">
    <app-nav></app-nav>
    <app-view>
      <app-sidebar></app-sidebar>
      <app-content></app-content>
    </app-view>
  </div>
  ```

  

  

