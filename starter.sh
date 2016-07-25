#!/bin/sh

if [ $(ps -e -o uid,cmd | grep $UID | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
	export PATH=/usr/local/bin:$PATH
	cd /www/bronzies/node/
	forever start -l api.log --append -o apiOut.log -e apiError.log api.min.js >> /home/deploy/.forever/apiRestart.log 2>&1
fi