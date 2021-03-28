**比较constitutive 事件与AS事件在CG甲基化程度上的差异**

> 参考   DNA-methylation effect on cotranscriptional splicing
> is dependent on GC architecture of the exon–intron
> structure  

+ 统计某一个位置出现`CG`的次数，以及`CG`被甲基化的比例

```bash
##统一保留内含子第一个和最后一个坐标
grep RI ~/work/Alternative/result/Gh_result/CO31_32_result/evolution2/A2_AS.txt |grep PB|cut -f3,4 >1
python ~/github/zpliuCode/Isoseq3/04ASconserved/extractAScoordinate.py  1 1 2
##RI坐标
awk '{OFS="\t";print $1,$2+1,$3,$4,$6}' 2  >RI.bed
##SE坐标
awk '{OFS="\t";print $1,$2,$3+1,$4,$6}' 2  >SE.bed
##对于组成型的exon和intron，根据基因的链，赋予对于的链,对于超出原有注释范围的不管
~/software/bedtools2-2.29.0/bin/intersectBed -a constitutive_intron.bed -loj -b ../TM1_gene.bed |awk '$4!="."{OFS="\t";print $1,$2,$3,$7,$9}' >1 
mv 1 constitutive_intron.bed	
##分割文件

##提取每个坐标处的是否甲基化
python ~/github/zpliuCode/Isoseq3/07methylation/methylationByLocation.py  ~/work/Alternative/data/Ga_genome/G.arboreum.Chr.v1.0.fasta  /data/cotton/zhenpingliu/QingxinSong_GB_DNAmethlation/A2/Rep1/02deduplicate_methylation/CpG_fdr_sorted.bam 1 3
##合并所有的任务的结果
python  ~/github/zpliuCode/Isoseq3/07methylation/gatherAlleventLocal.py conExon_methylation.txt
##由于基数太大可能会造成差异，只对AS基因进行比较
```

**比较AS基因和非AS基因的甲基化差异程度**

> 方法参考：   Asymmetric epigenome maps of subgenomes reveal imbalanced transcription and distinct evolutionary trends in Brassica napus  

+ 基因区域被分为了40个bin，以及基因上下游2kb分同样各分为40个bin
+ 每个bin的甲基化程度用（甲基化的read/测到的总的read） 进行衡量

```bash
##提取上游的2kb坐标
 ~/software/bedtools2-2.29.0/bin/flankBed -b 2000 -i TM1_gene.bed  -g TM1_chromsome.bed |awk '$NF=="+"&&NR%2==1{print $0}$NF=="-"&&NR%2==0{print $0}' >Upstream2K_gene.bed
 
 ##做成40个bin的窗口
 ##统一用远离基因的一端做起始bin，区分正负链
awk '$NF=="-"{print $0}' Upstream2K_gene.bed |~/software/bedtools2-2.29.0/bin/windowMaker -b - -n 40 -i srcwinnum -reverse >Upstream2k_40bin.bed
#正链则不需要反向
awk '$NF=="+"{print $0}' Upstream2K_gene.bed |~/software/bedtools2-2.29.0/bin/windowMaker -b - -n 40 -i srcwinnum >>Upstream2k_40bin.bed
##提取基因某一个区域的甲基化程度
python ~/github/zpliuCode/Isoseq3/07methylation/extractMethylationRegion.py  gene_40bin.bed /data/cotton/zhenpingliu/QingxinSong_GB_DNAmethlation/TM1/Rep1/02deduplicate_methylation/CpG_fdr_sorted.bam gene_40bin_CpG.txt 
##合并所有的bin，求平均的甲基化水平
cat Downstream/*|sed 's/_/\t/g' |awk '{a[$2][1]+=$3;a[$2][2]+=1;}END{for(i in a){print i "\t"a[i][1]/a[i][2]}}'|sort -k1,1n|less
##区分AS基因和非AS基因的甲基化程度

```

