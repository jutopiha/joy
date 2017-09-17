// statistic.js
// 통계
var mysql = require('mysql');
var dotenv = require('dotenv').config();
var ss = require('simple-statistics');

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

	/*----------------------monthly statistics------------------------*/
  app.get('/statistic/monthly', function(req, res){
    console.log("***Statistic GET Request arrived***");

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
    var food = [0];
    var fare = [0];
    var culture = [0];
    var living = [0];
    var snack = [0];
    var edu = [0];
    var utility = [0];
    var etc = [0];


    /* requested month */
    var fromDate = parseInt(req.query.date+"00");
    var toDate = fromDate+100;

    dbConnection.query('SELECT sum(money) as money FROM Income WHERE userId =? AND date > ? AND date < ?;',[req.query.uid, fromDate, toDate], function(err, data){
      if(err) {
         console.log(err);
      }
      console.log(data[0].money);
	  if (data[0].money != null) {
 	     statistic.income = data[0].money;
	  }
      dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId =? AND date > ? AND date < ?;',[req.query.uid, fromDate, toDate], function(err, data){
        console.log(data[0].money);
		if (data[0].money!=null) {
          statistic.expense = data[0].money;
		}
        dbConnection.query('SELECT category, sum(money) as money FROM Expense WHERE userId =? AND date > ? AND date < ? GROUP BY(category);',[req.query.uid, fromDate, toDate], function(err, data){
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
                case "기타":
                  etc.push(money);
                  break;
                case "식비":
                  food.push(money);
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

            res.json(statistic);
          });
        });
      });
    });
  });

};
