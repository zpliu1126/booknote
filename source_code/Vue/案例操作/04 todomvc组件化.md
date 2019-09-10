# Vue组建化

![组建化思想](https://user-images.githubusercontent.com/39325949/63822191-25e1d780-c982-11e9-811b-264b4d1f3f10.png)



## 组件化构建思想

+	main.js是程序入口
+	app.js是程序的父组件，负责对数据进行处理同时将处理好的数据传递给子组件
+	各个子组件，收到数据后对视图进行渲染；但不能修改父组件的数据

![组件化思想](https://user-images.githubusercontent.com/39325949/63845891-52ffab80-c9bd-11e9-9dba-fbf1103da290.png)



## 对tomvc项目进行组件化

+ ### 数据的展示

  首先在子组件中定义好对应的属性用于接收父组件的数据，在子组件标签中显示的绑定对应的属性

  ```javascript
  <app-section 
  	:todos="filterTodos"></app-section>
  //子组件中声明对应的属性
  exports.appSection={
  		props:['todos','toggleAll']
  }
  ```

  

+ ### 事件的响应

  当子组件要对数据进行修改时，应该将需要修改的数据以及触发的动作通知父组件，从而在父组件层面对数据进行修改

  ```javascript
  //header 模板内容
  	const header_template=`<header >		
  			<h1 >todos</h1>
  			<input class="new-todo"  placeholder="What needs to be done?"  v-model="newtodo" @keyup.enter="@keyup.enter="heanderNewtodo"" @blur="@keyup.enter="heanderNewtodo"" >
  		</header>`
      
  //子组件中定义好新的数据变量，以及向上进行传递数据
      
   appheader={
  		props:['todos'],
  		data(){
  			return({
  				newtodo:''
  			})
  		},
  		template:header_template,
  		methods:{
  			heanderNewtodo(){
  				this.$emit('new-todos',this.newtodo) //传递数据给父组件
  				this.newtodo='' //将子组件输入框中内容清空
  			}
  		}
  	}
  ```

  

+ ### 监听子组件的事件修改父组件数据

  ```javascript
  //模板内容
  <app-header @new-todos="handerNewTodos($event)"
  	></app-header>
  //事件的处理
  		handerNewTodos(newtodo){
  			var value=newtodo && newtodo.trim()
  			if(!value){
  				return
  			}
  			this.todos.push({
  				id: this.todos.length ? this.todos[this.todos.length-1].id+1 : 1,
  				completed: false,
  				title:value
  			})
  			
  		}
  ```

  





