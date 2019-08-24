# todomvc实现日程安排

官方演示链接  http://todomvc.com/examples/vue/#/all

sublimer代码折叠 `ctrl +shift+{`

取消折叠  `ctrl +shift+}`

### 1.启动案例

 + clone仓库

   ```bash
   
   ```
   
+ Vue代码模块化

  ```javascript
  //定义vue实例挂载到window对象的app属性
  //匿名函数 自调用
  (function(exports){
      exports.app=new Vue()
  })(windos)
  
  ```

  


### 2.业务拆分

  + 点击全选或者全不选

    使用input标签绑定change事件，使得事件的完成状态与标签的选中状态相挂钩

    **注意联动切换**

    ```javascript
    <input id="toggle-all" class="toggle-all" type="checkbox" @change="handelToggleAll">
    
    //根据change事件循环改变事件的完成状态
    methods:{
        handelToggleAll(e){
    				var checked=e.srcElement.checked //获取全选的状态
    				this.todos.forEach(item =>{
    					item.completed=checked
    				})
    			}
    }
    ```

+ 有无事件时的显示状态

  根据数据的有无决定页脚的显示

  ```javascript
  			<footer class="footer" v-show="todos.length">
  				<span class="todo-count">
  					<strong ></strong> 
  				</span>
  				<ul class="filters">
  					<li><a href="#/all" >All</a></li>
  					<li><a href="#/active" >Active</a></li>
  					<li><a href="#/completed" >Completed</a></li>
  				</ul>
  				<button class="clear-completed"> 
  				</button>
  			</footer>
  ```

+ 在事件添加按钮中绑定回车按钮，用于事件的添加

  ```javascript
  <input class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?" v-model="newTodos" @keyup.enter="handleNewTodoKeyDown">
  //事件处理函数
      			handleNewTodoKeyDown(){
  				//input 按下回车时添加新的数据
  				var value=this.newTodos && this.newTodos.trim()
  				if(!value){
  					return
  				}
  				this.todos.push(
  					{
  					id:this.todos.length+1,
  					title:value,
  					completed:false}
  					)
  				this.newTodos=''
  			}
  ```




+ 双击进入编辑状态

  - 使用中间变量对改变需要编辑的任务的样式

  - 在循环输出时，加上一个input标签用于接收修改后的内容，这里巧妙在style的设定

    ```javascript
    <li class="todo" v-for="todo in todos" :key="todo.id" :class="{completed: todo.completed, editing: editedTodo == todo}">
    		<div class="view">
    	<input class="toggle" type="checkbox" v-model="todo.completed">
    	<label @dblclick="editTodo(todo)">{{todo.title}}</label>
    	<button class="destroy" v-on:click="removeTodo(todo)"></button>
    		</div>
        //用于修改的input
    <input class="edit" type="text" v-model="todo.title" >
    </li>
    
    当点击修改时，原始数据进入隐藏状态，而修改按钮进行显示状态
    这里主要得益于css选择器，当进入编辑状态时因为在li上增加了一个编辑类
    ```

  - 在vue中设计到的逻辑

    - esc按钮终止编辑

    - enter或者失去焦点blur时保存数据

    - 在双击按钮时，将原先的数据保存到变量`beforeEditeTitle`中

      ```javascript
      editTodo(todo){
      				this.beforeEditeTitle=todo.title
      				this.editedTodo=todo
      				
      			},
      
      			cancleEdite(todo){
      				this.editedTodo = null;
      				todo.title=this.beforeEditeTitle
      			},
      
      			doneEdite(todo){
      				if(!this.editedTodo){
      					return
      				}
      				this.editedTodo=null
      				todo.title=todo.title.trim()
      				if(!todo.title){
      					this.removeTodo(todo)
      				}
      			}
      ```

      

+ 显示未完成的数目

  使用计算属性对数组进行过滤，同时先定义好了一个钩子对象用于显示未完成的条目的搜寻

  ```javascript
//钩子对象
  var filters={
  	all:function(todos){
  		return todos;
  	},
  	active:function(todos){
  		return todos.filter(item=>!item.completed)
  	},
  	completed:function(todos){
  		return todos.filter(item=>item.c)
  	}
  }
  //计算属性
  		computed:{
  			reminds:function(){
				return filters.active(this.todos).length
  			}
		}
  ```

  在后面加上复数的字符

  使用pluralize方法

  
  
+ 联动切换

  使用计算属性进行操作，计算属性中get方法，当访问计算属性的时候自动的调用get方法

  ```javascript
//使用get访问计算属性，对todos的状态进行检查
  toggleAllstat:{
  				get(){
  					//所有的都为true才为true
  					return this.todos.every(todo=>(todo.completed))
  				}
  }
  //将计算属性绑定到标签上
  <input id="toggle-all" class="toggle-all" type="checkbox" v-:checked="toggleAllstat">
  ```
  
  改进版本，使用v-model进行联动
  
  ```javascript
  		computed:{
			reminds:function(){
  				return filters.active(this.todos).length
			},
  			toggleAllstat:{
				get(){//访问计算属性时调用的方法
  					//所有的都为true才为true
					return this.todos.every(todo=>(todo.completed))
  				},
				set(){ //当计算属性发生改变时进行调用
  				var checked=!this.toggleAllstat //获取变化后的值
  				this.todos.forEach(item =>{
  					item.completed=checked
  				})
  				}
  			}
  		}
  <input id="toggle-all" class="toggle-all" type="checkbox" v-model="toggleAllstat">
  ```
  
  
  
  
  
+ 本地持久化

  + 使用window.localStorage中的方法对数据对象进行存储

  + 对vue实例中的数据对象进行监视，调用对应的setItem方法存储到本地

    https://cn.vuejs.org/v2/api/#watch
  
  ```javascript
  //本地化对象
  var todoStorage={
  	fetch:function(){
  		return JSON.parse(exports.localStorage.getItem('todos-vuejs') || '[]');
  	},
  	save:function(todos){
  		exports.localStorage.setItem('todos-vuejs',JSON.stringify(todos))
  	}
  }
  data:{
  			todos:todoStorage.fetch(),
		},
  
watch:{
  			todos:{
				deep:true, //对引用类型数据进行深度监视
  				handler:todoStorage.save //默认将新的值放在函数第一个参数位置，旧值在第二个位置
			}
  		},
```
  
  
  
  
  
+ 按条件显示条目

  + 定义一个钩子对象

  + 定义一个状态变量

  + 绑定点击事件,修改对应的状态变量
  
    ```javascript
    //钩子函数
    var filters={
    	all:function(todos){
    		return todos;
    	},
    	active:function(todos){
    		return todos.filter(item=>!item.completed)
    	},
    	completed:function(todos){
    		return todos.filter(item=>item.completed)
    	}
  }
    
  //应用到页面的计算属性
    			filterTodos:{
  				get(){
    					return filters[this.filterText](this.todos);
  				}
    			}
  ```
  
    
  
+ 

  ​			

  

  
  
  