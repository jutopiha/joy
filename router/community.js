//community.js
//커뮤니티
var mysql = require('mysql');
var dotenv = require('dotenv').config();
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

var memorystorage = multer.memoryStorage();
var upload = multer({ storage: memorystorage });

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
  app.post('/community', function(req, res){
    var currentUser = req.session.passport.user.userId;
	if(currentUser == undefined) {res.render('logIn');}
	var postNum;
	var postData = [];
	if(req.query.postNum == undefined){
		postNum = 9;
	} else {
		postNum = parseInt(req.query.postNum);
		postNum *= 2;
	}

	dbConnection.query("SELECT * from Post WHERE category='금융지식팁' ORDER BY postId DESC LIMIT ?;",[postNum], function(err, data){
      if(err){
        console.log(err);
      } else {
		  postData.push(postNum);
		  console.log(data);
		  postData.push(data);
          res.render('community', {postData});
      }
    });
  });

 app.get('/community', function(req, res){
	console.log(req.session.passport);
	if(req.session.passport == undefined){
		res.render('logIn');
	} else {
    var currentUser = req.session.passport.user.userId;
    var postNum;
    var postData = [];
    if(req.query.postNum == undefined){
        postNum = 9;
    } else {
        postNum = parseInt(req.query.postNum);
        postNum *= 2;
    }

    dbConnection.query("SELECT * from Post WHERE category='금융지식팁' ORDER BY postId DESC LIMIT ?;",[postNum], function(err, data){
      if(err){
        console.log(err);
      } else {
          postData.push(postNum);
          console.log(data);
          postData.push(data);
          res.render('community', {postData});
      }
    });
}
  });


  //게시글 조회
  app.get('/community/post', function(req, res){
    var postid = req.query.postid;
	if(req.session.passport == undefined){res.render('logIn');}
	else {
	var currentUser = req.session.passport.user.userId;
    var postData = [];
	postData.push(currentUser);
    dbConnection.query("SELECT * FROM Post WHERE postId=?;",[postid], function(err, data){
      if(err){
        console.log(err);
      } else {
        data = JSON.stringify(data);
		data = data.substring(1, data.length-1);
		data = JSON.parse(data);
		//postData += data;
		postData.push(data);
		
		console.log(data);
        console.log(postData);
		dbConnection.query("SELECT * FROM Comment WHERE postId=?",[postid], function(err, data){
		  	if(err){
				console.log(err);
			}
			else {
			data = JSON.stringify(data);
			if(data !== '[]'){
//			data = data.substring(1, data.length-1);
			console.log(data);
			data = JSON.parse(data);
			console.log(data);
			//postData += data;
			postData.push(data);
         	}
		  	console.log(postData);
		  	res.render('community-post',{postData});
			}
        });
      }
    });
	}
  });

  //게시글 수정
  app.post('/community/post-rewrite', function(req, res){
    var postid = req.query.postid;
	if(req.session.passport == undefined) {res.render('logIn');}
	else {
	var currentUser = req.session.passport.user.userId;

    dbConnection.query("SELECT * FROM Post WHERE postId=?", [postid], function(err, data){
      if(err){
        console.log(err);
      } else {
      	console.log(data);
   	    res.render('community-rewrite', {data});
      }
    });
	}
  });

  //게시글 수정 완료
  app.post('/community/post-rewrite-complete', function(req, res){
   var postid = req.query.postid;
   if(req.session.passport == undefined) {res.render('logIn');}
   else{
   var currentUser = req.session.passport.user.userId;
   console.log(req.body.title);
   console.log(req.body.content);
   dbConnection.query("UPDATE Post SET title=?,category=?,content=? WHERE postId=?", [req.body.title, req.body.category, req.body.smarteditor, postid], function(err, data){
		if(err){
			console.log(err);
		} else {
			res.redirect('/community/post?postid='+postid);
		}
	});
	}
  });

  //게시글 삭제
  app.post('/community/post-delete', function(req, res){
    var postid = req.query.postid;
	if(req.session.passport == undefined) {res.render('logIn');}
	else {
    //게시글 내 덧글 정보 삭제
    dbConnection.query("DELETE FROM Comment WHERE postId=?",[postid],function(err, data){
      if(err){
        console.log(err);
      } else {
        //게시글 삭제
        dbConnection.query("DELETE FROM Post WHERE postId=?",[postid], function(err, data){
          if(err){
            console.log(err);
          } else {
            res.redirect('/community');
          }
        });
      }
    });
	}
  });

  //게시글 내 덧글 작성
	app.post('/community/comment-write', function(req, res){
		var postid = req.query.postid;
		if(req.session.passport == undefined) {res.render('logIn');}
		else {
		var currentUser = req.session.passport.user.userId;
		

		dbConnection.query("INSERT INTO Comment VALUES(DEFAULT, ?,?,DEFAULT,?);",[currentUser, postid, req.body.content], function(err, data){
		if(err){
			console.log(err);
		} else {
			res.redirect('/community/post?postid='+postid);
		}
		});
	}
	});

  //게시글 내 덧글 삭제
	app.post('/community/comment-delete', function(req, res){
		console.log(req.query);
		var postid = req.query.postid;
		var commentid = req.query.commentid;

		dbConnection.query("DELETE FROM Comment WHERE commentId = ?", [commentid], function(err, data){
			if(err){
				console.log(err);
			} else {
				res.redirect('/community/post?postid='+postid);
			}
		});

	});

  //게시글 내 덧글 수정
  app.post('/community/comment-rewrite', function(req, res){
    var postid = req.query.postid;
    var commentid = req.query.commentid;

    dbConnection.query("UPDATE Comment SET content=?  WHERE commentid=?",[req.body.content, commentid], function(err, data){
      if(err){
        console.log(err);
      } else {
        res.redirect('/community/post?postid='+postid);
      }
    });

  });

  //자유게시판 메인페이지
  app.post('/community/joy-free', function(req, res){
    if(req.session.passport == undefined){res.render('logIn');}
	else {
	var currentUser = req.session.passport.user.userId;
	var postNum;
    var postData = [];
    if(req.query.postNum == undefined){
        postNum = 9;
    } else {
        postNum = req.query.postNum;
        postNum += 9;
    }

    dbConnection.query("SELECT * from Post WHERE category='자유게시판' ORDER BY postId DESC LIMIT ?;", [postNum],function(err, data){
      if(err){
        console.log(err);
      } else {
		  postData.push(postNum);
          postData.push(data);

          res.render('community-joy-free', {postData});
      }
    });
	}
  });

 app.get('/community/joy-free', function(req, res){
 
    if(req.session.passport == undefined){res.render('logIn');}
    else {
    var currentUser = req.session.passport.user.userId;
    var postNum;
    var postData = [];
    if(req.query.postNum == undefined){
        postNum = 9;
    } else {
        postNum = req.query.postNum;
        postNum += 9;
    }

    dbConnection.query("SELECT * from Post WHERE category='자유게시판' ORDER BY postId DESC LIMIT ?;", [postNum],function(err, data){
      if(err){
        console.log(err);
      } else {
          postData.push(postNum);
          postData.push(data);

          res.render('community-joy-free', {postData});
      }
    });
	}
  });


  //다짐톡 메인페이지
  app.post('/community/joy-fighting', function(req, res){
    
    if(req.session.passport == undefined){res.render('logIn');}
    else {
	var currentUser = req.session.passport.user.userId;
	var allData = [];
    var postNum;

	allData.push(currentUser);

	console.log('postNum is ', req.query.postNum);
	if(req.query.postNum == undefined){
		postNum = 9;
	} else {
		postNum = parseInt(req.query.postNum);
		postNum *= 2;
	}
	console.log(postNum);

	allData.push(postNum);

    dbConnection.query("SELECT * from Post WHERE category='다짐톡' ORDER BY postId DESC LIMIT ?;",[postNum], function(err, data){
      if(err){
        console.log(err);
      } else {
        console.log('community 다짐톡 post 정보(data)\n'+data);
		
		if(data.length > 0 ){
        	var db_str = "SELECT * FROM Comment Where ";
    	    for(var i=0; i<data.length; i++){
	          db_str += "postId=" + data[i].postId + " ";
        	  if(i != (data.length - 1))
    	        db_str += 'OR ';
	        }
        	db_str += "ORDER BY postId DESC, commentId ASC;"
			allData.push(data);
        	dbConnection.query(db_str, function(err, data){
            	if(err) {
	              console.log(err);
    	        } else {
        	      console.log('community 다짐톡 post+comment 정보(allData)\n'+allData);
            	  console.log('community 다짐톡 comment 정보(data)\n' + data);
              	  
				  allData.push(data);
	              res.render('community-cards', {allData});
    	        }
        	});
		} else {
			console.log("I'm In!!");
			console.log(allData);
			res.render('community-cards', {allData});
		}
       
      }
    });
	}
  });

 app.get('/community/joy-fighting', function(req, res){
    var allData = [];
    var postNum;
	if(req.session.passport == undefined){res.render('logIn');}
	else {
    console.log('postNum is ', req.query.postNum);
    if(req.query.postNum == undefined){
        postNum =9;
    } else {
        postNum = req.query.postNum;
        postNum += 9;
    }

    allData.push(postNum);

    var currentUser = req.session.passport.user.userId;
	allData.push(currentUser);

    dbConnection.query("SELECT * from Post WHERE category='다짐톡' ORDER BY postId DESC LIMIT 9;", function(err, data){
      if(err){
        console.log(err);
      } else {
        console.log('community 다짐톡 post 정보(data)\n'+data);

        if(data.length > 0 ){
            var db_str = "SELECT * FROM Comment Where ";
            for(var i=0; i<data.length; i++){
              db_str += "postId=" + data[i].postId + " ";
              if(i != (data.length - 1))
                db_str += 'OR ';
            }
            db_str += "ORDER BY postId DESC, commentId ASC;"
            allData.push(data);
            dbConnection.query(db_str, function(err, data){
                if(err) {
                  console.log(err);
                } else {
                  console.log('community 다짐톡 post+comment 정보(allData)\n'+allData);
                  console.log('community 다짐톡 comment 정보(data)\n' + data);

                  allData.push(data);
                  res.render('community-cards', {allData});
                }
            });
        } else {
			 console.log("I'm In!!");
            console.log(allData);
            res.render('community-cards', {allData});
        }

      }
    });
	}
  });

  app.post('/community/joy-fighting/write-complete', function(req, res){
	 var currentUser = req.session.passport.user.userId;

	dbConnection.query("INSERT INTO Post VALUES(DEFAULT,?,?,DEFAULT,'',?,'')",[currentUser, '다짐톡', req.body.content ],function(err, data){
		if(err) {
			console.log(err);
		} else {
			res.redirect('/community/joy-fighting');
		}

	});

  });

  app.post('/community/joy-fighting/rewrite-complete',function(req, res){
	var postid = req.query.postid;
	console.log('Im in bebe');
	dbConnection.query('UPDATE Post SET content = ? WHERE postId = ?;',[req.body.content, postid],function(err, data){
		if(err) {
			console.log(err);
		} else {
			res.redirect('/community/joy-fighting');
		}


	});

  });

  app.post('/community/joy-fighting/delete', function(req, res){
	var postid = req.query.postid;
	dbConnection.query('DELETE FROM Post WHERE postId = ?', [postid], function(err, data){
		if(err) {
			console.log(err);
		} else {
			res.redirect('/community/joy-fighting');
		}
	});
  });

  app.post('/community/joy-fighting/comment-write',function(req,res){
	var postid = req.query.postid;
	var content = req.body.content;

	dbConnection.query("INSERT INTO Comment VALUES(DEFAULT,'1234', ?, DEFAULT, ?)",[postid, content],function(err, data){
		if(err) {
			console.log(err);
		} else {
			res.redirect('/community/joy-fighting');
		}
	});
  });

  app.post('/community/joy-fighting/comment-rewrite', function(req, res){
	var commentid = req.query.commentid;

	dbConnection.query('UPDATE Comment SET content = ? WHERE commentId = ?', [req.body.content, commentid], function(err, data){
		if(err) {
			console.log(err);
		} else {
			res.redirect('/community/joy-fighting');
		}
	});
  });

  app.post('/community/joy-fighting/comment-delete',function(req, res){
	var commentid = req.query.commentid;
	
	dbConnection.query('DELETE FROM Comment WHERE commentId = ?',[commentid],function(err, data){
		if(err){
			console.log(err);
		} else {
			res.redirect('/community/joy-fighting');
		}
	});	
  });

  //소개톡 메인페이지
  app.post('/community/joy-hello', function(req, res){
	var allData = [];
	if(req.session.passport == undefined){res.render('logIn');}
	else { 
    var currentUser = req.session.passport.user.userId;
    dbConnection.query("SELECT * from Post WHERE category='소개톡' ORDER BY postId DESC LIMIT 9;", function(err, data){
      if(err){
        console.log(err);
      } else {
        console.log('community 소개톡 post 정보(data)\n'+data);

        if(data.length > 0 ){
            var db_str = "SELECT * FROM Comment Where ";
            for(var i=0; i<data.length; i++){
              db_str += "postId=" + data[i].postId + " ";
              if(i != (data.length - 1))
                db_str += 'OR ';
            }
            db_str += "ORDER BY postId DESC, commentId ASC;"
            allData.push(data);
            dbConnection.query(db_str, function(err, data){
                if(err) {
                  console.log(err);
                } else {
                  console.log('community 소개톡 post+comment 정보(allData)\n'+allData);
                  console.log('community 소개톡 comment 정보(data)\n' + data);

                  allData.push(data);
                  res.render('community-cards', {allData});
                }
            });
        } else {
            console.log("I'm In!!");
            console.log(allData);
            res.render('community-cards', {allData});
        }

      }
    });
	}
  });

