# linux三剑客

awk、sed、grep通常被称作linux中的三剑客，得益于它们在处理文本数据时的高效性和便捷性。通过配合linux中管道符`|`将三个命令组合使用，几乎能够处理日常中大部分文本数据和需求。本文将介绍一些生物数据分析过程中常常会使用到的组合命令，如果文章篇幅比较长可以通过`ctrl + F`关键字搜索对应的代码。

安利一个网站，能够很方便的解析你给出的linux命令和对应的参数，不过解释都是全英文的（哈哈哈）还能提高英语水平。相比与linux中通过`man awk`来一个一个找参数看的话会更加方便一些。

> https://explainshell.com/explain?cmd=awk+-F 

![命令解析网页](https://43423.oss-cn-beijing.aliyuncs.com/img/20200323232200.png)

### awk

1.常用到的一些参数介绍：

+ `-F`参数

  定义输入文件分隔符，默认是空白；比如定义分隔符为`;`需要`awk -F ";"`

+ `NF`

  输入文件对应的列的数目

+ `NR`

  输入文件对应行的数目

+ `OFS`

  定义输出文件中列与列之间的分割符，例如定义TAB分隔符`OFS="\t"`

2.awk中正则表达式介绍：

例如输出第一列含有`hello`字符的内容。

对正则表达式不了解的同学可以看这篇文章的笼统介绍，当然想要更加深入的了解，还是得自己动手加上书本的知识。

>  https://www.zhihu.com/question/19676915 

```bash
awk '$1~/hello/{print $1}' 输入文件
```

3.常见的函数

+ `gsub`对某一个字段进行正则匹配，返回匹配的字符
+ `index`返回字符窜在字段的位置
+ `length`返回字符串长度
+ `split`将字符进行分割，分割后存进指定的数组内
+ `substr`截取字符串



### sed

### grep



### 实用的组合命令

+ 从gff文件中提取gene坐标bed文件

```bash
awk '$3~/gene/{print $1,$4,$5,$9}' OFS="\t" Gbarbadense_gene_model.gff3|awk -F ";" '{print $1}' |sed 's/ID=//g' >gene.bed

```

+ 提取基因上下游3000bp启动子区域

```bash
awk -F ";" '{print $1}' ../../Ghirsutum_gene_model.gff3|awk -F "\t" '$3~/gene/&&$7=="-"{print $1,$5+1,$5+3000,$9}$3~/gene/&&$7=="+"{if($4>3000){print $1,$4-3000,$4-1,$9}else{print $1,1,$4-1,$9}}' OFS="\t" |sed 's/ID=//g' >gene_promter.bed
```

