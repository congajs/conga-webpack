const fs = require('fs');
const path = require('path');
const request = require('request');
const Kernel = require('@conga/framework/lib/kernel/TestKernel');

describe("Kernel", () => {

    let kernel;

    beforeAll((done) => {

        kernel = new Kernel(
            path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample'),
            'app',
            'test',
            {}
        );

        kernel.addBundlePaths({
            'demo-bundle': path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample', 'src', 'demo-bundle'),
            '@conga/framework-webpack': path.join(__dirname, '..')
        });

        kernel.boot(() => {
            done();
        });

    });

    it("should load a compiled js file", (done) => {

        request({

            uri: "http://localhost:5555/build/bundle.js",
            method: 'GET'

        }, (error, response, body) => {

            expect(response.statusCode).toEqual(200);
            expect(response.headers['content-type']).toEqual('application/javascript; charset=UTF-8');

            done();
        });

    });

});
