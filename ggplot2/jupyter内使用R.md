今天准备在jupyter notebook内写R了，享受一下一边记笔记一边写代码的乐趣

安装依赖

> 为了能够让Jupyter 里出现R，需要先打开R的命令行，用`devtools`装一个R包`IRkernel/IRkernel`

```bash
install.packages("devtools")
devtools::install_github('IRkernel/IRkernel')
```

激活内核

```bash
IRkernel::installspec()
```

导出Pdf文件失败

```bash
pip install pandoc
```





### 参考

1. https://www.jianshu.com/p/e7b60205cc53

