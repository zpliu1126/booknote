### 1.配置Kobas

kobas运行环境为python2

```bash
##加载模块
module load kobas
##复制配置文件
cp /public/home/software/opt/bio/software/kobas/3.0/docs/kobasrc ~/.kobasrc
```

> **blast+运行时出错，在配置文件 ~/.kobasrc 更换为自己下载的blast+**

### 2.进行注释

+ `-i` 输入基因的氨基酸序列文件
+ `-t`输入文件格式·
+ `-s`背景物种缩写
+ `-o`输出文件
+ ~~`-z` 使用同源基因进行跨物质注释`ghi`表示陆地棉~~

```bash
##提取目标基因的fasta序列
python ~/github/zpliuCode/Isoseq3/06UTRregulation/extractSequenceById.py G.arboreum.Chr.v1.0.pep.v1.0.fasta geneId.txt peptide.fa
##进行注释
annotate.py  -i  peptide.fa -t fasta:pro -s ath  -o annotate.txt 
```

### 3.进行富集分析

+ `-f` annotate 后得到的注释文件
+ `b` 物种缩写
+ `-d` 富集模式为GO
+ `-m` 统计方法
+ `-n` 多重校验方法
+ `-o`输出文件

```bash
identify.py -f annotate.txt  -b ath -d G  -m h -n BH -o GO.txt 
```

### 4.筛选结果

+ p-value <0.05

```bash
awk -F "\t" '$6<=0.05{OFS="\t";print $1,$2,$3,$4,$5,$6,$7}' GO.txt|less
```



`