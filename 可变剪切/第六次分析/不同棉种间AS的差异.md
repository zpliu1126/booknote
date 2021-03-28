### 不同亚基因组间转录调控的差异

#### 不同基因组间表达水平的归一化

TM-1 BAM文件中matching read

```bash
## 统计matching read的数目，差的不多不用归一化了
samtools view -c TM1_rmdup.bam 
# TM1
79728632
# A2
53231641
# D5
49082779
```

分别比较不同基因组间同源基因在AS调控转录上的差异，首先将基因分成3类：

+ 只转录出与特定转录本不存在差异的isoform
+ 转录出的转录本与参考基因组特定的转录本存在AS的差异，并且导致了编码改变和提取终止的终止密码
+ 转录出的转录本与参考基因组特定的转录本存在AS的差异，inframeChange

### **二倍体和四倍体在AS上的差异**

首先对基因进行筛选：

+ FPKM值大于1
+ PacBio转录本数目大于等于1

分析所有表达的基因中，有多少同源基因存在保守的isoform

```bash
##统计保守基因的比例
awk '$5!=0{a+=1}END{print a/NR}' A2_vs_At/11

```

通过比较发现A2与D5中存在60%多的基因存在保守的isoform；而At与Dt中仅仅只有30%；

| 比较     | 所有同源基因中存在保守转录本的比例 | 存在AS   | 不存在AS |
| -------- | ---------------------------------- | -------- | -------- |
| A2_vs_At | 0.588204                           | 0.570681 | 0.619732 |
| D5_vs_Dt | 0.606159                           | 0.585748 | 0.651137 |
| A2_vs_D5 | 0.640385                           | 0.635929 | 0.649465 |
| At_vs_Dt | 0.384105                           | 0.355213 | 0.438226 |

针对筛选了的基因可以统计：

+ 多少基因存在AS
+ 多少基因同时没有AS的存在

```bash
##比较两个基因组上的差异
python differentialAS.py  -homolog A2_vs_At/A2_vs_At_collinearity.txt  -AS1 A2_AS.txt  -AS2 TM1_AS.txt  -FPKM1 A2_gene_FPKM.txt  -FPKM2 TM1_gene_FPKM.txt  -ORF1 A2_ORF.txt  -ORF2 TM1_ORF.txt  -o A2_vs_At/11
## 两个同源基因都不存在AS，统计转录本的数目
awk '$2==0&&$7==0{a+=$4;b+=$5;c+=$9}END{print a"\t"b"\t"c}' A2_vs_At/11
##两个同源基因存在AS
awk '$2!=0&&$7!=0||($2!=0&&$7==0)||($2==0&&$7!=0){a+=$4;b+=$5;c+=$9}END{print a"\t"b"\t"c}' A2_vs_At/11
```

统计表达了的基因；通过统计发现

A2_vs_At, D5_vs_Dt这些分别有4034/11292(35.72%)、3649/11690(31.21%)、4205/12772(32.92%) 、3359/9651(34.8%)的基因同时不存在AS

| 比较     | 表达的基因数 | 同时不存在AS的基因对 | 存在AS的基因对（一个有AS、一个没有AS） | 两种基因中保守的isoform数 | 两种基因中isform1特异性转录本 | isoform2特异性转录本 |
| -------- | ------------ | -------------------- | -------------------------------------- | ------------------------- | ----------------------------- | -------------------- |
| A2_vs_At | 11292        | 4034                 | 7258                                   | 2634/5603                 | 3557/18741                    | 2534/12087           |
| D5_vs_Dt | 11690        | 3649                 | 8041                                   | 2501/6058                 | 2698/15739                    | 2181/12973           |
| A2_vs_D5 | 12772        | 4205                 | 8567                                   | 2867/6853                 | 3368/19773                    | 2843/15164           |
| At_vs_Dt | 9651         | 3359                 | 6292                                   | 2914/2752                 | 1521/13217                    | 2882/13173           |

发现在不存在AS的基因，与存在AS的基因在特异性转录本的数目上存在差异，进行卡方测验

| A2At否发生AS     | 保守的isoform数 | 不保守的isoform数 |
| ---------------- | --------------- | ----------------- |
| 都没有发生AS     | 2634            | 6091              |
| 发生AS的基因对中 | 5603            | 30828             |


