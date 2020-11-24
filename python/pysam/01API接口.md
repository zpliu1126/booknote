### 读取BAM文件

```python
import pysam
samfile= pysam.AlignmentFile("ex1.bam", "rb")
```

### 提取比对到指定区域的所有read

使用`fetch`函数，获取指定区域的可iterate对象，每次迭代返回一个`AlignedSegment`对象。

```python
for read in samfile.fetch('chr1', 100, 120):
     print read

samfile.close()
```

输出结果

```bash
EAS56_57:6:190:289:82       0       99      <<<7<<<;<<<<<<<<8;;<7;4<;<;;;;;94<;     69      CTCAAGGTTGTTGCAAGGGGGTCTATGTGAACAAA     0       192     1
EAS56_57:6:190:289:82       0       99      <<<<<<;<<<<<<<<<<;<<;<<<<;8<6;9;;2;     137     AGGGGTGCAGAGCCGAGTCACGGGGTTGCCAGCAC     73      64      1
EAS51_64:3:190:727:308      0       102     <<<<<<<<<<<<<<<<<<<<<<<<<<<::<<<844     99      GGTGCAGAGCCGAGTCACGGGGTTGCCAGCACAGG     99      18      1
...

```

### 提取比对到指定区域的所有read

使用`pileup`方法，每次迭代都或返回`pileupcolumn`对象，`pileupcolumn`对象中包含比对到参考基因组上的read信息

```python
import pysam
samfile = pysam.AlignmentFile("ex1.bam", "rb" )
for pileupcolumn in samfile.pileup("chr1", 100, 120):
    print ("\ncoverage at base %s = %s" %
           (pileupcolumn.pos, pileupcolumn.n))
    for pileupread in pileupcolumn.pileups:
        if not pileupread.is_del and not pileupread.is_refskip:
            # query position is None if is_del or is_refskip is set.
            print ('\tbase in read %s = %s' %
                  (pileupread.alignment.query_name,
                   pileupread.alignment.query_sequence[pileupread.query_position]))

samfile.close()
```

### 将比对信息写入到`AligmentFile`

```python
import pysam
samfile = pysam.AlignmentFile("ex1.bam", "rb")
pairedreads = pysam.AlignmentFile("allpaired.bam", "wb", template=samfile)
for read in samfile.fetch():
     if read.is_paired:
             pairedreads.write(read) ##写入到新的文件中

pairedreads.close()
samfile.close()
```

### 提取指定区域的`cigar`值

```python
for read in samfile.fetch('Ghir_A01', 63932751,63934034):
     print(read.cigarstring)
```