**对AS与非AS基因进行显著性检验**

| genome | CpG       | CHG    | CHH    |
| ------ | --------- | ------ | ------ |
| TM1    | 0.00159   | 0.5531 | 0.2222 |
| A2     | 1.303e-05 | 0.1628 | 0.6058 |
| D5     | 0.0001102 | 0.8664 | 0.1216 |



conExon与SE区域的平均甲基化程度没有差异，而RI与conIntron之间存在差异



### 分析不同基因组的事件间序列的保守程度

+ 在筛选组成性内含子的时候，用了merge这一步骤导致很多intron被合并了，所以对于差异比较大的片段还是使用k-mer的坐标比较准确一些

```bash
##筛选保守的AS事件的坐标
python ~/github/zpliuCode/Isoseq3/07methylation/filterConstitutiveintronByKmer.py  ~/work/Alternative/result/Gh_result/06ASconserved/test2/A2_vs_At/AS_kmer.txt A2RI_2_Atintron.txt  A2RI_2_Atintron_filter.txt 

##统计序列变异情况
python ~/github/zpliuCode/Isoseq3/07methylation/sequence/sequenceAligment.py ~/work/Alternative/data/Ga_genome/G.arboreum.Chr.v1.0.fasta ~/work/Alternative/data//Ghirsutum_genome_HAU_v1.0/Ghirsutum_genome_HAU_v1.0.fasta A2_CI.txt At_RI.txt Donor_variant.txt Acceptor_variant.txt SequenceIdentity

```

##### 比较序列完全保守的坐标之间CpG甲基化程度的差异

```bash
##序列完全保守的区域，甲基化程度的差异
python ~/github/zpliuCode/Isoseq3/07methylation/sequence/extractSequenceMthylation.py  /data/cotton/zhenpingliu/QingxinSong_GB_DNAmethlation/D5/Rep1/02deduplicate_methylation/CpG_fdr_sorted.bam /data/cotton/zhenpingliu/QingxinSong_GB_DNAmethlation/TM1/Rep1/02deduplicate_methylation/CpG_fdr_sorted.bam D5RI_2_DtCI_identity.txt  1

```

### 分析同源基因间保守的胞嘧啶坐标

+ 根据同源基因的坐标筛选保守的C坐标
+ 获取区域内总的胞嘧啶个数
+ ~~同源基因中CG满足40%的覆盖度~~

```bash
##筛选胞嘧啶保守的位置
python ~/github/zpliuCode/Isoseq3/07methylation/sequence/conservedCytosine.py ~/work/Alternative/data/Ga_genome/G.arboreum.Chr.v1.0.fasta ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Ghirsutum_genome_HAU_v1.0.fasta ../coordinate/A2_homolog_gene.bed  ../coordinate/At_homolog_gene.bed  A2_At_conservedCystoin.txt
##获取区域内CG碱基对数目，以及满足read数大于3的CG碱基对数目
python ~/github/zpliuCode/Isoseq3/07methylation/sequence/geneWithMethylatedCytosinesCount.py  CpG1.bam CpG2.bam geneLocation.txt genome.fa
##筛选同源基因长度CG满足40%的覆盖度

```

### 对保守的C进行DmC分析

> 同源基因CG甲基化的差异程度：
>
> DmCG数目/同源基因保守的CG碱基对数目

```bash
##对每个保守的胞嘧啶位点进行差异分析
python ~/github/zpliuCode/Isoseq3/07methylation/sequence/DmCG.py conservedCytosine.txt  conservedCytosineRatio.txt CpG_Bam 
CpG_Bam  CpG_Bam  CpG_Bam 
##获取每对同源基因CG甲基化的差异程度
awk '{a[$5][1]+=1}$11<=0.01{a[$5][2]+=1}END{for(i in a){print i"\t"a[i][1]"\t"a[i][2]}}' conservedCytosineCpG.txt|awk '$3==""{print $1"\t"$2"\t0\t0.0"}$3!=""{print $0"\t"$3/$2}'

```

