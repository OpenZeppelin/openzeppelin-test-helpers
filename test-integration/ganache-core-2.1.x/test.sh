#!/bin/bash

# Delete the installed dependency
rm -rf node_modules/openzeppelin-test-helpers
# Replace it with the local package
ln -s ../../.. node_modules/openzeppelin-test-helpers

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the ganache instance that we started (if we started one and if it's still running).
  if [ -n "$ganache_pid" ] && ps -p $ganache_pid > /dev/null; then
    kill -9 $ganache_pid
  fi
}

ganache_port=8545

ganache_running() {
  nc -z localhost "$ganache_port"
}

start_ganache() {
  node_modules/.bin/ganache-cli --version
  node_modules/.bin/ganache-cli --gasLimit 0xfffffffffff --port "$ganache_port" "${accounts[@]}" > /dev/null &
  ganache_pid=$!

  sleep 1
}

if ganache_running; then
  echo "Using existing ganache instance"
else
  echo "Starting our own ganache instance"
  start_ganache
fi

./node_modules/.bin/truffle test --network ganache
