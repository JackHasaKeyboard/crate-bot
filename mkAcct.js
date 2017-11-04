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

	prompt.get(["floor", "roof"], function(err, bound) {
		var range = _.range(bound.floor, bound.roof);

		/* create */
		range.forEach(function(no, i) {
			// API limits to something like 10 per 10s and/or 200 per 5m
			setTimeout(function() {
				User.createAccount("projectcrate" + no, cred.crate.password + no, "steamprojectcrate@gmail.com", function(result, steamid) {
					if (result == 1) { // ok
						console.log("Successfully created projectcrate" + no);

						// edit details
						// User.logOn({userName: "projectcrate" + no, password: cred.crate.password + no});

						// User.setPersona(1, "Project Crate (" + no + ")");
					} else {
						console.log("Failed to create account; error " + result);
					}
				});
			}, 5000 * i); // setTimeout is asynchronous, time has to be specified absolutely
		});
	});
});
