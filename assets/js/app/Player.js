var Player = function(stream_url) {
	this.stream_url = stream_url;
	this.stream = null;
	this.status = 'stopped';
	this.event = {};
	var self = this;

	this.stream = new Audio(this.stream_url);
	this.status = 'loading';

	this.stream.oncanplaythrough = function() {
		self.oncanplaythrough(this);
	};
	this.stream.onpause = function() {
		self.onpause(this);
	};
};

Player.prototype.play = function() {
	this.stream.load();
	this.status = 'loading';
};
Player.prototype.stop = function() {
	this.stream.pause();
	this.status = 'stopped';
};
Player.prototype.setVolume = function(volume) {
	this.stream.volume = volume / 100;
};


Player.prototype.oncanplaythrough = function(stream) {
	stream.play();
	this.status = 'playing';
};
Player.prototype.onpause = function() {
	this.status = 'stopped';
};