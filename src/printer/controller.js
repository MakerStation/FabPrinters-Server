const Printer = require('../models/printer.model')
const PrinterLogModel = require('../models/printerLog.model')

const getAllPrinters = function (req, res, next) {
  Printer
    .find()
    .exec()
    .then(printers => res.json(printers))
    .catch(e => next(e))
}

const newPrinter = function (req, res, next) {
  const {
    id,
    name,
    port,
    baudRate
  } = req.body;
  const newP = new Printer ({
    id: id ? id:"1", //to put autoincrement
    name: name,
    port: port,
    baudRate: baudRate
  })
  newP.save((err, doc) => {
    if(err) return res.status(500).send(err)
    else return res.status(200).send(doc)
  })
}

const findPrinter = function (req, res, next) {
  const findQuery = {}
  if(req.body.id) findQuery.id = req.body.id
  if(req.body.name) findQuery.name = req.body.name
  if(req.body.port) findQuery.port = req.body.port
  if(req.body.baudRate) findQuery.baudRate = req.body.baudRate
  Printer.find(findQuery).exec()
  .then(results => {
    if(!results) res.status(404).send("No printer found")
    else res.status(200).json(results)
  })
  .catch(err => res.status(500).send(err))
}

const logCommand = function (req, res, next) {
  let PrinterLog = PrinterLogModel(req.body.id)
  const newCommand = new PrinterLog({
    sentByPrinter: true,
    command: req.body.command,
    date: req.body.date ? req.body.date : Date.now()
  })
  newCommand.save((err, doc) => {
    if(err) res.status(500).send(err)
    else res.status(200).send(doc)
  })
}

const getAllCommands = function (req, res, next) {
  if(!req.body.id) res.status(400).send("Unvalid request")

  PrinterLogModel(req.body.id).find().exec()
  .then(results => {
    if(!results) res.status(404).send("Log not found")
    else res.status(200).send(results)
  })
  .catch(error => res.status(500).send(error))
}

module.exports = {
  newPrinter,
  findPrinter,
  logCommand,
  getAllCommands
}
