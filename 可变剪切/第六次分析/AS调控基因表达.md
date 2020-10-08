### Isoform保守性分析

>根据EMBOSS对每个isoform预测得到的最长的那个CDS作为isoform的CDS序列；使用pfamScan去搜索CDS序列中的蛋白质保守结构域

PacBio isoform只分析那些比对到基因区域的isoform；对于比对到基因区域的转录本后续不进行分析了

#### 使用PfamScan预测转录本的蛋白质保守结构域

> 参考 https://www.jianshu.com/p/9cf40d0d8bf5
>
> https://www.jianshu.com/p/47b8f22f9998
>
> 数据库下载地址：
>
> ftp://ftp.ebi.ac.uk/pub/databases/Pfam/releases/
>
> 1. active_site.dat.gz
> 2. Pfam-A.hmm.dat.gz
> 3. Pfam-A.hmm.gz
> 4. 

```bash

##加载HMMER和PfamScan
module load HMMER/3.3
##使用HMMER构建库
hmmpress  Pfam-A.hmm
## 使用conda安装PfamScan
conda create -n pfam_scan 
conda activate pfam_scan
conda install pfam_scan
##对蛋白质结构域进行预测
pfam_scan.pl   -dir ~/Pfam/  -e_seq 1e-3 -e_dom 1e-3  -fasta PacBio_CDS.fa -outfile 111 -cpu 20
```

**使用Blast对CDS序列进行比对**

```bash
##进行all-vs-all blastp
cat ../collapse/PacBio_CDS.fa  ../collapse/TM1_CDS.fa >isoform_CDS.fa
##建库
makeblastdb  -in isoform_CDS.fa  -dbtype prot -out CDS
##进行比对
blastp -query isoform_CDS.fa  -db ./CDS -outfmt '6  qseqid sseqid qstart qend sstart send nident pident qcovs evalue bitscore'  -out test.blast -evalue 1e-5 -num_threads 10
```

保守的isoform定义：

+ blastp结果相似度大于90%
+ 所有预测的蛋白质保守结构域都相同

### 1.同一个基因组内PacBio转录本与参考转录本保守性分析

> 通过将PacBio与参考基因组的转录本，在蛋白结构域、CDS相似度上的比较；可以判断这个isoform是否与参考基因存在一样的功能。
>
> + isofrom与参考基因转录本具有相同的蛋白保守结构域
> + isoform比参考基因组转录本多鉴定出蛋白质结构域
> + isoform比参考基因组转录本少鉴定出蛋白质结构域
> + isoform和参考基因组都没有预测到保守的蛋白质结构域
> + 有些PacBio转录本没有相似度大于90%的参考转录本

综合blastp相似度的结果和PfanScan预测的结果，可以得出有多少isoform在功能上是没有发生改变的，即使它们的剪切方式存在一定的差异；有多少的isoform的功能发生了改变；并且这种改变有多少比例是由于AS造成的

为了将PacBio转录本与参考转录本进行比较，需要构造所有基因的参考转录本信息

```bash
awk 'NR==1&&$1~/^>/{print $0}NR>=2&&$1~/^>/{print "\n"$0}$1~/^[^>]/{printf $0}' ../collapse/D5_CDS.fa  |awk '$1~/^>/{printf substr($0,2,16)"\t"substr($0,2)"\t"}$1~/^[^>]/{print 3*length($0)}'  >D5_reference_isoform.txt
##所有基因的二元表
cut -f1 reference_isoform.txt |awk '{print $1"\t"$1}' >all_D5_gene.txt

##将PacBio 分别与每个参考转录本进行比较
python ~/github/zpliuCode/script/genestruct/conserveIsoform.py  -homolog all_D5_gene.txt  -APfam test2_domain.txt  -BPfam test1_domain.txt  -blast PacBio_vs_reference.blast  -Aisoform PacBio_isoform_gene.txt  -Bisoform D5_reference_isoform.txt -o ./1111
```

> PacBio转录本与参考转录本可能存在相似的功能
>
> + 存在完全相同的蛋白结构域
> + 两者都没有预测到结构与，CDS序列长度相同
>
> 可能存在相同功能的转录本：
>
> 1. cDNA序列长度是否一致，用于分析转录后的剪切会不会影响蛋白结构域
>
> PacBio与参考转录本的蛋白结构域存在差异
>
> + 结构域数据减少
> + 结构域数目变多
> + 结构域完全发生了变化
>
> PacBio转录本与参考转录本都没有预测到结构域
>
> > 数据库中包含的信息不够完整

```bash
##结构域完全相同的转录本
awk '$4==$8&&$4!="None"{print $0}' isoform_vs_reference_proteinDomain.txt |cut -f1|sort |uniq |wc -l
##都没预测到结构域，但是CDS序列长度相同
awk '$4==$8&&$4=="None"&&$2==$6{print $0}'  isoform_vs_reference_proteinDomain.txt |cut -f1|sort |uniq |wc -l
##先把这些差异的转录本找出来，再看是这些转录本与参考转录本的差异分类
awk '{if($4==$8){a[$1]+=1}else{a[$1]+=0}}END{for(i in a){print i"\t"a[i]}}' isoform_vs_reference_proteinDomain.txt |awk '$2==0{print $0}' >noconserveDomain_isofrom.txt
python ~/work/Alternative/result/Gh_result/CO31_32_result/ORF/AddAnnotionTag.py noconserveDomain_isofrom.txt isoform_vs_reference_proteinDomain.txt  11

##与参考转录本相比结构域变少了

##与参考转录本相比结构域增加了

##与参考转录本相比都没有预测到保守的domain，并且CDS长度不相同


```

A2中PacBio转录本的注释情况

> A2中总共有67113个isoform















D5中PacBio转录本的注释情况

> D5中总共有51964个比对到基因区域的isoform





TM1中PacBio转录本的注释情况

> TM1中总共有83392个比对到基因区域



### 2.不同基因组间PacBio转录本的保守性分析

> 比较两个同源基因将PacBio转录本是否存在保守的蛋白结构域

同源基因间PacBio isofrom进行blastp

```bash

```



















isoform ratio发生改变，与之对应的AS event

用数字衡量isoform ratio改变的程度

鉴定不同基因组间差异的isoform，然后用软件预测对应的蛋白质结构域；分析蛋白质功能是否发生改变