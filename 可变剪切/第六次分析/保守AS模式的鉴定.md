### 1.**筛选同源基因片段**

使用同源基因的序列进行all-vs-all BLASTN，筛选比对长度大于200bp，序列相似度达到90%，根据四种同源关系，筛选那些四个同源基因间共有的同源片段；

在片段内的相似的绝对坐标看剪切事件是否在区间内，并且不同基因组间在

+ 筛选同源片段的指标
+ 相似长度大于200，相似度大于90%

```bash
##进行blast
bsub -q smp -n 10 -R span[hosts=1] -J blast -e %J.err -o %J.out "blastn -query  blast.fa  -db ./blast -outfmt '6  qseqid sseqid qstart qend sstart send nident pident qcovs evalue bitscore'  -out test.blast -evalue 1e-5 -num_threads 10"
```

### 根据同源基因筛选同源片段

```bash
python blast.py  -homolog ~/work/Alternative/result/homologo/homologGene/A2_D5_At_Dt_collinearity.txt  -Blast test.blast  -geneBed all_gene.bed  -o 11111
```

#### 根据同源片段，筛选处于同一个片段的同一种剪切事件

```bash
##
python AS.py -Blast 1111  -A2 ~/work/Alternative/result/Gh_result/CO31_32_result/evolution2/A2_AS.txt  -D5 ~/work/Alternative/result/Gh_result/CO31_32_result/evolution2/D5_AS.txt  -TM1 ~/work/Alternative/result/Gh_result/CO31_32_result/evolution2/TM1_AS.txt  -o  At_Dt_AS
```

#### 筛选同源基因间保守的AS事件

```bash
 python ../conseve_AS.py  -AS At_Dt_AS  -o At_Dt_conerved_AS
```

#### 比较各个基因组中AS的差异程度

+ IR、SE与普通的exon、IR在CG含量、长度上是否存在一个差异

+ 比较AS gene和gene在染色体上的分布，是否存在关联
+ 比较不同基因组间保守的AS  pattern
+ 挑几个AS event进行照胶

#### IR、SE长度差异

```bash
##提取所有Intron的坐标
python ~/scripte/Alternative/extractIsformIntronPosition.py ~/work/Alternative/result/Gh_result/CO31_32_result/07_annotation/merge.gtf 11
##提取所有的mRNA坐标

##merge所有的intron坐标
sort -k1,1 -k2,2n 11  >22
~/software/bedtools2-2.29.0/bin/mergeBed -i  22 >all_intron.bed

##使用merge后的mRNA坐标减去merge后的intron坐标为Constitutive exon坐标
~/software/bedtools2-2.29.0/bin/subtractBed -a  all_mRNA.bed -b all_intron.bed >constitutive_exon.bed
##提取IR坐标
awk '$4~/PB/||$5~/PB/{print $3}' ../TM1_AS.txt |grep "RI"|awk -F ":" '{print $2"\t"$4}'|sed 's/-/\t/g' >IR.bed
##提取SE坐标
awk '$4~/PB/||$5~/PB/{print $3}' ../TM1_AS.txt |grep "SE"|awk -F ":" '{print $2"\t"$3"\t"$4}'|sed 's/-/\t/g'|cut -f1,3,4 >SE.bed
##使用merge后的intron坐标减去IR坐标为constitutive Intron坐标
 ~/software/bedtools2-2.29.0/bin/subtractBed -a  all_intron.bed  -b IR.bed >constitutive_intron.bed

```

> 在序列长度上，SE exon相比于constitutive exon长度更短，IR长度相比于constitutive intron在中位数上更长，而在平均数上IR相比于constitutive intron更短。

合并各个基因组的数据

```bash
##组成型exon
awk '{print $3-$2+1"\tconExon\tTM1"}' constitutive_exon.bed  >exon_plot.txt 
##SE
awk '{print $3-$2+1"\tSE\tTM1"}' SE.bed  >>exon_plot.txt
##组成型intron
awk '{print $3-$2+1"\tconintron\tTM1"}' constitutive_intron.bed  >>intron_plot.txt
##IR
awk '{print $3-$2+1"\tIR\tTM1"}' IR.bed  >>intron_plot.txt

##GC含量
awk '$1~/^[^#]/{print $5"\tIR\tA2"}' ~/work/Alternative/result/Ga_result/CO11_12_result/AS2/ASlength/IR_GC.txt  >>intron_GC_plot.txt

```

