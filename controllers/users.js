var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');

/* Users route listing */
router.post('/signup', createUser);

function createUser(req, res, next){
  User.create(req.body, function(err, doc){
    console.log(err, doc)
    if(!err && doc){
      return res.send(201).json(doc);
    }
  });
}

module.exports = router;
