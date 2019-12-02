### 比较每个基因isform的差异

首先不管这个基因有没有发生可变剪切，看看每个基因对应的isform种类和数目分别有多少。

1. 文件`unproved.gene.list.txt`表示的是没有PacBio序列支持的基因
2. 文件`unproved.transcript.list.txt`表示这个基因有PacBio序列的支持，但是呢有些转录本没有PacBio的支持。
3. 文件 `proved.transcript.list.txt`对应的转录本有PacBio序列的支持

解读起来还是好麻烦，直接用`03_Classify/total.flnc.fasta`文件比对到基因组去看看具体是什么情况

```bash
cat ./total.flnc.fasta|~/software/gmap-2019-09-12/bin/gmap -D ~/work/Alternative/data/gmap_build/Graimondii_221_v2.0 -d Graimondii_221_v2.0 -f samse -t 10 -n 1 --min-trimmed-coverage=0.85 --min-identity=0.9  --suboptimal-score 0.8 >align.sam
```



### 统计参考基因组中注释isform的数目

```bash
awk '$3~/mRNA/{print $0}' gene.Grai.JGI_end.gff3 |awk -F ";" '{a[$2]+=1}END{for(i in a){print i"\t"a[i]}}'|sed 's/Parent=//g'|less 
```

#### 看一下参考基因组中注释只有一个isform的基因，有多少发生了AS

```bash
## D5
awk '$3~/mRNA/{print $0}' /public/home/zpliu/genome_data/genome_Grai.JGI/gene.Grai.JGI_end.gff3 |awk -F ";" '{a[$2]+=1}END{for(i in a){print i"\t"a[i]}}'|sed 's/Parent=//g'|awk '$2==1{print $0}'|cut -f1|cat - spliceGeneId.txt |sed 's/\.v2\.1//g'|sort|uniq -d |wc -l 
```



### 将基因组的isform与PacBio测的isform进行合并

文件`07_annotation/merge.gtf`中包含每个基因能比对到的PacBio isform。与考基因组的注释文件合并了

**文件中如果是原本参考基因组的注释，就说明基因的这个转录本在叶片中没有表达，从而没有被PacBio检测到，或者就是这个基因没有表达。**

可以使用这个merge.gtf文件当做参考进行AS的鉴定

```bash
## 07文件夹中merge.gtf`
awk -F ";" '{print $3";"$2"\t"$1}' merge.gtf|awk -F "\t" '{print $2,$3,$4,$5,$6,$7,$8,$9,$1}' OFS="\t"|sed 's/orginal_//g' >merge_C.gtf
```





### 比较同一组亚基因组同源基因仅仅在叶片中表达的isform数量的差异

使用亚基因组同源基因去获取，`07annotion/merge.gtf`文件中被PacBio检测到的转录本

```bash
cat homologGeneId.txt |xargs -I {} grep {} ~/work/Alternative/result/Gr_result/CO41_42_result/07_annotation/merge.gtf|awk -F "\t" '$3~/^t/&&$9~/PB/{print $0}' >homolog_isform_count.txt
```















