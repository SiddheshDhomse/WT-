require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3500
const path = require('path')

const cors = require('cors')
const corsOptions = require('./config/corsOptions')

const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')

connectDB()

app.use(cors(corsOptions))
 
app.use(express.json())

app.use('/',express.static(path.join(__dirname,'public')))


app.use('/auth',require('./routes/authRoute'))
app.use('/',require('./routes/root'))
app.use('/products',require('./routes/productRoute'))
app.use('/user',require('./routes/userRoute'))
app.use('/lessons', require('./routes/lessonsRoute'));


app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})