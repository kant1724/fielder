module.exports = {	
	get_connection : function() {
		var mysql = require('mysql');
		var conn = mysql.createConnection({
		  host     : '14.63.168.58',
		  user     : 'club_ibk',
		  password : 'club_ibk',
		  port     : '3306',
		  database : 'club_ibk'
		});
		return conn;
	}
}
