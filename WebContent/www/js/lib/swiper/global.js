var swipers = [];
var initSwiper = function(){
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

