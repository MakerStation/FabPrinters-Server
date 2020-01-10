const express = require("express");
const router = express.Router();
const fs = require('fs');
router.get("/commandlog", (req, res) => {
  let id = req.query.id
  fs.readFile("./logs/printed/printer"+id+".gcode",{encoding: 'utf-8'}, (err, data) => {
    if(err) {
      console.log(err)
      res.status(404)
      res.send("File read error")
    }
    res.status(200)
    res.json({dati: parseData(data)})
  })
});

router.get("/commandlogcomplete", (req, res) => {
  let id = req.query.id
    fs.readFile("./logs/printed/printer"+id+".gcode",{encoding: 'utf-8'}, (err, data) => {
      if(err) {
        console.log(err)
        res.status(404)
        res.send("File read error")
      }
      res.status(200)
      let response = '<div style="font-family: monospace"><br/>'
      parseData(data).forEach(l => {
        let date = new Date(parseInt(l.date)).toLocaleTimeString() +":"+ ("000"+new Date(parseInt(l.date)).getMilliseconds()).slice(-3)
        let sender = "??"
        if(l.sender == 1) sender = "3D"
        if(l.sender == 3 || l.sender == 2) sender = "PC"
        response+=(date+" - "+sender+" - "+l.command+"<br/>")
      })
      response += "</div>"
      res.send(response)
    })
  })

function parseData(data){
  if(!data) return
  let lines = data.split("\n")
  let json = []
  lines.forEach(l => {
    if(l){
      let temp = l.split("-")
      json.push({sender:temp[0], date:temp[1], command:temp[2]})
    }
  })
  return json
}


module.exports = router;
