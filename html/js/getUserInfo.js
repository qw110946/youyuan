var request = require('request');

export = function(appid, secret, redirectUri){
	return function (req, res) {
	  var param = req.query;

	  if(param.state == 'success') {
	  	getCode(appid, redirectUri);
	  	return;
	  }

		getOpenid(appid, secret, function(){})

	  res.send(param.type)
	  // res.send('Hello World!');
	}	
}

function getOpenid(appid, secret, callback) {
	var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
	var params = {
		appid: appid,
		secret: secret,
		code: 'CODE',
		grant_type: 'authorization_code',
	};

	url += joinParams(params)

	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	console.log(body)
	  	// callback
	  }
	})
}

function getCode(appid, redirectUri) {
	var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?';
	var params = {
		appid: appid,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: 'snsapi_base',
		state: 'success'
	};

	url += joinParams(params)
	//#wechat_redirect
	res.location(path)
}

function joinParams(params) {
	var str = '';
	for(var i in params)
		str += i + '=' + params[i] + '&';

	return str.slice(0, -1)
}