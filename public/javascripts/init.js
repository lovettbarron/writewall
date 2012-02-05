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
		if(data.gender != gender ){
			$('#text').prepend('<p>' + data.msg + '</p>')
			}
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
			gender = 0;
			$('#genderSel').hide( function() {
					$('#genderWall').show().delay(800, function() {
						$('#genderWall').prepend('<h3>You are a man, ' + question() + '</h3>')
					});
			});
		});

		$('#selFemale').click( function() {
			gender = 1;
			$('#genderSel').hide( function() {
					$('#genderWall').show().delay(800, function() {
						$('#genderWall').prepend('<h3>You are a woman, ' + question() + '</h3>')
					});
			});
		});

		$('#selGq').click( function() {
			gender = 'more';
			$('#genderSel').hide();
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
//      socket.emit('msg', message);
			socket.emit('data', message);
		});

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function(e) {
      if(e.which == 13) {
        $(this).blur();
        $('#datasend').focus().click();
      }
    });
  });



function question() {
	var questions = [
	'how does that make you feel?'
	,'what did you see today?'
	,'do you think that was a choice?'
	,'how do you think your parents felt?'
	];
	
	
	return questions[Math.floor(Math.random() * questions.length)];
}