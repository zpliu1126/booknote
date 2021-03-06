# 引物表

主要字段

+ 订单号
+ 单号
+ 合成编号
+ 二代序列基因编号
+ 三代基因编号
+ primer 名字
+ 碱基数
+ 管数
+ 摩尔数
+ 修饰方式
+ 纯化方式
+ 硫代个数
+ TM值
+ 分子量
+ GC含量
+ 公司名字
+ 序列

### 创建mysql 表

为防止重复的数据，设置订单编号为唯一主键

```bash
use bioinformatic;
create TABLE IF not exists primer(
  subscriber VARCHAR(20) not NULL,
  teacher VARCHAR(20) not NULL,
  order_number VARCHAR(50) not NULL,
  sequence VARCHAR(100) not NULL,
  list_number VARCHAR(20) NULL default "None" ,
  synthesis_num VARCHAR(20) not NULL,
  secondID VARCHAR(20) default "None" ,
  thirdID VARCHAR(20) default "None",
  primerName VARCHAR(30) default "None",
  baseCount int default 0,
  tubeCount int default 0,
  contentCount float default 0.0,
  decoratePattern VARCHAR(20) default "None",
  purificationPattern VARCHAR(20) default "None",
  ThioCount int default 0,
  TMValue float default 0.0,
  MolecularWeight float default 0.0,
  GCContent float default 0.0,
  company VARCHAR(20) not NULL,
  primary key(order_number)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

输出结果

```bash
mysql> describe primer;
+---------------------+--------------+------+-----+---------+-------+
| Field               | Type         | Null | Key | Default | Extra |
+---------------------+--------------+------+-----+---------+-------+
| subscriber          | varchar(20)  | NO   |     | NULL    |       |
| teacher             | varchar(20)  | NO   |     | NULL    |       |
| order_number        | varchar(50)  | NO   | PRI | NULL    |       |
| sequence            | varchar(100) | NO   |     | NULL    |       |
| list_number         | varchar(20)  | YES  |     | None    |       |
| synthesis_num       | varchar(20)  | NO   |     | NULL    |       |
| secondID            | varchar(20)  | YES  |     | None    |       |
| thirdID             | varchar(20)  | YES  |     | None    |       |
| primerName          | varchar(30)  | YES  |     | None    |       |
| baseCount           | int          | YES  |     | 0       |       |
| tubeCount           | int          | YES  |     | 0       |       |
| contentCount        | float        | YES  |     | 0       |       |
| decoratePattern     | varchar(20)  | YES  |     | None    |       |
| purificationPattern | varchar(20)  | YES  |     | None    |       |
| ThioCount           | int          | YES  |     | 0       |       |
| TMValue             | float        | YES  |     | 0       |       |
| MolecularWeight     | float        | YES  |     | 0       |       |
| GCContent           | float        | YES  |     | 0       |       |
| company             | varchar(20)  | NO   |     | NULL    |       |
+---------------------+--------------+------+-----+---------+-------+
```



### 改变字段属性

```sql
alter table primer change list_number 新字段名 字段类型 是否为空;
alter table primer modify list_number  字段类型 是否为空;
//修改主键
alter table primer add primary key (order_number);
```



### 4.插入数据

```bash
 INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (1,"WHP20190613-3057","WHP2019060017681","金斯瑞","ATAGCCGGAGAGAGT");
 INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (1,"WHP20190612-3057","WHP2019060017681","Hi-Tom","ATAGCCGGAGAGAGT");
 INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (6,"WHP20180612-3057","WHP2018060017681","Hi-Tom","ATAGCCGGAGAGAGT");
  INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (6,"WHP20190512-3057","WHP2019060017681","华大基因","ATAGCCGGAGAGAGT");
 INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (6,"WHP20190612-3057","WHP2019060017681","华大基因","ATAGCCGGAGAGAGT");
 INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (1,"WHP20190912-3057","WHP2019060017681","华大基因","ATAGCCGGAGAGAGT");
  INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (11,"WHP20190012-3057","WHP2019060017681","Vue","ATAGCCGGAGAGAGT");
