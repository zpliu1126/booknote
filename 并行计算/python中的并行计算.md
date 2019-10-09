# 使用python3中的threading模块进行简单的并行计算



首先将需要干的事情封装成一个threading类

+ 在`__int_`构造函数中初始化threading类，同时给私有变量赋值
+ `run`方法定义线程需要干的事情，当然干的事情也可以封装在当前类之中;获取使用全局的方法；我这里是在类中进行方法的定义

```python

exitflag=0
class myThread(threading.Thread):
  def __init__(self,threadID,name,counter):
    threading.Thread.__init__(self)
    self.threadID=threadID
    self.name=name
    self.counter=counter

  def run(self):
    print("线程开始"+self.  name)
    self.print_time(5)
    print("退出线程"+self.name)

  def print_time(self,delay):
    while self.counter:
      if exitflag:
        self.name.exit()
      time.sleep(delay)
      print("%s: %s\t%s" %(self.name,self.counter,time.ctime(time.time())))
      print("活跃的线程数为:%s" %(threading.active_count()))
      self.counter-=1
```

构造threading对象

+ threading类中已经为我们封装好了几个方法，可以直接使用
  + start方法，将会开始一个线程；相当于执行对象中定义好的run方法；
  + join方法会阻塞主线程的运行；相当于主线程开辟两个子线程之后就停下来等待子线程运行结束

```python
thread1=myThread(1,"thread1",2)
thread2=myThread(2,"thread2",4)
thread1.start()
thread2.start()
thread1.join()
thread2.join()
print("活跃的线程数为:%s" %(threading.active_count()))
print("退出主线程!")
```



+ threading模块中还存在一些只有threading类的方法
  - threading.currentThread(): 返回当前的线程变量。
  - threading.enumerate(): 返回一个包含正在运行的线程的list。正在运行指线程启动后、结束前，不包括启动前和终止后的线程。
  - threading.activeCount(): 返回正在运行的线程数量，与len(threading.enumerate())有相同的结果。

最终程序的运行结果

```bash
线程开始thread1
线程开始thread2
thread1: 2	Thu Sep 26 00:00:32 2019
活跃的线程数为:3
thread2: 4	Thu Sep 26 00:00:32 2019
活跃的线程数为:3
thread1: 1	Thu Sep 26 00:00:37 2019
活跃的线程数为:3
退出线程thread1
thread2: 3	Thu Sep 26 00:00:37 2019
活跃的线程数为:2
thread2: 2	Thu Sep 26 00:00:42 2019
活跃的线程数为:2
thread2: 1	Thu Sep 26 00:00:47 2019
活跃的线程数为:2
退出线程thread2
活跃的线程数为:1
退出主线程!

```

流程图大概就是这样子的

<img src="https://43423.oss-cn-beijing.aliyuncs.com/img/20190926001001.png"/>

