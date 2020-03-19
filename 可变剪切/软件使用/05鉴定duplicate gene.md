# 05鉴定duplicate gene



### blastp比对

首先使用整个基因组的蛋白序列进行比对

+ `-evalue 1e-10` 筛选指标
+ `-outfmt 6`下一步 MCScanX  要使用的格式
+ `-num_threads 20`线程数目

**如果存在多个转录本的情况下默认用第一个转录本代表这个基因**

提取第一个转录本代表这个基因的氨基酸序列

```bash
awk 'NR==1&&$1~/^>/{print $0}NR>=2&&$1~/^>/{print "\n"$0}$1~/^[^>]/{printf $0}' Ghirsutum_gene_peptide.fasta|grep -E "Ghir_A[^\.]*\.1$" -A 1|sed -e 's/-//g' -e 's/\.1//g'
```

```bash
## 建库
makeblastdb -dbtype 'prot' -parse_seqids  -in Dt_peptide.fa  -out blastpDB/Dt
# 比对
blastp -query At_peptide.fa  -db At  -evalue 1e-10   -num_threads 20 -outfmt 6 -out At_vs_At.blast
## 提交LSF任务
bsub -J Dt_Dt -q "normal" -n 20 -R span[hosts=1] -e Dt_Dt.err -o Dt_Dt.out "blastp -query ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Dt_peptide.fa  -db ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/blastpDB/Dt -evalue 1e-10   -num_threads 20 -outfmt 6 -out  Dt_vs_Dt.blast"

```

### 安装MCScanX

报错

```bash
error: ‘getopt’ was not declared in this scope
dissect_multiple_alignment.cc中添加头文件
#include <getopt.h>
‘chdir’ was not declared in this scope
添加头文件 #include <unistd.h>
```



```bsah
$ unzip MCscanX.zip
$ cd MCScanX
$ make
```

使用说明

 http://chibba.pgml.uga.edu/mcscan2/documentation/manual.pdf 

#### 制作对应的gff文件

```bash
awk '$1~/Ghir_A/&&$3~/gene/{print $0}' Ghirsutum_genome_HAU_v1.0/Ghirsutum_gene_model.gff3|awk -F ";" '{print $1}'|awk '{print $1"\t"substr($9,4)"\t"$4"\t"$5}'
```

### 鉴定共线性区域

+ `-g ` gap penalty

```bash
~/software/MCScanX/MCScanX -g -3 A2_A2/A2_vs_A2
```



#### 下游的画点图程序

```bash
#运行dot_plotter图只能在软件的downstream那个文夹内进行
java dot_plotter -g gff_file -s collinearity_file -c control_file -o output_PNG_file
```

<img src="https://s2.ax1x.com/2020/03/08/3zUSmR.png" alt="点图" style="zoom:50%;" />

#### 对duplicate gene进行分类

在输出文件中`*.gene_type`概括了gff中所有基因的duplicate类型

+ `  singleton `没有基因与它重复 0
+  `proximal`  in nearby chromosomal region but not adjacent  2
+   `tandem` (consecutive repeat) 串联重复 3
+  ` whole genome /segmental` (i.e. collinear genes in collinear blocks) 全基因组重复 4
+  `dispersed` (other modes than segmental, tandem and proximal)  1

```bash
 ./duplicate_gene_classifier dir/xyz
```



## 鉴定homologous gene

### 1.运行All-vs-All-blastp

+ 使用基因的第一个转录本的氨基酸序列进行blastp
+ 在不同基因组之间进行blastp时，先将两个基因组对应的fasta文件合并为单个fasta文件，使用合并后的fasta文件分别做query和database

```bash
bsub -J "D5_vs_Dt" -q "smp" -n 20 -R span[hosts=1] -e %J.err -o %J.out "blastp -query ${DBDir}/D5_vs_Dt_pep.fasta -db ${DBDir}/D5_vs_Dt -evalue 1e-10 -num_threads 20 -outfmt 6 -out D5_vs_Dt.blast"
```



### 2.运行MCScanx

+ `-g  -3`空位罚分-3
+ `-s 5` 共线性区域最小基因对数目

```bash
~/software/MCScanX/MCScanX -g -3 -s 5 A2_A2/A2_vs_A2
```



### 3.筛选同源基因对

当有一基因与多个基因同源的时候，优先选择block更大的组合;所以对共线性文件进行格式上的处理

```bash
awk '$0~/Alignment/{split($0,a," ");b=substr(a[6],3)}$1~/^[^#]/{print $0"\t"b}'  A2_vs_At.collinearity
```

输出格式如下

+ 第一列为block ID
+ 第二列为block里对应的gene id
+ 最后一列为block内含有的基因对的数目

```bash
  0-  0:	evm.model.Ga01G1089	evm.model.Ga02G0007	 2e-134	15
  0-  1:	evm.model.Ga01G1104	evm.model.Ga02G0010	      0	15
  0-  2:	evm.model.Ga01G1106	evm.model.Ga02G0012	      0	15
```

最终一行命令解决

+ 先提取每个block的大小
+ 整理格式
+ 按照基因名、block大小进行逆序排序
+ uniq忽略前3列进行去重
+ 两列基因都需要进行去重

```bash
awk '$0~/Alignment/{split($0,a," ");b=substr(a[6],3)}$1~/^[^#]/{print $0"\t"b}'  A2_vs_D5.collinearity |awk -F "\t" '$2~/evm/&&$3~/Gor/{split($1,a,"-");print a[1]"\t"$2"\t"$3"\t"$5}$2~/Gor/&&$3~/evm/{split($1,a,"-");print a[1]"\t"$3"\t"$2"\t"$5}'|sort -t $'\t' -k2,2 -k4,4nr|awk -F "\t" '{print $1,$3,$4,$2}' OFS="\t"|uniq -f3|awk -F "\t" '{print $1,$3,$4,$2}' OFS="\t"|sort -k4,4 -k2,2nr -t $'\t'|uniq -f3|awk '{print "Aligment_"$1"\tBlockCount_"$2"\t"$3"\t"$4}'|wc -l
```



### 4.筛选四个基因组都同源的基因

+ A2_vs_At_vs_D5

  根据A2与At的同源关系找到对应的与A2同源的D5

+ A2_vs_D5_vs_Dt 

  根据D5与Dt的同源关系找到对应的与D5同源的A2

+ 把两个文件A2_vs_At_vs_D5、A2_vs_D5_vs_Dt 中共有的基因对找到

+ 根据共有的A2 vs D5 基因对找到对应于四倍体的At、Dt

+ 将找到的At、Dt基因对与A2_vs_D进行比较，过滤一遍

  

  



