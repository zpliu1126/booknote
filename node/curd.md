# curd增删改查的使用



> :warning: linux服务器端口号的问题

```shell
netstat -anp|grep 8080
```

### 基于文件的增删改查

+ 基于fs读取json数据文件
+ 使用express-art-template模板引擎，发送模板页面和填充模板数据
+ 将json文件字符串解析成json格式

```javascript
var app=express() //init server
app.engine('html', require('express-art-template')) 
app.set('views','/var/www/html/node/express_demo/public/');

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
})
```



  + 使用art-template填充语法,对模板文件进行填充

    ```javascript
    <tbody>
                    {{ each individual}}
                    <tr>
                      <td>{{ $value.id }}</td>
                      <td>{{ $value.name }}</td>
                      <td>{{ $value.hobbies }}</td>
                      <td>{{ $value.sports }}</td>
                      <td>sit</td>
                    </tr>
                    {{ /each }}
                  </tbody>
    ```

    

    

+ ### 基于API对数据进行操作

  	> 将对学生数据进行操作的代码进行封装，由于涉及到文件的异步操作，这里也使用到了回调函数获取异步读取文件的数据

  + ##### 读取操作

```javascript
 var dbpath="./data/test.json"
 /*
获取所有学生的列表
return []

通过回掉函数获取读取的文件信息,
当调用find函数时，传入函数作为参数，将异步获取到的数据发送给回调函数，在回调函数中展示出来
 */
exports.find=function(callback){
	fs.readFile(dbpath,function(err,data){
		if(err){
			callback(err)
		}
		callback(null,JSON.parse(data.toString()))
	})
```



> 通过调用回掉函数获取，文件数据

```javascript
//err与data是传入回调函数的形参
var Student=require("./students.js")
	Student.find(function(err,data){
		if(err){
			rep.status(500).send("server error")
			console.log("读取文件失败");
			return
		}
		rep.render("students.html",{
		category:data.category,
		tiem:data.time,
		individual:data.individual
	})
});
```



 + ##### 添加操作

   + 涉及文件的读取与写入操作

   + JSON数据的整理

   + 回调函数的处理

     

```javascript
/*
添加并且保存学生信息,
传入参数是一个学生的信息，使用回调函数获取查询的状态
 */
exports.saveStudent=function(student,callback){
	fs.readFile(dbpath,function(err,data){
		if(err){
			return callback(err) //必须return 结束函数的运行
		}
		/*获取文件中所有学生的列表*/
		var students=JSON.parse(data.toString()).individual;
		/*处理好id信息*/
		student.id=students[students.length-1].id+1;
		students.push(student)
		var filedata=JSON.stringify({
			category:JSON.parse(data.toString()).category,
			time:JSON.parse(data.toString()).time,
			individual:students
		})
		fs.writeFile(dbpath,filedata,function(err){
			if(err){
				//传递文件写入错误对象
				 return callback(err)
			}
			callback(null)
		})
	})
}

```

 + API调用接口,使用body-parser获取post数据

   ```javascript
   router.post("/students/new",function(req,rep){
   /*获取到post数据，将数据保存到文件中*/	
   	student={
   		name:req.body.name,
   		hobbies:req.body.hobbies,
   		sports:req.body.sports}	
   	Student.saveStudent(student,function(err){
   		if(err){
   			console.log(err)
   			rep.send("写入错误！")
   		}
   	})	
   	rep.redirect('/')
   	rep.send()
   })
   ```

   