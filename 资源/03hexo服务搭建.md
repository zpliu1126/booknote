# hexo服务搭建

 	{% label success@Hexo %} 一款简洁并且高效的博客框架，结合markdown语法，让你的想法展现的淋漓尽致。通过本地编译markdown文件生成html 静态文件，部署到云端；使得笔记得到永久保存。利用Github、腾讯云等免费代码仓库存储服务，让你能够随时随地编辑；不受设备影响。

<!--more-->

### 1.初始化hexo

​	在命令行中运行一下命令

```bash
#初始化hexo
hexo init <folder_name>
cd <folder_name>
#下载相关依赖
npm i
```

​	hexo 初始化完成之后，在`folder_name`目录下将会产生一下文件和文件夹



​	hexo相关的命令均需要在bash中进入`folder_name`目录后运行

```bash
#启动本地预览
hexo s
#将md文件编译为html
hexo g
```

​	启动本地预览后，访问网址可以查看到静态网页

>  http://localhost:4000/ 



### 2.部署到云端



#### 2.1GithubPage进行部署

1. 在github中创建一个仓库

2. 将hexo push到github仓库中

下载对应的插件

`--save`参数会将插件信息保存在`package.json`文件中

```bash
npm install hexo-deployer-git --save
```

配置站点目录下`_config.yml`文件

```bash
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repo: git@github.com:zpliu1126/codeHub.git
  branch: gh-pages
```

部署实际上就是在将hexo编译生成的`public`目录下的所有文件推送到云端

部署完成后通过访问网址即可访问到hexo静态博客

>  https://<Github账号名称>.github.io /仓库名



#### 2.2部署到腾讯云

当有多个云端时，配置文件如下进行配置

```bash
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
 -  type: git
    repo: git@github.com:zpliu1126/codeHub.git
    branch: gh-pages
 -  type: git
    repo: git@e.coding.net:biocodehub/codeHub.git
    branch: master
```



### 3.自定义主题

​	hexo中默认的主题是`landscape`，可以在github中搜索对应的主题选择下载

#### 3.1主题安装

我这里使用到的是`next`主题

1. 下载对应的主题文件
2. 将主题整个文件夹粘贴到`themes`目录下
3. 更改站点文件夹配置文件中theme字段为对应的主题名

```bash
#下载对应的主题 
git clone https://github.com/theme-next/hexo-theme-next themes/next
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: next
```



#### 3.2主题优化

`Next`主题优化官方文档

>  https://theme-next.org/docs/theme-settings/ 

+ 自定义样式文件

  `Next`最新版主题支持将样式文件放置在主题文件夹之外，只需要在主题文件夹中进行配置

```bash
custom_file_path:
  #head: source/_data/head.swig
  #header: source/_data/header.swig
  #sidebar: source/_data/sidebar.swig
  #postMeta: source/_data/post-meta.swig
  #postBodyEnd: source/_data/post-body-end.swig
  #footer: source/_data/footer.swig
   style: source/_data/styles.styl
```

+ 添加背景图片

  添加主题自定义样式
  
  ***修改样式时，最后将public文件夹全部删除，然后`hexo g`重新编译生成css文件***

```bash
body{
    background:url(/images/themeImg/splash.png);
    background-size:cover;
    background-repeat:no-repeat;
    background-attachment:fixed;
    background-position:center;
}
```

+ 转载协议

```bash
creative_commons:
  license: by-nc-sa
  sidebar: true
  post: true
  language:

```

+ 自定义`logo`

```bash
# Custom Logo (Do not support scheme Mist)
custom_logo: /images/themeImg/logo.png
```

+ 代码高亮显示和复制按钮

```bash
codeblock:
  # Code Highlight theme
  # Available values: normal | night | night eighties | night blue | night bright | solarized | solarized dark | galactic
  # See: https://github.com/chriskempson/tomorrow-theme
  highlight_theme: night
  # Add copy button on codeblock
  copy_button:
    enable: true
    # Show text copy result.
    show_result: true
    # Available values: default | flat | mac
    style:
```

+ 阅读进度条

```bash
reading_progress:
  enable: true
  color: "#37c6c0"
  height: 2px
```

+ 书签

  当下次访问时自动滚动到对应位置

```bash
bookmark:
  enable: false
  # Customize the color of the bookmark.
  color: "#222"
  # If auto, save the reading progress when closing the page or clicking the bookmark-icon.
  # If manual, only save it by clicking the bookmark-icon.
  save: auto
```

+ Follow me 标签

```bash
# Follow me on GitHub banner in right-top corner.
github_banner:
  enable: true
  permalink: https://github.com/yourname
  title: Follow me on GitHub
```

+ 字体设置

  `Next`为5中类型提供字体设置

  + 全局字体设置
  + title字体设置
  + 标题字体设置 h1 、h2
  + 文章字体设置
  + 代码字体设置

