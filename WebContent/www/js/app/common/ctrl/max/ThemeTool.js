function do_gl_bindingTemplateCustom() {
	"use strict";
	/* -------------------------------------
				SCROLLBAR
		-------------------------------------- */
	if(jQuery('.wygo-themescrollbar').length > 0){
		var _listar_themescrollbar = jQuery('.wygo-themescrollbar');
		_listar_themescrollbar.mCustomScrollbar({
			axis:"y",
		});
	}
	if(jQuery('.wygo-horizontalthemescrollbar').length > 0){
		var _listar_horizontalthemescrollbar = jQuery('.wygo-horizontalthemescrollbar');
		_listar_horizontalthemescrollbar.mCustomScrollbar({
			axis:"x",
			advanced:{autoExpandHorizontalScroll:true},
			theme:"rounded-dots",
			scrollInertia:400
		});
	}
	/*--------------------------------------
				THEME VERTICAL SCROLLBAR		
		--------------------------------------*/
	jQuery('#wygo-verticalscrollbar').mCustomScrollbar({
		axis:"y",
	});
	/*--------------------------------------
				MOBILE MENU
		--------------------------------------*/
	function collapseMenu(){
		jQuery('.wygo-navigation ul li.menu-item-has-children').prepend('<span class="wygo-dropdowarrow"><i class="fa fa-angle-down"></i></span>');
		jQuery('.wygo-navigation ul li.menu-item-has-children span').on('click', function() {
			jQuery(this).parent('li').toggleClass('wygo-open');
			jQuery(this).next().next().slideToggle(300);
		});
	}
	collapseMenu();
	/* ---------------------------------------
				SIGN IN OPEN CLOSE
		--------------------------------------- */
//	jQuery('a[href="#wygo-loginsingup"]').on('click', function(event) {
//	event.preventDefault();
//	jQuery('#wygo-loginsingup').addClass('open');
//	jQuery('body').addClass('wygo-hidescroll');
//	});
//	jQuery('.wygo-btnclose').on('click', function(event) {
//	jQuery('#wygo-loginsingup').removeClass('open');
//	jQuery('body').removeClass('wygo-hidescroll');
//	});
	/* -------------------------------------
				HOME SLIDER V ONE
		-------------------------------------- */
	if(jQuery('#wygo-homeslider').length > 0){
		var _listar_homeslider = jQuery('#wygo-homeslider');
		_listar_homeslider.owlCarousel({
			items: 1,
			nav:false,
			loop:true,
			dots: false,
			autoplay: true,
			animateIn: 'fadeIn',
			animateOut: 'fadeOut',
			dotsClass: 'wygo-sliderdots',
			navClass: ['wygo-prev', 'wygo-next'],
			navContainerClass: 'wygo-slidernav',
			navText: ['<span class="icon-chevron-left"></span>', '<span class="icon-chevron-right"></span>'],
		});
	}
	/* -------------------------------------
				TESTIMONIALS SLIDER
		-------------------------------------- */
	if(jQuery('#wygo-testimonialslider').length > 0){
		var _listar_testimonialslider = jQuery('#wygo-testimonialslider');
		_listar_testimonialslider.owlCarousel({
			items: 1,
			nav:true,
			loop:true,
			dots: true,
			margin: 15,
			autoplay: true,
			dotsClass: 'wygo-sliderdots',
			navClass: ['wygo-prev', 'wygo-next'],
			navContainerClass: 'wygo-slidernav',
			navText: ['<span class="icon-chevron-left"></span>', '<span class="icon-chevron-right"></span>'],
		});
	}
	/* -------------------------------------
				THREE GRID SLIDER
		-------------------------------------- */
//	var _listar_gridslider = jQuery('[id="wygo-categoriespostslider"]');
//	var _listar_gridslider = jQuery(".wygo-categoriespostslider");
//	if(_listar_gridslider.hasClass('wygo-gridslider')){
//	_listar_gridslider.owlCarousel({
//	items: 4,
//	nav:true,
//	loop:true,
//	dots: true,
//	margin: 40,
//	autoplay: true,
//	dotsClass: 'wygo-sliderdots',
//	navClass: ['wygo-prev', 'wygo-next'],
//	navContainerClass: 'wygo-slidernav',
//	navText: ['<span class="icon-arrow-left2"></span>', '<span class="icon-arrow-right2"></span>'],
//	responsive : {
//	// breakpoint from 0 up
//	0 : {items:1,},
//	// breakpoint from 640 up
//	640 : {items:2,},
//	// breakpoint from 1024 up
//	1024 : {items:3,},
//	// breakpoint from 1310 up
//	1310 : {items:4,},
//	}
//	});
//	}
	/*--------------------------------------
				TOGGLE INNER PAGE SEARCH
		--------------------------------------*/
//	if(jQuery('#wygo-btnsearchtoggle').length > 0){
//	jQuery('#wygo-innersearch').slideDown();
//	jQuery('#wygo-btnsearchtoggle').on('click', function(){
//	jQuery('#wygo-innersearch').slideToggle();
//	});
//	}
	/*--------------------------------------
				ADVANCE FEATURES TOGGLE
		--------------------------------------*/
	if(jQuery('#wygo-btnadvancefeatures').length > 0){
		jQuery('#wygo-btnadvancefeatures').on('click', function(){
			jQuery('#wygo-advancefitures').slideToggle();
		});
	}
	/*--------------------------------------
				Google Map
		--------------------------------------*/
//	function initialize(){
//	var _listar_locationmap = jQuery('.wygo-locationmap');
//	var _listar_postlocationmap = jQuery('#wygo-postlocationmap');
//	var gmapStyles = [
//	{"featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }]},
//	{"featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "visibility": "off" }]},
//	{"featureType": "transit", "elementType": "labels.text", "stylers": [{ "visibility": "off" }]},
//	{"featureType": "road", "elementType": "labels.text", "stylers": [{ "visibility": "on" }]},
//	{"featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#7b7b7b" }]},
//	{"featureType": "road", "elementType": "labels.text", "stylers": [{ "color": "#7b7b7b" }]},
//	{"featureType": "road", "elementType": "labels.text", "stylers": [{ "color": "#7b7b7b" }]},
//	{"featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }]},
//	{"featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "color": "#7b7b7b" }]},
//	{"featureType": "road.highway", "elementType": "labels", "stylers": [{ "visibility": "off" }]},
//	{"featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }]},
//	{"featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#2b2b2b" }]},
//	{"featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "color": "#2b2b2b" }]},
//	{"featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#2b2b2b" }]},
//	{"featureType": "water", "elementType": "geometry", "stylers": [{ "visibility": "on" }]},
//	{"featureType": "water", "elementType": "labels.text", "stylers": [{ "color": "#2b2b2b" }]},
//	{"featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#2b2b2b" }]},
//	{"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"},{"color": "#2b2b2b"}]},
//	{"featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#333" }]},
//	{"featureType": "administrative", "elementType": "labels", "stylers": [{ "color": "#333" }]},
//	{"featureType": "administrative.locality", "elementType": "labels.text.stroke", "stylers": [{ "color": "#333" }]},
//	{"featureType": "transit.line", "stylers": [ { "visibility": "off" }]},
//	{"featureType": "landscape.natural", "stylers": [ { "visibility": "off" }]},
//	{"featureType": "landscape.natural", "stylers": [ { "visibility": "on" },{ "color": "#2b2b2b" }]},
//	{"featureType": "administrative.province", "elementType": "geometry", "stylers": [{ "color": "#2b2b2b" }]},
//	{"elementType": "geometry.fill", "stylers": [ { "color": "#2b2b2b" }]},
//	{"featureType": "poi", "elementType": "geometry", "stylers": [{ "visibility": "off" }]},
//	{"featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "visibility": "off" }]},
//	{"featureType": "landscape", "elementType": "labels.text", "stylers": [{ "visibility": "off" }]},
//	{"featureType": "administrative", "elementType": "labels", "stylers": [{ "visibility": "off" }]},
//	];
//	_listar_locationmap.gmap3({
//	marker: {
//	address: '1600 Elizabeth St, Melbourne, Victoria, Australia',
//	options: {
//	title: 'Robert Frost Elementary School',
//	icon: "images/mapmarker.png",
//	animation: google.maps.Animation.BOUNCE,
//	}
//	},
//	map: {
//	options: {
//	zoom: 16,
//	styles: gmapStyles,
//	scaleControl: true,
//	scrollwheel: false,
//	mapTypeControl: false,
//	disableDefaultUI: true,
//	navigationControl: false,
//	streetViewControl: false,
//	disableDoubleClickZoom: true,
//	}
//	}
//	});
//	_listar_postlocationmap.gmap3({
//	marker: {
//	address: '1600 Elizabeth St, Melbourne, Victoria, Australia',
//	options: {
//	title: 'Robert Frost Elementary School',
//	icon: "images/mapmarker.png",
//	animation: google.maps.Animation.BOUNCE,
//	}
//	},
//	map: {
//	options: {
//	zoom: 16,
//	styles: gmapStyles,
//	scaleControl: true,
//	scrollwheel: false,
//	mapTypeControl: false,
//	disableDefaultUI: true,
//	navigationControl: false,
//	streetViewControl: false,
//	disableDoubleClickZoom: true,
//	}
//	}
//	});
//	}
//	if(jQuery('.wygo-locationmap').length > 0){
//	initialize();
//	}
//	if(jQuery('#wygo-postlocationmap').length > 0){
//	jQuery('a[href="#location"]').on('click', function (e) {
//	initialize();
//	});
//	}
	/*--------------------------------------
				VIDEO POPUP BOX
		--------------------------------------*/
	if(jQuery('#lister-video').length > 0){
		jQuery('#lister-video').YouTubePopUp();
	}
	/*--------------------------------------
				PRICE RANGE SLIDER
		--------------------------------------*/
	if(jQuery('.wygo-rangeslider').length > 0){
		jQuery('.wygo-rangeslider').bootstrapSlider({
			min: 0,
			max: 120000,
			value: 65860,
			tooltip: 'always',
			formatter: function(value) {
				return '$'+value;
			}
		});
	}
	/*--------------------------------------
				DISTANCE RANGE SLIDER
		--------------------------------------*/
	if(jQuery('#wygo-distancerangeslider').length > 0){
		jQuery("#wygo-distancerangeslider").bootstrapSlider({
			min: 1,
			max: 20,
			value: 5,
//			tooltip: 'always',
			formatter: function(value) {
				return value+'km';
			}
		});
	}
	/*--------------------------------------
				TTHEME TOOLTIP
		--------------------------------------*/
	if(jQuery('[data-toggle="tooltip"]').length > 0){
		jQuery('[data-toggle="tooltip"]').tooltip()
	}
	/*--------------------------------------
				MASONRY TESTIMONIAL
		--------------------------------------*/
	if(jQuery('#wygo-testimonials').length > 0){
		var _listar_testimonials = jQuery('#wygo-testimonials');
		_listar_testimonials.isotope({
			itemSelector: '.wygo-testimonial',
		});
	}
	/*--------------------------------------
				COMMING SOON COUNTER
		 -------------------------------------*/
	if(jQuery('#wygo-comingsooncounter').length > 0){
		// Set the date we're counting down to
		var countDownDate = new Date("Apr 31, 2018 24:00:00").getTime();
		// Update the count down every 1 second
		var x = setInterval(function() {
			// Get todays date and time
			var now = new Date().getTime();
			// Find the distance between now an the count down date
			var distance = countDownDate - now;
			// Time calculations for days, hours, minutes and seconds
			var days = Math.floor(distance / (1000 * 60 * 60 * 24));
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);
			// Display the result in an element with id="demo"
			document.getElementById("wygo-comingsooncounter").innerHTML = "<ul><li><div class='wygo-holder'><h3>" + days + "</h3><h4>Days</h4></div></li><li><div class='wygo-holder'><h3>" + hours + "</h3><h4>Hours</h4></div></li><li><div class='wygo-holder'><h3>" + minutes + "</h3><h4>Mins</h4></div></li><li><div class='wygo-holder'><h3>" + seconds + "</h3><h4>Secs</h4></div></li></ul>";
			// If the count down is finished, write some text
			if (distance < 0) {
				clearInterval(x);
				document.getElementById("wygo-comingsooncounter").innerHTML = "EXPIRED";
			}
		}, 1000);
	}
	/*--------------------------------------
				CHOSEN DROPDOWN
		--------------------------------------*/
