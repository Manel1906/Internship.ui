define([
	'text!group/prj/user_appointment/tmpl/Prj_Appointment_View.html',
	'text!group/prj/user_appointment/tmpl/Prj_Appointment_New.html',
	'text!group/prj/user_appointment/tmpl/Prj_Appointment_Show.html',

	'group/prj/project/ctrl/PrjProjectEntTab',

], function(
	Prj_Appointment_New,
	Prj_Appointment_Show,

	PrjProjectEntTabManageMember,
) {

	var PrjAppointmentList = function(grpName, header, content, footer) {
		const tmplName = App.template.names;
		const tmplCtrl = App.template.controller;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS = "ServicePrjProject"; //to change by your need
		const pr_SERVICE_CLASS_DYN = "ServicePrjProjectDyn"; //to change by your need
		const pr_SV_LIST_DYN = "SVLstPage";
		const pr_SV_SAVE_MOVE = "SVTaskMove";

		const pr_SERVICE_AUT_CLASS = "ServiceAutUser";

		const pr_SV_USER_SEARCH = "SVLstForCalend";
		const pr_SV_GET_MEMBER = "SVGetMember";

		const self = this;
		//-----------------------------------------------------------------------------------
		var pr_ctr_Main = null;
		var pr_ForDesktop = true;
		var pr_ForVertial = false;

		var pr_SEARCHKEY = "";
		var pr_GROUP = null;

		var pr_lstAvailableTime = [];

		var TIME_RANGE = 3;
		var TYP_01_WORK_TASK = 200;
		var TYP_02_APPOINTMENT = 1000;

		const pr_TYP_MEMBER = 2;

		const STAT_ACTIVE = 1;
		const STAT_DESACTIVE = 2;

		var members = {};
		//		var membersDel 						= [];
		let files = { files: [] };
		var customers = [];
		var customersAdd = [];
		var customersDel = [];

		var dp_nav = null;
		var dp_schedule = null;
		var locale = "vi-vi";

		let pr_lastAppointment = []
		let pr_cDaily = 0
		let pr_cWeeklyRemaining = 0
		let pr_dtBegin = null
		var pr_ID = null;
		var pr_Obj = null;
		var pr_Code = null;
		var pr_Name = null;
		var pr_Name = null;
		var pr_dtEndMax = null;
		var pr_datetBegin = null;
		var pr_rowToDelete = null;
		var pr_grpName = "PrjProject";

		var pr_project = App.controller.UI[pr_grpName]
		const previousPositions = {};

		const pr_member_lev_manager = 0;

		const pr_stat_pending = 0;
		const pr_stat_active = 1;
		const pr_stat_accept = 3;
		const pr_stat_deny = 11;
		//	var pr_project						= App.controller.UI[pr_grpName]= {};
		var tmplPrj = App.template.names[pr_grpName];

		//--------------------APIs--------------------------------------//
		this.do_lc_init = function() {
			pr_ctr_Main = App.controller.UI.Main;

			tmplName.PRJ_APPOINTMENT_NEW = "Prj_Appointment_New";
			tmplName.PRJ_APPOINTMENT_SHOW = "Prj_Appointment_Show";
		}

		//---------show-----------------------------------------------------------------------------
		var pr_grpPath = 'group/user_appointment';
		var pr_showed = false;
		this.do_lc_show = function() {
			if (!pr_showed) {
				do_gl_lang_append(pr_grpPath + '/transl', self.do_lc_show_callback, []);
				pr_showed = true;
			} else {
				self.do_lc_show_callback();
			}
		};

		this.do_lc_show_callback = function(obj, dtBegin, dtEnd, forWorkTask) {
			try {
				let params = req_gl_Url_Params();
				let { id, code } = params;
				if(id || code){
					pr_ID = id
					pr_Code = code ? code : obj.code;
				}else{
					pr_ID = obj.id;
					pr_Code = obj.code ? obj.code : obj.code01
				}
				pr_IDUser = obj.idUser
				pr_Obj = obj
				
				pr_Name = obj.name ? obj.name : obj.inf01.name
				pr_dtEndMax = obj.dateEndMax
				pr_datetBegin = obj.datetBegin
				pr_rowToDelete = obj.rowToDelete
				do_register_locale_custom();
				do_build_schedulue(pr_lstAvailableTime, pr_dtBegin);

				do_get_availableTimeList(dp_schedule, dtBegin, dtEnd, forWorkTask);

				do_lc_bind_eventPage();
				$(document).prop('title', $.i18n('prj_project_sidebar_schedule'));
			} catch (e) {
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "PrjAppointmentList", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_init_element = function(e) {
			if (e) {
				if (e.files) files.files = e.files;
				let option = {
					fileinput: { maxFiles: 1, param: { typ01: 1, typ02: 1 } },//option here
					obj: files//file existing here
				}

				let dt01 = do_lc_handle_date(e.dtBegin);
				let dt02 = do_lc_handle_date(e.dtEnd);
				$("#dtpicker_Begin").datepicker("setDate", dt01.dt);
				$("#dtpicker_End").datepicker("setDate", dt02.dt);
				$("#tmpicker_Begin").timepicker({//timepicker
					showMeridian: false,
					defaultTime: dt01.tm,
					icons: {
						up: "mdi mdi-chevron-up",
						down: "mdi mdi-chevron-down"
					}
				});

				$("#tmpicker_End").timepicker({//timepicker
					showMeridian: false,
					defaultTime: dt02.tm,
					icons: {
						up: "mdi mdi-chevron-up",
						down: "mdi mdi-chevron-down"
					}
				});

				do_lc_bind_event_dtInput()
			} else {
				let option = {
					fileinput: { maxFiles: 1, param: { typ01: 1, typ02: 1 } },//option here
					obj: files//file existing here
				}

				var now30 = req_gl_DateAdd(new Date(), "m", 30);
				var now60 = req_gl_DateAdd(new Date(), "m", 60);
				now30 = do_lc_handle_date(now30);
				now60 = do_lc_handle_date(now60);

				$("#dtpicker_Begin").datepicker("setDate", now30.dt);
				$("#dtpicker_End").datepicker("setDate", now30.dt);
				$("#tmpicker_Begin").timepicker({//timepicker
					showMeridian: false,
					defaultTime: now30.tm,
					icons: {
						up: "mdi mdi-chevron-up",
						down: "mdi mdi-chevron-down"
					},
				});

				$("#tmpicker_End").timepicker({//timepicker
					showMeridian: false,
					defaultTime: now60.tm,
					icons: {
						up: "mdi mdi-chevron-up",
						down: "mdi mdi-chevron-down"
					}
				});

				do_lc_bind_event_dtInput()
			}
		}

		const do_lc_bind_event_dtInput = () => {
			$("#dtpicker_Begin").off("change").on("change", function() {
				const sDate = $(this).val()
				const eDate = $("#dtpicker_End").val()

				if (eDate < sDate) $("#dtpicker_End").val(sDate)
			})
			$("#tmpicker_Begin").off("change").on("change", function() {
				const sDate = $("#dtpicker_Begin").val()
				const eDate = $("#dtpicker_End").val()

				if (eDate != sDate) return;

				let sTimeArr = $(this).val().split(":")
				let eTimeArr = $("#tmpicker_End").val().split(":")

				if (sTimeArr.length <= 0 || eTimeArr.length <= 0) return

				const sHour = +sTimeArr[0]
				const sMinutes = +sTimeArr[1]
				const eHour = +eTimeArr[0]
				const eMinutes = +eTimeArr[1]

				const sMinutesStr = sMinutes < 10 ? `0${sMinutes}` : sMinutes

				if (eHour < sHour) $("#tmpicker_End").val(`${sHour}:${sMinutesStr}`)
				if (sHour == eHour && eMinutes < sMinutes) $("#tmpicker_End").val(`${sHour}:${sMinutesStr}`)
			})


			$("#dtpicker_End").off("change").on("change", function() {
				const eDate = $(this).val()
				const sDate = $("#dtpicker_Begin").val()

				if (eDate < sDate) $("#dtpicker_Begin").val(eDate)
			})
			$("#tmpicker_End").off("change").on("change", function() {
				const sDate = $("#dtpicker_Begin").val()
				const eDate = $("#dtpicker_End").val()

				if (eDate != sDate) return;

				let sTimeArr = $("#tmpicker_Begin").val().split(":")
				let eTimeArr = $(this).val().split(":")

				if (sTimeArr.length <= 0 || eTimeArr.length <= 0) return

				const sHour = +sTimeArr[0]
				const sMinutes = +sTimeArr[1]
				const eHour = +eTimeArr[0]
				const eMinutes = +eTimeArr[1]

				const eMinutesStr = eMinutes < 10 ? `0${eMinutes}` : eMinutes

				if (eHour < sHour) $("#tmpicker_Begin").val(`${eHour}:${eMinutesStr}`)
				if (sHour == eHour && eMinutes < sMinutes) $("#tmpicker_Begin").val(`${sHour}:${eMinutesStr}`)
			})
		}

		const do_lc_load_view = () => {
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_APPOINTMENT_NEW, Prj_Appointment_New);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_APPOINTMENT_SHOW, Prj_Appointment_Show);


			if ($(window).width() < 600) {
				pr_ForDesktop = false;
			}
			if ($(window).width() < $(window).height()) {
				pr_ForVertial = true;
			}
		}

		//-------------------------------------------------------------------------------------------------
		var do_register_locale_custom = function() {
			DayPilot.Locale.register(
				new DayPilot.Locale('vi-vi',
					{
						dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
						dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
						monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
						monthNamesShort: ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'],
						timePattern: 'h:mm tt',
						datePattern: 'M/d/yyyy',
						dateTimePattern: 'M/d/yyyy h:mm tt',
						timeFormat: 'Clock12Hours',
						weekStarts: 1
					}
				));
			let tmp = localStorage.getItem("language");
			if (tmp == "en") locale = "en-us";
			else locale = tmp + "-" + tmp;
		}

		var pr_backColor_01 = "#fff";
		var pr_backColor_02 = "beige";
		function do_build_schedulue(pr_lstAvailableTime, dtBegin) {
			// var date = new Date(pr_savedObject_Step_1.dt).getTime() - 2*60*60*24*1000;
			// var startDate = getDateISOShort(new Date(date));
			if (dtBegin != undefined) {
				var startDate = dtBegin
				var dtEnd = new Date(startDate);
				dtEnd.setDate(dtEnd.getDate() + 7);
				dtEnd = getDateISOShort(dtEnd);

			} else {
				var startDate = new Date();
				startDate.setDate(startDate.getDate() - 1); // get 2 days before
				startDate = getDateISOShort(startDate);
			}

			dp_nav = new DayPilot.Navigator("dp_nav");
			dp_schedule = new DayPilot.Calendar("dp_schedule");


			dp_nav.showMonths = pr_ForDesktop ? (pr_ForVertial ? 4 : 3) : 2;
			dp_nav.orientation = pr_ForDesktop ? "Vertical" : "Horizontal",
				dp_nav.skipMonths = 1;
			dp_nav.selectMode = "week";

			dp_nav.onTimeRangeSelected = function(args) {
				dp_schedule.startDate = args.day;
				do_get_availableTimeList(dp_schedule, args.start.value.replace("T", " "), args.end.value.replace("T", " "), true);
			};
			//		do_get_availableTimeList(dp_schedule,startDate, dtEnd);

			dp_nav.locale = locale;
			dp_nav.init();



			dp_schedule.viewType = "Week";
			//			dp_schedule.viewType 					= "Days";

			dp_schedule.startDate = startDate;

			dp_schedule.days = TIME_RANGE * 2 + 1;
			dp_schedule.eventClickHandling = "Select";
			dp_schedule.allowMultiSelect = false;
			dp_schedule.durationBarVisible = true;
			dp_schedule.weekStarts = 1;
			// dp_schedule.eventMoveHandling 		= "Disabled";
			// dp_schedule.eventResizeHandling 		= "Disabled";
			dp_schedule.timeRangeSelectedHandling 	= "Enable";
			dp_schedule.businessBeginsHour          = 8;
			dp_schedule.businessEndsHour            = 20;
			dp_schedule.headerDateFormat = "dd";
			dp_schedule.timeFormat = "Clock24Hours";
			//			dp_schedule.cssOnly 					= false;
			dp_schedule.cssClassPrefix = "workadm";
			//			dp_schedule.allowEventOverlap 			= false;
			//			// add list of schedules
			dp_schedule.events.list = pr_lstAvailableTime;

			if (pr_ForDesktop) {
				dp_schedule.heightSpec 				= "BusinessHours";
			} else {
				//				dp_schedule.height="400";
			}

			dp_schedule.onBeforeCellRender = function(args) {
				var cellDatePart = args.cell.start.getDatePart().getTime();
				var currentDatePart = new DayPilot.Date().getDatePart().getTime();
				var currentTime = new DayPilot.Date().getTime();
				if (cellDatePart === currentDatePart) {
					args.cell.backColor = "#f3f3f3";
				}
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
				if (args.data.tags.type !== "overdue") {
					if (typeof args.data.obj.inf02 === 'string') {
						args.data.obj.inf02 = JSON.parse(args.data.obj.inf02);
					}

					let userColor = null;

					if (Array.isArray(args.data.obj.inf02.color)) {
						userColor = args.data.obj.inf02.color.find(item => item.id === App.data.user.id);
					}

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
					{
						top: 2,
						right: 2,
						icon: "icon-triangle-down",
						visibility: "Hover",
						action: "ContextMenu",
						style: "font-size: 12px; background-color: #f9f9f9; border: 1px solid #ccc; padding: 2px 2px 0px 2px; cursor:pointer;"
					}
				];


				//args.data.backColor 	= pr_backColor_01;
				var div = "";
				if (args.data.members) {
					for (var key in args.data.members) {
						let item = args.data.members[key].mem;

						let textColor = null;
						let textAvatar = null
						if (!item.avatar) {
							let first = item.login01.charAt(0);
							let last = item.login01.charAt(item.login01.length - 1);
							let index = var_gl_alphabet.indexOf(first.toLowerCase());

							textColor = var_gl_colors[index];
							textAvatar = first + last;
						}

						let classCss = "";
						let opacity = "";
						if (args.data.members[key].stat === 2) {
							classCss = "text-decoration-line-through ";
							opacity = "opacity-03"
						}

						let selOpt = `<div class='team-member member-item no-padding d-flex'>`;

						if (!item.avatar) selOpt += `<div class="rounded-circle avatar-xs text-white mx-1 text-uppercase text-center ${opacity}" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div><span class="tooltiptext ${classCss}">${item.name}</span>`;
						else selOpt += `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs ${opacity}'/><span class="tooltiptext ${classCss}">${item.name}</span>`;
						selOpt += `</div>`;
						div += selOpt;
					};
				}

				args.data.html = "<p><b>" + args.data.text + "</b></p>" + "<p class='long-txt'><i>" + args.data.obj.inf02.desc + "</i></p>" + "<div id='div_prj_list' class='row ml-1'>" + div + "</div>";
			};

			dp_schedule.onTimeRangeSelected = function(args) {
				dp_schedule.clearSelection();
				const now = new Date();
				let pr_dtEndDate = null;
				let pr_dtBeginDate = null;
				
				// Check if pr_dtEndMax and pr_dtBeginDate exist before proceeding
				if (pr_dtEndMax) {
				    pr_dtEndDate = new Date(pr_dtEndMax.replace(" ", "T"));
				}
				if (pr_datetBegin) {
				    pr_dtBeginDate = new Date(pr_datetBegin.replace(" ", "T"));
				}
				const startDate = args.start?.value ? new Date(args.start.value.replace(" ", "T")) : null;
				const endDate = args.end?.value ? new Date(args.end.value.replace(" ", "T")) : null;
				if ((startDate && now > startDate) || (endDate && now > endDate)) {
				    do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_get'));
				    return;
				}
				if (pr_dtBeginDate && now > pr_dtBeginDate) {
				    do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_get'));
				    return;
				}
				if (pr_dtEndDate && startDate && pr_dtEndDate > startDate) {
				    do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_get'));
				    return;
				}
				App.MsgboxController.do_lc_show({
					title: $.i18n("prj_appointment_msg_title_new_calendar"),
					content: tmplCtrl.req_lc_compile_tmpl(tmplName.PrjProject.PRJ_APPOINTMENT_NEW, { obj: pr_Obj }),
					autoclose: true,
					buttons: {
						SEND: {
							lab: "<i class='mdi mdi-send'></i>",
							funct: do_lc_create_appointment,
							autoclose: true
						},
					},
					onClose: () => {
						members = {};
						//						membersDel  = [];
						files = { files: [] };
						customers = [];
						customersAdd = [];
						customersDel = [];
					},
					css: {
						"max-width": "600px",
						"min-width": "350px",
						"display": "flex",
						"margin": "auto"
					}
				});
				//	do_lc_binding_event_add_customer(false);
				//	do_lc_req_autocomplete();


				let dt01 = do_lc_handle_date(new Date(args.start.value));
				let dt02 = do_lc_handle_date(new Date(args.end.value));

				$("#dtpicker_Begin").datepicker("setDate", dt01.dt);
				$("#dtpicker_End").datepicker("setDate", dt02.dt);
				$("#tmpicker_Begin").timepicker({//timepicker
					showMeridian: false,
					defaultTime: dt01.tm,
					icons: {
						up: "mdi mdi-chevron-up",
						down: "mdi mdi-chevron-down"
					}
				});

				$("#tmpicker_End").timepicker({//timepicker
					showMeridian: false,
					defaultTime: dt02.tm,
					icons: {
						up: "mdi mdi-chevron-up",
						down: "mdi mdi-chevron-down"
					}
				});
			};

			dp_schedule.onEventClick = function(args) {
				const now = new Date();
				let pr_dtBeginDate = null;
				if (pr_datetBegin) {
				    pr_dtBeginDate = new Date(pr_datetBegin.replace(" ", "T"));
				}
				if (pr_dtBeginDate && now > pr_dtBeginDate) {
				    do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_get'));
				    return;
				}

				if (args.e.data.tags.type !== "overdue") {
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
					//		if(!args.e.data.members || !Object.values(args.e.data.members).find(e => e.uId === App.data.user.id)) return
					if (args.e.data.obj.val02) {
						if (!/^https?:\/\//i.test(args.e.data.obj.val02)) {
							args.e.data.obj.val02 = 'http://' + args.e.data.obj.val02;
						}
					}
					App.MsgboxController.do_lc_show({
						title: $.i18n("prj_appointment_msg_title_calendar"),
						content: tmplCtrl.req_lc_compile_tmpl(tmplName.PrjProject.PRJ_APPOINTMENT_SHOW, args.e.data.obj),
						autoclose: true,
						buttons: "none",
						onClose: () => {
							members = {};
							//							membersDel  = [];
							files = { files: [] };
						},
						css: {
							"max-width": "500px",
							"min-width": "350px",
							"display": "flex",
							"margin": "auto"
						}
					});
					var div = "";
					if (args.e.data.members) {
						for (var key in args.e.data.members) {

							let classCss = "";
							let opacity = "";
							let textStyle = "";
							let mem = args.e.data.members[key];
							if (mem.stat && mem.stat === 2) {
								classCss = "text-decoration-line-through ";
								opacity = "opacity-03"
							}

							if (mem.stat && mem.stat === pr_stat_accept) {
								textStyle = "color: #32CD32;";
							}

							if (mem.stat && mem.stat === 1) {
								classCss = "text-decoration-line-through text-danger";
								textStyle = "text-decoration-thickness: 1.5px;";
							}

							let item = mem.mem;
							let selOpt = `<div class='team-member member-item d-flex'>`;

							let textColor = null;
							let textAvatar = null
							if (!item.avatar) {
								let first = item.login01.charAt(0);
								let last = item.login01.charAt(item.login01.length - 1);
								textColor = App.controller.UI.Def.reqSrcTextColor(item.login01);
								textAvatar = first + last;
							}

							if (!item.avatar) selOpt += `<div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center ${opacity}" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div><span class="tooltiptext ${classCss}" style="${textStyle}"> ${item.name}</span>`;
							else selOpt += `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs ${opacity} mr-1 avatar-autocomplete'/><span class="tooltiptext ${classCss}" style="${textStyle}">${item.name}</span>`;

							selOpt += `</div>`;
							div += selOpt;
						};
					}
					if (div) {
						$("#div_list_member").append(div)
					} else {
						$("#div_list_member_par").remove();
					}

					var divButtonEdit = $("#div_button_edit");
					var divButtonDelete = $("#div_button_delete");
					var divButtonAccept = $("#div_button_accept");
					var divButtonDeny = $("#div_button_deny");
					var divButtonUnaccept = $("#div_button_unaccept").hide();
					var divButtonUndeny = $("#div_button_undeny").hide();
					const now = new Date();
					const isPastEvent = now >= new Date(args.e.data.start) || now >= new Date(args.e.data.end);
					if (isPastEvent) {
						divButtonAccept.hide();
						divButtonDeny.hide();
						divButtonEdit.hide();
						divButtonDelete.hide();
					}
					const isSuperAdmin = App.controller.common.Login && App.controller.common.Login.can_lc_User_SuperAdmin();
					if (isSuperAdmin) {
						divButtonAccept.hide();
						divButtonDeny.hide();
					}

					var e = args.e;
					if (e.data.obj.uId == App.data.user.id) {
						divButtonAccept.hide();
						divButtonDeny.hide();
					} else {
					//	divButtonEdit.hide();
					//	divButtonDelete.hide();
						
						divButtonAccept.hide();
						divButtonDeny.hide();

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
						var e = args.e.data.obj;
						App.MsgboxController.do_lc_show({
							title: $.i18n("prj_appointment_msg_title_edit_calendar"),
							content: tmplCtrl.req_lc_compile_tmpl(tmplName.PrjProject.PRJ_APPOINTMENT_NEW, { ent: e,obj: pr_Obj }),
							autoclose: true,
							buttons: {
								SEND: {
									lab: "<i class='mdi mdi-send'></i>",
									funct: function() { do_lc_mod_appointment(e); },
									autoclose: true
								},
							},
							onClose: () => {
								members = {};
								//									membersDel  = [];
								files = { files: [] };
								customers = [];
								customersAdd = [];
								customersDel = [];
							},
							css: {
								"max-width": "600px",
								"min-width": "350px",
								"display": "flex",
								"margin": "auto"
							}
						});
						do_lc_init_element(e);
						do_lc_build_view_member(args.e.data.members, "#div_list_member"); // build lst member
						do_lc_build_view_customer(args.e.data.obj.val01, "#div_list_email_customer");
						do_lc_binding_event_add_customer(true);
						do_lc_bind_event_autocomplete(); // bind event delete for each member element

						do_lc_req_autocomplete();
					});

					divButtonDelete.on('click', function() {
						do_lc_remove_appointment(args.e);
						App.MsgboxController.do_lc_close();
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

					function isValidURL(string) {
						var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
						return (res !== null)
					};

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
				const dayStart = args.newStart.value.replace("T", " ")
				const dayEnd = args.newEnd.value.replace("T", " ")

				const obj = args.e.data.obj;
				obj.dtBegin = dayStart
				obj.dtEnd = dayEnd

				do_lc_mod_prj_appointment(obj)
			}

			dp_schedule.onEventResized = function(args) {
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
				const dayStart = args.e.start().value.replace("T", " ")
				const dayEnd = args.e.end().value.replace("T", " ")

				const obj = args.e.data.obj;
				obj.dtBegin = dayStart
				obj.dtEnd = dayEnd

				do_lc_mod_prj_appointment(obj)
			};

			dp_schedule.contextMenu = new DayPilot.Menu({
				items: [
					{
						text: $.i18n("prj_appointment_event_edit"),
						icon: "fa fa-solid fa-play ic-blue",
						onClick: function(args) {
							var e = args.source.data.obj;
							App.MsgboxController.do_lc_show({
								title: $.i18n("prj_appointment_msg_title_calendar"),
								content: tmplCtrl.req_lc_compile_tmpl(tmplName.PrjProject.PRJ_APPOINTMENT_NEW, { ent: e }),
								autoclose: true,
								buttons: {
									SEND: {
										lab: "<i class='mdi mdi-send'></i>",
										funct: function() { do_lc_mod_appointment(e); },
										autoclose: true
									},
								},
								onClose: () => {
									members = {};
									//									membersDel  = [];
									files = { files: [] };
									customers = [];
									customersAdd = [];
									customersDel = [];
								},
								css: {
									"max-width": "600px",
									"min-width": "350px",
									"display": "flex",
									"margin": "auto"
								}
							});

							do_lc_init_element(e);

							do_lc_build_view_member(args.source.data.members, "#div_list_member"); // build lst member
							do_lc_build_view_customer(args.source.data.obj.val01, "#div_list_email_customer");
							do_lc_binding_event_add_customer(true);
							do_lc_bind_event_autocomplete(); // bind event delete for each member element

							do_lc_req_autocomplete();
						}

					},
					{
						text: $.i18n("prj_appointment_event_del"),
						icon: "fa fa-solid fa-play ic-red",
						onClick: function(args) {
							var e = args.source;
							do_lc_remove_appointment(e);
						}
					},
					{
						text: $.i18n("prj_appointment_event_denied"),
						icon: "fa fa-solid fa-play ic-yellow",
						onClick: function(args) {
							var e = args.source;
							do_lc_deny_appointment(e);
						}
					},

					{
						text: $.i18n("prj_appointment_event_accepted"),
						icon: "fa fa-solid fa-play ic-green",
						onClick: function(args) {
							var e = args.source;
							do_lc_accept_appointment(e);
						}
					},
					{
						text: $.i18n("prj_appointment_event_undenied"),
						icon: "fa fa-solid fa-play ic-yellow",
						onClick: function(args) {
							var e = args.source;
							do_lc_cancel_appointment(e);
						}
					},

					{
						text: $.i18n("prj_appointment_event_unaccepted"),
						icon: "fa fa-solid fa-play ic-yellow",
						onClick: function(args) {
							var e = args.source;
							do_lc_cancel_appointment(e);
						}
					},
					{
						text: "-"
					},
					{
						text: $.i18n("prj_appointment_color_blue"),
						icon: "fa fa-square ic-blue",
						color: "#556ee6",
						onClick: function(args) { updateColor(args.source, args.item.color); }
					},
					{
						text: $.i18n("prj_appointment_color_green"),
						icon: "fa fa-square ic-green",
						color: "#34c38f",
						onClick: function(args) { updateColor(args.source, args.item.color); }
					},
					{
						text: $.i18n("prj_appointment_color_yellow"),
						icon: "fa fa-square ic-yellow",
						color: "#f1c232",
						onClick: function(args) { updateColor(args.source, args.item.color); }
					},
					{
						text: $.i18n("prj_appointment_color_red"),
						icon: "fa fa-square ic-red",
						color: "#cc0000",
						onClick: function(args) { updateColor(args.source, args.item.color); }
					},

				],
				onShow: function(args) {
					const now = new Date();
					const isPastEvent = now >= new Date(args.source.data.start) || now >= new Date(args.source.data.end);
					const isSuperAdmin = App.controller.common.Login && App.controller.common.Login.can_lc_User_SuperAdmin();
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
					if (isSuperAdmin) {
						args.menu.items[2].hidden = true;
						args.menu.items[3].hidden = true;
						return;
					}

					var e = args.source;
					if (e.data.obj.uId == App.data.user.id) {
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

			const picker = new DayPilot.DatePicker({
				target: 'nav_calendar_show',
				pattern: 'yyyy-MM-dd',
				onTimeRangeSelected: (args) => {
					dp_schedule.update({ startDate: args.start });
				}
			});

			const app = {
				elements: {
					previous: document.getElementById("previous"),
					next: document.getElementById("next"),
					nav_calendar: document.getElementById("nav_calendar")
				},
				addEventHandlers() {
					app.elements.previous.addEventListener("click", (e) => {
						e.preventDefault();
						const newDate = dp_schedule.startDate.addDays(-7);
						app.changeDate(newDate);

						const startDate = newDate.addDays(-6);
						const endDate = newDate.addDays(1);
						do_get_availableTimeList(dp_schedule, startDate.toString(), endDate.toString(), true);
					});

					app.elements.next.addEventListener("click", (e) => {
						e.preventDefault();
						const newDate = dp_schedule.startDate.addDays(7);
						app.changeDate(newDate);

						const startDate = newDate.addDays(-6);
						const endDate = newDate.addDays(1);

						do_get_availableTimeList(dp_schedule, startDate.toString(), endDate.toString(), true);
					});

					app.elements.nav_calendar.addEventListener('click', (e) => {
						e.preventDefault();
						picker.show();
					});
				},
				changeDate(date) {
					const startDate = date.firstDayOfWeek();
					const days = 7;
					const events = [];

					dp_schedule.update({
						startDate,
						days,
						events
					});
				},
				init() {
					app.addEventHandlers();
				}
			};

			app.init();

		}

		var do_lc_mod_appointment = function(e) {
			let data = req_gl_data({
				dataZoneDom: $("#div_create_prj_appointment")
			});
			let prj = data.data;
			prj.dtBegin = do_lc_convert_date(prj.dtBegin).replace("T", " ");
			prj.dtEnd = do_lc_convert_date(prj.dtEnd).replace("T", " ");

			const dtBeginn = req_gl_DateObj_From_DateStr(prj.dtBegin);
			const dtEndd = req_gl_DateObj_From_DateStr(prj.dtEnd);
			const currentDate = new Date();

			if (req_gl_Date_CompareObj(dtEndd, dtBeginn) <= 0) {
				do_gl_show_Notify_Msg_Error($.i18n("prj_appointment_dt_msg_err"));
				return;
			} else if (req_gl_Date_CompareObj(dtBeginn, currentDate) <= 0) {
				do_gl_show_Notify_Msg_Error($.i18n("prj_appointment_dt_today_msg_err"));
				return;
			}

			//	if(req_gl_Date_CompareObj(req_gl_DateObj_From_DateStr(prj.dtEnd), req_gl_DateObj_From_DateStr(prj.dtBegin)) < 0) {
			//		do_gl_show_Notify_Msg_Error($.i18n("prj_appointment_dt_msg_err"))

			//		return
			//	}
			//	if(req_gl_Date_CompareObj(req_gl_DateObj_From_DateStr(currentDate), req_gl_DateObj_From_DateStr(prj.dtBegin)) > 0) {
			//		do_gl_show_Notify_Msg_Error($.i18n("prj_appointment_dt_msg_err"))

			//		return
			//	}



			prj.files = files.files;
			prj.typ01 = TYP_01_WORK_TASK;
			// prj.typ02 	= TYP_02_APPOINTMENT;
			prj.nb = 0;
			prj.val01 = JSON.stringify(customers);

			if (Array.isArray(e.inf02.color)) {
				prj.inf02.color = e.inf02.color;
			}
			do_lc_mod_prj_appointment(prj);
		}
		var do_lc_mod_prj_appointment = function(prj) {
			let dataSend = { obj: JSON.stringify(prj), member: JSON.stringify(Object.values(members)), customersAdd: JSON.stringify(customersAdd), customersDel: JSON.stringify(customersDel) };
			let ref = req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVModMeet", dataSend);

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_mod_prj_appointment_success, []));

			let fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);

		}
		var do_lc_mod_prj_appointment_success = function(sharedJson) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				//	dp_schedule.message($.i18n("prj_appointment_msg_update"));
				do_gl_show_Notify_Msg_Success($.i18n("prj_appointment_msg_update_ajax"));

				// reload
				if (dp_nav && dp_schedule) {
					do_get_availableTimeList(dp_schedule, dp_nav.selectionStart.value.replace("T", " "), dp_nav.selectionEnd.addDays(1).value.replace("T", " "), true);
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
			members = {};
			//			membersDel = [];
		}

		var updateColor = function(e, color) {
			var colorArray = e.data.obj.inf02.color || [];

			var existingEntry = colorArray.find(entry => entry.id === App.data.user.id);
			if (existingEntry) {
				existingEntry.cl = color;
			} else {
				colorArray.push({ "id": App.data.user.id, "cl": color });
			}

			e.data.color = colorArray;
			do_lc_edit_color_appointment(e, colorArray);
		}
		var do_lc_edit_color_appointment = function(e, color) {
			let prj = e.data.obj;
			prj.inf02.color = color;
			let dataSend = { obj: JSON.stringify(prj) };
			let ref = req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVModMeet", dataSend);
			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_edit_color_appointment_success, [e]));

			let fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		var do_lc_edit_color_appointment_success = function(sharedJson, e) {
			if (can_gl_AjaxSuccess(sharedJson, e)) {
				dp_schedule.events.update(e);
				//		dp_schedule.message($.i18n("prj_appointment_msg_update_color"));
				do_gl_show_Notify_Msg_Success($.i18n("prj_appointment_msg_update_ajax"));
				// reload
				if (dp_nav && dp_schedule) {
					do_get_availableTimeList(dp_schedule, dp_nav.selectionStart.value.replace("T", " "), dp_nav.selectionEnd.addDays(1).value.replace("T", " "), true);
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}

		var do_lc_remove_appointment = function(e) {
			let prj = e.data.obj;
			//let dataSend	= {id: e.data.obj.id};
			let dataSend = { obj: JSON.stringify(prj) };
			let ref = req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVDelMeet", dataSend);

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_remove_appointment_success, [e]));

			let fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		var do_lc_remove_appointment_success = function(sharedJson, e) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				dp_schedule.events.remove(e);
				//		dp_schedule.message($.i18n("prj_appointment_msg_del")); 
				do_gl_show_Notify_Msg_Success($.i18n("prj_appointment_msg_del_ajax"));
				// reload
				if (dp_nav && dp_schedule) {
					do_get_availableTimeList(dp_schedule, dp_nav.selectionStart.value.replace("T", " "), dp_nav.selectionEnd.addDays(1).value.replace("T", " "), true);
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}


		var do_lc_deny_appointment = function(e) {
			let dataSend = { id: e.data.obj.id, stat: pr_stat_active };
			let ref = req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVModStatMemMeet", dataSend);

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_deny_appointment_success, [e]));

			let fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		var do_lc_deny_appointment_success = function(sharedJson, e) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				dp_schedule.events.remove(e);
				//		dp_schedule.message($.i18n("prj_appointment_msg_deny")); 
				// reload
				if (dp_nav && dp_schedule) {
					do_get_availableTimeList(dp_schedule, dp_nav.selectionStart.value.replace("T", " "), true);
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}

		var do_lc_accept_appointment = function(e) {
			let dataSend = { id: e.data.obj.id, stat: pr_stat_accept };
			let ref = req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVModStatMemMeet", dataSend);

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_accept_appointment_success, [e]));

			let fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_accept_appointment_success = function(sharedJson, e) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				dp_schedule.events.remove(e);
				//        dp_schedule.message($.i18n("prj_appointment_msg_accept")); 
				// reload
				if (dp_nav && dp_schedule) {
					do_get_availableTimeList(dp_schedule, dp_nav.selectionStart.value.replace("T", " "), true);
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}

		var do_lc_cancel_appointment = function(e) {
			let dataSend = { id: e.data.obj.id, stat: pr_stat_pending };
			let ref = req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVModStatMemMeet", dataSend);

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_cancel_appointment_success, [e]));

			let fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_cancel_appointment_success = function(sharedJson, e) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				dp_schedule.events.remove(e);
				//     dp_schedule.message($.i18n("prj_appointment_msg_cancel")); 
				// reload
				if (dp_nav && dp_schedule) {
					do_get_availableTimeList(dp_schedule, dp_nav.selectionStart.value.replace("T", " "), true);
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

		var do_lc_create_appointment = function() {
			let data = req_gl_data({
				dataZoneDom: $("#div_create_prj_appointment")
			});

			let prj = data.data;
			prj.uId01 = pr_IDUser
			prj.typ02 = pr_ID;
			prj.stat01 = STAT_ACTIVE; //Active
			prj.dtBegin = do_lc_convert_date(prj.dtBegin).replace("T", " ");
			prj.dtEnd = do_lc_convert_date(prj.dtEnd).replace("T", " ");

			const dtBeginn = req_gl_DateObj_From_DateStr(prj.dtBegin);
			const dtEndd = req_gl_DateObj_From_DateStr(prj.dtEnd);
			const currentDate = new Date();

			if (req_gl_Date_CompareObj(dtEndd, dtBeginn) <= 0) {
				do_gl_show_Notify_Msg_Error($.i18n("prj_appointment_dt_msg_err"));
				return;
			}
			else if (req_gl_Date_CompareObj(dtBeginn, currentDate) <= 0) {
				do_gl_show_Notify_Msg_Error($.i18n("prj_appointment_dt_today_msg_err"));
				return;
			}

			prj.cinf02mt01 = {
				"dtBegin": prj.dtBegin,
				"dtEnd": prj.dtEnd,
			}
			prj.files = files.files;
			prj.typ01 = TYP_01_WORK_TASK;
			// prj.typ02 	= TYP_02_APPOINTMENT;
			prj.nb = 0;
			prj.val01 = JSON.stringify(customers);
			if (prj.val02 && !/^https?:\/\//i.test(prj.val02)) {
				prj.val02 = 'http://' + prj.val02;
			}

			members[App.data.user.id] = {
				uId: App.data.user.id,
				typ: 0
			}
			Object.values(members).map(e => e.stat = pr_stat_pending)

			do_lc_create_prj_appointment(prj);
		}

		const do_lc_create_prj_appointment = prj => {
			let dataSend = { obj: JSON.stringify(prj), member: JSON.stringify(Object.values(members)), customers: JSON.stringify(customers) };
			// let dataSend	= {obj: JSON.stringify(prj)};
			let ref = req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVNewTaskSchedule", dataSend);

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_create_prj_appointment_success, [prj]));

			let fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_create_prj_appointment_success = (sharedJson, prj) => {
			if (can_gl_AjaxSuccess(sharedJson)) {
				// reload
				do_gl_show_Notify_Msg_Success($.i18n("prj_appointment_msg_new_ajax"));
				if (dp_nav && dp_schedule) {
					do_get_availableTimeList(dp_schedule, dp_nav.selectionStart.value.replace("T", " "), dp_nav.selectionEnd.addDays(1).value.replace("T", " "), true);
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_save'));
			}
			members = {};
			//			membersDel = [];w
		}

		const do_lc_convert_date = (objDate) => {
			if (objDate.time.length < 5) objDate.time = "0" + objDate.time;
			return objDate.date.substr(0, 10) + "T" + objDate.time.substr(0, 5) + ":00";
		}

		const do_lc_bind_eventPage = (lstCurObj) => {
		$("#div_btn_accept").off('click').click(() => {
		    let result = [];
		    let minDate = null;
		    let maxDate = null;
		    let totalTime = 0;
		    let member = null; 
		
		    try {
		        const pr_dtEndDate = pr_dtEndMax ? new Date(pr_dtEndMax.replace(" ", "T")) : null;
		
		        lstCurObj.forEach((obj, index) => {
		            const startDateStr = obj.obj.dtBegin;
		            const endDateStr = obj.obj.dtEnd;
		
		            const startDate = new Date(startDateStr);
		            const endDate = new Date(endDateStr);
		
		            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
		                throw new Error("Invalid date format");
		            }
		
		            if (pr_dtEndDate && startDate <= pr_dtEndDate) {
		                return;
		            }
		
		            let timeDifference;
		            if (pr_dtEndDate && startDate > pr_dtEndDate) {
		                const effectiveStartDate = startDate > pr_dtEndDate ? startDate : pr_dtEndDate;
		                timeDifference = endDate - effectiveStartDate;
		            } else {
		                timeDifference = endDate - startDate;
		            }
		
		            const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);
		            totalTime += timeDifferenceInHours;
		
		            if (minDate === null || startDate < minDate) {
		                minDate = startDate;
		            }
		            if (maxDate === null || endDate > maxDate) {
		                maxDate = endDate;
		            }
		            if (index === 0) {
		                member = obj.member;
		            }
		        });
		
		        const formatDate = (date) => {
		            const pad = (num) => (num < 10 ? '0' + num : num);
		            const year = date.getFullYear();
		            const month = pad(date.getMonth() + 1);
		            const day = pad(date.getDate());
		            const hours = pad(date.getHours());
		            const minutes = pad(date.getMinutes());
		            const seconds = pad(date.getSeconds());
		
		            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		        };
		
		        const formattedMinDate = minDate ? formatDate(minDate) : null;
		        const formattedMaxDate = maxDate ? formatDate(maxDate) : null;
		
		        const dateBegin = pr_dtEndMax ? pr_dtEndMax : formattedMinDate;
		
		        result.push({
		            dateBegin: dateBegin, 
		            dateEnd: formattedMaxDate,   
		            member: member && member.id ? member : { id: pr_IDUser},
		            totalTime: totalTime, 
		            id: pr_ID,
		            code: pr_Code,
		            name: pr_Name,
		            avatar: pr_Obj.avatarUser,
		            username: pr_Obj.username
		        });
		
		        console.log(result);
		    } catch (error) {
		        console.error("Error:", error.message);
		    }
		    App.MsgboxController.do_lc_close();
		    if(pr_rowToDelete) pr_rowToDelete.remove();
		    result.forEach(item => {
		  	item.member.username = item.username;
		  	delete item.username;
			})
		    pr_project.EntManageMember.do_lc_show_data_calendar(result);
		});


			$("#toggleNav").off('click').click(() => {
				const $dpNav = $("#dp_nav");
				const $dpNavBtn = $("#dp_nav_btn");

				if ($dpNav.is(':visible')) {
					$dpNav.hide();
					$dpNavBtn.show();
				} else {
					$dpNav.show();
					$dpNavBtn.hide();
				}
			});
			$("#btn_create_prj").off('click').click(() => {
				App.MsgboxController.do_lc_show({
					title: $.i18n("prj_appointment_msg_title_new_calendar"),
					content: tmplCtrl.req_lc_compile_tmpl(tmplName.PrjProject.PRJ_APPOINTMENT_NEW, { obj: pr_Obj }),
					autoclose: true,
					buttons: {
						SEND: {
							lab: "<i class='mdi mdi-send'></i>",
							funct: do_lc_create_appointment,
							autoclose: true
						},
					},
					onClose: () => {
						members = {};
						//						membersDel  = [];
						files = { files: [] };
						customers = [];
						customersAdd = [];
						customersDel = [];
					},
					css: {
						"max-width": "600px",
						"min-width": "350px",
						"display": "flex",
						"margin": "auto"
					}
				});
				do_lc_init_element();
				//	do_lc_req_autocomplete();
			});

			$("#dtpicker_Begin")
		}

		const do_lc_bind_event_autocomplete = () => {
			$(".btn-remove-member").off("click").on("click", function() {
				let $this = $(this);
				let parent = $this.parent();
				let { id } = $this.data();

				//				if(members.id)	delete members.id;
				//				membersDel.push(id);
				if (members[id]) delete members[id];
				parent.remove();
			})
		}

		const do_lc_binding_event_add_customer = function(mod) {
			$("#btn_add_customer").off("click").on("click", function() {
				let email = $(".inp-email-customer").val();
				let validate = validateEmail(email);
				if (!validate) {
					$(".inp-email-customer").css("border", "1px solid red");
					return;
				}
				if (customers.indexOf(email) > -1) {
					$(".inp-email-customer").css("border", "1px solid red");
					return
				}

				$("#div_list_email_customer").append(`<div class="mr-1"><button class="btn btn-secondary">${email}</button><a data-email='${email}' class='text-danger btn-remove-customer' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a><div>`);
				$(".inp-email-customer").val("");
				customers.push(email);
				if (mod) customersAdd.push(email);
				$(".inp-email-customer").css("border", "unset");

				function validateEmail(email) {
					const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return re.test(String(email).toLowerCase());
				}

				do_lc_binding_event_add_customer(mod);
			})


			$(".btn-remove-customer").off("click").on("click", function() {
				let $this = $(this);
				let { email } = $this.data();
				let parent = $this.parent();
				let index = customers.indexOf(email);
				customers.splice(index, 1);
				customersDel.push(email);

				let idx = customersAdd.indexOf(email);
				if (idx > -1) customersAdd.splice(idx, 1);

				parent.remove();
			})

		}
		//------------------------------------------------------------------------------------
		//-------------------------------------------------------------------------------------------------
		function do_get_availableTimeList(dp, dtBegin, dtEnd, forWorkTask) {
			var ref = req_gl_Request_Content_Send("ServicePrjProject", "SVLstSchedule");
			//	ref.typ01s 	= 100;
			ref.typ01s = 200;
			ref.typ02 = pr_ID;
			ref.uId01 = parseInt(pr_IDUser, 10);
			ref.code01 = pr_Code;

			var fSucces = [];
			fSucces.push(req_gl_funct(null, do_show_list_available_time, [true, dp, forWorkTask]));

			var fError = req_gl_funct(null, do_show_list_available_time, [false]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		//--------------------------------------------------------------------------------------------
		function do_show_list_available_time(sharedJson, ajaxStat, dp, forWorkTask) {
			if (ajaxStat) {
				var code = sharedJson[App['const'].SV_CODE];
				if (code == App['const'].SV_CODE_API_YES) {
					pr_lstAvailableTime = [];
					var lstTime = sharedJson[App['const'].RES_DATA];
					if (lstTime.length > 0) {
						//						const dataSend = [];
						const lstCurObj = [];
						const listObj = [];
						var curTime = (new Date()).getTime();
						for (let i = 0; i < lstTime.length; i++) {
							if (lstTime[i]) {
								var curObj = {};
								curObj.start = lstTime[i].dtBegin;
								curObj.end = lstTime[i].dtEnd;

								if (!curObj.start || !curObj.end) continue;

								//curObj.text	  		= lstTime[i].name;
								// Check mems.stat and strike-through name if mem.stat == 1 for current user
								const currentUser = App.data.user.id;
								const userMem = lstTime[i].mems && lstTime[i].mems.find(mem => mem.uId === currentUser);

								if (userMem && userMem.stat === 1) {
									curObj.text = `<span style="text-decoration: line-through; text-decoration-thickness: 2px;">${lstTime[i].name}</span>`;
								} else {
									curObj.text = lstTime[i].name;
								}

								curObj.id = DayPilot.guid();
								if (lstTime[i].inf02) {
									curObj.toolTip = lstTime[i].inf02.desc;
								}
								curObj.tags = {};

								//								curObj.backColor 	= "#fff";
								//								curObj.borderColor  = "#1066a8";
								curObj.obj = lstTime[i];

								// curObj.obj.cmt01 = JSON.parse(lstTime[i].cmt01);
								if (curObj.obj && curObj.obj.inf02) {
									if (curObj.obj.inf02.dt01) {
										curObj.obj.inf02.dt01 = new Date(curObj.obj.inf02.dt01);
									}

									if (curObj.obj.inf02.dt02) {
										curObj.obj.inf02.dt02 = new Date(curObj.obj.inf02.dt02);
									}
								}
								curObj.member = pr_Obj.member
								lstCurObj.push(curObj);
							}
						};
						do_lc_show_list_member(dp, lstCurObj, forWorkTask);
						do_lc_req_appointment_noti(lstCurObj);
						do_lc_bind_eventPage(lstCurObj)

						// do_lc_get_list_member_when(dp, dataSend, lstTime, lstCurObj);
					}
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}

			if (dp) dp.update();
		}


		const do_lc_show_list_member = (dp, lstTime, forWorkTask = false) => {
			lstTime.forEach((e, index) => {
				let curObj = lstTime[index];
				let curObj_uID = e.obj.uId;
				let mems = e.obj.mems || [];

				const is_Me = mems.find(m => m.uId == App.data.user.id && m.stat != STAT_DESACTIVE);
				const isSuperAdmin = App.controller.common.Login && App.controller.common.Login.can_lc_User_SuperAdmin();
				const isOwner = App.data.user.id === curObj_uID;

				let objData = mems.reduce((currentObj, mem) => {
					if (mem.uId == curObj_uID) {
						mem.isOwner = true;
						mem.isSuperAdmin = isSuperAdmin;

						if (!isSuperAdmin && !isOwner) {
							if (mem.typ == pr_TYP_MEMBER) mem.notModif = true;
						}
					}

					currentObj[mem.id] = mem;
					return currentObj;
				}, {});

				curObj.members = objData;

				if (is_Me || isOwner || isSuperAdmin || forWorkTask) pr_lstAvailableTime.push(curObj);
				// if (isOwner || isSuperAdmin)	pr_lstAvailableTime.push(curObj);
			});

			if (dp) {
				dp.events.list = pr_lstAvailableTime;
				dp.update();
			}
		}

		const do_lc_req_appointment_noti = (lstTime) => {
			const curDate = new Date();
			const curDay = curDate.getDay() === 0 ? 7 : curDate.getDay() + 1;
			const diffDayCheck = req_gl_DayDiff(req_gl_DateObj_From_DateStr(pr_dtBegin));

			if ((diffDayCheck + 1) > (7 - curDay)) return;

			let lastAppointment = [];
			let cDaily = 0;
			let cWeeklyRemaining = 0;

			lstTime.forEach(appoinment => {
				const dtBeginObj = req_gl_DateObj_From_DateStr(appoinment.obj.dtBegin);
				const dtEndObj = req_gl_DateObj_From_DateStr(appoinment.obj.dtEnd);

				if (req_gl_Date_CompareObj(dtEndObj, dtBeginObj) <= 0) return;

				const curCompare = req_gl_Date_CompareObj(dtBeginObj, curDate);

				if (curCompare >= 0) {
					if (lastAppointment.length > 0) {
						const last = req_gl_DateObj_From_DateStr(lastAppointment[0].obj.dtBegin);
						const compareLast = req_gl_Date_CompareObj(dtBeginObj, last);

						if (compareLast >= 0)
							lastAppointment.push(appoinment);
						else if (compareLast < 0)
							lastAppointment = [appoinment];

					} else lastAppointment.push(appoinment);

					var toDayEnd = req_gl_DateStr_From_DateObj(curDate, "yyyy-MM-dd") + " 23:59:59";
					if (appoinment.obj.dtBegin <= toDayEnd) cDaily++;

					var diffDay = req_gl_DayDiff(req_gl_DateObj_From_DateStr(appoinment.obj.dtBegin));
					if (diffDay > 0 && (diffDay - 1) <= (7 - curDay)) ++cWeeklyRemaining;
				}
				//				const diffDay = req_gl_DayDiff(req_gl_DateObj_From_DateStr(appoinment.obj.dtBegin));
				//				if(diffDay === 1 || diffDay === 0) ++cDaily;


			})

			pr_lastAppointment = lastAppointment
			pr_cDaily = cDaily
			pr_cWeeklyRemaining = cWeeklyRemaining

			do_lc_build_noti(lastAppointment, cDaily, cWeeklyRemaining)
		}

		const do_lc_build_noti = (lastAppointment, cDaily, cWeeklyRemaining) => {
			if (lastAppointment.length > 0) {
				const lastAppointmentObj = req_gl_DateObj_From_DateStr(lastAppointment[0].obj.dtBegin);
				const lastAppointmentMinutes = lastAppointmentObj.getMinutes();
				const lastAppointmentMinutesText = lastAppointmentMinutes < 10 ? "0" + lastAppointmentMinutes : lastAppointmentMinutes;
				const lastAppointmentTime = lastAppointmentObj.getHours() + "h" + lastAppointmentMinutesText;

				$("#last_appointment").html(lastAppointment[0].obj.name + " " + lastAppointmentTime)

			} else $("#last_appointment").html($.i18n("prj_appointment_msg_no_last"))

			const curDateStr = req_gl_DateStr_LocalFormatShort(new Date())
			$("#daily_appointment b").html(curDateStr)
			$("#daily_appointment span").html(cDaily)

			$("#weekly_appointment span").html(cWeeklyRemaining)
		}

		var do_lc_handle_date = (strDate) => {
			let tmp = getDateEN(strDate);
			let res = {};
			res.dt = tmp.slice(0, 10);
			res.tm = tmp.slice(11, 16);
			return res;
		}

		var do_lc_build_view_member = (data, view) => {
			var div = "";
			if (data) {
				for (var key in data) {
					// build view lst member
					let classCss = "";
					let opacity = "";
					if (data[key].stat == 2) {
						classCss = "text-decoration-line-through ";
						opacity = "opacity-03"
					}

					let item = data[key].mem;
					//let selOpt 			= `<div class='member-item'>`;
					let selOpt = `<div class='member-item'><div class="media align-items-center">`;

					if (item.avatar) {
						selOpt += `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs ${opacity}'/> <span class="${classCss}">&nbsp;${item.name01} ${item.name03}</span>`;
					}

					if (!item.avatar) {
						let textColor = null;
						let textAvatar = null
						if (!item.avatar) {
							let first = item.login01.charAt(0);
							let last = item.login01.charAt(item.login01.length - 1);
							let index = var_gl_alphabet.indexOf(first.toLowerCase());

							textColor = var_gl_colors[index];
							textAvatar = first + last;
						}
						selOpt += `<div class="rounded-circle avatar-xs text-white text-uppercase text-center ${opacity} mr-1" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> <span class="${classCss}">${item.name01} ${item.name03}</span>`;
					}

					//selOpt 				+= `</div>`;
					selOpt += item.id !== App.data.user.id ? `<a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' title='Delete'><i class='mdi mdi-close font-size-18'></i></a>` : `<span class='btn-remove-member-placeholder' style='display: inline-block; width: 18px; height: 28.167px;'></span>`;

					selOpt += `</div></div>`;

					div += selOpt;

					// build data lst members
					members[item.id] = { id: key, uId: item.id, stat: data[key].stat, lev: data[key].lev, typ: data[key].typ };
				};
			}
			$(view).append(div);
		}
		var do_lc_build_view_customer = (customersStr, view) => {
			var div = "";
			if (customersStr) {
				let data = JSON.parse(customersStr);
				for (var key in data) {
					let email = data[key];
					let selOpt = `<div class='mr-1'><button class="btn btn-secondary">${email}</button><a data-email='${email}' class='text-danger btn-remove-customer' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a></div>`;
					div += selOpt;

					customers.push(email);
				};
			}
			$(view).append(div);
		}


	};

	return PrjAppointmentList;
});