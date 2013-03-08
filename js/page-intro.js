// 开场动画
define(function (require) {
	var printWord = require('printWord');
	var winWidth = window.innerWidth;
	var winHeight =  window.innerHeight;
	var infoCanvas = document.createElement('canvas');
	var infoContext = infoCanvas.getContext('2d');
	infoCanvas.setAttribute("width",winWidth);
	infoCanvas.setAttribute("height",winHeight);
	infoCanvas.style.position = "fixed";
	infoCanvas.style.top = "0px";
	infoCanvas.style.left = "0px";
	infoCanvas.style.zIndex = 99999;

	infoContext.fillStyle = "#fff";
	infoContext.fillRect(0,0,winWidth,winHeight);

	document.body.appendChild(infoCanvas);

	printWord({
		"contextObj":infoContext,
		"word":"一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十"
	});
})