//	jQuery( document ).ready(function() {
//	var _listar_chosendropdown = jQuery('[id="wygo-categorieschosen"], [id="wygo-locationchosen"], [id="wygo-subscriptionchosen"]');
//	if(_listar_chosendropdown.hasClass('wygo-chosendropdown')){
//	_listar_chosendropdown.chosen();
//	}
//	});
	/*--------------------------------------
				SHARE ICONS TOGGLE
		--------------------------------------*/
	var _bt_btnshare = jQuery('.wygo-btnshare');
	_bt_btnshare.on('click', function(event) {
		event.preventDefault();
		var _bt_shareicons = jQuery('.wygo-shareicons');
		jQuery(this).parent('.wygo-btnquickinfo').toggleClass('wygo-showicon');
	});
	/*--------------------------------------
				MAP CLUSTRING INITIALIZE
		--------------------------------------*/
	if(jQuery('.wygo-listingmap').length > 0){
//		sp_init_map_script('wygo-listingmap');
	}
	/*--------------------------------------
				POST GALLERY MASONRY
		--------------------------------------*/
	jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var _listar_postgallery = jQuery('#wygo-postgallery');
		_listar_postgallery.isotope({
			itemSelector: '.wygo-masnory',
		});
	});
	/* -------------------------------------
				RELATED LISTING SLIDER
		-------------------------------------- */
	if(jQuery('#wygo-relatedlistingslider').length > 0){
		var _listar_relatedlistingslider = jQuery('#wygo-relatedlistingslider');
		_listar_relatedlistingslider.owlCarousel({
			items: 3,
			nav:true,
			loop:true,
			dots: true,
			margin: 40,
			autoplay: true,
			dotsClass: 'wygo-sliderdots',
			navClass: ['wygo-prev', 'wygo-next'],
			navContainerClass: 'wygo-slidernav',
			navText: ['<span class="icon-arrow-left2"></span>', '<span class="icon-arrow-right2"></span>'],
			responsive : {
				// breakpoint from 0 up
				0 : {items:1,},
				// breakpoint from 640 up
				640 : {items:2,},
				// breakpoint from 1024 up
				1024 : {items:3,}
			}
		});
	}
	/* -------------------------------------
				SINGLE PAGE NAVIGATION
		-------------------------------------- */
