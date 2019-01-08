#!/bin/bash

# Delete the installed dependency
rm -rf node_modules/openzeppelin-test-helpers
# Replace it with the local package
ln -s ../../.. node_modules/openzeppelin-test-helpers

npx truffle test
