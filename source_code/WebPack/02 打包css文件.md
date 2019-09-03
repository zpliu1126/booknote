## 打包css文件

**webpack**使用两个插件对css文件进行打包

1. **css-loader**
2. **style-loader**

### 在入口index.js文件中引入css文件

```javascript
import "./index.css"

console.log("222222ww333dsad223332");
```

### 在webpack.config.js文件中配置处理css的loader

```javascript
	module:{
		rules:[
			{
				test:/\.css$/,
				use:[
				{loader:'style-loader'},
				{loader:'css-loader'}
				]
			}
		]
	}
```

+ test 对文件进行正则表达
+ use使用对应的插件进行处理
+ 并且这两个插件是有加载顺序的，先加载css-loader 再是style-loader **webpack**是从上往下进行加载

```javas