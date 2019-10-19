# BinomTest

最近在做甲基化数据的分析，要对每个甲基化的位点进行二项分布检验，在R中串行实在是太慢了，总共4千万行的数据跑4天都没跑完，于是写了一个多进程的python脚本，程序主要涉及到大量的CPU计算，而多线程适合IO读写比较多的场景，多线程由于GIL的限制我没有用

### job 函数

对传入的数据进行二项分布测验，基于scipy包中的stats模块

```python
def BioTest(TestData):
  output = []
  for line in range(0, len(TestData)):
    TestData[line] = TestData[line].strip("\n").split("\t")
    count = int(TestData[line][2])+int(TestData[line][3])
    p_value = stats.binom.pmf(int(TestData[line][2]), count, 0.006)
    TestData[line].append(p_value)
    if p_value < 1e-5:
      output.append(TestData[line])
  return output
```

### pool连接池

+ 在for循环中对数据进行切片
+ 使用`p.apply_async`定义任务
+ 在for循环外，开始多线程
+ `pool.join`阻塞主线程运行
+ pool运行的结果可以直接返回给主线程

### 脚本在数据输出时存在内存溢出的问题

原因就是每个线程都把数据存在output列表里，导致list存的数据太大了

```python

'''
Usage:
python3.6 $0 inputfile outputfile coreNumber
'''
import sys
import multiprocessing
from scipy import stats
import time


def BioTest(TestData):
  output = []
  for line in range(0, len(TestData)):
    TestData[line] = TestData[line].strip("\n").split("\t")
    count = int(TestData[line][2])+int(TestData[line][3])
    p_value = stats.binom.pmf(int(TestData[line][2]), count, 0.006)
    TestData[line].append(p_value)
    if p_value < 1e-5:
      output.append(TestData[line])
  return output
  


if __name__ == "__main__":
   startTime=time.time()
   with open(sys.argv[1], 'r') as inputfiel:
     TestData = inputfiel.readlines()
   output = [] 
   ProcessNum=int(sys.argv[3])
   average=int(len(TestData)/ProcessNum)
   p=multiprocessing.Pool(8)
   for processId in range(0,ProcessNum):
     if processId == ProcessNum-1:
       start=processId*average
       end=len(TestData)
     else:
       start=processId*average
       end=(processId+1)*average
     output.append(p.apply_async(BioTest,(TestData[start:end],)))

   p.close()
   p.join()

   
   with open(sys.argv[2], 'w') as OUTPUT:
    for result in output:
       for line in result.get():
         OUTPUT.write(line[0]+"\t"+line[1]+"\t"+line[2]+"\t"+line[3]+"\t"+str(line[4])+"\n")
   end_Time=time.time()
   print("运行时间为%.2f" %(end_Time-startTime))

```

### 解决内存溢出的问题

+ callback回调函数进行解决
+ 加上文件锁

```python

'''
Usage:
python3.6 $0 inputfile outputfile coreNumber

input Date type:
  chromosomeID position count1  count2
output Date type:
  chromosomeID position count1  count2 p-value
'''
import sys
import multiprocessing
from scipy import stats
import time
import fcntl


def BioTest(TestData,processId):
  output = []
  for line in range(0, len(TestData)):
    TestData[line] = TestData[line].strip("\n").split("\t")
    count = int(TestData[line][2])+int(TestData[line][3])
    p_value = stats.binom.pmf(int(TestData[line][2]), count, 0.006)
    TestData[line].append(p_value)
    if p_value < 1e-5:
      output.append(TestData[line])
  return [output,processId]

def WtriteFile(callbackData):
   with open(sys.argv[2], 'a') as OUTPUT:
     fcntl.flock(OUTPUT.fileno(), fcntl.LOCK_EX) #文件锁
     print(str(callbackData[1])+" 进程开始写入文件！")
     for line in callbackData[0]:
         OUTPUT.write(line[0]+"\t"+line[1]+"\t"+line[2]+"\t"+line[3]+"\t"+str(line[4])+"\n")
   print(str(callbackData[1])+" 进程写入完成！")
  

if __name__ == "__main__":
   startTime=time.time()
   with open(sys.argv[1], 'r') as inputfiel:
     TestData = inputfiel.readlines()
   output = [] 
   ProcessNum=int(sys.argv[3])
   average=int(len(TestData)/ProcessNum)
   p=multiprocessing.Pool(20)  #设置进程池数，设置数目超过20将需要排队等候
   for processId in range(0,ProcessNum):
     if processId == ProcessNum-1:
       start=processId*average
       end=len(TestData) #防止除不尽，最后一个进程计算到最后
     else:
       start=processId*average
       end=(processId+1)*average
     p.apply_async(BioTest,(TestData[start:end],processId),callback=WtriteFile) #将切片数据分发给多个进程，最终结果存进列表里
   p.close() #不在接收进程
   p.join()  #进程池运行结束后，进入主进程

   
  #  with open(sys.argv[2], 'w') as OUTPUT:
  #   for result in output:
  #      for line in result.get():
  #        OUTPUT.write(line[0]+"\t"+line[1]+"\t"+line[2]+"\t"+line[3]+"\t"+str(line[4])+"\n")
   end_Time=time.time()

   print("运行时间为%.2f" %(end_Time-startTime))

```



