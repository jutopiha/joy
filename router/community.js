//community.js
//커뮤니티
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

//module.exports는 server.js에서 모듈로 불러올 수 있도록 사용됨
module.exports = function(app, fs)
{
  app.get('/community', function(req, res){
    var postData = [];
    dbConnection.query("SELECT * from Post ORDER BY postId DESC LIMIT 9;", function(err, data){
      if(err){
        console.log(err);
      } else {

      }
      console.log(data);
    });
    res.render('community-write',{});
  });

  app.get('/community/post-write', function(req, res){
    res.render('community-write',{});
  });

	app.post('/community/post-write-complete', function(req, res){
		var result = {};
		var json = {};
		var uid = '1234';

		//community POST request
		console.log("***New COMMUNITY POST Request id arrived***");

		//parse body
		json = req.body;
		console.log(json.title);
		console.log(json.smarteditor);

		//insert to DB
		dbConnection.query("INSERT into Post VALUES(DEFAULT,?,?,DEFAULT,?,?,?);",[uid, json.category, json.title, json.smarteditor, json.image], function(err, result, fields){
			if(err) {
			console.log(err);
//				result.CODE = 400;
//				result.STATUS = "Database Error";
//				throw error;
			} else {
//				result.CODE = 201;
//				result.STATUS = "Created";
//				result.DATA = json;
			}
			res.redirect('/');
		});
	return;
	});


};
