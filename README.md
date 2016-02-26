# cozychatroom
A real time chat room implemented with Socket.io and Express

A website with many rooms and allow for many users inside the rooms.  
Every user can join to room via specific link:  
example: /join?room=1  
schema: /join?room={room_id:\d+}  
You can use same link to join into a room in another browser. Different browsers - different Users.  
Inside the room, there must be a top-bar with a current User name. Name can be generated randomly (it can be a small 8-chars hash).  
Also, there must be a sidebar with the names of all currently connected users inside this room. If any user disconnects - we need to remove him from users list.
Rememeber - different rooms - different users!  
Also, it would be great to make a simple public room-chat, with simple messages.  
You need use Mongodb as database and store there users activity.  

DEMO: https://gentle-crag-97246.herokuapp.com/chatroom/join?room=1

