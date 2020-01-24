//===================DEPENDENCIES=============================
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const db = require('quick.db');
const fs = require('fs');
const fileUpload = require('express-fileupload');

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

//===================SOCKET===================================
io.on("connection", socket => {
  console.log("User connected")

  socket.on("new command", (id, command, fn) => {
    console.log(id+": "+command)
    fn("ok")
    let string = "3-"+Date.now()+"-"+command
    fs.appendFile("./logs/printed/printer"+id+".log", string+"\n1-"+Date.now()+"-ok\n", err => console.log(err))
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
var printers = new db.table("printers")

function getPrinter(id) {
  return printers.get(id)
}
function setPrinterStatus(id, newStatus) {
  printers.set(id+".status", newStatus)
}
function newPrinter(name, port, baudrate){
  printers.add("lastId", 1)
  printers.set(lastId, {name: name, port: port, baudrate: baudrate})
}
