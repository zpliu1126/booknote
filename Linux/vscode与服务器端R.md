# 使用vscode与服务端R交互



vscode 一款让人爱不释手的IDE，也是前端工程师一大杀器。在window上使用R对数据进行操作，当数据量太大的时候，电脑就会吃不消；而服务端的R一看起来就灰常的枯燥。加上最近vscode增加了对R语言的支持，使得在vscode中编写R脚本变成现实，vscode多session的特点使得能够同时打开多个窗口使用服务端的R进行大数据的计算。

***

服务端R使用常见3种方法

+ 1.`Rstudio-server`建立网页版的Rstudio，需要管理员权限
+ 2.使用conda安装Rstudio，再使用x-manger将信号转发，软件收费
+ 3.使用vscode与连接服务器，直接与服务端进行交互

我使用的是第3种方法

### 1.vscode安装插件

使用`Remote-SSH`插件连接服务器

+ 点击魔方图标，搜索关键字`remote-ssh`
+ 下载对应的插件即可

![插件下载](https://43423.oss-cn-beijing.aliyuncs.com/img/20200322221334.png)

### 2.使用`Remote-SSH`连接·服务器

#### 2.1如下所示进行信息的配置

![配置](https://43423.oss-cn-beijing.aliyuncs.com/img/20200322221557.png)



#### 2.2配置信息如下

+ 如果存在墙的话，可以使用x-shell隧道将信号转发到本地

  参考 https://zpliu.gitbook.io/booknote/mysql/02sqlyog-ruan-jian-pei-zhi 进行隧道转发
  

![隧道转发](https://43423.oss-cn-beijing.aliyuncs.com/img/20200322221722.png)



### 3.验证密码

+ 密码输入后就登录成功了

![输入密码](https://43423.oss-cn-beijing.aliyuncs.com/img/20200322221756.png)

+ 选择要显示的目录，这里需要再一次输入密码

  ***这里选择`.vscode`目录是方便vscode根据文件的变化情况进行自动刷新***

![选择目录](https://43423.oss-cn-beijing.aliyuncs.com/img/20200322221818.png)


+ 登录成功后的样子

![登录成功](https://43423.oss-cn-beijing.aliyuncs.com/img/20200322221837.png)



### 4.给服务器装vscode的插件

+ `R`
+ `R LSP Client`

![服务端插件](https://43423.oss-cn-beijing.aliyuncs.com/img/20200322221903.png)

#### 4.1分别对插件`R`和`R LSP Clint`进行配置

+ 主要就是将**服务器端的R执行脚本绝对路径**添加进去

![插件配置信息](https://43423.oss-cn-beijing.aliyuncs.com/img/20200322221921.png)

+ `R LSP Client`插件也是同样的进行配置

### 5.重启vscode

+ 再次输出服务器密码进行登录
+ 在目录下创建一个新的`test.R`文件

![脚本编写](https://43423.oss-cn-beijing.aliyuncs.com/img/20200322221943.png)

+  在`test.R`文件中编写脚本

  ```R
  install.packages("ggplot2")
  require(ggplot2)
  qplot(carat, price, data = diamonds, xlab = "hhh", xlim = c(1, 5))
  ```

+ 快捷键`ctrl + enter`按行执行脚本
+ `ctrl + shift +s`执行整个文件

#### 5.1最终效果

+ vscode能够自动跟踪文件的变化，刷新图片进行显示

![效果图](https://43423.oss-cn-beijing.aliyuncs.com/img/20200322222001.png)



### 参考

1.  https://www.jianshu.com/p/0740b08e2a37 
2. [Writing R in VSCode: A Fresh Start](https://links.jianshu.com/go?to=https%3A%2F%2Frenkun.me%2F2019%2F12%2F11%2Fwriting-r-in-vscode-a-fresh-start%2F)
3. [Writing R in VSCode: Interacting with an R session](https://links.jianshu.com/go?to=https%3A%2F%2Frenkun.me%2F2019%2F12%2F26%2Fwriting-r-in-vscode-interacting-with-an-r-session%2F)
4. [Remote Development using SSH](https://links.jianshu.com/go?to=https%3A%2F%2Fcode.visualstudio.com%2Fdocs%2Fremote%2Fssh)
5. [Quick start: SSH key](https://links.jianshu.com/go?to=https%3A%2F%2Fcode.visualstudio.com%2Fdocs%2Fremote%2Ftroubleshooting%23_quick-start-ssh-key)
6.  Rsudio[快捷键](https://www.jianshu.com/p/5b69c84f2bf6) 