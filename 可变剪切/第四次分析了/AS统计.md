###  统计PB支持的AS

> 提取那些有PacBio支持的AS事件，并且去除了Scaffold，提取剪切事件所发生的转录本；
>
> 并且将那些剪切位置相差几个bp的AS合并了

```bash
### 对于IR事件发生在有重叠的坐标区域时，把对应的区域进行合并
python arrangeAS.py  -AS  ~/work/Alternative/result/Gr_result/CO41_42_result/11_AS/end_splice.txt -r ~/work/Alternative/data/Gr_genome/Graimondii_221_v2.1.gene.gtf -p ~/work/Alternative/result/Gr_result/CO41_42_result/07_annotation/merge.gtf -o D5_AS.txt
```

#### 统计AS的种类和数目

事件数目

| 基因组 | IR    | ES   | AltA | AltD | AltP | Other |
| ------ | ----- | ---- | ---- | ---- | ---- | ----- |
| A2     | 21575 | 2352 | 5847 | 4472 | 4394 | 4269  |
| D5     | 18345 | 2229 | 5350 | 3845 | 4185 | 6302  |
| TM1    | 32838 | 3723 | 9749 | 8252 | 7358 | 7915  |
| At     | 16123 | 1850 | 4878 | 4011 | 3621 | 3882  |
| Dt     | 16715 | 1873 | 4871 | 4241 | 3737 | 4033  |

基因数目

| 基因组 | IR    | ES   | AltA | AltD | AltP | Other |
| ------ | ----- | ---- | ---- | ---- | ---- | ----- |
| A2     | 9138  | 1499 | 3147 | 2614 | 2200 | 1881  |
| D5     | 7463  | 1443 | 2900 | 2295 | 2214 | 2285  |
| TM1    | 13573 | 2399 | 5414 | 4740 | 3780 | 3308  |
| At     | 6656  | 1210 | 2709 | 2345 | 1872 | 1672  |
| Dt     | 6917  | 1189 | 2705 | 2395 | 1908 | 1636  |

### IR和其他AS的关系

出现IR的地方同时也似乎容易出现AltA、AltD等情况，分析先有IR还是先有AltA、AltD；

> 获取剪切事件所在的基因组坐标而不是内含子坐标
>
>  提取既有IR又有AltA、AltD的基因出来；分析AltA与IR之间是否有着某种联系

```bash
## 获取剪切事件的基因组坐标
python findASposition.py
##分析IR与其他剪切事件的坐标之间的位置
#111 剪切事件在基因组的位置
#22 AltA与IR间的距离
#33 同时出现IR与AltA、AtlD的基因
python IR_AltA.py  -AS 111  -o 22 -sim 33 
##统计多少AltA与AltD与IR相距小于10bp
grep "AltA" 22|awk '{print $1"-"$5"-"$6}'|sort |uniq |wc -l
grep "AltD" 22|awk '{print $1"-"$5"-"$6}'|sort |uniq |wc -l
grep "AltA" 22 |awk '{a[$1"-"$5"-"$6]=0;if($7<=2){a[$1"-"$5"-"$6]+=1}}END{for(i in a){if(a[i]>0){print i}}}'|wc -l
grep "AltD" 22 |awk '{a[$1"-"$5"-"$6]=0;if($7<=2){a[$1"-"$5"-"$6]+=1}}END{for(i in a){if(a[i]>0){print i}}}'|wc -l
```

在存同时存在IR与AltA、AltD事件时；AltA、AltD与IR之间间隔小于2bp碱基

将近有27%左右的AltA、AltD与IR的事件的坐标是相差一个碱基的差异

| 基因组 | AltA      | AltD     |
| :----: | :-------- | -------- |
|  TM1   | 1015/3675 | 909/3385 |
|   A2   | 493/2032  | 538/1876 |
|   D5   | 527/1840  | 508/1638 |

### 鉴定保守的AS

