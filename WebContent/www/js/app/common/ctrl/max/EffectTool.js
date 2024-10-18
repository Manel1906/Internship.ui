//--------------------------------------------------------------------------------------------
function do_gl_effect_call(type) {
	switch (type) {
	case 0:
		break;
	case 1:	{	//Noel
		//Christmas effect
		setTimeout(function() {
//			$(document).snowfall({deviceorientation : true, round : true, minSize: 1, maxSize:12,  flakeCount : 150});
			$.fn.snow({minSize: 5, maxSize: 30, newOn1: 1000, newOn2: 500, flakeColor: '#FFFAFA'});	//#C21F1F
		}, 3000);
		break;
	}
	case 2:	{	//New Year
		break;
	}
	default:
		break;
	}
}


//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
const do_gl_changeStyleListShow = function(varname, idIconSmall, idIconLager, idTitleSmall, idTitleLager, idDesSmall, idDesLager) {

	do_lc_init_show(varname, idIconSmall, idTitleSmall, idTitleLager, idDesSmall, idDesLager, "block", "none");

	do_lc_on_click_show(varname, idIconSmall, idTitleSmall, idTitleLager, idDesSmall, idDesLager, "block", "none");


	do_lc_on_click_show(varname, idIconLager, idTitleSmall, idTitleLager, idDesSmall, idDesLager, "none", "block");

}	


var do_lc_init_show = function ( varname, idIconSmall,  idTitleSmall, idTitleLager, idDesSmall, idDesLager, display1, display2 ) {
	var className = $( idIconSmall ).attr('class');

	if ( className == "wygo-active" || className === "wygo-active") {

		for(var i = 0; i < App.data[varname].length; i++) {

			$( idTitleSmall + App.data[varname][i].id + "_" + varname).css("display", display1);
			$( idTitleLager + App.data[varname][i].id + "_" + varname ).css("display", display2);


			$( idDesSmall + App.data[varname][i].id + "_" + varname ).css("display", display1);
			$( idDesLager + App.data[varname][i].id + "_" + varname ).css("display", display2);
		}
	} else {
		for(var i = 0; i < App.data[varname].length; i++) {

			$( idTitleSmall + App.data[varname][i].id + "_" + varname ).css("display", display2);
			$( idTitleLager + App.data[varname][i].id + "_" + varname ).css("display", display1);


			$( idDesSmall + App.data[varname][i].id + "_" + varname ).css("display", display2);
			$( idDesLager + App.data[varname][i].id + "_" + varname ).css("display", display1);
		}
	}
}

var do_lc_on_click_show = function ( varname, idIcon, idTitleSmall, idTitleLager, idDesSmall, idDesLager , display1, display2) {
	$(idIcon)
	$(idIcon).on("click", function() {

		for(var i = 0; i < App.data[varname].length; i++) {

			$(idTitleSmall + App.data[varname][i].id + "_" + varname ).css("display", display1);
			$(idTitleLager + App.data[varname][i].id + "_" + varname ).css("display", display2);


			$( idDesSmall + App.data[varname][i].id + "_" + varname ).css("display", display1);
			$( idDesLager + App.data[varname][i].id + "_" + varname ).css("display", display2);
		}

	});
}


//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
function do_gl_loadGridSlider(div, autoplay, autoplayTimeout, autoplayHoverPause) {
	if (autoplay==undefined) 			autoplay 			= true;
	if (!autoplayTimeout) 				autoplayTimeout 	= 3000;
	if (autoplayHoverPause==undefined)  autoplayHoverPause 	= true;
	/* -------------------------------------
	THREE GRID SLIDER
	-------------------------------------- */
//	var _listar_gridslider = jQuery('[id="wygo-categoriespostslider"]');
	var _listar_gridslider = jQuery(div).find('.wygo-categoriespostslider');
	if(_listar_gridslider.hasClass('wygo-gridslider')){
	_listar_gridslider.owlCarousel({
		autoplay			: autoplay,
		autoplayTimeout		: autoplayTimeout,
		autoplayHoverPause	: autoplayHoverPause,
		items				: 4,
		nav					: true,
		loop				: true,
		dots				: true,
		margin				: 40,
		dotsClass			: 'wygo-sliderdots',
		navClass			: ['wygo-prev', 'wygo-next'],
		navContainerClass	: 'wygo-slidernav',
		navText				: ['<span class="icon-arrow-left2"></span>', '<span class="icon-arrow-right2"></span>'],
		responsive 			: {
			// breakpoint from 0 up
			0 : {items:1,},
			// breakpoint from 640 up
			640 : {items:2,},
			// breakpoint from 1024 up
			1024 : {items:3,},
			// breakpoint from 1310 up
			1310 : {items:4,},
			1900 : {items:5,},
		}
	});
	}
}

