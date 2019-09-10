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

+ 首先定义一个Promise对象，对象中的函数会**立即执行**，函数有两个回调函数用于接收执行程序中的结果或报错信息
+ **resolve**&**reject**
+ Promise对象使用then方法可以获取程序的执行结果并且进入下一个依赖的程序
+ then函数的参数都是可选的，即可以不看Promise对象的执行结果直接执行下一个程序，也可以给函数一个data参数，获取Promise对象执行成功后的数据



### 实例

#### 1.使用函数进行封装

为了避免promise对象一被创建就进入执行状态，使用函数将promise对象封装在函数作用域；通过调用函数来执行promise

```javascript
function getFileByPath(filepath){
	return new Promise(function(resolve,reject){
		fs.readFile(filepath, 'utf-8', (err,data)=>{
			if(err){
				return reject(err)
			}
			return resolve(data)

		});
	})
}
```

#### 2.在promise实例对象中传入要执行的函数

函数带了两个回调函数，分别对应了成功的回调函数**resolve**与失败的回调函数**reject**

+ **当要进行的操作成功或者失败时，将对应的函数与数据返回给Promise实例对象**
+ Promise对象使用对应的**then**方法处理两个回调函数



#### 3. 使用then方法进行promise串联

+ **then** 方法接受两个回调函数，成功的回调必须写而失败的回调可以不写

```javascript
getFileByPath("./1.txt")
	.then(function(data){
		console.log(data);
		return getFileByPath("./ID.txt")
	})
	.then(function(data){
		console.log(data)
	})
```

#### 4.解决promise执行中出错的问题

+ ##### 1.出错之后继续异步执行

  在then的第二个位置传递**出错的回调函数**，函数返回下一个promise

  ```javascript
  getFileByPath("./1.txt")
  	.then(function(data){
  		console.log(data);
  		return getFileByPath("./ID.txt")
  	},function(err){
  		console.log(err)
  		return getFileByPath("./ID.txt")
  	})
  ```

  

  

+ ##### 2. 抛出错误，结束异步执行

  **使用catch捕获异常，传递异常处理函数**

  ```javascript
  	.catch(err=>{
  		console.log(err);
  	})
  ```

+ ##### 3. 如果同时写了这两种处理方法的话，catch是不能够生效的

  