```bash
## 统计同源基因间同时存在AS基因数和事件数目
for i in ExonS IntronR AltA AltD; do python ~/scripte/Alternative/module/homologASeventCount.py -homolog ~/work/Alternative/result/homologo/homologGene/A2_vs_At_collinearity.txt  -AS1 ../../conserveAS/allAS/A2_AS.txt -AS2 ../../conserveAS/allAS/TM1_AS.txt -T ${i} -o ${i}; tmp=`mktemp`done; sort ${i}|uniq >${tmp}; mv ${tmp} ${i}; done
awk '$2!=0&&$4!=0{print $0}' IntronR|awk '{a+=$2;b+=$4}END{print a,b,NR}'
##统计保守的基因数
cut -f1 -d"-" IR.txt_end |sort|uniq|wc -l
```

保守的IR

| 基因组 | 存在IR基因 | 保守基因 | 保守事件 | 基因组1 | 基因组2 |
| ------ | ---------- | -------- | -------- | ------- | ------- |
| A2 At  | 3570       | 2268     | 3827     | 9735    | 9580    |
| D5 Dt  | 3295       | 1901     | 2956     | 9142    | 8828    |
| A2 D5  | 3609       | 2033     | 3188     | 9652    | 9708    |
| At Dt  | 2911       | 1734     | 2737     | 7944    | 7871    |

保守的ES

| 基因组 | 存在IR基因 | 保守基因 | 保守事件 | 基因组1 | 基因组2 |
| ------ | ---------- | -------- | -------- | ------- | ------- |
| A2 At  | 299        | 189      | 200      | 576     | 543     |
| D5 Dt  | 285        | 163      | 186      | 569     | 573     |
| A2 D5  | 262        | 128      | 138      | 492     | 481     |
| At Dt  | 250        | 141      | 151      | 474     | 478     |
保守的AltA

| 基因组 | 存在IR基因 | 保守基因 | 保守事件 | 基因组1 | 基因组2 |
| ------ | ---------- | -------- | -------- | ------- | ------- |
| A2 At  | 891        | 462      | 523      | 2030    | 1960    |
| D5 Dt  | 835        | 413      | 473      | 1919    | 1791    |
| A2 D5  | 765        | 349      | 389      | 1704    | 1746    |
| At Dt  | 820        | 395      | 448      | 1792    | 1836    |
保守的AltD

| 基因组 | 存在IR基因 | 保守基因 | 保守事件 | 基因组1 | 基因组2 |
| ------ | ---------- | -------- | -------- | ------- | ------- |
| A2 At  | 659        | 348      | 385      | 1380    | 1358    |
| D5 Dt  | 640        | 312      | 353      | 1344    | 1432    |
| A2 D5  | 544        | 224      | 247      | 1055    | 1020    |
| At Dt  | 662        | 344      | 396      | 1414    | 1456    |

### uniq IR在另外一个基因组的坐标

这个uniq的IR在另外一个基因存在三种情况：

+  在另外一个基因组是intron，持续被剪切的状态
+ 在另外一个基因组变成exon，已经进化成exon了

```bash
##得到uniq的AS
awk '$3~/IntronR/{print $2,$1,$4,$5}' OFS="-" ../../allAS/A2_AS.txt >A2_all_IR.txt
##取uniq
cut -f1 ../IR.txt_end |cat - A2_all_IR.txt|sed 's/-[-+]//g'|sort |uniq -u
```

提取基因的固定长度的k-mer序列，使用bwa进行比对，获得uniq IR在另外一个基因组上的坐标；考虑到发生uniq IR的内含子在两个基因组中的长度可能会不一样，同时结合两端FEST序列进行一次锚定

```bash
## 取出基因组中两个注释文件的所有的Intron坐标，去冗余
python mergeRefPacBioIntron.py  -p ~/work/Alternative/result/Gh_result/CO31_32_result/07_annotation/merge.gtf  -r ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Ghirsutum_gene_model.gtf  -o 11
## 去冗余和去除scaffold
awk '$4~/Gh/&&$1!~/Sca/{print $0}' 11 |sed 's/\..*//g' |sort -k1,1  -k2,3n|uniq >TM1_AllIntron.txt
## 将IR与对应基因组的所有Intron进行比较，进行wu-Blast

```

#### 使用k-mer方法进行实验

+ 首先提取与uniq IR一样长的k-mer片段，实验wu-Blast进行比对，筛选必读长度和IR一样的，并且得分最高的

