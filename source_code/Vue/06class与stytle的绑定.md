# class & style

在操作DOM的过程中，修改元素的class与内联样式是数据绑定的常见需求，我们可以使用**v-bind**处理它们，可以通过表达式计算结果，但是字符串的拼接比较麻烦还容易出错，对此vue做了一定的增强

```javascript
<div class="static" v-bind:class={"active":isActive,"text-danger":hasError}></div>
vm.$data={
    isActive:ture,
    hasError:false
}
//最终的渲染结果
<div class="static active"></div>
```

+ 进一步的改进，将class整个对象在实例对象中声明，脱离DOM存在

```javascript
<div class="static" v-bind:class="classObject"></div>
vm.$data.classObject={
    active:true,
    text-danger:false
}
```

+ 将class对象存储在**计算属性**中，这样就能根据数据特性进行计算得到最终要的class对象

  ```javascript
  <div v-bind:class="classObject"></div>
  .data:{
      isActive:ture,
      erroe:null
  }
  .computed:{
      classObject:function(){
          return{
              active:this.isActive && !this.error,
              'text-danger': this.error && this.error.type=='fatal'
          }
      }
  }
  ```



### 2. 绑定到自定义组件上

```javascript
//声明自定义组件
vm.component('my-component',{
    template:'<p class="foo bar"></p>'
})
//在自定义组件中添加class
<my-component class="active"></my-component>
//最终渲染的结果
<p class="foo bar active"></p>


//使用v-bind进行渲染
<my-component v-bind:class="{active: true}"></my-component>
```



### 3.绑定到内联样式上

```javascript
<div v-bind:style="styleObject"></div>
vm.$data.styleObject={
    color:red,
    font-size:30px
}
```

