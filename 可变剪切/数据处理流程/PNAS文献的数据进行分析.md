# HIN1下游调控基因的分析

在压力调节下，HIN1基因能够促进下游一些基因IR的效率，同时结合到**GAAGAA**motif基序上，看看棉花中这些被调控的基因这种情况是否存在。

```bash
## 根据拟南芥的基因去找对应的同源基因
直接使用注释文件的信息
## 获取IR事件中基因对应的正负连的信息
awk -F "\t" '$3~/IntronR/{print $0}' splice.txt |cut -f2|xargs  -I {} grep {} ~/genome_data/Ghirsutum_genome_HAU_v1.1/Ghirsutum_gene_model.gff3  |awk -F "\t" '$3~/gene/{print $7"\n"$7}' >stander
## 产生bed文件用于提取对应的序列来获取基因序列，文章用的是正负50bp，先试一下
awk -F "\t" '$3~/IntronR/{print $0}' splice.txt |awk -F "\t" '{printf $1"\t"$4-200"\t"$4-1"\t"$2"_"NR"_L\n";printf $1"\t"$5+1"\t"$5+200"\t"$2"_"NR"_R\n"}'|paste - stander|awk '{print $1,$2,$3,$5,$4}' OFS="\t" >stress.bed

```

