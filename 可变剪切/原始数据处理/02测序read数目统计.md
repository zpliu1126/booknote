**对全长转录本的数据进行检测和量化**

<img src="https://43423.oss-cn-beijing.aliyuncs.com/img/20191009131705.png"/>

Classify对ROI进行分类和统计

```bash
#TM1 中FL 和nFL read数目
  46193 >m54136_180730_021327
 312042 >m54139_180605_030229
 308136 >m54139_180607_052119
 #D5
  225071 >m54136_180615_222948
  24827 >m54136_180730_021327
 210012 >m54139_180609_044201
 #A2
  281078 >m54136_180615_020020
 230398 >m54139_180604_080709
  80434 >m54139_180620_084942
```

1.CCS read 数目统计

| 棉种 | ROI     | 碱基数 |
| ---- | ------- | ------ |
| TM1  | 685,383 | -      |
| A2   | 613,321 | -      |
| D5   | 487063  | -      |

2.Classify后read数目统计

| 棉种 | FLNC&nFL | 嵌合序列 |
| :--- | -------- | -------- |
| TM1  | 666,371  | 18,914   |
| A2   | 591,910  | 20,713   |
| D5   | 459,910  | 26,652   |

3.polished后的consensus isoform数目

| 棉种 | consensus | hg reads      | lq reads |
| ---- | --------- | ------------- | -------- |
| TM1  | 245,865   | 45882(18.67%) | 199,983  |
| A2   | 209256    | 42656(20.38%) | 166600   |
| D5   | 157049    | 31593(20.11%) | 125456   |

4.将consensus isoforms去冗余collapse得到transcript

| 棉种 | transcript数目 | Scaffold |
| ---- | -------------- | -------- |
| TM1  | 89,411         | 883,16   |
| A2   | 72,393         | 689,94   |
| D5   | 55,381         | 552,34   |



### 统计每个PacBio转录本，受支持的Full-length read数目

```bash
##脚本
/public/home/zpliu/work/Alternative/result/Gh_result/CO31_32_result//03_Classify/stattic_PacBio_readCount.py

```

比较RNA-seq和Iso-seq间的重复性

```bash
cor(data$V2,data$V3, method = 'spearman')
```

### 脚本流程

```bash
#1.ccs
ccs --noPolish --minLength=300 --minPasses=1  --maxDropFraction=0.8 --min-rq=0.8 --minSnr=4 -j 10 --report-file CCS.log ../../../raw_data/Gh-1/rawdata/R1801371_QJ_BC1_subreads.bam R1801371_QJ_BC1_ccs.bam

dataset create --type ConsensusReadSet R1801371_QJ_BC1_ccs.xml R1801371_QJ_BC1_ccs.bam 



```

#### 2.classify

```bash
pbtranscript classify  ../01CSS/R1801371_QJ_BC1_ccs.xml  isoseq_draft.fasta --flnc=isoseq_flnc.fasta --nfl=isoseq_nfl.fasta --cpus 10
##输出文件

+ isoseq_draft.classify_summary.txt read分类情况
+ isoseq_draft.fasta flnc和nfl read序列文件
+ isoseq_flnc.fasta 全长非嵌合序列
+ isoseq_nfl.fasta 非全程的序列
```

#### 4.聚类和polished

+ Classify后的全长序列
+ polished的输出文件
+ 

```bash
pbtranscript cluster ../02classify/isoseq_flnc.fasta  polished_clustered.fasta  --quiver --nfl_fa=../02classify/isoseq_nfl.fasta  --bas_fofn ../01CSS/R1801371_QJ_BC1_ccs.bam
```











