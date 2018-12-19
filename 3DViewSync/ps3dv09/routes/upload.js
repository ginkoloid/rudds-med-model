var fs = require('fs');
exports.post = function(req, res){
	// 一時ファイルのパス
	var tmp_path = req.files.thumbnail.path;
	// public以下に置くパス
	var target_path = './public/models/' + 'share.js';
	// public以下に移動
	fs.rename(tmp_path, target_path, function(err) {
		if (err) throw err;
		// 一時ファイルを削除
		fs.unlink(tmp_path, function() {
			if (err) throw err;
			res.redirect('/');
			//res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
		});
	});
};
