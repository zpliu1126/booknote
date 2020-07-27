### 配置log4js

使用log4js记录node日志；需要注意的是，每次重新启动node时，都会将日志清空；所以在检查node错误的时候先把日志文件备份一哈

#### 1.封装log4js的配置文件

使追加模式写入日志文件，并且文件名以小时命名

```javascript
const log4js = require('log4js')
log4js.configure({
  appenders: {
    // file: {
    //   type: 'file',
    //   filename: path.join(__dirname, '../logs/access.log'),
    //   maxLogSize: 10 * 1024 * 1024, // = 10Mb
    //   backups: 5, // keep five backup files
    //   compress: true, // compress the backups
    //   encoding: 'utf-8',
    //   mode: 0o0640,
    //   flags: 'w+',
    // },
    dateFile: {
      type: 'dateFile',
      filename: path.join(__dirname, '../logs/log_date'),
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd.log',
      compress: true,
    },
    out: {
      type: 'stdout',
    },
  },
  categories: {
    default: { appenders: ['dateFile', 'out'], level: 'trace' },
  },
})
/**
 * export function of getLogger
 */
exports.getLogger = log4js.getLogger //log4js是一个json对象

```

#### 2.使用

```javascript
//引入logger 对象
const logger = require(path.join(__dirname, './utils/log4js.js')).getLogger()
//输出日志到日志文件和输出流
// logger.debug('This little thing went to market')
// logger.info('This little thing stayed at home')
// logger.error('This little thing had roast beef')
// logger.fatal('This little thing had none')
// logger.trace('and this little thing went wee, wee, wee, all the way home.')
```







#### 参考

1. [官方文档](https://github.com/log4js-node/log4js-node)
2. https://blog.csdn.net/youbl/article/details/32708609
3. exports[时的错误](https://stackoverflow.com/questions/59713654/logger-debug-is-not-a-function-while-using-log4js)
4. https://blog.csdn.net/lxhjh/article/details/50747642
