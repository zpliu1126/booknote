### 多倍化过程中isoform保守性分析

多倍化过程中的比较:

+ A2到At的变化
+ D5到Dt的变化

> 有的转录本CDS长度不相同，但是它存在一样的蛋白质保守结构域；
>
> 其中的可能性：
>
> + 不同基因组间本身就存在这种CDS差异情况
> + 由于AS的影响
> + 转录起始位点的不同导致蛋白质的截断

首先根据FPKM和PacBio转录本数目筛选同源基因对

保守转录本的定义： 

> CDS序列长度一样,**相似的氨基酸序列占整个氨基酸序列长度的**
>
> + CDS序列一样长
> + 序列相似度达到95%

分析转录本的氨基酸序列保守程度

```bash
python ~/github/zpliuCode/transcriptSV/transcript_CDS_identity.py -homolog ~/work/Alternative/result/homologo/homologGene/Result/D5_vs_Dt_collinearity.txt -fasta1 ~/work/Alternative/result/Gr_result/CO41_42_result/collapse/PacBio_CDS.fa -fasta2 ~/work/Alternative/result/Gh_result/CO31_32_result/collapse/PacBio_CDS.fa  -RNAseq1 D5_PacBio.txt -RNAseq2 TM1_PacBio.txt -prex1 D5  -prex2 Dt  -out transcriptSVs/D5_Dt_isoform_CDS.txt
```

+ 同一个基因组内，有多少**比例的AS会导致转录本CDS序列的改变**，甚至于有的AS不会导致CDS序列的改变。
  + Productive 转录本对应的CDS的长度
  + 发生AS的转录本的CDS的长度逐渐在减少
+ 同源基因是否存在功能保守(转录本的CDS序列保守)的转录本
+ 同源基因主要表达的转录本是否仍旧是功能保守的

| 两个亚基因组 | 存在保守转录本 | 总基因数 |
| ------------ | -------------- | -------- |
| A2 vs At     | 7569           | 11292    |
| D5 vs Dt     | 8272           | 11690    |

> 有些同源基因中没有鉴定到保守的转录本，但是与它们的参考转录本序列相比却是存在保守的，说明基因的转录后调控受到了影响。这种影响可以分为以下几种：
>
> + 转录起始位点的不同产生了截断的蛋白质
> + AS的存在导致氨基酸序列发生改变

1.这些保守的转录本在同源基因对中是否保持着一致的结构域

```bash
##根据CDS长度比较转录本的保守性
python homolo_isoform.py  -homolog A2_vs_AT/filter_homologGene.txt  -Aisoforms A2_PacBio.txt  -Areference A2_reference_isoform.txt  -Bisoforms TM1_PacBio.txt -Breference TM1_reference_isoform.txt  -o 11
##获取存在保守转录本的基因数
 python ../geneCategories.py -input 11  -o test
```

#### 根据同源基因转录本的保守性进行分类

> Ghir_A01G020200存在一个IR事件，虽然它转录出了与A2一样的转录本，但是它同时转录出了一个RI介导的转录本，两个基因在表达水平上相差很大。

+ 两对基因的所有转录本都是保守的
+ A2中所有转录本都是保守，但是At中有一些特异的转录本（AS 的存在，调控基因转录）
+ At中所有转录本都是保守的，但是A2中有一些特异性的转录本（AS的存在调控基因转录）
+ 除了保守的转录本，两边都还存在特异性的转录本
+ 不存在保守的转录本

```bash
##所有转录本都是保守的基因对
python ../geneCategories.py  -input 11  -o gene_allisoformConserve.py
##所有的转录本都是不保守的

```

A2 vs At

| 类型                                         | 数目 |
| -------------------------------------------- | ---- |
| 所有转录本都保守                             | 1752 |
| A2中所有转录本保守、但是At中有特异性的转录本 | 983  |
| A2中有特异性的转录本、但是At所有转录本都保守 | 1910 |
| A2、At除了保守转录本，两个都存在特异性转录本 | 2924 |
| 不存在保守的转录本                           | 3723 |

​									

| 类型                                         | 数目 |
| -------------------------------------------- | ---- |
| 所有转录本都保守                             | 2262 |
| D5中所有转录本保守、但是Dt中有特异性的转录本 | 1325 |
| D5中有特异性的转录本、但是Dt所有转录本都保守 | 2008 |
| D5、Dt除了保守转录本，两个都存在特异性转录本 | 2677 |
| 不存在保守的转录本                           | 3418 |

1.在不同类型基因中比较基因表达水平的变化

+ 所有转录本都保守的基因
+ 半保守的基因（既存在保守的转录本，又存在特异性的转录本）
+ 不保守的基因

统计每一类基因中特异性转录本的数目。

