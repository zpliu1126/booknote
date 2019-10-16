# 05 test

### MPI helloworld
```bash
  #include <stdio.h>
  #include "mpi.h"
  int main( int argc, char *argv[] )
  {
    MPI_Init( &argc, &argv );
    printf("hello world\n");
    MPI_Finalize();
  }
```

### greeting 进程间消息传递
+ `MPI_COMM_WORLD`通信空间,是一个进程组上下文的组合，同时也是通信函数不可缺少的参数
+ `MPI_Comm_size`通信空间中包含的进程数目
+ `MPI_Comm_rank`本进程在通信空间中的进行编号
+ `MPI_Send(void* buf, int count, MPI_Datatype datatype, int dest,int tag, MPI_Comm comm)消息发送函数
+ `MPI_Recv()消息接收函数
  ***消息传递函数的每个参数的意义***
  + buf 发送信息的缓冲区的起始地址
  + count 发送信息的长度，例如“hello world\n”就是12
  + 发送信息的数据类型 例如`MPI_CHAR`字符串数据类型
  + 目标进程的编号 例如发给0号进程
  + 消息标签 用于区分消息
  + 通信空间 `MPI_COMM_WORLD`
  + 只有recv函数才有的参数 ---发送给当前进程的，涞源进程id
  + 只有recv接收函数才有的参数，`&status`包含实际接收到的消息的相关信息

```c
  #include <stdio.h>
  #include <string.h>
  #include "mpi.h"
  int main(int argc, char* argv[]) {
  int numprocs, myid, source; MPI_Status status;
  char message[100];
  MPI_Init(&argc, &argv); 
  MPI_Comm_rank(MPI_COMM_WORLD, &myid); 
  MPI_Comm_size(MPI_COMM_WORLD, &numprocs);
  if (myid != 0) {
  sprintf(message, "message from%d",myid); //将消息装进message
  MPI_Send(message,strlen(message)+1, MPI_CHAR, 0,99, MPI_COMM_WORLD);
  } else {/* myid == 0 */
  for (source = 1; source < numprocs; source++) {
  MPI_Recv(message, 100, MPI_CHAR, source, 99, MPI_COMM_WORLD, &status);
  printf("%s\n", message); }
  }
  MPI_Finalize();
  }
```

### point to point 进程间通信

```c
  #include <stdio.h>
  #include <string.h>
  #include "mpi.h"
  int main(int argc, char* argv[]) {
  int numprocs, myid, source; 
  MPI_Status status;//定义接收消息状态
  char message[100];
  MPI_Init(&argc, &argv); 
  MPI_Comm_rank(MPI_COMM_WORLD, &myid); 
  MPI_Comm_size(MPI_COMM_WORLD, &numprocs);
  if (myid != 0) {
  sprintf(message, "message from%d",myid); //将消息装进message
  MPI_Send(message,strlen(message)+1, MPI_CHAR, 0,99, MPI_COMM_WORLD);
  } else {/* myid == 0 */
  for (source = 1; source < numprocs; source++) {
  MPI_Recv(message, 100, MPI_CHAR, source, 99, MPI_COMM_WORLD, &status);
  printf("%s\n", message); }
  }
  if(myid != 0){
    MPI_Recv(message,100,MPI_CHAR,0,90,MPI_COMM_WORLD,&status);
    printf("%s\n",message);
  }else{
  for(source=1;source<numprocs;source++){
    sprintf(message,"pint form 0 to%d\n",source);
    MPI_Send(message,strlen(message)+1,MPI_CHAR,source,90,MPI_COMM_WORLD);}
  }
  MPI_Finalize();
  }
```

### 多进程求pi

