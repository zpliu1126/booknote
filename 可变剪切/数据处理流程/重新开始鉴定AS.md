# 重新开始鉴定AS.md

之前是分别使用对应的三代测序数据比对到各自的参考基因组，现在考虑用三代的测序数据分别比对对各自的亚基因组上。

```bash
## 将四倍体基因组分层At和DT进行比对，由于Scaffold没法区分A、D就不要了
grep Ghir_A -A1 Ghirsutum_genome_HAU_v1.0_another.fasta > At.fasta
grep Ghir_D -A1 Ghirsutum_genome_HAU_v1.0_another.fasta > Dt.fasta
## gmap 构建索引
/public/home/zpliu/software/gmap-2019-09-12/bin/gmap_build  -D /public/home/zpliu/work/Alternative/data/gmap_build -d Ghirsutum_Dt  /public/home/zpliu/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Dt.fasta &
## gmap进行比对
cat ./all.collapsed.rep.fa|~/software/gmap-2019-09-12/bin/gmap -D ~/work/Alternative/data/gmap_build/Ghirsutum_At/   -d  Ghirsutum_At   -f 3 -t 10 -n 1 --min-trimmed-coverage=0.85 --min-identity=0.85 -p 1 -e   >A2_At.gtf
## alternative_splice.py进行鉴定
/usr/bin/python ~/software/pipeline-for-isoseq/other/alternative_splice.py -i ./D5_Dt.gff -g ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Ghirsutum_gene_model_motify_Dt.gtf  -f ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Dt.fasta  -as -ats T -os -t exon -o ./alter_ten -op
```

通过比较发现，如果真的是很保守的事件的话，他们的长度也是很保守的。对于那些长度摆动的先不管，用gmap来比对然后确定在对于同源基因上的位置。

```bash
## 将保守的IR事件，提取在对于基因组上的坐标


##不保守的事件在其他基因组的坐标使用gmap来获取
```



### 对于AltA、AltD进行同样的操作

```bash
## 从剪切文件中获取对应的AltA、AltD事件坐标和长度
awk '$3=="AltA"{print $0}' end_third|paste AltA_stand  -|awk '{print $2"\t"$5"\t"$6"\t"$1"\t"$3"\t-\t-\t-\t"$6-$5+1}' >AltA_static.txt 
awk '$3=="AltD"{print $0}' end_third|paste AltD_stand  -|awk '{print $2"\t"$5"\t"$6"\t"$1"\t"$3"\t-\t-\t-\t"$6-$5+1}' >AltD_static.txt 
```



#### 对各种剪切事件在进化上进行分类

```bash
## 全都保守的
python ../../script_category/AS_all_converse.py  ../homoloe_AltA.txt  ../../../GhDt_Gr_GhAt_Ga_end_noScaffold  all_converse_AltA.txt 
## 祖先和后代保守
python ../../script_category/As_At_A2_converse.py  ../homoloe_AltA.txt  ../../../GhDt_Gr_GhAt_Ga_end_noScaffold At_A2_converse_AltA.txt
python ../../script_category/AS_Dt_D5_converse.py  ../homoloe_AltA.txt  ../../../GhDt_Gr_GhAt_Ga_end_noScaffold Dt_D5_converse_AltA.txt
## 祖先与祖先保守
python ../../script_category/AS_A2_D5_converse.py  ../homoloe_AltA.txt  ../../../GhDt_Gr_GhAt_Ga_end_noScaffold A2_D5_converse_AltA.txt
python ../../script_category/AS_At_Dt_converse.py ../homoloe_AltA.txt  ../../../GhDt_Gr_GhAt_Ga_end_noScaffold At_Dt_converse_AltA.txt
## 混合的
python ../../script_category/As_mix.py  ../homoloe_AltA.txt  ../../../GhDt_Gr_GhAt_Ga_end_noScaffold mix_AltA.txt
```



### 比较保守事件与非保守事件的长度差异

