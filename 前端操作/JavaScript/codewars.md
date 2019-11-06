# codewar中的练习题



### 判断一个数是否是一个可开平方的数

```javascript
## 使用Math中sqrt函数，返回值在判断是否为整数
var isSquare = function(n){
  return Math.sqrt(n)%1===0 ? true : false;
}
```



### 将数组中最小的两个数加和返回

```javascript
## 将数组逆序排序，然后输出
function sumTwoSmallestNumbers(numbers) {  
  var result=[]
  result=numbers.sort(function(value1,value2){
  return value1>=value2 ? 1:-1;
})
return result[0]+result[1];
}
```

### 统计字符串中两个字符出现次数是否相等

我的比较初级，还想着将字符串转换为数组在进行判断

```javascript
function XO(str){
  let strArr=str.toLocaleLowerCase().split('');
  let x=0,o=0;
  strArr.forEach(element => {
    if(element=='x'){
      x++
    }
    if(element=='o'){
      o++
    }
  });
  return x==o ? true:false;
}
```

大神们的操作

使用字符串中的正则表达式

```javascript
function XO(str) {
  let x = str.match(/x/gi);
  let o = str.match(/o/gi);
  return (x && x.length) === (o && o.length);
}
```



### 统计字符串中 单词累计和的最大值

+ a=1，b=2，c=3

```javascript

function calcuteASCCII(string){
  let tmpArray=[]
  tmpArray=string.split("").map(function(item){
    return item.charCodeAt()-96
  })
  return tmpArray.reduce(function(prev,cur){
    return prev+cur;
  })
}
function high(x){
  let tmpArray=x.match(/\b\w+\b/g);
  if(tmpArray){
    tmpArray.sort(function(value1,value2){
      return calcuteASCCII(value2)-calcuteASCCII(value1);
    }) ;
    return tmpArray[0]
  }else{
    return '';
  }
}
```

