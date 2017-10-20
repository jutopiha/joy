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

// response
var finishRequest = function() {
  if(isWeb == true) {
    res.redirect('/quest');
  } else{
    res.json(result);
  }
};

// 가중치에 따라 랜덤하게 추출
function weightedRand(spec) {
  var i, j, table=[];
  for (i in spec) {
    // The constant 10 below should be computed based on the
    // weights in the spec for a correct and optimal table size.
    // E.g. the spec {0:0.999, 1:0.001} will break this impl.
    for (j=0; j<spec[i]*10; j++) {
      table.push(i);
    }
  }
  return function() {
    return table[Math.floor(Math.random() * table.length)];
  };
}

// num개의 랜덤 결과를 배열로 반환
function selectItem(num) {
  var i, items = [];
  var rand = weightedRand({0:0.2, 1:0.2, 2:0.1, 3:0.1, 4:0.08, 5:0.08, 6:0.05, 7:0.05, 8:0.05, 9:0.05, 10:0.04});
  for(i=0; i<num; ++i){
      items.push(rand());
  }

  return items;
}
module.exports = function(app, fs)
{
  /* quest 첫화면 */
  app.get('/quest', function(req, res){
    console.log("***Quest GET Request arrived***");

    var currentUser;
    var isWeb = false;
    if((req.query.uid == undefined)){ //web
      isWeb = true;
      currentUser = req.session.passport.user.userId;
    } else { //android
      currentUser = req.query.uid;
    }


    var result = {};


    dbConnection.query('SELECT * FROM Quest WHERE userId = ?;',[currentUser], function(err, data){
      if (err) {
        console.log(err);
      }else {
		    var lock = data.length;
        for(var i in data) {
          var endDate;
          if(data[i].type == "weekly") {
            var weekly = {};
            weekly.type = "weekly";
            weekly.startDate = data[i].startDate;
            weekly.endDate = parseInt(moment(data[0].startDate, 'YYYYMMDD').add(+7, 'days').format('YYYYMMDD'));
            weekly.goalMoney = data[i].money;
            dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId = ? AND date >= ? AND date <= ?;',[currentUser, weekly.startDate, weekly.endDate], function(err, data){
              if(data[0].money != null ) {
                weekly.nowMoney = data[0].money;
              } else {
                weekly.nowMoney = 0;
              }
			        lock--;
              result.weekly = weekly;
        			if(lock==0) finishRequest();
            });
          } else if(data[i].type == "monthly") {
            var monthly = {};
            monthly.type = "monthly";
            monthly.startDate = data[i].startDate;
            monthly.endDate = parseInt(moment(data[0].startDate, 'YYYYMMDD').add(1, 'M').format('YYYYMMDD'));
            monthly.goalMoney = data[i].money;
            dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId = ? AND date >= ? AND date <= ?;',[currentUser, monthly.startDate, monthly.endDate], function(err, data){
              if(data[0].money != null ) {
                monthly.nowMoney = data[0].money;
              } else {
                monthly.nowMoney = 0;
              }
       			  lock--;
              result.monthly = monthly;
      			  if(lock==0) finishRequest();
            });
          }
        }
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

  /* quest 삭제하기 */
  app.get('/quest/giveup', function(req, res){
    console.log("***Quest DELETE Request arrived***");

    var result = {};
    var currentUser;
    var isWeb = false;


    if((req.query.uid == undefined)){ //web
      isWeb = true;
      currentUser = req.session.passport.user.userId;
    } else { //android
      currentUser = req.query.uid;
    }

    dbConnection.query('DELETE FROM Quest WHERE userId = ? AND type = ?;',[currentUser, req.query.type], function(err,data){
      if (err) {
        result.CODE = 400;
        result.STATUS = "Database Error";
        throw error;
      }else {
        result.CODE = 200;
        result.STATUS = "OK";
      }

      if(isWeb == true) {
        res.redirect('/quest');
      } else{
        res.json(result);
      }
    });
  });

  /* quest 완료하기 */
  app.get('/quest/complete', function(req, res){
    console.log("***Quest 완료하기 Request arrived***");

    var result = {};
    var currentUser;
    var isWeb = false;
    if((req.query.uid == undefined)){ //web
      isWeb = true;
      currentUser = req.session.passport.user.userId;
    } else { //android
      currentUser = req.query.uid;
    }


    dbConnection.query('SELECT * FROM Quest WHERE userId = ? AND type = ?;',[currentUser, req.query.type], function(err, data){
      if (err) {
        console.log(err);
      }else {
        if(data != null) {
          var quest = {};
          var reward = {};
          quest.type = data[0].type;
          quest.startDate = data[0].startDate;
          if(quest.type == "weekly") {
            quest.endDate = parseInt(moment(data[0].startDate, 'YYYYMMDD').add(+7, 'days').format('YYYYMMDD'));
            reward.point = 120;
            reward.item = selectItem(1);
          } else if(quest.type == "monthly") {
            quest.endDate = parseInt(moment(data[0].startDate, 'YYYYMMDD').add(1, 'M').format('YYYYMMDD'));
            reward.point = 600;
            reward.item = selectItem(5);
          }
          quest.goalMoney = data[0].money;

          dbConnection.query('SELECT sum(money) as money FROM Expense WHERE userId = ? AND date >= ? AND date <= ?;',[currentUser, quest.startDate, quest.endDate], function(err, data){
            var nowMoney;
            if(data[0].money != null ) {
              nowMoney = data[0].money;
            } else {
              nowMoney = 0;
            }

            if(nowMoney <= quest.goalMoney) {
              dbConnection.query('DELETE FROM Quest WHERE userId = ? AND type = ?;',[currentUser, quest.type], function(err,data){
                if (err) {
                  result.CODE = 400;
                  result.STATUS = "Database Error";
                  throw error;
                }else {
                  result.CODE = 200;
                  result.STATUS = "OK";
                  result.DATA = "success";

                  dbConnection.query('UPDATE User set point=point+? WHERE userId=?;',[reward.point, currentUser], function(err, data){
                    if(err) {
                       console.log(err);
                    } else {
                      quantity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                      for(var i in reward.item) {
                        var rand_item = parseInt(reward.item[i]);
                        quantity[rand_item]++;

                        switch(rand_item){
                          case 0:
                            reward.item[i] = "bean";
                            break;
                          case 1:
                            reward.item[i] = "waterdrop";
                            break;
                          case 2:
                            reward.item[i] = "ice";
                            break;
                          case 3:
                            reward.item[i] = "choco";
                            break;
                          case 4:
                            reward.item[i] = "greenteaPowder";
                            break;
                          case 5:
                            reward.item[i] = "milk";
                            break;
                          case 6:
                            reward.item[i] = "grapefruit";
                            break;
                          case 7:
                            reward.item[i] = "sparkling";
                            break;
                          case 8:
                            reward.item[i] = "syrup";
                            break;
                          case 9:
                            reward.item[i] = "bluePigment";
                            break;
                          case 10:
                            reward.item[i] = "lemon";
                            break;
                        }
                      }
                      dbConnection.query('UPDATE Item set bean=bean+?, waterdrop=waterdrop+?, ice=ice+?, choco=choco+?, greenteaPowder=greenteaPowder+?, milk=milk+?, grapefruit=grapefruit+?, sparkling=sparkling+?, syrup=syrup+?, bluePigment=bluePigment+?, lemon=lemon+? WHERE userId=?;'
                                        , [quantity[0], quantity[1], quantity[2], quantity[3], quantity[4], quantity[5], quantity[6], quantity[7], quantity[8], quantity[9], quantity[10], currentUser]
                                        , function (err, result, fields) {
                        if (err) {
                          console.log(err);
                        }else {
                          result.reward = reward;
                          finishRequest();
                        }
                      });
                    }

                  });

                }



              });
            } else {
              result.CODE = 200;
              result.STATUS = "OK";
              result.DATA = "fail";

              finishRequest();
            }



          });
        }

      }
    });

  });

};
