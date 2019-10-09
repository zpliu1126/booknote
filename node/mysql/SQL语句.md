## 基本的SQL语句



+ **+ **号的使用

  ```mysql
  SELECT  'a11'+11;
  
  ## 11
  
  SELECT  '1111'+11;
  
  ## 1122
  
  SELECT  null+'aaa';
  
  ## 为空
  
  SELECT  null+null;
  
  ##  为空
  ```

+ 调节运输符

  - `<`
  - `>`
  - `<>` 或者`!=`
  - `<=` `>=` 

+ 逻辑运算符

  - `and` 或者`&&`

  - `or`或者`||`

  - `not `或者`!`

    ```mysql
    # id 小于5 并且大于2
    SELECT * FROM websites WHERE  NOT(id>=5) AND id>2 ;
    ```

    

+ 模糊查询

  + like 一般与通配符搭配使用

    `%`匹配任意多个字符，并且`like`不区分大小写

    `_`匹配任意一个字符,类似占位符的功能

    ```mysql
    SELECT * FROM websites WHERE name like 'g%' ;
    # alexa	country	id	name	url
    # 1	USA	1	Google	https://www.google.cm/
    
    ```

    

+ 

  

  