| 比较     | 保守的胞嘧啶 | 保守的CG位点 | CG差异甲基化   |
| -------- | ------------ | ------------ | -------------- |
| A2 vs At | 10,613,071   | 1,100,398    | 173319 (15.8%) |
| D5 vs Dt | 12,278,190   | 1,272,223    | 175363 (13.8%) |
| A2 vs D5 | 10,180,352   | 1,086,003    | 207524 (19.1%) |
| At vs Dt | 11,622,245   | 1,226,762    | 210935 (17.2%) |
|          |              |              |                |

### 基因的DmCG与基因AS差异程度的比较

基因AS的差异程度主要比较的是两个**同源基因都存在AS的基因对**

hyper conserved AS ： AS保守程度大于0.8

hypo conserved AS   ： AS保守程度小于0.4

+ AS高度保守的基因相比于低度保守基因，DmCG/CG 比例更小
+ 序列水平的变异

```bash
# result/Gh_result/06ASconserved/02conservedAS/quantifyASconserveRatio
```

| 类别  | p-value  |
| ----- | -------- |
| A2 At | 6.92e-06 |
| A2 D5 | 2.2e-16  |
| D5 Dt | 2.2e-16  |
| At Dt | 2.2e-16  |



### 基因AS数目的差异与DmCG/CG

+ **AS数目差异越大，DmCG差异也越多**

```bash
##获取同源基因AS数目的差值
awk '{print $1"\t"$2"\t"sqrt(($3-$4)*($3-$4))}' D5_vs_Dt_AScount_DmCG.txt
```

### ~~源基因序列发生变异附近的motif 富集分析~~

+ 统一用供体开始的坐标计算变异位点
+ 提取变异位点左右各10bp的序列进行motif富集分析

```bash
##提取变异位点左右各10bp的序列进行motif富集分析
python ~/github/zpliuCode/Isoseq3/07methylation/sequence/extractNearSequenceVarant.py genome1.fa genom2.fa sequenceVariant.txt motif20bp.fa
##进行motif 富集分析

A2RI : AAGMCCTGSKAAYMTG
A2CI : GGMCHAGCCTRTCACT
AtRI : TCTTYCYTTYHC
AtCI : AARARGAARRWRRAAR

D5RI : VCCHYCYCCYCCCCC
D5CI : NDCCCSMCCCCCCCC
DtRI : MTTTTTTTTTTT
DtCI : YGTTYGRGRMAWGAA
```

| AS差异数目 | p-value |
| ---------- | ------- |
| 0 vs 1     | 2.2e-16 |
| 1 vs 2     | 2.2e-16 |
| 2 vs 3     | 2.2e-16 |
| 3 vs 4     | 2.2e-16 |
| 4 vs 5     | 2.2e-16 |



### 举个例子

特异性的AS事件中，存在甲基化差异的事件

```bash
##获取亚组特异性的剪接事件


```



| 类型        | 总特异性事件数 | 存在甲基化差异事件数 |
| ----------- | -------------- | -------------------- |
| A2_vs_At A2 | 15126          | 6789 (44.9%)         |
| A2_vs At At | 10458          | 4840 (46.3%)         |
| A2_vs D5 A2 | 15339          | 7706 (50.2%)         |
| A2_vs D5 D5 | 15361          | 7569 (49.3%)         |
| D5_vs_Dt D5 | 14525          | 7321 (50.4%)         |
| D5_vs_Dt Dt | 9781           | 4981 (50.9%)         |
| At_vs_Dt At | 10803          | 5988 (55.4%)         |
| At_vs_Dt Dt | 10922          | 5893 (54.0%)         |
| Total       | 102,315        | 51,087               |
|             |                |                      |

> evm.TU.Ga03G2363基因





























