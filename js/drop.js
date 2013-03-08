/* 拖入图片以及读取图片信息的模块 */
/* 点击下图，重新渲染大图 */
define(function (require,exports) {
	var getFilter = require('filter');
	var jquery = require('jquery');
	var filterList = require('filter-list')
	var dropData = {};
	var readerFun = {};
	$.extend(readerFun,{
		fileData:{},
		reader:function (file) {
			var reader = new FileReader();
			reader.readAsDataURL(file);

			$(reader).bind("load",this.readerLoad);
			$(reader).bind("progress",this.readerProgress);
		},
		readerLoad:function (event) {
			var event = event.originalEvent;
			var data = event.target.result;
			var img = new Image();
			img.src = data;
			$(img).bind("load",readerFun.imgLoad);
		},
		readerProgress:function (event) {

		},
		imgLoad:function (event) {
			var imgWidth = this.width;
			var imgHeight = this.height;

			var canvasWidth = parseInt($(dropData['canvas']).width(),10);
			var canvasHeight = parseInt($(dropData['canvas']).height(),10);
			
			var drawWidth = canvasWidth;
			var drawHeight = canvasWidth / imgWidth * imgHeight;
			var drawLeft = 0;
			var drawTop = Math.floor((canvasHeight - drawHeight) / 2);
			if (drawTop < 0) {
				drawTop = 0;
			};

			var context = dropData['canvas'].getContext('2d');
			context.fillStyle = "#333";
			context.fillRect(0,0,canvasWidth,canvasHeight);
			context.drawImage(this,drawLeft,drawTop,drawWidth,drawHeight);

			//存储的原图
			var saveImgData =  context.getImageData(0,0,canvasWidth,canvasHeight);
			dropData['saveImgData'] = saveImgData;
			// 获取canvas上的像素数据
			var imgData = context.getImageData(0,0,canvasWidth,canvasHeight);

			// 创建选择列表，并渲染
			readerFun.createList(this);
			// 抛出去计算
			getFilter({
				"imgData":imgData,
				"contextObj":context,
				"canvas":dropData['canvas']
			});
		},
		createList:function (img) {
			var $listBox = $(dropData['listBox']);
			$listBox.empty();
			var itemWidth = parseInt(dropData['itemWidth'],10);
			var itemHeight = parseInt(dropData['itemHeight'],10);
			var imgWidth = img.width;
			var imgHeight = img.height;

			var ulNode = document.createElement("ul");
			$listBox.append(ulNode);
			var len = filterList.length;
			for (var i = 0;i < len;i++) {
				var liNode = document.createElement('li');
				var itemCanvas = document.createElement('canvas');
				itemCanvas.setAttribute('width',itemWidth);
				itemCanvas.setAttribute('height',itemHeight);
				var itemContext = itemCanvas.getContext('2d');

				var drawWidth = itemWidth;
				var drawHeight = itemWidth / imgWidth * imgHeight;
				var drawLeft = 0;
				var drawTop = Math.floor((itemHeight - drawHeight) / 2);
				if (drawTop < 0) {
					drawTop = 0;
				};
				itemContext.fillStyle = "#333";
				itemContext.fillRect(0,0,itemWidth,itemHeight);
				itemContext.drawImage(img,drawLeft,drawTop,drawWidth,drawHeight);
				
				liNode.setAttribute('filterSelector',i);
				liNode.appendChild(itemCanvas);
				ulNode.appendChild(liNode);

				var imgData = itemContext.getImageData(0,0,itemWidth,itemHeight);
				var filterSelector = filterList[i];
				// 抛出计算
				getFilter({
					"imgData":imgData,
					"contextObj":itemContext,
					"filterSelector":filterSelector
				});
			};

			readerFun.itemBind($listBox);
		},
		itemBind:function (boxObj) {
			boxObj.undelegate();
			boxObj.delegate("li","click",function () {
				var $that = $(this);
				var filterSelector = $that.attr("filterselector");
				var context = dropData['canvas'].getContext('2d');
				var imgData = dropData['saveImgData'];
				// 抛出去计算
				getFilter({
					"imgData":imgData,
					"contextObj":context,
					"canvas":dropData['canvas'],
					"filterSelector":filterList[filterSelector]
				});
				// context.putImageData(imgData,0,0);
			});
		}
	});

	$.fn.extend({
		bindDrop:function (listOption) {
			var $that = $(this);
			var listBox = listOption['itemList'] || "#scroller";// 自动生成列表
			var itemWidth = listOption['itemWidth'] || 80;
			var itemHeight = listOption['itemHeight'] || 80;

			var width = parseInt($that.width(),10);
			var height = parseInt($that.height(),10);
			
			// 创建canvas
			var canvas = document.createElement('canvas');
			var context = canvas.getContext("2d");
			$(canvas).attr({"width":width,"height":height});
			$that.append(canvas);
			dropData['canvas'] = canvas;// 将canvas对象存储起来，以备后用

			// 将列表对象存储起来
			dropData['listBox'] = listBox;
			dropData['itemWidth'] = itemWidth;
			dropData['itemHeight'] = itemHeight;

			$that.bind('dragover',this.dragoverHandler);
			$that.bind('drop',this.dropHandler);
		},
		dragoverHandler : function (event) {
			event.stopPropagation();
            event.preventDefault();

		},
		dropHandler:function (event) {
			event.preventDefault();
			event.stopPropagation
			var event = event.originalEvent;
			var dataTransfer = event.dataTransfer;
			var files = dataTransfer.files;
			var file = files[0];
			var len = files.length;
			if (len > 1) {
				console.log("只能拖入一张照片");
			};
			var type = file.type.match(/image.*/g);
			if (!type) {
				console.log("请拖入图片");
				return;
			};

			// 读取图片信息
			readerFun.reader(file);
		}
	});

});