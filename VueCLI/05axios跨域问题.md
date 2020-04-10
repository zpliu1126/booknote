### axios跨域问题

使用代理服务器与目标服务器进行交互，然后将返回的结果传递给客户端

我使用的是Vue-cli脚手架进行开发，于是代理服务器之间选择webpack-serve

> 客户端与服务器进行请求时存在跨域时，会被浏览器拦截；而服务器与服务器之间通信不存在这种现象；于是通过使用web-packserve代理服务器与目标主机进行交互，然后在将信息传递给客户端

在配置文件中进行设置`vue.config.js`

+ 配置文件中配置的意思是，让代理服务器去访问目标主机，然后使用'/api'地址代表代理服务器

```javascript
     devServer: {
     proxy: {
      '/api': {
        target: '目标服务器地址加端口号:http://127.0.0.1:80',
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
    }
```

配置axios请求地址

+ axios直接向代理服务器发起请求

```bash
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 12000,
  headers: {
    'content-Type': '/api',
    Accpet: 'application/json',
  }
})
```



具体请求接口

+ 这时候请求`/test`相当于请求代理服务器中`/api/test`

  也就相当于请求目标主机`/目标主机/test`

```bash
 request.post('/test', formData)
```



### 参考

 https://blog.csdn.net/qq_36485978/article/details/100017849?depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1&utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1 

