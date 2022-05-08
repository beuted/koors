#!/bin/sh

clear;

echo ">>>>>>>> BUILDING FRONT";
npm install;
npm run build;

echo ">>>>>>>> BUILDING SERVER";
cd back/;
npm install;
npm run build;

echo ">>>>>>>> STARTING APP";
PORT=3006 forever start index.js;