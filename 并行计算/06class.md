# 06class

### 消息死锁

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