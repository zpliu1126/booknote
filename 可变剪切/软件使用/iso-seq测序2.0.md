# iso-seq测序2.0版本



### 与参考基因组的注释信息进行比较

```bash
# python2
python ~/software/MatchAnnot/matchAnnot.py  --gtf ~/work/Alternative/data/Gr_genome/Graimondii_221_v2.1.gene.gtf --format alt ./test.sam  >test/annote.out
```



### 将sam文件转换为gff文件

使用 https://github.com/Magdoll/cDNA_Cupcake/wiki#what  Cupcake包中的一个脚本

```bash
# 加入环境变量
export PATH=$PATH:~/software/cDNA_Cupcake/
# 必须切换cDNA_Cupcake目录才能运行
cd ~/software/cDNA_Cupcake/
sam_to_gff3.py -h
sam_to_gff3.py -s "标识符" ~/work/Alternative/result/Gr_result/CO41_42_result/06_Alignment/test.sam 
# gff3转gtf
~/scripte/gff2gtf_cufflinks  test.gff3  -T -o test.gtf
```





