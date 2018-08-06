const SteamUser = require('steam-user'),
	fetch = require('node-fetch'),
	prompt = require('prompt'),
	_ = require('lodash'),
	storage = require('./storage.js'),
	cred = require('./cred.js')


module.exports = {
	initAcct: function(no, callback) {
		// log in, must be logged in as existing user
		var user = new SteamUser();

		user.logOn(cred.jack);

		user.on('loggedOn', function() {
			console.log('Successfully logged in');

			/* create */
			user.createAccount('projectcrate' + no, cred.crate.password + no, 'steamprojectcrate@gmail.com', function(result, steamid) {
				if (result == 1 /* ok */) {
					callback();
				} else {
					console.log('Failed to create account; error ' + result);
				}
			});
		});
	},

	chkStatus: function(no) {
		// resolve vanity URL into an ID, if missing then the user either needs to be created or needs to be updated
		var url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=' + cred.key + '&vanityurl=projectcrate' + no;

		return fetch(url).then(function(response) {
			return response.json();
		}).then(function(json) {
			if (json.response.success == 1 /* matched */) {
				return true;
			} else {
				return false;
			}
		});
	},

	updatePassword: function(no, current) {
		var user = new SteamUser();

		user.logOn({
			'accountName': 'projectcratedropbox1',
			'password': 'OrangeBananaPotatoOctopusDropbox1'
		});

		user.on('loggedOn', function() {
			console.log('Successfully logged in');

			user.on('emailInfo', function(addr, valid) {
				if (addr && valid) {
					console.log('Address: ' + addr);

					user.requestPasswordChangeEmail('OrangeBananaPotatoOctopusDropbox1', function(err) {
						if (err) {
							console.log(err);
						} else {
							console.log('Successfully sent e-mail');

							prompt.get(['dacode'], function(err, i) {
								user.changePassword(current, cred.crate.password + no, i.dacode, function(err) {
									if (err) {
										console.log(err);
									} else {
										console.log('Successfully updated password');
									}
								});
							});
						}
					});
				}
			});
		});
	},

	getId: function(vanity) {
		return fetch('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=' + cred.key +'&vanityurl=' + vanity).then(function(response) {
			return response.json();
		}).then(function(json) {
			if (json.response.success == 1) {
				var id = json.response.steamid;

				return id;
			}
		});
	},

	iter: function(callback) {
		prompt.get(['floor', 'roof'], function(err, i) {
			_.range(i.floor, i.roof).forEach(function(no, idx) {
				setTimeout(function() {
					callback();
				}, idx * 1000);
			});
		});
	}
}
