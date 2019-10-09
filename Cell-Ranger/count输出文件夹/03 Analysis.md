# Analysis 结果

:statue_of_liberty:**count aggr reanalysis**三个脚本的分析的CSV结果文件，被用来渲染Summary HTML。

### 1. 降维

**在进行聚类之前，使用标准化后的feature-barcode矩阵进行PCA分析，来减少feature(gene)的数目，只有表达了的基因才会被用来进行PCA分析**

+ 第一步就是将每个细胞投影到N个组成份，默认N=10，使用**reanalyze**可以认为的定义这个N

  总共含有四个输出文件

  + **project** 投影文件

    每个barcode,也就是每个细胞在每个维度上的投影值

    ```bash
    Barcode,PC-1,PC-2,PC-3,PC-4,PC-5,PC-6,PC-7,PC-8,PC-9,PC-10
    AAACATACAACGAA1,-0.2765,-5.7056,6.5324,-12.2736,-1.4390,-1.1656,-0.1754,-2.9748,3.3785,1.6539
    ```

  + component** 贡献文件

    每个基因对每个组分的贡献

    ```bash
    PC,ENSG00000228327,ENSG00000237491,ENSG00000177757,ENSG00000225880,...,ENSG00000160310
    1,-0.0044,0.0039,-0.0024,-0.0016,...,-0.0104
    ```

    

  + **variance **变异解释比例

    例如将每个细胞在每个组成份中计算一个值，就是对应的坐标值，根据这个值来将数据进行重构，看是否能够代表原始数据；当变异解释读趋于平缓时u，增加PCA的数目不能够解释样本中的总变异

    随着主成分数目的增加，能够解释的变异程度也会减少

    ```bash
    PC,Proportion.Variance.Explained
    1,0.0056404970744118104
    2,0.0038897311237809061
    3,0.0028803714818085419
    4,0.0020830581822081206
    ```

    

  + **dispersion**标准化文件

    记录了每个基因标准化后的表达水平

  

  

  ### 2. t-SEN

  **t-distributed Stochastic Neighbor Embedding (t-SNE) ** 用来将每个细胞映射到2维空间

  

  

  ### 3. Cluster

  将具有相同表达模式的细胞进行聚类，聚类的方式有两种

  + 基于图形进行聚类 Graph-based clustering 
  + 基于PCA的结果进行聚类

  

  ### 4. Differential Expression

  ​	根据Barcode将每个细胞进行聚类

  

  

  

  

  

  

  

  

  

  

  

  

  



