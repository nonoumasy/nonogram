const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/checkAuth')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {check, validationResult} = require('express-validator')
const HttpError = require('../models/http-error');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:process.env.SENDGRID_API_KEY
    }
}))

// signup
router.post('/signup', 
    [
        check('name').isLength({ min: 3 }),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 4})
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ message: 'Invalid inputs passed, please keep it real.😀' })
        }

        const { name, email, password, pic } = req.body
        if (!email || !password || !name) {
            return res.status(422).json({ error: "please add all the fields" })
        }
        await User.findOne({ email: email })
            .then((savedUser) => {
                if (savedUser) {
                    return res.status(422).json({ error: "user already exists with that email" })
                }
                bcrypt.hash(password, 12)
                    .then(hashedpassword => {
                        const user = new User({
                            email,
                            password: hashedpassword,
                            name,
                            pic
                        })

                        user.save()
                            .then(user => {
                                transporter.sendMail({
                                    to:user.email,
                                    from:"nonoumasy@gmail.com",
                                    subject:"signup success",
                                    html: 
                                    `
                                    <h1>Hello ${user.name}, Welcome to Nonogram.</h1> 
                                    <p>https://nono-gram.herokuapp.com/</p>
                                    `
                                })
                                res.json({ message: "saved successfully" })
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })

            })
            .catch(err => {
                console.log(err)
            })
})

// login
router.post('/login', (req, res) =>{
    const {email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: 'pls add fields' })} 
    User.findOne({email})
    .then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({ error: 'Invalid Email or password' })}
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if (doMatch) {
                // res.json({message:"successfully signed in"})
                const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET)
                const { _id, name, email, followers, following, pic } = savedUser
                res.json({ token, user: { _id, name, email, followers, following, pic } })
            }
            else {
                return res.status(422).json({ error: "Invalid Email or password" })
            }
        })
            .catch(err => {
                console.log(err)
            })
    })
})


module.exports = router