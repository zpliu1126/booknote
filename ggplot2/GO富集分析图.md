# GO富集分析图

+ `theme_bw`在没有数据渲染时，显示边框等一些布局

```R
setwd("~/work/Alternative/result/homologo/IntronR/intronR/test/test3/GO/GO_out/plot")

goData <- read.table("complete_conserve.GO", sep = "\t")
# 按照文件行中出现的顺序显示因子
GoItemOrder <- factor(as.integer(rownames(goData)), labels = goData$V3)
library(ggplot2)
png(filename = "bar.png",width=680,height = 500)
p <- ggplot(goData, aes(x = -log10(V5), y = GoItemOrder, fill = V6)) +
  geom_bar(stat = "identity", width = 0.7)
p + theme_bw() +
  theme(
    panel.background = element_blank(), #背景为空
    panel.grid = element_blank(), #网格线为空
    panel.border = element_rect(color = "black", size = 1), #边框设置
    axis.text.x = element_text(size = 15), #坐标轴文件显示
    axis.text.y = element_text(size = 15),
    legend.text = element_text(size=10) #图例文字显示
  ) +
  xlab("-log10(p-value)") + ylab("") + #坐标轴显示文字
  guides(fill = guide_legend(title = NULL)) + #隐藏图例标题
  scale_fill_manual(
    values = c("#2ecc71", "#FFC312"), #自定义填充颜色
    breaks = c("Dt_cmplete_conserve", "At_cmplete_conserve"), #自定义填充图例顺序
    labels = c("Dt vs D5 complete conserve", "At vs A2 complete conserve"), #自定义填充图例文字
  )
  dev.off()
```



### 效果图片展示

![条形图](https://s1.ax1x.com/2020/03/15/8353g1.png)



### 参考 

1.图例  [https://blog.csdn.net/bone_ace/article/details/47284805#%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98](https://blog.csdn.net/bone_ace/article/details/47284805#隐藏标题) 