var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var crypto      = require('crypto');
var bcrypt      = require('bcrypt');
var Promise     = require("bluebird");

var UserSchema = new Schema({
    uid                 : { type : String },
    email               : { type : String, unique: true },
    first_name          : { type : String },
    last_name           : { type : String },
    password            : { type : String },
    active              : { type : Boolean },
    created_at          : { type : Date },
    update_at           : { type : Date }
});

function encryptPassword(password){
    //console.log("pwd ", password);
    return new Promise(function(resolve, reject){
        return bcrypt.genSalt(config.salt_length, function(err, salt) {
            //console.log("salt ", salt);
            if(err){
                return reject(err);
            }
            bcrypt.hash(password, salt, function(err, hash) {
                //console.log('hash ', hash);
                return resolve(hash);
            });
        });
    });
}

UserSchema.pre('save', function(req, res, next){
    var self = this;
    encryptPassword(self.password)
        .then(function(passwordHash){
            self.password = passwordHash;
            self.uid = "usr" + crypto.randomBytes(20).toString('hex');
            self.created_at = self.update_at = new Date();
            self.active = true;
            next();
        }, function(e){
            console.error("Error while encrypting password " + e);
            next(e);
        })
});

UserSchema.statics = {
    test: function(user, callback){
        callback("error", user);
    }
}

// for login time to compare it with userPassword
// exports.comparePassword = function(password, userPassword, callback) {
//    bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
//       if (err) 
//         return callback(err);
//       return callback(null, isPasswordMatch);
//    });
// };

mongoose.model('User', UserSchema);