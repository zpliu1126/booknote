# Bedtools

使用bedtools对两个文件取交集

:warning: 报错了

` a record where naming convention (leading zero)`

参考作者的解决办法加上 `-nonamecheck`参数



### fastaFromBed

根据bed1文件读取基因序列

***序号注意的细节是，bed从0开始计数，而gff文件中序列的坐标是从0开始的，因此使用gff中的坐标做bed文件时会存在一个碱基的误差**

```bash
fastaFromBed -fi 基因组序列文件 -fo 输出文件 -bed 坐标文件 -s 提取对应的正负链
```



### intersectBed

+ 比较A文件与B文件是否有交集，有则将文件A与文件B输出在同一行，若无交集则输出A文件位置其余对于的位置使用-1补齐

  ```bash
  intersectBed  -a CpG_context_D1.bed -b exon_3.bed -loj|less
  ## 获取匹配的行，会将b文件写在后面
  ```



### fastaFromBed

根据基因组位置来提取对应的fasta序列

```bash
~/software/bedtools2-2.29.0/bin/fastaFromBed -fi ~/genome_data/genome_Garb.CRI/G.arboreum.Chr.v1.0.fa  -fo 1 -name -bed A2_intronR.txt
```

+ -fi 指定基因组序列文件
+ -fo 输出文件
+ -name+   以bed文件中的坐标作为基因名
+ -name 以bed文件中第5列作为基因名，如果第5列有重复好像就会为空
+ -bed 基因坐标文件



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







