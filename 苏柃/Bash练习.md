# Bash练习



### 2019-11-19

awk 入门

1.提取gff文件中exon对应的染色体坐标和对应的exon编号

```bash
Ghir_A11        Ghir_EVM        gene    48563862        48571977        .       -       .       ID=Ghir_A11G021610;Name=Ghir_A11G021610
Ghir_A11        Ghir_EVM        mRNA    48563862        48571977        .       -       .       ID=Ghir_A11G021610.1;Parent=Ghir_A11G021610
Ghir_A11        Ghir_EVM        three_prime_UTR 48563862        48565187        .       -       .       ID=Ghir_A11G021610.1.utr3p1;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        CDS     48565188        48565874        .       -       0       ID=cds.Ghir_A11G021610.1;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        exon    48563862        48565874        .       -       .       ID=Ghir_A11G021610.1.exon8;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        CDS     48565967        48566053        .       -       0       ID=cds.Ghir_A11G021610.1;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        exon    48565967        48566053        .       -       .       ID=Ghir_A11G021610.1.exon7;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        CDS     48566135        48566329        .       -       0       ID=cds.Ghir_A11G021610.1;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        exon    48566135        48566329        .       -       .       ID=Ghir_A11G021610.1.exon6;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        CDS     48566416        48566538        .       -       0       ID=cds.Ghir_A11G021610.1;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        exon    48566416        48566538        .       -       .       ID=Ghir_A11G021610.1.exon5;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        CDS     48566625        48566711        .       -       0       ID=cds.Ghir_A11G021610.1;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        exon    48566625        48566711        .       -       .       ID=Ghir_A11G021610.1.exon4;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        CDS     48566811        48567275        .       -       0       ID=cds.Ghir_A11G021610.1;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        exon    48566811        48567275        .       -       .       ID=Ghir_A11G021610.1.exon3;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        CDS     48568656        48568738        .       -       1       ID=cds.Ghir_A11G021610.1;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        exon    48568656        48568738        .       -       .       ID=Ghir_A11G021610.1.exon2;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        CDS     48571600        48571894        .       -       0       ID=cds.Ghir_A11G021610.1;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        exon    48571600        48571977        .       -       .       ID=Ghir_A11G021610.1.exon1;Parent=Ghir_A11G021610.1
Ghir_A11        Ghir_EVM        five_prime_UTR  48571895        48571977        .       -       .       ID=Ghir_A11G021610.1.utr5p1;Parent=Ghir_A11G021610.1

```

结果如下:

```bash
Ghir_A11	48566135	48566329	-	Ghir_A11G021610.1.exon6
```



参考：

+ awk获取某一列  https://www.cnblogs.com/royfans/p/7743800.html 
+ 使用awk正则表达式匹配 exon  https://www.w3cschool.cn/awk/8xet1k8a.html 
+ awk自定义分隔符  https://blog.csdn.net/hongchangfirst/article/details/25071937 
+ awk 获取子字符串  https://blog.csdn.net/qq_36741436/article/details/78733348 



### 2019-11-30

sed入门

1. 使用sed删除1~10行内容
2. 输出gff文件中exon所在的行
3. 紧接上一个结果，将逗号`;`后的字符串全部删除 `提示使用正则表达式将;好后面的替换为空`
4. 将一行中所有的`Ghir`全都换成`TM-1`



参考:

1. sed 替换  https://www.cnblogs.com/linux-wangkun/p/5745584.html 
2. 正则表达式比较通俗有趣的版本  https://www.zhihu.com/question/19676915 

sed 中常用的几种模式

+ d
+ p
+ s

进行全局匹配模式的关键字 `g`



### 2019-12-9

使用awk将改变fasta格式

```bash
awk 'NR==1&&$1~/^>/{print $0}NR>=2&&$1~/^>/{print "\n"$0}$1~/^[^>]/{printf $0}' 
```

原始的fasta格式，基因序列在多行

```bash
>Ghir_A01G000010.1
ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAA
CTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAA
TGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGC
CTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAAC
TCGAGGGCATACTGGATATTTGA
```

修改后的fasta格式,基因序列在同一行

```bash
>Ghir_A01G000010.1
ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA
```



### 将注释信息与基因坐标信息放一起

输入数据

```bash

```



```bash
awk '$0~/Alignment/{a=$0}$1~/^[^#]/{print $0"\t"a}' 2
```

输出数据

```bash

```



### 将注释信息单独放在一行

```bash
awk '{print "## "$7"\n"$0}' link.txt |awk 'NR==1{tmp=$0;print tmp}$1~/^#/{if(tmp!=$0){tmp=$0;print tmp}}$1~/^[^#]/{print $0}' |less
```



### 比较上下几行范围的内容

找出异常值

```bash
awk '{array[NR]=$0}END{
for(i=2;i<=NR-1;i++){
split(array[i-1],tmp1,"\t");
split(array[i],tmp,"\t");
split(array[i+1],tmp2,"\t");
if((tmp2[7]-tmp1[7]<2000000||tmp2[7]-tmp1[7]>-2000000)&&(tmp[7]-tmp1[7]>2000000||tmp[7]-tmp1[7]<-2000000)&&(tmp[7]-tmp2[7]>2000000||tmp[7]-tmp2[7]<-2000000)){
print array[i]
}else if((tmp2[7]-tmp1[7]>2000000||tmp2[7]-tmp1[7]<-2000000)&&(tmp[7]-tmp1[7]>2000000||tmp[7]-tmp1[7]<-2000000)&&(tmp[7]-tmp2[7]>2000000||tmp[7]-tmp2[7]<-2000000)){
print array[i]
}else{

}}
}' D5Chr01_vs_A2_coords.txt

```

除异常值以外的值

```bash
awk '{array[NR]=$0}END{
print array[1];
for(i=2;i<=NR-1;i++){
split(array[i-1],tmp1,"\t");
split(array[i],tmp,"\t");
split(array[i+1],tmp2,"\t");
if((tmp2[7]-tmp1[7]<2000000||tmp2[7]-tmp1[7]>-2000000)&&(tmp[7]-tmp1[7]>2000000||tmp[7]-tmp1[7]<-2000000)&&(tmp[7]-tmp2[7]>2000000||tmp[7]-tmp2[7]<-2000000)){

}else if((tmp2[7]-tmp1[7]>2000000||tmp2[7]-tmp1[7]<-2000000)&&((tmp[7]-tmp1[7]>2000000||tmp[7]-tmp1[7]<-2000000)&&(tmp[7]-tmp2[7]>2000000||tmp[7]-tmp2[7]<-2000000))){

}else{
print array[i]
}}
print array[NR]
}' D5Chr01_vs_A2_coords.txt
```



