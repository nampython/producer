var http = require('http'),
socketIO = require('socket.io'),

port = process.env.PORT || 8080,
ip = process.env.IP || '127.0.0.1',

server = http.createServer().listen(port, ip, function(){
    console.log('Socket.IO server started at %s:%s!', ip, port);
}),

io = socketIO.listen(server);
io.set('match origin protocol', true);
io.set('origins', '*:*');