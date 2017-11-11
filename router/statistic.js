// statistic.js
// 통계
var mysql = require('mysql');
var dotenv = require('dotenv').config();
var ss = require('simple-statistics');
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

  /*-----------------------daily statistic------------------------*/
  app.get('/get/dealing', function(req, res){
    console.log("***New Dealing GET Request ids arrived***");
  	var expenseArr = [];
  	var incomeArr = [];
  	var tempJson = {};

  	dbConnection.query('SELECT * FROM Expense WHERE userId =? AND date = ?;',[req.query.uid, parseInt(req.query.date)], function(err, data){
  		tempJson.expenseList = data;
  	});

  	dbConnection.query('SELECT * FROM Income WHERE userId = ? AND date = ?;',[req.query.uid, parseInt(req.query.date)], function(err, data){
  		tempJson.incomeList = data;
  		res.json(tempJson);
  	});

  });
	app.get('/statistic/web', function(req, res) {
    var allData = [];
    var date;
    var currentUser = req.session.passport.user.userId;
	console.log(req.query.date);

    if(req.query.date)
	{
	  console.log("1");
      date = parseInt(moment(req.query.date, 'YYYYMMDD').format('YYYYMMDD'));
	}
	else{
	console.log("2");
      date = parseInt(moment().format('YYYYMMDD'));
	}

	console.log(date);

    dbConnection.query('SELECT SUM(money) AS totalIncome FROM Income WHERE userId = ? AND date =?;', [currentUser, date], function(err, data){
      if(err){
        console.log(err);
      } else {
		if(data[0].totalIncome == null)
			data[0].totalIncome = 0;
        allData.push(data);
        dbConnection.query('SELECT SUM(money) AS totalExpense FROM Expense WHERE userId = ? AND date =?;',[currentUser, date],function(err, data){
            if(err){
              console.log(err);
            } else {
				if(data[0].totalExpense == null)
					data[0].totalExpense = 0;

              allData.push(data);
              dbConnection.query('SELECT * FROM Income WHERE userId = ? AND date =?;', [currentUser, date],function(err, data){
                  if(err) {
                    console.log(err);
                  } else {
                    allData.push(data);
                    dbConnection.query('SELECT * FROM Expense WHERE userId = ? AND date =?;', [currentUser, date],function(err, data){
                      if(err){
                        console.log(err);
                      } else {
                        allData.push(data);
                        res.render('daily', {allData});
                      }
                    });
                  }
              });
            }
        });
      }
    });

	});
  //일별통계 세부정보 조회
  app.get('/statistic/web/detail', function(req, res){
    var currentUser = req.session.passport.user.userId;
    if(req.query.incomeid){
      dbConnection.query('SELECT * FROM Income WHERE userId = ? AND incomeId = ?;', [currentUser, req.query.incomeid], function(err, data){
        if(err){
          console.log(err);
        } else {
          res.render('daily-detail', {data});
        }
      });
    } else {
      dbConnection.query('SELECT * FROM Expense WHERE userId = ? AND expenseId = ?;', [currentUser, req.query.expenseid], function(err, data){
        if(err){
          console.log(err);
        } else {
          res.render('daily-detail', {data});
        }
      });
    }
  });
	/*----------------------monthly statistics------------------------*/
  app.get('/statistic/monthly', function(req, res){
    console.log("***Statistic GET Request arrived***");

  	var currentUser;
  	var fromDate;
  	var toDate;
  	var isWeb = false;

  	if( (req.query.uid == undefined)){ //web
  		currentUser = req.session.passport.user.userId;

  		isWeb = true;
  	} else { //android
  		currentUser = req.query.uid;
		req.query.month = req.query.date;
  	}

  	if( (req.query.month == undefined) ){ //기본값
  		fromDate = 20171100;
  		toDate = 20171200;
   	} else{ //달 선택
  		fromDate = parseInt(req.query.month+"00");
    		toDate = fromDate+100;
  	}

  	console.log("curerntUser: "+currentUser);
    var statistic = {
      "income": 0,
      "expense":0,
      "mine" : {
        "식비": 0,
        "교통비": 0,
        "문화": 0,
        "생활": 0,
        "음료/간식": 0,
        "교육": 0,
        "공과금": 0,
        "기타": 0
      },
      "whole" : {
        "식비": 0,
        "교통비": 0,
        "문화": 0,
        "생활": 0,
        "음료/간식": 0,
        "교육": 0,
        "공과금": 0,
        "기타": 0
      }
    };

    /* Arrays for computing */
    var expenses = [];
    var food = [];
    var fare = [];
    var culture = [];
    var living = [];
    var snack = [];
    var edu = [];
    var utility = [];
    var etc = [];

    dbConnection.query('SELECT sum(money) as money FROM Income WHERE userId =? AND date > ? AND date < ?;',[currentUser, fromDate, toDate], function(err, data){
      if(err) {
         console.log(err);
      }
  	  if (data[0].money != null) {
   	     statistic.income = data[0].money;
  	  }

      dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId =? AND date > ? AND date < ?;',[currentUser, fromDate, toDate], function(err, data){
        console.log(data[0].money);
    		if (data[0].money!=null) {
              statistic.expense = data[0].money;
    		}

        dbConnection.query('SELECT category, sum(money) as money FROM Expense WHERE userId =? AND date > ? AND date < ? GROUP BY(category);',[currentUser, fromDate, toDate], function(err, data){
          if(err) {
             console.log(err);
          }

          for (var i in data ) {
            var category = data[i].category;
            var money =  data[i].money;
             statistic.mine[category] = money;
          }

          dbConnection.query('SELECT category, sum(money) as money FROM Expense WHERE date > ? AND date < ? GROUP BY userId, category;', [fromDate, toDate], function(err, data){
            console.log(data);
            for (var j in data ) {
              var category = data[j].category;
              var money = data[j].money;
              switch (category) {
                case "식비":
                  food.push(money);
                  break;
                case "교통비":
                  fare.push(money);
                  break;
                case "문화":
                  culture.push(money);
                  break;
                case "생활":
                  living.push(money);
                  break;
                case "음료/간식":
                  snack.push(money);
                  break;
                case "교육":
                  edu.push(money);
                  break;
                case "공과금":
                  utility.push(money);
                  break;
                case "기타":
                  etc.push(money);
                  break;
              }
            }

            statistic.whole["식비"] = ss.mean(food);
            statistic.whole["교통비"] = ss.mean(fare);
            statistic.whole["문화"] = ss.mean(culture);
            statistic.whole["생활"] = ss.mean(living);
            statistic.whole["음료/간식"] = ss.mean(snack);
            statistic.whole["교육"] = ss.mean(edu);
            statistic.whole["공과금"] = ss.mean(utility);
            statistic.whole["기타"] = ss.mean(etc);

      			if(isWeb == true) {
      				res.render('monthlyStat', {
      					statistic: statistic
      				});
      			} else{
            	res.json(statistic);
      			}
          });
        });
      });
    });
  });

};
