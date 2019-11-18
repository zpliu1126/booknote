### 1.二维数组乘积

```c
#include "mpi.h"
#include "omp.h"
#include <malloc.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
  int rank, numprocess, dimension;
  double startTime, endTime;
  float *Matrix1;
  float *Matrix2;
  float *sendBuf, *revBuf;
  MPI_Init(&argc, &argv);
  MPI_Comm_rank(MPI_COMM_WORLD, &rank);
  MPI_Comm_size(MPI_COMM_WORLD, &numprocess);
  MPI_Barrier(MPI_COMM_WORLD);
  startTime = MPI_Wtime();
  if (rank == 0)
  {
    printf("请输入矩阵的维度·:\n");
    scanf("%d", &dimension);
    Matrix1 = (float *)malloc(dimension * dimension * sizeof(float));
    Matrix2 = (float *)malloc(dimension * dimension * sizeof(float));
    for (int i = 0; i < dimension; i++)
    {
      // srand(rank*i+1);
      for (int j = 0; j < dimension; j++)
      {
        Matrix1[i * dimension + j] = 100.0 * rand() / RAND_MAX;
        Matrix2[i * dimension + j] = 100.0 * rand() / RAND_MAX;
      }
    }
    revBuf = (float *)malloc(dimension * dimension * sizeof(float));
  }
  /*
    广播二维数组
    */
  MPI_Bcast(&dimension, 1, MPI_INT, 0, MPI_COMM_WORLD);
  MPI_Bcast(&Matrix1, dimension * dimension, MPI_FLOAT, 0, MPI_COMM_WORLD);
  MPI_Bcast(&Matrix2, dimension * dimension, MPI_FLOAT, 0, MPI_COMM_WORLD);
  sendBuf = (float *)malloc(dimension * sizeof(float));
  for (int i = rank; i < dimension; i += numprocess)
  {
    for (int j = 0; j < dimension; j++)
    {
      for (int k = 0; k < dimension; k++)
      {
        sendBuf[j] = Matrix1[i * dimension + k] * Matrix2[k * dimension + j];
      }
    }
    MPI_Gather(sendBuf, dimension, MPI_FLOAT, revBuf, dimension, MPI_FLOAT, 0, MPI_COMM_WORLD);
  }
  MPI_Barrier(MPI_COMM_WORLD);
  endTime = MPI_Wtime();
  if (rank == 0)
  {
    for (int i = 0; i < dimension; i++)
    {
      // srand(rank*i+1);
      for (int j = 0; j < dimension; j++)
      {
        printf("%f\t",revBuf[i*dimension+j]);
      }
      printf("\n");
    }
    printf("time= %g(s)\n", endTime - startTime);
  }

  free(Matrix1);
  free(Matrix2);
  MPI_Finalize();
  return 0;
}
```

#### 1.2 并行效率与加速比



### 2.计算数列加和值

#### 2.1MPI模式

+ 将N根据进程数拆分成多个部分

```c
// MPI
#include "mpi.h"
#include "omp.h"
#include <math.h>
#include <stdio.h>
#define N 1000000
int main(int argc, char *argv[])
{
  int rank, nproc;
  int i, low, up;
  double local = 0.0, pi, t0, t1;
  MPI_Status status;
  MPI_Init(&argc, &argv);
  MPI_Comm_size(MPI_COMM_WORLD, &nproc);
  MPI_Comm_rank(MPI_COMM_WORLD, &rank);
  t0 = MPI_Wtime();
  //low = rank * (N / nproc) + 1;
  //up = low + N / nproc ;
 for (i = rank + 1; i <= N; i += nproc)
 {
   local += (double)(3 * i + 3) / 2.0;
 }
  MPI_Reduce(&local, &pi, 1, MPI_DOUBLE, MPI_SUM, 0, MPI_COMM_WORLD);
  if (rank == 0)
    printf("pi = %f\n", pi);
  t1 = MPI_Wtime();
  if (rank == 0)
    printf("time used = %.2f\n", t1 - t0);
  MPI_Finalize();
}
```

### 2.2MPi+OpenMp模式

+ 根据进程ID拆分每个进程的计算范围
+ 在每个范围中使用多线程进行计算

```c
#include <mpi.h>
#include <omp.h>
#include <math.h>
#include <stdio.h>
// #define N 10000000000
int main(int argc, char *argv[])
{
  int N;
  int rank, i, nproc;
  int  low, up;
  double t0, t1;
  double local = 0.0, pi;
  MPI_Status status;
  MPI_Init(&argc, &argv);
  MPI_Comm_size(MPI_COMM_WORLD, &nproc);
  MPI_Comm_rank(MPI_COMM_WORLD, &rank);
  if(rank==0){
      printf("请输入一个数组长度:\n");
      scanf("%d",&N);
    }
    MPI_Bcast(&N,1,MPI_INT,0,MPI_COMM_WORLD);//发送每个进程维度
  
  t0 = MPI_Wtime();
  low = rank * (N / nproc) + 1;
  up = low + N / nproc;
  // for (i = rank + 1; i <= N; i += nproc)
  // {
  //   local += (double)(3 * i + 3) / 2.0;
  // }
  if(rank==nproc-1&&N%nproc!=0){
    up=N+1;
  }

    // printf("process:%d\tmax_thread:%d\n", rank,omp_get_max_threads());
    #pragma omp parllel for reduction(+ : local) private(i)
    for (i = low+omp_get_thread_num(); i <up; i += omp_get_max_threads())
    {

      local += (3 * i + 3) / 2.0;
    }

  

  MPI_Barrier(MPI_COMM_WORLD);
  MPI_Reduce(&local, &pi, 1, MPI_DOUBLE, MPI_SUM, 0, MPI_COMM_WORLD);
  if (rank == 0)
  {
    printf("pi = %lf\n", pi);
    t1 = MPI_Wtime();
    printf("time used = %.2f\n", t1 - t0);
  }
  MPI_Finalize();
  return 0;
}
```



