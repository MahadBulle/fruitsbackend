const mongoose = require('mongoose')
const joi = require('joi')
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: (['Active', 'Pending']),
    default: 'Active'
  },
  // role: {
  //   type: String,
  //   default: 'user'
  // }

}, { timestamps: true })

const UsersModel = mongoose.model('users', usersSchema)

// ----------------------------------------------------------------
// sign up validation
function usersValidation (usersObj) {
    const usersVal = joi.object({
      username: joi.string().required(),
      email: joi.string().required().email({ tlds: { allow: false } }).required(),
      password: joi.string().required().min(6).max(20),
      status: joi.string(),
      // role:joi.string().required(),
  
    })
    return usersVal.validate(usersObj)
  }
  // sign up validation ended

  // login validation
function LoginValidation (userObj) {
    const userVal = joi.object({
      email:joi.string().email({ tlds: { allow: false } }).required(),
      // username:joi.string().required(),
      password:joi.string().required(),
  
    })
    return userVal.validate(userObj)
  }
  // login validation ended

module.exports = {
    UsersModel,
    usersValidation,
    LoginValidation
}
