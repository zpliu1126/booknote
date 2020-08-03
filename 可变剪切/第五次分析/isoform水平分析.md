### 转录本数目的统计

统计文件`07_annotation/isoseq.info.gtf`中注释为转录本的数目

```bash
├── isoseq.info.gtf  ##PacBio isoform所有转录本的注释信息，包括lncRNA
├── matchAnnot_result.txt  ##比对上参考基因组的转录本，不能说它就能够代表参考基因组的转录本
├── matchannot_stat.xls  ##统计转录本数、与参考基因组对应的转录本数
├── merge.gtf   ##把参考基因组注释转录本和PacBio转录本合并，其中参考基因组的转录本信息用PacBio进行代替

awk '$3~/trans/{print $0}' isoseq.info.gtf |grep "Gh"|wc -l
```

| 基因组 | PacBio转录本数目                 |
| ------ | -------------------------------- |
| A2     | 71424                            |
| D5     | 54485                            |
| TM1    | 89411                            |
| At     | 42382                            |
| Dt     | 43642     ##还有一些注释为新基因 |

#### 考虑去一下冗余看看效果会不会好一些，这个还是得单个单个基因跑一下试试

```bash
	/public/home/zpliu/github/cd-hit-v4.8.1-2019-0228/bin/cd-hit-est -i ../Ga_isoform.fa  -o 1111 -c 0.99 -n 10 -d 0 -M 0 -T 8
python changeFasta.py -fa ~/work/Alternative/result/Ga_result/CO11_12_result/06_Alignment/test.fa  -gtf ~/work/Alternative/result/Ga_result/CO11_12_result/07_annotation/isoseq.info.gtf  -o Ga_isoform.fa
##进行冗余分析
/public/home/zpliu/github/cd-hit-v4.8.1-2019-0228/bin/cd-hit-est -i ../Ga_isoform.fa  -o 1111 -c 0.99 -n 10 -d 0 -M 0 -T 8
##提取去冗余后的序列信息
awk -F "," '{print $2}' A2_merge_isoform |sed -e 's/>//g' -e 's/\.\.\. \*//g'  -e 's/ //g'|xargs  -I {} grep {}   Ga_isoform.fa  -A1 >A2_merge.fa

/public/home/zpliu/github/cd-hit-v4.8.1-2019-0228/bin/cd-hit-est -i A2_D5.fa -o 1111 -c 0.95 -n 10 -d 0 -M 0 -T 8
```

去重冗余后的结果

| 基因组 | 去除冗余后结果 |
| ------ | -------------- |
| A2     | 52517          |
| D5     | 40440          |
| At     | 32939          |
| Dt     | 33874          |
| TM1    | 66950          |

统计包含转录本的基因数，以及转录本大于2的基因数

```bash
##统计基因数目
sed 's/[^>]*>//g' TM1_merge_isoform |cut -f1 -d "-"|grep "Ghir_D"|sort |uniq |wc -l
##统计基因包含转录本的个数
sed 's/[^>]*>//g' A2_merge_isoform |cut -f1 -d "-"|grep "EVM"|sort |uniq -c |awk '{print $1}'|sort |uniq -c
```

| 基因组 | 基因数 | 含有多个转录本的基因数 |
| ------ | ------ | ---------------------- |
| A2     | 21038  |                        |
| D5     | 19001  |                        |
| TM1    | 32182  |                        |
| At     | 15734  |                        |
| Dt     | 16382  |                        |

> 使用matplotlib绘制直方图和密度分布图

```bash
##绘图数据
sed 's/[^>]*>//g' A2_merge_isoform |cut -f1 -d "-"|grep "EVM"|sort |uniq -c|awk '{print $1"\t"$2}'  >isoform_count_gene.txt 
```











### 同源基因间保守转录本的鉴定

使用github中`CD-HIT-EST`软件包进行计算；

> 代码仓库 : https://github.com/weizhongli/cdhit

为了方便比较不同基因组的情况，需要把fasta的isoform id信息加上基因编号

###### 计算流程

+ 将`06_Alignment/all.collapsed.rep.fa`文件去除`|Ghir_A10:229-4314(+)|`等后缀
+ 添加基因Id信息`07_annotation/isoseq.info.gtf`处理成`>Ghir_A10G000010-PB.1`
+ 合并两个同源基因的fasta序列，用`CD-HIT`进行分析

```bash
##根据去冗余后的序列鉴定同源基因间保守的isoform

```