#### IR、SE在GC含量上的差异

```bash
##根据bed文件，提取对应的GC含量
~/software/bedtools2-2.29.0/bin/nucBed -fi ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Ghirsutum_genome_HAU_v1.0.fasta -bed constitutive_intron.bed >constitutive_intron_GC.txt
```

#### 保守的AS pattern

+ 使用k-mer构造与AS event长度相同的k-mer，保留相似度大于90%，相似长度占k-mer长度的90%以上，得分最高的k-mer片段
+ 将同源基因的k-mer片段与同源基因的AS事件取交集，并且为同类型事件，交集长度占k-mer长度的90%以上

**各个AS 事件的保守的比例**

```bash
python ~/work/Alternative/result/Gh_result/CO31_32_result/ORF/AddAnnotionTag.py  ~/work/Alternative/result/Gh_result/CO31_32_result/evolution2/A2_AS.txt ~/work/Alternative/result/Gh_result/CO31_32_result/evolution2/D5_AS.txt  ~/work/Alternative/result/homologo/homologGene/A2_D5_At_Dt_collinearity.txt  11
##统计总的基因中，每种剪切事件的数目
awk '$3!="0-0-0-0"&&$4!="0-0-0-0"{print $3"\t"$4}' At_Dt_ASCount.txt |sed 's/\t/-/g'|awk -F "-" '{a+=$1;b+=$2;c+=$3;d+=$4;e+=$5;f+=$6;j+=$7;k+=$8}END{print a"\t"b"\t"c"\t"d"\t"e"\t"f"\t"j"\t"k}'
```

**IR事件在四种比较中，占所有IR事件的比例**

| 比较 | A2_At     | A2_D5     | At_Dt     | D5_Dt     |
| ---- | --------- | --------- | --------- | --------- |
| 比例 | 1976/9263 | 1547/9263 | 1216/6194 | 1885/7452 |
|      | 1869/6194 | 1584/7452 | 1223/6311 | 1806/6311 |

SE事件在四种比较中，占所有SE事件的比例

| 比较 | A2_At    | A2_D5    | At_Dt    | D5_Dt        |
| ---- | -------- | -------- | -------- | ------------ |
| 比例 | 216/1352 | 187/1352 | 192/1173 | **312/1880** |
|      | 199/1173 | 185/1880 | 191/1122 | 314/1122     |

A3事件在四种比较中，占所有A3事件的比例

| 比较 | A2_At    | A2_D5    | At_Dt    | D5_Dt     |
| ---- | -------- | -------- | -------- | --------- |
| 比例 | 894/3880 | 846/4197 | 865/3993 | 1429/5694 |
|      | 876/4170 | 890/5676 | 858/3959 | 1318/4473 |

A5事件在四种比较中，占所有A5事件的比例

| 比较 | A2_At    | A2_D5    | At_Dt    | D5_Dt    |
| ---- | -------- | -------- | -------- | -------- |
| 比例 | 602/2749 | 440/2885 | 473/3135 | 786/3576 |
|      | 534/3212 | 464/3600 | 477/3104 | 745/3429 |

**各种保守剪切事件占据所有事件的比例；**

> 通过比较发现同一个直系基因组间AS的保守比例高于非直系同源基因组；并且IR、A3、A5事件相比于SE事件有着更高的保守比例

| 比较     | IR     | SE     | A3     | A5     |
| -------- | ------ | ------ | ------ | ------ |
| A2 vs At | 30.17% | 16.97% | 23.04% | 21.90% |
| D5 vs Dt | 28.62% | 16.60% | 29.46% | 21.98% |
| A2 vs D5 | 21.25% | 13.83% | 20.15% | 15.25% |
| At vs Dt | 19.64% | 17.02% | 21.67% | 15.37% |

| 类型                   | IR    | SE    | A3    | A5    |
| ---------------------- | ----- | ----- | ----- | ----- |
| 直系基因组平均保守率   | 29.39 | 16.79 | 26.25 | 21.94 |
| 非直系基因组平均保守率 | 20.45 | 15.43 | 20.91 | 15.31 |



