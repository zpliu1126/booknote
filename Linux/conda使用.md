## 如何使用Conda

在日常数据的分析过程中，我们往往会使用许许多多的软件；这些软件需要不同的依赖举个例子A软件需要python2的环境而B软件需要python3的环境，因此当你使用python去运行软件的时候往往敲下的命令像这样`python A.py`；这时候就需要仔细检查一下python是否是正确的版本`python2|python3`。

不仅仅是python版本的问题，甚至有些软件在python包上也会有冲突，这样就很难办了；例如A软件需要的是`numpy 1.0.4`而B软件需要的是`numpy 1.2.4`；这时候运行不同的软件你就需要去指定加载不同版本的`numpy`包了。

conda的出现减少我们在软件安装上带来的困惑，让更多的精力投入到数据分析中。

### 预备知识

>  **环境变量:** 操作系统运行时的一些参数和系统配置；为了方便**统称内存**吧

简单的来说就是当系统启动的时候，一些东西就被加入到操作系统中，在这个环境下；你可以从内存中取出这个变量的值；但是我们系统的内存是有限的，不可能把所有的文件信息、位置存到内存中；我们仅仅只把一些系统关键信息、常用到的一些东西存进内存。

做个简单的示范

> 假设我在当前环境设置一个变量a=10；再开启一个子进程是就访问不了这个变量a了；
>
> 但是把它加入到内存后，在子进程中同样可以访问到这个变量

```bash
###没加入环境变量
(base) [zpliu@mn02 cdHit]$ a=10
(base) [zpliu@mn02 cdHit]$ bash   ##开启子进程
(base) [zpliu@mn02 cdHit]$ echo $a
#值为空

###加入环境变量中
(base) [zpliu@mn02 cdHit]$ export a=10  ##加入环境变量
(base) [zpliu@mn02 cdHit]$ bash    ##进入子进程
(base) [zpliu@mn02 cdHit]$ echo $a
10

```

### 安装`MiniConda`

下载安装包后，正常情况一路点确定就行，并且会下载一些包用于MiniConda的初始化；

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
```

安装完成后脚本会自动在`~/.bashrc`文件中添加一些配置信息

```bash
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/public/home/lqiao/miniconda3/bin/conda' 'shell.bash' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/public/home/lqiao/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/public/home/lqiao/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/public/home/lqiao/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<
```

接下来只需要重新加载一下配置文件就可以使用`conda`了

```bash
##重新加载bashrc文件
source  ~/.bashrc
```

### 添加清华镜像源

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/  
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/  
conda config --set show_channel_urls yes  
##添加bioconda源
# bioconda
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/bioconda/
conda config --set show_channel_urls yes
```

### Conda的正确使用姿势

每个软件的依赖项不一样，因此在使用的时候，尽量给每个软件创建一个单独的环境；保证软件能够正常的运行。

下面以安装计算遗传复杂度软件`xlcpr`为例，`xlcpr`是基于python3的，因此安装是就需要制定python的版本

#### 1.创建`xlcpr`环境

环境名可以和软件名字一样方便回忆，我这里就取xcplr了

```bash
conda create -n  xpclr python=3.8.3
```

#### 2.安装依赖

一般软件对应的文档会有命令的

+ `-n`指定对应的环境

```bash
conda activate xcplr ##进入环境
conda install xpclr -c bioconda -y

##或者不进入环境就安装包
conda install xpclr -c bioconda -y -n xpclr  ##-n就是指定环境用的
```

安装完成后在当前环境变量就会有`xcplr`这个可执行脚本了

```bash
xcplr -h 
```

#### 3.退出环境

```bash
conda deactivate xlcpr
```

#### 4.删除环境

如果有的软件不用了，也可以直接把对应的整个环境给删除掉

```bash
conda remove -n xpclr --all
```

5.列出环境中已经安装的包

```bash
conda list -n xlcpr
```

### conda进阶

接下来这部分主要讲conda的大致实现原理,

```bash
conda info  ##查看conda的详细信息
```

最主要的信息就是

```bash
package cache : /public/home/zpliu/miniconda3/pkgs
                          /public/home/zpliu/.conda/pkgs
envs directories : /public/home/zpliu/miniconda3/envs
                          /public/home/zpliu/.conda/envs

```

每次下载依赖的时候，conda会去检测`package cache`中是否含有对应版本的包，conda会拷贝一份到对应环境，没有就会下载一份。

再说说`envs directories`这个变量吧。

### 【持续更新】错误集锦

+ 安装包错误

  > failed with initial frozen solve Retrying with flexible solve.

  解决办法
  
  ```bash
   conda config --add channels conda-forge
   conda config --set channel_priority strict
  ```
  
  
