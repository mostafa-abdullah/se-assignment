$('body').click(function(){
	var r = Math.floor(Math.random()*128);
	var g = Math.floor(Math.random()*128);
	var b = Math.floor(Math.random()*128);
	$('body').css('background-color',"rgb("+r+","+g+","+b+")");


	$.getJSON( "api/quote", function( data ) {
		var text = data.text;
		var author = data.author;
		$('#quote').hide();
		$('#author').hide();
		$('#quote').html(text);
		$('#author').html(author);
		$('#quote').fadeIn('fast');
		$('#author').fadeIn('fast');
		
	});
});

