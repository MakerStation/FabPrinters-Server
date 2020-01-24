const express = require("express");
const router = express.Router();
const fs = require('fs');

router.post("/uploadfile", (req, res) => {
  console.log(req)
  let file = req.files.file
  console.log(file)
  if(!req.files.file.name.endsWith(".gcode")) return;
  file.mv('gcode/'+req.files.file.name, function(err) {
   if (err) console.log(err)
     // return res.status(500).send(err);

   // res.status(200).send('File uploaded!');
 });
});

module.exports = router;
