'use stict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var eat = require('eat');

var userSchema = new mongoose.Schema({
	basic: {
		email: {type: String, unique: true, required: true}, 
		password: {type: String, required: true}
	}
});

userSchema.methods.createHash = function(password, callback) {
	bcrypt.genSalt(8, function(err, salt) {
		if (err) {throw err;}
		bcrypt.hash(password, salt, null, callback);
	});
};

userSchema.methods.verifyPassword = function(password, callback) {
	bcrypt.compare(password, this.basic.password, function(err, res) {
		if (err) { return callback(err); }
		return callback(null, res);
	});
};

userSchema.methods.generateToken = function(secret, callback) {
	eat.encode({id: this._id}, secret, callback);
}


module.exports = mongoose.model('User', userSchema);