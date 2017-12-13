var routes = require('./routes')

module.exports = function(app, express) {
	var route = '/pro/youyuan/';

	// 静态文件路由 
	app.use(route + 'js', express.static('project/youyuan/js'));
	app.use(route + 'css', express.static('project/youyuan/css'));
	app.use(route + 'fontSize', express.static('project/youyuan/fontSize'));
	app.use(route + 'image', express.static('project/youyuan/image'));
	app.use(route + 'upload', express.static('project/youyuan/upload'));

	app.get(route + 'index', routes.home)

	// 判断进入哪个游戏
	app.get(route + 'gameGuide', routes.gameGuide)
	
	// 问题
	app.get(route + 'normalProblem', routes.normalProblem)
	app.get(route + 'photoProblem', routes.photoProblem)

	// 提交答案
	 app.get(route + 'submitAnswer', routes.submitAnswer)

	// 图片上传
	 app.post(route + 'uploadImg', routes.uploadImg)
	 
	// 得分
	// app.get(route + 'normalProblemScore', routes.score)
	// app.get(route + 'photoProblemGuide ', routes.Guide)
}
