#!/bin/bash

# Delete the old symlink, if it existed
rm -rf node_modules/openzeppelin-test-helpers

npm install

# Delete the installed dependency
rm -rf node_modules/openzeppelin-test-helpers
# Replace it with the local package
ln -s ../../.. node_modules/openzeppelin-test-helpers

npm test
