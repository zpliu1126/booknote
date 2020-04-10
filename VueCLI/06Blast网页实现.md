# Blast+ 网页实现



### 1.前端发送表单

表单数据包括

+ 序列信息
+ blast database
+  其他可选的参数
+ 选择blastn或者blastp

```javascript
      formInline: {
        sequence: '',
        database: '',
        evalue: '-evalue 1.0e-5 -num_alignments 10 -max_hsps 10',
        blastType: ''
      },
```

#### 1.1提交表单数据前进行数据校验

+ 表单校验不成功，不能够提交
+ 校验成功后使用`FormData`封装表单数据
+ 打开遮罩层，阻止多次提交
+ 使用`axios`获取响应数据后，关闭遮罩层

```javascript
    onSubmit () {
      this.$refs.blastForm.validate((valid) => {
        if (valid) {
          const formData = new FormData()
          for (var key in this.formInline) {
            formData.append(key, this.formInline[key])
          }
          this.showProcess = true
          request.post('/test', formData).then(
            (reponse) => {
              this.reponseData = reponse.data
              this.showProcess = false
            }
          )
        } else {
          return false
        }
      })
    }
```

### 2.响应数据渲染

封装一个`show.vue`子组件，子组件中使用`props`获取父组件传递的响应数据，子组件中`reponseData`初始化值为空

> 在渲染序列比对情况时候，遇到对不齐的情况；主要是由于没有使用等宽字体

![字体对齐](https://43423.oss-cn-beijing.aliyuncs.com/img/20200408152513.png)

```javascript
  props: {
    reponseData: {
      default: () => {
        return [{
          query: 'CYP78A7',
          queryLength: '559',
          alignments: []
        }]
      }
    }
```

使用计算属性，将父组件的响应数据转换成需要渲染的数据

```bash
 computed: {
    ValidateReponse () {
      var newDataArray = []
      this.reponseData.forEach((item) => {
        var queryName = item.query
        var queryLength = item.queryLength
        var summaryTable = []
        var singleTable = []
        var AlignmentIf = ''
        if (item.alignments.length > 0) {
          AlignmentIf = true
          item.alignments.forEach((subject, index) => {
            summaryTable.push(
              {
                id: index + 1,
                subjectName: subject.subjectName,
                score: subject.score,
                evalue: subject.eValue,
                length: subject.subjectLength,
                identities: subject.identities,
                pairSequence: subject.pairSequence

              }
            )
            singleTable.push([{
              id: index + 1,
              subjectName: subject.subjectName,
              score: subject.score,
              evalue: subject.eValue,
              length: subject.subjectLength,
              identities: subject.identities,
              pairSequence: subject.pairSequence
            }])
          })
        } else {
          AlignmentIf = false
        }
        newDataArray.push({
          queryName,
          queryLength,
          summaryTable,
          AlignmentIf,
          singleTable
        })
      })
      return newDataArray
    }
  }
```



### 3.后端node运行blast+

使用node运行系统命令，来执行blast+

#### 3.1创建两个临时文件，用于存储序列信息和blast运行结果

+ 使用`tmp`模块

```javascript
  var tmp = require('tmp')
  var queryFile = tmp.fileSync()
  var BlastOutFile = tmp.fileSync()
  //程序结束后，可以选择删除临时文件；或系统自动处理
  BlastOutFile.removeCallback()
  queryFile.removeCallback()
```

#### 3.2运行系统命令

使用`child_process`模块运行子进程，调用`execFile`函数执行系统脚本

`execFile`函数参数:

+ 系统脚本所在绝对路径
+ 传递参数的数组
+ 回调函数，判断脚本是否执行成功

```javascript
var callfile = require('child_process')
  callfile.execFile(
    '使用系统脚本的绝对路径',
    [
      queryFile.name,
      BlastOutFile.name,
      req.body.blastType,
      req.body.database,
      req.body.evalue
    ],  (error, stdout, stderr) => {
      if (error) {
        console.log(error)
        rep.send('error')
        return
      }
      //读取blast结果
      BlastText = fs.readFileSync(BlastOutFile.name, 'utf-8')
      //解析blast outfmt 0 格式文件
      BlastJson = parseBlastText(BlastText)
      BlastOutFile.removeCallback()
      queryFile.removeCallback()
      rep.send(BlastJson)
    })
```

#### 3.3解析Blast+ `outfmt 0`格式文件

+ 利用关键字`Query=`获取查询序列所在行号
+ 关键字`>`获取匹配序列所在行号
+ 匹配序列之间，间隔行数是固定的

[脚本地址](https://github.com/BiocottonHub/zpliuCode/blob/b9f1c6b4b3479e0104a32d2470b02a648e0275de/BioJs/parseBlastText.js)

### 4.演示地址

 http://cotton.hzau.edu.cn/web/test#/blast/query 

### 参考

1. node[执行系统命令](http://nodejs.cn/api/child_process.html)
2. tmp[模块创建临时文件](https://www.npmjs.com/package/tmp)
3. 转换Blast[输出文件](https://github.com/sing-group/biojs-vis-blasterjs/blob/ed8cfd8bb8e9a1b88251a6006cf308c30758dcab/lib/index.js)
4. [js生物仓库](https://biojs.net/#/)









