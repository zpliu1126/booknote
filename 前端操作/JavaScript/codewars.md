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



### 将重复字符与不重复字符区分开来

**找数组中重复元素的新方法**

+ 使用正则表达式进行匹配，在全局匹配模式下降重复字符区分开
+ 正则表达式要考虑元字符

```javascript
function duplicateEncode(word){
let metChar=['(',')','{','}','^','$','?','*','+','.','[',']','|','\\']
    return [...word].map(function(item){
  let pattern;
  if(metChar.indexOf(item)===-1){
    pattern=new RegExp(item,'gi');
  }else{
   item="\\"+item //元字符的处理
   pattern=new RegExp(item,'gi');
  }
  return word.match(pattern).length==1 ? '(':")" //重复字符的匹配结果长度大于1
}).join("")
}
```

看看我们的秀儿

+ 将字符全部小写
+ 从两个方向找，如果找到的是同样的下标则不重复，反之则是重复的

```javascript
function duplicateEncode(word){
  return [...word.toLowerCase()]
      .map(function(item,index,array){
 		 return array.indexOf(item)==array.lastIndexOf(item) ? '(':')';
}).join("");
}
```



### 中土世界大战

+ 两个数组乘上对应的加权数
+ 求数组累计和，然后比较

```javascript
function goodVsEvil(good, evil) {
  goodWorth = [1, 2, 3, 3, 4, 10];
  evilWorth = [1, 2, 2, 2, 3, 5, 10];
  var goodSum, evilSum;
  goodSum=good.split(" ").map(function (item, index) {
    return parseInt(item) * goodWorth[index];
  }).reduce(function(pre,cur){
    return pre+cur;
  })
  evilSum=evil.split(" ").map(function (item,index) {
    return parseInt(item) * evilWorth[index];
  }).reduce(function(pre,cur){
    return pre+cur;
  })
  if (goodSum == evilSum) {
    return "Battle Result: No victor on this battle field";
  }
  else if (goodSum > evilSum) {
    return "Battle Result: Good triumphs over Evil";
  }
  else {
    return "Battle Result: Evil eradicates all trace of Good";
  }
}
```



秀儿

+ reduce函数可以从数组的第一项开始，而不是数组的第二项
+ 赋给result初值 0

```javascript
good.split(" ").reduce(function(result,value,index){
    
},0)
```



### 将字符串改成驼峰类型

```javascript
#第一个小写则不需要转换
function toCamelCase(str){
  if(str===''){
    return '';
  }
  str=str.replace(/[—-]/g,"_")
  if(/^[A-Z]/.test(str))
  {
    return str.split("_").map(function(item){
      item.match(/^([a-z])/)
      return item.replace(/^([a-z])/,RegExp.$1.toUpperCase())
    }).join("")
  }else{
    tmp=str.split("_")
    a=tmp.shift()
    b=tmp.map(function(item){
      item.match(/^([A-Za-z])/)
    return item.replace(/^([A-Za-z])/,RegExp.$1.toUpperCase())
    })
   b.unshift(a)
    return b.join("")
  }
}
```

秀儿

使用回调函数处理匹配到的`_[a-zA-Z]`,其实我也想要用replace函数的，但是不知道得到匹配的内容，学到了

```javascript
function toCamelCase(str){
      var regExp=/[-_]\w/ig;
      return str.replace(regExp,function(match){
            return match.charAt(1).toUpperCase();
       });
}
```



