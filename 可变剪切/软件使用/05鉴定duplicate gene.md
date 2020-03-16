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



