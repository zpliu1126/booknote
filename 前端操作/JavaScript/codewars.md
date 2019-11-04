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

