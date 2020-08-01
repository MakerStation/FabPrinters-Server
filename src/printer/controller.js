const Printer = require('../models/printer.model')

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
    if(err) return res.send(err)
    else return res.send(doc)
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


module.exports = {
  newPrinter,
  findPrinter
}
