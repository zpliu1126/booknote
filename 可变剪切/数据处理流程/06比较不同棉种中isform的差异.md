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

~~可以使用这个merge.gtf文件当做参考进行AS的鉴定~~，效果不理想

```bash
## 07文件夹中merge.gtf`
awk -F ";" '{print $3";"$2"\t"$1}' merge.gtf|awk -F "\t" '{print $2,$3,$4,$5,$6,$7,$8,$9,$1}' OFS="\t"|sed 's/orginal_//g' >merge_C.gtf
```



### 比较同一组亚基因组同源基因仅仅在叶片中表达的isform数量的差异

使用亚基因组同源基因去获取，`07annotion/merge.gtf`文件中被PacBio检测到的转录本

```bash
cat DthomologeGeneId.txt | xargs -I {} grep {} ~/work/Alternative/result/Gh_result/CO31_32_result/07_annotation/merge.gtf | awk -F "\t" '$3~/^t/{print $0}' > Dthomolog_isform_count.txt
## 统计每个基因能表达的isform总数
awk -F ";" '{print $3,$2}' OFS="\t" Athomolog_isform_count.txt|sed -e 's/orginal_gene_id //g' -e 's/transcript_id //g' -e 's/\"//g'|awk '{a[$1]+=1}END{for(i in a){print i"\t"a[i]}}'|less
## 在叶片中表达isform的数目
awk -F ";" '{print $3,$2}' OFS="\t" Athomolog_isform_count.txt|sed -e 's/orginal_gene_id //g' -e 's/transcript_id //g' -e 's/\"//g'|awk '$2~/^P/{a[$1]+=1}$2~/^[^P]/{a[$1]+=0}END{for(i in a){print i"\t"a[i]}}' >At_leaf_isform.txt
## 按照顺序排列
cat AthomologeGeneId.txt | xargs -I {} grep {} At_leaf_isform.txt > At_leaf_isform_sorted.txt &
```

在讨论isform的数目上忽略掉lncRNA的因素，感觉数目不是很多

```bash
cat onlymRNA/Athomolog_isform_count.txt  ./LncRNA/AtlncRNA.txt |awk -F ";" '{print $3,$2}' OFS="\t" |sed -e 's/orginal_gene_id //g' -e 's/transcript_id //g' -e 's/\"//g'
## 统计每个基因注释的isform数目，这次基因数目对上了
cat onlymRNA/Athomolog_isform_count.txt  ./LncRNA/AtlncRNA.txt |awk -F ";" '{print $3,$2}' OFS="\t" |sed -e 's/orginal_gene_id //g' -e 's/transcript_id //g' -e 's/\"//g'|awk '{a[$1]+=1}END{for(i in a){print i"\t"a[i]}}'|wc -l 
## 只在叶片中表达的基因数目
cat onlymRNA/Athomolog_isform_count.txt  ./LncRNA/AtlncRNA.txt |awk -F ";" '{print $3,$2}' OFS="\t" |sed -e 's/orginal_gene_id //g' -e 's/transcript_id //g' -e 's/\"//g'|awk '$2~/^P/{a[$1]+=1}$2~/^[^P]/{a[$1]+=0}END{for(i in a){print i"\t"a[i]}}'|wc -l
########## Ga得搞一下
cat onlymRNA/homolog_isform_count.txt LncRNA/lncRNA.txt |awk -F ";" '{print $3,$2}' OFS="\t" |sed -e 's/orginal_gene_id //g' -e 's/transcript_id //g' -e 's/\"//g' -e 's/evm\.TU\.//g' -e 's/EVM_prediction_//g'|tail
```

把同源基因的转录本信息合并一下

```bash
## 叶片中的isform数目
paste D5_leaf_isformCountsorted.txt ../A2/A2_leaf_isformCountsorted.txt ../TM1/Dt_leaf_isformCountsorted.txt  ../TM1/At_leaf_isformCountsorted.txt |less
## 全部的isform数目
paste D5_isform_countsorted.txt ../A2/A2_isform_countsorted.txt ../TM1/Dt_isform_countsorted.txt  ../TM1/At_isform_countsorted.txt |less
```





#### 有的基因在merge转录本之后，被注释为lncRNA了把这些基因对去除

统计了一下各个基因中lncRNA的数目，以及亚基因组同源基因中lncRNA的数目

| lncRNACount |     At     |  Dt  |  A2  |  D5  |
| :---------: | :--------: | :--: | :--: | :--: |
|  亚基因组   | 两个共2754 |      | 1934 | 1216 |
| 同源基因间  |    102     |  97  | 148  | 106  |

也可以比较一下，亚基因组同源基因是不是都为lncRNA，可以在discussion里提一下

```bash
cat homologeGeneId.txt|sed 's/evm\.TU\.//g' | xargs -I {} grep {} ~/work/Alternative/result/Ga_result/CO11_12_result/07_annotation/merge.gtf |awk -F "\t" '$3~/^lnc/{print $0}'
```



### 不同转录本间表达量的计算

使用stringtie计算不同转录本间表达量的差异 `-b`参数。使用`merge.gtf`文件作为基因组参考文件

这个文件里面有一些不知道是比对到哪个基因的lncRNA和novel gene，就不要了

```bash
## merge.gtf文件需要改造一下，将PacBio的基因编号改成基因组的编号
sed 's/EVM_prediction_/evm\.TU\./g' ~/work/Alternative/result/Ga_result/CO11_12_result/07_annotation/merge.gtf|awk -F "\t" '$9~/evm/{print $9$1,$2,$3,$4,$5,$6,$7,$8}' OFS="\t" |awk -F ";" '{print $4,$3";"$2";"$3";"}' OFS="\t"|sed 's/orginal_//' >./../A2_merge_cahnge.gtf

