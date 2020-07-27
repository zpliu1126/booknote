### 使用Promise封装

单个query

```javascript
const mysqlconnection = mysql.createConnection({
  host: 'localhost',
  user: 'BioCotton',
  password: 'BioCotton39558728cotton@',
  port: 3306,
})
```

将query使用Promise封装

+ `sqlConnection`是一个mysql对象
+ `sql`是查询语句
+ `req`是客户端请求对象
+ `rep`是响应客户端对象
+ `next`中间件函数

```mysql
function sqlQueryPromise(sqlConnecion, sql, req, rep, next) {
  return new Promise((resolve, NULL) => {
    sqlConnecion.query(sql, function (err, result) {
      if (err) {
        logger.error(
          'sql language error: errcode:' + err.errno + '\t`' + err.sql + '`'
        )
        next({
          code: err.errno,
        }) //sql language error
        return
      }
      resolve(result)
    })
  })
}
```

进行一次顺序查询

+ 先选择数据库
+ 在进行query

> 当客户端请求过来的时候，调用封装好的对象；如果query发生错误，自动进入到错误处理中间件；告诉前端错误代码；
>
> 如果请求成功，可以接着创建一个Promise对象，进入下一层链式调用

```javascript
router.get('/people', function (req, res, next) {
  sqlQueryPromise(mysqlconnection, 'use wordpress;', req, res, next)
    .then(() => {
      return sqlQueryPromise(
        mysqlconnection,
        `
      SELECT 
      student.\`id\`,
      student.\`name\`,
      student.\`sex\`,
      student.\`introduction\`,
      student.\`photo\`,
      student.\`email\`,
      grade.\`name\` AS 'grade' 
    FROM
      \`student\` 
      LEFT JOIN \`grade\` 
        ON student.\`grade\` = grade.\`id\` 
    ORDER BY student.\`grade\` ASC ;
             `,
        req,
        res,
        next
      )
    })
    .then((result) => {
      res.json(result)
    })
})
```