```bash
font:
  # Use custom fonts families or not.
  # Depended options: `external` and `family`.
  enable: true

  # Uri of fonts host, e.g. //fonts.googleapis.com (Default).
  host:

  # Font options:
  # `external: true` will load this font family from `host` above.
  # `family: Times New Roman`. Without any quotes.
  # `size: x.x`. Use `em` as unit. Default: 1 (16px)

  # Global font settings used for all elements inside <body>.
  global:
    external: true
    family: Monda
    size: 1.125

  # Font settings for site title (.site-title).
  title:
    external: true
    family: Lobster Two
    size:

  # Font settings for headlines (<h1> to <h6>).
  headings:
    external: true
    family: Amita
    size:

  # Font settings for posts (.post-body).
  posts:
    external: true
    family: Roboto Slab

  # Font settings for <code> and code blocks.
  codes:
    external: true
    family: PT Mono
```



+ 安装插件

  支持两种安装方法

  1. 本地安装
  2. 使用CDN links

  如果你的站点是部署在一些免费的云端，推荐使用CDN links，因为它加载起来更快

  **本地安装**

```bash
#在bash中安装下载对应插件
$ cd themes/next
$ git clone https://github.com/theme-next/theme-next-pjax source/lib/pjax
# 启用pjax插件
# Easily enable fast Ajax navigation on your website.
# Dependencies: https://github.com/theme-next/theme-next-pjax
pjax: true
```

CDN links 安装

>  jsDelivr CDN is recommended to deliver our third-party plugins 

```bash
# Script Vendors. Set a CDN address for the vendor you want to customize.
# Be aware that you would better use the same version as internal ones to avoid potential problems.
# Remember to use the https protocol of CDN files when you enable https on your site.
vendors:
  # Internal path prefix.
  _internal: lib
  pjax: https://cdn.jsdelivr.net/npm/pjax@0.2.8/pjax.min.js
```



+ 设置整体布局

```bash
# Schemes
# scheme: Muse
#scheme: Mist
#scheme: Pisces
scheme: Gemini
```

+ 配置菜单栏
  1. 第一栏表示菜单名
  2. 第二栏表示相对url
  3. `||`后表示icon

```bash
menu:
  home: / || home
  #about: /about/ || user
  #tags: /tags/ || tags
  #categories: /categories/ || th
  archives: /archives/ || archiveasad
```

+ 菜单栏的一些修饰
  + 显示icon
  + 显示条目数

```bash
# Enable / Disable menu icons / item badges.
menu_settings:
  icons: true
  badges: true
```

条目数支持中文

修改`next\layout\_partials\header\menu-item.swig`文件

```bash
    {%- if theme.menu_settings.badges %}
      {%- set badges = {
        '文章'  : site.posts.length,
        '分类': site.categories.length,
        '标签'      : site.tags.length
        }
      %}
```



+ 侧边栏显示头像

  支持将图片放在`theme`文件夹之外，例如在  site directory `source/uploads/` 下

```bash
# Sidebar Avatar
avatar:
  # Replace the default image and set the url here.
  url: /images/avatar.gif
```

+ 编辑站点信息

  + author
  + description

  配置`hexo/_config.yml`文件

```bash
# Site
author:
description:
```



### 4.第三方评论系统

