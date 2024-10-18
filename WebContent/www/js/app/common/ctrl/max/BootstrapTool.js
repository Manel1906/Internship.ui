var var_gl_tab_active	= null;

function do_gl_req_tab_active(parentNode){	
	var_gl_tab_active	= parentNode.find(".nav-tabs-custom li.active").not(".paginate_button").find("a").attr("href");	
}

function do_gl_init_tabActive(){
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

function do_gl_enhance_within(parentNode, options) {
	try{
		do_gl_apply_right(parentNode);
	}catch(e){
		console.log(e);
	}
	

	try{
		do_gl_init_datatable(parentNode, options);	
	}catch(e){
		console.log(e);
	}

	try{
		do_gl_init_jqueryUI(parentNode, options);
	}catch(e){
		console.log(e);
	}

	try{
		do_gl_init_datetimePlugin(parentNode);
	}catch(e){
		console.log(e);
	}

	try{
		do_gl_init_inputMaskPlugin(parentNode);
	}catch(e){
		console.log(e);
	}
//	do_gl_init_fileinputPlugin(parentNode, options);

	try{
		do_gl_init_jqueryNumpadPlugin(parentNode);
		do_gl_init_touchKeyboardPlugin(parentNode, options);
	}catch(e){
		console.log(e);
	}


	try{
		do_gl_init_tabActive();
	}catch(e){
		console.log(e);
	}
//	do_gl_init_affix(parentNode);

	//from UserRightTool
	

	try{
		do_gl_init_box(parentNode);
		do_gl_init_show_box(parentNode, options);
	}catch(e){
		console.log(e);
	}

//	Handle jQuery plugin naming conflict between jQuery UI and Bootstrap
//	$.widget.bridge('uibutton', $.ui.button);
//	$.widget.bridge('uitooltip', $.ui.tooltip);

	try{
		do_gl_init_bootstrap_select(parentNode);
		do_gl_init_choosen(parentNode);	
		do_gl_init_selectPlugin(parentNode);
	}catch(e){
		console.log(e);
	}

}

//--------------------------------------------------------------------------------
function do_gl_init_bootstrap_select(parentNode){
	var children = parentNode.find(".bootstrap-select");
	children.selectpicker('refresh');
}

function do_gl_init_choosen(parentNode){
	var children = parentNode.find(".chosen");
	children.chosen();
}
//--------------------------------------------------------------------------------
function do_gl_init_show_box(parentNode, options){
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
function do_gl_init_affix(parentNode) {
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
function do_gl_init_box(parentNode) {
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
function do_gl_init_datatable(parentNode, options) {
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
						sUrl	: UI_URL_ROOT + "www/js/lib/datatables/"+ filename
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
//	$(this).css("width", "100%")
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
function do_gl_init_datetimePlugin(parentNode, dateFormat) {
	//Date range picker
	if (!dateFormat) dateFormat ='DD/MM/YYYY HH:mm';

	var children01 = parentNode.find(".daterangepicker");

	if(children01.length>0) {	
		children01.each(function(){
//			$(this).daterangepicker();

			$(this).daterangepicker({
				timePicker: true, 
				timePickerIncrement: 30, 
				format: dateFormat,
//				format: 'MM/DD/YYYY h:mm A'
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
				todayHighlight: true
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
	//Datetimepicker
	var children04 = parentNode.find(".datetimepicker");

	if(children04.length>0) {	
		children04.each(function(){
			$(this).datetimepicker({
				locale: App.language
			});
		});
	}

///////////////////////////////////////////////////
	//Date picker free
	var children05 = parentNode.find(".datepickersell");

	if(children05.length>0) {	
		children05.each(function(){
			// disable past dates before today
			function truncateDate(date) {
				return new Date(date.getFullYear(), date.getMonth(), date.getDate());
			}

			var dateP = $(this).datepicker({
				autoclose: true,
				language: App.language,
				todayHighlight: true,
				startDate: truncateDate(new Date())
			});

			var compare = $(this).attr("data-compare");
			if(compare) {
				var compareParts = compare.split(' ');

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
}


//-------------------------------------------------------------------------------------------------------
//function do_gl_init_date_time_picker(idDiv, minDate, maxDate) {
function do_gl_init_date_time_picker(idDivFrom, idDivTo, isBasic, isSave, dtBegin, dtEnd) {	

//	if ( minDate == null ) {
//	if ( maxDate ==  null) {
//	$(idDiv).datetimepicker({
//	locale: App.language,
//	keepOpen: false,
//	useCurrent: false,
//	});
//	} else {
//	$(idDiv).datetimepicker({
//	locale: App.language,
//	keepOpen: false,
//	useCurrent: false,
//	maxDate: maxDate,
//	});
//	}
//	} else {
//	if ( maxDate ==  null) {
//	$(idDiv).datetimepicker({
//	locale: App.language,
//	keepOpen: false,
//	useCurrent: false,
//	minDate: minDate,
//	});
//	} else {
//	$(idDiv).datetimepicker({
//	locale: App.language,
//	keepOpen: false,
//	useCurrent: false,
//	minDate, minDate,
//	maxDate: maxDate,
//	});
//	}
//	}

	if (!App.data.dateTimePicker) App.data.dateTimePicker = {};

	$(idDivFrom).datetimepicker({
		locale		: App.language,
		keepOpen	: false,
		useCurrent	: false,
		minDate		: !dtBegin	?"1900-01-01T00:00:00.000Z":dtBegin,
				maxDate		: !dtEnd	?"2999-12-31T23:59:59.000Z":dtEnd,
						format		: 'DD/MM/YYYY HH:mm:ss',
	});
	$(idDivTo).datetimepicker({
		locale		: App.language,
		keepOpen	: false,
		useCurrent	: false,
		minDate		: !dtBegin	?"1900-01-01T00:00:00.000Z":dtBegin,
				maxDate		: !dtEnd	?"2999-12-31T23:59:59.000Z":dtEnd,
						format		: 'DD/MM/YYYY HH:mm:ss',
	});


	$(idDivFrom).on("dp.change", function (e) {
		if(isBasic && $(".input-datetime-detail").length > 0) {
			$.each($(".input-datetime-detail"), function() {
				$(this).data("DateTimePicker").clear();
			});
		}

		$(idDivTo).data("DateTimePicker").minDate(e.date);
		if(isSave)	App.data.dateTimePicker.dtBegin = e.date;
	});

	$(idDivTo).on("dp.change", function (e) {
		if(isBasic && $(".input-datetime-detail").length > 0) {
			$.each($(".input-datetime-detail"), function() {
				$(this).data("DateTimePicker").clear();
			});
		}

		$(idDivFrom).data("DateTimePicker").maxDate(e.date);
		if(isSave)	App.data.dateTimePicker.dtEnd = e.date;
	});

}

//-------------------------------------------------------------------------------------------------------
function do_gl_linker_date_picker(idBegin, idEnd, isSave) {
	if ( isSave) {
		$(idBegin).on("dp.change", function (e) {
			$(idEnd).data("DateTimePicker").minDate(e.date);


			App.data.dateTimePicker.dtBegin = e.date;
		});

		$(idEnd).on("dp.change", function (e) {
			$(idBegin).data("DateTimePicker").maxDate(e.date);

			App.data.dateTimePicker.dtEnd = e.date;
		});
	} else {
		$(idBegin).on("dp.change", function (e) {
			$(idEnd).data("DateTimePicker").minDate(e.date);
		});

		$(idEnd).on("dp.change", function (e) {
			$(idBegin).data("DateTimePicker").maxDate(e.date);
		});
	}
}


function on_focus_change_range_datepicker(idDiv, minDate, maxDate) {
	if (minDate == null || minDate == undefined || maxDate == null || maxDate == undefined) {

		$(idDiv).focus(function(){
			$( idDiv ).datepicker( "option", "minDate", null);
			$( idDiv ).datepicker( "option", "maxDate", null);

			$(idDiv).data("DateTimePicker").minDate(App.data.dateTimePicker.dtBegin);
			$(idDiv).data("DateTimePicker").maxDate(App.data.dateTimePicker.dtEnd);
		});
	} else {

		$( idDiv ).datepicker( "option", "minDate", null);
		$( idDiv ).datepicker( "option", "maxDate", null);

		$(idDiv).data("DateTimePicker").minDate(minDate);
		$(idDiv).data("DateTimePicker").maxDate(maxDate);
	}
}


//-------------------------------------------------------------------------------------------------------
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
						sUrl	: UI_URL_ROOT+ "www/js/lib/datatables/"+ filename
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
//					if(add_funct) {
//					add_funct(new_table);
//					} else {
//					var newData 	= $.extend(true, {}, default_new_line);
//					var rownode 	= new_table.row.add(newData).draw(false).node();

//					do_gl_enable_edit($(rownode));
//					}
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