**不同基因组在AS gene 数目上的差异**

这里AS geng统计的是PacBio转录本上发生AS的类型。

大致有29.92%~37.81%的同源基因是AS gene**多倍化过程中ASgene的数目在逐渐下降，在二倍体中D5 AS gene的数目显著性的高于A2基因组，而在多倍化后At、Dt间在AS gene的数目上没有显著性的差异**；并且有2009(9.5%)个基因在四个同源基因中都存在AS，在A2、D5、At、Dt中分别有1046,1220,522,566个亚基因组特异性的AS gene；进一步比较AS 基因包含AS 的数目发现**D基因组中更多的AS gene发生AS数目的减少**。仅仅只有2009(9.5%)的同源基因都存在AS事件

| 基因组 | AS gene | 非AS gene | total |
| ------ | ------- | --------- | ----- |
| A2     | 6417    | 14649     | 21066 |
| D5     | 6805    | 14261     | 21066 |
| At     | 5122    | 15944     | 21066 |
| Dt     | 5115    | 15951     | 21066 |



D5相比于Dt，同源基因的AS事件的数目在减少，而A2相比于At在基因AS的数目没有D基因组减少的显著；**D基因组中更多的基因发生AS的减少**

| 其他基因组 | AS数目发生减少 | 其他基因 | 总基因数 |
| ---------- | -------------- | -------- | -------- |
| A基因组    | 3930           | 17136    | 21066    |
| D基因组    | 5362           | 15704    | 21066    |

对四组同源基因对在AS数目上进行分类，AS数目上相差不超过两倍则认为是没有差异的

+ 二倍体高于四倍体
+ 二倍体低于四倍体
+ A2、D5、At、Dt 四个基因组在AS 数目上没有明显差异
+ A2、At都高于D5和Dt
+ D5和Dt都高于A2和At
+ A2一枝独秀
+ D5一枝独秀
+ At一枝独秀
+ Dt一枝独秀

```bash
##制作绘图数据，二倍体比四倍体AS数目多
awk '$5>$7&&$5>$8&&$6>$7&&$6>$8{print $0}' 22 |awk '{print $1"\t"$5"\tA2\n"$1"\t"$6"\tD5\n"$1"\t"$7"\tAt\n"$1"\t"$8"\tDt\n"}' >A2_D5_high_At_Dt.txt 

```



**保守的AS pattern：基因存在保守的AS事件**；

完全保守的AS pattern：所有的AS都是保守的。

```bash
python ../conserveASPattern.py -conserve A2_D5_conserve_AS  -AS1 ~/work/Alternative/result/Gh_result/CO31_32_result/evolution2/A2_AS.txt -AS2  ~/work/Alternative/result/Gh_result/CO31_32_result/evolution2/D5_AS.txt -ho ~/work/Alternative/result/homologo/homologGene/A2_D5_At_Dt_collinearity.txt -o 11
##完全保守的AS pattern
awk '$2==$3&&$2==$5&&$2!=0{print $0}' 11 |wc -l
```

A2和At间保守的AS pattern gene个数

> A2和At间总共有8667个基因存在AS，其中仅仅只有1746(20.1%)个基因存在保守的AS，而仅仅只有135个基因存在保守的AS模式

D5和Dt间保守的AS pattern gene 个数

> D5和Dt间总共有9449个基因存在AS，其中有2045(21.64%)个基因存在保守的AS，而仅仅只有108个基因存在完全保守的AS模式

A2和D5间保守的AS pattern gene 个数

> A2和D5间总共有9692个基因存在AS，其中有1621（16.73%）个基因存在保守的AS，仅仅只有86个基因存在完全保守的AS模式

At和Dt间保守的AS pattern gene 个数

> At和Dt间总共有8489个基因存在AS，其中有1417（16.69%）个基因存在保守的AS，而仅仅只有208个基因存在保守的AS 模式



与祖先基因组相比，约有16%~21.64%的直系同源基因都包含保守的剪切模式；同时A、D两个亚基因组在多倍化后，A、D之间存在保守AS模式的基因数目相比于祖先二倍体A2和D5中的状态来说更少了。

















