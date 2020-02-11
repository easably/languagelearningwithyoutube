export default {
  setTime: function(time) {
    send({
			changeTime: {
				time: time
			}
		})
	},
	pause: function(){
		send({
			pause: true
		})
	},
	play: function(){
		send({
			play: true
		})
	}
};
function send(data){
	window.postMessage({
		type: "videoAction",
		data
	});
}