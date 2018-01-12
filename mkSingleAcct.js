const SteamUser = require("steam-user");
const prompt = require("prompt");
const _ = require("lodash");
const cred = require("./cred.js");

var User = new SteamUser();


// log on, must be logged in as existing user
User.logOn(cred.jack);

User.on("loggedOn", function(details) {
	console.log("Successfully logged in");

	prompt.start();

	prompt.get(["no"], function(err, no) {
		/* create */
		User.createAccount("projectcrate" + no.no, cred.crate.password + no.no, "steamprojectcrate@gmail.com", function(result, steamid) {
			if (result == 1) { // ok
				console.log("Successfully created projectcrate" + no.no);

				process.exit();

				// edit details
				// User.logOn({userName: "projectcrate" + no, password: cred.crate.password + no});

				// User.setPersona(1, "Project Crate (" + no + ")");
			} else {
				console.log("Failed to create account; error " + result);
			}
		});
	});
});
