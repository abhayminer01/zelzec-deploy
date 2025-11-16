const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin : ['http://localhost:5173', 'http://localhost:5174', 'https://zelzec.com', 'https://admin.zelzec.com']
    }
});

const userSocketMap = {}; // { userId : socketId }

io.on("connection", (socket) => {
    console.log("A User connected", socket.id);

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
    });

})

module.exports = { io, app, server };