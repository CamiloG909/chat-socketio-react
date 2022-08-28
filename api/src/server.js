const cors = require("cors");
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
	},
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
	socket.on("message", (message) => {
		socket.broadcast.emit("message", {
			body: message,
			from: socket.id.substring(0, 4),
		});
	});
});

module.exports = server;
