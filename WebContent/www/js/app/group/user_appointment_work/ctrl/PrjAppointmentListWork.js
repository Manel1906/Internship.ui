define([
	'text!group/user_appointment_work/tmpl/Prj_Appointment_View_Work.html',
	'text!group/user_appointment_work/tmpl/Prj_Appointment_New_Work.html',
	'text!group/user_appointment_work/tmpl/Prj_Appointment_Show_Work.html',
	'text!group/user_appointment_work/tmpl/Prj_Appointment_Show_Department.html'

	], function(
			Prj_Appointment_View_Work, 
			Prj_Appointment_New_Work,
			Prj_Appointment_Show_Work,
			Prj_Appointment_Show_Department
		
	){

	var PrjAppointmentListWork = function (grpName, header, content, footer) {
		const tmplName						= App.template.names;
		const tmplCtrl						= App.template.controller;
		var pr_grpName						= grpName?grpName:"CalendarWork";
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS_GROUP_DYN	= "ServiceNsoGroup";
		const pr_SV_GROUP_LIST_DYN			= "SVLstSearch"; 
		const pr_SERVICE_AUT_CLASS			= "ServiceAutUser";

		const pr_SV_USER_SEARCH				= "SVLstForCalend";
		const pr_SV_DOCTOR_SEARCH			= "SVLstByGrp";
		const pr_SV_GET_MEMBER				= "SVGetMember";

		const self							= this;
		//-----------------------------------------------------------------------------------
		var pr_ctr_Main 					= null;
		var pr_ForDesktop					= true;
		var pr_ForVertial					= false;
		
		var pr_SEARCHKEY					= "";
		var pr_GROUP						= null;

		var pr_lstAvailableTime				=	[];
		
		var TIME_RANGE						= 3;
		var TYP_01_WORK_PLAN				= 900;
		var TYP_02_MEET_CLIENT				= 100;
		var TYP_01_DEPARTMENT				= 300;
		const pr_TYP_MEMBER 				= 2;
		const ONLINE		   				= 1;
		const STAT_ACTIVE    				= 1;
		const STAT_DESACTIVE    			= 2;
		var members 						= {};
//		var membersDel 						= [];
		let files							= {files: []};
		var customers 						= [];
		var customersAdd 				    = [];
		var customersDel                    = [];
		var prj_work						= null;
		var dp_schedule						= null;
		var locale							= "vi-vn";
		var prData                          = null
		let pr_lastAppointment 				= []
		let pr_Color 						= null;
		let pr_cDaily 						= 0
		let pr_cWeeklyRemaining 			= 0
		let pr_dtBegin						= null
		var pr_ID							= null;
		var lock							= false;
		var searchIdMember 	 				= null;
		const previousPositions 			= {};


		const pr_stat_pending				= 0;
		const pr_stat_active				= 1;
		const pr_stat_accept				= 3;
		let prjSearch						= null;

		//--------------------APIs--------------------------------------//
		this.do_lc_init	= function(){
			pr_ctr_Main 								= App.controller.UI.Main;

			tmplName.PRJ_APPOINTMENT_VIEW				= 	"Prj_Appointment_View_Work";
			tmplName.PRJ_APPOINTMENT_NEW				= 	"Prj_Appointment_New_Work";
			tmplName.PRJ_APPOINTMENT_SHOW				= 	"Prj_Appointment_Show_Work";
			tmplName.PRJ_APPOINTMENT_SHOW_DEPARTMENT	= 	"Prj_Appointment_Show_Department";

			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_APPOINTMENT_VIEW			, Prj_Appointment_View_Work);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_APPOINTMENT_NEW			, Prj_Appointment_New_Work);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_APPOINTMENT_SHOW			, Prj_Appointment_Show_Work);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_APPOINTMENT_SHOW_DEPARTMENT, Prj_Appointment_Show_Department);

		}

		//---------show-----------------------------------------------------------------------------
		var pr_grpPath 		= 'group/user_appointment_work';
		var pr_showed		= false;
		this.do_lc_show = function(){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback, []);
				pr_showed = true;
			}else {
				self.do_lc_show_callback();
			}
		};

		this.do_lc_show_callback = function(){    
			try{
				let params 				= req_gl_Url_Params();
				let {id, dt} 			= params;
				
				 pr_ID 					= id ;
				 pr_dtBegin 			= dt ;
	
											
				do_lc_load_view();
				do_register_locale_custom();
				
				do_build_schedulue(pr_lstAvailableTime , pr_dtBegin);
				do_lc_req_autocomplete_all();
				
				do_lc_bind_eventPage();
				do_get_list_ByAjax();
				$(document).prop('title',$.i18n('prj_project_sidebar_schedule'));
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "PrjAppointmentList", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_load_view = () => {	
			if ($(window).width() < 600) {
				pr_ForDesktop = false;
			}
			if ($(window).width() < $(window).height()) {
				pr_ForVertial = true;
			}
			
			$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_APPOINTMENT_VIEW, {forDesktop: pr_ForDesktop}));
		}
				
				
		const do_lc_init_element = function (e) {
			if (e) {
				if (e.files) files.files = e.files;
				let option		= {
						fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
						obj			: files//file existing here
				}
				do_gl_init_fileDropzone($("#div_prj_docs"), option);

				let dt01 = do_lc_handle_date(e.dtBegin);
				let dt02 = do_lc_handle_date(e.dtEnd);
				$("#dtpicker_Begin" ).datepicker( "setDate", dt01.dt);
				$("#dtpicker_End" 	).datepicker( "setDate", dt02.dt);
				$("#tmpicker_Begin"	).timepicker({//timepicker
					showMeridian: false,
					defaultTime : dt01.tm,
					icons		: {
						up		: "mdi mdi-chevron-up",
						down	: "mdi mdi-chevron-down"
					}
				});

				$("#tmpicker_End"	).timepicker({//timepicker
					showMeridian: false,
					defaultTime : dt02.tm,
					icons		: {
						up		: "mdi mdi-chevron-up",
						down	: "mdi mdi-chevron-down"
					}
				});

				do_lc_bind_event_dtInput()
			} else {
				let option		= {
						fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
						obj			: files//file existing here
				}
				do_gl_init_fileDropzone($("#div_prj_docs"), option);
				var now 	= new Date();
				var now30 	= new Date(now);
					now30.setMinutes(now.getMinutes() + 30);
				
				var now60 	= new Date(now);
					now60.setMinutes(now.getMinutes() + 60);
					now30 	= do_lc_handle_date (now30);
					now60 	= do_lc_handle_date (now60);
				
				$("#dtpicker_Begin" ).datepicker( "setDate", now30.dt);
				$("#dtpicker_End" 	).datepicker( "setDate", now30.dt);
				$("#tmpicker_Begin"	).timepicker({//timepicker
					showMeridian: false,
					defaultTime : now30.tm,
					icons		: {
						up		: "mdi mdi-chevron-up",
						down	: "mdi mdi-chevron-down"
					},
				});

				$("#tmpicker_End").timepicker({//timepicker
					showMeridian: false,
					defaultTime : now60.tm,
					icons		: {
						up		: "mdi mdi-chevron-up",
						down	: "mdi mdi-chevron-down"
					}
				});

				do_lc_bind_event_dtInput()
			}
		}

		const do_lc_bind_event_dtInput = () => {
			$( "#dtpicker_Begin" ).off("change").on("change", function() {
				const sDate = $(this).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate < sDate) $( "#dtpicker_End" ).val(sDate)
			})
			
			
			$("#tmpicker_Begin").off("change").on("change", function() {
				const sDate = $( "#dtpicker_Begin" ).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate != sDate) return;

				let sTimeArr = $(this).val().split(":")
				let eTimeArr = $( "#tmpicker_End" ).val().split(":")

				if(sTimeArr.length <= 0 || eTimeArr.length <= 0) return

				const sHour    = +sTimeArr[0]
				const sMinutes = +sTimeArr[1]
				const eHour    = +eTimeArr[0]
				const eMinutes = +eTimeArr[1]

				const sMinutesStr = sMinutes < 10 ? `0${sMinutes}` : sMinutes

						if(eHour < sHour) $( "#tmpicker_End" ).val(`${sHour}:${sMinutesStr}`)
						if(sHour == eHour && eMinutes < sMinutes) $( "#tmpicker_End" ).val(`${sHour}:${sMinutesStr}`)
			})


			$( "#dtpicker_End" ).off("change").on("change", function() {
				const eDate = $(this).val()
				const sDate = $( "#dtpicker_Begin" ).val()

				if(eDate < sDate) $( "#dtpicker_Begin" ).val(eDate)
			})
			$("#tmpicker_End").off("change").on("change", function() {
				const sDate = $( "#dtpicker_Begin" ).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate != sDate) return;

				let sTimeArr = $( "#tmpicker_Begin" ).val().split(":")
				let eTimeArr = $(this).val().split(":")

				if(sTimeArr.length <= 0 || eTimeArr.length <= 0) return

				const sHour 	= +sTimeArr[0]
				const sMinutes 	= +sTimeArr[1]
				const eHour 	= +eTimeArr[0]
				const eMinutes 	= +eTimeArr[1]

				const eMinutesStr = eMinutes < 10 ? `0${eMinutes}` : eMinutes

						if(eHour < sHour) $( "#tmpicker_Begin" ).val(`${eHour}:${eMinutesStr}`)
						if(sHour == eHour && eMinutes < sMinutes) $( "#tmpicker_Begin" ).val(`${sHour}:${eMinutesStr}`)
			})
		}

		
		const do_get_list_ByAjax = function(){	
			var ref 		= req_gl_Request_Content_Send("ServiceNsoGroup", "SVLstSearch");
			ref.typ01s 		= TYP_01_DEPARTMENT;
			ref.stats 		= STAT_ACTIVE;
			ref.hardLoad 	= false;
			var fSucces		= [];
			fSucces.push(req_gl_funct(		null, do_lc_show_list_ByAjax_Dyn, [true]));
			var fError 		= req_gl_funct(	null, do_lc_show_list_ByAjax_Dyn, [false]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);

		}
		const do_lc_show_list_ByAjax_Dyn = function(sharedJson, divList){
			const isSuccess = can_gl_AjaxSuccess(sharedJson);
			if(isSuccess) {
				const list = sharedJson[App['const'].RES_DATA] || {};
				let lst = list.lst || [];
				const data = { lst: lst };
				$("#department").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_APPOINTMENT_SHOW_DEPARTMENT, data));
				do_lc_req_autocomplete_all();
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_get"));
			}
		}

		//-------------------------------------------------------------------------------------------------
		var do_register_locale_custom = function () {
			DayPilot.Locale.register(
					new DayPilot.Locale('vi-vn', {
							dayNames		: ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'],
							dayNamesShort	: ['CN','Th2','Th3','Th4','Th5','Th6','Th7'],
							monthNames		: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
							monthNamesShort	: ['Thg 1','Thg 2','Thg 3','Thg 4','Thg 5','Thg 6','Thg 7','Thg 8','Thg 9','Thg 10','Thg 11','Thg 12'],
							timePattern		: 'HH:mm',
							datePattern		: 'dd/MM/yyyy',
							dateTimePattern	: 'dd/MM/yyyy HH:mm',
							timeFormat		: 'Clock24Hours',
							weekStarts		: 1
					}));
					
			let tmp = localStorage.getItem("locale");
			if (!tmp) 
				locale = "vi-vn";
			else 
				locale = tmp ;
		}

		function do_build_schedulue(pr_lstAvailableTime , dtBegin) {
			// var date = new Date(pr_savedObject_Step_1.dt).getTime() - 2*60*60*24*1000;
			// var startDate = getDateISOShort(new Date(date));
			if(dtBegin != undefined) {
				var startDate 	= dtBegin
				var dtEnd 		= new Date(startDate);
		        dtEnd.setDate(dtEnd.getDate() + 7);
				dtEnd 			= getDateISOShort(dtEnd);
				
			}else{
				var startDate 	= new Date();
				startDate.setDate(startDate.getDate() - 1); // get 2 days before
				startDate 		= getDateISOShort(startDate);
			}
		
			dp_schedule 		= new DayPilot.Calendar	("dp_schedule");
			
			
	//		do_get_availableTimeList(dp_schedule,startDate, dtEnd);

			dp_schedule.locale 						= locale;
			dp_schedule.showNonBusiness             = false;
			dp_schedule.showNonBusinessForceHours 	= true;
			dp_schedule.businessBeginsHour          = 7;
			dp_schedule.businessEndsHour            = 18;
			dp_schedule.viewType 					= "Week";
//			dp_schedule.viewType 					= "Days";

			console.log(pr_dtBegin);
			
			if(pr_dtBegin != null){
				dp_schedule.startDate 				= pr_dtBegin;
			}else{
				dp_schedule.startDate 				= startDate;
			}
			
			dp_schedule.days 						= TIME_RANGE*2+1;
			dp_schedule.eventClickHandling 			= "Select";
			dp_schedule.allowMultiSelect 			= false;
			dp_schedule.durationBarVisible 			= true;
			dp_schedule.weekStarts 					= 1;
			// dp_schedule.eventMoveHandling 		= "Disabled";
			// dp_schedule.eventResizeHandling 		= "Disabled";
			dp_schedule.timeRangeSelectedHandling 	= "Enable";
			dp_schedule.headerDateFormat 			= "ddd dd";
			dp_schedule.timeFormat 					= "Clock24Hours";
//			dp_schedule.cssOnly 					= false;
			dp_schedule.cssClassPrefix 				= "workadm";
//			dp_schedule.allowEventOverlap 			= false;
//			// add list of schedules
			dp_schedule.events.list 				= pr_lstAvailableTime;

			

			if (pr_ForDesktop){
			    dp_schedule.heightSpec 				= "BusinessHours";
			} else {
			    dp_schedule.height 					= "400";
			}

			dp_schedule.onBeforeCellRender = function(args) {
			 	var currentTime = new DayPilot.Date().getTime();
			    var cellStart = args.cell.start.getTime();
		        var cellEnd = args.cell.end.getTime();
			    if (currentTime >= cellStart && currentTime < cellEnd) {
			        args.cell.properties.cssClass = "workadm_now";
			    }
			
			};
			setInterval(function() {
			  const currentTime = new Date().toLocaleTimeString();
			  document.documentElement.style.setProperty('--current-time', `"${currentTime}"`);
			}, 1000);

			dp_schedule.onBeforeEventRender = function(args) {
				if(args.data.tags.type !== "overdue") {
					if(typeof args.data.obj.inf02 === 'string') {
						args.data.obj.inf02 = JSON.parse(args.data.obj.inf02);
					}

					let userColor = null;

					userColor = args.data.obj.inf02;

					if (userColor) {
					    args.data.borderColor = userColor.cl;
					    args.data.backColor = userColor.cl;
					    args.data.fontColor = "#ffffff";
					} else {
					    args.data.borderColor = args.data.color;
					    args.data.fontColor = "#000000";
					}
				}
				args.data.areas = [
					{ 	top			: 2, 
						right		: 2, 
						icon		: "icon-triangle-down", 
						visibility	: "Hover", 
						action		: "ContextMenu", 
						style		: "font-size: 12px; background-color: #f9f9f9; border: 1px solid #ccc; padding: 2px 2px 0px 2px; cursor:pointer;" 
					}
				];
				

				//args.data.backColor 	= pr_backColor_01;
				var div = "";
				if(args.data.members) {
					for (var key in args.data.members) {
						let item 			= args.data.members[key].mem;

												let textColor   = null;
						let textAvatar  = null
						if(!item.avatar){
							let first = item.login01.charAt(0);
							let last  = item.login01.charAt(item.login01.length - 1);
							let index = var_gl_alphabet.indexOf(first.toLowerCase());

							textColor = var_gl_colors[index];
							textAvatar= first + last;
						}

						let classCss = "";
						let opacity  = "";
						if(args.data.members[key].stat === 2 ){
							classCss = "text-decoration-line-through ";
							opacity  = "opacity-03"
						}

						let selOpt 			= `<div class='team-member member-item no-padding d-flex'>`;

						if(!item.avatar)	selOpt 			+= `<div class="rounded-circle avatar-xs text-white mx-1 text-uppercase text-center ${opacity}" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div><span class="tooltiptext ${classCss}">${item.name}</span>`;
						else 		        selOpt 			+= `<img src='${ item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs ${opacity}'/><span class="tooltiptext ${classCss}">${item.name}</span>`;
						selOpt 				+= `</div>`;
						div += selOpt;
					};
				}

				args.data.html = "<div class='row'><div class='col-1'><p><b>" + args.data.text + "</b></p> </div>" + "<div id='div_prj_list' class='row ml-auto mr-4'>" + div + "</div></div>" + "<p class='long-txt'><i>" + args.data.obj.inf02.desc + "</i></p>";
			};

			dp_schedule.onTimeRangeSelected = function (args) {
				if (!lock) {
			        do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_search_required'));
			        return;
			    }
				dp_schedule.clearSelection();
				const now = new Date();
				if (now > new Date(args.start.value) || now > new Date(args.end.value)) return;

				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_appointment_msg_title"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_APPOINTMENT_NEW, {}),
					autoclose	: true,
					buttons 	: {
						SEND 	: {
							lab 		: "<i class='mdi mdi-send'></i>",
							funct		: do_lc_create_appointment,
							autoclose	: true
						},
					},
					onClose		: () => {
						members 	= {};
//						membersDel  = [];
						files		= {files: []};
						customers   = [];
						customersAdd= [];
						customersDel= [];
					},
					css			: {
					    "max-width"	: "600px",
					    "min-width"	: "350px",
					    "display"	: "flex",
					    "margin"	: "auto"
					}
				});
				do_lc_build_view_member_mode_modify(false);
				do_lc_req_autocomplete();

				let option		= {
						fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
						obj			: files//file existing here
				}
				do_gl_init_fileDropzone($("#div_prj_docs"), option);

				let dt01 = do_lc_handle_date(new Date(args.start.value));
				let dt02 = do_lc_handle_date(new Date(args.end.value));

				$("#dtpicker_Begin" )	.datepicker( "setDate", dt01.dt);
				$("#dtpicker_End" 	)	.datepicker( "setDate", dt02.dt);
				$("#tmpicker_Begin"	)	.timepicker({//timepicker
					showMeridian: false,
					defaultTime : dt01.tm,
					icons		: {
						up		: "mdi mdi-chevron-up",
						down	: "mdi mdi-chevron-down"
					}
				});

				$("#tmpicker_End").timepicker({//timepicker
					showMeridian: false,
					defaultTime :dt02.tm,
					icons		: {
						up		: "mdi mdi-chevron-up",
						down	: "mdi mdi-chevron-down"
					}
				});
			};

			dp_schedule.onEventClick = function(args) {

				if(args.e.data.tags.type !== "overdue") {
					// var id 		= args.e.id();
					// var list 	= dp_schedule.events.list;
					// for(var i = 0 ; i < list.length ; i++){
					// 	list[i].backColor = {};
					// 	if(list[i].id === id) {
					// 		list[i].backColor = pr_backColor_02;
					// 	}else {
					// 		list[i].backColor = pr_backColor_01;
					// 	}
					// }
					// dp_schedule.events.list = list;
					// dp_schedule.update();
					// do_handleSCheduleClick(args.e.data);

					// $("#schedule_toolTip").show();
					// $("#schedule_toolTip span").html(args.e.data.toolTip);
					
//					if(!args.e.data.members || !Object.values(args.e.data.members).find(e => e.uId === App.data.user.id)) return
//					if(args.e.data.obj.val02) {
//						if (!/^https?:\/\//i.test(args.e.data.obj.val02)) {
//							args.e.data.obj.val02 = 'http://' + args.e.data.obj.val02;
//						}
//					}

					App.MsgboxController.do_lc_show({
						title		: $.i18n("prj_appointment_msg_title"),
						content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_APPOINTMENT_SHOW, args.e.data.obj),
						autoclose	: false,
						buttons		: "none",
						onClose		: () => {
							members 	= {};
//							membersDel  = [];
							files		= {files: []};
						},
						css: {
						    "max-width"	: "500px",
						    "min-width"	: "350px",
						    "display"	: "flex",
						    "margin"	: "auto"
						}
					});
					// build lst member
					do_lc_build_view_member(args.e.data.members, "#div_list_member"); 
					
					//---------------------------------------------------------------------------------------------------------------------------
					// Handle div file
//					var divFile = "";
//					if (args.e.data.obj.files) {
//						args.e.data.obj.files.forEach((e) => {
//							tmpl 	=  "<a href='" + e.path01  + "' target='_blank' class='mr-3 text-decoration-underline' download = " + e.name + " >" + e.name + "</a>";
//							divFile += tmpl;
//						});
//					}
//					if (divFile) {
//						$("#div_list_files").append(divFile)
//					} else {
//						$("#div_list_files_par").remove();
//					}
//					
//
//					// Handle div list customer
//					var divCustomer = "";
//					if(args.e.data.obj.val01) {
//						let data = JSON.parse(args.e.data.obj.val01);
//						for (let i=0; i < data.length; i++) {
//							let email  			= data[i];
//							let selOpt 			= `<div class='mr-1'  style='margin-bottom: 5px;'><button class="btn btn-secondary">${email}</button></div>`;
//							divCustomer += selOpt;
//						};
//					}
//					if (divCustomer) {
//						$("#div_list_email_customer").append(divCustomer)
//					} else {
//						$("#div_list_email_customer_par").remove();
//					}
//					
//					// Handle div link_direct
//					var divLink = "";
//					if(args.e.data.obj.val02) {
//					    let link = args.e.data.obj.val02;
//					    let selOpt 			= `<div class='mr-1'><a href="${link}">${link}</a></div>`;
//						divLink = selOpt;
//					}
//					if (divLink) {
//					    $("#div_link_direct").append(divLink)
//					} else {
//					    $("#div_link_direct_par").remove();
//					}
					//---------------------------------------------------------------------------------------------------------------------------
					
					var divButtonEdit 		= $("#div_button_edit"		);
					var divButtonDelete 	= $("#div_button_delete"	);
					var divButtonAccept 	= $("#div_button_accept"	);
					var divButtonDeny 		= $("#div_button_deny"		);
					var divButtonUnaccept 	= $("#div_button_unaccept"	).hide();
					var divButtonUndeny 	= $("#div_button_undeny"	).hide();
					const now 				= new Date();
					const isPastEvent 		= now >= new Date(args.e.data.start) || now >= new Date(args.e.data.end);
					if (isPastEvent) {
					    divButtonAccept	.hide();
					    divButtonDeny	.hide();
					    divButtonEdit	.hide();
					    divButtonDelete	.hide();
					}
					const isSuperAdmin 	= App.controller.common.Login && App.controller.common.Login.can_lc_User_SuperAdmin();
					if (isSuperAdmin) {
						divButtonAccept	.hide();
						divButtonDeny	.hide();
					}

					var e = args.e;
					if (e.data.obj.uId == App.data.user.id) {
						divButtonAccept	.hide();
						divButtonDeny	.hide();
					}else{
						divButtonEdit	.hide();
						divButtonDelete	.hide();
						
						if (e.data.members) {
						    for (let mem of Object.values(e.data.members)) {
								if (mem.uId === App.data.user.id) {
								    switch (mem.stat) {
								        case pr_stat_accept:
								            divButtonAccept.hide();
								            divButtonDeny.hide();
								            divButtonUnaccept.show();
								            break;
								        case 1:
								            divButtonAccept.hide();
								            divButtonDeny.hide();
								            divButtonUndeny.show();
								            break;
								    }
								}
						    }
						}
					}
					
					divButtonEdit.on('click', function() {
						App.MsgboxController.do_lc_close();
						var e 	= args.e.data.obj;
						App.MsgboxController.do_lc_show({
						    title		: $.i18n("prj_appointment_msg_title"),
						    content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_APPOINTMENT_NEW, { ent: e }),
						    autoclose	: true,
						    buttons 	: {
						        SEND 	: {
						            lab 		: "<i class='mdi mdi-send'></i>",
						            funct		: function() { do_lc_mod_appointment(e);},
						            autoclose	: true
						        },
						    },
						    onClose		: () => {
						        members 	= {};
						//									membersDel  = [];
						        files		= {files: []};
						        customers   = [];
						        customersAdd= [];
						        customersDel= [];
						    },
							css: {
							    "max-width"	: "600px",
							    "min-width"	: "350px",
							    "display"	: "flex",
							    "margin"	: "auto"
							}
						});
					    do_lc_init_element(e);
					    do_lc_build_view_member_mode_modify(true, args.e.data.members);
					    do_lc_bind_event_autocomplete(); // bind event delete for each member element
						$(".mod-repeat-hide").hide();	
					    do_lc_req_autocomplete();
					    /*$(".member-item").css({
					        "display": "flex",
					        "flex-direction": "row",
					    })*/
					    							
					});
					
					divButtonDelete.on('click', function() {
						App.MsgboxController.do_lc_close();	
						App.MsgboxController.do_lc_show({
							title		: $.i18n("common_title_confirm"),
							content 	: $.i18n("msg_del_entity_popup_content"),
							autoclose	: false,
							css			: {
								"max-width":"450px"
							},
							buttons		: {
								NO: {
									lab		:  $.i18n("msg_btn_back"),
								},
								OK: {
									lab			: $.i18n("msg_btn_del"),
									funct		: () => do_lc_remove_appointment(args.e),
									classBtn	: "btn-danger"
								}
							}
						});
					});

					divButtonAccept.on('click', function() {
					    do_lc_accept_appointment(args.e);	
					    App.MsgboxController.do_lc_close();						
					});

					divButtonDeny.on('click', function() {
					    do_lc_deny_appointment(args.e);	
					    App.MsgboxController.do_lc_close();						
					});
					
					divButtonUnaccept.on('click', function() {
					    do_lc_cancel_appointment(args.e);	
					    App.MsgboxController.do_lc_close();						
					});

					divButtonUndeny.on('click', function() {
					    do_lc_cancel_appointment(args.e);	
					    App.MsgboxController.do_lc_close();						
					});

					var divButtonBlue = $("#div_button_blue");
					var divButtonGreen = $("#div_button_green");
					var divButtonYellow = $("#div_button_yellow");
					var divButtonRed = $("#div_button_red");
					var divButtonWhite = $("#div_button_white");

					divButtonBlue.on('click', function() {
					    color = "#556ee6",
					    updateColor(args.e, color);
					    App.MsgboxController.do_lc_close();							
					});

					divButtonGreen.on('click', function() {
					    color = "#34c38f",
					    updateColor(args.e, color);
					    App.MsgboxController.do_lc_close();							
					});

					divButtonYellow.on('click', function() {
					    color = "#f1c232",
					    updateColor(args.e, color);
					    App.MsgboxController.do_lc_close();							
					});

					divButtonRed.on('click', function() {
					    color = "#cc0000",
					    updateColor(args.e, color);
					    App.MsgboxController.do_lc_close();							
					});

					divButtonWhite.on('click', function() {
					    color = "",
					    updateColor(args.e, color);
					    App.MsgboxController.do_lc_close();							
					});
				}
				else {
					// do something
				}

			};
			
			dp_schedule.onEventMove = function(args) {
			  // Store position
			  previousPositions[args.e.id()] = {
			      start: args.e.start(),
			      end: args.e.end()
			  };
			};

			dp_schedule.onEventResize = function(args) {
			  // Store position
			  previousPositions[args.e.id()] = {
			      start: args.e.start(),
			      end: args.e.end()
			  };
			};

			dp_schedule.onEventMoved = async function(args) {
				//check owner
				const currentUserId = App.data.user.id;
				const isOwner = args.e.data.members && Object.values(args.e.data.members).some(member => member.uId === currentUserId && member.isOwner);

				const previousPosition = previousPositions[args.e.id()];
				const now = new Date();
				const isPastEvent = now >= new Date(previousPosition.start) || now >= new Date(previousPosition.end) || now >= new Date(args.newStart.value.replace("T", " ")) || now >= new Date(args.newEnd.value.replace("T", " "));

				if (!isOwner || isPastEvent) {
				    args.preventDefault();
				    if (previousPosition) {
				      args.e.data.start = previousPosition.start;
				      args.e.data.end = previousPosition.end;
				    }
				    dp_schedule.update();
				    return;
				}
				const dayStart 	= args.newStart.value.replace("T"," ")
				const dayEnd 	= args.newEnd.value.replace("T"," ")
				
				const obj 		= args.e.data.obj;
				obj.dtBegin 	= dayStart
				obj.dtEnd 		= dayEnd

				do_lc_mod_prj_appointment(obj)
			}

			dp_schedule.onEventResized = function (args) {
				//check owner
				const currentUserId = App.data.user.id;
				const isOwner = args.e.data.members && Object.values(args.e.data.members).some(member => member.uId === currentUserId && member.isOwner);
				const previousPosition = previousPositions[args.e.id()];
				const now = new Date();
				const isPastEvent = now >= new Date(args.e.data.start) || now >= new Date(args.e.data.end) || now >= new Date(args.newStart.value.replace("T", " ")) || now >= new Date(args.newEnd.value.replace("T", " "));

				if (!isOwner || isPastEvent) {
				    args.preventDefault();
				    if (previousPosition) {
				      args.e.data.start = previousPosition.start;
				      args.e.data.end = previousPosition.end;
				    }
				    dp_schedule.update();
				    return;
				}
				const dayStart 	= args.e.start().value.replace("T"," ")
				const dayEnd 	= args.e.end().value.replace("T"," ")
				
				const obj 		= args.e.data.obj;
				obj.dtBegin 	= dayStart
				obj.dtEnd 		= dayEnd

				do_lc_mod_prj_appointment(obj)
			};

			dp_schedule.contextMenu = new DayPilot.Menu({
				items: [
					{
						text: $.i18n("prj_appointment_event_edit"),
						icon: "fa fa-solid fa-play ic-blue",
						onClick: function (args) {
							var e 	= args.source.data.obj;
							App.MsgboxController.do_lc_show({
								title		: $.i18n("prj_appointment_msg_title"),
								content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_APPOINTMENT_NEW, { ent: e }),
								autoclose	: true,
								buttons 	: {
									SEND 	: {
										lab 		: "<i class='mdi mdi-send'></i>",
										funct		: function() { do_lc_mod_appointment(e);},
										autoclose	: true
									},
								},
								onClose		: () => {
									members 	= {};
//									membersDel  = [];
									files		= {files: []};
									customers   = [];
									customersAdd= [];
									customersDel= [];
								},
								css: {
								    "max-width"	: "600px",
								    "min-width"	: "350px",
								    "display"	: "flex",
								    "margin"	: "auto"
								}
							});
							
							do_lc_init_element(e);

//							do_lc_build_view_member(args.source.data.members, "#div_list_member"); // build lst member
							do_lc_build_view_member_mode_modify(true, args.source.data.members);
							do_lc_bind_event_autocomplete(); // bind event delete for each member element
							$(".mod-repeat-hide").hide();
							do_lc_req_autocomplete();
							/*$(".member-item").css({
								"display": "flex",
								"flex-direction": "row",
							})*/
						}

					},
					{
						text: $.i18n("prj_appointment_event_del"),
						icon: "fa fa-solid fa-play ic-red",
						onClick: function (args) {
							var e = args.source;
							
							App.MsgboxController.do_lc_show({
								title		: $.i18n("common_title_confirm"),
								content 	: $.i18n("msg_del_entity_popup_content"),
								autoclose	: false,
								css			: {
									"max-width":"450px"
								},
								buttons		: {
									NO: {
										lab		:  $.i18n("msg_btn_back"),
									},
									OK: {
										lab			: $.i18n("msg_btn_del"),
										funct		: () => do_lc_remove_appointment(e),
										classBtn	: "btn-danger"
									}
								}
							});
						}
					},
					{
						text:  $.i18n("prj_appointment_event_denied"),
						icon: "fa fa-solid fa-play ic-yellow",
						onClick: function (args) {
							var e = args.source;
							do_lc_deny_appointment(e);
						}
					},
					
					{
					    text:  $.i18n("prj_appointment_event_accepted"),
						icon: "fa fa-solid fa-play ic-green",
					    onClick: function (args) {
					        var e = args.source;
					        do_lc_accept_appointment(e);
					    }
					},
					{
					    text:  $.i18n("prj_appointment_event_undenied"),
					    icon: "fa fa-solid fa-play ic-yellow",
					    onClick: function (args) {
					        var e = args.source;
					        do_lc_cancel_appointment(e);
					    }
					},

					{
					    text:  $.i18n("prj_appointment_event_unaccepted"),
					    icon: "fa fa-solid fa-play ic-yellow",
					    onClick: function (args) {
					        var e = args.source;
					        do_lc_cancel_appointment(e);
					    }
					},
					{
						text: "-"
					},

					],
					onShow: function(args) {
						const now 			= new Date();
						const isPastEvent 	= now >= new Date(args.source.data.start) || now >= new Date(args.source.data.end);
						const isSuperAdmin 	= App.controller.common.Login && App.controller.common.Login.can_lc_User_SuperAdmin();
						// Reset visibility for all menu items
						args.menu.items.forEach(item => item.hidden = false);
						args.menu.items[4].hidden = true;
						args.menu.items[5].hidden = true;
						if (isPastEvent) {
						    args.menu.items[0].hidden = true;
						    args.menu.items[1].hidden = true;
						    args.menu.items[2].hidden = true;
							args.menu.items[3].hidden = true;
						}
						if(isSuperAdmin){
							args.menu.items[2].hidden = true;
							args.menu.items[3].hidden = true;
							return;
						}

						var e = args.source;
						if(e.data.obj.uId == App.data.user.id){
							args.menu.items[2].hidden = true;
							args.menu.items[3].hidden = true;
							return;
						}

						if (e.data.members) {
							args.menu.items[0].hidden = true;
							args.menu.items[1].hidden = true;
							
							for (let mem of Object.values(e.data.members)) {
							    if (mem.uId === App.data.user.id) {
							        switch (mem.stat) {
							            case pr_stat_accept:
							                args.menu.items[2].hidden = true;
							                args.menu.items[3].hidden = true;
							                args.menu.items[5].hidden = false;
							                break;
							            case pr_stat_active:
							                args.menu.items[2].hidden = true;
							                args.menu.items[3].hidden = true;
							                args.menu.items[4].hidden = false;
							                break;
							        }
							    }
							}
						}
					}
			});

			
