# element-ui



### 布局容器

#### 首页布局

+ header
+ main
+ footer

三个组件，

高度的设置使用百分比,值得注意的是，使用百分比时父元素的高度要已知，所以最先设置html标签的高度

```css
  html{
    min-height: 100%;
    height: 100%;
  }
  body{
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
    height: 100%;
  }
  body > .el-container{

    height: 100%;
  }
```

子组件的高度设置，由于在element-ui中就有`height`这一个属性，所以它的优先级比较高一些，在style中写的css被覆盖了

`<el-header height="20%"></el-header>`

### 参考

1.css控制高度 http://www.chinahtml.com/1006/css-127614779719010.html 