```bash
bsub -q smp -n 1 -J D5_A2 -e kmer.err -o kmer.out -R span[hosts=1] "python ../../k-merBWA.py -AS  D5_uniq_IR.txt -gff ~/work/Alternative/data/Ga_genome/G.arboreum.Chr.v1.0.gff  -fa1 ~/work/Alternative/data/Gr_genome/Graimondii_221_v2.0.fa -fa2 ~/work/Alternative/data/Ga_genome/G.arboreum.Chr.v1.0.fasta  -ho ~/work/Alternative/result/homologo/homologGene/A2_vs_D5_collinearity.txt"
```

> 先进行的是k-mer方法，之后又使用两端FEST方法；看两种方法的交集怎么样

由于FEST取的是左右300bp，因此假阳性情况会比较多，尽量与k-mer的数据为准

```bash
##获取wu-Blast的最优的结果
cat 111|awk '$1~/^evm/&&$2~/^Ghir_A/{print $0}$1~/^Ghir_A/&&$2~/^evm/{print $2,$1,$3}' OFS="\t"|sort |uniq |awk '{print $2,$3,$1}' OFS="\t"|sort  -k3 -k2,2nr|uniq -f2|awk '{print $3"\t"$2"\t"$1}'|sort -k3 -k2,2nr|uniq -f2   >At_uniq_Dt.txt
##统计wu-Blast方法中得到保守，在k-mer中同样保守的数目
cut -f1 At_uniq_Dt.txt |xargs -I {} grep {} ./tmp1594714640/end |wc -l
## 合并两组数据，以k-mer的数据为准
sed '/^$/d' end |awk '{print "B\t"$1"\t"$2}' >../end
awk '{print "A\t"$1"\t"$3}' Dt_uniq_D5.txt |cat - end |sort -k2,2|awk '{print $1"\t"$3"\t"$2}'|uniq -f2|awk '{print $3"\t"$2}' >Dt_uniq_D5_end	
```

#### 将保守的与uniq的合并，统计IR在两个基因组的情况

```bash
##合并两次检测的保守IR
cut -f1,3 IR.txt_end|sed 's/-[+-]//g'  >1
cat uniqA2/A2_uniq_At_end  >>1
awk '{print $2"\t"$1}' uniqAt/At_uniq_A2_end >>1
###去个重
sort -k2,2 1|uniq -f1|awk '{print $2"\t"$1}'|sort -k2,2 |uniq -f1|awk '{print $2"\t"$1}' >2
mv 2 1
##统计IR是否发生
python judgeIR.py  -all all_AS.txt  -i A2_At/1 -o A2_At/2
```

### 统计这个区域是外显子、或者内含子

把所有的区域计算一下read的覆盖情况

```bash
### At区域的read覆盖情况
cut -f2 A2_At/1 |cat - At_Dt/1 |cut -f1|sort |uniq |awk -F "-" '{print $2"\t"$3"\t"$4"\t"$1}' >PIR_AS/At_Position
## 计算覆盖的read数目
```

将这段区域，与PacBio注释文件、参考基因组注释文件进行比较；判断它是否一直是以外显子的形式、或者一直以内含子的形式进行转录；还有一种复杂的情况是Ohter类

> 提取参考基因组和PacBio每个转录本的注释信息；将这段区域与转录本的注释信息进行比较；如果与内含子或者exon的交集，达到这个片段的90%以上，就认为这个区域是被注释为内含子或者外显子；~~如果在一个转录本中被注释为exon，另外一些被注释成intron；则认为发生了IR事件~~。最后统计在一个基因中所有转录本的情况；如果都满足注释为内含子或者都瞒住注释为外显子，就认为该区域为组成型内含子或组成型外显子

+ 外显子化
+ 内含子化
+ Other

**`r1 p1`对应2号文件的第一列**

```bash
## 对保守的区域进行注释
python ../annotion_conservePosition.py   -p1 ~/work/Alternative/result/Ga_result/CO11_12_result/07_annotation/merge.gtf  -p2 ~/work/Alternative/result/Gh_result/CO31_32_result/07_annotation/merge.gtf -AS ./2  -o 3333
## 提取每个区域的IR score值
python ../extractPIR.py -all ../all_IR_score.txt  -i 3333  -o 4444
## 统计IR score值的变化
grep 'IR\s+intron' -E 4444 |awk '{a+=$5;b+=$6}END{print a/NR"\t"b/NR}'
```



