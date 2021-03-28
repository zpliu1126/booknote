### 	RNA-seq基本分析流程



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

### 3.将数据比对到参考基因组

+ 构建参考基因组索引'

  接收基因组fasta序列文件，和索引生成路径及索引前称

  ```bash
  echo "Ghirsutum_genome_HAU_v1 begin build"
  hisat2-build /public/home/zpliu/genome_data/genome_Ghitsutum_NAU/genome.Ghir.NAU.fa  ./genome_Ghitsutum_NAU/Ghitsutum 
  
  ```

+ 进行比对

  + `--fr`链特异性建库
  + `--rf`普通建库
  
  ```bash
  Gh_indexfile='/public/home/zpliu/Hisat2Index/Ghirsutum_genome_HAU_v1.1/Ghirsutum_genome_HAU_v1'
  Gh_hisatout="./hisat2out/"
  all_fastq=`ls ./Trimmomatic|grep "_1P"`
  
  for i in ${all_fastq[@]};
  do
  j=`echo ${i}|sed 's/_1P/_2P/g'`
  k=`echo ${i}|sed 's/_1P//g'`
  hisat2 -x ${Gh_indexfile} -1 ./Trimmomatic/${i} -2 ./Trimmomatic/${j}  -p 10 --known-splicesite-infile  /public/home/zpliu/genome_data/Ghirsutum_genome_HAU_v1.1/hista_splice.txt -S ./hisat2out/${k}.sam && samtools view -S ./hisat2out/${k}.sam -@ 10 -b -o ./hisat2out/${k}.bam && samtools sort -@ 10 ./hisat2out/${k}.bam -O bam -o ./hisat2out/${k}_sort.bam 
  done
  ```




### 4.计算基因表达量

将比对好的sam文件按照染色体位置进行排序后，使用stringtie比对

```bash
Gh_gff="/public/home/zpliu/genome_data/Ghirsutum_genome_HAU_v1.1/Ghirsutum_gene_model.gff3"

for i in `ls ./hisat2out`;
do
j=`echo ${i}|sed 's/_.*//g'`
stringtie ./hisat2out/${i} -G ${Gh_gff} -e -p 10 -A ./stringtie/${j}
done
```



### 合并多个组织的表达量

```bash
# 构造字典文件
sed 's/^/[/g' 111 |sed 's/$/]=/g'|paste - 22 |sed 's/\t//g' >end
/*
[SRR8090044]=TM1_10DPA_Fiber_1
[SRR8090041]=TM1_10DPA_Fiber_2
[SRR8090042]=TM1_10DPA_Fiber_3
[SRR8090046]=TM1_15DPA_Fiber_1
[SRR8090049]=TM1_15DPA_Fiber_2
[SRR8090050]=TM1_15DPA_Fiber_3
[SRR8090004]=TM1_20DPA_Fiber_1
[SRR8090007]=TM1_20DPA_Fiber_2
[SRR8090006]=TM1_20DPA_Fiber_3
[SRR8090010]=TM1_25DPA_Fiber_1
*/
declare -A sample
sample=(end文件中的内容)
# 对每个样本的数据盖头换面
sort SRR8090089|cut -f 8|sed '1d'|awk 'BEGIN{print "'$a'"}{print $0}'|less
#SRR数组可以按照一定顺序输出
SRR=(SRR8090087 SRR8090088)
# 使用字典批量,这里由于每个生成文件中基因数目不一致，先提取共有的基因存进geneid里，并行运算
for i in ${SRR[@]};
do { 
cat geneid|xargs -I {} grep {} $i |cut -f 8|awk 'BEGIN{print "'${sample[$i]}'"}{print $0}' >${i}_tmp; } &
done

```

#### 手动计算指定区域的表达量

链特异性建库 

>https://www.cnblogs.com/renping/p/7875744.html

> 使用samtools 计算目标区域的表达量
>
> 参考 : https://www.omicsclass.com/article/416



tview能直观的显示出reads比对基因组的情况，和基因组浏览器有点类似。

