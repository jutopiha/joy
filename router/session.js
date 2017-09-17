// session.js
// 회원관리
var mysql = require('mysql');
//var FacebookStrategy = require('passport-facebook').Strategy;

/*connect MySQL*/
var dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

dbConnection.connect(function(err){
    if(err){
        console.error("error connection: " + err.stack);
        return;
    }
});

//module.exports는 server.js에서 모듈로 불러올 수 있도록 사용됨
module.exports = function(app, fs)
{

  /*------------------------POST/signin------------------------*/
  app.post('/post/signin', function(req, res){
    var result = {};
    var json = {};
    var autoParse = 0;
    var autoAlarm = 0;
    //signin request
    console.log("***New USER SIGNIN POST Request is arrived***");

    // parse body
    json = JSON.parse(req.body);
    console.log(json);

    autoParse = (json.onAutoParse == 'true');
    autoAlarm = (json.onAutoAlarm == 'true');
    // insert to DB
    dbConnection.query('INSERT into User VALUES (?,?,?,?,?,?,?,?);', [json.userId, json.name, parseInt(json.birth), json.gender, json.profilePicture, json.mainBank, autoParse, autoAlarm], function (err, results, fields) {
      if (err) {
        result.CODE = 400;
        result.STATUS = "Database Error";
        throw error;
      }else {
        result.CODE = 201;
        result.STATUS = "Created";
        result.DATA = json;
      }

      res.json(result);
    });

    return;
  });

  app.get('/get/userinfo', function(req, res){
    console.log("***New User INFO GET Request is arrived");
    dbConnection.query('SELECT * FROM User WHERE userId = ?;',[req.query.uid], function(err, data){
      if (err) throw error;

      res.json(data);
    });
  });
};
