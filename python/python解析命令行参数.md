## python 解析命令行参数

使用argparse包对命令行参数进行解析

1. 使用`argparse.ArgumentParser`建立参数对象

2. 使用对象的`add_argument`方法添加提示信息

3. 将参数解析成字典对象

### 1.创建参数对象

```python
## 创建参数对象
parser=argparse.ArgumentParser(description="find homologous which conserve As Events")
```

### 2.添加参数

```python
parser.add_argument("-AtBlast",help="At blast out file")
parser.add_argument("-DtBlast",help="Dt blast out file")
parser.add_argument("-D5Blast",help="D5 blast out file")
```

### 3.解析参数对象

```python
## 解析参数对象
args=parser.parse_args()
```

### 4.使用参数

```python
AtBlastFile=args.AtBlast
DtBlastFile=args.DtBlast
A2BlastFile=args.A2Blast
D5BlastFile=args.D5Blast
```

### 注意事项

+ 在添加参数时，不再需要再额外的`-h`参数

### 输出结果

```bash
usage: conserve_AS.py [-h] [-AtBlast ATBLAST] [-DtBlast DTBLAST]
                      [-D5Blast D5BLAST] [-A2Blast A2BLAST] [-Atfasta ATFASTA]
                      [-Dtfasta DTFASTA] [-A2fasta A2FASTA] [-D5fasta D5FASTA]
                      [-homologous HOMOLOGOUS] [-out OUT]

find homologous which conserve As Events

optional arguments:
  -h, --help            show this help message and exit
  -AtBlast ATBLAST      At blast out file
  -DtBlast DTBLAST      Dt blast out file
  -D5Blast D5BLAST      D5 blast out file
  -A2Blast A2BLAST      A2 blast out file
  -Atfasta ATFASTA      storage At All enevt file
  -Dtfasta DTFASTA      storage Dt All enevt file
  -A2fasta A2FASTA      storage A2 All enevt file
  -D5fasta D5FASTA      storage D5 All enevt file
  -homologous HOMOLOGOUS
                        homologous file
  -out OUT              out file
```



### 参考

 https://www.jianshu.com/p/0361cd8b8fec 