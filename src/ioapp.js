'use strict';
/*
You need build simple( ! ) Nodejs application.
It must be website with many rooms and allow for many users inside the rooms.
Every user can join to room via specific link:
example: /join?room=1
schema: /join?room={room_id:\d+}
You can use same link to join into a room in another browser. Different browsers - different Users.
Inside the room, there must be a top-bar with a current User name. Name can be generated randomly (it can be a small 8-chars hash).
Also, there must be a sidebar with the names of all currently connected users inside this room. If any user disconnects - we need to remove him from users list.
Rememeber - different rooms - different users!
Also, it would be great to make a simple public room-chat, with simple messages.
You need use Mongodb as database and store there users activity.
Main goal - make this functional. You do not need use complex decisions, but have a working room.
*/
var ioapp = require('socket.io')();
var mongoose = require('mongoose');
var UsersModel = require('./models/user');

// db connection
mongoose.connect("mongodb://test:test@ds051990.mlab.com:51990/heroku_52p6q5gm");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'db connected'));

ioapp.on('connection', function(socket) {
    console.log('a user connected', 'socket', socket.id);

    // create a user when he connects
    var user = new UsersModel();
    user.name = getRandomName();
    user.ip = socket.request.connection.remoteAddress;
    user.actions.push({
        name: 'connect'
    });

    // function of save user to db
    function saveUser() {
        user.save(function(err) {
            if (err) console.log('save failure', err);
        });
    }
    saveUser();

    // user disconnect
    socket.on('disconnect', function() {
        console.log('user disconnected', 'socket.user', this.id);
        socket.leave(user.room);
        rooms.leave(user.room, user.name);
        ioapp.to(user.room).emit('userleave', user.name);

        // save user's action
        user.actions.push({
            name: 'leaveroom'
        });
        user.actions.push({
            name: 'disconnect'
        });
        saveUser();
        console.log('user leave', 'room', user.room);
    });

    // join a room
    socket.on('join', function(room) {
        user.room = room;
        socket.join(user.room);
        console.log('join user: ' + user.name + ' room:' + room);
        // update the userlist in the room
        rooms.join(user.room, user.name);
        // send the user the userlist in this chat room
        socket.emit('joined', user.name, rooms.getUserList(user.room));
        // notify all the users in this chat room that the new user joined
        socket.broadcast.to(user.room).emit('userjoin', user.name);

        // save user's action
        user.actions.push({
            name: 'joinroom'
        });
        saveUser();
    });

    // emit the message to all users in the room
    socket.on('chatmessage', function(msg) {
        if (typeof user.room === 'undefined') {
            socket.emit('Error', 'You have to join a room');
            return;
        }
        //io.emit('chat message', msg);
        if (msg) {
            ioapp.to(user.room).emit('chatmessage', {
                username: user.name,
                message: msg
            });

            // save user's message
            user.messages.push({
                content: msg
            });
            saveUser();
        }

        console.log('message:', msg, 'socket.room', user.room);
    });
});


var rooms = (function() {
    rooms = {};

    rooms.join = function(room, user) {
        if (typeof rooms[room] === 'undefined') {
            rooms[room] = {
                users: []
            };
        }
        rooms[room].users.push(user);
        //console.log('rooms.join', rooms[room].users);
    };

    rooms.leave = function(room, user) {
        if (typeof rooms[room] === 'undefined') {
            return;
        }
        var users = rooms[room].users;
        var index = users.indexOf(user);
        users.splice(index, 1);
    };

    rooms.getUserList = function(room) {
        //console.log('rooms.getUserList', 'room', room);
        if (typeof rooms[room] === 'undefined') {
            return [];
        } else {
            //console.log('rooms.getUserList', 'users', rooms[room].users);
            return rooms[room].users || [];
        }
    };

    return rooms;
})();


function getRandomName() {
    var name = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 8; i++)
        name += possible.charAt(Math.floor(Math.random() * possible.length));

    return name;
}

module.exports = ioapp;
