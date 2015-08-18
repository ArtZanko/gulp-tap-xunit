var util = require('util');
var xml = require('xmlbuilder').create('testsuites');

var _asserts = 0;
var _tests = {};

function Suit() {}

Suit.prototype.add = function(data) {
    switch (data.type) {
        case 'test':
            newTest(data);
            break;
        case 'assert':
            assert(data);
            break;
        case 'end':
            closeTest(data);
            break;
        default:
            // do nothing
    }
}

Suit.prototype.complete = function(data) {
    return xml.end({
        newline: '\n',
        indent: '  ',
        pretty: true
    });
}
// for tests
Suit.prototype.clear = function() {
    asserts = 0;
    _tests = {};
}

module.exports = Suit;

function newTest(data) {
    var testXml = (typeof data.parent != 'undefined') ? getTest(data.parent).get('xml') : xml;

    testXml = testXml.ele('testsuite', {
        name: data.name
    });

    setTest(data.id, { xml: testXml })
}

function assert(data) {
    var test = getTest(data.test);

    if (!test) {
        throw new Error('Undefined test for assert')
    }

    var testCase = test.get('xml').ele('testcase', {
        name: util.format('#%d %s', incAssert.call(this), data.name)
    });

    test.incrs('tests');

    if (data.ok !== true) {
        test.incrs('failures');
        testCase.ele('failure');
    } else if (data.skip) {
        test.incrs('skipped');
        testCase.ele('skipped');
    }
}

function closeTest(data) {
    var test = getTest(data.test);

    if (!test) {
        throw new Error('Undefined test for assert')
    }

    test.get('xml').att('tests', test.get('tests'));
    test.get('xml').att('failures', test.get('failures'));

    if (test.get('skipped') > 0) {
        test.get('xml').att('skipped', test.get('skipped'));
    }

    test.get('xml').att('errors', 0);
}

function setTest(key, data) {
    _tests[key] = new Test(data);
    return _tests[key];
}

function getTest(key) {
    return _tests[key];
}

function incAssert() {
    return ++_asserts;
}

function Test(_data) {
    var data = {
        tests: 0,
        failures: 0,
        skipped: 0,
        errors: 0
    };

    util._extend(data, _data);

    this.incrs = function(type) {
        return ++data[type];
    };

    this.set = function(type, value) {
        data[type] = value;
        return data[type];
    };

    this.get = function(type) {
        return data[type];
    };
}
