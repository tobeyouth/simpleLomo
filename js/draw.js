onmessage = function (event) {
	var imgData = event.data;
	var len = imgData.data.length;

	for (var i = 0;i < len;) {
		imgData.data[i + 0] = 255 - imgData.data[i + 0]; // red
		imgData.data[i + 1] = 255 - imgData.data[i + 1]; // yellow
		imgData.data[i + 2] = 255 - imgData.data[i + 2]; // green
		// imgData.data[i + 3] =50;
		i = i + 4;
	};
	setTimeout(function () {
		postMessage(imgData);
	},500);
};
