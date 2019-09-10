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

    

    