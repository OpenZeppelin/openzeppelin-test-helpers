#!/bin/bash

set -o errexit

cd "$(dirname $0)"

# Get a package like a user would install
pkg="$(npm pack ../../../ 2> /dev/null)"

# Clean it up afterwards
trap "rm -f $pkg" EXIT

npm install

npm install --no-save "$pkg"

npm test