```bash
## 提取位置坐标
cat *converse*|awk -F "\t" '$2!="-"{print $2,$3,$4"\n"$9,$10,$11"\n"$16,$17,$18"\n"$23,$24,$25}' OFS="\t"|awk '$1~/[A-Za-z]/{print $0"\t"$3-$2+1}'|sort |uniq >converse.bed
## 提取不保守的AS长度
cut -f1,2,3 homoloe_AltD.txt |sort |uniq|awk '{print $0"\t"$3-$2+1}'|cat - evolution/converse_AltD.bed |sort |uniq -u >noConverse_AltD.bed
## 计算平均值 
awk '{a+=$4}END{print a/事件数目}' evolution/converse_AltD.bed
```



| 事件类型 | 保守类型 | 非保守类型 |
| -------- | -------- | ---------- |
| AltD     | 365      | 536        |
| AltA     | 343      | 517        |
| ExonS    | 116      | 1847       |
| IR       | 264      | 341        |



### 比较序列是否存在差异

之前基因文件的版本用错了，然后提出来的序列有些问题，然后今天用新的版本的跑了一下才是一样的；还好我之前跑甲基化数据的时候用对了基因组。

### 对可变剪切进行分类还是使用剪切位点上下游各300bp组成的序列进行blast

提取剪切位点上下游各300bp的序列

```bash
## 提取上游300bp序列
awk '{print $1,$2-301,$2-1,$5"_"$1"_"$2"_"$3"_"$9"_"$4}' OFS="\t"  ../A2_intronR.txt |sort -k2,3 -n |uniq >left.bed
## 提取下游300bp序列
awk '{print $1,$3,$3+300,$5"_"$1"_"$2"_"$3"_"$9"_"$4}' OFS="\t"  ../A2_intronR.txt |sort -k2,3 -n |uniq  >right.bed
## 使用bedtools提取序列
~/software/bedtools2-2.29.0/bin/fastaFromBed -fi ~/work/Alternative/data/Ga_genome/G.arboreum.Chr.v1.0.fasta -fo right.fasta -name -bed right.bed
##合并两端序列
python merge.py  left.fasta right.fasta  D5_intron_junction.fasta 
```



#### 进行blast比对

```bash
## 将四个同源基因序列构成一个库,id太长了把 -parse_seqids 参数去掉
makeblastdb -in intron_junction.fasta -dbtype "nucl" -parse_seqids -out  intron_junction
## 分别对各个基因组进行比对
blastn -query Dt_intron_junction.fasta -db blastDB/intron_junction -evalue 1e-5  -outfmt 6 -out 111
## 去提取在各个基因组都比较保守的intron事件
awk '$11==0&&$2!~/Ghir_D.*/{print $0}' Dt_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/evm/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][0]>=1&&a[i][2]>=1&&a[i][1]>=1)print i}}' 
## 查看某一个事件是不是对的
grep Ghir_D10G003010_2517095_2517293_199_+ Dt_query_blast.txt |awk '$11==0&&$2!~/Ghir_D.*/{print $0}'

```

#### 提取只在某两个基因组上保守的剪切事件

```bash
## 提取只在Dt与D5中保守的事件
awk '$11==0&&$2!~/Ghir_D.*/{print $0}' Dt_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/evm/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][0]==0&&a[i][2]==0&&a[i][1]>=1)print i}}' >Dt_D5_converse_intronR
## 只在Dt与At中保守的剪切事件
awk '$11==0&&$2!~/Ghir_D.*/{print $0}' Dt_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/evm/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][1]==0&&a[i][2]==0&&a[i][0]>=1)print i}}' 
## Dt与A2中保守的剪切事件
awk '$11==0&&$2!~/Ghir_D.*/{print $0}' Dt_query_blast.txt|awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/evm/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][1]==0&&a[i][2]>=1&&a[i][0]==0)print i}}'
## A2与At中保守的剪切事件
awk '$11==0&&$2!~/evm.*/{print $0}' A2_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/Ghir_D/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][1]==0&&a[i][0]>=1&&a[i][2]==0)print i}}'
## At与D5中的保守剪切事件
awk '$11==0&&$2!~/Ghir_A.*/{print $0}' At_query_blast.txt |awk '$2~/evm/{a[$1][0]+=1}$2~/Ghir_D/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][2]==0&&a[i][0]==0&&a[i][1]>=1)print i}}'
## A2与D5中的保守剪切事件
awk '$11==0&&$2!~/evm.*/{print $0}' A2_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/Ghir_D/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][0]==0&&a[i][1]>=1&&a[i][2]==0)print i}}'
```

