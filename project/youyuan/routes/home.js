var linkMysql = require('../back_js/linkMysql')
var request = require('request')

module.exports = function (req, res) {
	res.header("Content-Type", "text/html;charset=utf-8");

	var params = req.query;
	var openid = params.openid;
	var access_token = params.access_token;
	// 用户session有id并且进行了游戏
	if(req.session.openid) {
		if(req.session.gameid) { 
			res.redirect('/pro/youyuan/gameGuide'); 
			return;
		}
		res.render('youyuan/html/index')
	}else{
		// 微信没有传入openid
		if(!openid || openid.length === 0 || !access_token || access_token.length === 0) {
			res.render('youyuan/html/temp',{ html: '<h2>请关闭页面，重新从公众号进入</h2>' })
			return;
		}

		req.session.openid = openid;

		// 获取用户信息
		getUserInfo(res, openid, access_token, function(body) {
			var info = JSON.parse(body);

			if(!info && !info.nickname){
				res.send('<h1>用户信息获取失败</h1>')
			}

			linkMysql.call('newWxUser', [openid, JSON.stringify(info)], function(e, value) {
				if(e && !/^Duplicate entry.+PRIMARY/.test(e.sqlMessage)) {
					res.send('<h1>系统错误</h1>')
					return;
				}
				if(value && value.affectedRows != 1) {
					res.send('<h1>系统错误</h1>')
					return;
				}
				res.render('youyuan/html/index')
			})
		})
	}
}

function getUserInfo(res, openid, access_token, callback) {
	var url = 'https://api.weixin.qq.com/sns/userinfo?';
	var params = {
		access_token: access_token,
		openid: openid,
		lang: 'zh_CN',
	};

	url += joinParams(params)

	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	 callback(body)
	  }
	})	
}

function joinParams(params) {
	var str = '';
	for(var i in params)
		str += i + '=' + params[i] + '&';

	return str.slice(0, -1)
}