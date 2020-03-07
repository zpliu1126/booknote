# 用户登录表

```sql
create user 'BioCotton'@'localhost' identified by '密码'; BioCotton39558728cotton@
## root权限下新建数据库
create database bioinformatic character set utf8;
## 赋予权限
grant all privileges on bioinformatic.* to 'BioCotton'@'localhost';
```

### 最简单的表结构开始

1. `id`
2. `userName`
3. `password`

#### 1.mysql中创建对应的表结构

```sql
use bioinformatic;
CREATE TABLE IF NOT EXISTS user(
  id int not NULL COMMENT '用户ID'  auto_increment,
  name  VARCHAR(20) not NULL ,
  password VARCHAR(32) not NULL,
  PRIMARY KEY(id),
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

##### 查看表结构

`describe user`

```sql
mysql> describe user;
+----------+-------------+------+-----+---------+----------------+
| Field    | Type        | Null | Key | Default | Extra          |
+----------+-------------+------+-----+---------+----------------+
| id       | int         | NO   | PRI | NULL    | auto_increment |
| name     | varchar(20) | NO   |     | NULL    |                |
| password | varchar(32) | NO   |     | NULL    |                |
+----------+-------------+------+-----+---------+----------------+
```

#### 2.添加新的用户

`INSERT INTO user(name,password) VALUES('zpliu',md5('123456'));`

由于id字段是自动往上加的，所以添加的时候可以不填

```sql
+----+-------+----------------------------------+
| id | name  | password                         |
+----+-------+----------------------------------+
|  1 | zpliu | e10adc3949ba59abbe56e057f20f883e |
+----+-------+----------------------------------+
```



### 创建外键约束

+ 加上真实姓名

```sql
use bioinformatic;
CREATE TABLE IF NOT EXISTS user(
  id int not NULL COMMENT '用户ID'  auto_increment,
  name  VARCHAR(20) not NULL unique,
  password VARCHAR(32) not NULL,
  chineseName VarChAR(255),
  PRIMARY KEY(id),
  teacherID int not NULL,
  constraint fk_user_teacher_id FOREIGN KEY (`teacherID`) REFERENCES `teacher` (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

插入数据

```sql
//插入的外键必须已经存在，不然出错
INSERT INTO user(name,password,chineseName,teacherID) VALUES('zpliu',md5('123456'),"刘振平",1);
```



#### 外键关联查询

使用左连接

> 左连接是把左边的表作为主表，完全显示；右连接是把右边的表作为主表，完全显示。
>
> 而内连接（inner join或者join）只显示两张表中都能对应的数据

```sql
select user.* ,teacher.name from user left join teacher  on user.teacherID=teacher.id;
```





### 参考

mysql外键约束  https://blog.csdn.net/lvtula/article/details/81940429 