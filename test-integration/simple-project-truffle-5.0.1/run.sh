#!/bin/bash

set -o errexit

cd "$(dirname $0)"

cp -r ../simple-project-truffle-template .

./simple-project-truffle-template/run.sh
