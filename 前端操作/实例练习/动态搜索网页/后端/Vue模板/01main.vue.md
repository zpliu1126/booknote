# main.vue



### 对form表单进行验证

```javascript
 <el-main>
    <el-row :span="24" justify="center" type="flex">
      <el-col :span="24">
       <el-form :model="input" :rules="rules" ref="input">
         <el-form-item prop="keyword">
           <el-input size="large" v-model="input.keyword" type="text" >
            <el-button  @click="onSubmit('input')" slot="append" icon="el-icon-search"></el-button>
           </el-input>
         </el-form-item>
         <el-form-item label="Accurate Search" prop="rule">
          <el-switch activate-value="true" inactivate-value="false" active-color="#13ce66"  v-model="input.rule"></el-switch>
         </el-form-item>
       </el-form>
      </el-col>
    </el-row>
  </el-main>
```

1. 首先form表单有三个属性
   + model 绑定的数据
   + rules 使用的验证规则
   + ref 表单的名字
2. 在`el-form-item`单个字段中进行验证
   + prop声明需要验证的字段
3. 提交按钮
   + 在验证函数中传入表单的名字,也就是`ref`所定义的字符串

#### 在data中定义规则和验证函数

+ 这里记得验证成功后要调用回调函数`callback()`

```javascript
var checKeyword=(rule,value,callback)=>{
      if(!value){
        return callback(new Error("搜索内容不能为空"))
      }else{
        callback()
      }
    };
    return {
     input:{
       keyword:'',
       rule:'false'
     },
     rules:{
     keyword:[{validator:checKeyword,trigger:'blur'}],
    },
    }
```

#### 绑定点击事件的函数

```javascript
 <el-button  @click="onSubmit('input')" slot="append" icon="el-icon-search"></el-button>
 methods: {
    onSubmit(ruleform){
      this.$refs[ruleform].validate((valid) => {
          if (valid) {
            console.log("dsadas")
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }
  },
```

#### 发起http请求

1. 服务端解决跨域请求

   在进入路由之前进行配置

   ```javascript
   app.all("*",function(req,rep,next){
     rep.header("Access-Control-Allow-Origin", "*");
     rep.header("Access-Control-Allow-Headers", "*");
     next();
   })
   ```

2. 前端进行post请求

   ```javascript
   Vue.use(vueResourve)
   this.$http.post(httpUrl+"/",formData,{emulateJSON: true}).then((reponse)=>{
             console.log(reponse)     
   })
   ```
   
   



### 参考

1. axiso 包https://www.cnblogs.com/sweet-ice/p/10527020.html 
2. this指针  https://www.cnblogs.com/pssp/p/5216085.html 
3. bodyParse解析post数据  https://www.cnblogs.com/chyingp/p/nodejs-learning-express-body-parser.html 
4. 四种post请求  https://imququ.com/post/four-ways-to-post-data-in-http.html 

