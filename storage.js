const SteamUser = require('steam-user'),
	SteamCommunity = require('steamcommunity'),
	SteamTradeOfferManager = require('steam-tradeoffer-manager'),
	prompt = require('prompt'),
	fetch = require('node-fetch'),
	general = require('./general.js'),
	cred = require('./cred.js'),
	_ = require('lodash')


module.exports = {
	updateDetail: function(no, current) {
		var community = new SteamCommunity;

		update = function() {
			community.profileSettings({
				'profile': 3,
				'comments': 1,
				'inventory': 3,
				'inventoryGifts': true,
				'gameDetails': 1,
				'playtime': true
			}, function(err) {
				if (err) {
					console.log(err);
				}
			});

			community.editProfile({
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

			var user = new SteamUser;

			user.logOn({
				'accountName': 'projectcrate' + no,
				'password': current
			});

			user.on('loggedOn', function() {
				// if (user.emailInfo.address != cred.crate.email) {
				user.changeEmail({
					'password': cred.crate.password + no,
					'email': cred.crate.email
				}, function(err) {
					if (err) {
						console.log(err);
					} else {
						prompt.get(['code'], function(err, i) {
							user.changeEmail({
								'password': cred.crate.password + no,
								'email': cred.crate.email,
								'code': i.code
							}, function(err) {
								if (err) {
									console.log(err);
								} else {
									console.log('Successfully updated e-mail');
								}
							});
						});
					}
				});
				// }
			});
		}

		community.login({
			'accountName': 'projectcrate' + no,
			'password': current
		}, function(err, user) {
			if (err) {
				console.log(err);

				switch(err.message) {
					case 'SteamGuard':
						prompt.get(['steamGuard'], function(err, i) {
							community.login({
								'accountName': 'projectcrate' + no,
								'password': current,
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
								'password': current,
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
	},

	mkAcct: function(no) {
		general.initAcct(no, function() {
			updateDetail(no, function() {
				console.log('Successfully created projectcrate' + no);
			});
		});
	},

	log: function(no) {
		const community = new SteamCommunity;

		general.getId('projectcrate' + no).then(function(id) {
			community.getUserInventoryContents(id, 440, 2, true, function(err, inv) {
				if (err) {
					console.log(err);
				} else {
					fs.readFile('status.json', function(err, data) {
						if (err) {
							console.log(err);
						} else {
							var obj = JSON.parse(data);

							var stock = {};

							inv.forEach(function(item) {
								if (!stock[item.name]) {
									stock[item.name] = 0;
								}

								stock[item.name]++;
							});

							if (!obj[no]) {
								obj[no] = {};
							}

							obj[no] = stock;

							fs.writeFile('status.json', JSON.stringify(obj, null, 2 /* format to be readable */), function(err) {
								if (err) {
									console.log(err);
								}
							});
						}
					});
				}
			});
		});
	},

	stock: function() {
		total = {};

		const community = new SteamCommunity;

		function getInv(no) {
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

						total[no] = stock;

						fs.writeFile('stock.json', JSON.stringify(total, null, 2 /* format to be readable */), function(err) {
							if (err) {
								console.log(err);
							}
						});
					}
				});
			});
		}

		for (var no = 1; no < 20; no++) {
			getInv(no);
		}


		var tally = {
			item: {}
		};
		fs.readFile('stock.json', 'utf-8', (err, dat) => {
			if (err) {
				console.log(err);
			} else {
				var obj = JSON.parse(dat);

				for (var acct in obj) {
					for (var item in obj[acct]) {
						if (!tally['item'][item]) {
							tally['item'][item] = 0;
						}

						tally['item'][item] += obj[acct][item];
					}

					tally['total'] = 0;

					for (var name in tally['item']) {
						tally['total'] += tally['item'][name];
					}

					fs.writeFile('tally.json', JSON.stringify(tally, null, 2 /* format to be readable */), function(err) {
						if (err) {
							console.log(err);
						}
					});
				}
			}
		});
	}
}
