## Script of scripts (SOS)

> 整合多个语言到单个juoyter notebook，同时能够在大数据集处理过程中批量化的运行，提交到LSF脚本等

#### 1.安装

```bash
## 进入conda 环境
conda activate jupyter 
## 安装SOS
conda install sos sos-pbs -c conda-forge
## 安装SOS notebook
conda install sos-notebook jupyterlab-sos sos-papermill -c conda-forge
## 安装对应的sos插件，会安装一个R和python、bash
conda install sos-r sos-python sos-bash -c conda-forge
## 只安装插件，使用系统R
pip install sos-r
pip install sos-c
pip install sos-python
```

#### 2.在jupyter中注册对应的内核

```bash
python -m sos_notebook.install
##查看安裝的内涵
jupyter kernelspec list
## 移除环境
jupyter kernelspec remove sos
```

#### 3.非必须的模块

+ graphviz
+ imageio
+ pillow
+ PIL
+ pysam

#### 4.使用说明

> 允许在一个jupyter notebook中运行多种语言，同时方便在不同语言之间实现变量的传递。
>
> 并且SOS是python3内核的扩展，因此可以在SOS kernel中使用python3即可运行
>
> 文档地址: https://vatlab.github.io/sos-docs/doc/user_guide/multi_kernel_notebook.html

+ SOS作为管理其他kernel的kernel，在jupyter的每个cell属于SOS kernel或者其子kernel
+ 每个cell的命令可以手动的选择语言，或者是使用magic 命令

![样式](https://vatlab.github.io/sos-docs/doc/media/JupyterNotebook.png)

##### 1.手动设置内核

手动的设置内核，在每个cell的开头使用`magic`命令；如果当前没有声明语言，自动继承前一个cell的kernel

+ `%use R` 使用R语言处理当前cell
+ `%use SOS` 使用SOS，也就是扩展的python3内核

##### 2.使用子内核

+ `%expand`准备输入在进入到kernel之前
+ `%capture` 捕获内核的输出
+ ` %render `渲染内核的输出，将txt文件以markdown形式输出

```python
%use SOS
excel_file = 'data/DEG.xlsx'
csv_file = 'DEG.csv'
figure_file = 'output.pdf'
```

```python
## 使用之前定义好的变量
%expand
xlsx2csv {excel_file} > {csv_file}
```

##### 3.使用其他子kernel的变量

> 其实并不是传递，而是在python内核中创建了一个同样名字和相同数据类型的变量

```python
##捕获来自R kernel的变量mtcars
%get mtcars --from R
mtcars
##主动的抛出一个变量
%put data1
 data1 <- data + 1
## %with 和-i 与-o参数连用
## 将Rkernel中的变量n传入，并且抛出变量arr
%with R -i n -o arr
```

> **SOS不能保证在内核之间数据类型完全一致，甚至不能保证数据的无损交换**

![变量传递](https://vatlab.github.io/sos-docs/doc/media/data_exchange.png)

##### 4.预览变量

> 文档：https://vatlab.github.io/sos-docs/doc/user_guide/magic_preview.html

```python
%preview test.png -n
```

##### 5.所有magic命令

> https://vatlab.github.io/sos-docs/doc/user_guide/sos_magics.html

+ `%runfile -h`执行指定脚本
+ `%save -h`保存当前cell到一个文件

#### 5.命令行版本SOS

```python
## 查看参数
!sos -h
## 简写shortcut ----sos run
sos-runner 

```

执行SOS notebook

```bash

```



### 参考

1. [scirpt of scripts](https://vatlab.github.io/sos-docs/)











