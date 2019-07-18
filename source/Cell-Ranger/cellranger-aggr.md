# CellRanger aggr

CellRanger aggr主要是用于对来之多个**GEM group** 样品进行标准化，需要使用到cellRanger count的分析结果



#### 参数

+ --id= ：指定一个输出的id结果

+ --csv=csv ：指定一个包含了cellRanger count输出结果的列表

+ --normalize==Mode: 指定标准化的模式，现在只有一种模式**mapped**或者不标准化 **none**

+ --nosecondary ：是否自己自定义的用于下一步分析

  

#### CSV文件格式如下

```bash
library_id,molecule_h5
LV123,/opt/runs/LV123/outs/molecule_info.h5
LB456,/opt/runs/LB456/outs/molecule_info.h5
LP789,/opt/runs/LP789/outs/molecule_info.h5
```



**为了防止不同GEM Well之间的barcode发生混淆，软件会自动的在barcode后添加后缀数字，数字是根据csv文件中GEM的顺序进行分配的**