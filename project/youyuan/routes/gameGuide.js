var linkMysql = require('../back_js/linkMysql')

module.exports = function (req, res) {
	var openid = req.session.openid;
	var gameid = req.session.gameid;// '206a99f3-df07-11e7-81ee-005056b350a4'

	// session没有openid
	if(!openid || openid.length === 0) {
		toError(res)
		return;
	}
	
	// 是否已经开始游戏
	if(gameid){
		console.log(gameid,'err1')
		alreadyGameStart(req, res, gameid)
		return;
	}

	// 随机开始游戏
	return randomGameStart(req, res, openid)
}

function toError(res, i) {
	res.header("Content-Type", "text/html;charset=utf-8");
	res.render('youyuan/html/temp',{ html: '<h1>错误</h1><h2>请关闭页面，重新从公众号进入</h2>'+i })
}

// 已经开始游戏
function alreadyGameStart(req, res, gameid) {

	// 查找这个游戏的类型
	linkMysql.call('fetchOneCompetition', [gameid], function(e, value){
		if(e || !value) {  // 查找不到gameid就清除session.gameid
			req.session.gameid = null; 
			toError(res, 1);
			return; 
		}

		var result = value[0];

		if(!result || !result.length || result.length!==1)  { // 报错也清除session.gameid
			req.session.gameid = null; 
			toError(res, 2); return; 
		}

		result = result[0];

		// 游戏已结束 
		if(result.end == '2'){
			req.session.gameid = null; 
			toError(res, 2); return; 
		}

		if(result.type === '1') {
			res.redirect('/pro/youyuan/normalProblem');
		}else if(result.type === '2') {
			res.redirect('/pro/youyuan/photoProblem');
		}else{
			 toError(res, 3);
		}
	})
}

// 随机开始游戏
function randomGameStart(req, res, openid) {

	if(Math.random() > 0.5) {
		console.log('err2')
		normalProblemGame(req, res, openid)
	} else {
		console.log('err3')
		photoProblemGame(req, res, openid)
	}
}

// 普通游戏
function normalProblemGame(req, res, openid) {

	// 新建游戏
	linkMysql.call('newOneCompetition', ['openid', '', '1', '0'], function(e, value){
		if(e || !value) { toError(res, 4); return; }

		var result = value[0];

		if(!result || !result.length || result.length!==1) { toError(res, 5); return; }
		
		result = result[0];

		req.session.gameid = result.uuid;

		res.redirect('/pro/youyuan/normalProblem');
	})
}

// 图片游戏
function photoProblemGame(req, res, openid) {

	// 获取一个图片问题
	linkMysql.call('GetOnePhotoProblem', [], function(e, value){
		if(e || !value) { toError(res, 6); return; }
		
		var result = value[0];

		if(!result || !result.length || result.length!==1) { toError(res, 7); return; }

		var result = result[0];

		var problemid = result.id;

		// 新建游戏
		linkMysql.call('newOneCompetition', [openid, problemid, '2', '0'], function(e, value){
			if(e || !value) { toError(res, 8); return; }

			var result = value[0];

			if(!result || !result.length || result.length!==1) { toError(res, 9); return; }
			
			result = result[0];

			req.session.gameid = result.uuid;

			res.redirect('/pro/youyuan/photoProblem');
		})
	})
}