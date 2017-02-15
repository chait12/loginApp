var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');

/* Users route listing */
router.post('/signup', createUser);

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

  User.create(user, function(err, doc){
    if(err || !doc){
      err = err || "Error while creating user, please try again later";
      return res.status(412).json({error: err});
    }
    if(doc && typeof doc === "function"){
        doc = doc.toJSON();
      }
      return res.status(201).json(doc);
  });
}

module.exports = router;
