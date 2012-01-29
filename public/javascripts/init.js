var socket = new io.connect('http://emote.me:3000');
socket.on('connect', function() {
		console.log( "Oh hey, connected");
	});
socket.on('disconnect', function() {
		console.log('disconnected');
	});
socket.on('msg', function() {
	
});

SCREEN_W = window.innerWidth;
SCREEN_H = window.innerHeight;
window.addEventListener( 'resize', onWindowResize, function(event){
	console.log("Window resized:",event);
});
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function onDocumentMouseMove(event) {
	var x = (event.x/window.innerWidth);
	var y = (event.y/window.innerHeight);
	socket.emit( "", color );
//	console.log('Mouse moving',event);
}	
