var color;

color = "FFFFFF";

function testLeds() {
	var obj = {'method':'test', 'what': color};
  $.ajax({
		url: '/',
		type: 'POST',
		contentType:"application/json",
		data: obj
	}).done(function(data) {
		console.log('success');
		console.log(data);
	}).fail(function() {
		console.log('fail');
	});
}
