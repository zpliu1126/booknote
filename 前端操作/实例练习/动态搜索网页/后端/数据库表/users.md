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
  PRIMARY KEY(id)
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



