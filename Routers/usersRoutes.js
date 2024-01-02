const express = require('express')
const router = express.Router()

const userscontroller = require('../Controllers/usersController')
// const AuthenticateRoute = require('./AuthenticationMiddleware')


router.get('/', userscontroller.GetUsers)

router.get('/:id', userscontroller.GetUserById)

router.post('/signup', userscontroller.signup)

router.put('/:id',userscontroller.userUpdate)

router.delete('/:id', userscontroller.userDelete)



module.exports = router
