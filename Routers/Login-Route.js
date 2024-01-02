var express = require('express');
const route = express.Router();
const Login= require('../Controllers/LoginController')
route.post('/',Login)

module.exports= route