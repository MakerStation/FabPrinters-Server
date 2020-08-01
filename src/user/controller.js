const User = require('../models/user.model')
const Auth = require('../util/auth')


const register = async function(req, res, next) {
  Auth.hashPassword(req.body.password)
  .then((response) => {
    const user = new User ({
      username: req.body.username,
      password: response.message
    })
    user.save()
    .then(() => res.status(200).send("User successfully registered!"))
    .catch(err => res.status(500).send(err))
  })
  .catch((response) => {
    res.status(response.status).send(response.message)
  })
}

const login = function(req, res, next) {
  User.findOne({username: req.body.username})
  .exec((err, user) => {
    if(err) return res.status(500).send(err)
    if(!user) return res.status(401).send("Invalid username")
    Auth.comparePassword(req.body.password, user.password)
    .then(response => {
      if(response.status == 200) {
        Auth.createToken(user._id)
        .then(response => res.status(response.status).send(response.message))
        .catch(response => res.status(response.status).send(response.message))
      }
    })
    .catch(response => {res.status(response.status).send(response.message)})
  })
}


module.exports = {
  register,
  login
}
