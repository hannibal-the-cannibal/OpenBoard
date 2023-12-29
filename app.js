const express = require("express");
const socketIO = require("socket.io");

const app = express(); // application initialize and server ready 

app.use(express.static("public"));


const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  //Received data from front-end
  socket.on("beginPath",(data)=>{
    //Transfer data to all connected computers
    io.sockets.emit("beginPath",data);

  })

  socket.on("lineTo",(data)=>{
    io.sockets.emit("lineTo",data);

  })

  socket.on("endPath",(data)=>{
    io.sockets.emit("endPath",data);

  })

  socket.on("redo", (trackobj) => {
    io.sockets.emit("redo", trackobj);
  })

  socket.on("undo", (trackobj) => {
    io.sockets.emit("undo", trackobj);
  })

  socket.on('updateCanvas', (data) => {
    socket.broadcast.emit('updateCanvas', data);
});

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
