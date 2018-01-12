const SteamUser = require('steam-user');
const prompt = require('prompt');
const cred = require('./cred.js');


// log in, must be logged in as existing user
const User = new SteamUser();

User.logOn(cred.jack);

User.on('loggedOn', function() {
	console.log('Successfully logged in');

	prompt.start();

	prompt.get('no', function(err, i) {
		/* create */
		User.createAccount('projectcrate' + i.no, cred.crate.password + i.no, 'steamprojectcrate@gmail.com', function(result, steamid) {
			if (result == 1) { // ok
				console.log('Successfully created projectcrate' + i.no);
			} else {
				console.log('Failed to create account; error ' + result);
			}
		});
	});
});