//	if(jQuery('#wygo-themetabnav').length > 0){
//	var lastId, topMenu = jQuery(".wygo-themetabnav"), topMenuHeight = topMenu.outerHeight()+15,
//	menuItems = topMenu.find("a"),
//	scrollItems = menuItems.map(function(){
//	var item = jQuery(jQuery(this).attr("href"));
//	if (item.length) { return item; }
//	});
//	menuItems.click(function(e){
//	var href = jQuery(this).attr("href"), offsetTop = href === "#" ? 0 : jQuery(href).offset().top-topMenuHeight+1;
//	jQuery('html, body').stop().animate({
//	scrollTop: offsetTop
//	}, 300);
//	e.preventDefault();
//	});
//	jQuery(window).scroll(function(){
//	var fromTop = jQuery(this).scrollTop()+topMenuHeight;
//	var cur = scrollItems.map(function(){
//	if (jQuery(this).offset().top < fromTop)
//	return this;
//	});
//	cur = cur[cur.length-1];
//	var id = cur && cur.length ? cur[0].id : "";
//	if (lastId !== id) {
//	lastId = id;
//	menuItems.parent().removeClass('wygo-active').end().filter("[href='#"+id+"']").parent().addClass('wygo-active');
//	}
//	});
//	}
//	if(jQuery('#wygo-themetabnav').length > 0){
//	var topPosition = jQuery('#wygo-themetabnav').offset().top - 100;
//	jQuery(window).on( 'scroll', function(){
////	console.log(topPosition);
//	if (jQuery(window).scrollTop() >= topPosition) {
//	jQuery('#wygo-fixedtabnav').addClass('wygo-shownav');
//	} else {
//	jQuery('#wygo-fixedtabnav').removeClass('wygo-shownav');
//	}
//	});
//	}
	/* -------------------------------------
				SHOW TOOLTIP
		-------------------------------------- */
	if(jQuery('.wygo-range').length > 0){
		jQuery('.wygo-range > .wygo-themetooltip').tooltip('show');
	}
	/* -------------------------------------
				STICK IN PARENT
		-------------------------------------- */
	if(jQuery('.wygo-mapclustring').length > 0){
//		var _listar_mapclustring = jQuery(".wygo-mapclustring");
//		_listar_mapclustring.stick_in_parent({
//		offset_top: 80,
//		});
	}
	/* -------------------------------------
				FIXED HEADER ON SCROLL
		-------------------------------------- */
	var _listar_header = jQuery('[id="wygo-header"]');
	if(_listar_header.hasClass('wygo-fixedheader')){
		jQuery(window).scroll(function(){
			if (jQuery(this).scrollTop() > 5) {
				_listar_header.addClass('wygo-fixed');
			} else {
				_listar_header.removeClass('wygo-fixed');
			}
		});
	}
	/*--------------------------------------
				PRETTY PHOTO GALLERY			
		--------------------------------------*/
	jQuery("a[data-rel]").each(function () {
		jQuery(this).attr("rel", jQuery(this).data("rel"));
	});
	jQuery("a[data-rel^='prettyPhoto']").prettyPhoto({
		animation_speed: 'normal',
		theme: 'dark_square',
		slideshow: 3000,
		autoplay_slideshow: false,
		social_tools: false
	});
	/*--------------------------------------
				STICKY SIDEBAR					
		--------------------------------------*/
