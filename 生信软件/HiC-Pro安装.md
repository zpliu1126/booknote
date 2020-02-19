# HiC-Pro安装

### 1.使用conda安装依赖

+ python版本为`2.7`

```bash
conda create -n hicpro python=2.7
conda install -y samtools bowtie2 R
```

### 2.安装对应的R包

+ 在当前conda环境下运行R
+ 也可以绝对路径运行R

```bash
R
install.packages(c('ggplot2','RColorBrewer'))
```



### 3.安装对应的python包

```bash
conda install -y pysam bx-python numpy scipy 
```

### 4.配置confir-install.txt安装文件

+ `PREFIX`软件安装路径，会在该路径创建一个`HiC-Pro_2.11.1`目录
+ `R_PATH`指定conda环境下的R
+ `PYTHON_PATH`指定conda环境下的python
+ `CLUSTER_SYSCLUSTER_SYS`集群调度系统为`TORQUE,SGE,SLURM,LSF`四个中的一种

```bash
PREFIX = /public/home/yxlong/yxlong/app/
BOWTIE2_PATH = /public/home/yxlong/miniconda3/bin/bowtie2
SAMTOOLS_PATH = /public/home/yxlong/miniconda3/bin/samtools
R_PATH = /public/home/yxlong/miniconda3/envs/hicpro/bin/R
PYTHON_PATH = /public/home/yxlong/miniconda3/envs/hicpro/bin/python
CLUSTER_SYS = LSF
```