|                                             | 推荐指数 | 优点                        | 缺点               |
| :------------------------------------------ | :------- | :-------------------------- | :----------------- |
| [Valine](https://valine.js.org/)            | 4        | 每天30000条评论，10GB的储存 | 作者评论无标识     |
| [来必力/livere](https://livere.com/)        | 4        | 多种账号登录                | 评论无法导出       |
| [畅言](http://changyan.kuaizhan.com/)       | 3        | 美观                        | 必须备案域名       |
| [gitment](https://github.com/imsun/gitment) | 3        | 简洁                        | 只能登陆github评论 |
| Disqus                                      | 1        |                             | 需要翻*墙          |

#### 4.1Valine

注册Valine账户

> https://leancloud.cn/dashboard/applist.html

文章中添加字段

`comments: true`

主题文件中进行设置

```bash
valine:
  enable: true
  appid:  # Your leancloud application appid
  appkey:  # Your leancloud application appkey
  notify: false # Mail notifier
  verify: false # Verification code
  placeholder: Just go go # Comment box placeholder
  avatar: mm # Gravatar style
  guest_info: nick,mail,link # Custom comment header
  pageSize: 10 # Pagination size
  language: zh-cn # Language, available values: en, zh-cn
  visitor: false # Article reading statistic
  comment_count: true # If false, comment count will only be displayed in post page, not in home page
  recordIP: false # Whether to record the commenter IP
  serverURLs: # When the custom domain name is enabled, fill it in here (it will be detected automatically by default, no need to fill in)
  #post_meta_order: 0
```

### 5.搜索

使用本地插件配置搜索数据库

```bash
npm install hexo-generator-searchdb
```

`hexo/_config.yml`文件配置

```
`search:  path: search.xml  field: post  format: html  limit: 10000`
```

`next/_config.yml`文件中配置

```bash
# Local search
# Dependencies: https://github.com/theme-next/hexo-generator-searchdb
local_search:
  enable: true
  # If auto, trigger search by changing input.
  # If manual, trigger search by pressing enter key or search button.
  trigger: auto
  # Show top n results per article, show all results by setting to -1
  top_n_per_article: 1
  # Unescape html strings to the readable one.
  unescape: false
  # Preload the search data when the page loads.
  preload: false
```



### 6.自定义标签

hexo生成标签页面

```bash
hexo new "新的标签"
```

在标签页面md文件中指定类型为标签

```bash
title: 新的标签
date: 2020-03-22 08:39:29
type: tags
```

在post文章中使用标签

+ 多个标签使用`-`进行区分

```bash
title: hexo服务搭建
comments: true
author: zzz
date: {date}
categories: 
	- test
tags:
	- hexo
```



### 7.首页进行文章截取

编辑`theme/_config.yml`文件

```bash
excerpt_description: true

# Read more button
# If true, the read more button will be displayed in excerpt section.
read_more_btn: true
```

下载对应插件

`npm i hexo-excerpt`

另外一种可以使用`<!-- more -->`在md文件中实现更加精准的控制



### 8.静态资源压缩

一般将css和js文件中的空格和换行符进行压缩，一定程度上能减少网络延迟

+ 安装gulp 命令

  站点根目录下运行

```bash
$ npm install gulp 
```

+ 安装gulp插件

```bash
npm install gulp-minify-css --save
npm install gulp-uglify --save
npm install gulp-htmlmin --save
npm install gulp-htmlclean --save
npm install gulp-imagemin --save
```

+ 压缩规则文件

```bash
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');
// 压缩css文件
gulp.task('minify-css', function() {
  return gulp.src('./public/**/*.css')
  .pipe(minifycss())
  .pipe(gulp.dest('./public'));
});
// 压缩html文件
gulp.task('minify-html',  gulp.series('minify-css',function() {
  return gulp.src('./public/**/*.html')
  .pipe(htmlclean())
  .pipe(htmlmin({
    removeComments: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  }))
  .pipe(gulp.dest('./public'))
}));
// 压缩js文件
gulp.task('minify-js', gulp.series('minify-html',function() {
    return gulp.src(['./public/**/.js','!./public/js/**/*min.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
}));
// 压缩 public/demo 目录内图片
gulp.task('minify-images', gulp.series('minify-js',function() {
    gulp.src('./public/demo/**/*.*')
        .pipe(imagemin({
           optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
           progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
           interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
           multipass: false, //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('./public/uploads'));
}));
// 默认任务
gulp.task('default', gulp.series('minify-css',function() {
  return gulp.src('./public/**/*.css')
  .pipe(minifycss())
  .pipe(gulp.dest('./public'));
}));
```

+ 在hexo 编译生成html文件后执行压缩即可

`hexo g && gulp && hexo d`

​	

### 9.保存原始post文件和主题配置文件

#### 9.1新建空分支

```bash
#先克隆仓库
 git clone git@e.coding.net:biocodehub/codeHub.git
# 进入仓库
cd codeHub
# 创建新的分支
git checkout --orphan source
# 删除当前分支所有文件
git rm -rf .
# 创建一个文件并提交到当前分支
$ echo \"My GitHub Page\" > index.html
$ git add .
$ git commit -a -m \"new branch source\"
$ git push origin source
```

登录远程仓库，手动删除`index.html`就变成空的分支了

#### 9.2提交hexo源码

```bash
# 站点初始化仓库
cd codeHub
git init
# 添加远程地址
git remote add origin “仓库地址"
# 编辑

```

` gitignore`文件 ,选择推送的文件

在添加要推送的文件之间，先将主题下的`\themes\next\.git`文件夹删除，git不允许一个仓库包含另外一个仓库。

```bash
#获取远端分析
git fetch
#切换到origin source分支
git checkout origin/source
#新建本地分支
git checkout -b source
#将本地分支与远端分支关联
git branch -u origin/source source
#开始上传文件
git add .
git commit -m "code Hub source code"
git push origin source
```

#### 9.3克隆远端源码

```bash
$ git clone -b source git@e.coding.net:biocodehub/codeHub.git
$ hexo s
$ npm install hexo-deployer-git -save
# 推送到远端
$ hexo g && gulp hexo d
```



### 10.参考

1. 遇见西门 https://www.simon96.online/2018/10/12/hexo-tutorial/ 
2. Next  https://theme-next.org/docs/ 
3. git仓库推送 https://blog.csdn.net/wankui/article/details/53328369 






