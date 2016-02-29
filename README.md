# cozychatroom
A real time chat room implemented with Socket.io and Express

## How to use

```
$ npm install
$ npm start
```
And point your browser to `http://localhost:3000/chatroom`.

### Dev

```
$ grunt dev
```
### Test

```
$ grunt dev
```

### Coverage

```
$ grunt coverage
```

And point your browser to `http://localhost:3000`. Optionally, specify
a port by supplying the `PORT` env variable.

## Features

A website with many rooms and allow for many users inside the rooms.  
Every user can join to room via specific link:  
example: /join?room=1  
schema: /join?room={room_id:\d+}  
You can use same link to join into a room in another browser. Different browsers - different Users.  

Using Mongodb as database and store there users activity.  

DEMO: https://gentle-crag-97246.herokuapp.com/chatroom/join?room=1

## Technologies

Node.js, Socket.io, Express, AngularJS, Websocket, HTML5, Mocha, Grunt
