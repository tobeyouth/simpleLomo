/* 类似于打字机样式的输出字符 */
define(function (require) {
	var defaultOptions = {
		"word":"请传入字符串",
		"fontFamily":"Microsoft YaHei",
		"fontSize":"30px",
		"lineHeight":"36px",
		"color":"#333",
		"fps":1 // 多长时间输出一个字
	};

	var printWord = function (options) {
		var printOption = {};
		for (var key in defaultOptions) {
			printOption[key] = defaultOptions[key];
		};
		if (options) {
			for (var key in options) {
				printOption[key] = options[key];
			}
		};
		var word = printOption['word'] || null; // 要输出的字符串
		var context = printOption['contextObj'] || null; // context对象
		var canvas = context['canvas'];
		var canvasWidth = canvas.offsetWidth;
		var canvasHeight = canvas.offsetHeight;

		var startX = canvasWidth / 8;
		var startY = canvasHeight / 8; // 从屏幕中间开始写

		var textAreaWidth = canvasWidth - (startX * 2);
		var textAreaHeight = canvasHeight - (canvasHeight / 20 * 2);

		// 测试用框
		// context.strokeStyle = "#333";
		// context.strokeRect(startX,startY,textAreaWidth,1);

		if (!word) {
			console.log('没输入字符串');
			return;
		};
		if (!context) {
			console.log('没传入context对象');
			return;
		};

		var stringArray = StringToArray(word);
		var lineLen = Math.floor(textAreaWidth / parseInt(printOption['fontSize'],10));// 一行多少个字
		// 传入写入程序的参数
		var printData = {
			"startX":startX,
			"startY":startY,
			"textAreaWidth":textAreaWidth,
			"textAreaHeight":textAreaHeight,
			// "context":context,
			// "fontSize":printOption['fontSize'],
			// "fontFamily":printOption['fontFamily'],
			"stringArray":stringArray,
			"lineLen":lineLen
		};

		for (var key in printOption) {
			printData[key] = printOption[key];
		};

		// 调用写入方法
		printing(printData);
	};

	// 真正的写入程序
	function printing(printData) {
		var contextObj = printData['contextObj'];
		var startX = printData['startX'];
		var startY = printData['startY'];
		var fps = printData['fps'] || 1;
		var timer = null;
		var printTime = 1000 * (1 / fps); //输出文字的频率
		var blingTime = printTime / 2; // 光标闪动的频率
		var printSwitch = 0;// 为0的时候光标空闪，为1的时候输出字符
		var word = printData['word'];
		var wordIndex = 0;// 字符串上的指针
		// 绘制光标和文字所需数据
		var drawData = printData;
		var lineIndext;// 当前行数索引
		var lineRemainder;// 是否换行,0为每行的第一个，需要换行
		drawData['cursorX'] = printData['startX'];
		drawData['cursorY'] = printData['startY'];
		drawData['printSwitch'] = printSwitch;
		drawData['wordIndex'] = wordIndex;

		timer = setInterval(function () {
			if (drawData['printSwitch'] == 0) {
				drawData['printSwitch'] = 1;

				lineIndext = Math.floor(drawData['wordIndex'] / drawData['lineLen']); // 当前行数索引
				lineRemainder = Math.floor(drawData['wordIndex'] % drawData['lineLen']); // 是否换行,0为每行的第一个，需要换行

				if (drawData['wordIndex'] < word.length) {
					drawData['wordIndex'] += 1;
				} else {
					clearInterval(timer);
					return
				};
			} else {
				drawData['printSwitch'] = 0;
			};

			// 整理绘制光标和文字所需数据
			
			
			// if (lineIndext == 0) {
			// 	lineRemainder -= 1;
			// 	// lineIndext = Math.floor((drawData['wordIndex']) / (drawData['lineLen'] - 1));
			// };
		

			drawData['startX'] = startX + lineRemainder * parseInt(drawData['fontSize'],10);
			drawData['startY'] = startY +  lineIndext * parseInt(drawData['lineHeight'],10);
			drawData['cursorX'] = drawData['startX'] + parseInt(drawData['fontSize'],10);		
			if (lineRemainder || drawData['wordIndex'] == 0) {
				drawData['cursorY'] = drawData['startY'];
			} else {
				drawData['cursorY'] = drawData['startY'];
			};

			console.log(lineRemainder)
			// console.log(drawData['wordIndex'] % drawData['lineLen']);
			drawData['word'] = word.substring(drawData['wordIndex'] - 1,drawData['wordIndex']);

			// 绘制光标
			drawCursor(drawData)
			// 写字
			drawString(drawData);

		},blingTime);
	};

	// 绘制光标
	function drawCursor(cursorData) {
		var contextObj = cursorData['contextObj'];
		var cursorSwtich = cursorData['printSwitch'];
		var drawX = cursorData['cursorX'];
		var drawY = cursorData['cursorY'];
		// console.log(cursorSwtich);
		if (!contextObj) {
			console.log("没传入context对象");
			return false;
		};

		if (cursorSwtich) {
			// 出现
			contextObj.fillStyle = "#999";
			// console.log(drawX);
			contextObj.fillRect(drawX,drawY,15,3);
		} else {
			// console.log(drawX);
			// 消失
			contextObj.fillStyle = "#fff";
			contextObj.strokeStyle = "#fff";
			contextObj.strokeRect(drawX,drawY,15,3);
			contextObj.fillRect(drawX,drawY,15,3);
		}
	};

	// 绘制文字
	function drawString(stringData) {
		var contextObj = stringData['contextObj'];
		var printSwitch = stringData['printSwitch'];
		var drawX = stringData['startX'];
		var drawY = stringData['startY'];
		var word = stringData['word'];

		contextObj.font = stringData['fontSize'] + " " + stringData['fontFamily'];
		if (!printSwitch) {
			// console.log('不输出文字');
			return;
		} else {
			contextObj.fillText(word,drawX,drawY);
		}
	};

	// 将字符串转换为数组
	function StringToArray(string) {
		if (!string) {
			console.log("没传入字符串啊！亲！");
			return false;
		}
		var len = string.length;
		var stringArray = [];
		for (var i = 0; i < len;i++) {
			var item = string.substring(i,i+1);
			stringArray.push(item);
		};
		return stringArray;	
	};

	return printWord;
});
