# axios请求



### 1.请求地址配置

在环境变量文件中配置请求地址

+ `.env.development`
+ `.env.production`
+ `.env.test`

针对不同的开发环境可以设置不同的请求地址

```bash
VUE_APP_BASE_URL=https://jsonplaceholder.typicode.com/
```

### 2.初始化请求对象

```bash
import axios from 'axios'
import Nprogress from 'nprogress'
import { Message } from 'element-ui'
Nprogress.configure({ showSpinner: false })
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 12000,
  headers: {
    'content-Type': 'application/json',
    Accept: 'application/json'
  }
})
```

### 3.请求拦截

```bash
//请求拦截器
request.interceptors.request.use(
  config => {
    Nprogress.start()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
```

### 4.响应拦截器

```bash
//响应拦截器
request.interceptors.response.use(
  response => {
    Nprogress.done()
    return response
  },
  error => {
    Nprogress.done()
    Message.error({
      message: error.message
    })
    return Promise.reject(error)
  }
)
```



### 5.获取响应数据

在vue组件中使用axiso请求对象

+ 请求体返回的是一个promise对象

```javascript
<script>
import request from '@/utils/request.js'
export default{
    
 methods: {
    test() {
      const users = request.get('/users11')
      users
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          console.log(error.message)
        })
    }
}
</script>
```

之所以要设置请求拦截器和响应拦截器是真的不同类型的数据来使用。在针对错误响应时候，可以让服务端返回一个状态吗，code=0表示正常响应，其余均为错误响应码



### 参考

1.测试接口 https://jsonplaceholder.typicode.com/ 

2.代码格式化  https://blog.csdn.net/qq_32340877/article/details/79474034 