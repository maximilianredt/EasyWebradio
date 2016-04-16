var Player = function(stream_url) {
	this.stream_url = stream_url;
	this.stream = null;
	this.status = 'stopped';
	this.event = {};
	var self = this;

	// create Audio object and set the stream initial status to "loading"
	this.stream = new Audio(this.stream_url);
	this.status = 'loading';

	// link events with handling functions
	this.stream.oncanplaythrough = function() {
		self.oncanplaythrough(this);
	};
	this.stream.onpause = function() {
		self.onpause(this);
	};
};

/**
 * prepare playing of stream,
 * but for now only load the stream.
 * oncanplaythrough will start the stream then,
 * as soon as it is loaded.
 */
Player.prototype.play = function() {
	this.stream.load();
	this.status = 'loading';
};

/**
 * stop stream
 */
Player.prototype.stop = function() {
	this.stream.pause();
	this.status = 'stopped';
};

/**
 * change the volume of the stream
 */
Player.prototype.setVolume = function(volume) {
	this.stream.volume = volume / 100;
};

/**
 * start stream when it is ready and update stream status
 */
Player.prototype.oncanplaythrough = function(stream) {
	stream.play();
	this.status = 'playing';
};

/**
 * update stream status on pause
 */
Player.prototype.onpause = function() {
	this.status = 'stopped';
};