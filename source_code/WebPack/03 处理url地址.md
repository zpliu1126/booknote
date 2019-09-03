## 处理url 图片

+ url-loader 插件

+ file-loader 插件

  `npm i url-loader -D`

### 在css文件中引用图片

```javascript
body{
	background:url("./img/bg2.jpg");
	background-repeat:no-repeat;
}
```

### 在webpack.config.js中配置loader

```javascript
module:{
    rules:[
        
        {test:/\.(jpg|png|gif|jpeg)$/,use: 'url-loader?limit=102400&name=[name].[ext]'}
    ]
}
```

+ limit 参数当文件小于指定参数时，进行base64转换
+ name=[name].[ext] 保持图片的原始名字，不设置时默认将图片名字进行哈希转换

### 在css中使用自定义字体

```css
@font-face {
  font-family: 'webfont';
  font-display: swap;
  src: url('//at.alicdn.com/t/webfont_gdjzainu22v.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_gdjzainu22v.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_gdjzainu22v.woff2') format('woff2'),
  url('//at.alicdn.com/t/webfont_gdjzainu22v.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_gdjzainu22v.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_gdjzainu22v.svg#AlibabaPuHuiTiL') format('svg'); /* iOS 4.1- */
}
//在body中使用
body{
	font-family: 'webfont';
}
```



### 参考

使用自定义字体 https://www.jb51.net/css/613915.html