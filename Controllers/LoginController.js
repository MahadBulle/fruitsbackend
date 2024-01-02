const { UsersModel,LoginValidation } = require('../Models/usersModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Login = async (req, res) =>{
    
    const { error } = LoginValidation(req.body)
    if (error) return res.send(error.message)
    try {
    const user= await UsersModel.findOne({email:req.body.email,status:'Active'})
    if(!user) return res.status(404).send({Error: 'User not found'});
    const CheckPassword = await bcrypt.compare(req.body.password,user.password)
    if(!CheckPassword) return res.status(404).send({Error:'Invalid password'});

    const token = jwt.sign({email:user.email,id:user._id,Roles:user.role},process.env.PRIVATE_KEY,{expiresIn:'1h'})

    return res.status(200).send({Token:token,User:user.username +' '+'Loged in'})
    } catch (error) {
        res.status(401).send(error.message)
        
        
    }
    

}

module.exports=Login