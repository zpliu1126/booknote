# 05Class
基于通信的并行化
### MPI2.0

+ 单边通信
+ 动态进程管理
+ I/O文件输入与输出
#### 接口实现
+ MPICH
+ Open MPI
+ LAM

#### 使用openmpi

```bash
  #源代码安装
   Sudo mkdir –p /opt/openmp/4.0.0_gcc
   Mkdir build
   Cd build
   ../configure CC=gcc FC=gfortran CXX=g++
   --prefix=/opt/openmp/4.0.0_gcc
   Make –j4 //多线程编译
   Make install (sudo )
   # 加入环境变量
  export MPI_LOC=/opt/openmpi/4.0.0_gcc
  export MPI_LIB=$MPI_LOC/lib
  export MPI_INCLUDE=$MPI_LOC/bin
  export LD_LIBRARY_PATH=$MPI_LOC/lib:$LD_LIBRARY_PATH
  PATH=$MPI_LOC/bin:$PATH 
  export PATH
   ## 集群直接load
  module load mpi/openmpi/3.1.1rc1
```

### MPI运行实例
```bash
  ##  编译
  mpicc -o hello hello.c
  ## 运行启动4个进程
  mpirun -np 4 PATH_to_hello/hello 
  ## 错误用法，MPI编译的可执行程序，只能使用mpirun运行；而使用gcc编译的可执行程序，也可以使用mpirun运行
  ./hello 错误用法
```
#### who am I
+ 编译`mpigcc  -o hello  test5.c`
+ 运行`mpirun  -np 4 ~/ClassTest/05/hello`
获取进程编号和进程数目
+ `MPI_Comm_rank(MPI_COMM_WORLD,&myid)`获取进程编号
+ `MPI_Comm_size(MPI_COMM_WORLD,&numprocs)`获取总的进程数目

```bash
  #include <stdio.h>
  #include "mpi.h"
  int main( int argc, char *argv[] )
  {
    int  myid, numprocs;
    MPI_Init( &argc, &argv );
    MPI_Comm_rank( MPI_COMM_WORLD, &myid );
    MPI_Comm_size( MPI_COMM_WORLD, &numprocs );
    printf("I am %d of %d\n", myid, numprocs );
    MPI_Finalize();
  }
```



