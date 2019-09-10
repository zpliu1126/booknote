# 动画的渲染



#### 1. 动画的几个阶段

![动画阶段](https://cn.vuejs.org/images/transition.png)

   - `v-enter`动画进入之前

   - `v-enter-active`动画进入过程中

   - `v-enter-to`动画进入完成

   - `v-leave`动画离开之前

   - `v-leave-active`动画离开过程

   - `v-leave-to`动画离开后

     **在transition 标签中使用name属性，css类名，增加控制动画组件的数目**

     

#### 2. 使用css自定义动画



``` javascript
<transition tag="my">测试css动画</transition>
//css文件中
.my-enter .my-leave-to{
    
}
.my-enter-active{
    
}
.my-enter-to .my-leave{
    
}
.my-leave-active{
    
}

```



#### 3.使用第三方animation.css库

```javascript
	<transition-group tag="ol"   enter-active-class=" animateed tada"
    leave-active-class="animated bounceOutRight" >	
		<li v-for="todo in date" :key="todo.id">{{todo.title}}
		<button type="text" @click="remove(todo)">移除动画</button>
		</li>
	</transition-group>	
//在对列表进行渲染时，需要加上key值，便于Vue识别每个li
//为了少写animated类，可以在li标签上绑定好对应的类名
```



		+ 给transition添加`appear`属性时，页面会启动动画
		+ 

