### 1.创建BedTool对象

```python
##读取bed文件
>>> import pybedtools

>>> # use a BED file that ships with pybedtools...
>>> a = pybedtools.example_bedtool('a.bed')

>>> # ...or use your own by passing a filename
>>> a = pybedtools.BedTool('peaks.bed')
```

### 2.两个bed文件取交集`intersection`

查看intersection函数的参数`?pybedtools.BedTool.intersect`和环境变量中bedtools的版本是一样的

```python
>>> a = pybedtools.example_bedtool('a.bed')
>>> b = pybedtools.example_bedtool('b.bed')
>>> a_and_b = a.intersect(b)
##使用loj参数
a_b=a.intersect(b,loj=True)
```

### 3.保存结果文件`saveas`

```pyth
a_b.saveas('intersection-of-a-and-b.bed')
```

### 4.过滤初始的输入bed文件

```python
#过滤起始和终止位点相差超过100的；
>>> a = pybedtools.example_bedtool('a.bed')
>>> b = a.filter(lambda x: len(x) > 100)
>>> print(b)
#chr1        150     500     feature3        0       -

##过滤指定染色体编号的行
b = a.filter(lambda x: x[0]=="chr1")
```





