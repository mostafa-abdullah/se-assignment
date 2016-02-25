	$('body').click(function(){
		var r = Math.floor(Math.random()*256);
		var g = Math.floor(Math.random()*256);
		var b = Math.floor(Math.random()*256);
		$('body').css('background-color',"rgb("+r+","+g+","+b+")");


		$.getJSON( "api/quote", function( data ) {
			var text = data.text;
			var author = data.author;
			$('#quote').html(text);
			$('#author').html(author);
		});
	});