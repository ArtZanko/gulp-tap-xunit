var builder = require('xmlbuilder');
var xml = builder.create('testsuites');
var asserts = 0;

module.exports = Suit;

function Suit() {
    this.results = [];
    this._tests = {};
    this.output = [];
}

Suit.prototype.add = function(data) {
    switch (data.type) {
        case 'test':
            newTest.call(this, data);
            break;
        case 'assert':
            assert.call(this, data);
            break;
        case 'end':
            closeTest.call(this, data);
            break;
        default:
            console.log(data); // do nothing
    }
}

Suit.prototype.complete = function(data) {
    return xml.end({
        newline: '\n',
        indent: '  ',
        pretty: true
    });
}

function assert(data) {
    var test = this._tests[data.test];

    if (!test) {
        throw new Error('Undefined test for assert')
    }
    asserts++;

    var testCase = test.xml.ele('testcase', {
        name: '#' + asserts + ' ' + data.name
    });

    test.tests++;

    if (data.ok !== true) {
        test.failures++;
        testCase.ele('failure');
    } else if (data.skip) {
        test.skipped++;
        testCase.ele('skipped');
    }
}

function newTest(data) {
    this._tests[data.id] = {
        tests: 0,
        failures: 0,
        skipped: 0,
        errors: 0
    };

    this._tests[data.id].xml = xml.ele('testsuite', {
        name: data.name
    });
}

function closeTest(data) {
    var test = this._tests[data.test];

    if (!test) {
        throw new Error('Undefined test for assert')
    }

    test.xml.att('tests', test.tests);
    test.xml.att('failures', test.failures);

    if (test.skipped > 0) {
        test.xml.att('skipped', test.skipped);
    }

    test.xml.att('errors',  0);
}
