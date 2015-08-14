var duplexer = require('duplexer');
var tape = require('tape');
var through = require('through2');
var requireUncached = require('require-uncached');
var Suit = require('./lib/suitup');

var suitup = new Suit();

module.exports = function () {
    var files = [];
    var tapeStream;
    var chunks = [];
    var output = through();
    var input = through.obj(transform, endWrite);

    function transform(file, enc, cb) {
        if (!file || !file.path) {
            return cb();
        }

        files.push(file.path)
        cb();
    }

    function endWrite(cb) {
        tape.createStream({ objectMode: true })
            .on('data', function(data) {
                suitup.add(data);
            })
            .on('end', function() {
                output.push(suitup.complete());
                output.emit('end');
                cb();
            });

        for(var i = 0; i < files.length; i++) {
            requireUncached(files[i]);
        }
    }

    return  duplexer(input, output);
}
