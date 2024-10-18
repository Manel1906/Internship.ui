define(['jquery'], function($) {

	var JobReportEntHeader     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_Rights			= null;

		var lc_rp_stat_draft			= 0;
		var lc_rp_stat_pending			= 1;
		var lc_rp_stat_validate			= 2;
		var lc_rp_stat_denied			= 3;
		var lc_rp_stat_resume_updated 	= 4;

		var lc_username 			= App.data.user.per.name01 + " " + App.data.user.per.name02;

		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;

		//	RIGHT ACTION----------------------------------------
		var RIGHT_U_G		= 1;
		var RIGHT_U_N		= 2;
		var RIGHT_U_M		= 3;
		var RIGHT_U_D		= 4;

		var self = this;

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobReportMan.Main;
			pr_ctr_List 			= App.controller.JobReportMan.List;
			pr_ctr_Ent				= App.controller.JobReportMan.Ent;
			pr_ctr_Rights			= App.controller.JobReportMan.Rights;
			pr_ctr_DateTime			= App.controller.JobReportMan.DateTime;
			pr_ctr_EntTabReportDetail 	= App.controller.JobReportMan.EntTabReportDetail;

			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
		}

		this.do_lc_show		= function(obj, mode){
			pr_object 	= obj;
			pr_mode		= mode;

			try{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_ENT_HEADER, obj));
				App.controller.UI.Main.do_lc_bind_event_resize();

				do_bind_event(obj, mode);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobReport: EntHeader :" + e.toString());
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.report", "JobReportEntHeader", "do_lc_show", e.toString()) ;
			}
		}

		this.do_lc_show_user_summary = function(obj){
			try{
				$("#div_JobReport_Ent_Header").html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_ENT_HEADER_USER_SUMMARY, obj));
				do_lc_bind_event_user_summary();
				if(obj.stat == lc_rp_stat_pending && obj.uId02 != App.data.user.id ){
					$("#inp_cmt").attr('disabled', 'disabled');
				}
				$(".info-edit").on("click", function(){
					let $parent = $(this).parent();
					$parent.find(".info-content")			.addClass("hide");
					$parent.find(".info-content-worker")	.addClass("hide");
					$parent.find(".content-edit")	.removeClass("hide");
					$parent.find(".content-edit")	.prop("disabled", false);
					if($parent.find(".content-edit").length > 0){
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
					}
				})
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobReport: User Summary :" + e.toString());
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.report", "JobReportEntHeader", "do_lc_show", e.toString()) ;
			}
		}

		//---------private-----------------------------------------------------------------------------
		//da sua
		function do_bind_event(obj, mode){
			$("#inp_hldrate").val(App.data.hldRate);
			$("#inp_stat").val(obj.stat);

			if(obj.stat == lc_rp_stat_draft || obj.stat == lc_rp_stat_pending){
				$(".rp_validated_zone").hide();
			}
			$(".info-edit").on("click", function(){
			let $parent = $(this).parent();
			$parent.find(".info-content")			.addClass("hide");
			$parent.find(".info-content-worker")	.addClass("hide");
			$parent.find(".content-edit")	.removeClass("hide");
			$parent.find(".content-edit")	.prop("disabled", false);
			if(obj.stat == lc_rp_stat_draft){
			if($parent.find(".content-edit").length > 0){
			$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
			}
			}
			})
			$("#a_btn_export").off("click").on("click", function(){
				do_lc_gen_report(obj);
			})

			$("#a_btn_save").off("click").on("click", function(){
				obj.files 		= obj.files ? [...obj.files].filter(Boolean) : [];
				pr_ctr_Ent.do_lc_Save_Entity(pr_divContent, obj);
			})
			$("#a_btn_cancel").off("click").on("click", function(){
				self.do_lc_show(obj,mode);	
			})
			if(!App.data.lstUserInfo)	App.data.lstUserInfo =[];
			do_gl_autocomplete({
				el: $("#inp_uId02_name "),
				source: App.data.lstUserInfo,
				selectCallback: function(item) {
					$("#inp_uId02_name"	).val(item.name01+ " " +item.name03);	
					$("#inp_uId02_id"				).val(item.id);
					return true;
				},
				renderAttrLst: ["name01",'name03'],
				minLength: 0,
				placeholder	: $.i18n("job_report_label_uId03"),
				required: true
			});

			if(!App.data.reportCodes)	pr_ctr_DateTime.req_lc_ReportCode();
			do_gl_autocomplete({
				el: $("#inp_code"),
				source: App.data.reportCodes,
				selectCallback: function(item) {
					$("#inp_code"	).val(item.date);	
					var u = App.data.selectedUser;
					if(!u.name03) u.name03 = "";

					pr_ctr_DateTime.req_lc_DayOff(item.date, u.id);
					pr_ctr_EntTabReportDetail.do_lc_show(obj, mode);
					return true;
				},
				renderAttrLst: ["date"],
				minLength: 0,
				placeholder	: $.i18n("job_report_label_code"),
				required: true
			});
		}

		this.do_bind_event_user_summary = function(){
			do_lc_bind_event_user_summary();
		}

		function do_lc_bind_event_user_summary(){
			var infoWd = App.data.selectedUser.wdCfg;
			if(infoWd){
				$("#btn_new_wd").hide();
				$("#btn_display_wd").show();
				$("#btn_display_wd").off("click");
				$("#btn_display_wd").on("click", function(){
					var wd = do_get_values();
					App.MsgboxController.do_lc_show({
						title	: $.i18n("job_rp_show_config_wd_title") + wd.name01 + " " + wd.name02 + " " + wd.name03,
						content : tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_CONFIG_WORKING_DAY, wd),
						buttons	: {
							OK: {
								lab		:  	$.i18n("job_rp_config_btn03")
							}
						}
					});
					$("#job_rp_config_header").hide();
					do_match_values(wd);
				});

				var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_U_M);
				if(rightCode == -1){
					$("#btn_modify_wd").hide();
				}else{
					$("#btn_modify_wd").show();
				}
				$("#btn_modify_wd").off("click");
				$("#btn_modify_wd").on("click", function(){
					var wd = do_get_values();
					App.MsgboxController.do_lc_show({
						title	: $.i18n("job_rp_edit_config_wd_title") + wd.name01 + " " + wd.name02 + " " + wd.name03,
						content : tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_CONFIG_WORKING_DAY, wd),
						buttons	: {
							CANCEL: {
								lab		:  	$.i18n("job_rp_config_btn04")
							},
							SAVE_EXIT: {
								lab		: 	$.i18n("job_rp_config_btn02"),
								funct	: 	function(){
									pr_ctr_Ent.do_lc_update_user_wd(App.data.selectedUser);
								}
							}
						}
					});

					$("#job_rp_config_header").hide();
					do_gl_enable_edit($("#div_wd_user"));
					do_match_values(wd);
				});
			} else {
				$("#btn_modify_wd").hide();
				$("#btn_display_wd").hide();
				$("#btn_new_wd").show();
				$("#btn_new_wd").off("click");
				$("#btn_new_wd").on("click", function(){
					var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_U_N);
					if(rightCode == -1){
						do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					} else {
						pr_ctr_Ent.do_lc_active_userCfg(false);
					}
				});
			}

			$("#a_show_qr_code").off("click");
			$("#a_show_qr_code").on("click", function(){
				App.MsgboxController.do_lc_show({
					title	: $.i18n("job_rp_btn_show_qr_code"),
					content : tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_DISPLAY_QR_CODE, App.data.selectedUser),
					buttons	: {
						OK: {
							lab		:  	$.i18n("job_rp_config_btn03")
						}
					}
				});
				if(App.data.selectedUser.code != null && App.data.selectedUser.code != ""){
					$("#div_user_qr_code").qrcode({"text":App.data.selectedUser.code});
				} else {
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_code_missing"));
				}

			});

		}

		function do_get_values(){
			var infoWd = App.data.selectedUser.wdCfg;
			var wd = {};
			if(infoWd){
				wd.sun = infoWd.charAt(0);
				wd.mon = infoWd.charAt(1);
				wd.tue = infoWd.charAt(2);
				wd.wed = infoWd.charAt(3);
				wd.thu = infoWd.charAt(4);
				wd.fri = infoWd.charAt(5);
				wd.sat = infoWd.charAt(6);
			}
			wd.name01 = App.data.selectedUser.name01;
			wd.name02 = App.data.selectedUser.name02;
			wd.name03 = App.data.selectedUser.name03;

			var infoWh = App.data.selectedUser.whConfig;
			if(infoWh){
				var splitTime = infoWh.match(/.{2}/g);
				const req_Time = (start, end) => {
					if(splitTime[start] === '##' || splitTime[end] === '##') return ""

					return splitTime[start] +":"+ splitTime[end]
				}

				wd.sunS = req_Time(0, 1)
				wd.sunE = req_Time(2, 3)
				wd.monS = req_Time(4, 5)
				wd.monE = req_Time(6, 7)
				wd.tueS = req_Time(8, 9)
				wd.tueE = req_Time(10, 11)
				wd.wedS = req_Time(12, 13)
				wd.wedE = req_Time(14, 15)
				wd.thuS = req_Time(16, 17)
				wd.thuE = req_Time(18, 19)
				wd.friS = req_Time(20, 21)
				wd.friE = req_Time(22, 23)
				wd.satS = req_Time(24, 25)
				wd.satE = req_Time(26, 27)
			}
			return wd;
		}

		function do_match_values(wd){
			$("#sel_mon").val(wd.mon);
			$("#sel_tue").val(wd.tue);
			$("#sel_wed").val(wd.wed);
			$("#sel_thu").val(wd.thu);
			$("#sel_fri").val(wd.fri);
			$("#sel_sat").val(wd.sat);
			$("#sel_sun").val(wd.sun);
		}

		function do_lc_gen_report(data){	
			var ref  					= req_gl_Request_Content_Send("ServicePrjProject", "SVGenReportCra");
			ref["id"] 					= data.id;
			ref["lang"] 				= localStorage.getItem("language");
			ref["ext"] 					= "pdf";
	
			var fSucces		= [];
			fSucces.push	( req_gl_funct(this, do_lc_gen_report_success, [true] ));
			var fError 		= req_gl_funct(this, do_lc_gen_report_success, [false]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_lc_gen_report_success = function(sharedJson, ajaxStat){
			if(!ajaxStat){
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
				return;
			}
			var code = sharedJson[App['const'].SV_CODE];
			if(code == App['const'].SV_CODE_API_YES) {
				do_gl_show_Notify_Msg_Success($.i18n("common_gen_success_msg"));
				var report = sharedJson.res_data;
				window.open(report);
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_gen_error_msg"));
			}
		}
	};

	return JobReportEntHeader;
});