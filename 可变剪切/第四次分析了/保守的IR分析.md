## 分析IR在各个基因组的保守性



### 1.同一个基因组多倍化过程中的变化

A2中不同类型的IR，在IRscore值上的差异

+ 外显子化
+ 内含子化
+ other
+ 保守的IR

```bash
##获取每种类型中的IR score值
grep "IR\s+[Ieoi]" -E 4444 |awk '{print $3"2"$4"\t"$5}' >A2toAt/A2_IR.txt
```

At中不同类型IR 在IR score值上的差异

+ 由外显子转化为IR
+ 由内含子转化为IR
+ 保守的IR
+ other转换为IR

```bash
grep -E "[Rnr]\s+IR"  4444 |awk '{print $3"2"$4"\t"$6}' >A2toAt/At_IR.txt
```



<img src="https://s1.ax1x.com/2020/07/22/UHtbuR.png" alt="UHtbuR.png" style="zoom:80%;" />

> 完全外显子化，或者由外显子转化而来的IR；在IR score值上都是最高的；

#### 分析那些多倍化过程中由IR变成intron后，并且基因没有再发生AS的基因

例如在A基因组中，有多少基因；在D基因组有多少基因，在取个交集

> 在A基因组中有7650个IR事件发生了内含子化，对应了4265个基因；其中有2291个基因在多倍化后没有发生AS
>
> 在D基因组中有7342个IR事件发生了内含子化，对应了3947个基因，其中有1957个基因在多倍化后没有发生AS

```bash
## 祖先是IR多倍化后变成内含子化的基因
grep "IR\s+intron" -E 4444 |cut -f2 |cut -f1 -d "-" |sort |uniq >A2toAt/A2_IR_At_intron_gene
## 内含子化的基因中有多少是不会发生AS的
python ../noASgene.py ~/work/Alternative/result/Gh_result/CO31_32_result/11_AS/end_splice.txt ./A2toAt/A2_IR_At_intron_gene  A2toAt/A2_IR_AtnoAS_gene ~/work/Alternative/result/homologo/homologGene/At_vs_Dt_collinerity.txt
```

A2和D5取交集，看有多少基因的IR是同时丢失

> A基因组中2291个基因，D基因组中1957个基因；总共有313个基因是在A、D基因组中同时丢失了AS

```bash
awk '{print $2"\t"$1}' D5_IR_Dt_noAS_gene |cat - ../../A2_At/A2toAt/A2_IR_AtnoAS_gene |sort |uniq -d |wc -l
```

#### 分析那些在祖先中没有发生AS，而多倍化之后发生IR的基因

```bash
## 祖先是内含子的基因，多倍化后变成IR
grep "intron\s+IR" -E 4444 |cut -f1 -d "-" |sort |uniq >A2toAt/A2_intron_At_IR_gene
python ../../noASgene.py  ~/work/Alternative/result/Gr_result/CO41_42_result/11_AS/end_splice.txt D5_intron_Dt_IR_gene  D5_noAS_Dt_IR_gene ~/work/Alternative/result/homologo/homologGene/A2_vs_D5_collinearity.txt
```

> 在A基因组中4170个IR事件是由intron转化而来的，对应了2502个基因，其中有874个基因在A2中没有发生AS
>
> 在D基因组中4912个IR事件是由intron转化而来的，对应了2889个基因，其中有1352个基因在D5中是没有发生AS

At与Dt取交集，看有多少基因是同时获得IR的

> A基因组有874个基因，D基因组中1352个；总共有89个基因同时获得了IR事件

通过比较A、D基因组在多倍化过程中的变化也发现，基因同时获得IR事件的比例89/874是比同时丢失的比例313/1957低的。

#### 分析多倍化过程中保守的IR事件

>  A基因组中一共有4221个保守的IR事件,D基因组中一共有3875个保守的IR事件；在A、D基因组中都保守的IR事件只有721个

```bash
## 获取保守的IR事件
grep "IR\sIR" 4444 |wc -l 
```

取个交集，看A、D两个亚基因组同时保守和只在A基因组中保守的IR事件

```bash
##D基因组中保守的IR
grep "IR\s+IR" -E 4444 |cut -f2 |xargs  -I {} grep {} ../At_Dt/At_vs_Dt/At_IR_Dt_IR.txt |cut -f1 |xargs  -I {} grep {} ../A2_At/A2toAt/A2_IR_At_IR.txt |wc -l
```

### 进行GO富集分析

#### 多倍化过程中IR丢失的基因

```bash
#提取FDR小于0.5的GO term
awk -F "\t" '$9<=0.05{print $1,$2,$3,$4,$4/$6,$8}' OFS="\t" DtlostGo.txt >DtlostGo.plot
#再手动筛选一下，显著的通路
```

#### 多倍化过程中获得IR的基因

> 可能是由于基因数比较少，没有富集到显著的通路

#### 多倍化过程中保守的IR的基因

A基因组中保守基因的GO

D基因组中保守基因的GO

### 2.不同基因组间IR保守性的分析

