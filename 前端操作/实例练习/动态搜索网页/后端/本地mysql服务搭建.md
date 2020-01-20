# mysql服务

***由于集群里墙放入原因，在实验代理服务器进行访问的时候总是没有http响应，所以干脆直接在自己的windows上装一个mysql进行测试；等代码都测试好之后再搬到服务器上***

## For windows 

### 1.初始化

这一步会得到一个初始的root账号密码，待会会用得到` A temporary password is generated for root@localhost: agAz5+3XldKw`

```bash
 mysqld --initialize --user=mysql --console
```

### 2.安装mysql

```bash
mysqld --install
```

### 3.启动服务

```bash
net start mysql
```

### 4.修改root用户密码

```bash
##系统会强制你修改初始密码;不然不能执行sel语句
 alter user user() identified by "123456";
```

### 5.vscode连接本地数据库

总是报错`ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol`

原来mysql最新版本默认使用，严格的密码认证；修改密码认证方式

```bash
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER; (修改加密规则 （必写）)
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'; (更新用户密码 )
FLUSH PRIVILEGES; #刷新权限
```





### 参考

缺失库 https://blog.csdn.net/qq_42365534/article/details/102847013 

 https://www.cnblogs.com/reyinever/p/8551977.html 

 https://www.jianshu.com/p/c8eb6d2471f8 