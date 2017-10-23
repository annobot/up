var fs = require('fs');
var multer = require('multer');
var path =require('path');
var express= require('express');
var bodyParser = require('body-parser');
var dir = require('node-dir');
var walk    = require('walk');
var bb = require('busboy');
//var upload = require('express-fileupload');
var files   = [];
var im =[];
var server=express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });



server.set('view engine','ejs');
server.use('/',express.static(__dirname + '/assets'));
server.use('/about',express.static(__dirname + '/assets'));
server.use('/gal',express.static(__dirname + '/Images'));
//server.use(upload());
server.use(bodyParser.json());
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./Images");
    },
    filename: function (req, file, callback) {
          console.log(file.originalname);
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({ storage: Storage }).array("imgUploader", 3); //Field name and max count

//server.use(bb());
server.get('/',function(req,res){
  var walker  = walk.walk('./assets/slide/img', { followLinks: false });

  walker.on('file', function(root, stat, next) {
      // Add this file to the list of files

      files.push(stat.name);
      next();
  });

  walker.on('end', function() {

      console.log(files);
      res.render('in',qs={files});

  });


//console.log(qs);
});
server.get('/about',function(req,res){

  res.render('about');
});
server.get('/up',function(req,res){

  res.render('contact');
});

server.post('/msg',function (req, res) {
  upload(req, res, function (err) {
          if (err) {
              return res.end("Something went wrong!");
          }
          return res.end("File uploaded sucessfully!.");
      });

});

server.get('/gal',function(req,res){
  var walker  = walk.walk('./Images', { followLinks: false });

  walker.on('file', function(root, stat, next) {
      // Add this file to the list of files

      im.push(stat.name);
      next();
  });

  walker.on('end', function() {

      console.log(im);
      res.render('galery',qs={im});
console.log(qs.im);
  });


//console.log(qs);
});


server.listen(process.env.PORT || 3000);
console.log('made it');
