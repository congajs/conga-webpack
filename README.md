# conga-webpack [![Build Status](https://secure.travis-ci.org/congajs/conga-webpack.png)](http://travis-ci.org/congajs/conga-webpack)

## Overview

This is a bundle for the [CongaJS](https://github.com/congajs/conga) framework which adds webpack support to a project.

The purpose of this bundle is to provide an easy to use bridge between conga.js and webpack to compile your js/css/.etc assets and load them within your templates.

Additionally, the bundle will serve assets through webpack-dev-middleware and webpack-hot-middleware to provide quick compilation and page reloads while building your frontend applications.

Finally, this bundle also hooks in to the conga.js production build process to compile your final production assets prior to deployment with automatic cache bursted paths.

## Installation

### Add the bundle to your project

    $ npm install --save @conga/framework-webpack

### Enable the bundle in app/config/bundles.yml:

    bundles:

        all:

            - "@conga/framework-webpack"

## Add configuration to app/config/config.yml:

    webpack:

        # turn development mode on/off (dev middleware / hot reloading)
        development: true

        # the public path to publish files in dev mode under
        public.path: /build/

        # the path to the config file
        config.paths:
            - "frontend-bundle:resources/public/webpack.common.js"

## Add a webpack config file

The following is the minimum required configuration.

    // frontend-bundle/lib/resources/public/webpack.common.js

    const path = require('path');

    module.exports = {

        context: path.resolve(__dirname),

        entry: {
            app1: './app1.js',
            app2: './app2.js'
        },
        output: {
            filename: '[name].[hash].bundle.js'
        }

    };

A "context" is required which points to the directory in which the config file is located.

The "entry" needs to be an object with a unique key which will be used to reference the compiled file from a template.

It is recommended that the output file names contain a [hash] to enable "cache busting" in production environments.

### Load the assets in a template

    // frontend-bundle/lib/resources/views/default/index.html.twig

    <html>
    <head>
        <title>Webpack Test</title>
    </head>
    <body>
        <h1>Webpack Test</h1>
        <script src="{{ webpack_asset('app1') }}"></script>
    </body>
    </html>

Use the webpack_asset() helper to point to the final compiled file in the build directory using an "entry" key as defined in your webpack config file.
