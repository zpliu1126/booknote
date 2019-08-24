### 前端使用ajax进行异步请求



+ 原生ajax代码

  ```javascript
  	/*执行ajax异步加载*/
  		var xmlhttp;
  		if(window.XMLHttpRequest){
  			xmlhttp=new XMLHttpRequest();
  		}else{
  			/*IE6 IE5创建ajax对象*/
  			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  		}	
  		/*向服务器发送请求*/
  		xmlhttp.open("POST","/scripte/ajax.php",true);
  		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8"); /*填写http头部信息*/
  		xmlhttp.send("text="+text.value);/*发送post表单字符*/
  		xmlhttp.onreadystatechange=function()
  		{
  		if (xmlhttp.readyState==4 && xmlhttp.status==200)
  			{
  			document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
  			}
  		}
  ```

+ 基于jquery实现的ajax代码

  ```javascript
  <script>
  $("form").on('submit',function(e){
  	/*e.preventDefault()*/
  	var formData=$(this).serialize() //input 没加那么属性的错误
  			$.ajax({
  			url:"/student/test",
  			async:true,
  			data:formData,
  			dbType:"json",
  			type:"POST",
  			success:function(result,status,xhr){
  			/*alert(result)
  			alert(status)
  			alert(xhr)*/
  		}});
  
  	});
  </script>
  ```

  + preventDefault()函数会组织默认事件的发生，这里主要是在测试过程中不让表单进行跳转

  + 使用on函数来对表单绑定提交事件

  + serialize函数将表单中input的内容进行序列化，这里我在处理过程中input标签没有加name属性所以一直得不到数据

  + 接下来就是执行ajax方法进行异步请求啦！

    | 名称                         | 值/描述                                                      |
    | :--------------------------- | :----------------------------------------------------------- |
    | async                        | 布尔值，表示请求是否异步处理。默认是 true。                  |
    | beforeSend(*xhr*)            | 发送请求前运行的函数。                                       |
    | cache                        | 布尔值，表示浏览器是否缓存被请求页面。默认是 true。          |
    | complete(*xhr,status*)       | 请求完成时运行的函数（在请求成功或失败之后均调用，即在 success 和 error 函数之后）。 |
    | contentType                  | 发送数据到服务器时所使用的内容类型。默认是："application/x-www-form-urlencoded"。 |
    | context                      | 为所有 AJAX 相关的回调函数规定 "this" 值。                   |
    | data                         | 规定要发送到服务器的数据。                                   |
    | dataFilter(*data*,*type*)    | 用于处理 XMLHttpRequest 原始响应数据的函数。                 |
    | dataType                     | 预期的服务器响应的数据类型。                                 |
    | error(*xhr,status,error*)    | 如果请求失败要运行的函数。                                   |
    | global                       | 布尔值，规定是否为请求触发全局 AJAX 事件处理程序。默认是 true。 |
    | ifModified                   | 布尔值，规定是否仅在最后一次请求以来响应发生改变时才请求成功。默认是 false。 |
    | jsonp                        | 在一个 jsonp 中重写回调函数的字符串。                        |
    | jsonpCallback                | 在一个 jsonp 中规定回调函数的名称。                          |
    | password                     | 规定在 HTTP 访问认证请求中使用的密码。                       |
    | processData                  | 布尔值，规定通过请求发送的数据是否转换为查询字符串。默认是 true。 |
    | scriptCharset                | 规定请求的字符集。                                           |
    | success(*result,status,xhr*) | 当请求成功时运行的函数。                                     |
    | timeout                      | 设置本地的请求超时时间（以毫秒计）。                         |
    | traditional                  | 布尔值，规定是否使用参数序列化的传统样式。                   |
    | type                         | 规定请求的类型（GET 或 POST）。                              |
    | url                          | 规定发送请求的 URL。默认是当前页面。                         |
    | username                     | 规定在 HTTP 访问认证请求中使用的用户名。                     |
    | xhr                          | 用于创建 XMLHttpRequest 对象的函数。                         |

+ 对了有的jquery版本还没有ajax函数,就用这个版本吧

  ```javascript
  <script src="https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js"></script>
  ```

+ 原来并不是版本的问题，是由于scripte标签中多了两个关键字导致延迟没有完成就报错了

  ```
  async defer  //异步延迟加载 md坑死我了
  ```

  

参考： https://www.runoob.com/jquery/ajax-ajax.html

