onmessage = function (event) {
	var imgData = event.data;
	var len = imgData.data.length;
	var X = Y = Math.sqrt((len/4));
	var R = X / 2;
	var centerX = X / 2;
	var centerY = Y / 2;
	for (var i = 0;i < X;i++) {
		for (var j = 0;j < Y;j++) {
			var dis = Math.sqrt(Math.pow((i - centerX),2) + Math.pow((j - centerX),2));
			if (dis > R) {
				var _point = X * i + j;
				imgData.data[4 * _point + 0] = 255;
				imgData.data[4 * _point + 1] = 255;
				imgData.data[4 * _point + 2] = 255;
			}
		}
	};

	setTimeout(function () {
		postMessage(imgData);
	},500);
};