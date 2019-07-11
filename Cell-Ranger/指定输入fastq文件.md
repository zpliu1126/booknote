# Cell Ranger 使用手册

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



### 参数介绍

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

**加粗**

















