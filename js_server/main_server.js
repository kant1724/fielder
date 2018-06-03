var fs = require('fs-extra');

module.exports = {	
	select_board_list : function(board_num, callback) {
		return require('./sql/select').get_board_list(board_num, callback);
	},
	select_gallery_list : function(board_num, callback) {
		return require('./sql/select').get_gallery_list(board_num, callback);
	},
	get_reply_list : function(board_num, callback) {
		return require('./sql/select').get_reply_list(board_num, callback);
	},
	update_gallery_info : function(image_path, board_num, content, callback) {
		require('./sql/insert').update_gallery_info(image_path, board_num, content, callback);
	},
	update_content : function(board_num, content, callback) {
		require('./sql/insert').update_content(board_num, content, callback);
	},
	add_reply : function(board_num, message, rgsn_user, callback) {
		require('./sql/insert').add_reply(board_num, message, rgsn_user, callback);
	},
	register_board : function(callback) {
		require('./sql/insert').insert_board(board_num, message, rgsn_user, callback);
	}
}
