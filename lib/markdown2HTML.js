
var Markdown = require('markdown-to-html').Markdown;
var md = new Markdown();
md.bufmax = 2048;

var fileName="C:/Users/zp/Documents/GitHub/booknote/source_code/node/promise.md"
var opts = {title: 'promise', 
stylesheet: './../stytle/github.css'};

md.render(fileName, opts, function(err) {
  if (err) {
    console.error('>>>' + err);
    process.exit();
  }
  md.pipe(process.stdout);
});