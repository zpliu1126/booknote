# LSF

### 1.命令行提交LSF任务

+ `-J`LSF任务名称
+ `-M`该任务最大内存限制数，最大不能够超过队列限制，队列限制内存可使用`bquences -l quence name`查看
+ -e 错误日志文件
+ -o 错误输出文件
+ `-R span[hosts=1]` 单个节点进行计算，一般不会涉及到跨节点
+ `-q quence name`指定队列
+ `-n`

```bash
bsub 
-J extract
-n 1
-M 200GB
-e test.err
-o test.out 
-R span[hosts=1]
-q high 
"python extract_count2.py 111111.gz 2222.gz" //双引号可省略
```



### 2.文件提交LSF任务

```bash
#BSUB -J R1extractCount
#BSUB -n 1
#BSUB -R span[hosts=1]
#BSUB -o extract.out
#BSUB -e extract.err
#BSUB -q "smp"
python extract_count2.py 111111.gz 2222.gz //要运行的脚本
```



### 3.大批量提交任务

+ 先给LSF提交一个for循环，告诉它有很多任务需要提交，让它自动根据系统的资源使用情况来对任务进行分配；从而避免多个任务同时记在一个节点，造成系统负荷

  ```bash
  #BSUB -J R1extractCount
  #BSUB -n 1
  #BSUB -R span[hosts=1]
  #BSUB -o extract.out
  #BSUB -e extract.err
  #BSUB -q "smp"
  A2files=`ls .|grep "count.txt"`
  for i in ${A2files[@]};do
  {
   sh ./binomTest.sh ${i}
   sleep 5
  }&   //这里并行同时提交                                           
  done
  
  ```

  

+ for循环中，每个item都运行一个脚本

  `binomTest.sh`进行任务的提交

  ```bash
  //${1} 是该脚本接受的第一个参数
  bsub -K -J binomalTest_${1} -n 20 -e binomalTest_${1}.err -o binomalTest_${1}.out -R span[hosts=1] -q "high" "python test.py"
  ```

### 4.常用命令

1. 检查提交作业状态  

   ` bjobs `

2.  显示该作业的所有信息 

   ` bjobs -l  jobsID`

3.  删除不需要的作业  

   `bjobs kill jobID`

4.  监视作业运行  

   ` bpeek  jobsID`

5.  显示队列信息  

   ` bqueues `

   ` bqueues –l <queue name>  `

6.  显示各节点作业相关情况 

   ` bhosts  `

   ` bhosts <hostname>  `

7.  显示各节点负载信息  

   ` lsload `

   ` lsload <hostname> `



### 参考

1. https://blog.csdn.net/cy413026/article/details/84649514 
2.  [https://www.ibm.com/developerworks/cn/linux/l-lo-efficient-cluster-manage-system-LSF/index.html#1%E7%AE%80%E5%8D%95%E7%9A%84%E4%BD%BF%E7%94%A8outline](https://www.ibm.com/developerworks/cn/linux/l-lo-efficient-cluster-manage-system-LSF/index.html#1简单的使用outline) 

