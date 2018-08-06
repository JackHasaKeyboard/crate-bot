const _ = require('lodash');
const prompt = require('prompt');
const fs = require('fs');
const general = require('./general.js');
const storage = require('./storage.js');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// mass updateDetail
prompt.get(['floor', 'roof'], function(err, i) {
	_.range(i.floor, i.roof).forEach(async function(no, idx) {
		await sleep(idx * 1000)

		await storage.updateDetail(no, function() {
			console.log('Updated projectcrate' + no);
		});
	});
});

// mass chkstatus + updatedetail
// prompt.get(['floor', 'roof'], function(err, i) {
// _.range(3050, 3070).forEach(function(no, idx) {
// 	setTimeout(function() {
// 		storage.updateDetail(3000, function() {
// 			console.log("Updated projectcrate" + 3000);
// 		});
// 	}, idx * 3000);
// });
// });

// mass chkStatus
// prompt.get(['floor', 'roof'], function(err, i) {
// 	fs.readFile('status.json', function(err, data) {
// 		if (err) {
// 			console.log(err);
// 		}

// 		var status = JSON.parse(data);

// 		_.range(i.floor, i.roof).forEach(function(no, idx) {
// 			setTimeout(function() {
// 				general.chkStatus(no).then(function(existence) {
// 					status[no] = existence;

// 					fs.writeFile('status.json', JSON.stringify(status, null, 2 /* format to be readable */), function(err) {
// 						if (err) {
// 							console.log(err);
// 						}
// 					});
// 				});
// 			}, idx * 1000);
// 		});
// 	});
// });

// // mass mkAcct
// prompt.get(['floor', 'roof'], function(err, i) {
// 	_.range(i.floor, i.roof).forEach(function(no, idx) {
// 		setTimeout(function() {
// 			storage.mkAcct(no, function() {
// 				console.log("Succesfully created projectcrate" + no);
// 			});
// 		}, idx * 1000);
// 	});
// });

// // mass updatePassword
// prompt.get(['floor', 'roof'], function(err, i) {
// 	_.range(i.floor, i.roof).forEach(function(no, idx) {
// 		setTimeout(function() {
// 			prompt.get(['current'], function(err, i) {
// 				general.updatePassword(no, current);
// 			});
// 		}, idx * 1000);
// 	});
// });

// prompt.get(['floor', 'roof'], function(err, i) {
// 	_.range(i.floor, i.roof).forEach(async function(no, idx) {
// 		await prompt.get(['current'], async function(err, i) {
// 			await general.updatePassword(no, i.current);
// 		});
// 	});
// });
