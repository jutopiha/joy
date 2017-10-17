// quest.js
// 퀘스트
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
  /* quest 첫화면 */
  app.post('/quest', function(req, res){
    console.log("***Quest POST Request arrived***");

    var currentUser;
    var isWeb = false;

    if((req.query.uid == undefined)){ //web
      isWeb = true;
      currentUser = req.session.passport.user.userId;
    } else { //android
      currentUser = req.query.uid;
    }

    dbConnection.query('SELECT * FROM Quest WHERE userId = ?;',[cureentUser], function(err, data){
      if (err) {
        console.log(err);
      }else {
        console.log("퀘스트 조회"+data);
        var endDate = parseInt(moment(data[0].startDate, 'YYYYMMDD').add(+7, 'days').format('YYYYMMDD'));

        dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId = ? AND date >= ? AND date <= ?;',[req.query.uid, startDate, endDate], function(err, data){
          console.log("일주일 조회"+data);
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

		//날짜 시간
		json.startDate = moment(req.body.date, 'YYYYMMDD').format('YYYYMMDD');
		json.startDate = parseInt(req.body.date);

    console.log("body** "+req.body);
    console.log("body.type** "+req.body.type);
    console.log("body.money** "+req.body.money);

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
