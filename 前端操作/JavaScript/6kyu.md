### 函数的连续调用

> 将字符串使用空格进行连接
>
>  createMessage("Hello")("World!")("how")("are")("you?")() === "Hello World! how are you?" 

函数中返回一个匿名函数，匿名函数调用父函数实现层级的调用，感觉类似递归的思想

```javascript
function createMessage(str) {
    return function(next){
      if (next === undefined) {return str;}
      return createMessage(str + " "+ next);
    }
}
```



### 两个数组去重

```javascript
## 遍历b来除去a中相同的
function array_diff(a, b) {
  b.map(function(item){
    if(a.indexOf(item)!=-1){
    while(a.indexOf(item)!=a.lastIndexOf(item)){
      a.splice(a.indexOf(item),1)
    }
    a.splice(a.indexOf(item),1)}
  })
  return a
}
```

秀儿

```javascript
## 之间遍历a
function array_diff(a, b) {
  return a.filter(function(x) { return b.indexOf(x) == -1; });
}
```

