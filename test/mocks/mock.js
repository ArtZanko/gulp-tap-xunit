module.exports = [
    {
        type: 'test',
        name: 'First Level',
        id: 0
    }, {
        type: 'test',
        name: 'Second Level',
        id: 3,
        parent: 0
    }, {
        id: 0,
        ok: true,
        skip: undefined,
        name: 'assert 1',
        test: 3,
        type: 'assert'
    }, {
        id: 1,
        ok: false,
        skip: undefined,
        name: 'assert 2',
        test: 3,
        type: 'assert'
    }, {
        type: 'end',
        test: 3
    }, {
        type: 'end',
        test: 0
    }
];

