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
  //금융지식팁 메인페이지
  app.get('/community', function(req, res){
    dbConnection.query("SELECT * from Post WHERE category='금융지식팁' ORDER BY postId DESC LIMIT 9;", function(err, data){
      if(err){
        console.log(err);
      } else {
//		  console.log(data);
          res.render('community', {data});
      }
    });
  });

  //게시글 조회
  app.get('/community/post', function(req, res){
    var postid = req.query.postid;
    var postData = [];

    dbConnection.query("SELECT * FROM Post WHERE postId=?;",[postid], function(err, data){
      if(err){
        console.log(err);
      } else {
        postData += data;
        dbConnection.query("SELECT * FROM Comment WHERE postId=?",[postid], function(err, data){
          postData += data;
          console.log(postData);
          res.render('community-post',{postData});
        });
      }
    });
  });

  //자유게시판 메인페이지
  app.get('/community/joy-free', function(req, res){
    dbConnection.query("SELECT * from Post WHERE category='자유게시판' ORDER BY postId DESC LIMIT 9;", function(err, data){
      if(err){
        console.log(err);
      } else {
          res.render('community-joy-free', {data});
      }
    });
  });

  //다짐톡 메인페이지
  app.get('/community/joy-fighting', function(req, res){
    dbConnection.query("SELECT * from Post WHERE category='다짐톡' ORDER BY postId DESC LIMIT 9;", function(err, data){
      if(err){
        console.log(err);
      } else {
          res.render('community-joy-fighting', {data});
      }
    });
  });

  //소개톡 메인페이지
  app.get('/community/joy-hello', function(req, res){
    dbConnection.query("SELECT * from Post WHERE category='소개톡' ORDER BY postId DESC LIMIT 9;", function(err, data){
      if(err){
        console.log(err);
      } else {
          res.render('community-joy-hello', {data});
      }
    });
  });

  //게시글 작성 페이지
  app.get('/community/post-write', function(req, res){
    res.render('community-write',{});
  });

  //게시글 작성 완료
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
			res.redirect('/community');
		});
	return;
	});


};
