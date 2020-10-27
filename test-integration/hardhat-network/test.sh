#!/bin/bash

set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the Hardhat Network instance that we started (if we started one and if it's still running).
  if [ -n "$hardhat_network_pid" ] && ps -p $hardhat_network_pid > /dev/null; then
    kill -9 $hardhat_network_pid
  fi
}

hardhat_network_port=8545

export CI=true

hardhat_network_running() {
  nc -z localhost "$hardhat_network_port"
}

start_hardhat_network() {
  node_modules/.bin/hardhat --version
  node_modules/.bin/hardhat node > /dev/null &
  hardhat_network_pid=$!

  sleep 1
}

if hardhat_network_running; then
  echo "Using existing Hardhat Network instance"
else
  echo "Starting our own Hardhat Network instance"
  start_hardhat_network
fi

./node_modules/.bin/hardhat test --network localhost
