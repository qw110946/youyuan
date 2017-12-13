var formidable = require('formidable'),
fs = require('fs'),
path = require('path'),
TITLE = 'formidable上传示例',
uploadPath = '../upload/',
domainPath = "http://wxapi.1473.cn/pro/youyuan/upload/";

/* 图片上传路由 */
module.exports = function(req, res) {

  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.uploadDir = path.join(__dirname, uploadPath);     //设置上传目录
  form.keepExtensions = false;     //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小 2m

  form.parse(req, function(err, fields, files) {

    if (err) {
      res.json({error: true});
      return;
    }

    var extName = '';  //后缀名
    switch (files.file.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;
    }

    if(extName.length == 0){
      //只支持png和jpg格式图片
      res.json({error: '只支持png和jpg格式图片'});
      return;
    }

    // 随机文件名
    var avatarName = (Math.random() + '' + +new Date).replace(/0\./, '') + '.' + extName;
    //图片写入地址；
    var newPath = path.join(__dirname, uploadPath + avatarName);
    console.log(newPath)
    //显示地址；
    var showUrl = domainPath + avatarName;
    console.log("newPath",newPath);
    fs.renameSync(files.file.path, newPath);  //重命名
    res.json({
      "url": showUrl
    });
  });
}
