var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');
var Promise = require('bluebird');

/* GET home page. */
router.get('/', homePage);
router.get('/users', listUsers);
router.post('/signup', createUser);

function homePage(req, res, next){
  return res.render('index', { title: "Express" });
}

/* When only single db operaion is there */
// function listUsers(req, res, next){
//   var userGet = Promise.promisify(User.find, { context: User });
//   userGet()
//     .then(function(docs){
//         res.status(200).json({users: docs});
//     }, function(err){
//         res.status(400).json({error: err});
//     });
// }

/* When you want to do multiple db operaion */
function listUsers(req, res, next){

  if(!req.query.page || !req.query.limit){
    return res.status(400).json({ error: "one of the parameter is missing : page, limit"})
  }

  if(isNaN(req.query.page) || isNaN(req.query.limit)){
    return res.status(400).json({ error: "one of the parameter is invalid : page, limit" })
  }

  var page = Number(req.query.page); 
  var limit = Number(req.query.limit);

  if(page <= 0){
    return res.status(400).json({ error: "page value must be greater than 0"});
  }

  var skip = (page - 1) * limit;
  
  var userGet = Promise.promisify(User.find, { context: User });
  var userCount = Promise.promisify(User.count, { context: User });

  Promise.all([
    userGet({}, {}, { skip: skip, limit: limit }),
    userCount()
  ]).spread(function(docs, count){
    res.status(200).json({ users: docs, count: count });
  }, function(err){
    res.status(400).json({ error: err });
  });
}

function createUser(req, res, next){
  var user = req.body || { };
  if(!user ||
    !user.email ||
    !user.first_name ||
    !user.last_name ||
    !user.password ||
    !user.repassword){
      console.info("One of these parameter is missing : email, first_name, last_name, password, repassword");
      return res.status(412).json({
        error : "One of these parameter is missing : email, first_name, last_name, password, repassword"
      });
  }

  if(user.password.trim() !== user.repassword.trim()){
    return res.status(412).json({error: "password and confirm password must be same"});
  }

  var userCreate = Promise.promisify(User.create, { context: User });

  userCreate(user)
    .then(function(doc){
      res.status(201).json(doc);
    }, function(err){
        res.status(412).json({error: err});
    });
}

module.exports = router;
