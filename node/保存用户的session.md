#  express-session



> 1.5.0后的版本不再需要`cookie-parser`的支持了；并且session只是单纯的发送一个session ID 给客户端，而真正的session数据是存储在服务端的。并且默认情况下session是保存在内存当中的仅仅适用于开发和调试模式，至于生产模式下可能会导致内存泄露，得想个办法把它存数据库里或者文件中。

由于我数据库使用的是`mysql`，因此可以使用对应的mysql将session持久化存起来

> [connect-mssql](https://www.npmjs.com/package/connect-mssql) A SQL Server-based session store.

### 1.初始化session

+ `name`参数设置客户端中cookie的key名称
+ `secret`对session ID进行加盐的字符
+ `resave`多个客户端并发请求时，保留最后一次请求并且覆盖前面的
+ `saveUninitialized`初始化的session是否进行保存
+ `maxAge`和`cookie.expires`参数都可以设置cookie过期时间，如果都设置了以最后设置的为准，还是设置`maxAge`好一些，以秒为单位
+ `cookie.path`设置cookie存储的路径，默认是根域名下；当然可以修改为子域名
+ `cookie.secure`只适用于https请求，设置为true时，在http请求下cookie失效

> 我设置只在/login API下才能够得到cookie，而在/people API下得不到；
>
>  rolling: true, //每个请求都重新设置一个cookie ；当客户端手动删除cookie时，非常有用，我在这折腾了好久

```javascript
var session = require('express-session') //use session
app.use(
  session({
    secret: 'cotton',
    name: 'token',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge:86400000,  //设置cookie过期时间以毫秒为单位
        path:'/login'
    },
      rolling: true, //每个请求都重新设置一个cookie
  })
)
```

>  rolling: true; 这个参数设置为真时，当用户手动清空掉cookie时，服务端仍旧会重新发送一份cookie；如果不设置的话，客户端是得不到cookie，进而服务端会出错；这里我弄了好久

### 2.将用户登录信息保存在session中

首先根据客户端cookie中的信息判断客户端对应的session中是否包含`login`字段；如果包含则无需进行数据库query；直接从session中获取用户信息；否则验证用户身份，并将用户信息存在session中。

```javascript
router.get('/login', function (req, res, next) {
  if (req.session.login) {
    res.send('ok')
  } else {
    req.session.login = true
    res.send('no')
  }
})
```

### 3.将session保存在文件中持久化

由于express-session将session信息保存在内存当中，因此为了防止node内心泄露，需要对session数据持久化

> 参考 https://www.npmjs.com/package/session-file-store

```javascript
var session = require('express-session') //use session
var FileStore = require('session-file-store')(session) //use file store session
var fileStoreOptions = {
  ttl: 86400,  //设置session文件过期时间，以秒为单位
  path: path.join(__dirname, './sessions'), //设置session保存路径
}
```

#### 4.存信息的时候统一存进一个date对象内

当客户端第一次访问时，判断session是否存在`data`属性，如果不存在则进行进行身份验证，验证通过后修改session中data字段数据，并且返回成功代码给客户端；

如果失败则返回错误代码给客户端，进行重新登录

```javascript
router.get('/login', function (req, res, next) {
  if (req.session.data) {
    res.send(req.session.data) //处于登录状态了
  } else {
    req.session.data = true
    res.send('no') //非登录状态，进行数据库查询操作
  }
})
```

之后需要登录才能得到信息的接口，就直接判断当前session中是否存在数据，不存在就直接返回401，让前端进行登录才能获取到数据

### 登录验证API

当用户提交了账号和密码之后，进行验证；如果验证通过则将信息存储在session文件中，cookie中保留session文件ID

```javascript
const username = 'zpliu'
const password = '111'
router.post('/login', function (req, res, next) {
  if (req.session.data) {
    res.json(req.session.data)
    //处于登录状态了
  } else {
    //进行密码验证
    if (req.body.username === username && req.body.password === password) {
      req.session.data = {
        name: 'zpliu',
        grade: 'master',
        role: 'Administrator',
      }
      console.log(req.session)
      res.redirect('/login')  //这里重定向还是会产生一点问题，第一次登录会有404
    } else {
      res.send({
        code: 6000,
        message: '账号或密码错误',
      })
    }
  }
})
```

最终代码，已经加上了sql进行账号和密码的验证，以及MD5加密操作

> https://github.com/zpliu1126/nodeAPI/blob/cfd3201f9b02a8d963a89ea8f5961c03997d3089/API/auth/index.js

### 参考

1. https://www.cnblogs.com/tugenhua0707/p/9098132.html