#### 在三个基因组上保守的剪切事件

```bash
## Dt、D5、A2中都出现
awk '$11==0&&$2!~/Ghir_D.*/{print $0}' Dt_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/evm/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][0]==0&&a[i][2]>=1&&a[i][1]>=1)print i}}' 
## Dt、D5、At中都出现
awk '$11==0&&$2!~/Ghir_D.*/{print $0}' Dt_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/evm/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][1]>=1&&a[i][2]==0&&a[i][0]>=1)print i}}' 
## At、D5、A2中都出现
awk '$11==0&&$2!~/Ghir_A.*/{print $0}' At_query_blast.txt |awk '$2~/evm/{a[$1][0]+=1}$2~/Ghir_D/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][2]==0&&a[i][0]>=1&&a[i][1]>=1)print i}}'
## At、Dt、A2中都出现
awk '$11==0&&$2!~/Ghir_A.*/{print $0}' At_query_blast.txt |awk '$2~/evm/{a[$1][0]+=1}$2~/Ghir_D/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][2]>=1&&a[i][0]>=1&&a[i][1]==0)print i}}'
```



#### 只在某一个基因组中出现的剪切事件

```bash
## 只在Dt中出现的剪切事件
cat IR_bed/*Dt*|awk -F "\t" '$5~/Ghir_D/{print $5}' |sort |uniq |awk '{print ">"$0}'|cat - Dt_intron_junction.fasta |grep ">"|sort|uniq -u|sed 's/>//g' |awk -F "_" '{print $3"_"$4,$5,$6,$8,$0}' OFS="\t" >noconverse/Dt_IR.bed

## 只在D5中出现的
cat IR_bed/*D5* |awk -F "\t" '$5~/Gor/{print $5}' |sort |uniq |awk '{print ">"$0}'|cat - D5_intron_junction.fasta |grep ">"|sort|uniq -u|sed 's/>//g' |awk -F "_" '{print $2,$3,$4,$6,$0}' OFS="\t"  >noconverse/Dt5_IR.bed
## 只在A2中出现,非保守的剪切事件
cat IR_bed/*A2*|awk -F "\t" '$5~/evm/{print $5}' |sort |uniq |awk '{print ">"$0}'|cat - A2_intron_junction.fasta |grep ">"|sort|uniq -u|sed 's/>//g' |awk -F "_" '{print $2,$3,$4,$6,$0}' OFS="\t" >noconverse/A2_IR.bed
## 只在At中出现
cat IR_bed/*At*|awk -F "\t" '$5~/Ghir_A/{print $5}' |sort |uniq |awk '{print ">"$0}'|cat - At_intron_junction.fasta |grep ">"|sort|uniq -u|sed 's/>//g' |awk -F "_" '{print $3"_"$4,$5,$6,$8,$0}' OFS="\t" >noconverse/At_IR.bed
```



#### 将对于的剪切事件做成bed文件

