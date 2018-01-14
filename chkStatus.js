const fetch = require('node-fetch');
const cred = require('./cred.js');


// resolve vanity URL into an ID, if missing then the user either needs to be created or needs to be updated
exports.chkStatus = function(no) {
	var url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=' + cred.key + '&vanityurl=projectcrate' + no;

	return fetch(url).then(function(response) {
		return response.json();
	}).then(function(json) {
		if (json.response.success == 1) {
			return true;
		} else {
			return false;
		}
	});
}
