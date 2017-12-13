
module.exports = function (req, res) {
	res.header("Content-Type", "text/html;charset=utf-8");

	var params = req.query;
	var openid = params.openid;

	// 微信没有传入openid
	// if(!openid || openid.length === 0) {
	// 	res.render('youyuan/html/temp',{ html: '<h2>请关闭页面，重新从公众号进入</h2>' })
	// 	return;
	// }

	// 用户session有id并且进行了游戏
	if(req.session.openid) {
		if(req.session.gameid) { 
			res.redirect('/pro/youyuan/gameGuide'); 
			return;
		}
	}else{
		req.session.openid = openid;
	}

	res.render('youyuan/html/index')
}