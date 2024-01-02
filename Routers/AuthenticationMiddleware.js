const jwt = require ('jsonwebtoken');
const UsersModel = require('../Models/usersModel');
require('dotenv').config()
const AuthenticateRoute = (AllowedRoles)=>{
    return async (req,res,next)=>{
        const TokenHeader = req.headers['authorization'];

        if(!TokenHeader) return res.status(401).send('Access Denied No Token Provided')

        const token = TokenHeader.split(' ')[1]

        try {
            const TokenVerify = jwt.verify(token, process.env.PRIVATE_KEY)
            //check if the user is exists

            // console.log("xogta tokenka",TokenVerify.id)

            const User = await UsersModel.findById(TokenVerify.id)

            if (!User) return res.status(404).send('User not found')

            if (!User.status=='Active')return res.status(401).send('user is not active')

            if (!AllowedRoles.includes(User.role))return res.status(401).send('You are nt allowed to access this route')

            next();


        } catch (error) {
            res.status(401).send(error.message)
        }
    }
}

module.exports = AuthenticateRoute