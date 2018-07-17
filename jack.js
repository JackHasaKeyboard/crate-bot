const fs = require('fs'),
	SteamCommunity = require('steamcommunity'),
	general = require('./general.js')

general.getId('jackthagamer').then(function(id) {
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

				fs.appendFile('stock.json', content, 'utf8', function(err) {
					if (err) {
						console.log(err);
					}
				}); 
			}
		}
	});
});
