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

var initialVolume = 50;

var channels = new AppChannels(function() {
	player = new AppPlayer(channels.getAll()[0].url);
	player.setVolume(initialVolume); // turn down volume to not die while debugging

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

	 /**
	 * this function is called by the submit button in the modal
	 * when the button is pressed, the name and the URL are added
	 * to the database of available channels
	 */
	 var modalAddChannel = function() {
		 var channelName = $('#channelName'),
		 		 channelUrl = $('#channelUrl');
		 channels.addChannel(channelName.val(), channelUrl.val());
		 channelName.val('');
		 channelUrl.val('');
		 $('#addChannelModal').modal('hide');
		 renderChannelList();
	 };

	 var renderChannelList = function() {
		 var currentChannel = channelSelect.val();
		 channelSelect.html('');
		 for (i = 0; i < channelsAll.length; i++) {
			 var channelOption = $('<option></option>').text(channelsAll[i].name).attr('value', i);
			 channelSelect.append(channelOption);
		 };
		 if (currentChannel != null) {
			 channelSelect.val(currentChannel);
		 };
	 };

	 renderChannelList();

	 $('#submit-btn').on('click', modalAddChannel);

});

// hide tooltip for now until we need it ;)
tooltip.hide();

/**
 * init volume slider
 */
slider.slider({
	'value': initialVolume, // volume slider at initialVolume (= 50)

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

var switchChannels = function(index) {
 	player.stop();
	player.changeStreamUrl(channels.getAll()[index].url);
 	player.play();
};

channelSelect.on('change', function() {
	var thisValue = $(this).val();
	switchChannels(thisValue);
});
