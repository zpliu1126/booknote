

## HiCPlotter安装

### Usage：

```bash
/public/home/zpliu/miniconda3/envs/Python2-dev/bin/python2 /public/home/zpliu/github/HiCPlotter/HiCPlotter.py -h
```

### 1.源文件下载

HiCPlotter是一款开源软件，源代码存储在github仓库中。

`https://github.com/kcakdemir/HiCPlotter`

+ 直接在服务器中下载

  + `--depth=1`只下载最近一次commit，节省时间

  ```bash
  ## 源文件将保存在当前路径/HiCPlotter/下
  git clone git@github.com:kcakdemir/HiCPlotter.git --depth=1
  ```

+ 下载到windows再发送到服务器内

### 2.安装依赖

> Please note: scipy, numpy and matplotlib modules should be installed and updated to current version. Following versions of numpy (1.9.0, 1.9.2), scipy (0.14.0, 0.15.1) and matplotlib (1.3.1, 1.4.3) have been tested successfully.  

+ numpy
+ scipy
+ matplotlib

**HiCPlotter**依赖于python2.7，所以所有的python包都是在python2.7中下载

+ `--user`普通用户，没有root权限情况下使用
+ 安装numpy 在安装scipy 最后安装matplotlib

```bash
##安装numpy
pip2.7 install numpy==1.10.4 --user
##安装scipy
pip2.7 install scipy==0.17.0 --user
##安装matplotlib
pip2.7 install matplotlib==1.5.1 --user
```

### 3.测试

```bash
##进入源文件
cd path-to/HiCPlotter
## 解压测试数据
gunzip  ./data/HiC/Human/hES-nij.chr21.2.gz -v
## Basic Plot
python2 HiCPlotter.py -f data/HiC/Human/hES-nij.chr21.2 -n hES -chr chr21 -r 40000 -o default1 -fh 0
```

### 4.开放权限给其他账户

+ 开放python 包安装目录
+ 在python脚本中添加包搜索路径

```bash
##修改包目录权限
 chmod 755 -R  ~/.local/lib/python2.7/site-packages/

##HiCPlotter.py脚本中添加包搜索路径
import os,sys
sys.path.append("/public/home/zpliu/.local/lib/python2.7/site-packages")
import platform
```

其他用户如何使用：

+ 推荐使用第一种方式运行，因为用户自己目录下可能也存在numpy等包，存在版本冲突的可能

```bash
# 1.使用我安装的python2.7运行(推荐)
/public/home/zpliu/miniconda3/envs/Python2-dev/bin/python2 /public/home/zpliu/github/HiCPlotter/HiCPlotter.py -h
# 2.使用用户自己的python2运行(不建议，有可能会存在包冲突)
python2 /public/home/zpliu/github/HiCPlotter/HiCPlotter.py -h
```

### 5.安装错误

这里错误主要就是两类：

+ 使用python2而不是python3

+ `numpy`、`scipy`、`matplotlib`包的版本不对

我环境中有两个版本的python2，我在使用pip安装`numpy`等包时，安装包被安装在`~.local/lib/python2.7/site-packages/下

而我使用的python2是`SMARTLink`软件中自带了，在运行测试数据时，总是报版本错误

```bash
##查看包的安装位置和版本号
>>> import numpy
>>> numpy.__version__
'1.10.4'
>>> numpy.__path__
['/public/home/zpliu/.local/lib/python2.7/site-packages/numpy']
```

在开放其他用户权限时的错误

`  ImportError: No module named mpl_toolkits.axes_grid1`

```bash
##主要是mpl_toolkits包中没有__init__.py文件
cd /public/home/zpliu/.local/lib/python2.7/site-packages/mpl_toolkits/
touch __init__.py
```


### 参考

1. [源码编译python](https://blog.csdn.net/jiduochou963/article/details/86694775)
2. [快速删除大文件夹](https://blog.csdn.net/anljf/article/details/6780005)
3. python[模块化](https://blog.csdn.net/weixin_34114823/article/details/92862081?depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1&utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1)
4. [conda](https://www.jianshu.com/p/edaa744ea47d)

