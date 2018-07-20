const $ = require('jquery'),
	SteamUser = require('steam-user'),
	SteamCommunity = require('steamcommunity'),
	SteamTradeOfferManager = require('steam-tradeoffer-manager'),
	prompt = require('prompt'),
	fetch = require('node-fetch'),
	general = require('./general.js'),
	cred = require('./cred.js')


module.exports = {
	updateDetail: function(no, password) {
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

			var user = new SteamUser;

			user.logOn({
				'accountName': 'projectcrate' + no,
				'password': password
			});

			user.on('loggedOn', function() {
				user.changeEmail({
					'password': password,
					'email': cred.crate.email
				}, function(err) {
					if (err) {
						console.log(err);
					} else {
						prompt.get(['code'], function(err, i) {
							user.changeEmail({
								'password': password,
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
			});
		}

		community.login({
			'accountName': 'projectcrate' + no,
			'password': password
		}, function(err, user) {
			if (err) {
				console.log(err);

				switch(err.message) {
					case 'SteamGuard':
						prompt.get(['steamGuard'], function(err, i) {
							community.login({
								'accountName': 'projectcrate' + no,
								'password': password,
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
								'password': password,
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
		const community = new SteamCommunity;

		getId = function(vanity) {
			return fetch('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=' + cred.key +'&vanityurl=' + vanity).then(function(response) {
				return response.json();
			}).then(function(json) {
				if (json.response.success == 1) {
					var id = json.response.steamid;

					return id;
				}
			});
		}

		var total = [];
		for (var no = 1; no < 4; no++) {
			getId('projectcrate' + no).then(function(id) {
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

						total.push(stock);
					}

					fs.writeFile('stock.json', JSON.stringify(total, null, 2 /* format to be readable */), function(err) {
						if (err) {
							console.log(err);
						}
					});
				});
			});
		}

		var tally = {
			item: {}
		};
		fs.readFile('stock.json', 'utf-8', (err, dat) => {
			if (err) {
				console.log(err);
			} else {
				var obj = JSON.parse(dat);

				obj.forEach(function(items) {
					for (var item in items) {
						if (!tally['item'][item]) {
							tally['item'][item] = 0;
						}

						tally['item'][item] += items[item];
					}
				});

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
		});
	}
}
