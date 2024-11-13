const mongoose =  require('mongoose')

const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true
        },
        subscription : {
            type : String,
            default : "None"
        }
    }
)

module.exports = mongoose.model('Users', userSchema)