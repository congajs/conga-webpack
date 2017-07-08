const fs = require('fs');
const path = require('path');
const request = require('request');
const Kernel = require('@conga/framework/lib/kernel/BuildKernel');

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

            '@conga/framework-view': path.join(__dirname, '..', 'node_modules', '@conga', 'framework-view'),
            '@conga/framework-view-twig': path.join(__dirname, '..', 'node_modules', '@conga', 'framework-view-twig'),


            'admin-bundle': path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample', 'src', 'admin-bundle'),
            'demo-bundle': path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample', 'src', 'demo-bundle'),
            '@conga/framework-webpack': path.join(__dirname, '..')
        });

        kernel.boot(() => {

            kernel.build({}, {}, () => {
                done();
            });
        });

    });

    it('should build a js file', (done) => {

        console.log('test');
        done();

    });

});
