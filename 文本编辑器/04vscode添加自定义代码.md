# Vue模板补齐



在写vue模板的时候，通过vs自定义命令进行代码补齐，省时省力



### 1.进行配置

打开`file>prefreences>user snippets>vue.json`

配置如下

```json
{
       "Print to console": {
        "prefix": "scaffold",
        "body": [
            "<template>",
            "  <div>",
            "    $0",
            "  </div>",
            "</template>",
            "",
            "<script>",
            "",
            "  export default {",
            "    name:'',",
            "  }",
            "",
            "</script>",
            "<style lang='' scoped>",
            "",
            "</style>"
        ],
        "description": "Log output to console"
			}
}
```



### 2.生成代码段

在以.vue结尾的文件中按scaffold就可以生成代码段

需要注意的问题是要手动修改文件类型，不然识别不到

![文件类型](https://upload-images.jianshu.io/upload_images/1420246-119a4879cee8a7b9.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

### 参考

 https://www.jianshu.com/p/ad8e2698b221 

