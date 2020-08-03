const mongoose = require('mongoose')

const printerLogSchema = new mongoose.Schema({
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sentByPrinter: {
    type: Boolean
  },
  command: {
    type: String,
    default: "No Command"
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

function printerLogModel(id){
  return mongoose.model('Printer' + id + 'Log', printerLogSchema)
}

module.exports = printerLogModel