//--------------------------------------------------------------------------------------------
function do_gl_loadSelectChosen() {
	jQuery( document ).ready(function() {
		var _listar_chosendropdown = jQuery('[id="wygo-categorieschosen"], [id="wygo-locationchosen"], [id="wygo-subscriptionchosen"]');
		if(_listar_chosendropdown.hasClass('wygo-chosendropdown')){
			var config = {search_contains: true, max_shown_results: 20, no_results_text: $.i18n("common_empty_entity_autocomplete")};
			_listar_chosendropdown.chosen(config);
		}
	});
}
//--------------------------------------------------------------------------------------------
function do_gl_loadNavigation() {
	/* -------------------------------------
	SINGLE PAGE NAVIGATION
	-------------------------------------- */
	if(jQuery('#wygo-themetabnav').length > 0){
		var lastId, topMenu = jQuery(".wygo-themetabnav"), topMenuHeight = topMenu.outerHeight()+15,
		menuItems = topMenu.find("a"),
		scrollItems = menuItems.map(function(){
			var item = jQuery(jQuery(this).attr("href"));
			if (item.length) { return item; }
		});
		menuItems.click(function(e){
			menuItems.parent().removeClass('wygo-active').end();
			jQuery(this).parent().addClass('wygo-active');
			
			var href = jQuery(this).attr("href"), offsetTop = href === "#" ? 0 : jQuery(href).offset().top-topMenuHeight+1;
			jQuery('html, body').stop().animate({
				scrollTop: offsetTop
			}, 300);
			e.preventDefault();
		});
		jQuery(window).scroll(function(){
			var fromTop = jQuery(this).scrollTop()+topMenuHeight;
			var cur = scrollItems.map(function(){
				if (jQuery(this).offset().top < fromTop)
					return this;
			});
			cur = cur[cur.length-1];
			var id = cur && cur.length ? cur[0].id : "";
			if (lastId !== id) {
				lastId = id;
				menuItems.parent().removeClass('wygo-active').end().filter("[href='#"+id+"']").parent().addClass('wygo-active');
			}
		});
	}
	
	if(jQuery('#wygo-themetabnav').length > 0){
		var topPosition = jQuery('#wygo-themetabnav').offset().top - 100;
		jQuery(window).on( 'scroll', function(){
			if (jQuery(window).scrollTop() >= topPosition) {
				jQuery('#wygo-fixedtabnav').addClass('wygo-shownav');
			} else {
				jQuery('#wygo-fixedtabnav').removeClass('wygo-shownav');
			}
		});
	}
}

//--------------------------------------------------------------------------------------------
function do_gl_loadInnerSearch() {
	/*--------------------------------------
	TOGGLE INNER PAGE SEARCH
	--------------------------------------*/
	if(jQuery('#wygo-btnsearchtoggle').length > 0){
//		jQuery('#wygo-innersearch').slideDown();
		jQuery('#wygo-btnsearchtoggle').on('click', function(){
			jQuery('#wygo-innersearch').slideToggle();
		});
	}
}



//--------------------------------------------------------------------------------------------
function do_gl_loadJquerySteps() {
	if(jQuery('#wygo-addlistingsteps').length > 0){
		jQuery("#wygo-addlistingsteps").steps({
			headerTag: ".wygo-steptitle",
			bodyTag: "section",
			titleTemplate: '<span class="number">#index#</span>#title#',
			onStepChanged: function () {
				jQuery('.steps .current').nextAll().removeClass('done').addClass('disabled');
			},
			labels: {
//		        current: "current step:",
//		        pagination: "Pagination",
		        finish: $.i18n("common_btn_finish"),
		        next: $.i18n("common_btn_next"),
		        previous: $.i18n("common_btn_previous"),
		        loading: $.i18n("common_loading_data")
		    }
		});
	}
}

//--------------------------------------------------------------------------------------------
function do_gl_loadJQuerySortable(callback, callbackParams) {
	/*--------------------------------------
	JQUERY SORTABLE					
	--------------------------------------*/
	if(jQuery('#wygo-sortable').length > 0){
		requirejs(['sortable'], function (Sortable){
			var listar_sortable = document.getElementById("wygo-sortable");
			var sort = Sortable.create(listar_sortable, {
				animation: 500,
//				handle: '.wygo-arangeslot',
				filter: '.wygo-btndelete',
				onFilter: function (evt) {
					var el = sort.closest(evt.item);

					if(el && document.getElementById(el.id)) {
						el.parentNode.removeChild(el);
						if(callback)	callback(el);
					}			

//					App.controller.Plan.Add.onDeleteOnePlanDetail(el.id);
				}
				/*onClone: function (evt) {
					var origEl = evt.item;
					var cloneEl = evt.clone;
				}*/
			});
		});
	}
}
