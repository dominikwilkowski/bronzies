bronzies.com
============

> A web app that teaches you the [SLSA](https://sls.com.au/) signals required for the [Bronze Medallion](https://sls.com.au/role/bronze-medallion/).

## Contents

* [How to run](#how-to-run)
* [Todos](#todos)
* [The app](#the-app)
* [The server](#the-server)
	* [RESTful API endpoints](#restful-api-endpoints)
	* [Install on server](#install-on-server)
* [License](#license)

----------------------------------------------------------------------------------------------------------------------------------------------------------------

## Todos

Next:
- [ ] tests via jest and cypress
- [ ] enable service worker
- [ ] re-add cpr beat screen
- [ ] fix theme (make sane)
- [ ] add more modes for types of beaches etc
- [ ] rebuild server
	- [ ] postgres
	- [ ] post history object as opposed to done score
	- [ ] move to graphql

----------------------------------------------------------------------------------------------------------------------------------------------------------------

## The app

The app can be found in the root folder and is powered by [CRA](https://github.com/facebook/create-react-app).
Install the dependencies via [`yarn`](https://yarnpkg.com/) and run `yarn start`.

| Command           | Description                  |
|-------------------|------------------------------|
| `yarn start`      | Start CRA development server |
| `yarn build`      | Build for production         |


**[⬆ back to top](#contents)**

----------------------------------------------------------------------------------------------------------------------------------------------------------------

## The server

The server can be found in the `./server/` folder.
Install dependencies, inside that folder, with preferably [`yarn`](https://yarnpkg.com/) and run one of the following commands:

| Command           | Description                                             |
|-------------------|---------------------------------------------------------|
| `yarn server`     | Start the server that serves the REST endpoint          |
| `yarn server:dev` | Start the server in staging mode to server staging data |


**[⬆ back to top](#contents)**


### RESTful API endpoints

*GET signals*

```
https://bronzies.com/api/signals
```

*GET signals SVG sprite*

```
https://bronzies.com/api/assets/signals
```

*GET highscore*

```
https://bronzies.com/api/highscore
```

*POST highscore*

```
https://bronzies.com/api/highscore
```

(use: `curl -i -H "Content-Type: application/json" -H "Accept: application/json" -X POST -d '{"name": "Superman", "nays": 55, "score": 5555555, "rounds": 777}' http://localhost:5555/api/highscore`)

### Install on server

The API runs behind an [NGINX proxy](https://github.com/dominikwilkowski/bronzies/blob/master/bronzies.com).

#### CRON task

To make sure the API is started when the system has to reboot, make sure you add a cron task after reboot:

```shell
chmod 700 /www/bronzies/server/starter.sh # the starter.sh of this repo
crontab -e
```

and add:

```shell
@reboot /www/bronzies/server/starter.sh
```

#### FOREVER node deamon

Now we still have to make sure the node app is restarted if it crashes for some uncaught reason. Install [forever](https://github.com/foreverjs/forever) and
register the task:

```shell
npm i forever -g
forever start -l bronzies.log --append -o bronziesOut.log -e bronziesError.log /www/bronzies/server/server.js
```


----------------------------------------------------------------------------------------------------------------------------------------------------------------

### Release History App

* 1.0.0 - Complete rewrite in react
* 0.1.5 - Removed cordova build, changed endpoints
* 0.1.4 - Added cordova build
* 0.1.3 - Fixed CSS and highscore issues
* 0.1.2 - Added basic layout for first alpha tests
* 0.1.1 - Changes to API endpoint, fixes
* 0.1.0 - Completely refactored the code, No Design yet
* 0.0.3 - Moved an old version into the repo and developed the RESTful API

### Release History Server

* 1.0.0 - Complete rewrite
* 0.0.3 - fixed dependencies, changed endpoints
* 0.0.2 - moved to MongoDB
* 0.0.1 - Created server, routes and endpoints

----------------------------------------------------------------------------------------------------------------------------------------------------------------

## License

Copyright (c) Dominik Wilkowski.
Licensed under [GNU-GPLv3](https://raw.githubusercontent.com/https://github.com/dominikwilkowski/bronzies/master/LICENSE).

**[⬆ back to top](#contents)**

# };
