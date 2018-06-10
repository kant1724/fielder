var mysql = require('./mysql');
module.exports = {
	get_board_list : function(board_num, callback) {
		conn = mysql.get_connection();
		var ret = [];
		var sql = '';
		if (board_num == '0') {
			sql = 'SELECT A.BOARD_NUM, (SELECT B.IMAGE_PATH FROM GALLERY B WHERE B.BOARD_NUM = A.BOARD_NUM ORDER BY RGSN_DATE ASC, RGSN_TIME ASC LIMIT 1) AS IMAGE_PATH, A.CONTENT, A.COMPLIMENT_CNT FROM BOARD A ORDER BY A.BOARD_NUM DESC LIMIT 10';
		} else if (board_num != '') {
			sql = 'SELECT A.BOARD_NUM, (SELECT B.IMAGE_PATH FROM GALLERY B WHERE B.BOARD_NUM = A.BOARD_NUM ORDER BY RGSN_DATE ASC, RGSN_TIME ASC LIMIT 1) AS IMAGE_PATH, A.CONTENT, A.COMPLIMENT_CNT FROM BOARD A WHERE A.BOARD_NUM < ' + board_num + ' ORDER BY A.BOARD_NUM DESC LIMIT 3';
		} else {
			sql = 'SELECT A.BOARD_NUM, (SELECT B.IMAGE_PATH FROM GALLERY B WHERE B.BOARD_NUM = A.BOARD_NUM ORDER BY RGSN_DATE ASC, RGSN_TIME ASC LIMIT 1) AS IMAGE_PATH, A.CONTENT, A.COMPLIMENT_CNT FROM BOARD A ORDER BY A.BOARD_NUM DESC LIMIT 3';
		}
		conn.query(sql, function(err,result) {
			for (var i = 0; i < result.length; ++i) {
				ret.push(result[i]);				
			}
			callback(ret);
		});
	},
	get_gallery_list : function(board_num, callback) {
		conn = mysql.get_connection();
		var ret = [];		
		var sql = 'SELECT A.BOARD_NUM, A.IMAGE_PATH, A.RGSN_DATE, A.RGSN_TIME, A.CONTENT FROM GALLERY A WHERE A.BOARD_NUM = ' + board_num + ' ORDER BY A.RGSN_DATE DESC, A.RGSN_TIME DESC LIMIT 20';		
		conn.query(sql, function(err,result) {
			for (var i = 0; i < result.length; ++i) {
				ret.push(result[i]);				
			}
			callback(ret);
		});
	},	
	get_reply_list : function(board_num, callback) {
		conn = mysql.get_connection();
		var ret = [];
		conn.query('SELECT * FROM REPLY_LIST WHERE BOARD_NUM = ' + board_num + ' ORDER BY REPLY_NUM DESC', function(err, result) {
			for (var i = 0; i < result.length; ++i) {
				ret.push(result[i]);				
			}
			callback(ret);
		});
	},
	login : function(user_id, password, callback) {
		conn = mysql.get_connection();
		var ret = [];
		conn.query("SELECT USER_ID FROM USER_INFO WHERE USER_ID = '" + user_id + "' AND PASSWORD = '" + password + "'", function(err, result) {
			for (var i = 0; i < result.length; ++i) {
				ret.push(result[i]);				
			}
			callback(ret);
		});
	}
}
