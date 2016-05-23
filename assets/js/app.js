// setup required variables first
var playerCtrl = $('.player-control-play'),
	slider = $('.player-control-volume .slider'),
	tooltip = $('.player-control-volume .tooltip'),
	channelVal = $('.player-channel-select'),
	channelSelect = $('.channel-dropdown'),
	db = new PouchDB('ewr');

// set PouchDB to debug mode for now
//PouchDB.debug.enable('*');
PouchDB.debug.disable();

require('./assets/js/libs/object-watch.js');
var AppChannels = require('./assets/js/app/Channels.js');
var AppPlayer = require('./assets/js/app/Player.js');
var player = null;

var channels = new AppChannels(function() {
	player = new AppPlayer(channels.getAll()[0].url);
	player.setVolume(5); // turn down volume to not die while debugging

	var channelsAll = channels.getAll();
	// initially write the stream status
	playerCtrl.attr('data-status', player.status);
	var channelName = channelsAll[1].name;
	// channelVal.text(channelName).css('color', 'white'); // changes text to radio channel name and colour to white

	/**
	 * value of Player.status should always be on
	 * '.player-control-volume .slider[data-status]'
	 * to handle icons on button via css.
	 */
	player.watch('status', function (prop, oldval, newval) {
		playerCtrl.attr('data-status', newval);
	});
	channelsAll.addChannel('BBC Radio 5', 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio5live_mf_p')

	for (i = 0; i < channelsAll.length; i++) {
		var channelOption = $('<option></option>').text(channelsAll[i].name).attr('value', i);
		channelSelect.append(channelOption);
	};
});

// hide tooltip for now until we need it ;)
tooltip.hide();

/**
 * init volume slider
 */
slider.slider({
	'value': 5, // volume slider at 5

	start: function (event, ui) {
		// show tooltip when sliding starts
		tooltip.fadeIn('fast');
	},

	slide: function (event, ui) {
		// get new volume
		var value = slider.slider('value');

		// set new volume in tooltip
		tooltip.css('left', value).text(ui.value);

		// set new volume in player
		player.setVolume(ui.value);
	},

	stop: function (event, ui) {
		// hide tooltip when sliding starts
		tooltip.fadeOut('fast');
	}
});

/**
 * toggle the stream on click
 */
playerCtrl.on('click', function () {
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

console.log(channels);

var switchChannels = function(index) {
	if (playerCtrl.attr('data-status') === 'playing' || playerCtrl.attr('data-status') === 'loading') {
		player.stop();
	}
	player = new AppPlayer(channels[index].url);
	playerCtrl.attr('data-status', player.status);
	player.watch('status', function (prop, oldval, newval) {
		playerCtrl.attr('data-status', newval);
	});
	player.play();
};
