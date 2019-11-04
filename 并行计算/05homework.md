***学号***：2019301110060        ***姓名***：刘振平                   ***院系***：植物科学技术学院



### 使用点对点通讯计算pi值

+ 统一步长`num_step=100000001`

| 线程数 | 时间  | 加速比 | 并行效 |
| :----: | :---: | :----: | :----: |
|   1    | 1.51s |   1    |   1    |
|   2    | 1.52s |  0.99  | 0.496  |
|   4    | 0.77s |  1.96  |  0.49  |
|   6    | 0.54s |  2.79  |  0.46  |
|   8    | 0.39s |  3.87  |  0.48  |

 

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



### 消息死锁

```bash
 Task 0 initialized
 Task 0 has sent the message
 Task 1 initialized
 Task 1 has sent the message
 Task 0 has received the message
 Task 1 has received the message
```



### Proble

```c
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
```

#### 输出结果

```bash
 Task 1 initialized
 Task 2 initialized
 Task 0 initialized
100
100.000000
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



### 使用集合通信求Pi

```c
#include <stdio.h>
#include <stdlib.h>
#include <malloc.h>
#include "mpi.h"
#define _NUM_STEP 10000
double step = 1.0 / (double)_NUM_STEP;
/*
定义每个进程使用的函数
*/
double LocalSum(int point, int numprocess)
{
  double sum = 0.0, x;
  for (int i = point; i <= _NUM_STEP; i += numprocess)
  {
    x = step * (i - 0.5);
    sum += 4.0 / (1.0 + x * x);
  }
  return sum;
}

int main(int argc, char *argv[])
{
  int numprocess, rank;
  int *sendbuf;          //定义接收缓冲区
  double *revbuf = NULL; //定义接收缓冲区
  int point;             //定义每个进程开始计算的节点
  double sum, pi;        //sum得到每个进程的计算结果
  MPI_Init(&argc, &argv);
  MPI_Comm_rank(MPI_COMM_WORLD, &rank);
  MPI_Comm_size(MPI_COMM_WORLD, &numprocess);
  if (rank == 0)
  {
    sendbuf = (int *)malloc(numprocess * 1 * sizeof(int));//开辟发送缓存
    for (int i = 0; i < numprocess; i++)
    {
      *(sendbuf + i) = i; //构造缓冲区数据
    }
  }
  MPI_Scatter(sendbuf, 1, MPI_INT, &point, 1, MPI_INT, 0, MPI_COMM_WORLD);//向各个进程发送数据
  sum = LocalSum(point, numprocess); //计算每个进程的结果

  // printf("rank= %d Results: %f\t%d\t%d\n", rank, sum, point, numprocess);
  if (rank == 0)
  {
    revbuf = (double *)malloc(numprocess * 1 * sizeof(double));//开辟接收结果的缓存
  }
  MPI_Gather(&sum, 1, MPI_DOUBLE, revbuf, 1, MPI_DOUBLE, 0, MPI_COMM_WORLD);//将结果收集
  MPI_Barrier(MPI_COMM_WORLD);
  if (rank == 0)
  {
    for (int i = 0; i < numprocess; i++)
    {
      pi += revbuf[i] * step;//计算最后结果
    }
    printf("pi:%f\n", pi);
    /* code */
  }
  MPI_Finalize();
  return 0;
}
```



### 使用集合通信求内积

```c
#include <stdio.h>
#include <stdlib.h>
#include <malloc.h>
#include "mpi.h"
#include <unistd.h>
#define random(x) (rand() % x) //定义随机数函数
#define DIMENSION 100

/*
定义每个进程使用的函数
*/
int LocalSum(int point, int numprocess,int Array1[],int Array2[])
{
  int sum;
  for (int i = point; i < DIMENSION; i += numprocess)
  {

    sum += Array1[i] * Array2[i];
  }
  return sum;
}

int main(int argc, char *argv[])
{
  /*
定义两个一维数组用于计算内积
*/
  int Array1[DIMENSION];
  int Array2[DIMENSION];
  int i;
  srand(2019);
  for (i = 0; i < DIMENSION; i++)
  {
    Array1[i] = random(100);
  }
  srand(2018);
  for (i = 0; i < DIMENSION; i++)
  {
    Array2[i] = random(100);
  }
  int numprocess, rank;
  int *sendbuf;        //定义发送缓冲区
  int *revbuf = NULL;  //定义接收缓冲区
  int point;           //定义每个进程开始计算的节点
  int sum, DotProduct; //sum得到每个进程的计算结果
  MPI_Init(&argc, &argv);
  MPI_Comm_rank(MPI_COMM_WORLD, &rank);
  MPI_Comm_size(MPI_COMM_WORLD, &numprocess);
  if (rank == 0 && numprocess <= DIMENSION)
  {
    sendbuf = (int *)malloc(numprocess * 1 * sizeof(int)); //开辟发送缓存
    for (int i = 0; i < numprocess; i++)
    {
      *(sendbuf + i) = i; //构造缓冲区数据
    }
  }

  MPI_Scatter(sendbuf, 1, MPI_INT, &point, 1, MPI_INT, 0, MPI_COMM_WORLD); //向各个进程发送数据
  sum = LocalSum(point, numprocess,Array1,Array2);                                       //计算每个进程的结果

  // printf("rank= %d Results: %f\t%d\t%d\n", rank, sum, point, numprocess);
  if (rank == 0)
  {
    revbuf = (int *)malloc(numprocess * 1 * sizeof(int)); //开辟接收结果的缓存
  }
  MPI_Gather(&sum, 1, MPI_INT, revbuf, 1, MPI_INT, 0, MPI_COMM_WORLD); //将结果收集
  MPI_Barrier(MPI_COMM_WORLD);
  if (rank == 0)
  {
    for (int i = 0; i < numprocess; i++)
    {
      DotProduct += revbuf[i]; //计算最后结果
    }
    printf("DotProduct:%d\n", DotProduct);
    /* code */
  }
  MPI_Finalize();
  return 0;
}
```



### 矩阵向量乘积



