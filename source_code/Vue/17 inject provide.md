# provide inject 

## 使用父组件注入的值

+ **provide **

  在父组件中申明需要注入的属性

  ```vue
          provide: {
              elForm: 'aaaa',
  			foo: 'sadasd',
  			bar:'zzz'
          }
  ```

  

+ inject

  在子组件中接受父组件中注入的属性

  ```vue
          inject: {
              foo: {
                  from: 'elForm',
                  default: 'sss'
              }
          },
  ```

  + **from** 允许使用来自provide中任意的属性，使得子组件中的变量值与父组件同名的变量值是不相同的

  + **default** 在父组件中找不到注册的变量时，将使用default中的值

    :warning:需要注意的是，在使用from是，子组件中的变量名必须在父组件中注册了，并且from的值必须是之前的变量

    **example**

    ```vue
    //父组件注册的变量       
    provide: {
                elForm: 'aaaa',
    			foo: 'sadasd',
    			bar:'zzz'
            }
    //子组件使用from
    inject:{
    foo:{
    from:'elFrom' //这能正常的使用，foo现在等同于elForm
    from:'bar' //不能正常的使用
    }
    }
    ```

    

  