# Appach代理服务转发node



### 配置文件

+ 打开一系列的插件
+ 配置反向代理

```bash
<VirtualHost 211.69.141.136:80>
       ServerName cotton.hzau.edu.cn
       DocumentRoot /var/www/html/cotton
       ServerAdmin robert@mail.hzau.edu.cn
	ErrorLog logs/cotton.errorlog
	Options +FollowSymLinks
	Proxyrequests off
	<proxy *>
	Order deny,allow
	Allow from all
	</proxy>
	ProxyPass /primer/  http://211.69.141.138:80/
	ProxyPassReverse /primer/  http://211.69.141.138:80/
</VirtualHost>
```



### 参考

1. https://blog.csdn.net/sforiz/article/details/79651643 

2. https://cnodejs.org/topic/50f90289df9e9fcc58a5015c 
3. nginx 反向代理  https://www.bilibili.com/video/av58516750 



