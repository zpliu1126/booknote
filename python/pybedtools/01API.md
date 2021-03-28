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
## 遍历结果文件
a_b.head()
```

### 3.保存结果文件`saveas`

```pyth
a_b.saveas('intersection-of-a-and-b.bed')
```

### 4.过滤初始的输入bed文件

$\color{red}{ filter生成的迭代器只能被使用一次}$

> You’ll need to be careful when using `BedTool` objects as generators, since any operation that reads all the features of a `BedTool` will consume the iterable.

```python
#过滤起始和终止位点相差超过100的；
>>> a = pybedtools.example_bedtool('a.bed')
>>> b = a.filter(lambda x: len(x) > 100)
>>> print(b)
#chr1        150     500     feature3        0       -

##过滤指定染色体编号的行
b = a.filter(lambda x: x[0]=="chr1")
```

### 5.根据bed文件提取序列

```python
>>> a = pybedtools.BedTool("""
... chr1 1 10
... chr1 50 55""", from_string=True)
>>> fasta = pybedtools.example_filename('test.fa')
>>> a = a.sequence(fi=fasta)
##保存seq信息
a.save_seqs("提取的序列信息")
##通过open打开存有序列信息的文件
>>> print(open(a.seqfn).read())
```

### 6.改变bed文件

```bash
##定义修改bed文件的函数
def modify(feature):
	feature.start=feature.start-1
	return feature
##返回修改后的Bedtool
b = pybedtools.example_bedtool('b.bed')
c=b.each(modify)
```

### 7.删除临时文件

```bash
b = pybedtools.example_bedtool('b.bed')
b.delete_temporary_history()
```

### 8.批量取交集

```bash

```