| D5Dt否发生AS | 保守的isoform数 | 不保守的isoform数 |
| ------------ | --------------- | ----------------- |
| 不发生AS     | 2501            | 4879              |
| 发生AS       | 6058            | 28712             |

| A2D5否发生AS | 保守的isoform数 | 不保守的isoform数 |
| ------------ | --------------- | ----------------- |
| 不发生AS     | 2867            | 6211              |
| 发生AS       | 6853            | 34937             |

| AtDt否发生AS | 保守的isoform数 | 不保守的isoform数 |
| ------------ | --------------- | ----------------- |
| 不发生AS     | 2914            | 6091              |
| 发生AS       | 2752            | 26390             |

**AS造成同源基因特异性isoform的增加**

> 在证明了发生AS的基因中亚基因组特异性的转录本数目更多，进一步证明特异性转录本随着AS事件的增加，这些转录本也会随之增加；说明AS对基因转录出特异性转录本起着一定的作用
>
> 首先将基因的AS划分区段，比较每个区段中特异性转录本数目的变化。

```bash
for i in 1
do
## 比较AS为0的两个基因组中特异性转录本的平均水平
awk '$2==0{print $0}' 11|awk '{print $4}' >A_0AS
awk '$7==0{print $0}' 11|awk '{print $9}' >B_0AS
## 1~5个剪切事件时对应的特异性isoform数目
awk '$2>0&&$2<=5{print $0}' 11|awk '{print $4}' >A_5AS
awk '$7>0&&$7<=5{print $0}' 11|awk '{print $9}' >B_5AS
## 5~10个剪切事件对应的特异性isoform数目
awk '$2>5&&$2<=10{print $0}' 11|awk '{print $4}' >A_10AS
awk '$7>5&&$7<=10{print $0}' 11|awk '{print $9}' >B_10AS
## 10~15个剪切事件对应的特异性isoform数目
awk '$2>10&&$2<=15{print $0}' 11|awk '{print $4}' >A_15AS
awk '$7>10&&$7<=15{print $0}' 11|awk '{print $9}' >B_15AS
## 15~20个剪切事件对应的特异性isoform数目
awk '$2>15{print $0}' 11|awk '{print $4}' >A_20AS
awk '$7>15{print $0}' 11|awk '{print $9}' >B_20AS
done
```

#### 分析At、Dt不存在保守转录本的基因，在AS上的差异

> **AS有助于形成基因组特异性的转录本**，并且At和Dt中存在保守转录本的基因的比例比较低。AS是否是造成At、Dt间发生分化的原因。接下来分析At、Dt中不存在保守转录本的这些基因的特异性的转录本是否与AS有关；这些亚组特异性的转录本里有多少是AS isoform(也就是与参考转录本相比发生了AS的)

```bash
###亚基因组间不存在保守转录本的基因
python ASDiffer/ASregularunConservegene.py -homolog At_vs_Dt_collinerity.txt  -FPKMAt ../TM1_gene_FPKM.txt  -FPKMDt ../TM1_gene_FPKM.txt  -ORFAt ../TM1_ORF.txt  -ORFDt ../TM1_ORF.txt  -ASAt ../TM1_AS.txt  -ASDt ../TM1_AS.txt  -gtfAt ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Ghirsutum_gene_model.gtf -gtfDt ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Ghirsutum_gene_model.gtf -reforfAt ../../collapse/TM1_reference.orf  -reforfDt ../../collapse/TM1_reference.orf  -o zzzz

+ At_Dt_noneConserve ##亚基因组间不存在保守转录本的基因总数分类：
+ At_reference_nonDt  ##只有A亚组转录出与参考转录本一致的CDS
+ Dt_reference_nonAt ##只有D亚组转录出与参考转录本一致的CDS
+ nonAt_nonDt_reference ##A、D亚基因组都没有转录出与参考转录本一致的CDS
+ At_Dt_reference ## At、Dt都转录出与参考转录本一致的序列但是，A、D参考转录本本身的序列就不一致
```

在At或者Dt与参考基因组比较时，只有A亚组转录出与参考基因组相同的转录本基因比例与D亚组的比例上没有差异。

比较只有A亚组转录出了与参考转录本一致的CDS而D亚组没有转录出来的基因在三个方面的差异：

+ AS isoform数目上的差异；**可变剪切的保守性分析**
+ FPKM上的差异
+ GO的功能富集
+ 举个例子

