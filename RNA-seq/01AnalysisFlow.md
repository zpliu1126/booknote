### RNA-seq基本分析流程

1. ### 数据过滤 Trimmomatic

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