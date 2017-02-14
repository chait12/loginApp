var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var crypto      = require('crypto');

var UserSchema = new Schema({
    uid                 : { type : String },
    email               : { type : String },
    first_name          : { type : String },
    last_name           : { type : String },
    password            : { type : String },
    active              : { type : String },
    created_at          : { type : Date },
    update_at           : { type : Date }
});

UserSchema.pre('save', function(next){
    console.log(this);
    this.uid = "usr" + crypto.randomBytes(20).toString('hex');
    this.created_at = this.update_at = new Date();
    next();
});

// UserSchema.statics = {
//     test: function(user, callback){
//         callback("error", user);
//     }
// }

mongoose.model('User', UserSchema);