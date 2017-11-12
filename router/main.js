// main.js
// main, 지출, 수입 Create, Update, Delete
var mysql = require('mysql');
var dotenv = require('dotenv').config();
var moment = require('moment');
var session = require('./session.js');

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
  app.get('/kids', function(req, res){
    res.render('kids');
  });

  //ejs HTML 파일에서 데이터 사용하기
  app.get('/setting/test', function(req, res){
    var username;
    var profilePicture;
	var gender = "no";
	var birth = 0;
    if (req.session.passport != undefined) {
      var userId = req.session.passport.user.userId;
      username = req.session.passport.user.name;
	console.log("why");
	console.log(req.session.passport.user.gender);
      gender = req.session.passport.user[0].gender;
      birth = req.session.passport.useri[0].birth;
      profilePicture = "https://graph.facebook.com/" + userId +"/picture?type=large";
    } else {
      username = "guest";
    }

    res.render('index_new_test', {
        title: "MY HOMEPAGE",
        length: 5,
        username: username,
        profilePicture: profilePicture,
        gender: gender,
        birth: birth
    });
  });

  //ejs HTML 파일에서 데이터 사용하기
  app.get('/', function(req, res){
    var username;
    var profilePicture;
   var gender = "no";
	var birth = 0;
  var isFirst=false;
    if(req.query.isFirst == true) {
      isFirst = true;
		res.render('userinfo');
    }

  if (req.session.passport != undefined) {
		if(req.session.passport.user != undefined){
      var userId = req.session.passport.user.userId;
      username = req.session.passport.user.name;
           gender = req.session.passport.user.gender;
      birth = req.session.passport.user.birth;
  profilePicture = "https://graph.facebook.com/" + userId +"/picture?type=large";}
		  else {
			  username = "guest";
      }
    } else {
      username = "guest";
    }

    res.render('index_new', {
        title: "MY HOMEPAGE",
        length: 5,
        username: username,
        profilePicture: profilePicture,
        isFirst: isFirst,
gender:gender,
birth: birth
    });
  });

  /* android main */
  app.get('/main', function(req, res){
    console.log("***GET /main***");
    var mainObject = {};
    var beforeOneWeekDate = parseInt(moment().add(-7, 'days').format('YYYYMMDD'));
	console.log(moment().format('YYYYMMDD'));
    var nowDate = parseInt(moment().format('YYYYMMDD'));
	var temp = parseInt(moment().format('YYYYMMDDHHmm'));
	console.log("temp" + temp);
    var fromDate = parseInt(nowDate / 100) * 100 + 1;
	console.log("nowDate=" + nowDate +"fromDate="+ fromDate);
	console.log("uid: ", req.query.uid);
    dbConnection.query('SELECT * FROM User WHERE userId = ?;',[req.query.uid], function(err, data){

	  console.log('point error 찾기: data='+data+'\n');
	  console.log('point error 찾기: data[0]='+data[0]+'\n');
      mainObject.point = data[0].point;
      mainObject.name = data[0].name;
	  mainObject.birth = data[0].birth;
mainObject.gender = data[0].gender;
      dbConnection.query('SELECT money FROM Expense WHERE userId = ? ORDER BY expenseId DESC LIMIT 1;',[req.query.uid, nowDate], function(err, data){

        if (data[0] != null) {
          console.log("recentExpense:"+data[0].money);
          mainObject.recentExpense = data[0].money;
        } else{
          mainObject.recentExpense = 0;
        }

        dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId = ? AND date = ?;',[req.query.uid, nowDate], function(err, data){
          if (data[0] != null) {
            console.log("todayExpense:"+data[0].money);
            mainObject.todayExpense = data[0].money;
          } else {
            mainObject.todayExpense = 0;
          }

          dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId = ? AND date >= ? AND date <= ?;',[req.query.uid, beforeOneWeekDate, nowDate], function(err, data){
            if (data[0] != null) {
              console.log("weeklyExpense:"+data[0].money);
              mainObject.weeklyExpense = data[0].money;
            } else {
              mainObject.weeklyExpense = 0;
            }


            dbConnection.query('SELECT sum(money) as money FROM Income WHERE userId =? AND date >= ? AND date <= ?;',[req.query.uid, fromDate, nowDate], function(err, data){
              if(err) {
                 console.log(err);
              }
          	  if (data[0].money != null) {
                console.log("monthlyIncome:"+data[0].money);
           	    mainObject.monthlyIncome = data[0].money;
          	  } else {
                mainObject.monthlyIncome = 0;
              }
              dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId =? AND date >= ? AND date <= ?;',[req.query.uid, fromDate, nowDate], function(err, data){
            		if (data[0].money != null) {
                  console.log("monthlyExpense:"+data[0].money);
                  mainObject.monthlyExpense = data[0].money;
            		} else {
                  mainObject.monthlyExpense = 0;
                }
                res.json(mainObject);
                console.log("mainObejct:"+mainObject);
              });
            });
          });
        });
      });
    });
  });

  /* web render */
	app.get('/income', function(req, res){
		if( req.session.passport == undefined ) {res.render('logIn');}
		res.render('income', {});

	});
	app.get('/expense', function(req, res){
		if( req.session.passport == undefined ) {res.render('logIn');}
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
		if(req.session.passport == undefined){res.render('logIn')}
  		else
			uid = req.session.passport.user.userId;

  		//날짜 시간
  		req.body.date = moment(req.body.date, 'YYYYMMDD').format('YYYYMMDD');
  		req.body.time = moment(req.body.time, 'HHmm').format('HHmm');
  		//console.log(req.body.date);
  		req.body.date = parseInt(req.body.date);
  		req.body.time = parseInt(req.body.time);
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
                        json.memo, json.category, json.payMethod], function (err, result, fields) {
     	if (err) {
        result.CODE = 400;
        result.STATUS = "Database Error";
        throw error;
      }else {
        result.CODE = 201;
        result.STATUS = "Created";
        result.DATA = json;
      }
	  if(uid != req.query.uid){
		res.redirect('/');
	  } else{
      	res.json(result);
	  }
  	});

    return;
  });

  /*------------------------POST/income------------------------*/
  app.post('/post/income', function(req, res){
    var result = {};
    var json = {};
	var uid = req.query.uid;

	if(uid=='web'){
		if(req.session.passport == undefined){res.render('logIn')}
        else
		  uid = req.session.passport.user.userId;

        //날짜 시간
        req.body.date = moment(req.body.date, 'YYYYMMDD').format('YYYYMMDD');
        req.body.time = moment(req.body.time, 'HHmm').format('HHmm');
        //console.log(req.body.date);
        req.body.date = parseInt(req.body.date);
        req.body.time = parseInt(req.body.time);
        //console.log(req.body.time);

        json = req.body;
    } else {
        // parse body
        json = JSON.parse(req.body);
    }
    console.log(req.body);
    console.log(json);

  	// insert to DB
  	dbConnection.query('INSERT Income VALUES (DEFAULT,?,?,?,?,?,?);', [uid, json.date, json.time, parseInt(json.money),
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
	  if(uid != req.query.uid){
        res.redirect('/');
      } else{
        res.json(result);
      }
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

  /*------------------------POST/detail-rewite------------------------*/
  app.post('/post/detail-rewrite', function(req, res){
    var currentUser = req.session.passport.user.userId;

    if(req.query.expenseid){
      dbConnection.query('UPDATE Expense SET date = ?, time = ?, money = ?, memo = ?, category = ?, payMethod = ? WHERE userId = ? and expenseId = ?', [req.body.date, req.body.time, req.body.money, req.body.memo, req.body.category, req.body.payMehod, currentUser, req.query.expenseid ], function(err, data){
        if(err){
          console.log(err);
        } else {
          res.render('index_new', {});
        }
      });
    } else if(req.query.incomeid){
      dbConnection.query('UPDATE Income SET date = ?, time = ?, money = ?, memo = ?, category = ? WHERE userId = ? and incomeId = ?', [req.body.date, req.body.time, req.body.money, req.body.memo, req.body.category, currentUser, req.query.incomeid ], function(err, data){
        if(err){
          console.log(err);
        } else {
          res.render('index_new', {});
        }
      });
    }
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
