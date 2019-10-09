# ANALYSIS

### DE genes

### <img src="https://43423.oss-cn-beijing.aliyuncs.com/img/20190910083245.png"/>

+ 第一列和第二列表示参考基因组gtf文件中的基因编号与name
+ 每一列表示这一个簇的细胞与所有其他剩余的细胞的差异
  + 当点击这Cluster1时，其他簇上的数字，则是对应于，这一列上L2FC的值与p-value
  + 只有在上调的基因才会被显示，下调的基因或者p-value>0.1 **统计学上不显著**则会被显示为灰色
  + cluster1 与其他所有的细胞相比，基因是上调的L2FC为 **4.91**
  + cluster1 与Cluster 2相比则是下调的，L2FC为 **-2.8**



### 2-D space

<img src="https://43423.oss-cn-beijing.aliyuncs.com/img/20190910085057.png"/>

将所有的细胞降维到二维空间，**颜色**的深浅表示UMI数目的多少

### 聚类Cluster

<img src="https://43423.oss-cn-beijing.aliyuncs.com/img/20190910085430.png"/>

根据之前**降维的结果，和细胞的表达模式**，将不同的细胞进行聚类

> 右上角可以选择具体的聚类数目，这会改变differ Express 表格的内容