> **Ghir_A01G000300存在IR事件导致提前终止而Ghir_D01G000310则不存在**
>
> Ghir_D01G007630这个基因存在一个A3事件导致起始密码子滞后，改变了ORF的长度

```bash
##对AS进行注释
python ASDiffer/ASAnnotion.py  -gene At_reference_nonDt -ORF ../TM1_ORF.txt -AS ../TM1_AS.txt  -o At_reference_nonDt_annotion
## 提取与参考转录本存在AS差异
 grep -E -v "^$" At_reference_nonDt_annotion |grep Ghir_A|less
```

为了衡量这些A、D同源基因在AS上存在差异，对AS的位置进行了注释

> At基因转录出与参考转录本一致的CDS而Dt亚基因组没有转出出与参考基因组一致的CDS；通过将这些基因的AS（PacBio与参考转录本间存在差异）进行注释，比较这些AS的差异；
>
> + 总共有多少PacBio与参考转录本存在AS的差异
> + 这些差异的AS注释的区域
>
> 通过比较发现，

**转录本与参考转录本存在AS的差异**

| 类型        | 总转录本数 | AS isoform | 比例  |
| ----------- | ---------- | ---------- | ----- |
| A一致 时At  | 4462       | 1485       | 0.333 |
| A一致时 Dt  | 3749       | 2435       | 0.650 |
| D一致时，At | 3991       | 2719       | 0.681 |
| D一致时，Dt | 4768       | 1584       | 0.332 |

对这些AS isoform的AS事件进行注释**

```bash
cut -f1,4 At_reference_nonDt_annotion |grep  -E -v "^$" |sort|uniq|grep Ghir_A|grep 3UTR|wc -l
```

> **当At转录出与参考转录本一致的CDS时，**
>
> 对应的AS注释为coden比例：
>
> 896/(43+159+896)   81.6%
>
> 1325/(1325+42+24) 95.3%
>
> **当Dt转录出与参考转录本一致的CDS时**
>
> 对应的AS注释为coden比例：
>
> 948/(948+55+178)   80.27%
>
> 1409/(1409+53+17)  95.3%

| 类型        | 5UTR | 3UTR | coden |
| ----------- | ---- | ---- | ----- |
| A一致时，At | 159  | 43   | 896   |
| A一致时，Dt | 42   | 24   | 1325  |
| D一致时，At | 53   | 17   | 1409  |
| D一致时，Dt | 178  | 55   | 948   |

分析特异性的亚组间特异性的AS isoform,

> **亚组特异性AS isoform对应的AS events:** 
>
> 1. At转录本与参考转录本CDS一致，而Dt不一致时；并且只有Dt发生了AS，At没有发生AS；
> 2. Dt转录本与参考转录本CDS一致，而At不一致时；并且只有At发生了AS，Dt没有发生AS；

#### 总结