### 统计比例

画一个堆积的条形图：

```bash
for i in 1
do
grep 'IR\s+exon' -E 4444 |wc -l
grep 'IR\s+intron' -E 4444 |wc -l
grep 'IR\s+other' -E 4444 |wc -l
grep 'IR\s+IR' -E 4444 |wc -l
grep 'exon\s+IR' -E 4444 |wc -l
grep 'intron\s+IR' -E 4444 |wc -l
grep 'other\s+IR' -E 4444 |wc -l
grep 'IR\s+IR' -E 4444 |wc -l
done
```

A2 vs At

IR保守率：

| 基因组   | 外显子化 | 内含子化 | other | 保守 |
| -------- | -------- | -------- | ----- | ---- |
| A2发生IR | 1091     | 7650     | 3602  | 4221 |
| At发生IR | 686      | 4170     | 2958  | 4221 |

D5 vs Dt


| 基因组   | 外显子化 | 内含子化 | other | 保守 |
| -------- | -------- | -------- | ----- | ---- |
| D5发生IR | 774      | 7342     | 3278  | 3875 |
| Dt发生IR | 808      | 4912     | 4366  | 3875 |

A2 vs D5

| 基因组    | 外显子化 | 内含子化 | other | 保守 |
| --------- | -------- | -------- | ----- | ---- |
| A2发生IR  | 805      | 6187     | 4002  | 3766 |
| D5 发生IR | 480      | 5181     | 2725  | 3766 |

At vs Dt

| 基因组   | 外显子化 | 内含子化 | other | 保守 |
| -------- | -------- | -------- | ----- | ---- |
| At发生IR | 730      | 5486     | 2616  | 3234 |
| Dt发生IR | 777      | 5503     | 2765  | 3234 |

<img src="https://s1.ax1x.com/2020/07/16/UBilwQ.png" alt="UBilwQ.png" style="zoom:67%;" />

>  ，大部分变成了intron，少部分变成exon；四倍体中的IR大部分是由二倍体中的intron转变而来的。
>
> 并且在A2中有 1049/16545 的IR发生了外显子化； D5中774/15269 的IR发生外显子化。



#### ~~计算类型PIR值的变化~~

+ 外显子化的IR
+ 变成Intron的IR
+ 保持IR不变的IR

可以看出，发生外显子化的IR，它的PIR值很高；而发生intron化的内含子PIR值很低；

~~由于不同基因组在比较的时候，总read数目存在一个差异，统一将TM1再除以1.35倍~~

> PIR值：比对到intron的read/(intron+两端read)
>
> 外显子化的IR、与内含子化的IR在PIR值上的差异；多倍化后外显子化的IR，PIR值显著性的增加

```bash
##获取每种类型的PIR值的变化
grep -E "y\s+n" 3333 |grep "other"|cut -f1|awk -F "-" '{print $2,$3,$4,$1}' OFS="\t"|xargs -I {} grep {} ../PIR_AS/A2_PIR.txt >test/5
##看PIR平均值的变化
awk '$5+$6==0{a+=0}$5+$6!=0{a+=$6/($5+$6)}END{print a/NR}' 5
```

> 比较PIR值的差异：
>
> 由exon 变成IR状态，PIR值仍旧保持一个较高的值，说明这个位置不容易被剪切掉

+ 原先是exon，变成IR；仍旧是发生IR占据主导地位；当然也有剪切类型占据主导地位的
+ 原先是intron，变成IR
+ 原先是IR，变成IR
+ 原先是other，变成IR

> ~~IR变成intron的过程，PIR的值不减少，反而有所增加；可能是有些IR没有被鉴定到；或者存在AltA、AltD的情况导致的~~
>
> 由于多倍化物种在比对的时候，有问题因此在对A2和At间进行比较的时候，误差感觉比较大

