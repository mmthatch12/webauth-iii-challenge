const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets')
const restricted = require('./restricted-middleware')

const Users = require('./auth-model')

router.post('/register', (req, res) => {
    let user = req.body
    console.log(user)
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(error)
        })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body

    Users.findBy({ username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)){
                const token = generateToken(user)
                res.status(200).json({ token })
            } else {
                res.status(401).json({ message: 'Credentials not valid'})
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(error)
        })
})

router.get('/users', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => res.send(err))
})


function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username
    }
    const options = {
        expiresIn: '8h'
    }

    return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router

