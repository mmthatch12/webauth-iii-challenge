const express = require('express')
const AuthRouter = require('../auth/auth-router')

const server = express()
server.use(express.json())

server.use('/api', AuthRouter)

module.exports = server;