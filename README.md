# conga-webpack [![Build Status](https://secure.travis-ci.org/congajs/conga-webpack.png)](http://travis-ci.org/congajs/conga-webpack)

## Overview

This is a bundle for the [CongaJS](https://github.com/congajs/conga) framework which adds webpack support to a project.

## Installation

Add the bundle to your project

    $ npm install --save @conga/framework-webpack

Enable the bundle in app/config/bundles.yml:

    bundles:

        all:

            - "@conga/framework-webpack"

Add configuration to app/config/config.yml:

    webpack:

        # turn development mode on/off (dev middleware / hot reloading)
        development: true

        # the public path to publish files in dev mode under
        public.path: /build/

        # the path to the config file
        config.paths:
            - "frontend-bundle:resources/public/webpack.common.js"
