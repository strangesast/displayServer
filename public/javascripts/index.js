$(document).ready(function() {
	updateButtons();
});

$('.list-group-item-heading').hover(function() {
  $(this).css('cursor', 'pointer');
}, function() {
  $(this).css('cursor', 'auto');
});

$('.list-group-item-heading').click(function(e) {
	if(e.ctrlKey || e.shiftKey) {
	// if ctrl, select
	  $(this).parent().toggleClass('active');
		
	} else {
  // else deselect all
		$('.list-group-item').not($(this).parent()).removeClass('active');
	  $(this).parent().toggleClass('active');
	}
	updateButtons();
});


$('#test').click(function() {
	// send test-like command to device
});

function updateButtons() {
  if($('.list-group-item.active').length>0) {
    $('#test').removeClass('disabled');
	} else {
    $('#test').addClass('disabled');
  }
}
