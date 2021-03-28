### 表观遗传调控基因的转录



#### 1.全基因组甲基化水平的展示

```bash
##合并两个重复的甲基化数据
cat Rep1_window_CHG.txt Rep2_window_CHG.txt |awk '{a[$1"-"$2"-"$3]+=$4/($4+$5)}END{for(i in a){print i"\t"a[i]/2}}'|sed 's/-/\t/g' >A2_Rep1_Rep2_window_CHG.bed
##转化成四倍体的坐标
##将bed文件转换为bam文件，建索引方便查找

```

#### 1.IR、intron在CG甲基化上的差异

> 计算的是相对甲基化程度: 被测到的C中，甲基化的c占所有测到的C的比例。

+ 过滤掉那些没有`CG`碱基的片段
+ CG甲基化是对称的，因此在正负两条链上的C都是被甲基化的，就是**相邻位置C碱基都被检测到甲基化**

```python
##计算相对甲基化
甲基化的C/检测到的C
python /public/home/zpliu/work/Alternative/result/Gh_result/CO31_32_result/15methylation/methylation/caculateCpGmethylation.py
##计算平均甲基化程度
for file in constitutive_exon constitutive_intron IR SE; do
  for i in CpG CHH CHG; do
    lines=$(wc -l ../${file}.bed | awk '{print $1}')
    awk '{a+=$2/($2+$3)}END{print "'${file}''${i}'""\t"a/"'$lines'"}' ${file}_${i}.txt
  done
done

```

>  较长的exon的CpG甲基化程度更低??
>
>  多倍化后，甲基化的程度也更高了；甲基转移酶效率变高了导致剪接效率降低？测序深度更高？亚组间序列高度重复导致重复比对的read数

| 基因组 | exon/SE均值 | intron/IR 均值 | exon检验  | IR检验    |
| ------ | ----------- | -------------- | --------- | --------- |
| TM-1   | 0.328/0.330 | 0.291/0.361    | 0.1712    | 2.2e-16   |
| A2     | 0.188/0.170 | 0.165/0.179    | 0.0001347 | 5.027e-14 |
| D5     | 0.247/0.243 | 0.224/0.274    | 0.0040    | 2.2e-16   |

#### 2. 全基因组的甲基化水平的展示

将三个基因组放在同一个circos里，首先要做的就是确定谁和谁是同源染色体关系，在进行等比例的缩放

> 确定同源染色体关系，通过判断染色体上同源基因的数目、共线性关系；需要注意整条染色体倒位的现象，在进行染色体normal的时候需要进行调整

