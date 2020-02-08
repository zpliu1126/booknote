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





