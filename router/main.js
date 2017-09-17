// main.js
// main, 지출, 수입 Create, Update, Delete
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

//module.exports는 server.js에서 모듈로 불러올 수 있도록 사용됨
module.exports = function(app, fs)
{
    //ejs HTML 파일에서 데이터 사용하기
    app.get('/', function(req, res){
        var sess = req.session;

        res.render('index', {
            title: "MY HOMEPAGE",
            length: 5,
    //        name: sess.name,
    //        username: sess.username
	   	});
    });

  /* android main */
  app.get('/main', function(req, res){
    console.log("***GET /main***");
    var mainObject = {};
    var beforeOneWeekDate = parseInt(moment().add(-7, 'days').format('YYYYMMDD'));
    var nowDate = parseInt(moment().format('YYYYMMDD'));
    var fromDate = parseInt(nowDate / 100) * 100 + 1;
	console.log("nowDate=" + nowDate +"fromDate="+ fromDate);

    dbConnection.query('SELECT * FROM User WHERE userId = ?;',[req.query.uid], function(err, data){
      mainObject.point = data[0].point;
      mainObject.name = data[0].name;

      dbConnection.query('SELECT money FROM Expense WHERE userId = ? ORDER BY expenseId DESC LIMIT 1;',[req.query.uid, nowDate], function(err, data){
        console.log(data);
        mainObject.recentExpense = data[0].money;

        dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId = ? AND date = ?;',[req.query.uid, nowDate], function(err, data){
          console.log(data);
          mainObject.todayExpense = data[0].money;

          dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId = ? AND date > ? AND date < ?;',[req.query.uid, beforeOneWeekDate, nowDate], function(err, data){
            console.log(data);
            mainObject.weeklyExpense = data[0].money;

            dbConnection.query('SELECT sum(money) as money FROM Income WHERE userId =? AND date > ? AND date < ?;',[req.query.uid, fromDate, nowDate], function(err, data){
              if(err) {
                 console.log(err);
              }
              console.log(data[0].money);
          	  if (data[0].money != null) {
           	     mainObject.monthlyIncome = data[0].money;
          	  }
              dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId =? AND date > ? AND date < ?;',[req.query.uid, fromDate, nowDate], function(err, data){
                console.log(data[0].money);
            		if (data[0].money!=null) {
                      mainObject.monthlyExpense = data[0].money;
            		}
                res.json(mainObject);
              });
            });
          });
        });
      });
    });
  });

  /* web render */
	app.get('/income', function(req, res){
		res.render('income', {});
	});
	app.get('/expense', function(req, res){
		res.render('expense', {});
	});


  /*------------------------POST/expense------------------------*/
  app.post('/post/expense', function(req, res){
    var result = {};
	  var json = {};
    var uid = req.query.uid;

    console.log("***New EXPENSE POST Request is arrived***");
  	//web에서 받은 json 데이터 사전처리
  	if(uid=='web'){
  		uid = '1234';

  		//날짜 시간
  		req.body.date = moment(req.body.date, 'YYYYMMDD');
  		req.body.time = moment(req.body.time, 'HHmm').format('HHmm');
  		//console.log(time);
  		req.body.date = parseInt(req.body.date);
  		req.body.time = parseInt(time);
  		//console.log(req.body.time);

  		json = req.body;
  	} else {
  		// parse body
  		json = JSON.parse(req.body);
  	}
  	console.log(req.body);
  	console.log(json);

  	// insert to DB
  	dbConnection.query('INSERT into Expense VALUES (DEFAULT,?,?,?,?,?,?,?);', [uid, json.date, json.time, parseInt(json.money),
                        json.memo, json.category, json.payMethod], function (err, results, fields) {
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

  /*------------------------POST/income------------------------*/
  app.post('/post/income', function(req, res){
    var result = {};
    var json = {};

    // income request
    console.log("***New INCOME POST Request is arrived***");

  	// parse body
  	json = JSON.parse(req.body);
  	console.log(json);

  	// insert to DB
  	dbConnection.query('INSERT Income VALUES (DEFAULT,?,?,?,?,?,?);', [req.query.uid, json.date, json.time, parseInt(json.money),
                        json.memo, json.category], function (err, results, fields) {
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



  /*------------------------PUT/expense------------------------*/
  app.put('/put/expense',function(req,res){
  	var result = {};
  	var json = {};
  	console.log("***Modifed EXPENSE PUT Request is arrived***");

  	// parse body
  	json = JSON.parse(req.body);
  	console.log(json);

  	// update to DB
  	dbConnection.query('UPDATE Expense set date = ?, time = ?, money = ?, memo = ?, category = ?, payMethod = ? WHERE userId = ? and expenseId = ?', [json.date, json.time, parseInt(json.money), json.memo, json.category, json.payMethod, req.query.uid, req.query.eid ], function (err, results, fields) {
      if (err) {
        result.CODE = 400;
        result.STATUS = "Database Error";
        throw error;
      }else {
        result.CODE = 200;
        result.STATUS = "OK";
        result.DATA = json;
      }

      res.json(result);
    });

    return;
  });

  /*------------------------PUT/income------------------------*/
  app.put('/put/income',function(req,res){
  	var result = {};
  	var json = {};
  	console.log("***Modifed INCOME PUT Request is arrived***");

  	// parse body
  	json = JSON.parse(req.body);
  	console.log(json);

  	// update to DB
  	dbConnection.query('UPDATE Income set date = ?, time = ?, money = ?, memo = ?, category = ? WHERE userId = ? and incomeId = ?', [json.date, json.time, parseInt(json.money), json.memo, json.category, req.query.uid, req.query.iid ], function (err, results, fields) {
      if (err) {
        result.CODE = 400;
        result.STATUS = "Database Error";
        throw error;
      }else {
        result.CODE = 200;
        result.STATUS = "OK";
        result.DATA = json;
      }

      res.json(result);
    });
    return;
  });


  /*------------------------DELETE/expense------------------------*/
  app.delete('/delete/expense', function(req, res){
    var result = {};
  	dbConnection.query('DELETE FROM Expense WHERE userId = ? AND expenseId = ?;',[req.query.uid, req.query.eid], function(err,data){
      if (err) {
        result.CODE = 400;
        result.STATUS = "Database Error";
        throw error;
      }else {
        result.CODE = 200;
        result.STATUS = "OK";
      }

      res.json(result);
    });
  });

  /*------------------------DELETE/income------------------------*/
  app.delete('/delete/income', function(req, res){
    var result = {};
    console.log("*** DELETE REQUEST *** ");
    dbConnection.query('DELETE FROM Income WHERE userId = ? AND incomeId = ?;',[req.query.uid, req.query.iid], function(err,data){
      if (err) {
        result.CODE = 400;
        result.STATUS = "Database Error";
        throw error;
      }else {
        result.CODE = 200;
        result.STATUS = "OK";
      }

      res.json(result);
    });
  });

};
