# MongoDB 数据库

关系型数据库

+ 设计表的结构

 + 使用sql语句进行增删改查
   + 主键约束
   + 默认值
   + 非空
   + 唯一

非关系型数据库

 + 键值对没有表的关系，只有键值对的关系key-value

   

> 在MongoDB中是最像关系型数据库的非关系型数据库

	+ 数据库->数据库
	+ 数据表->集合
	+ 表记录->（文档对象）

**MongoDB不需要设计表结构，可以任意的添加数据不需要结构性**

***

**1.常用参数**

mongod 是MongoDB系统的主要守护进程，用于处理数据请求，数据访问和执行后台管理操作，必须启动，才能访问MongoDB数据库。

在启动mongod时，常用的参数是：

- **--dbpath <db_path>**：存储MongoDB数据文件的目录
- **--directoryperdb**：指定每个数据库单独存储在一个目录中（directory），该目录位于--dbpath指定的目录下，每一个子目录都对应一个数据库名字。Uses a separate directory to store data for each database. The directories are under the --dbpath directory, and each subdirectory name corresponds to the database name.
- **--logpath <log_path>**：指定mongod记录日志的文件
- **--fork**：以后台deamon形式运行服务
- **--journal**：开始日志功能，通过保存操作日志来降低单机故障的恢复时间
- **--config**（或-f）<config_file_path>：配置文件，用于指定runtime options
- **--bind_ip <ip address>**：指定对外服务的绑定IP地址
- **--port <port>**：对外服务窗口
- **--auth**：启用验证，验证用户权限控制
- **--syncdelay<value>**：系统刷新disk的时间，单位是second，默认是60s
- **--replSet <setname>**：以副本集方式启动mongod，副本集的标识是setname

### 1.下载安装

	+	[下载地址](https://www.mongodb.com/download-center/community)
	+	选择server版本下载

+ 启动服务报错

  ```bash
  ** WARNING: Access control is not enabled for the database.
  //没有启用访问控制，对数据库不安全
  ```

  使用admin数据库，创建新用户

  参考链接 https://blog.csdn.net/sunbocong/article/details/78106096

  ```mysql
  use admin
  db.createUser({
  ... ... ... user:"zpliu",
  ... ... ... pwd:"mysql",
  ... ... ... roles:[{role:"useAdminAnyDatabase",db:"admin"}]
  ... ... ... })
  //执行结果
  Successfully added user: {
  	"user" : "zpliu",
  	"roles" : [
  		{
  			"role" : "userAdminAnyDatabase",
  			"db" : "admin"
  		}
  	]
  }
  ```

  开启控制访问，并且使用刚创建的用户进行登录

  ```mysql
  mongod --auth
  //用户登录访问
   mongo  -u "zpliu" -p "mysql" --authenticationDatabase "admin"
  ```

+ 重启mongoDB报错

  ```shell
   Failed to set up listener: SocketException: Address already in use
  ```

  查看当前进程是否存在mongod进行，杀死，然后清空sock文件，在/tem/目录下

+ centos7中特有的错误

  参考： https://blog.csdn.net/sunbocong/article/details/78106096

  ```shell
  ** WARNING: /sys/kernel/mm/transparent_hugepage/enabled is 'always'.
  **        We suggest setting it to 'never'
  ** WARNING: /sys/kernel/mm/transparent_hugepage/defrag is 'always'.
  **        We suggest setting it to 'never'
  ```

  这是centos为了提升内存性能设置的单数据库厂商建议关闭；我就不管了

+ 使用远程连接数据库

  

+ 使用普通用户启动数据库

  没有权限进入数据存储目录,直接修改目录所有者即可

  ```shell
  Attempted to create a lock file on a read-only directory: /data/db, terminating
  
  chown MongoDBuser -R /data/db/ 
  ```

  

### 2.报错总结

+ 权限不足的问题

  一般是账户对当前的数据库没有相应的操作权限导致的

  ```
  "not authorized on admin to execute command "
  ```

  

