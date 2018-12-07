#!/bin/bash

npm install

rm -rf node_modules/openzeppelin-test-helpers
ln -s ../../.. node_modules/openzeppelin-test-helpers

npm test
