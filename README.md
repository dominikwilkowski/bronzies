bronzies.com
============

> A Lifesaver learning app for bronze proficiency level

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