# vim常见使用方法



## 代码提示插件

###  安装install

下载AutoComplPop插件，将压缩包解压，将每个文件依次放入家目录`~/.vim`文件夹中

```bash
## 如果.vim文件夹中不存在对应的文件夹，则手动创建一个，目录结构如下
.
├── autoload
│   └── acp.vim
└── plugin
    └── acp.vim
```

>  INSTALLATION                        *acp-installation*
>
> Put all files into your runtime directory. If you have the zip file, extract
> it to your runtime directory.
>
> You should place the files as follows:
> \>
>     <your runtime directory>/plugin/acp.vim
>     <your runtime directory>/doc/acp.txt
>     ...
> < 

![补齐提示效果](https://s2.ax1x.com/2019/12/04/Q1Lsne.png)

## 常用快捷键

1. 在命令行模式下使用`yy`复制光标所在行
2. 在命令行模式下使用`dd`删除光标所在行
3. 在命令行模式下使用`p`粘贴`yy`所复制的行
4. 在命令模式下使用`u`进行撤回
5. 在输入模式下使用`shift +insert`粘贴剪切板内容



### 参考

1. [AutoComplPop]( [https://www.vim.org/scripts/script.php?script%5Fid=1879](https://www.vim.org/scripts/script.php?script_id=1879) )
2. vim常用快捷键  https://www.cnblogs.com/hustcat/articles/1791371.html 