//	if(jQuery('#wygo-stickysidebar').length > 0){
//	jQuery('#wygo-stickysidebar').stickySidebar({
//	topSpacing: 0,
//	bottomSpacing: 90,
//	resizeSensor: true,
//	stickyClass: 'wygo-fixedsidebar',
//	containerSelector: '#wygo-detailcontent',
//	innerWrapperSelector: '.sidebar__inner',
//	});
//	}
//	jQuery(window).resize(function() {
//	/*if(jQuery('#wygo-stickysidebar').length > 0){*/
//	if (screen.width < 768) {
//	var stickySidebar = new StickySidebar('#wygo-stickysidebar');
//	stickySidebar.destroy();
//	}
//	/*}*/
//	});
	/*--------------------------------------
				HEADER SHOW HIDE ON SCROLL		
		--------------------------------------*/
	jQuery(window).resize(function() {
		if(jQuery('.cd-auto-hide-header').length > 0){
			if (screen.width < 639) {
				jQuery('body').css({
					'padding-top': '139px',
				});
			}else{
				jQuery('body').css({
					'padding-top': '80px',
				});
			}
		}
	});
	/*--------------------------------------
				DASHBOARD MENU					
		--------------------------------------*/
	if(jQuery('#wygo-btnmenutoggle').length > 0){
		jQuery("#wygo-btnmenutoggle").on('click', function(event) {
			event.preventDefault();
			jQuery('.wygo-wrapper').toggleClass('wygo-openmenu');
			jQuery('body').toggleClass('wygo-noscroll');
			jQuery('.wygo-navdashboard ul.sub-menu').hide();

			if(jQuery(this).find(".fa").hasClass('fa-angle-right')) {
				jQuery(this).find(".fa").removeClass('fa-angle-right').addClass('fa-angle-left');
			} else if(jQuery(this).find(".fa").hasClass('fa-angle-left')) {
				jQuery(this).find(".fa").removeClass('fa-angle-left').addClass('fa-angle-right');
			}
		});
	}
	/*--------------------------------------
				Dashboard Tabs Steps			
		--------------------------------------*/
	/*if(jQuery('#wygo-addlistingsteps').length > 0){
			jQuery("#wygo-addlistingsteps").steps({
				headerTag: ".wygo-steptitle",
				bodyTag: "section",
				titleTemplate: '<span class="number">#index#</span>#title#',
				onStepChanged: function () {
					jQuery('.steps .current').nextAll().removeClass('done').addClass('disabled');
				}
			});
		}*/
	/*--------------------------------------
				COUNTER							
		--------------------------------------*/
	if(jQuery('.wygo-statistics').length > 0){
		jQuery('.wygo-statistics').appear(function () {
			jQuery('.wygo-statistics li h3').countTo();
		});
	}
	/*--------------------------------------
				TINYMCE WYSIWYG EDITOR			
		--------------------------------------*/