![同源染色体对应关系](https://s3.ax1x.com/2020/11/28/DyNAvn.png)

```bash
##计算每个window的甲基化程度
sed -e 's/>//' -e 's/:/\t/' -e 's/-/\t/' A2_window_CHG.txt |awk '{OFS="\t";print $1,$2+1,$3,$4/$5}'|sort -k1,1 -k2,3n >A2_window_CHG.bed
##根据同源染色体关系修改坐标
python ../../scale_diploid_polyploidy.py -a ../../A2/chromosome.bed  -b ../../A2/intersect/A2_window_CpG.bed  -o A2_window_CpG.bed
```

#### 3.进化过程中基因转录本发生变化的同源基因，甲基化水平是否存在差异

+ DMGs和DSS，同一个基因组中**转录本变化**比较丰富的基因，它的甲基化程度与进化过程中保守的基因相比。

+ > 保守AS和不保守AS，在CpG甲基化水平的差异
  >
  > The maize methylome influences mRNA splice sites
  > and reveals widespread paramutation-like switches
  > guided by small RNA  

1.根据基因的分类，获取对应的甲基化水平

> gene的分类是依据同源基因中，转录本的保守情况来分的；
>
> + 完全保守的基因
> + 半保守基因
> + 差异基因

```bash
##获取每个基因覆盖的C中甲基化的C
awk '{if($NF<=0.09&&$7>=3){a[$1":"$2"-"$3][1]+=1;a[$1":"$2"-"$3][2]+=0}else if($NF>0.05){a[$1":"$2"-"$3][1]+=0;a[$1":"$2"-"$3][2]+=1}else{}a[$1":"$2"-"$3][1]+=0;a[$1":"$2"-"$3][2]+=0}END{for(i in a){print ">"i"\t"a[i][1]"\t"a[i][1]+a[i][2]}}' A2_Rep1_CpG.txt >11
##获取每种分类的平均甲基化程度
python /public/home/zpliu/work/Alternative/result/Gh_result/CO31_32_result/15methylation/evolutionMethylation/methylation_bygeneCategory.py ../../evolution4/A2_vs_AT/geneFPKM_isoformCount.txt  ~/work/Alternative/result/homologo/homologGene/A2_gene.gff  A2_gene_CpG.txt 11
##统计每类gene的平均甲基化水平，
grep mild A2_gene_category_CpG.txt |awk '{a+=$2}END{print a/NR}'

```

#### 2.保守的AS事件与不保守的AS事件在甲基化上的差异

+ 两个基因组保守的剪接事件间AS的差异
+ 一个基因组发生AS的丢失、或者是新的AS的产生

> 这里的AS就都只考虑IR和SE事件
>
> A2中的IR在使用K-mer去与Atexon取交集后，大部分都被固定成intron了；这就导致了At中为啥CpG水平会更高了。
>
> At中特有的IR去与A2的exon取交集，发现At中特有的IR都由 constitutive intron转变过来的。
>
> 为什么IR会向exon转变或者exon为什么会向IR转变。
>
> **看看 uniq IR向intron、或者intron向 uniq IR转变的例子**。
>
> + 进化过程中大部分都是IR和intron之间的转化
> + 进化过程中IR向intron转化类型，甲基化程度的变化
>
> 把IR在多倍化后转变的状态分成两类：
>
> + 多倍化后保持intron的状态
> + 多倍化后保持exon的状态
>
> **A2中特异性的IR事件在At中处于intron的状态，也有转变为exon状态的；统计这些两种转变状态比例和平均甲基化水平。**
>
> 从相同的k-mer序列中提取保守的C位点
>
> **分析保守C胞嘧啶的甲基化差异。**

A2中uniq的IR在多倍化后转化成哪种类型，At中uniq的IR主要由哪种元件转化而来。

>**为了避免由于测序深度和序列变异导致在不同基因组比较时产生的误差，只比较保守的C位点的甲基化程度差异**。
>
>保守C位点在IR与intron间的甲基化程度差异，统计每个片段保守的C差异达到0.5以上的占片段中保守C的比例。
>
>+ A2中exon转变为At中的intron在甲基化水平上没有差异
>+ A2中的intron转变为A2中的intron后
>+ 甲基化水平明显上升了

在对多倍化过程中变化的片段分类后，比较片段之间保守C位点的甲基化程度差异，有多少片段的C是完全保守的，有多少片段的C变多了。

> + 甲基化程度的改变导致剪接机制的改变
> + 序列水平的变异导致剪接机制的改变

```bash
##提取片段之间保守的胞嘧啶


##获取IR多倍化后转变为intron的例子
awk '$5!="."&&($3-$6)/($3-$2)>0.95||($2>=$6&&$3<=$7){print $0}' 四倍体kmer坐标与四倍体constitutive，intron交集 |cut -f1-3 |sort -k1,1 -k2,3n|uniq >A2_At_IR2intron
## 获取IR多倍化后转变为exon的例子
 cat A2_At_IR2intron A2_uniq_IR_At.bed |sort -k1,1 -k2,3n|uniq -u|wc -l

##计算某一个区域的甲基化水平
awk '{if($8>3&&$11<=0.05){a[$4][1]+=1;a[$4][2]+=0}else{a[$4][1]+=0;a[$4][2]+=1}}END{for(i in a){print i"\t"a[i][1]/(a[i][1]+a[i][2])}}' A2tmp

##多倍化过程中丢失的IR和SE事件
cut -f1 A2_At_conserve_SE.txt |sort |uniq |awk '{print $1"\tNone"}'|cat - A2_AS_At_kmer.txt |awk '{print $2"\t"$1}'|sort -k2,2|uniq -f1 -u|grep  SE|awk '{print $2"\t"$1}' >A2_uniq_SE.txt
##多倍化过程中新获得的IR和SE事件

##多倍化过程中保守的IR事件

##保守与不保守的AS在intron附近甲基化程度的差异
python AS_flankCoordinateBed.py -i AS_bed/A2_uniq_IR.txt  -a diploidRI -o A2_uniq_IR.bed
##提取对应的坐标作为bed文件
awk '$1~/Chr/{print $0}' ../01AS_bed/A2_uniq_IR.bed >02methylation_interactive/A2.bed
awk '$1~/Ghir/{print $0}' ../01AS_bed/A2_uniq_IR.bed >02methylation_interactive/At.bed
##与全基因组甲基化水平取交集
~/software/bedtools2-2.29.0/bin/intersectBed  -loj -a A2.bed  -b /data/cotton/zhenpingliu/QingxinSong_GB_DNAmethlation/A2/Rep1/02deduplicate_methylation/CpG_fdr.bed  >A2_CpG_intersect.out

## 计算所有覆盖到的平均甲基化程度
grep alloploidUniqIR At_Rep1_CpG.txt |awk '$2==$8{print $0}'|awk '{if($13<=0.05){a[$4][1]+=1;a[$4][2]+=1}else{a[$4][2]+=1}}END{for(i in a){print i"\t"a[i][1]/a[i][2]}}'|sort -k1,1n >1
##计算所覆盖到的每个胞嘧啶的平均甲基化程度(甲基化read/总read)


alloploidUniqIR
alloploidUniqSE
conservedIR
conservedSE
diploidRI
diploidUniqSE
```

计算**DmCs** Differentially methylated cytosines  

```bash
##统计read总数
A2 203036174
At 819485163
##提取IR附近的碱基序列
awk '$1~/^>/{printf $0"\t"}$1~/^[^>]/{print $0}' A2_AS.fasta|awk '{split($1,a,"::");print a[2]"\t"a[1]"\t"$2}'|sed -e 's/:/\t/' -e 's/-/\t/' >11

##提取两个基因组中位置相同处，并且序列一致的bed文件
awk '$1~/^>/{printf $0"\t"}$1~/^[^>]/{print $0}' At_AS.fasta|awk '{split($1,a,"::");print a[2]"\t"a[1]"\t"$2}'|sed -e 's/:/\t/' -e 's/-/\t/' |cat - 11 |awk '$1~/Ghir/{a[$4][1]=$5;a[$4][2]=$1"-"$2"-"$3;}$1~/Chr/{a[$4][3]=$5;a[$4][4]=$1"-"$2"-"$3;}END{for(i in a){if(a[i][1]==a[i][3]){print a[i][2]"\t"a[i][4]"\t"a[i][1]"\t"i}}}' >22
```

#### 不同剪切事件在表观上的差异

> IR事件的CpG甲基化,比intron的CpG甲基化程度要高

在C上的甲基化差异程度

> **有的剪接事件即使序列水平上存在很大差异，但仍旧存在AS事件；而有的即使序列很保守；但却不存在保守的AS事件。**
>
> 不同类型的剪接事件在DNA甲基化上的差异。
>
> **这个事件得过滤一下，有些特异性的事件PSI值很小。**
>
> 筛选标准：PIR值
>
> + **分析两个坐标间序列的相似程度**
> + DNA甲基化程度 差异
>

**分析多倍化过程中保守的C嘧啶的甲基化程度是否存在差异**

```bash
##获取事件的BED坐标
python ~/github/zpliuCode/Isoseq3/04ASconserved/extractAScoordinate.py 
##分染色体跑
python ~/github/zpliuCode/Isoseq3/07methylation/singleCytosinsMethylation.py  甲基化染色体文件目录 剪接事件坐标文件 输出文件前缀
##每个区域胞嘧啶的甲基化程度
cat Chr*|awk '$9>=3{a[$4][1]+=1}$9=="."{a[$4][1]+=0;a[$4][2]+=0}$9!="."{a[$4][1]+=0;a[$4][2]+=1}END{for(i in a){print i"\t"a[i][1]"\t"a[i][2]}}' |awk '$3==0{print $0}'   >最终文件
```

### 分析DMCs(差异的甲基化位点)

> 过滤掉相似度低于90%的k-mer，获取对应的DMRs和DMCs位点。
>
> 多倍化过程中：保守的胞嘧啶位点位点甲基化程度
>
> ##保守的RI、SE区域
>
> ##不保守的RI、SE区域

**得到保守的胞嘧啶位置:**

+ 保守的区域中的保守胞嘧啶位点
+ 左右各50bp的read

```bash
##筛选两个基因组间保守k-mer长度不超过10bp的的区域
awk 'sqrt(($3-$4)*($3-$4))<=10{print $0}' ../A2RI2intron.txt >A2RI2intron_filter.txt 
##得到RI2intron的fasta序列
python ~/github/zpliuCode/Isoseq3/04ASconserved/extractAScoordinate.py
##得到保守的胞嘧啶位点
python ~/github/zpliuCode/Isoseq3/07methylation/conservedSytosins.py 保守的剪接事件对应的文件  剪接事件的fasta文件 ~/software/muscle3.8.31_i86linux64 单核苷酸的保守信息
##统计保守的C和保守的G的碱基数
 awk '$1==$2&&$1=="C"{print $3"\t"$4}' D5_Dt_nucle.txt| |wc -l
```

**计算保守胞嘧啶的甲基化程度**

```bash
##得到每个碱基事件中，保守C的甲基化数据
python ~/github/zpliuCode/Isoseq3/07methylation/singleCytosinsMethylation.py 基因组1的甲基化文件 基因组2的甲基化数据 保守的单核苷酸文件 输出文件
 awk '$3!="None"&&$6!="None"{print $0}' 44 |awk '{a+=$3/($3+$4);b+=$5/($6+$5)}END{print a/NR"\t"b/NR}'
```

> 多倍化过程中保守的C占区段内总的胞嘧啶的比例：
>
> A2 vs At: 	
>
> RI to intron： 190910*2/385580
>
> intron to RI :  110834*2/224118
>
> D5 vs Dt
>
> RI to intron：151016*2/306620
>
> intron to RI :  99436*2/202027



多倍化过程中AS的变化影响因素有多种可能：

+ exon相比于intron有更高的CG甲基化
+ 序列水平的差异导致的AS变化，**序列水平不一致的时候**，甲基化影响AS的程度
+ 序列完全一致的情况下，既有正影响，也有负影响

**AS事件的序列完全保守，比较甲基化的差异**

```bash
##计算两个片段序列的相似程度
python ~/github/zpliuCode/Isoseq3/07methylation/sequenceConservedRation.py  D5RI2intron.txt D5_Dt.fa  ~/software/muscle3.8.31_i86linux64 sequenceIdentity.txt 
##筛选序列完全一致的序列，平均甲基化程度是否存在差异。
awk '$NF==$(NF-1)&&$(NF-1)==$(NF-2){print $0}'  sequenceIdentity.txt |wc -l
##统计两个棉种中同源片段的甲基化程度
~/software/bedtools2-2.29.0/bin/intersectBed  -a D5.bed  -loj -b /data/cotton/zhenpingliu/QingxinSong_GB_DNAmethlation/D5/Rep1/02deduplicate_methylation/CpG_fdr.bed >D5_intersect.txt
##计算区域的甲基化程度
awk '$11=="."{a[$4][1]=0;a[$4][2]=1}$11<=0.05&&$11!="."{a[$4][1]+=1;}$11>0.05{a[$4][2]+=1}END{for(i in a){print i"\t"a[i][1]/(a[i][1]+a[i][2])}}' D5_intersect.txt|less

```

太多一对多的坐标了，把RI事件统一获取最保守的事件坐标和PRI值

```bash
##获取最保守的事件坐标
python ~/github/zpliuCode/Isoseq3/07methylation/filterRIeventcoordinate.py D5_Dt.txt D5_RI_Dt_RI.txt
##根据事件的长度的绝对差值再筛选一遍
awk 'sqrt(($3-$4)*($3-$4))<50{print $0}' D5RI2intron.txt |less
```



### 分析同源基因中存在AS的基因对于不存在AS的基因间Methylation水平的差异























