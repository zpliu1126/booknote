# Cell Ranger count使用手册

*** 当bcl的下机数据经过mkfastq分析之后得到的fastq1数据用于下游分析   ***

fastq文件的来源有很多例如

	+ mkfastq流程得到的fastq文件
	+ 公共数据库发表的SRA文件
	+ bamtofastqwenj等等



### 如果使用的是mkfastq得到的fastq文件目录结构

```linux
MKFASTQ_ID
|-- MAKE_FASTQS_CS
`-- outs
    |-- fastq_path
        |-- HFLC5BBXX
            |-- test_sample1
            |   |-- test_sample1_S1_L001_I1_001.fastq.gz
            |   |-- test_sample1_S1_L001_R1_001.fastq.gz
            |   |-- test_sample1_S1_L001_R2_001.fastq.gz
            |   |-- test_sample1_S1_L002_I1_001.fastq.gz
            |   |-- test_sample1_S1_L002_R1_001.fastq.gz
            |   |-- test_sample1_S1_L002_R2_001.fastq.gz
            |   |-- test_sample1_S1_L003_I1_001.fastq.gz
            |   |-- test_sample1_S1_L003_R1_001.fastq.gz
            |   `-- test_sample1_S1_L003_R2_001.fastq.gz
            |-- test_sample2
            |   |-- test_sample2_S2_L001_I1_001.fastq.gz
            |   |-- test_sample2_S2_L001_R1_001.fastq.gz
            |   |-- test_sample2_S2_L001_R2_001.fastq.gz
            |   |-- test_sample2_S2_L002_I1_001.fastq.gz
            |   |-- test_sample2_S2_L002_R1_001.fastq.gz
            |   |-- test_sample2_S2_L002_R2_001.fastq.gz
            |   |-- test_sample2_S2_L003_I1_001.fastq.gz
            |   |-- test_sample2_S2_L003_R1_001.fastq.gz
            |   `-- test_sample2_S2_L003_R2_001.fastq.gz
        |-- Reports
        |-- Stats
        |-- Undetermined_S0_L001_I1_001.fastq.gz
        ...
        `-- Undetermined_S0_L003_R2_001.fastq.gz
        
       
```

****



## Single Cell RNA-Seq 分析

### 输入fastq的参数介绍

- --fastqs 用于指定包含输入fastq文件的路径
- --sample 用于限制用于分析的样品
- --lane 用于限制芯片中的通道
- --indices 只在cellranger demux的输出类型中使用，例如--indices=SI-GA-A1只处理**SI-GA-A1**样品



### fastq文件命名规则

**[Sample Name]_S1_L00[Lane Number]_[Read Type]_001.fastq.gz **

+ 序列类型主要有

  + `I1`: Sample index read (optional)

  + `R1`: Read 1

  + `R2`: Read 2

### 实践

+ 数据来源于软件包自带的数据

  + 数据集中包含有bcl下机数据
  + mkfastq转换后的fastq数据
  + 参考基因组的数据

  

  

```linux
cellranger count --id=sampletest 
				--fastqs=/public/home/zpliu/software/cellranger-3.0.2/cellranger-tiny-fastq/3.0.0 
				--sample=tinygex --expect-cells=1000  
				--transcriptome=/public/home/zpliu/software/cellranger-3.0.2/cellranger-tiny-ref/3.0.0 
				--expect-cells=1000
```

### 一些参数的选择

+ **--localcores**：用于设置程序的核心数，不设置的话，默认是使用系统所能够使用的最多的核心
+ **--localmem** ：限制cellrange使用的内存数
+ **except-cells**：期望得到的细胞数目 默认是3000个，一般大家都设置1000
+ **--force-cells**：强制多少个细胞会通过cell detection algorithm算法；当这个条形码图与cell range结果不一致的时候
+ **--lanes**：限制某一个样品泳道进行分析
+ **--transcriptome=DIR**:指定参考基因组文件，用于比对和计算基因表达量的



### 定制reference目录

首先定制reference目录是需要基因组文件和对应的GTF文件的，**需要注意的是GTF和基因组中的染色体信息是要能够匹配的**

1. 过滤GTF文件

   ```bash
   cellrange mkgtf input.gtf output.gtf --attribute=键值对
   ```

   > 但是我感觉为的gtf文件里键值对没啥可以过滤的属性，这一步就可以直接忽略

​    2.定制reference

  ```bash
cellrange mkref 脚本将会对输入的基因组序列和gtf文件进行分析
  ```

+ #### 参数介绍

  + **--genome=**：指定输出的文件夹的名字
  + **--fasta**=：指定基因组序列的路径，如果有多个基因组可以使用这个参数多次
  + **--genes=** ：指定注释文件的路径，当指定了多个基因组的时候，也需要指定多个注释信息
  + **--nthreads**：指定线程的数目，默认是1个
  + **--memgb**：最大内存使用数目，默认是16Gb，这个参数必须要大于基因组文件的大小，不然肯定内存不足
  + **--ref-version**：指定版本信息，这个参数是可选的

+ 多个基因组的例子

  ```bash
  $ cellranger mkref --genome=hg19 --fasta=hg19.fa --genes=hg19-filtered-ensembl.gtf \
                     --genome=mm10 --fasta=mm10.fa --genes=mm10-filtered-ensembl.gtf
  ```

  

## Feature Barcoding technology分析

输出结果是几个barcode矩阵，其中包含了每个细胞的barcode和基因的表达信息

1. 首先程序从特征库文件中提取和校正barcode序列和UMI序列
2. 接着将这些barcode序列与声明的特征文件中的序列进行比对，最终得到每个特征码的数目

#### 参数说明

+ **libraries==CSV** :申明数据来源，在csv文件中需要有两中类型的fastq文件，一个是标准的gene expression reads另一个是Feature Reference reads文件；文件中声明
  + fastqs文件所在目录
  + 样品名称
  + 文库类型
  + 一种是标准的单细胞基因表达reads文库
    + 另外一种是特征barcoding reads文库就包括**Antibody Capture**、 **CRISPR Guide Capture** 
  
+ **--feature-ref=CSV** : 声明使用到的Barcode 试剂的类型
  + ID：给barcode指定编号，不要与基因名字冲突
  + name 
  + read：指明哪条序列包含了barcode信息，一般是**R2**
  + pattern：提取barcode的模式只有 **5P（^）**和**3P（$）**两种
  + sequence： 与barcode相关联的序列，一般是抗体序列或者sgRNA的原型间隔序列
  + feature_type： 与libraries中设置的文库类型是一致的
  + target_gene_id：是在CrisPR中用到的
  + target_gene_name









