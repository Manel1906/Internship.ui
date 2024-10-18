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