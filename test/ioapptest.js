'use strict'

var io = require('socket.io-client')
, assert = require('assert')
, expect = require('expect.js');

describe('Chatroom socket server test', function() {
    var socketA;
    var socketB;
    var socketC;
    
    function connectAndJoin(room){
        var socket = io.connect('http://localhost:3000');
        
        // join a room immediately after the connection
        socket.on('connect', function() {
            console.log('connected');
            socket.emit('join', room);
        });
        
        return socket;
    }
    
    function disconnect(socket){
        if(socket.connected) {
            console.log('disconnecting...');
            socket.disconnect();
        } else {
            console.log('no connection to break...');
        }
    }
    
    beforeEach(function(done) {
        // Setup
        socketA = connectAndJoin(11);
                // when user joine the chat room successfully
        socketA.on('joined', function(username) {
            console.log('A joined' + username);
            done();
        });
    });

    afterEach(function(done) {
        // Cleanup
        disconnect(socketA);
        done();
    });

    describe('Join Leaving test', function() {
        it('Another user joins the same chat room', function(done) {
            var userNameB;
            function checkUserName(username){
                if(userNameB){
                    expect(username).to.be.equal(userNameB);
                    disconnect(socketB);
                    done();
                }else{
                   userNameB = username; 
                }               
            }
            socketA.on('userjoin', function(username) {
                console.log('userjoin', username);

                checkUserName(username);
            });
            
            var socketB = connectAndJoin(11, done);
            // when user joine the chat room successfully
            socketB.on('joined', function(username, users) {
                console.log('B joined', username);
                checkUserName(username);
            });
        });
        
        it('Another user joins a different chat room', function(done) {
            socketA.on('userjoin', function(username) {
                console.log('userjoin', username);
                throw new Error('Should not receive the join message!');
            });
            
            var socketB = connectAndJoin(12, done);
                    // when user joine the chat room successfully
            socketB.on('joined', function(username, users) {
                console.log('B joined', username);
            });
            
            setTimeout(done, 1000);
        });
    });
    
    describe('Leaving test', function() {
        it('Another user of the same room leaves', function(done) {
            var userNameB;

            socketA.on('userleave', function(username) {
                console.log('userleave', username);

                expect(username).to.be.equal(userNameB);
                done();
            });
            
            var socketB = connectAndJoin(11, done);
            socketB.on('joined', function(username, users) {
                console.log('B joined', username);
                userNameB = username;
                setImmediate(disconnect.bind(null, socketB));
            });
        });
        
        it('Another user of different room leaves', function(done) {
            socketA.on('userleave', function(username) {
                console.log('userleave', username);
                throw new Error('Should not receive the leaving message!');
            });
            
            var socketB = connectAndJoin(12, done);
            disconnect(socketB);
            
            setTimeout(done, 1000);
        });
    });
    
    describe('Chatting test', function() {
        it('Another user of the same room sends message', function(done) {
            var message = "hello, how are you?";
            var userNameB;

            socketA.on('chatmessage', function(msg) {
                console.log('receive chat massage', msg);

                expect(msg.message).to.be.equal(message);
                expect(msg.username).to.be.equal(userNameB);           
                disconnect(socketB);
                done();
            });
            
            var socketB = connectAndJoin(11, done);
            socketB.on('joined', function(username, users) {
                console.log('B joined', username);
                userNameB = username;
            });
            socketB.emit('chatmessage', message);
        });
        
        it('Another user of different room sends message', function(done) {
            var message = "hello, how are you?";

            socketA.on('chatmessage', function(msg) {
                console.log('chatmessage', msg);
                throw new Error('Should not receive the chat message!');
            });
            
            var socketB = connectAndJoin(12, done);
            socketB.emit('chatmessage', message);
            disconnect(socketB);
            
            setTimeout(done, 1000);
        });
    });
});