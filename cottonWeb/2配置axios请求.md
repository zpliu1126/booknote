

### 1.响应拦截器

封装了一个处理axios响应的函数

```javascript
import { Notification } from 'element-ui' //提示后端接口
function handleReponse(response) {
  switch (parseInt(response.data.code)) {
    case 0:
      break
    case 404:
      Notification.error({
        title: 'error',
        message: '后端接口网址未找到, 错误代码404',
        duration: 5000,
      })
      break
    default:
      Notification({
        title: 'error',
        message: '未知错误，错误代码:' + response.data.code,
        duration: 5000,
      })
  }
  return response
}
```

在获取到响应后，调用对应的处理函数

```javascript
//响应拦截器
request.interceptors.response.use(
  (response) => {
    Nprogress.done()
    return handleReponse(response)
  },
  (error) => {
    Nprogress.done()
    return Promise.reject(error)
  }
)
```

### 解决请求跨域问题

#### 1在`vue.config.js`中配置代理

```javascript
    proxy: {
      //代理服务器访问目标服务器，解决开发过程中跨域问题
      '/api': {
        target: 'http://cotton.hzau.edu.cn:80/web',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
      },
    },
```

#### 2在`.env.development`中配置代理服务器地址

`VUE_APP_Proxy=http://localhost:8080/api`

#### 3在`request.js`文件中配置axios请求地址

```bash
import axios from 'axios'
import Nprogress from 'nprogress'
import { Notification } from 'element-ui' //提示后端接口

Nprogress.configure({ showSpinner: false })
const request = axios.create({
  baseURL: process.env.VUE_APP_Proxy,  //向代理服务器发送请求
  timeout: 12000,
  headers: {
    'content-Type': 'application/json',
    Accept: 'application/json',
  },
})

```



