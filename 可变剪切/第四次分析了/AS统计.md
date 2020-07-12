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

提取既有IR又有AltA、AltD的基因出来；





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
## 将IR与对应基因组的所有Intron进行比较
```

#### 使用k-mer方法进行试验

```bash
bsub -q smp -n 1 -J D5_A2 -e kmer.err -o kmer.out -R span[hosts=1] "python ../../k-merBWA.py -AS  D5_uniq_IR.txt -gff ~/work/Alternative/data/Ga_genome/G.arboreum.Chr.v1.0.gff  -fa1 ~/work/Alternative/data/Gr_genome/Graimondii_221_v2.0.fa -fa2 ~/work/Alternative/data/Ga_genome/G.arboreum.Chr.v1.0.fasta  -ho ~/work/Alternative/result/homologo/homologGene/A2_vs_D5_collinearity.txt"
```






