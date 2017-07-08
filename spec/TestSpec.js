const fs = require('fs');
const path = require('path');
const request = require('request');
const Kernel = require('@conga/framework/lib/kernel/TestKernel');

describe("Kernel", () => {

    let kernel;
    let registry;

    beforeAll((done) => {

        kernel = new Kernel(
            path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample'),
            'app',
            'test',
            {}
        );

        kernel.addBundlePaths({

            '@conga/framework-view': path.join(__dirname, '..', 'node_modules', '@conga', 'framework-view'),
            '@conga/framework-view-twig': path.join(__dirname, '..', 'node_modules', '@conga', 'framework-view-twig'),

            'admin-bundle': path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample', 'src', 'admin-bundle'),
            'demo-bundle': path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample', 'src', 'demo-bundle'),
            '@conga/framework-webpack': path.join(__dirname, '..')
        });

        kernel.boot(() => {
            registry = kernel.container.get('conga.webpack.registry');
            done();
        });

    });

    it("should load a page containing webpack_asset()", (done) => {

        request({

            uri: "http://localhost:5555/",
            method: 'GET'

        }, (error, response, body) => {

            expect(response.statusCode).toEqual(200);
            done();
        });

    });

    it("should load a compiled js file", (done) => {

        request({

            uri: "http://localhost:5555" + registry.get('app1'),
            method: 'GET'

        }, (error, response, body) => {

            expect(response.statusCode).toEqual(200);
            expect(response.headers['content-type']).toEqual('application/javascript; charset=UTF-8');

            done();
        });

    });

    it("should load a second compiled js file", (done) => {

        request({

            uri: "http://localhost:5555" + registry.get('app2'),
            method: 'GET'

        }, (error, response, body) => {

            expect(response.statusCode).toEqual(200);
            expect(response.headers['content-type']).toEqual('application/javascript; charset=UTF-8');

            done();
        });

    });

    it("should load a third compiled js file from another bundle", (done) => {

        request({

            uri: "http://localhost:5555" + registry.get('admin'),
            method: 'GET'

        }, (error, response, body) => {

            expect(response.statusCode).toEqual(200);
            expect(response.headers['content-type']).toEqual('application/javascript; charset=UTF-8');

            done();
        });

    });

});