//	if(jQuery('#wygo-tinymceeditor').length > 0){
//	tinymce.init({
//	selector: 'textarea#wygo-tinymceeditor',
//	height: 314,
//	menubar: false,
//	theme: 'modern',
//	plugins: [ 'advlist autolink lists link image charmap print preview hr anchor pagebreak', 'searchreplace wordcount visualblocks visualchars code fullscreen', 'insertdatetime media nonbreaking save table contextmenu directionality', 'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc help'],
//	toolbar: 'insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
//	});
//	}
	/*--------------------------------------
				JQUERY SORTABLE					
		--------------------------------------*/
//	if(jQuery('#wygo-sortable').length > 0){
//	var listar_sortable = document.getElementById("wygo-sortable");
//	var sort = Sortable.create(listar_sortable, {
//	animation: 150,
//	handle: '.wygo-arangeslot',
//	filter: '.wygo-btndelete',
//	onFilter: function (evt) {
//	var el = sort.closest(evt.item);
//	el && el.parentNode.removeChild(el);
//	}
//	/*onClone: function (evt) {
//	var origEl = evt.item;
//	var cloneEl = evt.clone;
//	}*/
//	});
//	}
	/*--------------------------------------
				GOOGLE CHARTS					
		--------------------------------------*/
//	if(jQuery('#wygo-donutchart').length > 0){
//	google.charts.load("current", {packages:["corechart"]});
//	google.charts.setOnLoadCallback(drawChart);
//	function drawChart() {
//	var data = google.visualization.arrayToDataTable([
//	['Task', 'Hours per Day'],
//	['Transactions',	67],
//	['New Visits',		10],
//	['Bounce',			23],
//	]);
//	var options = {
//	title: '',
//	pieHole: 0.5,
//	width: '100%',
//	height: 356,
//	showLables: 'true',
//	pieSliceText: "none",
//	pieSliceText: 'value',
//	pieSliceBorderColor: "none",
//	tooltip: { trigger: "none"},
//	tooltip : {trigger: 'none'},
//	pieSliceTextStyle: {
//	fontSize: 20,
//	color: '#fff',
//	},
//	legend: {
//	position: 'right',
//	alignment: 'center',
//	},
//	chartArea: {
//	top: '10%',
//	left: '5%',
//	width:"90%",
//	height:"90%",
//	},
//	tooltip: { trigger:'none' },
//	animation: {duration:800,easing:'in'},
//	colors: ['#ea3986','#f98925','#18a4e1'],
//	fontName : 'Saira',
//	};
//	var chart = new google.visualization.PieChart(document.getElementById('wygo-donutchart'));
//	chart.draw(data, options);
//	}
//	}
//	if(jQuery('#wygo-competingchart').length > 0){
//	google.charts.load('current', {'packages':['corechart']});
//	google.charts.setOnLoadCallback(drawChart);
//	function drawChart() {
//	var data = google.visualization.arrayToDataTable([
//	['Days',		'Posts Visits'],
//	['Monday', 		200],
//	['Tuesday', 	1800],
//	['Wednesday',	1300],
//	['Thursday',	2900],
//	['Friday',		3300],
//	['Saturday',	3800],
//	['Sunday',		4300],
//	]);
//	var options = {
//	title: '',
//	vAxis: { minValue: 200 },
//	legend: { position: 'none' },
//	chartArea:{
//	top: '5%',
//	left: '5%',
//	width:"90%",
//	height:"90%",
//	},
//	pointSize: 10,
//	pointShape: 'circle',
//	fontName : 'Saira',
//	};
//	var chart = new google.visualization.AreaChart(document.getElementById('wygo-competingchart'));
//	chart.draw(data, options);
//	}
//	}

	/*--------------------------------------
			ADD OR REMOVE CLASS HOME HEADER		
		--------------------------------------*/
	if(jQuery('.wygo-home').length > 0){
		var _listar_header = jQuery('.wygo-home .wygo-header');
		jQuery(window).on('scroll', function() {
			var scroll = jQuery(window).scrollTop();
			if (scroll >= 200) {
				_listar_header.addClass('listar_darkheader');
			} else {
				_listar_header.removeClass('listar_darkheader');
			}
		});
	}
	/*--------------------------------------
				AUTO COMPLETE JQUERY
		--------------------------------------*/
