var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');

/* GET home page. */
router.get('/', homePage);
router.get('/users', listUsers);

function homePage(req, res, next){
  return res.render('index', { title: "Express" });
}

function listUsers(req, res, next){
  User.find(function(err, docs){
    if(err){
      return res.status(400).json({error: err});
    }
    if(docs && typeof docs === "function"){
      docs = docs.toJSON();
    }
    res.status(200).json({users : docs});
  });
}

module.exports = router;
