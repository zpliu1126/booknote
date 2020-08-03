## 手把手教你搭建JBrowse-初始化应用

JBrowse是**GMOD**开源项目中的一个基因组浏览器，所谓的基因组浏览器，字面意思就可以理解成一个网页应用。可能每个生物信息分析的同学电脑内都会安装一个**IGV**，用于对高通量测序数据的可视化。其实**JBrowse**也就是相当于把**IGV**，搬到了服务器内，把庞大的测序数据存储在服务器内，借助于快速发展的web技术；使得我们能够通过仅仅发送一个网页链接就能够与他人共享或者讨论课题。

> 本文搭建JBrowse应用访问链接： http://cotton.hzau.edu.cn/tools/jbrowse/?data=data/Ghirsutum_genome_HAU_v1.1

![吃瓜](https://s3-us-west-2.amazonaws.com/s.cdpn.io/80625/headerpic.svg)

### 配置文件

JBrowse支持两种配置文件：

+ JSON格式
+ textual格式

其中JBrowse的全局配置文件`jbrowse.conf `采用textual格式进行配置，具体到特定的数据例如 基因组序列，BAM文件的配置信息时采用textual格式；具体到某种数据的显示时采用JSON进行配置

> 入门文章也是使用简化的配置：https://jbrowse.org/docs/minimal.html

主要讲一下`tracks.conf`这个`textual`类型的配置文件

+ `[tracks.refseq]`后面的refseq表示轨迹的名称，之后再WEB上的选项上会出现
+ `urlTemplate`表示轨迹文件在的路径，相对于当前配置文件的路径
+ `storeClass`轨迹的类型包括`fasta`、`vcf`、`BAM`
+ `type`字段也差不多

```bash
[GENERAL]
refSeqs=Ghirsutum_HZAU_V1.0.fa.fai  ##固定格式便于快速提取基因序列
```

### 文件建立索引

建立索引的目的是让JBrowse能够快速的找出目标位置的序列信息

#### fasta文件建立索引

使用samtools中的子程序`faidx`建立基因组索引，这样在JBrowse中就可以快速的导出指定片段的fasta序列信息

```bash
##使用软连接为了节省空间
ln -s /home/genome/Public/genome_Ghir.HAU/Ghirsutum_genome.fasta Ghirsutum_HZAU_V1.0
samtools faidx data/volvox.fa
```

配置文件`tracks.conf`，告诉JBrowse；基因组文件在哪里

```bash
[GENERAL]
refSeqs=Ghirsutum_HZAU_V1.0.fa.fai
[tracks.refseq]
urlTemplate=Ghirsutum_HZAU_V1.0.fa
storeClass=JBrowse/Store/SeqFeature/IndexedFasta
type=Sequence
```

#### gff文件索引

使用GFF3文件构建索引，在建立索引之前需要对GFF3文件进行排序，安装染色体和位置进行排序

```bash
##排序
 grep -v "^#" /home/genome/Public/genome_Ghir.HAU/Ghirsutum_gene_model.gff3 |sort -k1,1 -k4,4n >Ghirsutum_HZAU_V1.0_gene.gff3
```

在排序完成后进行压缩和建立索引；使用`tabix`软件进行；

> tabix安装参考 https://www.jianshu.com/p/b6f885fc8b5f

```bash
##压缩文件
../../software/tabix-0.2.6/bgzip  Ghirsutum_HZAU_V1.0_gene.gff3
##建立索引
../../software/tabix-0.2.6/tabix -p gff  Ghirsutum_HZAU_V1.0_gene.gff3.gz
```

在`tracks.conf`文件中添加配置信息

```bash
[tracks.genes]
urlTemplate=Ghirsutum_HZAU_V1.0_gene.gff3.gz
storeClass=JBrowse/Store/SeqFeature/GFF3Tabix
type=CanvasFeatures
```

#### BAM文件索引

BAM文件同样需要使用samtools按照染色体位置排好序，再建立索引；再JBrowse更新到`v1.15.0`版本后支持了CRAM格式文化，这种格式相比于BAM格式更加节省存储空间

JBrowse可以对BAM文件进行两种展示:

> 参考 BAM两种展示形式 https://jbrowse.org/docs/tutorial_classic.html#next-gen-read-track-types

+ set type = Alignments2  ；显示单个read的比对情况

+ type = SNPCoverage  ；显示某个区域read的覆盖情况

```bash
##对bam文件排序
samtools sort test.bam -O bam -o test_sort.bam
##构建索引
samtools index test_sort.bam
```

在`tracks.conf`文件中添加配置信息

```bash
[tracks.alignments]
urlTemplate=test_sort.bam
storeClass=JBrowse/Store/SeqFeature/BAM
type=Alignments2
```

#### 配置完成后的目录结构

```bash
##当前目录为 @//jbrowse/data
.
├── Ghirsutum_HZAU_V1.0.fa -> /home/genome/Public/genome_Ghir.HAU/Ghirsutum_genome.fasta
├── Ghirsutum_HZAU_V1.0.fa.fai
├── Ghirsutum_HZAU_V1.0_gene.gff3.gz
├── Ghirsutum_HZAU_V1.0_gene.gff3.gz.tbi
├── TM1_rmdup.bam
├── TM1_rmdup.bam.bai
└── tracks.conf

```

### 定制轨迹

#### 修改参考序列轨迹

> 参考修改 序列轨迹 https://jbrowse.org/docs/reference_sequence.html#reference-sequence-display-order

可以通过修改CSS来改变5种碱基 A T C G N显示的颜色

#### 修改 CanvasFeatures

使用` flatfile-to-json.pl`脚本进行转换

### 信号转发

现在访问http://cotton.hzau.edu.cn/tools/jbrowse/?data=data/Ghirsutum_genome_HAU_v1.1 就可以显示出内网中的JBrowse

由于我把JBrowse放在了内网机器上，于是需要使用外网机器的Appache将内网信号转发一下；在转发后客户端找不到对应的CSS和JS文件；于是使用`webpack`重新打包了一下源代码；查看了一下webpack的配置文件，发现可以通过配置环境变量`JBROWSE_PUBLIC_PATH`的值来控制打包后的资源检索URL

```bash
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: process.env.JBROWSE_PUBLIC_PATH || 'dist/'
    },
```

修改打包后的公共资源请求路径，打包后的文件会在`jbrowse/dist`目录下

> 如果没有yarn，使用npm进行全局安装 npm i yarn -g

```bash
export JBROWSE_PUBLIC_PATH=http://cotton.hzau.edu.cn/tools/jbrowse/dist/ ##bund.js请求路径
##重新进行编译 在目录@/jbrowse下
yarn build
```

修改`@/jbrowse/index.html`中资源路径；其实就加个转发路径就行

`sed -i 's/href=\"/href=\"\/tools\/jbrowse\//g' index.html `

`sed -i 's/src=\"/src=\"\/tools\/jbrowse\//g' index.html `

```bash
<link rel="icon" type="image/png" sizes="16x16" href="img/favicons/favicon-16x16.png">
##修改为转发后的网址
<link rel="icon" type="image/png" sizes="16x16" href="/tools/jbrowse/img/favicons/favicon-16x16.png">
```

### 效果展示

![效果图](https://s1.ax1x.com/2020/07/25/aSWG3q.png)

### 参考

1. [最全的JBrowse基因浏览器介绍](https://www.jianshu.com/p/e4a90aafc461)
2. 官方文档](https://jbrowse.org/docs/installation.html)