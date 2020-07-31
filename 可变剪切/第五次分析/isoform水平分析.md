### 转录本数目的统计

统计文件`07_annotation/isoseq.info.gtf`中注释为转录本的数目

```bash
├── isoseq.info.gtf  ##PacBio isoform所有转录本的注释信息，包括lncRNA
├── matchAnnot_result.txt  ##比对上参考基因组的转录本，不能说它就能够代表参考基因组的转录本
├── matchannot_stat.xls  ##统计转录本数、与参考基因组对应的转录本数
├── merge.gtf   ##把参考基因组注释转录本和PacBio转录本合并，其中参考基因组的转录本信息用PacBio进行代替

awk '$3~/trans/{print $0}' isoseq.info.gtf |grep "Gh"|wc -l
```

| 基因组 | PacBio转录本数目 |
| ------ | ---------------- |
| A2     | 69701            |
| D5     | 53393            |
| TM1    | 86602            |
| At     | 42572            |
| Dt     | 43878            |



