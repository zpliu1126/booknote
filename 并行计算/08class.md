### 混和模式，MPI和openMP求pi
  + `export OMP_NUM_THREADS=2`定义每个进程的线程数


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

### 求数组最大值

```c
   #include "mpi.h"
  #include "omp.h"
  #include <malloc.h>
  #include <unistd.h>
  #include <stdio.h>
  #include <stdlib.h>
  int main(int argc, char *argv[])
  {
    float *Array;
    int rank,numprocess,dimension;
    struct{
      double value;
      int index;
    } in,out;
    double startTime,endTime;
    MPI_Init(&argc,&argv);
    MPI_Comm_rank(MPI_COMM_WORLD,&rank);
    MPI_Comm_size(MPI_COMM_WORLD,&numprocess);
    MPI_Barrier(MPI_COMM_WORLD);
    startTime=MPI_Wtime();
    if(rank==0){
      printf("请输入一个数组长度:\n");
      scanf("%d",&dimension);
    }
    MPI_Bcast(&dimension,1,MPI_INT,0,MPI_COMM_WORLD);//发送每个进程维度
    //初始化数组
  //根据每个进程设置种子
    Array=(float*)malloc(dimension*sizeof(float));
  
    for(int i=0;i<dimension;i++){
        // srand(rank*i+1);
      Array[i]=100.0 * rand() / RAND_MAX;
      }
    //初始化结构体的值
    in.value=0.0;
    for(int i=0;i<dimension;i++){
      if(Array[i]>in.value){
        in.value=Array[i];
        in.index=rank*dimension+i;
      }
    }
    MPI_Reduce(&in,&out,1,MPI_DOUBLE_INT,MPI_MAXLOC,0,MPI_COMM_WORLD);
    MPI_Barrier(MPI_COMM_WORLD);
    endTime = MPI_Wtime() ;
    if(rank==0){
      printf("maxrank= %d, maxindex=%d, maxvalue= %g, time= %g(s)\n", out.index/dimension,out.index%dimension, out.value, endTime-startTime);
    }
    free(Array);
    MPI_Finalize();
    return 0;
  }
```