var result = {};
module.exports = function(status, data) {
	result.status = status;
	result.data = data;
	return result;
};