//	if(jQuery('#wygo-autosearch').length > 0){
//	jQuery('#wygo-autosearch').autoComplete({
//	minChars: 1,
//	source: function(term, suggest){
//	term = term.toLowerCase();
//	var choices = ['ActionScript', 'AppleScript', 'Asp', 'Assembly', 'BASIC', 'Batch', 'C', 'C++', 'CSS', 'Clojure', 'COBOL', 'ColdFusion', 'Erlang', 'Fortran', 'Groovy', 'Haskell', 'HTML', 'Java', 'JavaScript', 'Lisp', 'Perl', 'PHP', 'PowerShell', 'Python', 'Ruby', 'Scala', 'Scheme', 'SQL', 'TeX', 'XML'];
//	var suggestions = [];
//	for (i=0;i<choices.length;i++)
//	if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
//	suggest(suggestions);
//	}
//	});
//	if (~window.location.href.indexOf('http')) {
//	(function() {var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;po.src = 'https://apis.google.com/js/plusone.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);})();
//	(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4&appId=114593902037957";fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));
//	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
//	jQuery('#github_social').html('\
//	<iframe style="float:left;margin-right:15px" src="//ghbtns.com/github-btn.html?user=Pixabay&repo=jQuery-autoComplete&type=watch&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="110" height="20"></iframe>\
//	<iframe style="float:left;margin-right:15px" src="//ghbtns.com/github-btn.html?user=Pixabay&repo=jQuery-autoComplete&type=fork&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="110" height="20"></iframe>\
//	');
//	}
//	}
//	});
	/*--------------------------------------
					PRELOADER
		--------------------------------------*/
//	jQuery(window).load(function() {
//	jQuery(".preloader-outer").fadeIn("slow");
//	jQuery(".pins").fadeIn("slow");
//	jQuery( document ).ready(function() {
//	jQuery(".preloader-outer").fadeOut("slow");
//	jQuery(".pins").fadeOut("slow");
//	});
//	});
}