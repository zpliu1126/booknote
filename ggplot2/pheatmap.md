### 自定义色块

```bash
bk=c(seq(-2,0,by=0.01),seq(0.01,2,by=0.01))
pheatmapResult=pheatmap(express,border_color=NA,cluster_rows = F,cluster_cols = F,breaks = bk,fontsize_row = 7.5,fontsize_col = 9,angle_col = 45,color = c(colorRampPalette(c("skyblue","snow"))(length(bk)/2),colorRampPalette(c("snow","lightcoral"))(length(bk)/2)))
```

### 配置颜色

```bash

```

### 获取聚类后的顺序

```bash
mat_cluster=express[pheatmapResult$tree_row$order, pheatmapResult$tree_col$order]

```



