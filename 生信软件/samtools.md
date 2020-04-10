# samtools



### 统计read比对到基因组的情况

#### 1.比对到基因组唯一区域

```bash
samtools view -bq 1 file.bam > unique.bam
```

#### 2.比对到基因组多个位置

```bash
#比对上的reads数
samtools view -b -F 4 file.bam > mapped.bam
# 减去唯一比对上的就是比对多个位置的
```

#### 3.没有比对到基因组上

```bash
samtools view -b -f 4 file.bam > unmapped.sam
```







### 参考

官方文档 http://www.htslib.org/doc/samtools.1.html 

SAM文件格式  https://www.plob.org/article/7353.html 

SAM 文件格式  https://blog.csdn.net/genome_denovo/article/details/78712972 