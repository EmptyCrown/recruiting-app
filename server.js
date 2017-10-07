const express = require('express');
const morgan = require('morgan');
const path = require('path');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var numUsers = 23;

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static('js'));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');
  numUsers++;
  io.emit('numUsers', numUsers);
  socket.on('disconnect', function(){
    console.log('user disconnected');
    numUsers--;
    io.emit('numUsers', numUsers);
  });
});

const PORT = process.env.PORT || 9000;

http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});