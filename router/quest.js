// quest.js
// 퀘스트
var mysql = require('mysql');
var dotenv = require('dotenv').config();
var moment = require('moment');

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
  /* quest 첫화면 */
  app.get('/quest', function(req, res){
    console.log("***Quest POST Request arrived***");

    var currentUser;
    var isWeb = false;

    if((req.query.uid == undefined)){ //web
      isWeb = true;
      currentUser = req.session.passport.user.userId;
    } else { //android
      currentUser = req.query.uid;
    }

    dbConnection.query('SELECT * FROM Quest WHERE userId = ?;',[currentUser], function(err, data){
      if (err) {
        console.log(err);
      }else {
		if(data[0].type == "weekly") {
        var endDate = parseInt(moment(data[0].startDate, 'YYYYMMDD').add(+7, 'days').format('YYYYMMDD'));
} else if(data[0].type == "monthly") {
var endDate = parseInt(moment(data[0].startDate, 'YYYYMMDD').add(1, 'M').format('YYYYMMDD'));
}
console.log(endDate);

        dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId = ? AND date >= ? AND date <= ?;',[req.query.uid, startDate, endDate], function(err, data){
          if(isWeb == true) {
            res.redirect('/quest');
          } else{
            res.json("success");
          }
        });
      }
    });
  });


  /* quest 시작 */
  app.post('/quest/start', function(req, res){
    console.log("***Quest Start POST Request arrived***");

  	var currentUser;
  	var isWeb = false;

  	if((req.query.uid == undefined)){ //web
      isWeb = true;
      currentUser = req.session.passport.user.userId;
      json = req.body;
  	} else { //android
  		currentUser = req.query.uid;
      json = JSON.parse(req.body);
  	}


json.startDate = parseInt(moment().format('YYYYMMDD'));
console.log(json);
    dbConnection.query('INSERT into Quest VALUES (DEFAULT,?,?,?,?);', [json.type, currentUser, json.startDate, json.money], function (err, result, fields) {
      if (err) {
        console.log(err);
      }else {
        if(isWeb == true) {
          res.redirect('/quest');
        } else{
          res.json("success");
        }
      }
    });
  });

};
