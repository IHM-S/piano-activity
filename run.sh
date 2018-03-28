#!/bin/sh

cd 'client'
npm install
npm run dev-build
cd '../server'
python3 -m pip install -r 'requirement.txt'
python3 'run_server.py'