# intron 分布

有研究表明，IR事件往往导致终止密码子的提前；并且在stree调节下使得IR效率变高从而产生大量正常功能的蛋白质。并且调控IR事件的蛋白质偏向性的结合到**GAAGAA**RNA基序上，这个片段好像和|DNA水平上蛋白的乙酰化有点关系。

1. 提取发生IntronR事件的isform编号和对应的位置

   ```bash
   awk '$3~/IntronR/{print $0}' end_third |awk '$8~/0\,/{print $1,$2,$3,$4,$5,$6}$8~/\,0/{print $1,$2,$3,$4,$5,$7}' OFS="\t"
   ```

2. 统计发生IntronR事件在基因区域的分布情况，师兄说这个正常的植株的IR分布可能没有想要的趋势，先从单个基因入手看看

   要考虑到正负链的情况，靠近pre-mRNA5‘端的为第一个intron，而靠近3’端的为最后一个intron，只有一个intron被认为是middle intron，就考虑每个基因所有转录本的intron分布

   使用相关性的图来表示，每个位置intron的数目
   
   参考  https://www.jianshu.com/p/92780c97d0ae 
   
   ```bash
   
   ```
   
   ![相关性的图](https://upload-images.jianshu.io/upload_images/7493830-bce6bfbb4a999388.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)
   
   使用自己写的脚本`AS_isform_analysis.py`对内含子在intronR事件中的分布发现，发生intronR的内含子在转录本中的分布是随机的没有什么偏好性，或许后面单个基因的研究会有偏向性。
   
   


### 统计发生intronR的长度分布情况

```bash
## 提取每个亚基因组中发生IntronR事件的信息
cut -f3 ../GhDt_Gr_GhAt_Ga_end_noScaffold |xargs -I {} grep {} ../TM-1/Intronstatic2.txt >At_intronR.txt
```



#### 提取Constitutive intron

使用mRNA的整个区域减去exon区域

```bash
# 提取mRNA对应的bed文件 做为A文件
awk '$3~/[tl]/{print $0}' ~/work/Alternative/result/Ga_result/CO11_12_result/07_annotation/A2_merge_C.gtf|cut -f1,4,5,7,9|awk -F ";" '{print $1}'|sed 's/gene_id \"//g'|sed 's/\"//g' >A2_mRNA.bed
# 提取exon对应的坐标作为 B文件
awk '$3~/e/{print $0}' ~/work/Alternative/result/Ga_result/CO11_12_result/07_annotation/A2_merge_C.gtf|cut -f1,4,5,7,9|awk -F ";" '{print $1}'|sed 's/gene_id \"//g'|sed 's/\"//g' >/public/home/zpliu/work/Alternative/result/homologo/IntronR/A2_exon.bed

~/software/bedtools2-2.29.0/bin/subtractBed  -a A2_mRNA.bed  -b A2_exon.bed  |sort|uniq >constitutive_intron.bed


```



![bedtools模式](https://pic2.zhimg.com/80/v2-c1232e7ce2e7735c47ef21cce16507c5_hd.jpg)



### 提取Constitutive exon

先使用脚本将每个isform的intron区域给提出来，之后再使用Bedtools减去这个intron区域就ok

```bash
## 提取每个isform的内含子区域
python ../ConstitutiveExon.py   ~/work/Alternative/result/Gr_result/CO41_42_result/07_annotation/D5_merge_C.gtf  TM-1_intron.bed

```








### 参考

1. 提取intron位置  https://www.jianshu.com/p/cb079a393661 
2. Bedtools 使用  https://zhuanlan.zhihu.com/p/52322803 
3. Bedtools 官网  https://bedtools.readthedocs.io/en/latest/index.html 

