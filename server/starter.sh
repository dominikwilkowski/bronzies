#!/bin/sh

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
forever start -l bronzies.log --append -o bronziesOut.log -e bronziesError.log /www/bronzies/server/server.js serve >> /home/deploy/.forever/bronzies-apiRestart.log 2>&1
