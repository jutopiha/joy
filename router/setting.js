// setting.js
// 환경설정
var mysql = require('mysql');
var dotenv = require('dotenv').config();

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

module.exports = function(app, fs)
{
  app.get('/setting', function(req, res){
    console.log("***setting GET Request arrived***");

    var currentUser = req.query.uid;
    var setValue = req.query.value;
    var result = {};

    dbConnection.query('SELECT onAutoAlarm, onAutoParse FROM User WHERE userId=?;',[currentUser], function(err, data){
      if (err) {
        console.log(err);
        result.CODE = 400;
        result.STATUS = "FAIL";
        result.DATA = "database error";
      }else {
        result.CODE = 200;
        result.STATUS = "OK";
        result.DATA = data;
      }
      res.json(result);
    });
  });

  app.get('/setting/onautoparse', function(req, res){
    console.log("***onautoparse GET Request arrived***");

    var currentUser = req.query.uid;
    var setValue = req.query.value;
    var result = {};

    dbConnection.query('UPDATE User set onAutoParse=? WHERE userId=?;', [setValue, currentUser] , function (err, result, fields) {
      if (err) {
        console.log(err);
        result.CODE = 400;
        result.STATUS = "FAIL";
        result.DATA = "database error";
      }else {
        result.CODE = 200;
        result.STATUS = "OK";
        result.DATA = "success";
      }
      res.json(result);
    });

  });

  app.get('/setting/onautoalarm', function(req, res){
    console.log("***onautoalarm GET Request arrived***");

    var currentUser = req.query.uid;
    var setValue = req.query.value;
    var result = {};

    dbConnection.query('UPDATE User set onAutoAlarm=? WHERE userId=?;', [setValue, currentUser] , function (err, result, fields) {
      if (err) {
        console.log(err);
        result.CODE = 400;
        result.STATUS = "FAIL";
        result.DATA = "database error";
      }else {
        result.CODE = 200;
        result.STATUS = "OK";
        result.DATA = "success";
      }
      res.json(result);
    });
  });

};
