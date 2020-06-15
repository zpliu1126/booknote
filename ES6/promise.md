

# promise源码解析



众所周知javascript是一门单线程语言，这种设计有效的避免了多线程带来的复杂同步问题。但有时候单线程模式遇到耗时较长的任务时，会拖延整个程序的进度，造成浏览器长时间无响应。为了解决这个问题，js将任务分为两种执行模式：

+ 异步模式
+ 同步模式

为了获得异步任务得到的结果，最常见的做法是使用回调函数。但是回调函数剥夺了我们使用return和throw的权利，而且代码以一种向右扩展的风格；不利于维护（回调地狱)，还会产生一些回调问题。

- 回调过早（一般是异步被同步调用）；
- 回调过晚或没有回调；
- 回调次数过多；
- 等等

![回调地狱](https://user-gold-cdn.xitu.io/2018/7/11/1648870b900aeb47?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

​	值得注意的是，两种任务模式是位于两个任务队列里的；只有同步队列里的任务都执行完成后才会开始执行异步队列里的任务。这里在for循环同步任务结束后才会进入到异步队列执行异步任务。

```javascript
    console.log('同步任务1')
    setTimeout(() => {
      console.log('异步任务1')
    }, 2000)
    var j
    for (var i = 0; i <= 10000000; i++) {
      i = i - 0.5
      j = i
    }
    console.log(j)
//同步任务1
//9999999.5
//异步任务1
```

### Promise状态

Promise在ES6中被引入，作为解决回调地狱的标准方法。Promise有三种状态

+ padding
+ resolve
+ reject

在任意时刻promise只能处于一种状态，并且状态只能从padding向resolve或者padding向reject转变；状态一经改变后就无法撤回。

在定义一个promise对象时，通过`reject()`或者`resolve()`来指定状态是否成功；`then`方法中定义对应的回调函数

```javascript
    new Promise((resolve, reject) => {
        resolve(1)
    }).then((value) => {
      console.log('成功回调:' + value)
    })
```

### 回调函数定义顺序

1. 后定义回调函数

这里`Promise`对象中，同步执行回调函数，此时then方法还没有执行，因此then中回调函数的定义时后定义的

```javascript
    new Promise((resolve, reject) => {
        resolve(1)
    }).then((value) => {
      console.log('成功回调:' + value)
    })
```

1. 先定义回调函数

这里`Promise`对象中，异步执行回调函数，因此同步队列中的then方法执行完后才会开始执行异步队列中的回调函数

```javascript
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(1)
      }, 1000)
      console.log('1s后启动异步回调:')
    }).then(
      (value) => {
        console.log('成功回调:' + value)
      },
      (reason) => {
        console.log('失败回调:' + reason)
      }
    )
```

### 链式调用

`then`方法返回的是一个新的`promise`对象，因此返回的新的`promise`对象又可以调用对应的then方法。

then方法中返回promise对象的三种方式：

+ 默认
+ 新的`promise`对象
+ 抛出错误

#### 默认情况

```javascript
then(
      (value) => {
        console.log('成功回调:' + value)
      },
      (reason) => {
        console.log('失败回调:' + reason)
      }
    )
//相当于
then(
      (value) => {
        console.log('成功回调:' + value)
          return new Promise((resolve,reject)=>{
              resolve()
          })
      }
    )
```

#### 返回新的Promise对象

在新的Promise对象中可以指定新的回调函数，并且这个新的Promise函数一定是在第一个Promise函数后执行的

```javascript
then(
        (value) => {
          console.log('成功回调:' + value)
        },
        (reason) => {
          console.log('失败回调:' + reason)
          return new Promise((resolve, reject) => {
            resolve(2)
          })
        }
      )
```

### 值传透

在Promise返回是吧状态后，如果没有定义对应的失败回调，错误将会传递到catch，这一切是通过默认的失败回调执行的

默认的失败回调如下，因此如果`then`中没有定义对应的失败回调则会将错误抛出，最后传递到catch中

```javascript
        (reason) => {
          throw reason
        }
```

定定义失败回调函数

```javascript
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(1)
      }, 1000)
    })      
     .then(
        (value) => {
          console.log('成功回调:' + value)
        },
        (reason) => {
          console.log('自定义解决:' + reason)
          throw 2 + reason
        }
      )
      .catch((reason) => {
        console.log('值传透:' + reason)
      })

```

同样的如果then方法中传递的不是回调函数，它将会将结果传递给下一个promise

```javascript
    Promise.resolve('foo')
    .then(Promise.resolve('bar'))
    .then(function(result){
      console.log(result)
    })
//foo
```

### 链终止

在catch后。Promise仍旧可以传递，通过返回一个padding状态的Promise实现链终止

```javascript
      .catch((reason) => {
        console.log('值传透:' + reason)
      })
      .then((value) => {
        console.log(value)
      })
//undefined

      .catch((reason) => {
        console.log('值传透:' + reason)
        return new Promise(() => {}) //padding状态
      })
      .then((value) => {
        console.log(value)
      })
```



### 1.参考

1. [Promise解决了什么问题](https://juejin.im/post/5b45bea65188251b1c3ce1ec)
2. [值传透](https://www.jianshu.com/p/4e8aaa87540a)