+ 固定步长num_step=10000000

## 不同模式求pi

### 1.PAD模式下
  ```c
    #include <time.h>
    #include <stdio.h>
    #include <stdlib.h>
    #include "omp.h"
    #include <unistd.h>
    #define NUM_THREADS atoi(getenv("THREAD"))
    #define PAD 8 //跟CPU内存分配有关
    double step;
    static long num_steps;
    int main(int argc ,char *argv[])
    {
    // printf("%f\n",(int)getenv("THREAD"));
      clock_t start_t, end_t;
      double total_t;
      start_t = clock();
      num_steps = 100000000;
      double  pi,sum[NUM_THREADS][PAD];
      pi=0.0;
      step = 1.0 / (double)num_steps; //将1平分成100000步
      omp_set_num_threads(NUM_THREADS); //设置要使用的线程数目
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
      end_t = clock();
      total_t = (double)(end_t - start_t) / CLOCKS_PER_SEC;
      printf("运行时间为%fs\t%.10f\n", total_t, pi);
      //printf("PATH%d\n",atoi(getenv("THREAD")));
      return 0;
    }
  ```

###  2.并行域
```c
    #include <time.h>
    #include <stdio.h>
    #include <stdlib.h>
    #include "omp.h"
    #include <unistd.h>
    #define NUM_THREADS atoi(getenv("THREAD"))
    //#define PAD 8 //跟CPU内存分配有关
    double step;
    static long num_steps;
    int main(int argc ,char *argv[])
    {
    // printf("%f\n",(int)getenv("THREAD"));
      clock_t start_t, end_t;
      double total_t;
      start_t = clock();
      num_steps = 100000000;
      double  pi,sum[NUM_THREADS];
      pi=0.0;
      step = 1.0 / (double)num_steps; //将1平分成100000步
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
        //printf("%f\n",sum);
        //#pragma omp critical
        //pi+=sum*step;
        
      }
      int i;
      for (i = 0; i < NUM_THREADS; i++)
      {
        pi += sum[i] * step;
      }
      end_t = clock();
      total_t = (double)(end_t - start_t) / CLOCKS_PER_SEC;
      printf("运行时间为%fs\t%.10f\n", total_t, pi);
      //printf("PATH%d\n",atoi(getenv("THREAD")));
      return 0;
    }
```

### 3.critical 制导

```c
    #include <time.h>
    #include <stdio.h>
    #include <stdlib.h>
    #include "omp.h"
    #include <unistd.h>
    #define NUM_THREADS atoi(getenv("THREAD"))
    //#define PAD 8 //跟CPU内存分配有关
    double step;
    static long num_steps;
    int main(int argc ,char *argv[])
    {
    // printf("%f\n",(int)getenv("THREAD"));
      clock_t start_t, end_t;
      double total_t;
      start_t = clock();
      num_steps = 100000000;
      double  pi;
      pi=0.0;
      step = 1.0 / (double)num_steps; //将1平分成100000步
      omp_set_num_threads(NUM_THREADS); //设置要使用的线程数目
    #pragma omp parallel  //开始并发执行
      {
        double x,sum=0.0;
        int id , i;
        id = omp_get_thread_num(); //获取每个线程的id编号
        //#pragma omp parallel for reduction(+:sum)
        for (i=id; i < num_steps; i = i + NUM_THREADS)
        {
          x = (i - 0.5) * step; 
          sum += 4.0 / (1.0 + x * x);
        }
        //printf("%f\n",sum);
        #pragma omp critical
        pi+=sum*step;
        
      }
      end_t = clock();
      total_t = (double)(end_t - start_t) / CLOCKS_PER_SEC;
      printf("运行时间为%fs\t%.10f\n", total_t, pi);
      //printf("PATH%d\n",atoi(getenv("THREAD")));
      return 0;
    }
```

### 4.reduction制导
```c
    #include <time.h>
    #include <stdio.h>
    #include <stdlib.h>
    #include "omp.h"
    #include <unistd.h>
    #define NUM_THREADS atoi(getenv("THREAD"))
    //#define PAD 8 //跟CPU内存分配有关
    double step;
    static long num_steps;
    int main(int argc ,char *argv[])
    {
    // printf("%f\n",(int)getenv("THREAD"));
      clock_t start_t, end_t;
      double total_t;
      start_t = clock();
      num_steps = 100000000;
      double  pi;
      pi=0.0;
      step = 1.0 / (double)num_steps; //将1平分成100000步
      omp_set_num_threads(NUM_THREADS); //设置要使用的线程数目
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
      end_t = clock();
      total_t = (double)(end_t - start_t) / CLOCKS_PER_SEC;
      printf("运行时间为%fs\t%.10f\n", total_t, pi);
      //printf("PATH%d\n",atoi(getenv("THREAD")));
      return 0;
    }
```