+ 不存在特异性的转录本
+ 既存在特异性的转录本，又存在保守的转录本
+ 没有保守转录本的存在

```bash
#将所有基因的表达数据和标签统计
awk -F "\t" '{printf $1"\t"$6"\tmild\n"$3"\t"$7"\tmild\n"}' D5_allconserve_Dt_special.FPKM >>geneFPKM_isoformCount.txt

awk  -F "\t"  '{printf $1"\t"$6"\tmild\n"$4"\t"$7"\tmild\n"}'  D5_special_Dt_allConserve.FPKM >>geneFPKM_isoformCount.txt

awk  -F "\t"  '{printf $1"\t"$7"\tmild\n"$4"\t"$8"\tmild\n"}' gene_conserve_allSpecial.FPKM  >>geneFPKM_isoformCount.txt

awk   -F "\t" '{printf $1"\t"$5"\thigh\n"$3"\t"$6"\thigh\n"}' gene_allisoformConserve.FPKM >>geneFPKM_isoformCount.txt


awk   -F "\t" '{printf $1"\t"$5"\tNone\n"$3"\t"$6"\tNone\n"}'  gene_allisoformSpecial.FPKM  >>geneFPKM_isoformCount.txt

```

#### 不同类型的基因表达水平的差异

```bash
##提取同源基因的特异性转录本数目
python specialIsoformCount.py  A2_specialIsoformAnnotion.txt  At_specialIsoformAnnotion.txt  ../geneFPKM_isoformCount.txt  ../test
```

> 特异性的转录本的存在，导致基因表达水平的下降；这些特异性转录本的表达水平和保守转录本的表达水平、CDS长度上是否存在差异

特异性转录本的表达水平和保守转录本的表达水平是否存在差异

比较特异性转录本与保守转录本在CDS长度上是否存在差异

> 保守的转录本相比于特异性的转录本CDS短，可能是由于AS导致转录本结构域的改变，使得CDS序列截断了
>
> + A2 vs At中 A2+At中保守的转录本与A2+AT中特异性转录本比较
> + D5 vs Dt中D5+Dt 中保守的转录本与D5+Dt中特异性的转录本比较

在存在保守转录本的基因中，最主要表达的转录本是否是在保守转录本之列

```bash
python /public/home/zpliu/work/Alternative/result/Gh_result/CO31_32_result/evolution4/A2_vs_AT/conserve_vs_specialIsoform/special_vs_conserveF-PKMDomain.py  -Aisoform ../../A2_PacBio.txt  -Bisoform ../../TM1_PacBio.txt  -input ../gene_withConserveIsoform.txt  -o 11
```

在存在保守转录本的基因中进行统计：

| 比较     | 表达最高的转录本仍旧是保守的转录本 | 存在保守转录本的基因 |
| -------- | ---------------------------------- | -------------------- |
| A2 vs At | 5090                               | 6689                 |
| D5 vs Dt | 5866                               | 7241                 |

> 特异性转录本的表达量都比保守的低，与此同时在比较存在保守转录本又同源基因中，分析这些基因中表达量最高的转录本仍旧是保守的。说明这些特异性的转录本可能不会影响基因的主要功能。

#### 特异性转录本的具体功能？

**特异性的转录本的产生有几种可能：**

+ AS（不同的剪切形式）不存在保守转录本时，就将特异性的转录本与参考转录本进行比较
+ 其他情况，例如不同的转录起始位点（导致蛋白质的截断）

```bash
##对特异性转录本分类
python ../specialIsoformAnnotion.py  ../../evolution2/TM1_AS.txt  gene_allisoformSpecial.txt  test
##统计保守转录本
cut -f1,2 ../gene_withConserveIsoform.txt |awk '{split($2,a,",");for(i in a){print $1"\t"a[i]}}'|grep -v "reference" >D5_conserve_isoform.txt
```

统计两两比较间有多少特异性的转录本、保守的转录本

| 基因组 | 保守的转录本 | 特异的转录本 | 特异转录本与保守转录本间存在AS 差异 | 其他原因导致的特异性转录本 |
| ------ | ------------ | ------------ | ----------------------------------- | -------------------------- |
| A2     | 17915        | 27629        | 17566                               | 10063                      |
| At     | 13386        | 18612        | 12831                               | 5781                       |
| D5     | 17151        | 21821        | 15032                               | 6789                       |
| Dt     | 15357        | 18106        | 12530                               | 5576                       |

> 比较这些可能由AS导致或者不同转录起始导致的特异转录本；比较它们和保守转录本间的表达水平，比较这些特异性的转录本与保守转录本相比它们的蛋白结构域是否有发生一个变化;CDS序列长度是否发生了变化

