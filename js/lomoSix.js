onmessage = function (event) {
		var imgData = event.data;	
		var len = imgData.data.length;
		var X = Y = Math.sqrt((len/4));
		var R = X / 4;
		var centerX = X / 2;
		var centerY = Y / 2;

		for (var i = 0;i < len;i+=4) {
			var nextPointR,nextPointY,nextPointG,prevPointR,prevPointY,prevPointG;
			var nowPorintR = imgData.data[i + 0];
			var nowPorintY = imgData.data[i + 1];
			var nowPorintG = imgData.data[i + 3];
			if (i > 4) {
				prevPointR = imgData.data[i - 4];
				prevPointY = imgData.data[i - 3];
				prevPointG = imgData.data[i - 2];
			} else {
				prevPointR = imgData.data[i];
				prevPointY = imgData.data[i + 1];
				prevPointG = imgData.data[i + 2];
			};

			if (i < (len - 7)) {
				nextPointR = imgData.data[i + 4];
				nextPointY = imgData.data[i + 5];
				nextPointG = imgData.data[i + 7];
			} else {
				nextPointR = imgData.data[i];
				nextPointY = imgData.data[i + 1];
				nextPointG = imgData.data[i + 2];
			};
			imgData.data[i + 0] = (prevPointR + nextPointR) / 2;
			imgData.data[i + 1] = (prevPointY + nextPointY) / 2;
			imgData.data[i + 3] = (prevPointG + nextPointG) / 2;


			// if ()
		};
		// var scalerArray = [];
		// var chaArray = [];
		// for (var i = 0; i < len;i+=4) {
		// 	imgData.data[i + 0] = imgData.data[i + 1];; // red
		// 	imgData.data[i + 1] = imgData.data[i + 1];; // yellow
		// 	imgData.data[i + 2] = imgData.data[i + 1]; // green
		// };
		// for (var i = 0;i < X;i++) {
		// 	for (var j = 0;j < Y;j++) {
		// 		var dis = Math.sqrt(Math.pow((i - centerX),2) + Math.pow((j - centerX),2));
		// 		if (dis > R) {
		// 			var _point = X * i + j;
		// 			var cha = dis - R;
		// 			chaArray.push(cha);
		// 			var scaler = scaleFunction(R,dis,12);
		// 			scaler = Math.abs(scaler);
		// 			scalerArray.push(scaler)
		// 			var pixR = imgData.data[4 * _point + 0];
		// 			var pixG = imgData.data[4 * _point + 1];
		// 			var pixB = imgData.data[4 * _point + 2];

		// 			var newR = pixR - scaler;
		// 			var newG = pixG - scaler;
		// 			var newB = pixB - scaler;

		// 			newR = Math.min(255,Math.max(0,newR));
		// 			newG = Math.min(255,Math.max(0,newG));
		// 			newB = Math.min(255,Math.max(0,newB));

		// 			imgData.data[4 * _point + 0] = newR;
		// 			imgData.data[4 * _point + 1] = newG;
		// 			imgData.data[4 * _point + 2] = newB;
		// 			imgData.data[4 * _point + 3] = 255;
		// 		}
		// 	}
		// };
		postMessage(imgData);
	};
	function scaleFunction(radius,dis,pixelsFallof) {
		var results = 1 - Math.pow(((dis - radius) / pixelsFallof),2);
		return results;
	}