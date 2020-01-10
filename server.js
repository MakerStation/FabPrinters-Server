//===================DEPENDENCIES=============================
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const db = require('quick.db');

//===================SERVER INIT==============================
const port = process.env.PORT || 3001
const app = express()
app.use(logger('dev')) //for log
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const server = http.createServer(app)

//===================ROUTES===================================
const index = require("./routes/index")
app.use(index)

//===================SOCKET INIT==============================
const io = socketIo(server)

//===================SOCKET===================================
io.on("connection", socket => {
  console.log("User connected")

  socket.on("new command", (id, command, fn) => {
    console.log(id+": "+command)
    fn("ok")
    socket.broadcast.emit("new command from client", id, command)
    io.emit("new command from printer", id, "ok")
  })

  socket.on("getStatus", () => {
    socket.emit("resStatus", )
  })

  socket.on("status update", (id, newStatus) => {
    setPrinterStatus(id, newStatus)
  })

  socket.on("new printer", (name, port, baudrate, fn) => {
    newPrinter(name, port, baudrate)

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
