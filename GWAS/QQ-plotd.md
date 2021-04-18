## QQ-plot

> QQ-plot:  Quantile-Quantile Plot 

主要是用于表示观测值是否偏离正态分布。Q-Q plot主要是用来估计数量性状观测值与预测值之间的差异。一般我们所取得的数量性状数据都为正态分布数据。在GWAS研究中Q-Q plot的X和Y轴主要是代表各个SNP的-lg P values。预测的线是一条从原点发出的45°角的虚线。实际观测值则是标的实心点。 

 理论上一个点A在该图上的位置应该是A预测值=A实际值，转化为坐标就是A（x，y）x=y。所以预测的线是一条从原点发出的45°线。 

#### 估计理论值

SNP对应的p-value为实际值，通过将这些p-value从小到大排序，根据正态分布，反推该SNP的理论p-value

>  exp-pvalue <- -(log10(expected_order/ (SNP_num+1))) 

