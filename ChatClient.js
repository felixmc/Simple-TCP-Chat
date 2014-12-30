"use strict";

function ChatClient(socket) {
	socket.setEncoding("utf8");

	this.socket   = socket;
	this.username = undefined;
}

ChatClient.prototype.welcome = function(title, clients) {
	this.socket.write(
			"\n > Welcome to " + title.cyan
		+ "\n > There are " + (clients + " ").magenta + "users connected"
		+ "\n > Choose a username: ".yellow
	);
};

ChatClient.prototype.id = function() {
	return this.username + "@" + this.socket.remoteAddress;
}

ChatClient.prototype.prettyId = function() {
	return this.username.cyan + "@" + this.socket.remoteAddress.yellow;
}

ChatClient.prototype.badUsername = function() {
	this.socket.write("\n > That's no goood. Try another username: ".red);
}

ChatClient.prototype.takenUsername = function() {
	this.socket.write("\n > That's taken. Try another username: ".red);
}

ChatClient.prototype.message = function(sender, text) {
	this.socket.write("\n " + sender.prettyId() + " > ".yellow + text + "\n ");
};

ChatClient.prototype.infoMessage = function(text) {
	this.socket.write("\n > " + text + "\n ");
}

module.exports = ChatClient;
