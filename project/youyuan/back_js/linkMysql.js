var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '10.20.5.88',
    port: '14062',
    user: 'root',
    password: 'usestudio-1',
    database:'UserStudio_Garden'
});

connection.connect();

module.exports = {
	query: function(){
		connection.query.apply(connection,arguments);
	},
	call: function(name, args, callback){
		connection.query('CALL ' + name + '('+ (args.length>0? ('"' + args.join('","') + '"'): '') + ')', callback);
	},
	end: function(){
		connection.end();
	}
};