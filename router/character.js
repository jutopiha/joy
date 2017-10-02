
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
	/* character 첫 화면 */
  app.get('/character', function(req, res){
    console.log("***Character GET Request arrived***");

  	var currentUser;
  	var isWeb = false;

  	if( (req.query.uid == undefined)){ //web
      isWeb = true;
      currentUser = req.session.passport.user.userId;
  	} else { //android
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

    dbConnection.query('SELECT characterType FROM Charact WHERE userId=?;',[currentUser], function(err, data){
      if(err) {
         console.log(err);
      }
  	  if (data[0] != null) {
        for (var i in data ) {
        	var n = data[i].characterType
        	character.list[n] = 1;
        }
      }

console.log("state!!!"+req.query.state);
      if(isWeb == true) {
        character.main = req.session.passport.user.mainCharacter;
      	res.render('character', {
    			character: character, state: req.query.state
    		});
      } else{
        dbConnection.query('SELECT mainCharacter FROM User WHERE userId=?;',[currentUser], function(err, data){
          if(err) {
             console.log(err);
          }
          character.main = data[0].mainCharacter;
          res.json(character);
      	});
      }
    });
  });

  /* character unlock*/
  app.get('/character/unlock', function(req, res){
    console.log("***Character Unlock GET Request arrived***");

    var currentUser;
    var isWeb = false;

    if((req.query.uid == undefined)){ //web
      isWeb = true;
      currentUser = req.session.passport.user.userId;
    } else { //android
      currentUser = req.query.uid;
    }

    var result = {};

    dbConnection.query('SELECT characterType FROM Charact WHERE userId=?;',[currentUser], function(err, data){
      if(err) {
         console.log(err);
      }
      if (data[0] != null) {
        // unlock 할 수 있는 상태인지
        for (var i in data ) {

        }
      }

      result.state = "success";
      // insert..


      if(isWeb == true) {
        console.log("web");
        res.redirect('/character?state='+result.state);
      } else{
        console.log("android");
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
      currentUser = req.session.passport.user.userId;
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
