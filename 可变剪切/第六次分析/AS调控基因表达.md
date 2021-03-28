### Isoform保守性分析

>根据EMBOSS对每个isoform预测得到的最长的那个CDS作为isoform的CDS序列；使用pfamScan去搜索CDS序列中的蛋白质保守结构域

PacBio isoform只分析那些比对到基因区域的isoform；对于比对到基因区域的转录本后续不进行分析了

#### 使用PfamScan预测转录本的蛋白质保守结构域

> 参考 https://www.jianshu.com/p/9cf40d0d8bf5
>
> https://www.jianshu.com/p/47b8f22f9998
>
> 数据库下载地址：
>
> ftp://ftp.ebi.ac.uk/pub/databases/Pfam/releases/
>
> 1. active_site.dat.gz
> 2. Pfam-A.hmm.dat.gz
> 3. Pfam-A.hmm.gz

```bash

##加载HMMER和PfamScan
module load HMMER/3.3
##使用HMMER构建库
hmmpress  Pfam-A.hmm
## 使用conda安装PfamScan
conda create -n pfam_scan 
conda activate pfam_scan
conda install pfam_scan
##对蛋白质结构域进行预测
pfam_scan.pl   -dir ~/Pfam/  -e_seq 1e-3 -e_dom 1e-3  -fasta PacBio_CDS.fa -outfile 111 -cpu 20
```

**使用Blast对CDS序列进行比对**

```bash
##进行all-vs-all blastp
cat ../collapse/PacBio_CDS.fa  ../collapse/TM1_CDS.fa >isoform_CDS.fa
##建库
makeblastdb  -in isoform_CDS.fa  -dbtype prot -out CDS
##进行比对
blastp -query isoform_CDS.fa  -db ./CDS -outfmt '6  qseqid sseqid qstart qend sstart send nident pident qcovs evalue bitscore'  -out test.blast -evalue 1e-5 -num_threads 10
```

保守的isoform定义：

+ **blastp结果相似度大于90%**
+ **所有预测的蛋白质保守结构域都相同**

### 1.同一个基因组内PacBio转录本与参考转录本保守性分析

> 通过将PacBio与参考基因组的转录本，在蛋白结构域、CDS相似度上的比较；可以判断这个isoform是否与参考基因存在一样的功能。
>
> + isofrom与参考基因转录本具有相同的蛋白保守结构域
> + isoform比参考基因组转录本多鉴定出蛋白质结构域
> + isoform比参考基因组转录本少鉴定出蛋白质结构域
> + isoform和参考基因组都没有预测到保守的蛋白质结构域
> + 有些PacBio转录本没有相似度大于90%的参考转录本

**综合blastp相似度的结果和PfanScan预测的结果**，可以得出有多少isoform在功能上是没有发生改变的，即使它们的剪切方式存在一定的差异；有多少的isoform的功能发生了改变；并且这种改变有多少比例是由于AS造成的

为了将PacBio转录本与参考转录本进行比较，需要构造所有基因的参考转录本信息

```bash
awk 'NR==1&&$1~/^>/{print $0}NR>=2&&$1~/^>/{print "\n"$0}$1~/^[^>]/{printf $0}' ../collapse/D5_CDS.fa  |awk '$1~/^>/{printf substr($0,2,16)"\t"substr($0,2)"\t"}$1~/^[^>]/{print 3*length($0)}'  >D5_reference_isoform.txt
##所有基因的二元表
cut -f1 reference_isoform.txt |awk '{print $1"\t"$1}' >all_D5_gene.txt

##将PacBio 分别与每个参考转录本进行比较
python ~/github/zpliuCode/script/genestruct/conserveIsoform.py  -homolog all_D5_gene.txt  -APfam test2_domain.txt  -BPfam test1_domain.txt  -blast PacBio_vs_reference.blast  -Aisoform PacBio_isoform_gene.txt  -Bisoform D5_reference_isoform.txt -o ./1111
```

> PacBio转录本与参考转录本可能存在相似的功能
>
> + 存在完全相同的蛋白结构域
> + 两者都没有预测到结构与，CDS序列长度相同
>
> 可能存在相同功能的转录本：
>
> 1. cDNA序列长度是否一致，用于分析转录后的剪切会不会影响蛋白结构域
>
> PacBio与参考转录本的蛋白结构域存在差异
>
> + 结构域数据减少
> + 结构域数目变多
> + 结构域完全发生了变化
>
> PacBio转录本与参考转录本都没有预测到结构域
>
> > 数据库中包含的信息不够完整

