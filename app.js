"use strict";

require("colors");

var net = require("net");
var Client = require("./ChatClient");

var log = console.log;

var config = require("./config");

var clients = {};

var userPattern = new RegExp(config.username_pattern);

function isValidUsername(username) {
	return !(username.length > 3 && username.length < 21 && userPattern.test(username));
}

function broadcastMessage(sender, message) {
	Object.keys(clients).forEach(function(username) {
		if (sender.username !== username) {
			clients[username].message(sender, message);
		}	
	});
}

function broadcastInfo(message) {
	Object.keys(clients).forEach(function(client) {
		clients[client].infoMessage(message);
	});
}

var server = net.createServer(function(con) {
	var client = new Client(con);

	client.welcome(config.name, Object.keys(clients).length);

	con.on("data", function(text) {
		text = text.trim();

		if (client.username === undefined) {
			if (!isValidUsername(text)) {
				client.badUsername();
			} else if (clients.hasOwnProperty(text)) {
				client.takenUsername();
			} else {
				client.username = text;
				clients[text] = client;
				log("new user connected: ".green + client.prettyId());
				broadcastInfo(client.prettyId() + " connected".green);
			}	
		} else {
			broadcastMessage(client, text);
		}
	});
	
	con.on("close", function() {
		log(client.prettyId() + " disconnected".red);
		broadcastInfo(client.prettyId() + " disconnected".red);
		delete clients[username];
	});

});

server.listen(config.port, function() {
	log("server started on port ".yellow + config.port);
});
