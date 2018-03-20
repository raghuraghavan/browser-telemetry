'use strict';
const loggerMiddleware = require('../');
const request = require('request');
const async = require('async');
const app = require('./fixtures/app');
const assert = require('assert');

describe(__filename, function() {
    
    it('should process metrics on server side and invoke callback', function(done) {
        let payload = {"metrics":{"navType":"1","rc":"0","lt":"1115","ct":"370","rt":"1042"},
        "logs":[{"level":"LOG","msg":"Hello, $logger.log"},{"msg":"Hello,console.log"},{"level":"INFO","msg":"Hello,console.info"},{"level":"WARN","msg":"Hello,console.warn"},{"level":"DEBUG","msg":"Hello,console.debug"},{"level":"ERROR","msg":"Some Error Error: Error Object\n    at logData (http://dathrika.qa.ebay.com:8080/:17:45)\n    at onload (http://dathrika.qa.ebay.com:8080/:19:597)"},{"level":"ERROR","msg":"Uncaught SyntaxError: Unexpected token < in JSON at position 0 http://dathrika.qa.ebay.com:8080/ 1 1 SyntaxError: Unexpected token < in JSON at position 0\n    at JSON.parse (<anonymous>)\n    at XMLHttpRequest.t.onload (https://secureir.ebaystatic.com/cr/v/c1/ghmin.js:1:1864)"}],
        "ebay":{"rlogid":"t6fgg~hwglm%3F%3CKN(UM%40(7635%3E%3E%3A6-162220b1bf6-0x602","pageName":"DefaultPage"}};
        
        async.waterfall([
            function(cb) {
                app.listen(9099, () => {
                    console.log('Server started...');
                    cb();
                });
            }, 
            function(cb) {
                request.post({url: 'http://localhost:9099/api/log', headers: {'user-agent': 'Chrome', 'referer': 'http://localhost:9099/'},form: payload}, function(err, res, body) {
                    payload.url = 'http://localhost:9099/';
                    payload.userAgent = 'Chrome';
                    assert.equal(JSON.stringify(payload), res.body, 'Payload should be same');
                    cb();
                });
            }
        ], function(err, res) {
            app && app.close();
            done();
        });        
    });
});