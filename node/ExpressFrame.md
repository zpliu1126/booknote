# 关于express框架的学习



+ 版本概念

  * ***2.10.2*** 	

    第一个是大版本，第二个增加新功能，第三个修复bug

### 1.  安装



```javascript
npm init -y
npm install --save express
```

### 2. hello world



```javascript
var express=require("express")
var app=express() //init server
app.get("/",function(req,rep){ //request root url
	/*rep.send("hello express")*/ //response the client
	rep.send("中文 is ok!") //response the client with chinese
})


app.listen(8080,function(){
	console.log("The server is running in 8080 port")
})
```



#### 具体使用

+  #### 公开静态访问资源目录

```javascript
// open static resource
app.use('/public/',express.static('./public/'))
```

> :warning:现在觉可以通过url访问public目录下的所有文件​



### 代码完成之后服务器自动完成重启的问题

> 基于nodemon模块监视程序的运行，并且自动重启



```javascript
npm install -g nodemon

之后使用nodemon运行js脚本
```



### 路由操作

**请求方法:ideograph_advantage:请求路径+请求方法**

```javascript
app.get("/",function(req,rep){ //request root url
	/*rep.send("hello express")*/ //response the client
	rep.send("中文 is ok!") //response the client with chinese

})
app.get("/about",function(req,rep){ //request root url
	/*rep.send("hello express")*/ //response the client
	rep.send("This is about!") //response the client with chinese

})
```

### 配置模板引擎



```javascript
var app=express();
app.engine('art', require('express-art-template')) 
第一个参数是配置模板文件的后缀，可以修改
```

:crescent_moon:express-art-template模板是依赖于art-template的

**express为对象配置了render模板函数，但是在没有配置express-art-template引擎情况下时不可以使用render函数的**

+ 用法

   ```javascript
  //响应对象调用render函数，读取对应的文件，使用模板引擎进行渲染
  //express默认会从view目录下寻找模板文件，并且文件名后缀以.art后缀结尾《或者自定义后缀结尾》
  var app=express();
  app.engine('html', require('express-art-template')) 
  app.get('/',function(req,rep){
  		rep.render("../index.html",{
  			comments:comments
  		})
  })
  ```

  当请求根目录时候，响应对象会去读取views目录的上一级目录的index.html文件，文件后缀是html而不是**art**的原因是因为在设置express模板引擎的时候，设置好了，第二个参数用于模板数据的填充与art-template模板的用法是一致的

  > 修改默认的模板路径； 

  ```javascript
  app.set('views','模板文件的目录');
  //修改完成之后；render函数中文件都是相对于修改后的路径进行设置的
  ```

  

### 基于GET请求实现留言板

		1. 基于express-art-template模板引擎
  		2. render中封装好了文件读取函数，和模板替换，模板文件的读取默认相对于views目录
                		3.  请求对象req中封装好了get参数，不需要使用url模块进行操作了
            		4.  响应对象封装好了重定向函数，不需要http的Location函数了

### 基于POST请求实现留言板

其实只需要修改对页面的请求方式,express没有默认的获取post参数的函数

基于其他插件来实现 **

```javascript
var express=require("express")
var bodyParser=require("body-parser") //解析post数据的插件
var app=express();
app.engine('html', require('express-art-template')) //使用express 改造的art-template引擎
//解析post请求的配置
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
// post数据在req的body属性中
```

接着在对同一个文件不同的请求的时候，对应不同的解析方法

```javascript
//当以post方法请求comments文件时
app.post('/views/comments',function(req,res){
	/*获取post数据*/
	var comment=req.body //直接封装好了在req属性中
		comment.date="2019-7-10"
		/*console.log(comment)*/
		comments.push(comment); //数据完成更新
		//进行临时重定向状态码302; location为重定向地址
		res.redirect('/')
		res.send()
})
```



## 2.基本的模板



+ app.js模板

  ```javascript
  var fs=require("fs")
  
  var express=require("express")
  
  var bodyParser=require('body-parser') //解析post参数
  
  var router=require("./route.js")//路由文件
  
  var app=express()//express对象
  
  app.engine("html", require("express-art-template")) //配置模板引擎
  
  app.set('views','/var/www/html/node/MongoDB/template') //设置模板文件目录
  
  app.use(bodyParser.urlencoded({extended:false})) //设置post请求解析
  
  app.use(bodyParser.json()) //解析成json数据格式
  
  app.use(router) //挂载路由
  
  app.use('/public',express.static('/var/www/html/node/MongoDB/public')) //开放静态资源访问目录
  
  app.listen(8081,function(){
  	console.log("server is start!");
  })
  ```

  

+ route.js路由文件

  ```javascript
  var fs=require("fs")
  
  var express=require("express")
  
  var router=express.Router()
  
  router.get("/",function(req,rep){
  	rep.render("students.html")
  })
  module.exports=router
  ```

  

+ 与业务相关的student.js文件，使用MongoDB进行处理