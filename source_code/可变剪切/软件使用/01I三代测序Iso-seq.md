### PacBio三代全长转录组测序

1. ### 安装SMART软件

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

2. 使用**CCS**对原始数据进行过滤

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
   
3. 对转录本进行无参考基因组的归类

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

   3.2 去除full length 的噪音

   ```bash
   #v7版本的命令
    isoseq3 refine 前缀primer_5p--primer_3p.bam  primers.fasta movie.flnc.bam
    #v8版
     isoseq3 refine movie.fl.P5--P3.bam primers.fasta movie.flnc.bam
   ```

   3.3 聚类

   ` isoseq3 cluster movie.flnc.bam unpolished.bam --verbose`

   :warning: 如果想要比较同源基因之间的差异的话，这一步可以不做

   3.4打磨 polich

   ` isoseq3 polish unpolished.bam movie.subreads.bam polished.bam`

4. 比对到参考基因组

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
   gmao -D 索引所在目录 -d 索引文件前缀 -f smase -t 10 -n 2 polished.hq.fasta >gmap.sam 2>gmap.err 
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
     

5. TaMa将很相似的转录本合并**去冗余**

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

   

   

6. 











### 参考

完整的分析 流程 https://github.com/GenomeRIK/tama/wiki

PacBio官方SMART软件使用说明**V8版本的**

https://www.pacb.com/wp-content/uploads/SMRT-Tools-Reference-Guide-v8.0.pdf

https://www.cnblogs.com/RyannBio/p/9598340.html

GMap软件 http://research-pub.gene.com/gmap/

samtools输出文件格式 https://blog.csdn.net/genome_denovo/article/details/78712972

全长转录本分类https://github.com/GenomeRIK/tama/wiki/Tama-Collapse