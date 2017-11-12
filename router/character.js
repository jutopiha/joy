
// character.js
// 캐릭터
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
  app.get('/testc', function(req, res){
    console.log("***Character GET Request arrived***");

  	res.render('character');
  });


	/* character 첫 화면 */
  app.get('/character', function(req, res){
    console.log("***Character GET Request arrived***");
    var loginLock = false;

    var isUnlockSuccess;
    if(req.query.state != null){
      isUnlockSuccess = req.query.state;
    } else {
      isUnlockSuccess = "nono";
    }
  	var currentUser;
  	var isWeb = false;

  	if(req.query.uid == undefined){ //web
      isWeb = true;
  	  if(req.session.passport == undefined)
  		  res.render('logIn');
      else {
        loginLock = true;
        currentUser = req.session.passport.user.userId;
      }

  	} else { //android
      loginLock = true;
  		currentUser = req.query.uid;
  	}

    var character = {
      "main": 0,
      "list" : {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
      }
    };

<<<<<<< HEAD
    if(loginLock == true) {
      dbConnection.query('SELECT characterType FROM Charact WHERE userId=?;',[currentUser], function(err, data){
        if(err) {
           console.log(err);
        }
    	  if (data[0] != null) {
          for (var i in data ) {
          	var n = data[i].characterType
          	character.list[n] = n;
          }
        }

        dbConnection.query('SELECT mainCharacter FROM User WHERE userId=?;',[currentUser], function(err, data){
          if(err) {
             console.log(err);
          }
          character.main = data[0].mainCharacter;

          if(isWeb == true) {
          	res.render('character', {
        			character: character, state: isUnlockSuccess
        		});
          } else{
            res.json(character);
          }

        });

      });
    }

=======
    dbConnection.query('SELECT characterType FROM Charact WHERE userId=?;',[currentUser], function(err, data){
      if(err) {
         console.log(err);
      } else {
  	  if (data[0] != null) {
        for (var i in data ) {
        	var n = data[i].characterType
        	character.list[n] = n;
        }
      }

      dbConnection.query('SELECT mainCharacter FROM User WHERE userId=?;',[currentUser], function(err, data){
        if(err) {
           console.log(err);
         } else {
        	character.main = data[0].mainCharacter;

    	    if(isWeb == true) {
	        	res.render('character', {
      				character: character, state: isUnlockSuccess
      			});
        	} else{
         	 	res.json(character);
        	}
		}
      });
		}
    });
>>>>>>> 6ceef55b0a5de95c7ffd5f646a3ee490c1950d85
  });

  /* character unlock*/
  app.get('/character/unlock', function(req, res){
    console.log("***Character Unlock GET Request arrived***");

    var currentUser;
    var isWeb = false;
    var item = {
      bean: 0,
      waterdrop: 0,
      ice: 0,
      choco: 0,
      greenteaPowder: 0,
      milk: 0,
      grapefruit: 0,
      sparkling: 0,
      syrup: 0,
      bluePigment: 0,
      lemon:0,
    };

    if((req.query.uid != undefined)){ //web

      isWeb = true;
  	  if(req.session.passport != undefined && req.session.passport.user!=undefined)
        currentUser = req.session.passport.user.userId;
      else
  		  res.render('logIn');

    } else { //android
      currentUser = req.query.uid;
    }

    var result = {};

    dbConnection.query('SELECT * FROM Item WHERE userId=?;',[currentUser], function(err, data){
      if(err) {
         console.log(err);
      }

      item.bean = data[0].bean;
      item.waterdrop= data[0].waterdrop;
      item.ice= data[0].ice;
      item.choco = data[0].choco;
      item.greenteaPowder = data[0].greenteaPowder;
      item.milk = data[0].milk;
      item.grapefruit = data[0].grapefruit;
      item.sparkling = data[0].sparkling;
      item.syrup = data[0].syrup;
      item.bluePigment = data[0].bluePigment;
      item.lemon = data[0].lemon;
console.log(req.query.type+"번 캐릭터를 풀려고 해");
 switch(parseInt(req.query.type)){
        case 1:
          if(item.bean>=3 && item.waterdrop>=5 && item.ice>=2) {
            item.bean -= 3;
            item.waterdrop -= 5;
            item.ice -= 2;

            result.state = "success";
          }
          break;
        case 2:
          if(item.bean>=2 && item.milk>=4 && item.ice>=2) {
            item.bean -= 2;
            item.milk -= 4;
            item.ice -= 2;

            result.state = "success";
          }
          break;
        case 3:
          if(item.bean>=2 && item.milk>=4 && item.ice>=2 && item.choco>=2) {
            item.bean -= 2;
            item.milk -= 4;
            item.ice -= 2;
            item.choco -= 2;

            result.state = "success";
          }
          break;
        case 4:
          if(item.greenteaPowder>=3 && item.milk>=3 && item.ice>=2) {
            item.greenteaPowder -= 3;
            item.milk -= 3;
            item.ice -= 2;

            result.state = "success";
          }
          break;
        case 5:
          if(item.grapefruit>=3 && item.sparkling>=2 && item.ice>=2 && item.syrup>=1) {
            item.grapefruit -= 3;
            item.sparkling -= 2;
            item.ice -= 2;
            item.syrup -= 1;

            result.state = "success";
          }
          break;
        case 6:
          if(item.bluePigment>=1 && item.lemon>=1 && item.sparkling>=3 && item.syrup>=1 && item.ice>=2) {
            item.bluePigment -= 1;
            item.lemon -= 1;
            item.sparkling -= 3;
            item.syrup -= 1;
            item.ice -= 2;

            result.state = "success";
          }
          break;
      }

      if(result.state == "success") {
        // insert to DB
        dbConnection.query('INSERT into Charact VALUES (DEFAULT,?,?);', [req.query.type, currentUser], function (err, result, fields) {
          if (err) {
            console.log(err);
          }else {
            dbConnection.query('UPDATE Item set bean=?, waterdrop=?, ice=?, choco=?, greenteaPowder=?, milk=?, grapefruit=?, sparkling=?, syrup=?, bluePigment=?, lemon=? WHERE userId=?;'
                              , [item.bean, item.waterdrop, item.ice, item.choco, item.greenteaPowder, item.milk, item.grapefruit, item.sparkling, item.syrup, item.bluePigment, item.lemon, currentUser]
                              , function (err, result, fields) {
              if (err) {
                console.log(err);
              }else {
              }
            });
          }

        });
      } else {
        result.state = "fail";
      }

      if(isWeb == true) {
        console.log("web");
        res.redirect('/character?state='+result.state);
      } else{
        console.log("android");
        res.json(result.state);
      }

    });

  });

  /* character main*/
  app.get('/character/main', function(req, res){
    console.log("***Character main GET Request arrived***");

    var currentUser;
    var isWeb = false;

    if((req.query.uid == undefined)){ //web
      isWeb = true;
    	if(req.session.passport == undefined) res.render('logIn');
        else currentUser = req.session.passport.user.userId;
    } else { //android
      currentUser = req.query.uid;
    }

    var result = {};

    dbConnection.query('UPDATE User set mainCharacter=? WHERE userId=?;',[req.query.type, currentUser], function(err, data){
      if(err) {
         console.log(err);
      }

      if(isWeb == true) {
        console.log("web");
        res.redirect('/character');
      } else{
        console.log("android");
	      res.json("success");
      }
    });

  });

};
