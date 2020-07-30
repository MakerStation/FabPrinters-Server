//===================DEPENDENCIES=============================
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const Events = require('events')

//===================SERVER INIT==============================
const port = process.env.PORT || 3001
const app = express()
app.use(logger('dev')) //for log
app.use(cors())
app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const server = http.createServer(app)

//===================ROUTES===================================
const index = require("./routes/index")
app.use(index)
const getcommandlog = require("./routes/getCommandLog")
app.use(getcommandlog)
const uploadfile = require("./routes/uploadFile")
app.use(uploadfile)

//===================SOCKET INIT==============================
const io = socketIo(server)

//===================SERIAL PORT==============================
/*var ports = []
var parsers = []
newPorta(1, '/dev/ttyUSB0', 250000)
// const porta = new SerialPort('/dev/ttyUSB0', { baudRate: 250000 });
// const parser = porta.pipe(new Readline({ delimiter: '\n' }));
// // Read the port data
// porta.on("open", () => {
//   console.log('serial port open');
// });
// parser.on('data', data =>{
//   //let lettera = String.fromCharCode(data)
//   console.log(data)
//   io.emit("new command from printer", id, data);
//   //console.log('got word from arduino:', lettera)
// });
/*
SerialPort.list().then(ports => {
		console.log(ports)
	}).catch(e => console.log(e))
  porta.write(command+"\n")
*//*
function newPorta(id, porta, baudrate){
  ports[id] = new SerialPort(porta, {baudRate: baudrate}) //problema con promise non catturata se porta non esistente
  parsers[id] = ports[id].pipe(new Readline({delimiter: '\n'}))
  ports[id].on("open", () => {
    console.log('serial port '+porta+' open');
  });
  parsers[id].on('data', data =>{
    console.log(data)
    io.emit("new command from printer", id, data);
  });
}*/
//===================SOCKET===================================
io.on("connection", socket => {
  console.log("User connected")

  socket.on("new command", (id, command, fn) => {
    console.log(id+": "+command)
    fn("ok")
    let string = "3-"+Date.now()+"-"+command
    fs.appendFile("./logs/printed/printer"+id+".log", string+"\n1-"+Date.now()+"-ok\n", err => {if(err)console.error(err)})
    ports[id].write(command+"\n")
    socket.broadcast.emit("new command from client", id, command)
    io.emit("new command from printer", id, "ok")
  })

  socket.on("get status", () => {
    socket.emit("res status", )
  })

  socket.on("status update", (id, newStatus) => {
    // setPrinterStatus(id, newStatus)
    console.log("Status change: "+id+", "+newStatus)
    io.emit("set printers status", id, newStatus)
  })

  socket.on("new printer", (name, port, baudrate, fn) => {
    newPrinter(name, port, baudrate)

  })

  socket.on("switch print tab", (id) => {
    socket.emit("switch print tab", id)
  })


//esempi di socket
  socket.on("volatile example", message => { //se la connessione è sovraccarica o troppo lenta non viene recapitato
    // socket.volatile.emit("volatile example", "test")
    console.log(message)
  })

  socket.on("cinesino che risponde", (message, fn) => {
    fn("ok")
    console.log(message)
    // socket.emit("cinesino che risponde", "ciao", data => {
    //   console.log(data)
    // })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

//===================SERVER LISTEN============================
server.listen(port, () => {
  console.log("Server running on port "+port)
})

//===================DATABASE=================================

//==================GCODE=====================================

//==================FILE PARSING==============================
//https://stackoverflow.com/questions/16010915/parsing-huge-logfiles-in-node-js-read-in-line-by-line
