const express = require('express')
const AuthRouter = require('../auth/auth-router')

const server = express()

server.use('/api/auth', AuthRouter)

module.exports = server;