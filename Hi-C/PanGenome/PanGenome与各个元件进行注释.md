###  对结果进行去重

![JGG9Bt.png](https://s1.ax1x.com/2020/04/21/JGG9Bt.png)



```bash
bsub -q "high" -R span[hosts=1] -e test.err -o test.out -J uniq -n 1 "python ~/scripte/Alternative/module/uniq.py  Gb_reference_noreference_gene_promter.txt  111"
```

### 提取intergenetic区域坐标

```bash
##算出 promoter+genebody+dowmStream坐标
cat gffFile|awk -F ";" '{print $1}'|awk -F "\t" '$3~/gene/&&$7=="-"{
	if($4>2000){
	print $1,$4-2000,$5+3000,$9;
	}else{
	print $1,1,$5+3000,$9;
	}
}$3~/gene/&&$7=="+"{
	if($4>3000){
	print $1,$4-3000,$5+2000,$9;
	}else{
	print $1,1,$5+2000,$9;
	}
}'  OFS="\t" 

## 求出所有染色体的Bed
awk 'NR==1&&$1~/^>/{print $0}NR>=2&&$1~/^>/{print "\n"$0}$1~/^[^>]/{printf $0}' ~/genome_data/Ghirsutum_genome_HAU_v1.1/Ghirsutum_genome.fasta|awk '$1~/^>/{printf $0"\t0\t"}$1~/^[^>]/{print length($0)}' >chromsome.bed
## 减去
~/software/bedtools2-2.29.0/bin/subtractBed -a chromosome_length.bed  -b geneBody.bed  >111
```

### 提取Promoter区域坐标

```bash
awk -F ";" '{print $1}' ../../Ghirsutum_gene_model.gff3|awk -F "\t" '$3~/gene/&&$7=="-"{print $1,$5+1,$5+3000,$9}$3~/gene/&&$7=="+"{if($4>3000){print $1,$4-3000,$4-1,$9}else{print $1,1,$4-1,$9}}' OFS="\t" |sed 's/ID=//g' >gene_promter.bed
```



### 提取UTR区域坐标

```bash
## 5utr
cat gffFil|awk -F ";" '{print $1}'|awk '$3~/five_prime_UTR/{print $1,$4,$5,$9}' OFS="\t" |sort|uniq >5UTR.bed

##3 utr
cat gffFil|awk -F ";" '{print $1}'|awk '$3~/three_prime_UTR/{print $1,$4,$5,$9}' OFS="\t" |sort|uniq >3UTR.bed
```



### 提取基因下游2kb区域坐标

```bash
awk -F ";" '{print $1}' ../../Ghirsutum_gene_model.gff3|awk -F "\t" '$3~/gene/&&$7=="+"{print $1,$5+1,$5+2000,$9}$3~/gene/&&$7=="-"{if($4>2000){print $1,$4-2000,$4-1,$9}else{print $1,1,$4-1,$9}}' OFS="\t" |sed 's/ID=//g' >downStream.bed
```



### 提取Exon区域坐标

```bash
cat gffFil|awk -F ";" '{print $1}'|awk '$3~/exon/{print $1,$4,$5,$9}' OFS="\t" |sort|uniq >exon.bed
```

### 提取intron区域坐标

```bash
awk '{print $1,$2+2,$3,$4}' OFS="\t" hista_splice.txt >intron.bed
```



## 进行注释

```bash
#外显子区域
~/software/bedtools2-2.29.0/bin/intersectBed -a genomeFeature/exon.bed  -b ${genome} -wb >intersect/exon_intersect.out
#内含子区域
~/software/bedtools2-2.29.0/bin/intersectBed -a genomeFeature/intron.bed -b ${genome} -wb >intersect/intron_intersect.out
#UTR区域
 ~/software/bedtools2-2.29.0/bin/intersectBed -a genomeFeature/5UTR.bed -b ${genome} -wb >intersect/5UTR_intersect.out
  ~/software/bedtools2-2.29.0/bin/intersectBed -a genomeFeature/3UTR.bed -b ${genome} -wb >intersect/3UTR_intersect.out
##promter区域
~/software/bedtools2-2.29.0/bin/intersectBed -a genomeFeature/gene_promter.bed -b ${genome} -wb >intersect/promter_interect.out
##下游区域
 ~/software/bedtools2-2.29.0/bin/intersectBed -a genomeFeature/downStream.bed -b ${genome} -wb >intersect/downStream_intersect.out
##intergenetic区域
~/software/bedtools2-2.29.0/bin/intersectBed -a genomeFeature/intergenetic.bed  -b ${genome} -wb >intersect/intergenetic_intersect.out
```

### 统计每种长度

````bash
##交集结果
for i in `ls ./`; do printf ${i}"\t" ;awk '{if($NF>$(NF-1)){
a+=$NF-$(NF-1)
}else{
a+=$(NF-1)-$NF
}}END{print a}' ${i}; done
## genomic结果
for i in `ls ./`; do printf ${i}"\t" ;awk '{a+=$3-$2}END{print a}' ${i}; done
````

