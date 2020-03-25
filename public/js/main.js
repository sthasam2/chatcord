/** FRONT_END */

// ----------------------------------------HTML IMPORTS----------------------------------------
const chatForm = document.getElementById("chat-form");
/**
 * Chat Bubble
 */
const chatMessages = document.querySelector(".chat-messages");

/**
 * Chat Room Name
 */
const roomName = document.getElementById("room-name");

/**
 * Chat User List
 */
const userList = document.getElementById("users");

// ----------------------------------------URL QUERYSET PARSER----------------------------------------
/**
 * Get username and room from url
 */
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

// ----------------------------------------SOCKET FUNCTONS----------------------------------------
const socket = io();

// Join Room
socket.emit("joinRoom", { username, room });

// Room Users
socket.on("roomUsers", ({ room, users }) => {
	outputRoomName(room);
	outputRoomUsers(users);
});

// message litener from server
socket.on("message", message => {
	// console.log(message);
	outputMessage(message);

	// scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", e => {
	e.preventDefault();

	// get message from chat form
	const msg = e.target.elements.msg.value;

	// emit message to server
	socket.emit("chatMessage", msg);

	//clear input
	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});

// -------------------------------------------USER FUNCTONS-------------------------------------------

/**
 * message output object template (chat buuble)
 */
function outputMessage(message) {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
		<p class="text">${message.text}</p>`;
	document.querySelector(".chat-messages").appendChild(div);
}

/**
 * Chat Room name template
 */
function outputRoomName(room) {
	roomName.innerText = room;
}

/**
 * Chat Room user list template
 */
function outputRoomUsers(users) {
	userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join("")}
    `;
}
