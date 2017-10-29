var express = require('express');
var app = express();
//POST 데이터 처리
var bodyParser = require('body-parser');
//세션 관리
var session = require('express-session');
//파일 입출력
var fs = require('fs');


//서버가 읽을 수 있도록 HTML의 위치를 정의
app.set('views',__dirname + '/views');
//서버가 HTML 렌더링을 할 때 EJS 엔진을 사용하도록 설정
app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile);


var server = app.listen(9000, function(){
    var host = server.address().address;
    var port = server.address().port;

//    console.log("Express server has started onport 3000");
    //console.log("앱은 http://%s:%s 에서 작동 중입니다.", host, port);
    console.log('Application is running on http://52.78.193.208:3000');
});


//정적 파일(public파일에 있는 정적파일을 불러서 서비스)
app.use(express.static('public'));

app.use(bodyParser.text());
//에러때문에 extended: true 추가
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

//라우터 모듈인 main.js를 불러와서 app에게 전달 & fs모듈 사용할 수 있도록 추가
var main = require('./router/main')(app, fs);
var session = require('./router/session')(app, fs);
var statistic = require('./router/statistic')(app, fs);
var community = require('./router/community')(app, fs);
var character = require('./router/character') (app, fs);
var item = require('./router/item') (app, fs);
var quest = require('./router/quest') (app, fs);