```bash
#将特异的转录本与保守转录本在结构域上进行比较
python /public/home/zpliu/work/Alternative/result/Gh_result/CO31_32_result/evolution4/A2_vs_AT/conserve_vs_specialIsoform/special_vs_conserveInDomain.py  ~/work/Alternative/result/Gr_result/CO41_42_result/collapse/PacBio_proteinDomain.txt D5_conserve_isoform.txt  D5_specialIsoformAnnotion.txt  D5_specialIsoformDomain.txt
```

筛选同源基因即存在保守转录本，又存在特异的转录本；比较特异性转录本与保守转录本间有多少比例Domain发生了改变，其中有多少可能是由于AS造成的

| 基因组 | 改变DOmain | toal  | 在Domain发生改变的特异性转录本里有多少可能是AS 造成的 |
| ------ | ---------- | ----- | ----------------------------------------------------- |
| A2     | 6528       | 12701 | 3929                                                  |
| At     | 3628       | 7310  | 2405                                                  |
| D5     | 4873       | 9663  | 3041                                                  |
| Dt     | 3690       | 7586  | 2355                                                  |



**更多的同源基因在多倍化后发生了特异性转录本的丢失相比于特异性转录本的获得，At完全保守，A2中存在特异性的转录本**，并且这些丢失的转录本中，大多数与保守的转录本相比存在AS isoform的差异

#### 对基因进行富集分析

1. 多倍化后基因产生了新的转录本

   + A2中都保守，但At中有特异性转录本出现

     > http://kobas.cbi.pku.edu.cn/kobas3/retrieve/?taskid=3a9fa46926034e3b9176a99bcbc49614

   + D5中都保守，但是Dt中有特异性转录本出现

     > http://kobas.cbi.pku.edu.cn/kobas3/retrieve/?taskid=2e959fdaf20b4872bb6afc57496e4a08

2. 多倍化过程中丧失了特异性的转录本

   + At中都保守，但是A2中特异性转录本丢失
   
     > http://kobas.cbi.pku.edu.cn/kobas3/retrieve/?taskid=4117b148785e4798873090285aa739f2
   
   + Dt中都保守，但是D5中特异性转录本丢失
   
     > http://kobas.cbi.pku.edu.cn/kobas3/retrieve/?taskid=91a9b26e76ba42b487e24206dbb6781a




### AS在At、Dt两个亚基因组上的作用

研究表明At和Dt亚基因组间存在着表达偏好性。接下来分析At和Dt间是否存在由于AS导致的亚基因组表达偏好性、或者是功能的分化。

At、Dt间共有9,651个同源基因

```python
##根据CDS长度鉴定At、Dt亚基因组间的保守性
python /public/home/zpliu/work/Alternative/result/Gh_result/CO31_32_result/evolution4/homolo_isoform.py  -homolog A2_vs_AT/filter_homologGene.txt  -Aisoforms A2_PacBio.txt  -Areference A2_reference_isoform.txt  -Bisoforms TM1_PacBio.txt -Breference TM1_reference_isoform.txt  -o 11
```

| 类型                                         | 数目 |
| -------------------------------------------- | ---- |
| 所有转录本都保守                             | 1170 |
| At中所有转录本保守、但是Dt中有特异性的转录本 | 855  |
| Dt中有特异性的转录本、但是At所有转录本都保守 | 943  |
| At、Dt除了保守转录本，两个都存在特异性转录本 | 1621 |
| 不存在保守的转录本                           | 5062 |

根据转录本的保守情况对亚基因组同源基因进行分类： 

+ 存在保守转录本的同源基因
+ 不存在保守转录本的同源基因

通过表达量的比较发现无论是哪一类的同源基因对，At和Dt亚基因组表达水平上都没有显著性的差异，并且越保守的同源基因对表达水平更高，这与前面的结果类似。

```bash
##提取每类的基因表达水平
awk '{printf "At\thigh\t"$5"\nDt\thigh\t"$6"\n"}' gene_allisoformConserve.FPKM  >
```

不存在保守转录本的这些基因，

对应的转录本在结构域上是否发生了改变（AS在其中发挥的作用）或者这些特异性的转录本；分别与对应的二倍体祖先相比是保守的，说明这种亚基因组的**差异在多倍化之前就存在**，并且被保留下来；在存在保守转录本的基因中，有多少比例是在多倍化之前就存在，有多少是在多倍化后产生的。

> 多倍化过程中一些亚基因组基因的转录本被塑造，产生趋同进化；而一些亚基因组同源基因的仍旧保持着这种差异的存在，维持着并行分化。

#### 趋同进化

At、Dt间的保守转录本在多倍化之后才产生的。

