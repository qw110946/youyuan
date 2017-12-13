/**
 * Created by yangger on 2017/6/13.
 */
var express = require('express');
var ejs = require('ejs');
var path = require('path')
var bodyParser = require('body-parser');
var url = require('url');
var qs = require('querystring');//解析参数的库
var WechatAPI = require('wechat-api');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();

var APPID = 'wxb558057b16b95dd5';
var SECRET = '2f9ee7a666e3c2f4bc9f3060bff02ae0';
var api = new WechatAPI(APPID, SECRET);

//这里传入了一个密钥加session id
app.use(cookieParser('wxapi'));
//使用就靠这个中间件
app.use(session({ secret: 'wxapi1473'}));

// 路由
var getuserinfo = require('./js/getUserInfo');
var projectRoute = require('./js/projectRoute');
var test = require('./js/test');

// ejs
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname,'project'));  

app.use(bodyParser.json())
app.use(express.static('other'));

app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Access-Token");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    // res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});  
app.get(/\.css$/, function(req, res, next) {   
    res.header("Content-Type", "text/css;charset=utf-8"); 
    next();  
});  
app.get(/\.js$/, function(req, res, next) {   
    res.header("Content-Type", "application/javascript;charset=utf-8"); 
    next();  
});  
app.all('/', function (req, res) {
  var posts = req.body
  if(!posts.apiName){
     posts = qs.parse(url.parse(req.url).query);
  }
  if(api[posts.apiName] instanceof Object){
      function callback (err, result) { // 回调函数
         if (err) console.log(err);
         res.send(result);
      }
     if(!posts.argsArray){
         posts.argsArray = [];
      }
      posts.argsArray.push(callback);
      api[posts.apiName].apply(api, posts.argsArray)
    //}
  } else {
    res.send('没有这个api')
  }
});
app.get('/test', test(APPID, SECRET));
app.get('/getuserinfo.html', getuserinfo(APPID, SECRET));

// 设置项目路由
projectRoute(app, express);

// app.get('MP_verify_McIcGTBFz35y0f9M.txt', function (req, res) {
//   res.sendFile('./other/MP_verify_McIcGTBFz35y0f9M.txt')
// })

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
