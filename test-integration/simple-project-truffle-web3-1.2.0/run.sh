#!/bin/bash

set -o errexit

cd "$(dirname $0)"

cp -r ../simple-project-truffle-template .

sed -i "s/\"truffle\": \"5.0.1\"/\"truffle\": \"5.0.29\"/g" simple-project-truffle-template/package.json

./simple-project-truffle-template/run.sh
