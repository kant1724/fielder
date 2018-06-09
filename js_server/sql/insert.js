var mysql = require('./mysql');
module.exports = {
	insert_board_list : function(callback) {		
		conn = mysql.get_connection(); 
		var sql = "SELECT MAX(BOARD_NUM) + 1 AS BOARD_NUM FROM BOARD";		
		conn.query(sql, function(err, result) {
			var board_num = 1;
			if (result[0]['BOARD_NUM'] != null) {
				board_num = result[0]['BOARD_NUM'];
			}
			sql = "INSERT INTO BOARD VALUES (" + board_num + ", CAST(DATE_FORMAT(NOW(), '%Y%m%d') AS CHAR), CAST(DATE_FORMAT(NOW(), '%H%i%s') AS CHAR), 'SSB', '', '0', '')";
			conn.query(sql, function(err, result) {					
				callback(board_num);
			});
		});
	},
	insert_gallery_list : function(new_path, callback) {		
		conn = mysql.get_connection(); 		
		sql = "INSERT INTO GALLERY VALUES (0, CAST(DATE_FORMAT(NOW(), '%Y%m%d') AS CHAR), CAST(DATE_FORMAT(NOW(), '%H%i%s') AS CHAR), 'SSB', '" + new_path + "', '')";
		conn.query(sql, function(err, result) {					
			callback(new_path);			
		});		
	},
	update_gallery_info : function(image_path, board_num, content, callback) {		
		if (board_num == "-1") {
			conn = mysql.get_connection(); 
			var sql = "SELECT MAX(BOARD_NUM) + 1 AS BOARD_NUM FROM BOARD";		
			conn.query(sql, function(err, result) {
				var board_num = 1;
				if (result[0]['BOARD_NUM'] != null) {
					board_num = result[0]['BOARD_NUM'];
				}
				sql = "INSERT INTO BOARD VALUES (" + board_num + ", CAST(DATE_FORMAT(NOW(), '%Y%m%d') AS CHAR), CAST(DATE_FORMAT(NOW(), '%H%i%s') AS CHAR), 'SSB', '', '0', '')";
				conn.query(sql, function(err, result) {					
					conn = mysql.get_connection(); 
					sql = "UPDATE GALLERY SET BOARD_NUM = " + board_num + ", CONTENT = '" + content + "' WHERE IMAGE_PATH = '" + image_path + "'";
					conn.query(sql, function(err, result) {					
						callback(board_num);			
					});
				});
			});
		} else {
			conn = mysql.get_connection(); 
			sql = "UPDATE GALLERY SET BOARD_NUM = " + board_num + ", CONTENT = '" + content + "' WHERE IMAGE_PATH = '" + image_path + "'";
			conn.query(sql, function(err, result) {					
				callback(board_num);			
			});
		}
	},
	update_content : function(board_num, content, callback) {		
		conn = mysql.get_connection(); 
		sql = "UPDATE BOARD SET CONTENT = '" + content + "' WHERE BOARD_NUM = " + board_num;
		conn.query(sql, function(err, result) {					
			callback('');			
		});		
	},
	add_reply : function(board_num, message, rgsn_user, callback) {
		conn = mysql.get_connection();
		var sql = "SELECT MAX(REPLY_NUM) + 1 AS REPLY_NUM FROM REPLY_LIST WHERE BOARD_NUM = " + board_num;
		conn.query(sql, function(err, result) {
			var reply_num = 1;
			if (result[0]['REPLY_NUM'] != null) {
				reply_num  = result[0]['REPLY_NUM'];
			}
			sql = "INSERT INTO REPLY_LIST VALUES (" + board_num + ", " + reply_num + ", '" + message + "', CAST(DATE_FORMAT(NOW(), '%H%i%s') AS CHAR), '" + rgsn_user + "')";
			conn.query(sql, function(err, result) {
				callback('');
			});
		});
	},
	add_compliment : function(board_num, callback) {
		sql = "UPDATE BOARD SET COMPLIMENT_CNT = COMPLIMENT_CNT + 1 WHERE BOARD_NUM = " + board_num;
		conn.query(sql, function(err, result) {
			callback(board_num);
		});
	}
}
