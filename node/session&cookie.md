### session与cookie保留用户登录状态

Express框架不支持session与cookie，使用第三方插件完成这个功能

```javascript
npm i express-session
```

谷歌浏览器查看cookie的插件 **EditthisCookie**

在app.js中使用session插件,这个插件的引用要在挂载路由之前

```javascript

const session=require("express-session")
//配置session
app.use(session({
  secret: 'encoded', //加密字符串
  resave: false,
  saveUninitialized: true //为真则不管你存不存数据都会分配一把钥匙给客户端
}))



app.use(studenter_router) //挂载student路由
app.use(teacher_router) //挂载teacher路由
app.use(register_router) //挂载teacher路由
```



#### 关于session中几个参数的说明

+ secret 进行字符窜加密，更加个性化

+ saveUninitialized 为true时不管session中是否填充了数据都会给客户端分配一把钥匙，而为false时则只有在session中填充了数据之后才会分配钥匙

+ name：设置cookie中name值，默认情况是**connect.sid**

+ cookie:{maxAge:8000} 设置cookie和session的过期时间，8000ms之后过期

  



#### session信息保存到数据库中

  	默认行为是存储在内存当中，当服务器已重启就会丢失，在实际环境中会将session进行持久化存储

session的生命周期

　　session与发送到客户端浏览器的生命周期是一致的。而我们在挂载session的时候，通过option选项的cookie.maxAge成员，我们可以设置session的过期时间，以ms为单位（但是，如果session存储在mongodb中的话，任何低于60s(60000ms)的设置是没有用的，下文会有详细的解释）。如果maxAge不设置，默认为null，这样的expire的时间就是浏览器的关闭时间，即每次关闭浏览器的时候，session都会失效。



```javascript
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();

app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'testapp',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({   //创建新的mongodb数据库
        host: 'localhost',    //数据库的地址，本机的话就是127.0.0.1，也可以是网络主机
        port: 27017,          //数据库的端口号
        db: 'test-app'        //数据库的名称。
    })
}));
// 或者基于已有的数据库连接进行
  store:new MongoStore({
  	mongooseConnection: mongoose.connection, //基于已有的数据库连接进行
  	ttl: 0*0*5*60 //5分钟过期
  })

```





参考：

+ https://www.cnblogs.com/chenchenluo/p/4197181.html
+ https://www.cnblogs.com/l8l8/p/9317069.html