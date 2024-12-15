
//-----WebContent/www/js/app/common/ctrl/CommonTool.js------------------------------
//--Queue---------------------------------------------------
const FUNCT_SCOPE	= AppCommon['const'].	FUNCT_SCOPE;
const FUNCT_NAME	= AppCommon['const'].	FUNCT_NAME;
const FUNCT_PARAM	= AppCommon['const'].	FUNCT_PARAM;
const req_gl_funct = function(fScope, fName, fParams){ //fParams must be a array
	var f01 = {}; 	
	f01[FUNCT_SCOPE]	= fScope ; 	
	f01[FUNCT_NAME] 	= fName;				
	f01[FUNCT_PARAM]	= fParams;
	return f01;
} 
const req_gl_Request_Content_Send= function(serviceClass, serviceName){
	var svClass 	= App['const'].SV_CLASS;
	var svName		= App['const'].SV_NAME;
	var sessId		= App['const'].SESS_ID;
	var userId      = App['const'].USER_ID;
	var ref 		= {};
	ref[svClass] 	= serviceClass; 
	ref[svName]		= serviceName;
	ref[userId]		= App.data.user ? App.data.user.id : -1;
	ref[sessId]		= App.data.session_id;
	return ref;
}
const do_gl_show_MsgNoAjax= function(msg){
	console.log("do_gl_show_MsgNoAjax::" + msg);
}
const do_gl_show_MsgAjax= function(sharedJson, msg){
	console.log("do_gl_show_MsgAjax::" + msg);
}
//-----------------------------------------------------
const do_gl_queue = function(fListWhenSucess, fWhenError, fWhenComplete, shareArg, waitingTime) {
	queue(fListWhenSucess, fWhenError, fWhenComplete, shareArg, waitingTime);
}
const do_gl_execute = function (funct, arrayParam){
	execute(funct, arrayParam);
}
//-----------------------------------------------------
var queue=function(a,b,c,d,e){null==e&&(e=50),function f(){if(a.length>0){var g=a.shift(),h=g[FUNCT_NAME];if(!h)return void f();var i=g[FUNCT_SCOPE],j=g[FUNCT_PARAM];setTimeout(function(){0==d.err_code||void 0==d.err_code?(h.apply(i,[d].concat(j)),f()):b&&execute(b)},e)}else c&&execute(c)}()};
var execute = function (funct){
	try{
		if (typeof(funct)== 'function') 
			funct();
		else{
			var fVar 	= funct[FUNCT_SCOPE];
			var fName 	= funct[FUNCT_NAME];
			var fParam	= funct[FUNCT_PARAM];
			fName.apply(fVar, fParam);
		}
	}catch(e){
		console.log('Cannot execute Funct');
	}	
}
//-----------------------------------------------------
const do_gl_load_JSController_ByRequireJS = function(AppVar, ctrConfig){
	if (!ctrConfig	) return;
	if (!AppVar		) AppVar = {};
	/*
	 AppVar 	= App.controller;
	 ctrConfig 	= {path: "////", nameGroup: "List", name : "Area", initParams: [....], fShow: name, fShowParams : [], fCallBack: function(){},}
	 	nameGroup/grpName		: ten cua cac phan lon': area, plan, post, material...
		name/ctrlName			: ten cua controller: list, main, tab...
		path/ctrlPath			: duong dan cua controller
		initParams/ctrlParams	: cac bien khoi tao cua controller
		fInit 			: ten ham se goi sau khi controller duoc khoi tao
		fInitParams 	: bien cua ham khoi tao
		fShow 			: ten ham se goi sau khi controller duoc khoi tao
		fShowParams 	: bien cua ham khoi tao
		fCallBack 		: nhung ham se thuc hien sau cung
		fCallBackParams : bien cua ham callback
	 */
	try{
//		let {nameGroup, name, path, initParams, fInit, fInitParams, fShow, fShowParams, fCallBack, fCallBackParams} = ctrConfig;
//		cách khai báo trên phải truyền đủ, không là sai
		
		let nameGroup		= ctrConfig.nameGroup		? ctrConfig.nameGroup		: ctrConfig.grpName; 
		let name			= ctrConfig.name	 		? ctrConfig.name	 		: ctrConfig.ctrlName;
		let path			= ctrConfig.path	 		? ctrConfig.path	 		: ctrConfig.ctrlPath;
		let initParams 		= ctrConfig.initParams		? ctrConfig.initParams		: ctrConfig.ctrlParams;
		let fCallBackParams = ctrConfig.fCallBackParams ? ctrConfig.fCallBackParams	: [];
		let fInit 			= ctrConfig.fInit;
		let fInitParams 	= ctrConfig.fInitParams;
		let fShow 			= ctrConfig.fShow;
		let fShowParams 	= ctrConfig.fShowParams;
		let fCallBack 		= ctrConfig.fCallBack;
		
		if (App.network){
			App.network.do_lc_add_loader();
		}
		
		
		requirejs([path], function(ctrl){			
			if (!AppVar	[nameGroup])
				AppVar	[nameGroup] = {};
			
			if (!initParams)
				initParams		= [];
			
			if (!AppVar	[nameGroup][name])	
				AppVar	[nameGroup][name]		= new ctrl(...initParams);
			if (!fInitParams)		fInitParams		=  [];
			if (!fShowParams)		fShowParams		=  [];
						
			if (fInit		) 	AppVar[nameGroup][name][fInit](...fInitParams);
			if (fShow		) 	AppVar[nameGroup][name][fShow](...fShowParams);
			
			if (!fCallBackParams)	fCallBackParams	=  [];
			if (fCallBack	)	fCallBack(...fCallBackParams);
			
			if (App.network){
				App.network.do_lc_remove_loader();
			}
		})
	}catch(e){
		console.log("do_gl_load_JSController_ByRequireJS:"+ e);
	}	
}
//-----------------------------------------------------
//----------------------------------------------------
//Returns a function, that, as long as it continues to be invoked, will not
//be triggered. The function will be called after it stops being called for
//N milliseconds. If `immediate` is passed, trigger the function on the
//leading edge, instead of the trailing.
var var_gl_timeout;
const do_gl_execute_debounce = (func, wait = 500, params = []) => {
	clearTimeout(var_gl_timeout);
	var_gl_timeout = setTimeout(func, wait, ...params);
};
//----------------------------------------------------
//----------------------------------------------------
//Lấy vị trí scroll hiện tại của phần tử, mặc định là phần tử window
const req_gl_ScrollPosition = (el = window) => ({
	x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
			y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
});
//-- scroll mượt hơn khi lên đầu trang với smooth = true
const do_gl_scrollToTop = function (smooth){
	if(window.scrollY<50) return;
	if (!smooth) 
		window.scrollTo(0, 0);
	else{
		const c = document.documentElement.scrollTop || document.body.scrollTop;
		if (c > 0) {
			window.requestAnimationFrame(do_gl_scrollToTop);
			window.scrollTo(0, c - c / 8);
		}
	}	
}
const do_gl_scrollToEle = function (element){
	document.querySelector(element).scrollIntoView({ behavior: "smooth" });
}
//----------------------------------------------------
//----------------------------------------------------
//kiểm tra phần tử có nằm trong viewport hay không, nằm toàn bộ hay 1 phần
const can_gl_VisibleInViewport = (el, partiallyVisible = false) => {
	const { top, left, bottom, right } 	= el.getBoundingClientRect();
	const { innerHeight, innerWidth } 	= window;
	return partiallyVisible
	? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
			((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
			: top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};
//------AJAX Tool----------------------------------------------
//tạo 1 data Send ajax với nhiều object params
const req_gl_Request_Content_Send_With_Params = (serviceClass, serviceName, ...params) => {
	const {SV_CLASS: svClass, SV_NAME: svName, SESS_ID: sessId, USER_ID: userId} = App['const'];
	let ref = {
			[svClass]	: serviceClass, 
			[svName]	: serviceName, 
			[sessId]	: App.data.session_id,
			[userId]	: App.data.user ? App.data.user.id : -1
	};
	if(params && params.length){
		ref = Object.assign(ref, ...params);
	}
	return ref;
}
//call ajax success
const can_gl_AjaxSuccess = (sharedJson) => sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES;
const can_gl_AjaxSuccessAll = sharedJsons => {
	for(let sharedJson of sharedJsons){
		if(!can_gl_AjaxSuccess(sharedJson))	return false;
	}
	return true;
}
//----------------------------------------------------
//----------------------------------------------------
//get lat long of addresse with google map, return promise
const req_gl_Location_addr = address => {
	return new Promise((resolve, reject) => {
		let geocoder = new google.maps.Geocoder();
		geocoder.geocode({address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK && results.length) {
				let {location} 	= results[0].geometry;
				let lat 		= parseFloat((location.lat()).toFixed(5));
				let lng 		= parseFloat((location.lng()).toFixed(5));
				resolve({lat, lng});
			} else{
				reject(status);
			}
		});
	})
}
//format number ##.###,##
const do_gl_addCommas = nStr =>{
	nStr 	+= '';
	x 		= nStr.split('.');
	x1 		= x[0];
	x2 		= x.length > 1 ? '.' + x[1] : '';
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 	= x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
//add TreeView.
$.fn.extend({
	treed: function (o) {
		let openedClass = 'mdi-chevron-down-box';
		let closedClass = 'mdi-chevron-right-box';
		if (typeof o != 'undefined'){
			if (typeof o.openedClass != 'undefined'){
				openedClass = o.openedClass;
			}
			if (typeof o.closedClass != 'undefined'){
				closedClass = o.closedClass;
			}
		};
		//initialize each of the top levels
		let tree = $(this);
		tree.addClass("tree");
		tree.find('li').has("ul").each(function () {
			var branch = $(this); //li with children ul
			var posAdd = branch;
			
			var firstDiv = $(this).find('> div.row:first');
			if (firstDiv.length>0) {
				posAdd = firstDiv.find('div:first');
			}
			
			posAdd.prepend("<i class='font-size-18 text-info indicator mdi " + closedClass + "'></i>");
			branch.addClass('branch');
			branch.not("span").on('click', function (e) {
				if (this == e.target) {
					var icon = $(this).children('i:first');
					icon.toggleClass(openedClass + " " + closedClass);
					$(this).find("ul:first").children().toggle();
				}
			})
			branch.find("ul:first").children().toggle();
		});
		//fire event from the dynamically added icon
		tree.find('.branch .indicator').each(function(){
			$(this).on('click', function () {
				$(this).closest('li').click();
			});
		});
		//fire event to open branch if the li contains an anchor instead of text
		tree.find('.branch>a').each(function () {
			$(this).on('click', function (e) {
				$(this).closest('li').click();
				e.preventDefault();
			});
		});
		//fire event to open branch if the li contains a button instead of text
		tree.find('.branch>button').each(function () {
			$(this).on('click', function (e) {
				$(this).closest('li').click();
				e.preventDefault();
			});
		});
	}
});
const do_gl_init_repeater = () => {
	$(".outer-repeater").repeater({
        defaultValues: {
            "text-input": "outer-default"
        },
        show: function() {
            console.log("outer show"),
            $(this).slideDown()
        },
        hide: function(e) {
            console.log("outer delete"),
            $(this).slideUp(e)
        },
        repeaters: [{
            selector: ".inner-repeater",
            defaultValues: {
                "inner-text-input": "inner-default"
            },
            show: function() {
                console.log("inner show");
                const time = new Date().getTime();
                $(this).find(".objData").attr("data-name", `item${time}`);
                $(this).slideDown();
            },
            hide: function(e) {
                console.log("inner delete"),
                $(this).slideUp(e)
            }
        }]
    })
}
var req_gl_Ent_By_Id_From_Arr = function(id, arr) {
	var ent	= arr.find(o => o.id === id);
	return ent;
}
var req_gl_numberFormat = function(num, decimal) {
	
	if (!num) return num;
	if (!decimal) decimal=0;
	return num.toFixed(decimal).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
//-------Msg Tool-----------------------------------------------------------------------------
const do_gl_init_msgbox_annonce = (content, fCallback, title = $.i18n("common_btn_message")) => {
	App.MsgboxController.do_lc_show({
		title,
		content,
		autoclose	: false,
		width       : "80%",
		buttons 	: {
			OK : {
				lab 		: $.i18n("common_btn_ok"),
				funct 		: fCallback ? fCallback : null,
				classBtn	: "btn-primary",
			}
		}
	});
}
const do_gl_init_msgbox_confirm = (content, fCallback) => {
	App.MsgboxController.do_lc_show({
		title 		: $.i18n("common_btn_validate"),
		content 	: content,
		autoclose	: false,
		buttons 	: {
			OK : {
				lab 		: $.i18n("common_btn_ok"),
				funct 		: fCallback ? fCallback : null,
				classBtn	: "btn-primary",
			},
			EXIT: {
				lab 		: $.i18n("common_btn_cancel")
			}
		}
	});
}
const do_gl_copyToClipboard = text => {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        let textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}
//-------File Tool-----------------------------------------------------------------------------
const pr_sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
const req_gl_FileSize = (size) => {
	const bytes = +size;
	if (bytes === 0) return '0 Byte';
	
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + pr_sizes[i];
}
//-------URL Tool-----------------------------------------------------------------------------
const req_gl_Url_Params= function(sPageURL){
	if (!sPageURL) sPageURL = decodeURIComponent(window.location.search.substring(1));
	
	var sURLVariables 	= sPageURL?sPageURL.split('&'):[];    
	if (!sURLVariables) return {};
	
	var	param			= {};	
	for (i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		param[sParameterName[0]] = sParameterName[1];					
	}
	return param;						
}
//encode String
const req_gl_strToURL = function(encodeStr) {
	try {
		encodeStr = encodeStr.toString().toLowerCase().trim();
		encodeStr = encodeStr.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g	, "a");
		encodeStr = encodeStr.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g			, "e");
		encodeStr = encodeStr.replace(/ì|í|ị|ỉ|ĩ/g							, "i");
		encodeStr = encodeStr.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o");
		encodeStr = encodeStr.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g				, "u");
		encodeStr = encodeStr.replace(/ỳ|ý|ỵ|ỷ|ỹ/g							, "y");
		encodeStr = encodeStr.replace(/đ/g									, "d");
		encodeStr = encodeStr.replace(/[^\w\s]/g							, "");
		encodeStr = encodeStr.replace(/\(|\)|\:/g							, "");
		encodeStr = encodeStr.replace(/\//g									, "-");
		encodeStr = encodeStr.replace(/^\-+|\-+$/g							, "");
		encodeStr = encodeStr.replace(/ /g									, "-");
		encodeStr = encodeStr.replace(/-+-/g								, "-");
		return encodeStr;
	} catch (err) {
		return "";
	}
};
//--------------------------------------
//----Slider Tool------------------------------------------------
const do_gl_show_HeaderSlider= function( timewait, divSlide, slides, slideIndex) {
	if (!timewait)					timewait = 3000;
	if (!slides){
		slides =$(divSlide);
		for (var i = 0; i < slides.length; i++) {
			slides[i].style.display = "none";  
		}
	}
	if (!slides)					return;
	if (slides.length==0)			return;
	if (!slideIndex) 				slideIndex = 1;
	if (slideIndex>slides.length) 	slideIndex = 1;
//	slides[slideIndex-1].style.display = "block";  
	$(slides[slideIndex-1]).fadeIn(1000);
	if (slides.length>1){
		setTimeout(function(){
			$(slides[slideIndex-1]).fadeOut(1000);
			slideIndex++;
			do_gl_show_HeaderSlider (timewait, divSlide, slides, slideIndex);  
		}, timewait);// Change image every 3,5 seconds
	}
}
//--------------------------------------
//----Touch Slider Tool------------------------------------------------
var swipers = [];
var do_gl_initSwiper = function(){
	var initIterator = 0;
	
	$('.swiper-container').not('.initialized').each(function(){								  
		var $t = $(this);								  
		var index = 'swiper-unique-id-'+initIterator;
		$t.addClass('swiper-'+index+' initialized').attr('id', index);
		$t.find('>.swiper-pagination').addClass('swiper-pagination-'+index);
		// $t.find('>.swiper-button-prev').addClass('swiper-button-prev-'+index);
		// $t.find('>.swiper-button-next').addClass('swiper-button-next-'+index);
		if($t.find('>.swiper-button-prev').length){
			$t.find('>.swiper-button-prev').addClass('swiper-button-prev-'+index);
			$t.find('>.swiper-button-next').addClass('swiper-button-next-'+index);
		}
		else{
			$t.parent().find('>.swiper-button-prev').addClass('swiper-button-prev-'+index);
			$t.parent().find('>.swiper-button-next').addClass('swiper-button-next-'+index);
		}
		var slidesPerViewVar = ($t.data('slides-per-view'))?$t.data('slides-per-view'):1,
			loopVar = ($t.data('loop'))?parseInt($t.data('loop'), 10):0;
		if(slidesPerViewVar!='auto') slidesPerViewVar = parseInt(slidesPerViewVar, 10);
		swipers['swiper-'+index] = new Swiper('.swiper-'+index,{
			pagination: '.swiper-pagination-'+index,
	        paginationClickable: true,
	        nextButton: '.swiper-button-next-'+index,
	        prevButton: '.swiper-button-prev-'+index,
	        slidesPerView: slidesPerViewVar,
	        autoHeight: ($t.is('[data-auto-height]'))?parseInt($t.data('auto-height'), 10):0,
	        loop: loopVar,
			autoplay: ($t.is('[data-autoplay]'))?parseInt($t.data('autoplay'), 10):0,
			centeredSlides: ($t.is('[data-center]'))?parseInt($t.data('center'), 10):0,
	        breakpoints: ($t.is('[data-breakpoints]'))? { 767: { slidesPerView: parseInt($t.attr('data-xs-slides'), 10) }, 991: { slidesPerView: parseInt($t.attr('data-sm-slides'), 10) }, 1199: { slidesPerView: parseInt($t.attr('data-md-slides'), 10) }, 1370: { slidesPerView: parseInt($t.attr('data-lt-slides'), 10) } } : {},
	        initialSlide: ($t.is('[data-ini]'))?parseInt($t.data('ini'), 10):0,
	        watchSlidesProgress: true,
	        speed: ($t.is('[data-speed]'))?parseInt($t.data('speed'), 10):500,
	        parallax: ($t.is('[data-parallax]'))?parseInt($t.data('parallax'), 10):0,
	        slideToClickedSlide: ($t.is('[data-click]'))?parseInt($t.data('click'), 10):0,
	        keyboardControl: true,
	        mousewheelControl: ($t.data('mousewheel'))?parseInt($t.data('mousewheel'), 10):0,
	        mousewheelReleaseOnEdges: false,
	        direction: ($t.is('[data-direction]'))?$t.data('direction'):'horizontal',
	        preloadImages: false,
	        lazyLoading: true,
	        lazyLoadingInPrevNext: ($t.data('direction')=='vertical')?true:false,
	        lazyLoadingInPrevNextAmount: ($t.data('direction')=='vertical')?100:1,
	        spaceBetween: ($t.is('[data-space]'))?$t.data('space'):0,
	        touchEventsTarget:($t.is('[data-touch]'))?'wrapper':'container',
//	    	        onlyExternal:true,
//	    	simulateTouch:false,
	        		resistanceRatio: 0
		});
		swipers['swiper-'+index].update();
		initIterator++;
	});
	$('.swiper-container.swiper-control-top').each(function(){
		swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swipers-couple-wrapper').find('.swiper-control-bottom').attr('id')];
	});
	$('.swiper-container.swiper-control-bottom').each(function(){
		swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swipers-couple-wrapper').find('.swiper-control-top').attr('id')];
	});
};
var req_gl_Capitalize = function (str){
	if (!str) return "";
	if (str.length==0) return "";
	str = str.trim();
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
/*
Object.defineProperty(String.prototype, 'capitalize', {
	value: function() {
		if (this.length==0) return "";
		
    	return this.charAt(0).toUpperCase() + this.slice(1);
	},
	enumerable: false,
	configurable: true
});*/


//-----WebContent/www/js/app/common/ctrl/NetworkController.js------------------------------
/*--version 1.1.1 ----*/
var Network = function() {	
	const FUNCT_SCOPE	= AppCommon['const'].	FUNCT_SCOPE;
	const FUNCT_NAME	= AppCommon['const'].	FUNCT_NAME;
	const FUNCT_PARAM	= AppCommon['const'].	FUNCT_PARAM;
	const ROUTE			= AppCommon.keys.KEY_STORAGE_CREDENTIAL;
	//	f* can be simple function : F1, or array a function : [F1, F2..] => f1[scope: variable_where_funct_in, name: functname, param: []]
	//  struct of f: fname(sharedJson, params )
	//  f set errorcode in sharedJson if something wrong
	//	res: logged: true/false  appCode: int  data: []	
	var self 	= this;		
	var compDom = COMP_DOM; //thieu 1 trong 2 deu khong chay
	var appName	= APP_NAME;
	//------------------------------------------------------------------
	/*	var opt = {
							isBg		: true,
							ajaxUrl		: App.path.BASE_URL_API_PUBL,
							ajaxHeader	: null,
							svClass		: "ServiceTpyCategoryPubl",
							svName		: "SVLstCat",
							svParams	: {
								parType 	: pr_TYPE_CATEGORY_JOB,
								treeType 	: true,
								withCount 	: true
							},
							dataName	: "cats",
							fCallback 	: doBindingCats,
							fParams		: [array]
							fSucces		: doSomethingWhenRespCodeOK
							fSuccesParam: [array]
							fFail		: doSomethingWhenRespCodeNotOK
							fFailParam	: [array]
					}
	 */
	this.do_lc_ajax_Opt = function (options) {
		var ref         = req_gl_Request_Content_Send(options.svClass, options.svName);
		ref				= $.extend(true, {}, ref, options.svParams);
		var fSucces = [];
		fSucces.push(req_gl_funct(null, do_Ajax_Resp, [options]));
		var fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
		if (options.isBg)
			this.do_lc_ajax_bg(options.ajaxUrl, options.ajaxHeader, ref, 100000, fSucces, fError);
		else
			this.do_lc_ajax	  (options.ajaxUrl, options.ajaxHeader, ref, 100000, fSucces, fError);
	}
	var do_Ajax_Resp = function (sharedJson, options) {
		var code = sharedJson[App["const"].SV_CODE];
		App.data['ajaxResp'] = sharedJson;
		if (code == App['const'].SV_CODE_API_YES) {
			if (!App.data) App.data = {};
			if (options.dataName)  App.data[options.dataName] = sharedJson[App['const'].RES_DATA];
			if (options.fCallback) options.fCallback.apply(null, options.fParams); 
			if (options.fSucces) options.fSucces.apply(null, options.fSuccesParam); 
		}else{
			if (options.fFail) 
				options.fFail.apply(null, options.fFailParam);
			else{
				var msg = $.i18n("common_err_ajax")+ " (" + code + ")";
				do_gl_show_Notify_Msg_Error(msg);
			}
		}
	}
	//-------------------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------
	this.do_lc_ajax_when = function(urlAPI, header, data,  timeWaitMax, fSucces, fError) {	
		let lstAjax = [];
		data.map(d => {
			let deferredItem = this.ajax_when(urlAPI, header, d, timeWaitMax);
			lstAjax.push(deferredItem);
		})
		Promise.all(lstAjax)
		.then(result => {
			for(let objFunct of fSucces){
				objFunct.fName(result, ...objFunct.fParams);
			}
		})
		.catch(err => {
			fError.fName(err, ...fError.fParams)
		})
	}
	this.ajax_when = function(urlAPI, header, data, timeWaitMax) {	
		return new Promise((resolve, reject) => {
			if (timeWaitMax<=0) timeWaitMax = 1000*60*60; //1h
			if (typeof  data === 'string' || data instanceof String) data = data.split("null").join("");
			do_gl_LS_SecurityInfo_Save_Time(ROUTE);
			this.startLoader();
			let fStopLoader	= {[FUNCT_SCOPE]: this, [FUNCT_NAME]: this.stopLoader, [FUNCT_PARAM]: []}; 
			checkDataToSend(data);
			$.ajax({
				type		: 'POST',
				dataType 	: "json",
				url			: urlAPI,      
				timeout		: timeWaitMax,
				data 		: JSON.stringify(data), 
				headers		: header
			}).done((res, statut) => {
				(!compDom || !appName) 												&& reject("No compDom or no appName");
				(compDom.indexOf(AUTHOR_NAME)<0 && compDom.indexOf(CLIENT_NAME)<0) 	&& reject("No AUTHOR_NAME or no CLIENT_NAME");
				(appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	&& reject("No IDEA_NAME or no PROJ_NAME");
				try{
					var resJson		= reqParseJson(res);
					if (!isLogged(resJson)) execute(fStopLoader);
					resolve(resJson);
				}catch(e){
					errLog (resJson, e);
					execute (fStopLoader);
					reject(e);
				}
			}).fail((res, statut, erreur) => {
				execute (fStopLoader);
				reject(erreur);
			}).always((res, statut) => {
				execute(fStopLoader);
			});
		})
	};
	//-------------------------------------------------------------------------------------------------------------------
	//-------------------------------------------------------------------------------------------------------------------
	//--do ajax post request with data
	this.do_lc_ajax = function(urlAPI, header, data,  timeWaitMax, fSucces, fError) {	
		this.ajax (urlAPI, header, data,  timeWaitMax, fSucces, fError);
	}
	//--do ajax request by type: Get, Post
	this.do_lc_ajax_type = function(urlAPI, header, data,  typeSend,  timeWaitMax, fSucces, fError) {	
		this.ajaxWithType(urlAPI, header, data,  typeSend,  timeWaitMax, fSucces, fError);
	}
	//--do ajax post request with form data
	this.do_lc_ajax_form = function(urlAPI, header, data,  timeWaitMax, fSucces, fError) {	
		this.ajaxUpFile(urlAPI, header, data,  timeWaitMax, fSucces, fError);
	}
	//--do ajax request in background
	this.do_lc_ajax_bg = function(urlAPI,  header, data,  timeWaitMax, fSucces, fError) {
		this.ajaxBackground(urlAPI,  header, data,  timeWaitMax, fSucces, fError) ;
	}
	//--do ajax request in background
	this.do_lc_ajax_background = function(urlAPI,  header, data,  timeWaitMax, fSucces, fError) {
		this.ajaxBackground(urlAPI,  header, data,  timeWaitMax, fSucces, fError) ;
	}
	//--when err connexion, no logout
	this.do_lc_ajax_bg_keepState = function(urlAPI,  header, data,  timeWaitMax, fSucces, fError) {
		this.ajaxBackground_NoLogout(urlAPI,  header, data,  timeWaitMax, fSucces, fError) ;
	}
	//--add a loader image
	this.do_lc_add_loader= function () {
		this.startLoader();
	}
	//--remove a loader image
	this.do_lc_remove_loader = function () {
		this.stopLoader();
	}
	
	this.do_lc_reset_loader = function () {
		this.stopLoaderAll();
	}
	
	//---do a task and lock every event with loader in timeoutMax
	this.do_lc_task_loader = function (task, params, timeoutMax) {
		this.startTask(task, timeoutMax, params);
	}		
	//-------------------------------------------------------------------------------------------------------------------
	//-------------------------------------------------------------------------------------------------------------------
	//-------------------------------------------------------------------------------------------------------------------
	//-------------------------------------------------------------------------------------------------------------------
	this.ajax = function(urlAPI, header, data,  timeWaitMax, fSucces, fError) {	
		if (timeWaitMax<=0) timeWaitMax = 1000*60*60; //1h
		if (typeof  data === 'string' || data instanceof String) data = data.split("null").join("");
		do_gl_LS_SecurityInfo_Save_Time(ROUTE);
		this.startLoader();
		var fStopLoader		= {}; 
		fStopLoader[FUNCT_SCOPE]= this; fStopLoader[FUNCT_NAME]=this.stopLoader; fStopLoader[FUNCT_PARAM]=[];
		checkDataToSend(data);
		$.ajax({
			type		: 'POST',
			contentType : "application/json",
			dataType	: "json",
			url			: urlAPI,      
			timeout		: timeWaitMax,
			data 		: JSON.stringify(data), 
			headers		: header, 				
			success		: function(res, statut){ // code_html contient le HTML renvoyé
				if (!fSucces) return;
				if (!compDom || !appName) return;
				if (compDom.indexOf(AUTHOR_NAME)<0 	&& compDom.indexOf(CLIENT_NAME)<0) 	return;
				if (appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	return;
				try{
					var resJson		= reqParseJson(res);
					if (isLogged(resJson)){	
//						decodeUTF8AllLevel(resJson);
						queue 	(fSucces, fError, fStopLoader , resJson, 100);								
					}else{
						execute (fStopLoader);	
					}
				}catch(e){
					errLog (resJson, e);
					execute (fStopLoader);
				}
			},
			error 		: function(res, statut, erreur){					
				if (fError) execute (fError, [res, statut, erreur]);
				execute (fStopLoader);				
			},
			complete	: function(res, statut){					
			}
		});				
	};
	//-------------------------------------------------------------------------------------------------
	this.ajaxWithType = function(urlAPI, header, data,  typeSend,  timeWaitMax, fSucces, fError) {	
		if (timeWaitMax<=0) timeWaitMax = 1000*60*60; //1h
		if (typeof  data === 'string' || data instanceof String) data = data.split("null").join("");
		do_gl_LS_SecurityInfo_Save_Time(ROUTE);
		this.startLoader();
		var fStopLoader		= {}; 
		fStopLoader[FUNCT_SCOPE]= this; fStopLoader[FUNCT_NAME]=this.stopLoader; fStopLoader[FUNCT_PARAM]=[];
		checkDataToSend(data);
		if (!typeSend) typeSend = 'POST';
		$.ajax({
			type		: typeSend,
			contentType : "application/json",
			dataType	: "json",
			url			: urlAPI,      
			timeout		: timeWaitMax,
			data 		: JSON.stringify(data), 
			headers		: header, 				
			success		: function(res, statut){ // code_html contient le HTML renvoyé
				if (!fSucces) return;
				if (!compDom || !appName) return;
				if (compDom.indexOf(AUTHOR_NAME)<0 	&& compDom.indexOf(CLIENT_NAME)<0) 	return;
				if (appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	return;
				try{
					//var resJson 	=  $.parseJSON(res);	
					var resJson		= reqParseJson(res);
					if (isLogged(resJson)){	
//						decodeUTF8AllLevel(resJson);
						queue 	(fSucces, fError, fStopLoader , resJson, 100);								
					}else{
						execute (fStopLoader);	
					}
				}catch(e){
					errLog (resJson, e);
					execute (fStopLoader);
				}
			},
			error 		: function(res, statut, erreur){					
				if (fError) execute (fError, [res, statut, erreur]);
				execute (fStopLoader);				
			},
			complete	: function(res, statut){					
			}
		});				
	};
	//-------------------------------------------------------------------------------------------------
	this.ajaxForm = function(urlAPI, header, data,  timeWaitMax, fSucces, fError) {	
		this.ajaxUpFile(urlAPI, header, data,  timeWaitMax, fSucces, fError);
	}
	this.ajaxUpFile = function(urlAPI, header, data,  timeWaitMax, fSucces, fError) {	
		if (timeWaitMax<=0) timeWaitMax = 1000*60*60*24; //24h
		do_gl_LS_SecurityInfo_Save_Time(ROUTE);
		this.startLoader();
		var fStopLoader		= {}; 
		fStopLoader[FUNCT_SCOPE]= this; fStopLoader[FUNCT_NAME]=this.stopLoader; fStopLoader[FUNCT_PARAM]=[];
		checkDataToSend(data); 			
		$.ajax({
			type		: 'POST',				
			url			: urlAPI,      
			timeout		: timeWaitMax,
			data 		: data, 
			headers		: header, 	
			cache		: false,
			contentType	: false,
			processData	: false,
			success		: function(res, statut){ // code_html contient le HTML renvoyé
				if (!fSucces) return;
				if (!compDom || !appName) return;
				if (compDom.indexOf(AUTHOR_NAME)<0 	&& compDom.indexOf(CLIENT_NAME)<0) 	return;
				if (appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	return;
				try{
					//var resJson 	=  $.parseJSON(res);	
					var resJson		= reqParseJson(res);
					if (isLogged(resJson)){	
//						decodeUTF8AllLevel(resJson);
						queue 	(fSucces, fError, fStopLoader , resJson, 100);								
					}else{
						execute (fStopLoader);	
					}	
				}catch(e){
					errLog (resJson, e);
					execute (fStopLoader);
				}
			},
			error 		: function(res, statut, erreur){					
				if (fError) execute (fError, [res, statut, erreur]);
				execute (fStopLoader);				
			},
			complete	: function(res, statut){					
			}
		});			
	};
	//-------------------------------------------------------------------------------------------------
	this.ajaxBackground = function(urlAPI,  header, data,  timeWaitMax, fSucces, fError) {	
		if (timeWaitMax<=0) timeWaitMax = 1000*60*60; //1h
		if (typeof  data === 'string' || data instanceof String) data = data.split("null").join("");
		do_gl_LS_SecurityInfo_Save_Time(ROUTE);
		checkDataToSend(data);
		$.ajax({
			type		: 'POST',
			contentType : "application/json",
			dataType	: "json",
			url			: urlAPI,      
			timeout		: timeWaitMax,
			data 		: JSON.stringify(data), 
			headers		: header, 
			success		: function(res, statut){ // code_html contient le HTML renvoyé
				if (!fSucces) return;
				if (!compDom || !appName) return;
				if (compDom.indexOf(AUTHOR_NAME)<0 	&& compDom.indexOf(CLIENT_NAME)<0) 	return;
				if (appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	return;
				try{
					//var resJson 	=  $.parseJSON(res);
					var resJson		= reqParseJson(res);
					if (isLogged(resJson)){	
//						decodeUTF8AllLevel(resJson);
						queue 	(fSucces, fError, null , resJson, 100);								
					}
				}catch(e){
					errLog (resJson, e);						
				}
			},
			error 		: function(res, statut, erreur){		
				console.log ("--- err : " + data.sv_class +" " + data.sv_name);
				if (fError) execute (fError, [res, statut, erreur]);						
			},
			complete	: function(res, statut){					
			}
		});
		//ev.preventDefault();
	};
	this.ajaxBackground_NoLogout = function(urlAPI,  header, data,  timeWaitMax, fSucces, fError) {	
		if (timeWaitMax<=0) timeWaitMax = 1000*60*60; //1h
		if (typeof  data === 'string' || data instanceof String) data = data.split("null").join("");
		do_gl_LS_SecurityInfo_Save_Time(ROUTE);
		checkDataToSend(data);
		$.ajax({
			type		: 'POST',
			contentType : "application/json",
			dataType	: "json",
			url			: urlAPI,      
			timeout		: timeWaitMax,
			data 		: JSON.stringify(data), 
			headers		: header, 
			success		: function(res, statut){ // code_html contient le HTML renvoyé
				if (!fSucces) return;
				if (!compDom || !appName) return;
				if (compDom.indexOf(AUTHOR_NAME)<0 	&& compDom.indexOf(CLIENT_NAME)<0) 	return;
				if (appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	return;
				try{
					//var resJson 	=  $.parseJSON(res);
					var resJson		= reqParseJson(res);
					if (isLoggedAndDoNothing(resJson)){	
//						decodeUTF8AllLevel(resJson);
						queue 	(fSucces, fError, null , resJson, 100);								
					}
				}catch(e){
					errLog (resJson, e);						
				}
			},
			error 		: function(res, statut, erreur){					
				if (fError) execute (fError, [res, statut, erreur]);						
			},
			complete	: function(res, statut){					
			}
		});
		//ev.preventDefault();
	};
	//-------------------------------------------------------------------------------------------------
	this.do_lc_ajax_req_file = function(urlAPI,  header, data,  timeWaitMax, fSucces, fError) {
		if (timeWaitMax<=0) timeWaitMax = 1000*60*60; //1h
		if (typeof  data === 'string' || data instanceof String) data = data.split("null").join("");
		do_gl_LS_SecurityInfo_Save_Time(ROUTE);
		$.ajax({
			type		: 'GET',
			dataType 	: 'text',
			url			: urlAPI,      
			timeout		: timeWaitMax,
			data 		: JSON.stringify(data), 
			headers		: header, 
			success		: function(res, statut){ // code_html contient le HTML renvoyé
				if (!fSucces) return;
				if (!compDom || !appName) return;
				if (compDom.indexOf(AUTHOR_NAME)<0 	&& compDom.indexOf(CLIENT_NAME)<0) 	return;
				if (appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	return;
				try{
					//var resJson 	=  $.parseJSON(res);
					var resJson		= reqParseJson(res);
//					decodeUTF8AllLevel(resJson);
					queue 	(fSucces, fError, null , resJson, 100);
				}catch(e){
					errLog (resJson, e);						
				}
			},
			error 		: function(res, statut, erreur){					
				if (fError) execute (fError, [res, statut, erreur]);						
			},
			complete	: function(res, statut){					
			}
		});
	}
	//-------------------------------------------------------------------------------------------------
	var errLog = function (resJson, e){
		console.log("----- something wrong with response-Json: " + resJson+ " :: "+ e +". If the response JSON is empty, we cannot parse it.");
	}
	var isLogged = function (res){
		if (!res.sess_stat){
			if (res.sv_code != 0)
				self.doWhenLoggedByError();
			else
				self.doWhenLogged();
			do_gl_show_Notify_Msg_Error ($.i18n("login_err_authentification"));
			return false;
		}		
		return true;
	};
	var isLoggedAndDoNothing = function (res){
		if (!res.sess_stat){				
			return false;
		}		
		return true;
	};
	var isLoggedOrDoLogIn = function (res, fLogin, loginParams){
		if (!res.sess_stat){
			fLogin.apply(null, loginParams);	
			do_gl_show_Notify_Msg_Error ($.i18n("common_err_ajax"));
			return false;
		}		
		return true;
	};
	this.doWhenLoggedByError = function(){
//		localStorage.clear();	
		try{
			do_gl_LocalStorage_Remove (App.keys.KEY_STORAGE_CREDENTIAL);
		}catch(e){}		
		App.router.controller.do_lc_run(App.router.routes.HOME);
		//alert("Log out");
	};
	this.doWhenLogged = function(){
//		localStorage.clear();	
		try{
			do_gl_LocalStorage_Remove (App.keys.KEY_STORAGE_CREDENTIAL);
		}catch(e){}		
		App.router.controller.do_lc_run(App.router.routes.HOME);
		//alert("Log out");
	};
	//----------------------------------------------------------------------------------------------------
	var reqParseJson= function(res){				
		var type = typeOfObject (res);
		switch(type){			
		case O_TYPE_OBJ		: 
		case O_TYPE_ARRAY	: 
			decodeUTF8AllLevel (res)
			return res;
		case O_TYPE_STRING	: 
//			res = decodeUTF8Str(res); break;
		}		
		var resJson 	= "{}";
		if (!res) return resJson;
		try{
			resJson 	=  JSON.parse(res);		
			decodeUTF8AllLevel (resJson);
		}catch(e){
			console.log("--err in parseJson : "+ res);
			var p =res.indexOf("}");
			if (p>0){
				resJson 	=  JSON.parse(res.substring(0,p+1));					
			}
		}		
		return resJson;
	}
	//----------------------------------------------------------------------------------------------------
	var checkDataToSend = function (data){
		try{
			for (var k in data){
				var d = data[k];
				if (d ){
					if (d instanceof Date) {
						data[k] = DateFormat(d, DateFormat.masks.isoDateTime);	
					} 
				}
			}
		}catch(e){}			
	}
	/*
		function canJSON(value) {
		    try {
		        JSON.stringify(value);
		        return true;
		    } catch (ex) {
		        return false;
		    }
		}
	 */
	//----------------------------------------------------------------------------------------------------
	var ajaxLoader = function (el, options) {
		// Becomes this.options
		var defaults = {
//				bgColor 		: 'transparent',
				duration		: 100,
//				opacity			: 0.6,
				classOveride 	: false
		};
		this.options 	= $.extend(defaults, options);
		this.container 	= $(el);
		this.init = function() {
			var container = this.container;
			// Delete any other loaders
			this.remove();
			// Create the overlay
			var height = container.height();
			if (height<container.scrollHeight)  height=container.scrollHeight;
			if (height<1080) height =1080;
			var overlay = $('<div></div>').css({
//				'background-color'	: this.options.bgColor,
//				'opacity'			: this.options.opacity,
//				'width'				: container.width(),
//				'height'			: height, //container.height(),
//				'position'			: 'fixed',
//				'top'				: '0px',
//				'left'				: '0px',
//				'z-index'			: 99999
			}).addClass('ajax_overlay');
			// add an overiding class name to set new loader style
			if (this.options.classOveride) {
				overlay.addClass(this.options.classOveride);
			}
			// insert overlay and loader into DOM
			container.append(
					overlay.append(
							$('<div></div>').addClass('ajax_loader')
					).fadeIn(this.options.duration)
			);
		};
		this.remove = function(){
			var overlay = this.container.children(".ajax_overlay");
			if (overlay.length) {
				overlay.fadeOut(this.options.classOveride, function() {
					overlay.remove();
				});
			}
		};
		this.init();
	};
	this.loader		= null;
	this.loaderUp 	= 0;
	this.startLoader= function () {
		if (this.loaderUp == 0) {
			this.loader = new ajaxLoader($('body'));
		}
		this.loaderUp++;    
	};
	this.stopLoader= function() {
		this.loaderUp--;
		if (this.loaderUp <= 0) {
			this.loaderUp = 0;
			if (this.loader)  this.loader.remove();
		}	
	};
	this.stopLoaderAll= function() {
		this.loaderUp = 0;
		if (this.loader)  this.loader.remove();
	};
	this.loaderDiv		= null;
	this.loaderUpDiv 	= 0;
	this.doStartLoaderDiv= function () {
		if (this.loaderUpDiv == 0) {
			this.loaderDiv = new ajaxLoader($('loaderDiv'));
		}
		this.loaderUpDiv++;    
	};
	this.doStopLoaderDiv= function() {
		this.loaderUpDiv--;
		if (this.loaderUpDiv <= 0) {
			this.loaderUpDiv = 0;
			if (this.loaderDiv)  this.loaderDiv.remove();
		}	
	};
	//--------------------------------------
	this.startTask  = function(nextTask, timeoutMax, paramArray) {
		if (!timeoutMax) timeoutMax = 0;
		this.loader = new ajaxLoader($('body'));
		if (nextTask){
			setTimeout(function(){nextTask.apply(paramArray);}, 300);
			if (timeoutMax>0) setTimeout(stopLoader, timeoutMax);
		}
	};
	//---------decodeur utf8 from serveur --------------------------------------------------------------------
	this.decodeUTF8 = function(object){	
		decodeUTF8AllLevel (object);
		return object;
	}
	this.req_lc_DecodeUTF8 = function(object){	
		decodeUTF8AllLevel (object);
		return object;
	}
	function decodeUTF8OneLevel(json){
		for (var k in json){
			var val = json[k];
			if (typeof val == 'string' || val instanceof String) 
				json[k] = decodeUTF8Str(json[k]);		
		}
	}
	function decodeUTF8AllLevel(object){	
		for (var k in object){
			var val = object[k];		
			var type = typeOfObject (val);
			switch(type){
			case O_TYPE_STRING	: object[k] = decodeUTF8Str(object[k]); break;
			case O_TYPE_OBJ		: decodeUTF8AllLevel (object[k]);		break;
			case O_TYPE_ARRAY	: 
				for (var i=0;i<val.length;i++){
					var v = val[i];
					var t = typeOfObject (v);
					if (t == O_TYPE_STRING) 	val[i] = decodeUTF8Str(v);	
					else if (t == O_TYPE_OBJ)	decodeUTF8AllLevel (v);	
					else if (t==O_TYPE_ARRAY)	decodeUTF8AllLevel (v);	
				}
				break;
			}
		}
	}
	function decodeUTF8Str(str){
		try{
			if(str != null || str != undefined) {
				return decodeURIComponent(str);
			} else {
				return "";
			}
		}catch(e){
			return str;
		}
	}
	var O_TYPE_NULL 	= 0;
	var O_TYPE_STRING 	= 1;
	var O_TYPE_ARRAY 	= 2;
	var O_TYPE_OBJ 		= 3;
	var O_TYPE_OTHER	= 4;
	function typeOfObject(object) {
		if (object === null) {
			return O_TYPE_NULL;
		}
		else if (object === undefined) {
			return O_TYPE_NULL;
		}
		else{
			var t = $.type(object);
			if (t=='string') 	return O_TYPE_STRING;
			if (t=='array')   return O_TYPE_ARRAY;
			if (t=='object') 	return O_TYPE_OBJ;            
			return O_TYPE_OTHER;
		}      
	}
};


//-----WebContent/www/js/app/common/ctrl/TemplateController.js------------------------------
var TemplateController 	=  function() {
	var handlebars		=  require('handlebars');	
	var cachedHtml		= []; //only html no function
	var cached 			= []; //html to function
	var compiled 		= []; //after inject json
	var templatePath 	= "./template";
	var extension		= ".html";
	var COMMENT_PSEUDO_COMMENT_OR_LT_BANG = new RegExp(
			'<!--[\\s\\S]*?-->'
//			'<!--[\\s\\S]*?(?:-->)?' // /<!--[\s\S]*?-->/g
//			+ '<!---+>?'  // A comment with no body
//			+ '|<!(?![dD][oO][cC][tT][yY][pP][eE]|\\[CDATA\\[)[^>]*>?'
//			+ '|<[?][^>]*>?'  // A pseudo-comment
			, 'g');
	var SPACE = new RegExp("\\s{2,}",'g');// /\s{2,}/g
	//--------------Use usually------------------	
	this.do_lc_put_tmpl = function(name, templateHtml, forced){
		putTemplate (name, templateHtml, forced);
	}
	this.do_lc_put_tmpl_multi = function(names, templateHtml){
		//name = [Name_Main, Name_subTmp01, Name_subTmp02]
		//trust 1 level, 
		if (!names || !templateHtml) return;
		if (!Array.isArray(names)) return;
		if (names.length==0) return;
		for (ind = 1; ind < names.length; ind++){
			var indBegin 	= templateHtml.indexOf("<!--BEGIN TMPL-->");
			var indEnd		= templateHtml.indexOf("<!--END TMPL-->")+15;
			if (indBegin>0 && indEnd>0){
				if (names[ind]){
					var tmpl		= templateHtml.slice(indBegin, indEnd);
					putTemplate (names[ind], tmpl, true);
				}					
				templateHtml	= templateHtml.substring(0, indBegin) + templateHtml.substring(indEnd);
			}else{
				break;
			}
		}
		if (names[0]) putTemplate (names[0], templateHtml, true);
	}
	this.do_lc_put_tmplRaw = function(templateHtml, prefix, postfix){
		if (!templateHtml) return;
		let	txtBegin			= "<!--BEGIN TMPL-->";
		let txtEnd				= "<!--END TMPL-->";
		let txtBeginLen			= txtBegin.length;
		let txtName 			= "<!--NAME TMPL:";
		let txtNameLen 			= txtName.length;
		var indBegin		= 0;
		var indEnd			= 1;
		while (indBegin>=0 && indEnd>0 ){
			indBegin 			= templateHtml.indexOf(txtBegin);
			indEnd				= templateHtml.indexOf(txtEnd);
			if (indBegin>=0 && indEnd>0){
				let content					= templateHtml.slice(indBegin + txtBeginLen, indEnd).trim();
				if (!content) 	content 	= "";
				if (content.length>0){
					let indTitleBegin 		= content.indexOf(txtName);
					let indTitleEnd			= content.indexOf("-->");
					if (indTitleBegin>=0 && indTitleEnd>0){
						let name			= content.slice(indTitleBegin + txtNameLen , indTitleEnd).trim();
						if (!name) 	name	= "";
						if (prefix)name	= prefix + name;
						if (postfix)name	= name + postfix;
						if(name.length>0)
							cachedHtml[name]= content.replace(COMMENT_PSEUDO_COMMENT_OR_LT_BANG, "").replace(SPACE, " ").trim();		
//						cachedHtml[name]= content.replace("/<!--[\s\S]*?-->/g", "");				
					}
				}
				templateHtml = templateHtml.substring(indEnd+15);
			}
		}
	}
	this.do_lc_build_tmplRaw = function(name){
		if (!cached[name]){
			if (cachedHtml	[name]){				
				cached		[name] =  handlebars.compile(cachedHtml[name]);
				//cachedHtml	[name] = null;
			}			
		}
	}		
	this.req_lc_tmplRaw = function(name){
		return cachedHtml[name];
	}
	this.req_lc_tmplCompiled = function(name){
		return cached[name];
	}
	this.req_lc_compile_tmpl = function(name, data){
		return getCompiled(name, data);
	}
	this.do_lc_clear_All = function(){
		cached 		= [];
		compiled 	= [];	
		cachedHtml	= [];
	}			
	this.do_lc_clear_Raw = function(){
		cached 		= [];
	}
	this.do_lc_clear_Compiled = function(){
		compiled = [];
	}
	this.can_lc_have_tmpl = function(name){
		var tmpl = cached[name];			
		if (tmpl == null){
			tmpl = cachedHtml[name]; 
			if (tmpl == null) 
				return false;
			else 
				cached[name] = handlebars.compile(tmpl);
		}
		return true;
	}
	//-------------------------------------------------------
	//----mode asyncho----------------
	this.do_lc_clearAll = function(){
		cached 		= [];
		compiled 	= [];		
	};
	this.do_lc_clearRawCache = function(){
		cached 		= [];
		cachedHtml	= [];
	}
	this.do_lc_clearCompileCache = function(){
		compiled = [];
	}
	this.do_lc_setTemplatePath = function (path){
		templatePath 	= path;
	};
	this.do_lc_setFileExtension = function (ext){
		extension 	= ext;
	};
	//--private--------------------------------------------------------
	var putTemplate = function(name, templateHtml, forced){
		if (!forced) forced = false;
		if (!cached[name] || forced==true){
			cached[name] =  handlebars.compile(templateHtml);
		}			
	}
	//force to recompile with data
	var getCompiled= function(name, data){ //to show view with emty data: data ={}	
		if (!name) return 'Error: The template name is not yet defined';
		if (!data && compiled[name]) return compiled[name]; //return from last built
		if (!data) data = {};
		var tmpl = cached[name];			
		if (tmpl == null){
			tmpl = cachedHtml[name]; 
			if (tmpl == null) 
				return null;
			else 
				cached[name] = handlebars.compile(tmpl);
		}
		compiled[name] 	= cached[name](data);
		return compiled[name];
	};
	var getAndRender= function(url, callback) {    	
		fetch	(url);        	
		render	(url, callback);
	};
	var prefetch= function(url) {
		if (url==null || url=="") return;
		$.get(urlFor(url), function(raw) {			
			store(url, raw);
		});
	};
	var render = function(url, callback) {
		if (isCached(url)) {
			if (!!callback) callback(this.cached[url]);
		} 
	};
	var fetch= function(url) {
		// synchronous, for those times when you need it.
		var r = $.ajax({
			url		: urlFor(url), 
			async	: false, 
			dataType: 'html', 				
			type	: 'POST',//cache:false,
			success: function(res, status, jqXHR){ 
				if (res.trim()=="" || status=== "notmodified"){
					store(url, jqXHR.responseText); 
				}else
					store(url, res); 
			}}).responseText; 			
	};
	//--------------------------------------------------
	var isCached= function(name) {    	
		return !!cached[name];
	};
	var store= function(name, raw) {
		if (raw==null || raw=="") return;
		cached[name] = handlebars.compile(raw);
	};
	var urlFor= function(name) {
		return templatePath +"/"+ name + extension;
	};
};
//this.req_lc_put_tmpl_multi_byName = function(names, templateHtml){
////name = [Name_Main, Name_subTmp01, Name_subTmp02]
////trust 1 level, 
//if (!names || !templateHtml) return;
//if (!Array.isArray(names)) return;
//if (names.length==0) return;
//var dict = {};
//for (ind = 0; ind < names.length; ind++){
//if (names[ind]){
//var s			= "<!--NAME TMPL:"+names[ind]+"-->";
//var indName 	= templateHtml.indexOf(s);
//if (indName>=0){
//indName 		+= s.length;
//var indBegin 	= templateHtml.indexOf("<!--BEGIN TMPL-->"	, indName+s.length);
//var indEnd		= templateHtml.indexOf("<!--END TMPL-->"	, indName+s.length)+15;
//if (indBegin>=0 && indEnd>=0){
//var tmpl	= templateHtml.slice(indBegin+18, indEnd-15);
//putTemplate (names[ind], tmpl);
//dict[names[ind]] = 1;
//}else{
//dict[names[ind]] = 0;
//}						
//if (ind!=names.length-1) 
//templateHtml	= templateHtml.substring(0, indName) + templateHtml.substring(indEnd);
//}else{
//dict[names[ind]] = 0;
//} 					
//}
//}
//}		


//-----WebContent/www/js/app/common/ctrl/HandlebarsHelper.js------------------------------
const do_gl_Handlebars_Register = function (){
	var Handlebars		=  require('handlebars');
	Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
		switch (operator) {
		case '==':
			return (v1 == v2) ? options.fn(this) : options.inverse(this);
		case '===':
			return (v1 === v2) ? options.fn(this) : options.inverse(this);
		case '<':
			return (v1 < v2) ? options.fn(this) : options.inverse(this);
		case '<=':
			return (v1 <= v2) ? options.fn(this) : options.inverse(this);
		case '>':
			return (v1 > v2) ? options.fn(this) : options.inverse(this);
		case '>=':
			return (v1 >= v2) ? options.fn(this) : options.inverse(this);
		case '&&':
			return (v1 && v2) ? options.fn(this) : options.inverse(this);
		case '&&!':
			return (v1 && !v2) ? options.fn(this) : options.inverse(this);
		case '||':
			return (v1 || v2) ? options.fn(this) : options.inverse(this);
		case '||!':
			return (v1 || !v2) ? options.fn(this) : options.inverse(this);
		default:
			return options.inverse(this);
		}
	});
	Handlebars.registerHelper('ifCondNot', function (v1, operator, v2, options) {
		switch (operator) {
		case '==':
			return !(v1 == v2) ? options.fn(this) : options.inverse(this);
		case '===':
			return !(v1 === v2) ? options.fn(this) : options.inverse(this);
		case '<':
			return !(v1 < v2) ? options.fn(this) : options.inverse(this);
		case '<=':
			return !(v1 <= v2) ? options.fn(this) : options.inverse(this);
		case '>':
			return !(v1 > v2) ? options.fn(this) : options.inverse(this);
		case '>=':
			return !(v1 >= v2) ? options.fn(this) : options.inverse(this);
		case '&&':
			return !(v1 && v2) ? options.fn(this) : options.inverse(this);
		case '||':
			return !(v1 || v2) ? options.fn(this) : options.inverse(this);
		default:
			return options.inverse(this);
		}
	});
	Handlebars.registerHelper('divide', function (v1, v2) {
		if(v2 != 0){
			return v1/v2;
		}
	});
	Handlebars.registerHelper('select', function(value, options) {
		var $el = $('<select />').html( options.fn(this) );
		$el.find('[value="' + value + '"]').attr({'selected':'selected'});
		return $el.html();
	});
//	translate with i18n
	Handlebars.registerHelper('transl', function(...i18n_key) {
		var key	   = '';
		for (var i in i18n_key){
			if (typeof i18n_key[i] === 'object' )
				break;
			else
				key    = key + i18n_key[i];
		}
		var result = $.i18n(key);
		return new Handlebars.SafeString(result);
	});
	Handlebars.registerHelper('translIfNoGetDefault', function(i18n_key, valDefault) {
		if (!valDefault) valDefault= i18n_key;
		var result = $.i18n(i18n_key);
		if (!result || result==i18n_key) return valDefault;
		return new Handlebars.SafeString(result);
	});
	Handlebars.registerHelper('translIf', function(v1, operator, v2, key1, key2) {
		var result = "";
		switch (operator) {
		case '==':
			result = (v1 == v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '===':
			result = (v1 === v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '<':
			result = (v1 < v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '<=':
			result = (v1 <= v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '>':
			result = (v1 > v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '>=':
			result = (v1 >= v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '&&':
			result = (v1 && v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '&&!':
			result = (v1 && !v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '||':
			result = (v1 || v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '||!':
			result = (v1 || !v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		default:
			result = $.i18n(key1)
			break;
		}
		return new Handlebars.SafeString(result);
	});
	Handlebars.registerHelper('transl_format', function(i18n_key, param) {
		var result = $.i18n(i18n_key);
		if (!param) param = "";
		var array = JSON.parse("[" + param + "]");
		result = req_gl_str_format (result, array)
		return new Handlebars.SafeString(result);
	});
	var req_gl_str_format = function(str, param) {
		return str.replace(/{(\d+)}/g, function(match, number) {
			return typeof param[number] != 'undefined'? param[number]: match;
		});
	};
	Handlebars.registerHelper('ifIn', function (v1, v2, options) {
		if (!v1 || !v2) return options.inverse(this);
		if (!$.isArray(v1) && !$.isArray (v2)){
			if (v1==v2) return options.fn(this);
		}
		if ($.isArray (v2)){
			var chk = v1;
			if (!$.isArray(v1)) chk = [v1];
			var ok = true;
			for (var i = 0; i< chk.length; i++){
				if (v2.indexOf(chk[i])< 0) {
					ok = false;
					break;
				}
			}
			if (ok) return options.fn(this);
		}
		return options.inverse(this);
	});
	Handlebars.registerHelper('equal', function(val1, val2, options){
		if(val1 == val2) {
			return options.fn(this);
		}
		return options.inverse(this);
	});
	Handlebars.registerHelper('equalOr', function(val1, val2, val3, options){
		if(val1 == val2 || val1 == val3) {
			return options.fn(this);
		}
		return options.inverse(this);
	});
	Handlebars.registerHelper('equalOrs', function(val1, ...restArg){
		let options 	= restArg[restArg.length - 1];
		restArg.length 	= restArg.length - 1;
		return restArg.includes(val1) ? options.fn(this) : options.inverse(this);
	});
	Handlebars.registerHelper('notEqual', function(val1, val2, options){
		if(val1 != val2) {
			return options.fn(this);
		}
		return options.inverse(this);
	});
	Handlebars.registerHelper("image", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg'
		return "<img src='" + UI_URL_ROOT + path+ "' onerror='this.src = '"+errPath+"'>";
	});
	Handlebars.registerHelper("url_root", function() {
		return  UI_URL_ROOT;
	});
	Handlebars.registerHelper("url_image", function(path) {
		return  UI_URL_ROOT + path;
	});
	Handlebars.registerHelper("url_image_remote", function(path) {
		return  URL_DOMAIN + path;
	});
	Handlebars.registerHelper("url_image_err", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg';
		return 'this.src = "'+errPath+ '"';
	});
	Handlebars.registerHelper("url_image_err_1001pharmacy", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg';
		return 'this.src = "'+errPath+ '"';
	});
	Handlebars.registerHelper("url_image_err_agri", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg';
		return 'this.src = "'+errPath+ '"';
	});
	Handlebars.registerHelper("url_image_err_job", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/logo_job.png';
		return 'this.src = "'+errPath+ '"';
	});
	Handlebars.registerHelper("url_image_err_notification", function() {
		var errPath = UI_URL_ROOT+ 'www/img/user.png';
		return 'this.src = "'+errPath+ '"';
	});
	Handlebars.registerHelper("url_image_no_avatar", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/default_user.png';
		return 'this.src = "'+errPath+ '"';
	});
	Handlebars.registerHelper("path_image_err", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg';
		return errPath;
	});
	Handlebars.registerHelper("image_home", function(filename) {
		// Helper to put planes tails icons for each company
		//return "<img src='" + App.path.BASE_URL_IMAGE_SERVER +  App.path.BASE_URL_IMAGE_PATH+  filename+".png' />";
		var path = UI_URL_ROOT + 'www/img/pdg/icons/';
		return "<img src='"+ path  + filename+".png' style='width: 100px; height: 100px;'/>";
	});
	//Decode the string str to unescape the specials characters
	Handlebars.registerHelper('decodeUTF8',function(str){
		try{
			if(str != null || str != undefined) {
				return decodeURIComponent(str);
			} else {
				return "";
			}
		}catch(e){
			return str;
		}
	});
	Handlebars.registerHelper('dateFormat', function(strDate, format){
		try{
			return DateFormat(strDate, format);
		}catch(e){
			return strDate;
		}
	});
	Handlebars.registerHelper('dateFormatLocal', function(strDate){
		try{
			if(strDate) {
				var local = localStorage.language;
				if (!local) local = "en";
				var format = DateFormat.masks.enFullDate;
				if (local=="fr")
					format = DateFormat.masks.frFullDate;
				else if (local=="vn")
					format = DateFormat.masks.viFullDate;
				else if (local=="vi")
					format = DateFormat.masks.viFullDate;
				return DateFormat(strDate, format);
			} else {
				return strDate;
			}
		}catch(e){
			return strDate;
		}
	});
	Handlebars.registerHelper('dateFormatLocalShort', function(strDate){
		try{
			if(strDate) {
				var local = localStorage.language;
				if (!local) local = "en";
				var format = DateFormat.masks.enShortDate;
				if (local=="fr")
					format = DateFormat.masks.frShortDate;
				else if (local=="vn")
					format = DateFormat.masks.viShortDate;
				else if (local=="vi")
					format = DateFormat.masks.viShortDate;
				return DateFormat(strDate, format);
			} else {
				return strDate;
			}
		}catch(e){
			return strDate;
		}
	});
	Handlebars.registerHelper('dateFormatInputDate', function(strDate){
		try{
			if(strDate) {
				format = DateFormat.masks.dbShortDate;
				return DateFormat(strDate, format);
			} else {
				return strDate;
			}
		}catch(e){
			return strDate;
		}
	});
	Handlebars.registerHelper('dateFormatAppoint', function(strDate){
		try{
			if(strDate) {
				let date 	= new Date(strDate.slice(0,10));
				let local = localStorage.language;
				switch(local){
				case "vn":
					return date.toLocaleDateString('vn-VN');
					break;
				case "en":
					return date.toLocaleDateString("en-US");
					break;
				case "fr":
					return date.toLocaleDateString("fr-FR");
					break;
				default:
					return date.toLocaleDateString("vn-VN");
				}
			} else {
				return strDate;
			}
		}catch(e){
			return strDate;
		}
	});
	Handlebars.registerHelper('compareExpirationDate', function(strDate){
		let date 	= new Date(strDate.slice(0,10));
		let curDate = new Date();
		let comp    = Math.round((date - curDate) / 3600 / 24 / 1000);
		return comp;
	});
	Handlebars.registerHelper('hoursFormatAppoint', function(strDate){
		try{
			if(strDate) {
				return strDate.slice(11);
			} else {
				return strDate;
			}
		}catch(e){
			return strDate;
		}
	});
	Handlebars.registerHelper('ifModulo', function (v1, v2, v3, options) {
		return (v1 % v2 == v3)? options.fn(this) : options.inverse(this);
	});
	Handlebars.registerHelper('extractMsg', function (msg, length, options) {
		var s = msg;
		if(s && s.length>0) {
			try{
				var div = $("<div></div>");
				div.html(s);
				s = div.text();
			}catch(e){
			}
			if (s.length==0) s=msg;
			if (s.length>length){
				s = s.substring(0, length)+"...";
//				s = s.split(".-")		.join('<br/>');
//				s = s.split(". -")		.join('<br/>');
//				s = s.split(" -")		.join('<br/>');
			}
//			s = s.split("<p>")		.join('');
//			s = s.split("</p>")		.join('');
//			s = s.split("<div>")	.join('');
//			s = s.split("</div>")	.join('');
//			s = s.split("<span>")	.join('');
//			s = s.split("</span>")	.join('');
//			s = s.split("<br><br>")	.join(' ');
		}
//		return new Handlebars.SafeString(s);
		return s;
	});
	Handlebars.registerHelper('textNoHtmlTag', function (msg) {
		var s = msg;
		if(s && s.length>0) {
			try{
				s = $(s).text();
			}catch(e){
			}
			if (s.length==0) s=msg;
		}
		return s;
	});
	Handlebars.registerHelper('textNoHtmlTagAndNumberFormat', function (msg, nbDigit) {
		var s = msg;
		if(s && s.length>0) {
			try{
				s = $(s).text();
				if(isNaN(s)){
					s = reqStrNumber(s, nbDigit);
				}
			}catch(e){
			}
			if (s.length==0) s=msg;
		}
		return s;
	});
	Handlebars.registerHelper('transl_wf', function (msg, options) {
		var s = msg;
		s = s.replace(" ", "_");
		s = s.replace("%20", "_");
		s = s.toLowerCase();
		var k = $.i18n("page_ref_workflow_"+s);
		if(!k) return msg;
		else return k;
	});
	Handlebars.registerHelper('transl_billing_pos', function (type, options) {
		var s = type;
		var k = $.i18n("page_ref_billing_admin_info_type_"+s);
		if(!k) return s;
		else return k;
	});
	Handlebars.registerHelper('tpCategory',function(tpCats, cat){
		var catName = "";
		try{
			catName = tpCats[cat];
		}catch(e){
			console.log(e);
			catName = "";
		}
		return catName;
	});
	Handlebars.registerHelper('doubleFormat',function(val, format){
		var valFormated = val;
		if(val === undefined) {
			valFormated = '';
		}
		var defautFormat = "#,##0.##";
		if(format && typeof format == "string") {
			defautFormat = format;
		}
		try{
			valFormated = $.formatNumber(valFormated, {format:defautFormat, locale : localStorage.language});
		}catch(e){
			console.log(e);
			valFormated = val;
		}
		return valFormated;
	});
	Handlebars.registerHelper('stringify',function(val){
		var sval = val;
		try{
			if(val) {
				sval = JSON.stringify(val);
			}
		}catch(e){
			console.log(e);
			sval = val;
		}
		return sval;
	});
	Handlebars.registerHelper('ifInJson', function (v1, v2, options) {
		var arr = undefined;
		try {
			arr = JSON.parse(v2);
		} catch(e) {
			arr = undefined
		}
		if (arr && $.isArray (arr)){
			var chk = v1;
			if (!$.isArray(v1)) chk = [v1];
			var ok = true;
			for (var i = 0; i< chk.length; i++){
				if (arr.indexOf(chk[i])< 0) {
					ok = false;
					break;
				}
			}
			if (ok) return options.fn(this);
		}
		return options.inverse(this);
	});
	Handlebars.registerHelper('reqInvUrl', function (type) {
		var url = getLaunchURL();
		var paramIndex = url.lastIndexOf('/');
		if(paramIndex > -1) {
			url = url.substring(0,paramIndex);
		}
		url += '/'+App.const.INV_URL[type];
		return url;
	});
	Handlebars.registerHelper( 'concat', function(str1, str2) {
		return str1 + str2;
	});
	Handlebars.registerHelper('calc', function(val1, operator, val2){
		var res = 0;
		switch (operator) {
		case '+':
			res = val1 + val2;
			break;
		case '-':
			res = val1 - val2;
			break;
		case '*':
			res = val1 * val2;
			break;
		case '/':
			res = val1 / val2;
			break;
		default:
			break;
		}
		return res;
	});
	Handlebars.registerHelper('calcPercent', function(val1, operator, val2){
		var res = 0;
		switch (operator) {
		case '+':
			break;
		case '-':
			break;
		case '*':
			break;
		case '/':
			res = (val1*100) / val2;
			break;
		default:
			break;
		}
		res = res.toFixed(1);
		if (res.match(/\./)) {
			res = res.replace(/\.?0+$/, '');
		}
		return res.split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, "$1 ").split('').reverse().join('');;;
	});
	Handlebars.registerHelper('showDataOrMissing',function(str){
		try{
			if(str != null || str != undefined) {
				return str;
			} else {
				return $.i18n("common_null_data");
			}
		}catch(e){
			return str;
		}
	});
	Handlebars.registerHelper('replaceStrOrNot',function(str, newStr){
		try{
			if(str != null || str != undefined) {
				return str;
			} else {
				return newStr;
			}
		}catch(e){
			return str;
		}
	});
	Handlebars.registerHelper('concatStr', function (str1, str2) {
		if(str1 != null && str2 != null)
			return str1 + " " + str2;
		else if(str1 != null && str2 == null)
			return str1;
		else if(str1 == null && str2 != null)
			return str2;
		else
			return "";
	});
	Handlebars.registerHelper('appVersion', function () {
		if (!App.version) return Math.floor(Math.random() * 100);
		return App.version;
	});
	Handlebars.registerHelper('delTagHtml', function (msg, length, options) {
		var s = msg;
		if(s && s.length>0) {
			s = s.split("<p>")		.join('');
			s = s.split("</p>")		.join('');
			s = s.split("<div>")	.join('');
			s = s.split("</div>")	.join('');
			s = s.split("<span>")	.join('');
			s = s.split("</span>")	.join('');
			s = s.split("<br>")		.join('');
			s = s.split("<br/>")	.join('');
			s = s.split("</br>")	.join('');
			s = s.split("<b>")		.join('');
			s = s.split("</b>")		.join('');
			s = s.split("<i>")		.join('');
			s = s.split("</i>")		.join('');
			s = s.trim();
			if (s.length>length && s.length>0){
				var tmp = s;
				try{
					s = $(s).text();
				}catch(e){
				}
				if (s.length==0) s=tmp;
			}
		}
		return s;
	});
	Handlebars.registerHelper('url_Media_Not_Null', function (o1, o2) {
		if(o1 != null )
			return URL_DOMAIN + o1;
		if(o2!= null)
			return URL_DOMAIN + o2;
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg';
		return errPath;
	});
	Handlebars.registerHelper('url_Media_Not_Null_1001Pharmacy', function (o1, o2) {
		if(o1 != null )
			return URL_DOMAIN + o1;
		if(o2!= null)
			return URL_DOMAIN + o2;
		var errPath = UI_URL_ROOT+ 'www/img/logo.png';
		return errPath;
	});
	Handlebars.registerHelper('url_Media_Not_Null_Agri', function (o1, o2) {
		if(o1 != null )
			return URL_DOMAIN + o1;
		if(o2!= null)
			return URL_DOMAIN + o2;
		var errPath = UI_URL_ROOT+ 'www/img/logo.png';
		return errPath;
	});
	Handlebars.registerHelper('url_Media_Not_Null_Job', function (e, r) {
		return null != e ? URL_DOMAIN + e : null != r ? URL_DOMAIN + r : UI_URL_ROOT + "www/img/logo_job.png";
	});
	Handlebars.registerHelper('iff', function(msg, length, options) {
		var bool = false;
		switch(operator) {
		case '==':
			bool = a == b;
			break;
		case '>':
			bool = a > b;
			break;
		case '<':
			bool = a < b;
			break;
		default:
			throw "Unknown operator " + operator;
		}
		if (bool) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	Handlebars.registerHelper('numberFormatLocal', function(val) {
		try{
			if (typeof val === 'string' || val instanceof String)
				val = parseFloat(val);
			return val.toLocaleString();
			//https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number/toLocaleString
		}catch(e){
			return val;
		}
	});
	Handlebars.registerHelper('dateFormatShow', function(strDate, langOpt){
		try{
			if (!langOpt) langOpt = localStorage.languageId;
			if (!langOpt) langOpt = 1;
			var newDate = new Date(strDate);
			var weekday = new Array(7);
			if (langOpt==1){
				weekday[0] = "Chủ Nhật";
				weekday[1] = "Thứ Hai";
				weekday[2] = "Thứ Ba";
				weekday[3] = "Thứ Tư";
				weekday[4] = "Thứ Năm";
				weekday[5] = "Thứ Sáu";
				weekday[6] = "Thứ Bảy";
			}else if (langOpt==2){
				weekday[0] = "Sunday";
				weekday[1] = "Monday";
				weekday[2] = "Tuesday";
				weekday[3] = "Wednesday";
				weekday[4] = "Thursday";
				weekday[5] = "Friday";
				weekday[6] = "Saturday";
			}
			var d 		= weekday[newDate.getDay()];
			var dd   	= newDate.getDate();
			var mm   	= newDate.getMonth() + 1;
			var yyyy 	= newDate.getFullYear();
			var hours   = newDate.getHours();
			var minutes = newDate.getMinutes();
			var seconds = newDate.getSeconds();
			if (dd < 10) {
				dd = '0' + dd;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			if (!d || !dd || !mm || !yyyy || !hours || !minutes || !seconds) return strDate;
			strDate = d + ", " + dd + '-' + mm + '-' + yyyy + " " + hours + ":" +  minutes + ":" +  seconds;
		}catch(e){
		}
		return strDate;
	});
	Handlebars.registerHelper('dateFormatShowDet', function(strDate){
		try{
			if (!langId) var langId = localStorage.languageId;
			if (!langId) var langId = 1;
			let dt1 = new Date();
			let dt2 = new Date(strDate);
			let diff =(dt1.getTime() - dt2.getTime()) / 1000;
			diff /= (60 * 60);
			if( diff >= 24){
				diff = Math.abs(Math.round(diff));
				var weekday = new Array(7);
				if (langId==1){
					weekday[0] = "Chủ Nhật";
					weekday[1] = "Thứ Hai";
					weekday[2] = "Thứ Ba";
					weekday[3] = "Thứ Tư";
					weekday[4] = "Thứ Năm";
					weekday[5] = "Thứ Sáu";
					weekday[6] = "Thứ Bảy";
				}else if (langId==2){
					weekday[0] = "Sunday";
					weekday[1] = "Monday";
					weekday[2] = "Tuesday";
					weekday[3] = "Wednesday";
					weekday[4] = "Thursday";
					weekday[5] = "Friday";
					weekday[6] = "Saturday";
				}
				var d 		= weekday[dt2.getDay()];
				var dd   	= dt2.getDate();
				var mm   	= dt2.getMonth() + 1;
				var yyyy 	= dt2.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				if (!d || !dd || !mm || !yyyy) return strDate;
				strDate = d + ", " + dd + '/' + mm + '/' + yyyy;
			}else if(diff >= 1 && diff < 24){
				diff = Math.abs(Math.round(diff));
				if (langId==1){
					strDate = diff + " giờ trước";
				}else if (langId==2){
					strDate = diff + " hours ago";
				}
			} else if(diff < 1 && diff >=0){
				diff = diff*60;
				diff = Math.abs(Math.round(diff));
				if (langId==1){
					strDate = diff + " phút trước";
				}else if (langId==2){
					strDate = diff + " minutes ago";
				}
			}else{
				diff = Math.abs(Math.round(diff));
				var weekday = new Array(7);
				if (langId==1){
					weekday[0] = "Chủ Nhật";
					weekday[1] = "Thứ Hai";
					weekday[2] = "Thứ Ba";
					weekday[3] = "Thứ Tư";
					weekday[4] = "Thứ Năm";
					weekday[5] = "Thứ Sáu";
					weekday[6] = "Thứ Bảy";
				}else if (langId==2){
					weekday[0] = "Sunday";
					weekday[1] = "Monday";
					weekday[2] = "Tuesday";
					weekday[3] = "Wednesday";
					weekday[4] = "Thursday";
					weekday[5] = "Friday";
					weekday[6] = "Saturday";
				}
				var d 		= weekday[dt2.getDay()];
				var dd   	= dt2.getDate();
				var mm   	= dt2.getMonth() + 1;
				var yyyy 	= dt2.getFullYear();
				var hours   = dt2.getHours();
				var minutes = dt2.getMinutes();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				if (hours < 10) {
					hours = '0' + hours;
				}
				if (minutes < 10) {
					minutes = '0' + minutes;
				}
				if (!d || !dd || !mm || !yyyy || !hours || !minutes) return strDate;
				strDate = d + ", " + dd + '-' + mm + '-' + yyyy + " " + hours + ":" +  minutes;
			}
		}catch(e){
		}
		return strDate;
	});
	Handlebars.registerHelper('dateFormatShowDayStr', function(strDate){
		try{
			if (!langId) var langId = localStorage.languageId;
			if (!langId) var langId = 1;
			let dt = new Date(strDate);
			var weekday = new Array(7);
			if (langId==1){
				weekday[0] = "Chủ Nhật";
				weekday[1] = "Thứ Hai";
				weekday[2] = "Thứ Ba";
				weekday[3] = "Thứ Tư";
				weekday[4] = "Thứ Năm";
				weekday[5] = "Thứ Sáu";
				weekday[6] = "Thứ Bảy";
			}else if (langId==2){
				weekday[0] = "Sunday";
				weekday[1] = "Monday";
				weekday[2] = "Tuesday";
				weekday[3] = "Wednesday";
				weekday[4] = "Thursday";
				weekday[5] = "Friday";
				weekday[6] = "Saturday";
			}
			let d 		= weekday[dt.getDay()];
			if (!d) return strDate;
			strDate = d;
		}catch(e){
		}
		return strDate;
	});
	Handlebars.registerHelper('dateFormatShowDayNumber', function(strDate){
		try{
			let dt = new Date(strDate);
			let dd   	= dt.getDate();
			if (dd < 10) {
				dd = '0' + dd;
			}
			if (!dd) return strDate;
			strDate = dd;
		}catch(e){
		}
		return strDate;
	});
	Handlebars.registerHelper('dateFormatShowHours', function(strDate){
		try{
			let newDate = new Date(strDate);
			var hours   = newDate.getHours();
			var minutes = newDate.getMinutes();
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (!hours || !minutes) return strDate;
			strDate = hours + " : " +  minutes;
		}catch(e){
		}
		return strDate;
	});
	Handlebars.registerHelper('dateFormatFromTimestamp', function(time){
		if (!langId) var langId = localStorage.languageId;
		if (!langId) var langId = 1;
		if(!time || time < 1000) return;
		let date        = new Date();
		let diff        = date.getTime() - time;
		let diffNum     = 0;
		diff            /= 1000 * 60 * 60;
		const reqLangAgoFormat = (str01, str02) => {
			if(langId == 1) return " " + str01;
			if(langId == 2) {
				if(diffNum > 1) {
					return " " + str02.replace("#", "");
				}
				return " " + str02.replace("#s", "");
			}
		}
		if(diff < 1 / 60) {
			diffNum = Math.floor(diff * 60 * 60);
			return diffNum      + reqLangAgoFormat("giây trước", "second#s ago");
		} else if(diff < 1) {
			diffNum = Math.floor(diff * 60);
			return diffNum      + reqLangAgoFormat("phút trước", "minute#s ago");
		} else if(diff < 24) {
			diffNum = Math.floor(diff);
			return diffNum      + reqLangAgoFormat("giờ trước", "hour#s ago");
		} else if(diff < 24 * 30) {
			diffNum = Math.floor(diff / 24);
			return diffNum      + reqLangAgoFormat("ngày trước", "day#s ago");
		} else if(diff < 24 * 30 * 12) {
			diffNum = Math.floor(diff / 24 / 30);
			return diffNum      + reqLangAgoFormat("tháng trước", "month#s ago");
		} else {
			diffNum = Math.floor(diff / 24 / 30 / 12);
			return diffNum      + reqLangAgoFormat("năm trước", "year#s ago");
		}
	});
	Handlebars.registerHelper('Icon', function(fileName) {
//		https://www.jstips.co/en/javascript/get-file-extension/
		var ext = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
		var iconPath = "www/img/file/";
		var docExt   = ["doc","docx","dot","dotx"];
		var exExt  	 = ["xls","xlxs","xlsm","xltx"];
		var pptExt   = ["ppt","pptx","pot","potx"];
		var xmlExt	 = ["xml"];
		var pdfExt	 = ["pdf"];
		if(docExt.includes(ext)) return (iconPath + "word.png");
		if(exExt.includes(ext))  return (iconPath + "excel.png");
		if(pptExt.includes(ext)) return (iconPath + "ppt.png");
		if(xmlExt.includes(ext)) return (iconPath + "xml.png");
		if(pdfExt.includes(ext)) return (iconPath + "pdf.png");
		return (iconPath + "other.png")
	});
	Handlebars.registerHelper('ifLangId', function(langId, options) {
		if (App.languageId == langId)  return options.fn(this);
		return options.inverse(this);
	});
	Handlebars.registerHelper('realEstateTypeTitle', function(typ) {
		if (typeof typ === 'string' || typ instanceof String)
			typ = parseInt(typ, 10);
		var mainTyp = Math.floor(typ/1000); //0 or 1;
		var subTyp	= typ%1000;
		if (mainTyp<10) mainTyp = "0" 	+ mainTyp;
		if (subTyp< 10) subTyp 	= "00" 	+ subTyp;
		else
			if (subTyp<100) subTyp 	= "0" 	+ subTyp;
		var key 	= "area_realEstate_type_"+mainTyp+"_" + subTyp;
		var result 	= $.i18n(key);
		var txtSub  =  $.i18n("area_realEstate_type_title_" + mainTyp);
		if(mainTyp == "02") return txtSub + " " + result;
		else                return result + " " + txtSub;
	});
	Handlebars.registerHelper('realEstateTypeMain', function(typ) {
		if (typeof typ === 'string' || typ instanceof String)
			typ = parseInt(typ, 10);
		var mainTyp = Math.floor(typ/1000); //0 or 1;
		return mainTyp;
	});
	Handlebars.registerHelper('random', function (min, max) {
		return Math.min(max, Math.floor(Math.random() * max) + min);
	});
	Handlebars.registerHelper('realEstateObjectToString', function(obj) {
		var strObj = JSON.stringify(obj);
		return strObj;
	});
	Handlebars.registerHelper('extractMsgBlogStart', function (msg, length, options) {
		var s = msg;
		if(s && s.length>0) {
			try{
				var div = $("<div></div>");
				div.html(s);
				s = div.text();
			}catch(e){
			}
			if (s.length==0) s=msg;
			if (s.length>length){
				s = s.substring(0, length);
			}
		}
		return s;
	});
	Handlebars.registerHelper('extractMsgBlogEnd', function (msg, options) {
		var s = msg;
		if(s && s.length>0) {
			try{
				var div = $("<div></div>");
				div.html(s);
				s = div.text();
			}catch(e){
			}
			if (s.length==0) s=msg;
			if (s.length>0){
				s = s.substring(1, s.length);
			}
		}
		return s;
	});
	Handlebars.registerHelper('reqViewURL', function(viewPath, entIdorTyp, urlRef) {
		var lang = "vn";
		var lang_key 	= localStorage.getItem("language");
		if (lang_key)
			lang		= lang_key;
//		var lang_id 	= localStorage.getItem("languageId");
		return URL_DOMAIN + viewPath+"/"+lang+"/"+ entIdorTyp  + (!urlRef?"":"/"+urlRef);
	});
	Handlebars.registerHelper('reqViewURLOffer', function(viewPath, id, cod) {
		// var lang = "vn";
		//
		// var lang_key 	= localStorage.getItem("language");
		// if (lang_key)
		// 	lang		= lang_key;
		return URL_DOMAIN + viewPath+"?id="+ id +"&cod="+ cod;
	});
	const CV_STAT_ACCEPT_ALL		= 2;
	const CV_STAT_ACCEPT_RECRUITER	= 3;
	Handlebars.registerHelper('reqViewURLJob', function(viewPath, parId, entId, stat) {
		if(stat == CV_STAT_ACCEPT_RECRUITER) return "javascript:void(0)";
		var lang_key 	= localStorage.getItem("language");
		if (lang_key)
			lang		= lang_key;
//		var lang_id 	= localStorage.getItem("languageId");
		return URL_DOMAIN + viewPath +"/"+lang +"/"+ parId +"/"+ entId;
	});
	Handlebars.registerHelper("url_material", function() {
		return  UI_URL_PATH_MATERIAL;
	});
	Handlebars.registerHelper('reqViewHrefMat', function(viewPath, entId) {
		return UI_URL_PATH_MATERIAL + "/" + viewPath + (!entId? "":"?id=" + entId );
	});
	Handlebars.registerHelper('twoDigitFixed', function(number) {
		if(number != null){
			number = Number(number);
			number = number.toFixed(2);
			if (number.match(/\./)) {
				number = number.replace(/\.?0+$/, '');
			}
			return number.split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, "$1 ").split('').reverse().join('');;
		}else{
			return null;
		}
	});
	Handlebars.registerHelper('digitFixed', function(number, nbDigit) {
		return reqStrNumber(number, nbDigit);
	});
	var reqStrNumber = function (number, nbDigit){
		if(number != null && number != undefined){
			number = Number(number);
			if (!nbDigit) nbDigit = 2;
			number = number.toFixed(nbDigit);
			if (number.match(/\./)) {
				number = number.replace(/\.?0+$/, '');
			}
			return number.split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, "$1 ").split('').reverse().join('');;
		}else{
			return 0;
		}
	}
	Handlebars.registerHelper('reqCountStar', function(nbStar) {
		if(nbStar){
			return nbStar + " " + $.i18n("mentor_eval");
		}
		return $.i18n("mentor_eval_empty");
	});
	Handlebars.registerHelper('reqEvaluation', function() {
		//hien tai, evaluation tren 5 tieu chi
		const nbCritere =  5;
		let eval = this.eval;
		if(!eval || !eval .count)	return "100%";
		let moyen = (eval.eval01 + eval.eval02+ eval.eval03+ eval.eval04+ eval.eval05)/5;
		return moyen * 20 + "%";//calculer la pourcentage de width
	});
	Handlebars.registerHelper('ifUrl', function (str,  options) {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
				'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
				'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		var ok = !!pattern.test(str);
		if (ok) return options.fn(this);
		return options.inverse(this);
	});
	Handlebars.registerHelper("reqSizeFileUI", function(str) {
		try {
			if(!str)	return "";
			number = parseInt(str)/1000000;
			number = number.toFixed(2);
			return number + " MB";
		}catch (e) {
			return str;
		}
	});
	const typ01_img_cover 			= 4;
	Handlebars.registerHelper("reqImageCover", function(data) {
		try {
			if(data.files && data.files.length){
				let iCover = data.files.find(item => item.typ01 == typ01_img_cover);
				if(iCover) return iCover.path01;
				return `www/img/banner01.jpg`;
			}else{
				return `www/img/banner01.jpg`;
			}
		}catch (e) {
		}
	});
	//---------------------------------------------------------------------------------------------------
	Handlebars.registerHelper('forWithData', function(from, to, inc, data, block) {
		if(!data) return;
		var accum = '';
		for(var i = from; i < to; i += inc) {
			if(!data[i]) return accum;
			accum += block.fn(data[i]);
		}
		return accum;
	});
	Handlebars.registerHelper('inc', function (index) {
		return index + 1;
	});
	Handlebars.registerHelper('pageLang', function (index) {
		return localStorage.language?localStorage.language: "en";
	});
	//----------------------PRJ-----------------------------------------
	const do_lc_reqRandom_number 	= (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
	// const formatDate 				= {"en": DateFormat.masks.enShortDate, "fr": DateFormat.masks.frShortDate, "vn": DateFormat.masks.viShortDate};
	const defautNumberFormat 		= "#,###.##";
	const PRJ_MEMBER_LEVEL 		= {0: "prj_project_member_level_manager", 10: "prj_project_member_level_reporter", 20: "prj_project_member_level_developer", 30: "prj_project_member_level_tester", 40: "prj_project_member_level_worker", 50: "prj_project_member_level_watcher"};
	const PRJ_MEMBER_TYPE 			= {0: "prj_project_lev_bas"				, 1: "prj_project_lev_haute"};
	const PRJ_TEST_TYPE 			= {1: "aut_test_ent_header_stat_1"	, 2: "aut_test_ent_header_stat_2"	, 3: "aut_test_ent_header_stat_3"	, 4: "aut_test_ent_header_stat_4", 10: "aut_test_ent_header_stat_10"};
	const PRJ_TEST_IMG 				= {1: "aut_test_ent_header_stat_1"	, 2: "aut_test_ent_header_stat_2"	, 3: "aut_test_ent_header_stat_3"	, 4: "aut_test_ent_header_stat_4", 10: "aut_test_ent_header_stat_10"};
	const PRJ_UNIT_TYPE 			= {3: "aut_test_unit_header_stat_3"	, 4: "aut_test_unit_header_stat_4"	, 5: "aut_test_unit_header_stat_5"	, 6: "aut_test_unit_header_stat_6", 10: "aut_test_unit_header_stat_10"};
	const PRJ_GRP_MED 				= {100: "aut_test_ent_grp_medicine_stat_100"	, 200: "aut_test_ent_grp_medicine_stat_200"	, 500: "aut_test_ent_grp_medicine_stat_500"	, 300: "aut_test_ent_grp_medicine_stat_300", 700: "aut_test_ent_grp_medicine_stat_700", 900: "aut_test_ent_grp_medicine_stat_900"};
	const PRJ_GRP_PRD 				= {2: "aut_test_ent_manu_medicine_stat_2"	, 3: "aut_test_ent_manu_medicine_stat_3"	, 4: "aut_test_ent_manu_medicine_stat_4"	, 10: "aut_test_ent_manu_medicine_stat_10"};
	const PRJ_GRP_PKG 				= {5: "aut_test_ent_package_medicine_stat_5"	, 6: "aut_test_ent_package_medicine_stat_6"	, 7: "aut_test_ent_package_medicine_stat_7"	, 10: "aut_test_ent_package_medicine_stat_10"};
	const PRJ_GRP_UNIT 				= {6: "aut_test_ent_unit_medicine_stat_6"	, 7: "aut_test_ent_unit_medicine_stat_7"	, 8: "aut_test_ent_unit_medicine_stat_8"	, 10: "aut_test_ent_unit_medicine_stat_10"};
	const PRJ_LEVEL 				= {1: "prj_project_lev_01"	, 2: "prj_project_lev_02"	, 3: "prj_project_lev_03"	, 4: "prj_project_lev_04"};
	const PRJ_TYPE01 				= {1: "prj_project_type_01"	, 2: "prj_project_type_02"	, 3: "prj_project_type_03"	, 4: "prj_project_type_04"};
	const PRJ_STAT 					= {0: "prj_project_stat_00"	, 1: "prj_project_stat_01"	, 2: "prj_project_stat_02"	, 3: "prj_project_stat_03", 4: "prj_project_stat_04", 5: "prj_project_stat_05", 6: "prj_project_stat_06", 7: "prj_project_stat_07"};
	const PR_TYP_ADD 				= 1			, PR_TYP_MOD 	= 2			, PR_TYP_DEL = 3	, PR_TYP_JOIN 		= 4		, PR_TYP_MODIFY 	= 5		, PR_TYP_OUT 		= 6			, PR_TYP_COMMENT 	= 7		, PR_TYP_MOVE 		= 9;
	const PR_TAB_CONTENT 			= "content"	, PR_TAB_MEMBER = "member"	, PR_TAB_PRJ = "prj", PR_TAB_EPIC 		= "epic", PR_TAB_TASK 		= "task", PR_TAB_COMMENT 	= "comment"	, PR_TAB_FILE 		= "file";
	const strTyp 					= {
			1			: "prj_dashboard_history_typ_add"	, 2			: "prj_dashboard_history_typ_mod"	, 3			: "prj_dashboard_history_typ_del"		, 4			: "prj_dashboard_history_typ_join",
			5			: "prj_dashboard_history_typ_modify"	, 6			: "prj_dashboard_history_typ_out"	, 7			: "prj_dashboard_history_typ_comment"	, 9			: "prj_dashboard_history_typ_move",
			"content"	: "prj_dashboard_history_tab_content", "member"	: "prj_dashboard_history_tab_member"	, "prj"		: "prj_dashboard_history_tab_prj"		, "epic"	: "prj_dashboard_history_tab_epic",
			"task"		: "prj_dashboard_history_tab_task"	, "comment"	: "prj_dashboard_history_tab_comment", "file"	: "prj_dashboard_history_tab_file"		, "customer": "prj_dashboard_history_tab_customer"
	}
	
	
	
	Handlebars.registerHelper("reqSubStrDescrPrj", function(str) {
		if(!str)	return "";
		if(str && str.length > 25){
			return str.substr(0,25) + "...";
		}
		return str;
	});
	Handlebars.registerHelper("reqNameFilePrj", function(str) {
		if(!str)	return "";
		if(str && str.length > 15){
			let length = str.length;
			return "..." + str.substr(length - 15, length);
		}
		return str;
	});
	Handlebars.registerHelper("reqSizeFile", function(str) {
		try {
			if(!str)	return "";
			return (+str)/1000 + " MB";
		}catch (e) {
			return str;
		}
	});
	// Handlebars.registerHelper("reqFormatDate", function(date) {
	// 	if(!date)	return "";
	// 	let local = localStorage.language ? localStorage.language : "en";
	// 	return DateFormat(date, formatDate[local]);
	// });
	Handlebars.registerHelper("reqFormatNumber", function(value) {
		if(!value)	return "";
		let local = localStorage.language ? localStorage.language : "en";
		return $.formatNumber(value, {format: defautNumberFormat, local});
	});
	Handlebars.registerHelper("reqBudgtetReal", function(val02, val01) {
		let val = val02;
		if(!val){
			val = val01;
			if(!val)	return "";
		}
		let local = localStorage.language ? localStorage.language : "en";
		return $.formatNumber(val, {format: defautNumberFormat, local});
	});
	Handlebars.registerHelper("reqLevelMember", function(level) {
		if(level === undefined)	return "";
		return $.i18n(PRJ_MEMBER_LEVEL[+level]);
	});
	Handlebars.registerHelper("reqTypeMember", function(typ) {
		if(typ === undefined)	return "";
		return $.i18n(PRJ_MEMBER_TYPE[+typ]);
	});
	Handlebars.registerHelper("reqTypeTest", function(typ) {
		if(typ === undefined)	return "";
		return $.i18n(PRJ_TEST_TYPE[+typ]);
	});
	Handlebars.registerHelper("reqTestImg", function(typ) {
		if(typ === undefined)	return "";
		return $.i18n(PRJ_TEST_IMG[+typ]);
	});
	Handlebars.registerHelper("reqTypeUnit", function(typ) {
		if(typ === undefined)	return "";
		return $.i18n(PRJ_UNIT_TYPE[+typ]);
	});
	Handlebars.registerHelper("reqGrpMedi", function(typ) {
		if(typ === undefined)	return "";
		return $.i18n(PRJ_GRP_MED[+typ]);
	});
	Handlebars.registerHelper("reqGrpPrd", function(typ) {
		if(typ === undefined)	return "";
		return $.i18n(PRJ_GRP_PRD[+typ]);
	});
	Handlebars.registerHelper("reqGrpPkg", function(typ) {
		if(typ === undefined)	return "";
		return $.i18n(PRJ_GRP_PKG[+typ]);
	});
	Handlebars.registerHelper("reqGrpUnit", function(typ) {
		if(typ === undefined)	return "";
		return $.i18n(PRJ_GRP_UNIT[+typ]);
	});
	Handlebars.registerHelper("reqTypPrj", function(typ) {
		if(typ === undefined)	return "";
		return $.i18n(PRJ_TYPE01[+typ]);
	});
	Handlebars.registerHelper("reqStatPrj", function(stat) {
		if(stat === undefined)	return "";
		return $.i18n(PRJ_STAT[+stat]);
	});
	Handlebars.registerHelper("reqLevPrj", function(lev) {
		if(lev === undefined)	return "";
		return $.i18n(PRJ_LEVEL[+lev]);
	});
	Handlebars.registerHelper("reqLevColor", function(lev) {
		if(lev === undefined)	return "info";
		if(lev == 1)	return "info";
		if(lev == 2)	return "primary";
		if(lev == 3)	return "warning";
		if(lev == 4)	return "danger";
		return "info";
	});
	Handlebars.registerHelper("reqNameMember", function(str) {
		if(!str)	return "";
		if(str && str.length > 10){
			return str.substr(0, 10) + "...";
		}
		return str;
	});
	Handlebars.registerHelper('concat', function(str1, str2) {
		return str1 + str2;
	});
	Handlebars.registerHelper('reqStatColor', function(stat) {
		if(stat === 0)	return "danger";
		if(stat === 1)	return "warning";
		return "success";
	});
	Handlebars.registerHelper('reqContentHis', function(cmt, entID) {
		if(!cmt)	return "";
		let data 		= JSON.parse(cmt);
		let str 		= $.i18n("prj_dashboard_history_init");
		if(data.typ)	str += $.i18n(strTyp[data.typ]) + " ";
		if(data.typTab)	str += $.i18n(strTyp[data.typTab]) + " ";
		if(data.title)	str += "<a href='#' class='a_view_prj' data-id='" + entID + "'>" +data.title + "</a> ";
		if(data.typ == PR_TYP_MOVE){
			str += $.i18n("prj_dashboard_history_from") + " " + $.i18n(PRJ_STAT[data.statFrom]) + " " + $.i18n("prj_dashboard_history_to") + " " + $.i18n(PRJ_STAT[data.statTo]);
		}
		return str;
	});
	Handlebars.registerHelper('reqPercentComplete', function(val05) {
		if(!val05) return "0";
		if(val05 > 100)	return "100";
		return Math.floor(+val05);
	});
	Handlebars.registerHelper('reqDateLate', function(date, stat) {
		if(stat && stat == 4){
			return "<span class='badge badge-success badge-pill'>" + $.i18n(PRJ_STAT[4]) + "</span>";
		}
		if(!date)	return "";
		let diffDays 	= req_gl_DayDiff(date);
		let nbDays 		= Math.abs(diffDays);
		if(diffDays < 0){
			return "<span class='badge badge-danger badge-pill'>" + $.i18n("prj_project_expired_late") + nbDays + $.i18n("prj_project_expired_day")+ "</span>";
		} else {
			if(diffDays > 10){
				return "";
			}else{
				return "<span class='badge badge-warning badge-pill'>" + $.i18n("prj_project_expired_in") + nbDays + $.i18n("prj_project_expired_day") + "</span>";
			}
		}
	});
	Handlebars.registerHelper("reqNameCustomer", function(str) {
		if(!str)	return "";
		if(str && str.length > 20){
			return str.substr(0, 20) + "...";
		}
		return str;
	});
	
	Handlebars.registerHelper('reqCodePrjNotify', function(content) {
		if(!content)	return "";
		let data 		= typeof content === 'string' ? JSON.parse(content) : content;
		if(data && data.title)	return data.title;
		return "";
	});
	Handlebars.registerHelper('reqIdPrjNotify', function(content) {
		if(!content)	return "";
		let data 		= typeof content === 'string' ? JSON.parse(content) : content;
		if(data && data.title)	return data.parID;
		return "";
	});
	Handlebars.registerHelper('reqContentNotify', function(cmt, entID) {
		if(!cmt)	return "";
		let data 		= cmt; //JSON.parse(cmt);
		let str 		= $.i18n(data.typTab == "comment" ? "prj_dashboard_notify_init_comment": "prj_dashboard_history_init") + " ";
		if(data.typ)	str += $.i18n(strTyp[data.typ]) + " ";
		if(data.typTab)	str += $.i18n(strTyp[data.typTab]) + " ";
		if(data.title)	str += "<a href='#' class='a_view_prj' data-id='" + entID + "'>" +data.title + "</a> ";
		if(data.typ == PR_TYP_MOVE){
			str += $.i18n("prj_dashboard_history_from") + " " + $.i18n(PRJ_STAT[data.statFrom]) + " " + $.i18n("prj_dashboard_history_to") + " " + $.i18n(PRJ_STAT[data.statTo]);
		}
		return str;
	});
	Handlebars.registerHelper('reqFirstLetter', function(str) {
		if(!str)	return "A";
		return str.trim().substr(0,1).toUpperCase();
	});
	Handlebars.registerHelper('reqTypPerson', function(typ01) {
		if(!typ01)	return "";
		let objTyp = App.data.cfgValListTypePerson.find(item => item.id == typ01);
		if(objTyp)	return $.i18n(objTyp.val01);
		return "";
	});
	Handlebars.registerHelper('reqLegalStatus', function(cfgVal02, typ01) {
		let listLegalStatus   = App.data.cfgValListTypeLegalStatM;
		if(typ01 && typ01 == 1000002){
			listLegalStatus = App.data.cfgValListTypeLegalStatN;
		}
		if(!typ01)	return "";
		let objTyp = listLegalStatus.find(item => item.id == cfgVal02);
		if(objTyp)	return $.i18n(objTyp.val01);
		return "";
	});
	Handlebars.registerHelper('reqTypPartner', function(typ02) {
		if(!typ02)	return "";
		let objTyp = App.data.cfgValListTypePartner.find(item => item.id == typ02);
		if(objTyp)	return $.i18n(objTyp.val01);
		return "";
	});
	Handlebars.registerHelper('reqTypDomain', function(cfgVal01) {
		if(!cfgVal01)	return "";
		let objTyp = App.data.cfgValListTypeDomainPartner.find(item => item.id == cfgVal01);
		if(objTyp)	return $.i18n(objTyp.val01);
		return "";
	});
	var STAT_PARTNER = {
			0: "per_partner_stat_00",	1: "per_partner_stat_01",	2: "per_partner_stat_02",
			3: "per_partner_stat_03",	10: "per_partner_stat_10",	11: "per_partner_stat_11",	100: "per_partner_stat_null"
	}
	Handlebars.registerHelper('reqStatPartner', function(stat) {
		if(!stat)				return $.i18n(STAT_PARTNER[100]);
		if(!STAT_PARTNER[stat])	return $.i18n(STAT_PARTNER[100]);
		return $.i18n(STAT_PARTNER[stat]);
	});
	Handlebars.registerHelper('reqStatBadgePartner', function(stat) {
		if(stat == 11)	return "badge-danger";
		if(stat == 3)	return "badge-success";
		return "badge-info";
	});
	Handlebars.registerHelper('cutStrInfo', function(str) {
		if(!str)	return "";
		if(str.length < 100)	return str;
		return str.substr(0, 100) + "...";
	});
	const TYP_USER = {
			2: "aut_user_ent_header_type_adm"	,	3: "aut_user_ent_header_type_agent"	,	5: "aut_user_ent_header_type_member",
			6: "aut_user_ent_header_type_mentor",	8: "aut_user_ent_header_type_shipper"
	}
	Handlebars.registerHelper('reqTypUser', function(typ) {
		if(!typ)				return $.i18n(TYP_USER[3]);
		if(!TYP_USER[typ])		return $.i18n(TYP_USER[3]);
		return $.i18n(TYP_USER[typ]);
	});
	Handlebars.registerHelper('reqTypBadgeUser', function(typ) {
		if(typ == 2)	return "badge-danger";
		if(typ == 6)	return "badge-success";
		return "badge-info";
	});
	Handlebars.registerHelper('reqPositionUser', function(pos) {
		if(!pos)	return $.i18n("prj_dashboard_tab_user_info_no_pos");
		return pos.reduce((name, item) => name + " /" + $.i18n("prj_dashboard_tab_user_info_" + item.code.toLowerCase()), "")
	});
	const SOCIAL_NETWORK = {
			"fb": {label: "Facebook", bgColor: "primary"}, "tw": {label: "Twitter", bgColor: "info"}, "ln": {label: "LinkedIn", bgColor: "info"}, "gg": {label: "Google", bgColor: "danger"}, "ig": {label: "Instagram", bgColor: "pink"}
	}
	Handlebars.registerHelper('reqNameSocialNetwork', function(code) {
		if(!code)					return "";
		if(!SOCIAL_NETWORK[code])	return "";
		return SOCIAL_NETWORK[code].label;
	});
	Handlebars.registerHelper('reqIconSocialNetwork', function(code) {
		if(!code)					return "";
		if(!SOCIAL_NETWORK[code])	return "";
		return SOCIAL_NETWORK[code].label.toLowerCase();
	});
	Handlebars.registerHelper('reqBgColorSocialNetwork', function(code) {
		if(!code)					return "primary";
		if(!SOCIAL_NETWORK[code])	return "primary";
		return SOCIAL_NETWORK[code].bgColor;
	});
	const PR_ICON_FOLDER = {
			"INBOX"		: "mdi-email-outline"		, "Sent": "mdi-email-check-outline"	, "Trash"			: "mdi-trash-can-outline"	, "[Gmail]"	: "mdi-gmail",
			"Corbeille"	: "mdi-trash-can-outline"	, "Spam": "mdi-bacteria-outline"	, "Objets envoyés"	: "mdi-email-check-outline" , "Brouillons": "mdi-file-outline",
			"Archives"	: "mdi-bag-personal-outline"
	}
	Handlebars.registerHelper('reqIconFolderMail', function(folder) {
		return PR_ICON_FOLDER[folder];
	});
	const PR_LANGUAGE_FOLDER = {
			"INBOX"		: "prj_email_folder_inbox", "Sent": "prj_email_folder_sent", "Trash"			: "prj_email_folder_trash", "[Gmail]"	: "prj_email_folder_gmail",
			"Corbeille"	: "prj_email_folder_trash", "Spam": "prj_email_folder_spam", "Objets envoyés"	: "prj_email_folder_sent" , "Brouillons": "prj_email_folder_draft",
			"Archives"	: "prj_email_folder_archive"
	}
	Handlebars.registerHelper('reqNameFolderMail', function(name) {
		return $.i18n(PR_LANGUAGE_FOLDER[name]);
	});
	Handlebars.registerHelper('reqDestinationMail', function(folder, from, to) {
		if(["Brouillons", "Sent", "Objets envoyés"].includes(folder))	return to;
		return from;
	});
	Handlebars.registerHelper('reqNameEmail', function(name) {
		if(!name)		return "";
		let begin = name.indexOf("<");
		if(begin < 0)	return name;
		return name.slice(0, begin);
	});
	Handlebars.registerHelper('reqEmailEmail', function(name) {
		if(!name)		return "";
		let begin 	= name.indexOf("<");
		if(begin < 0)	return "";
		let end 	= name.indexOf(">");
		return name.slice(begin + 1, end);
	});
	Handlebars.registerHelper('cutStrName', function(str) {
		if(!str)	return "";
		if(str.length < 15)	return str;
		return str.substr(0, 12) + "...";
	});
	//------------------------------------------------------------------------
	Handlebars.registerHelper("url_root", function() {
		return  UI_URL_ROOT;
	});
	Handlebars.registerHelper("url_image", function(path) {
		return  UI_URL_ROOT + path;
	});
	Handlebars.registerHelper("url_image_remote", function(path) {
		return  URL_DOMAIN + path;
	});
	Handlebars.registerHelper("url_image_err", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg'
		return 'this.src = "'+errPath+ '"';
	});
	Handlebars.registerHelper("url_image_no_avatar", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/default_user.png'
		return 'this.src = "'+errPath+ '"';
	});
	Handlebars.registerHelper("path_image_err", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg'
		return errPath;
	});
	Handlebars.registerHelper('for', function(from, to, incr, block) {
		var accum = '';
		for(var i = from; i < to; i += incr)
			accum += block.fn(i);
		return accum;
	});
	Handlebars.registerHelper('ifOrs', function(...restArg){
		let options 	= restArg[restArg.length - 1];
		restArg.length 	= restArg.length - 1;
		return restArg.some(e => !!e) ? options.fn(this) : options.inverse(this);
	});
	Handlebars.registerHelper('log', function(obj){
		console.log(obj);
	});
}
do_gl_Handlebars_Register();


//-----WebContent/www/js/app/common/ctrl/SummerNoteController.js------------------------------
var SummerNoteController 	= function () {
	const pr_grpName		= 'SummerNote';
	const tmplName			= App.template.names[pr_grpName] = {};
	const tmplCtrl			= App.template.controller;
	require(['text!common/tmpl/CMS_SummerNote.html'], function (tmpl) {
		tmplName	.CMS_SUMMER_NOTE_LIST 	= pr_grpName+ "CMS_SummerNote_List";
		tmplName	.CMS_SUMMER_NOTE 		= pr_grpName+ "CMS_SummerNote";
		tmplName	.CMS_SUMMER_NOTE_MATH 	= pr_grpName+ "CMS_SummerNote_Math";
		tmplCtrl.do_lc_put_tmplRaw(tmpl, pr_grpName);
	});
	var self 				= this;
	var pr_searchKey		= "";
	var pr_div              = "";
	var pr_math_numBut		= 50;
	this.do_lc_show_unique = function(inp, options = {}, entTyp, entId, typ01, typ02, typ03) {
		let defaultOptions = {
				height		: 400,
				minHeight	: null,
				maxHeight	: null,
//				focus		: true, 
				dialogsInBody: true,
				callbacks: {
					onImageUpload: function(files) {
						(files && files.length) && do_lc_up_file(this, files, entTyp, entId, typ01, typ02, typ03);	
					},
					onImageLinkInsert: function(url) {
						$img = $('<img>').attr({ src: url })
						$(this).summernote('insertNode', $img[0]);
					},
					onFileUpload: function(files) {
						(files && files.length) && do_lc_up_file(this, files, entTyp, entId, typ01, typ02, typ03);
					},
				},
				toolbar: [
					['style', ['style', 'clear']],
					['font', ['bold', 'underline', 'italic']],
					['fontname', ['fontname']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['table', ['table']],
					['insert', ['link', 'picture', 'video', 'file', 'existBtn']],
					['view', ['fullscreen', 'codeview', 'help']],
					],
					buttons: {
						existBtn: buttonExistImageCustom
					}
		}
		if(options){
			options = Object.assign(options, defaultOptions);
		}
		$(inp).summernote(options);
	};
	this.do_lc_show = function(div, options = {}, modSimple = false, entTyp, entId, typ01, typ02, typ03) {
		pr_div  = div;
		let symbole = [
			['style', ['style', 'clear']],
			['font', ['bold', 'underline', 'italic']],
			['fontsize', ['fontsize']],
			['height', ['height']],
			['fontname', ['fontname']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['table', ['table']],
//			['insert', ['link', 'picture', 'video', 'file',  'hello', 'emoji']],
			['insert', ['link', 'picture', 'video',  'emoji']],
//			['view', ['fullscreen', 'codeview', 'help']],
			['view', [ 'codeview']],
			
			['more', ['more']],
			['hide', ['hide']]
			];
		let defaultOptions = {
				height		: 180,
				minHeight	: null,
				maxHeight	: null,
//				focus		: true, 
				dialogsInBody: true,
				callbacks: {
					onImageUpload: function(files) {
						(files && files.length) && do_lc_up_file(this, files, entTyp, entId, typ01, typ02, typ03);	
					},
					onImageLinkInsert: function(url) {
						$img = $('<img>').attr({ src: url })
						$(this).summernote('insertNode', $img[0]);
					},
					onFileUpload: function(files) {
						(files && files.length) && do_lc_up_file(this, files, entTyp, entId, typ01, typ02, typ03);
					},
					onMediaDelete : function(target) {
						do_lc_delete_file(target[0]);
					}
				},
				toolbar: symbole,
				buttons: {
					hello		: buttonExistImageCustom,
					more 		: buttonShowFull,
					hide 		: buttonShowSimple,
				},
				lang: App.language,
				lineHeights: ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '2.0', '3.0']
		}
		if(options){
			options = Object.assign(defaultOptions, options);
			options.div_parent = div;
		}
		document.emojiSource = 'www/js/lib/summernote/emoji/img';
		$(div).find("textarea").each(function(index){
			if (index==0)
				$(this).summernote(options);
//			$(this).summernote('lineHeight', 1.15);
		})
		if(modSimple){
			$(div).find(".note-style, .note-fontsize, .note-fontname, .note-table, .note-view, .note-height, .note-hide").hide();
		}else{
			$(div).find(".note-more, .note-hide").hide();
		}
	};
	this.do_lc_show_withMathSymbole = function(div, options = {}, modSimple = false, entTyp, entId, typ01, typ02, typ03) {
		pr_div  = div;
		let symbole = [
			['style', ['style', 'clear']],
			['font', ['bold', 'underline', 'italic']],
			['fontsize', ['fontsize']],
			['fontname', ['fontname']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['table', ['table']],
			['insert', ['link', 'picture', 'video' ,'file']], //'hello', 'emoji'
			['view', ['fullscreen', 'codeview', 'help']],
			['height', ['height']],
			['mathMore', ['mathMore']],
			['mathRefresh', ['mathRefresh']],
			['math1', ['math1']],
			['math2', ['math2']],
			['math3', ['math3']],
			['math10', ['math10', 'math11', 'math12', 'math13', 'math14', 'math15', 'math16', 'math17' ]],
			['math20', ['math20']],
			['math21', ['math21']],
			['math22', ['math22']],
			['math23', ['math23']],
			['math30', ['math30', 'math31', 'math32', 'math33']],
			['math40', ['math40', 'math41', 'math42']],
			['mathLess', ['mathLess']],
			['more', ['more']],
			['hide', ['hide']]
			];
		let defaultOptions = {
				height		: 180,
				minHeight	: null,
				maxHeight	: null,
//				focus		: true, 
				dialogsInBody: true,
				callbacks: {
					onImageUpload: function(files) {
						(files && files.length) && do_lc_up_file(this, files, entTyp, entId, typ01, typ02, typ03);	
					},
					onImageLinkInsert: function(url) {
						$img = $('<img>').attr({ src: url })
						$(this).summernote('insertNode', $img[0]);
					},
					onFileUpload: function(files) {
						(files && files.length) && do_lc_up_file(this, files, entTyp, entId, typ01, typ02, typ03);
					},
				},
				toolbar: symbole,
				buttons: {
					//hello		: buttonExistImageCustom,
					more 		: buttonShowFull,
					hide 		: buttonShowSimple,
					mathMore 	: buttonMathMore,
					mathLess 	: buttonMathLess,
					mathRefresh : buttonMathRefresh,
					math1		: (context, div) => buttonMathCustomChild(context, div, "$ $"						, "math1.jpg"),
					math2		: (context, div) => buttonMathCustomChild(context, div, "$$ $$"						, "math2.jpg"),
					math3		: (context, div) => buttonMathCustomChild(context, div, "\\begin{gather*} f(x)\&=\&... \\\\ \& =\&... \\end{gather*}", "math3.jpg"),
					math10		: (context, div) => buttonMathCustomChild(context, div, "\\sum_{n=i}^{\\infty}"	, "math10.jpg"),
					math11		: (context, div) => buttonMathCustomChild(context, div, "\\prod_{i=a}^{b}"		, "math11.jpg"),
					math12		: (context, div) => buttonMathCustomChild(context, div, "\\lim_{x\\to\\infty}"	, "math12.jpg"),
					math13		: (context, div) => buttonMathCustomChild(context, div, "x^y"					, "math13.jpg"),
					math14		: (context, div) => buttonMathCustomChild(context, div, "x_y"					, "math14.jpg"),	
					math15		: (context, div) => buttonMathCustomChild(context, div, "{ x \\over y }"		, "math15.jpg"),
					math16		: (context, div) => buttonMathCustomChild(context, div, "\\sqrt{x}"				, "math16.jpg"),
					math17		: (context, div) => buttonMathCustomChild(context, div, "\\vec{v}"				, "math17.jpg"),
					math20		: (context, div) => buttonMathCustomChild(context, div, "\\int_{a}^{b}"			, "math20.jpg"),
					math21		: (context, div) => buttonMathCustomChild(context, div, "\\iint_{a}^{b}"		, "math21.jpg"),
					math22		: (context, div) => buttonMathCustomChild(context, div, "\\iiint_{a}^{b}"		, "math22.jpg"),
					math23		: (context, div) => buttonMathCustomChild(context, div, "\\oint_{a}^{b}"		, "math23.jpg"),
					math30		: (context, div) => buttonMathCustomChild(context, div, "\\ne"					, "math30.jpg"),
					math31		: (context, div) => buttonMathCustomChild(context, div, "\\pm"					, "math31.jpg"),
					math32		: (context, div) => buttonMathCustomChild(context, div, "\\infty"				, "math32.jpg"),
					math33		: (context, div) => buttonMathCustomChild(context, div, "\\,"					, "math33.jpg"),
					math40		: (context, div) => buttonMathCustomChild(context, div, "\\begin{matrix}1 \& 2 \\\\a \& b  \\end{matrix}"	, "math40.jpg"),
					math41		: (context, div) => buttonMathCustomChild(context, div, "\\begin{pmatrix}1 \& 2 \\\\a \& b \\end{pmatrix}"	, "math41.jpg"),
					math42		: (context, div) => buttonMathCustomChild(context, div, "\\begin{bmatrix}1 \& 2 \\\\a \& b \\end{bmatrix}"	, "math42.jpg"),
				},
				lang: App.language,
				lineHeights: ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '2.0', '3.0']
		}
		if(options){
			options = Object.assign(defaultOptions, options);
			options.div_parent = div;
		}
		document.emojiSource = 'www/js/lib/summernote/emoji/img';
		$(div).find("textarea").each(function(index){
			if (index==0)
				$(this).summernote(options);
//			$(this).summernote('lineHeight', 1.15);
		})
		// Hide list math buttons
		do_lc_hide_math_btn(div, pr_math_numBut);
		if(modSimple){
			$(div).find(".note-style, .note-fontsize, .note-fontname, .note-table, .note-view, .note-height, .note-hide").hide();
		}else{
			$(div).find(".note-more, .note-hide").hide();
		}
	};
	const do_lc_hide_math_btn = function (div, n) {
		for (let i = 0; i < n; i++) {
			const str = ".note-math" + (i + 1);
			$(div).find(str).hide();
		}
		$(div).find(".note-mathMore").show();
		$(div).find(".note-mathLess").hide();
		$(div).find(".note-mathRefresh").hide();
		$("#divMathPreview").hide();
	}
	const do_lc_show_math_btn = function (div, n) {
		for (let i = 0; i < n; i++) {
			const str = ".note-math" + (i + 1);
			$(div).find(str).show();
		}
		$(div).find(".note-mathMore").hide();
		$(div).find(".note-mathLess").show();
		$(div).find(".note-mathRefresh").show();
		$("#divMathPreview").show();
	}
	const buttonExistImageCustom = function (context) {
		let ui 		= $.summernote.ui;
		let div		= context.options.div_parent;
		let button 	= ui.button({
			contents	: '<i class="fa fa-plus"></i>',
			tooltip		: $.i18n("common_select_btn_toottip"),
			click		: function () {
				App.MsgboxController.do_lc_show({
					title		: $.i18n("common_select_image_title"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_SUMMER_NOTE, {}),
					autoclose	: false,
					buttons		: {
						OK: {
							lab			: $.i18n("common_select_image"),
							funct		: do_lc_add_image,
							param		: [context],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent : function(){
						$("#btn_search_img_editor").off("keyup").on("keyup", function(){
							pr_searchKey	= $(this).val();
							do_gl_execute_debounce(do_lc_get_file_existe);
						})
					}
				});	
				do_lc_get_file_existe();
			}
		});
		return button.render();   // return button as jquery object
	}
	const buttonMathMore = function (context) {
		let ui 		= $.summernote.ui;
		let div		= context.options.div_parent;
		let button 	= ui.button({
			contents	: '<b>f(...)</b>',
			tooltip		: $.i18n("common_select_btn_math"),
			click		: function () {
				do_lc_show_math_btn(div, pr_math_numBut);
			}
		});
		return button.render();   // return button as jquery object
	}
	const buttonMathLess = function (context) {
		let ui 		= $.summernote.ui;
		let div		= context.options.div_parent;
		let button 	= ui.button({
			contents	: '<i class="fa fa-angle-left"></i>',
			tooltip		: $.i18n("common_select_btn_math"),
			click		: function () {
				do_lc_hide_math_btn(div, pr_math_numBut);
			}
		});
		return button.render();   // return button as jquery object
	}
	const buttonMathRefresh = function (context) {
		let ui 		= $.summernote.ui;
		let div		= context.options.div_parent;
		let button 	= ui.button({
			contents	: '<i class="fa fa-refresh"></i>',
			click		: function () {					
				var txt = $(".note-editing-area").find(".note-editable").html();
				MathJaxPreview.Update(true, txt, true);
			}
		});
		return button.render();   // return button as jquery object
	}
	const buttonMathCustomChild = function (context, div, text, imgName) {
		let ui 		= $.summernote.ui;
		let imgSrc 	= "www/img/math/" + imgName;
		let button 	= ui.button({
			contents	: `<img src=${imgSrc} style="height:20px"/>`,
			click		: function () {
				$(div).find("textarea").each(function(index){
					if (index==0){
						$(this).summernote('insertText', text);
						var txt = $(".note-editing-area").find(".note-editable").html();
						MathJaxPreview.Update(true, txt, true);
					}							
				})
			}
		});
		return button.render();   // return button as jquery object
	}
	const buttonShowFull = function (context) {
		let ui 		= $.summernote.ui;
		let div		= context.options.div_parent;
		let button 	= ui.button({
			contents	: '<i class="fa fa-arrow-right"></i>',
			tooltip		: $.i18n("common_sel_all"),
			click		: function () {
				$(div).find(".note-style, .note-fontsize, .note-fontname, .note-btn-group.note-table, .note-view, .note-height,  .note-hide").show();
				$(div).find(".note-more").hide();
			}
		});
		return button.render();   // return button as jquery object
	}
	const buttonShowSimple = function (context) {
		let ui 		= $.summernote.ui;
		let div		= context.options.div_parent;
		let button 	= ui.button({
			contents	: '<i class="fa fa-arrow-left"></i>',
			tooltip		: $.i18n("common_sel_all"),
			click		: function () {
				$(div).find(".note-style, .note-fontsize, .note-fontname, .note-btn-group.note-table, .note-view, .note-height,  .note-hide").hide();
				$(div).find(".note-more").show();
			}
		});
		return button.render();   // return button as jquery object
	}
	const do_lc_up_file = function(divSummernote, files, entTyp, entId, typ01, typ02, typ03){
		let ref = new FormData();
		ref.append('sv_class'	, 'ServiceTpyDocument');
		ref.append('sv_name'	, 'SVNewInPost');
		ref.append('entTyp'		, entTyp);
		ref.append('entId'		, entId);
		ref.append('typ01'		, typ01);
		ref.append('typ02'		, typ02);
		ref.append('typ03'		, typ03);
		for(let i = 0; i < files.length; i++) {
			ref.append('file', files[i]);
		}
		const headers = {
				Authorization: App.data["HttpSecuHeader"].Authorization,
				Accept: 'multipart/form-data'
		}
		let fSucces 	= [];
		fSucces.push(req_gl_funct(null, do_lc_after_upload_file, [divSummernote, files]));
		let fError 	= req_gl_funct(null, do_lc_upload_error, [$.i18n("common_err_ajax") ]);
		App.network.do_lc_ajax_form(App.path.BASE_URL_API_UPLOAD, headers, ref, 100000, fSucces, fError);
	}
	let listMimeImg 	= ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg'];
	let listMimeAudio 	= ['audio/mpeg', 'audio/ogg'];
	let listMimeVideo 	= ['video/mpeg', 'video/mp4', 'video/webm'];
	const do_lc_after_upload_file = function(sharedJson, divSummernote, files){
		if (can_gl_AjaxSuccess(sharedJson)) {
			let data = sharedJson[App['const'].RES_DATA];
			if(data && data.length){
				for (var i in data){
					var elem 	= data[i];
					var file	= files[i];
					if (listMimeImg.indexOf(file.type) > -1) {
						let $img 	= document.createElement("IMG");
						const fPath = APP_API_URL + elem.url.replace('\\', '/'); //file.name.substring(iStart, file.name.length).replace('\\', '/')
						$img.src 	= fPath;
						$img.setAttribute("data-id", elem.id);
						$(divSummernote).summernote('insertNode', $img);
					
					} else if (listMimeAudio.indexOf(file.type) > -1) {
						//Audio
						let $aud = document.createElement("audio");
						$aud.src = APP_API_URL + elem.url;
						$aud.setAttribute("controls", "controls");
						$aud.setAttribute("preload", "metadata");
						$(divSummernote).summernote('insertNode', $aud);
					} else if (listMimeVideo.indexOf(file.type) > -1) {
						//Video
						let $vid = document.createElement("video");
						$vid.src = APP_API_URL + elem.url;
						$vid.setAttribute("controls", "controls");
						$vid.setAttribute("preload", "metadata");
						$(divSummernote).summernote('insertNode', $vid);
					} else {
						//Other file type
						let $a 			= document.createElement("a");
						let $linkText 	= document.createTextNode(elem.name);
						$a.appendChild(linkText);
						$a.title 		= file.fname;
						$a.href 		= APP_API_URL + elem.url;
						$(divSummernote).summernote('insertNode', $vid);
					}
				}
			}
		} else {
			do_gl_show_Notify_Msg_Error ($.i18n("common_err_ajax"));	
		}
	}
	const do_lc_delete_file = (target) => {
		//---- send API delete file in some case
		//---- some case keep file to use in other post
	}
	const do_lc_get_file_existe = function(divSummernote){
		let ref 				= req_gl_Request_Content_Send_With_Params("ServiceTpyDocument", "SVListPage", {searchKey: pr_searchKey});
		const callbackFunct 	= data => do_lc_show_list_ByAjax_Dyn(data, divSummernote);
		let opt 				= {
				divMain			: "#div_img_list",
				divPagination	: "#div_img_pagination",
				url_api 		: App.path.BASE_URL_API_PRIV, 
				url_header 		: App.data["HttpSecuHeader"],
				url_api_param 	: ref,
				pageSize 		: 12,
				pageRange		: 1,
				callback		: callbackFunct
		};
		do_gl_init_pagination_opt(opt);
	}
	const do_lc_show_list_ByAjax_Dyn = function(sharedJson, divSummernote){
		let data = [];
		if (can_gl_AjaxSuccess(sharedJson)) {
			data = sharedJson[App['const'].RES_DATA];
		}
		$("#div_img_list")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_SUMMER_NOTE_LIST, data));
		do_lc_bind_event_msgbox();
	}
	const do_lc_bind_event_msgbox = function(){
		$(".item-doc").off("click").on("click", function() {
			let checkbox = $(this).find(".item-doc-check");
			checkbox.prop("checked", !checkbox.prop("checked"));
		})
	}
	const do_lc_add_image = function(divSummernote){
		let $imgSelects = $(".item-doc-check:checked");
		if($imgSelects && $imgSelects.length){
			for(let i = 0; i < $imgSelects.length; i++){
				let $img = document.createElement("IMG");
				$img.src = $($imgSelects[i]).data("src");
				
				
				divSummernote.$note.summernote('editor.saveRange');
				// Editor loses selected range (e.g after blur)
				divSummernote.$note.summernote('editor.restoreRange');
				divSummernote.$note.summernote('editor.focus');
//				divSummernote.$note.summernote('editor.insertText', 'This text should appear at the cursor');
				divSummernote.$note.summernote('insertNode', $img);
			}
		}
		App.MsgboxController.do_lc_close();
	}
	const do_lc_upload_error = (sharedJson, msg) => do_gl_show_Notify_Msg_Error (msg);
	this.do_lc_insert_image_base64 = function (pr_div, text) {				
		let $img = document.createElement("IMG");
		$img.src = text;
		$(pr_div).find("textarea").each(function(index){
			if (index==0)
				$(this).summernote('insertNode', $img);
		})
	}
};


//-----WebContent/www/js/app/common/ctrl/MsgboxController_New.js------------------------------
var MsgboxController 	= function () {
	const pr_grpName		= 'MsgBox';
	const tmplName			= App.template.names[pr_grpName] = {};
	const tmplCtrl			= App.template.controller;
	require(['text!common/tmpl/CMS_MsgBox_New.html'], function (tmpl) {
		tmplName	.CMS_MSGBOX_NEW 		= pr_grpName+ "CMS_MsgBox";
		tmplCtrl.do_lc_put_tmplRaw(tmpl, pr_grpName);
	});
	var self 				= this;
	var pr_msgboxDivId		= "#msb_message_box_";
	var pr_msgElts 			= [];
	var pr_curElt			= 0;
	var pr_NUMBER_MSGBOX 	= 0;
	this.BASE_ZINDEX 		= 1040;
	this.do_lc_show = function(params) {
		do_lc_init_modal();
		do_lc_clean_msgBox();
		do_lc_get_content_modal(params);
		do_lc_bind_event_msgBox(params);
		
		//---class declared in _responsive.css
		//---use this class to keep scroll when multi modal opened and close => class modal is remove, then scrolling is disabled
		$('body').addClass('modal-open-hnv');
	};
	this.do_lc_close = function() {		
		$(pr_msgboxDivId + pr_NUMBER_MSGBOX).modal("hide");
		pr_NUMBER_MSGBOX--;
		if (pr_NUMBER_MSGBOX > 0) {
			adjustBackdrop();
			// bootstrap removes the modal-open class when a modal is closed; add it back
			$('body').addClass('modal-open-hnv');
		} else{
			pr_NUMBER_MSGBOX = 0;
			$('body').removeClass('modal-open-hnv');
		}
	};
	
	this.do_lc_refresh = function() {		
		if (pr_NUMBER_MSGBOX > 0) {
			// bootstrap removes the modal-open class when a modal is closed; add it back
			$('body').addClass('modal-open-hnv');
		}else{
			pr_NUMBER_MSGBOX = 0;
			$('body').removeClass('modal-open-hnv');
		}
	};
	this.do_lc_reset = function() {
		if (pr_NUMBER_MSGBOX > 0) {
			for (var i=1;i<=pr_NUMBER_MSGBOX;i++)
				$(pr_msgboxDivId + i).modal("hide");
		}
		pr_NUMBER_MSGBOX =0;
		$('body').removeClass('modal-open-hnv');
	}
	//--------------------------------------------------------------------------------------------
	var bindDefaultEvent = function() {
		$("body").on("keydown", onTabEvent);
	};
	var adjustModal = function($target){
		let modalIndex = pr_NUMBER_MSGBOX - 1;
		$target.css('z-index', this.BASE_ZINDEX + (modalIndex * 20) + 10);
	}
	var adjustBackdrop = function () {
		let modalIndex = pr_NUMBER_MSGBOX - 1;
		$('.modal-backdrop:first').css('z-index', this.BASE_ZINDEX + (modalIndex * 20));
	};
	var do_lc_init_modal = function(){
		pr_NUMBER_MSGBOX++;
		$("body").append(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_MSGBOX_NEW, {num: pr_NUMBER_MSGBOX}));
		let $target = $(pr_msgboxDivId + pr_NUMBER_MSGBOX);
		
		adjustModal($target);
		adjustBackdrop();
		$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .close").on("click", this.do_lc_close);
	}.bind(this);
	var do_lc_clean_msgBox = function(){
		$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-footer")	.html("");
		$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-body")	.html("");
		$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-footer")	.show();
		$("body").off("keydown", onTabEvent);
	}
	var do_lc_get_content_modal = function(params){
		if(params.css) {
			for(let i in params.css){
				$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-dialog" ) .css(i, params.css[i]);
			}
		}
		if(params.title) {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-title").html(params.title);
		}
		if(params.content) {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-body").html(params.content);
		}
		if(params.buttons) {
			var btns = params.buttons;
			if(params.buttons == "none") {
				$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-footer").hide();
			} else {
				Object.keys(params.buttons).forEach(function(key) {
					let btn 		= btns[key];
					let btnlabel 	= btn && btn.lab 		? btn.lab		: key;
					let btnClass 	= btn && btn.classBtn 	? btn.classBtn 	: "btn-default";
					let $btnKey 	= $(pr_msgboxDivId + pr_NUMBER_MSGBOX + " #btn_msgbox_"+key);
					if($btnKey.length > 0) {
						$btnKey.off("click");
						$btnKey.remove();
					}
					$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-footer").append(`<button id='btn_msgbox_${key}' type='button' class='btn ${btnClass}' >${btnlabel}</button>`);
					$btnKey = $(pr_msgboxDivId + pr_NUMBER_MSGBOX + " #btn_msgbox_"+key);
					if(btn != null) {	
						if(!btn.param) {
							btn.param = [];
						}
						if(!btn.context) {
							btn.context = null;
						}
						if(btn.funct) {
							$btnKey.off("click").on("click", function(){  
								btn.funct.apply(btn.context, btn.param);
							});
						} else if(btn.action) {
							$btnKey.off("click").on("click", function(){  
								btn.action.apply(btn.context, btn.param);
							});
						}
//						btn.funct && $btnKey.off("click").on("click", function(){  
//						btn.funct.apply(btn.context, btn.param);
//						});
					}
					if(btn.reload) {
						btn.context = this;
						$btnKey.on("click", function() {
							btn.context.do_lc_show.apply(btn.context, [btn.reload]);
						});
					}
					//always close the dialog box after callback of the button        
					if(btn.autoclose != undefined && btn.autoclose == false) {
						//do nothing
					} else {
						$btnKey.on("click", this.do_lc_close);
					}
				}, this);
			}
		} else {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-footer").append("<button id='btn_msgbox_close' type='button' class='btn btn-default' >"+$.i18n("msgbox_btn_close")+"</button>");
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " #btn_msgbox_close").off("click").on("click", this.do_lc_close);
		}
	}.bind(this);
	var do_lc_bind_event_msgBox = function(params){
		pr_curElt		= 0;
		if(params.css) {
			for (var  ele in params.css){
				$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-dialog").css(params.css[ele].attr, params.css[ele].val);
			}
		}
		if(params.bindEvent) {
			params.bindEvent($(pr_msgboxDivId + pr_NUMBER_MSGBOX));
		}
		if(params.autoclose == false) {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX).modal({
				backdrop: 'static',
				keyboard: false
			});
		} else {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX).modal("show");
		}
		if(params.width) {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-dialog").css("width", params.width);
		}
		if(params.widthMax) {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-dialog").css("max-width", params.widthMax);
    	}
		//add event when dialog has been closed : delete all buttons
		$(pr_msgboxDivId + pr_NUMBER_MSGBOX).off("hidden.bs.modal").on('hidden.bs.modal', function() {
			$("body").off("keydown",onTabEvent);
			$(this).remove();
			if(params.onClose) {
				params.onClose();
			}
		});
		pr_msgElts = $(pr_msgboxDivId + pr_NUMBER_MSGBOX).find("input, select, textarea, button, a");
		if(pr_msgElts.length > 0) {
			pr_msgElts[0].focus();
			pr_msgElts.each(function(index) {
				$(this).on("focus", function() {
					pr_curElt		= index;
				});
			});
		}
		$(".modal-dialog").draggable({
			handle: ".modal-header"
		});
		bindDefaultEvent();
	}.bind(this);
	var onTabEvent = function(event) {
		if(event.which === 9 && event.shiftKey){
			event.preventDefault();
			pr_curElt -= 1;
			if(pr_curElt < 0) {
				pr_curElt = pr_msgElts.length;
			}
			var count = 0;
			while(!$(pr_msgElts[pr_curElt]).is(":focusable")) {
				pr_curElt -= 1;
				if(pr_curElt <0) {
					pr_curElt = pr_msgElts.length;
				}
				count ++;
				if(count > 100) {
					return;
				}
			}
			pr_msgElts[pr_curElt].focus();
		}
		else if(event.which === 9) {
			event.preventDefault();
			pr_curElt += 1;
			if(pr_curElt >= pr_msgElts.length) {
				pr_curElt = 0;
			}
			var count = 0;
			while(!$(pr_msgElts[pr_curElt]).is(":focusable")) {
				pr_curElt += 1;
				if(pr_curElt >= pr_msgElts.length) {
					pr_curElt = 0;
				}
				count ++;
				if(count > 100) {
					return;
				}
			}
			pr_msgElts[pr_curElt].focus();
		}
	};
};


//-----WebContent/www/js/app/common/ctrl/NotifyTool.js------------------------------
//import notify.js
//---------------------------------------------------------------------------------------
function do_gl_show_Notify_Msg_Default (msg, layout, type, eleParent){
	if (!layout) layout = "topLeft";
	if (!type) type = "info";
	if(eleParent)
		$(eleParent).notify(msg, {className: type, position: layout});
	else
		$.notify(msg, {className: type, position: layout});	
};
function do_gl_show_Notify_Msg_Info (msg, layout, eleParent){
	if (!layout) layout = "topLeft";
	var type = "info";
	if(eleParent)
		$(eleParent).notify(msg, {className: type, position: layout});
	else
		$.notify(msg, {className: type, position: layout});	
};
function do_gl_show_Notify_Msg_Error (msg, layout, eleParent){
	if (!layout) layout = "topLeft";
	var type = "error";
	if(eleParent)
		$(eleParent).notify(msg, {className: type, position: layout});
	else
		$.notify(msg, {className: type, position: layout});
};
function do_gl_show_Notify_Msg_Warn (msg, layout, eleParent){
	if (!layout) layout = "topLeft";
	var type = "warn";
	if(eleParent)
		$(eleParent).notify(msg, {className: type, position: layout});
	else
		$.notify(msg, {className: type, position: layout});
};
function do_gl_show_Notify_Msg_Success (msg, layout, eleParent){
	if (!layout) layout = "topLeft";
	var type = "success";
	if(eleParent)
		$(eleParent).notify(msg, {className: type, position: layout});
	else
		$.notify(msg, {className: type, position: layout});
};
//---API---------------------------------------------------------------------------------
/*
$.notify( string|object, [ options ])
	string|object - global notification data
	options - an options object or class name string
$.notify( element, string|object, [ options ])
	element - a jquery element
	string|object - element notification data
	options - an options object or class name string
$( selector ).notify( string|object, [ options ])
	selector - jquery selector
	string|object - element notification data
	options - an options object or class name string
$.notify.addStyle( styleName, styleDefinition )
	styleName - string (the style option references this name)
	styleDefinition - style definition object (see Styling below)
$.notify.defaults( options )
	options - an options object (updates the defaults listed below)
*/
function do_gl_show_Notify_Global(strOrObj, options){
	$.notify(strOrObj, options);
}
function do_gl_show_Notify_Element(element, strOrObj, options){
	$.notify(element, strOrObj, options);
}
function do_gl_show_Notify_Selector(selector, strOrObj, options){
	$(selector).notify(strOrObj, options);
}
function do_gl_show_Notify_Style(styleName, styleDef){
	$.notify.addStyle(styleName, styleDef);
}
function do_gl_show_Notify_Defaults(options){
	$.notify.defaults(options);
}
//--------OPTIONS PARAMS----------------------------------------------------------------
/*
{
  // whether to hide the notification on click
  clickToHide: true,
  // whether to auto-hide the notification
  autoHide: true,
  // if autoHide, hide after milliseconds
  autoHideDelay: 5000,
  // show the arrow pointing at the element
  arrowShow: true,
  // arrow size in pixels
  arrowSize: 5,
  // position defines the notification position though uses the defaults below
  position: '...',
  // default positions
  elementPosition: 'bottom left',
  globalPosition: 'top right',
  // default style
  style: 'bootstrap',
  // default class (string or [string])
  className: 'error',
  // show animation
  showAnimation: 'slideDown',
  // show animation duration
  showDuration: 400,
  // hide animation
  hideAnimation: 'slideUp',
  // hide animation duration
  hideDuration: 200,
  // padding between element and notification
  gap: 2
}
*/
function req_gl_set_Notify_Options(	className,
									position,
									elementPosition,
									globalPosition,
									style,
									clickToHide,
									autoHide,
									autoHideDelay,
									arrowShow,
									arrowSize,
									showAnimation,
									showDuration,
									hideAnimation,
									hideDuration,
									gap){
	var options = {};
	
	if(className)		options["className"] 		= className;
	if(position)		options["position"] 		= position;
	if(elementPosition)	options["elementPosition"] 	= elementPosition;
	if(globalPosition)	options["globalPosition"] 	= globalPosition;
	if(style)			options["style"] 			= style;
	if(clickToHide)		options["clickToHide"] 		= clickToHide;
	if(autoHide)		options["autoHide"] 		= autoHide;
	if(autoHideDelay)	options["autoHideDelay"] 	= autoHideDelay;
	if(arrowShow)		options["arrowShow"] 		= arrowShow;
	if(arrowSize)		options["arrowSize"] 		= arrowSize;
	if(showAnimation)	options["showAnimation"] 	= showAnimation;
	if(showDuration)	options["showDuration"] 	= showDuration;
	if(hideAnimation)	options["hideAnimation"] 	= hideAnimation;
	if(hideDuration)	options["hideDuration"] 	= hideDuration;
	if(gap)				options["gap"] 				= gap;
	
	return options;
}
jQuery.fn.highlight = function (str, className, id) {
	var regex = new RegExp(str, "gi");
    return this.each(function () {
        this.innerHTML = this.innerHTML.replace(regex, function(matched) {
            return "<span class=\"" + className + "\" id=\""+id+"\">" + matched + "</span>";
        });
    });
};


//-----WebContent/www/js/app/common/ctrl/SecurityTool.js------------------------------
/*
const do_gl_LocalStorage_Save  			= function (route, data)
const do_gl_LocalStorage_Remove  			= function (route)
var req_gl_LocalStorage  				= function (route) 
const do_gl_LS_UserProfile_Save  			= function (route, userProfile)
var req_gl_LS_UserProfile 				= function (route)
const do_gl_LS_SecurityInfo_Save  		= function (route, info)
const do_gl_LS_SecurityInfo_Save_Time  	= function (route)
var req_gl_LS_SecurityInfo 				= function (route)
const do_gl_LS_SecurityInfo_Remove  		= function (route)
var req_gl_LS_SecurityHeader 			= function (route)
var req_gl_LS_SecurityHeaderBearer 		= function (route)
var req_gl_LS_Username 					= function (route)
 */
var SECU_PREFIX='/hnv/';
const do_gl_LocalStorage_Save  = function (route, data){
	if (!route)	    route = "tmp";
	if (data) 		localStorage.setItem(SECU_PREFIX+route,JSON.stringify(data));	
}
const do_gl_LocalStorage_Remove  = function (route){
	if (!route){
		localStorage.clear();
		return;
	}
	localStorage.removeItem(SECU_PREFIX+route);	
}
//--------------------------------------------------------------
var req_gl_LocalStorage  = function (route){
	if (!route)	    route = "tmp";
	var data		= localStorage.getItem(SECU_PREFIX+route);
	if (data) data  = JSON.parse(data);
	return data;
}
//--------------------------------------------------------------
//--------------------------------------------------------------
var rq_gl_Crypto = function(mdp, method) {
	if (!method)
		return makeCrypto_SHA256(mdp);
	else if (method=="sha256")
		return makeCrypto_SHA256(mdp);
	else if (method=="sha512")
		return makeCrypto_SHA512(mdp);
};
var makeCrypto_SHA256 = function(mdp) {
	//var crypto = CryptoJS.SHA1(CryptoJS.SHA1(mdp).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
	//var crypto = sha256_digest(sha256_digest(mdp).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
	//var crypto = CryptoJS.SHA1(mdp).toString(CryptoJS.enc.Hex);
	var crypto = sha256(mdp);
	return crypto;
};
var makeCrypto_SHA512 = function(mdp) {	
	var crypto = sha512_digest(sha512_digest(mdp).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);	
	return crypto;
};
//------------------------------------------------------------------------------------------------------------
const do_gl_LS_UserProfile_Save  = function (route, userProfile){
	if (userProfile) 	localStorage.setItem(SECU_PREFIX+route+ '/usr',JSON.stringify(userProfile));
}
var req_gl_LS_UserProfile = function (route){
	var userProfile = localStorage.getItem(SECU_PREFIX+route+ '/usr');
	if (!userProfile) return null; 
	return JSON.parse(userProfile);
}
//---------------------------------------------------------------------------------------------
var TIME_SESS_LIM_REM_0 = 1000*60*60*1;
var TIME_SESS_LIM_REM_2 = 1000*60*60*24*365;
var TIME_TOK_REFRESH	= 60000*15;
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
const do_gl_LS_SecurityInfo_Save  = function (route, info){
	saveInfo (route, '/tok'		, info.tok);
	saveInfo (route, '/login'	, info.login);
	saveInfo (route, '/pass'	, info.pass);
	saveInfo (route, '/wHash'	, info.wHash);
	saveInfo (route, '/wSalt'	, info.wSalt);
	saveInfo (route, '/salt'	, info.salt);
	saveInfo (route, '/rem'		, info.rem);
	saveInfo (route, '/time'	, new Date().getTime());
	saveInfo (route, '/count'	, '1');
	saveInfo (route, '/method'	, info.method);
}
const do_gl_LS_SecurityInfo_Save_Time  = function (route){
	saveInfo (route, '/time'	, new Date().getTime());
}
var saveInfo  = function (route, path, obj){
	if (!obj){	
		localStorage.setItem	(SECU_PREFIX+route+ path, JSON.stringify(0));
	}else{		
		localStorage.setItem	(SECU_PREFIX+route+ path, obj);	
	}
}
var req_gl_LS_SecurityInfo = function (route){
		
	var tok			= req_gl_LS_SecurityToken (route); //check time+rem
	
	route			= SECU_PREFIX+route;
	var login		= localStorage.getItem(route+'/login');
	var pass		= localStorage.getItem(route+'/pass');
	var wHash		= localStorage.getItem(route+'/wHash');
	var wSalt		= localStorage.getItem(route+'/wSalt');
	var salt		= localStorage.getItem(route+'/salt');
	var rem			= localStorage.getItem(route+'/rem');
	var time		= localStorage.getItem(route+'/time');
	var count		= localStorage.getItem(route+'/count');
	var method		= localStorage.getItem(route+'/method');
	return {tok, login, pass, wHash, wSalt, salt, rem, time, count, method}
}
const do_gl_LS_SecurityInfo_Remove  = function (route){
	route		= SECU_PREFIX+route;
	localStorage.removeItem(route+'/tok');
	localStorage.removeItem(route+'/login');
	localStorage.removeItem(route+'/pass');
	localStorage.removeItem(route+'/wHash');
	localStorage.removeItem(route+'/wSalt');
	localStorage.removeItem(route+'/salt');
	localStorage.removeItem(route+'/rem');
	localStorage.removeItem(route+'/time');
	localStorage.removeItem(route+'/count');
	localStorage.removeItem(route+'/usr');
	localStorage.removeItem(route+'/method');
}
var TIME_SESS_LIM = 30*60*1000;//30minutes;
var req_gl_LS_SecurityToken = function (route){
		route	= SECU_PREFIX+route;
	var tok 	= localStorage.getItem(route+'/tok');
	if (!tok){
		do_gl_LS_SecurityInfo_Remove(route);
		return null;	
	}
	var rem 	= localStorage.getItem(route+'/rem');
	var time 	= localStorage.getItem(route+'/time');
	var now 	= new Date().getTime();	
	
	if (!rem) 	rem 	= 0; else rem	= parseInt(rem	, 10);
	if (!time) 	time 	= 0; else time	= parseInt(time	, 10);
	if (!rem && now-time>TIME_SESS_LIM){
		do_gl_LocalStorage_Remove();
		return null;	
	}
	return tok;
}
var req_gl_LS_SecurityHeaderBearer = function (route){
	let tok			= req_gl_LS_SecurityToken (route);
	
	if (!tok) return null;
	
	let aut_Header	= {
			Authorization	: "Bearer " + tok,
			'Content-Type'	: 'application/json',
			'Accept'		: 'application/json',
		}
	return aut_Header;
}
var req_gl_LS_Username = function (route){
	route		= SECU_PREFIX+route;
	var uname 	= localStorage.getItem(route+'/login');
	if (!uname) return null;
	return uname;
}
var req_gl_Security_Session = function (route){
	return reqSecuritySession(route);
}
var reqSecuritySession = function (route){
	var sess = localStorage.getItem(SECU_PREFIX+route+ '/sess');
	if (!sess) return null; 
	return JSON.parse(sess);
}


//-----WebContent/www/js/app/common/ctrl/UserRightTool.js------------------------------
const do_gl_apply_right = function (ele) {
//	var eleRight = $("[data-right]");
	var eleRight = ele.find("[data-right]");
	if (!App.data.user.rights) {
		eleRight.remove()
		return;
	};
	
	$.each(eleRight, function(i, e) {
		var drights = $(e).data("right");
		if(drights && drights != "undefined") {
			var r  = drights;
			var typR = $(e).data("typ-right");
			if(typR && typR != "undefined"){
				var rS = drights.split("/");
				for(var i = 0; i < rS.length; i++){
					var uR = rS[i];
					var uS = uR.split("-");
					if(uS[0] == typR){
						r = uS[1];
						break;
					}
				}
			}
			
			if (!r) return;
			var right_splits ; 
			
			try{
				right_splits  = r.split(";");
			}catch(e){
				console.log(e);
			}
//			var right_splits = drights.split(";");
			$.each(right_splits, function(isr, esr) {
				var parts = esr.split(":");
				if(parts.length == 2) {
					var right_name 	= parts[0];
					var rightAnd	= null;
					var rightOr		= null;
					if (parts[1] && parts[1].length>0){
						if (parts[1].indexOf(",")>0){
							rightAnd 	= parts[1].split(",");
						} else if (parts[1].indexOf("|")>0){
							rightOr		= parts[1].split("|");
						}  else { 
							rightAnd	= [];
							rightAnd.push(parts[1]);
						}
					}
					
					
					var show = true;
					if (rightAnd){
						for (var  ir in rightAnd){
							var er = parseInt(rightAnd[ir],10);
							if(!App.data.user.rights.includes(er)) {
								show = false;
								break;
							}
						}
					}else if (rightOr){
						show = false;
						for (var  ir in rightOr){
							var er = parseInt(rightOr[ir],10);
							if(App.data.user.rights.includes(er)) {
								show = true;
								break;
							}
						}
					}
					
					if(right_name == "view") {
						if (!show) $(e).remove();
					} else if(right_name == "edit"){
						if (!show) $(e).addClass("unmodifiable");
					}
				}
			});
		}
	});
}
const can_gl_access_withRights = function (str){
	if (!str) return true;
	var r 		= str;
	var show 	= true;
	var right_splits ; 
	try{
		right_splits  = r.split(";");
	}catch(e){
		console.log(e);
		return true;
	}
	$.each(right_splits, function(isr, esr) {
		var parts = esr.split(":");
		if(parts.length == 2) {
			var right_name 	= parts[0];
			var rightAnd	= null;
			var rightOr		= null;
			if (parts[1] && parts[1].length>0){
				if (parts[1].indexOf(",")>0){
					rightAnd 	= parts[1].split(",");
				} else if (parts[1].indexOf("|")>0){
					rightOr		= parts[1].split("|");
				}  else { 
					rightAnd	= [];
					rightAnd.push(parts[1]);
				}
			}
			if (rightAnd){
				for (var  ir in rightAnd){
					var er = parseInt(rightAnd[ir],10);
					if(!App.data.user.rights.includes(er)) {
						show = false;
						break;
					}
				}
			}else if (rightOr){
				show = false;
				for (var  ir in rightOr){
					var er = parseInt(rightOr[ir],10);
					if(App.data.user.rights.includes(er)) {
						show = true;
						break;
					}
				}
			}
		}
	});
	return show;
}


//-----WebContent/www/js/app/common/ctrl/BodyTool.js------------------------------
/* AdminLTE
 *
 * @type Object
 * @description $.AdminLTE is the main object for the template's app.
 *              It's used for implementing functions and options related
 *              to the template. Keeping everything wrapped in an object
 *              prevents conflict with other plugins and is a better
 *              way to organize our code.
 */
$.AdminLTE = {};
/* --------------------
 * - AdminLTE Options -
 * --------------------
 * Modify these options to suit your implementation
 */
$.AdminLTE.options = {
		//Add slimscroll to navbar menus
		//This requires you to load the slimscroll plugin
		//in every page before app.js
		navbarMenuSlimscroll: true,
		navbarMenuSlimscrollWidth: "3px", //The width of the scroll bar
		navbarMenuHeight: "200px", //The height of the inner menu
		
		//General animation speed for JS animated elements such as box collapse/expand and
		//sidebar treeview slide up/down. This option accepts an integer as milliseconds,
		//'fast', 'normal', or 'slow'
		animationSpeed: 500,
		
		//Sidebar push menu toggle button selector
		sidebarToggleSelector: "[data-toggle='offcanvas']",
		
		//Activate sidebar push menu
		sidebarPushMenu: true,
		
		//Activate sidebar slimscroll if the fixed layout is set (requires SlimScroll Plugin)
		sidebarSlimScroll: true,
		
		//Enable sidebar expand on hover effect for sidebar mini
		//This option is forced to true if both the fixed layout and sidebar mini
		//are used together
		sidebarExpandOnHover: false,
		
		//BoxRefresh Plugin
		enableBoxRefresh: true,
		
		//Bootstrap.js tooltip
		enableBSToppltip: true,
		BSTooltipSelector: "[data-toggle='tooltip']",
		
		//Enable Fast Click. Fastclick.js creates a more
		//native touch experience with touch devices. If you
		//choose to enable the plugin, make sure you load the script
		//before AdminLTE's app.js
		enableFastclick: false,
		
		//Control Sidebar Tree views
		enableControlTreeView: true,
		
		//Control Sidebar Options
		enableControlSidebar: true,
		controlSidebarOptions: {
			//Which button should trigger the open/close event
			toggleBtnSelector: "[data-toggle='control-sidebar']",
			//The sidebar selector
			selector: ".control-sidebar",
			//Enable slide over content
			slide: true
		},
		
		//Box Widget Plugin. Enable this plugin
		//to allow boxes to be collapsed and/or removed
		enableBoxWidget: true,
		
		//Box Widget plugin options
		boxWidgetOptions: {
			boxWidgetIcons: {
				//Collapse icon
				collapse: 'fa-chevron-up',
				//Open icon
				open: 'fa-chevron-down',
				//Remove icon
				remove: 'fa-times'
			},
			boxWidgetSelectors: {
				//Remove button selector
				remove: '[data-widget="remove"]',
				//Collapse button selector
				collapse: '[data-widget="collapse"]'
			}
		},
		
		//Direct Chat plugin options
		directChat: {
			//Enable direct chat by default
			enable: true,
			//The button to open and close the chat contacts pane
			contactToggleSelector: '[data-widget="chat-pane-toggle"]'
		},
		
		//Define the set of colors to use globally around the website
		colors: {
			lightBlue: "#3c8dbc",
			red: "#f56954",
			green: "#00a65a",
			aqua: "#00c0ef",
			yellow: "#f39c12",
			blue: "#0073b7",
			navy: "#001F3F",
			teal: "#39CCCC",
			olive: "#3D9970",
			lime: "#01FF70",
			orange: "#FF851B",
			fuchsia: "#F012BE",
			purple: "#8E24AA",
			maroon: "#D81B60",
			black: "#222222",
			gray: "#d2d6de",
			gay: "#bede69"
		},
		
		//The standard screen sizes that bootstrap uses.
		//If you change these in the variables.less file, change
		//them here too.
		screenSizes: {
			xs: 480,
			sm: 768,
			md: 992,
			lg: 1200
		}
};
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
/* ------------------
 * - Implementation -
 * ------------------
 * The next block of code implements AdminLTE's
 * functions and plugins as specified by the
 * options above.
 */
//$(function () {
function do_gl_bindingAppLTE() {
	"use strict";
	//Fix for IE page transitions
	$("body").removeClass("hold-transition");
	//Extend options if external options exist
	if (typeof AdminLTEOptions !== "undefined") {
		$.extend(true,
				$.AdminLTE.options,
				AdminLTEOptions);
	}
	//Easy access to options
	var o = $.AdminLTE.options;
	//Set up the object
	_init();
	//Activate the layout maker
	$.AdminLTE.layout.activate();
	//Enable sidebar tree view controls
	if (o.enableControlTreeView) {
		$.AdminLTE.tree('.sidebar');
	}
	//Enable control sidebar
	if (o.enableControlSidebar) {
		$.AdminLTE.controlSidebar.activate();
	}
	//Add slimscroll to navbar dropdown
	if (o.navbarMenuSlimscroll && typeof $.fn.slimscroll != 'undefined') {
		$(".navbar .menu").slimscroll({
			height: o.navbarMenuHeight,
			alwaysVisible: false,
			size: o.navbarMenuSlimscrollWidth
		}).css("width", "100%");
	}
	//Activate sidebar push menu
	if (o.sidebarPushMenu) {
		$.AdminLTE.pushMenu.activate(o.sidebarToggleSelector);
	}
	//Activate Bootstrap tooltip
	if (o.enableBSToppltip) {
		$('body').tooltip({
			selector: o.BSTooltipSelector,
			container: 'body',
			trigger: 'hover'
		});
	}
	//Activate box widget
	if (o.enableBoxWidget) {
		$.AdminLTE.boxWidget.activate();
	}
	//Activate fast click
	if (o.enableFastclick && typeof FastClick != 'undefined') {
		FastClick.attach(document.body);
	}
	//Activate direct chat widget
	if (o.directChat.enable) {
		$(document).on('click', o.directChat.contactToggleSelector, function () {
			var box = $(this).parents('.direct-chat').first();
			box.toggleClass('direct-chat-contacts-open');
		});
	}
	
	//Activate colors page
//	if (o.colors) {
//		$(".main-sidebar").css("background-color", o.colors.gay);
//	}
	/*
	 * INITIALIZE BUTTON TOGGLE
	 * ------------------------
	 */
	$('.btn-group[data-toggle="btn-toggle"]').each(function () {
		var group = $(this);
		$(this).find(".btn").on('click', function (e) {
			group.find(".btn.active").removeClass("active");
			$(this).addClass("active");
			e.preventDefault();
		});
	});
	//Set up the custom plugin
	_boxRefresh();
	_boxWidget();
	_todolist();
	//---Custom HNV------------------------------
//	$.AdminLTE.pushMenu.activate();
//	$.AdminLTE.pushMenu.collapse();
	if ($('body').hasClass('fixed')) {
//		$.AdminLTE.pushMenu.expandOnHover();
//		$.AdminLTE.layout.activate();
	}
	
}
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
/* ----------------------------------
 * - Initialize the AdminLTE Object -
 * ----------------------------------
 * All AdminLTE functions are implemented below.
 */
function _init() {
	'use strict';
	/* Layout
	 * ======
	 * Fixes the layout height in case min-height fails.
	 *
	 * @type Object
	 * @usage $.AdminLTE.layout.activate()
	 *        $.AdminLTE.layout.fix()
	 *        $.AdminLTE.layout.fixSidebar()
	 */
	$.AdminLTE.layout = {
			activate: function () {
				var _this = this;
				_this.fix();
				_this.fixSidebar();
				$('body, html, .wrapper').css('height', 'auto');
				$(window, ".wrapper").resize(function () {
					_this.fix();
					//_this.fixSidebar(); => error when change size
				});
			},
			fix: function () {
				// Remove overflow from .wrapper if layout-boxed exists
				$(".layout-boxed > .wrapper").css('overflow', 'hidden');
				//Get window height and the wrapper height
				var footer_height = $('.main-footer').outerHeight() || 0;
				var neg = $('.main-header').outerHeight() + footer_height;
				var window_height = $(window).height();
				var sidebar_height = $(".sidebar").height() || 0;
				//Set the min-height of the content and sidebar based on the
				//the height of the document.
				if ($("body").hasClass("fixed")) {
					$(".content-wrapper, .right-side").css('min-height', window_height - footer_height);
				} else {
					var postSetWidth;
					if (window_height >= sidebar_height) {
						$(".content-wrapper, .right-side").css('min-height', window_height - neg);
						postSetWidth = window_height - neg;
					} else {
						$(".content-wrapper, .right-side").css('min-height', sidebar_height);
						postSetWidth = sidebar_height;
					}
					//Fix for the control sidebar height
					var controlSidebar = $($.AdminLTE.options.controlSidebarOptions.selector);
					if (typeof controlSidebar !== "undefined") {
						if (controlSidebar.height() > postSetWidth)
							$(".content-wrapper, .right-side").css('min-height', controlSidebar.height());
					}
				}
			},
			fixSidebar: function () {
				//Make sure the body tag has the .fixed class
				if (!$("body").hasClass("fixed")) {
					if (typeof $.fn.slimScroll != 'undefined') {
						$(".sidebar").slimScroll({destroy: true}).height("auto");
					}
					return;
				} else if (typeof $.fn.slimScroll == 'undefined' && window.console) {
					window.console.error("Error: the fixed layout requires the slimscroll plugin!");
				}
				//Enable slimscroll for fixed layout
				if ($.AdminLTE.options.sidebarSlimScroll) {
					if (typeof $.fn.slimScroll != 'undefined') {
						//Destroy if it exists
						$(".sidebar").slimScroll({destroy: true}).height("auto");
						//Add slimscroll
						$(".sidebar").slimScroll({
							height: ($(window).height() - $(".main-header").height()) + "px",
							color: "rgba(0,0,0,0.2)",
							size: "3px"
						});
					}
				}
			}
	};
	/* PushMenu()
	 * ==========
	 * Adds the push menu functionality to the sidebar.
	 *
	 * @type Function
	 * @usage: $.AdminLTE.pushMenu("[data-toggle='offcanvas']")
	 */
	$.AdminLTE.pushMenu = {
			activate: function (toggleBtn) {
				//Get the screen sizes
				var screenSizes = $.AdminLTE.options.screenSizes;
				//Enable sidebar toggle
				$(document).on('click', toggleBtn, function (e) {
					e.preventDefault();
					//Enable sidebar push menu
					if ($(window).width() > (screenSizes.sm - 1)) {
						if ($("body").hasClass('sidebar-collapse')) {
							$("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
						} else {
							$("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
						}
					}
					//Handle sidebar push menu for small screens
					else {
						if ($("body").hasClass('sidebar-open')) {
							$("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
						} else {
							$("body").addClass('sidebar-open').trigger('expanded.pushMenu');
						}
					}
				});
				$(".content-wrapper").click(function () {
					//Enable hide menu when clicking on the content-wrapper on small screens
					if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
						$("body").removeClass('sidebar-open');
					}
				});
				//Enable expand on hover for sidebar mini
				if ($.AdminLTE.options.sidebarExpandOnHover
						|| ($('body').hasClass('fixed')
								&& $('body').hasClass('sidebar-mini'))) {
//					this.expandOnHover();
				}
			},
			expandOnHover: function () {
				var _this = this;
				var screenWidth = $.AdminLTE.options.screenSizes.sm - 1;
				//Expand sidebar on hover
				$('.main-sidebar').hover(function () {
					if ($('body').hasClass('sidebar-mini')
							&& $("body").hasClass('sidebar-collapse')
							&& $(window).width() > screenWidth) {
						_this.expand();
					}
				}, function () {
					if ($('body').hasClass('sidebar-mini')
							&& $('body').hasClass('sidebar-expanded-on-hover')
							&& $(window).width() > screenWidth) {
						_this.collapse();
					}
				});
			},
			expand: function () {
				$("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
			},
			collapse: function () {
				if ($('body').hasClass('sidebar-expanded-on-hover')) {
					$('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
				}
			}
	};
	/* Tree()
	 * ======
	 * Converts the sidebar into a multilevel
	 * tree view menu.
	 *
	 * @type Function
	 * @Usage: $.AdminLTE.tree('.sidebar')
	 */
	$.AdminLTE.tree = function (menu) {
		var _this = this;
		var animationSpeed = 0; //$.AdminLTE.options.animationSpeed;
		$(document).off('click', menu + ' li a')
		.on('click', menu + ' li a', function (e) {
			//Get the clicked link and the next element
			var $this = $(this);
			var checkElement = $this.next();
			//Check if the next element is a menu and is visible
//			if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible')) && (!$('body').hasClass('sidebar-collapse'))) {
			if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
				//Close the menu
				checkElement.slideUp(animationSpeed, function () {
					checkElement.removeClass('menu-open');
					//Fix the layout in case the sidebar stretches over the height of the window
					_this.layout.fix();
				});
				checkElement.parent("li").removeClass("active");
			}
			//If the menu is not visible
			else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
				//Get the parent menu
				var parent = $this.parents('ul').first();
				//Close all open menus within the parent
				var ul = parent.find('ul:visible').slideUp(animationSpeed);
				//Remove the menu-open class from the parent
				ul.removeClass('menu-open');
				//Get the parent li
				var parent_li = $this.parent("li");
				//Open the target menu and add the menu-open class
				checkElement.slideDown(animationSpeed, function () {
					//Add the class active to the parent li
					checkElement.addClass('menu-open');
					parent.find('li.active').removeClass('active');
					parent_li.addClass('active');
					//Fix the layout in case the sidebar stretches over the height of the window
					_this.layout.fix();
				});
			}
			//if this isn't a link, prevent the page from being redirected
			if (checkElement.is('.treeview-menu')) {
				e.preventDefault();
			}
		});
	};
	/* ControlSidebar
	 * ==============
	 * Adds functionality to the right sidebar
	 *
	 * @type Object
	 * @usage $.AdminLTE.controlSidebar.activate(options)
	 */
	$.AdminLTE.controlSidebar = {
			//instantiate the object
			activate: function () {
				//Get the object
				var _this = this;
				//Update options
				var o = $.AdminLTE.options.controlSidebarOptions;
				//Get the sidebar
				var sidebar = $(o.selector);
				//The toggle button
				var btn = $(o.toggleBtnSelector);
				//Listen to the click event
				btn.on('click', function (e) {
					e.preventDefault();
					//If the sidebar is not open
					if (!sidebar.hasClass('control-sidebar-open')
							&& !$('body').hasClass('control-sidebar-open')) {
						//Open the sidebar
						_this.open(sidebar, o.slide);
					} else {
						_this.close(sidebar, o.slide);
					}
				});
				//If the body has a boxed layout, fix the sidebar bg position
				var bg = $(".control-sidebar-bg");
				_this._fix(bg);
				//If the body has a fixed layout, make the control sidebar fixed
				if ($('body').hasClass('fixed')) {
					_this._fixForFixed(sidebar);
				} else {
					//If the content height is less than the sidebar's height, force max height
					if ($('.content-wrapper, .right-side').height() < sidebar.height()) {
						_this._fixForContent(sidebar);
					}
				}
			},
			//Open the control sidebar
			open: function (sidebar, slide) {
				//Slide over content
				if (slide) {
					sidebar.addClass('control-sidebar-open');
				} else {
					//Push the content by adding the open class to the body instead
					//of the sidebar itself
					$('body').addClass('control-sidebar-open');
				}
			},
			//Close the control sidebar
			close: function (sidebar, slide) {
				if (slide) {
					sidebar.removeClass('control-sidebar-open');
				} else {
					$('body').removeClass('control-sidebar-open');
				}
			},
			_fix: function (sidebar) {
				var _this = this;
				if ($("body").hasClass('layout-boxed')) {
					sidebar.css('position', 'absolute');
					sidebar.height($(".wrapper").height());
					if (_this.hasBindedResize) {
						return;
					}
					$(window).resize(function () {
						_this._fix(sidebar);
					});
					_this.hasBindedResize = true;
				} else {
					sidebar.css({
						'position': 'fixed',
						'height': 'auto'
					});
				}
			},
			_fixForFixed: function (sidebar) {
				sidebar.css({
					'position': 'fixed',
					'max-height': '100%',
					'overflow': 'auto',
					'padding-bottom': '50px'
				});
			},
			_fixForContent: function (sidebar) {
				$(".content-wrapper, .right-side").css('min-height', sidebar.height());
			}
	};
	/* BoxWidget
	 * =========
	 * BoxWidget is a plugin to handle collapsing and
	 * removing boxes from the screen.
	 *
	 * @type Object
	 * @usage $.AdminLTE.boxWidget.activate()
	 *        Set all your options in the main $.AdminLTE.options object
	 */
	$.AdminLTE.boxWidget = {
			selectors: $.AdminLTE.options.boxWidgetOptions.boxWidgetSelectors,
			icons: $.AdminLTE.options.boxWidgetOptions.boxWidgetIcons,
			animationSpeed: $.AdminLTE.options.animationSpeed,
			activate: function (_box) {
				var _this = this;
				if (!_box) {
					_box = document; // activate all boxes per default
				}
				//Listen for collapse event triggers
				$(_box).on('click', _this.selectors.collapse, function (e) {
					e.preventDefault();
					_this.collapse($(this));
				});
				//Listen for remove event triggers
				$(_box).on('click', _this.selectors.remove, function (e) {
					e.preventDefault();
					_this.remove($(this));
				});
			},
			collapse: function (element) {
				var _this = this;
				//Find the box parent
				var box = element.parents(".box").first();
				//Find the body and the footer
				var box_content = box.find("> .box-body, > .box-footer, > form  >.box-body, > form > .box-footer");
				if (!box.hasClass("collapsed-box")) {
					//Convert minus into plus
					element.children(":first")
					.removeClass(_this.icons.collapse)
					.addClass(_this.icons.open);
					//Hide the content
					box_content.slideUp(_this.animationSpeed, function () {
						box.addClass("collapsed-box");
					});
				} else {
					//Convert plus into minus
					element.children(":first")
					.removeClass(_this.icons.open)
					.addClass(_this.icons.collapse);
					//Show the content
					box_content.slideDown(_this.animationSpeed, function () {
						box.removeClass("collapsed-box");
					});
				}
			},
			remove: function (element) {
				//Find the box parent
				var box = element.parents(".box").first();
				box.slideUp(this.animationSpeed);
			}
	};
}
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
/* ------------------
 * - Custom Plugins -
 * ------------------
 * All custom plugins are defined below.
 */
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
/*
 * BOX REFRESH BUTTON
 * ------------------
 * This is a custom plugin to use with the component BOX. It allows you to add
 * a refresh button to the box. It converts the box's state to a loading state.
 *
 * @type plugin
 * @usage $("#box-widget").boxRefresh( options );
 */
function _boxRefresh() {
	"use strict";
	$.fn.boxRefresh = function (options) {
		// Render options
		var settings = $.extend({
			//Refresh button selector
			trigger: ".refresh-btn",
			//File source to be loaded (e.g: ajax/src.php)
			source: "",
			//Callbacks
			onLoadStart: function (box) {
				return box;
			}, //Right after the button has been clicked
			onLoadDone: function (box) {
				return box;
			} //When the source has been loaded
		}, options);
		//The overlay
		var overlay = $('<div class="overlay"><div class="fa fa-refresh fa-spin"></div></div>');
		return this.each(function () {
			//if a source is specified
			if (settings.source === "") {
				if (window.console) {
					window.console.log("Please specify a source first - boxRefresh()");
				}
				return;
			}
			//the box
			var box = $(this);
			//the button
			var rBtn = box.find(settings.trigger).first();
			//On trigger click
			rBtn.on('click', function (e) {
				e.preventDefault();
				//Add loading overlay
				start(box);
				//Perform ajax call
				box.find(".box-body").load(settings.source, function () {
					done(box);
				});
			});
		});
		function start(box) {
			//Add overlay and loading img
			box.append(overlay);
			settings.onLoadStart.call(box);
		}
		function done(box) {
			//Remove overlay and loading img
			box.find(overlay).remove();
			settings.onLoadDone.call(box);
		}
	};
}
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
/*
 * EXPLICIT BOX CONTROLS
 * -----------------------
 * This is a custom plugin to use with the component BOX. It allows you to activate
 * a box inserted in the DOM after the app.js was loaded, toggle and remove box.
 *
 * @type plugin
 * @usage $("#box-widget").activateBox();
 * @usage $("#box-widget").toggleBox();
 * @usage $("#box-widget").removeBox();
 */
function _boxWidget() {
	'use strict';
	$.fn.activateBox = function () {
		$.AdminLTE.boxWidget.activate(this);
	};
	$.fn.toggleBox = function () {
		var button = $($.AdminLTE.boxWidget.selectors.collapse, this);
		$.AdminLTE.boxWidget.collapse(button);
	};
	$.fn.removeBox = function () {
		var button = $($.AdminLTE.boxWidget.selectors.remove, this);
		$.AdminLTE.boxWidget.remove(button);
	};
}
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
/*
 * TODO LIST CUSTOM PLUGIN
 * -----------------------
 * This plugin depends on iCheck plugin for checkbox and radio inputs
 *
 * @type plugin
 * @usage $("#todo-widget").todolist( options );
 */
function _todolist() {
	'use strict';
	$.fn.todolist = function (options) {
		// Render options
		var settings = $.extend({
			//When the user checks the input
			onCheck: function (ele) {
				return ele;
			},
			//When the user unchecks the input
			onUncheck: function (ele) {
				return ele;
			}
		}, options);
		return this.each(function () {
			if (typeof $.fn.iCheck != 'undefined') {
				$('input', this).on('ifChecked', function () {
					var ele = $(this).parents("li").first();
					ele.toggleClass("done");
					settings.onCheck.call(ele);
				});
				$('input', this).on('ifUnchecked', function () {
					var ele = $(this).parents("li").first();
					ele.toggleClass("done");
					settings.onUncheck.call(ele);
				});
			} else {
				$('input', this).on('change', function () {
					var ele = $(this).parents("li").first();
					ele.toggleClass("done");
					if ($('input', ele).is(":checked")) {
						settings.onCheck.call(ele);
					} else {
						settings.onUncheck.call(ele);
					}
				});
			}
		});
	};
}
//---HNV Inter-------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//var CLASS_BODY_LOGIN			= "hold-transition login-page";
//var CLASS_BODY_MAILBOX			= "hold-transition skin-blue sidebar-mini";
//-------------------------------------------------------------------------------
function doRemoveBodyClass() {
	$("body").removeClass();
}
//-------------------------------------------------------------------------------
function do_gl_addClassHTMLBody(classElement) {
	doRemoveBodyClass();
	
	$("body").addClass(classElement);
	
	if(classElement == App.constHTML.classBody.LOGIN)
		$("body").css("min-height", "0");
}
//-------------------------------------------------------------------------------
function do_gl_calculateScrollBody(div, value, isScrollX, isScrollY) {
	var height 		= $("#div_ContentView").innerHeight();
	
	var calculHeight= height * (value / 100);
	
	if(isScrollX && !isScrollY)
		$(div).addClass("scroll-x");
	else if(!isScrollX && isScrollY)
		$(div).addClass("scroll-y");
	else
		$(div).addClass("scroll-x-y");
	
	$(div).css("max-height", calculHeight + "vh");
	$(div).css("min-height", calculHeight-10 + "vh");
}
function do_gl_calculateScrollBody_Vh(div, value, isScrollX, isScrollY) {
//	var height 		= $("#div_ContentView").innerHeight();
//	
//	var calculHeight= height * (value / 100);
	
	if(isScrollX && !isScrollY)
		$(div).addClass("scroll-x");
	else if(!isScrollX && isScrollY)
		$(div).addClass("scroll-y");
	else
		$(div).addClass("scroll-x-y");
	
	$(div).css("max-height", value + "vh");
	$(div).css("min-height", (value-10) + "vh");
}
function do_gl_rebuildContentViewStyle() {
	var buildScreen = function(){
		var window_height = $(window).height();
		var footer_height = $('.main-footer').outerHeight() || 0;
		var neg = $('.main-header').outerHeight() + footer_height;
		$(".content-wrapper").css('min-height', window_height - neg);
		$(".content-wrapper").css('max-height', window_height - neg);
		$(".content-wrapper").css('overflow-y', 'auto');
	}
	
	buildScreen();
	
	$(window).on('resize', function(){
		buildScreen();
	});
}
function do_gl_rebuildContentViewStyle_Sale() {
	var buildScreen = function(){
		var window_height = $(window).height();
		var footer_height = $('.main-footer').outerHeight() || 0;
		var neg = $('.main-header').outerHeight() + footer_height;
		$(".content-wrapper, .div-sidebar-menu, .sidebar-menu").css('min-height', window_height - neg);
		$(".content-wrapper, .div-sidebar-menu, .sidebar-menu").css('max-height', window_height - neg);
		$(".content-wrapper, .div-sidebar-menu, .sidebar-menu").css('overflow-y', 'auto');
		
//		$(".div-sidebar-menu").css('min-height', window_height - neg);
//		$(".div-sidebar-menu").css('max-height', window_height - neg);
//		$(".div-sidebar-menu").css('overflow-y', 'auto');
//		
//		$(".sidebar-menu").css('min-height', window_height - neg);
//		$(".sidebar-menu").css('max-height', window_height - neg);
//		$(".sidebar-menu").css('overflow-y', 'auto');
	}
	
	buildScreen();
	
	$(window).on('resize', function(){
		buildScreen();
	});
}


//-----WebContent/www/js/app/common/ctrl/BootstrapTool.js------------------------------
const do_gl_enhance_within = function (parentNode, options) {
	if (!parentNode) return;
	if (parentNode.length==0) return;
	
	try{
		do_gl_init_datetimePlugin(parentNode);
		do_gl_init_fileinputPlugin(parentNode, options);
		
		do_gl_apply_right(parentNode);
		
		do_gl_init_jqueryNumpadPlugin(parentNode);
		do_gl_init_touchKeyboardPlugin(parentNode, options);
		
		do_gl_init_box(parentNode);
		do_gl_init_show_box(parentNode, options);
		
		do_gl_init_tabActive();
		do_gl_init_jqueryUI(parentNode, options);
//		do_gl_init_selectPlugin(parentNode);
//		do_gl_init_datatable(parentNode, options);
//		do_gl_init_inputMaskPlugin(parentNode);
//		do_gl_init_affix(parentNode);
		//from UserRightTool
//		Handle jQuery plugin naming conflict between jQuery UI and Bootstrap
//		$.widget.bridge('uibutton', $.ui.button);
//		$.widget.bridge('uitooltip', $.ui.tooltip);
	}catch(e){
		console.log (e);
	}
}
//--------------------------------------------------------------------------------
var var_gl_tab_active	= null;
const do_gl_req_tab_active = function (parentNode){	
	var_gl_tab_active	= parentNode.find(".nav-tabs-custom li.active").not(".paginate_button").find("a").attr("href");	
}
var  do_gl_init_tabActive = function (){
	if(var_gl_tab_active != null){
		$(".nav-tabs").find('a[href="'+var_gl_tab_active+'"]').tab("show");	
		var_gl_tab_active = null;
	}
	
	$(".nav-tabs").find('li:not(.always-show)').on('click', function(e) {
		$(".nav-tabs").toggleClass("responsive");
		var_gl_tab_active = $(this).find("a").attr("href");
	});
	
	$(".nav-tabs").find('li.always-show').on('click', function(e) {
		if ($(".nav-tabs").hasClass('responsive'))
			$(".nav-tabs").toggleClass("responsive");
		var_gl_tab_active = $(this).find("a").attr("href");
	});
	
	$(".nav-tabs").find("#div_NavTabs_Responsive").off("click");
	$(".nav-tabs").find("#div_NavTabs_Responsive").on("click", function() {
		$(".nav-tabs").toggleClass("responsive");
	});
	
}
//--------------------------------------------------------------------------------
const do_gl_init_show_box = function (parentNode, options){
	if(options){
		if(options.div){
			if(App.data.page && App.data.page[options.div] && App.data.page[options.div] == 1){
				App.data.page[options.div] = 0;
				return;
			}
		}
	}
	if(parentNode.hasClass("box-not-show")){
		$(parentNode).addClass("collapsed-box");
//		$(parentNode).find(".box-body").css("display", "none");
//		$(parentNode).find(".box-footer").css("display", "none");
	};
}
//--------------------------------------------------------------------------------
//Box widget
const do_gl_init_affix = function(parentNode) {
	var children = parentNode.find(".custom-affix");
	if(children.length>0) {	
		children.each(function(){
			var off	= $(this).attr("custom-affix-offset");
			var value 	= $(this).attr("custom-affix-value");
			var option = {
					offset : {
					}
			}
			if(off == 1)		option.offset.top 		= value;
			else if(off == 2)	option.offset.bottom 	= value;
			$(this).affix(option);
		});
	}
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Box widget
const do_gl_init_box = function(parentNode) {
	var children = parentNode.find(".btn-minimize");
	if(children.length>0) {	
		children.each(function(){
			$(this).off('click');
			$(this).click(function(e){
//				$(this).toggleBox();
			});
		});
	}
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Datatable
const do_gl_init_datatable = function(parentNode, options) {
	var lang = localStorage.language;
	if (lang ==null ) lang = "en";
	var filename = "datatable_"+lang+".json";
	var children = parentNode.find(".table-datatable");
	if(children.length>0) {	
		children.each(function(){
			var defaultOption = {
//					sDom			: "<'row-fluid'<'span4'l><'span8'f>r>t<'row-fluid'<'span12'i><'span12 noMarginLeft'p>>",
//					sPaginationType	: "bootstrap",
					oLanguage		: {
						sUrl	: "www/js/lib/datatables/"+ filename
					},	
//					oClasses		:{
//					sFilterInput :  "inputClass",
//					sLengthSelect : "selectClass",
//					},
					"paging": true,
					"lengthChange": true,
					"searching": true,
					"ordering": true,
					"info": true,
					"autoWidth": true
			};
			var customOption = $.extend(true, {}, defaultOption);
			if(options && options.datatable) {
				$.extend(true, customOption, options.datatable);
			}
			var extraCustomOption = $(this).data("option");
			if(extraCustomOption) {
				$.extend(true, customOption, extraCustomOption);
			}
//			$(this).DataTable(customOption);
//			try{
//			table.columnFilter({
//			//sPlaceHolder	: "head:before"
//			sPlaceHolder	: "head:after"
//			});
//			$(this).find('thead input').each( function () {
//			$(this).attr('style','width: 80% !important');	
//			} );
//			$(this).find('tfoot input').each( function () {
//			$(this).attr('style','width: 80% !important');
//			} );
//			$(this).find('tbody input').each( function () {
//			$(this).attr('style','width: 80% !important');
//			} );	
//			}catch(e){
//			console.log(e);
//			}
		});	
	}
//	var child = parentNode.find(".dataTables_scrollHeadInner");
//	child.each(function(){
//		$(this).css("width", "100%")
//	})
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//jqueryUI
function do_gl_init_jqueryUI(parentNode, options) {
	var customOptions = {};
	if(options && options.jqueryUI) {
		customOptions.jqueryUI = options.jqueryUI;
	} else {
		customOptions.jqueryUI = {};
	}
	var connectedSortableClass = customOptions.jqueryUI;
	var children = parentNode.parent().find(connectedSortableClass);
	if(children.length>0) {	
		children.each(function(){
			$(this).sortable({
				placeholder: "sort-highlight",
				connectWith: connectedSortableClass,
				handle: ".box-header, .nav-tabs",
				forcePlaceholderSize: true,
				zIndex: 999999,
				cursor: 'move',
				revert: true,
				stop: function() {
					//do something
				}
			});
			$(this).draggable({
				over: function() { 
					//do something
				},
				out: function() { 
					//do something
				}
			});
			$(this).droppable({
				over: function() { 
					//do something
				},
				out: function() { 
					//do something
				},
				accept: "div"
			});
			subChildren = $(this).find(".box-header, .nav-tabs"); //nav-tabs-custom
			subChildren.each(function(){
				$(this).css("cursor", "move");
			});
		});
	}
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Datetime Plugin : datepicker, daterangepicker, timepicker
function do_gl_init_datetimePlugin(parentNode) {
	//Date range picker
	var children01 = parentNode.find(".daterangepicker");
	if(children01.length>0) {	
		children01.each(function(){
//			$(this).daterangepicker();
			$(this).daterangepicker({
				timePicker: true, 
				timePickerIncrement: 30, 
				format: 'MM/DD/YYYY h:mm A'
			});
//			$(this).daterangepicker(
//			{
//			ranges: {
//			'Today': [moment(), moment()],
//			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
//			'This Month': [moment().startOf('month'), moment().endOf('month')],
//			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//			},
//			startDate: moment().subtract(29, 'days'),
//			endDate: moment()
//			},
//			function (start, end) {
//			$('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
//			}
//			);
		});
	}
	///////////////////////////////////////////////////
	//Date picker
	var children02 = parentNode.find(".datepicker");
	if(children02.length>0) {	
		children02.each(function(){
			var dateP = $(this).datepicker({
				autoclose: true,
				language: App.language,
				enableOnReadonly: false,
				immediateUpdates: true
			});
			var compare = $(this).attr("data-compare");
			if(compare) {
				var compareParts = compare.split(' ');
//				if(compareParts.length == 2) {
//				if(compareParts[0] == "before") {
//				var targetDate = $(compareParts[1]).val();
//				dateP.datepicker('setEndDate', targetDate);
//				dateP.on("changeDate", function(selected) {
//				startDate = new Date(selected.date.valueOf());
//				startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
//				$(compareParts[1]).datepicker('setStartDate', startDate);
//				});
//				} else if(compareParts[0] == "after") {
//				var targetDate = $(compareParts[1]).val();
//				dateP.datepicker('setStartDate', targetDate);
//				dateP.on("changeDate", function(selected) {
//				startDate = new Date(selected.date.valueOf());
//				startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
//				$(compareParts[1]).datepicker('setEndDate', startDate);
//				});
//				}
//				}
				var minDate = null;
				var maxDate = null;
				$(this).off("click");
				$(this).on("click", function() {
					if(compareParts.length == 2) {
						if(compareParts[0] == "lt") {
							maxDate = $(compareParts[1]).val();
						} else if(compareParts[0] == "gt") {
							minDate = $(compareParts[1]).val();
						}
					}else if(compareParts.length == 3){
						minDate = $(compareParts[1]).val();
						maxDate = $(compareParts[2]).val();
					}
					do_gl_set_range_datepicker($(this), minDate, maxDate);
				});
			}
		});
	}
	///////////////////////////////////////////////////
	//Timepicker
	var children03 = parentNode.find(".timepicker");
	if(children03.length>0) {	
		children03.each(function(){
			$(this).timepicker({
				showInputs: false
			});
		});
	}
	
	///////////////////////////////////////////////////
	//Datetimepicker step 30 minutes
	var children05 = parentNode.find(".datetimepicker.step-30");
	if(children05.length>0) {	
		children05.each(function(){
			$(this).datetimepicker({
                locale: App.language,
                collapse: true,
                showClose: true,
				stepping: 30
            });
		});
	}
	//Datetimepicker
	var children04 = parentNode.find(".datetimepicker");
	if(children04.length>0) {	
		children04.each(function(){
			$(this).datetimepicker({
                locale: App.language,
                collapse: true,
                showClose: true,
            });
		});
	}
}
function do_gl_set_range_datepicker(ele, minDate, maxDate){
	ele.datepicker('remove');
	if(minDate == null) minDate = "";
	if(maxDate == null) maxDate = "";
	minDate = do_lc_get_Date(ele, minDate);
	if (!minDate) minDate = "2010-01-01"; 
	maxDate = do_lc_get_Date(ele, maxDate);
	if (!maxDate) maxDate = "3010-01-01";
	
	ele.datepicker({
		autoclose: true,
		language: App.language,
		startDate : new Date(minDate),
		endDate : new Date(maxDate)
	});
	ele.datepicker('show');
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Select Plugin
function do_gl_init_selectPlugin(parentNode) {
	var children = parentNode.find(".selectChosen");
	if(children.length>0) {	
		children.each(function(){
			$(this).select2();
		});
	}
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//InputMask Plugin
function do_gl_init_inputMaskPlugin(parentNode) {
	var children = parentNode.find("[data-mask]");
	if(children.length>0) {	
		children.each(function(){
			//Datemask dd/mm/yyyy
//			$(this).inputmask("dd/mm/yyyy", {"placeholder": "dd/mm/yyyy"});
			//General
			$(this).inputmask();
		});
	}
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Bootstrap Fileinput Plugin
function do_gl_init_fileinputPlugin(parentNode, options) {
	var children = parentNode.find(".fileinput");
	var fileinputOption = undefined;
	var obj				= undefined;
	if(options) {
		fileinputOption = options.fileinput;
		obj				= options.obj;
	}
	if(children.length>0) {	
		children.each(function(){
			var fileInput = new FileInput(this,fileinputOption, obj);
		});
	}
}
//--------------------------------Elemetal functions------------------------------------------------
function do_gl_datepicker_plugin(element, th, options) {
	var dateP = element.datepicker({
		autoclose: true,
		language: App.language
	});
//	var compare = element.attr("data-compare");
	var compare = th.attr("data-compare");
	if(compare) {
		var compareParts = compare.split(' ');
//		if(compareParts.length == 2) {
//		if(compareParts[0] == "before") {
//		var targetDate = $(compareParts[1]).val();
//		dateP.datepicker('setEndDate', targetDate);
//		dateP.on("changeDate", function(selected) {
//		startDate = new Date(selected.date.valueOf());
//		startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
//		$(compareParts[1]).datepicker('setStartDate', startDate);
//		});
//		} else if(compareParts[0] == "after") {
//		var targetDate = $(compareParts[1]).val();
//		dateP.datepicker('setStartDate', targetDate);
//		dateP.on("changeDate", function(selected) {
//		startDate = new Date(selected.date.valueOf());
//		startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
//		$(compareParts[1]).datepicker('setEndDate', startDate);
//		});
//		}
		var minDate = null;
		var maxDate = null;
		element.off("click");
		element.on("click", function() {
			if(element.attr("contenteditable")){
				if(compareParts.length == 2) {
					if($(compareParts[1]).length > 0){
						if(compareParts[0] == "lt") {
							maxDate = $(compareParts[1]).val();
						} else if(compareParts[0] == "gt") {
							minDate = $(compareParts[1]).val();
						}
					}else if(element.parent().find("."+compareParts[1]).length > 0){
						if(compareParts[0] == "lt") {
							maxDate = element.parent().find("."+compareParts[1]).html();
						} else if(compareParts[0] == "gt") {
							minDate = element.parent().find("."+compareParts[1]).html();
						}
					}
					
				}else if(compareParts.length == 3){
					if($(compareParts[1]).length > 0){
						minDate = $(compareParts[1]).val();					
					}else if(element.parent().find("."+compareParts[1]).length > 0){
						minDate = element.parent().find("."+compareParts[1]).html();
					}
	
					if($(compareParts[2]).length > 0){
						maxDate = $(compareParts[2]).val();					
					}else if(element.parent().find("."+compareParts[2]).length > 0){
						maxDate = element.parent().find("."+compareParts[2]).html();
					}
				}
				do_gl_set_range_datepicker(element, minDate, maxDate);
			}
		});
	}
}
function do_gl_datetimepicker_plugin(element, th, options) {
	var dateP = element.datetimepicker({
		locale: App.language,
		inline: false,
		sideBySide: false
	});
//	var compare = element.attr("data-compare");
	var compare = th.attr("data-compare");
	if(compare) {
		var compareParts = compare.split(' ');
		var minDate = null;
		var maxDate = null;
		element.off("click");
		element.on("click", function() {
			if(element.attr("contenteditable")){
				if(compareParts.length == 2) {
					if($(compareParts[1]).length > 0){
						if(compareParts[0] == "lt") {
							maxDate = $(compareParts[1]).val();
						} else if(compareParts[0] == "gt") {
							minDate = $(compareParts[1]).val();
						}
					}else if(element.parent().find("."+compareParts[1]).length > 0){
						if(compareParts[0] == "lt") {
							maxDate = element.parent().find("."+compareParts[1]).html();
						} else if(compareParts[0] == "gt") {
							minDate = element.parent().find("."+compareParts[1]).html();
						}
					}
					
				}else if(compareParts.length == 3){
					if($(compareParts[1]).length > 0){
						minDate = $(compareParts[1]).val();					
					}else if(element.parent().find("."+compareParts[1]).length > 0){
						minDate = element.parent().find("."+compareParts[1]).html();
					}
	
					if($(compareParts[2]).length > 0){
						maxDate = $(compareParts[2]).val();					
					}else if(element.parent().find("."+compareParts[2]).length > 0){
						maxDate = element.parent().find("."+compareParts[2]).html();
					}
				}
				do_gl_set_range_datepicker(element, minDate, maxDate);
			}
		});
	}
}
function do_gl_inputfile_plugin(element, options) {
	var defaultOption = {
			language: App.language,
			showClose: false,
			allowedFileTypes: ['image', 'html', 'text', 'video', 'audio', 'flash', 'object'],
			allowedFileExtensions: ['jpg', 'png', 'txt', 'pdf'],
			allowedPreviewTypes: ['image', 'html', 'text', 'video', 'audio', 'flash', 'object'],
			uploadUrl:  App.path.BASE_URL_API_PRIV,
			uploadExtraData : {
				sv_class : "ServiceTpyDocument",
				sv_name : "SVTpyDocumentNew",
				typ01 : 1,
				typ02 : 1
			},
			uploadAsync : false,
			overwriteInitial: false,
			deleteUrl: App.path.BASE_URL_API_PRIV,
			deleteExtraData : {
				sv_class : "ServiceTpyDocument",
				sv_name : "SVTpyDocumentDel"
			},
			layoutTemplates: {
//				actionDrag: ''
			}
	};
	//copy from default option
	var customOption = $.extend(true, {}, defaultOption);
	if(options && options.fileinput) {
		//if fileinput options is given -> override the options
		$.extend(true, customOption, options.fileinput);
	}
	var obj = undefined;
	if(options && options.obj) {
		obj = options.obj;
	}
	//get config from input
	var code 		= element.data("code");
	var typ01 		= element.data("typ01");
	var typ02 		= element.data("typ02");
	var dataname	= element.data("name");
	var maxFile		= element.data("maxfile");
	customOption.uploadExtraData.code = code;
	if(typ01) {
		customOption.uploadExtraData.typ01 = typ01;
	}
	if(typ02) {
		customOption.uploadExtraData.typ02 = typ02;
	}
	if(maxFile) {
		try {
			customOption.maxFileCount = parseInt(maxFile);
		} catch(e) {
			console.log(e);
		}
		if(maxFile == 1) {
			customOption.autoReplace		= true;
			customOption.overwriteInitial	= true;
		}
	}
	//[T1604] show file by type01
	var listFiles 	= [];
	var listTmpFile = [];
	if(options && options.fileinput_files) {
		//old version
		listTmpFile = options.fileinput_files;
	} else if(obj && obj[dataname]) {
		//new version
		listTmpFile = obj[dataname];
	}
	//Filter list file by typ01
	if(typ01) {
		$.each(listTmpFile, function(i, e) {
			if(e.typ01 == typ01) {
				listFiles.push(e);
			}
		});
	} else {
		listFiles = listTmpFile;
	}
	//Init the file input preview existing files
	var urls = [];
	var preConf = [];
	$.each(listFiles, function(i, e) {
		var u = App.path.BASE_URL_API + "?" + e.path01;
		urls.push(u);
		var c = {
				caption : e.name,
				downloadUrl: u,
				size : e.size,
				key : e.id
		}
		preConf.push(c);
	});
	customOption.initialPreview = urls;
	customOption.initialPreviewAsData = true;
	customOption.initialPreviewConfig = preConf;
	element.fileinput(customOption);
	element.on('fileuploaded', function(event, data, previewId, index) {
		var form = data.form, files = data.files, extra = data.extra, 
		response = data.response, reader = data.reader;
		if(options && options.fileinput_upcallback) {
			options.fileinput_upcallback(response);
		} else if(obj) {
			if(response[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				if(!obj[dataname]) {
					obj[dataname] = [];
				}
				var lstFiles = response[App['const'].RES_DATA];
				$.each(lstFiles, function(i, e) {
					obj[dataname].push(e);
				});
				do_gl_show_Notify_Msg_Success ($.i18n('common_file_up_ok_msg'));
			}
		}
	});
	element.on('filebatchuploadsuccess', function(event, data, previewId, index) {
		var form = data.form, files = data.files, extra = data.extra, 
		response = data.response, reader = data.reader;
		if(options && options.fileinput_upcallback) {
			options.fileinput_upcallback(response);
		} else if(obj) {
			if(response[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				if(!obj[dataname]) {
					obj[dataname] = [];
				}
				var lstFiles = response[App['const'].RES_DATA];
				$.each(lstFiles, function(i, e) {
					obj[dataname].push(e);
				});
				do_gl_show_Notify_Msg_Success ($.i18n('common_file_up_ok_msg'));
			}
		}
	});
	//Always ask when delete file
	element.on('filebeforedelete', function(event, key, data) {
		return new Promise(function(resolve, reject) {
			App.MsgboxController.do_lc_show({
				title	: $.i18n("msgbox_confirm_title"),
				content : sprintf($.i18n("common_msg_del_file_content"	), key),
				buttons	: {
					OK: {
						lab		: $.i18n("common_btn_ok"),
						funct	: function(){
							resolve();
						}					
					},
					NO: {
						lab		:  $.i18n("common_btn_cancel"),
						funct	: function(){
							result = false;
						}
					}
				}
			});
		});
	});
	element.on('filedeleted', function(event, key, jqXHR, data) {
		response = jqXHR.responseJSON;
		if(options && options.fileinput_delcallback) {
			options.fileinput_delcallback(response);
		} else if(obj) {
			if(response[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var fileId = response[App['const'].RES_DATA];
				$.each(obj[dataname], function(i, e) {
					if(e.id == fileId) {
						obj[dataname].splice(i,1);
					}
				});
				do_gl_show_Notify_Msg_Success ($.i18n('common_file_del_ok_msg'));
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_file_del_error_msg'));
			}
		}
	});
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//jQuery Numpad
function do_gl_init_jqueryNumpadPlugin(parentNode) {
	var children = parentNode.find(".numpad");
	if(children.length>0) {	
		children.each(function(){
			$(this).numpad();
		});
	}
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
function do_gl_init_touchKeyboardPlugin(parentNode, options) {
	var children = parentNode.find(".keyboard");
	if(children.length>0) {	
		children.each(function(){
			var defaultOption = {
					type:'custom',	//'tel'
//					layout:[
//					[['a','A'],['b','B'],['c','C'],['del','del']],
//					[['shift','shift'],['space','space']]
//					],
					initCaps: false
			};
			var customOption = $.extend(true, {}, defaultOption);
			if(options) {
				$.extend(true, customOption, options.keyboard);
			}
			$(this).keyboard(customOption);
		});
	}
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//------------------------------------------------------
function do_gl_Add_Class_List(divList, divElement, className) {
	if(!className) className = "active";
	$(divList).children().removeClass(className);
	var li = $(divElement);
	li.addClass(className);
}
function do_gl_Remove_Add_Class_List(divList, divElement, oldClassName, newClassName) {
	if(!newClassName) newClassName = "active";
	$(divList).children().removeClass(oldClassName);
	var li = $(divElement);
	li.addClass(newClassName);
}
function do_gl_Add_Class_List_All(divList, divElement, className) {
	if(!className) className = "active";
	$(divList).find("tr").removeClass(className);
	var li = $(divElement);
	li.addClass(className);
}
function do_gl_Remove_Class_List(divList, className) {
	if(!className) className = "active";
	$(divList).children().removeClass(className);
}
function do_gl_ShowEnabledButton(idBtn, flag, styleDisplay) {
	if(!styleDisplay) styleDisplay = "block";
	if(flag) {
		$(idBtn).attr	("disabled", false);
		$(idBtn).css	("display", styleDisplay);
	} else {
		$(idBtn).attr	("disabled", true);
		$(idBtn).css	("display", "none");
	}
}
function srtArrayDesc(desc, key, srtTime) {
	if(srtTime) {
		return function(a, b){
			return desc ? ~~(key ? new Date(a[key]).getTime() < new Date(b[key]).getTime() : new Date(a).getTime() < new Date(b).getTime()) 
					: ~~(key ? new Date(a[key]).getTime() > new Date(b[key]).getTime() : new Date(a).getTime() > new Date(b).getTime());
		};
	} else {
		return function(a, b){
			return desc ? ~~(key ? a[key] < b[key] : a < b) 
					: ~~(key ? a[key] > b[key] : a > b);
		};
	}
}
function req_gl_Sort_Array(arr, key, type, srtTime) {
	if(type == App['const'].SORT_TYPE.ASC)
		return arr.sort(srtArrayDesc(false, key, srtTime));
	else if(type == App['const'].SORT_TYPE.DESC)
		return arr.sort(srtArrayDesc(true, key, srtTime));
}
if (!String.format) {
	String.format = function(format) {
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
				? args[number] 
			: match
			;
		});
	};
} //ex: String.format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET', 'Test');
function do_gl_render_datatable(parentNode, options) {
	var lang = localStorage.language;
	if (lang ==null ) lang = "en";
	var filename = "datatable_"+lang+".json";
	var children = parentNode.find(".table-datatable");
	if(children.length>0) {	
		children.each(function(){
			var defaultOption = {
					oLanguage		: {
						sUrl	: "www/js/lib/datatables/"+ filename
					},	
					"paging": true,
					"lengthChange": true,
					"searching": true,
					"ordering": true,
					"info": true,
					"autoWidth": true,
					
					sDom :	SDOM_DATATABLE_DEFAULT
			};
			
			if(options.sDom){
				var custom_dom = SDOM_DATATABLE_CUSTOM;
				
				defaultOption.sDom = custom_dom;
				defaultOption.initComplete =  function( settings, json ) {
					$("#table-header-add").html("<button id='btn_add' class='objData btn btn-flat btn-primary pull-right'>"
												+ "<i class='fa fa-braille' aria-hidden='true'></i>"
												+ "</button>");
					
//					$(tableId + "_wrapper").find("#btn_add").on("click", function() {
//						if(add_funct) {
//							add_funct(new_table);
//						} else {
//							var newData 	= $.extend(true, {}, default_new_line);
//							var rownode 	= new_table.row.add(newData).draw(false).node();
//
//							do_gl_enable_edit($(rownode));
//						}
//					});
				}
			}
			var customOption = $.extend(true, {}, defaultOption);
			if(options && options.datatable) {
				$.extend(true, customOption, options.datatable);
			}
			var extraCustomOption = $(this).data("option");
			if(extraCustomOption) {
				$.extend(true, customOption, extraCustomOption);
			}
			$(this).DataTable(customOption);
		});	
	}
}
function do_gl_sort_object_number(object, itemSort) {
	var objectSort		= $.extend(true, {}, object);
	var reList 			= []
	var reListSort 		= []
	var i 				= 0
	$.each(objectSort, function(index, el){
		if(isNaN(el[itemSort]))
			el.nameSort = do_gl_change_characters_for_sort(el[itemSort]);
		else
			el.nameSort = parseFloat(el[itemSort]);
		reList[i] = el.nameSort;
		i++;
	})
	reList.sort(function(a, b){return a - b});
	$.each(objectSort, function(index, el){
		for(var i = 0; i < reList.length; i++){
			if(el.nameSort == reList[i]){
				reListSort[i] = el;
				delete reListSort[i].nameSort;
				delete reList[i]; 
				break;
			}
		}
	})
	return reListSort;
}
function do_gl_sort_object(object, itemSort) {
	var objectSort		= $.extend(true, {}, object);
	var reList 			= []
	var reListSort 		= []
	var i 				= 0
	$.each(objectSort, function(index, el){
		if(isNaN(el[itemSort]))
			el.nameSort = do_gl_change_characters_for_sort(el[itemSort]);
		else
			el.nameSort = el[itemSort];
		reList[i] = el.nameSort;
		i++;
	})
	reList.sort();
	$.each(objectSort, function(index, el){
		for(var i = 0; i < reList.length; i++){
			if(el.nameSort == reList[i]){
				reListSort[i] = el;
				delete reListSort[i].nameSort;
				delete reList[i]; 
				break;
			}
		}
	})
	return reListSort;
}
function do_gl_change_alias(string) {
    str = string.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim(); 
    return str;
}
function do_gl_change_characters_for_sort(string) {
	var str = string;
	str = str.replace('Ă','Az');
	str = str.replace('Ằ','Azz');
	str = str.replace('Ắ','Azzz');
	str = str.replace('Ẳ','Azzzz');
	str = str.replace('Ẵ','Azzzzz');
	str = str.replace('Ặ','Azzzzzz');
	str = str.replace('Â','Azzzzzzz');
	str = str.replace('Ầ','Azzzzzzz');
	str = str.replace('Ấ','Azzzzzzzz');
	str = str.replace('Ẩ','Azzzzzzzzz');
	str = str.replace('Ẫ','Azzzzzzzzzz');
	str = str.replace('Ậ','Azzzzzzzzzzz');
	str = str.replace('ă','az');
	str = str.replace('ằ','azz');
	str = str.replace('ắ','azzz');
	str = str.replace('ẳ','azzzz');
	str = str.replace('ẵ','azzzzz');
	str = str.replace('ặ','azzzzzz');
	str = str.replace('â','azzzzzzz');
	str = str.replace('ầ','azzzzzzzz');
	str = str.replace('ấ','azzzzzzzzz');
	str = str.replace('ẩ','azzzzzzzzzz');
	str = str.replace('ẫ','azzzzzzzzzzz');
	str = str.replace('ậ','azzzzzzzzzzzz');
	str = str.replace('Đ','Dz');
	str = str.replace('đ','dz');
	str = str.replace('Ê','Ez');
	str = str.replace('Ề','Ezz');
	str = str.replace('Ế','Ezzz');
	str = str.replace('Ể','Ezzzz');
	str = str.replace('Ễ','Ezzzzz');
	str = str.replace('Ệ','Ezzzzzz');
	str = str.replace('ê','ezzzzzzz');
	str = str.replace('ề','ezzzzzzzz');
	str = str.replace('ê','ezzzzzzzzz');
	str = str.replace('ể','ezzzzzzzzzz');
	str = str.replace('ễ','ezzzzzzzzzzz');
	str = str.replace('ệ','ezzzzzzzzzzzz');
	str = str.replace('Ô','Oz');
	str = str.replace('Ồ','Ozz');
	str = str.replace('Ố','Ozzz');
	str = str.replace('Ổ','Ozzzz');
	str = str.replace('Ỗ','Ozzzzz');
	str = str.replace('Ộ','Ozzzzzz');
	str = str.replace('Ơ','Ozzzzzzz');
	str = str.replace('Ờ','Ozzzzzzzz');
	str = str.replace('Ớ','Ozzzzzzzzz');
	str = str.replace('Ở','Ozzzzzzzzz');
	str = str.replace('Ỡ','Ozzzzzzzzzz');
	str = str.replace('Ợ','Ozzzzzzzzzzz');
	str = str.replace('ô','oz');
	str = str.replace('ồ','ozz');
	str = str.replace('ố','ozzz');
	str = str.replace('ổ','ozzzz');
	str = str.replace('ỗ','ozzzzz');
	str = str.replace('ộ','ozzzzzz');
	str = str.replace('ơ','ozzzzzzz');
	str = str.replace('ờ','ozzzzzzzz');
	str = str.replace('ớ','ozzzzzzzzz');
	str = str.replace('ở','ozzzzzzzzzz');
	str = str.replace('ỡ','ozzzzzzzzzzz');
	str = str.replace('ợ','ozzzzzzzzzzzz');
	str = str.replace('Ư','Uz');
	str = str.replace('Ừ','Uzz');
	str = str.replace('Ứ','Uzzz');
	str = str.replace('Ử','Uzzzz');
	str = str.replace('Ữ','Uzzzzz');
	str = str.replace('Ự','Uzzzzzz');
	str = str.replace('ư','uz');
	str = str.replace('ừ','uzz');
	str = str.replace('ứ','uzzz');
	str = str.replace('ử','uzzzz');
	str = str.replace('ữ','uzzzzz');
	str = str.replace('ự','uzzzzzz');
	
	return str;
}


//-----WebContent/www/js/app/common/ctrl/DatatableTool.js------------------------------
var SDOM_DATATABLE_DEFAULT	= 	"<'row'<'col-4 col-lg-4 col-md-4 col-sm-4'l><'col-8 col-lg-8 col-md-8 col-sm-8 pull-right'f>>" +
								"<'row'<'col-12 col-lg-12 col-md-12 col-sm-12'tr>>" +
								"<'row mg-tb-20'<'col-6 col-lg-6 col-md-6 col-sm-6 col-xm-12'i><'col-6 col-lg-6 col-md-6 col-sm-6 col-xm-12 pull-right'p>>";
var SDOM_DATATABLE_CUSTOM	= 	"<'row'<'col-4 col-lg-4 col-md-4 col-sm-4 pull-left'l><'col-6 col-lg-6 col-md-6 col-sm-6 pull-right'f><'#table-header-add.col-2 col-lg-2 col-md-2 col-sm-2 pull-right'>>" +
								"<'row'<'col-12 col-lg-12 col-md-12 col-sm-12'tr>>" +
								"<'row'<'col-5 col-lg-5 col-md-5 col-sm-5'i><'col-5 col-lg-5 col-md-5 col-sm-5 pull-right'p><'#table-bottom-add.col-2 col-lg-2 col-md-2 col-sm-2'>>";
//var SDOM_DATATABLE_SEARCH_OPT= 	"<'row'<'col-lg-4 col-md-4 col-sm-4'l><'col-lg-8 col-md-8 col-sm-8'<'row div_search_with_opt'<'#table-header-search-opt'>f>>>" +
//								"<'row'<'col-lg-12 col-md-12 col-sm-12'tr>>" +
//								"<'row'<'col-lg-7 col-md-7 col-sm-12'i><'col-lg-5 col-md-5 col-sm-12'p>>";
var SDOM_DATATABLE_SEARCH_OPT= 	"<'row'<'col-5 col-lg-5 col-md-3 col-sm-4 col-xs-12'l><'#table-header-search-opt.col-2 col-lg-2 col-md-3 col-sm-3 col-xs-6'><'col-5 col-lg-5 col-md-6 col-sm-5 col-xs-6'f>>" +
								"<'row'<'col-12 col-lg-12 col-md-12 col-sm-12'tr>>" +
								"<'row'<'col-7 col-lg-7 col-md-7 col-sm-12'i><'col-5 col-lg-5 col-md-5 col-sm-12'p>>";
var SDOM_DATATABLE_SEARCH_OPT_OLD= 	"<'row'<'col-3 col-lg-3 col-md-3 col-sm-4'l><'col-5 col-lg-5 col-md-5 col-sm-4'f><'#table-header-search-opt.col-4 col-lg-4 col-md-4 col-sm-4'>>" +
								"<'row'<'col-12 col-lg-12 col-md-12 col-sm-12'tr>>" +
								"<'row'<'col-7 col-lg-7 col-md-7 col-sm-12'i><'col-5 col-lg-5 col-md-5 col-sm-12'p>>";
//------------------------------------------------------------------------------------------------------------------
var datatable_lang_config 	= "";
var datatable_lang_opt 		= null;
//------------------------------------------------------------------------------------------------------------------
var req_gl_datatable = function (cfg){
	//	tabParentId		: div contains table
	//	tabParentAttr 	: {} json html attributes
	//  tabId		: id of table
	//	tabClass	: class of table to find
	//  tabConf		: config for datatable
	//	tabColConf	: config of col in datatable
	//	tabScrollX	: true/false
	//  tabScrollY	: true/false
	//  tabLineFAdd	: function call when add line
	//  tabLineDef	: default line if add new one
	//  tabFCallback: function call when table is built 
	//  tabData		: data  
	//	tabTranslUrl:
	//	tabTransLang:
	// 	tabEditable	: can be editable
	
	//AJaxOption
	//	apiUrl			: urlAPI
	//	apiUrlHeader	: secu header
	//	apiUrlOpt		: refJon 
	//	apiTimeWait		: timeWait for each request
	//	apiFPreprocess	: call before api  
	//  apiFCallback	: call after api
	
	
	if (!cfg.apiTimeWait) cfg.apiTimeWait = 800;
	
	var tabParentId = null;
	var tabDiv		= null;
	var tabParent	= null;
	var tableId		= cfg.tabId?cfg.tabId:cfg.tabParentId;
	
	if (cfg.tabId)
		tabDiv 		= $(cfg.tabId);
	else {
		tabParentId	= cfg.tabParentId;
		tabParent 	= $(cfg.tabParentId);
		if(!cfg.tabClass) {
			cfg.tabClass = '.table-datatableDyn';
		}
		tabDiv 		= tabParent.find(cfg.tabClass);
	}
	
	if(tabDiv.length == 0) {
		console.log("ERROR: Table " + tableId + " is not found!");
		return undefined;
	}
	tabDiv.addClass("table-bordered table-striped");
	//-------------------------------------------------------------------------------------------
	cfg.tabColConf = req_gl_table_col_config(tabDiv, cfg.tabData, cfg.tabColConf);
	//-------------------------------------------------------------------------------------------
	var dataT = {
			"title"					: "",
			"searchOption" 			: false,
			"searchOptionConfig" 	: [{lab: $.i18n('all'), val:0}], //list des options dans select 
			"aLengthMenu"			: [ [15, 25, 50, 100], ["15", "25", "50", "100"] ],
			"processing"			: true,
	        "sPaginationType"		: "listbox",
			"bDeferRender"			: true,
			"sDom" 					: SDOM_DATATABLE_DEFAULT,	
			"aoColumns"				: cfg.tabColConf,
			"fnDrawCallback"		: function() {if(cfg.tabFCallback) cfg.tabFCallback(tableId);},
//			bProcessing	: false,  
		   
//		    "pagingType"	: "input",
//		    "pagingType"	: "simple_numbers",  //"full_numbers",
			
//		    "sPaginationType": "scrolling",		    
//			sPaginationType	: "bootstrap",
//			sPaginationType	: "full_numbers",    
		    
//		    aaSorting		: sort ? sort : [1, "asc"],	
				
	}
	
	if (!cfg.tabTranslUrl){
		var lang = cfg.tabTransLang ;
		if (lang == null || lang == undefined) lang = localStorage.language;	
		if (lang == null || lang == undefined) lang = "vi";	
		cfg.tabTranslUrl = "www/js/lib/datatables/datatable_"+lang+".json";
		cfg.tabTransLang = lang;
		
		if (datatable_lang_config!=lang){
			datatable_lang_config = lang; 
			readFile(cfg.tabTranslUrl, function(text){
				datatable_lang_opt = JSON.parse(text);		    
			});
		} 	
	}
	if (datatable_lang_opt) 
			dataT.oLanguage = datatable_lang_opt; //readfile is asynchro
	else  	dataT.oLanguage = {sUrl :  cfg.tabTranslUrl};
	
	//----not ajax dyn
	if (cfg.tabData){				
		var table_data 		= [];
		var table_data_name = tabDiv.data("name");
		var table_right 	= tabDiv.data("right");
		if(table_data_name && cfg.tabData[table_data_name]) {
			table_data = cfg.tabData[table_data_name];
		}else if (!table_data_name){
			table_data = cfg.tabData;
		}
		if (cfg.tabLineDef){
			$.each(table_data, function(i, e) {
				var tmp = $.extend(true, {}, cfg.tabLineDef, e);
				$.extend(true, e, tmp);
			});
		}		
		dataT.data = table_data;
		
	}else{
	//---- ajax dyn	
	
		var funtFuture;
		dataT.bServerSide		= true;
		dataT.sAjaxSource		= cfg.apiUrl; 
		dataT.fnServerData		= function ( sSource, aoData, fnCallback, oSettings  ) {			    	
			//aoData =[{"name":"sEcho","value":3},
			//{"name":"iColumns","value":2},{"name":"sColumns","value":","},{"name":"iDisplayStart","value":0},{"name":"iDisplayLength","value":10},{"name":"mDataProp_0","value":"code"},{"name":"sSearch_0","value":""},{"name":"bRegex_0","value":false},{"name":"bSearchable_0","value":true},{"name":"bSortable_0","value":true},{"name":"mDataProp_1","value":"name"},{"name":"sSearch_1","value":""},{"name":"bRegex_1","value":false},{"name":"bSearchable_1","value":true},{"name":"bSortable_1","value":true},{"name":"sSearch","value":"f"},{"name":"bRegex","value":false},{"name":"iSortCol_0","value":0},{"name":"sSortDir_0","value":"desc"},{"name":"iSortingCols","value":1}]
			//param = {name:3,iColumns:2,...}
			var param = {};
			//---chk if there is the option for search
			if (dataT.searchOption){
				var selectEle = $(tableId).find("#sel_search_opt");
//				param["searchOpt"] = selectEle.val();
				dataT.searchOptCol 	= selectEle.val();
				selectEle.off("change");			
				selectEle.on("change", function() {
					var searchText = $(tableId).find('.dataTables_filter').find('input').val();
					if (searchText) searchText = searchText.trim();
					if (searchText.length>0){
						dataT.searchOptCol 	= selectEle.val();
						dataT.fnServerData(sSource, aoData, fnCallback, oSettings );
					}
						
				});		
			}else{
//				if (dataT.searchOptVal) param["searchOpt"] = dataT.searchOptVal
//				else
//					param["searchOpt"] = null; //no option, by default in server side
			}
			
			if (dataT.searchOptCol){
				param["searchOptCol"] =dataT.searchOptCol;
			}
			for (var k in aoData){
				var o = aoData[k];
				param[o.name] = o.value;				
			}
			cfg.apiUrlOpt["dataTableParam"]	= JSON.stringify(param);		
			if (!funtFuture) clearTimeout(funtFuture);				
			funtFuture = setTimeout(function(){
				$.ajax({
					contentType : "application/json",
					dataType	: "json",
					type		: 'POST',
					url			: sSource,
					headers		: cfg.apiUrlHeader,
					data		: JSON.stringify(cfg.apiUrlOpt),
					success		: function (msg) {
//						App.network.req_lc_DecodeUTF8(msg);								
//						msg.aaData = JSON.parse(msg.aaData);
//						fnCallback(msg);
						if (!can_gl_BeLogged(msg)) return;
						App.network.req_lc_DecodeUTF8(msg);		    				
						if(msg.sv_code == 20000) {
							try{
								msg.aaData = JSON.parse(msg.aaData);
							}catch(e){
								//msg.aaData is aldready aaData
							}
						} else {
							msg.aaData = [];
							msg.iTotalRecords = 0;
						}
						if(cfg.apiFPreprocess) {
							// Process the return data before building the table
							msg = cfg.apiFPreprocess(msg);
						}
						if(msg.aaData.length >= 0){
							$(tabParentId).on("change", "select", function() {
								if(!App.data.page)	App.data.page = {};
								App.data.page[tabParentId] = 1;
							});
							$(tabParentId).on("keydown", "input[type='search']", function() {
								if(!App.data.page)	App.data.page = {};
								App.data.page[tabParentId] = 1;
							});
							fnCallback(msg);
							if (cfg.apiFCallback) {
								setTimeout(function(){ cfg.apiFCallback(msg.aaData, tabParentId, oTable, param);}, 500);
							}
						}
					},
					error 		: function(res, statut, erreur){	
						if (cfg.apiFError) execute (apiFError, [res, statut, erreur]);	
					},
				});	
			}, cfg.apiTimeWait);
		}	
	}
	
	//--------scrol option------------------------
	if(cfg.tabScrollX == undefined || cfg.tabScrollX == null){
		dataT["scrollX"] = true;
	} else{
		dataT["scrollX"] = cfg.tabScrollX;
	}
	if(cfg.tabScrollY == undefined || cfg.tabScrollY == null){
		//Scroll - vertical, dynamic height
		dataT["scrollY"] = "70vh";
		dataT["scrollCollapse"]	= true;
	} else {
		dataT["scrollCollapse"]	= cfg.tabScrollY;
	}
	
	
	//---------------------------------------------
	if (cfg.tabConf) dataT = Object.assign(dataT, cfg.tabConf);
	
	//---------------------------------------------
	
	var table_editable 	= cfg.tabEditable;
	if(table_editable == undefined || table_editable ==null ) table_editable = tabDiv.data("editable");
	if(table_editable == undefined || table_editable ==null ) {
		table_editable = true;
	}	
	
	var pr_local = {};
	if( tableId && table_editable  ) {		
		dataT.sDom 			= SDOM_DATATABLE_CUSTOM;
		dataT.initComplete 	= function( settings, json ) {			
			$(tableId + "_wrapper")	.find("#table-header-add")
									.html("<button id='btn_add' class='objData datatable_btn_add btn btn-flat btn-primary pull-right ' disabled='disabled'>"
											+ "<i class='fa fa-plus' aria-hidden='true'></i>"
										+ "</button>");
			
			$(tableId + "_wrapper")	.find("#table-bottom-add")
									.append("<button id='btn_add_bottom' class='objData datatable_btn_add btn btn-flat btn-primary pull-right' disabled='disabled'>"
											+ "<i class='fa fa-plus' aria-hidden='true'></i>"
										+ "</button>");
			
			//Add right to add btn
			$(tableId + "_wrapper").find(".datatable_btn_add").data(table_right);			
			$(tableId + "_wrapper").find(".datatable_btn_add").on("click", function() {
				if(cfg.tabLineFAdd) {
					cfg.tabLineFAdd(pr_local.oTable);
				} else {
					var newData 	= $.extend(true, {}, cfg.tabLineDef);
					var rownode 	= pr_local.oTable.api().row.add(newData).draw(false).node();
					do_gl_enable_edit($(rownode));
				}
			});
						
			do_gl_apply_right($(tableId + "_wrapper"));
			
			if(cfg.tabFCallback) {
				cfg.tabFCallback();
			}
		}
	}
	
	if (dataT.searchOption){
//		dataT.sDom 			= SDOM_DATATABLE_SEARCH_OPT;		
		dataT.initComplete 	=  function(settings, json) {
			var opt = "";
			for (var i in dataT.searchOptionConfig){
				var conf = dataT.searchOptionConfig[i];
				opt = opt + "<option value= '"+ conf.val+"'>" +  conf.lab + "</option>"; 
			}
			var div_filter= "#DataTables_Table_0_filter";
//			$(tableId).find("#table-header-search-opt").html(
			$(tableId).find(div_filter).find("label").prepend(
					"<select class= 'form-control input-sm datatable_sel_search_opt' id='sel_search_opt'>"
					+ opt
					+ "</select> &nbsp;");
			
		}
	}
	
	//-----Enable ColReorder extension
	if(dataT["canColReorder"] == null||dataT["canColReorder"] == undefined || dataT["canColReorder"] == true){
		dataT.sDom 	= "R" + dataT.sDom;
//		new $.fn.dataTable.ColReorder( oTable );
	}
	
	//---------------------------------------------
	
	var oTable = tabDiv.dataTable(dataT);
	pr_local.oTable = oTable; //=> for function
	
	if (cfg.tabParentAttr){
		setTimeout(function(){
			for (var a in cfg.tabParentAttr)
				tabDiv.parent("div").css(a,  cfg.tabParentAttr[a]);
		}, 700);
	}
	return oTable
}
//------------------------------------------------------------------------------------------------------------------
const do_gl_filter_line_by_mode = function (list, mode){
	if (!list) return;
	try{
		for(var i = 0; i<list.length; i++){
			if(list[i].mode){
				if(list[i].mode == mode){
					delete list[i];
				}
			}
		}
	}catch(e){}	
}
jQuery.fn.dataTable.Api.register('row.addByPos()', function(data, index) {    
    var currentPage = this.page();
 
    //insert the row
    this.row.add(data);
 
    //move added row to desired index
    var rowCount = this.data().length;
    if (rowCount<=1) return this.row(0);
    
    var insertedRow = this.row(rowCount-1).data();
    insertedRow.ord = rowCount;
    
 
    for (var i=rowCount-1;i>index;i--) {
    	var tempRow = this.row(i-1).data();
        this.row(i).data(tempRow);        
    }    
    
    this.row(index).data(insertedRow);
    
    //refresh the current page
    this.page(currentPage).draw(false);
    return this.row(index);
});
/*
 *
 var selectedElement = $("#id_tab");
 var selectedTab = selectedElement.dataTable();
 var selectedRow = selectedElement.dataTable().fnGetNodes().filter(function(element){ 
    			return element.getAttribute('data-id') == userId 
    		})[0];
 */
function doShowDatatablePageByRow (selectedTab, selectedRow){	
	var lines	= selectedTab.fnGetNodes();
	var lineNb	= -1;
	for (var i = 0; i< lines.length;i ++){
		if (lines[i] == selectedRow){
			lineNb = i;
			break;
		}
	}
	if (lineNb>=0){
		var pos			= lineNb; //selectedTab.fnGetPosition(selectedRow);
		var pageInf 	= selectedTab.fnPagingInfo();		    			    	
		var pageDisplay = Math.floor(pos/pageInf.iLength );
		selectedTab.fnPageChange(pageDisplay,true);
	}
	
}
//url =  App.path.BASE_URL_API_PRIV
/*colConfig		= [
{ mData: "id" 		, bVisible: false},
{ mData: "code" 		, bVisible: true},
{ mData: "name01" 	, bVisible: true}  
]*/	
function req_gl_Datatable_Ajax_Dyn(div, url, url_header, fileTranslate, colConfig, refJson, fError, timeWait, datatableClass, fPreprocess, fCallback, dataTableConf, scrollX){	
	if (!timeWait) timeWait = 800;
	
	if(!datatableClass) {
		datatableClass = '.table-datatableDyn';
	}
	
	var funtFuture;
	var tableId = div;
	
	if (!fileTranslate){
		var lang = localStorage.language;
		if (lang == null || lang == undefined) lang = "vi";	
		fileTranslate = "www/js/lib/datatables/datatable_"+lang+".json";
	}
	
	var dataT = {
			"searchOption" 			: false,
			"searchOptionConfig" 	: [{lab: $.i18n('all'), val:0}], //list des options dans select 
			
			"processing": true,
	        
		    bServerSide		: true,  
		    //bProcessing	: false,  
		    sAjaxSource		: url,  
		    "aLengthMenu"	: [ [15, 25, 50, 100], ["15", "25", "50", "100"] ],
		   
//		    "pagingType"	: "input",
//		    "pagingType"	: "simple_numbers",  
		    //pagingType		: "full_numbers",
		    
//		    "sPaginationType": "scrolling",
		    "sPaginationType": "listbox",
//			sPaginationType	: "bootstrap",
//			sPaginationType	: "full_numbers",    
		    
//		    aaSorting		: sort ? sort : [1, "asc"],
		    	
		    bDeferRender	: true,
		    
			oLanguage		: {
				sUrl		:  fileTranslate
			},	
			
//			oClasses		:{
//				sFilterInput :  "inputClass",
//				sLengthSelect : "selectClass",
//			},
			sDom 			: SDOM_DATATABLE_DEFAULT,
			
			aoColumns		: colConfig,	
		
			initComplete	: function(settings, json) {
				$(tableId).find('.dataTables_scrollBody').addClass("dataTables_scrollbar");
			},
		    
			fnServerData	: function ( sSource, aoData, fnCallback, oSettings  ) {			    	
				$(tableId).find('.dataTables_scrollBody').addClass("dataTables_scrollbar");
				
				//aoData =[{"name":"sEcho","value":3},{"name":"iColumns","value":2},{"name":"sColumns","value":","},{"name":"iDisplayStart","value":0},{"name":"iDisplayLength","value":10},{"name":"mDataProp_0","value":"code"},{"name":"sSearch_0","value":""},{"name":"bRegex_0","value":false},{"name":"bSearchable_0","value":true},{"name":"bSortable_0","value":true},{"name":"mDataProp_1","value":"name"},{"name":"sSearch_1","value":""},{"name":"bRegex_1","value":false},{"name":"bSearchable_1","value":true},{"name":"bSortable_1","value":true},{"name":"sSearch","value":"f"},{"name":"bRegex","value":false},{"name":"iSortCol_0","value":0},{"name":"sSortDir_0","value":"desc"},{"name":"iSortingCols","value":1}]
		    	//param = {name:3,iColumns:2,...}
		    	var param = {};
		    	
		    	//---chk if there is the option for search
		    	if (dataT.searchOption){
		    		var selectEle 		= $(tableId).find("#sel_search_opt");
//					param["searchOpt"] 	= selectEle.val();
		    		dataT.searchOptCol 	= selectEle.val();
					selectEle.off("change");			
					selectEle.on("change", function() {
						var searchText = $(tableId).find('.dataTables_filter').find('input').val();
						if (searchText) searchText = searchText.trim();
						if (searchText.length>0){
							dataT.searchOptCol = selectEle.val();
							dataT.fnServerData(sSource, aoData, fnCallback, oSettings );
						}
							
					});		
				}else{
//					if (dataT.searchOptVal) param["searchOpt"] = dataT.searchOptVal
//					else
//						param["searchOpt"] = null; //no option, by default in server side
				}
		    	
		    	if (dataT.searchOptCol){
					param["searchOptCol"] =dataT.searchOptCol;
				}
		    	
		    	for (var k in aoData){
					var o = aoData[k];
					param[o.name] = o.value;				
				}
		    	refJson["dataTableParam"]	= JSON.stringify(param);		
				
				clearTimeout(funtFuture);
				
		    	funtFuture = setTimeout(function(){
		    		$.ajax({
		    			contentType : "application/json",
						dataType	: "json",
		    			type		: 'POST',
		    			url			: sSource,
						headers		: url_header,
						data		: JSON.stringify(refJson),
		    			success		: function (msg) {
//		    				App.network.req_lc_DecodeUTF8(msg);								
//		    				msg.aaData = JSON.parse(msg.aaData);
//		    				fnCallback(msg);
		    				
		    				if (!can_gl_BeLogged(msg)) return;
		    				App.network.req_lc_DecodeUTF8(msg);		    				
							if(msg.sv_code == 20000) {
								try{
									msg.aaData = JSON.parse(msg.aaData);
								}catch(e){
									//msg.aaData is aldready aaData
								}
								
							} else {
								msg.aaData = [];
								msg.iTotalRecords = 0;
							}
							if(fPreprocess) {
								// Process the return data before building the table
								msg = fPreprocess(msg);
							}
							if(msg.aaData.length >= 0){
								$(div).on("change", "select", function() {
									if(!App.data.page)	App.data.page = {};
									App.data.page[div] = 1;
								});
								
								$(div).on("keydown", "input[type='search']", function() {
									if(!App.data.page)	App.data.page = {};
									App.data.page[div] = 1;
								});
								
								
								fnCallback(msg);
								
								if(fCallback) {
									setTimeout(function(){ fCallback(msg.aaData, div, oTable, param);}, 500);
								}
							}
		    				
		    			},
		    			error 		: function(res, statut, erreur){					
		    				if (fError) execute (fError, [res, statut, erreur]);						
		    			},
		    		});	
		    	}, timeWait);
		    }	    
		 
		};
	
	
	if (dataTableConf) dataT = Object.assign(dataT, dataTableConf);
	
	if(dataT["canScrollY"] == true){
	    //Scroll - vertical, dynamic height
		dataT["scrollY"] = "80vh";
		dataT["scrollCollapse"]	= true;
	}
	if(dataT["canScrollX"] == true){
	    //Scroll - vertical, dynamic height
		dataT["scrollX"] = "80%";
	} else {
//		dataT["scrollX"] = false;
	}
	
//	if(typeof(scrollX) == "undefined"){
//		dataT["scrollX"] = false;
//	}
	
	
	
	if (dataT.searchOption){
//		dataT.sDom 	= SDOM_DATATABLE_SEARCH_OPT;
		
		dataT.initComplete =  function(settings, json) {
			var opt = "";
			for (var i in dataT.searchOptionConfig){
				var conf = dataT.searchOptionConfig[i];
				opt = opt + "<option value= '"+ conf.val+"'>" +  conf.lab + "</option>"; 
			}
			var div_filter= "#DataTables_Table_0_filter";
//			$(tableId).find("#table-header-search-opt").html(
			$(tableId).find(div_filter).find("label").prepend(
										"<select class= 'form-control input-sm datatable_sel_search_opt' id='sel_search_opt'>"
										+ opt
										+ "</select> &nbsp;");
			
//			$(tableId).find("#table-header-search-opt").html(
//										"<select class= 'form-control input-sm datatable_sel_search_opt' id='sel_search_opt'>"
//										+ opt
//										+ "</select> &nbsp;");
			
//			$(tableId).find(".dataTables_filter").prepend(
//					"<select class='form-control sel_search_opt' id='sel_search_opt'>"
//					+ opt
//					+ "</select> &nbsp;"); 
			
			//Add right to add btn
			
		}
	}
	
	
	//Enable ColReorder extension
	if(dataT["canColReorder"] == null||dataT["canColReorder"] == undefined || dataT["canColReorder"] == true){
		dataT.sDom 	= "R" + dataT.sDom;
//		new $.fn.dataTable.ColReorder( oTable );
	}
	
	$(div).find(datatableClass).addClass("table-bordered table-striped");
	var oTable = $(div).find(datatableClass).dataTable(dataT);
	
	//---binding event for refresh btn
	var btnRefresh = $(div).find(".btn-refresh");
	btnRefresh.off("click");
	btnRefresh.on("click", function(){
		oTable.fnDraw();
	});
	
	
	return oTable;
}
var can_gl_BeLogged = function (res){
	if (!res.sess_stat){
//		localStorage.clear();	
		try{
			do_gl_LocalStorage_Remove (App.keys.KEY_STORAGE_CREDENTIAL);
		}catch(e){}	
		App.router.controller.do_lc_run(App.router.routes.HOME);
		return false;
	}		
	return true;
};
//------------------------only when begin ---------------------------------------------------
/* ---------- Additional functions for data table ---------- */
$.fn.dataTableExt.oApi.fnPagingInfo = function (oSettings ){
	if(oSettings==null) {
		return {
			"iStart"		: 0,
			"iEnd"			: 0,
			"iLength"		: 0,
			"iTotal"		: 0,
			"iFilteredTotal": 0,
			"iPage"			: 0,
			"iTotalPages"	: 0
		};
	} else {
		return {
			"iStart"		: oSettings._iDisplayStart,
			"iEnd"			: oSettings.fnDisplayEnd(),
			"iLength"		: oSettings._iDisplayLength,
			"iTotal"		: oSettings.fnRecordsTotal(),
			"iFilteredTotal": oSettings.fnRecordsDisplay(),
			"iPage"			: Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
			"iTotalPages"	: Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
		};
	}		
}
//custom search to hide deleted rows
$.fn.dataTable.ext.search.push(
		function(settings, data, dataIndex) {
			var mode = settings.aoData[dataIndex]._aData.mode;
			if(mode == 3) {
				return false;
			} else {
				return true;
			}
		}
);
var _range = function ( len, start ){	
	var end;
	if ( start === undefined ) {
		start 	= 0;
		end 	= len;
	}else {
		end 	= start;
		start 	= len;
	}
	
	var out = [];
	for ( var i=start ; i<end ; i++ ) {
		out.push( i );
	}
	return out;
};
$.fn.DataTable.ext.pager.simple_numbers_no_ellipses = function(page, pages){
	var numbers 	= [];
	//var buttons = $.fn.DataTable.ext.pager.numbers_length;
	var buttons 	= 5;
	var half 	= Math.floor( buttons / 2 );
	if ( pages <= buttons ) {
		numbers = _range( 0, pages );
	} else if ( page <= half ) {
		numbers = _range( 0, buttons);
	} else if ( page >= pages - 1 - half ) {
		numbers = _range( pages - buttons, pages );
	} else {
		numbers = _range( page - half, page + half + 1);
	}
	numbers.DT_el = 'span';	 
	return [ 'previous', numbers, 'next' ];
};
$.fn.DataTable.ext.pager.simple_numbers = function(page, pages) {//page =0 => page 1
	var	numbers = [];
	var buttons = 6;
	var half 	= Math.floor( buttons / 2 )-1;
	var i 		= 1;
	if ( pages <= buttons ) {
		numbers = _range( 0, pages );
	
	}else if ( page <= half ) {
		numbers = _range( 0, buttons-2 );
		numbers.push( 'ellipsis' );
		numbers.push( pages-1 );
	
	}else if ( page >= pages - 1 - half ) {
		numbers = _range( pages-(buttons-2), pages );
		numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
		numbers.splice( 0, 0, 0 );
	
	}else {
		numbers = _range( page-half+1, page+half );
		numbers.push( 'ellipsis' );
		numbers.push( pages-1 );
		numbers.splice( 0, 0, 'ellipsis' );
		numbers.splice( 0, 0, 0 );
	}
	numbers.DT_el = 'span';
	return ["previous", numbers, "next"];
};
$.extend( $.fn.dataTableExt.oPagination, {
	"bootstrap": {
		"fnInit": function( oSettings, nPaging, fnDraw ) {
			var oLang = oSettings.oLanguage.oPaginate;
			var fnClickHandler = function ( e ) {
				e.preventDefault();
				if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
					fnDraw( oSettings );
				}
			};
			$(nPaging).addClass('pagination').append(
					'<ul>'+
//					'<li class="prev disabled"><a href="#">&larr; '+oLang.sPrevious+'</a></li>'+
//					'<li class="next disabled"><a href="#">'+oLang.sNext+' &rarr; </a></li>'+
					'<li class="prev disabled"><a href="#">'+oLang.sPrevious+'</a></li>'+
					'<li class="next disabled"><a href="#">'+oLang.sNext+'</a></li>'+
					'</ul>'
			);
			
			var els = $('a', nPaging);
			$(els[0]).bind( 'click.DT', { action: "previous" 	}, fnClickHandler );
			$(els[1]).bind( 'click.DT', { action: "next" 		}, fnClickHandler );
		},
		"fnUpdate": function ( oSettings, fnDraw ) {
			var iListLength = 3;
			var oPaging = oSettings.oInstance.fnPagingInfo();
			var an = oSettings.aanFeatures.p;
			var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);
			if ( oPaging.iTotalPages < iListLength) {
				iStart = 1;
				iEnd = oPaging.iTotalPages;
			}
			else if ( oPaging.iPage <= iHalf ) {
				iStart = 1;
				iEnd = iListLength;
			} else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
				iStart = oPaging.iTotalPages - iListLength + 1;
				iEnd = oPaging.iTotalPages;
			} else {
				iStart = oPaging.iPage - iHalf + 1;
				iEnd = iStart + iListLength - 1;
			}
			for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
				// remove the middle elements
				$('li:gt(0)', an[i]).filter(':not(:last)').remove();
				// add the new list items and their event handlers
				for ( j=iStart ; j<=iEnd ; j++ ) {
					sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
					$('<li '+sClass+'><a href="#">'+j+'</a></li>')
					.insertBefore( $('li:last', an[i])[0] )
					.bind('click', function (e) {
						e.preventDefault();
						oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
						fnDraw( oSettings );
					} );
				}
				// add / remove disabled classes from the static elements
				if ( oPaging.iPage === 0 ) {
					$('li:first', an[i]).addClass('disabled');
				} else {
					$('li:first', an[i]).removeClass('disabled');
				}
				if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
					$('li:last', an[i]).addClass('disabled');
				} else {
					$('li:last', an[i]).removeClass('disabled');
				}
			}
		}
	}
});
/**
 * 
 */
var req_gl_table_col_config = function(table, data, options) {
	if(!table.is("table")) {
		console.log("<table> is not a valid table");
		return;
	}
	var colConfig 	= [];
	var lstTh 		= table.find("th");
	var primaryCol	= table.data("primary");
	if(lstTh) {
		lstTh.each(function(e, i) {
			var th 			= $(this);
			var name 		= th.data("name");			
			var group 		= th.data("group");
			var groupIndex 	= th.data("gindex");
			var visible 	= th.data("visible");
			var editable 	= th.data("editable");
			var plugin	= th.data("plugin");
			var tdClass	= th.data("class");
			var tpyCode	= th.data("code");
			var right	= th.data("right");
			var pattern = th.data("pattern");
			var disable = th.data("disabled")
			var editable_class = "";
			if(visible == undefined) {
				visible = true;
			}
			if(editable == undefined) {
				editable = true;
			} else if(editable == "none") {
				editable = false;
			}
			
			if(visible == true && editable == true) {
				editable_class = "editable";
			}
			
			if(plugin == "fileinput") {
				//do not enable edit the td itself
				editable_class = "";
			}
			
			if(!tdClass) {
				tdClass = "";
			}
			
			if(name) {
				var config = { mData: name 	, bVisible: visible, sClass:editable_class + " " + name + " " + tdClass};
				if(name == "action") {
					config.mData = "id";
					bSortable = false;
					//do not enable edit the td itself
					config.sClass = name + " " + tdClass;
				}
				
				if(plugin == "fileinput") {
					//fix the width so it not very large
					config.sWidth = "30px";
					//do not enable edit the td itself
					config.sClass = name + " " + tdClass + " excl";
				}
				//bind default event
				config.fnCreatedCell = function(nTd, sData, oData,iRow, iCol) {
					var line = $(nTd).parent();
					line.attr("data-gIndex",iRow);
					
					$(nTd).data("name"	, name);
					if (group) 		$(nTd).data("group"	, group);
					if (groupIndex) $(nTd).data("gindex", groupIndex);					
					if(visible == true && editable == true) {
						$(nTd).keydown(function(event) {
							if(event.which == 13) {
								event.preventDefault();
								var next = $(this).nextAll("[contenteditable='true']")[0];
								if(next.length > 0) {
									next[0].focus();
								} else {
									var nextLine = $(this).parent().next();
									if(nextLine.length > 0) {
										$(nextLine).find("[contenteditable='true']")[0].focus();
									}
								}
							}
						});
						
						if(plugin == "datepicker") {
							do_gl_datepicker_plugin($(nTd), th);
						}else if(plugin == "datetimepicker") {
							do_gl_datetimepicker_plugin($(nTd), th);
						}else if(plugin == "fileinput") {
							$(nTd).html("<input class='fileinput editable' type='file' data-name='" + name + "' data-code='" + tpyCode + "'/>")
							do_gl_init_fileinputPlugin($(nTd) ,{obj : oData, fileinput:{dropZoneEnabled: true}});
						}
					}
					
					if(pattern){
						$(nTd).on("blur", function(event) {
							var data = $(nTd).html();
							data = data.split(" ").join("");
							if(data != null && data != ""){
								data = parseFloat(data).toFixed(2);
								if(pattern == "number"){
									data = data.toString().split( /(?=(?:\d{3})+(?:\.|$))/g ).join( " " );
								} else {
									var patt = pattern.split(",");
									var a = patt[0];
									var b = patt[1];
									data = data.toString().replace(new RegExp(a,"g"), b);
								}
								
								$(nTd).html(data);
							}
						});
					}
					
					if(name == "action") {
						//bind delete line action
						$(nTd).find(".a_delete").on("click", function() {
							var table = $(this).parents("table").DataTable();
							var row = table.row( $(this).parents('tr') )
							var canConfirm  = false;
							if(oData[primaryCol] != null && oData[primaryCol] != "") {
								canConfirm 	= true;
							}
							if(canConfirm) {
								App.MsgboxController.do_lc_show({
									title	: $.i18n("msgbox_confirm_title"),
									content : $.i18n("common_msg_del_confirm"),
									width	: window.innerWidth<1024?"95%":"40%",
									buttons	: {
										OK: {
											lab		: $.i18n("common_btn_ok"),
											funct	: function(){
												oData.mode = 3;
												row.remove().draw();
//												table.draw();
											},
										},
										NO: {
											lab		:  $.i18n("common_btn_cancel"),
										}
									}
								});	
							} else {
								row.remove().draw();
							}
						});
					}
					
					//add optional function
					if(options && options[name] && options[name].fnCreatedCell) {
						options[name].fnCreatedCell(nTd, sData, oData,iRow, iCol);
					}
				}
				
				if(options && options[name] && options[name].mRender) {
					config.mRender = options[name].mRender;
				} else {
					config.mRender = function(data, type, oData, position) {
						var dataFormat = th.data("format");
						var name		= th.data("name");
						if (data === null || data === undefined || data === ""){
							oData[name] = "";
							data = "";
						} else if(dataFormat){
							var pformat = "viShortDate";
							localStorage.language == "vi"? pformat = "vnShortDate": localStorage.language == "fr"? pformat = "frShortDate": pformat = "enShortDate"
							var parts = dataFormat.split(" ");
							if(parts.length == 2) {
								pformat = parts[1];
							}
							if(parts[0] == "date") {
								var date 		= req_gl_DateObj_From_DateStr(data	, DateFormat.masks.isoDateTime);
								data = value 	= req_gl_DateStr_From_DateObj(date	, DateFormat.masks[pformat]);
								
//								var date = luxon.DateTime.fromString(data, DateFormat.masks["isoDateTime"]);
//								data = value = date.toFormat(DateFormat.masks[pformat]);
							} else if(parts[0] == "double"){
								data = $.formatNumber(data, {format: parts[1], locale : localStorage.language})
							} else if(parts[0] == "date_time"){
								localStorage.language == "vi"? pformat = "vnFullDate": localStorage.language =="fr"? pformat = "frFullDate": pformat = "enFullDate"
								var date 		= req_gl_DateObj_From_DateStr(data	, DateFormat.masks.isoDateTime);
								data = value 	= req_gl_DateStr_From_DateObj(date	, DateFormat.masks[pformat]);
							}
						}
						return data;
					}
				}
				
				if(name == "action") {
					config.mRender = function(id) {  
						var res = '<div class="box-icon" style="text-align:center" data-right="'	+ right + '">'
							+'<a class="editable a_delete action-btn not-active" data-id="'+id+'" ><i class="fa fa-minus-circle"></i></a></div>';
						return res;
					};
				}
				
				colConfig.push(config);
			} else {
				return;
			}
		})
	}
	return colConfig;
}
function readFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}
var req_gl_create_datatable = function(data, tableId, colConf, default_new_line, success_callback, add_funct, taConf) {
	var table = $(tableId);
	
	
	if(table.length == 0) {
		console.log("ERROR: Table " + tableId + " is not found!");
		return undefined;
	}
	
	table.addClass("table-bordered table-striped");
	var colConfig = req_gl_table_col_config(table, data, colConf);
	
	var lang = localStorage.language;
	if (lang == null || lang == undefined) lang = "vi";	
	
	var filename = "www/js/lib/datatables/datatable_"+lang+".json";
	
	if (datatable_lang_config!=lang){
		datatable_lang_config= lang; 
		readFile(filename, function(text){
			datatable_lang_opt = JSON.parse(text);		    
		});
	} 	
		
//	else filename= null;
	
	var table_data 		= [];
	var table_data_grp  = table.data("group");
	var table_data_name = table.data("name");
	var table_right 	= table.data("right");
	if(table_data_grp && data[table_data_grp]) {
		table_data = data[table_data_grp][table_data_name];
	}else if(table_data_name && data[table_data_name]) {
		table_data = data[table_data_name];
	}else if (!table_data_name){
		table_data = data;
	}
	
	var table_editable = table.data("editable");
	if(table_editable == undefined) {
		table_editable = true;
	}
	
	$.each(table_data, function(i, e) {
		var tmp = $.extend(true, {}, default_new_line, e);
		$.extend(true, e, tmp);
	});
	var datatable_options = {
			"processing": true,
			data			: table_data,
			aoColumns		: colConfig,
			"fnDrawCallback": function() {
				if(success_callback) success_callback(tableId);
	        },
//			oLanguage		: {
//				sUrl		:  filename
//			},
			oLanguage		: datatable_lang_opt,
			
			sDom 			: SDOM_DATATABLE_DEFAULT
	};
	if (!datatable_options.oLanguage) datatable_options.oLanguage = {sUrl:  filename};
	
	
	if(table_editable) {
		datatable_options.sDom = SDOM_DATATABLE_CUSTOM;
		datatable_options.initComplete =  function( settings, json ) {			
			$(tableId + "_wrapper")	.find("#table-header-add")
									.html("<button id='btn_add' class='objData datatable_btn_add btn btn-flat btn-primary pull-right canEnabled' disabled='disabled'>"
										+ "<i class='fa fa-plus' aria-hidden='true'></i>"
										+ "</button>");
//			
//			$(tableId + "_wrapper")	.find("#table-bottom-add")
//									.append("<button id='btn_add_bottom' class='objData datatable_btn_add btn btn-flat btn-primary pull-right canEnabled' disabled='disabled'>"
//										+ "<i class='fa fa-plus' aria-hidden='true'></i>"
//										+ "</button>");
			
			//Add right to add btn
			$(tableId + "_wrapper").find(".datatable_btn_add").data(table_right);			
			$(tableId + "_wrapper").find(".datatable_btn_add").on("click", function() {
				if(add_funct) {
					add_funct(new_table);
				} else {
					var newData 	= $.extend(true, {}, default_new_line);
					var rownode 	= new_table.api().row.add(newData).draw().node();
//					var rownode 	= new_table.api().row.addByPos(newData,0).draw(false).node();
					
					do_gl_enable_edit($(rownode));
				}
			});
			
			do_gl_apply_right($(tableId + "_wrapper"));
			
			if(success_callback) {
				success_callback();
			}
		}
	}
	
	if (taConf)
		$.extend(true, datatable_options, taConf);  
	
	var new_table = table.dataTable(datatable_options);
	
	//neu dung: var new_table = table.DataTable(datatable_options); =>new_table.row.add(newData).draw(false).node(); (khong co api())
		setTimeout(function(){
			table.parent("div").css("overflow", "auto");
		}, 700);
	
	return new_table;
}
function do_gl_init_nonSort_column(div, listClass){
	for(var i=0;i<listClass.length; i++){
		$(div).find("th[class*='"+listClass[i]+"']").off("click");
		$(div).find("th[class*='"+listClass[i]+"']").removeClass("sorting");
	}
}
//---------------------------------------------------------------------------------------------------------------------
jQuery.fn.dataTableExt.oApi.fnReloadAjax = function ( oSettings, sNewSource, fnCallback, bStandingRedraw )
{
	// DataTables 1.10 compatibility - if 1.10 then `versionCheck` exists.
	// 1.10's API has ajax reloading built in, so we use those abilities
	// directly.
	if ( jQuery.fn.dataTable.versionCheck ) {
		var api = new jQuery.fn.dataTable.Api( oSettings );
		if ( sNewSource ) {
			api.ajax.url( sNewSource ).load( fnCallback, !bStandingRedraw );
		}
		else {
			api.ajax.reload( fnCallback, !bStandingRedraw );
		}
		return;
	}
	if ( sNewSource !== undefined && sNewSource !== null ) {
		oSettings.sAjaxSource = sNewSource;
	}
	// Server-side processing should just call fnDraw
	if ( oSettings.oFeatures.bServerSide ) {
		this.fnDraw();
		return;
	}
	this.oApi._fnProcessingDisplay( oSettings, true );
	var that = this;
	var iStart = oSettings._iDisplayStart;
	var aData = [];
	this.oApi._fnServerParams( oSettings, aData );
	oSettings.fnServerData.call( oSettings.oInstance, oSettings.sAjaxSource, aData, function(json) {
		/* Clear the old information from the table */
		that.oApi._fnClearTable( oSettings );
		/* Got the data - add it to the table */
		var aData =  (oSettings.sAjaxDataProp !== "") ?
			that.oApi._fnGetObjectDataFn( oSettings.sAjaxDataProp )( json ) : json;
		for ( var i=0 ; i<aData.length ; i++ )
		{
			that.oApi._fnAddData( oSettings, aData[i] );
		}
		oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
		that.fnDraw();
		if ( bStandingRedraw === true )
		{
			oSettings._iDisplayStart = iStart;
			that.oApi._fnCalculateEnd( oSettings );
			that.fnDraw( false );
		}
		that.oApi._fnProcessingDisplay( oSettings, false );
		/* Callback user function - for event handlers etc */
		if ( typeof fnCallback == 'function' && fnCallback !== null )
		{
			fnCallback( oSettings );
		}
	}, oSettings );
};


//-----WebContent/www/js/app/common/ctrl/DateTool.js------------------------------
/*
const req_gl_DateObj_From_DateStr		(dStr, strFormat)
const req_gl_DateStr_From_DateObj		(dObj, strFormat)
const req_gl_DateStr_From_DateStr		(dStr, strFormatSrc, strFormatDest)
const req_gl_DateStr_LocalFormatFull 	(strDate) //---str or date object
const req_gl_DateStr_LocalFormatShort 	(strDate) //---str or date object
const req_gl_DayDiff (dateFrom, dateTo = new Date())
const req_gl_DateAdd (date, interval, units) //--interval: y/d/m/h/n/s
const req_gl_Date_ISOShortStr 		(strShortDate, strLang) //---return obj date from string with format by local
const req_gl_Date_ISOLongStr  		(strLongDate , strLang)	//---return format yyyy-MM-dd HH:mm:ss
const req_gl_Date_From_ISOLongStr 	(strDate)
const req_gl_Date_From_ISOShortStr 	(strDate)
const req_gl_Date_CompareStr 		(strDate01, strDate02, strDateFormat)
const req_gl_Date_CompareObj 		(date01, date02)
const req_gl_Date_NbDayInMonth 		( year, month)
const req_gl_get_CurrentDateStr 	(strFormatDest) {
const req_gl_Week_From_DateObj 		(date)
const req_gl_Year_From_DateObj 		(date) 
const req_gl_MonthStr_From_DateObj 	(date)
 */
/*********************************************************************************/
/******************************FORMATAGE DES DATES********************************/
/*********************************************************************************/
//alert(dateFormat(new Date(),dateFormat.masks.frDate));
var DateFormat = function () {
	var	token = /d{1,4}|M{1,4}|yy(?:yy)?|([HhmsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
	timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
	timezoneClip = /[^-+\dA-Z]/g,
	pad = function (val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) val = "0" + val;
		return val;
	};
	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = DateFormat;
		if (date && date instanceof Date) {
			
		}else{
			// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
			if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
				mask = date;
				date = undefined;
			}
	
			// Passing date through Date applies Date.parse, if necessary
			// by default, date has format iso
			if(isNaN(date)){
				try{
					date = date.replace(/-/g, "/");				
					date = new Date(date);
				}catch(e){
					date = new Date();
				}
				//	date = date? date.replace(/-/g, "/")) : null;  
	            
	        }else{  
	            date = date ? new Date(date) : new Date();
	        }		
		}
		
		if (isNaN(date)) throw SyntaxError("invalid date");
		mask = String(dF.masks[mask] || mask || dF.masks["default"]);
		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}
		var	_ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				M = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				m = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
						flags = {
						d:    d,
						dd:   pad(d),
						ddd:  dF.i18n.dayNames[D],
						dddd: dF.i18n.dayNames[D + 7],
						M:    M + 1,
						MM:   pad(M + 1),
						MMM:  dF.i18n.monthNames[M],
						MMMM: dF.i18n.monthNames[M + 12],
						yy:   String(y).slice(2),
						yyyy: y,
						h:    H % 12 || 12,
						hh:   pad(H % 12 || 12),
						H:    H,
						HH:   pad(H),
						m:    m,
						mm:   pad(m),
						s:    s,
						ss:   pad(s),
						l:    pad(L, 3),
						L:    pad(L > 99 ? Math.round(L / 10) : L),
						t:    H < 12 ? "a"  : "p",
								tt:   H < 12 ? "am" : "pm",
										T:    H < 12 ? "A"  : "P",
												TT:   H < 12 ? "AM" : "PM",
														Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
																o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
																S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
				};
		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();
//Some common format strings
DateFormat.masks = {
		"default"		: 	"yyyy-MM-dd HH:mm:ss",
		
//		shortDate		:   "M/d/yy",
//		mediumDate		:   "MMM d, yyyy",
//		longDate		:   "MMM d, yyyy",
//		fullDate		:   "dddd, MMMM d, yyyy",
//		shortTime		:	"h:mm TT",
//		mediumTime		:   "h:mm:ss TT",
//		longTime		:   "h:mm:ss TT Z",
		
		isoDateTime             : "yyyy-MM-dd HH:mm:ss",
		isoDate                 : "yyyy-MM-dd",
		isoTime                 : "HH:mm:ss",
		
		isoUtcDateTime          : "UTC:yyyy-MM-dd HH:mm:ss'Z'",
		frFullDate              : "dd/MM/yyyy HH:mm:ss",
		frShortDate             : "dd/MM/yyyy",
		fr                      : "dd/MM/yyyy HH:mm:ss",
		frDate                  : "dd/MM/yyyy HH:mm",
		
		enFullDate              : "dd/MM/yyyy HH:mm:ss",
		enShortDate             : "dd/MM/yyyy",
		en                      : "dd/MM/yyyy HH:mm:ss",
		enDate                  : "d/M/yyyy HH:mm",
		
		viFullDate              : "dd/MM/yyyy HH:mm:ss",
		viShortDate             : "dd/MM/yyyy",
		vi                      : "dd/MM/yyyy HH:mm:ss",
		viDate                  : "dd/MM/yyyy HH:mm",
		vnFullDate              : "dd/MM/yyyy HH:mm:ss",
		vnShortDate             : "dd/MM/yyyy",
		vn                      : "dd/MM/yyyy HH:mm:ss",
		dbShortDate             : "yyyy-MM-dd",
		dbLongDate              : "yyyy-MM-dd HH:mm:ss",
		dbShortDateInverse      : "dd-MM-yyyy",
		
};
//Internationalization strings
DateFormat.i18n = {
		dayNames: [
			"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
			"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
			],
			monthNames: [
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
				"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
				]
};
//-----------------------------------------------------------------------------------------------
//Tim số ngày chênh lệch giữa 2 ngày
const req_gl_DayDiff = function (dateFrom, dateTo = new Date()) {
	let dateF 		= new Date(dateFrom);
	let dateT 		= new Date(dateTo);
	let diffTime 	= dateF - dateT;
	let diffDays 	= Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
	return diffDays;
}
//****Str to Date Obj******/
const req_gl_DateObj_From_DateStr = function (dStr, strFormat){
	if (!dStr) return null;
	dStr = dStr.trim();
	if (dStr.length<=0) return null;
	if (!strFormat)
		strFormat = DateFormat.masks.isoDateTime;
		
	var dObj = null;
	try{
		dObj = strToDate(dStr, strFormat);
	}catch(e){
		try{
			dObj = new Date(dStr);
		}catch(e){}
	}
	return dObj;
}
//****Date Obj to Str******/
const req_gl_DateStr_From_DateObj = function (dObj, strFormat){
	if (!dObj) return null;
	if (!strFormat)
		strFormat = DateFormat.masks.isoDateTime;
	
	return DateFormat(dObj, strFormat);	
}
//****Str to Str******/
const req_gl_DateStr_From_DateStr = function (dStr, strFormatSrc, strFormatDest){
	if (!dStr) return null;
	dStr = dStr.trim();
	if (dStr.length<=0) return null;
	var dObj = req_gl_DateObj_From_DateStr(dStr, strFormatSrc);
	if (!dObj) return null;
	
	if (!strFormatDest) 
		strFormatDest = DateFormat.masks.isoDateTime;
	
	return DateFormat(dObj, strFormatDest);
}
//------------------------------------------------
const req_gl_DateFormat_LocalFormat = function  (){
	var local = localStorage.language;
	if (!local) local = "en";
	var format = DateFormat.masks.enShortDate;
	if (local=="fr")
		format = DateFormat.masks.frShortDate;
	else if (local=="vn")
		format = DateFormat.masks.viShortDate;
	else if (local=="vi")
		format = DateFormat.masks.viShortDate;
	
	return format;
}
const req_gl_DateFormat_LocalShort = function  (){
	var local = localStorage.language;
	if (!local) local = "en";
	var format = DateFormat.masks.enShortDate;
	if (local=="fr")
		format = DateFormat.masks.frShortDate;
	else if (local=="vn")
		format = DateFormat.masks.viShortDate;
	else if (local=="vi")
		format = DateFormat.masks.viShortDate;
	
	return format;
}
const req_gl_DateFormat_LocalFull = function  (){
	var local 	= localStorage.language;
	if (!local) local = "en";
	var format 	= DateFormat.masks.enFullDate;
	if (local=="fr")
		format 	= DateFormat.masks.frFullDate;
	else if (local=="vn")
		format 	= DateFormat.masks.viFullDate;
	else if (local=="vi")
		format 	= DateFormat.masks.viFullDate;
	
	return format;
}
const req_gl_DateStr_LocalFormatFull = function  (strDate){
	try{
		if(strDate) {
			var local = localStorage.language;
			if (!local) local = "en";
			var format = DateFormat.masks.enFullDate;
			if (local=="fr")
				format = DateFormat.masks.frFullDate;
			else if (local=="vn")
				format = DateFormat.masks.viFullDate;
			else if (local=="vi")
				format = DateFormat.masks.viFullDate;
			
			return DateFormat(strDate, format);	
		} else {
			return strDate;
		}
	}catch(e){
		return strDate;
	}
}
const req_gl_DateStr_LocalFormatShort = function  (strDate){
	try{
		if(strDate) {
			var local = localStorage.language;
			if (!local) local = "en";
			var format = DateFormat.masks.enShortDate;
			if (local=="fr")
				format = DateFormat.masks.frShortDate;
			else if (local=="vn")
				format = DateFormat.masks.viShortDate;
			else if (local=="vi")
				format = DateFormat.masks.viShortDate;
			
			return DateFormat(strDate, format);	
		} else {
			return strDate;
		}
	}catch(e){
		return strDate;
	}
}
const req_gl_get_CurrentDateStr = function (strFormatDest) {
	const dateObj = new Date(Date.now())
	return req_gl_DateStr_From_DateObj(dateObj, strFormatDest)
}
const req_gl_Date_CompareObj = function (date01, date02){
	if (date01 && date02){		
		return date01.getTime() - date02.getTime();		
	}else if ((date01 && !date02) || (!date01 && date02)){
		return undefined;
	}
	return null;
}
//----return iso short str from a given strShortDate and lang
const req_gl_Date_ISOShortStr = function  (strShortDate, strLang){ //---return format yyyy-MM-dd
	return reqShortDateString(strShortDate, strLang);
}
const req_gl_Date_ISOLongStr = function  (strLongDate, strLang){//---return format yyyy-MM-dd HH:mm:ss
	return reqLongDateString(strLongDate, strLang);
}
const req_gl_Date_From_ISOLongStr = function (strDate){	
	return DateFormat(strDate, DateFormat.masks.dbLongDate)
}
const req_gl_Date_From_ISOShortStr = function (strDate){	
	return DateFormat(strDate, DateFormat.masks.dbShortDate)
}
const req_gl_Date_CompareStr = function (strDate01, strDate02, strDateFormat){
	return compareDate(strDate01, strDate02, strDateFormat);
}
const req_gl_Date_NbDayInMonth = function ( year, month){
	return new Date(year, month+1, 0).getDate();
}
//----private-----------------------------------------------------------
//----private-----------------------------------------------------------
//----private-----------------------------------------------------------
function strToDate (str, format){	
	  var normalized      	= str.replace(/[^a-zA-Z0-9]/g, '-');
	  var normalizedFormat	= format.replace(/[^a-zA-Z0-9]/g, '-');
	  var formatItems     	= normalizedFormat.split('-');
	  var dateItems       	= normalized.split('-');
	  var yearIndex   	  	= formatItems.indexOf("yyyy");
	  var monthIndex  	  	= formatItems.indexOf("MM");
	  var dayIndex   	  	= formatItems.indexOf("dd");
	 
	  var hourIndex       	= formatItems.indexOf("HH");
	  var minutesIndex    	= formatItems.indexOf("mm");
	  var secondsIndex  	= formatItems.indexOf("ss");
	  var today 	= new Date();
	  var year  	= yearIndex		> -1 ? dateItems[yearIndex]    : today.getFullYear();
	  var month 	= monthIndex	> -1	? dateItems[monthIndex]-1 : today.getMonth()-1;
	  var day   	= dayIndex		> -1 ? dateItems[dayIndex]     : today.getDate();
	  var hour    	= hourIndex		> -1 ? dateItems[hourIndex]    : today.getHours();
	  var minute  	= minutesIndex	> -1 ? dateItems[minutesIndex] : today.getMinutes();
	  var second  	= secondsIndex	> -1 ? dateItems[secondsIndex]? dateItems[secondsIndex]: '00' : today.getSeconds();
	  return new Date(year,month,day,hour,minute,second);
	  
	};
function reqShortDateString (shortDate, lang){
	if (!lang){
		lang = localStorage.language;		
	}
	if (lang == "fr"){
		return frShortDateToDBDate(shortDate);
	}else if (lang == "en"){
		return enShortDateToDBDate(shortDate);
	}else if (lang=="vi" || lang == "vn"){
		return frShortDateToDBDate(shortDate);
	}else if (lang =="iso"){
		return shortDate;
	}
}
function reqLongDateString  (shortDate, lang){
	if (!lang){
		lang = localStorage.language;		
	}
	
	if (lang == "fr"){
		return frLongDateToDBDate(shortDate);
	}else if (lang == "en"){
		return enLongDateToDBDate(shortDate);
	}else if (lang=="vi" || lang == "vn"){
		return frLongDateToDBDate(shortDate);
	}else if (lang =="iso"){
		return shortDate;
	}
}
function reqNbDayInMonth 	(month,year) {
	return new Date(year, month+1, 0).getDate();
}
function compareDate		(date1, date2, dateFormat){
	if (date1 && date2){
		var d1 = strToDate(date1,dateFormat);
		var d2 = strToDate(date2,dateFormat);
		return d1.getTime() - d2.getTime();		
	}else if ((date1 && !date2) || (!date1 && date2)){
		return undefined;
	}
	return null;
}
function getDateString		(dateInp, timeInp){
	var d = dateInp.val();	
	var t = timeInp.val();	
	try {
		d = frShortDateToDBDate(d);				
	}catch (e) {
		d = DateFormat(d, DateFormat.masks.dbShortDate);			
	}		
	if (d==null){
		dateInp.addClass("error"); return null;
	}
	if (t==null){
		timeInp.addClass("error"); return null;
	}
	return d + ' ' + t + ':00';
}
function getDateFormatStandardShort(date) { //yyyy-MM-dd
	var 	d 		= new Date(date || Date.now());
	var    	day 	= '' + d.getDate();
	var 	month 	= '' + (d.getMonth() + 1);
	var		year 	= d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return [year, month, day ].join('-');
}
function frShortDateToDBDate(date){// dd/MM/yyyy => yyyy-MM-dd
	date = date.slice(0, 10);
	if (date.length==10){
		var res = date.split("/");
		if (res.length==3){
			/*var d = parseInt(res[0]);
			var m = parseInt(res[1]);
			var y = parseInt(res[2]);*/
			return [res[2] , res[1], res[0] ].join('-');
		}
		return null;
	}	
}//:	"dd/mm/yyyy",
function frLongDateToDBDate	(date){// dd/MM/yyyy HH:mm:ss => yyyy-MM-dd HH:mm:ss
	var part = date.split(" ");
	if (part.length==2){
		var d1 = part[0];
		var d2 = part[1];
		var res = d1.split("/");
		if (res.length==3){			
			return [res[2] , res[1], res[0] ].join('-')+" "+d2;
		}	
		return null;
	}	
}
function enShortDateToDBDate(date){// MM/dd/yyyy => yyyy-MM-dd
	date = date.slice(0, 10);
	if (date.length==10){
		var res = date.split("/");
		if (res.length==3){			
			return [res[2] , res[0], res[1]].join('-');			
		}
		return null;
	}	
}//:	"dd/mm/yyyy",
function enLongDateToDBDate	(date){// dd/MM/yyyy HH:mm:ss => yyyy-MM-dd HH:mm:ss
	var part = date.split(" ");
	if (part.length==2){
		var d1 = part[0];
		var d2 = part[1];
		var res = d1.split("/");
		if (res.length==3){			
			return [res[2] , res[0], res[1] ].join('-')+" "+d2;
		}	
		return null;
	}	
}
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
const req_gl_Week_From_DateObj = function (date) {
	var myDate = new Date(date);
	var onejan = new Date(myDate.getFullYear(), 0, 1);
	return Math.ceil((((myDate - onejan) / 86400000) + onejan.getDay() + 1) / 7);    
}
const  req_gl_Year_From_DateObj = function (date) {
	var myDate = new Date(date);
	return myDate.getFullYear();
}
const  req_gl_MonthStr_From_DateObj = function (date){
	var myDate = new Date(date);
	var month = myDate.getMonth();
	return req_gl_MonthStr(month);
}
function req_gl_MonthStr(month){
	switch (month) {
	case 0:
	case "00":
		return $.i18n("common_date_january");
		break;
	case 1:
	case "01":
		return $.i18n("common_date_february");
		break;
	case 2:
	case "02":
		return $.i18n("common_date_march");	
		break;
	case 3:
	case "03":
		return $.i18n("common_date_april");
		break;
	case 4:
	case "04":
		return $.i18n("common_date_may");
		break;
	case 5:
	case "05":
		return $.i18n("common_date_june");
		break;
	case 6:
	case "06":
		return $.i18n("common_date_july");
		break;
	case 7:
	case "07":
		return $.i18n("common_date_august");
		break;
	case 8:
	case "08":
		return $.i18n("common_date_september");
		break;
	case 9:
	case "09":
		return $.i18n("common_date_october");
		break;
	case 10:
	case "10":
		return $.i18n("common_date_november");
		break;
	case 11:
	case "11":
		return $.i18n("common_date_december");
		break;
	}
}
const req_gl_DateAdd = function (date, interval, units) {
	if(!(date instanceof Date))
		return undefined;
	var ret = new Date(date); //don't change original date
	var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
	switch(String(interval).toLowerCase()) {
	case 'y' :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
	case 'm' :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
	case 'd' :  ret.setDate(ret.getDate() + units);  break;
	case 'h' :  ret.setTime(ret.getTime() + units*3600000);  break;
	case 'n' :  ret.setTime(ret.getTime() + units*60000);  break;
	case 's' :  ret.setTime(ret.getTime() + units*1000);  break;
	default  :  ret = undefined;  break;
	}
	return ret;
}


//-----WebContent/www/js/app/common/ctrl/PaginationTool.js------------------------------
const do_gl_init_pagination_opt = function (options) {
    var contentDiv    = options.divMain;
    var paginationDiv = $(options.divMain);
    var container     = $(options.divPagination);
    var url_api       = options.url_api;
    var url_header    = options.url_header;
    var refJson       = options.url_api_param;
    var pageSize      = options.pageSize;
    var pageRange     = options.pageRange;
    var callbackFunct = options.callback;
    var callbackParam = options.callbackParam;
    var tagDiv        = options.tagDiv;
    var showGoInput   = options.showGoInput;
    var showGoButton  = options.showGoButton;
    var options       = {
        pageSize          : pageSize == undefined ? 9 : pageSize,
        pageRange         : pageRange == undefined ? 1 : pageRange,
        dataSource        : url_api,
        totalNumberLocator: function (response) {
            return response[App['const'].RES_DATA].total;
        },
        ajax: {
            dataType   : 'json',
            contentType: 'application/json',
            type       : 'POST',
            headers    : url_header,
            data       : refJson, //JSON.stringify is realised in Pagination-custom.js
            url        : url_api,
//				beforeSend 	: function() {
//					container.prev().html($.i18n("common_loading_data"));
//				}
        },
        callback: callbackFunct,
        afterRender: function () {
            if (tagDiv) do_gl_load_top_Div(tagDiv, paginationDiv);
            else do_gl_load_top_Div(contentDiv, paginationDiv);
        },
        afterPaging: function () {
        	if (!container) return;
        	if (!container.pagination) return;
            var totalPage = container.pagination("getTotalPage");
            if (totalPage && $("li.paginationjs-ellipsis").length > 0) {
                var li      = "";
                var liTotal = JSON.stringify(totalPage) + "...";
                for (var i = 0; i < totalPage; i++) {
                    var index = i + 1;
                    li += '<li class="li_input_pagination" data-value="' + index + '">' + index + '</li>';
                }
                var divForm = '<div class="div_input_pagination">'
                    + '<input type="text" style="width:100%" value="' + liTotal + '"/> '
                    + '<ul style="display : grid;height : 150px;overflow-y :scroll;margin-top : 0!important;cursor:pointer">'
                    + li
                    + '</ul>'
                    + '</div>';
                $("li.paginationjs-ellipsis").removeClass("disabled");
                $("li.paginationjs-ellipsis").append(divForm);
                $("li.paginationjs-ellipsis").find(".div_input_pagination").hide();
                do_bind_event_ellipsis(paginationDiv, container);
            }
        }
    };
    try {
        container.pagination(options);
    } catch (e) {
        console.log(e);
    }
}
const do_gl_init_pagination = function (
    contentDiv, url_api, url_header, refJson, pageSize, pageRange, callbackFunct, tagDiv) {
//	refJson['pageSize'] 	= refJson["number"];
//	refJson['pageNumber'] 	= 1;
    var paginationDiv = $(contentDiv).find(".wygo-pagination");
    var container     = $(paginationDiv);
    var options = {
        pageSize  : pageSize == undefined ? 9 : pageSize,
        pageRange : pageRange == undefined ? 1 : pageRange,
        dataSource: url_api, 	//thay the url trong ajax
//			locator		: function() {
//				return App['const'].RES_DATA;
//			},
        totalNumberLocator: function (response) {
            return response[App['const'].RES_DATA].total;
        },
        ajax: {
            dataType    : 'json',
            contentType : 'application/json',
            type        : 'POST',
            headers     : url_header,
            data        : refJson,//JSON.stringify is realised in Pagination-custom.js
            url         : url_api,
            beforeSend  : function () {
                container.prev().html($.i18n("common_loading_data"));
            }
        },
        callback: callbackFunct,
        afterRender: function () {
            if (tagDiv) do_gl_load_top_Div(tagDiv, paginationDiv);
            else do_gl_load_top_Div(contentDiv, paginationDiv);
        },
        afterPaging: function () {
        	if (!container) return;
        	if (!container.pagination) return;
            var totalPage = container.pagination("getTotalPage");
            if (totalPage && $("li.paginationjs-ellipsis").length > 0) {
                var li      = "";
                var liTotal = JSON.stringify(totalPage) + "...";
                for (var i = 0; i < totalPage; i++) {
                    var index = i + 1;
                    li += '<li class="li_input_pagination" data-value="' + index + '">' + index + '</li>';
                }
                var divForm = '<div class="div_input_pagination">'
                    + '<input type="text" style="width:100%" value="' + liTotal + '"/> '
                    + '<ul style="display : grid;height : 150px;overflow-y :scroll;margin-top : 0!important;cursor:pointer">'
                    + li
                    + '</ul>'
                    + '</div>';
                $("li.paginationjs-ellipsis").removeClass("disabled");
                $("li.paginationjs-ellipsis").append(divForm);
                $("li.paginationjs-ellipsis").find(".div_input_pagination").hide();
                do_bind_event_ellipsis(paginationDiv, container);
            }
        }
    };
    try {
        container.pagination(options);
    } catch (e) {
        console.log(e);
    }
}
const do_gl_init_pagination_noAjax = function (contentDiv, pageSize, pageRange, callbackFunct, tagDiv, data, total) {
    var paginationDiv = $(contentDiv).find(".wygo-pagination");
    var container     = $(paginationDiv);
    var options = {
        pageSize   : pageSize == undefined ? 9 : pageSize,
        pageRange  : pageRange == undefined ? 1 : pageRange,
        dataSource : data,
        totalNumber: total,
        callback: callbackFunct,
        afterRender: function () {
            if (tagDiv) do_gl_load_top_Div(tagDiv, paginationDiv);
            else do_gl_load_top_Div(contentDiv, paginationDiv);
        }
    };
    try {
        container.pagination(options);
    } catch (e) {
        console.log(e);
    }
}
//custom pagination with no data response from ajax
const do_gl_init_pagination_noResData = function (
    contentDiv, url_api, url_header, refJson, pageSize, pageRange, callbackFunct, tagDiv, data, total) {
    var paginationDiv = $(contentDiv).find(".wygo-pagination");
    var container     = $(paginationDiv);
    var options = {
        pageSize   : pageSize == undefined ? 9 : pageSize,
        pageRange  : pageRange == undefined ? 1 : pageRange,
        dataSource : data,
        locator    : '',
        totalNumber: total,
        isNoAjax: true,
        ajax    : {
            dataType    : 'json',
            contentType : 'application/json',
            type        : 'POST',
            headers     : url_header,
            data        : refJson,//JSON.stringify is realised in Pagination-custom.js
            url         : url_api,
            beforeSend  : function () {
                container.prev().html($.i18n("common_loading_data"));
            }
        },
        callback: callbackFunct,
        afterRender: function () {
            if (tagDiv) do_gl_load_top_Div(tagDiv, paginationDiv);
            else do_gl_load_top_Div(contentDiv, paginationDiv);
        }
    };
    try {
        container.pagination(options);
    } catch (e) {
        console.log(e);
    }
}
function do_gl_load_top_Div(topDiv, paginationDiv) {
    var str1 = App.data.currentUrl;
    var str2 = topDiv;
    paginationDiv.find(".paginationjs-page.J-paginationjs-page").each(function () {
        $(this).on("click", function () {
            var urlToLaunch = str1.indexOf(str2) != -1 ? str1 : str1 + str2;
            window.open(urlToLaunch, '_self');
        });
    });
}
function do_bind_event_ellipsis(paginationDiv, container) {
    $("li.paginationjs-ellipsis").removeClass("disabled");
    $("li.paginationjs-ellipsis a").on("click", function () {
//		$(this).parent().find(".div_input_pagination").show();
        $(this).parent().find(".div_input_pagination").toggle();
    });
    $("li.paginationjs-ellipsis input").on('keypress', function (e) {
        if (e.which == 13) {
            var val = e.target.value;
            if (val) container.pagination("go", val);
        }
    });
    $(".div_input_pagination li").on("click", function () {
        var val = $(this).text();
        if (val) container.pagination("go", val);
    });
}


//-----WebContent/www/js/app/common/ctrl/InputTool.js------------------------------
/**
 * InputTool
 * v1.1 13/11/2017 add function do_gl_enable_edit
 * v1.2 16/11/2017 add function do_gl_autocomplete
 * v1.3 19/11/2017 add function do_enable_edit and do_disable_edit
 * v1.4 28/11/2017 DataResult.req_sendable_data now can put data as attribut of ref
 * v1.4 01/04/2017 add function	do_gl_set_input_autocomplete
 */
/*
data-skip-if-hidden
data-group
data-gindex
data-name
  data-oldvalue
data-validation: required, double, numeric, number,date_time, date
data-primary
data-visible												
data-editable
data-file_input
data-rel
	
*/
/**
 * data result class
 * @param hasError
 * @param data
 * @param formData
 * @returns
 */
function DataResult(hasError, data, formData) {
	this.hasError = hasError;
	if (hasError) {
		this.data = data;
	} else {
		if (data.inpFiles) {
			this.inpFiles = data.inpFiles;
			data.inpFiles = undefined;
		}
		this.data = data;
	}
	this.formData = formData;
	//helper function to have a data which can be sent to server
	this.req_sendable_data = function (ref, objKey) {
		if (!ref) {
			ref = {};
		}
		var sendData = $.extend(true, {}, ref);
		if (objKey) {
			sendData[objKey] = JSON.stringify(this.data);
		} else {
			for (var key in this.data) {
				var value = this.data[key];
				if ($.isPlainObject(value) || $.isArray(value)) {
					sendData[key] = JSON.stringify(value);
				} else {
					sendData[key] = value;
				}
			}
		}
		return sendData;
	}
	this.req_sendable_form_data = function (ref) {
		var sendFormData = $.extend(true, {}, this.formData);
		for (var key in ref) {
			var value = ref[key];
			sendFormData.append(key, JSON.stringify(ref[k]));
		}
		return sendFormData;
	}
	this.do_lc_send_data = function (url, header, ref, fSuccess, fError, objName) {
		var that = this;
		var fileInpCount = 0;
		var fileInpTotal = 0;
		var do_send_ajax = function () {
			var sendableData = that.req_sendable_data(ref, objName);
			App.network.do_lc_ajax(url, header, sendableData, 100000, fSuccess, fError);
		}
		var upFileCallback = function () {
			fileInpCount++;
			if (fileInpCount >= fileInpTotal) {
				do_send_ajax();
			}
		}
		if (this.inpFiles) {
			fileInpTotal = this.inpFiles.length;
			$.each(this.inpFiles, function (i, e) {
				e.do_lc_upload_file(upFileCallback, that.data);
			});
		} else {
			do_send_ajax();
		}
	}
}
var DataType = new function () {
	this.dataType = {};
	this.errMsg = {};
	this.dataType.numeric 			= {};
	this.dataType.alphanumeric 		= {};
	this.dataType.email 			= {};
	this.dataType.double 			= {};
	this.dataType.alphabetic 		= {};
	this.dataType.alphabetic_utf8 	= {};
	this.dataType.alphanumeric_utf8 = {};
	this.dataType.date 				= {};
	this.dataType.date_time			= {};
	this.dataType.json 				= {};
	this.dataType.numeric.pattern 			= /^-?[0-9]*$/;
	this.dataType.alphanumeric.pattern 		= /^[a-zA-Z0-9]*$/;
	this.dataType.email.pattern 			= /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	this.dataType.double.pattern 			= /^-?\d{0,22}((?:\.|\,)\d{0,15}){0,1}$/;
	this.dataType.alphabetic.pattern 		= /^[a-zA-Z]*$/;
	this.dataType.alphabetic_utf8.pattern 	= /^[a-zA-ZâêôûÄéÆÇàèÊÉÀùÌÍÎÏÐîÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿấầăẩẫậ]*$/;
	this.dataType.alphanumeric_utf8.pattern = /^[a-zA-Z0-9âêôûÄéÆÇàèÊÉÀùÌÍÎÏÐîÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]*$/;
	this.dataType.date.pattern_frShortDate	= /^[0-3]{1}[0-9]{1}\/[0-1]{1}[0-9]{1}\/[0-9]{4}/;
	this.dataType.date.pattern_enShortDate	= /^[0-3]{1}[0-9]{1}\/[0-1]{1}[0-9]{1}\/[0-9]{4}/;
	this.dataType.date.pattern_viShortDate	= /^[0-3]{1}[0-9]{1}\/[0-1]{1}[0-9]{1}\/[0-9]{4}/;
	this.dataType.date.pattern_date_time_iso= /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/;
	this.dataType.date.pattern_date_iso		= /^[0-9]{4}-[0-9]{2}-[0-9]{2}/;
	
	this.errMsg.length = {};
	this.errMsg.required = "validator_err_required";
	this.errMsg.length.lt = "validator_err_length_lt";
	this.errMsg.length.le = "validator_err_length_le";
	this.errMsg.length.gt = "validator_err_length_gt";
	this.errMsg.length.ge = "validator_err_length_ge";
	this.errMsg.length.eq = "validator_err_length_eq";
	this.errMsg.except 		= "validator_err_except";
	this.dataType.numeric.errMsg 		= "validator_err_numeric";
	this.dataType.alphanumeric.errMsg 	= "validator_err_alphanumeric";
	this.dataType.email.errMsg 			= "validator_err_email";
	this.dataType.double.errMsg 		= "validator_err_double";
	this.dataType.alphabetic.errMsg 	= "validator_err_alphabetic";
	this.dataType.alphabetic_utf8.errMsg = "validator_err_alphabetic_utf8";
	this.dataType.alphanumeric_utf8.errMsg = "validator_err_alphanumeric_utf8";
	this.dataType.date.errMsg = "validator_err_date";
	this.dataType.json.errMsg = "validator_err_date";
	this.match = function (value, type, format) {
		if (type == "date" && format) {
			if (value.match(this.dataType[type]["pattern_" + format]) != null) {
				return true;
			} else {
				return false;
			}
		}
		if (type == "json") {
			try {
				JSON.parse(value);
				return true;
			} catch (e) {
				return false;
			}
		}
		if ((this.dataType[type] != undefined) && (value.split(" ").join("").match(this.dataType[type].pattern) == null)) {
			return false;
		} else {
			return true;
		}
	}
	this.req_lc_err_msg = function (type1, type2, type3) {
		var msg = this[type1];
		if (type2) {
			msg = msg[type2];
		}
		if (type3) {
			msg = msg[type3];
		}
		return $.i18n(msg);
	}
}
function DataValidator() {
	this.req_lc_validate_required = function (value) {
		if (value == "" || value == null || value == undefined) {
			return true;
		} else {
			return false;
		}
	}
	this.req_lc_compare = function (value, compare, type, elt, trData) {
		var parts = compare.split(" ");
		if (parts.length >= 2) {
			var operation = parts[0];
			var error = false;
			var valToCompare1 = null;
			var valToCompare2 = null;
			valToCompare1 = parts[1];
			valToCompare1 = req_lc_convert_compare_value(valToCompare1, type, value, trData);
			if (parts.length > 2) valToCompare2 = parts[2];
			if (valToCompare2) valToCompare2 = req_lc_convert_compare_value(valToCompare2, type, value, trData);
			if (type == "date") {
				try {
					if (elt.is("input")) {
						value = do_lc_get_Date(elt, value);
					}
					value = new Date(value).getTime();
					valToCompare1 = new Date(valToCompare1).getTime();
					if (valToCompare2) valToCompare2 = new Date(valToCompare2).getTime();
				} catch (e) {
					console.log("--err parsing date--");
					return true;
				}
			}
			error = !req_compare(operation, value, valToCompare1, valToCompare2);
			return error;
		}
		return false;
	}
	this.req_lc_validate_type = function (value, type, accept, except, dataFormat) {
		var result = false;
		if (accept) {
			//Accepted character (the values that can be in the data value) -> remove them before type check
			if (accept.length > 0) {
				var len = accept.length;
				for (var i = 0; i < len; i++) {
					var index = value.indexOf(accept[i]);
					while (index >= 0) {
						value = req_gl_replace_char_at(value, index, '');
						index = value.indexOf(accept[i]);
					}
				}
			}
		}
		//check the data type
		if (type == "double" || type == "numeric") {
			var tmpValue = value;
			var dVal = 'NaN';
			if (dataFormat) {
				dataFormat = dataFormat.trim();
				var parts = dataFormat.split(" ");
				if (parts.length == 2) {
					var pformat = parts[1];
					dVal = '' + $.parseNumber(value, { format: pformat, locale: localStorage.language, strict: true }).valueOf();
				}
			} else {
				dVal = '';
			}
			if (DataType.match(value, type) == false || dVal == 'NaN') {
				result = true;
			}
		} else if (type == "date") {
			var date = null;
			var lang = localStorage.language;
			if (lang == null) lang = "vi";
			var pformat = "";
			if (lang == "fr") {
				pformat = "frShortDate";
			} else if (lang == "en") {
				pformat = "enShortDate";
			} else if (lang == "vi" || lang == "vn") {
				pformat = "viShortDate";
			}
			if (dataFormat) {
				dataFormat = dataFormat.trim();
				var parts = dataFormat.split(" ");
//				pformat = parts[0];
				if (parts.length == 2) {
					pformat = parts[1];
				}
			}
			if (DataType.match(value, type, pformat)) {
				date = req_gl_date_value(value, pformat);
			}
			if (date == null) {
				result = true;
			}
		} else if (DataType.match(value, type) == false) {
			result = true;
		}
		if (result == false && except) {
			if (except.length > 0) {
				var len = except.length;
				var contain = false;
				for (var i = 0; i < len; i++) {
					if (value.indexOf(except[i]) >= 0) {
						contain = true;
					}
				}
				if (contain) {
					result = true;
				}
			}
		}
		return result;
	}
	this.req_lc_validate_length = function (value, dataLength) {
		var lstVal = dataLength.split(" ");
		if (lstVal.length >= 2) {
			var type = lstVal[0];
			var cp = parseInt(lstVal[1]);
			var cp2 = undefined;
			if (lstVal[2]) {
				cp2 = parseInt(lstVal[2]);
			}
			var len = value.length;
			var errMsgLength = "";
			var ok = req_compare(1, type, len, cp, cp2);
			if (ok == false) {
				return true;
			}
		}
	}
	this.do_lc_remove_error_msg = function (dataElt, errMsgAttr) {
		var dataEltErr = errMsgAttr.place;
		if (dataElt.attr("data-rel") == "chosen" && !errMsgAttr.isOther == true) {
			//select with data-rel=chosen must add message to the parent elt
			dataEltErr = dataElt.parent();
		}
		if (dataEltErr.nextAll('.' + errMsgAttr.style_class[0]).length > 0) {
			dataEltErr.nextAll('.' + errMsgAttr.style_class[0]).remove();
		}
	}
	this.do_lc_add_error_msg = function (dataElt, errMsgAttr, errorMsg) {
		var dataEltErr = errMsgAttr.place;
		//create the error message element
		var errMsgElt = document.createElement("div");
		$.each(errMsgAttr.style_class, function (i, e) {
			$(errMsgElt).addClass(e);
		})
		$(errMsgElt).html(errorMsg);
		if (dataElt.is(":hidden") && !errMsgAttr.isOther == true) {
			//the element is hidden and the error msg pos is not another place
			// -> do not show the message
			return;
		}
		if (dataElt.attr("data-rel") == "chosen" && !errMsgAttr.isOther == true) {
			//select with data-rel=chosen must add message to the parent elt
			dataEltErr = dataElt.parent();
		}
		if (dataEltErr.nextAll('.' + errMsgAttr.style_class[0]).length > 0) {
			dataEltErr.nextAll('.' + errMsgAttr.style_class[0]).remove();
		}
		dataEltErr.after(errMsgElt);
	}
	var req_lc_convert_compare_value = function (valToCompare, type, value, trData) {
		if (type == "date") {
			if ($(valToCompare).length > 0) {
				if ($(valToCompare).is("td")) {
					if ($(valToCompare).html() == undefined || $(valToCompare).html() == "" || $(valToCompare).html() == null)
						return true;
				} else {
					if ($(valToCompare).val() == undefined || $(valToCompare).val() == "" || $(valToCompare).val() == null)
						return true;
				}
				if ($(valToCompare).is("input")) {
					var elt = $(valToCompare);
					valToCompare = $(valToCompare).val();
					valToCompare = do_lc_get_Date(elt, valToCompare);
				} else {
					valToCompare = trData[valToCompare];
				}
			} else if (trData.hasOwnProperty(valToCompare)) {
				valToCompare = trData[valToCompare];
			} else {
				valToCompare = value;
			}
		} else if (type == "double" || type == "numeric") {
			if ($(valToCompare).length > 0) {
				if ($(valToCompare).is("td")) {
					valToCompare = $(valToCompare).html();
				} else {
					valToCompare = $(valToCompare).val();
				}
			} else if (trData.hasOwnProperty(valToCompare)) {
				valToCompare = trData[valToCompare];
			} else {
				valToCompare = valToCompare.replace(",", ".");
				valToCompare = valToCompare.replace(" ", "");
			}
			valToCompare = parseFloat(valToCompare);
		} else {
			if ($(valToCompare).length > 0) {
				if ($(valToCompare).is("td")) {
					valToCompare = $(valToCompare).html();
				} else {
					valToCompare = $(valToCompare).val();
				}
			} else {
				if (trData.hasOwnProperty(valToCompare)) valToCompare = trData[valToCompare];
			}
			//			valToCompare = parseInt(valToCompare);
		}
		return valToCompare;
	}
	var req_compare = function (operator, value, valToCompare1, valToCompare2) {
		switch (operator) {
			case "lt":
			case "before":
			case "<":
				if (value < valToCompare1) {
					return true;
				}
				break;
			case "le":
			case "<=":
				if (value <= valToCompare1) {
					return true;
				}
				break;
			case "gt":
			case "after":
			case ">":
				if (value > valToCompare1) {
					return true;
				}
				break;
			case "ge":
			case ">=":
				if (value >= valToCompare1) {
					return true;
				}
				break;
			case "eq":
			case "=":
				if (value == valToCompare1) {
					return true;
				}
				break;
			case "range":
				if (value >= valToCompare1 && value <= valToCompare2) {
					return true;
				}
				break;
		}
		return false;
	}
}
var req_gl_validate = function (params) {
	var dataElt = params.dataElt;
	var showErrMsg = params.showError;
	var forcedRequired = params.forcedRequired;
	var forcedValue = params.forcedValue;
	var trData = params.dataRow;
	if (showErrMsg == undefined) {
		showErrMsg = true;
	}
	var value = dataElt.val();
	if (dataElt.is("td")) {
		value = dataElt.html();
	}
	if (forcedValue != undefined) {
		value = forcedValue;
	}
	value = value + "";
	var errorMsg = undefined;
	var validation = dataElt.attr("data-validation");
	var dataLength = dataElt.attr("data-length");
	var except = dataElt.attr("data-except");
	var accept = dataElt.attr("data-accept");
	var errorMsgRaw = dataElt.attr("data-msg");
	var dataFormat = dataElt.attr("data-format");
	var msgPosAttr = dataElt.attr("data-msgPosition");
	var errMsgClass = dataElt.attr("data-msgClass");
	var compare = dataElt.attr("data-compare");
	validator = new DataValidator();
	//by default the error message will appear after the dataElt
	var errMsgAttr = {
		pos: "after",
		place: dataElt,
		style_class: ["errMsg"]
	}
	if (msgPosAttr) {
		var inpDivParts = msgPosAttr.split(' ');
		if (inpDivParts.length == 2) {
			errMsgAttr.pos = inpDivParts[0];
			errMsgAttr.place = $(inpDivParts[1]);
			errMsgAttr.isOther = true;
		}
	}
	if (errorMsgRaw) {
		if (errorMsgRaw == 'none') {
			showErrMsg = false;
		} else {
			errorMsg = {};
			msgPart = errorMsgRaw.split(";");
			msgPart.forEach(function (e, i) {
				msg = e.split(':');
				errorMsg[msg[0]] = msg[1];
			});
		}
	} else {
		errorMsg = undefined;
	}
	var isRequired = false;
	var valid = 0;
	if (errMsgClass) {
		errMsgAttr.style_class.push(errMsgClass);
	}
	var hasError = false;
	var errMsg = "";
	if (forcedRequired) {
		if (!validation) {
			validation = "";
		}
		validation += " required";
	}
	if (validation) {
		validation = validation.trim();
		validation = validation.replace(/  +/g, ' ');
		var rIndex = validation.indexOf("required");
		var lstType = validation.split(" ");
		if (rIndex >= 0) {
			isRequired = true;
			ri = 0;
			lstType.some(function (e, i) {
				if (e == "required") {
					ri = i;
					return true;
				}
			});
			lstType.splice(ri, 1);
		}
		if (isRequired) {
			hasError = validator.req_lc_validate_required(value);
			if (hasError) {
				if (errorMsg && errorMsg.required) {
					errMsg = $.i18n(errorMsg.required);
				} else {
					errMsg = DataType.req_lc_err_msg("errMsg", "required");
				}
			}
		} else {
			if (value == "" || value == null || value == undefined) {
				//nodata and not require, remove error and return true
				validator.do_lc_remove_error_msg(dataElt, errMsgAttr);
				return false;
			}
		}
		if (!hasError && lstType.length > 0) {
			hasError = lstType.some(function (e, i) {
				var err = validator.req_lc_validate_type(value, e, accept, except, dataFormat);
				if (err == true) {
					//type error
					if (errorMsg && errorMsg[e]) {
						errMsg = $.i18n(errorMsg[e]);
					} else {
						errMsg = DataType.req_lc_err_msg("dataType", e, "errMsg");
					}
					return true;
				}
			});
		}
	}
	if (!hasError && dataLength) {	//length of the value
		hasError = validator.req_lc_validate_length(value, dataLength);
		if (hasError) {
			var lstVal = dataLength.split(" ");
			if (lstVal.length == 2) {
				var type = lstVal[0];
				var cp = parseInt(lstVal[1]);
				if (errorMsg && errorMsg["length"]) {
					errMsg = $.i18n(errorMsg["length"]);
				} else {
					errMsg = DataType.req_lc_err_msg("errMsg", "length", type);
				}
				errMsg = sprintf(errMsg, cp)
			}
		}
	}
	if (!hasError && compare) {
		validation = validation.trim();
		validation = validation.replace(/  +/g, ' ');
		var rIndex = validation.indexOf("required");
		var lstType = validation.split(" ");
		if (rIndex >= 0) {
			isRequired = true;
			ri = 0;
			lstType.some(function (e, i) {
				if (e == "required") {
					ri = i;
					return true;
				}
			});
			lstType.splice(ri, 1);
		}
		hasError = validator.req_lc_compare(value, compare, lstType[0], dataElt, trData);
		if (hasError) {
			if (errorMsg && errorMsg.compare) {
				errMsg = $.i18n(errorMsg.compare);
			} else {
				errMsg = DataType.req_lc_err_msg("errMsg", "compare");
			}
		}
	}
	if (hasError) {
		//add error class to the data element
		if (showErrMsg) {
			if (!dataElt.hasClass("inp-error")) {
				dataElt.addClass("inp-error");
			}
		}
		if (!dataElt.hasClass("has-error")) {
			dataElt.addClass("has-error");
		}
		if (showErrMsg) {
			validator.do_lc_add_error_msg(dataElt, errMsgAttr, errMsg);
		}
		return true;
	} else {
		//remove error class from the dataElt
		if (dataElt.hasClass("has-error")) {
			dataElt.removeClass("has-error");
		}
		if (dataElt.hasClass("inp-error")) {
			dataElt.removeClass("inp-error");
		}
		validator.do_lc_remove_error_msg(dataElt, errMsgAttr);
		return false;
	}
	return false;
}
var req_gl_data = function (option) {
	if (!option) {
		return { error: "option is required" };
	} else {
		var dataZoneDom = option.dataZoneDom;
		var dataSelector = option.dataSelector;
		var showError = option.showError;
		var exclSelector = option.exclSelector;
		var wfStep = option.wfStep;
		var skipError = option.skipError;
		var removeWhenNull = option.removeWhenNull;
		var oldObject = option.oldObject;
		var extObject = option.extObject;
		var removeDeleted = option.removeDeleted;
		if (!dataZoneDom) {
			return { error: "dataZoneDom is required" };
		}
		if (!dataSelector) {
			dataSelector = ".objData";
		}
		if (showError == undefined) {
			showError = true;
		}
		if (skipError == undefined) {
			skipError = false;
		}
		var result = {};
		var formData = new FormData();
		var lstDataElt = dataZoneDom.find(dataSelector);
		var hasError = false;
		var errorEltList = [];
		lstDataElt.each(function (e, i) {
			//----check the first condition to skip----------------
			var skip = $(this).data("skip-if-hidden");
			if ($(this).is(":hidden") && skip) {
				return true;
			};
			//----------------------------------------------------
			var isTd = false;
			if ($(this).is("td")) {
				isTd = true;
			}
			if (exclSelector) {
				if ($(this).parents(exclSelector).length > 0) {
					return;
				}
				if ($(this).hasClass(exclSelector.substring(1))) {
					return;
				}
			}
			if (skipError) {
				//do not validate the value
			} else {
				if (req_gl_validate({ dataElt: $(this), showError: showError }) == true) {
					hasError = true;
					errorEltList.push($(this));
				} else if (wfStep) {
					var reqV = $(this).attr("wf_req_v");
					if (reqV) {
						if (reqV.indexOf(wfStep) >= 0) {
							if (req_gl_validate({ dataElt: $(this), showError: showError, forcedRequired: true }) == true) {
								hasError = true;
								errorEltList.push($(this));
							}
						}
					}
				}
			}
			if (!hasError) {
				var typ = $(this).attr("type");
				var group = $(this).data("group");
				var groupIndex = $(this).data("gindex");
				var key = $(this).data("name");
				var value = $(this).val();
				var oldValue = $(this).data("oldvalue");
				if (isTd) {
					value = $(this).html(); // add by tran quang chien
				}
				if (value == oldValue) {
					//has no changes
					value = undefined;
				} else {
					if ($(this).is("table")) {
						var self_table = $(this);
						if ($(this).hasClass("dataTable")) {
							var table = $(this).DataTable();
							if (table) {
								tableData = table.data();
								value = [];
								var primaryCol = $(this).data("primary");
								if (tableData) {
									//check td validity
									var lstTh = $(this).find("th");
									var mapTh = {};
									lstTh.each(function (e1, i1) {
										var thName = $(this).data("name");
										if (thName) {
											mapTh[thName] = $(this);
										}
									});
									$.each(tableData, function (ind, trData) {
										var cells = table.cells(ind, table.columns()[0]);
										cells.every(function () {
											var node = $(this.node());
											var cellName = node.data("name");
											var cellGroup = node.data("group");
											var celGrpIndex = node.data("gindex");
											var canOverride = false;
											var th = mapTh[cellName];
											if (mapTh[cellName] && cellName != "action") {
												var visible = th.data("visible");
												var editable = th.data("editable");
												var excluded = th.hasClass("excl");
												if (visible != "false" || editable != "none") {
													if (!excluded) {
														canOverride = true;
													}
												}
											}
											if (canOverride) {
												var cellHtml = node.html();
												if (cellHtml)
													cellHtml = cellHtml.trim();
												var validation = th.data("validation");
												if (cellHtml.length > 0 && validation) {
													if (validation.indexOf("alphanumeric") >= 0){
														
													}else if (validation.indexOf("double") >= 0 || validation.indexOf("number") >= 0 || validation.indexOf("numeric") >= 0) {
														cellHtml = cellHtml.split(" ").join("");
														cellHtml = do_lc_get_Number(th, cellHtml);
													} else if (validation.indexOf("date_time") >= 0) {
														cellHtml = do_lc_get_DateTime($(this), cellHtml);
													} else if (validation.indexOf("date") >= 0) {
														cellHtml = do_lc_get_Date($(this), cellHtml);
													}
												}
												if (cellGroup) {
													if (celGrpIndex !== undefined && celGrpIndex !== "") {
														if (!trData[cellGroup]) {
															trData[cellGroup] = [];
														}
														if (!trData[cellGroup][celGrpIndex]) {
															trData[cellGroup][celGrpIndex] = {};
														}
														trData[cellGroup][celGrpIndex][cellName] = cellHtml;
													} else {
														if (!trData[cellGroup]) {
															trData[cellGroup] = {};
														}
														trData[cellGroup][cellName] = cellHtml;
													}
													if (trData.id == null || trData.id <= 0) {
														trData.mode = 1;
													} else if (trData.mode != 3) {
														trData.mode = 2;
													}
												} else {
													if (trData[cellName] != cellHtml) {
														if (trData.id == null || trData.id <= 0) {
															trData.mode = 1;
														} else if (trData.mode != 3) {
															trData.mode = 2;
														}
													}
													trData[cellName] = cellHtml;
												}
											}
										});
										for (var key in trData) {
											if (trData.hasOwnProperty(key)) {
												var val = trData[key];
												var th = mapTh[key];
												if (th && trData.mode != 3) {
													if (req_gl_validate({ dataElt: th, showError: false, forcedValue: val, dataRow: trData }) == true) {
														hasError = true;
														table.rows(ind).nodes().to$().css("outline", "thin solid red");
														var div = self_table.closest(".tab-pane");
														if (div.length > 0) {
															var id = div.attr("id");
															var a = div.parent().parent().find("a[href='#" + id + "']");
															if (a.length > 0) {
																var li = a.parent();
																if (li.length > 0 && !li.hasClass("inp-error")) li.addClass("inp-error");
															}
														}
													}
												}
											}
										}
										if (hasError) return true;
										//----------filter empty line
										if (trData[primaryCol] == null || trData[primaryCol] == undefined) {
											return true;
										}
										if (typeof trData[primaryCol] === 'string' && trData[primaryCol] == "") {
											return true;
										}
										if (removeDeleted) {
											if (trData.mode == 3)
												return true;
										}
										for (var k in trData) {
											if (trData[k] && typeof trData[k] == "string") {
												trData[k] = trData[k].split("&nbsp;").join("").trim();
											}
										}
										value.push(trData);
									});
								}
							}
						}
					}
					var validation = $(this).attr("data-validation"); //this in input or table....
					if (validation && value != "" && !skipError) {
						if (validation.indexOf("alphanumeric") >= 0){
							
						}else if (validation.indexOf("double") >= 0 || validation.indexOf("number") >= 0 || validation.indexOf("numeric") >= 0) {
							value = do_lc_get_Number($(this), value);
						} else if (validation.indexOf("date_time") >= 0) {
							value = do_lc_get_DateTime($(this), value);
						} else if (validation.indexOf("date") >= 0) {
							value = do_lc_get_Date($(this), value);
						}
					}
					if (typ == "checkbox") {
						if ($(this).is(':checked')) {
							value = 1;
						} else {
							value = 0;
						}
					} else if (typ == "file") {
						//get file value from input type file
						var fileInput = $(this).data("file_input");
						if (fileInput) {
							//							if($(this)[0].files.length > 0) {
							if (!result.inpFiles) {
								result.inpFiles = [];
							}
							result.inpFiles.push(fileInput);
							//							}
						}
						value = [];
					}
				}
				if (removeWhenNull == true && value == '') {
					//to avoid problem of passing parameters in URL
				} else {
					if (group) {
						if (groupIndex !== undefined && groupIndex !== "") {
							if (!result[group]) {
								result[group] = [];
							}
							if (!result[group][groupIndex]) {
								result[group][groupIndex] = {};
							}
							if (key) result[group][groupIndex][key] = value;
							else result[group][groupIndex] = value;
						} else {
							if (!result[group]) {
								result[group] = {};
							}
							result[group][key] = value;
						}
					} else {
						result[key] = value;
					}
				}
			}
		});
		if ($.isEmptyObject(result) || hasError) {
			var data_result = new DataResult(true, errorEltList, undefined);
			return data_result;
		} else {
			if (oldObject) {
				result = $.extend(true, oldObject, result);
			}
			
			if (extObject){
				for (var k in extObject){
					if (!result[k]){
						result[k]= extObject[k];
					} else if (Array.isArray(extObject[k]) &&  Array.isArray(result[k])){
						result[k] = result[k].concat(extObject[k]);
					}
				}
			}
			
			var data_result = new DataResult(hasError, result, formData);
			return data_result;
		}
	}
};
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
function do_lc_get_Number(ele, value) {
	var dataFormat = ele.attr("data-format");
	var dataValidation = ele.attr("data-validation");
	if (dataFormat) {
		dataFormat = dataFormat.trim();
		var parts = dataFormat.split(" ");
		if (parts.length == 2) {
			var pformat = parts[1];
			value = $.parseNumber(value, { format: pformat, locale: localStorage.language });
			value = value.valueOf();
		}
	} else {
		/**
		 * Replace , to . for double type
		 */
		if (typeof value == "number") {
		} else {
			var i = value.indexOf(',');
			if (i > 0) {
				value = req_gl_replace_char_at(value, i, '.');
			}
			i = value.indexOf(' ');
			if (i > 0) {
				value = req_gl_replace_char_at(value, i, '');
			}
			if (value) {
				try {
					if (validation.indexOf("alphanumeric") >= 0){
						
					}else if (dataValidation.indexOf("double") >= 0 || dataValidation.indexOf("number") >= 0) {
						value = parseFloat(value);
					} else if (dataValidation.indexOf("numeric") >= 0) {
						value = parseInt(value, 10);
					}
				} catch (e) {
				}
			}
		}
	}
	return value;
}
function do_lc_get_Date(ele, value) {
	var dataFormat = ele.attr("data-format");
	var lang = localStorage.language;
	if (lang == null) lang = "vi";
	var pformat = "";
	if (lang == "fr") {
		pformat = "frShortDate";
	} else if (lang == "en") {
		pformat = "enShortDate";
	} else if (lang == "vi" || lang == "vn") {
		pformat = "viShortDate";
	}
	if (dataFormat) {
		dataFormat = dataFormat.trim();
		var parts = dataFormat.split(" ");
		if (parts.length == 2) {
			var pformat = parts[1];
		}
	}
	var date = req_gl_date_value(value, pformat);
	if (date != null) {
		//		return date.toFormat(DateFormat.masks.isoDateTime);
		return req_gl_DateStr_From_DateObj(date, DateFormat.masks.isoDateTime);
	}
	return null;
}
function do_lc_get_DateTime(ele, value) {
	var dataFormat = ele.attr("data-format");
	var lang = localStorage.language;
	if (lang == null) lang = "vi";
	var pformat = "";
	if (lang == "fr") {
		pformat = "frFullDate";
	} else if (lang == "en") {
		pformat = "enFullDate";
	} else if (lang == "vi" || lang == "vn") {
		pformat = "viFullDate";
	}
	if (dataFormat) {
		dataFormat = dataFormat.trim();
		var parts = dataFormat.split(" ");
		if (parts.length == 2) {
			var pformat = parts[1];
		}
	}
	var date = req_gl_date_value(value, pformat);
	if (date != null) {
		//		return date.toFormat(DateFormat.masks.isoDateTime);
		return req_gl_DateStr_From_DateObj(date, DateFormat.masks.isoDateTime);
	}
	return null;
}
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
var req_gl_date_value = function (value, pformat) {
	//return DateFormat(value, DateFormat.masks[pformat])
	//return luxon.DateTime.fromString(value, DateFormat.masks[pformat]);	
	return req_gl_DateObj_From_DateStr(value, DateFormat.masks[pformat]);
}
function do_gl_add_validation_event(options) {
	var zone = options.dataZone;
	var event = "blur";
	var showError = true;
	if (options.event) {
		event = options.event;
	}
	if (options.showError) {
		showError = options.showError;
	}
	var lstDataElt = zone.find(".objData");
	lstDataElt.each(function (e, i) {
		if ($(this).hasClass('datepicker')) {
			$(this).on("change", function () {
				req_gl_validate({ dataElt: $(this), showError: showError });
			});
		} else if ($(this).hasClass('datetimepicker')) {
			$(this).on("change", function () {
				req_gl_validate({ dataElt: $(this), showError: showError });
			});
		} else if ($(this).attr("data-rel") == "chosen") {
			$(this).on("change", function () {
				req_gl_validate({ dataElt: $(this), showError: showError });
			});
		} else {
			$(this).on(event, function () {
				req_gl_validate({ dataElt: $(this), showError: showError });
			});
		}
	});
}
var req_gl_replace_char_at = function (str, index, replace_with) {
	from = index;
	to = from + 1;
	str = str.substr(0, from) + replace_with + str.substr(to, str.length - to);
	return str;
}
const do_gl_select_value = function (selectId, optionValue, domEle) {
	if (domEle) {
		domEle.find(selectId).val(optionValue).change();
	} else {
		$(selectId).val(optionValue).change();
	}
};
/**
 * Disable editing of all objData and action-btn in a Div
 * @param jquery DOM
 */
const do_gl_disable_edit = function (div, dataSelector) {
	if (dataSelector === undefined) {
		dataSelector = ".objData";
	}
	var lstElt = null;
	if (dataSelector.indexOf("#") >= 0)
		lstElt = div.find(dataSelector);
	else
		lstElt = div.find(dataSelector + ", .action-btn" + ", .editable");
	if (div.is(dataSelector)) {
		$.merge(lstElt, div);
	}
	lstElt.each(function (i, e) {
		var elt = $(this);
		if (elt.is("td")) {
			elt.removeAttr("contenteditable");
		} else if (elt.hasClass("action-btn")) {
			elt.addClass("not-active");
		} else {
			elt.attr("disabled", true);
			if (elt.is("a"))
				elt.off('click')
		}
		if (elt.data("rel") == "chosen") {
			elt.trigger("liszt:updated");
		}
		if (elt.hasClass("fileinput")) {
			if (elt.fileinput) {
				elt.fileinput("disable");
			}
		}
		if (elt.attr("id") === "inp_descr") {
            if (elt.summernote) {
            elt.summernote('disable');
        }
    }
	});
}
/**
 * Enable editing of all objData and action-btn in a Div
 * @param jquery DOM
 */
const do_gl_enable_edit = function (div, dataSelector, curMode) {
	if (dataSelector === undefined) {
		dataSelector = ".objData";
	}
	var lstElt = null;
	if (dataSelector.indexOf("#") >= 0)
		lstElt = div.find(dataSelector);
	else
		lstElt = div.find(dataSelector + ", .action-btn" + ", .editable");
	if (div.is(dataSelector)) {
		$.merge(lstElt, div);
	}
	lstElt.each(function (e, i) {
		var elt = $(this);
		//Skip input hidden
		if (elt.is("input") && elt.attr("type") == "hidden") {
			return true;
		}
		//Skip table header
		if (elt.is("th")) {
			return true;
		}
		//Skip unmodifiable 
		if (elt.hasClass("unmodifiable") || elt.parents(".unmodifiable").length > 0) {
			do_gl_disable_edit(elt, dataSelector);
			return true;
		}
		if (elt.is("td")) {
			elt.attr("contenteditable", "true");
		} else if (elt.hasClass("action-btn")) {
			elt.removeClass("not-active");
		} else {
			elt.removeAttr("disabled");
		}
		if (elt.data("rel") == "chosen") {
			elt.trigger("liszt:updated");
		}
		if (elt.hasClass("fileinput")) {
			if (elt.fileinput) {
				elt.fileinput("enable");
			}
		}
		var unableedit_mode = $(this).data('disable');
		if (unableedit_mode) {
			if (unableedit_mode == curMode) {
				do_gl_disable_edit($(this), dataSelector);
			}
		}
	});
}
var req_gl_double_value = function (val, format) {
	var result = 0;
	if (!format) {
		format = "#,###.##";
	}
	try {
		result = $.parseNumber("" + val, { format: format, locale: localStorage.language }).valueOf();
	} catch (e) {
		console.log("---- err when parseNumber of : " + val)
	}
	return result;
}
//--------------------------------------------------------------------------------------------
const do_gl_input_autocomplete_dyn = function (div, options, oData) {
	do_gl_set_input_autocomplete(div, options, oData)
}
const do_gl_input_autocomplete = function (div, options, oData) {
	options.el = $(div);
	do_gl_autocomplete(options);
}
//--------------------------------------------------------------------------------------------
const do_gl_autocomplete = function (options) {
	var defaultOptions = {
		placeholder		: $.i18n("common_placeholder_autocomplete"),
		displayAttrLst	: undefined,
		renderAttrLst	: undefined,
		dataZone		: undefined,
		source			: undefined,
		autoFocus		: true,
		selectCallback	: undefined,
		focusCallback	: undefined,
		changeCallback	: undefined,
		customRender	: undefined,
		minLength		: 0,
		required		: false,
		autoSearch		: true,
		autoSelect		: false,
		delay			: 900,
	}
	var autoCompleteOpts = $.extend(true, {}, defaultOptions, options);
	if (!autoCompleteOpts.el) {
		console.log("AutoComplete's option el is required");
		return;
	}
	if (!autoCompleteOpts.renderAttrLst) {
		console.log("AutoComplete's option renderAttrLst is not set, default value is 'name'");
		autoCompleteOpts.renderAttrLst = ["name"];
	}
	var el 				= autoCompleteOpts.el;
	var placeholder 	= autoCompleteOpts.placeholder;
	var displayAttrLst 	= autoCompleteOpts.displayAttrLst;
	var renderAttrLst 	= autoCompleteOpts.renderAttrLst;
	var dataZone 		= autoCompleteOpts.dataZone;
	var source 			= autoCompleteOpts.source;
	var autoFocus 		= autoCompleteOpts.autoFocus;
	var customRender 	= autoCompleteOpts.customRender;
	var minLength 		= autoCompleteOpts.minLength;
	var required 		= autoCompleteOpts.required;
	var autoSearch 		= autoCompleteOpts.autoSearch;
	var autoSelect 		= autoCompleteOpts.autoSelect
	var selected 		= false;
	var displayLine 	= autoCompleteOpts.displayLine;
	var selectCallback 	= autoCompleteOpts.selectCallback;
	var focusCallback 	= autoCompleteOpts.focusCallback;
	var changeCallback 	= autoCompleteOpts.changeCallback;
	
	var source_funct 	= source;
	var arr_source 		= [];
	
	if (!$.isFunction(source)) {
		arr_source = source;
		source_funct = function (request, response) {
			var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
			var arr_filtered = [];
			$.each(arr_source, function (i, e) {
				if (e) {
					var attr = renderAttrLst[0];
					if (matcher.test(e[attr])) {
						arr_filtered.push(e);
					}
					if (displayLine) {
						if (arr_filtered.length == displayLine)
							return false;
					}
				}
			});
			response(arr_filtered);
		}
	}
	$(el).attr("placeholder", placeholder);
	el.autocomplete({
		source: source_funct,
		autoFocus: autoFocus,
		minLength: minLength,
		selectFirst: true,
		open: function (event, ui) {
			if (selected) {
				selected = false;
			}
		},
		select: function (event, ui) {
			selected = true;
			if (dataZone) {
				for (var key in ui.item) {
					if (ui.item.hasOwnProperty(key)) {
						var dz = dataZone.find("[data-name='" + key + "']");
						if (dataZone.is("tr")) {
							dz = dataZone.find("." + key);
						}
						var value = ui.item[key];
						if (dz.is("input")) {
							dz.val(value);
						} else {
							dz.html(value);
						}
					}
				}
			}
			if (el.is("input")) {
				if (displayAttrLst) {
					el.val(ui.item[displayAttrLst[0]]);
				} else {
					el.val(ui.item[renderAttrLst[0]]);
				}
			} else {
				if (displayAttrLst) {
					el.html(ui.item[displayAttrLst[0]]);
				} else {
					el.html(ui.item[renderAttrLst[0]]);
				}
			}
			el.blur();
			if (selectCallback) {
				selectCallback(ui.item);
			}
			return false;
		},
		focus: function (event, ui) {
			if (focusCallback) {
				focusCallback(event, ui);
			}
			return false;
		},
		change: function (event, ui) {
			if (changeCallback) {
				changeCallback(event, ui);
			}
			return false;
		}
	}).autocomplete("instance")._renderItem = function (ul, item) {
		var selOpt = "<div>";
		$.each(renderAttrLst, function (i, e) {
			selOpt += " " + item[e];
		});
		selOpt += "</div>";
		return $("<li>").append(selOpt).appendTo(ul);
	};
	if (autoSearch == true) {
		el.on("focus", function () {
			$(this).autocomplete("search", $(this).html());
		});
	}
	/* Neu required thi chon value dau tien trong list, cai nay khong dung
	if(required) {
		el.blur(function(){
			if(!selected){
				var ac_ul = el.autocomplete( "widget" );
				var ac_li = ac_ul.find("li");
				if(ac_li.length > 0) {
					$(ac_li[0]).trigger('click');
				} else {
					el.html("");
				}
				selected = false;
			}
			return true;
		}); 
	}
	 */
	//	if(autoSelect) {
	//	var ac_ul = el.autocomplete( "widget" );
	//	var ac_li = ac_ul.find("li");
	//	if(ac_li.length > 0) {
	//	$(ac_li[0]).trigger('click');
	//	} else {
	//	el.html("");
	//	}		
	//	}
}
const do_gl_autocomplete_new = function (options) {
	var defaultOptions = {
		placeholder		: $.i18n("common_placeholder_autocomplete"),
		displayAttrLst	: undefined,
		renderAttrLst	: undefined,
		dataZone		: undefined,
		source			: undefined,
		autoFocus		: true,
		selectCallback	: undefined,
		focusCallback	: undefined,
		customRender	: undefined,
		minLength		: 0,
		required		: false,
		autoSearch		: true,
		autoSelect		: false,
		delay			: 600,
	}
	var autoCompleteOpts = $.extend(true, {}, defaultOptions, options);
	if (!autoCompleteOpts.el) {
		console.log("AutoComplete's option el is required");
		return;
	}
	if (!autoCompleteOpts.renderAttrLst) {
		console.log("AutoComplete's option renderAttrLst is not set, default value is 'name'");
		autoCompleteOpts.renderAttrLst = ["name"];
	}
	var el 				= autoCompleteOpts.el;
	var placeholder 	= autoCompleteOpts.placeholder;
	var displayAttrLst 	= autoCompleteOpts.displayAttrLst;
	var renderAttrLst 	= autoCompleteOpts.renderAttrLst;
	var dataZone 		= autoCompleteOpts.dataZone;
	var source 			= autoCompleteOpts.source;
	var autoFocus 		= autoCompleteOpts.autoFocus;
	var selectCallback 	= autoCompleteOpts.selectCallback;
	var focusCallback 	= autoCompleteOpts.focusCallback;
	var customRender 	= autoCompleteOpts.customRender;
	var minLength 		= autoCompleteOpts.minLength;
	var required 		= autoCompleteOpts.required;
	var autoSearch 		= autoCompleteOpts.autoSearch;
	var autoSelect 		= autoCompleteOpts.autoSelect
	var selected 		= false;
	var displayLine 	= autoCompleteOpts.displayLine;
	var appendTo 		= autoCompleteOpts.appendTo;
	var source_funct 	= source;
	var arr_source 		= [];
	
	if (!$.isFunction(source)) {
		arr_source = source;
		source_funct = function (request, response) {
			var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
			var arr_filtered = [];
			$.each(arr_source, function (i, e) {
				if (e) {
					var attr = renderAttrLst[0];
					if (matcher.test(e[attr])) {
						arr_filtered.push(e);
					}
					if (displayLine) {
						if (arr_filtered.length == displayLine)
							return false;
					}
				}
			});
			response(arr_filtered);
		}
	}
	$(el).attr("placeholder", placeholder);
	el.autocomplete({
		source: source_funct,
		autoFocus: autoFocus,
		minLength: minLength,
		appendTo: appendTo,
		selectFirst: true,
		open: function (event, ui) {
			if (selected) {
				selected = false;
			}
		},
		select: function (event, ui) {
			selected = true;
			if (dataZone) {
				for (var key in ui.item) {
					if (ui.item.hasOwnProperty(key)) {
						var dz = dataZone.find("[data-name-zone='" + key + "']");
						if (dataZone.is("tr")) {
							dz = dataZone.find("." + key);
						}
						var value = ui.item[key];
						if (dz.is("input")) {
							dz.val(value);
						} else {
							dz.html(value);
						}
					}
				}
			}
			if (el.is("input")) {
				if (displayAttrLst) {
					el.val(ui.item[displayAttrLst[0]]);
				} else {
					el.val(ui.item[renderAttrLst[0]]);
				}
			} else {
				if (displayAttrLst) {
					el.html(ui.item[displayAttrLst[0]]);
				} else {
					el.html(ui.item[renderAttrLst[0]]);
				}
			}
			el.blur();
			if (selectCallback) {
				selectCallback(ui.item);
			}
			return false;
		},
		focus: function (event, ui) {
			if (focusCallback) {
				focusCallback(event, ui);
			}
			return false;
		},
		change: function (event, ui) {
		}
	}).autocomplete("instance")._renderItem = function (ul, item) {
		var selOpt = "<div>";
		$.each(renderAttrLst, function (i, e) {
			selOpt += " " + item[e];
		});
		selOpt += "</div>";
		return $("<li>").append(selOpt).appendTo(ul);
	};
	if (autoSearch == true) {
		el.on("focus", function () {
			$(this).autocomplete("search", $(this).html());
		});
	}
}
const do_gl_set_input_autocomplete = function (div, options, oData) {
	var urlApi			= options.apiUrl;			//apiUrl
	var functSource 	= options.sourceFunct;		//source array for choose 
	var arrSource 		= options.source;			//source array for choose 
	var dataSel 		= options.dataSel;			//push value of item on other input if autocomplete input
	var dataTab 		= options.dataTab;			//push value of item on data row of datatable
	var succesCallback 	= options.succesCallback;	//if after select item, we have function callback
	var callbackParams 	= options.callbackParams;	//array of param for callback
	var dataService 	= options.dataService;		//service for send request
	var dataReq 		= options.dataReq;			// attribute accompagne for send request
	var dataRes 		= options.dataRes;			//bind attribute for list reponse
	var oldLst 			= options.oldLst;			//filtre the same item
	var dz 				= options.dataZone;			//bind value when click the item
	var placeholder 	= options.placeholder;		//Set custom placeholder on input
	var autoS 			= options.autoSearch;		//Set input or td autoSearch or no.
	var length 			= options.minLength;		//Set input or td autoSearch or no.
	var required 		= options.required;			//Set input or td autoSearch or no.
	var canAdd 			= options.canAdd;			//Can add new entity or no.
	var addRight 		= options.addRight;			//Can add new entity or no.
	var addCallback 	= options.addCallback;		//Can add new entity or no.
	var autoSel 		= options.autoSelect;
	
	var selCallback 	= options.selectCallback;
	var fsCallback 		= options.focusCallback;
	var chCallback		= options.changeCallback;
	
	if (required == null) required = true;
	if (length == null) length = 0;
	if (autoS == null) autoS = true;
	var obj = dz && $(dz).is("td") ? $(div).parent() : $(dz);
	do_gl_autocomplete({
		el: $(div),
		required: required,
		source: function (request, response) {
			//			if (functSource){
			//			functSource.apply(null, [request, response]);
			//			return;
			//			}
			if (arrSource) {
				if (typeof (arrSource) == "function") {
					arrSource(oData, function (list) {
						if (oldLst) list = do_delete_element_duplicate(oldLst, list);
						if (canAdd) {
							options.data = arrSource;
							do_gl_req_list(request, response, list, addRight, dataRes);
						} else {
							response($.ui.autocomplete.filter(list, request.term));
						}
					})
				} else {
					if (oldLst) arrSource = do_delete_element_duplicate(oldLst, arrSource);
					if (canAdd) {
						options.data = arrSource;
						do_gl_req_list(request, response, arrSource, addRight, dataRes);
					} else {
						response($.ui.autocomplete.filter(arrSource, request.term));
					}
				}
			} else {
				do_search_article(request, response, options, div, oData);
			}
		},
		selectCallback: function (item) {
			var result = true;
			if (canAdd) result = do_gl_select_row_default(item, addCallback.fadd, addCallback.fPa);
			if (!result) return false;
			if (dataSel && !$.isEmptyObject(dataSel)) {
				for (var key in dataSel) {
					if ($(key).is("input")) {
						$(key).val(item[dataSel[key]]);
					} else if ($(key).is("td")) {
						$(key).html(item[dataSel[key]]);
					}
				}
			}
			if (oData) {
				if (dataTab && !$.isEmptyObject(dataTab)) {
					for (var key in dataTab) {
						oData[key] = item[dataTab[key]];
					}
				}
			}
			if (succesCallback) {
				if (callbackParams) {
					var param = [item].concat(callbackParams);
					succesCallback.apply(null, param);
				} else
					succesCallback(item);
			}
			
			if (selCallback){
				selCallback (item);
			}
			return false;
		},
		focusCallback: function (event, ui) {
			if (fsCallback) {
				fsCallback(event, ui);
			}
			return false;
		},
		changeCallback: function (event, ui) {
			if (chCallback) {
				chCallback(event, ui);
			}
			return false;
		},
		placeholder: placeholder,
		displayAttrLst: ["displ"],
		renderAttrLst: ["label"],
		minLength: length,
		autoSearch: autoS,
		dataZone: obj,
		autoSelect: autoSel
	})
}
var do_search_article = function (request, response, options, div, oData) {
	var dataService = options.dataService;//service for send request
	var dataReq = options.dataReq;// attribute accompagne for send request
	if (dataService.length == 0) return;
	var ref = req_gl_Request_Content_Send(dataService[0], dataService[1]);
	ref.searchkey = request.term;
	if (typeof (options.autoSearch) == "boolean" && options.autoSearch == false && request.term.trim() == "") return false;
	if (dataReq && !$.isEmptyObject(dataReq)) {
		for (var key in dataReq) {
			ref[key] = dataReq[key];
		}
	}
	var fSucces = [];
	fSucces.push(req_gl_funct(null, do_search_article_response, [request, response, options, div, oData]));
	var fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
	
	var urlApi = options.apiUrl		?options.apiUrl		:App.path.BASE_URL_API_PRIV;
	var urlSec = req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL); 
	
	if (options.apiHeader) urlSec = options.apiHeader;
	if (options.apiUrl==App.path.BASE_URL_API_PUBL) urlSec=null;
	
	App.network.do_lc_ajax_background(urlApi, urlSec, ref, 100000, fSucces, fError);
}
const getBoldString 	= (text, searchInput) => {
	let 	str 		= text.toLowerCase();
	let 	query 		= searchInput.toLowerCase();
	let 	queryLoc 	= str.indexOf(query);
	let 	result 		= "";
	
	if (queryLoc === -1) {
		result += '<b>' +text+ '</b>';
	} else {
		do {
			result += ` ${text.substr(0, queryLoc)}<b>${text.substr(queryLoc, query.length)}</b>`;
			str 	= str.substr(queryLoc + query.length, str.length);
			text 	= text.substr(queryLoc + query.length, str.length);
			queryLoc = str.indexOf(query);
		} while (text.length > 0 && queryLoc !== -1);
		result += text;
	}
	return result;
};
var do_search_article_response = function (sharedJson, request, response, options, div, oData) {
	if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
		var data = sharedJson[App['const'].RES_DATA];
		var dataRes = options.dataRes;
		var oldLst = options.oldLst;
		var canAdd = options.canAdd;
		var addRight = options.addRight;
		if (oldLst) data = do_delete_element_duplicate(oldLst, data);
		$.each(data, function (i, o) {
			var label = "";
			if (o[dataRes[0]]){
				if (request.term){
					label = getBoldString(o[dataRes[0]], request.term);
				}else{
					label = '<b>' + o[dataRes[0]] + '</b>';
				}
			}
				
			for (var i = 1; i < dataRes.length; i++) {
				if (o[dataRes[i]])
					label = label + ' ' + o[dataRes[i]];
			}
			o.label = label;
			if (o[dataRes[0]] != null && o[dataRes[0]] != "") {
				o.displ = o[dataRes[0]];
			} else if (dataRes.length > 1 && o[dataRes[1]] != null && o[dataRes[1]] != "") {
				o.displ = o[dataRes[1]];
			}
			//			if(o[dataRes[1]] != null && o[dataRes[1]] != ""){
			//				o.displ 	= o[dataRes[1]];
			//			} else {
			//				o.displ 	= o[dataRes[0]];
			//			}
		})
		if (canAdd) {
			do_gl_req_list(request, response, data, addRight, dataRes);
		} else {
			response(data);
		}
	}
}
function do_gl_req_list(request, response, list, addRight, opShows) {
	var lst = [];
	lst = list;
	var attr01 = opShows[0];
	var attr02 = opShows[1];
	var lstS = $.ui.autocomplete.filter(lst, request.term);
	if (App.data.user.rights.includes(parseInt(addRight, 10))) {
		var item = { [attr01]: "-------------------------------------", [attr02]: "", action: "" };
		item.label = item[attr01];
		lstS.unshift(item);
		item = { [attr01]: "<div class='item-custom'><i class='fa fa-plus'></i> " + $.i18n("common_add_entity_autocomplete") + "</div>", [attr02]: "", action: "add" };
		item.label = item[attr01];
		lstS.unshift(item);
		if (lstS.length == 2) {
			var item = { [attr01]: $.i18n("common_empty_entity_autocomplete"), [attr02]: "", action: "msg" };
			item.label = item[attr01];
			lstS.push(item);
		}
	} else {
		if (lstS.length == 0) {
			var item = { [attr01]: $.i18n("common_empty_entity_autocomplete"), [attr02]: "", action: "msg" };
			item.label = item[attr01];
			lstS.push(item);
		}
	}
	response(lstS);
}
function do_gl_select_row_default(item, callback, params) {
	if (item.action == "add") {
		callback.apply(this, params);
		return false;
	} else if (item.action == "msg") {
		return false;
	}
	return true;
}
function do_delete_element_duplicate(oldLst, newList) {
	var nameId = (oldLst.length == 1) ? "id" : oldLst[1];
	var list = oldLst[0];
	$.each(list, function (i, o) {
		for (var j = newList.length - 1; j >= 0; j--) {
			if (o[nameId] == newList[j].id) {
				newList.splice(j, 1);
			}
		}
	})
	return newList;
}
var replaceHtmlEntites = (function (str) {
	var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
	var translate = {
		"nbsp": " ",
		"amp": "&",
		"quot": "\"",
		"lt": "<",
		"gt": ">"
	};
	return function (str) {
		return (str.replace(translate_re,
			function (match, entity) {
				return translate[entity];
			}));
	}
})();
const do_gl_reqRandom_number = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const do_gl_req_autocompleteNew = function (div, options) {
	let el = $(div);
	
	
	let { 	svParams  		,
			hintSvParams	,
			dataSrc			, 
			customShowList	,
			autoFocus 		= false, 
			selectFirst 	= true, 
			appendTo		, 
			fSelect			, 
			minLength 		= 1} = options;
	
	var serviceClass 		= null;
	var serviceName 		= null;
	if (options.dataService){
		serviceClass 		= options.dataService[0];
		serviceName 		= options.dataService[1];
	}
	var hintSvClass 		= null;
	var hintSvName 			= null;
	if (options.hintService){
		hintSvClass 		= options.hintService[0];
		hintSvName 			= options.hintService[1];
	}
	var do_getLst_article = function (request, response) {
		var sKey = request.term.trim();
		let ref = null;
		
		if (!sKey){
			if (hintSvClass && hintSvName) 
				ref = req_gl_Request_Content_Send(hintSvClass, hintSvName);
			else 
				return;
			
			if (hintSvParams) $.extend( true, ref, hintSvParams);
		}else{
			if (serviceClass && serviceName) 
				ref = req_gl_Request_Content_Send(serviceClass, serviceName);
			else 
				return;
			
			if (svParams) $.extend( true, ref, svParams);
		}
		ref.searchkey = sKey;
		
		let fSucces = [];
		fSucces.push(req_gl_funct(null, do_req_article_response, [request, response]));
		let fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
		
		var urlApi = options.apiUrl		?options.apiUrl		:App.path.BASE_URL_API_PRIV;
		var urlSec = req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL); 
		
		if (options.apiHeader) urlSec = options.apiHeader;
		if (options.apiUrl==App.path.BASE_URL_API_PUBL) urlSec=null;
		
		App.network.do_lc_ajax_background(urlApi, urlSec, ref, 100000, fSucces, fError);
	}
	var do_req_article_response = function (sharedJson, request, response) {
		if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
			let data = sharedJson[App['const'].RES_DATA];
			if (!data.length) data.push({ "noData": false });
			response(data);
		}
	}
	el.autocomplete({
		source		: function (request, response) {
			if (!dataSrc) {
				do_getLst_article(request, response);
				return;
			}
			
			if (typeof (dataSrc) == "array") {
				response($.ui.autocomplete.filter(arrSource, request.term));
			} else {
				do_getLst_article(request, response);
			}
		},
		autoFocus	: autoFocus,
		minLength	: minLength,
		selectFirst	: selectFirst,
		appendTo	: appendTo,
		select		: function (event, ui) {
			let item = ui.item;
			if (item.noData === false) return false;
			fSelect(event, item);
			return false;
		},
		messages	: {
			noResults: '',
			results: function (count) {
				return '';
			}
		},
	}).focus(function(){     
        //Use the below line instead of triggering keydown
        $(this).data("uiAutocomplete").search(" ");//--trim after
    })
	.autocomplete("instance")
	._renderItem = function (ul, item) {
		let selOpt = "<div>";
		if (item.noData === false) {
			selOpt += " No Result ";
		} else {
			if (customShowList) selOpt += customShowList(item);
		}
		selOpt += `</div>`;
		return $("<li>").append(selOpt).appendTo(ul);
	};
}


//-----WebContent/www/js/app/common/ctrl/FileInputTool.js------------------------------
//do_gl_init_fileinputPlugin(parentNode, options) 
FileInput = function(selector, options, obj) {
//	var FileInput = function(selector, options, obj) {
	if (!App.CameraController){
		var CameraController = require('common/ctrl/CameraController');
		App.CameraController  = new CameraController();
	}
	if (!App.FileURLController){
		var FileURLController = require('common/ctrl/FileURLController');
		App.FileURLController = new FileURLController();
	}
	var supportedFileType = ['image', 'html', 'text', 'video', 'audio', 'flash', 'object'];
	var defaultOption = {
			language				: App.language,
			showClose				: false,
			showCapture				: can_gl_iOSDevices()?false:true,
			showFileURL				: true,
			maxFileSize				: 1024*1024*512, //512MB
			allowedFileTypes		: ['image', 'html', 'text', 'video', 'audio', 'flash', 'object', 'jasper', 'jrxml'],
			allowedFileExtensions	: ['jpg', 'png', 'txt', 'pdf', 'jasper', 'jrxml', 'webm', 'mp4', 'doc', 'xls','docx', 'xlsx'],
			allowedPreviewTypes		: ['image', 'html', 'text', 'video', 'audio', 'flash', 'object', 'jasper', 'jrxml', 'pdf', 'doc', 'xls'],
			uploadUrl				:  App.path.BASE_URL_API_UPLOAD,
			ajaxSettings			: {
				headers :  			{
					Authorization: "Bearer " + App.data.user.headerURLSecu
					//--multipart request: cannot use req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL)
				}
			},
			uploadExtraData 		: {
				sv_class 			: "ServiceTpyDocument",
				sv_name 			: "SVNew",
				typ01 				: 1,
				typ02 				: 10
			},
			uploadAsync 			: false,
			overwriteInitial		: false,
			deleteUrl				: App.path.BASE_URL_API_PRIV,
			ajaxDeleteSettings		: {
				headers 			: req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL)
			},
			deleteExtraData 		: {
				sv_class 			: "ServiceTpyDocument",
				sv_name 			: "SVDel"
			},
			layoutTemplates: {
//						actionDrag: ''
			},
	};
	
	var defaultOptionImage = {
			language				: App.language,
			showClose				: false,
			showCapture				: true,
			showFileURL				: true,
			maxFileSize				: 1024*1024*20, //20MB
			allowedFileTypes		: ['image'],
			allowedFileExtensions	: ['jpg', 'png', 'webm',  "gif"],
			isCaptureAvatar			: true,
			browseLabel				: "",
			captureLabel 			: "",
			allowedPreviewTypes		: ['image'],
			uploadUrl				:  App.path.BASE_URL_API_UPLOAD,
			ajaxSettings			: {
				headers :  			{
					Authorization: "Bearer " + App.data.user.headerURLSecu
					//--multipart request: cannot use req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL)
				}
			},
			uploadExtraData 		: {
				sv_class 			: "ServiceTpyDocument",
				sv_name 			: "SVNew",
				typ01 				: 1,
				typ02 				: 10
			},
			uploadAsync 			: false,
			overwriteInitial		: false,
			deleteUrl				: App.path.BASE_URL_API_PRIV,
			ajaxDeleteSettings		: {
				headers 			: req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL)
			},
			deleteExtraData 		: {
				sv_class 			: "ServiceTpyDocument",
				sv_name 			: "SVDel"
			},
			layoutTemplates: {
//				actionDrag: ''
			},
					
	};
	this.do_lc_init_input_file = function() {
		var input_file_type = this.input.data("type");
		if(input_file_type && input_file_type == "avatar") {
			$.extend(true, this.options, defaultOptionImage);
//			$(this.input.parent()).addClass("kv-avatar");
		}
		this.input.fileinput(this.options);
	}
	this.input		= $(selector);
	//copy from default option
	this.options 	= $.extend(true, {}, defaultOption);
	this.fileLst	= [];
	var self	= this;
	if(options) {
		//if options is given -> override the options
		this.options = $.extend({}, this.options, options);
	}
	//get config from input
	var code 		= this.input.data("code");
	var typ01 		= this.input.data("typ01");
	var typ02 		= this.input.data("typ02");
	var dataname	= this.input.data("name");
	var maxFile		= this.input.data("maxfile");
	var maxSize		= this.input.data("maxfilesize");
	var fileType	= this.input.data("filetype");
	var entId		= this.input.data("entid");
	this.options.uploadExtraData.code = code;
	this.options.uploadExtraData.entId = entId;
	if(typ01) {
		this.options.uploadExtraData.typ01 = typ01;
	}
	if(typ02) {
		this.options.uploadExtraData.typ02 = typ02;
	}
	if(maxFile) {
		try {
			this.options.maxFileCount = parseInt(maxFile,10);
		} catch(e) {
			console.log(e);
		}
		if(this.options.maxFileCount == 1) {
			this.options.autoReplace		= true;
			this.options.overwriteInitial	= true;
		}
	}
	if(maxSize) {
		try {
			this.options.maxFileSize = parseInt(maxSize,10);
		} catch(e) {
			console.log(e);
		}
		if(this.options.maxFileSize <=0) {
			this.options.maxFileSize = 1000;
		}
	}
	if(fileType) {
		var typs = fileType.split(',');
		this.options.allowedFileTypes 		= [];
		this.options.allowedFileExtensions 	= [];
		this.options.allowedPreviewTypes 	= [];
		var opt = this.options.allowedFileExtensions;
		var opt1 = this.options.allowedPreviewTypes;
		$.each(typs, function(i, e) {
			opt.push(typs[i]);
			opt1.push(typs[i]);
		});
	}
	//[T1604] show file by type01
	var listFiles 	= [];
	var listTmpFile = [];
	if(options && options.fileinput_files) {
		//old version
		listTmpFile = options.fileinput_files;
	} else if(obj && obj[dataname]) {
		//new version
		listTmpFile = obj[dataname];
	}
	//Filter list file by typ01
	if(typ01) {
		$.each(listTmpFile, function(i, e) {
			if(e.typ01 == typ01) {
				if(typ02) {
					if(e.typ02 == typ02) {
						listFiles.push(e);
					}
				} else {
					listFiles.push(e);
				}
			}
		});
	}else if(typ02) {
		$.each(listTmpFile, function(i, e) {
			if(e.typ02 == typ02) {
				listFiles.push(e);
			}
		});
	}else{
		listFiles = listTmpFile;
	}
	//save the current file list
	this.fileLst = $.extend(true, [], listFiles);
	//Init the file input preview existing files
	var urls 	= [];
	var preConf = [];
	
	var reqFileType = function (fName){
		return fName.substring(fName.lastIndexOf('.')+1, fName.length) || "object";
	}
	
	
	$.each(listFiles, function(i, e) {
		var isPublic= (e.typ03==1);
//		var urlPrev = e.path03 ? (App.path.BASE_URL_API_PRIV + "?" + e.path03) :( e.path01 ? (App.path.BASE_URL_API_PRIV + "?" + e.path01) :"www/img/noImg.jpg");		
//		var urlPrev = (e.urlPrev? (!isPublic?(App.path.BASE_URL_API_PRIV + "?" + e.urlPrev) :e.urlPrev) :"www/img/noImg.jpg");		
//		var urlDown = !isPublic?(App.path.BASE_URL_API_PRIV + "?" + e.url):e.url;
//		urls.push(urlPrev);
		
		urls.push(e.url);
		
		var c = {
				caption 	: e.fName,
				downloadUrl	: e.url,
				size 		: e.fSize,
				key 		: e.id,
				filetype	: reqFileType(e.fName)
		}
		preConf.push(c);
	});
	
	this.options.initialPreview 			= urls;
	this.options.initialPreviewAsData 		= true;
	this.options.initialPreviewConfig 		= preConf;
	this.options.preferIconicPreview 		= true, // this will force thumbnails to display icons for following file extensions
	this.options.previewFileIconSettings 	=  { // configure your icon file extensions
	        'doc': '<i class="fas fa-file-word text-primary"></i>',
	        'xls': '<i class="fas fa-file-excel text-success"></i>',
	        'ppt': '<i class="fas fa-file-powerpoint text-danger"></i>',
	        'pdf': '<i class="fas fa-file-pdf text-danger"></i>',
	        'zip': '<i class="fas fa-file-archive text-muted"></i>',
	        'htm': '<i class="fas fa-file-code text-info"></i>',
	        'txt': '<i class="fas fa-file-alt text-info"></i>',
	        'mov': '<i class="fas fa-file-video text-warning"></i>',
	        'mp3': '<i class="fas fa-file-audio text-warning"></i>',
	    };
	this.options.previewFileExtSettings 	= { // configure the logic for determining icon file extensions
	        'doc': function(ext) {
	            return ext.match(/(doc|docx)$/i);
	        },
	        'xls': function(ext) {
	            return ext.match(/(xls|xlsx)$/i);
	        },
	        'ppt': function(ext) {
	            return ext.match(/(ppt|pptx)$/i);
	        },
	        'pdf': function(ext) {
	            return ext.match(/(pdf)$/i);
	        },
	        'zip': function(ext) {
	            return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
	        },
	        'htm': function(ext) {
	            return ext.match(/(htm|html)$/i);
	        },
	        'txt': function(ext) {
	            return ext.match(/(txt|ini|csv|java|php|js|css)$/i);
	        },
	        'mov': function(ext) {
	            return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
	        },
	        'mp3': function(ext) {
	            return ext.match(/(mp3|wav)$/i);
	        }	       
	    };
	
	this.do_lc_init_input_file();
	this.input.on('fileuploaded', function(event, data, previewId, index) {
		do_upload_success(event, data, previewId, index);
	});
	this.input.on('filebatchuploadsuccess', function(event, data, previewId, index) {
		do_upload_success(event, data, previewId, index);
	});
	//Always ask when delete file
	this.input.on('filebeforedelete', function(event, key, data) {
		return new Promise(function(resolve, reject) {
			App.MsgboxController.do_lc_show({
				subBox	: true,
				width	: "50%",
				title	: $.i18n("msgbox_confirm_title"),
				content : $.i18n("common_msg_del_file_content"	),
				buttons	: {
					OK: {
						lab			: $.i18n("common_btn_ok"),
						autoclose	: true,
						funct		: function(){ 
							//debugger;
							resolve();
						}					
					},
					NO: {
						lab		:  $.i18n("common_btn_cancel"),
					}
				}
			});
		});
	});
	this.input.on('filedeleted', function(event, key, jqXHR, data) {
		response = jqXHR.responseJSON;
		if(obj) {
			if(response[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var fileId = response[App['const'].RES_DATA];
				for(var i=0; i<obj[dataname].length; i++){
					if(obj[dataname][i].id == fileId) {
						obj[dataname].splice(i,1);
						i--;
					}
				}
				for(var i = 0; i < self.fileLst.length; i++){
					if(self.fileLst[i].id == fileId) {
						self.fileLst.splice(i,1);
						i--;
					}
				}
				do_gl_show_Notify_Msg_Success ($.i18n('common_file_del_ok_msg'));
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_data_error_msg'));
			}
		}
		if(self.options.del_success) {
			self.options.del_success(response);
		}
	});
	this.do_lc_upload_file = function(callback, objOpt) {
		if (!obj) obj = objOpt;
		var data 	= this.input.data('fileinput');
		var nbFile 	= data.getFileStack().length;
		if (nbFile<=0) {
			callback()
			return;
		}
		this.options.upload_success = callback;
		this.input.fileinput('upload');
	}
	this.input.data("file_input", this);
	var do_upload_success = function(event, data, previewId, index) {
		var form = data.form, files = data.files, extra = data.extra, 
		response = data.response, reader = data.reader;
		if(obj) {
			if(response[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				if(!obj[dataname]) {
					obj[dataname] = [];
				}
				var lstFiles = response[App['const'].RES_DATA];
				$.each(lstFiles, function(i, e) {
					//check if this input is 1 file only to replace the existing file
					if(self.options.maxFileCount == 1) {
						var oldFile = self.fileLst[0];
						if(oldFile) {
							$.each(obj[dataname], function(io, eo) {
								if(eo.id == oldFile.id) {
									obj[dataname][io] 	= e;
									self.fileLst[0]		= e;
								}
							})
						} else {
							obj[dataname].push(e);
							self.fileLst.push(e);
						}
					} else {
						obj[dataname].push(e);
						self.fileLst.push(e);
					}
				});
				if(lstFiles.length>0)
					do_gl_show_Notify_Msg_Success ($.i18n('common_file_up_ok_msg'));
				if(self.options.callback_file_upload_success){
					self.options.callback_file_upload_success.call();
				}
			}else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_data_error_msg'));
			}
		}
		if(self.options.upload_success) {
			self.options.upload_success(response);
		}	    
	}	
}
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Bootstrap Fileinput Plugin
function do_gl_init_fileinputPlugin(parentNode, options) {
	var children = parentNode.find(".fileinput");
	var fileinputOption = undefined;
	var obj				= undefined;
	if(options) {
		fileinputOption = options.fileinput;
		obj				= options.obj;
	}
	if(children.length>0) {	
		children.each(function(){
			var fileInput = new FileInput(this,fileinputOption, obj);
		});
	}
}
//---------------------------------------------DROPZONE-------------------------------------------------------------
//override the removal callback behavior
if(typeof Dropzone !== 'undefined'){
	Dropzone.confirm = function(question, fnAccepted, fnRejected) {
		// launch your fancy bootstrap modal    
		App.MsgboxController.do_lc_show({
			title	: $.i18n("msgbox_confirm_title"),
			width	: "70%",
			content : question,
			buttons	: {
				OK: {
					classBtn	: "btn-primary",
					lab		: $.i18n("common_btn_ok"),
					funct	: function(){
						if(fnAccepted)	fnAccepted();
					}
				},
				CALCEL: {
					lab		:  $.i18n("common_btn_no"),
					funct	: function() {
						if(fnRejected)	fnRejected();
					}
				}
			}
		});	
		
	};
}
const Dzopzone = function(selector, options, obj = {files: []}) {
//	var supportedFileType = ['image', 'html', 'text', 'video', 'audio', 'flash', 'object'];
	let {fProcessing, fSucces, fError, files, maxFiles, param, previewsContainer} = options;
	if(!fSucces)
		fSucces = function(file, res){
			file.id = res[App['const'].RES_DATA][0].id;
		}
	
	let fileExist 	= [...obj.files];
	if(param){
		fileExist	= obj.files.filter(f => (param.typ01 ? param.typ01==f.typ01 : true) && (param.typ02 ? param.typ02==f.typ02 : true));
	}
	if (!maxFiles) maxFiles = 1000;
		
	var defaultOption = {
			url				: App.path.BASE_URL_API_UPLOAD,
			headers 		: {
				Authorization: "Bearer " + App.data.user.headerURLSecu
				//--multipart request: cannot use req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL)
			},
			params 			: {
				sv_class 	: "ServiceTpyDocument",
				sv_name 	: "SVNew",
				typ01 		: (!param || !param.typ01) ? 1 : param.typ01,
				typ02 		: (!param || !param.typ02) ? 2 : param.typ02
			},
			acceptedFiles: options.acceptedFiles,
//			accept : function(file, done){
//				done();
//			},
			init: function(){
				let _this = this;
				this.on("processing", function (file) {
					if(fProcessing)	fProcessing(file);
				});
				this.on("maxfilesexceeded", function(file) {
//					alert("Only one file can be uploaded at a time.");
					this.removeFile(file); // Remove the exceeded file
				});
				
				this.on("success", function (file, response) {
					console.log("sucesso");
					let res = JSON.parse(response);
					if(res[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES){
						obj.files = [...obj.files, ...res.res_data];
						if(fSucces)	fSucces(file, res);
					}
				});
				this.on("error", function (file, error, xhr) {
					if(fError)	fError(file, error, xhr);
				});
				this.on("removedfile", function (file) {
					if(file.id && !file.notDel){
						//send ajax delede
						do_gl_remove_fileDropzone(file, obj);
					}
				});
				if(fileExist && fileExist.length){
					for(let f of fileExist){
						var mockFile = { name: f.fName, size: f.fSize, id: f.id, accepted: true }; // use actual id server uses to identify the file (e.g. DB unique identifier)
						this.emit("addedfile", mockFile);
						if((/\.(gif|jpe?g|tiff|png|webp|bmp)$/i).test(mockFile.name)){
							this.createThumbnailFromUrl(mockFile, f.url);
							this.emit("thumbnail", mockFile, f.url);
						}
						
//						this.emit("success", mockFile);
						this.emit("complete", mockFile);
						this.files.push(mockFile);
					}
				}
			},
			addRemoveLinks : true,
			dictRemoveFileConfirmation: $.i18n("common_msg_del_file_content"),
			maxFiles,
//			previewsContainer
	};
	return new Dropzone(selector, defaultOption);
}
function do_gl_init_fileDropzone(parentNode, options) {
	let children 	= parentNode.find(".inputfile");
	let lstInpFile 	= [];
	let {fileinput: fileinputOption = {}, obj} = options;
//	fileinputOption.autoProcessQueue = false;
	
	if(children.length>0) {	
		children.each(function(){
			let dropzone = new Dzopzone(this, fileinputOption, obj);
			lstInpFile.push(dropzone);
		});
	}
	return lstInpFile;
}
function do_gl_remove_fileDropzone(file, obj){
	let aut_Header		= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
			
	var ref 			= req_gl_Request_Content_Send("ServiceTpyDocument", "SVDel");
	ref["id"]			= file.id;
	var fSucces			= [];
	fSucces.push(req_gl_funct(null, do_gl_delete_succes_dropzone, [file, obj]));	
	
	var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	
	App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, aut_Header, ref, 100000, fSucces, fError) ;
}
function do_gl_delete_succes_dropzone(response, file, obj){
	if(response[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
		if(obj.files && obj.files.length){
			obj.files = obj.files.filter(f => f.id != file.id);
		}
		do_gl_show_Notify_Msg_Success ($.i18n('common_file_del_ok_msg'));
	}
}


//-----WebContent/www/js/app/common/ctrl/ChartTool.js------------------------------
/**
 * Helper to creat a chart
 * @param chartId
 * @param type	Type of the chart: pie, doughnut, line, bar, radar, bubble, ...
 * @param data Array of data for the chart, it have value and the config to display data: value, label, backgroundColor
 * 			[{value:10, label: "data_1", backgroundColor: { type : "color", "value": "green"}}, {value:20, label: "data_2", backgroundColor: { type : "pattern", "value": "square #ff6384"}}]
 * @param options Other options for the chart : legend, responsive, ...
 * @returns
 */
function do_gl_create_chart(divId, type, data, options) {
	var template_option = {
		responsive: true,
		legend : { position: "right"}
	}
	var default_backgroundColor = {
			type : "color",
			value: "auto"
	}
	var color_pool = [
		"#bede69", "#69bede", "gray", "#bede96", "green", "red", "blue", "#96bede", "#be69de", "#f75164"
	]
	var pattern_pool = [
		"plus", "cross", "dash", "cross-dash", "dot", "dot-dash", "disc", "ring", "line", "line-vertical", "weave", "zigzag", "zigzag-vertical", "diagonal",
		"diagonal-right-left", "square", "box", "triangle", "triangle-inverted", "diamond", "diamond-box"
	]
	
	var custom_options = $.extend(true, {}, template_option, options);
	
	var div = $(divId)[0];
	
	if(!div) {
		console.log("ChartTool Error: div not found !");
	}
	
	var canvas	= document.createElement("canvas");
	div.append(canvas);
	
	var ctx = canvas.getContext('2d');
	
	var labels 			= [];
	var datas			= [];
	var backgroundColor = [];
	
	var chart = {};
	
	requirejs(['patternomaly'], function( pattern) {
		//normalize data for type
		$.each(data, function( i, e ){
			labels.push(e.label);
			datas.push(e.value);
			var b = e.backgroundColor;
			if(!b) {
				b = $.extend(true, {}, default_backgroundColor);
			}
			if(b.type == "color") {
				if(b.value == "auto") {
					b.value = do_generate_color();
				}
				backgroundColor.push(b.value);
			} else if(b.type == "pattern") {
				var parts = b.value.split(" ");
				backgroundColor.push(pattern.draw(parts[0], parts[1]));
			}
		});
		var chartData = {
				datasets: [{
					data: datas,
					backgroundColor: backgroundColor
				}],
				labels: labels
		};
		chart = new Chart(ctx, {
			type : type,
			data: chartData,
			options: custom_options
		});
	});
	
	var do_generate_color = function() {
		var colorNb = color_pool.length;
		var found = false;
		var color = "#bede69";
		while(!found) {
			var c = Math.floor(Math.random() * (colorNb - 1));
			color = color_pool[c];
			if($.inArray(color, backgroundColor) >= 0) {
				//already used
			} else {
				found = true;
			}
		}
		return color;
	};
	
	return chart;
}
function do_gl_create_chart_bar(divId, type, dataChart, options) {
	var div = $(divId);
	var canvas	= document.createElement("canvas");
	div.append(canvas);
	var ctx = canvas.getContext('2d');
	
	new Chart(ctx, {
	    type: type,
	    data: dataChart,
	    options: options
	});
}
function do_gl_create_chart_bar_ApexChart(divId, options) {
	let {series = [], categories = [], colors = []} = options;
	
	let opt = {
		    chart: {
		        height: 359,
		        type: "bar",
		        stacked: !0,
		        toolbar: {
		            show: !1
		        },
		        zoom: {
		            enabled: !0
		        }
		    },
		    plotOptions: {
		        bar: {
		            horizontal: !1,
		            columnWidth: "15%",
		            endingShape: "rounded"
		        }
		    },
		    dataLabels: {
		        enabled: !1
		    },
		    series: series,
		    xaxis: {
		        categories: categories
		    },
		    colors: colors,
		    legend: {
		        position: "bottom"
		    },
		    fill: {
		        opacity: 1
		    }
		};
		(chart = new ApexCharts(document.querySelector(divId),opt)).render();
}
function do_gl_create_chart_radialBar_ApexChart(divId, options) {
	let {series = [], labels = [], colors = []} = options;
	
	let opt = {
		    chart: {
		        height: 180,
		        type: "radialBar",
		        offsetY: -10
		    },
		    plotOptions: {
		        radialBar: {
		            startAngle: -135,
		            endAngle: 135,
		            dataLabels: {
		                name: {
		                    fontSize: "13px",
		                    color: void 0,
		                    offsetY: 60
		                },
		                value: {
		                    offsetY: 22,
		                    fontSize: "16px",
		                    color: void 0,
		                    formatter: function(e) {
		                        return e + "%"
		                    }
		                }
		            }
		        }
		    },
		    colors: colors,
		    fill: {
		        type: "gradient",
		        gradient: {
		            shade: "dark",
		            shadeIntensity: .15,
		            inverseColors: !1,
		            opacityFrom: 1,
		            opacityTo: 1,
		            stops: [0, 50, 65, 91]
		        }
		    },
		    stroke: {
		        dashArray: 4
		    },
		    series: series,
		    labels: labels
		};
		(chart = new ApexCharts(document.querySelector(divId), opt)).render();
}
/**
 * Pattern and color supported
 * 
 * Pattern -----
 * plus cross dash cross-dash dot dot-dash disc ring line line-vertical weave zigzag zigzag-vertical diagonal diagonal-right-left square box triangle triangle-inverted diamond diamond-box
 * ----------
 * 
 * Color ----------
 * 'red', 'green', 'blue', 'purple', ....
 * or rgb(0,0,0)
 * or hsl(
 * or #bede69
 */


//-----WebContent/www/js/app/common/ctrl/BarRatingTool.js------------------------------
// list variables of eval
var pr_name_eval  	= ['eval01', 'eval02', 'eval03', 'eval04', 'eval05'];
// set default value for eval 
const do_gl_bar_rating_init = function(defaultValue) {
	if(App.data.curEval == null) {
		App.data.curEval = {};
	}
	
	for (var i = 0; i < pr_name_eval.length; i++) {
		App.data.curEval[pr_name_eval[i]] = defaultValue;
	}
}
const do_gl_bar_rating_init_one = function(name, defaultValue) {
	if(App.data.curEval == null) {
		App.data.curEval = {};
	}
	
	App.data.curEval[name] = defaultValue;
}
// save value of element html to App.data.curEval
const do_gl_bar_rating_save_eval = function(div, name) {
	if(App.data.curEval == null) {
		App.data.curEval = {};
	}
	
	App.data.curEval[name] = $(div).val();
}
// show bar_rating of one element 
const do_gl_bar_rating_show = function(idDiv, div_err, theme, initialRating, readonly) {
	
	if (initialRating == undefined || initialRating == 0 || initialRating == NaN) {	
		do_gl_bar_rating_show_err(div_err);
		do_gl_bar_rating_hide_err(idDiv);
		
	} else {
		$(idDiv).barrating({
	        theme: theme == null? 'fontawesome-stars':theme,
	        initialRating: initialRating == null? 3:initialRating,
	        readonly: readonly == null? false:readonly
	    });
	}
}
// show bar_rating of all elements( list id_rating )
const do_gl_bar_rating_show_all = function(div, div_err, theme, initialRating, readonly) {
	if ( div == null || div == undefined || typeof div == undefined || div == "") {
		return 0;
	}
	
	for (var i = 0 ; i < div.length; i++) {
		do_gl_bar_rating_show(div[i], div_err, theme, initialRating, readonly);
	}
}
// get value_bar_rating of all elements with list id_rating
var req_gl_bar_rating_value = function(div_bar_rating, defaultValue) {
	if (div_bar_rating.length >  pr_name_eval.length ) {
		return 0;
	}
	
	
	for (var i = 0; i < div_bar_rating.length; i++) {		
		get_value_rating(pr_name_eval[i], div_bar_rating[i], defaultValue);
	}
}
//get value_bar_rating of one element ( default and onchange event)
var get_value_rating = function( name, idDiv, defaultValue) {
	
	if (App.data.curEval == null) {
		App.data.curEval = {}; 
	}
	App.data.curEval[name]  = defaultValue;
	
	
	$(idDiv).on('change', function () {
		var value = parseInt($(idDiv).val());
		var nameEval = "eval0" + idDiv.substring(idDiv.length - 1, idDiv.length);
		
		for (var i = 0; i < pr_name_eval.length; i++) {
			if (pr_name_eval[i] == nameEval) {
				App.data.curEval[pr_name_eval[i]] = value;
			}
		}
	});
	
}
var req_gl_bar_rating_value_one_on_change =  function (idDiv, defaultValue) {
	
	value = defaultValue;
	
	$(idDiv).on('change', function () {
		value = parseInt($(idDiv).val());
	});
	
	return value;
}
const do_gl_bar_rating_show_err = function (div) {
	$(div).show();
}
const do_gl_bar_rating_hide_err = function (div) {
	$(div).hide();
}


//-----WebContent/www/js/app/common/ctrl/RTCTool.js------------------------------
var RTCPeerConnection         = null;
var webrtcDetectedBrowser     = null;
var webrtcDetectedVersion     = null;
var do_gl_getUserMedia        = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var do_gl_attachMediaStream   = null;
var do_gl_reattachMediaStream = null;
var do_gl_createIceServer     = null;
var can_be_Firefox			  = false;
if (navigator.mozGetUserMedia) {
	console.log("This appears to be Firefox");
	can_be_Firefox 		  = true;
	webrtcDetectedBrowser = "firefox";
	webrtcDetectedVersion = parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]);
	// The RTCPeerConnection object.
	RTCPeerConnection = mozRTCPeerConnection;
	// The RTCSessionDescription object.
	RTCSessionDescription = mozRTCSessionDescription;
	// The RTCIceCandidate object.
	RTCIceCandidate = mozRTCIceCandidate;
	// Get UserMedia (only difference is the prefix).
	do_gl_getUserMedia = navigator.mozGetUserMedia.bind(navigator);
	// Creates iceServer from the url for FF.
	do_gl_createIceServer = function(url, username, password) {
		var iceServer = null;
		var url_parts = url.split(':');
		if (url_parts[0].indexOf('stun') === 0) {
		  // Create iceServer with stun url.
		  iceServer = { 'url': url };
		} else if (url_parts[0].indexOf('turn') === 0 &&
				   (url.indexOf('transport=udp') !== -1 ||
					url.indexOf('?transport') === -1)) {
		  // Create iceServer with turn url.
		  // Ignore the transport parameter from TURN url.
		  var turn_url_parts = url.split("?");
		  iceServer = { 'url': turn_url_parts[0],
						'credential': password,
						'username': username };
		}
		return iceServer;
	};
	// Attach a media stream to an element.
	do_gl_attachMediaStream = function(element, stream) {
		console.log("Attaching media stream");
		element.mozSrcObject = stream;
		element.play();
	};
	do_gl_reattachMediaStream = function(to, from) {
		console.log("Reattaching media stream");
		to.mozSrcObject = from.mozSrcObject;
		to.play();
	};
	do_gl_stopMediaStream = function(element) {
		console.log("Stop media stream");
		element.stop();
	};
	
	// Fake get{Video,Audio}Tracks
	MediaStream.prototype.getVideoTracks = function() {
		return [];
	};
	MediaStream.prototype.getAudioTracks = function() {
		return [];
	};
} else if (navigator.webkitGetUserMedia) {
	console.log("This appears to be Chrome");
	webrtcDetectedBrowser = "chrome";
	webrtcDetectedVersion =  parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
 
	// Creates iceServer from the url for Chrome.
	do_gl_createIceServer = function(url, username, password) {
		var iceServer = null;
		var url_parts = url.split(':');
		if (url_parts[0].indexOf('stun') === 0) {
		  // Create iceServer with stun url.
		  iceServer = { 'url': url };
		} else if (url_parts[0].indexOf('turn') === 0) {
			if (webrtcDetectedVersion < 28) {
				// For pre-M28 chrome versions use old TURN format.
				var url_turn_parts = url.split("turn:");
				iceServer = { 'url': 'turn:' + username + '@' + url_turn_parts[1],
						  'credential': password };
			} else {
				// For Chrome M28 & above use new TURN format.
				iceServer = { 'url': url,
						  'credential': password,
						  'username': username };
			}
		}
		return iceServer;
	};
	// The RTCPeerConnection object.
	RTCPeerConnection = webkitRTCPeerConnection;
	// Get UserMedia (only difference is the prefix).
	do_gl_getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
	// Attach a media stream to an element.
	do_gl_attachMediaStream = function(element, stream) {
		if (typeof element.srcObject !== 'undefined') {
		  element.srcObject = stream;
		} else if (typeof element.mozSrcObject !== 'undefined') {
		  element.mozSrcObject = stream;
		} else if (typeof element.src !== 'undefined') {
		  element.src = URL.createObjectURL(stream);
		} else {
		  console.log('Error attaching stream to element.');
		}
	};
	do_gl_reattachMediaStream = function(to, from) {
		to.src = from.src;
	};
	
	do_gl_stopMediaStream = function(element) {
		if (typeof element.srcObject !== 'undefined') {
			element.srcObject = null;
		} else if (typeof element.mozSrcObject !== 'undefined') {
			element.mozSrcObject = null;
		} else if (typeof element.src !== 'undefined') {
			element.src = null;
		} else {
			console.log('Error attaching stream to element.');
		}
	};
	// The representation of tracks in a stream is changed in M26.
	// Unify them for earlier Chrome versions in the coexisting period.
	if (!webkitMediaStream.prototype.getVideoTracks) {
		webkitMediaStream.prototype.getVideoTracks = function() {
			return this.videoTracks;
		};
		webkitMediaStream.prototype.getAudioTracks = function() {
		  return this.audioTracks;
		};
	}
	// New syntax of getXXXStreams method in M26.
	if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
		webkitRTCPeerConnection.prototype.getLocalStreams = function() {
			return this.localStreams;
		};
		webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
		return this.remoteStreams;
		};
	}
} else {
  console.log("Browser does not appear to be WebRTC-capable");
}
var req_gl_RTCPeerConnection = function(params) {
  if(can_be_Firefox){
    return new mozRTCPeerConnection(params);
  } else{
    try{
       return new webkitRTCPeerConnection(params);
    }catch(e){
      return new RTCPeerConnection(params);
    }
   
  }
}
var req_gl_SessionDescription= function(message) {
  if(can_be_Firefox){
    return new mozRTCSessionDescription(message);
  }else{
    return new RTCSessionDescription(message);
  }
}
var req_gl_IceCandidate= function(params) {
  if(can_be_Firefox){
    return new mozRTCIceCandidate(params);
  }else{
    return new RTCIceCandidate(params);
  }
}
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
// Set Opus as the default audio codec if it's present.
var req_gl_preferOpus = function (sdp) {
    var sdpLines 	= sdp.split('\r\n');
    var mLineIndex 	= null;
      
	// Search for m line.
    for (var i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('m=audio') !== -1) {
          mLineIndex = i;
          break;
        }
    }
    if (mLineIndex ===null) {
        return sdp;
    }
    // If Opus is available, set it as the default in m line.
    for (i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('opus/48000') !== -1) {
          var opusPayload = req_gl_extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
          if (opusPayload) {
            sdpLines[mLineIndex] = req_gl_setDefaultCodec(sdpLines[mLineIndex], opusPayload);
          }
          break;
        }
    }
    // Remove CN in m line and sdp.
    sdpLines = req_gl_removeCN(sdpLines, mLineIndex);
    sdp = sdpLines.join('\r\n');
    return sdp;
}
var req_gl_extractSdp = function(sdpLine, pattern) {
    var result = sdpLine.match(pattern);
    return result && result.length === 2 ? result[1] : null;
}
    // Set the selected codec to the first in m line.
var req_gl_setDefaultCodec = function(mLine, payload) {
    var elements = mLine.split(' ');
    var newLine = [];
    var index = 0;
    for (var i = 0; i < elements.length; i++) {
		if (index === 3) { // Format of media staarts from the fourth.
          newLine[index++] = payload; // Put target payload to the first.
        }
        if (elements[i] !== payload) {
          newLine[index++] = elements[i];
        }
    }
    return newLine.join(' ');
}
    // Strip CN from sdp before CN constraints is ready.
var req_gl_removeCN = function(sdpLines, mLineIndex) {
    var mLineElements = sdpLines[mLineIndex].split(' ');
    
	// Scan from end for the convenience of removing an item.
    for (var i = sdpLines.length - 1; i >= 0; i--) {
        var payload = req_gl_extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
        if (payload) {
          var cnPos = mLineElements.indexOf(payload);
          if (cnPos !== -1) {
            // Remove CN payload from m line.
            mLineElements.splice(cnPos, 1);
          }
          // Remove CN line in sdp
          sdpLines.splice(i, 1);
        }
    }
    sdpLines[mLineIndex] = mLineElements.join(' ');
    return sdpLines;
}

