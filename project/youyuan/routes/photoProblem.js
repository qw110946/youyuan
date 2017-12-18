var linkMysql = require('../back_js/linkMysql')

module.exports = function (req, res) {
	res.header("Content-Type", "text/html;charset=utf-8");
	
	var openid = req.session.openid;
	var gameid = req.session.gameid;

	// session没有openid
	if(!openid || openid.length === 0) {
		toError(res)
		return;
	}

	if(!gameid) {
		res.redirect('/pro/youyuan/index');
		return;
	}
	
	linkMysql.call('fetchOneCompetition', [gameid], function(e, value){
		if(e || !value) { toError(res); return; }

		var result = value[0];

		if(!result || !result.length || result.length!==1)  { toError(res); return; }

		result = result[0];

		var problemid = result.problem_id;

		// 是否图片问题
		if(result.type != 2 || result.end == '2') {
			req.session.gameid = null;
			res.redirect('/pro/youyuan/index');
			return;
		}

		linkMysql.call('fetchOnePhotoProblem', [problemid], function(e, value){
			if(e || !value) { toError(res); return; }

			var result = value[0];

			if(!result || !result.length || result.length!==1)  { toError(res); return; }

			result = result[0];
			
			res.render('youyuan/html/photo_problem', { problems: JSON.stringify(result) }) 
		})
	})
}

function toError(res) {
	res.header("Content-Type", "text/html;charset=utf-8");
	res.render('youyuan/html/temp',{ html: '<h1>错误</h1><h2>请关闭页面，重新从公众号进入</h2>' })
}