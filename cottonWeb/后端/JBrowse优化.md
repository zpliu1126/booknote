## 优化JBrowse

JBrowse的基本框架已经搭建好了，接下来就是使用它和sequenceServer以及配合数据库进行使用；前面那个教程是手动的配置索引文件，同样可以使用JBrowse自带的脚本进行配置；脚本运行的目录为`@/Jbrowse`，运行后将会在当前目录生成一个data文件夹

#### 使用自带脚本进行格式化

脚本运行后将会

#### 1.参考基因组文件

> 报错缺失对应的包，`Can't locate Digest/Crc32.pm in @INC `在网站下载后搬到那个目录就行

```bash
wget -c https://metacpan.org/raw/FAYS/Digest-Crc32-0.01/Crc32.pm?download=1
mkdir Digest
mv Crc32.pm  Digest/
##构建索引
./bin/prepare-refseqs.pl  --fasta ./Ghirsutum_HZAU_V1.1.fa --out Ghirsutum_genome_HAU_v1.1
```

修改对应的data目录下的trackList.json文件，进行配置

#### 2.GFF3文件

同样的报错，下载对应的包，有个包很奇怪得用root使用`cpanm`重头编译

+ `--trackLabel` json文件中对应字段的值，最终将会在`tracks`目录下生成对应的文件名

```bash
./bin//flatfile-to-json.pl  -gff ~/zpliu/sequenceServer/genomeData/Ghirsutum_genome_HAU_v1.1/Ghirsutum_gene_model.gff3  --trackType CanvasFeatures --compress --trackLabel Gene_annotion --out 指定输出目录
```

修改一下`json`文件中对应的分类和名称

+ 设置成`HTMLFeatures`类型的话会更加方便点击

```json
      {
         "compress" : 1,
                 "category" : "Feature annotion",
         "key" : "Gene_annotion",
         "label" : "Gene_annotion",
         "storeClass" : "JBrowse/Store/SeqFeature/NCList",
         "style" : {
            "className" : "feature"
         },
         "trackType" : "CanvasFeatures",
         "type" : "CanvasFeatures",
         "urlTemplate" : "tracks/gff3/{refseq}/trackData.jsonz"
      }
```

#### 3.BAM文件的JSON配置文件

```json
    {
      "category": "RNA-seq",
      "storeClass": "JBrowse/Store/SeqFeature/BAM",
      "urlTemplate": "./BAM/TM1_rmdup.bam",
      "type": "JBrowse/View/Track/Alignments2",
      "key": "leaf_SRR5886147"
    }
```

#### 4.配置BigWig文件

> 文件说明 ：https://www.cnblogs.com/djx571/p/12110883.html
>
> https://www.plob.org/article/9505.html
>
> 配置参考: http://jbrowse.org/docs/tutorial_classic.html#quantitative-tracks-bigwig-and-wiggle

这个文件就是由BAM文件或者BED文件经过转换压缩后的二进制文件，能够直接在UCSC或者JBrowse文件中使用；在JBrowse中配置BigWig文件和配置BAM文件的流程差不多，这里不多做赘述。

### 建feature 索引 Index Names

在JBrowse加载后，为了能够实现对name或者geneID的搜索功能；就必须使用脚本将这些name和ID给建立索引；当有添加了新的feature时，就需要再运行一次`bin/generate-names.pl`

+ ` --out`输出目录
+ ` --tracks`对应的轨迹，多个轨迹之间用逗号隔开

```bash
##给gene注释建立索引，运行目录为@/data/Ghirsutum_genome_HAU_v1.1
../../bin/generate-names.pl  --out ./ -v  --tracks Gene_annotion
```

