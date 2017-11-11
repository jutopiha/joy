// session.js
// 회원관리
var mysql = require('mysql');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
// .env 환경변수 가져오는 npm
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

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log("*** SerializeUser***");
    // 로그인 성공 시 세션(req.session.passport.user)에 저장

    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    console.log("*** DeserializeUser ***");

    return done(null, user);
  });

  app.get('/auth/facebook', passport.authenticate('facebook',  {
    authType: 'rerequest', scope: ['public_profile', 'email']
  }));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/',
                                        failureRedirect: '/failure'}));

  passport.use(new FacebookStrategy({
    clientID: "1892044964380913",
    clientSecret: "edc68b0996d47548db2b7676a4da00c4",
    callbackURL: "http://18.220.36.184:9000/auth/facebook/callback",
    profileFields:["id", "email", "gender", "link", "locale", "name", "timezone", "updated_time", "verified", "displayName",'picture.type(large)']
  }, function (accessToken, refreshToken, profile, done) {
      // db에 이 id로 된 User 있는지 확인한다.
      dbConnection.query('SELECT * FROM User WHERE userId = ?;',[profile.id], function(err, data){
        if (err) {
          throw error;
        } else {
          console.log(data);
          if(data != '') {
            console.log("~~~이미 있는 회원");
            done(null, data[0]);
          } else {
            console.log("~~~새로운 회원");
            // 회원가입 해야 할 때 생성
            var newUser = {
              userId: profile.id,
              name: profile.displayName,
              birth: profile.birth,
              gender: profile.gender,
              profilePicture: profile._json.picture.data.url,
              mainBank: "none",
              onAutoParse: false,
              onAutoAlarm: false,
              point: 0,
              mainCharacter: 0
            };

            // insert to DB
            dbConnection.query('INSERT into User VALUES (?,?,?,?,?,?,?,?,?,?);', [newUser.userId, newUser.name, newUser.birth, newUser.gender, newUser.profilePicture, newUser.mainBank, newUser.onAutoParse, newUser.onAutoAlarm, newUser.point, newUser.mainCharacter], function (err, results, fields) {
              if (err) {
                throw error;
              }
				dbConnection.query('INSERT into Item (userId) VALUES (?);', [newUser.userId], function (err, results, fields) {
        if (err) {
          throw error;
        }else {
        }

      });


            });

            done(null, newUser);
          }
        }
      });
    }

  ));

  app.get('/logout', function(req, res) {
      req.logout();
      req.session.save(function(){
        req.session.passport.user = null;
        res.redirect("/");
      });
  });

/*
  app.get('/passport', function(req, res){
    console.log("***GET /***");
    console.log("req.user!!!!");
    console.log(req.user);
    if(req.user != undefined) {
      res.render("passport", {username: req.user.name, currentUser: "default"});
    } else {
      res.render("passport", {username: "guest", currentUser: "default"});
    }

  });
*/
  /*------------------------GET/dealing------------------------*/
  app.get('/failure', function(req, res){
    console.log("***GET /failure***");
    res.render("failure");
  });

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /*------------------------POST/signin------------------------*/
  app.post('/post/signin', function(req, res){
    var result = {};
    var json = {};
    var autoParse = 0;
    var autoAlarm = 0;
    //signin request
    console.log("***New USER SIGNIN POST Request is arrived***");

    // parse body
    json = JSON.parse(req.body);
    console.log(json);

    autoParse = (json.onAutoParse == 'true');
    autoAlarm = (json.onAutoAlarm == 'true');
    // insert to DB
    dbConnection.query('INSERT into User VALUES (?,?,?,?,?,?,?,?,?,?);', [json.userId, json.name, parseInt(json.birth), json.gender, json.profilePicture, json.mainBank, autoParse, autoAlarm, 0, 0], function (err, results, fields) {
      if (err) {
        result.CODE = 400;
        result.STATUS = "Database Error";
        throw error;
      }else {
        result.CODE = 201;
        result.STATUS = "Created";
        result.DATA = json;
      }
      dbConnection.query('INSERT into Item (userId) VALUES (?);', [json.userId], function (err, results, fields) {
        if (err) {
          result.CODE = 400;
          result.STATUS = "Database Error";
          throw error;
        }else {
          result.CODE = 201;
          result.STATUS = "Created";
          result.DATA = json;
        }

        res.json(result);
      });

    });

    return;
  });

  app.get('/get/userinfo', function(req, res){
    console.log("***New User INFO GET Request is arrived");
    dbConnection.query('SELECT * FROM User WHERE userId = ?;',[req.query.uid], function(err, data){
      if (err) throw error;

      res.json(data);
    });
  });
};
