#!/bin/bash

for test in "$(dirname $0)"/**; do
  bash "$test/run.sh"
done