```bash
## 多倍化前后PIR的变化情况
    grep "Chr" A2toAt/A2_IR_At_exon.txt |awk '$5+$6==0{a+=0}$5+$6!=0{a+=$6/($5+$6)}END{print a/NR}'
## 制作绘图数据
# IR to exon
grep "Chr" A2_IR_At_exon.txt |awk '$5+$6==0{print "0\tChr\tIR2exon"}$5+$6!=0{print $6/($5+$6)"\tChr\tIR2exon"}' >>plotdata
grep "Ghir" A2_IR_At_exon.txt |awk '$5+$6==0{print "0\tGhir\tIR2exon"}$5+$6!=0{print $6/($5+$6)"\tGhir\tIR2exon"}' >>plotdata
#exon to IR
grep "Chr" A2_exon_At_IR.txt  |awk '$5+$6==0{print "0\tChr\texon2IR"}$5+$6!=0{print $6/($5+$6)"\tChr\texon2IR"}' >>plotdata 
grep "Ghir" A2_exon_At_IR.txt  |awk '$5+$6==0{print "0\tGhir\texon2IR"}$5+$6!=0{print $6/($5+$6)"\tGhir\texon2IR"}' >>plotdata
# IR to intron
grep "Ghir"  A2_IR_At_intron.txt |awk '$5+$6==0{print "0\tGhir\tIR2intron"}$5+$6!=0{print $6/($5+$6)"\tGhir\tIR2intron"}' >>plotdata
grep "Chr"  A2_IR_At_intron.txt |awk '$5+$6==0{print "0\tChr\tIR2intron"}$5+$6!=0{print $6/($5+$6)"\tChr\tIR2intron"}' >>plotdata
# intron to IR
grep "Chr"  A2_intron_At_IR.txt |awk '$5+$6==0{print "0\tChr\tintron2IR"}$5+$6!=0{print $6/($5+$6)"\tChr\tintron2IR"}' >>plotdata
grep "Ghir"  A2_intron_At_IR.txt |awk '$5+$6==0{print "0\tGhir\tintron2IR"}$5+$6!=0{print $6/($5+$6)"\tGhir\tintron2IR"}' >>plotdata
```

#### 在同一个基因组内进行比较

+ 比如在A2中都是IR，为啥有的多倍化之后变成了外显子、内含子、IR、Other
+ 在At中都是IR，不同来源的IR，在剪切效率上同样不同

> Intron Ration score: 比对到内含子上的read数/内含子长度；再把read总数给标准化

```bash
## 在A2中是IR，在At中变成IR、exon、intron、Other
grep "y\s+n" -E 3333 |grep other|cut -f1 |awk -F "-" '{print $2,$3,$4,$1}' OFS="\t"|xargs -I {} grep {} ../PIR_AS/A2_PIR.txt >A2toAt/A2IRAtOther.txt  	
grep "n\s+y" -E 3333 |grep other|cut -f2|awk -F "-" '{print $2,$3,$4,$1}' OFS="\t"|xargs -I {} grep {} ../PIR_AS/TM1_PIR.txt >A2toAt/A2OtherAtIR.txt
## 由exon变成IR
grep "n\s+y" -E 3333 |grep exon |cut -f2 |awk -F "-" '{print $2,$3,$4,$1}' OFS="\t"|xargs -I {} grep {} ../PIR_AS/TM1_PIR.txt >A2toAt/A2_exon_At_IR.txt
## 有IR变成exon
grep "y\s+n" -E 3333 |grep exon |cut -f1|awk -F "-" '{print $2,$3,$4,$1}' OFS="\t"|xargs -I {} grep {} ../PIR_AS/A2_PIR.txt >A2toAt/A2_IR_At_exon.txt

## 由IR变成IR

## 由IR变成intron
grep -E  "y\s+n" 3333 |grep intron|cut -f1 |awk -F "-" '{print $2,$3,$4,$1}' OFS="\t"|xargs -I {} grep {} ../PIR_AS/A2_PIR.txt >A2toAt/A2_IR_At_intron.txt

## 有intron变成IR
grep -E  "n\s+y" 3333 |grep intron|cut -f2|awk -F "-" '{print $2,$3,$4,$1}' OFS="\t"|xargs -I {} grep {} ../PIR_AS/TM1_PIR.txt >A2toAt/A2_intron_At_IR.txt

## 二倍体祖先数据
 awk '{print $7"\tIR2exon"}' A2_IR_At_exon.txt >>A2_plot
 awk '{print $7"\tIR2intron"}' A2_IR_At_intron.txt >>A2_plot
 awk '$1~/Chr/{print $7"\tIR2IR"}' A2_IR_At_IR.txt >>A2_plot
 awk '{print $7"\tIR2other"}' A2IRAtOther.txt >>A2_plot
## 四二倍体数据
awk '{print $7"\texon2IR"}' A2_exon_At_IR.txt >>At_plot
awk '{print $7"\tintron2IR"}' A2_intron_At_IR.txt >>At_plot
awk '$1~/Ghir/{print $7"\tIR2IR"}' A2_IR_At_IR.txt >>At_plot
```

