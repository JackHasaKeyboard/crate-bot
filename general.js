const SteamUser = require('steam-user');
const fetch = require('node-fetch');
const cred = require('./cred.js');

initAcct = function(no, callback) {
	// log in, must be logged in as existing user
	var User = new SteamUser();

	User.logOn(cred.jack);

	User.on('loggedOn', function() {
		console.log('Successfully logged in');

		/* create */
		User.createAccount('projectcrate' + no, cred.crate.password + no, 'steamprojectcrate@gmail.com', function(result, steamid) {
			if (result == 1) { // ok
				callback();
			} else {
				console.log('Failed to create account; error ' + result);
			}
		});
	});
}

chkStatus = function(no, callback) {
	// resolve vanity URL into an ID, if missing then the user either needs to be created or needs to be updated
	var url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=' + cred.key + '&vanityurl=projectcrate' + no;

	return fetch(url).then(function(response) {
		return response.json();
	}).then(function(json) {
		if (json.response.success == 1) {
			return true;
		} else {
			return false;
		}

		callback();
	});
}

module.exports = {
	initAcct,
	chkStatus
}