> 在不同棉种中鉴定完可变剪切和直系同源基因的数据后，接下来就是分析不同棉种中同源基因的AS差异。
>
> 首先根据基因表达量和PacBio检测到转录本的数目，找出expressed的基因；通过比较同源基因转录本CDS序列的长度来判断转录本是否相同；分析存在相同转录本的基因所占的比例，发现A2和D5同源基因具有相同功能转录本的基因比例最高；而At、Dt中的比例是最低的仅仅只有38%。A、D两个亚基因组存在于单个个体时表现出最高比例；而在多倍化后A、D亚组间具有保守转录本的基因比例迅速下降。
>
> 这里At、Dt的保守的比例这么低可能和AS有关，于是根据基因是否鉴定到AS分为存在AS的同源基因对和不存在AS的同源基因对；分析存在AS的基因中亚基因组特异性转录本的数目显著的增加，说明AS有助于同源基因转录出一些特异性的转录本。接下来**讨论At和Dt中为什么只有这么少的同源基因存在保守的isoform**；（看看这些基因的isoform是否与二倍体存在保守）并且哪些基因转录出了与参考转录本一致的CDS；对这些不存在保守转录本的基因进行了一个分类，主要分成4大类。
>
> **At和Dt基因中不存在保守转录本的基因**：
>
> 1. At转录出与参考转录本一致的序列，但是Dt没有  1449/5944
>
> 2. Dt转录出与参考转录本一致的序列，但是At没有 1570/5944
>
> 3. At与Dt都没有转录出与参考转录本一致的序列 1270/5944
>
> 4. At与Dt都转录出与参考转录本一致的序列,但是At和Dt之间存在差异 1655/5944
>
>    
>
>    对基因进行一个定义
>
>    **表达的基因：**只要转录出的CDS与参考转录本CDS 长度上一致
>
>    **未表达的基因：**没有转录出与参考转录本CDS长度上一致
>
>    
>
>    通过分析这些同源基因中有24%的同源基因只在At中转录出了与参考转录本一致的序列，有26%的同源基因只在Dt中转录出了与参考转录本一致的序列；与此同时还有27%的同源基因，它们的参考基因组CDS不一致。
>
>    这里猜测是AS导致转录出的转录本与参考转录本不一致，通过统计发现在At表达而Dt未表达的基因中
>
>    At中**AS isoform(与参考转录本相比存在AS差异)**的比例为0.333，Dt的AS isoform为0.650；Dt中表达而At中未表达的基因中, At中AS isoform的比例为0.681，Dt中isoform的比例为0.332。
>
>    AS在基因在转录的过程中扮演着重要的作用，即使在正确转录出与参考转录本CDS一致的情况下，仍旧存在33%的转录本与参考转录本存在AS差异；而在没有转录出与参考转录本CDS一致的情况下，有65%的转录本存在AS的差异。对这些AS isoform的剪接事件所在的区域进行注释发现，80%和95%的剪接事件是发生在coden区域的。$\textcolor{red}{综上所述，A、D两个亚组在AS isofoms比例上存在着差异，}$$\color{red}{并且这些AS events主要发生在coden区域；从而影响后续翻译过程中的密码子识别。}$
>    
>    
>

#### $\color{red}{只在At中表达的基因，只在Dt中表达基因的GO和FPKM}$差异



***

### 分析AS isoform在四个同源基因中的变化

前面分析了At、与Dt之间存在分化后，接下来探讨AS在四个基因组$\color{red}{并行分化}$和$\color{red}{趋同进化}$的作用；

> A2与D5中30%的基因没有保守的转录本而在At与Dt中存在60%多的同源基因没有保守的转录本，这很矛盾。接下来通过将At、Dt中不存在保守转录本的同源基因分别与各自的二倍体祖先基因进行比较，分析这些同源基因特异性的转录本是否存在功能 Ghir_A01G000230 基因与DGhir_D01G000240 就存在两个不一样的转录本；并且都高表达；而在二倍体中都只转录出与D基因组相同的转录本
>
> **Ghir_A02G007670 二倍体中都只转录出与At基因组相同的转录本；而Dt转录出的转录本中与某个参考转录本存在AS，并且这个参考转录本与A2、D5、At中保守的转录本在CDS上一致的；则可以说明AS调控Dt基因的转录**；这里的调控分为两种，AS导致转录本降解，AS导致新功能的发生
>
> Gorai.005G219000基因的两个转录本分布由Ghir_A03G019040 与Ghir_D02G020390基转录；而A2的转录本却丢失掉了
>
> **Ghir_D01G022920基因**发生了一个外显子跳跃事件，产生的CDS序列长度为825，如果加上这个外显子78bp；刚好就和A2、D5、Dt的CDS序列一样长

#### 1.1筛选同源基因

+ FPKM>1,PacBio转录本数大于1；认为表达了
+ 四个同源基因中至少3个表达了
+ 参考一下参考转录本的CDS的长度信息

> Gorai.010G047000基因编码·出了4392长度的PacBio转录本并且与Gorai.010G047000.3是一致的；相比于Gorai.010G047000.1发生了inframeChange

总共$\color{red}{21066}$对同源基因在经过表达量的筛选后，一共得到了$\color{red}{10751}$对符合条件的同源基因。

**1.1.1 统计这四组同源基因中每个亚基因组AS gene 的比例**

根据筛选到的四组同源基因，统计每个基因组中发生AS的基因的比例；以及各个基因组之间，有多少同源基因同时发生AS;在发生AS的同源基因中，有1995个同源基因都存在AS，占所有已表达基因的18.56%

```bash
##同源基因发生AS的数目
awk '$4~/PB/{print $0}' AS/D5_AS.txt |cut -f2|sort |uniq |wc -l
##统计保守的
```

