const chatForm = document.getElementById("chat-form");

const socket = io();

//message
socket.on("message", message => {
	console.log(message);
	outputMessage(message);
});

// Message submit
chatForm.addEventListener("submit", e => {
	e.preventDefault();

	// get message from chat form
	const msg = e.target.elements.msg.value;

	// emit message to server
	socket.emit("chatMessage", msg);
});

function outputMessage(message) {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML =
		`<p class="meta">Mary <span>9:15pm</span></p><p class="text">
		${message}
		</p>`;
	document.querySelector(".chat-messages").appendChild(div);
}
