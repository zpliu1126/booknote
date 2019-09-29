### PacBio三代全长转录组测序

1. ### 安装SMART软件

   从网站https://www.pacb.com/support/software-downloads/下载SMART-Link软件

   ```bash
   ./smrtlink_7.0.1.66975.run  --rootdir  /public/home/zpliu/software/smrtlink --smrttools-only
   ```

   + --rootdir 指定安装路径
   + --smrttools-only 只安装命令行工具，反正服务器里你图形界面也看不到

   版本升级，下载升级版本的安装文件，然后只需要在安装的命令上面加个参数就行

   ```bash
   ./新版本的安装程序  --rootdir  /public/home/zpliu/software/smrtlink --smrttools-only  --upgrade
   ```

   

   之后将安装的命令添加到环境变量中

   ```bash
   export PATH=" /public/home/zpliu/software/smrtlink/smrtcmds/bin:$PATH"
   ```

2. 使用**CCS**对原始数据进行过滤

   ```
   
   ```













### 参考

PacBio官方SMART软件使用说明**V8版本的**

https://www.pacb.com/wp-content/uploads/SMRT-Tools-Reference-Guide-v8.0.pdf

https://www.cnblogs.com/RyannBio/p/9598340.html