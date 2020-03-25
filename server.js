//---------------------------------------------IMPORTS---------------------------------------------
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require("./utils/users");

//---------------------------------------------DEFINITIONS---------------------------------------------
const app = express(); //express web-app
const server = http.createServer(app); //creating server for the app
const io = socketio(server); //websocket for the server
const botName = "ChatBot";

app.use(express.static(path.join(__dirname, "public"))); // Set Static Folder

//---------------------------------------------SERVER FUNCTIONS---------------------------------------------
// Run when client connects to sockets
io.on("connection", socket => {
    //when room joined
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcomes the new user
        socket.emit(
            "message",
            formatMessage(
                botName,
                `Welcome to the ChatCord, ${user.username}! Room: ${room}`
            )
        );

        // Broadcasts to other members of a new user
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(botName, `${user.username} has entered the chat`)
            );

        // send room and users info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // chatMessage Listener (When users sends message)
    socket.on("chatMessage", msg => {
        //get user
        const user = getCurrentUser(socket.id);
        // console.log(msg);
        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // Runs when user disconnects from socket
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        // checks if actually any user has disconnected (sends message to the room)
        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessage(
                    botName,
                    `${user.username} has left the chat room`
                )
            );

            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

//Local server
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port:${PORT}`)); //show message in server console
