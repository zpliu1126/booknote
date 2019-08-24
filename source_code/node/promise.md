# Promise 异步编程

![ãcallback hellãã®ç»åæ¤ç´¢çµæ](https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/Screen-Shot-2017-03-06-at-5.11.06-PM.width-808.png)



[阮大神的总结](http://javascript.ruanyifeng.com/advanced/promise.html)
[es6中讲解](https://es6.ruanyifeng.com/#docs/promise)

#### 回调地狱

​	不能够保证异步编程的执行顺序，例如读取不同的文件

 ```javascript
fs.readFile("a.txt",function(err,data){
    if(err){
        throw(err)
    }
})
fs.readFile("b.txt",function(err,data){
    if(err){
        throw(err)
    }
})
fs.readFile("c.txt",function(err,data){
    if(err){
        throw(err)
    }
})
 ```

为了固定文件的读取顺序，可以在异步读取中进行嵌套

```javascript
fs.readFile("a.txt",function(err,data){
    if(err){
        throw(err)
    }
    fs.readFile("b.txt",function(err,data){
    if(err){
        throw(err)
    }
        fs.readFile("a.txt",function(err,data){
    if(err){
        throw(err)
    }
})
})
})
```

**为了解决回调嵌套的问题，ES6中新增了promise API解决这个问题**

```javascript
var p1=new Promise(function(resolve,reject){
	teacher1.save(function(err,data){
	if(err){
		reject(err)
		}
		resolve(data)
	})
})

p1
	.then(
	function(){
	var query=teacher_Col.where({name:"zpliu"})
	query.deleteMany(function(err,data){
	if(err){
		console.log("删除失败"+err)
	}
		console.log("删除成功")
	})}
)
```

### 具体实现

+ 首先定义一个Promise对象，对象中的函数会立即执行，函数有两个回调函数用于接收执行程序中的结果或报错信息
+ **resolve**&**reject**
+ Promise对象使用then方法可以获取程序的执行结果并且进入下一个依赖的程序
+ then函数的参数都是可选的，即可以不看Promise对象的执行结果直接执行下一个程序，也可以给函数一个data参数，获取Promise对象执行成功后的数据

