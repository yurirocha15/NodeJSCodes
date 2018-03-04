var mongoose = require('mongoose');
var cfg = require('../config.json');
var key = String(process.env.NODE_ENV).trim();
var url = cfg.MONGODB[key];
var single_connection;

module.exports = function()
{
	if(!single_connection)
	{
		mongoose.Promise = global.Promise;
		single_connection = mongoose.connect(process.env.MONGOLAB_URI || url);
	}
	return single_connection;
};