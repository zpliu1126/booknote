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
  ```

  

