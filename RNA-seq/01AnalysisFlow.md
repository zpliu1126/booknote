### RNA-seq基本分析流程



### 1.从NCBI下载原始数据

+ 多线程同时下载

  ```bash
  dataSRRID=(SRR8089897
  SRR8089896
  SRR8089895
  )
  
  for id in ${dataSRRID[@]};
  do 
  j=`echo ${id:0:6}`
  wget -c ftp://ftp-trace.ncbi.nih.gov/sra/sra-instant/reads/ByRun/sra/SRR/${j}/${id}/${id}.sra &
  
  done 
  
  ```

+ 检查数据大小

  ```bash
  ### 使用curl命令访问NCNI网页
  for i in `ls .|grep sra`; do j=`echo ${i:0:10}`; curl https://www.ncbi.nlm.nih.gov/sra/${j}|grep -E "<tbody><tr>.*</tr></tbody>" >>1 ; done
  ### 正则表达式将数据大小给匹配出来，之后网页内容可能会有所改变，正则表达式可能不固定
  sed 's/.*<tbody><tr>\(.*\)<\/tr><\/tbody>/\1/g' 1|sed 's/.*align=\"right\">\(.*\)<\/td><td>.*/\1/g' >2
  ### 与本地数据进行比较
  ls -lh|grep sra |paste  - 2 |less
  ```

+ 将sra文件转换成fastq文件

  ```bash
  dataSRRID=(SRR8089897
  SRR8089896
  SRR8089895
  )
  for i in ${dataSRRID[@]};
  do
  fastq-dump --split-3 ./rawdata/${i}.sra -O ./fast_dump/ &
  done
  ```

  

### 2.数据过滤 Trimmomatic

代码如下

```bash
java -jar  ~/software/Trimmomatic-0.39/trimmomatic-0.39.jar 
PE 
-threads 10 
R1.fastq.gz
R2.fastq.gz 
-baseout 输出文件目录/文件前称
ILLUMINACLIP:/public/home/zpliu/software/Trimmomatic-0.39/adapters/TruSeq3-PE-2.fa:2:30:10  LEADING:10 TRAILING:10 SLIDINGWINDOW:4:20 MINLEN:50

```

+ PE 指定过滤数据为双端测序
+ thread 使用10个线程
+ R1.fastq.gz/R2.fastq.gz 对应双端测序数据
+ baseout  后面接输出文件路径，以及输出文件的前缀
+ ILLUMINACLIP 指定测序接头的文件
+ LEADING 去除头部read质量低于10的序列
+ TRAILING 去除尾部质量低于10的read
+  SLIDINGWINDOW 按照4个碱基长度进行滑动，去除平均质量低于20的read
+ MINLEN 去除长度小于50的read

**写一个bash循环进行批量过滤原始数据**

```bash
for i in ${A2list[@]};do
{
A2b=${i/R1/R2}
A2d=${i/R1/}
java -jar  ~/software/Trimmomatic-0.39/trimmomatic-0.39.jar  PE  -threads 10 ${c}/A2/${i} ${c}/A2/${A2b} -baseout ${c}/A2_Trimmomatic/${A2d}  ILLUMINACLIP:/public/home/zpliu/software/Trimmomatic-0.39/adapters/TruSeq3-PE-2.fa:2:30:10  LEADING:10 TRAILING:10 SLIDINGWINDOW:4:20 MINLEN:50
} &
done
```

+ 可以写成多个for循环进行跑
+ `&`作用是将for循环放入后台，进行并行计算，**基本上100多G的数据 30分钟跑完**



2. 