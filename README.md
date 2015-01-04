bronzies.com
============

> A Lifesaver learning app for bronze proficiency level


## Setup

### MAC
2. Download [NodeJS](http://nodejs.org/) and install on your computer.
2. Run `sudo npm install npm -g` to update to the newest NPM version.
2. Run `sudo npm install -g grunt-cli` to install grunt globally (You might need to install the xCode command line tools)

### PC
3. Download [NodeJS](http://nodejs.org/) and install on your computer.
3. Run `npm install npm -g` to update to the newest NPM version.
3. Run `npm install -g grunt-cli` to install grunt globally

After that, download, unzip, `cd` into the folder and install all dependencies:

4. [Download this repo](https://github.com/dominikwilkowski/bronze/archive/master.zip) and unpack it into a folder of your choice.
4. CD into the folder `cd /Users/USERNAME/Sites/THISPROJECT`
4. Run `npm install` to install all dependencies.


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

(use: `curl -i -H "Content-Type: application/json" -H "Accept: application/json" -X POST -d '{"name": "Superman","nays": 55,"score": 5555555,"date": 777}' http://localhost:5555/highscore`)