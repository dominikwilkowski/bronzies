bronzies.com
============

> A Lifesaver learning app for bronze proficiency level, it tries to teach you the signals and might expand to other areas as well in the future


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Run this repo

### MAC
2. Download [NodeJS](http://nodejs.org/) and install on your computer.
2. Run `npm install npm -g` to update to the newest NPM version.
2. Run `npm install -g grunt-cli` to install grunt globally (You might need to install the xCode command line tools)

### PC
3. Download [NodeJS](http://nodejs.org/) and install on your computer.
3. Run `npm install npm -g` to update to the newest NPM version.
3. Run `npm install -g grunt-cli` to install grunt globally


### Both

After that, download, unzip, `cd` into the folder and install all dependencies:

4. [Download this repo](https://github.com/dominikwilkowski/bronze/archive/master.zip) and unpack it into a folder of your choice.
4. CD into the folder `cd /Users/USERNAME/Sites/THISPROJECT`
4. Run `npm install` to install all dependencies.

5. Run  `node api.min.js` in the `prod/node/` folder to run the RESTful API
5. Run `grunt` for the watch


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


# Release History App
* 0.1.0 - Completely refactored the code, No Design yet
* 0.0.3 - Moved an old version into the repo and developed the RESTful API

# Release History RestAPI
* 0.0.2 - moved to MongoDB
* 0.0.1 - Created server, routes and endpoints