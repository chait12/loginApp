var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');

/* GET home page. */
router.get('/users', listUsers);

function listUsers(req, res, next){
  User.find(function(err, docs){
    if(!err && docs){
      return res.status(200).json(docs);
    }
  });
}

module.exports = router;
