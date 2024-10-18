
//			$('#imageGallery').lightSlider({
//				gallery: true,
//                item: 1,
//                auto: true,
//                loop: true,
//                thumbItem: 9,
//                onSliderLoad: function (el) {
//                    el.lightGallery({
//                        selector: '#imageGallery .lslide',
//                    });
//                }
//		    });

/*
 $("#lightSlider").lightSlider({
        item: 3,
        autoWidth: false,
        slideMove: 1, // slidemove will be 1 if loop is true
        slideMargin: 10,
 
        addClass: '',
        mode: "slide",
        useCSS: true,
        cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
        easing: 'linear', //'for jquery animation',////
 
        speed: 400, //ms'
        auto: false,
        loop: false,
        slideEndAnimation: true,
        pause: 2000,
 
        keyPress: false,
        controls: true,
        prevHtml: '',
        nextHtml: '',
 
        rtl:false,
        adaptiveHeight:false,
 
        vertical:false,
        verticalHeight:500,
        vThumbWidth:100,
 
        thumbItem:10,
        pager: true,
        gallery: false,
        galleryMargin: 5,
        thumbMargin: 5,
        currentPagerPosition: 'middle',
 
        enableTouch:true,
        enableDrag:true,
        freeMove:true,
        swipeThreshold: 40,
 
        responsive : [],
 
        onBeforeStart: function (el) {},
        onSliderLoad: function (el) {},
        onBeforeSlide: function (el) {},
        onAfterSlide: function (el) {},
        onBeforeNextSlide: function (el) {},
        onBeforePrevSlide: function (el) {}
    });
 */
function do_gl_init_lightSlider_with_lightGallery(sliderDiv, gallery, item, loop, auto, thumbItem, onSliderLoad, nbImgInSlider){
	var slider 		= $(sliderDiv);
	if (!nbImgInSlider) nbImgInSlider = 4;
	var nbImg		= nbImgInSlider ;
	var options = {			
		gallery		: (gallery == undefined ? false : gallery) , // enable gallery, default: false
        item		: item==undefined||item>= nbImg ? nbImg : item, // number of items per slide
        auto		: item <=nbImg  ? false : (auto == undefined ? false : auto), //If true, the Slider will automatically start to play.		
        loop		: item <=nbImg ? false : (loop == undefined ? false : loop), // loop all items
        thumbItem	: thumbItem == undefined ? nbImg*2 : thumbItem, // number of gallery thumbnail to show at a time
        enableDrag	: item <= nbImg  ? false : (!onSliderLoad ? false : true), //enable Drag, default: true
        controls	: item <= nbImg ? false : (!onSliderLoad ? false : true), //If false, prev/next buttons will not be displayed.
        		
        speed: 2000, //ms'
        pause: 5000,
         
//        onSliderLoad: onSliderLoad == undefined ?
//        	(function (el) {
//        	el.lightGallery({
//        		selector: sliderDiv + ' .lslide',
//        		autoplayFirstVideo: false,
//        		getCaptionFromTitleOrAlt: false
//        	}) 
//        }) : onSliderLoad,
	}
	
	if(onSliderLoad)	options.onSliderLoad = function (el) {
											    	el.lightGallery({
											    		selector: sliderDiv + ' .lslide',
											    		autoplayFirstVideo: false,
											    		getCaptionFromTitleOrAlt: false
											    	})
											    };
	
	try{
		slider.lightSlider(options);
	}catch(e){
		console.log(e);
	}		
}

//------------------------------------------------------------------------------------
function do_gl_init_lightSlider_without_lightGallery(sliderDiv, item, isPlanDetail){
	var slider 		= $(sliderDiv);
	var options = {		
		loop: true,
		enableDrag: true,
		item: item || 4,
		auto: isPlanDetail? true : false,
		speed: 2000, //ms'
        pause: 3000,
	}
	
	try{
		slider.lightSlider(options);
	}catch(e){
		console.log(e);
	}		
}

//------------------------------------------------------------------------------------
function do_gl_init_lightGallery(lightGalleryDiv){
	$(lightGalleryDiv).lightGallery({
		autoplayFirstVideo: false
	});
}