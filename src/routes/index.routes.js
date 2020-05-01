const express = require('express')
const routes = express.Router();
const UserController = require('../controllers/UserController')

routes.get('/users', UserController.getUsers)
routes.post('/register', UserController.registerUser)

module.exports = routes