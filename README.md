bronzies.com [![CircleCI](https://circleci.com/gh/dominikwilkowski/bronzies/tree/master.svg?style=svg)](https://circleci.com/gh/dominikwilkowski/bronzies/tree/master)
============

> A web app that teaches you the [SLSA](https://sls.com.au/) signals required for the [Bronze Medallion](https://sls.com.au/role/bronze-medallion/).

## Contents

* [How to run](#how-to-run)
* [Todos](#todos)
* [The app](#the-app)
* [The server](#the-server)
	* [RESTful API endpoints](#restful-api-endpoints)
	* [Install on server](#install-on-server)
* [Testing](#testing)
* [Release History](#release-history-app)
* [License](#license)

----------------------------------------------------------------------------------------------------------------------------------------------------------------

## How to run

| Command           | Description                                           |
|-------------------|-------------------------------------------------------|
| `yarn start`      | Starts server and app concurrently                    |
| `yarn build`      | Create deploy files inside `build/`                   |
| `yarn test`       | Runs all tests                                        |
| `yarn deploy`     | Builds app, deploys all files and restarts the server |
| `yarn nuke`       | Removes build, `node_modules/` and `yarn.lock` file   |

Running the server manually

```shell
yarn start:server
```

Running the app

```shell
yarn start:app
```

**[⬆ back to top](#contents)**

----------------------------------------------------------------------------------------------------------------------------------------------------------------

## Todos

Next:
- [ ] add more unit tests
- [ ] make gameToggler a11y
	- [ ] trap focus
	- [ ] support esc key close
	- [ ] aria roles
- [ ] re-add cpr beat screen
- [ ] fix theme (make sane)
- [ ] add more modes for types of beaches etc
- [ ] rebuild server
	- [ ] postgres
	- [ ] move to graphql

**[⬆ back to top](#contents)**

----------------------------------------------------------------------------------------------------------------------------------------------------------------

## The app

The app can be found in the root folder and is powered by [CRA](https://github.com/facebook/create-react-app).
Install the dependencies via [`yarn`](https://yarnpkg.com/) and run `yarn start`.

| Command           | Description                  |
|-------------------|------------------------------|
| `yarn start:app`  | Start CRA development server |
| `yarn build`      | Build for production         |
| `yarn deploy:app` | Upload the build app         |

**[⬆ back to top](#contents)**

----------------------------------------------------------------------------------------------------------------------------------------------------------------

## The server

The server can be found in the `./server/` folder.
Install dependencies, inside that folder, with preferably [`yarn`](https://yarnpkg.com/) and run one of the following commands:

| Command                 | Description                                             |
|-------------------------|---------------------------------------------------------|
| `yarn start:server`     | Start the server that serves the REST endpoint          |
| `yarn start:server:dev` | Start the server in staging mode to server staging data |
| `yarn deploy:server`    | Upload the server files (without `node_modules`)        |
| `yarn deploy:restart`   | Restart the remote server app                           |

### RESTful API endpoints

| Command                      | Description                                                    |
|------------------------------|----------------------------------------------------------------|
| `node server.js serve`       | Run the server and take production data from `assets/`         |
| `node server.js serve debug` | Run the server but with staging data from `assets/`            |
| `node server.js test`        | Don't run the server so we can test without starting a process |

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
forever start -l bronzies.log --append -o bronziesOut.log -e bronziesError.log /www/bronzies/server/server.js serve
```

**[⬆ back to top](#contents)**

----------------------------------------------------------------------------------------------------------------------------------------------------------------

## Testing

Continues integration is setup with [CircleCI](https://circleci.com/) and we're testing with [Jest](https://jestjs.io/) and
[Cypress](https://www.cypress.io/).

| Command                | Description                                           |
|------------------------|-------------------------------------------------------|
| `yarn test`            | Run all tests                                         |
| `yarn test:unit`       | Run all unit tests with Jest                          |
| `yarn test:unit:watch` | Runs Jest test watch                                  |
| `yarn test:unit:cover` | Shows coverage of unit tests                          |
| `yarn test:e2e`        | Run all end-to-end tests with Cyrpess                 |
| `yarn test:e2e:server` | Start server for e2e test                             |
| `yarn test:e2e:run`    | Run e2e test in ci                                    |
| `yarn test:e2e:open`   | Open Cypress                                          |

**[⬆ back to top](#contents)**

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

**[⬆ back to top](#contents)**

----------------------------------------------------------------------------------------------------------------------------------------------------------------

## License

Copyright (c) Dominik Wilkowski.
Licensed under [GNU-GPLv3](https://raw.githubusercontent.com/https://github.com/dominikwilkowski/bronzies/master/LICENSE).

**[⬆ back to top](#contents)**

# };
