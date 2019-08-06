bronzies.com
============

## Todos

MVP:
- [ ] make sure practice round has enough answers
- [ ] store svg sprite in localStorage and on page (no remote svg anymore)
- [ ] finish highscore page
	- [ ] form submission
	- [ ] push ups
	- [ ] rounds/index to be added to score?
- [ ] fill about page
- [ ] loading animation fading to logo?
- [ ] add reporting to app
	- [ ] https://clicky.com/ or https://matomo.org/ or https://usefathom.com/ or https://www.atinternet.com/en/
- [ ] move some game state into single state object
- [ ] fix this readme

Next:
- [ ] fix theme (make sane)
- [ ] add more modes for types of beaches etc
- [ ] show how many in highscore all together
- [ ] rebuild server
	- [ ] postgres
	- [ ] post answer object as opposed to done score
	- [ ] move to graphql

----------------------------------------------------------------------------------------------------------------------------------------------------------------


## RESTful API endpoints

*GET questions*

```
https://bronzies.com/api/questions
```

*GET highscore*

```
https://bronzies.com/api/highscore
```

*POST highscore*

```
https://bronzies.com/api/highscore
```

_The newly added entry will have an aditional key to id it: `justadded: true`_

(use: `curl -i -H "Content-Type: application/json" -H "Accept: application/json" -X POST -d '{"name": "Superman","nays": 55,"score": 5555555,"date": 777}' http://localhost:5555/highscore`)


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Run the build

```shell
yarn
yarn start
```

## Run web app

Navigate your browser to [`http://localhost:3000`](http://localhost:3000).

## Run the server

*Run mongoDB*

```shell
mongod
```

*Run RESTful API*

```shell
node prod/node/api.min.js
```


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Install on server

The API runs behind an [NGINX proxy](https://github.com/dominikwilkowski/bronzies/blob/master/bronzies.com).
In case the server has to reboot we need a way to start it up so let's create a cron task:

### CRON task

To make sure the blender is started when the system has to reboot, make sure you add a cron task after reboot:

```shell
chmod 700 /www/bronzies/node/starter.sh #the starter.sh of this repo
crontab -e
```

and add:

```shell
@reboot /www/bronzies/node/starter.sh
```

### FOREVER node deamon

Now we still have to make sure the node app is restarted if it crashes for some uncaught reason. Install [forever](https://github.com/foreverjs/forever) and
register the task:

```shell
npm i forever -g
forever start -l blender.log --append -o blenderOut.log -e blenderError.log server.js
```


----------------------------------------------------------------------------------------------------------------------------------------------------------------


### Release History App
* 0.1.5 - Removed cordova build, changed endpoints
* 0.1.4 - Added cordova build
* 0.1.3 - Fixed CSS and highscore issues
* 0.1.2 - Added basic layout for first alpha tests
* 0.1.1 - Changes to API endpoint, fixes
* 0.1.0 - Completely refactored the code, No Design yet
* 0.0.3 - Moved an old version into the repo and developed the RESTful API

### Release History RestAPI
* 0.0.3 - fixed dependencies, changed endpoints
* 0.0.2 - moved to MongoDB
* 0.0.1 - Created server, routes and endpoints