+ 计算时间还不是很完善
+ 前期bug主要出现在消息传递过程中数据类型上`MPI_DOUBLE`
+ 0号进程和最后一个进程，不仅仅承担了简单的加和同时也计算了pi值的一部分，避免了资源的浪费
+ 同一个进程不能同时sed与recv，会造成死锁

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "mpi.h"
#define NUM_STEPS 100000001 //定义步长
int main(int argc, char *argv[])
{
  double step;
  int numprocs, myid, source;
  MPI_Status status;            //定义接收消息状态
  double pi = 0.0, sum_tmp[10]; //存储进程计算结果的buffer
  int limits[20];
  step = 1.0 / (double)NUM_STEPS;
  double x, sum,Starttime,Endtime ;

  MPI_Init(&argc, &argv);
  MPI_Comm_rank(MPI_COMM_WORLD, &myid);
  MPI_Comm_size(MPI_COMM_WORLD, &numprocs);

  MPI_Barrier(MPI_COMM_WORLD);
  Starttime = MPI_Wtime(); //开始计时
  if (myid == 0)
  {
    /* myid == 0 */
    //余数和平均交给0号进程处理，剩下的平均分
    int avarge, remind;
    //防止sum变量被其他进程污染
    avarge = NUM_STEPS / numprocs;
    remind = NUM_STEPS % numprocs;
    for (int i = 1; i <= avarge + remind; i++)
    {
      x = (i - 0.5) * step;
      sum += 4.0 / (1.0 + x * x);
    }
    sum_tmp[0] = sum * step; //0号进程计算的一部分结果
    for (source = 1; source < numprocs; source++)
    {
      //根据进程id拆分步长,将需要处理的范围发给其他进程
      limits[0] = avarge + remind + 1 + (source - 1) * avarge;
      limits[1] = avarge + remind + source * avarge;
      MPI_Send(limits, 20, MPI_INT, source, 99, MPI_COMM_WORLD); //向其他进程发送计算的范围
    }
   if(numprocs==1){
      printf("计算结果为:\t%1.5f\n", sum_tmp[0]);
   }else{
      MPI_Send(sum_tmp, 20, MPI_DOUBLE, numprocs - 1, 97, MPI_COMM_WORLD); //向最后一个进程发送0号进程的计算结果,只有一个进程会出bug
   }
    Endtime = MPI_Wtime() ;  // 终止计时
    printf("当前进程%d花费时间为:%1.2f\n",myid,Endtime-Starttime);
  }
  else if (myid < numprocs - 1)
  {
    MPI_Recv(limits, 20, MPI_INT, 0, 99, MPI_COMM_WORLD, &status); //从0号进行收集计算的范围
    //printf("%f\n",sum);
     //防止sum变量被其他进程污染
    for (int i = *limits; i <= *(limits + 1); i++)
    {
      x = (i - 0.5) * step;
      sum += 4.0 / (1.0 + x * x);
    }
    sum_tmp[0] = sum * step;
    MPI_Send(sum_tmp, 1, MPI_DOUBLE, numprocs - 1, 98, MPI_COMM_WORLD); //向最后一个进行发送计算结果
  Endtime = MPI_Wtime() ;  // 终止计时
  printf("当前进程%d花费时间为:%1.2f\n",myid,Endtime-Starttime);
  }

  else
  {
    //printf("%f\n",sum);
   Starttime = MPI_Wtime(); //开始计时
    MPI_Recv(limits, 20, MPI_INT, 0, 99, MPI_COMM_WORLD, &status);     //从0号进行收集计算范围
    MPI_Recv(sum_tmp, 20, MPI_DOUBLE, 0, 97, MPI_COMM_WORLD, &status); //收集0号进程的计算结果
     //防止sum变量被其他进程污染
    for (int i =*limits; i <= *(limits+1); i++)
    {
      x = (i - 0.5) * step;
      sum += 4.0 / (1.0 + x * x);
    }
    pi = sum * step+*sum_tmp; //加上0号进程和当前进程的计算结果
    for (source = 1; source < numprocs - 1; source++)
    {
      MPI_Recv(sum_tmp, 1, MPI_DOUBLE, source, 98, MPI_COMM_WORLD, &status);
      pi += *sum_tmp; //加上其他进程的计算结果
    }
    Endtime = MPI_Wtime() ;  // 终止计时
   printf("当前进程%d花费时间为:%1.2f\n",numprocs-1,Endtime-Starttime);
    printf("计算结果为:\t%1.5f\n",pi);
  }

  MPI_Finalize();

}

```





