/* 
	filter 0.2 版
	基于seajs的模块系统
	这里只提供一个抛出img到worker的过程
*/
define(function (require,exports) {
	var filterList = require('filter-list');
	var throwToWorker = function (options) {
		var imgData = options['imgData'];
		var contextObj = options['contextObj'];
		var canvas = options['canvas'] || null;
		var filter = options['filterSelector'] || filterList[0];
		console.log(filter);
		var worker = new Worker(filter);
		worker.postMessage(imgData);

		worker.onmessage = function (event) {
			var imgDataCall = event.data;
			contextObj.putImageData(imgDataCall,0,0);
			if (canvas) {
				var imgSrc = canvas.toDataURL('image/jpeg');
				var img = document.createElement('img');
				img.src = imgSrc;
				$(img).css({
					"position":"absolute",
					"left":"0px",
					"top":"0px"
				});
				$(canvas).siblings('img').remove();
				$(canvas).after(img);
			};	
		};
	};
	exports.getFilter = throwToWorker;
	return throwToWorker;
});
