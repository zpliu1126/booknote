# :pig_nose:  node中使用MongoDB的实例

#### 依赖于mongoose模块进行一系列的增删改查操作



+ #### 1. 连接数据库

  主要使用到connect函数，函数中还有一系列对应的操作可以参加官方文档进行配置

  https://mongoosejs.com/docs/connections.html

  :warning:一开始我一直报错

  是由于我要连接的是test1数据库，但是我用账号不是这个数据库的的所有者所以认证失败了

  > { MongoNetworkError: failed to connect to server [localhost:27017] on first connect [MongoError: Authentication failed.]

  ```javascript
  var mongoose=require('mongoose')
  
  mongoose.connect("mongodb://localhost:27017/admin",{useNewUrlParser:true,user:"zpliu",pass:"mysql"},function(err){
  	if(err){
  		return console.log(err)
  	}else{
  		console.log("数据库连接成功")
  	}
  })
  ```

  

+ #### 2. 设计集合的表结构

  使用monoose中Schema实例对象进行集合结构的定义

  ```javascript
  var Schema=mongoose.Schema //schema用于设计集合结构
  
  var studentSchema=new Schema( //设计集合结构
  {
  	username:{
  		type:String,
  		required:true //要求必须要有名字
  	},
  	password:{
  		type:String,
  		require:true
  	},
  	email:{
  		type:String
  	}
  })
  ```

  

+ #### 3.封装成对应集合对象

  使用model函数将上一步设计好的集合结构进行封装成对应的集合对象，得到集合对象之后就可以对集合对象中的数据进行操作

  :warning:在model函数中第一个参数是设置集合的名字的通常有默认的操作

  参数以大写字母开头，model函数会将对应的参数改成小写字母开头并且以复数结尾

  > Student  ------>>>>> students

  ```javascript
  var Student=mongoose.model("Student",studentSchema)
  ```

  

+ #### 4.往集合对象中添加文档数据

  利用上一步module中建立好的集合对象之后，使用new方法定义集合中新的文档对象，文档对象中的内容需要按照之前**Schema**中定义好的表的结构进行定义

  ```javascript
  //创建文档实例
  var student1=new Student({ 
  	username:"zpliu",
  	password:"123456",
  	email:"1944532210@qq.com"
  })
  ```

+ #### 5.文档对象的保存

  使用**回调函数监视数据**是否插入成功

  当文档插入成功之后，对应声明的集合也就产生在数据库中了

  ```javascript
  /*将文档数据进行存储*/
  student1.save(function(err,data){
  	if(err){
  		return console.log("数据库插入失败")
  	}
  	console.log("数据库插入成功") //data中保留了插入的数据
  })
  ```

  



+ #### 6.查询操作

  借助model中封装好的集合对象，定义sql查询语句，调用find或者findOne函数进行查询操作

  **不知道是不是，每次都得使用Schema去定义好集合结构再去进行查询操作**

  https://mongoosejs.com/docs/api/query.html

  ```javascript
  var query=Student.where({username:"zpliu"})
  query.find(function (err,data) {
  	if(err){
  		console.log(err)
  	}else{
  		console.log(data)
  	}
  	// body...
  })
  ```

+ #### 7.删除操作

  删除操作与查询操作不一样，贪婪的将符合条件的文档进行删除；而查询操作只会将查询到的其中一条给输出

  ```javascript
  /*
  MongoDB删除数据
   */
  Student.remove({username:"zpliu"},function(err){
  	if(err){
  		console.log("删除失败")
  	}else{
  		console.log("删除成功");
  	}
  })
  ```

+ #### 8.更新操作

  同样的使用集合对象的where函数构造查询语句，调用update方法只更新一个，而updateMany方法则是更新所有符合的文档；函数中传入需要更新的字段内容 **{$set{字段:更新的内容}}

  ```javascript
  var query=Student.where({username: "zpliu"})
  query.updateMany({$set:{password:"654321"}},function(err){
  	if(err){
  		console.log(err)
  	}else{
  		console.log("更新成功")
  	}
  })
  ```


## 代码进行模块化



#### :sa:1.数据库配置信息

```javascript
var dbUrl="mongodb://localhost:27017/admin"

var dbOption={useNewUrlParser:true,user:"account",pass:"password"}

module.exports={
	dbUrl:dbUrl,
	dbOption:dbOption
}
```

​	

#### :heavy_multiplication_x: 2.定义数据库集合对象

```javascript
var mongoose=require("mongoose") //使用mongoose模块

var dbcongigure=require("./configure.js") //加载数据库配置信息

mongoose.connect(dbcongigure.dbUrl,dbcongigure.dbOption,function(err){
	if(err){
		console.log(">>>>>>>>failed to connect MongoDatabase<<<<<<\n"+err);
	}
})
var Schema=mongoose.Schema  //用于定义数据集的表结构
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*
	1.定义学生表结构
 
 */
var StudentSchema=new Schema({
	username:{
		type:String,
		required:true //必须填写
	},
	password:{
		type:String,
		require:true
	},
	email:{
		type:String
	}
})

//封装到模型之中
var students=mongoose.model("Student",StudentSchema)


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
module.exports={
	students:students
}
```



#### :bullettrain_front: 3.操作对应的集合

现在students变量就代表了数据库中students集合，然后查询MongoDB官方文档进行增删改查就可以了

```javascript
var collections=require("./../database/collection-init.js")  //加载数据库集合结构文件

var students=collections.students //使用students集合对象
```



### 结合数据库进行实例操作

+ 1.数据库的查询操作

  这里由于Mongodb数据库中文档的id信息由于分布式存储的原因，不太方便辨别；在数据展示时可以使用**art-template**模板中的 **$index+1**进行id信息的展示

  > 1. 数据库的配置信息文件
  > 2. 所有数据库集合collection结构化的文件
  >
  > 3. 针对student封装好的增删改查的业务函数



+ 封装好的插入函数

  ```javascript
  exports.insert=function(studentPost,callback){
  	var student1=new students_Col(studentPost)
  	student1.save(function(err,data){
  		if(err){
  			callback(err)
  		}else{
  			callback(null,data)
  		}
  	})
  }
  ```

+ 查询所有数据

  ```javascript
  exports.findAll=function (callback){
  	var query=students_Col.where({})
  	query.find(function(err,data){
  		if(err){
  			callback(err)
  		}else{
  			callback(null,data)
  		}
  	})
  }
  ```

  

+ 查询单个数据

  ```javascript
  exports.findOne=function(studentid,callback){
  	var query=students_Col.where({_id:studentid})
  	query.findOne(function(err,data){
  		if(err){
  			callback(err)
  		}
  		else{
  			callback(null,data)
  		}
  	})
  }
  ```

  

+ 更新数据

  ```
  exports.update=function(studentsPost,callback){
  	//提交的表单中的id信息不会被替换就算了
  	students_Col.findOneAndUpdate({_id:studentsPost.id},studentsPost,{useFindAndModify:false},function(err,doc){
  		if(err){
  			callback(err)
  		}
  		callback(null)
  	})
  }
  ```

  

+ 删除数据

  ```javascript
  exports.delete=function(studentId,callback){
  	var query=students_Col.where({_id:studentId})
  	query.deleteMany(function(err){
  		if(err){
  			callback(err)
  		}
  		callback(null)
  	})
  }
  ```

  