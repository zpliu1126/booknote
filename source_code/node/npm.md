# ndoe模块加载规则

+ 核心模块

+ 第三方模块

+ 自己写的脚本

  

> :alien: 1.核心模块已经被编译成二进制代码，所以在加载的时候直接使用包名字便可

```javascript
require("fs")
```

***

> :dog: 2.第三方模块使用npm工具下载

```javascript
npm i art-template
下载完成之后在node_module/art-temple目录下有，当前模块的源文件，以及一些配置文件
```

在package.json记录了关于当前包的一些信息，及加载路径和加载的源代码

```bash
"_where": "/var/www/html/node/lesson/test",
"main": "index.js",
```

 + _where记录了包的位置信息
 + main 记录了加载的文件

**index.js**文件又会加载包中其他的文件

```javascript
const template = require('./lib/index');
const extension = require('./lib/extension');

template.extension = extension;
require.extensions[template.defaults.extname] = extension;

module.exports = template;//最后导出的名字
```



# :warning:

当package.json文件不存在或者main中指定的文件不存在的时候，或加载当前目录下的index.js文件；

如果当前所有的条件都不满足时，会往上一级目录进行遍历，直到磁盘根目录



注意第三方模块以及自己写的模块在名称上是不能够重名的**



### :rescue_worker_helmet:常用的npm，命令

​	

 + npm init -y

   初始化npm模块文件，会跳过引导

   

+ npm install --save packageName

   下载包并且在package.json中保存依赖关系

+ npm uninstall --save packageName

   删除包和package.json中的依赖关系

### 当npm下载速度比较慢的时候可以使用cnpm进行下载

```javascript
npm install --global cnpm 
//之后可以使用cnpm进行下载
cnpm init -y 
cnpm install art-template 

```

### package.json与package-lock.json文件区别

  + package.json

    文件中记录了你需要安装的模块，例如当安装express模块时：

    npm 首先安装express模块，之后根据express文件夹中的package.json去下载对应的依赖

  + package-lock.json

    + 锁住版本
    + 更快的安装依赖信息

    文件中保存了所有依赖包的下载信息，就不用一步一步去分析模块中的依赖关系，从文件名字来看有一个lock就是锁定对应的版本，当你项目进行迁移的时候package-lock.json文件会告诉npm去下载对应的版本；而package.json文件默然是下载最新版本。