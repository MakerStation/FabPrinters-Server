const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config.js");
const bcrypt = require("bcrypt")
const saltRounds = 10
const tokenExpire = 86400 //24h

const createToken = function (userId) {
  return new Promise((resolve, reject) => {
    jwt.sign({id: userId}, config.secret, {expiresIn: tokenExpire}, (err, token) => {
      if(err) reject({status: 500, message: err})
      else resolve({status: 200, message: token})
    })
  })
}

const verifyToken = function (token) {
  return new Promise((resolve, reject) => {
    if(!token) reject({status: 403, message: "No token provided!"})
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) reject({status: 401, message: "Unauthorized!"})
      else resolve({status:200, id: decoded.id})
    })
  })
}

const checkUsernameInUse = function (username) {
  return new Promise((resolve, reject) => {
    User.findOne({
      username: req.body.username
    }).exec()
    .then(doc => {
      if(doc) reject({status: 400, message: "Username already in use"})
      else resolve({status: 200, message: "Username available"})
    }).catch(err => {
      reject({status: 500, message: err})
    })
  })
}

const hashPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if(err) reject({status: 500, message: err})
      else resolve({status: 200, message: hash})
    })
  })
}

const comparePassword = function (password, hashedPassword){
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, function (err, result){
      if(err) reject({status: 500, message: err})
      if(result) resolve({status: 200, message: "Authenticated!"})
      if(!result) reject({status:401, message: "Wrong password!"})
    })
  })
}

module.exports = {
  verifyToken,
  createToken,
  checkUsernameInUse,
  hashPassword,
  comparePassword
}
