/* sea js */

// 配置路径
seajs.config({
	alias: {
		'intro':'page-intro.js',
		'jquery': 'jquery.1.8.1.js',
		'iscroll': 'iscroll.js',
		'drop': 'drop.js',
		'filter': 'filter.0.2.js',
		'printWord':'canvas-print-word.js',
		'filter-list': 'filter-list.js' // 包含所有滤镜worker的数组，更新数组就可以添加滤镜了
	}
});
// 开场动画
// seajs.use('intro',function () {
	
// });

// 功能模块
seajs.use(['jquery', 'iscroll'], function() {
	$(function() {
		var nav = window.navigator.userAgent;
		var ua = $.uaMatch(nav);
		// if (ua['browser'] != 'chrome' && ua['browser'] != 'webkit') {
		// 	alert('请使用新版的chrome浏览器');
		// 	window.location.href = "http://www.google.cn/intl/zh-CN/chrome/browser/?installdataindex=chinabookmarkcontrol&brand=CHUN";
		// };
		var _drop = $.support.drag;
		
		var scroll = new iScroll('wrapper', {
			hScroll: true,
			vScroll: false,
			hScrollbar: false,
			vScrollbar: false,
			fadeScrollbar: true
		});
	});
});

seajs.use(['jquery','drop'], function() {
	var option = {
		"itemList": "#scroller",
		"itemWidth": 80,
		"itemHeight": 80
	};
	$(function () {
		$("#box").bindDrop(option);
	});
});
