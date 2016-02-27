// Would write the value of the QueryString-variable called name to the console  
var chatApp = angular.module('chatApp', []);

chatApp.controller('chatCtl', ['$scope', function($scope) {
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    $scope.msgs = [];
    $scope.users = [];

    console.log('socket io() start!!');
    var socket = io();
    console.log('socket io() end!!');
    socket.on('chat message', function(msg) {
        console.log('recievemsg', msg);
        $scope.$apply(function() {
            //msg.color = getUserColor(msg.username);
            $scope.msgs.push(msg);
        });
        console.log('scroll', angular.element('.messages'));
        angular.element('.messages')[0].scrollTop = angular.element('.messages')[0].scrollHeight;
    });

    socket.on('connect', function() {
        console.log('connect', getUrlParam("room"));
        socket.emit('join', getUrlParam("room"));
    });

    socket.on('disconnect', function() {
        console.log('disconnected!');
        socket.disconnect(true);
        $scope.$apply(function() {
            $scope.msgs.push({
                username: 'Server',
                message: 'Connection is closed, connect again.'
            });
        });
    });

    socket.on('userjoin', function(username) {
        console.log('userjoin', username);
        $scope.$apply(function() {
            $scope.users.push(username);
            $scope.msgs.push({
                username: username,
                message: 'Hi, everyone!(Auto message)'
            });
        });
    });

    socket.on('userleave', function(username) {
        console.log('userleave', username);
        $scope.$apply(function() {
            var index = $scope.users.indexOf(username);
            $scope.users.splice(index, 1);
        });
        $scope.msgs.push({
            username: username,
            message: 'Bye bye!!! (Auto message)'
        });
    });

    socket.on('joined', function(username, users) {
        console.log('users', users);
        $scope.$apply(function() {
            $scope.myname = username;
            $scope.users = users;
        });
    });

    $scope.sendmessage = function(msg) {
        console.log('sendmsg', msg);
        if (msg)
            socket.emit('chatmessage', msg);
        $scope.msg = '';
        return false;
    };

    function getUrlParam(key) {
        return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    $scope.getUserColor = function(name) {
        if (!name) return 1;
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
            var character = name.charCodeAt(i);
            hash = ((hash << 5) - hash) + character;
            hash = hash & hash; // Convert to 32bit integer
        }
        return COLORS[Math.abs(hash % COLORS.length)];
    };

}]);