需要事先利用利用上面讲的sort和建index命令执行完后，用下述命令。

Usage: samtools tview <aln.bam> [ref.fasta]

```bash
samtools tview -p Gbar_A07:41137452  align_sorted.bam genome.fa
```

出参考基因组的时候，会在第一排显示参考基因组的序列，否则，第一排全用N表示。
按下 g ，则提示输入要到达基因组的某一个位点。例子“scaffold_10:1000"表示到达第
10号scaffold的第1000个碱基位点处。
使用H(左）J（上）K（下）L（右）移动显示界面。大写字母移动快，小写字母移动慢。
使用空格建向左快速移动（和 L 类似），使用Backspace键向左快速移动（和 H 类似）。
Ctrl+H 向左移动1kb碱基距离； Ctrl+L 向右移动1kb碱基距离
可以用颜色标注比对质量，碱基质量，核苷酸等。30～40的碱基质量或比对质量使用白色表示；
20～30黄色；10～20绿色；0～10蓝色。
使用点号'.'切换显示碱基和点号；使用r切换显示read name等
还有很多其它的使用说明，具体按 ？ 键来查看。

```bash
结果说明：
“.” 比对到正链;
“，” 表示比对到负链;
“<”或“>” 表示reference skip   RNA-seq当中内含子剪切;
"ATCGN"  表示正向mismatch;
"atcgn"  表示反向mismatch;
‘+[0-9]+[ACGTNacgtn]+’ insertion;
‘-[0-9]+[ACGTNacgtn]+’ 表示deletion;
“^”标记reads起始;
“$”标记reads segment结尾;
```

计算某个区域paired read数目

```bash
##提取对应区域的bam文件
samtools view  -O BAM  align_sorted.bam Gbar_A07:41137452-41138228 >Gbar_A07G016470.bam
##按照read名字排序后，转成bed文件
samtools sort -n Gbar_A07G016470.bam -O BAM -o Gbar_A07G016470_sortReadName.bam 
##提取对应的bed文件
bamToBed Gbar_A07G016470_sortReadName.bam   -bedpe -mate1 >11.bed
#如果不存在成对比对的read，则会跳过当前read
其中最后两列表示insert 片段中read1 和read1比对到的链
+ RNA信息是非模板链（基因所在链的信息）
+ 反转录得到cDNA（模板链上的信息）
+ 经过dTUP处理后保留的是非模板链的信息
+ 再经过合成后read保留的就是模板链的信息
一般read1与基因的方向是相反的，而read2与基因方向是相同的
##区分基因组不同位置，正负链上比对到的read数目
+ 首先筛选比对质量大于20的read，且是成对的read
```

```bash
##获取read比对到基因组的正负链以及坐标
awk '$1!="."&&$8>=20{print $0}' 11.bed |awk '$10=="-"{print $1"\t"$2"\t"$6"\t"$10"\t"$7}$10=="+"{print $1"\t"$5"\t"$3"\t"$10"\t"$7}' >readcount.txt
##与基因坐标取交集
intersectBed -loj -a gene_1.bed  -b readcount.txt |awk '$7=="+"{a[$2][1]+=1}$7=="-"{a[$2][2]+=1}$7=="."{a[$2][1]=0;a[$2][2]=0}END{for(i in a){print $1"\t"i"\t"a[i][1]"\t+\n"$1"\t"i"\t"a[i][2]"\t-"}}'|awk -F "\t" '$3==""{print $1"\t"$2"\t0\t"$4}$3!=""{print $0}'|sort -k2,2n  >read_align_gene.txt 
```

### 使用脚本计算某区域的read比对情况

脚本只支持链特异性建库的bam文件

> Bam Flag :https://blog.csdn.net/xcaryyz/article/details/79257327
>
> https://broadinstitute.github.io/picard/explain-flags.html

```bash
##提取某个基因组区域比对到的read数目
python /public/home/zpliu/github/jupyter/ResearchProject/fiber-DRGE/script/sQTL/lncRNA_quality.py BamFile outFile sampleName Ghir_A07:42970060-42970318:+
```



