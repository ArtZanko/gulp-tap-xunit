var util = require('util');
var xmlBuilder = require('xmlbuilder');

function Suit() {
    var _asserts = 0;
    var _tests = {};

    this.xml = xmlBuilder.create('testsuites');

    this.setTest = function setTest(key, data) {
        _tests[key] = new Test(data);
        return _tests[key];
    }

    this.getTest = function getTest(key) {
        return _tests[key];
    }

    this.incAssert = function incAssert() {
        return ++_asserts;
    }
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
            // do nothing
    }
}

Suit.prototype.complete = function() {
    return this.xml.end({
        newline: '\n',
        indent: '  ',
        pretty: true
    });
}

module.exports = Suit;

function newTest(data) {
    var testXml = (typeof data.parent != 'undefined') ? this.getTest(data.parent).get('xml') : this.xml;

    testXml = testXml.ele('testsuite', {
        name: data.name
    });

    this.setTest(data.id, { xml: testXml })
}

function assert(data) {
    var test = this.getTest(data.test);

    if (!test) {
        throw new Error('Undefined test for assert')
    }

    var testCase = test.get('xml').ele('testcase', {
        name: util.format('#%d %s', this.incAssert(), data.name)
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
    var test = this.getTest(data.test);

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
