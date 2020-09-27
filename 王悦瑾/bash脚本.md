## Bash脚本

> 对一批数据ERR169194_1.fastq ERR169194_2.fastq	ERR169209_1.fastq ERR169209_2.fastq 进行比对，首先判断两个文件是否存在，然后进行比对，最后将比对结果移动到result 目录中

```bash
#!/bin/bash
for fn in 194 209; do 
  samp=ERR169${fn}
  echo "Processing sample ${samp}"
  if [ -f ${samp}_1.fastq ] || [ -f ${samp}_2.fastq ]; then
    bwa mem -t 22 ref.fa ${samp}_1.fastq ${samp}_2.fastq.gz
    mv $samp.sam result >$samp.sam
  fi
done

```

#### bash中变量

> 参考 https://www.runoob.com/linux/linux-shell-variable.html

当声明了一个变量`samp=1`时，在使用`echo`输出对应的变量可以使用`$`加`{}`定义变量名的界限

```bash
echo $sampp ##这里可以理解成叫samp的变量或者叫sampp的变量；会有歧义
echo ${samp}p ##这样就可以界定变量名的界限，不会有歧义
```

#### bash中for循环

> 参考https://blog.51cto.com/11193863/2319105

for 循环中可以配合bash数组进行使用

> 参考 https://www.runoob.com/linux/linux-shell-array.html

#### bash中流程控制

> 参考 https://www.runoob.com/linux/linux-shell-process-control.html

if语句最后会有一个`fi`标识，判断语句的结束