### 5.lastprivate制导
```c
    #include <time.h>
    #include <stdio.h>
    #include <stdlib.h>
    #include "omp.h"
    #include <unistd.h>
    #define NUM_THREADS atoi(getenv("THREAD"))
    //#define PAD 8 //跟CPU内存分配有关
    double step;
    static long num_steps;
    int main(int argc ,char *argv[])
    {
    // printf("%f\n",(int)getenv("THREAD"));
      clock_t start_t, end_t;
      double total_t;
      start_t = clock();
      num_steps = 100000000;
      double  pi;
      pi=0.0;
      step = 1.0 / (double)num_steps; //将1平分成100000步
      omp_set_num_threads(NUM_THREADS); //设置要使用的线程数目
    #pragma omp parallel  //开始并发执行
      {
        double x,sum=0.0;
        int id , i;
        id = omp_get_thread_num(); //获取每个线程的id编号
        #pragma omp parallel for lastprivate(sum)
        for (i=id; i < num_steps; i = i + NUM_THREADS)
        {
          x = (i - 0.5) * step; 
          sum += 4.0 / (1.0 + x * x);
        }
        //printf("%f\n",sum);
        pi+=sum*step;
        
      }
      end_t = clock();
      total_t = (double)(end_t - start_t) / CLOCKS_PER_SEC;
      printf("运行时间为%fs\t%.10f\n", total_t, pi);
      //printf("PATH%d\n",atoi(getenv("THREAD")));
      return 0;
    }
```



## 计算数列加和

> 两者之间效率差别的原因

+ PAD方法
  + 虽然使用了二维数组，防止了数据写入时的阻塞；但在求终止结果时使用了For循环
+ lastprivate制导
  + 对局部sum变量进行了深度拷贝，在退出for循环时，将结果存在各自的sum变量中，各个线程分别对全局变量K做累加

### 1.PAD方法

```c
#include <time.h>
#include <stdio.h>
#include <stdlib.h>
#include "omp.h"
#include <unistd.h>
#define NUM_THREADS atoi(getenv("THREAD"))
#define PAD 8 //跟CPU内存分配有关
double step;
static long num_steps;
int main(int argc, char *argv[])
{
  clock_t start_t, end_t;
  double total_t;
  start_t = clock();
  num_steps = 1000000;
  double pi, sum[NUM_THREADS][PAD];
  pi = 0.0;
  omp_set_num_threads(NUM_THREADS); //设置要使用的线程数目
#pragma omp parallel                //开始并发执行
  {
    double x;
    int id, i;
    id = omp_get_thread_num(); //获取每个线程的id编号
    for (i = id+1; i <=num_steps; i = i + NUM_THREADS)
    {
      x=(3*i+3);
      sum[id][0] += x;
    }
  }
  int i;
  for (i = 0; i < NUM_THREADS; i++)
  {
    pi += sum[i][0];
  }
  end_t = clock();
  total_t = (double)(end_t - start_t) / CLOCKS_PER_SEC;
  printf("运行时间为%fs\t%.10f\n", total_t, pi/2.0);
  return 0;
}
```

### 2.lastprivate制导

```c
#include <time.h>
#include <stdio.h>
#include <stdlib.h>
#include "omp.h"
#include <unistd.h>
#define NUM_THREADS atoi(getenv("THREAD"))
double step;
static long num_steps;
int main(int argc, char *argv[])
{
  clock_t start_t, end_t;
  double total_t;
  start_t = clock();
  num_steps = 1000000;
  double pi;
  pi = 0.0;

  omp_set_num_threads(NUM_THREADS); //设置要使用的线程数目
#pragma omp parallel                //开始并发执行
  {
    double x,sum=0.0;
    int id, i;
    id = omp_get_thread_num(); //获取每个线程的id编号
    #pragma omp parallel for lastprivate(sum)
    for (i = id+1; i <=num_steps; i = i + NUM_THREADS)
    {
      x=(3*i+3);
      sum += x;
    }
    pi+=sum;
  }
  end_t = clock();
  total_t = (double)(end_t - start_t) / CLOCKS_PER_SEC;
  printf("运行时间为%fs\t%.10f\n", total_t, pi/2.0);
  //printf("PATH%d\n",atoi(getenv("THREAD")));
  return 0;
}
```



## 计算二维矩阵累加和累积

### 数组指针的理解

`*`符号表示获取指针指向的值，具体的来讲就是下面这张图的理解

![数组指针](https://43423.oss-cn-beijing.aliyuncs.com/img/20191010211434.png)

```c
  //定义数组
  int Array[4][4]={1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4};
  int i,j;
  for(i=0;i<4;i++){
   for(j=0;j<4;j++){
    printf("%d\t",*(*Array+5)); //先获取第二行，第2个元素的指针 +3==》+2，最外面的*是获取对应指针的值
   }
   printf("\n");
  }
```







