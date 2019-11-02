# Bash练习题

### ~~2019-10-15~~

1. 在终端输出`hello wold`
2. 创建一个名字叫test的目录
3. 在test目录中创建一个test.txt文件
4. 在test.txt文件中写入`hello world`
5. 将test.txt打包压缩成 `.tar.gz`后缀的文件
6. 将压缩文件发给我

***

### ~~2019-10-19~~

+ 在linux中下载测试数据文件

  下载地址  https://zpliu1126.github.io/Bioinformatic/test.gff3 

+ 了解gff3文件格式

  官方文档  https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md 

  看完之后最好自己总结一下这个文件格式

+ 统计下载文件的行数

+ 去除文件中重复的行

这些操作可能会使用到的命令

+ `wget`
+ `less`
+ `wc`
+ `sort`
+ `uniq`

CDS、5'_UTP 、3'_UTR、exon、intron理解

 http://www.dxy.cn/bbs/topic/36728037?sf=2&dn=10 

***



### ~~2019-10-29~~

基因的**fasta**格式的序列

```bash
>atp4
ATGAGATTTAGTTCACGGGATATGCAGGATAGAAAGATGCTATTTGCTGCTATTCCATCTATTTGTGCATCAAGTCCGAA
GAAGATCTCAATCTATAATGAAGAAATGATAGTAGCTCGTCGTTTTATAGGCTTTATCATATTCAGTCGGAAGAGTTTAG
GTAAGACTTTCAAAGTGACTCTCGACGGGAGAATCGAGGCTATTCAGGAAGAATCGCAGCAATTCCCCAATCCTAACGAA
GTAGTTCCTCCGGAATCCAATGAACAACAACGATTACTTAGGATCAGCTTGCGAATTTGTGGCACCGTAGTAGAATCATT
ACCAACGGCACGCTGTGCGCCTAAGTGCGAAAAGACAGTGCAAGCTTTGTTATGCCGAAACCTAAATGTAAAGTCAGCAA
CACTTCCAAATGCCACTTCTTCCCGTCGCATCCGTCTTCAGGACGATATAGTAACAGGTTTTCACTTCTCAGTGAGTGAA
AGATTTTTCCCCGGGTGTACGTTGAAAGCTTCTATCGTAGAACTCATTCGAGAGGGCTTGGTGGTATTAAGAATGGTTCG
GGTGGGGGGTTCTCTTTTTTAA
>atp6
ACGATTACGCCCAACAGCCCACTTGAGCAATTTGCCATTCTCCCATTGATTCCTATGAATATTGGAAAAATTTATTTCTC
ATTCACAAATCCATCTTTGTCTATGCTGCTAACTCTCAGTTTGGTCCTACTTCTGGTTCATTTTGTTACTAAAAACGGAG
GGGGAAACTCAGTACCAAATGCTTGGCAATCCTTGGTAGAGCTTATTCATGATTTCGTGCCGAACCCGGTAAACGAACAA
ATAGGTGGTCTTTCCGGAAATGTTCAACAAAAGTTTTCCCCTCGCATCTCGGTCACTTCTACTTTTTCGTTATTTCGTAA
TCCCCAGGGTATGATACCTTATAGCTTCACAGTCACAAGTCATTTTCTCATTACTTTGGGTCTCTCATTTCCGATTTTTA
TTGGCATTACTATAGTGGGATTTCAAAGAAATGGGCTTCATTTTTTAAGCTTCTCATTACCCGCAGGAGTCCCACTGCCG
TTAGCACCTTTTTTAGTACTCCTTGAGCTAATCCCTCATTGTTTTCGCGCATTAAGCTCAGGAATACGTTTATTTGCTAA
TATGATGGCCGGTCATAGTTCAGTAAAGATTTTAAGTGGGTCCGCTTGGACTATGCTATGTATGAATGATCTTTTTTATT
TCATAGGAGATCCTGGTCCTTTATTTATAGTTCTTGCATTAACCGGTCCGGAATTAGGTGTAGCTATATCACAAGCTCAT
GTTTCTACGATCTCAATCTGTATTTACTTGAATGATGCTACAAATCTCCATCAAAGTGGTTATTTATTTATAATTGAACA
```

+ 把上面的序列在服务器中写进test.fa文件

+ 写一个名字叫**fastaread.py**的python脚本对fasta文件进行读取,

  代码如下

  ```python
  #!/usr/bin/python 
  def cat(file):
      """
      读入FASTA格式的文件
      :param file: FASTA格式的文件
      :return: None
      """
      for line in open(file):
          print(line.strip())
  
  cat("./test.fa")
  
  ```

+ 运行脚本 ----命令为 `python fastaread.py`

+ 理解每行代码做了什么事情

可以帮助理解的博客

+ 脚本第一行的意思 https://www.cnblogs.com/furuihua/p/11213486.html
+ python srip函数 https://www.runoob.com/python/att-string-strip.html
+ python 函数 https://www.runoob.com/python3/python3-function.html
+ python open函数 https://www.runoob.com/python3/python3-func-open.html

面向对象 ：https://baijiahao.baidu.com/s?id=1597642060961639915&wfr=spider&for=pc



### 2019-11-02

+ 获取服务器最近100条登录记录,将登录记录保存到`login.log`日志文件

+ **写一个python脚本**，统计这100条记录中出现了哪些用户，和用户登录的次数,类似这样的结果

  ```python
  userName	loginCount
  genome	10
  yjwang	5
  ```

参考命令 ：

+ `last`
+ `head`
+ `>` 重定向符 https://www.cnblogs.com/piperck/p/6219330.html 

python 知识点

+  `split()`切割字符串函数https://www.runoob.com/python/att-string-split.html 
+ `open()`打开文件函数 https://www.runoob.com/python/python-func-open.html 
+ 读写文件  https://www.cnblogs.com/zywscq/p/5441145.html 
+ sys获取命令行参数  https://blog.csdn.net/u011068702/article/details/80787226 







