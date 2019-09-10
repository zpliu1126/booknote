# visual Studio Code

##### 最近看到前端大牛们都在使用vscode，于是决定尝试使用一下，并对使用过程中的一些配置做一些记录；方便之后回过头来看

+ #### 插件配置

  - **ESLint**

    JS代码风格检查的插件，安装之后进行配置

    配置文件中主要是以下信息

    ```javascript
      "files.autoSave":"off",
        "eslint.validate": [
           "javascript",
           "javascriptreact",
           "html",
           { "language": "vue", "autoFix": true }
         ],
         "eslint.options": {
            "plugins": ["html"]
       },
       "diffEditor.ignoreTrimWhitespace": false
    ```

    ![](https://43423.oss-cn-beijing.aliyuncs.com/img/5HAKBMZO5$ZT%1]REJ6_I7B.png)

  - 主题插件**Palenight Theme** 

  - **HTML代码自动补齐**

    参考https://www.jianshu.com/p/1c326fe1e4ef

    下载插件 **HTML Snippets**

    在set中进行配置

    ```json
    "files.associations": {
          "*.vue": "html"
       },
       "emmet.triggerExpansionOnTab": true,
       "emmet.excludeLanguages": [
          "vue-html": "html",
          "vue": "html"
       ]
    ```

    接下来就可想table补齐html插件了

  - 常用的插件的配置

    https://www.cnblogs.com/zFelix/p/6133202.html

  - 

+ 快捷键

  + 放大与缩小

  ` ctrl + - | ctrl + =`

  



### 将配置信息保存到云端

下载插件 **Settings Sync** 

在用户配置信息中配置好github上生成的gist 编号；不想自己生存的话也可以选择登录github，它会自动帮你创建gist编号

<img src="https://43423.oss-cn-beijing.aliyuncs.com/img/20190910223851.png"/>

+ 使用**Setting Sync**帮你生成gist编号

  <img src="https://43423.oss-cn-beijing.aliyuncs.com/img/20190910224053.png"/>



配置好后就是两个快捷键啦！

` shift + Alt +D|U`就是下载云端配置与上传本地配置

最后在云端就有对应的配置信息了

网址为 https://gist.github.com/zpliu1126/ +gisi编号

<img src="https://43423.oss-cn-beijing.aliyuncs.com/img/20190910224423.png"/>







