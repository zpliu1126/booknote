+ 固定步长num_step=10000000

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

### 4.critcal 和reduction制导
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

### 5.cirtical和lastprivate制导
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