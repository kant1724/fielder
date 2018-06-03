var fs = require('fs-extra');

module.exports = {
	get_gallery : function() {
		var dir = './registered_image'
		var results = [];
	    var list = fs.readdirSync(dir);
	    list.forEach(function(file) {
	        file = dir + '/' + file;
	        var stat = fs.statSync(file);
	        if (stat && stat.isDirectory()) { 
	            results = results.concat(walk(file));
	        } else { 
	            results.push(file);
	        }
	    });
	    return results;
	},
	register_image : function(path, callback) {
		require('./sql/insert').insert_gallery_list(path, callback);
	}
}
