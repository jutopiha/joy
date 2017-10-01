
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
	/* character */
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
   	     console.log(data);
         console.log(data[0]);
      for (var i in data ) {
      	var n = data[i].characterType
      	character.list[n] = 1;
        	}
      }

      if(isWeb == true) {
        character.main = req.session.passport.user.mainCharacter;
      	res.render('character');
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

};
