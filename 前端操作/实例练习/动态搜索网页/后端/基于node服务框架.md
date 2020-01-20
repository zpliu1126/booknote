# Node 服务框架



### 1.配置express

```javascript
var express=require("express")
var path=require("path") 
var app=express()
app.listen(80,function(){
  console.log("web server is init successful")
})
```

### 2.开放公共访问资源目录

```javascript
// open static resource 
app.use("/public",express.static(path.resolve(__dirname,"public")))
app.use("/node_modules",express.static(path.resolve(__dirname,"node_modules")))
```

### 3.设置模板文件后缀名

```javascript
//需要下载好对应的包
npm install express-art-template --save
npm install art-template --save
/*configure template engine */
app.engine("html",require("express-art-template"))
//默认从views目录下搜素模板文件，也可以修改
app.set('views','/var/www/html/node/MongoDB/template')
```



### 4.设置路由自定义包，及挂载路由

```javascript
/*在 router目录下分别单独建立对应的路由文件*/
var express=require("express")
var router=express.Router()
router.get("/search",function(req,rep,next){
  rep.send("this is search page!")
})

module.exports=router
/*主程序中进行挂载*/
var searchRouter=require(path.join(__dirname,"router/search.js"))
/*mount router */
app.use(searchRouter)
```



### 5.设置中间件及404页面

```bash
/*########################*/
//err page
app.use(function(err,req,rep,next){
  rep.status(200).send(err);
})
//404 page
app.use(function(req,rep){
  rep.status(400).render("404.html")
})
/*########################*/
```

