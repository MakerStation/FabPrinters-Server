const mongoose = require('mongoose');

const printerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true
  },

  port: {
    type: String,
  },
  baudRate: {
    type: Number,
  }
})

module.exports = mongoose.model('Printer', printerSchema)