### 表格统计

1.统计比对到基因组上的片段数目

2.比对到基因组上片段的总长度

3.N50长度

```bash
#
genome=Gb_reference_noreference.bed

#比对上片段数目
 cut -f4 ${genome} |sort |uniq|wc -l

#总长度
#统计所有比对上的ctg的长度信息
awk 'NR==1&&$1~/^>/{print $0}NR>=2&&$1~/^>/{print "\n"$0}$1~/^[^>]/{printf $0}' /public/home/cotton/public_data/PAN_Final/GhPAN/Gh.final.1k.fa|awk '$1~/^>/{printf $0"\t0\t"}$1~/^[^>]/{print length($0)}' >ctg.bed
cut -f4 Gb_reference_noreference.bed |sort |uniq|cat - ctg.bed |sort -k1 |awk '$2!=0{print "0\t0\t"$1}$2==0{print $2"\t"$3"\t"$1}'|sort -k3 -k2nr|uniq -f2 -d >align_ctg.bed
awk '{a+=$2}END{print a}'  align_ctg.bed 
##N50长度


```



1. 包含非参考基因的ctg数目
2. 包含的非参考基因数

```bash
## 提取非参考基因bed文件
awk '$3~/gene/{print $1,$4,$5,$9}' OFS="\t" GhnonRef.gene.gff3 
## 提取非参考基因中比对上的ctg 文件
cut -f4,5,6 ../Gh_reference_noreference.bed >align_ctg.bed
##取交集
~/software/bedtools2-2.29.0/bin/intersectBed  -a noreference.bed  -b align_ctg.bed  -wb >1111
## 比对到的ctg数目
awk -F "\t" '{print $(NF-2)}' 1111 |sort |uniq |wc -l
## 包含的非参考基因数目
cut -f4 1111 |sort |uniq |wc -l	
```

1. 与参考基因组有交集的序列数目
2. 与参考基因组intergenic区域有交集的序列数目
3. 与参考基因组中TEs交集的数目

```bash
~/software/bedtools2-2.29.0/bin/intersectBed  -a gene.bed  -b Gh_reference_noreference.bed  -wb >intersect/gene_intersect.out
## 交集的ctg数目
awk -F "\t" '{print $(NF-2)}' geen_intersect.out|sort |uniq |wc -l
##提取TEs bed文件
awk '{print $1,$4,$5,$9}' OFS="\t" ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Ghirsutum_genome_repeat.gff3 
~/software/bedtools2-2.29.0/bin/intersectBed  -a TE.bed  -b Gh_reference_noreference.bed  -wa
## 比对到TE的长度
cat TES_intersect.bed |sort |uniq | awk '{a+=$3-$2}END{print a}'
## TE总长度
awk '{a+=$3-$2}END{print a}' ../genomeFeature/TEs.bed
```

### 没有比对到参考基因组的ctg

```bash
awk '{print $3,$1,$2}' OFS="\t" align_ctg.bed|cat - ctg.bed |sort |uniq -u  >unalign.bed
awk '{a+=$3}END{print a}'  
## 统计这些ctg包含了基因
~/software/bedtools2-2.29.0/bin/intersectBed  -a noreference.bed  -b ../unalign.bed  -wb >1111
awk -F "\t" '{print $(NF-2)}' 1111|sort |uniq |wc -l
##包含的基因数
cut -f4 1111|sort |uniq|wc -l
```