| A2         | D5         | At         | Dt         |
| ---------- | ---------- | ---------- | ---------- |
| 5435/10751 | 6142/10751 | 4553/10751 | 4556/10751 |

接下来统计$\color{red}{AS  isoforms}$（与ORF起始或终止位点相同的参考转录本相比，存在AS的差异）的转录本的保守情况

统计这些同源基因中转录出AS isoform的数目

```bash
##统计每个PacBio转录本与参考转录本相比是否发生AS，来定义AS isoform
python ../../At_vs_Dt/ASDiffer/PacBiovsRef.py  -ORF ../../TM1_ORF.txt   -gtf ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Ghirsutum_gene_model.gtf -AS ../../TM1_AS.txt  -refORF ../../../collapse/TM1_reference.orf  -o zzzzzzzzz
```

**这里是总的基因 对应的AS isoform**，还需要统计10751个同源基因中AS isofrom的数目

| A2    | D5    | At   | Dt   |                        |
| ----- | ----- | ---- | ---- | ---------------------- |
| 9471  | 8503  | 7909 | 7901 | 检测到的 isoform       |
| 2573  | 2170  | 1422 | 1440 | 从同源基因中推断得到的 |
| 12044 | 10673 | 9331 | 9341 | total                  |

#### 统计AS isoform在多倍化中的变化

A2中的AS isoforms在多倍化后的状态：

+ 在At和Dt中都存在保守的AS isoform
+ 要么在At中保守，要么在Dt中保守

同理Dt中的也进行一个统计

```bash
##统计不同基因组间保守的AS isoform
python conserve_AS_isoform.py -homolog ../all_homologGene.txt  -A2 A2_pacBio_AS.txt  -D5 D5_pacBio_AS.txt -TM1 TM1_pacBio_AS.txt  -o zzzzzz
##统计对应的基因
sed '/^$/d' zzzzzz |sed 's/,.*//g' |cut -f1|xargs  -I {} grep -E "{}\s+" A2_pacBio_AS.txt |cut -f3|sort |uniq |xargs  -I {} grep {} ../all_homologGene.txt >A2_At_Dt_ASIsoform_geneList
##要么与At保守、要么与Dt保守
sed '/^$/d' A2_At_noDt_ASIsoform.txt |sed 's/,.*//g' |cut -f1|xargs  -I {} grep -E "{}\s+" A2_pacBio_AS.txt |cut -f3|sort |uniq |xargs  -I {} grep {} ../all_homologGene.txt |cat - A2_At_Dt_ASIsoform_geneList |sort|uniq -u >A2_At_noDt_ASIsoform_geneList

```

统计A2、D5中AS isoform在多倍化后的状态

| 二倍体 | 在两个亚组都保守 | 只在At中保守 | 只在Dt中保守 | Total |
| ------ | ---------------- | ------------ | ------------ | ----- |
| A2     | 653              | 1090         | 704          | 2447  |
| D5     | 710              | 1113         | 712          | 2535  |

> A2中有2,447(45.02%)AS基因在多倍化过程中存在保守的AS isoform； D基因组中有2,535(41.27%)AS基因在多倍化过程中存在保守的AS isoform

有多少AS isoform在多倍化后丢失掉了

```bash
#统计保守isoform的数目
cat A2_At_Dt_ASIsoform.txt A2_At_noDt_ASIsoform.txt A2_noAt_Dt_ASIsoform.txt |awk '$1=="AS"{print $0}'|cut -f2|sed 's/,/\n/g'|sort |uniq |wc -l
```

| 基因组 | 保守的       | 丢失的AS isoform | total |
| ------ | ------------ | ---------------- | ----- |
| A2     | 5100(42.34%) | 6944(57.66%)     | 12044 |
| D5     | 4903(45.94%) | 5770(54.06%)     | 10673 |

统计At和Dt中的AS isofrom在多倍化前的状态

| 四倍体亚基因组 | 在二倍体中保守 | 只与A2保守 | 只与D5保守 |
| -------------- | -------------- | ---------- | ---------- |
| At             | 914            | 923        | 451        |
| Dt             | 884            | 510        | 884        |

有多少AS isofrom是在多倍化后新产生的

| 基因组 | 保守的       | 新产生的     | total |
| ------ | ------------ | ------------ | ----- |
| At     | 4121(44.16%) | 5210(55.84%) | 9331  |
| Dt     | 4053(43.39%) | 5288(56.61%) | 9341  |



