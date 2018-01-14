const SteamCommunity = require('steamcommunity');
const SteamUser = require('steam-user');
const prompt = require('prompt');
const cred = require('./cred.js');


exports.updateDetail = function(no, callback) {
	const community = new SteamCommunity;

	community.login({
		'accountName': 'projectcrate' + no,
		'password': cred.crate.password + no
	}, function(err, user) {
		if (err) {
			console.log(err);
		}

		community.joinGroup('103582791435442783' /* Project Crate */, function(err, result) {
			if (err) {
				console.log(err);
			}
		});

		community.loggedIn(function(err, loggedIn) {
			if (loggedIn) {
				community.editProfile({
					'name': 'Project Crate (' + no + ')',
					'summary': `
					Storage account #` + no + ` for Project Crate, a project put together to amass as many Crates as possible and break a world record.

					We'd love it if you'd donate some Crates! To make a donation, send the dude in charge (JackThaGamer) a trade and you'll be marked down for your donation.

					Dude in charge: http://steamcommunity.com/id/JackThaGamer/
					Steam Group: http://steamcommunity.com/groups/ProjectCrate

					The profile picture was sketched by Pobito: http://steamcommunity.com/id/Pobbimann
					And colored by Shiny: http://steamcommunity.com/profiles/76561198066874043
					`,
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

				community.uploadAvatar('crate.png', null, function(err, result) {
					if (err) {
						console.log(err);
					}
				});
			}
		});


		const User = new SteamUser;

		User.logOn({
			'accountName': 'projectcrate' + no,
			'password': cred.crate.password + no
		});

		User.on('loggedOn', function(details) {
			User.requestValidationEmail();

			callback();
		});
	});
}
