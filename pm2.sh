#!/bin/bash

APP_NAME="doubloon-leaderboard"
DEFAULT_PORT=44275
PORT=${1:-$DEFAULT_PORT}

echo "Starting Doubloon Leaderboard on port $PORT..."

npm run build

export PORT=$PORT

pm2 start build/index.js --name "$APP_NAME"
pm2 save

echo "Running on port $PORT"
