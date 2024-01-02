const {UsersModel,usersValidation} = require('../Models/usersModel')
const bcrypt = require('bcrypt')

// users get starts
const GetUsers = async (req, res) => {
  const hellusers = await UsersModel.find()
  res.send(hellusers)
}
// users get ends
// user getById starts
const GetUserById = async (req, res) => {
  const helluser = await UsersModel.findById(req.params.id)
  res.send(helluser)
}
// user getById end
// signup start
const signup = async (req, res) => {
    try {
      const { error } = usersValidation(req.body)
      if (error) return res.send(error.message)
      const signupPosting = new UsersModel(req.body)
      const { username, email } = req.body
      const checkUserEmail = await UsersModel.findOne({ email })
      const checkUsername = await UsersModel.findOne({ username })
      if (checkUsername) return res.send({ status: 'error', message: 'this Username is already existed' })
      if (checkUserEmail) return res.send({ status: 'error', message: 'this email is already created as a user' })
  
      const salt = await bcrypt.genSalt(10)
      signupPosting.password = await bcrypt.hash(signupPosting.password, salt)
  
      await signupPosting.save()
      res.send({
        status: 'Success',
        message: 'Successfully signed up',
        info: signupPosting
      })
    } catch (error) {
      res.send({ status: 'Error', message: error.message })
    }
  }
  // signup ended

  // user Update start
const userUpdate = async (req, res) => {
    try {
     
      const UserUpdating = await UsersModel.findByIdAndUpdate(req.params._id, req.body, { new: true })
      res.send({
        status: 'Success',
        message: 'Successfully Updated',
        info: UserUpdating
      })
    } catch (error) {
      res.send(error.message)
    }
  }
  // user Update ended

  // user Delete start
const userDelete = async (req, res) => {
    const deletingById = await UsersModel.findByIdAndRemove(req.params.id)
    res.send({ status: 'success', message: `the user ${deletingById} Deleted successfully` })
  }
  // user Delete ended





module.exports = {
    GetUsers,
    GetUserById,
    signup,
    userUpdate,
    userDelete
  };


