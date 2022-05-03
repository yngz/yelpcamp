const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    require: true,
    uniqui: true, // for indexing, not validation
  },
});

// adds username, hash, salt fields and some methods
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