awk -F "\t" '$9~/Gor/{print $9$1,$2,$3,$4,$5,$6,$7,$8}' OFS="\t" ~/work/Alternative/result/Gr_result/CO41_42_result/07_annotation/merge.gtf| awk -F ";" '{print $4,$3";"$2";"$3";"}' OFS="\t"|sed 's/orginal_//' >./../D5_merge_change.gtf

awk -F "\t" '$9~/Gh/{print $9$1,$2,$3,$4,$5,$6,$7,$8}' OFS="\t" ~/work/Alternative/result/Gh_result/CO31_32_result/07_annotation/merge.gtf| awk -F ";" '{print $4,$3";"$2";"$3";"}' OFS="\t"|sed 's/orginal_//' >./../TM-1_merge_change.gtf

```

### 仅在叶片中isfrom数目数目的差异

对数据进行分组

1. A2=D5 vs At=Dt
2. A2=D5 vs At!=Dt
3. A2!=D5 vs At=Dt
4. A2 >D5 vs At>Dt  || A2<D5 At<Dt
5. A2 >D5 vs At<Dt ||  A2<D5 At>Dt

```bash
## 第一类 At=Dt=A2=D5=0
awk '$2==0&&$4==0&&$6==0&&$8==0{print $0}' leaf_isform_count >class1
## 第一类 A2=D5=0 At=Dt
awk '$2==0&&$4==0&&$6!=0&&$8!=0{if($6/$8<2&&$6/$8>0.5){print $0}}' leaf_isform_count  >>class1
## 第一类 A2=D5 At=Dt=0
awk '$2!=0&&$4!=0&&$6==0&&$8==0{if($2/$4<2&&$2/$4>0.5){print $0}}' leaf_isform_count  >>class1
## 第一类 A2=D5 At=Dt A2、D5、At、Dt！=0
awk '$2!=0&&$4!=0&&$6!=0&&$8!=0{if($2/$4<2&&$2/$4>0.5){if($6/$8<2&&$6/$8>0.5){print $0}}}' leaf_isform_count  >>class1
## 第二类 A2=D5 At>Dt
awk '($2!=0&&$4!=0&&$2/$4<2&&$2/$4>0.5)||($2==0&&$4==0){if($8>0&&$6==0){ print $0}else if($8>0&&$6>0&&$8/$6>=2){print $0}}' leaf_isform_count  >class2
## 第二类 A2=D5 At<Dt
awk '($2!=0&&$4!=0&&$2/$4<2&&$2/$4>0.5)||($2==0&&$4==0){if($6>0&&$8==0){ print $0}else if($8>0&&$6>0&&$8/$6<=0.5){print $0}}' leaf_isform_count >>class2
## 第三类 At=Dt A2>D5
awk '($6!=0&&$8!=0&&$6/$8<2&&$6/$8>0.5)||($6==0&&$8==0){if($4>0&&$2==0){ print $0}else if($4>0&&$2>0&&$4/$2>=2){print $0}}' leaf_isform_count  >class3
## 第三类 At=Dt A2<D5
awk '($6!=0&&$8!=0&&$6/$8<2&&$6/$8>0.5)||($6==0&&$8==0){if($2>0&&$4==0){ print $0}else if($4>0&&$2>0&&$2/$4>=2){print $0}}' leaf_isform_count  >>class3
## 第四类 A2>D5 vs At > Dt
awk '($4>0&&$2==0)||($4>0&&$2>0&&$4/$2>=2){if($8>0&&$6==0){ print $0}else if($8>0&&$6>0&&$8/$6>=2){print $0}}' leaf_isform_count >class4
## 第四类 A2<D5 vs At < Dt
awk '($2>0&&$4==0)||($2>0&&$4>0&&$2/$4>=2){if($6>0&&$8==0){ print $0}else if($8>0&&$6>0&&$6/$8>=2){print $0}}' leaf_isform_count >>class4
## 第五类 A2>D5 vs At < Dt
awk '($4>0&&$2==0)||($4>0&&$2>0&&$4/$2>=2){if($6>0&&$8==0){ print $0}else if($8>0&&$6>0&&$6/$8>=2){print $0}}' leaf_isform_count >class5
## 第五类 A2<D5 vs At > Dt
awk '($2>0&&$4==0)||($2>0&&$4>0&&$2/$4>=2){if($8>0&&$6==0){ print $0}else if($8>0&&$6>0&&$8/$6>=2){print $0}}' leaf_isform_count >>class5

