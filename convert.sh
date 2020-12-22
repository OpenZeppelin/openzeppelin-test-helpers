#!/usr/bin/env zsh
npm install --save-dev typescript @types/node

set -x

for file in ./{src,test,test-integration}/**/*.js; do
  cp $file ${file/js/ts}
done
