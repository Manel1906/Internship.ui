define(['jquery'], function($) {


	var JobReportEntHeader     = function (grpName,header,content,footer) {
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
		
		var lc_rp_stat_draft			= 0;
		var lc_rp_stat_pending			= 1;
		var lc_rp_stat_validate			= 2;
		var lc_rp_stat_denied			= 3;
		var lc_rp_stat_resume_updated 	= 4;
		
		var lc_username 			= App.data.user.per.name01 + " " + App.data.user.per.name02;

		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobReport.Main;
			pr_ctr_List 			= App.controller.JobReport.List;
			pr_ctr_Ent				= App.controller.JobReport.Ent;
			pr_ctr_DateTime			= App.controller.JobReport.DateTime;
			pr_ctr_EntTabReportDetail 	= App.controller.JobReport.EntTabReportDetail;
		}
		
		this.do_lc_show		= function(obj, mode){
			pr_object 	= obj;
			pr_mode		= mode;
			
			try{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_ENT_HEADER, obj));
				do_bind_event(obj, mode);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobReport: EntHeader :" + e.toString());
				// do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.report", "JobReportEntHeader", "do_lc_show", e.toString()) ;
			}
		}
		
		this.do_lc_show_user_summary = function(obj){
			try{
				$("#div_JobReport_Ent_Header").html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_ENT_HEADER_USER_SUMMARY, obj));
				do_lc_bind_event_user_summary();
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobReport: User Summary :" + e.toString());
				// do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.report", "JobReportEntHeader", "do_lc_show", e.toString()) ;
			}
		}
		
		//---------private-----------------------------------------------------------------------------
		function do_bind_event(obj, mode){
			$("#inp_hldrate").val(App.data.hldRate);
			$("#inp_stat").val(obj.stat);
			
			if(obj.stat == lc_rp_stat_draft || obj.stat == lc_rp_stat_pending){
				$(".rp_validated_zone").hide();
			}

			$(".info-edit").on("click", function(){
				if(obj.stat == lc_rp_stat_draft){
					let $parent = $(this).parent();
					$parent.find(".info-content")			.addClass("hide");
					$parent.find(".info-content-worker")	.addClass("hide");
					$parent.find(".content-edit")	.removeClass("hide");
					$parent.find(".content-edit")	.prop("disabled", false);
					if($parent.find(".content-edit").length > 0){
						if(mode != pr_ctr_Main.var_lc_MODE_NEW){
							$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
						}
					}
				}
			})

			$("#a_btn_export").off("click").on("click", function(){
				do_lc_gen_report(obj);
			})

			$("#a_btn_save").off("click").on("click", function(){
				pr_ctr_Ent.do_lc_save(obj, pr_ctr_Main.var_lc_MODE_SEL, lc_rp_stat_draft);	
			})

			$("#a_btn_cancel").off("click").on("click", function(){
				self.do_lc_show(obj, mode);
			})

//			if(!App.data.reportCodes)	pr_ctr_DateTime.req_lc_currentAndPrevReportCode();
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
			$("#btn_display_wd").off("click").on("click", function(){
				pr_ctr_Ent.do_lc_active_userCfg(false);
			});


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
		
		
	};

	return JobReportEntHeader;
});