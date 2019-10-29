```c
#include <stdio.h>
#include<malloc.h>
#include "mpi.h"
#define _NUM_STEP 100000 
float

int main(int argc, char *argv[])
{
  int numprocess,rank;
  int* buf;
  float sum,pi;
  MPI_Init(&argc, &argv);
  MPI_Comm_rank(MPI_COMM_WORLD,&rank);
  MPI_Comm_size(MPI_COMM_WORLD, &numprocess);
  if(rank==0){
    buf=(int*)malloc(numprocess*1*sizeof(int));
    for(int i=0;i<numprocess;i++){
      *(buf+i)=i+1; //构造缓冲区数据
    }
    MPI_Scatter(buf,1,MPI_INT,sum,1,MPI_FLOAT,0,MPI_COMM_WORLD);
  }
  MPI_Reduce(&sum,&pi,1,MPI_FLOAT,0,MPI_COMM_WORLD)
  MPI_Finalize();
  return 0;

}
```

