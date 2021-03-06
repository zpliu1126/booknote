# 对剪切事件进行分类


### Exon Skip事件
| 事件       | 对应的基因数目 | 事件数目 |
| ---------- | -------------- | -------- |
| 全都保守   | 33             | 35       |
| At=A2      | 100            | 104      |
| Dt=D5      | 234            | 252      |
| At=Dt      | 66             | 69       |
| A2=D5      | 79             | 81       |
| 只有At没有 | 37             | 37       |
| 只有Dt没有 | 35             | 36       |
| 只有A2没有 | 78             | 79       |
| 只有D5没有 | 20             | 22       |
| 只在At有   | 773            | 874      |
| 只在Dt有   | 699            | 795      |
| 只在A2有   | 690            | 815      |
| 只在D5有   | 1459           | 1724     |



***

查看基因数目

```bash
cut -f5 all_converse.bed |awk -F "_" '$1~/Ghir/{print $1"_"$2}$1!~/Ghir/{print $1}' |sort|uniq |grep "Gor" |wc -l
```



### AltA事件

| 事件       | 对应的基因数目 | 事件数目 |
| ---------- | -------------- | -------- |
| 全都保守   | 130            | 150      |
| At=A2      | 209            | 255      |
| Dt=D5      | 408            | 452      |
| At=Dt      | 364            | 410      |
| A2=D5      | 170            | 190      |
| 只有At没有 | 58             | 63       |
| 只有Dt没有 | 81             | 90       |
| 只有A2没有 | 216            | 249      |
| 只有D5没有 | 78             | 87       |
| 只在At有   | 1934           | 2541     |
| 只在Dt有   | 1923           | 2601     |
| 只在A2有   | 1683           | 2354     |
| 只在D5有   | 2295           | 3081     |



***

### AltD事件

| 事件       | 对应的基因数目 | 事件数目 |
| ---------- | -------------- | -------- |
| 全都保守   | 79             | 86       |
| At=A2      | 162            | 198      |
| Dt=D5      | 289            | 324      |
| At=Dt      | 316            | 360      |
| A2=D5      | 130            | 149      |
| 只有At没有 | 46             | 51       |
| 只有Dt没有 | 63             | 80       |
| 只有A2没有 | 145            | 166      |
| 只有D5没有 | 58             | 63       |
| 只在At有   | 1747           | 2262     |
| 只在Dt有   | 1796           | 2373     |
| 只在A2有   | 1381           | 1823     |
| 只在D5有   | 1638           | 2078     |

