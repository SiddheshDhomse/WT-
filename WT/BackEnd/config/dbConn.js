const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        mongoose.connect(process.env.CONNECT)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB