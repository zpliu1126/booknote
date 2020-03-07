# 使用vscode与服务端R交互

 在window上使用Rstudio对数据进行操作，当数据量太大的时候，电脑就会吃不消；于是可以考虑使用服务器端的R进行计算

常见3种方法

+ 1.`Rstudio-server`建立网页版的Rstudio，需要管理员权限
+ 2.使用conda安装Rstudio，再使用x-manger将信号转发，软件收费
+ 3.使用vscode与连接服务器，直接与服务端进行交互

我使用的是第3种方法

### 1.vscode安装插件

使用`Remote-SSH`插件连接服务器

+ 点击魔方图标，搜索关键字`remote-ssh`
+ 下载对应的插件即可

![插件下载](https://s2.ax1x.com/2020/03/07/3XwhHP.png)

### 2.使用`Remote-SSH`连接·服务器

#### 2.1如下所示进行信息的配置

#### ![3Xdbex.png](https://s2.ax1x.com/2020/03/07/3Xdbex.png)

#### 2.2配置信息如下

+ 如果存在墙的话，可以使用x-shell隧道将信号转发到本地

  参考 https://zpliu.gitbook.io/booknote/mysql/02sqlyog-ruan-jian-pei-zhi 进行隧道转发
  
  ![3XdfFU.png](https://s2.ax1x.com/2020/03/07/3XdfFU.png)



### 3.验证密码

+ 密码输入后就登录成功了

  ![3X02PU.png](https://s2.ax1x.com/2020/03/07/3X02PU.png)

+ 选择要显示的目录，这里需要再一次输入密码

  ***这里选择`.vscode`目录是方便vscode根据文件的变化情况进行自动刷新***
 ![3XBCIf.png](https://s2.ax1x.com/2020/03/07/3XBCIf.png)](https://imgchr.com/i/3XBCIf)

+ 登录成功后的样子
 ![3XDOud.png](https://s2.ax1x.com/2020/03/07/3XDOud.png)



### 4.给服务器装vscode的插件

+ `R`
+ `R LSP Client`

![3XsCIx.png](https://s2.ax1x.com/2020/03/07/3XsCIx.png)

#### 4.1分别对插件`R`和`R LSP Clint`进行配置

+ 主要就是将**服务器端的R执行脚本绝对路径**添加进去

![3XyY9K.png](https://s2.ax1x.com/2020/03/07/3XyY9K.png)

+ `R LSP Client`插件也是同样的进行配置

### 5.重启vscode

+ 再次输出服务器密码进行登录
+ 在目录下创建一个新的`test.R`文件

![3X6yZ9.png](https://s2.ax1x.com/2020/03/07/3X6yZ9.png)

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

![3X6xsg.png](https://s2.ax1x.com/2020/03/07/3X6xsg.png)



### 参考

1.  https://www.jianshu.com/p/0740b08e2a37 
2. [Writing R in VSCode: A Fresh Start](https://links.jianshu.com/go?to=https%3A%2F%2Frenkun.me%2F2019%2F12%2F11%2Fwriting-r-in-vscode-a-fresh-start%2F)
3. Writing R in VSCode: Interacting with an R session](https://links.jianshu.com/go?to=https%3A%2F%2Frenkun.me%2F2019%2F12%2F26%2Fwriting-r-in-vscode-interacting-with-an-r-session%2F)
4. [Remote Development using SSH](https://links.jianshu.com/go?to=https%3A%2F%2Fcode.visualstudio.com%2Fdocs%2Fremote%2Fssh)
5. [Quick start: SSH key](https://links.jianshu.com/go?to=https%3A%2F%2Fcode.visualstudio.com%2Fdocs%2Fremote%2Ftroubleshooting%23_quick-start-ssh-key)