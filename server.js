const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", socket => {
	// Welcomes the new user
	socket.emit("message", "Welcome to the chat-app");

	// Broadcasts to other members of a new user
	socket.broadcast.emit("message", "A new user has entered the chat");

	// Runs when user disconnects
	socket.on("disconnect", () => {
		io.emit("message", "A user has left the chat room");
	});

	// chatMessage Listener
	socket.on("chatMessage", msg => {
		console.log(msg);
		io.emit("message", msg);
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
