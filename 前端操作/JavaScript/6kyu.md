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

