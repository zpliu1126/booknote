### Chip-seq操作流程

### 1. 数据过滤Trimmomatic

可以参考我RNA-seq篇章中关于Trimmomatic的使用



### 2. Bowtie2进行比对

+ 软件安装

  直接下载编译好的版本就可以使用了
  
+ 建立索引
  
  ```bash
  bowtie2-build 基因组fasta文件 索引文件目录/索引前称  --threads 10 2>bowtie-build.log
  ```
  
+ 开始比对
  
  ```bash
  bowtie2 --threads 10 -x 索引所在位置 -1 过滤后的文件 -2 过滤后的文件 -S 输出sam文件
  ```
  
  
  
+ 去除由于PCR重复产生的reads
  
  ```bash
  #将sam文件转换为bam文件并且按照染色体顺序排好序
  samtools view -bS -@ 10 bowtie比对的sam文件 >输出的bam文件
  #将reads按照染色体排序
  samtools sort -@ 10 上一步的bam文件 -o 指定输出文件名
  ## 去除PCR重复
  samtools rmdup 排好序的bam文件 rmdup.bam文件
  ```
  

### 3. 使用MACS进行比对

3.1 软件安装

https://github.com/taoliu/MACS/blob/master/INSTALL.md

```bash
## 使用Anconda进行安装
conda create --name MACS
conda activate MACS
conda install -c bioconda macs2
## 离开环境
conda deactivate
```

3.2 软件使用

```bash
macs2 callpeak -t ChIP.bam -c Control.bam -f BAM -g hs -n test -B -q 0.05
```

+ -t 接处理文件
+ -c 控制文件
+ -f 输入文件格式
+ -g 根据比对时canker基于组的大小而定
+ -n 输出文件名前缀
+ -B -q FDR值

3.3 解读输出文件

+ `NAME_peaks.xls`文件每个峰的起始位置，和其他统计信息

+ `NAME_peaks.narrowPeak`  BED6+4格式，可以在USCS基因组浏览器中打开它

  前几列的信息比较好理解，这是后几列的具体信息

  - 5th: integer score for display. It's calculated as `int(-10*log10pvalue)` or `int(-10*log10qvalue)` depending on whether `-p` (pvalue) or `-q` (qvalue) is used as score cutoff. Please note that currently this value might be out of the [0-1000] range defined in [UCSC ENCODE narrowPeak format](https://genome.ucsc.edu/FAQ/FAQformat.html#format12). You can let the value saturated at 1000 (i.e. p/q-value = 10^-100) by using the following 1-liner awk: `awk -v OFS="\t" '{$5=$5>1000?1000:$5} {print}' NAME_peaks.narrowPeak`
  - 7th: fold-change at peak summit
  - 8th: -log10pvalue at peak summit
  - 9th: -log10qvalue at peak summit
  - 10th: relative summit position to peak start

+ `NAME_summits.bed` 相当于`NAME_peaks.narrowPeak`文件的精简版

+ `NAME_peaks.broadPeak` 在`--broad`模式下才会生成

+ `NAME_peaks.gappedPeak` 在`--broad`模式下才会生成

+ `NAME_model.r` 画图的R脚本  `$ Rscript NAME_model.r`

### 4. call peaks统计每个区域的峰值











### 参考

1. samtools使用 https://www.cnblogs.com/emanlee/p/4316581.html
2. MACS软件 https://github.com/taoliu/MACS/



​	     

   

