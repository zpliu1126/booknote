

## 1.软件安装

### 1.1使用conda安装`gtfToGenePred`软件

给conda添加下载channels

```bash
conda config --add channels defaults
conda config --add channels bioconda
conda config --add channels conda-forge
```

下载`gtfToGenePred`

```bash
conda install ucsc-gtftogenepred
conda update ucsc-gtftogenepred
```

usage

```bash
gtgtfToGenePred -genePredExt Gbarbadense_gene_model.gtf  Gbarbadense_gene_model.PredfToGenePred Gbarbadense_gene_model.gtf Gbarbadense_refGene.txt
```



## annovar 注释

1. 将参考基因组文件转换格式

+ `--format`指定要转换的格式
+ `--seqfile`后面接参考基因组序列文件
+ `--outfile`输出文件名

`Gbarbadense_gene_model.Pred`文件为`gtgtfToGenePred`软件生成的文件

```bash
module load annovar
retrieve_seq_from_fasta.pl --format refGene --seqfile Gbarbadense_genome_HAU_v2.0.fasta Gbarbadense_gene_model.Pred --outfile Gbarbadense_refGEneMrna.fa
```

2. 将vcf文件转换为annovar格式

   > 6G的vcf文件大概跑了

```bash
convert2annovar.pl --includeinfo --allsample  --withfreq --format vcf4 ./../Gbarbadense_genome.snp.filter.recode.vcf >Gbarbadence.avinput
```

3. ` table_annovar.pl`进行注释

   gtf转换后的文件和基因序列转换后的文件都要放在`Gbarbadense/`目录下

   + `--protocol`指定数据库类型
   + `--operation`注释类型 `g、r、f`分别只按照`基因、region、filter`进行注释，对应的数据库`--protocol`参数也有指明
   + `--thread`线程数
   + `--maxgenethread`当线程数超过6时，需要声明，不然最多就是6个线程在跑
   + ` --outfile `输出文件前缀

   

   ```bash
   table_annovar.pl --maxgenethread 10  --thread 10  Gbarbadense.avinput  Gbarbadense/ -buildver Gbarbadense --outfile Gbarbadense_annovar --protocol refGene,refGene,refGene --operation g,r,f
   ```

   只对基因区域进行SNP的注释

   ```bash
   table_annovar.pl --maxgenethread 10  --thread 10  Gbarbadense.avinput  Gbarbadense/ -buildver Gbarbadense --outfile Gbarbadense_annovar --protocol refGene --operation g
   ```

   

4. 最终生成文件

   由于`--protocol`参数我用的都是`refGene`数据库类型，所以`region、fileter`模式的注释应该都有问题；没放出来

   ```bash
   ├── Gbarbadense_annovar.refGene.exonic_variant_function
   ├── Gbarbadense_annovar.refGene.invalid_input
   ├── Gbarbadense_annovar.refGene.log
   ├── Gbarbadense_annovar.refGene.variant_function
   ```

   

### 参考

1.  非人类https://blog.csdn.net/u013816205/article/details/51262289 
2.  非人类https://blog.csdn.net/g863402758/article/details/75304391 
3.  [https://anjingwd.github.io/AnJingwd.github.io/2018/01/20/ANNOVAR%E8%BF%9B%E8%A1%8C%E7%AA%81%E5%8F%98%E6%B3%A8%E9%87%8A/](https://anjingwd.github.io/AnJingwd.github.io/2018/01/20/ANNOVAR进行突变注释/) 
4. gtfTogGenePred安装  https://bioconda.github.io/recipes/ucsc-gtftogenepred/README.html 