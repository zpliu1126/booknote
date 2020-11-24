

### HISAT2比对

> 版本:2.1.0

在比对的时候要考虑建库过程中的链特异性问题,`--rf 非链特异性建库`与`--fr链特异性建库`的差异

![建库方式](https://s1.ax1x.com/2020/11/04/BccNmq.png)

## Stringtie对转录本组装和定量overview

1. 过滤BAM文件，获取`mapping to uniq location read`

   使用samtools过滤mapping score 小于30的(认为是比对到多个位置的read)

2. Stringtie对每个样品进行**有参考转录本**的组装

3. Stringtie merge将多个样本组装的转录本进行合并

4. 对组装好的isoform进行进一步的确认

   + 注释文件中没有检测到的novel junction在**至少一个样品**中，需要至少10个spanning read支持
   + 注释文件中没有检测到的novel transcripts在**至少一个样品**中，需要达到gene表达水平的至少10%

5. 对组装好的转录本的表达水平进行量化，并且过滤

   对于基因间区的转录本，之后将不会进行研究；在每个样本中使用stringtie对转录本的表达量进行定量；通过对转录本的表达量进行建模，确定**转录本的表达阀值**。

   阀值从0-10开始逐渐增加，统计至少5%的个体中转录本都大于阀值的比例，至少5%的个体中转录本都小于阀值的比例；当两个线相交的点就认为是阀值。

   ![isoform阀值确定](https://s1.ax1x.com/2020/11/02/BrmGTA.png)

   + 转录本的表达量小于阀值就被过滤掉

   为了排除转录本的长度的影响

   + 保留转录本长度达到标准转录本长度的70%

6. 计算每个转录本的splicing ratio作为sQTL的表型数据

#### 参考

> 方法文献
>
> 1. Genome-Wide Association Analyses Reveal the Importance of Alternative Splicing in Diversifying Gene Function and Regulating Phenotypic Variation in Maize
> 2. Genome-wide analysis of alternative splicing in Zea mays: landscape and genetic regulation（确定转录本FPKM阀值）





## leafcutter量化intron excision  







#### 参考

> 方法文献
>
> 1. The GTEx Consortium atlas of genetic regulatory effects across human tissues  