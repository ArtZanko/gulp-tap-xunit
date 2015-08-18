var tape = require('../tape');
var through = require('through2');
var requireUncached = require('require-uncached');
var Suit = require('./lib/suitup');

var suitup = new Suit();

module.exports = function () {
    var files = [];

    function transform(file, enc, cb) {
        if (!file || !file.path) {
            return cb();
        }

        files.push(file.path)
        cb();
    }

    function endWrite(cb) {
        var output = this;

        tape.createStream({ objectMode: true })
            .on('data', function(data) {
                suitup.add(data);
            })
            .on('end', function() {
                output.push(suitup.complete());
                cb();
            });

        for(var i = 0; i < files.length; i++) {
            requireUncached(files[i]);
        }
    }

    return through.obj(transform, endWrite);
}