#### 2.3并行效率和加速比

| 线程数 | 时间 | 加速比 | 并行效率 |
| :----: | :--: | :----: | :------: |
|   1    |      |        |          |
|   2    |      |        |          |
|   4    |      |        |          |
|   6    |      |        |          |
|   8    |      |        |          |





### 3.所有计算的PI

#### 3.1OMP多线程计算PI

**3.1.1PAD模式**

+ PAD模式进行多线程计算PI，利用二维数组存储计算结果
+ 在多线程结束后，遍历数组获取对应的pi值
+ 防止了多线程在输入输出时，造成的阻塞

```c
#pragma omp parallel  //开始并发执行
      {
        double x;
        int id , i;
        id = omp_get_thread_num(); //获取每个线程的id编号
        //#pragma omp parallel for reduction(+:sum)
        for (i=id; i < num_steps; i = i + NUM_THREADS)
        {
          x = (i - 0.5) * step; 
          sum[id][0] += 4.0 / (1.0 + x * x);
        }
        //printf("%f\n",sum);
        //#pragma omp critical
        //pi+=sum*step;
        
      }
      int i; 
      for (i = 0; i < NUM_THREADS; i++)
      {
        pi += sum[i][0] * step;
      }
```

**3.1.2并行域模式**

+ 使用一维数组存储计算结果，所以会造成数据读写时的阻塞

```c
omp_set_num_threads(NUM_THREADS); //设置要使用的线程数目
    #pragma omp parallel  //开始并发执行
      {
        double x;
        int id , i;
        id = omp_get_thread_num(); //获取每个线程的id编号
        sum[id]=0.0;
        //#pragma omp parallel for reduction(+:sum)
        for (i=id; i < num_steps; i = i + NUM_THREADS)
        {
          x = (i - 0.5) * step; 
          sum[id]+= 4.0 / (1.0 + x * x);
        }
      }
int i;
      for (i = 0; i < NUM_THREADS; i++)
      {
        pi += sum[i] * step;
      }

```



**3.1.3reduction 制导**

+ 在并行域中，使用reduction制导语句将最终结果直接累加到sum变量
+ 省去了for循环的遍历，以及多个线程对数据的读写

```c
#pragma omp parallel  //开始并发执行
      {
        double x,sum=0.0; 
        int id , i;
        id = omp_get_thread_num(); //获取每个线程的id编号
        #pragma omp parallel for reduction(+:sum)
        for (i=id; i < num_steps; i = i + NUM_THREADS)
        {
          x = (i - 0.5) * step; 
          sum += 4.0 / (1.0 + x * x);
        }
        //printf("%f\n",sum);
        //#pragma omp critical
        pi+=sum*step;
       }
```



### 3.2MPI多进程模式



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



### 3.3MPI和OpenMPI混合模式



```c
 #include "mpi.h"
  #include "omp.h"
  #include <math.h>
  #include <stdio.h>
  #define N 1000000000
  int main(int argc, char *argv[])
  {
    int rank, nproc;
    int i, low, up;
    double local = 0.0, pi, w, temp, t0, t1;
    MPI_Status status;
    MPI_Init(&argc, &argv);
    MPI_Comm_size(MPI_COMM_WORLD, &nproc); //进程数
    MPI_Comm_rank(MPI_COMM_WORLD, &rank); //进程身份
    t0 = MPI_Wtime();
    w = 1.0 / N;
    low = rank * (N / nproc); //每个进程计算的范围
    up = low + N / nproc - 1;
  #pragma omp parallel for reduction(+ : local) private(i,tmp) //线程间通信计算
    for (i = low; i < up; i++)
    {
      temp = (i + 0.5) * w;
      local = local + 4.0 / (1.0 + temp * temp);
    }
    MPI_Reduce(&local, &pi, 1, MPI_DOUBLE, MPI_SUM, 0, MPI_COMM_WORLD); //进程间通信获取结果，发送给0号进程的pi
    if (rank == 0)
      printf("pi = %.20f\n", pi * w); //0号进程获取最终结果
    t1 = MPI_Wtime();
    if (rank == 0)
      printf("time used = %.2f\n", t1 - t0); //打印时间
    MPI_Finalize();
  }
```



#### 3.4 并行效率与加速比



