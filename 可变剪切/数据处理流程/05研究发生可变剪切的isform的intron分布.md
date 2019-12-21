# intron 分布

有研究表明，IR事件往往导致终止密码子的提前；并且在stree调节下使得IR效率变高从而产生大量正常功能的蛋白质。并且调控IR事件的蛋白质偏向性的结合到**GAAGAA**RNA基序上，这个片段好像和|DNA水平上蛋白的乙酰化有点关系。

1. 提取发生IntronR事件的isform编号和对应的位置

   ```bash
   awk '$3~/IntronR/{print $0}' end_third |awk '$8~/0\,/{print $1,$2,$3,$4,$5,$6}$8~/\,0/{print $1,$2,$3,$4,$5,$7}' OFS="\t"
   ```

2. 统计发生IntronR事件在基因区域的分布情况，师兄说这个正常的植株的IR分布可能没有想要的趋势，先从单个基因入手看看

   要考虑到正负链的情况，靠近pre-mRNA5‘端的为第一个intron，而靠近3’端的为最后一个intron，只有一个intron被认为是middle intron，就考虑每个基因所有转录本的intron分布

   使用相关性的图来表示，每个位置intron的数目
   
   参考  https://www.jianshu.com/p/92780c97d0ae 
   
   ```bash
   
   ```
   
   ![相关性的图](https://upload-images.jianshu.io/upload_images/7493830-bce6bfbb4a999388.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)
   
   使用自己写的脚本`AS_isform_analysis.py`对内含子在intronR事件中的分布发现，发生intronR的内含子在转录本中的分布是随机的没有什么偏好性，或许后面单个基因的研究会有偏向性。
   

### 自己写脚本对IntronR和ExonS的位置和长度信息进行统计

```python
## 部分剪切事件有错误存在intronR_err.log文件里
python ~/scripte/Alternative/AS_isform_analysis.py A2/isform.gff  A2/end_third  A2/Intronstatic2.txt  A2/ExonSstatic.txt >A2/intronR_err.log
python ~/scripte/Alternative/AS_isform_analysis.py D5/isform.gff  D5/end_third  D5/Intronstatic2.txt  D5/ExonSstatic.txt >D5/intronR_err.log
python ~/scripte/Alternative/AS_isform_analysis.py TM-1/isform.gff  TM-1/end_third  TM-1/Intronstatic2.txt  TM-1/ExonSstatic.txt >TM-1/intronR_err.log

```




### 统计发生intronR和ExonS的长度分布情况

```bash
## 提取每个亚基因组中发生IntronR事件的信息
cut -f3 ../../GhDt_Gr_GhAt_Ga_end_noScaffold | xargs -I {} grep {} ../../TM-1/Intronstatic2.txt > At_intronR.txt
cut -f1 ../../GhDt_Gr_GhAt_Ga_end_noScaffold | xargs -I {} grep {} ../../TM-1/Intronstatic2.txt > Dt_intronR.txt
cut -f2 ../../GhDt_Gr_GhAt_Ga_end_noScaffold | xargs -I {} grep {} ../../D5/Intronstatic2.txt > D5_intronR.txt
## 提取每个亚基因组的Exons事件信息
cut -f4 ../../GhDt_Gr_GhAt_Ga_end_noScaffold | xargs -I {} grep {} ../../A2/ExonSstatic.txt > A2_ExonS.txt
cut -f1 ../../GhDt_Gr_GhAt_Ga_end_noScaffold | xargs -I {} grep {} ../../TM-1/ExonSstatic.txt > Dt_ExonS.txt
cut -f3 ../../GhDt_Gr_GhAt_Ga_end_noScaffold | xargs -I {} grep {} ../../TM-1/ExonSstatic.txt > At_ExonS.txt
```



#### 提取Constitutive intron

**Bedtools默认基因组坐标是从0开始的，而基因序列是从1开始的，所以所有的位置都得加1**

使用mRNA的整个区域减去exon区域

```bash
# 提取mRNA对应的bed文件 做为A文件
awk '$3~/[tl]/{print $0}' ~/work/Alternative/result/Ga_result/CO11_12_result/07_annotation/A2_merge_C.gtf|cut -f1,4,5,7,9|awk -F ";" '{print $1}'|sed 's/gene_id \"//g'|sed 's/\"//g' >A2_mRNA.bed
# 提取exon对应的坐标作为 B文件
awk '$3~/e/{print $0}' ~/work/Alternative/result/Ga_result/CO11_12_result/07_annotation/A2_merge_C.gtf|cut -f1,4,5,7,9|awk -F ";" '{print $1}'|sed 's/gene_id \"//g'|sed 's/\"//g' >/public/home/zpliu/work/Alternative/result/homologo/IntronR/A2_exon.bed
~/software/bedtools2-2.29.0/bin/subtractBed  -a A2_mRNA.bed  -b A2_exon.bed  |sort|uniq >constitutive_intron.bed


```



![bedtools模式](https://pic2.zhimg.com/80/v2-c1232e7ce2e7735c47ef21cce16507c5_hd.jpg)



### 提取Constitutive exon

先使用脚本将每个isform的intron区域给提出来，之后再使用Bedtools减去这个intron区域就ok

```bash
## 提取每个isform的内含子区域
python ../ConstitutiveExon.py   ~/work/Alternative/result/Gr_result/CO41_42_result/07_annotation/D5_merge_C.gtf  TM-1_intron.bed
## 将所有的内含子和mRNA进行合并,合并前先排好序
sort -k1,1 -k2,2n  intron.bed >intron_sorted.bed
~/software/bedtools2-2.29.0/bin/mergeBed  -i sort_intron >merge_intron
sort -k1,1 -k2,2n  mRNA.bed >mRNA_sorted.bed
~/software/bedtools2-2.29.0/bin/mergeBed  -i mRNA_sorted.bed >merge_mRNA
## 使用合并好的mRNA减去合并好的intron就是constitutive exon了，唯一的缺点就是不知道是那个基因编号，到时候，在用intersect取个交集就知道了
~/software/bedtools2-2.29.0/bin/subtractBed -a  merge_mRNA -b merge_intron >constitutive_exon.bed
## 获取共有的exon的基因编号
~/software/bedtools2-2.29.0/bin/intersectBed -a D5_mRNA.bed -b Constitutive_exon.bed -loj |awk -F "\t" '$6!="."{print $6,$7,$8,$4,$5}' OFS="\t" |sort|uniq >constitutive_exon.bed

```



### 统计Constitutive Exon与intron的长度与位置信息

```bash
## 提取外显子的位置和长度信息
cut -f4 ../GhDt_Gr_GhAt_Ga_end_noScaffold|xargs  -I {} grep {} ../A2/A2_constitutive_intron.bed |awk -F "\t" '{print $1,$2,$3,$3-$2+1,$4,$5}' OFS="\t" >ConstitutiveIntron/A2_constitutive_intron.txt
## 绘制长度统计图
for i in 1 
do
awk '$2~/Ghir_D/{print $6"\tAlter_intron\tDt"}' ../TM-1/Intronstatic2.txt  >>intron_exon_length.txt
awk '$2~/Ghir_A/{print $6"\tAlter_intron\tAt"}' ../TM-1/Intronstatic2.txt  >>intron_exon_length.txt
awk '$2~/Ghir_A/{print $6"\tAlter_exon\tAt"}' ../TM-1/ExonSstatic.txt >>intron_exon_length.txt
awk '$2~/Ghir_D/{print $6"\tAlter_exon\tDt"}' ../TM-1/ExonSstatic.txt >>intron_exon_length.txt
awk '$5~/Ghir_A/{print $3-$2+1"\tCons_exon\tAt"}' ../TM-1/TM1_constitutive_exon.bed >>intron_exon_length.txt
awk '$5~/Ghir_D/{print $3-$2+1"\tCons_exon\tDt"}' ../TM-1/TM1_constitutive_exon.bed >>intron_exon_length.txt
awk '$5~/Ghir_D/{print $3-$2+1"\tCons_intron\tDt"}' ../TM-1/TM1_constitutive_intron.bed >>intron_exon_length.txt
awk '$5~/Ghir_A/{print $3-$2+1"\tCons_intron\tAt"}' ../TM-1/TM1_constitutive_intron.bed >>intron_exon_length.txt

awk '{print $3-$2+1"\tCons_exon\tD5"}' ../D5/D5_constitutive_exon.bed    >>intron_exon_length.txt
awk '{print $3-$2+1"\tCons_intron\tD5"}' ../D5/D5_constitutive_intron.bed >>intron_exon_length.txt
awk '$2~/^G/{print $6"\tAlter_intron\tD5"}' ../D5/Intronstatic2.txt  >>intron_exon_length.txt
awk '$2~/^G/{print $6"\tAlter_exon\tD5"}' ../D5/ExonSstatic.txt  >>intron_exon_length.txt


awk '{print $3-$2+1"\tCons_intron\tA2"}' ../A2/A2_constitutive_intron.bed >>intron_exon_length.txt
awk '{print $3-$2+1"\tCons_exon\tA2"}' ../A2/A2_constitutive_exon.bed >>intron_exon_length.txt
awk '$2~/^e/{print $6"\tAlter_intron\tA2"}'  ../A2/Intronstatic2.txt  >>intron_exon_length.txt
awk '$2~/^e/{print $6"\tAlter_exon\tA2"}'  ../A2/ExonSstatic.txt   >>intron_exon_length.txt
done
```





### ~~比较不同类型exon与intron的甲基化水平差异~~

将CG碱基数目进行标准化，然后计算  CG methylation ratio  ，如果那段序列没有CG碱基，则不用它

```bash
# 提取对应位置的甲基化水平
~/software/bedtools2-2.29.0/bin/intersectBed   -b ~/work/Alternative/data/Ga_genome/test/CpG_context_D4.bed -loj  -a ../A2_constitutive_exon.bed >1
# 提取对应位置的序列信息
~/software/bedtools2-2.29.0/bin/fastaFromBed -fi ~/genome_data/genome_Garb.CRI/G.arboreum.Chr.v1.0.fa  -fo ./2 -name+ -bed A2_constitutive_exon.bed
# 根据序列信息提取CG碱基含量
python ~/scripte/extract_CG_count.py  2  3
# 计算每个片段的甲基化水平
# -::tig00008092:9886-9974	0	evm.TU.Ga14G0684
# -::Chr13:9163360-9163433	0	evm.TU.Ga13G0611
# +::Chr11:36353080-36353252	0	evm.TU.Ga11G1424
# +::Chr06:3173345-3173488	0	evm.TU.Ga06G0305
awk '$6==$1{print $4"::"$1":"$2"-"$3"\t"1"\t"$5}$6!=$1{print $4"::"$1":"$2"-"$3"\t"0"\t"$5}' 1|awk '{a[$1][0]+=$2;a[$1][1]=$3}END{for(i in a){print i"\t"a[i][0]"\t"a[i][1]}}' >5
# 只使用包含有CG序列的片段
# 当CG碱基数为0时，不输出
cat 3 5 |awk '$3==""{a[$1][0]=$2}$3!=""{a[$1][1]=$2;a[$1][2]=$3}END{for(i in a){if(a[i][0]!=0){print i"\t"a[i][1]/a[i][0]"\t"a[i][2]}}}'

## ExonS与intronR得改一改
awk 'NR>1{print $0}' ../ExonS >hh
awk '$12==$1{print $4"::"$1":"$2"-"$3"\t"1"\t"$5}$12!=$1{print $4"::"$1":"$2"-"$3"\t"0"\t"$5}' 1|awk '{a[$1][0]+=$2;a[$1][1]=$3}END{for(i in a){print i"\t"a[i][0]"\t"a[i][1]}}' >5

```

画图数据

```bash
awk '{print "Cons.exon\t" $2}' A2_constitutive_exon_CGratio.txt  >ggplot_data.txt
awk '{print "Cons.intron\t"$2}' A2_constitutive_intron_CGratio.txt  >>ggplot_data.txt
awk '{print "Alter.exon\t"$2}' A2_ExonS_CGratio.txt  >>ggplot_data.txt
```

***2019-12-21***

### 甲基化水平的计算换了一种方式

由于测序深度的原因，一些甲基化的CG碱基可能没有被测到但是在计算的时候分母就会被认为的放大了。

使用bedtools intersect 对甲基化文件和intron文件取交集,之前跑的多重检验就认为只有p-value达到了1e-5就可以了

```bash
## 构造甲基化的bed文件
awk '{print $1,$2,$2,$3,$4,$5}' OFS="\t" >CpG_context_D4_binom.bed
## 使用intersect取交集
intersectBed -a ../A2_constitutive_exon.bed -b CpG_context_D4_binom.bed  -wa -wb >2
```

```bash
Chr01   100023306       100023457       -        evm.TU.Ga01G2102       Chr01   100023416       100023416       0       4       0.976215137296
Chr01   100023306       100023457       -        evm.TU.Ga01G2102       Chr01   100023403       100023403       0       3       0.982107784
Chr01   100023306       100023457       -        evm.TU.Ga01G2102       Chr01   100023385       100023385       0       3       0.982107784
Chr01   100023306       100023457       -        evm.TU.Ga01G2102       Chr01   100023377       100023377       0       3       0.982107784
Chr01   100023306       100023457       -        evm.TU.Ga01G2102       Chr01   100023348       100023348       0       3       0.982107784

```

```bash
## 提取对应的甲基化ratio
awk '{if($11<0.00001){a[$5"_"$2][0]+=1}else{a[$5"_"$2][1]+=1}}END{for(i in a){print "A2\tCons.intron\t"a[i][0]/(a[i][0]+a[i][1])}}' 1 >A2_methlation
## 将exonS的文件转换为bed文件
awk 'NR>1{print $1,$2,$3,$4,$5}' OFS="\t" ../ExonSstatic.txt >exonS.bed
```

### 绘制ggplot数据

```R
## 调整因子水平
data2$V2=factor(data2$V2,levels = c("Cons.exon","Alter.exon","Cons.intron","Alter.intron"))
## 作图
library(ggpubr)
library(ggplot2)
ggplot(data2,aes(x=data2$V2,y=data2$V3,fill=data2$V2))+geom_boxplot()+stat_compare_means(comparisons = list(c("Alter.intron","Cons.intron"),c("Alter.exon","Cons.exon")))
```



#### 用bin去扫描intron区域与上下游各200bp

```bash
awk 'NR>1{print $1,$2,$3,$4,$5}' OFS="\t" ../../Intronstatic2.txt >intron.bed
## 提取5'端200bp的片段
awk '$4=="+"{if($2>=200){print $1,$2-200,$2,$4,$5}else{print $1,0,$2,$4,$5}}$4=="-"{print $1,$3,$3+200,$4,$5}' OFS="\t" intron.bed >5_intron.bed
## 提取3’端200bp片段
awk '$4=="+"{print $1,$3,$3+200,$4,$5}$4=="-"{if($2>=200){print $1,$2-200,$2,$4,$5}else{print $1,0,$2,$4,$5}}' OFS="\t" intron.bed >3_intron.bed
## 将每个区域划分为15个bin
~/software/bedtools2-2.29.0/bin/windowMaker  -n 15 -b intron.bed -i winnum >分割好的bed文件
## 计算每个bin区域对应的平均甲基化值
~/software/bedtools2-2.29.0/bin/intersectBed -a 5_intron_bin.bed  -b ../CpG_context_D4_binom.bed  -loj >5
## 最后除的是intron的总数
awk '$10!="."{if($10<0.00001){a[$2"_"$4][0]+=1}else{a[$2"_"$4][1]+=1}}END{for(i in a){print i"\t"a[i][0]/(a[i][0]+a[i][1])}}' 3|sed 's/_/\t/g'|awk '{a[$2]+=$3}END{for(i in a){print "Cons.intron\t"i+30"\t"a[i]/27800}}'

```

![CpG甲基化差异](https://s2.ax1x.com/2019/12/21/Qv4Q5F.png)

#### 对CHG和CHH甲基化类型作同样的操作

![CHG甲基化的差异](https://s2.ax1x.com/2019/12/21/Qvqi1U.png)






### 参考

1. 提取intron位置  https://www.jianshu.com/p/cb079a393661 
2. Bedtools 使用  https://zhuanlan.zhihu.com/p/52322803 
3. Bedtools 官网  https://bedtools.readthedocs.io/en/latest/index.html 

