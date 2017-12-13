var linkMysql = require('../back_js/linkMysql')

module.exports = function (req, res) {
	res.header("Content-Type", "text/html;charset=utf-8");

	var params = req.query;
	var openid = req.session.openid;
	var gameid = req.session.gameid;// '206a99f3-df07-11e7-81ee-005056b350a4'
	var correct_num = params.correct_num;
	var anwers = params.anwers;

	// session没有openid
	if(!openid || openid.length === 0) {
		toError(res,1)
		return;
	}

	if(!gameid) {
		res.redirect('/pro/youyuan/index');
		return;
	}

	// 查找这个游戏的类型
	linkMysql.call('fetchOneCompetition', [gameid], function(e, value){
		if(e || !value) { toError(res,2); return; }

		var result = value[0];

		if(!result || !result.length || result.length!==1)  { toError(res,3); return; }

		result = result[0];

		if(result.type === '1') {
			if(correct_num){
				submitCorrect_num(req, res, gameid, correct_num)
			}else{
			 toError(res,4);
			}
		}else if(result.type === '2') {
			if(anwers){
				submitAnwers(req, res, gameid, anwers)
			}else{
			 toError(res,5);
			}
		}else{
			 toError(res,6);
		}
	})

}

function toError(res, index) {
	res.header("Content-Type", "text/html;charset=utf-8");
	res.render('youyuan/html/temp',{ html: '<h1>错误</h1><h2>请关闭页面，重新从公众号进入</h2>'+index||'' })
}

function submitCorrect_num(req, res, gameid, correct_num) {
	linkMysql.call('modifyComCorrectNum', [gameid, correct_num], function(e, value){
		console.log(value)
		if(e || !value || value.affectedRows !== 1) { toError(res,7); return; }
		req.session.gameid = null;
		res.render('youyuan/html/problem_success')
	});
}

function submitAnwers(req, res, gameid, anwers) {
	linkMysql.call('modifyComAnwers', [gameid, anwers], function(e, value){
		if(e || !value || value.affectedRows !== 1) { toError(res,8); return; }
		req.session.gameid = null;
		res.render('youyuan/html/problem_success')
	});
}