// item.js
// 아이템
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
  /* item 첫 화면 */
  app.get('/item', function(req, res){
    console.log("***Item GET Request arrived***");

  	var currentUser;
  	var isWeb = false;

  	if((req.query.uid == undefined)){ //web
      isWeb = true;
	if(req.session.passport == undefined){res.render('logIn');}
    else 
      currentUser = req.session.passport.user.userId;
  	} else { //android
  		currentUser = req.query.uid;
  	}

    var item = {
      "point": 0,
      "list" : {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "11": 0
      }
    };

    dbConnection.query('SELECT * FROM Item WHERE userId=?;',[currentUser], function(err, data){
      if(err) {
         console.log(err);
      }
  	  if (data[0] != null) {
        item.list[1] = data[0].bean;
        item.list[2] = data[0].waterdrop;
        item.list[3] = data[0].ice;
        item.list[4] = data[0].choco;
        item.list[5] = data[0].greenteaPowder;
        item.list[6] = data[0].milk;
        item.list[7] = data[0].grapefruit;
        item.list[8] = data[0].sparkling;
        item.list[9] = data[0].syrup;
        item.list[10] = data[0].bluePigment;
        item.list[11] = data[0].lemon;
      }

dbConnection.query('SELECT point FROM User WHERE userId=?;',[currentUser], function(err, data){
        if(err) {
           console.log(err);
        }
        item.point = data[0].point;
        if(isWeb == true) {
          res.render('item', {
            item: item
          });
        } else {
          res.json(item);
        }
   });

    });
  });

  /* item 구입 */
  app.post('/item/buy', function(req, res){
    console.log("***Item BUY POST Request arrived***");

  	var currentUser;
  	var isWeb = false;
	var json = {};

  	if((req.query.uid == undefined)){ //web
      isWeb = true;
	if(req.session.passport == undefined){res.render('logIn');}
    else 
      currentUser = req.session.passport.user.userId;
	  json = req.body;
  	} else { //android
  		currentUser = req.query.uid;
		json = JSON.parse(req.body);
  	}

    console.log("body** "+req.body);
    console.log("body.point** "+req.body.point);
	
    console.log("body.list** "+req.body.list);
	console.log(json);
    var item = {
      bean: json.list[0],
      waterdrop: json.list[1],
      ice: json.list[2],
      choco: json.list[3],
      greenteaPowder: json.list[4],
      milk: json.list[5],
      grapefruit: json.list[6],
      sparkling: json.list[7],
      syrup: json.list[8],
      bluePigment: json.list[9],
      lemon:json.list[10]
    };
    console.log(item);

    dbConnection.query('UPDATE User set point=point-? WHERE userId=?;',[json.point, currentUser], function(err, data){
      if(err) {
         console.log(err);
      }

      dbConnection.query('UPDATE Item set bean=bean+?, waterdrop=waterdrop+?, ice=ice+?, choco=choco+?, greenteaPowder=greenteaPowder+?, milk=milk+?, grapefruit=grapefruit+?, sparkling=sparkling+?, syrup=syrup+?, bluePigment=bluePigment+?, lemon=lemon+? WHERE userId=?;'
                        , [item.bean, item.waterdrop, item.ice, item.choco, item.greenteaPowder, item.milk, item.grapefruit, item.sparkling, item.syrup, item.bluePigment, item.lemon, currentUser]
                        , function (err, result, fields) {
        if (err) {
          console.log(err);
        }else {
          if(isWeb == true) {
            res.redirect('/item');
          } else{
            res.json("success");
          }
        }
      });
    });

  });
};
