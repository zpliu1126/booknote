# feature_bc_matrix文件夹

### raw_feature_bc_matrix 

+ **barcodes.tsv.gz**

  文件中存储了从所有设计的barcode中识别到的barcode

+ 文件格式如下

  ```shell
  Ghir_A01G000010 Ghir_A01G000010 Gene Expression
  Ghir_A01G000020 Ghir_A01G000020 Gene Expression
  Ghir_A01G000030 Ghir_A01G000030 Gene Expression
  Ghir_A01G000040 Ghir_A01G000040 Gene Expression
  Ghir_A01G000050 Ghir_A01G000050 Gene Expression
  ```

  + 第一列对应gtf文件中的**gene_id**

  + 第二列对应gtf文件中的**gene_name**,如果没有这个选项这使用**gene_id**顶替

  + 第三列就是对于的数据类型

  + 当多个物种进行比较时，会将物种的前缀加到基因id和name前面

    

### filtered_feature_bc_matrix

+ **barcodes.tsv.gz**

  仅仅只包含被检测到的细胞中的barcodes

+ 文件格式如下

  ```javascript
  AAACCTGAGAAACCAT-1
  AAACCTGAGAAACCGC-1
  AAACCTGAGAAACCTA-1
  AAACCTGAGAAACGAG-1
  AAACCTGAGAAACGCC-1
  AAACCTGAGAAAGTGG-1
  AAACCTGAGAACAACT-1
  AAACCTGAGAACAATC-1
  AAACCTGAGAACTCGG-1
  AAACCTGAGAACTGTA-1
  ```

  



