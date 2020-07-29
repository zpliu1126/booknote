## SequenceServer搭建网页服务



### 安装

sequenceserver基于`ruby`开发的，所以得先下载`ruby`

```bash
yum install rubygems ruby-devel
yum install ruby ruby-dev rubygems-integration
gem install sequenceserver 
```

> 安装`sequenceserver`过程中报错 undefined method `slice!' for nil:NilClass
>
> 由于我的版本是centos6，版本太低了；yum源里面安装的ruby版本只有1.8.7；只能自己冲源代码安装
>
> 参考 https://blog.csdn.net/zoujian1993/article/details/84338443



首先使用yum安装依赖

```bash
yum install -y openssl
yum install -y openssl-devel
```

从源代码安装ruby 

> 下载地址 https://www.ruby-lang.org/zh_cn/downloads/

```bash
wget -c https://cache.ruby-lang.org/pub/ruby/2.7/ruby-2.7.1.tar.gz
cd 
./configure
make
make install
##安装sequenceserve
gem install sequenceserver 
```

### 配置sequenceServe

sequenceServe默认的配置文件为`~/.sequenceserver.conf`；也可以使用`-c`参数指定对应的配置文件

增加配置信息到对应的配置文件`-s`参数

```bash
## 指定blast+ 的路径和blast库位置
sequenceserver  -c ./sequenceserve.conf  -s -b /usr/local/bin/blastn/bin -d dataBase
##配置完成后，启动程序
sequenceserver  -c ./sequenceserve.conf -D  -H 0.0.0.0
```

> 访问地址：默认情况下是 http://localhost:4567

其他配置参数

| Configuration file | Command line        | Description                                |
| :----------------- | :------------------ | :----------------------------------------- |
| :bin:              | -b / --bin          | Indicates path to the BLAST+ binaries.     |
| :database_dir:     | -d / --database_dir | Indicates path to the BLAST+ databases.    |
| :num_threads:      | -n / --num_threads  | Number of threads to use for BLAST search. |
| :host:             | -H / --host         | Host to run SequenceServer on.             |
| :port:             | -p / --port         | Port to run SequenceServer on.             |
| :require:          | -r / --require      | Load extension from this file.             |

### 创建blast库

> 参考 http://sequenceserver.com/doc/#database

为了提高数据下载功能，可以在node中建一个软连接把这里的基因组数据给导过去

blast索引文件和fasta文件都放在同一个目录下，程序将会递归的搜索

```bash
makeblastdb -in Gbarbadense_gene_transcripts.fasta -title Gbarbadense_HAU_transcripts_v2.0 -parse_seqids  -dbtype nucl
##将会再fasta所在目录生成对应的索引文件
##
```

#### 使用NCBI库

不仅仅可以·比对本地库，sequenceserve同样还可以比对到NCBI中已经发表的库

这个之后再实现一下

### 更改UI设置

打算使用`iframe`标签直接把sequencceserver页面引用过去，仅仅改一下UI界面。有两种方法

第一种从源代码更改

下载源代码：地址 https://github.com/wurmlab/sequenceserver/releases

> 参考 https://github.com/wurmlab/sequenceserver#develop-and-contribute

```bash
###普通用户安装
bundle install --path vendor/bundle --without=development
##去除navbar导航栏，同时给表单增加一个value值
sequence版本1.014 对应文件 sequenceserver-1.0.14/views/search.erb
```

第二种从gem安装文件中更改

> 参考 https://blog.csdn.net/u014621915/article/details/62221705

```bash
gem environment
#
  - GEM PATHS:
     - /usr/local/lib/ruby/gems/2.7.0
     - /root/.gem/ruby/2.7.0
     
##进入对应的目录，在进入sequenceserver源代码目录
cd /usr/local/lib/ruby/gems/2.7.0/gems/sequenceserver-1.0.14/
```

修改`views`目录下对应的`erb`文件，打算删除掉那个navbar，只用删除search.reb后在重新编译

### 配合JBrowse使用

> 参考 https://jbrowse.org/docs/faq.html#how-can-i-link-blast-results-to-jbrowse

```bash

```



