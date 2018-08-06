const fs = require('fs'),
	prompt = require('prompt'),
	SteamCommunity = require('steamcommunity'),
	general = require('./general.js'),
	cred = require('./cred.js'),
	fetch = require('node-fetch')


module.exports = {
	stock: function() {
		function getId(vanity) {
			return fetch('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=' + cred.key +'&vanityurl=' + vanity).then(function(response) {
				return response.json();
			}).then(function(json) {
				if (json.response.success == 1) {
					var id = json.response.steamid;

					return id;
				}
			});
		}

		getId('jackthagamer').then(function(id) {
			const community = new SteamCommunity;

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

					var arr = [];
					for (var name in stock) {
						arr.push([name, stock[name]]);
					}

					arr.sort(function(a, b) {
						return b[1] - a[1];
					});


					for (var name in arr) {
						const content = arr[name][0] + ': ' + arr[name][1] + '\n';

						fs.appendFile('jack-stock.json', content, 'utf8', function(err) {
							if (err) {
								console.log(err);
							}
						});
					}
				}
			});
		});
	},

	hist: function() {
		const community = new SteamCommunity;

		community.login({
			'accountName': cred.jack['accountName'],
			'password': cred.jack['password']
		}, function() {
			prompt.get(['code'], function(err, i) {
				community.login({
					'accountName': cred.jack['accountName'],
					'password': cred.jack['password'],
					'twoFactorCode': i.code
				}, function(err) {
					if (err) {
						console.log(err)
					}

					community.loggedIn(function(err, loggedIn) {
						if (loggedIn) {
							community.getInventoryHistory({
								'direction': 'future',
								'startTrade': 'ruture',
								'startTime': 1367712000
							}, function(err, history) {
								if (err) {
									console.log(err);
								} else {
									history.trades.forEach(function(trade) {
										console.log('Heres one: ' + trade.date);

										if (trade.itemsGiven == []) {
											// console.log('Heres one: ' + trade.date);

											// for (item in trade.itemsReceived) {
											// 	console.log(item.name);
											// }

											// const content = arr[trade][0] + ': ' + arr[trade][1] + '\n';

											// fs.appendFile('free.json', content, 'utf8', function(err) {
											// 	if (err) {
											// 		console.log(err);
											// 	}
											// });
										}
									});
								}
							});
						}
					});
				});
			});
		});
	}
}
