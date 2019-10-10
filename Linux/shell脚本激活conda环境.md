# shell脚本激活Conda环境

### 不知道为啥出错误的用法

一开始使用conda的说明

```bash
#!/usr/bash
conda init bash
conda activate MACS
```

结果总是报错

```bash
CommandNotFoundError: Your shell has not been properly configured to use 'conda activate'.
To initialize your shell, run

    $ conda init <SHELL_NAME>

Currently supported shells are:
  - bash
  - fish
  - tcsh
  - xonsh
  - zsh
  - powershell
```



### 不知道为啥正确的用法

```bash
#!/usr/bin/bash
source /path_to_conda/activate MACS
```


### 参考

[https://heary.cn/posts/%E5%9C%A8Shell%E6%88%96Bat%E8%84%9A%E6%9C%AC%E4%B8%AD%E6%BF%80%E6%B4%BBconda%E7%8E%AF%E5%A2%83/](https://heary.cn/posts/在Shell或Bat脚本中激活conda环境/)