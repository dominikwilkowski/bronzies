#!/bin/sh

if [ $(ps -e -o uid,cmd | grep $UID | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
	export PATH=/usr/local/bin:$PATH
	forever start -l bronzies.log --append -o bronziesOut.log -e bronziesError.log /www/bronzies/server/server.js serve >> /home/deploy/.forever/bronzies-apiRestart.log 2>&1
fi
