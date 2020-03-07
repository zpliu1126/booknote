# 教师表



### 创建教师表

```bash
use bioinformatic;
CREATE TABLE IF NOT EXISTS teacher(
  id int not NULL COMMENT '教师id'  auto_increment,
  name  VARCHAR(20) not NULL ,
  PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

### 修改列名

```sql
 alter table teacher change column name teacher_name varchar(20);
```



### 插入字段

```bash
INSERT teacher (`teaher_name`) VALUES ('张献龙'),('朱龙付'),('郭小平'),('林忠旭'),('金双侠'),('涂礼莉'),('杨细燕'),('王茂军'),('袁道军'),('闵玲'),('杨国正'),('聂以春');
```

```bash
mysql> select * from teacher ;
+----+--------+
| id | name   |
+----+--------+
|  1 | 张献龙 |
|  2 | 朱龙付 |
|  3 | 郭小平 |
|  4 | 林忠旭 |
|  5 | 金双侠 |
|  6 | 涂礼莉 |
|  7 | 杨细燕 |
|  8 | 王茂军 |
|  9 | 袁道军 |
| 10 | 闵玲   |
| 11 | 杨国正 |
| 12 | 聂以春 |
+----+--------+
```

### 查询

```sql
select * from teacher;
```





### 参考

1.mysql批量插入  https://blog.csdn.net/zxjiayou1314/article/details/52942809 