```bash
## 在所有基因组中都保守的IR对应的bed
awk '$11==0&&$2!~/Ghir_D.*/{print $0}' Dt_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/evm/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][0]>=1&&a[i][2]>=1&&a[i][1]>=1)print i}}'|xargs  -I {} grep {} Dt_query_blast.txt| awk '$11==0&&$2!~/Ghir_D.*/{print $1"\n"$2}'|awk -F "_" '$1~/Ghir/{print $3"_"$4,$5,$6,$8,$0}$1!~/Ghir/{print $2,$3,$4,$6,$0}' OFS="\t" |sort |uniq  >IR_bed/all_converse.bed
## 提取只在Dt与D5中保守的事件
awk '$11==0&&$2!~/Ghir_D.*/{print $0}' Dt_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/evm/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][0]==0&&a[i][2]==0&&a[i][1]>=1)print i}}'|xargs  -I {} grep {} Dt_query_blast.txt|awk '$11==0&&$2!~/Ghir_D.*/{print $1"\n"$2}'|awk -F "_" '$1~/Ghir/{print $3"_"$4,$5,$6,$8,$0}$1!~/Ghir/{print $2,$3,$4,$6,$0}' OFS="\t" |sort |uniq  >IR_bed/Dt_D5_converse.bed
## 只在Dt与At中保守的剪切事件
awk '$11==0&&$2!~/Ghir_D.*/{print $0}' Dt_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/evm/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][1]==0&&a[i][2]==0&&a[i][0]>=1)print i}}' |xargs  -I {} grep {} Dt_query_blast.txt|awk '$11==0&&$2!~/Ghir_D.*/{print $1"\n"$2}'|awk -F "_" '$1~/Ghir/{print $3"_"$4,$5,$6,$8,$0}$1!~/Ghir/{print $2,$3,$4,$6,$0}' OFS="\t" |sort |uniq  >IR_bed/Dt_At_converse.bed
## Dt与A2中保守的剪切事件
awk '$11==0&&$2!~/Ghir_D.*/{print $0}' Dt_query_blast.txt|awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/evm/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][1]==0&&a[i][2]>=1&&a[i][0]==0)print i}}' |xargs  -I {} grep {} Dt_query_blast.txt|awk '$11==0&&$2!~/Ghir_D.*/{print $1"\n"$2}'|awk -F "_" '$1~/Ghir/{print $3"_"$4,$5,$6,$8,$0}$1!~/Ghir/{print $2,$3,$4,$6,$0}' OFS="\t" |sort |uniq  >IR_bed/Dt_A2_converse.bed
## A2与At中保守的剪切事件
awk '$11==0&&$2!~/evm.*/{print $0}' A2_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/Ghir_D/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][1]==0&&a[i][0]>=1&&a[i][2]==0)print i}}'|xargs  -I {} grep {} A2_query_blast.txt |awk '$11==0&&$2!~/evm.*/{print $1"\n"$2}'|awk -F "_" '$1~/Ghir/{print $3"_"$4,$5,$6,$8,$0}$1!~/Ghir/{print $2,$3,$4,$6,$0}' OFS="\t" |sort |uniq  >IR_bed/A2_At_converse.bed
## At与D5中的保守剪切事件
awk '$11==0&&$2!~/Ghir_A.*/{print $0}' At_query_blast.txt |awk '$2~/evm/{a[$1][0]+=1}$2~/Ghir_D/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][2]==0&&a[i][0]==0&&a[i][1]>=1)print i}}'|xargs  -I {} grep {} At_query_blast.txt|awk '$11==0&&$2!~/Ghir_A.*/{print $1"\n"$2}'|awk -F "_" '$1~/Ghir/{print $3"_"$4,$5,$6,$8,$0}$1!~/Ghir/{print $2,$3,$4,$6,$0}' OFS="\t" |sort |uniq  >IR_bed/At_D5_converse.bed
## A2与D5中的保守剪切事件
awk '$11==0&&$2!~/evm.*/{print $0}' A2_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/Ghir_D/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][0]==0&&a[i][1]>=1&&a[i][2]==0)print i}}'|xargs  -I {} grep {} A2_query_blast.txt |awk '$11==0&&$2!~/evm.*/{print $1"\n"$2}'|awk -F "_" '$1~/Ghir/{print $3"_"$4,$5,$6,$8,$0}$1!~/Ghir/{print $2,$3,$4,$6,$0}' OFS="\t" |sort |uniq  >IR_bed/A2_D5_converse.bed

## Dt、D5、A2中都出现
awk '$11==0&&$2!~/Ghir_D.*/{print $0}' Dt_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/evm/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][0]==0&&a[i][2]>=1&&a[i][1]>=1)print i}}' |xargs  -I {} grep {} Dt_query_blast.txt|awk '$11==0&&$2!~/Ghir_D.*/{print $1"\n"$2}'|awk -F "_" '$1~/Ghir/{print $3"_"$4,$5,$6,$8,$0}$1!~/Ghir/{print $2,$3,$4,$6,$0}' OFS="\t" |sort |uniq  >IR_bed/Dt_D5_A2_converse.bed
## Dt、D5、At中都出现
awk '$11==0&&$2!~/Ghir_D.*/{print $0}' Dt_query_blast.txt |awk '$2~/Ghir_A/{a[$1][0]+=1}$2~/evm/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][1]>=1&&a[i][2]==0&&a[i][0]>=1)print i}}' |xargs  -I {} grep {} Dt_query_blast.txt|awk '$11==0&&$2!~/Ghir_D.*/{print $1"\n"$2}'|awk -F "_" '$1~/Ghir/{print $3"_"$4,$5,$6,$8,$0}$1!~/Ghir/{print $2,$3,$4,$6,$0}' OFS="\t" |sort |uniq  >IR_bed/Dt_At_D5_converse.bed
## At、D5、A2中都出现
awk '$11==0&&$2!~/Ghir_A.*/{print $0}' At_query_blast.txt |awk '$2~/evm/{a[$1][0]+=1}$2~/Ghir_D/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][2]==0&&a[i][0]>=1&&a[i][1]>=1)print i}}'|xargs  -I {} grep {} At_query_blast.txt|awk '$11==0&&$2!~/Ghir_A.*/{print $1"\n"$2}'|awk -F "_" '$1~/Ghir/{print $3"_"$4,$5,$6,$8,$0}$1!~/Ghir/{print $2,$3,$4,$6,$0}' OFS="\t" |sort |uniq  >IR_bed/At_D5_A2_converse.bed
## At、Dt、A2中都出现
awk '$11==0&&$2!~/Ghir_A.*/{print $0}' At_query_blast.txt |awk '$2~/evm/{a[$1][0]+=1}$2~/Ghir_D/{a[$1][2]+=1}$2~/Gor/{a[$1][1]+=1}END{for(i in a){if(a[i][2]>=1&&a[i][0]>=1&&a[i][1]==0)print i}}'|xargs  -I {} grep {} At_query_blast.txt|awk '$11==0&&$2!~/Ghir_A.*/{print $1"\n"$2}'|awk -F "_" '$1~/Ghir/{print $3"_"$4,$5,$6,$8,$0}$1!~/Ghir/{print $2,$3,$4,$6,$0}' OFS="\t" |sort |uniq  >IR_bed/At_Dt_A2_converse.bed
```



