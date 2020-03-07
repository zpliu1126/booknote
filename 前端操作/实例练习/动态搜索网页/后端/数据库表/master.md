# 学生信息表

### 创建数据表

```bash
use bioinformatic;
create TABLE IF not exists masterInfo(
  id int not NULL COMMENT '学生id'  auto_increment,
  name VARCHAR(20) not NULL,
  interest VARCHAR(200) NULL default "None",
  honor VARCHAR(200) NULL default "None",
  teacherId VARCHAR(40) not NULL,
  tel VARCHAR(25) not NULL,
  sex VARCHAR(1) not NULL,
  school VARCHAR(20) not NULL,
  transcript VARCHAR(200) not NULL,
  studentExperience  VARCHAR(300) NULL default "None",
  searchExperience  VARCHAR(300) NULL default "None",
  imgUrl VARCHAR(50) NULL default "None",
  primary key(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```



### 增加字段

```mysql
alter table masterInfo ADD COLUMN other VARCHAR(300) DEFAULT NULL
alter table  masterInfo ADD COLUMN undergraduateGrade VARCHAR(300) DEFAULT NULL
#籍贯
 alter table masterInfo ADD COLUMN home VARCHAR(30) DEFAULT NULL;
#英语水平
alter table masterInfo ADD COLUMN english VARCHAR(30) DEFAULT NULL
#计算机水平
alter table masterInfo ADD COLUMN computer VARCHAR(30) default NULL
#修改字段,类型
alter table masterInfo MODIFY column1 VARCHAR(500);
```



