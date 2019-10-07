### Chip-seq操作流程

1. ### 数据过滤Trimmomatic

   可以参考我RNA-seq篇章中关于Trimmomatic的使用

   

2. Bowtie2进行比对

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
     
     
     
     
     
     
     
### 参考

1. samtools使用 https://www.cnblogs.com/emanlee/p/4316581.html



​	     

   

