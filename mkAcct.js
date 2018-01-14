const initAcct = require('./initAcct');
const updateDetail = require('./updateDetail');


exports.mkAcct = function() {
	initAcct.initAcct(function() {
		updateDetail.updateDetail(function() {
			console.log('Successfully created projectcrate' + i.no);
		});
	});
}