```bash
##根据转录本Domain的长度获取完全保守结构域的
python ~/github/zpliuCode/script/genestruct/conservedDomain.py -APfam ../collapse/PacBio_protein_domain.txt  -BPfam  ../collapse/TM1_proteinDomain.fa -conserve isoform_vs_reference_proteinDomain.txt -o conserved_Domain.txt
##与参考转录本相比，结构域完全相同的转录本
cut -f1 conserved_Domain.txt |sort |uniq |wc -l
## 结构域发生改变的转录本
cat conserved_Domain.txt isoform_vs_reference_proteinDomain.txt |sort |uniq -u |cut -f1 |sort |uniq |wc -l
## 都没有预测到结构域
cat conserved_Domain.txt isoform_vs_reference_proteinDomain.txt |sort |uniq -u |awk '$4==$8&&$4=="None"{print $0}'|cut -f1 |sort |uniq |wc -l

```

A2中PacBio转录本的注释情况

> A2中总共有67113个isoform比对到基因区域

保守结构域的预测情况：

| 转录本类型 | 存在保守结构域 | 没有预测到 | total |
| ---------- | -------------- | ---------- | ----- |
| PacBio     | 53594（79.9%） | 13510      | 67104 |
| reference  | 31838（77.8%） | 9106       | 40944 |

基于保守结构域和cDNA、CDS的数据将PacBio转录本与参考转录本进行比较，将转录本进行分类；

| 类型                     | 数目  | 比例  |
| ------------------------ | ----- | ----- |
| 存在相同保守结构域       | 24494 | 36.5% |
| 结构域发生改变           | 36130 | 53.8% |
| 都没有预测到保守的结构域 | 6480  | 9.7%  |
| Total                    | 67104 |       |



D5中PacBio转录本的注释情况

> D5中总共有51964个比对到基因区域的isoform,并且预测到了CDS序列

| 转录本类型 | 存在保守结构域 | 没有预测到 | total |
| ---------- | -------------- | ---------- | ----- |
| PacBio     | 42494（81.8）  | 9470       | 51964 |
| reference  | 64412（83.4）  | 12838      | 77250 |

| 类型                     | 数目  | 比例  |
| ------------------------ | ----- | ----- |
| 存在相同保守结构域       | 27241 | 52.4% |
| 结构域发生改变           | 18948 | 36.5% |
| 都没有预测到保守的结构域 | 5775  | 11.1% |
| total                    | 51964 |       |



TM1中PacBio转录本的注释情况

> TM1中总共有83392个比对到基因区域

| 转录本类型 | 存在保守结构域 | 没有预测到 | total  |
| ---------- | -------------- | ---------- | ------ |
| PacBio     | 66650（79.9）  | 16717      | 83367  |
| reference  | 95277（82.3）  | 20516      | 115793 |

所有PacBio转录本的注释

| 类型                     | 数目  | 比例  |
| ------------------------ | ----- | ----- |
| 存在相同保守结构域       | 35521 | 42.6% |
| 保守结构域发生改变       | 39127 | 46.9% |
| 都没有预测到保守的结构域 | 8719  | 10.5% |
| Total                    | 83367 |       |

> 使用wilcox.test进行成对测验，p-value=0.75
>
> PacBio转录本和参考转录本在蛋白结构域的预测的比例上没有显著性差异。

####  1.分析存在保守结构域的转录本与参考转录本在cDNA长度上的差异

> 在cDNA长度上定义一个阀值

```bash
awk '{print $1"\t"sqrt(($2-$3)*($2-$3))}' conserveDomain_cDNA.txt |awk '$2>100{print $0}'|cut -f1|sort|uniq |
```



> 在结构域完全保守的PacBio转录本中，将PacBio转录本的cDNA与reference 的cDNA长度进行比较;

| 基因组 | PacBio长500bp | reference长500bp | 两者没有差异没有达到500bp |
| ------ | ------------- | ---------------- | ------------------------- |
| A2     | 21478         | 43807            |                           |
| D5     | 25414         | 39785            |                           |
| TM1    | 33100         | 56777            |                           |

> 在存在保守结构域转录本和，结构域发生改变的转录本中AS diversity转录本所占据的比例:
>
> CO31_32_result/AS2/NoAS_ORF.txt

```bash
python ../ORF/AddAnnotionTag.py  ../AS2/11  noconserved_Domain_PacBioIsoform.txt  noconserved_Domain_ASdiversity.txt
## 存在AS diversity转录本数
awk '$NF!="NoAS"{print $0}' noconserved_Domain_ASdiversity.txt |wc -l
```