```

### 5.数据查询

使用js模板字符串将sql 语句拼接好，支持模糊查询字段

+ 订购者
+ 课题组老师
+ 公司
+ 二代编号
+ 三代编号
+ 订单编号

```javascript
## 使用concat函数将各个字段拼接成一个字符串，再进行模糊查询
    sql=`select * FROM \`primer\` 
    WHERE CONCAT( \`subscriber\`,\`teacher\`,\`company\`,\`2thID\`,\`3thID\`,\`order_number\`) 
    like "%${keyword}%" `
```

模糊查询函数

```bash
function searchByKeyword(keyword ,callback){
  poolConnection.getConnection(function(err,connection){
    if(err){
      callback(errorCategory.mysql.connection)
      return
    }
    sql=`select * FROM \`primer\` 
    WHERE CONCAT( \`subscriber\`,\`teacher\`,\`company\`,\`2thID\`,\`3thID\`,\`order_number\`) 
    like "%${keyword}%" `
    connection.query(sql,function(err,result){
      if(err){
        callback(errorCategory.mysql.sql)
        return
      }
      connection.release()
      callback(null,result)
    })
  })
}
```



### 使用用户id作为外键约束

```sql
create TABLE IF not exists primer(
  subscriber int not NULL,
  constraint fk_primer_user_id FOREIGN KEY (`subscriber`) REFERENCES `user` (`id`),
  order_number VARCHAR(50) not NULL,
  sequence VARCHAR(100) not NULL,
  list_number VARCHAR(20) NULL default "None" ,
  synthesis_num VARCHAR(20) not NULL,
  secondID VARCHAR(20) default "None" ,
  thirdID VARCHAR(20) default "None",
  primerName VARCHAR(30) default "None",
  baseCount int default 0,
  tubeCount int default 0,
  contentCount float default 0.0,
  decoratePattern VARCHAR(20) default "None",
  remark VARCHAR(200) default "None",
  purificationPattern VARCHAR(20) default "None",
  ThioCount int default 0,
  TMValue float default 0.0,
  MolecularWeight float default 0.0,
  GCContent float default 0.0,
  company VARCHAR(20) not NULL,
  primary key(order_number)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

####　插入数据

```bash
INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (1,"WHP20190613-3057","WHP2019060017681","金斯瑞","ATAGCCGGAGAGAGT");
 INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (1,"WHP20190612-3057","WHP2019060017681","Hi-Tom","ATAGCCGGAGAGAGT");
 INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (6,"WHP20180612-3057","WHP2018060017681","Hi-Tom","ATAGCCGGAGAGAGT");
  INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (6,"WHP20190512-3057","WHP2019060017681","华大基因","ATAGCCGGAGAGAGT");
 INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (6,"WHP20190612-3057","WHP2019060017681","华大基因","ATAGCCGGAGAGAGT");
 INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (1,"WHP20190912-3057","WHP2019060017681","华大基因","ATAGCCGGAGAGAGT");
  INSERT  into primer (subscriber,order_number,synthesis_num,company,sequence) VALUES (11,"WHP20190012-3057","WHP2019060017681","Vue","ATAGCCGGAGAGAGT");
```



#### 批量插入多行数据

+ 使用嵌套数组

```bash
[
[item1],
[item2]
]
```

+ sql模板语句的写法
  + sql语句中values后没有小括号

```sql
INSERT into table_name (columns) VALUES ?
```

+ 查询函数
  + 注意嵌套数组外面还要加一对中括号

```bash
connection.query(sql,[insertArray],function(err,result){})
```







### 按账户查询

```bash
 select user.chineseName,teacher.teacher_name from teacher,primer  left join user on primer.subscriber=user.id where user.teacherId=teacher.id AND user.id='1';
```



#### 清空表

```sql
truncate table primer;
```



### 参考

1.  https://blog.csdn.net/qq_29229567/article/details/82743645 
2.  批量插入  https://blog.csdn.net/lym152898/article/details/78246230 

