const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: "*", // hoặc origin: "https://ten-frontend-cua-ban.vercel.app" để tăng bảo mật
    methods: ["GET", "POST"]
  }
});

// Thêm route GET / để khi vào trình duyệt không bị lỗi
app.get("/", (req, res) => {
  res.send("✅ Socket.IO server is running!");
});

io.on('connection', (socket) => {
  console.log(`🟢 New connection: ${socket.id}`);

  socket.on('send_message', (msg) => {
    console.log("📩 Message received:", msg);
    socket.broadcast.emit('receive_message', msg);
  });

  socket.on("user_typing", (data) => {
    socket.broadcast.emit("user_typing", data);
  });

  socket.on('new_user', (data) => {
    console.log("👤 New user:", data.user.name);
    socket.broadcast.emit('new_user', data.user.name);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Disconnected: ${socket.id}`);
  });
});

// Dùng PORT do Render cung cấp
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
