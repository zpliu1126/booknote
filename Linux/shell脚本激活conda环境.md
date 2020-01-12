# shell脚本激活Conda环境

### 不知道为啥出错误的用法

一开始使用conda的说明

```bash
#!/usr/bash
conda init bash
conda activate MACS
```

结果总是报错

```bash
CommandNotFoundError: Your shell has not been properly configured to use 'conda activate'.
To initialize your shell, run

    $ conda init <SHELL_NAME>

Currently supported shells are:
  - bash
  - fish
  - tcsh
  - xonsh
  - zsh
  - powershell
```



### 不知道为啥正确的用法

```bash
#!/usr/bin/bash
source /path_to_conda/activate MACS
```

### 显示当前所有环境的名称

```bash
conda env  list
```

### 创建新的环境

```bash
conda create -n 环境名 python=3.6
```

### 激活环境

```bash
conda activate 环境名
## 退出环境
conda deactivate 
```

## 删除环境

```bash
conda remove -n rcnn --all
```

### 安装依赖

```bash
## -n 指定在某个环境安装对应的依赖，还不知道怎么一行命令安装多个依赖
conda install -n SplAdder numpy -y
## -y 跳过询问
```



### 从本地安装依赖

1. 搜索对应的python packages

   网址 ` https://pypi.org/project ` 放到`  Anaconda3/pkgs `目录

2. 解压进入文件夹，进行安装

   ```bash
   tar -xvzf ...tar.gz
   cd 包文件夹
   ## 安装
   python setup.py install
   ```

3. 从Ancona下载的包进行安装

   网址镜像` https://repo.anaconda.com/pkgs/ `

   将下载包移动到`  Anaconda3/pkgs `目录下

   `conda install --use-local  ....tar.bz`安装

### 参考

[https://heary.cn/posts/%E5%9C%A8Shell%E6%88%96Bat%E8%84%9A%E6%9C%AC%E4%B8%AD%E6%BF%80%E6%B4%BBconda%E7%8E%AF%E5%A2%83/](https://heary.cn/posts/在Shell或Bat脚本中激活conda环境/)

 https://www.jianshu.com/p/edaa744ea47d 