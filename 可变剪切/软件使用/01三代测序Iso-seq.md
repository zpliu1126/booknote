### PacBio三代全长转录组测序

分析流程

https://github.com/PacificBiosciences/IsoSeq/blob/master/README_v3.1.md

![分析流程](https://github.com/Magdoll/images_public/raw/master/github_isoseq3_wiki_figures/IsoSeq3_workflow_v3.png)

这张图片形象的展示了每一步测序数据的变化

![测序说明](https://user-images.githubusercontent.com/39325949/66532093-b8a89100-eb40-11e9-8163-4a382a1afb53.png)

### 1.安装SMART软件

从网站https://www.pacb.com/support/software-downloads/下载SMART-Link软件

```bash
./smrtlink_7.0.1.66975.run  --rootdir  /public/home/zpliu/software/smrtlink --smrttools-only
```

+ --rootdir 指定安装路径
+ --smrttools-only 只安装命令行工具，反正服务器里你图形界面也看不到

版本升级，下载升级版本的安装文件，然后只需要在安装的命令上面加个参数就行

```bash
./新版本的安装程序  --rootdir  /public/home/zpliu/software/smrtlink --smrttools-only  --upgrade
```



之后将安装的命令添加到环境变量中

```bash
export PATH=" /public/home/zpliu/software/smrtlink/smrtcmds/bin:$PATH"
```

### 2.使用**CCS**对原始数据进行过滤

```bash
ccs 
--noPolish 
--minPasses 1 
--minLength 300 
--minSnr 4 
--maxLength 10000 
--maxDropFraction 0.8 
--minPredictedAccuracy  0.8
--numThreads 20 
--logFile  ccs.log 
--reportFile repoet_css.txt input_subreads.bam  output.bam
```

+ **noPolish** 不会对数据进一步的过滤
+ **-minPasses**  最低的通过值
+ **minLength**  获取的draft consensus最短长度，用于下一步的分析
+ **maxLength** 最长的长度
+ **minSnr** 移除包含delete的SNP
+ **-minPredictedAccuracy** 最小精度0.8
+ **--logFile** 记录日志文件
+ **-reportFile** 报告处理的文件
+ **maxDropFraction**  Maximum fraction of subreads dropped by polishing

### 3.对转录本进行无参考基因组的归类

引物文件是固定的

```bash
$ cat primers.fasta
>primer_5p
AAGCAGTGGTATCAACGCAGAGTACATGGGG
>primer_3p
AAGCAGTGGTATCAACGCAGAGTAC
```

3.1 去除引物

` lima output.bam  primers.fasta demux.ccs.bam --isoseq --no-pbi -j 线程数 --min-length 300` 

3.2 去除full length 的噪音remove  polyA tails

```bash
#v7版本的命令
 isoseq3 refine 前缀primer_5p--primer_3p.bam  primers.fasta movie.flnc.bam
 #v8版
  isoseq3 refine movie.fl.P5--P3.bam primers.fasta movie.flnc.bam
```

3.3 聚类

` isoseq3 cluster movie.flnc.bam unpolished.bam ·	

:warning:~~如果想要比较同源基因之间的差异的话，这一步可以不做~~

3.4打磨 polich

` isoseq3 polish -j 20 unpolished.bam input_subreads.bam polished.bam`

### 4.比对到参考基因组

4.1 软件安装

```bash
#下载最新版软件
./configure --prefix=自定义安装路径
make 
make install
```

4.2 建立参考基因组

```bash
gmap_build -D 存放索引的目录 -d G.arboreum.Chr.v1.0 基因组fasta文件
```

4.3 将全长转录本比对到参考基因组

```bash
gmap -D 索引所在目录 -d 索引文件前缀 -f samse -t 10 -n 2 polished.hq.fasta >gmap.sam 2>gmap.err 
## 推荐使用这种方法,不然老是报错
cat fasta|gmap -D 索引所在目录 -d 索引文件前缀 -f samse -t 10 -n 2   >gmap.sam 2>gmap.err
```

+ -f 输出文件为sam格式
+ -t 指定线程数目
+ -n 设置比对的类型，为0可以鉴定嵌合基因



4.4 根据SNP数据区分多倍体reads

```bash
transcript/963  16      Chr01   1836618 0       62S165M1I453M74N371M119N348M172N	*       0       0       GATCTCTACCATAAGCTTTTAGCAATGCCAAAATCAGTAAGATGAGCCTCTAAATCCTTGTCCAACAAAATATTTGATGACTTCACATCCCTGTGGATGATTCGTGGACTACAGTCATGATGTAAATACGCTAACCCTTGTGCAGCTCCCAGTGCAATCTTTAATCGAATGTTCCAACTGAGAACTTTCTTCTTGGTAGAAACATGGAGGAGATCCCAGAGACTGCCATTTTCCATATAGTCATAGAAGAGAAGGTTCCGAGACGGGGAGAGAGAATACCCTTGAAGGCTGACCAGATTTCGGTGCTTAATACTCCCAATTGTCTCGAGTTCTGTCTCGAATTCCTTCAAGCATTGTGGATAGTGAGAGTAGAGCCACTTGATGGCAACTGGCCT	 *       MD:Z:97T72C38A23T42G109G36C1
5C47A89G20T100G16G141G77A11C10C5C10C17	NH:i:1  HI:i:1  NM:i:62 SM:i:40 XQ:i:24 X2:i:0  XO:Z:UU XS:A:-
```

对于mapping状态可分为以下几类：

+ M：alignment match (can be a sequence match or mismatch)
  表示read可mapping到第三列的序列上，则read的碱基序列与第三列的序列碱基相同，表示正常的mapping结果，M表示完全匹配，但是无论reads与序列的正确匹配或是错误匹配该位置都显示为M
+ I：insertion to the reference
  表示read的碱基序列相对于第三列的RNAME序列，有碱基的插入
+ D：deletion from the reference
  表示read的碱基序列相对于第三列的RNAME序列，有碱基的删除
+ N：skipped region from the reference
  表示可变剪接位置
+ P：padding (silent deletion from padded reference)
+ S：soft clipping (clipped sequences present in SEQ)
+ H：hard clipping (clipped sequences NOT present in SEQ)
  clipped均表示一条read的序列被分开，之所以被分开，是因为read的一部分序列能匹配到第三列的RNAME序列上，而被分开的那部分不能匹配到RNAME序列上。
+ "="表示正确匹配到序列上
+ "X"表示错误匹配到序列上
  

### 5.TaMa将很相似的转录本合并**去冗余**

![合并转录本](https://github.com/GenomeRIK/tama/raw/master/images/Collapse1.png)

这个过程很复杂，图中就有两种可能的合并方式：

+ Transcription Start Site Collapse
+ Exon Cascade Collapse

具体可以查看这篇文献 https://bmcgenomics.biomedcentral.com/articles/10.1186/s12864-017-3691-9

5.1 下载和安装

```bash
#发现我没有pip2安装走一波

#下载文件
wget https://bootstrap.pypa.io/get-pip.py --no-check-certificate
#执行安装
python get-pip.py --user

git clone https://github.com/GenomeRIK/tama
#也可以之间在windows下载好rz 进去
#程序基于python2运行 ，需要安装Biopython module模块
pip install --upgrade pip  --user # 更新pip
pip install Biopython  --user
```

运行tama_collapse.py 脚本

```bash
/usr/bin/python tama_collapse.py  -s ../gmap_sort.sam  -f ../../Gr_genome/Graimondii_221_v2.0.fa    -p tama -x capped
```

每个参数的详细说明 https://github.com/GenomeRIK/tama/wiki/Tama-Collapse



### 6.Cupcake去除冗余，这个步骤和5是一样的 **推荐这个流程**

6.1 安装Cupcake软件，这个流程适合依赖于python2的cupcake，应该克隆对应的**Py2_v8.7.x.** 分支

首先得安装cogent环境 https://github.com/Magdoll/Cogent/wiki/Installing-Cogent#conda

```bash
## 创建anaCogent环境
conda create --name anaCogent python=2.7 anaconda
## 进入anaCogent环境
conda activate anaCogent
## 安装依赖
conda install -n anaCogent biopython -y
conda install -n anaCogent -c bcbio bx-python -y
conda install -n anaCogent -c conda-forge pulp -y
## 安装cogent
cd <your_dir>
git clone https://github.com/Magdoll/Cogent.git
cd Cogent
git checkout 
git submodule update --init --recursive
cd  Complete-Striped-Smith-Waterman-Library/src
make
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:<your_dir>/Cogent/Complete-Striped-Smith-Waterman-Library/src
export PYTHONPATH=$PYTHONPATH:<your_dir>/Cogent/Complete-Striped-Smith-Waterman-Library/src
cd ../../
python setup.py build
python setup.py install
## 可以将export两行命令加入到.bashrc文件中

## 开始安装cupcake，选择对应的Py2_v8.7.x. 分支
git clone -b Py2_v8.7.x  https://github.com/Magdoll/cDNA_Cupcake.git
cd cDNA_Cupcake/
python setup.py build
python setup.py install
```

6.2 安装依赖于python3.7环境的cupcake

参考 https://github.com/Magdoll/cDNA_Cupcake/tree/master

```bash
conda create --name Cupcake python=3.7 
conda activate Cupcake 
conda install Biopython 
git clone = https://github.com/Magdoll/cDNA_Cupcake.git
##添加到环境变量
export PATH=$PATH:<path_to_Cupcake>/sequence/
export PATH=$PATH:<path_to_Cupcake>/rarefaction/ ## 这不找不到，不加了
cd cDNA_Cupcake/
python setup.py build
python setup.py install
collapse_isoforms_by_sam.py -h
```

#### 6.3 具体的使用方法

参考 https://github.com/Magdoll/cDNA_Cupcake/wiki/Cupcake-ToFU%3A-supporting-scripts-for-Iso-Seq-after-clustering-step#what

```bash
## 将Gmap得到的sam结果文件进行排序
sort -k 3,3 -k 4,4n gmap.sam >gmap_sorted.sam
## 结合gmap的比对结果去除冗余的转录本
collapse_isoforms_by_sam.py --input polished.hq.fastq --fq  -s gmap_sorted.sam -o tama/test --dun-merge-5-shorter -c 0.95 -i 0.85
```

+ --input 输入文件
+ --fq 指定输入文件为fastq
+ -s Gmap输出后的sam文件经过sorted
+ -o 输出文件前缀，当然也可以加目录，直接输出到对应目录下
+ -c 最小覆盖度
+ -i 相似度
+ --dun-merge-5-shorter  5‘端的read由于测序的原因可能是真是存在差别，也可能是冗余；跟建库方式有关；因为设计引物数利用ployA的，所以5’端的序列可能没有完全扩到

**过滤因为5’端测序的误差，导致冗余没有完全去除**

```bash
filter_away_subset.py test.collapsed
```

### 7.与已有的注释信息进行比较

 https://github.com/TomSkelly/MatchAnnot 

```bash
/usr/bin/python ~/software/MatchAnnot/matchAnnot.py  --gtf 已经发表的基因组gtf文化  --format alt gmap的比对结果sam文件需要按照染色体顺序排好序  >111 
```





### 8.Alternative splice.py脚本进行分类

```bash
git clone https://github.com/liangfan01/pipeline-for-isoseq.git --depth 1
## 脚本在other目录下，依赖于python2
## 先退出conda，回到bash下
conda deactive
## 安装依赖包
pip2 install svgwrite --user
pip2 install networkx --user 
## 我的python环境被污染了，只能指定对应的python
/usr/bin/python alternative_splice.py -i gfffile  -g 参考基因组文件gtf文件 -f 参考基因组文件  -o 输出路径 -os -as -ats T -op
```

:warning:alternative_splice.py脚本中使用的参考基因组的gtf文件还需要使用awk，进行转化

```bash
awk '{print $1 "\t" $2 "\t" $3 "\t" $4 "\t" $5 "\t" $6 "\t" $7 "\t" $8 "\t" $11 " " $12 " " $9 " " $10}' cufflinks转化后的gtf文件 >最后可以使用的gtf文件
```

#### 输出文件

```bash
$ tree
.
├── acceptor.list.txt
├── alternative.splice.list.txt
├── donor.list.txt
├── error.orient.list.txt
├── gene.cluster.picture
├── novel.gene.list.txt
├── proved.transcript.list.txt
├── splice.ascode.list.txt
├── splice.ascode.stat.txt
├── transcript.cluster.list.txt
├── unproved.gene.list.txt
└── unproved.transcript.list.txt
```

 

****

**暂时就更新到这里了~~~**



### 鉴定可变剪切spladder

 参考文档 https://spladder.readthedocs.io/en/latest/installation.html 

在Ancona中安装这个软件

+ 进行可变剪切的鉴定

  ```bash
  spladder build -a ../../../07_annotation/merge.gtf  -b ../test.bam  -c 1 -o ./ --merge-strat single
  ```

  







### 参考

完整的分析 流程 https://github.com/GenomeRIK/tama/wiki

PacBio官方SMART软件使用说明**V8版本的**   single molecular real-time   

https://www.pacb.com/wp-content/uploads/SMRT-Tools-Reference-Guide-v8.0.pdf

https://www.cnblogs.com/RyannBio/p/9598340.html

GMap软件 http://research-pub.gene.com/gmap/

samtools输出文件格式 https://blog.csdn.net/genome_denovo/article/details/78712972

全长转录本分类https://github.com/GenomeRIK/tama/wiki/Tama-Collapse

Cupcake分析流程 https://github.com/Magdoll/cDNA_Cupcake/wiki/Cupcake-ToFU:-supporting-scripts-for-Iso-Seq-after-clustering-step#what

去除冗余之后的分析流程 https://github.com/PacificBiosciences/IsoSeq_SA3nUP/wiki/What-to-do-after-Iso-Seq-Cluster%3F