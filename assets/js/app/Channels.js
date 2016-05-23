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
				},
				{
					name: 'BBC Radio 5 Live',
					url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio5live_mf_p'
				}
			];
			onChannelsLoaded();
			return db.put({
				_id: 'channels',
				channels: self.channels
			});
		}
	});
};

/**
 * prepare playing of stream,
 * but for now only load the stream.
 * oncanplaythrough will start the stream then,
 * as soon as it is loaded.
 */
Channels.prototype.getAll = function() {
	return this.channels;
};

module.exports = Channels;