app.get('/community/joy-hello', function(req, res){
    var allData = [];     
    if(req.session.passport == undefined){res.render('logIn');}
    else {
	var currentUser = req.session.passport.user.userId;
    dbConnection.query("SELECT * from Post WHERE category='소개톡' ORDER BY postId DESC LIMIT 9;", function(err, data){
      if(err){
        console.log(err);
      } else {
        console.log('community 소개톡 post 정보(data)\n'+data);

        if(data.length > 0 ){
            var db_str = "SELECT * FROM Comment Where ";
            for(var i=0; i<data.length; i++){
              db_str += "postId=" + data[i].postId + " ";
              if(i != (data.length - 1))
                db_str += 'OR ';
            }
            db_str += "ORDER BY postId DESC, commentId ASC;"
            allData.push(data);
            dbConnection.query(db_str, function(err, data){
                if(err) {
                  console.log(err);
                } else {
                  console.log('community 소개톡 post+comment 정보(allData)\n'+allData);
                  console.log('community 소개톡 comment 정보(data)\n' + data);

                  allData.push(data);
                  res.render('community-cards', {allData});
                }
            });
        } else {
            console.log("I'm In!!");
            console.log(allData);
            res.render('community-cards', {allData});
        }

      }
    });
	}
  });

 app.post('/community/joy-hello/write-complete', function(req, res){
    var currentUser = req.session.passport.user.userId;

    dbConnection.query("INSERT INTO Post VALUES(DEFAULT,?,?,DEFAULT,'',?,'')",[currentUser, '소개톡', req.body.content ],function(err, data){
        if(err) {
            console.log(err);
        } else {
            res.redirect('/community/joy-hello');
        }

    });

  });

  app.post('/community/joy-hello/rewrite-complete',function(req, res){
    var postid = req.query.postid;
    dbConnection.query('UPDATE Post SET content = ? WHERE postId = ?;',[req.body.content, postid],function(err, data){
        if(err) {
            console.log(err);
        } else {
            res.redirect('/community/joy-hello');
        }


    });

  });

  app.post('/community/joy-hello/delete', function(req, res){
    var postid = req.query.postid;
    dbConnection.query('DELETE FROM Post WHERE postId = ?', [postid], function(err, data){
        if(err) {
            console.log(err);
        } else {
            res.redirect('/community/joy-hello');
        }
    });
  });


  app.post('/community/joy-hello/comment-write',function(req,res){
    var postid = req.query.postid;
    var content = req.body.content;

    dbConnection.query("INSERT INTO Comment VALUES(DEFAULT,'1234', ?, DEFAULT, ?)",[postid, content],function(err, data){
        if(err) {
            console.log(err);
        } else {
            res.redirect('/community/joy-hello');
        }
    });
  });

  app.post('/community/joy-hello/comment-rewrite', function(req, res){
    var commentid = req.query.commentid;

    dbConnection.query('UPDATE Comment SET content = ? WHERE commentId = ?', [req.body.content, commentid], function(err, data){
        if(err) {
            console.log(err);
        } else {
            res.redirect('/community/joy-hello');
        }
    });
  });

  app.post('/community/joy-hello/comment-delete',function(req, res){
    var commentid = req.query.commentid;

    dbConnection.query('DELETE FROM Comment WHERE commentId = ?',[commentid],function(err, data){
        if(err){
            console.log(err);
        } else {
            res.redirect('/community/joy-hello');
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
//		var uid = '1234';
		 var currentUser = req.session.passport.user.userId;


		//community POST request
		console.log("***New COMMUNITY POST Request id arrived***");

		//parse body
		json = req.body;
		console.log(json.title);
		console.log(json.smarteditor);

		//insert to DB
		dbConnection.query("INSERT into Post VALUES(DEFAULT,?,?,DEFAULT,?,?,?);",[currentUser, json.category, json.title, json.smarteditor, json.image], function(err, result, fields){
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
