const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
    {
        lessonId : {
            type: Number,
            required: true
        },
        lessonName : {
            type: String,
            required: true
        },
        discription: {
            type: [String],
            required: true
        },
        video:{
            type: String
        },
        subscriptionType: {
            type : String,
            required: true
        }
    }
);


module.exports = mongoose.model('Lessons', lessonSchema);
