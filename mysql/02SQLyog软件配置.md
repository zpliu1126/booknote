# SQLyog

### 1.软件安装

参考 博客https://blog.csdn.net/lihua5419/article/details/73881837/ 



### 2.解决局域网访问mysql

#### 2.1xshell进行端口转发

在使用xshell连接到目标服务器之后，进信号转发到本地端口

![配置端口转发](https://s2.ax1x.com/2020/02/27/3d3lgf.png)

#### 2.2SQLyog通过xshell转发端口连接目标服务器

![连接远程服务器](https://s2.ax1x.com/2020/02/27/3d8aee.png)

#### 2.3 连接mysql服务

![mysql服务连接](https://s2.ax1x.com/2020/02/27/3d8ySP.png)



### 3.总结

1. 每次先打开xshell，连接到目标服务器之后将数据进行转发
2. 在使用SQLyog连接到转发端口，进行mysql服务的登录



### `SQLyog`快捷键

+ F9执行sql语句
+ F12格式化sql语句
+ TAB 自动补全

### 参考

1. SQLyog 破解版  https://blog.csdn.net/lihua5419/article/details/73881837/ 
2. 使用xshell进行端口转发
3. SQLyog快捷键  https://www.cnblogs.com/huaxingtianxia/p/5711521.html 