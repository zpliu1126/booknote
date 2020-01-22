# 使用mysql包进行数据库的交互

## 1. one be one mode

```bash
## 配置mysql数据库
var mysql=require("mysql")
var connection=mysql.createConnection({
  host:"localhost",
  user:'zpliu',
  password:"123456",
  port:'3306',
  database:'Bioinformatic'
})
module.exports=connection
## 导入配置以及进行mysql连接
var mysqlConnection=require(path.join(__dirname,"include/mysql_config.js"))

mysqlConnection.connect(function(err){
  if(err){
    console.log("err connection"+err.stack);
    return;
  }else{
    console.log("mysql database connect successful\nconnection id:"+mysqlConnection.threadId);
  }
})
## 结束连接
mysqlConnection.end(function(err){
  if(err){
    console.log("mysql terminated failed")
  }else{
    console.log("terminated mysql server successful")
  }
})
```



### 2.Pooling connections

进程池中进行单个查询

```bash
var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'example.org',
  user            : 'bob',
  password        : 'secret',
  database        : 'my_db'
});
 
pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
```

进程池中进行一系列的查询

```bash
var mysql = require('mysql');
var pool  = mysql.createPool(...);
 
pool.getConnection(function(err, connection) {
  if (err) throw err; // not connected!
 
  // Use the connection
  connection.query('SELECT something FROM sometable', function (error, results, fields) {
    // When done with the connection, release it.
    connection.release();
 
    // Handle error after the release.
    if (error) throw error;
 
    // Don't use the connection here, it has been returned to the pool.
  });
});
```



### reference

1. https://www.npmjs.com/package/mysql 