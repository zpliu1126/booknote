## node中路由设计

+ 初始化
+ 模板的处理





#### 路由的设计	

| 请求方法 | 请求路径        | get参数 | post参数                        | 备注             |
| :------: | --------------- | ------- | ------------------------------- | ---------------- |
|   GET    | /students       |         |                                 | 渲染首页         |
|   GET    | /students/new   |         |                                 | 渲染添加学生页面 |
|   POST   | /students/new   |         | name、age、gender、hobbies      | 处理添加页面     |
|   GET    | /students/edit  | id      |                                 | 渲染编辑页面     |
|   POST   | /student/edit   |         | id、name 、age、gender、hobbies | 处理编辑页面     |
|   GET    | /students/delet | id      |                                 | 处理删除         |



#### 使用路由文件进行映射

+ ##### 借用model.exports函数将路由封装成函数，然后在主文件中进行调用

  ```javascript
  //在路由文件中
  module.exports=function(app){
  app.get("/",function(req,rep){ //request root url
  	/*rep.send("hello express")*/ //response the client
  	/*rep.send("中文 is ok!")*/ //response the client with chinese
  	fs.readFile("./data/test.json",function(err,data){
  		if(err){
  			rep.status(500).send("server error")
  			console.log("读取文件失败");
  			return
  		}
  		rep.render("index.html",{
  		category:JSON.parse(data.toString()).category,
  		tiem:JSON.parse(data.toString()).time,
  		individual:JSON.parse(data.toString()).individual
  	})
  	});
  })}
  //主文件中进行加载
  var route=require("./route.js")
  //调用路由函数
  route(app);
  
  ```

+ ##### express中专门用于路由映射的Route方法

  + **创建express路由容器**

    ```javascript
    //创建路由容器
    var express=require("express")
    var fs=require("fs")
    var router=express.Router()
    //填充路由容器route内容
    router.get("/",function(req,rep){ //request root url
    	/*rep.send("hello express")*/ //response the client
    	/*rep.send("中文 is ok!")*/ //response the client with chinese
    	fs.readFile("./data/test.json",function(err,data){
    		if(err){
    			rep.status(500).send("server error")
    			console.log("读取文件失败");
    			return
    		}
    		rep.render("index.html",{
    		category:JSON.parse(data.toString()).category,
    		tiem:JSON.parse(data.toString()).time,
    		individual:JSON.parse(data.toString()).individual
    	})
    	});
    })
    //导出route容器
    modeul.exports=router
    ```

  + 挂载路由容器

    ```javascript
    //在主文件总挂载route容器
    var router=require("./route.js")
    app.use(router)
    ```

    

>  ### 当这些完成之后app.js内的内容就很清晰了，各司其职



	+ 创建服务
 + 服务相关的配置
   + 加载模板引擎 **express-art-template**
   + 解析post表单数据 **body-parser**
   + 设置静态资源目录

+ 挂载路由
+ 监听端口

```javascript
var fs=require("fs")
var express=require("express")
var router=require("./route.js")
var bodyParser=require("body-parser")
var app=express() //init server
app.engine('html', require('express-art-template')) //设置模板文件后缀
app.set('views','/var/www/html/node/express_demo/public/');//设置模板文件目录
//解析post请求的配置
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
// post数据在req的body属性中
app.use(router) //挂载路由文件
// open static resource directory
app.use('/public/',express.static('./public/'))

app.listen(8080,function(){
	console.log("The server is running in 8080 port")
})
```

​	

### 定制404页面

