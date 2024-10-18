define(['jquery'],
	function($) {


		var JobReportEntBtn = function(grpName, header, content, footer) {
			var pr_divHeader = header;
			var pr_divContent = content
			var pr_divFooter = footer;

			//------------------------------------------------------------------------------------
			var pr_grpName = grpName ? grpName : ((new Date()).getTime() + "");
			var tmplName = App.template.names[pr_grpName];
			var tmplCtrl = App.template.controller;
			//------------------------------------------------------------------------------------

			//------------------controllers------------------------------------------------------
			var pr_ctr_Main = null;
			var pr_ctr_List = null;
			var pr_ctr_Ent = null;
			//-----------------------------------------------------------------------------------
			var pr_object = null;
			var pr_mode = null;

			var lc_rp_stat_draft = 0;
			var lc_rp_stat_pending = 1;
			var lc_rp_stat_validate = 2;
			var lc_rp_stat_denied = 3;

			var currentRpCreated = 1;
			//-----------------------------------------------------------------------------------
			var pr_btn_Create = "#btn_JobReport_create";
			var pr_btn_Edit = "#btn_JobReport_edit";
			var pr_btn_Duplicate = "#btn_JobReport_duplicate";
			var pr_btn_Del = "#btn_JobReport_del";
			var pr_btn_Export = "#btn_JobReport_export";
			var pr_btn_Send = "#btn_JobReport_send";
			var pr_btn_Print = "#btn_JobReport_print";
			var pr_btn_Save = "#btn_JobReport_save";
			var pr_btn_Cancel = "#btn_JobReport_cancel";
			var pr_btn_Transform = "#btn_JobReport_transform";
			var pr_btn_Validate = "#btn_JobReport_validate";
			var pr_btn_Deny = "#btn_JobReport_deny";
			var pr_btn_Take_Off = "#btn_JobReport_take_off";

			//--------------------APIs--------------------------------------//

			this.do_lc_init = function() {
				pr_ctr_Main = App.controller.JobReport.Main;
				pr_ctr_List = App.controller.JobReport.List;
				pr_ctr_Ent = App.controller.JobReport.Ent;
			}

			this.do_lc_show = function(obj, mode) {
				pr_object = obj;
				pr_mode = mode;
				try {
					$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_ENT_BTN, {}));

					$(pr_btn_Create).hide();
					$(pr_btn_Edit).hide();
					$(pr_btn_Duplicate).hide();
					$(pr_btn_Del).hide();
					$(pr_btn_Transform).hide();
					$(pr_btn_Export).hide();

					$(pr_btn_Send).hide();
					$(pr_btn_Print).hide();

					$(pr_btn_Save).hide();
					$(pr_btn_Cancel).hide();

					$(pr_btn_Validate).hide();
					$(pr_btn_Deny).hide();
					$(pr_btn_Take_Off).hide();

					//---------------------------------------------------------------------------------------------
					//MODE INIT-----MODE INIT-----MODE INIT-----MODE INIT-----MODE INIT-----MODE INIT-----MODE INIT
					//---------------------------------------------------------------------------------------------

					if (mode == pr_ctr_Main.var_lc_MODE_INIT) {
						$(pr_btn_Create).show();
						$(pr_btn_Take_Off).show();
					}

					//---------------------------------------------------------------------------------------------
					//MODE SELECT-----MODE SELECT-----MODE SELECT-----MODE SELECT-----MODE SELECT-----MODE SELECT--
					//---------------------------------------------------------------------------------------------

					if (mode == pr_ctr_Main.var_lc_MODE_SEL) {
						$(pr_btn_Create).show();
						$(pr_btn_Take_Off).show();

						if (obj.stat == lc_rp_stat_draft || obj.stat == lc_rp_stat_denied) {
							$(pr_btn_Edit).show();
							$(pr_btn_Send).show();
						}
					}

					//---------------------------------------------------------------------------------------------
					//MODE NEW/MOD-----MODE NEW/MOD-----MODE NEW/MOD-----MODE NEW/MOD-----MODE NEW/MOD-----MODE NEW
					//---------------------------------------------------------------------------------------------

					if (mode == pr_ctr_Main.var_lc_MODE_NEW || mode == pr_ctr_Main.var_lc_MODE_MOD) {
						$(pr_btn_Save).show();
						$(pr_btn_Cancel).show();
						$(pr_btn_Send).show();
					}

					do_bind_event_btn_create(obj, mode);
					do_bind_event_btn_edit(obj, mode);
					do_bind_event_btn_send(obj, mode);

					do_bind_event_btn_save(obj, mode);
					do_bind_event_btn_cancel(obj, mode);

					do_bind_event_btn_validate(obj, mode);
					do_bind_event_btn_deny(obj, mode);
					do_bind_event_btn_take_off(obj, mode);

					//do_bind_event_btn_duplicate	(obj, mode);
					//do_bind_event_btn_del			(obj, mode);
					//do_bind_event_btn_export		(obj, mode);
					//do_bind_event_btn_print		(obj, mode);
				} catch (e) {
					do_gl_show_Notify_Msg_Error("JobReport: EntBtn :" + e.toString());
					do_gl_send_exception(App.path.BASE_URL_API_PRIV, this.var_lc_URL_Header, App.network, "job.report", "JobReportEntBtn", "do_lc_show", e.toString());
				}
			};

			//---------------------------------------------------------------------------------------------
			//ADD REPORT-----ADD REPORT-----ADD REPORT-----ADD REPORT-----ADD REPORT-----ADD REPORT-----ADD
			//---------------------------------------------------------------------------------------------

			var do_bind_event_btn_create = function(obj, mode) {
				$(pr_btn_Create).off('click');
				$(pr_btn_Create).click(function() {
					if (!App.data.selectedUser) {
						App.data.selectedUser = App.data.lstUser[0];
					}
					if (App.data.selectedUser.wdCfg == null) {
						pr_ctr_Ent.do_lc_active_userCfg(true);
					} else {
						pr_ctr_Ent.do_lc_new();
					}
				});
			}


			//---------------------------------------------------------------------------------------------
			//MOD REPORT-----MOD REPORT-----MOD REPORT-----MOD REPORT-----MOD REPORT-----MOD REPORT-----MOD
			//---------------------------------------------------------------------------------------------

			function do_bind_event_btn_edit(obj) {
				$(pr_btn_Edit).off('click');
				$(pr_btn_Edit).click(function() {
					if (obj.uId03 != App.data.user.id) {
						pr_ctr_Ent.do_lc_Lock_Begin(obj, false, null);
					} else {
						pr_ctr_Ent.do_lc_Lock_Begin(obj, false, null);
					}
				});
			}

			//---------------------------------------------------------------------------------------------
			//SAVE/CANCEL REPORT MODIFICATION-----SAVE/CANCEL REPORT MODIFICATION-----SAVE/CANCEL REPORT MO
			//---------------------------------------------------------------------------------------------

			var do_bind_event_btn_save = function(obj, mode) {
				$(pr_btn_Save).off('click');
				$(pr_btn_Save).click(function() {
					pr_ctr_Ent.do_lc_save(obj, mode, lc_rp_stat_draft);
				});
			}

			var do_bind_event_btn_cancel = function(obj, mode) {
				$(pr_btn_Cancel).off('click');
				$(pr_btn_Cancel).click(function() {
					App.MsgboxController.do_lc_show({
						title: $.i18n("msgbox_confirm_title"),
						content: $.i18n("common_msg_mod_cancel_confirm"),
						buttons: {
							OK: {
								lab: $.i18n("common_btn_yes"),
								funct: doCancel,
								param: [obj, mode]
							},
							NO: {
								lab: $.i18n("common_btn_cancel")
							}
						}
					});
				});
			}

			function doCancel(obj, mode) {
				//if (mode == pr_ctr_Main.var_lc_MODE_NEW) {
				//	App.data.mode = pr_ctr_Main.var_lc_MODE_SEL;
					//self		.do_lc_show		({}, App.data.mode);
					pr_ctr_Ent.do_lc_show(null, App.data.mode);
				//} else {
				//	pr_ctr_Ent.do_lc_Lock_Cancel(obj);
				//}
			}

			//---------------------------------------------------------------------------------------------
			//VALIDATE/DENY REPORT-----VALIDATE/DENY REPORT-----VALIDATE/DENY REPORTT-----VALIDATE/DENY REP
			//---------------------------------------------------------------------------------------------

			var do_bind_event_btn_validate = function(obj, mode) {
				$(pr_btn_Validate).off('click');
				$(pr_btn_Validate).click(function() {
					pr_ctr_Ent.do_lc_Lock_Begin(obj, true, lc_rp_stat_validate);
				});
			}

			var do_bind_event_btn_deny = function(obj, mode) {
				$(pr_btn_Deny).off('click');
				$(pr_btn_Deny).click(function() {
					pr_ctr_Ent.do_lc_Lock_Begin(obj, true, lc_rp_stat_denied);
				});
			}

			//---------------------------------------------------------------------------------------------
			//SUBMIT REPORT-----SUBMIT REPORT-----SUBMIT REPORT-----SUBMIT REPORT-----SUBMIT REPORT-----SUB
			//---------------------------------------------------------------------------------------------

			var do_bind_event_btn_send = function(obj, mode) {
				$(pr_btn_Send).off('click');
				//them dieu kien ngay 
				$(pr_btn_Send).click(function() {
					var allow = can_submit_report();
					const sendDay 		= new Date();
					const monthhString	= obj.dt01;
					const monthh 		= new Date(monthhString);
					if (sendDay.getDate() >= 25 && sendDay.getMonth()>=monthh.getMonth()) {
						if (allow) {
							pr_ctr_Ent.do_lc_save(obj, mode, lc_rp_stat_pending);
							
						} else {
							do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_rp_cant_submit"));
						}
					}
					else if(sendDay.getMonth()>monthh.getMonth()){
						if (allow) {
							pr_ctr_Ent.do_lc_save(obj, mode, lc_rp_stat_pending);
							
						} else {
							do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_rp_cant_submit"));
						}
					}
					else {
						do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_rp_cant_submit_day"));
					}
				});
			}

			function can_submit_report() {
				var row = $("#table_report_detail > tbody > tr.cra");
				if (row.length > 0) {
					for (var i = 0; i < row.length; i++) {
						var idCat = parseInt(row[i].getAttribute("data-catId"));
						if (idCat == 0) {
							return false;
						}
					}
				} else {
					return false;
				}

				var td = $("#table_report_detail > tfoot > tr > td");
				for (var i = 0; i < td.length; i++) {
					if (td[i].classList.contains("notValid")) {
						return false;
					}
				}

				return true;
			}

			//---------------------------------------------------------------------------------------------
			//OTHER BUTTONS-----OTHER BUTTONS-----OTHER BUTTONS-----OTHER BUTTONS-----OTHER BUTTONS-----OTH
			//---------------------------------------------------------------------------------------------
			var do_bind_event_btn_take_off = function(obj) {
				$(pr_btn_Take_Off).off('click');
				$(pr_btn_Take_Off).click(function() {
					window.open("view_prj_job_off.html");
				});
			}
			var do_bind_event_btn_duplicate = function(obj) {
				$(pr_btn_Duplicate).off('click');
				$(pr_btn_Duplicate).click(function() {
					//clone obj
					pr_ctr_Ent.do_lc_duplicate(obj);
				});
			}

			var do_bind_event_btn_print = function(obj, mode) {
				$(pr_btn_Print).off('click');
				$(pr_btn_Print).click(function() {
				});
			}

			var do_bind_event_btn_del = function(obj) {
				$(pr_btn_Del).off('click');
				$(pr_btn_Del).click(function() {
					App.MsgboxController.do_lc_show({
						title: $.i18n("msgbox_confirm_title"),
						content: $.i18n("common_msg_del_confirm"),
						buttons: {
							OK: {
								lab: $.i18n("common_btn_yes"),
								funct: pr_ctr_Ent.do_lc_delete,
								param: [obj]
							},
							NO: {
								lab: $.i18n("common_btn_cancel"),
							}
						}
					});
				});
			}

			var do_bind_event_btn_export = function(obj, mode) {
				$(pr_btn_Export).off('click');
				$(pr_btn_Export).click(function() {
				});
			}

		};

		return JobReportEntBtn;
	});