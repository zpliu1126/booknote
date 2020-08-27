### ~CSS isoform转录本去冗余~~

使用github中`CD-HIT-EST`软件包进行计算；

> 代码仓库 : https://github.com/weizhongli/cdhit
>
> 参考这个wiki里的命令 ：https://github.com/Magdoll/cDNA_Cupcake/tree/master
>
> `cd-hit-est -i <input> -o <output> -c 0.99 -T 6 -G 0 -aL 0.90 -AL 100 -aS 0.99 -AS 30 `

```bash
/public/home/zpliu/github/cd-hit-v4.8.1-2019-0228/bin/cd-hit-est -i ~/work/Alternative/result/Gh_result/CO31_32_result/04_Cluster/quivered.all.fa -o TM1_redundant.fa -c 0.99 -T 6 -G 0 -aL 0.90 -AL 100 -aS 0.99 -AS 30  -M 0
##提取去重矫正后后的isoform序列信息
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

> 对于存在多个重复的RNA-seq数据，作者推荐我将它们`cat`命令合并成一个文件后，再进行跑；
>
> 对于长序列文件，使用的是FLNC 的CSS序列`04_Cluster/all.quivered.fa`而不是拼接好的PacBio isoform序列

### 输出文件

在` output`文件夹中生成了几种gtf文件

+ `know.gtf`PacBio测的转录本在基因组注释文件中已经存在
+ `novel.gtf`PacBio测到的转录本与注释的转录本不一样，但是存在至少一个相同的剪切位点
+ `unrecog.gtf` PacBio中的剪切位点与参考基因组没有重叠
+ `updated.gtf`改进后的参考转录本信息；在原有基因组注释的基础上，加上`novel`转录本信息，并且这些新的转录本信息是由long-read和short read支持的。

### 使用lr2mats对CSS矫正后的isoform

```bash
###samp1.known.gtf,与基因组中已有的注释一致的isoform
awk '$3~/tran/{print $0}' samp1.known.gtf|wc -l
###samp1.novel.gtf, PacBio检测到的新的isoform，但最终不一定会使用，还是得从update.gtf文件中抽取出来的准确
awk '$3~/tran/{print $0}' update.gtf|wc -l
### 提取文件作为PacBio注释信息
grep -E "c([^\/]*)\/" update.gtf| cat - samp1.known.gtf  >../../../../allAS/Ga/PacBio.gtf
```

统计数据

```bash
##输入的CSS isoform数目
grep ">" /public/home/zpliu/work/Alternative/result/Gr_result/CO41_42_result/04_Cluster/all.quivered.fa|wc -l

##矫正后的isoform数目
awk '$3~/tran/{print $0}' PacBio.gtf |wc -l
##基因数目
awk '$3~/tran/{print $0}' PacBio.gtf |cut -f9|cut -f1 -d ";"|sort |uniq |wc -l
```

| 基因组 | FLNC CSS isoform | 注释后 | 基因数目 | 平均每个基因转录本数目 |
| ------ | ---------------- | ------ | -------- | ---------------------- |
| A2     | 209256           | 44775  | 19135    | 2.33                   |
| D5     | 157049           | 37865  | 17736    | 2.13                   |
| At     | -                | 31507  | 14830    | 2.12                   |
| Dt     | -                | 28389  | 15426    | 1.84                   |
| TM1    | 245865           | 59897  | 30257    | 1.97                   |

+ `samp1.known.gtf`与已有基因注释相匹配
+ `samp1.novel.gtf`与已有基因相匹配但是是新的注释信息
+ `samp1.unrecog.gtf`比对到基因组，但是不是已经注释的基因区域
+ `samp1.detail.txt`比对到基因组区域，有的可能没有被二代read支持

#### 统计long-read的比对情况

```bash
wc -l samp1.detail.txt
awk '$3~/tran/{print $0}' samp1.known.gtf |wc -l
awk '$3~/tran/{print $0}' samp1.novel.gtf |wc -l
awk '$3~/tran/{print $0}' samp1.unrecog.gtf |wc -l
```

| 基因组 | total  | know_FLNC | novel_FLNC | unrecongnized_FLNC | Other |
| ------ | ------ | --------- | ---------- | ------------------ | ----- |
| TM1    | 241195 | 13865     | 162645     | 23223              | 41462 |
| A2     | 205541 | 13577     | 133663     | 16170              | 42131 |
| D5     | 153149 | 10214     | 105283     | 14798              | 22854 |



### PacBio 转录本与参考基因组转录本

1. 长度上的差异

```bash
awk -F "\t" '$2~/lr2rmats/{split($9,a,";");if($3=="exon"){b[a[2]]+=1;c[a[2]]+=$5-$4+1}}$2!~/lr2rmats/{split($9,a,";");if($3=="exon"){b[a[1]]+=1;c[a[1]]+=$5-$4+1}}END{for(i in b){print i"\t"b[i]"\t"c[i]}}' update.gtf |head
```

1. exon数目上的差异

```bash

```

