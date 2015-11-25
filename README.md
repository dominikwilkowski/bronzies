bronzies.com
============

> A Lifesaver learning app for bronze proficiency level, it tries to teach you the signals and might expand to other areas as well in the future


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## RESTful API endpoints

*GET questions*

```
http://bronzies.com:5555/questions
```

*GET highscore*

```
http://bronzies.com:5555/highscore
```

*POST highscore*

```
http://bronzies.com:5555/highscore
```

_The newly added entry will have an aditional key to id it: `justadded: true`_

(use: `curl -i -H "Content-Type: application/json" -H "Accept: application/json" -X POST -d '{"name": "Superman","nays": 55,"score": 5555555,"date": 777}' http://localhost:5555/highscore`)


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Run the build

```shell
npm i
grunt
```

## Run web app

Navigate your browser to the `dev/` folder.

## Run the server

*Run mongoDB*

```shell
mongod
```

*Run RESTful API*

```shell
node prod/node/api.min.js
```

## Run the cordova build

```shell
cordova create app com.bronzies.app Bronzies
cd app
cordova platform add ios
cordova plugin add cordova-plugin-transport-security
cordova plugin add cordova-plugin-statusbar
```

run grunt to move all appropriate files into their folders

```shell
grunt
cordova run ios
```


----------------------------------------------------------------------------------------------------------------------------------------------------------------


# Release History App
* 0.1.4 - Added cordova build
* 0.1.3 - Fixed CSS and highscore issues
* 0.1.2 - Added basic layout for first alpha tests
* 0.1.1 - Changes to API endpoint, fixes
* 0.1.0 - Completely refactored the code, No Design yet
* 0.0.3 - Moved an old version into the repo and developed the RESTful API

# Release History RestAPI
* 0.0.2 - moved to MongoDB
* 0.0.1 - Created server, routes and endpoints