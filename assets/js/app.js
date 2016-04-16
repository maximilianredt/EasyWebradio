require('./assets/js/libs/object-watch.js');

$.getScript('assets/js/app/Player.js', function()
{
	var player = new Player('http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p');
	//var player = new Player('http://swr-mp3-m-swr3.akacast.akamaistream.net/7/720/137136/v1/gnl.akacast.akamaistream.net/swr-mp3-m-swr3');
	var playerCtrl = $('.player-control-play');
	playerCtrl.attr('data-status', player.status);
	var slider = $('.player-control-volume .slider'),
		tooltip = $('.player-control-volume .tooltip');

	tooltip.hide();

	slider.slider({
		'value': 100,

		start: function(event,ui) {
			tooltip.fadeIn('fast');
		},

		slide: function(event, ui) {

			var value = slider.slider('value');

			tooltip.css('left', value).text(ui.value);

			player.setVolume(ui.value);
		},

		stop: function(event,ui) {
			tooltip.fadeOut('fast');
		}
	});


	player.watch('status', function(prop, oldval, newval) {
		playerCtrl.attr('data-status', newval);
	});

	playerCtrl.on('click', function() {
		switch (playerCtrl.attr('data-status')) {
			case 'stopped':
				player.play();
				break;
			case 'playing':
			case 'loading':
				player.stop();
				break;
			default:
				// do nothing
				break;
		}
	});
});