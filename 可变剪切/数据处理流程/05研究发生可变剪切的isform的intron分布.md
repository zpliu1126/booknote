# intron 分布

有研究表明，IR事件往往导致终止密码子的提前；并且在stree调节下使得IR效率变高从而产生大量正常功能的蛋白质。并且调控IR事件的蛋白质偏向性的结合到**GAAGAA**RNA基序上，这个片段好像和|DNA水平上蛋白的乙酰化有点关系。

1. 提取发生IntronR事件的isform编号和对应的位置

   ```bash
   awk '$3~/IntronR/{print $0}' end_third |awk '$8~/0\,/{print $1,$2,$3,$4,$5,$6}$8~/\,0/{print $1,$2,$3,$4,$5,$7}' OFS="\t"
   ```

2. 统计发生IntronR事件的分布情况，师兄说这个正常的植株的IR分布可能没有想要的趋势，先从单个基因入手看看

   要考虑到正负链的情况，靠近pre-mRNA5‘端的为第一个intron，而靠近3’端的为最后一个intron，只有一个intron被认为是middle intron，就考虑每个基因所有转录本的intron分布

   使用bedtool取intron坐标，用 transcript坐标减去exon坐标就行了，这种方法好像不能够确定是那个转录本的intron

   ```bash
   
   ```

   





### 参考

1. 提取intron位置  https://www.jianshu.com/p/cb079a393661 

