# EMBOSS



### 根据全长转录本cDNA序列预测ORF

+ find 3号模式下输出从起始到终止的碱基信息
+ 因为用cDNA序列去预测，所以不用反转

```bash
module load EMBOSS/6.5.7	
getorf  -sequence 111.fa   -find 3 -noreverse
```

### 判断ORF是否存在提前终止的密码子

> 先看看注释的参考基因组中转录本的情况，是不是符合人类中的研究；再看各种AS产生的isform的情况

提取所有isform的cDNA序列预测其ORF

根据EMBOSS预测的ORF序列，提取最长的ORF序列，判断终止密码子与最后一个exon的距离；

+ 其中发生AS的isform含有距离大于50nt
+ 而没有发生AS的isform含有距离小于50nt

我感觉只有其中距离是可以调节的，只要发生AS的isoform比没有发生AS的isoform提取终止就行

+ 针对每种类型的AS进行计算



### 使用NCBI的ORFfinder搜索cDNA中的ORF



