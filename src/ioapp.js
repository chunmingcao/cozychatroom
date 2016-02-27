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

ioapp.on('connection', function(socket) {
    console.log('a user connected', 'socket', socket.id);
    var user = {
        name: getRandomName()
    };

    socket.on('disconnect', function() {
        console.log('user disconnected', 'socket.user', this.id);
        socket.leave(user.room);
        rooms.leave(user.room, user.name);
        ioapp.to(user.room).emit('userleave', user.name);
        console.log('user leave', 'room', user.room);
    });

    socket.on('join', function(room) {
        user.room = room;
        socket.join(user.room);
        rooms.join(user.room, user.name);
        console.log('join user: ' + user.name + ' room:' + room);

        ioapp.to(user.room).emit('userjoin', user.name);
        socket.emit('joined', user.name, rooms.getUserList(user.room));
    });

    socket.on('chatmessage', function(msg) {
        //io.emit('chat message', msg);
        if (msg)
            ioapp.to(user.room).emit('chat message', {
                username: user.name,
                message: msg
            });
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
            return rooms[room].users;
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
