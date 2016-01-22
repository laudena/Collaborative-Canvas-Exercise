/*var io = require('socket.io')();
io.on('connection', function(socket){
    socket.on('data', function(data) {

        io.sockets.emit('data', data);
    });
});

io.listen(3100);

*/


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('data', function(data) {
        io.sockets.emit('data', data);
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});