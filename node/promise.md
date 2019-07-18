# Promise 异步编程

![ãcallback hellãã®ç»åæ¤ç´¢çµæ](https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/Screen-Shot-2017-03-06-at-5.11.06-PM.width-808.png)





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