```

使用log2的方法比较不同同源基因间，isform数目上的差异

构造画图数据

```R
X坐标为基因组	y坐标为isform数目 分组信息都使用一个亚基因组的编号代替
D5	10 Gorai.002G002000	calss1
A2	5	Gorai.002G002000	class1
At	8	Gorai.002G002000	class1
D5	12	Gorai.002G002000	class1
## 使用awk对每种类型的数据进行操作
# $class在环境中定义好，省的改那么多
awk -F "\t" '{printf "D5\t"$2"\t"$1"\t'$class'\nA2\t"$4"\t"$1"\t'$class'\nDt\t"$6"\t"$1"\t'$class'\nAt\t"$8"\t"$1"\t'$class'\n"}'
```

！！！不理想，换种方式画

![isform分类模式](https://s2.ax1x.com/2019/12/04/QlLTqH.png)



```bash
## 使用亚基因组之间的log2值作为纵坐标，横坐标就是log2(At/Dt) log2(A2/D5)
## 分子分母同时为0，则为1，单个为0的话把0换成0.1
awk '$2==0&&$4==0&&$6==0&&$8==0{printf "A2/D5\t1\t"$1"\tclass1\nAt/Dt\t1\t"$1"\tclass1\n"}' leaf_isform_count >ggplot_data/isform_count.2txt
awk '$2==0&&$4==0&&$6!=0&&$8!=0{if($6/$8<2&&$6/$8>0.5){printf "A2/D5\t1\t"$1"\tclass1\nAt/Dt\t"$8/$6"\t"$1"\tclass1\n"}}' leaf_isform_count  >>ggplot_data/isform_count.2txt 
awk '$2!=0&&$4!=0&&$6==0&&$8==0{if($2/$4<2&&$2/$4>0.5){printf "A2/D5\t"$4/$2"\t"$1"\tclass1\nAt/Dt\t1\t"$1"\tclass1\n"}}' leaf_isform_count  >>ggplot_data/isform_count.2txt
awk '$2!=0&&$4!=0&&$6!=0&&$8!=0{if($2/$4<2&&$2/$4>0.5){if($6/$8<2&&$6/$8>0.5){printf "A2/D5\t"$4/$2"\t"$1"\tclass1\nAt/Dt\t"$8/$6"\t"$1"\tclass1\n"}}}' leaf_isform_count  >ggplot_data/isform_count.2txt
## 第二类
awk '($2!=0&&$4!=0&&$2/$4<2&&$2/$4>0.5){if($8>0&&$6==0){printf "A2/D5\t"$4/$2"\t"$1"\tclass2\nAt/Dt\t"$8/0.1"\t"$1"\tclass2\n"}else if($8>0&&$6>0&&$8/$6>=2){ printf "A2/D5\t"$4/$2"\t"$1"\tclass2\nAt/Dt\t"$8/$6"\t"$1"\tclass2\n"}}($2==0&&$4==0){if($8>0&&$6==0){printf "A2/D5\t""1\t"$1"\tclass2\nAt/Dt\t"$8/0.1"\t"$1"\tclass2\n"}else if($8>0&&$6>0&&$8/$6>=2){printf "A2/D5\t""1\t"$1"\tclass2\nAt/Dt\t"$8/$6"\t"$1"\tclass2\n"}}' leaf_isform_count >ggplot_data/isform_count.2txt


```













