#!/bin/bash

echo "Stopping Neighby..."


pm2 delete all
pm2 kill

sh ./utilities/kill_ports.sh .env

rm -rf ./local

echo "Neighby stopped"