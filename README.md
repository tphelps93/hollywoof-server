# HollyWoof Server

##### Repositories

Server Repo: https://github.com/tphelps93/hollywoof-server
Client Repo: https://github.com/tphelps93/hollywoof-client

##### Live Links

Vercel Client - Live Link - https://hollywoof.xyz/
Heroku Server - Live Link - https://hollywoof-database.herokuapp.com/api/users

## Summary

I'll set the scene. You get home after a long day of work, make your dinner, and sit down with your dog to watch your favorite TV show. Half way through, a dog begins barking on the TV. You struggle to mute the tv as not to alert your dog. Alas, the dog has been disturbed and is now
barking at the top of its lungs and it takes forever to calm it down. Your nice, quiet evening is interrupted.

Enter HollyWoof. This is an application that will allow users to register, login, report and view movies or shows that contain dog barks, and even set a timestamp and a volume level for the occurrence. That way you can be prepared the next time a dog is about to bark on tv.

![image](https://user-images.githubusercontent.com/55715053/104391907-f6982000-550e-11eb-8b72-f7ef17f44d29.png)

## API Documentation

### GET /api/timestamps

Returns an array of timestamps from the server.

### Example Response

```
[
    {
        "ts_id": 1,
        "timestamp": "01:25:00",
        "comment": "Crazy Loud",
        "volume": "High",
        "confirmations": 1
        "likes": 55
        "dislikes": 10
        "media_id": "tt9397902",
        "user_id": 1,
        "date_created": "2021-01-14T16:05:43.157Z"
    }
]
```

- ts_id - number - uuid of a timestamp
- timestamp - string - timestamp of a movie or tv show
- comment - string - comment of a timestamp
- volume - string - volume of the content at a timestamp
- confirmations - number - number of times a user as confirmed a timestamp
- likes - number - number of a times a user has liked a timestamp
- dislikes - number - number of times a user has disliked a timestamp
- media_id - string - the id of the movie or show that a user has written a timestamp for
- user_id - number - the id of the user that has written the timestamp
- date_created - string - date when a timestamp was created

### POST /api/timestamps

A submission of a timestamp to a movie or show. Requires timestamp, comment, and volume.
 - user_id will be populated based on the user that is logged in
 - media_id will be populated based on the parameter passed into the url that is liked to the form the user clicked on
 - confirmations, likes, and dislikes will be initially set to 0
 - date_created is auto generated on the time the timestamp is submitted.
Only a registered and logged in user can POST new timestamps.

```
[
    {
        "timestamp": "01:25:00",
        "comment": "Crazy Loud",
        "volume": "High",
        "confirmations": 0,
        "likes": 0,
        "dislikes" 0,
        "user_id": 1,
        "media_id": "tt9397902",
        "date_created": "2021-01-14T16:05:43.157Z"
    }
]
```

### PATCH /api/timestamps/:ts_id

A request to update a timestamp.

### DELETE /api/timestamps/:ts_id

A request to delete a timestamp.



### GET /api/barks

Returns an array of barks from the server.

### Example Response

```
[
    {
        "bark_id": 1,
        "barks": "Yes",
        "media_id": "tt9397902",
        "date_created": "2021-01-14T16:05:43.157Z"
    }
]
```

- bark_id - number - uuid of a bark
- barks - string - a bark is "Yes" or "No"
- media_id - string - the id of the movie or show that a user has posted a bark for
- date_created - string - date when a timestamp was created

### POST /api/barks

A submission of a bark to a movie or show. Requires only barks.
 - media_id will be populated based on the parameter passed into the url that is liked to the form the user clicked on
 - date_created is auto generated on the time the timestamp is submitted.
Only a registered and logged in user can POST a new bark.

```
[
    {
        "barks": "Yes",
        "media_id": "tt9397902",
        "date_created": "2021-01-14T16:05:43.157Z"
    }
]
```

### PATCH /api/barks/:bark_id

A request to update a bark.

## Technologies Used

##### FrontEnd

- JavaScript
- React
- React-Router
- Context

##### Backend

- NodeJs
- Express
- Knex
- CORS
- Chai, Mocha, supertest (testing)

##### Server

- PostgreSQL
