const mongoose = require('mongoose');   
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({         //we need not to define password and username fields as passport-local-mongoose will add them automatically
    email:{
        type:String,
        required:true,
    }
    
}); 

userSchema.plugin(passportLocalMongoose);    //adds methods to our schema

module.exports = mongoose.model('User',userSchema);