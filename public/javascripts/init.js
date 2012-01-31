var gender;

var socket = new io.connect('http://emote.me:3000');
socket.on('connect', function() {
		console.log( "Oh hey, connected");
	});
	
socket.on('disconnect', function() {
		console.log('disconnected');
	});
	
socket.on('msg', function(data) {
    console.log(data);
    socket.emit('data', { 
			msg: 'data'
			, gender: gender;
		 });
  });	

socket.on('success', function(data) {
    console.log(data);
  });