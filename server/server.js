const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  socket.on('send_message', (msg) => {
    console.log(msg);
    socket.broadcast.emit('receive_message', msg);
  });
  socket.on("user_typing", (data) => {
    socket.broadcast.emit("user_typing", data);
  });
  socket.on('new_user', (data) => {
    socket.broadcast.emit('new_user', data.user.name);
  });
});

// Use environment variable for port, fallback to 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});