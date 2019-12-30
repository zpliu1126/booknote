### 对于保守的剪切事件，去找对应的motif



### 保守的IR事件

提取内含子序列再加上左右各50bp的序列进行motif搜索

```bash
## 提取每个基因组的保守的IR对应的bed文件
awk -F "\t" '{print $1,$2-50,$3+50,$4,$5}' OFS="\t" ../converseBed/all_converse.bed|grep Ghir >At_Dt.fasta 
python ~/scripte/according_CDS_location_find_fasta_mesage.py  At_Dt.bed  ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Ghirsutum_genome_HAU_v1.0.fasta At_Dt.fasta
```



#### A2-At-D5

找出各个保守事件对应的基因序列不考虑正负链的关系

```bash
## At的序列
cat ../converseBed/At_D5_A2_converse.bed |awk -F "\t" '{print $1,$2,$3,$5}' OFS="\t"|grep "Ghir" >At.bed
~/software/bedtools2-2.29.0/bin/fastaFromBed -fi ~/work/Alternative/data/Ghirsutum_genome_HAU_v1.0/Ghirsutum_genome_HAU_v1.0.fasta -name -bed At.bed  -fo At.fasta 
## D5的序列
cat ../converseBed/At_D5_A2_converse.bed |awk -F "\t" '{print $1,$2,$3,$5}' OFS="\t"|grep "Gor" >D5.bed
~/software/bedtools2-2.29.0/bin/fastaFromBed -fi ~/work/Alternative/data/Gr_genome/Graimondii_221_v2.0.fa -name -bed D5.bed -fo D5.fasta
## A2的序列
cat ../converseBed/At_D5_A2_converse.bed |awk -F "\t" '{print $1,$2,$3,$5}' OFS="\t"|grep "evm" >A2.bed
~/software/bedtools2-2.29.0/bin/fastaFromBed -fi ~/work/Alternative/data/Ga_genome/G.arboreum.Chr.v1.0.fasta -name -bed A2.bed -fo A2.fasta
```

