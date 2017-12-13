var request = require('request');
var url = require('url');
var domain = 'http://wxapi.1473.cn';

var callbackUrls = [
	['binduser','http://wxapi.1473.cn/MP_verify_McIcGTBFz35y0f9M.txt'],
	['youyuan','http://wxapi.1473.cn/pro/youyuan/index']
].map(function(v) {
	return { type: v[0], url: v[1] }	
})

module.exports = function(appid, secret){
	return function (req, res) {
		var params = req.query;
		var redirectUri = req.originalUrl;
		var callbackUrl = '';
		// console.log(params.state, params.code)
		
		// 等待微信回调
		if(params.state !== 'success') {
			getCode(res, appid, domain + redirectUri);
			return;
		}

		callbackUrl = callbackUrls.filter(function(v){
			return v.type === params.type;
		})
		// 是否存在回调页面类型
		if(callbackUrl.length === 0) {
			res.send('回调页面类型错误');
			return;
		}

		callbackUrl = callbackUrl[0].url;

		getOpenid(appid, secret, params.code, function(body) {
			var openid = JSON.parse(body).openid;
			var unionid = JSON.parse(body).unionid;
				res.send(openid);
		})
		// res.send('Hello World!');
	}	
}

function getOpenid(appid, secret, code, callback) {
	var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
	var params = {
		appid: appid,
		secret: secret,
		code: code,
		grant_type: 'authorization_code',
	};

	url += joinParams(params)

	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	 callback(body)
	  }
	})
}

function getCode(res, appid, redirectUri) {
	var url = 'https://open.weixin.qq.com/connect/qrconnect?';
	var params = {
		appid: appid,
		redirect_uri: encodeURIComponent(redirectUri),
		response_type: 'code',
		scope: 'snsapi_login',
		state: 'success'
	};

	url += joinParams(params)
	console.log(url)
	//#wechat_redirect
	res.redirect(url)
}

// 00000

function joinParams(params) {
	var str = '';
	for(var i in params)
		str += i + '=' + params[i] + '&';

	return str.slice(0, -1)
}