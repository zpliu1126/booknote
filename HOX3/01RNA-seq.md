### 样本编号

无纤维材料: 1、3

短纤维材料: 6、7

转化材料: J668

### hisat2进行比对

> 版本:2.1.0

+ 比对质量大于30的read，认为是比对到基因组的唯一区域

```bash
Gh_indexfile='/data/cotton/zhenpingliu/genome/Hisat2Index/Ghirsutum_genome_HAU_v1.1/Ghirsutum_genome_HAU_v1'
all_fastq=`ls /public/home/zpliu/lib_family/saolei/F20FTSCCWLJ4479_LUDnktE/upload/Filter_SOAPnuke/Clean`
inputDir='/public/home/zpliu/lib_family/saolei/F20FTSCCWLJ4479_LUDnktE/upload/Filter_SOAPnuke/Clean'
outDir='/public/home/zpliu/lib_family/saolei/F20FTSCCWLJ4479_LUDnktE/upload/Filter_SOAPnuke/01hisat2'
for k in ${all_fastq[@]};
do
mkdir -p ${outDir}/${k}
hisat2 -x ${Gh_indexfile} -1 ${inputDir}/${k}/${k}_1.fq.gz -2 ${inputDir}/${k}/${k}_2.fq.gz  -p 10 --known-splicesite-infile  /data/cotton/zhenpingliu/genome/genome_data/Ghirsutum_genome_HAU_v1.1/hista_splice.txt  -S ${outDir}/${k}/${k}.sam && samtools view -q 30  -S ${outDir}/${k}/${k}.sam -@ 10 -b -o ${outDir}/${k}/${k}.bam && samtools sort -@ 10 ${outDir}/${k}/${k}.bam -O bam -o ${outDir}/${k}/${k}_sort.bam 
done
```

### Stringtie计算基因的表达水平和转录本的组装

> 版本 :v2.1.4

```bash

Gh_gff3='/data/cotton/zhenpingliu/genome/genome_data/Ghirsutum_genome_HAU_v1.1/Ghirsutum_gene_model.gff3'
all_bam=`ls /public/home/zpliu/lib_family/saolei/F20FTSCCWLJ4479_LUDnktE/upload/Filter_SOAPnuke/01hisat2/`
inputDir='/public/home/zpliu/lib_family/saolei/F20FTSCCWLJ4479_LUDnktE/upload/Filter_SOAPnuke/01hisat2'
outDir='/public/home/zpliu/lib_family/saolei/F20FTSCCWLJ4479_LUDnktE/upload/Filter_SOAPnuke/02geneExpress/'
for k in ${all_bam[@]};
do
mkdir -p ${outDir}/${k}
stringtie  ${inputDir}/${k}/${k}_sort.bam -G ${Gh_gff3} -A ${outDir}/${k}/${k}_gene_FPKM.txt -p 5  -B -o ${outDir}/${k}/${k}_assembled.gtf
done

```

### 转录本的merge

```bash
stringtie   --merge -G /data/cotton/zhenpingliu/genome/genome_data/Ghirsutum_genome_HAU_v1.1/Ghirsutum_gene_model.gff3 02geneExpress/1-1-1/1-1-1_assembled.gtf	02geneExpress/1-1-2/1-1-2_assembled.gtf	02geneExpress/1-3-1/1-3-1_assembled.gtf	02geneExpress/1-3-2/1-3-2_assembled.gtf	02geneExpress/1-5-1/1-5-1_assembled.gtf	02geneExpress/1-5-2/1-5-2_assembled.gtf	02geneExpress/3-1-1/3-1-1_assembled.gtf	02geneExpress/3-1-2/3-1-2_assembled.gtf	02geneExpress/3-3-1/3-3-1_assembled.gtf	02geneExpress/3-3-2/3-3-2_assembled.gtf	02geneExpress/3-5-1/3-5-1_assembled.gtf	02geneExpress/3-5-2/3-5-2_assembled.gtf	02geneExpress/6-1-1/6-1-1_assembled.gtf	02geneExpress/6-1-2/6-1-2_assembled.gtf	02geneExpress/6-3-1/6-3-1_assembled.gtf	02geneExpress/6-3-2/6-3-2_assembled.gtf	02geneExpress/6-5-1/6-5-1_assembled.gtf	02geneExpress/6-5-2/6-5-2_assembled.gtf	02geneExpress/7-1-1/7-1-1_assembled.gtf	02geneExpress/7-1-2/7-1-2_assembled.gtf	02geneExpress/7-3-1/7-3-1_assembled.gtf	02geneExpress/7-3-2/7-3-2_assembled.gtf	02geneExpress/7-5-1/7-5-1_assembled.gtf	02geneExpress/7-5-2/7-5-2_assembled.gtf	02geneExpress/J-1-1/J-1-1_assembled.gtf	02geneExpress/J-1-2/J-1-2_assembled.gtf	02geneExpress/J-3-1/J-3-1_assembled.gtf	02geneExpress/J-3-2/J-3-2_assembled.gtf	02geneExpress/J-5-1/J-5-1_assembled.gtf	02geneExpress/J-5-2/J-5-2_assembled.gtf -o 03IsoformMerge/merge.gtf
```

### 多个样本制作基因表达谱

使用pandas读取gene express 文件，合并不同样本的数据框得到表达谱

```python
import pandas as pd

filePath = '/public/home/zpliu/lib_family/saolei/F20FTSCCWLJ4479_LUDnktE/upload/Filter_SOAPnuke/02geneExpress/'

fileArray = ["1-1-1","1-1-2","1-3-1","1-3-2","1-5-1","1-5-2","3-1-1","3-1-2","3-3-1","3-3-2","3-5-1","3-5-2","6-1-1","6-1-2","6-3-1",
             "6-3-2","6-5-1","6-5-2","7-1-1","7-1-2","7-3-1","7-3-2","7-5-1","7-5-2","J-1-1","J-1-2","J-3-1","J-3-2","J-5-1","J-5-2"]
pandasDict={}
for item in fileArray:
    pandasDict[item]=pandasDict.get(item,pd.read_csv(filePath+item+"/"+item+"_gene_FPKM.txt",
                     sep="\t", header=0)).drop_duplicates(subset=['Gene ID'],keep='first') ##过滤存在重复基因编号的行
    pandasDict[item]= pandasDict[item][['Gene ID','FPKM']] ##只筛选gene ID 和FPKM的两列
    pandasDict[item]= pandasDict[item].set_index('Gene ID') ## 更改行名
##对所有的表达量文件，按行交集
outFrame=pd.concat([item[1] for item in pandasDict.items()],axis=1, join='inner')
##更改列名
outFrame.columns=[item[0] for item in pandasDict.items()]
##筛选指定行
outFrame=outFrame.loc[[i for i in outFrame.index if i.startswith("Ghir")]]
##输出表达谱文件
outFrame.to_csv(filePath+'AllSample_30_FPKM_AllStage.txt', index=True, header=True,sep="\t") ##写入文件

```

更加快速的方法，使用`Ballgown`,读取所有样本的Stringtie的输出文件夹，在使用

` gene_expression=gexpr(bg)`获取表达矩阵

### 提取novel junction

```bash
hisat2_extract_splice_sites.py merge.gtf >all_junction.txt
cat reference_junction.txt all_junction.txt|sort -k1,1 -k2,3n |uniq -u >novel_junction.txt 
```





