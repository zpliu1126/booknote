#  iso-seq测序2.0版本



### 与参考基因组的注释信息进行比较

https://github.com/TomSkelly/MatchAnnot

```bash
# python2
python ~/software/MatchAnnot/matchAnnot.py  --gtf ~/work/Alternative/data/Gr_genome/Graimondii_221_v2.1.gene.gtf --format alt ./test.sam  >test/annote.out
```



### 将sam文件转换为gff文件

使用 https://github.com/Magdoll/cDNA_Cupcake/wiki#what  Cupcake包中的一个脚本

```bash
# 加入环境变量
export PATH=$PATH:~/software/cDNA_Cupcake/
# 必须切换cDNA_Cupcake目录才能运行
cd ~/software/cDNA_Cupcake/
sam_to_gff3.py -h
sam_to_gff3.py -s "标识符" ~/work/Alternative/result/Gr_result/CO41_42_result/06_Alignment/test.sam 
# gff3转gtf
~/scripte/gff2gtf_cufflinks  test.gff3  -T -o test.gtf
```



### 过滤比对文件

无论我怎么修改**GMAP**的参数，都不能够把这种比对情况给消除，试了一下 **minimap** 也是一样的效果https://github.com/lh3/minimap2#map-long-splice ，只能自己写脚本过滤一遍了

![GMAP错误比对](https://43423.oss-cn-beijing.aliyuncs.com/img/20191113160735.png)



#### 提取GMAP得到的gff文件中每个isform的bed文件

```bash
sed '/^#/d' test.gff|awk -F "\t" '{print $9}' |awk -F "|" '{print $2"\t"$1}' |sed -e 's/([^)])//g' -e 's/:/\t/g' -e 's/-/\t/g'|sort|uniq|less 
```

#### 提取参考基因组中gene的吧bed文件

考虑到基因初始位置减去3000后出现负数，经把它改成0

```bash
awk '$3~/gene/{printf $1"\t"$4-3000"\t"$4-3000+1"\t"$9"\n"$1"\t"$5+3000"\t"$5+3001"\t"$9"\n"}' ~/work/Alternative/data/Ga_genome/G.arboreum.Chr.v1.0.gff|awk '{if($2<0){print $1,0,1,$4}else{print $0}}' OFS="\t"
```

### 使用脚本鉴定可变剪切

```bash
alternative_splice.py -i GMAP比对后的文件 -g 参考基因组gtf文件 -f 参考基因组序列 -as  -ats T -op -os  -t exon -c 0.95 -ave 3
```

修改gtf文件

```bash
awk '{print $1 "\t" $2 "\t" $3 "\t" $4 "\t" $5 "\t" $6 "\t" $7 "\t" $8 "\t" $11 " " $12 " " $9 " " $10}' cufflinks转化后的gtf文件 >最后可以使用的gtf文件
```

+ 基因组的参考文件**要经过一定的修改
+ as 对每种可变剪切进行编码
+ ats 是否输出可变剪切的统计文件 可以指定
+ op 是否输出图片
+ os 输出剪切位点序列
+ -t 指定识别模式
+ -c 如果外显子相似度达到阈值，则过滤掉转录本
+ -ave  如果边缘差异在【0,3】内，则过滤这个剪切事件

#### 可变剪切的类型

+ AltP events  refer to introns overlapping with each other but with both  5'- and 3'-ends differing.
+ AltD   same 3'-end but a different 5'-end, this event was classified as 
+ IntronR  was completely covered by an exon, the event was classified as 
+ ExonS exon was completely covered by an intron, the event was classified as 

软件的思想：

+ 首先读取参考基因组的注释文件，将外显子比较相似的isform合并成一个转录本
+ 读取GMAP比对得到的gff文件，与上一步得到的文件进行合并，最后得到每个基因中含有的转录本
+ 对每个基因进行扫描，进行两两比较，然后坚定可变剪切的位点
+ 将基因发生可变剪切的位点提取出来，排序得到 splice code
+ **^** 表示可变供体
+ **-**表示受体
+ **0**表示不存在剪切位点

#### 根据可变剪切编码提取对应的剪切事件

1.提取可变剪切的编码

```bash
awk -F "\t" '{print $9 }' splice.ascode.list.txt|cut -d \; -f 3|sed 's/structure //g' |sed 's/,/\t/g' >111
```







