### 添加新用户

`useradd 用户名 -d 家目录`



### 查看用户登录记录

```bash
 last -f /var/log/wtmp|less
```



### 配置DNS解析服务器

参考  https://www.cnblogs.com/wtliu/p/9334638.html 

```bash
cat  /etc/resolv.conf
## DNS服务器地址
nameserver 8.8.8.8
nameserver 8.8.4.4

```



### 根据端口号杀死程序

```bash
### 获取端口号
netstat -lnp|grep 80
#tcp        0      0 :::80                       :::*                        LISTEN      35894/node 
### 杀死对应程序

```



### 快速删除大文件夹

当一个文件夹中包含有很多小文件的时候，使用`rsync`命令快速删除文件夹

+ 首先创建一个空文件夹，利用这个空文件夹快速删除目标文件夹

```bash
rsync --delete-before -a -H -v --progress --stats  /home/aniya/空文件夹 目标文件夹
```

### SSH转发信号

```bash
ssh -L 4000:localhost:8889 用户@服务器主机 -p 22 -u genome
```



