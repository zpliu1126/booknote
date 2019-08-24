# MongoDB中的SQL语句



### :baseball: 基本的一些操作

+ ##### 显示当前所有的数据库

  ```sql
  show dbs
  //admin   0.000GB
  //config  0.000GB
  //local   0.000GB
  ```

  

+ 切换到某一个数据库,如果数据库不存在则自动创建一个

  ```sql
  use admindbs
  //switched to db admin
  ```

  

+ 查看当前操作的数据库

  其实这里db是当前数据库的一个对象，而具体的数据库名字存储在对象中；所以之后对数据库的操作都依赖于**db**对象

  ```sql
  db
  //admin
  ```

  

+ 查看当前数据库集合(相当于mysql中的表)

  ```sql
  show collections
  show tables
  //system.users
  //system.version
  ```

+ 创建新的集合

  ```ssql
  //db.createCollection("test",{option可选参数})
  
  db.createCollection("students")
  //{ "ok" : 1 }
  
  ```

+ 删除已有的集合

  ```sql
  db.集合的名字.drop()
  db.students.drop()
  ```

  

### :monkey_face: 涉及到集合的操作

  + 查询集合中所有数据

    ```sql
    >db.system.version.find()
    //使用find方法，db代表当前数据库,并且id是数据库经过一定的处理保证不会产生重复
    /*
    { "_id" : "featureCompatibilityVersion", "version" : "4.0" }
    { "_id" : "authSchema", "currentVersion" : 5 }
    */
    ```

    

+ 往集合中插入数据

  ```sql
  > db.students.insertOne({"name":"zpliu"})
  {
  	"acknowledged" : true,
  	"insertedId" : ObjectId("5d2ddad0aba1154ed4c1c70a")
  }
  //查询一下看有没有成功
  > db.students.find()
  { "_id" : ObjectId("5d2ddad0aba1154ed4c1c70a"), "name" : "zpliu" }
  ```

  

+ 删除集合中的数据

  ```sql
  db.students.remove({query},{justOne:true})
  //当第二个条件justOne为true时，即使前面匹配多个内容也只会删除其中一个
  //删除集合中的所有数据,只需要匹配所有字段即可
  db.students.remove({});
  ```

  

+ 更新集合中的内容

  在update函数中第一个参数用于表头的搜索，第二个参数中使用

  **{$set:{}}进行更新所选到的字段

  **:warning:当所搜索字段不唯一的时候，只会更新第一个搜索到的内容**

  ```sql
  > db.students.find()
  { "_id" : ObjectId("5d2ddad0aba1154ed4c1c70a"), "name" : "zpliu" }
  { "_id" : ObjectId("5d2ddb51aba1154ed4c1c70b"), "name" : "zpliu", "age" : 22 }
  
  > db.students.update({"name":"zpliu"},{$set:{"name" : "zpliu", "age" : 23}})
  WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
  
  > db.students.find()
  { "_id" : ObjectId("5d2ddad0aba1154ed4c1c70a"), "name" : "zpliu", "age" : 23 }
  { "_id" : ObjectId("5d2ddb51aba1154ed4c1c70b"), "name" : "zpliu", "age" : 22 }
  
  ```


### 数据库备份



```sql
mongodump  -d admin -o /var/www/html/node/static/data/dump/ -u zpliu -p mysql --authenticationDatabase admin
```

+ -d 选择要备份的数据库
+ -o 保存数据的目录
+ -u 进行认证
+ 后面的authenticationDatabase 是保存了用户认证信息的数据库

**不知道为什么，开启认证模式不好备份我之间用非认证模式进行备份**

