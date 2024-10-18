define(['jquery' ], function($) {


	var JobOffEntHeader     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//--------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;

		//------------------controllers---------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_EntHeader		= null;
		
		//--------------------APIs--------------------------------------
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobOff.Main;
			pr_ctr_EntHeader		= App.controller.JobOff.EntHeader;
		}      
		
		this.do_lc_show		= function(obj, mode){
			try{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_ENT_HEADER, obj));
				App.controller.UI.Main.do_lc_bind_event_resize();
				
				do_bind_event_header(mode, obj);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobOffEntHeader: " + e.toString());
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.off", "JobOffEntHeader", "do_lc_show", e.toString()) ;
			}
		}
		
		function do_bind_event_header(mode, obj){
			if(mode == pr_ctr_Main.var_lc_MODE_NEW || mode == pr_ctr_Main.var_lc_MODE_MOD){
				$("#inp_hldR_parent")	.addClass("hide");
				$(".info-content")		.addClass("hide");
				$(".content-edit")		.removeClass("hide");
			}
			
			
			$(".adminzone").hide();
			$(".rp_validated_zone").hide();
			
			let statStr = $("#inp_stat").find("option[value='" + obj.stat + "']").text();
			$("#inp_statStr").html(statStr);
			
			if(mode == pr_ctr_Main.var_lc_MODE_NEW){
				$("#h3_header_title").html($.i18n('job_off_label_create_new_request'));
				pr_ctr_Main.do_Request_User_DayOff_Info(App.data.user.id, true);
			}
		}
	};

	return JobOffEntHeader;
});