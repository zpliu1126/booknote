# 06class

### 消息死锁

+ 每个进程开始发送message1变量给对于接受进行
+ MPI将发送的数据进行拷贝一份之后，对margin1的修改将不会影响MPI内的数据
+ Recv接受进程的数据，会对进程内的全局变量进行修改，所以message2得到值就是得到的消息内容

```c
        #include <stdio.h>
        #include "mpi.h"
        #define MSGLEN 2048
        #define TAG_A 100
        #define TAG_B 200
        int main(int argc, char *argv[])
        {
          float message1[MSGLEN], message2[MSGLEN];
          int rank,
              dest, source,
              send_tag, recv_tag,
              i;
          MPI_Status status;
          /* length of message in elements */
          MPI_Init(&argc, &argv);
          MPI_Comm_rank(MPI_COMM_WORLD, &rank);
          printf(" Task %d initialized\n", rank);
          /* initialize message buffers */
          for (i = 0; i < MSGLEN; i++)
          {
            message1[i] = 100;
            message2[i] = -100;
          }
          if (rank == 0)
          {
            dest = 1;
            source = 1;
            send_tag = TAG_A;
            recv_tag = TAG_B;
          }
          else if(rank == 1)
          {
            dest = 0;
            source = 0;
            send_tag = TAG_B;
            recv_tag = TAG_A;
          }
          printf(" Task %d has sent the message\n", rank);
          MPI_Send(message1, MSGLEN, MPI_FLOAT, dest, send_tag, MPI_COMM_WORLD );
          MPI_Recv(message2, MSGLEN, MPI_FLOAT, source, recv_tag, MPI_COMM_WORLD ,&status);
          printf(" Task %d has received the message\n", rank);
          MPI_Finalize();
          return 0;
        }
```
### proble

 MPI_Probe()和MPI_Iprobe()函数探测接收消息的内容。用 户根据探测到的消息内容决定如何接收这些消息，如根据消 息大小分配缓冲区等。前者为阻塞方式,即只有探测到匹配的 消息才返回;后者为非阻塞,即无论探测到与否均立即返回

```c
    #include <stdio.h>
    #include "mpi.h"
    int main(int argc, char *argv[])
    {
      MPI_Status status;
      int x,rank;
      float y;
      MPI_Init(&argc, &argv);
      MPI_Comm_rank(MPI_COMM_WORLD, &rank);
      printf(" Task %d initialized\n", rank);

      if(rank==0){
        int message=100;
        MPI_Send(&message,1,MPI_INT,2,99,MPI_COMM_WORLD);

      }else if(rank==1){
        float message=100.0;
        MPI_Send(&message,1,MPI_FLOAT,2,99,MPI_COMM_WORLD);

      }else{
        for(int i=0;i<2;i++){
          MPI_Probe(MPI_ANY_SOURCE,99,MPI_COMM_WORLD,&status);
          if(status.MPI_SOURCE==0){
            MPI_Recv(&x,1,MPI_INT,0,99,MPI_COMM_WORLD,&status);
          }else if(status.MPI_SOURCE==1){
            MPI_Recv(&y,1,MPI_FLOAT,1,99,MPI_COMM_WORLD,&status);
          }
        }
        printf("%d\n",x);
        printf("%f\n",y);
      }
      MPI_Finalize();
      return 0;

    }
```

### 条件编译

```c
  #include <stdio.h>
  #define _DEVICE 
  #ifdef _DEVICE 
  void printfsome()
  {

    printf("this is centos\n");
  }
  #else
  void printfsome()
  {
    printf("this is windows\n");
  }
  #endif
  int main()
  {
    printfsome();
    return 0;
  }
```

### MPI 自定义数据类型

 + 将矩阵的某一列发送给另一个进程
 + 定义一个数据类型，存储数组中的某一列
 + 将指针发送给其他进程
 + 接受到地址后，取值就ok

```c
  #include <stdio.h>
  #include "mpi.h"
  int main(int argc, char *argv[])
  {
    int rank;
    float A[4][4];
    MPI_Status status;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Datatype column_mpi_t;
    MPI_Type_vector(4, 1, 4, MPI_FLOAT, &column_mpi_t);
    MPI_Type_commit(&column_mpi_t);
    printf("%d\t%f\t%d\n",&(A[0][0]),A[0][0],rank);
    if(rank==0){
      A[0][0]=1.0;
      A[1][1]=2.0; //定义第二行第二列的值并且，从第二列开始发送
      MPI_Send(&(A[0][1]), 1, column_mpi_t, 1, 0, MPI_COMM_WORLD); //A[0][1]指针中指向了新的数据类型，紧接着的指针指向一个block，存的是下一行对于的列值
    }else{
      printf("%f\t%d\n",A[1][1],rank);
      MPI_Recv(&(A[0][1]), 16, MPI_FLOAT, 0, 0,MPI_COMM_WORLD, &status);
      printf("aa %d\t%f\n",&(A[0][1]),*(&(A[0][1])+1)); //下一个block的地址对应的值
    }
    MPI_Finalize();
    return 0;

  }
```