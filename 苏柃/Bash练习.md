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



