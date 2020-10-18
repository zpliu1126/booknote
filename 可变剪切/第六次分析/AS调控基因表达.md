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
> 4. 

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

+ blastp结果相似度大于90%
+ 所有预测的蛋白质保守结构域都相同

### 1.同一个基因组内PacBio转录本与参考转录本保守性分析

> 通过将PacBio与参考基因组的转录本，在蛋白结构域、CDS相似度上的比较；可以判断这个isoform是否与参考基因存在一样的功能。
>
> + isofrom与参考基因转录本具有相同的蛋白保守结构域
> + isoform比参考基因组转录本多鉴定出蛋白质结构域
> + isoform比参考基因组转录本少鉴定出蛋白质结构域
> + isoform和参考基因组都没有预测到保守的蛋白质结构域
> + 有些PacBio转录本没有相似度大于90%的参考转录本

综合blastp相似度的结果和PfanScan预测的结果，可以得出有多少isoform在功能上是没有发生改变的，即使它们的剪切方式存在一定的差异；有多少的isoform的功能发生了改变；并且这种改变有多少比例是由于AS造成的

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
##结构域完全相同的转录本
awk '$4==$8&&$4!="None"{print $0}' isoform_vs_reference_proteinDomain.txt |cut -f1|sort |uniq |wc -l
##都没预测到结构域，但是CDS序列长度相同
awk '$4==$8&&$4=="None"&&$2==$6{print $0}'  isoform_vs_reference_proteinDomain.txt |cut -f1|sort |uniq |wc -l
##先把这些差异的转录本找出来，再看是这些转录本与参考转录本的差异分类
awk '{if($4==$8){a[$1]+=1}else{a[$1]+=0}}END{for(i in a){print i"\t"a[i]}}' isoform_vs_reference_proteinDomain.txt |awk '$2==0{print $0}' >noconserveDomain_isofrom.txt
python ~/work/Alternative/result/Gh_result/CO31_32_result/ORF/AddAnnotionTag.py noconserveDomain_isofrom.txt isoform_vs_reference_proteinDomain.txt  11

##与参考转录本相比结构域变少了

##与参考转录本相比结构域增加了

##与参考转录本相比都没有预测到保守的domain，并且CDS长度不相同
 awk '$4==$8&&$4=="None"&&$2!=$6{print $0}' isoform_vs_reference_proteinDomain.txt |cut -f1|sort |uniq |wc -l

