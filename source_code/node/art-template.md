# art-template模块的用法



1. 条件语法

   ```javascript
   {{ if value }}
   执行语句
   {{ else if value2 }}
   执行语句
   {{/if }}
   ```

   这里 value只能是 布尔值 0/1 或者true 或者false

   0是false 1是true

2. 循环语句

   ```javascript
   {{each target}}
   	{{ $value}}
   {{/each}}
     
     
   {{ each target}}
     {{ $value.id}}
   {{/each}}
    
   {{ each target}}
     {{ $index}}
   {{/each}}
   ```

3. 模板继承

   这种方法适合快速部署html骨架

   ```javascript
   #在模板文件中挖坑
   {{ block 'content'}}
     默认内容
   {{/block}}
     
   #在继承的文件中进行填坑
   {{extend "文件"}}
   {{ block 'content'}}
     填补模板文件中的坑
    {{/block}}
   ```

   

4. 子模板

   适合添加固定不变的模板

   ```javascript
   {{ include '模板文件'}}
   ```

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   

   