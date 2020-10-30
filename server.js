const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const User = require('./models/user')
const Post = require('./models/post')

require('dotenv').config()

//
const PORT = process.env.PORT || 5000

// connect to database
mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
)
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err))

// middleware
app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

//
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

//
app.listen(PORT, () => console.log(`server connected at port: ${PORT}`))