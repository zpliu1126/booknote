# Pan-Genome数据比对



## 使用bwa进行序列比对

### 1.构建索引

+ 参考基因组索引
+ PAN基因组索引

命令

```bash
bwa index /data/cotton/Unmapped_Gb_Mate/Gbarbadense_genome.fasta

bwa index /public/home/cotton/public_data/PAN_Final/GbPAN/Gb.final.1k.fa
```

### 2.进行比对

分别将`/data/cotton/Unmapped_Gb_Mate`目录下的序列文件比对到参考基因组和PAN-genom上

命令

```bash
bwa mem -t 5  索引前称 sample_1.fq sample_2.fq  -o out.bam
```

### 3.格式转换

将比对得到的sam文件转换为bam文件并且按照read 名称进行排序

命令

```bash
samtools view -@ 2 -bS out.bam  -o out.bam
# 排序
samtools sort -@ 2 -n out.bam >out_sorted.bam
```

将排序好的文件转换为bed文件

```bash
bedtools2-2.29.0/bin/bamToBed  -cigar -i out_sorted.bam >out.bed
```

bed文件样子:

```bash
Gbar_D13        42441519        42441606        SRR1975556.212/1        26      +       87M
Gbar_D11        34735043        34735143        SRR1975556.639/1        60      +       100M
Gbar_D11        34735458        34735558        SRR1975556.639/2        60      -       100M
Gbar_D03        23620374        23620474        SRR1975556.1615/1       60      +       100M

```

对bed文件进行过滤，筛选指标

+ 比对质量大于30
+ 比对到基因组唯一位置的read

命令:

```bash
awk '$5>=30{print $1,$2,$3,$4}' OFS="\t" out.bed|sort -k4,4 |uniq -c -f3|awk '$1==1{print $2,$3,$4,$5}' OFS="\t"  >filter.bed
```

### 4.基因组位置和PAN-genom位置映射

根据Unmapped_Mate reads在基因组上的比对情况和在PAN genome比对的情况将基因组坐标和PAN-genome坐标进行关联，筛选指标

+ reads在PAN-genome上比对的长度>=100bp

在找到对应的基因组坐标后，根据reads在PAN-genom的contig上比对情况，分别对read比对到参考基因组上的坐标进行移动：

![8THeN6.png](https://s1.ax1x.com/2020/03/23/8THeN6.png)



输出文件

```bash
Ghir_A01        22474500        22474691        ctg7180026870908_NJAU12 1009    1160
Ghir_A06        82457397        82457515        ctg456212_HZAU299       0       125
Ghir_D03        28198381        28198568        ctg7180000854763_BYU11141       570     757
```



### 与gene和promoter取交集

使用intersectBed将上一步得到的bed文件与gene bed 文件、promer bed文件分别取交集

得到对应的结果：

+ 基因组坐标
+ 对应的contig
+ 该区域是否有基因、是否对应promter区域

```bash
Ghir_A01        5370    6820    ctg071839_HBAU110       15      177     None
Ghir_A01        582     6036    ctg7180000531949_BYU12323       5311    5456    None
Ghir_A01        60961   62354   ctg7180000166824_PG25   1158    1264    Ghir_A01G000030
```



### 使用到的脚本

1. 提取同一read比对到的基因组区域和PAN genome区域 https://github.com/BiocottonHub/zpliuCode/blob/40ebbc9aeb34af0a40e74223afa33e7bd32bf5b6/PangenomeAlign/extract.py 
2. 将基因组区域进行扩展  https://github.com/BiocottonHub/zpliuCode/blob/40ebbc9aeb34af0a40e74223afa33e7bd32bf5b6/PangenomeAlign/mapping.py 
3. 合并两个intersect 后的bed文件  https://github.com/BiocottonHub/zpliuCode/blob/40ebbc9aeb34af0a40e74223afa33e7bd32bf5b6/PangenomeAlign/merge.py 

