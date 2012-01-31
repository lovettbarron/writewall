
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

app.get('/male/say', function(req,res) {
		var newMsg = new Msg();
		console.log("this!" + JSON.stringify(req.param.msg) );

		newMsg.msg = JSON.parse( JSON.stringify( {
				"gender" : "0"
				, "msg": JSON.stringify(req.param.msg)
				, "sent" : new Date()
			}));

		newMsg.save( function(err) {
			if(err) console.log("Error saving: " + err)
			});		
		
		res.render('index', {
			title:'You said this about a girl:'
			, gender: 'male'
			, messages: { 'msg' : req.param.msg }
		});

	});

app.get('/female', function(req, res){
	var message = [];
	var query = Msg.find( {'gender': '0' } );
	 query.sort( 'sent', -1 )
			.limit(25)
			.exec(function(err,doc) {
					if(err) console.log("Err retrieving:" + err)
					if( doc !== undefined ) {
						for( var key in doc){
						if( doc.hasOwnProperty(key) ) {
							message.push(doc[key].msg);
							}
						}
					}
	});
  res.render('index', {
    title: 'writewall'
		, gender: 'female'
		}
	);
});

app.get('/female/say', function(req,res) {
	
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

//SOCKET LISTENING
var io = io.listen(app);

io.sockets.on('connection', function (socket) {

		socket.on('msg', function (data) {	
			var newMsg = new Msg();
			console.log("this!" + JSON.stringify(req.param.msg) );

			newMsg.msg = JSON.parse( JSON.stringify( {
					"gender" : "0"
					, "msg": JSON.stringify(req.param.msg)
					, "sent" : new Date()
				}));

			newMsg.save( function(err) {
				if(err) console.log("Error saving: " + err)
				socket.emit('success',data)
				});		
			});
				

	});

	
		
	
	io.sockets.on('disconnect', function() {
		clearInterval(interval);
		console.log('Disconnect');
	});
