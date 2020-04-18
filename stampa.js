var fs = require('fs')
var es = require('event-stream')

var lineNr = 0

var s = fs.createReadStream('./gcode/seal.gcode')
    .pipe(es.split())
    .pipe(es.mapSync(function(line){

        // pause the readstream
        s.pause();

        lineNr += 1;

        // process line here and call s.resume() when rdy
        // function below was for logging memory usage
        console.log(line);
        console.log(lineNr);
        line(line)

        // resume the readstream, possibly from a callback
        s.resume();
    })
    .on('error', function(err){
        console.log('Error while reading file.', err);
    })
    .on('end', function(){
        console.log('Read entire file.')
    })
);