### 查看基因对的数目

```bash
cut -f5 all_converse.bed |awk -F "_" '$1~/Ghir/{print $1"_"$2}$1!~/Ghir/{print $1}' |sort|uniq |grep "Gor" |wc -l
```



| 事件类型     | 基因对的数目 | 事件数目 |
| ------------ | ------------ | -------- |
| 四个都保守的 | 843          | 1390     |
| At = A2      | 1515         | 2629     |
| Dt =D5       | 1459         | 2189     |
| At=Dt        | 1044         | 1528     |
| A2=D5        | 1060         | 1511     |
| 只在At不存在 | 608          | 845      |
| 只在Dt不存在 | 653          | 945      |
| 只在A2不存在 | 837          | 1199     |
| 只在D5不存在 | 574          | 830      |
| 只有At有     | 4346         | 9387     |
| 只有Dt有     | 4429         | 9780     |
| 只有A2有     | 4541         | 10234    |
| 只有D5有     | 55007        | 12117    |



### 统计保守的IR长度信息

在统计长度的时候发现 Gorai.006G213800这个基因内含子长度都6000多了，对应的At与A2的内含子长度只有588多但是仍旧都可以发生IR

```bash
cat converse/* |sort|uniq |awk -F "_" '{print $(NF-1)}'|less
cat noconverse/* |sort|uniq |awk -F "_" '{print $(NF-1)}'|less
```





