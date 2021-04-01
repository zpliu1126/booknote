#### 1.读取文件

```R
##读取文件并且转化为data.table
library(dplyr)
SampleCluster3=read.csv("sample_cluster1.txt",
                        header=F,
                        sep="\t",) %>% as_tibble() 
```

#### 2.选取行

```R
##随机选取前5行
SampleCluster3 %>% slice_sample_dt(5)
##随机选取样本总量的10%
SampleCluster3 %>% slice_sample_dt(.1)
##查找特定行：V1=='S375'
SampleCluster3 %>% filter(V1=='S375') 
##使用索引获取数据向量，获取第一列的所有行
SampleCluster3[,1]
##获取所有行和所有列
SampleCluster3[,]
```

#### 3.选取列

```R
SampleCluster3  %>% select('V1')
```

