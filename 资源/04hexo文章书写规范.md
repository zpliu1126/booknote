

## 文章书写规范



### 1.生成一篇空白markdown文件

+ 在生成新的markdown时，加上数字编号，以便以后方便查看
+ 当然在文章属性栏，把数字去掉这样在网页上就不会看到这个编号了

```bash
hexo new "05hexo文章发布"
```

空白mrakdown生成后便如下所示:



![空白文件](https://43423.oss-cn-beijing.aliyuncs.com/img/20200323104754.png)

### 2.给文章分类或者加标签

+ 在文章属性栏进行修改，一篇文章可以有多个分类和标签
+ 注意`-`和标签名之间的空格

```bash
title: 05hexo文章发布
comments: true
author: zpliu
date: 2020-03-23 10:10:41
categories:
	- RNA-seq
	- Circos
Tags:
 	- hexo
```



### 3.创建新的标签或者分类

当你写好一篇文章后发现没有你想要的分类或者标签时，可以自己手动创建对应的标签或者分类

```bash
hexo new page "新的标签名"
```

创建好后修改对应的标签文件`source/新的标签名/index.md`

+ 如果是标签则增加`type`属性为`tags`
+ 如果是分类则增加`rype`属性为`catrgories`

```bash
title: 新的标签名
date: 2020-03-22 21:56:41
type: tags
```

### 4.文章书写好后进行发布

首先在将云端源代码全部pull下来

> 因为这个项目是多个人共同编辑的，你需要将别人写好的源代码同样的拉到本地，进行编译

```bash
git pull origin source
```

在将源代码更新到最新状态后，对markdown文件进行编译

```bash
hexo clean
hexo g
gulp 
hexo d --message "comments"
```

### 5.上传源代码

在发布完成后，同样的需要将你的源代码上传到仓库中，因为其他人在发布文章的时候同样需要用到你的源代码进行编译

需要注意的是，对于仓库中一下文件不需要做修改

+ `theme/`下所有文件
+ `_confg.yml`文件

以上就完成了文章的发布，尽情享受hexo带来的便捷吧!

