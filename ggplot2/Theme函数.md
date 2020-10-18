#### ggplot2调整绘图区域大小

```R
theme(
plot.margin=unit(rep(1,4),'lines')
)
```

+ `plot.margin	` : margin around entire plot (unit with the sizes of the top, right, bottom, and left margins)

#### 隐藏坐标轴

```R
theme(
    axis.line.x.bottom = element_blank(),
)
```

#### 隐藏刻度线

```R
theme(
   axis.ticks.x = element_blank()
)
```

#### 隐藏刻度值

```R
theme(
axis.text.x = element_blank()
    )
```