```bash
##分析保守的亚基因组同源基因
python /public/home/zpliu/work/Alternative/result/Gh_result/CO31_32_result/evolution4/At_vs_Dt//compareToparent.py  -A2 ../../A2_vs_AT/gene_withConserveIsoform.txt  -D5 ../../D5_vs_DT/gene_withConserveIsoform.txt  -input ../gene_withConserveIsoform.txt  -o 11
##统计比例
awk '{print $NF}' 11 |sort |uniq -c

```

| Total | 二倍体中也保守 | A向D同化 | D向A同化 | 其他没有找到二倍体同源基因 |
| ----- | -------------- | -------- | -------- | -------------------------- |
| 4589  | 2735           | 870      | 542      | 442                        |

在四倍体中是保守的同源基因，大约有59.60%在二倍体中仍旧是保守的，并且有些同源基因在多倍化的过程中发生了趋同进化，A基因组向D基因组进化的比例更多。

```bash
##比较，发生趋同进化的同源基因的表达是否存在一个差异
 awk '{print "Dshape\tAt\t"$5"\nDshape\tDt\t"$6}' Dshape.txt >>geneDifferentiation.FPKM
```

#### 并行分化：

At、Dt间的不存在保守转录本；看在祖先二倍体中A2、D5是否同样存不在保守的转录本：

+ 二倍体中也是分化的状态，（多倍化没有改变这种分化的状态）
+ 一个亚基因组与二倍体存在保守，而另一个不存在(多倍化后，一个亚基因组转录组被塑造)
+ 二倍体中是保守的，但多倍化后发生了分化，两个亚基因组同时被塑造
+ 没有找到对应的二倍体同源基因

At、Dt中一共有5062个基因不存在保守的转录本，仅仅只有1097（21.7%）个不保守的基因在二倍体A2和D5中同样是不保守的，64.8%的基因差异是在多倍化后产生的。

```bash
##分析差异的亚基因组同源基因
python ../compareToparent.py -A2 ../../A2_vs_AT/gene_withConserveIsoform.txt  -D5 ../../D5_vs_DT/gene_withConserveIsoform.txt  -homolog A2_D5_At_Dt_collinearity.txt  -A2D5 ../../A2_vs_D5/gene_withConserveIsoform.txt  -input ../gene_allisoformSpecial.txt  -o 11
##统计每类基因中，亚基因组表达差异

```



| 分类                   | 与二倍体相比两个都发生了变化 | 多倍化后只有At发生了变化 | 多倍化后Dt发生了变化 | 在二倍体中也是差异的 | 没有找到同源基因 |
| ---------------------- | ---------------------------- | ------------------------ | :------------------: | -------------------- | ---------------- |
| At和Dt不存在保守转录本 | 660                          | 1327                     |         1291         | 1097                 | 687              |



AS在同源基因转录本分化中的作用，分析不保守的亚基因组同源基因在AS上的差异 ;（认为是**亚基因组特异性的IR和ES**）

统计一下比例

```bash
##获取亚基因组特异性的剪切事件
python /public/home/zpliu/work/Alternative/result/Gh_result/CO31_32_result/evolution4/At_vs_Dt/differentiation/homologAS.py  TM1_AS.txt 11  22
##获取表达量的数据
 awk '{print "Dshape\tAt\t"$5"\nDshape\tDt\t"$6}' Dshape.txt >>geneDifferentiation.FPKM
```

**在A被塑造的同源基因中，有多少同源基因只在At中存在AS、而Dt中不存在AS：**

有220个同源基因只在At中存在AS

```bash
awk '$2!="None"&&$4=="None"{print $0}' Ashape_AS.txt|wc -l
```

**在D被塑造的同源基因中，有多少同源基因只在Dt中存在AS、而At中不存在AS**

有205个同源基因只在Dt中存在AS

```bash
awk '$2=="None"&&$4!="None"{print $0}' Dshape_AS.txt |wc -l
```

### **进行GO富集分析**

趋同进化：

+ A向D同化的基因 （数目更多,多倍化过程中更多A基因组向D基因组变化）

  > http://kobas.cbi.pku.edu.cn/kobas3/retrieve/?taskid=5271d3655874450fbc24bdc34dfddd7b

+ D向A方向同化

  > http://kobas.cbi.pku.edu.cn/kobas3/retrieve/?taskid=da7a9b7062a94e8397915769e30a49c4

并行分化：

+ A基因组选择压减少

  > http://kobas.cbi.pku.edu.cn/kobas3/retrieve/?taskid=d4b12026c54b4385a13c35852a74e2ec

+ D基因组选择压减少

  > http://kobas.cbi.pku.edu.cn/kobas3/retrieve/?taskid=fe3ede8b4c37416d9d5e5192b7d2ada3































