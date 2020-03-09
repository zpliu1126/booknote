# oh-my-zsh

使用oh-my-zsh美化命令行，效果图

[![效果](https://s2.ax1x.com/2020/03/09/8SbH8x.png)](https://imgchr.com/i/8SbH8x)

### 下载安装

需要使用到git工具，所以提前下载好git，至今把整个仓库clone下来

在仓库的`tools`目录下有安装程序

```bash
git clone git@github.com:ohmyzsh/ohmyzsh.git
```

由于我是普通用户，没有获得`zsh`shell的账号，所以直接先指定好环境变量再进行安装

zsh的全局环境变量是`$FPATH`，直接复制下面这段代码放到`~/.bash_profie`配置文件中即可

```bash
#########zsh####################
FPATH=${HOME}/.oh-my-zsh/plugins/git:${HOME}/.oh-my-zsh/functions:${HOME}/.oh-my-zsh/completions:/usr/share/zsh/site-functions:/usr/share/zsh/5.0.2/functions:${HOME}/.oh-my-zsh/plugins/python:${HOME}/.oh-my-zsh/plugins/pip
export FPATH
#进入zsh
/usr/zsh
```

执行安装程序

**是否切换当前shell式，选择否**

```bash
sh install.sh
```

![安装成功后](https://s2.ax1x.com/2020/03/09/8SOqx0.png)

### 选择主题

+ 编辑`~/.zshrc`文件
+ 修改`ZSH_THEME`变量，我用的是ys主题
+ source配置文件`source ~/.zshrc`



### 在zsh中使用conda

`conda init zsh`

***

主题选择

 https://github.com/ohmyzsh/ohmyzsh/wiki/themes 

### 参考

 https://github.com/ohmyzsh/ohmyzsh 