>  **四倍体中大多数AS isoform转录本可能是多倍化后产生的**，并且二倍体中很多AS isoform在多倍化后丢失掉了（也可能是由于组织测的不够多）；同时在四倍体中存在43%~44%的AS isoform保守，而将近有55%的AS isoform转录本是多倍化后产生的。A2、D5在多倍化过程中AS isoform没有偏好性

#### ~~亚基因同源基因中AS isoform不对称的丢失和不对称的获得~~

从整体上来看A2与D5在AS isoform丢失的比例是差不多的，At、Dt获得AS isoform的比例也是差不多的。接下来对二倍体基因丢失AS isoforms的情况进行分类。

对丢失和获得的程度进行一个量化：

+ 只在A2基因组中的AS isoform在多倍化后发生丢失
+ 只在D5基因组中的AS isoform在多倍化后发生丢失
+ 只在At基因组中多倍化后获得新的AS isoform
+ 只在Dt基因组中多倍化后获得新的AS isoform

```bash
##A2基因发生AS isofroms lost
cat A2_AS_isoform.txt A2_conservedASIsofrom A2_noidentifyASisoform.txt |sort |uniq -u 
##D5基因发生AS isoforms lost

```

在二倍体A2和D5中有多少AS isoform同时发生丢失，多少A2中特异性的AS isoform发生丢失，多少D5中特异性的AS isoform发生丢失

#### AS调控同源基因的表达

**transcript regulation and post-transcript regulation**

多倍化过程中造成同源基因表达量下调的最有可能是转录调控的差异导致的；

> 首先比较A亚组同源基因对表达量是否存在差异；
>
> 判断同源基因中主要转录的isoform ORF的比例是否一致；

##### 提取同源基因的表达量

```bash
python ~/work/Alternative/result/Gh_result/CO31_32_result/ORF/AddAnnotionTag.py ../../../TM1_gene_FPKM.txt ../../all_homologGene.txt   2
##所有基因的总FPKM值进行归一化
TM1：557211；A2：886732；D5：585450   比例：1.59  1.51
##筛选FC >2 的差异表达基因 A-B/min(A,B)

```

| 二倍体               | 下调表达 | 上调表达 | 没有差异 |
| -------------------- | -------- | -------- | -------- |
| A2                   | 1863     | 112      | 8776     |
| D5                   | 1621     | 39       | 9091     |
| **At、Dt两个一起算** |          |          |          |
| A2                   | 149      | 357      | 10245    |
| D5                   | 142      | 216      | 10393    |

在这些下调表达的基因中，有多少基因转录出一致的转录本；

1. 同源基因转录出最主要的那个转录本的比例仍旧是一致的；说明造成同源基因表达量改变的原因就可能就转录调控或者多倍化。
2. 在表达量不存在差异的情况下，转录本的表达比例发生改变，或者是不存在保守的转录本；这种基因可能就受到了转录调控和转录后调控

> 1. 表达是否发生改变
> 2. 计算比例最高的那个转录本
> 3. 比较同源基因间比例最高的那个转录本是否是一致的



筛选存在保守AS isoform的同源基因

+ A2和At中存在保守AS isoform
+ D5和Dt中存在保守AS isoform

