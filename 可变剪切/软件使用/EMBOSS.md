# EMBOSS



### 根据全长转录本cDNA序列预测ORF

+ find 3号模式下输出从起始到终止的碱基信息

```bash
getorf  -sequence 111.fa   -find 3
```

### 判断ORF是否存在提前终止的密码子

根据EMBOSS预测的ORF序列，提取最长的ORF序列，判断终止密码子与最后一个exon的距离；

+ 距离大于50nt，则认为存在提前终止的密码子
+ 距离小于50nt，则认为终止密码子坐落在UTR区域，没有提取终止