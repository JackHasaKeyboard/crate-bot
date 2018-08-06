const SteamCommunity = require('steamcommunity');
const SteamTradeofferManager = require('steam-tradeoffer-manager');
const prompt = require('prompt');
const fetch = require('node-fetch');
const cred = require('./cred.js');

const community = new SteamCommunity;

const manager = new SteamTradeofferManager({
	'steam': community,
	'domain': 'jackhasakeyboard.com',
	'language': 'en'
});

manager.apiKey = cred.key;
var no = 1;


respond = function(cookies) {
	manager.on('newOffer', function(offer) {
		offer.accept(function(err, status) {
			if (err) {
				console.log(err);
			} else {
				console.log('Accepted offer: ' + status);
			}
		})
	});

	// manager.setCookies(cookies, null, function() {
	// 	function getId(vanity) {
	// 		return fetch('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=' + cred.key +'&vanityurl=' + vanity).then(function(response) {
	// 			return response.json();
	// 		}).then(function(json) {
	// 			if (json.response.success == 1) {
	// 				var id = json.response.steamid;

	// 				return id;
	// 			}
	// 		});
	// 	}

	// 	getId('jackthagamer').then(function(id) {
	// 		myId = manager.steamId;

	// 		community.getUserInventoryContents(id, 440, 2, true, function(err, inv) {
	// 			var offer = manager.createOffer(id);

	// 			inv.forEach(function(item) {
	// 				offer.addMyItem(item);
	// 			});

	// 			offer.send(function(err, status) {
	// 				if (err) {
	// 					console.log(err);
	// 				} else {
	// 					console.log(status);
	// 				}
	// 			});
	// 		});
	// 	});
	// });
}

community.login({
	'accountName': 'projectcratedropbox' + no,
	'password': cred.crate.password + 'Dropbox' + no
}, function(err, sessionID, cookies) {
	if (err) {
		console.log(err);

		switch(err.message) {
			case 'SteamGuard':
				prompt.get(['steamGuard'], function(err, i) {
					community.login({
						'accountName': 'projectcratedropbox' + no,
						'password': cred.crate.password + 'Dropbox' + no,
						'authCode': i.steamGuard
					}, function(err, sessionID, cookies) {
						if (err) {
							console.log(err);
						} else {
							console.log('Successfully logged in');

							respond(cookies);
						}
					});
				});

				break;

			case 'CAPTCHA':
				prompt.get(['captcha'], function(err, i) {
					community.login({
						'accountName': 'projectcratedropbox' + no,
						'password': cred.crate.password + 'Dropbox' + no,
						'captcha': i.captcha
					}, function(err, sessionID, cookies) {
						if (err) {
							console.log(err);
						} else {
							console.log('Successfully logged in');

							respond(cookies);
						}
					});
				});

				break;
		}
	}
});