```

A2中PacBio转录本的注释情况

> A2中总共有67113个isoform比对到基因区域

保守结构域的预测情况：

| 转录本类型 | 存在保守结构域 | 没有预测到 | total |
| ---------- | -------------- | ---------- | ----- |
| PacBio     | 53594          | 13510      | 67104 |
| reference  | 31838          | 9106       | 40944 |

基于保守结构域和cDNA、CDS的数据将PacBio转录本与参考转录本进行比较，将转录本进行分类；

| 类型                     | 数目  | 比例 |
| ------------------------ | ----- | ---- |
| 存在相同保守结构域       | 41575 |      |
| CDS长度一样              | 2232  |      |
| 保守结构域发生改变       | 19049 |      |
| 都没有预测到保守的结构域 | 4248  |      |
| Total                    | 67104 |      |



D5中PacBio转录本的注释情况

> D5中总共有51964个比对到基因区域的isoform

| 转录本类型 | 存在保守结构域 | 没有预测到 | total |
| ---------- | -------------- | ---------- | ----- |
| PacBio     | 42494          | 9470       | 51964 |
| reference  | 64412          | 12838      | 77250 |

| 类型                     | 数目  | 比例 |
| ------------------------ | ----- | ---- |
| 存在相同保守结构域       | 37016 |      |
| CDS长度一样              | 2769  |      |
| 保守结构域发生改变       | 9173  |      |
| 都没有预测到保守的结构域 | 3006  |      |
| Total                    | 51964 |      |



TM1中PacBio转录本的注释情况

> TM1中总共有83392个比对到基因区域

| 转录本类型 | 存在保守结构域 | 没有预测到 | total  |
| ---------- | -------------- | ---------- | ------ |
| PacBio     | 66650          | 16717      | 83367  |
| reference  | 95277          | 20516      | 115793 |

所有PacBio转录本的注释

| 类型                     | 数目  | 比例 |
| ------------------------ | ----- | ---- |
| 存在相同保守结构域       | 52981 |      |
| CDS长度一样              | 3796  |      |
| 保守结构域发生改变       | 21667 |      |
| 都没有预测到保守的结构域 | 4923  |      |
| Total                    | 83367 |      |



####  1.分析存在保守结构域的转录本与参考转录本在cDNA长度上的差异

在存在保守结构域的转录本中统计有将近50%的转录本的CDS序列与参考转录本一样长

| 基因组 | CDS长度一致 | total |
| ------ | ----------- | ----- |
| A2     | 21478       | 43807 |
| D5     | 25414       | 39785 |
| TM1    | 33100       | 56777 |



#### 2.两种转录本在平均表达水平上是否存在差异：

+ 与参考转录本有相同结构域
+ 与参考转录本结构域上存在差异

首先比较存在保守结构域isofrom与不保守转录本间表达量是否存在差异；

#### 3.不存在保守结构域的转录本中有多少比例是AS isoform

| 基因组 | AS isoform | 总的不保守的isoform |
| ------ | ---------- | ------------------- |
| A2     | 5477       | 19049               |
| D5     | 3139       | 9173                |
| TM1    | 7813       | 21667               |

找一个高表达的AS isofrom，导致蛋白结构域发生减少和增加的例子。

TM1中`PB.19080.6`存在一个RI事件，导致增加了一个保守的蛋白结构域`FAD_binding_6`；



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

### 2.不同基因组间PacBio转录本的保守性分析

> 比较两个同源基因间PacBio转录本是否存在保守的蛋白结构域

首先根据同源基因间是否都表达进行一个筛选

统计同源基因对的数目和对应转录本的数目

| 类型     | 同源基因数目 | 转录本1数目 | 转录本2的数目 |
| -------- | ------------ | ----------- | ------------- |
| A2 vs At | 11292        | 45544       | 31998         |
| D5 vs Dt | 11690        | 38972       | 33463         |
| A2 vs D5 | 12772        | 48218       | 39384         |
| At vs Dt | 9651         | 28999       | 29013         |

统计有多少同源基因转录出的转录本：

1. 所有转录本都找得到与之对应的相同的保守结构域
2. 既存在具有相同保守的结构域转录本，又有亚组间特异性的转录本、结构域丧失的转录本，这会对同源基因的表达或者功能有影响
3. 同源基因间，所有的转录本不存在相同保守结构域，同源基因间功能发生分化

#### 2.1A2 vs At

根据是否存在保守的功能结构域对转录本进行分析

```bash
##结构域完全相同的转录本
awk '$4==$8&&$4!="None"{print $0}' ../111|cut -f1|sort |uniq |wc -l
## CDS长度相同
awk '$4==$8&&$4=="None"&&$2==$6{print $0}' ../111|cut -f1|sort|uniq |wc -l
##结构域存在差异
awk '{if($4==$8){a[$1]+=1}else{a[$1]+=0}}END{for(i in a){print i"\t"a[i]}}' ../111|awk '$2==0{print $0}'
##都没有预测到保守结构域
总的减去那两类
```

| 基因组 | 相同保守结构域 | 不同保守结构域 | 没有预测到结构域 |
| ------ | -------------- | -------------- | ---------------- |
| A2     | 31488          | 9912           | 4144             |
| At     | 23905          | 4953           | 3140             |



#### 2.2D5 vs Dt

| 基因组 | 相同保守结构域 | 不同保守结构域 | 没有预测到结构域 |
| ------ | -------------- | -------------- | ---------------- |
| D5     | 28074          | 7590           | 3308             |
| Dt     | 24884          | 5601           | 2978             |



#### 2.3 A2 vs D5

| 基因组 | 存在保守结构域 | 结构域存在差异 | 都没有预测到保守结构域 |
| ------ | -------------- | -------------- | ---------------------- |
| A2     | 35201          | 8633           | 4384                   |
| D5     | 29993          | 5717           | 3674                   |



#### 2.5 At vs Dt

| 基因组 | 存在保守结构域 | 结构域存在差异 | 都没有预测到保守结构域 |
| ------ | -------------- | -------------- | ---------------------- |
| At     | 18813          | 7103           | 3083                   |
| Dt     | 18819          | 7100           | 3094                   |



根据两个基因组中转录本功能域的保守情况，对二元同源基因进行分类：

1. 所有的转录本结构域完全相同
2. 基因间即存在相同功能的转录本，又存在差异的转录本，半分化状态
3. 基因间所有的转录本功能都不保守，完全分化状态
4. 两个转录本的功能都没有被预测

```bash
python isoform_vs_isoform.py -homolog A2_vs_At_gene.txt  -Aisoform A2_PacBio.txt  -Bisoform At_PacBio.txt  -Aconserve PacBio_Domain/A2_conserve_domain.txt  -Bconserve PacBio_Domain/At_conserve_domain.txt  -Anoconserve PacBio_Domain/A2_withDifferDomain.txt  -Bnoconserve PacBio_Domain/At_withDifferDomain.txt  -Anone PacBio_Domain/A2_nonDomain.txt  -Bnone PacBio_Domain/At_nonDomain.txt  -o 222
##根据结果对同源基因进行分类
awk '$NF=="conserve"{print $0}' 222 >gene_category/conserve_genList
awk '$NF=="differentiation"{print $0}' 222 >gene_category/differentiation_genList
awk '$NF=="semi_differentiation"{print $0}' 222 >gene_category/semi_differentiation_genList
awk '$NF=="none"{print $0}' 222 >gene_category/none_domain_genList
```

| 比较     | 功能一致的基因 | 半分化 | 完全分化 | 都不存在保守结构域 | Total |
| -------- | -------------- | ------ | -------- | ------------------ | ----- |
| A2 vs At | 6711           | 2840   | 1245     | 496                | 11292 |
| D5 vs Dt | 7562           | 2305   | 1339     | 484                | 11690 |
| A2 vs D5 | 8130           | 3042   | 998      | 602                | 12772 |
| At vs Dt | 5702           | 1712   | 1598     | 639                | 9651  |

通过比较基因内所有转录本的保守结构域，进而统计每种基因的比例；可以看出两个基因组、或者亚组间的分化程度(保守程度）。

| 不同基因组比较 | 存在保守转录本的基因 | 完全分化基因 |
| -------------- | -------------------- | ------------ |
| A2 vs At       | 9551 （88.47%）      | 1245         |
| D5 vs Dt       | 9867   （88.05%）    | 1339         |
| A2 vs D5       | 11172（91.80%）      | 998          |
| At vs Dt       | 7414    （82.27%）   | 1598         |

> 通过At、Dt与对应二倍体祖先比较发现分别有88.47% vs 88.05%的同源基因存在结构域保守的转录本；而在二倍体祖先种中A2和D5中同源基因的保守程度最高达到91%，在多倍化之后At、Dt两个亚组间的保守程度最低只有82%；这可能是由于A2和D5作为一个独立存在时，受到同等程度的进化选择亚，表现出高度同源性，而在多倍化后由于A、D基因组的功能冗余导致选择压的减少，使得At、Dt间有些基因发生了分化；而这种分化的方向是没有偏好性的（通过将At vs A2 与 Dt vs D5比较）。A、D亚组间的分化相比于两个二倍体间的比较更明显

#### 1. AS 在三种基因中所占的比例

在多倍化的过程中有38%的同源基因在功能上产生了差异，AS在其中起着作用。

首先比较每种同源基因在转录本数目上是否存在着明显的差异

> 所有的基因在多倍化后，平均每个基因的转录本数目、多态性都有所下降；有将近60%的基因转录出多个转录本

```bash
##保守功能的同源基因，转录本数目差异
 awk '{split($2,a,",");split($4,b,",");print($1"\t"length(a)"\t"length(b))}' semi_differentiation_genList
 
```

#### 多倍化过程中功能保守的基因

```bash

```



功能保守的同源基因中有多少比例的基因是存在多种类型保守的转录本。

+ 保守同源基因的转录本只有一种结构域
+ 保守同源基因的转录本功能不一致，存在多种保守结构域（AS在多倍化中仍旧保守的）

> 

#### 功能分化的同源基因

先把基因的转录本区分一下，分成基因组中特异性的转录本

+ 保守转录本的表达量在所有转录本表达量的比值，与特异性转录本的比值上是否存在差异
+ 祖先中特异性的转录本、亚组中特异性的转录本（亚组特异性的AS，造成特异性的转录本）









#### **2.在同一个基因组中，三种类型基因的表达量的比较**

> 在同源基因间，这三种类型的同源基因的总表达量都存在着高度的相关；但是在同一个基因组内部，三种类型的基因表达量存在差异





#### 四倍体内亚基因组之间功能的互补作用












