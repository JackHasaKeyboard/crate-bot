const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');
const prompt = require('prompt');
const fetch = require('node-fetch');
const general = require('./general.js');
const cred = require('./cred.js');


updateDetail = function(no) {
	var community = new SteamCommunity;

	update = async function() {
		await community.editProfile({
			'name': 'Project Crate (' + no + ')',
			'customURL': 'projectcrate' + no,

			// null settings
			'realName': '',
			'country': '',
			'state': '',
			'city': '',
			'background': '',
			'featuredBadge': '',
			'primaryGroup': '103582791435442783' // Project Crate
		}, function(err) {
			if (err) {
				console.log(err);
			}
		});

		general.getId('projectcrate' + no).then(function(id) {
			community.getUserInventoryContents(id, 440, 2, true, function(err, inv) {
				if (err) {
					console.log(err);
				} else {
					var stock = {};

					inv.forEach(function(item) {
						if (!stock[item.name]) {
							stock[item.name] = 0;
						}

						stock[item.name]++;
					});

					community.editProfile({
						'summary': `
						Storage account #` + no + ` for Project Crate, a project put together to amass as many Crates as possible and break a world record.

						We'd love it if you'd donate some Crates! To make a donation, send the dude in charge (JackThaGamer) a trade and you'll be marked down for your donation.

						Dude in charge: http://steamcommunity.com/id/JackThaGamer/
						Steam Group: http://steamcommunity.com/groups/ProjectCrate

						The profile picture was sketched by Pobito: http://steamcommunity.com/id/Pobbimann
						And colored by Shiny: http://steamcommunity.com/profiles/76561198066874043

						=== Bot info ===
						` + JSON.stringify(stock, null, '\t') + `
						`,
					}, function(err) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		});

		community.profileSettings({
			'profile': 'Public',
			'comments': 1, // private
			'inventory': 'Public',
			'inventoryGifts': true // public
		}, function(err) {
			if (err) {
				console.log(err);
			}
		});

		community.joinGroup('103582791435442783' /* Project Crate */, function(err, result) {
			if (err) {
				console.log(err);
			}
		});

		community.uploadAvatar('crate.png', null, function(err, result) {
			if (err) {
				console.log(err);
			}
		});
	}

	community.login({
		'accountName': 'projectcrate' + no,
		'password': cred.crate.password + no
	}, function(err, user) {
		if (err) {
			console.log(err);

			switch(err.message) {
				case 'SteamGuard':
					prompt.get(['steamGuard'], function(err, i) {
						community.login({
							'accountName': 'projectcrate' + no,
							'password': cred.crate.password + no,
							'authCode': i.steamGuard
						}, function(err, user) {
							if (err) {
								console.log(err);
							} else {
								console.log('Successfully logged in');

								update();
							}
						});
					});

					break;

				case 'CAPTCHA':
					prompt.get(['captcha'], function(err, i) {
						community.login({
							'accountName': 'projectcrate' + no,
							'password': cred.crate.password + no,
							'captcha': i.captcha
						}, function(err, user) {
							if (err) {
								console.log(err);
							} else {
								console.log('Successfully logged in');

								update();
							}
						});
					});

					break;
			}
		}

		community.loggedIn(function(err, loggedIn) {
			if (loggedIn) {
				update();
			}
		});
	});
}

mkAcct = function(no) {
	general.initAcct(no, function() {
		updateDetail(no, function() {
			console.log('Successfully created projectcrate' + no);
		});
	});
}


module.exports = {
	updateDetail,
	mkAcct
}
