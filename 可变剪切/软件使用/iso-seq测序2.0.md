# iso-seq测序2.0版本



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



### 使用脚本鉴定可变剪切

```bash
alternative_splice.py -i GMAP比对后的文件 -g 参考基因组gtf文件 -f 参考基因组序列 -as  -ats T -op -os 
```

修改gtf文件

```bash
awk '{print $1 "\t" $2 "\t" $3 "\t" $4 "\t" $5 "\t" $6 "\t" $7 "\t" $8 "\t" $11 " " $12 " " $9 " " $10}' cufflinks转化后的gtf文件 >最后可以使用的gtf文件
```

+ 基因组的参考文件**要经过一定的修改
+ as 对每种可变剪切进行编码
+ ats 是否输出可变剪切的统计文件 可以指定

软件的思想：

+ 首先读取参考基因组的注释文件，将外显子比较相似的isform合并成一个转录本
+ 读取GMAP比对得到的gff文件，与上一步得到的文件进行合并，最后得到每个基因中含有的转录本
+ 对每个基因进行扫描，进行两两比较，然后坚定可变剪切的位点
+ 将基因发生可变剪切的位点提取出来，排序得到 splice code
+ **^** 表示可变供体
+ **-**表示受体
+ **0**表示不存在剪切位点





