# vcf文件处理

需要将每份材料的`0/0`信息置换成对应的碱基信息`T/T`

```bash
#CHROM  POS     ID      REF     ALT     QUAL    FILTER  INFO    FORMAT  ZY6     ZY13    ZY21    ZY30
5       30000172        rs318055        T       A       .       PASS    .       GT      0/0     0/0
```

有可能的材料可能会有`3/3`的情况，对应的碱基应该是`NA/NA`只需要给`Total[3]=NA`就行

还有就是开始置换的材料的列序号不是固定的，根据数据而定，使用`BeginColum`定义

```bash
### BeginColumn定义开始转化的列
### 使用方法 awk -f 当前脚本文件 要转换的vcf文件 输出文件

-F "\t"  {
BeginColumn=10;
if(NR==1){
  print $0;
}
if(NR>1){
  Total[0]=$4;
  ALTlen=split($5,ALT,",");
  for(i=1;i<=ALTlen;i++){
    Total[i]=ALT[i];
  }
  for(i=1;i<BeginColumn;i++){
    printf $i"\t";
  }
  for(i=BeginColumn;i<=NF;i++){
    indexLen=split($i,index1,"/");
    printf Total[index1[1]]"/"Total[index1[2]]"\t"
  }
  print "\n";
}
}
```

