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

  

+ 

  

  