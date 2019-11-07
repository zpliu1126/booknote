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

秀儿

```javascript
function high(s){
  let as = s.split(' ').map(s=>[...s].reduce((a,b)=>a+b.charCodeAt(0)-96,0));
  return s.split(' ')[as.indexOf(Math.max(...as))];
}
//[...set]是一个扩展运算符，将一个数组转为用逗号分隔的参数列表。
```

### 获取数组中不重复的数字

+ 将第一个取出来之后再进行查找
+ 比较剩余数是否与当前数相同

```javascript
function findUniq(arr) {
  let value
  value=arr.shift()
  if(arr.indexOf(value)==-1){
        return value
   }else{
      return arr.filter(function(item){
        return item !=value;
      })[0]
   }
}
```

秀儿

```javascript
function findUniq(arr) {
  arr.sort((a,b)=>a-b);
  return arr[0]==arr[1]?arr.pop():arr[0]
}
```



### 将罗马数字转换为十进制数字

```javascript
function solution(roman){
  function extractCount(string,reg){
    return string.match(reg) ? string.match(reg).length:0;
  }
  let I=extractCount(roman,/I/g)
  let V=extractCount(roman,/V/g)
  let M=extractCount(roman,/M/g)
  let X=extractCount(roman,/X/g)
  let L=extractCount(roman,/L/g)
  let C=extractCount(roman,/C/g)
  let D=extractCount(roman,/D/g)
  let IV=extractCount(roman,/IV/g);
  if(IV){
    return (I-IV)+5*(V-IV)+10*X+50*L+100*C+500*D+1000*M+4*IV;
  }else{
    return I+5*V+10*X+50*L+100*C+500*D+1000*M;

  }
}
console.log(solution("MMVIII"))
```

秀儿

+ `IV`的情况处理的比我好
+ 使用字典，比我使用正则表达式感觉更高效一些

```javascript
function solution(roman){
  var memo = {
  "I": 1,
  "V": 5,
  "X": 10,
  "L": 50,
  "C": 100,
  "D": 500,
  "M": 1000
  };  
return [...roman].map(a => memo[a]).reduce((a,b) => a < b  ? b - a : a + b) 
}
```



