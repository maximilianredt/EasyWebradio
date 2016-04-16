require('./assets/js/libs/object-watch.js');

$.getScript('assets/js/app/Player.js', function()
{
	var player = new Player('http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p');
	//var player = new Player('http://swr-mp3-m-swr3.akacast.akamaistream.net/7/720/137136/v1/gnl.akacast.akamaistream.net/swr-mp3-m-swr3');
	var playerCtrl = $('.player-control-play'),
		slider = $('.player-control-volume .slider'),
		tooltip = $('.player-control-volume .tooltip');

	// initially write the stream status
	playerCtrl.attr('data-status', player.status);

	// hide tooltip for now until we need it ;)
	tooltip.hide();

	/**
	 * init volume slider
	 */
	slider.slider({
		'value': 100,

		start: function(event,ui) {
			// show tooltip when sliding starts
			tooltip.fadeIn('fast');
		},

		slide: function(event, ui) {
			// get new volume
			var value = slider.slider('value');

			// set new volume in tooltip
			tooltip.css('left', value).text(ui.value);

			// set new volume in player
			player.setVolume(ui.value);
		},

		stop: function(event,ui) {
			// hide tooltip when sliding starts
			tooltip.fadeOut('fast');
		}
	});


	/**
	 * value of Player.status should always be on
	 * '.player-control-volume .slider[data-status]'
	 * to handle icons on button via css.
	 */
	player.watch('status', function(prop, oldval, newval) {
		playerCtrl.attr('data-status', newval);
	});

	/**
	 * toggle the stream on click
	 */
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