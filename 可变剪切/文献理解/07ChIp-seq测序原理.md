# 07ChIp-seq测序原理 chromatin immunoprecipitation

### ChIp主要应用

> ChIP-seq tech mainly apply in CTCF binding， Histone modification and binding DNA, other protein (or motif) and binding DNA.

可以应用在，分析与一些转录因子结合的DNA序列，组蛋白修饰的位点，一些特定蛋白结合的motif序列



### 基本步骤

1. 使用甲醛处理细胞核，将DNA和蛋白质交联结合的状态固定下来；而交联又分为两种
   + x-ChIp 使用甲醛将蛋白质和DNA交联
   + N-ChIp 蛋白质和DNA天然的交联在一起，可以通过微球菌核酸酶解除交联状态
2. 使用超声波或者限制性酶将染色体打断成短片段（一般是200~600bp）
3. 使用抗体蛋白质去富集对应的片段
4. 解除蛋白质和DNA的交联状态，获得目标DNA序列
5. 使用PCR或者qPCR检测，是否富集到你想要的DNA序列，之后进行建库测序

![ChIp-seq流程图](https://zpliu1126.github.io/-figureBed/Chromatin_immunoprecipitation_sequencing.svg)

### GhIp的weakness

+ 偏好性的选择CG富集序列
+ 当第2步获得的reads数目不多时候，IP（immunoprecipitation）效果不好
+ 抗体的质量问题
+ 细胞核的数目，感觉和第二个缺点的原因是一样的
+ 需要使用对照试验，也就是Input文件是没有使用抗体进行IP的；这样与处理相比就能够反应真实的IP富集



### ChIp数据分析

#### 1.鉴定peak富集区域

由于immunoprecipitation 下来的read经过测序之后，既有正链也有负链，当mapping回基因组时就可以统计得到两条链上的peak情况。越靠近TF结合位点的read，被捕获下来后，由于测序是从`3'=>5'`所以离TF越近的位置测到的次数就越多

> 测序得到的read只是跟随着TF一起沉淀下来的DNA fragment的末端，read的位置并不是真实的TF结合的位置。所以在peak-calling之前，延伸read是必须的。不同TF大小不一样，对read延伸的长度也理应不同。我们知道，测得的read最终其实会近似地平均分配到正负链上，这样，对于一个TF结合热点而言，read在附近正负链上会近似地形成“双峰”。MACS会以某个window size扫描基因组，统计每个window里面read的富集程度，然后抽取（比如1000个）合适的（read富集程度适中，过少，无法建立模型，过大，可能反映的只是某种偏好性）window作样本，建立“双峰模型”

+ 正链 红色
+ 负链 蓝色

<img src="https://zpliu1126.github.io/-figureBed/14720037-cf7d78450dcbd76c (2).webp" alt="双峰模型" style="zoom:130%;" />



#### 2. 显著富集

一般来说富集倍数5才算显著富集，也就是与对照相比在某个位置相比存在5倍差异

<img src="https://zpliu1126.github.io/-figureBed/14720037-edd01f174024d523 (1).webp" alte="富集比"/>



### 参考

MACS Wiki  https://github.com/taoliu/MACS/wiki 

简书 https://www.jianshu.com/p/dc493cb7b1b3 

https://www.plob.org/article/7227.html

