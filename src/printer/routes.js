const express = require('express');
const router = express.Router();
const PrinterController = require('./controller')

router.post('/newprinter', PrinterController.newPrinter)
router.post('/findprinter', PrinterController.findPrinter)
router.post('/logcommand', PrinterController.logCommand)
router.post('/getallcommands', PrinterController.getAllCommands)

module.exports = router;
