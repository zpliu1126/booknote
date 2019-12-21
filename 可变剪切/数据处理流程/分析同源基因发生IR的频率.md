# 分析同源基因中发生IR事件的频率



首先根据已经鉴定好的IR事件，和对应的亚基因组同源基因；分别去看每个棉种中对应基因发生IR的频率或者是数目

就可以大致的将同源基因进行一个分类

1. 四个基因组中都频繁的发生IR事件 >10
2. 四个基因组的基因都不发生IR事件
3. 只有个别基因组频繁的发生了IR事件
4. At与A2 频繁的发生IR事件
5. Dt与D5 频繁的发生IR事件
6. A2与D5 比较频繁发生
7. At与Dt 频繁的发生
8. 各个基因组发生的频数相差都不大



### 同源基因中IR事件数目的统计

```bash
## 将所有棉种的IR事件合并到一个文件中
awk '$3~/IntronR/{print $2}' ../TM-1/end_third |sort |uniq -c |awk '{print $2"\t"$1}' >intronR_count.txt 
awk '$3~/IntronR/{print $2}' ../D5/end_third |sort |uniq -c |awk '{print $2"\t"$1}' >>intronR_count.txt 
awk '$3~/IntronR/{print $2}' ../A2/end_third  |sort |uniq -c |awk '{print $2"\t"$1}' >>intronR_count.txt
## 之后使用自己写的python脚本跑
python Count_homologe_IRcount.py  intronR_count.txt ../GhDt_Gr_GhAt_Ga_end_noScaffold  1 
```

### 比较频数相差不大的这些基因中比较保守的IR事件

#### 1.首先都没有发生IR事件的同源基因

```bash 
awk '$2==0&&$4==0&&$6==0&&$8==0{print $0}' 1
```

#### 2.都发生了IR事件但是数目上相差不超过log2 阀值

```bash
awk '$2!=0&&$4!=0&&$6!=0&&$8!=0{if(($2/$4<2&&$2/$4>0.5)&&($2/$6<2&&$2/$6>0.5)&&($2/$8<2&&$2/$8>0.5)&&($4/$6<2&&$4/$6>0.5)&&($4/$6<2&&$4/$8>0.5)&&($6/$8<2&&$6/$8>0.5)){print $0}}' 1
```