通过对A2中的IR分析发现，大部分的IR在多倍化之后变成了内含子；根据分类发现外显子化的内含子有着最高的IR score值

<img src="https://s1.ax1x.com/2020/07/15/U0B5cR.png" alt="A2" style="zoom:80%;" />

通过对At中的IR分析发现，大部分的IR在二倍体中同样是IR；同样有些在二倍体中是exon；在四倍体中变成IR；并且这些内含子化的exon在mRNA中仍旧有较高比例的保留

<img src="https://s1.ax1x.com/2020/07/15/U0DJ29.png" alt="At" style="zoom:80%;" />



#### 看一下外显子化的IR有多少交集，并且进行GO富集分析

~~这种外显子化、内含子化，可能起着调控基因表达的作用~~

> A2多倍化为At时，有一个IR发生了外显子化；而D5与Dt始终是外显子；表达量增加
>
> A2多倍化At时，有一个外显子发生了内含子化；而D5与Dt始终是外显子；表达量减少

A2多倍化过程中外显子化的IR：801个，其中有389个IR在D5中是外显子

D5多倍化过程中外显子化的IR:  389个，其中有173个IR在A2中是外显子

+ 二倍体祖先基因组，IR外显子化

```bash
## 获取A2到At中外显子化的基因,看一下在D5中的状态
grep "y\s+n" -E A2_At/3333 |grep exon |cut -f1|xargs  -I {} grep {} ../A2_D5/3333 >test.txt
grep exon test.txt|wc -l 
cut -f5 test.txt|sort|uniq -c
## 获取D5到Dt中外显子化IR，看一下在A2中的状态
grep "y\s+n" -E ../D5_Dt/3333 |grep exon |cut -f1|xargs  -I {} grep {} ../A2_D5/3333 >test.txt2
grep exon test.txt2 |wc -l
cut -f5 test.txt2|sort|uniq -c
```

+ 四倍体IR由外显子转化而来的IR

At基因组中由exon转变为IR：552个，其中有233个在Dt中是exon的状态

Dt基因组中由exon转变为IR：492个，其中有308个在At中是exon的状态

```bash
## 获取A2到At过程中，exon转变为IR
grep -E "n\s+y"  ../A2_At/3333 |grep exon|cut -f2 |xargs -I {} grep {} 3333 >test.txt
cut -f5 test.txt |sort|uniq -c
## 获取D5到Dt过程中，exon转变为IR
grep "n\s+y" -E ../D5_Dt/3333 |grep exon|cut -f2 |xargs  -I {} grep {} 3333 >test.txt2
cut -f5 test.txt2 |sort|uniq -c
```

#### GO富集分析

+ At中的GO

A基因组外显子化的基因、从外显子转变成IR的基因；因为即使变成IR之后PIR值也还是很高的

```bash

```

+ Dt中的GO



### 亚基因组特异性的AS

+ At与Dt进行比较的时候，例如At中存在IR、Dt中不存在IR；并且At中那个IR的地方有很多read覆盖，而Dt中几乎没有read覆盖

提取At中发生IR的IRscore ，Dt中没有发生IR的IR score；存在显著性差异

> At中发生IR、Dt中没有发生IR；并且发生IR的IR score值大于0.1，没有发生IR的值小于0.1
>
> 排除那些由于PacBio没检测到的IR

```bash
## 筛选亚基因组中特异的IR
grep "intron\s+IR" -E test.txt|awk '$6>$5&&$5<=0.1{print $0}'|wc -l
```



+ A2与D5进行比较

```bash
## 提取所有事件的分类，和对应的IRS值
python extractPIR.py  -all all_IRScore.txt  -i At_Dt/3333  -o At_Dt/test.txt
```





