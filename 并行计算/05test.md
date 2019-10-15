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

```c
  #include <stdio.h>
  #include <stdlib.h>
  #include <string.h>
  #include "mpi.h"
  #define NUM_STEPS 1000001 //定义步长
  int main(int argc, char *argv[])
  {
    double step;

    int numprocs, myid, source;
    MPI_Status status;        //定义接收消息状态
    double pi = 0.0, sum_T[20]; //存储进程计算结果的buffer
    int limits[20];
    MPI_Init(&argc, &argv);
    step = 1.0 / (double)NUM_STEPS;
    MPI_Comm_rank(MPI_COMM_WORLD, &myid);
    MPI_Comm_size(MPI_COMM_WORLD, &numprocs);
    if (myid != 0)
    {
      MPI_Recv(limits, 20, MPI_INT, 0, 99, MPI_COMM_WORLD, &status); //limit为数组指针
      double x, sum = 0.0;
      for (int i = *limits; i <= *(limits + 1); i++)
      {
        x = (i - 0.5) * step;
        sum += 4.0 / (1.0 + x * x);
      }
      *sum_T = *sum_T * step;
      MPI_Send(sum_T, 1, MPI_INT, 0, 98, MPI_COMM_WORLD); //向0号进程发送计算过结果
    }
    else
    { /* myid == 0 */
      //余数和平均交给0号进程处理，剩下的平均分
      int avarge, remind;
      double x, sum = 0.0;
      avarge = NUM_STEPS / numprocs;
      remind = NUM_STEPS % numprocs;
      for (int i = 1; i <= avarge + remind; i++)
      {
        x = (i - 0.5) * step;
        sum += 4.0 / (1.0 + x * x);
      }
      printf("%f\n",sum);
      pi += sum * step;
      for (source = 1; source < numprocs; source++)
      {
        //根据进程id拆分步长,将需要处理的范围发给其他进程
        limits[0] = avarge + remind +1+ (source - 1) * avarge;
        limits[1] = avarge + remind + source * avarge ;
        MPI_Send(limits, 20, MPI_INT, source, 99, MPI_COMM_WORLD); //向其他进程发送计算的范围
      }
      if (myid == 0)
      {
        printf("%f\n",pi);
        for (source = 1; source < numprocs; source++)
        {
          MPI_Recv(sum_T, 2, MPI_INT, source, 98, MPI_COMM_WORLD, &status);
          pi += *sum_T;
        }
        printf("%f\n", pi);
      }
    }
    MPI_Finalize();
  }
```





