var gender, question;

var socket = new io.connect('http://emote.me:3000');
socket.on('connect', function() {
		console.log( "Oh hey, connected");
	});
	
socket.on('disconnect', function() {
		console.log('disconnected');
	});

socket.on('success', function(data) {
    console.log(data);
		if(data.gender != gender ){
			var $addition = $('<li class="experience well">' + data.msg + '</li>');
			$('ul#text').prepend( $addition ).masonry('reload');
			}
  	});

socket.on('fail', function(data) {
    console.log(data);
  	});

socket.on('current', function(data) {
	console.log(data);
	for( var key in data) {
		var $addition = $('<li class="experience well">' + data[key].msg + '</li>');
		$('ul#text').prepend( $addition ).masonry('reload');
	}
});


$(document).ready( function(){
		//Bootstrap stuff
		$('#myTab').tab('show')


		//App stuff
		$('#genderWall').hide();

		$('ul#text').masonry({
		  itemSelector: '.experience',
		  columnWidth: 100
			});


		$('#selMale').click( function() {
			gender = 0;
			question = questions();
			$('#genderSel').hide( function() {
					$('#genderWall').show().delay(800, function() {
						$('#genderWall').prepend('<h3>You are a man, ' + question + '</h3>')
						socket.emit('current', { 'gender' : gender } );
					});
			});
		});

		$('#selFemale').click( function() {
			gender = 1;
			question = questions();
			$('#genderSel').hide( function() {
					$('#genderWall').show().delay(800, function() {
						$('#genderWall').prepend('<h3>You are a woman, ' + question + '</h3>')
						socket.emit('current', { 'gender' : gender } );
					});
			});
		});

		$('#selGq').click( function() {
			gender = 'more';
			question = question();
			$('#genderSel').hide();
			$('#genderWall').show();
		});
	
    // when the client clicks SEND
    $('#datasend').click( function() {
			var mss = $('#data').val();
      var message = {
				'gender': gender
				,'msg': mss
				,'question' : question
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



function questions() {
	var questions = [
	'how does that make you feel?'
	,'what did you see today?'
	,'do you think that was a choice?'
	,'how do you think your parents felt?'
	];
	
	
	return questions[Math.floor(Math.random() * questions.length)];
}