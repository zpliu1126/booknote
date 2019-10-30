# 07class

### 求pi

+ 使用MPI_Scatter向各个进程发送数据
+ MPI_Gather接收数据

**我在接收数据的时候，忘记接收的是double数据类类型了，一直没跑出想要的结果**

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



### 求内积

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

