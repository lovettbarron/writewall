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
		$('#text').prepend('<p>' + data + '</p>')
  });

socket.on('current', function(data) {
	for( var key in data) {
		$('#text').prepend('<p>' + data[key] + '</p>')
	}
});


$(document).ready( function(){
		$('#genderWall').hide();
		socket.emit('current',gender);


		$('#selMale').click( function() {
			gender = 'male';
			$(this).hide();
			$('#genderWall').show();
		});



	
    // when the client clicks SEND
    $('#datasend').click( function() {
			var mss = $('#data').val();
      var message = {
				'gender': gender
				,'msg': mss
	}
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