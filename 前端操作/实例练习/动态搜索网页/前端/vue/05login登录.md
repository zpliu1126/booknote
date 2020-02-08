# login登录界面



### 前端页面

+ 全局修改element-ui中的css样式，需要在App.vue文件中声明，由于scoped作用会使得，组件中的css样式不能起作用

```bash
#loginContainer .el-input__prefix{
  left: 0px;
}
```



### ajax请求后端API

```bash
handleLogin(ruleform){
        this.$refs[ruleform].validate((valid) => {
          if (valid) {
           //success validate
           this.$http.post(httpUrl+"login",this.input,{emulateJSON: true}).then(
        //success reponse
        (reponse)=>{
          if(reponse.body.errCode){ //后端数据库连接失败
            this.$router.push({name:"errorPage",params:{errorMessage:reponse.body}})
            return
          }
          if(reponse.body.authenticateThrought=="no"){
            alert("账号或密码错误,请重试")
            return
          }
          if(reponse.body.authenticateThrought==="yes"){
            //认证成功，进入个人主页
            this.$router.push({name:"profilePage",params:{name:this.input.name}})
          }
        //  console.log(JSON.parse(reponse.body))    
        },(errReponse)=>{
          alert("网络似乎有点延迟，稍后再试")
          return
        }
        )
          }
        });
      }
```



### 关于跨域请求设置cookie的问题

通过Appach反向代理解决

同时在node服务端设置

```bash
app.all("*",function(req,rep,next){
  rep.header("Access-Control-Allow-Origin", "*");
  rep.header("Access-Control-Allow-Headers", "*");
  rep.header("Access-Control-Allow-Credentials", "true");
  next();
})
```





