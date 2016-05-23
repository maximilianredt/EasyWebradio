var Channels = function(onChannelsLoaded) {
	this.channels = {};
	var self = this;

	db.get('channels').then(function (doc) {
		self.channels = doc.channels;
		onChannelsLoaded();
	}).catch(function (err) {
		if (err.status === 404) {
			self.channels = [
				{
					name: 'BBC Radio 1',
					url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p'
				},
				{
					name: 'SWR 3',
					url: 'http://swr-mp3-m-swr3.akacast.akamaistream.net/7/720/137136/v1/gnl.akacast.akamaistream.net/swr-mp3-m-swr3'
				}
			];
			onChannelsLoaded();
			return self.writeChannelsToDb();
		}
	});
};

/**
 * write channels to database
 */
Channels.prototype.writeChannelsToDb = function() {
	return db.put({
		_id: 'channels',
		channels: self.channels
	});
};

/**
 * get all channels
 *
 * @return array
 */
Channels.prototype.getAll = function() {
	return this.channels;
};

/**
 * get channel by index
 *
 * @return object
 */
Channels.prototype.getChannelByIndex = function(channelIndex) {
	return this.channels[channelIndex];
};

/**
 * add one channel
 *
 * @var int channelIndex
 * @return array
 */
Channels.prototype.addChannel = function(name, url) {
	this.channels.push({name: name, url: url});
	this.writeChannelsToDb();
	return this.channels;
};

/**
 * delete one channel by index
 *
 * @var int channelIndex
 * @return array
 */
Channels.prototype.deleteChannelByIndex = function(channelIndex) {
	this.channels.splice(channelIndex, 1);
	this.writeChannelsToDb();
	return this.channels;
};

module.exports = Channels;