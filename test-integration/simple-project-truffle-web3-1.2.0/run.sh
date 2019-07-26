#!/bin/bash

set -o errexit

cd "$(dirname $0)"

cp -r ../simple-project-truffle-template .

cd simple-project-truffle-template
npm install truffle@5.0.29

./run.sh