> 两种转录本中，存在AS diversity的比例, 在蛋白结构域发生改变的这类转录本中有更高比例的AS富集,
>
> t-test 测验 p-value=0.006546



| 基因组 | 保守结构域PacBio,存在AS差异 | 结构域发生改变转录本 |
| ------ | --------------------------- | -------------------- |
| A2     | 967/24467（4.0%）           | 11552/25669（45.0%） |
| D5     | 4731/27203（17.4%）         | 7204/15260（47.2%）  |
| TM-1   | 6852/35491（19.3%）         | 15267/28159（54.2%） |

#### 2.两种转录本在平均表达水平上是否存在差异：

+ 与参考转录本有相同结构域
+ 与参考转录本结构域上存在差异

首先比较存在保守结构域isofrom与不保守转录本间表达量是否存在差异；

存在保守的结构与要长度上一致



**筛选蛋白结构改变与和AS有关的例子**

```bash
##首先筛选基因
##基因存在两种转录本,一种与参考转录本具有一样的保守结构域，一种与参考转录本的结构域相比发生改变
##根据筛选到的基因进一步筛选具有AS的同源基因


```



> Ghir_A08G003090这个基因与参考转录本相比存在一个RI事件导致，heat shock protein 81-3 热休克蛋白
>
> Ghir_A05G027150，At亚组存在一个外显子跳跃事件，导致FAD结构域的丢失，这可能和棉花从多年生向一年生变化有关；但是这个基因外显子跳跃的转录本表达量非常低



`PB.19583.2`存在一个SE事件，使得保守结构域发生改变

```bash
##提取基因区域的坐标，使用windowsmake 制作单个碱基的bin
~/software/bedtools2-2.29.ll
0/bin/windowMaker  -b read.bed  -w 1 >read_window.bed
##将bin bed文件与表达量的bed文件取交集
~/software/bedtools2-2.29.0/bin/intersectBed -loj -a read_windows.bed  -b ~/work/Alternative/result/homologo/FEST3/geneExpress/hisat2/TM1.bed >read_count.txt
##统计每个碱基比对到的read数目，同时根据测序得到的总的read数对每个碱基上的read进行标准化（基因组总read/1000000）
awk '$4=="."{a[$2]+=0}$4!="."{a[$2]+=1}END{for(i in a){print i"\t"a[i]}}' read_count.txt |sort -k1,1n  >read_FPKM.txt
```



> 通过Pfam预测保守的蛋白结构域发现，平均79%的PacBio转录本中预测到了保守的蛋白结构域；而在参考转录本中有80%的转录本预测到保守的蛋白结构域。与参考转录本相比，PacBio转录本预测到结构域的比例有所下降，可能是由于转录后的剪切改变了一些保守的蛋白结构域；仍旧有一些转录本没有预测到保守的蛋白结构域，或许是由于Pfam中仍旧包含一些没有注释的保守蛋白结构域。
>
> 1. PacBio转录本被预测存在保守结构域的比例
> 2. 参考转录本中被预测存在保守结构域的比例
>
> 0.805 vs 0.811;两种转录本中存在保守结构域的比例没有显著性差异
>
> 两种转录本都有一定比例的转录本没有预测到保守结构域，可能和数据库的注释信息不完整
>
> 将PacBio转录本预测的结构域与参考转录本进行比较，分类的饼图
>
> 
>
> 将PacBio转录本与参考转录本比较，可以将PacBio转录本进行分成两大类：
>
> 与参考转录本存在完全一致的保守结构域，与参考转录本存在差异的结构域；
>
> 1.存在保守结构域的转录本中，它的cDNA序列长度与参考转录本的长度存在很大的差异；说明大部分转录本即使经历了不同的splicing仍旧改变保守的蛋白质结构域；AS不仅仅增加基因转录多种蛋白质的能力，调节基因的表达，同时能够在不影响同时这些转录本保守结构域的条件下转录本的亚细胞定位。这些转录本中有将近50%的转录本CDS长度与参考转录本相比没有发生了改变。
>
> 2.非保守的转录本可能暗示了新的功能或者丧失了原有的功能。保守转录本与非保守转录本间同时存在很大的表达差异，并且大部分的非保守转录本FPKM<1;同时也有高表达的转录本。
>
> 在非保守的转录本中有将近33的转录本是AS isoform，说**明转录后调控影响转录本的结构域，改变对应的蛋白质功能**
>
> 3.调几个例子说明AS改变蛋白保守结构域，加上PFKM的peak图。








