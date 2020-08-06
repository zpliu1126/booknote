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

#### 提取去冗余后的转录本的序列

```bash
python extractIsoformSeq.py  -fa Gh_isoform.fa  -isoform TM1_merge_isoform  -o TM1_merge.fa 
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

### 使用`lr2rmats`更新转录本的注释

#### 安装

```bash
git clone https://github.com/Xinglab/lr2rmats.git --recursive
cd lr2rmats
make dependencies
make lr2rmats
export PATH=$PATH:$PWD/bin # To permanently modify your PATH, you need to add it to your ~/.profile or ~/.bashrc file. 
```

安装对应的依赖` snakemake`

```bash
 conda create -n  snakemake  -c conda-forge -c bioconda snakemake
```

**看了一下`Snakemake`这个配置文件，里面就不会自己调用minimap2 去建立索引，垃圾的一批；**

参考文件内的命令，手动建立索引文件

```bash
# Snakemake文件内部
"{params.minimap} -x splice {input} -d {output} -t {threads} 2> {log}"
minimap2  -d genome.fa.mmi Ghirsutum_genome_HAU_v1.0.fasta
##使用STAR建立基因组索引
"{params.star} --runMode genomeGenerate --runThreadN {threads} --genomeFastaFiles {input} --genomeDir {output} --outFileNamePrefix {log} >> {log}"
~/github/lr2rmats/bin/STAR  --runMode genomeGenerate --runThreadN 10 --genomeFastaFiles genome/G
hirsutum_genome_HAU_v1.0.fasta  --genomeDir  ./genome.STAR/
##修改一下文件的绝对路径，然后run起来
snakemake -p --snakefile  ./Snakefile  --configfile ./config.yaml
```

### 输出文件

在` output`文件夹中生成了几种gtf文件

+ `know.gtf`PacBio测的转录本在基因组注释文件中已经存在
+ `novel.gtf`PacBio测到的转录本与注释的转录本不一样，但是存在至少一个相同的剪切位点
+ `unrecog.gtf` PacBio中的剪切位点与参考基因组没有重叠
+ `updated.gtf`改进后的参考转录本信息；在原有基因组注释的基础上，加上`novel`转录本信息，并且这些新的转录本信息是由long-read和short read支持的。

### 使用lr2mats注释后的PacBio转录本

```bash
##统计转录本数目
cat samp1.novel.gtf samp1.known.gtf|awk '$3~/tran/&&$1~/Ghir/{print $0}'|wc -l

##统计基因数目
cat samp1.novel.gtf samp1.known.gtf|awk '$3~/tran/&&$1~/Ghir/{print $0}'|awk -F ";" '{print $1}'|cut -f9|grep "Ghir_A"|sort|uniq |wc -l
```

| 基因组 | 转录本数 | 基因数 | 平均每个基因转录本数 |
| ------ | -------- | ------ | -------------------- |
| A2     | 36485    | 16907  | 2.15                 |
| D5     | 31368    | 16327  | 1.92                 |
| At     | 30227    | 13134  | 2.3                  |
| Dt     | 21437    | 13681  | 1.56                 |
| TM1    | 51664    | 26815  | 1.92                 |

#### 似乎还不是这么回事

应该是获取`samp1.known.gtf`文件内的内容，在加上`update.gtf`内PacBio转录本的内容

> 并且这一步的long read 数据也不需要去冗余了

```bash
### PacBio know gtf 还得去重
sort -k1,1 -k4,5n samp1.known.gtf |uniq |cat - update.gtf |grep PB|awk '$3~/trans/&&$1~/Ghir/{print $0}'|wc -l
## 获取下一步鉴定AS的注释文件
sort -k1,1 -k4,5n samp1.known.gtf |uniq |cat - update.gtf |grep PB >
```





