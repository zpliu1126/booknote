# fasta文件校验



### 1.获取文件对象

+ 使用拖拽事件，移动文件
+ `dataTransfer.files`获取拖拽文件

```javascript
this.fileData = e.dataTransfer.files[0]
```

### 2.读取文件数据

+ 使用`FileReader`对象读取文件对象内容
+ 作为字符窜进行读取，触发`load`事件

```javascript
var reader = new FileReader()
reader.readAsText(fileData, 'utf-8') // 触发load事件
 reader.onload = function () {
  reader.result //文件内容
 }
```

### 3.匹配核酸序列与蛋白序列

创建正则表达式对核酸序列与蛋白序列进行匹配

+ 核苷酸序列，除了`A T C G N `几种碱基外还有换行符`\n`
+ `i`忽略大小写，`m`多行匹配

```javascript
var Basepattern = /[^ATCGN\n\r]/im // 匹配除这些字符之外的字符
```

+ 蛋白序列就包含20中氨基酸缩写和换行符

```javascript
 var ProteinPattern = /[^GAVLIPFYWSTCMNQDEKRH\\*\r\n]/im
```

+ 提取核苷序列与蛋白序列,`slice`忽略第一个空白字符

```javascript
var sequenceArray = reader.result.split(/>[^\n]+\n/).slice(1)
```

+ 遍历所有序列

> 只有序列中有一条满足正则表达式，则表示错误的序列格式；并返回true；
>
> 而蛋白序列的校验时还多了一条规则，因为蛋白序列都是以甲硫氨酸开头，并且核酸的基因缩写与氨基酸缩写重叠了不能够区分蛋白序列与氨基酸序列

```javascript
    BaseFlag = sequenceArray.some((sequence) => {
      return Basepattern.test(sequence)
    })
    ProteinFlag = sequenceArray.some((sequence) => {
      return ProteinPattern.test(sequence) || /^[^M]/i.test(sequence)
      // 核苷酸序列碱基缩写被氨基酸序列覆盖，所有必须以M氨基酸开头才是蛋白序列
    })
```

### 4.回调函数获取校验结果

因为onload函数是异步的，所以有可能出现文件还没校验完，客户端状态就已经发生改变；所以使用回调函数获取校验结果

```javascript
validateFasta(this.fileData, (BaseFlag, ProteinFlag) => {
          if (BaseFlag && ProteinFlag) {
            this.showModal = true
            this.Modalmessage = 'error fasta file'
            this.ModalFontColor = { color: '#d63031' }
            this.Modalicon = 'el-icon-check'
            setTimeout(() => { this.showModal = false }, 1000)
          } else if (!BaseFlag) {
            this.showModal = true
            this.Modalmessage = 'Nucleic acid sequence file'
            this.ModalFontColor = { color: '#4cd137' }
            this.Modalicon = 'el-icon-close'
            setTimeout(() => { this.showModal = false }, 1000)
          } else if (!ProteinFlag) {
            this.showModal = true
            this.Modalmessage = 'Protein sequence file'
            this.ModalFontColor = { color: '#4cd137' }
            this.Modalicon = 'el-icon-close'
            setTimeout(() => { this.showModal = false }, 1000)
          }
        })
```

### 5.校验完成后将数据提交后台

客户端使用`FormData`对象可以同时提交文件与表单，在后台借助`connect-multiparty`插件获取上传的文件

+ 将文件数据与表单数据合并
+ 表单数据需要使用for循环进行包装

如果需要获取FormData已经添加的内容，需要使用get方法；因为添加进去的内容已经变成私有变量无法直接访问。

```javascript
  const formData = new FormData()
  formData.append('fastafile', this.$refs.dropfile.fileData)
//包装表单数据
  for (var key in this.formInline) {
        formData.append(key, this.formInline[key])
      }
```

+ 提交后台

```javascript
      request.post('/test', formData).then(
        () => {
          console.log('ok')
        }
      )
```

测试过程遇到的跨域问题，使用本地代理服务器与后端API进行交互；因为使用浏览器与后端API交互时，浏览器处于安全原因会阻止跨域请求。

配置`vue.config.js`配置文件，以及axios的请求地址改成'/api'

```javascript
    proxy: {
      '/api': {
        target: 'http://后端地址:80',
        ws: true, // 允许跨域
        pathRewrite: {
          '^/api': '/'
        }
      }
```

### 6.后端获取数据

![后台获取数据展示](https://43423.oss-cn-beijing.aliyuncs.com/img/20200406191939.png)

+ 借助`connect-multiparty`插件,将文件存在`/tmp/`目录下
+ 借助`body-parse`解析form表单数据

```javascript
var multipart = require('connect-multiparty') //处理上传的文件
var fs = require('fs')

var multipartMiddleware = multipart()
router.post('/test', multipartMiddleware, function (req, rep) {
  tmpFilePath = req.files.fastafile.path
  console.log(req.files)
  var fasta = fs.readFileSync(tmpFilePath, 'utf-8')
  console.log(req.body)
  console.log(fasta)
  rep.send('test')
})
```



### 7.演示地址

`fasta`[文件拖拽校验](https://biocottonhub.github.io/VueCLII/#/blast/query)

### 参考

1. [文件拖拽失效解决](https://blog.csdn.net/qq_39816673/article/details/89036065) 
2. [读取FileList对象内容](https://blog.csdn.net/zhq2005095/article/details/89069851)
3. [拖拽事件触发](https://www.jianshu.com/p/83311935d0c0)
4. axios[跨域](https://blog.csdn.net/qq_36485978/article/details/100017849?depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1&utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1 )



