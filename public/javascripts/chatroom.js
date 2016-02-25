function getUrlParam(key) {  
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}  

// Would write the value of the QueryString-variable called name to the console  
console.log(getUrlParam("room")); 

var chatApp = angular.module('chatApp', []);

chatApp.controller('chatCtl', ['$scope', function($scope){
  $scope.msgs = [];
  $scope.users = [];

  console.log('socket io() start!!');
  var socket = io();
  console.log('socket io() end!!');
  socket.on('chat message', function(msg){
    console.log('recievemsg', msg);
      $scope.$apply(function(){
        $scope.msgs.push(msg);
      });
  });
  socket.on('connect', function () {
    console.log('connect', getUrlParam("room"));
    socket.emit('join', getUrlParam("room"));
  });
  socket.on('disconnect', function () {
      console.log('disconnected!');
      socket.disconnect(true);
      $scope.$apply(function(){
          $scope.msgs.push({username:'Server', message:'On maintainess, sorry for that. Come back soon!(Auto message)'});  });
  });           

  socket.on('userjoin', function(username){
    console.log('userjoin', username);
    $scope.$apply(function(){
      $scope.users.push(username);
      $scope.msgs.push({username:username, message:'Hi, everyone!(Auto message)' });    
    });
  });

  socket.on('userleave', function(username){
    console.log('userleave', username);
    $scope.$apply(function(){
      var index = $scope.users.indexOf(username);
      $scope.users.splice(index, 1);
      $scope.msgs.push({username:username, message:'Bye bye!!! (Auto message)'});
    });
  });

  socket.on('joined', function(username, users){
      console.log('users', users);
      $scope.$apply(function(){
      $scope.myname = username;
      $scope.users = users;
    });
  });

  $scope.sendmessage = function(msg){
      console.log('sendmsg');
      socket.emit('chat message', msg);
      $scope.msg = '';
      return false;
  }  
}]);   