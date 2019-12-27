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



