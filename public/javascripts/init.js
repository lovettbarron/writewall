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
			, gender: gender
		 });
  });	

socket.on('success', function(data) {
    console.log(data);
		$('#input').append('')
  });


$(document).ready( function(){
    // when the client clicks SEND
    $('#datasend').click( function() {
      var message = $('#data').val();
      $('#data').val('');
      socket.emit('msg', message);
    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function(e) {
      if(e.which == 13) {
        $(this).blur();
        $('#datasend').focus().click();
      }
    });
  });