```bash
##筛选A2 At中存在保守AS isoform的同源基因
cat A2_D5/A2_At_Dt_ASIsoform_geneList A2_D5/A2_At_noDt_ASIsoform_geneList  At_Dt/A2_D5_At_ASIsoform_geneList At_Dt/A2_noD5_At_ASIsoform_geneList |sort|uniq |wc -l
##提取对应的保守的AS isoform编号
for i in 1
do
 cut -f1,2,3 ../A2_D5/A2_At_Dt_ASIsoform.txt  >A2_At_conserved_ASisoform.txt
 cut -f1,2,3 ../A2_D5/A2_At_noDt_ASIsoform.txt >>A2_At_conserved_ASisoform.txt
 cut -f1,2,4 ../At_Dt/A2_D5_At_ASIsoform.txt >>A2_At_conserved_ASisoform.txt
 cat ../At_Dt/A2_noD5_At_ASIsoform.txt >>A2_At_conserved_ASisoform.txt
 awk '$1=="AS"{print $0}'  A2_At_conserved_ASisoform.txt|sort |uniq  >tmp
 mv tmp A2_At_conserved_ASisoform.txt
done
##筛选D5 Dt中存在保守AS isoform的同源基因
cat ../A2_D5/D5_At_Dt_ASIsoform_geneList ../A2_D5/D5_noAt_Dt_ASIsoform_geneList  ../At_Dt/A2_D5_Dt_ASIsoform_geneList  ../At_Dt/noA2_D5_Dt_ASIsoform_geneList  |sort |uniq  >D5_Dt_conserved_ASisoform_geneList
##筛选D5 Dt中保守的AS isoform编号

for i in 1
do
 cut -f1,2,4 ../A2_D5/D5_At_Dt_ASIsoform.txt  >D5_Dt_conserved_ASisoform.txt
 cut -f1,2,3 ../A2_D5/D5_noAt_Dt_ASIsoform.txt >>D5_Dt_conserved_ASisoform.txt
 cut -f1,3,4 ../At_Dt/A2_D5_Dt_ASIsoform.txt >>D5_Dt_conserved_ASisoform.txt
 cat ../At_Dt/noA2_D5_Dt_ASIsoform.txt >>D5_Dt_conserved_ASisoform.txt
 awk '$1=="AS"{print $0}'  D5_Dt_conserved_ASisoform.txt|sort |uniq  >tmp
 mv tmp D5_Dt_conserved_ASisoform.txt
done
```

比较同源基因的表达差异：

```bash
python ../AnnotionAS/isoformradio.py  -homolog ../../all_homologGene.txt  -FC A2_At_FC.txt  -isoformFPKM1 ../A2_transcript_FPKM.txt  -isoformFPKM2 ../TM1_transcript_FPKM.txt  -CDS1 ../PacBioIsoform/A2_pacBio_AS.txt  -CDS2 ../PacBioIsoform/TM1_pacBio_AS.txt  -o 11111
```

+ 表达水平存在差异，但最主要表达的转录本的ORF是一样的
+ 表达水平存在差异，并且主要表达的转录本的ORF发生了变化
+ 表达水平不存在差异，主要表达的转录本ORF没有发生变化
+ 表达水平不存在差异，



#### 保守AS isoform对应的AS events

> 同源基因间保守的剪切方式，产生对应的保守的AS isoform

保守的AS events:

+ 根据gtf注释文件判断AS events 发生在第几个intron区域

```bash
python AnnotionAS/conserve_AS_event.py  -homolog ../all_homologGene.txt  -A2isoform ASisoformLose/A2_conservedASIsofrom -Atisoform ASisoformLose/At_conservedASIsofrom -D5isoform ASisoformLose/D5_conservedASIsofrom -Dtisoform ASisoformLose/Dt_conservedASIsofrom -A2AS ../../A2_AS.txt  -D5AS ../../D5_AS.txt  -TM1AS ../../TM1_AS.txt -A2gtf ~/work/Alternative/result/Ga_result/CO11_12_result/07_annotation/merge.gtf -D5gtf ~/work/Alternative/result/Gr_result/CO41_42_result/07_annotation/merge.gtf -TM1gtf ~/work/Alternative/result/Gh_result/CO31_32_result/07_annotation/merge.gtf  -o 11
```







#### 转录后调控

同源基因总的表达量没有差异，但是最主要表达的那个转录本的表达水平、或者比例发生了变化













#### 同源基因参考转录本发生了变化

> Ghir_D03G009660 基因参考转录本长度为1932，而A2、D5、At的参考转录本长度均为1998；

多倍化对转录本的一个塑造

#### 并行分化

+ A2

#### 趋同进化















#### 1.A2、D5、At、Dt都存在保守的转录本



#### 2.At与Dt不存在保守的isoform，而At与二倍体都存在保守的isoform

```bash
python fourHomologAS.py  -homolog A2_D5_At_Dt_collinearity.txt  -FPKMA2 ../A2_gene_FPKM.txt  -FPKMD5 ../D5_gene_FPKM.txt  -FPKMAt ../TM1_gene_FPKM.txt  -FPKMDt ../TM1_gene_FPKM.txt  -ORFA2 ../A2_ORF.txt  -ORFD5 ../D5_ORF.txt  -ORFAt ../TM1_ORF.txt  -ORFDt ../TM1_ORF.txt  -o 11
```









