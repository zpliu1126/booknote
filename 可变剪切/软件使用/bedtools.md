# Bedtools

使用bedtools对两个文件取交集

:warning: 报错了

` a record where naming convention (leading zero)`

参考作者的解决办法加上 `-nonamecheck`参数

### intersectBed

+ 比较A文件与B文件是否有交集，有则将文件A与文件B输出在同一行，若无交集则输出A文件位置其余对于的位置使用-1补齐

  ```bash
  intersectBed  -a CpG_context_D1.bed -b exon_3.bed -loj|less
  ## 获取匹配的行，会将b文件写在后面
  ```



### fastaFromBed

根据基因组位置来提取对应的fasta序列

**序号注意的细节是，bed从0开始计数，而gff文件中序列的坐标是从0开始的，因此使用gff中的坐标做bed文件时会存在一个碱基的误差**

```bash
~/software/bedtools2-2.29.0/bin/fastaFromBed -fi ~/genome_data/genome_Garb.CRI/G.arboreum.Chr.v1.0.fa  -fo 1 -name -bed A2_intronR.txt
```

+ -fi 指定基因组序列文件
+ -fo 输出文件
+ -name+   以bed文件中的坐标作为基因名
+ -name 以bed文件中第4列作为基因名，如果第4列有重复好像就会为空
+ -bed 基因坐标文件
+ -s 提取对应的正负链

:warning: 从使用bedtools提取的时候，开始坐标不会被提取所以会少掉一个碱基。



### 提取序列中GC碱基含量

这里GC含量指的是，GC碱基的占比

```bash
~/software/bedtools2-2.29.0/bin/nucBed  -fi ~/genome_data/genome_Garb.CRI/G.arboreum.Chr.v1.0.fa -bed A2_constitutive_exon.bed >1
```

+ 提供参考基因组序列
+ 提供对应的位置bed信息



### windowMaker

+ `-g` 或者`b`指定输入文件类型
+ `-w`指定窗口大小
+ `-s`指定滑动的窗口大小，不指定的话就等于 -w参数大小
+ `-n`固定窗口数目
+ `-i`指定输出文件的id号

```bash
### 如果指定的是genome文件
	For example, Human (hg19):
	chr1	249250621
	chr2	243199373
```

#### 将bed文件转换为BAM文件后，建索引方便提取数据

```bash
##只会保留名字信息
head -5 rmsk.hg18.chr21.bed
chr21 9719768  9721892  ALR/Alpha  1004  +
chr21 9721905  9725582  ALR/Alpha  1010  +
chr21 9725582  9725977  L1PA3 3288 +
chr21 9726021  9729309  ALR/Alpha  1051  +
chr21 9729320  9729809  L1PA3 3897 -
##转换后
bedToBam -i rmsk.hg18.chr21.bed -g human.hg18.genome > rmsk.hg18.chr21.bam

samtools view rmsk.hg18.chr21.bam | head -5
ALR/Alpha  0   chr21 9719769  255  2124M *  0  0  *  *
ALR/Alpha  0   chr21 9721906  255  3677M *  0  0  *  *
L1PA3      0   chr21 9725583  255  395M  *  0  0  *  *
ALR/Alpha  0   chr21 9726022  255  3288M *  0  0  *  *
L1PA3      16  chr21 9729321  255  489M  *  0  0  *  *
```



#### 提取基因启动子区域序列

```bash
bedtools flank
```





#### 





