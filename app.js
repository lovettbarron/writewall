
/**
 * Module dependencies.
 */
var express = require('express'), 
		OAuth = require('oauth').OAuth,
		io = require('socket.io'),
//		connect = require('connect'), //Automatic in express I think?
		winston = require('winston'),
 		util = require('util');

var	mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/writewall', function(err) {
	if( err ) {	console.log(err); }
	else { console.log("Successful connection"); }
});

var app = module.exports = express.createServer();

//Database model
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

//Gender:
//Female 1
//Male 0
var msgSchema = new Schema({
    gender    : Number
	, msg	: String
  , time : Date
}), Msg;

var Msg = mongoose.model('Msg', msgSchema,'message');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: '024493' }));
//  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'writewall',
  });
});

app.get('/male', function(req, res){
  res.render('index', {
    title: 'writewall'
		, gender: 'male',
  });
});

app.get('/male/:msg', function(req,res) {
				var newMsg = new Msg();
				newMsg.msg = JSON.parse( JSON.stringify( {
									"gender" : 0
									, "msg": req.param.msg
									, "sent" : new Date()
							}));
				newMsg.save( function(err) {
					if(err) console.log("Error saving colour:" + err)
				});		
		res.render('index', {
			title:'You said this about a girl:'
			, gender: 'male'
			, msg: req.param.msg
		});
});

app.get('/female', function(req, res){
	var message = [];
	Msg.find({'gender':'0'}, function(err, doc) {
		if( doc !== undefined ) {
			for( var key in doc){
			if( doc.hasOwnProperty(key) ) {
					message.push(doc[key]);
							}
						}
					}
	});
  res.render('index', {
    title: 'writewall'
		, gender: 'female'
		, messages : message
		}
	);
});

app.get('/female/:msg', function(req,res) {
	
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

//SOCKET LISTENING
var io = io.listen(app);
io.sockets.on('connection', function (socket) {
		socket.emit('draw', colordata);

		socket.on('msg', function (data) {	
				colordata = data;
				socket.broadcast.emit('colour', data );
			  winston.log('info', data 	);
				});
	});
		
	
	io.sockets.on('disconnect', function() {
		clearInterval(interval);
		console.log('Disconnect');
	});
