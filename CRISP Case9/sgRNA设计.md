# sgRNA设计

使用`sgRNAcas9`软件包进行基于参考基因组的sgRNA 设计：针对每条给定的query 序列首先搜索`NGG`的PAM结构，找到对应的motif后，在全基因组范围内评估`on-target`和`off-target`值。如果有多条质量比较好的`on-target`sgRNA，后面还可以根据基因注释文件筛选那些距离5'端更近的sgRNA。

>  [软件包地址](http://www.biootools.com/software.html#tab1)

<!--more-->

![CRISPRcase9](https://s1.ax1x.com/2020/04/16/JEVP3T.png)



### 主要流程

1. 提取基因的cDNA序列
2. 使用软件包中`sgRNAcas9.pl`脚本，进行全基因组范围搜索靶位点
3. 根据参考基因组的注释文件，对靶向位点进行注释（看是否靶向exon区域）



### 1.全基因组搜索sgRNA

```bash
perl sgRNAcas9_3.0.5.pl 
-i genes_end.fasta 
-x 20 
-l 40 
-m 60 
-g Ghirsutum_genome.fasta 
-o b 
-t s -v l -n 5 -s -3 -e 33 
```

```bash
-i <str>                 Input file
-x <int>                 Length of sgRNA[20]
-l <int>                 The minimum value of GC content [20]
-m <int>                 The maximum value of GC content [80]
-g <str>                 The reference genome sequence
-o <str>                 Searching CRISPR target sites using DNA strands based option(s/a/b)
                         [s, sense strand searching mode]
                         [a, anti-sense strand searching mode]
                         [b, both strand searching mode]
-t <str>                 Type of sgRNA searching mode(s/p)
                           [s, single-gRNA searching mode]
                           [p, paired-gRNA searching mode]
-v <str>                 Operation system(w/l/u/m/a)
                            [w, for windows-32, 64]
                            [l, for linux-64]
                            [u, for linux-32]
                            [m, for MacOSX-64]
                            [a, for MacOSX-32]
-n <int>                 Maximum number of mismatches [5]
-s <int>                 The minimum value of sgRNA offset [-2] 错配罚分
-e <int>                 The maximum value of sgRNA offset [32]
-p <str>                 Output path 
```

### 2.根据参考文件对sgRNA进行注释

#### 2.1提取评分等级为一下的sgRNA ID信息

+  Best 
+  repeat_sites_or_bad 
+  low_risk 

```bash
#M表示错配碱基数
0M	1M      2M    3M     rank 
2       0       0     0    repeat_sites_or_bad
1       0       0    5    low_risk
1       0       0    3    Best 
```

>  例如repeat等级中0M靶向的位置有2个，我们要看看它靶向的位置是否是同一个基因，进行sgRNA评价 

#### 2.2合并所有的sgRNA信息

` cat A.Sort_OT_byID/*  >all_genen_OT.txt `

靶标序列评价

 使用自带的脚本***ot2gtf_v2.pl\***，对得到的sgRNA靶标进行评价，主要是看它是否靶向目标基因的外显子区域，或者存在靶向其他基因exon区域（脱靶情况）

```bash
perl ../Usefull_Script/ot2gtf_v2.pl  -i Low_OT.text  -g ../Gh_gene.gtf  -o Low_OT_gtf_out.text
#也可以将上一步所有的OT文件合并之后，在运行脚本
```

#### 2.3去除脱靶的sgRNA

awk的原理:

1. 靶标基因与sgRNA的序列信息一致赋权值 0
2. sgRNA靶向同源基因和自己本身赋权值 0
3. 靶标序列脱靶赋权值 1
4. 最后将同一个sgRNA靶标的权值相加，为0则表示没有脱靶；否则脱靶舍弃

```bash
#awk脚本
-F "\t" '{
    a=substr($1,1,15);a1=substr($1,6,1);a2=substr($1,7,2);b1=substr($5,6,1);b2=substr($5,7,2)
    }{
if(a==$8)print $0"\t"0;
else if(a1=="A"&&b1=="D"){
    if(a2==b2||a2=="02"&&b2==03||a2=="03"&&b2=="02"){
        print $0"\t"0;}else print $0"\t"1;}
        else if(a1=="D"&&b1=="A"){
            if(a2==b2||a2=="02"&&b2=="03"||a2=="03"&&b2=="02"){
                print $0"\t"0;}else print $0"\t"1;}
else print $0"\t"1;}' Best_Repeat_Low_OT_gtf  >2222222
```

得到的没有脱靶的sgRNA编号

![没有脱靶sgRNA](https://zpliu1126.github.io/Blog/img/sgRNAcase/otsgRNAcase.png)



### 3.sgRNA筛选

经过上一步筛选后的sgRNA文件，我们需要根据以下几个指标筛选比较理想的靶标序列

1. 靶标序列尽量靠近5’端
2. 同一个基因找两个靶标序列，尽量让这两段序列间隔在100bp左右

自定义python脚本

```python
usage:
    -h|--help    print help information
    -g|--gff=    gff file path way
    -s|--sgRNA=    sgRNA file path way
    -l|--genelength=    length of gene
    -r|--sequence=    sgRNA sequence path way
    -o|--outfile=    output file path way
```

> [脚本获取](https://github.com/zpliu1126/Bioinformatic/blob/33379dd39a948ff6e463a9c9f31ca5fb837ac998/sgRNAcas9/comparisonsgRNA.py)



### 4.参考

1. [tramisutes](https://tiramisutes.github.io/2017/01/13/CRISPR-Designer.html)
2. [sgRNAcase9](http://www.biootools.com/software.html#tab1)