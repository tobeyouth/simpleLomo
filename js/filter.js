/* filter v 0.1 */

$(function () {
	// icon
	var $mask = $(".mask");
	var $loading = $(".loading");

	// cread canvas
	var canvas = document.createElement("canvas");
	var $canvas = $(canvas);
	$canvas.attr("id","filter");
	var context = canvas.getContext('2d');
	$("#box").append(canvas);	

	// width && height
	var imgHeight ,imgWidth,top,left;


	// drop
	$(document).delegate("#box","drop",function (event) {
		event.preventDefault();
		var $that = $(this);
		var _width = $that.css("width");
		var _height = $that.css("height");

		var event = event.originalEvent;
		var dataTransfer = event.dataTransfer;
		var files = dataTransfer.files;
		var file = files[0];
		var len = files.length;
		if (len > 1) {
			console.log("只能拖入一张照片");
		};
		$canvas.attr({"width":_width + "px","height":_height + "px"});

		var type = file.type.match(/image.*/g)
		if (!type) {
			console.log("请拖入图片");
			return;
		};
		
		reader(file);
	});

	// reader
	function reader (file) {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		
		$(reader).bind("load",readerLoad);
		$(reader).bind("progress",readerProgress);
	};

	function readerLoad(event) {
		var event = event.originalEvent;
		var data = event.target.result;
		var img = new Image();
		img.src = data;

		var _width = parseInt($canvas.css("width"));
		var _height = parseInt($canvas.css("height"));

		img.onload = function (e) {
			var _imgWidth = this.width; // 图片真实宽度
			var _imgHeight = this.height; // 图片真实高度

			imgHeight = _width / _imgWidth * _imgHeight; // 绘制到canvas上的高度
			imgWidth = _width; // 绘制到canvas上的宽度

			top = Math.floor((_height-imgHeight)/2); // canvas的Y方向上绘制开始位置
			left = 0;


			console.log(_imgWidth);
			console.log(_imgHeight)
			console.log(imgWidth);
			console.log(imgHeight);
			

			// 绘制canvas
			context.fillStyle = "#000000";
			context.fillRect(0,0,_width,_height);
			context.drawImage(this,0,top,imgWidth,imgHeight);

			// 绘制选项
			var $scrollItem = $("#scroller li");
			var itemNum = $scrollItem.length;
			var itemHieght =  _imgHeight / _imgWidth * 80;
			var itemTop = Math.floor((80 - itemHieght)/2); 

			// $scrollItem.each(function (index) {
			// 	// $(this).empty();
			// 	// var _img = "<div><img src='"+data+"' width='80' height='"+itemHieght+"' style='margin-top:"+marginTop+"px' /></div>";
			// 	// $(this).append(_img);

			// 	// 这里写抛出worker计算不同效果的函数
			// });
			
			// 获取imgData
			var imgData = context.getImageData(0,0,_width,_height);

			// 抛出worker去计算
			// createWorker(imgData);
			lomoTest(imgData)
		};
		
	};

	function readerProgress(event) {
		console.log("Progress");
	};

	function createWorker(imgData) {
		$mask.show();
		$loading.show();

		var worker = new Worker("../js/draw.js");
		worker.postMessage(imgData);
	
		worker.onmessage = function (event) {
			console.log(event.data);
			var imgData = event.data;
			// context.drawImage(img,0,top,imgWidth,imgHeight);
			context.putImageData(imgData,0,0);
			$mask.fadeOut();
			$loading.fadeOut();
		};
	};

	// LOMO TEST
	function lomoTest (imgData) {
		// var oldImg = Object.create(imgData).__proto__;
		// console.log(typeof(imgData))
		// var oldImg = {};
		// oldImg.prototype = imgData.prototype;
		var len = imgData.data.length;
		var X = Y = Math.sqrt((len/4));
		var R = X / 3;
		var centerX = X / 2;
		var centerY = Y / 2;

		var scalerArray = [];
		var chaArray = [];
		for (var i = 0; i < len;i+=4) {
			imgData.data[i + 0] = imgData.data[i + 0] + 100; // red
			imgData.data[i + 1] = imgData.data[i + 1] + 30; // yellow
			imgData.data[i + 2] = imgData.data[i + 2]; // green
			// imgData.data[i + 3] = 100;
		};
		for (var i = 0;i < X;i++) {
			for (var j = 0;j < Y;j++) {
				var dis = Math.sqrt(Math.pow((i - centerX),2) + Math.pow((j - centerX),2));
				if (dis > R) {
					var _point = X * i + j;
					var cha = dis - R;
					chaArray.push(cha);
					var scaler = scaleFunction(R,dis,12);
					scaler = Math.abs(scaler);
					scalerArray.push(scaler)
					var pixR = imgData.data[4 * _point + 0];
					var pixG = imgData.data[4 * _point + 1];
					var pixB = imgData.data[4 * _point + 2];

					var newR = pixR - scaler;
					var newG = pixG - scaler;
					var newB = pixB - scaler;

					newR = Math.min(255,Math.max(0,newR));
					newG = Math.min(255,Math.max(0,newG));
					newB = Math.min(255,Math.max(0,newB));

					// imgData.data[4 * _point + 4] = cha;
					imgData.data[4 * _point + 0] = newR;
					imgData.data[4 * _point + 1] = newG;
					imgData.data[4 * _point + 2] = newB;
					imgData.data[4 * _point + 3] = 255;
					// // alphaArray.push(imgData.data[4 * _point + 3]);

				}
			}
		};

		// console.log(chaArray);
		console.log(scalerArray);
		// context.putImageData(oldImg,0,0);
		// context.fillStyle = "#000000";
		// context.fillRect(0,0,360,360);
		context.putImageData(imgData,0,0);
		$mask.fadeOut();
		$loading.fadeOut();
	};

	function scaleFunction(radius,dis,pixelsFallof) {
		var results = 1 - Math.pow(((dis - radius) / pixelsFallof),2);
		return results;
	}
});
