#!/bin/bash

# Delete the installed dependency
rm -rf node_modules/openzeppelin-test-helpers

# Replace it with the local package
mkdir -p node_modules/openzeppelin-test-helpers/src
cp -r ../../openzeppelin-test-helpers.js node_modules/openzeppelin-test-helpers/
cp -r ../../package.json node_modules/openzeppelin-test-helpers/
cp -r ../../src/* node_modules/openzeppelin-test-helpers/src/

npx truffle test
