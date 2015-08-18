var test = require('tape');
var parser = require('xml2js').parseString;
var resultMock = require('./mocks/mock');
var Suit = require('../lib/suitup');

var testResult;
var suitup = new Suit();

test(function(t) {
    for(var i = 0; i < resultMock.length; i++) {
        var result = resultMock[i];
        suitup.add(result);
    }

    parser(suitup.complete(), function(err, result) {
        testResult = result;
        t.end();
    });
});

test('Check suitup', function(t) {
    t.test('Check type test', function(t) {
        t.ok(testResult.testsuites, 'Testsuites exist');
        t.is(testResult.testsuites.testsuite.length, 1, 'Correct numbers of testsuites');

        var testsuiteFirst = testResult.testsuites.testsuite[0];
        var testsuiteFirstData = testsuiteFirst['$'];

        t.is(testsuiteFirstData.name, 'First Level', 'Correct name of first test');
        t.is(+testsuiteFirstData.tests, 0, 'Correct number of tests on first level');
        t.is(+testsuiteFirstData.failures, 0, 'Correct number of failures on first level');
        t.is(+testsuiteFirstData.errors, 0, 'Correct number of errors on first level');

        var testsuiteSecond = testsuiteFirst.testsuite[0];
        var testsuiteSecondData = testsuiteSecond['$'];

        t.is(testsuiteFirst.testsuite.length, 1, 'Correct numbers of testsuites');
        t.is(+testsuiteSecondData.tests, 2, 'Correct number of tests on second level');
        t.is(+testsuiteSecondData.failures, 1, 'Correct number of failures on second level');
        t.is(+testsuiteSecondData.errors, 0, 'Correct number of errors on second level');

        var testcases = testsuiteSecond.testcase;

        t.is(testcases.length, 2, 'Correct numbers of testcases');
        t.notOk(testcases[0].failure, 'Correct testcase #1');
        t.ok(testcases[1].failure, 'Correct testcase #2');

        t.end();
    });
});