//			dp_schedule.onBeforeHeaderRender = function(args) {
//				args.header.html += "*" + args.header.dayOfWeek;
//			};
				
			dp_schedule.init();
			
			const dpPicker = new DayPilot.DatePicker({
			    target: 'nav_calendar_show',
			    pattern: 'yyyy-MM-dd',
			    onTimeRangeSelected: (args) => {
			        dp_schedule.update({ startDate: args.start });
										
					const newDate 	= app.changeDate(dp_schedule.startDate);
										
					var dt 			= req_gl_DateObj_From_DateStr (newDate.value.replace("T", " "));
					var dtStr		= req_gl_DateStr_From_DateObj (dt, "dd/MM/yyyy");
					$("#day-now"	).text(dtStr);
		
		            if (prjSearch && prjSearch.parId) {
		                do_lc_search_appointment(prjSearch, dp_schedule, req_gl_DateStr_From_DateObj(dt));
		            }
			    }
			});
			
			const app = {
			    elements: {
			        previous		: $("#previous"),
			        next			: $("#next"),
			        nav_calendar	: $("#nav_calendar")
			    },
			
			    addEventHandlers() {
			        app.elements.previous.on("click", (e) => {
			            e.preventDefault();
			            const newDate 	= app.changeDate(dp_schedule.startDate.addDays(-7));
						
						var dt 			= req_gl_DateObj_From_DateStr (newDate.value.replace("T", " "));
						var dtStr		= req_gl_DateStr_From_DateObj (dt, "dd/MM/yyyy");
						$("#day-now"	).text(dtStr);
			
			           if (prjSearch && prjSearch.parId) {
			                do_lc_search_appointment(prjSearch, dp_schedule, req_gl_DateStr_From_DateObj(dt));
			            }
			        });
			
			        app.elements.next.on("click", (e) => {
			            e.preventDefault();
			            const newDate 	= app.changeDate(dp_schedule.startDate.addDays(7));
						
						var dt 			= req_gl_DateObj_From_DateStr (newDate.value.replace("T", " "));
						var dtStr		= req_gl_DateStr_From_DateObj (dt, "dd/MM/yyyy");
						$("#day-now"	).text(dtStr);
			
			            if (prjSearch && prjSearch.parId) {
			                do_lc_search_appointment(prjSearch, dp_schedule, req_gl_DateStr_From_DateObj(dt));
			            }
			        });
			
			        app.elements.nav_calendar.on("click", (e) => {
			            e.preventDefault();
			            dpPicker.show();
			        });
			    },
			
			    // Update dp_schedule with a new date and reset events
			    changeDate(date) {
			        const startDate = date.firstDayOfWeek().addDays(1);
			        const days 		= 7;
			        const events 	= [];  // Reset or reload events if necessary
			
			        dp_schedule.update({
			            startDate,
			            days,
			            events
			        });
					return startDate;
			    },
			
			    init() {
			        this.addEventHandlers();
			    }
			};
			
			// Initialize the app
			app.init();
		}

		var do_lc_mod_appointment = function (e) {
			let	data	 		= req_gl_data({
				dataZoneDom		: $("#div_create_prj_appointment")
			});
			//check data error
			if(data.hasError){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_data'));
				return;
			}	
						
			let prj 		= data.data;
			prj.inf02.cl 	= pr_Color;
			prj.dtBegin 	= do_lc_convert_date(prj.dtBegin).replace("T"," ");
			prj.dtEnd 		= do_lc_convert_date(prj.dtEnd	).replace("T"," ");

			const dtBeginn	= req_gl_DateObj_From_DateStr(prj.dtBegin);
			const dtEndd	= req_gl_DateObj_From_DateStr(prj.dtEnd);
			const currentDate = new Date();

			if(req_gl_Date_CompareObj(dtEndd, dtBeginn) <= 0) {
				do_gl_show_Notify_Msg_Error($.i18n("prj_appointment_dt_msg_err"));
				return;
			}else if(req_gl_Date_CompareObj(dtBeginn, currentDate) <= 0){
				do_gl_show_Notify_Msg_Error($.i18n("prj_appointment_dt_today_msg_err"));
				return;
			}
			prj.typ01 					= TYP_01_WORK_PLAN;
			prj.nb 						= 0;
			prj.val01 					= JSON.stringify(customers);
			let membersArr 				= [];
			$('#div_list_member').find('[data-id]').each(function() {
					const dataId 		= $(this).attr('data-id');
					const typMemDoctor 	= 10;
					membersArr.push({uId: dataId, typ: typMemDoctor});
				});
			
			if (Array.isArray(e.inf02.color)) {
			    prj.inf02.color = e.inf02.color;
			}
			do_lc_mod_prj_appointment(prj,membersArr);
		}
		var do_lc_mod_prj_appointment = function (prj,membersArr) {
			let dataSend	= {obj: JSON.stringify(prj), member: JSON.stringify(Object.values(membersArr)), customersAdd: JSON.stringify(customersAdd), customersDel: JSON.stringify(customersDel)};
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVModWorkPlan", dataSend);			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_mod_prj_appointment_success, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);

		}
		var do_lc_mod_prj_appointment_success = function (sharedJson,prj) {
			if(can_gl_AjaxSuccess(sharedJson)) {	
			//	dp_schedule.message($.i18n("prj_appointment_msg_update"));
				do_gl_show_Notify_Msg_Success($.i18n("prj_appointment_msg_update_ajax"));

				if (dp_schedule) {
					//do_get_availableTimeList(dp_schedule);	
					do_lc_search_appointment(prjSearch,dp_schedule)
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
			members = {};
//			membersDel = [];
		}

		var updateColor = function (e, color) {
			var colorArray = e.data.obj.inf02.color || [];

			var existingEntry = colorArray.find(entry => entry.id === App.data.user.id);
			if (existingEntry) {
			    existingEntry.cl = color;
			} else {
			    colorArray.push({"id": App.data.user.id, "cl": color});
			}
			
			e.data.color = colorArray;
			do_lc_edit_color_appointment(e, colorArray);
		}
		var do_lc_edit_color_appointment = function (e, color) {
			let prj 		= e.data.obj;
			prj.inf02.color = color;
			let dataSend	= {obj: JSON.stringify(prj)};
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVModMeet", dataSend);			
			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_edit_color_appointment_success, [e]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		var do_lc_edit_color_appointment_success = function (sharedJson, e) {
			if(can_gl_AjaxSuccess(sharedJson, e)) {
				dp_schedule.events.update(e);
		//		dp_schedule.message($.i18n("prj_appointment_msg_update_color"));
				do_gl_show_Notify_Msg_Success($.i18n("prj_appointment_msg_update_ajax"));
				// reload
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}

		var do_lc_remove_appointment = function (e) {
			let prj 		= e.data.obj;
			//let dataSend	= {id: e.data.obj.id};
			let dataSend	= {obj: JSON.stringify(prj)};
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVDelMeet", dataSend);			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_remove_appointment_success, [e,prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		var do_lc_remove_appointment_success = function (sharedJson, e,prj) {
			if(can_gl_AjaxSuccess(sharedJson)) {	
				dp_schedule.events.remove(e);
		//		dp_schedule.message($.i18n("prj_appointment_msg_del")); 
				do_gl_show_Notify_Msg_Success($.i18n("prj_appointment_msg_del_ajax"));
				// reload
				if (dp_schedule) {
					do_lc_search_appointment(prjSearch,dp_schedule)
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}


		var do_lc_deny_appointment = function (e) {
			let dataSend	= {id: e.data.obj.id, stat: pr_stat_active};
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVModStatMemMeet", dataSend);			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_deny_appointment_success, [e]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		var do_lc_deny_appointment_success = function (sharedJson, e) {
			if(can_gl_AjaxSuccess(sharedJson)) {	
				dp_schedule.events.remove(e);
		//		dp_schedule.message($.i18n("prj_appointment_msg_deny")); 
				// reload
				if (dp_nav && dp_schedule) {
					do_get_availableTimeList(dp_schedule, dp_nav.selectionStart.value.replace("T", " "));	
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}
		
		var do_lc_accept_appointment = function (e) {
		    let dataSend	= {id: e.data.obj.id, stat: pr_stat_accept};
		    let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVModStatMemMeet", dataSend);			

		    let fSucces		= [];		
		    fSucces.push(req_gl_funct(null, do_lc_accept_appointment_success, [e]));	

		    let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

		    App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_accept_appointment_success = function (sharedJson, e) {
		    if(can_gl_AjaxSuccess(sharedJson)) {	
		        dp_schedule.events.remove(e);
		//        dp_schedule.message($.i18n("prj_appointment_msg_accept")); 
		        // reload
		        if (dp_nav && dp_schedule) {
		            do_get_availableTimeList(dp_schedule, dp_nav.selectionStart.value.replace("T", " "));	
		        }
		    } else {
		        do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
		    }
		}
		
		var do_lc_cancel_appointment = function (e) {
		    let dataSend	= {id: e.data.obj.id, stat: pr_stat_pending};
		    let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVModStatMemMeet", dataSend);			

		    let fSucces		= [];		
		    fSucces.push(req_gl_funct(null, do_lc_cancel_appointment_success, [e]));	

		    let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

		    App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_cancel_appointment_success = function (sharedJson, e) {
		    if(can_gl_AjaxSuccess(sharedJson)) {	
		        dp_schedule.events.remove(e);
		   //     dp_schedule.message($.i18n("prj_appointment_msg_cancel")); 
		        // reload
		        if (dp_nav && dp_schedule) {
		            do_get_availableTimeList(dp_schedule, dp_nav.selectionStart.value.replace("T", " "));	
		        }
		    } else {
		        do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
		    }
		}

		var getDateISOShort = function(dObj) {
			return req_gl_DateStr_From_DateObj(dObj, DateFormat.masks.isoDate);		
		}

		var getDateEN = function(dObj) {
			return req_gl_DateStr_From_DateObj(dObj, DateFormat.masks.enFullDate);		
		}

		//-------------------------------------------------------------------------------------------------

		var do_lc_create_appointment = function () {
			
		    let data = req_gl_data({
		        dataZoneDom: $("#div_create_prj_appointment")
		    });
			//check data error
			if(data.hasError){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_data'));
				return;
			}	
						
		    let prj 			= data.data;
		    if(!prj.inf02)
		    	prj.inf02		= {};
		    prj.inf02.cl 		= pr_Color;
		    prj.inf02.workType	= ONLINE;
			prj.fv01			= prj.inf02.pr;
		    prj.stat01 			= STAT_ACTIVE; // Active
		    prj.dtBegin 		= do_lc_convert_date(prj.dtBegin).replace("T", " ");
		    prj.dtEnd 			= do_lc_convert_date(prj.dtEnd).replace("T", " ");
		    const dtBeginn 		= req_gl_DateObj_From_DateStr(prj.dtBegin);
		    const dtEndd 		= req_gl_DateObj_From_DateStr(prj.dtEnd);
		    const currentDate 	= new Date();
		    
			//----check some required conditions
		    if (req_gl_Date_CompareObj(dtEndd, dtBeginn) <= 0) {
		        do_gl_show_Notify_Msg_Error($.i18n("prj_appointment_dt_msg_err"));
		        return;
		    } else if (req_gl_Date_CompareObj(dtBeginn, currentDate) <= 0) {
		        do_gl_show_Notify_Msg_Error($.i18n("prj_appointment_dt_today_msg_err"));
		        return;
		    }else if(prj.parId == ''){
		    	do_gl_show_Notify_Msg_Error($.i18n("prj_appointment_dt_parId_err"));
		        return;
		    }
			
			//------------------------------------------------------------*
			let prjArr 			= [];
			let membersArr 		= [];
		    let selectedDays 	= [];
			let frequency 		= $(".objData[data-name='repeat']").val() || 1;
					
		    $("#weekdayDropdown input[type='checkbox']:checked").each(function () {
		    	selectedDays.push($(this).val());
		    });

		    function getNextWeekdayDate(startDate, weekday, weekOffset) {
		        const daysOfWeek 	= ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		        const startDay 		= startDate.getDay();
		        const targetDay 	= daysOfWeek.indexOf(weekday);
		        
		        // Tính số ngày chênh lệch từ startDay đến targetDay
		        let diff = targetDay - startDay;
		        if (diff < 0) {
		            diff += 7;
		        }
		        
		        let nextDate = new Date(startDate);
		        nextDate.setDate(startDate.getDate() + diff + (weekOffset * 7));
		        
		        return nextDate;
		    }
		
		    function addAdditionalData(appointment) {
		        appointment.files 	= files.files;
		        appointment.typ01 	= TYP_01_WORK_PLAN;
		        appointment.nb 		= 0;
		        appointment.val01 	= JSON.stringify(customers);
		        if (appointment.val02 && !/^https?:\/\//i.test(appointment.val02)) {
		            appointment.val02 = 'http://' + appointment.val02;
		        }
				$('#div_list_member').find('[data-id]').each(function() {
			        const dataId = $(this).attr('data-id');
			        const typMemDoctor = 10;
			
			        if (!membersArr.some(member => member.uId === dataId)) {
			            membersArr.push({ uId: dataId, typ: typMemDoctor });
			        }
			    });
				
		    }
			function formatDateToLocalString(date) {
			    const year 	= date.getFullYear();
			    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Tháng phải cộng 1
			    const day 	= ('0' + date.getDate()).slice(-2);
			    const hours = ('0' + date.getHours()).slice(-2);
			    const mn 	= ('0' + date.getMinutes()).slice(-2);
			    const sec 	= ('0' + date.getSeconds()).slice(-2);
			    
			    return `${year}-${month}-${day} ${hours}:${mn}:${sec}`;
			}
			
		    let initialAppointment 		= Object.assign({}, prj);
		    initialAppointment.dtBegin 	= formatDateToLocalString(dtBeginn);
			initialAppointment.dtEnd 	= formatDateToLocalString(dtEndd);
			
		    addAdditionalData(initialAppointment);
		    prjArr.push(initialAppointment);
		
		    if (selectedDays.length > 0) {
		        selectedDays.forEach((day) => {
		            for (let i = 0; i < frequency; i++) {
		                let nextDate = getNextWeekdayDate(dtBeginn, day, i);
		
		                let appointment = Object.assign({}, prj);
		                let newDtBegin = new Date(nextDate);
		                let newDtEnd = new Date(nextDate);
		
		                newDtEnd.setHours(dtEndd.getHours());
		                newDtEnd.setMinutes(dtEndd.getMinutes());
		
						appointment.dtBegin = formatDateToLocalString(newDtBegin);
					    appointment.dtEnd = formatDateToLocalString(newDtEnd);
		
		                addAdditionalData(appointment);
		                prjArr.push(appointment);
		            }
		        });
		    }
		    do_lc_new_appointment(prjArr, membersArr);
		};


		const do_lc_convert_date = (objDate) => {
			if (objDate.time.length < 5) objDate.time = "0" + objDate.time;
			return objDate.date.substr(0, 10) + "T" + objDate.time.substr(0, 5) + ":00";
		}
		
		const do_lc_new_appointment = (prjArr, membersArr) => {
			let dataSend	= {obj: prjArr, member: JSON.stringify(Object.values(membersArr))};
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVNewWorkPlan", dataSend);			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_new_appointment_callback, [prjArr]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_new_appointment_callback = (sharedJson, prjArr) => {
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_lc_search_appointment(prjSearch,dp_schedule)
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		function do_lc_search_appointment(prj, dp_schedule, dtBegin, dtEnd) {
			var ref 			= req_gl_Request_Content_Send("ServiceNsoGroup", "SVLstAppointmentSearch");
			if (prj != null) {
				ref.parId 		= prj.parId;
				ref.type02 		= prj.typ02;
				ref.memberId 	= prj.memberId;
			}
			
			const 	newDate 	= dp_schedule.startDate;
			var 	dt 			= req_gl_DateObj_From_DateStr (newDate.value.replace("T", " "));
			ref.dtBegin			= req_gl_DateStr_From_DateObj(dt);
			ref.dtEnd			= dtEnd;
			ref.wParent			= true;

			var fSucces	= [];
			fSucces.push(req_gl_funct(		null, do_show_list_available_time, [true, dp_schedule]));

			var fError 		= req_gl_funct(	null, do_show_list_available_time, [false]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_bind_eventPage = () => {
			var currentDate 	= new Date();
			var formattedDate 	= currentDate.toLocaleDateString('vi-VN');
			
			$("#day-now"	).text(formattedDate);
			
			$("#btn_search"	).off('click').click(() => {
				 let data = req_gl_data({
			        dataZoneDom: $("#div_search_appointment")
			    });
				
				if(data.hasError){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
					return false;
				}
				
				lock 				= true;
				
			    let prj 			= data.data;
				if (!prj.parId){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
					return false;
				}
				
			    var memberElement 	= document.querySelector('#selected_members_all .member-item .btn-remove-member');
			    if (memberElement) {
			        var memberId 	= memberElement.getAttribute('data-id');
			        prj.memberId 	= memberId;
			        searchIdMember  = memberId;
			    }
			    do_lc_search_appointment(prj, dp_schedule);
			    
				$("#btn_create_entity").removeClass("hide");
				
				const membersData = [];
				$("#selected_members_all .member-item").each(function() {
		            const $memberItem 	= $(this);
		            const memberId 		= $memberItem.find(".btn-remove-member").data("id");
		            let memberName 		= $memberItem.text().trim();
					const imgSrc 		= $memberItem.find("img").attr("src");
					
		            $memberItem.find(".text-middle").each(function() {
				        memberName 		= memberName.replace($(this).text().trim(), '').trim();
				    });
		
		            membersData.push({
		                uId		: memberId,
		                name	: memberName,
		                imgSrc	: imgSrc
		            });
		            
		        });
		      
			    const name 					= $("#list_member").val();
			    const workSchedule 			= $("#work-schedule").val();
			
			    const selectedDepartment 	= $("#department option:selected");
			    const departmentValue 		= selectedDepartment.val();
			    const departmentText 		= selectedDepartment.text();
			
			    prj_work = {
			        name					: name,
			        workSchedule			: workSchedule,
			        departmentValue			: departmentValue,
			        departmentText			: departmentText,
			        members					: membersData
			    };
			    prjSearch = prj
			
			});

			$("#btn_create_entity").off('click').click(() => {
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_appointment_msg_title"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_APPOINTMENT_NEW, {}),
					autoclose	: true,
					buttons 	: {
						SEND 	: {
							lab 		: "<i class='mdi mdi-send'></i>",
							funct		: do_lc_create_appointment,
							autoclose	: true
						},
					},
					onClose		: () => {
						members 	= {};
//						membersDel  = [];
						files		= {files: []};
						customers   = [];
						customersAdd= [];
						customersDel= [];
					},
					css: {
					    "max-width"	: "600px",
					    "min-width"	: "350px",
					    "display"	: "flex",
					    "margin"	: "auto"
					}
				});
				do_lc_build_view_member_mode_modify(false);
				do_lc_init_element();
				do_lc_req_autocomplete();
			});

			$("#dtpicker_Begin")
			$(".member-item").css({
				"display": "flex",
				"flex-direction": "row",
			})
		}
		const do_lc_req_autocomplete_all = () => {
			let el = ".inp-name-member_all";
			let customShowList = function(item, selOpt = ""){
				if(item.avatar)	return selOpt += `<img src='${ item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs avatar-autocomplete'/> ${item.inf03}`;
				if(!item.avatar){
					let textColor   = null;
					let textAvatar  = null
					if(!item.avatar){
						let first = item.login01.charAt(0);
						let last  = item.login01.charAt(item.login01.length - 1);
						let index = var_gl_alphabet.indexOf(first.toLowerCase());

						textColor = var_gl_colors[index];
						textAvatar= first + last;
					}
					selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs avatar-autocomplete text-white text-uppercase text-center mr-1" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.inf03}</div>`;
					return selOpt;
				}
			}

			let reqSelectMember = (event, item) => {
				if(members[item.id])			return false;
				let lev 			= $("#sel_member_level_all").val();
				let typ 			= $("#sel_member_type_all").val();
				let user 			= {
						"uId": item.id, 
						"typ": +lev, 
						"stat": pr_stat_pending
						// "typ": +typ
				};

				let textColor   = null;
				let textAvatar  = null
				if(!item.avatar){
					let first = item.login01.charAt(0);
					let last  = item.login01.charAt(item.login01.length - 1);
					let index = var_gl_alphabet.indexOf(first.toLowerCase());

					textColor = var_gl_colors[index];
					textAvatar= first + last;
				}

				members[item.id] 	= user;
				let selOpt 			= `<div class='member-item'>`;
				if(item.avatar) 
					selOpt 			+= `<div><img src='${ item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.inf03}`;
				else 			
					selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-2 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.inf03}`;

				selOpt 				+= `<a data-id='${item.id}' class='text-danger btn-remove-member ml-4' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt 				+= `</div>`;
	
				$("#selected_members_all").removeClass("hide")
				$("#selected_members_all").append(selOpt);
				$("#list_member_all").hide();
				do_lc_bind_event_autocomplete();
				$(el).blur().val("");
			}
		    $("#department").on("change", function () {
			    var selectedValue = $(this).val(); 
			    if(selectedValue == ""){
			    	$("#btn_create_entity").addClass("hide");
			    	lock		  = false;
			    }
			    let typ01Arr = [App.data.user.typ01, 2, 20, 30];
			    let typ01Str = typ01Arr.join(',');
			
			    let options = {
			        dataService: [pr_SERVICE_AUT_CLASS, pr_SV_DOCTOR_SEARCH],
			        dataRes: ["login01", "name01"],
			        svParams: {
			            wAvatar: true,
			            nbLine: 5,
			            typ01s: typ01Str,
			            stats: 1,
			            grpId: selectedValue 
			        },
			        fSelect: reqSelectMember,
			        customShowList: customShowList
			    };
			
			    do_gl_req_autocompleteNew(el, options);
			});

		};
//		sua
		const do_lc_req_autocomplete = () => {
			let el = ".inp-name-member";
			let customShowList = function(item, selOpt = ""){
				if(item.avatar)	return selOpt += `<img src='${ item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs avatar-autocomplete'/> ${item.inf03}`;
				if(!item.avatar){
					let textColor   = null;
					let textAvatar  = null
					if(!item.avatar){
						let first = item.login01.charAt(0);
						let last  = item.login01.charAt(item.login01.length - 1);
						let index = var_gl_alphabet.indexOf(first.toLowerCase());

						textColor = var_gl_colors[index];
						textAvatar= first + last;
					}
					selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs avatar-autocomplete text-white text-uppercase text-center mr-1" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.inf03}</div>`;
					return selOpt;
				}
			}

			let reqSelectMember = (event, item) => {
				if(members[item.id])			return false;
				let lev 			= $("#sel_member_level").val();
				let typ 			= $("#sel_member_type").val();
				let user 			= {
						"uId": item.id, 
						"typ": +lev, 
						"stat": pr_stat_pending
						// "typ": +typ
				};

				let textColor   = null;
				let textAvatar  = null
				if(!item.avatar){
					let first = item.login01.charAt(0);
					let last  = item.login01.charAt(item.login01.length - 1);
					let index = var_gl_alphabet.indexOf(first.toLowerCase());

					textColor = var_gl_colors[index];
					textAvatar= first + last;
				}

				members[item.id] 	= user;

				let selOpt 			= `<div class='member-item'>`;
				if(item.avatar) 
					selOpt 			+= `<div><img src='${ item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.inf03}`;
				else 			
					selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.inf03}`;

				selOpt 				+= `<a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt 				+= `</div>`;

				$("#div_list_member").append(selOpt);
				do_lc_bind_event_autocomplete();
				$(el).blur().val("");
			}
			var selectedValue = $("#department_input_id").val(); 
			let typ01Arr = [App.data.user.typ01, 2, 20, 30];
			let typ01Str 	= typ01Arr.join(',');
			let options 	= {
			    dataService 	: [pr_SERVICE_AUT_CLASS, pr_SV_DOCTOR_SEARCH], 
			    dataRes 		: ["login01", "name01"], 
			    svParams		: {wAvatar:true, nbLine:5, typ01s: typ01Str, stats:1,
			     					grpId: selectedValue },
			    fSelect			: reqSelectMember, 
			    customShowList	: customShowList
			}
			do_gl_req_autocompleteNew(el, options);	
		}
//		hetsua

		const do_lc_bind_event_autocomplete = () => {
			$(".btn-remove-member").off("click").on("click", function(){
			 	$("#selected_members_all").addClass("hide")
				let $this 	= $(this);
				let {id} 	= $this.data();

//				if(members.id)	delete members.id;
//				membersDel.push(id);
				if(members[id])	delete members[id];
				$(this).closest(".member-item").remove();
				$("#list_member_all").show();
				
			})
		}

		var do_lc_build_view_member = (members, view) => {
			// Handle div list member
			var div = "";
			if(members) {
				for (var key in members) {

					let classCss = "";
					let opacity = "";
					let textStyle = "";
					let mem = members[key];
					if(mem.stat && mem.stat === 2 ) {
						classCss = "text-decoration-line-through ";
						opacity  = "opacity-03"
					}
					
					if(mem.stat && mem.stat === pr_stat_accept ) {
					  textStyle = "color: #32CD32;";
					}
					
					if (mem.stat && mem.stat === 1) {
					    classCss 	= "text-decoration-line-through text-danger";
						textStyle 	= "text-decoration-thickness: 1.5px;";
					}

					let item 			= mem.mem;
					let selOpt 			= `<div class='team-member member-item d-flex'>`;

					let textColor   = null;
					let textAvatar  = null
					if(!item.avatar){
						let first = item.login01.charAt(0);
						let last  = item.login01.charAt(item.login01.length - 1);
						textColor = App.controller.UI.Def.reqSrcTextColor(item.login01);
						textAvatar= first + last;
					}

					if(!item.avatar)	selOpt 			+= `<div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center ${opacity}" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div><span class="tooltiptext ${classCss}" style="${textStyle}"> ${item.name}</span>`;
					else                selOpt 		    += `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs ${opacity} mr-1 avatar-autocomplete'/><span class="tooltiptext ${classCss}" style="${textStyle}">${item.name}</span>`;
					
					selOpt 				+= `</div>`;
					div 				+= selOpt;
				};
			}
			if (div) {
				$(view).append(div)
			} else {
				$(view).parent().remove();
			}
		}	
		
		const do_lc_build_view_member_mode_modify = function(mod, members){
			$('.typ02').on('change', function() {
		        var selectedColor = $(this).find(':selected').data('color');
		        const selectedValue = $(this).val(); 
		        $('#colorValue').val(selectedColor);
		        pr_Color = selectedColor;
		        if (selectedValue == TYP_02_MEET_CLIENT) {
		            $('#price').closest('.col-6').fadeIn();
		        	 $("#cmt03").closest('.col-6').removeClass("col-12");
					$('#price').val("");
		        } else {
		            $('#price').closest('.col-6').fadeOut();
		             $("#cmt03").closest('.col-6').addClass("col-12");
					$('#price').val("0");
		        }
		    });
		    
		    $('.typ02').trigger('change');
		
			
			$("#toggleDropDown").off('click').click((event) => {
			    event.stopPropagation();
			    $("#weekdayDropdown").toggle();
			});
			
			if(prj_work && prj_work.departmentValue){
				$("#department_input_id").attr("value"		, prj_work.departmentValue);
		   		$("#department_input"	).attr("placeholder", prj_work.departmentText);
			}
			if (!members)
				members			= prj_work? prj_work.members : null;
			if (members) {
		       Object.values(members).forEach(member => {
		            let selOpt = `<div class='member-item'>`;
		            const memberName = member.name || (member.mem ? member.mem.name : "");
		            if (member.imgSrc) {
		                selOpt += `<div><img src='${member.imgSrc}' class='rounded-circle avatar-xs'/> ${member.name}`;
		            } else {
		                let textColor = null;
		                let first 	= memberName.charAt(0);
						let last  	= memberName.charAt(memberName.length - 1);
						let index 	= var_gl_alphabet.indexOf(first.toLowerCase());
	
						textColor 	= var_gl_colors[index];
		                let textAvatar = first + last;
		                
		                selOpt += `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${memberName}`;
		            }
		
		           selOpt += (searchIdMember !== null) 
						    ? (!searchIdMember.includes(member.uId)) 
						        ? `<a data-id='${member.uId}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='Delete'><i class='mdi mdi-close font-size-18'></i></a>` 
						        : `<a data-id='${member.uId}' class='text-danger' data-toggle='tooltip' data-placement='top' title='Delete'></a>` 
						    : `<a data-id='${member.uId}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
		            selOpt += `</div></div>`;
		            $("#div_list_member").append(selOpt);
		        });
	    	}

//			$(document).click((event) => {
//			    if (!$(event.target).closest("#toggleDropDown, #weekdayDropdown").length) {
//			        $("#weekdayDropdown").hide();
//			    }
//			});

		    $(".objData").click(function() {
	       		$(this).toggleClass("active");
	    	});
			
			$("#btn_add_customer").off("click").on("click", function(){
				let email = $(".inp-email-customer").val();
				let validate = validateEmail(email);
				if(!validate){
					$(".inp-email-customer").css("border", "1px solid red");
					return;
				}
				if(customers.indexOf(email) > -1){
					$(".inp-email-customer").css("border", "1px solid red");
					return
				}

				$("#div_list_email_customer").append(`<div class="mr-1"><button class="btn btn-secondary">${email}</button><a data-email='${email}' class='text-danger btn-remove-customer' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a><div>`);
				$(".inp-email-customer").val("");
				customers.push(email);
				if(mod) customersAdd.push(email);

				$(".inp-email-customer").css("border", "unset");

				function validateEmail(email) {
					const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return re.test(String(email).toLowerCase());
				}

				do_lc_build_view_member_mode_modify(mod, members);
			});


			$(".btn-remove-customer").off("click").on("click", function(){
				let $this 		= $(this);
				let {email} 	= $this.data();
				let parent 		= $this.parent();
				let index 		= customers.indexOf(email);
				customers.splice(index, 1);
				customersDel.push(email);

				let idx = customersAdd.indexOf(email);
				if(idx > -1) customersAdd.splice(idx, 1);

				parent.remove();
			})

		}
		//------------------------------------------------------------------------------------
		//-------------------------------------------------------------------------------------------------
		function do_get_availableTimeList(dp, dtBegin, dtEnd) {
			var ref 	= req_gl_Request_Content_Send("ServiceNsoGroup", "SVLstAppointment");
		//	ref.typ01s 	= TYP_01_MEETING;
			ref.typ01s 	= TYP_01_WORK_PLAN;
			ref.dtBegin	= dtBegin;
			ref.dtEnd	= dtEnd;
			
			var fSucces	= [];
			fSucces.push(req_gl_funct(		null, do_show_list_available_time, [true, dp]));
			var fError 		= req_gl_funct(	null, do_show_list_available_time, [false]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		//--------------------------------------------------------------------------------------------
		
		function do_show_list_available_time(sharedJson, ajaxStat, dp) {
		    // Reset the available time list to avoid showing old data
		    pr_lstAvailableTime = [];
		
		    const lstCurObj = [];
		    if (ajaxStat) {
		        var code = sharedJson[App['const'].SV_CODE];
		        
		        if (code == App['const'].SV_CODE_API_YES) {
		            var lstTime = sharedJson[App['const'].RES_DATA];
		
		            // If there are any available times
		            if (lstTime.length > 0) {
		                var curTime = (new Date()).getTime();
		
		                for (let i = 0; i < lstTime.length; i++) {
		                    if (lstTime[i]) {
		                        var curObj = {};
		                        curObj.start = lstTime[i].dtBegin;
		                        curObj.end = lstTime[i].dtEnd;
		
		                        if (!curObj.start || !curObj.end) continue;
		
		                        // Check mems.stat and strike-through name if mem.stat == 1 for current user
		                        const currentUser = App.data.user.id;
		                        const userMem = lstTime[i].mems && lstTime[i].mems.find(mem => mem.uId === currentUser);
		
		                        if (userMem && userMem.stat === 1) {
		                            curObj.text = `<span style="text-decoration: line-through; text-decoration-thickness: 2px;">${lstTime[i].inf01}</span>`;
		                        } else {
		                            curObj.text = lstTime[i].inf01;
		                        }
		                        
		                        curObj.id = DayPilot.guid();
		                        curObj.tags = {};
		                        curObj.obj = lstTime[i];
		
		                        // Convert time objects to Date
		                        curObj.obj.inf02.dt01 = new Date(curObj.obj.inf02.dt01);
		                        curObj.obj.inf02.dt02 = new Date(curObj.obj.inf02.dt02);
		
		                        lstCurObj.push(curObj);
		                    }
		                }
		
		               do_lc_show_list_member(dp, lstCurObj);
//		               do_lc_req_appointment_noti(lstCurObj);
		              
		            } else {
		                do_lc_show_list_member(dp, lstCurObj);
//		                do_lc_req_appointment_noti(lstCurObj);
		                do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_get_no_data"));
		            }
		        }
		    } else {
		        do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
		    }
		
		    dp.update();
		}


		const do_lc_show_list_member = (dp, lstTime) => {
			lstTime.forEach((e, index) => {
				let curObj			= lstTime[index];
				let curObj_uID		= e.obj.uId;
				let mems 			= e.obj.mems || [];

				const is_Me 		= mems.find(m => m.uId == App.data.user.id && m.stat != STAT_DESACTIVE);
				const isSuperAdmin 	= App.controller.common.Login && App.controller.common.Login.can_lc_User_SuperAdmin();
				const isOwner		= App.data.user.id === curObj_uID;

				let objData 		= mems.reduce((currentObj, mem)=>{
					if(mem.uId == curObj_uID){	
						mem.isOwner 		= true;
						mem.isSuperAdmin 	= isSuperAdmin;

						if(!isSuperAdmin && !isOwner){
							if(mem.typ == pr_TYP_MEMBER)	mem.notModif = true;
						}
					}

					currentObj[mem.id] = mem;
					return currentObj;
				}, {});

				curObj.members = objData;

				if (is_Me || isOwner || isSuperAdmin)	pr_lstAvailableTime.push(curObj);
				// if (isOwner || isSuperAdmin)	pr_lstAvailableTime.push(curObj);
			});

			if (dp){
				dp.events.list 	= pr_lstAvailableTime;
				dp.update();
			}
		}

		/*const do_lc_req_appointment_noti = (lstTime) => {
			const curDate 			= new Date();
			const curDay 			= curDate.getDay() === 0 ? 7 : curDate.getDay() + 1;
			const diffDayCheck 		= req_gl_DayDiff(req_gl_DateObj_From_DateStr(pr_dtBegin));

			if((diffDayCheck + 1) > (7 - curDay)) return;

			if(lstTime.length <= 0) {
				$("#last_appointment"		).html($.i18n("prj_appointment_msg_no_last"));
				$("#daily_appointment b"	).html(req_gl_DateStr_LocalFormatShort(new Date()));
				$("#daily_appointment span"	).html(0);
				$("#weekly_appointment span").html(0);

				return;
			}

			let lastAppointment 	= [];
			let cDaily 				= 0;
			let cWeeklyRemaining 	= 0;
			
			lstTime.forEach(appoinment => {
				const dtBeginObj= req_gl_DateObj_From_DateStr(appoinment.obj.dtBegin);
				const dtEndObj	= req_gl_DateObj_From_DateStr(appoinment.obj.dtEnd);

				if(req_gl_Date_CompareObj(dtEndObj, dtBeginObj) <= 0) return;

				const curCompare= req_gl_Date_CompareObj(dtBeginObj, curDate);

				if(curCompare >= 0) {
					if(lastAppointment.length > 0) {
						const last 			= req_gl_DateObj_From_DateStr(lastAppointment[0].obj.dtBegin);
						const compareLast 	= req_gl_Date_CompareObj(dtBeginObj, last);
						
						if(compareLast >= 0) 
							lastAppointment.push(appoinment);
						else if(compareLast < 0) 
							lastAppointment = [appoinment];
						
					} else lastAppointment.push(appoinment);
					
					var toDayEnd= req_gl_DateStr_From_DateObj (curDate, "yyyy-MM-dd") + " 23:59:59";
					if (appoinment.obj.dtBegin<=toDayEnd) cDaily++;
					
					var diffDay = req_gl_DayDiff(req_gl_DateObj_From_DateStr(appoinment.obj.dtBegin));
					if(diffDay > 0 && (diffDay - 1) <= (7 - curDay)) ++cWeeklyRemaining;
				}
//				const diffDay = req_gl_DayDiff(req_gl_DateObj_From_DateStr(appoinment.obj.dtBegin));
//				if(diffDay === 1 || diffDay === 0) ++cDaily;

				
			})

			pr_lastAppointment 	= lastAppointment
			pr_cDaily			= cDaily
			pr_cWeeklyRemaining	= cWeeklyRemaining

			do_lc_build_noti(lastAppointment, cDaily, cWeeklyRemaining)
		}

		const do_lc_build_noti = (lastAppointment, cDaily, cWeeklyRemaining) => {
			if(lastAppointment.length > 0) {
				const lastAppointmentObj 			= req_gl_DateObj_From_DateStr(lastAppointment[0].obj.dtBegin);
				const lastAppointmentMinutes 		= lastAppointmentObj.getMinutes();
				const lastAppointmentMinutesText 	= lastAppointmentMinutes < 10 ? "0" + lastAppointmentMinutes : lastAppointmentMinutes;
				const lastAppointmentTime 			= lastAppointmentObj.getHours() + "h" + lastAppointmentMinutesText;
				
				$("#last_appointment").html(lastAppointment[0].obj.name + " " + lastAppointmentTime)
				
			} else $("#last_appointment").html($.i18n("prj_appointment_msg_no_last"))
   
			const curDateStr = req_gl_DateStr_LocalFormatShort(new Date())
			$("#daily_appointment b"	).html(curDateStr)
			$("#daily_appointment span"	).html(cDaily)

			$("#weekly_appointment span").html(cWeeklyRemaining)
		}
*/
		var do_lc_handle_date = (strDate) => {
			let tmp = getDateEN(strDate);
			let res = {};
			res.dt = tmp.slice(0, 10);
			res.tm = tmp.slice(11, 16);
			return res;
		}

			


	};

	return PrjAppointmentListWork;
});