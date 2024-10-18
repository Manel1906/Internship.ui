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
		var pr_ctr_Rights			= null;
		
//		RIGHT ACTION----------------------------------------
		var RIGHT_U_G		= 1;
		var RIGHT_U_N		= 2;
		var RIGHT_U_M		= 3;
		var RIGHT_U_D		= 4;
		
		var lc_rq_stat_draft		= 0;
		var lc_rq_stat_pending		= 1;
		var lc_rq_stat_validated	= 2;
		var lc_rq_stat_denied		= 3;
		
		//--------------------APIs--------------------------------------
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobOffMan.Main;
			pr_ctr_EntHeader		= App.controller.JobOffMan.EntHeader;
			pr_ctr_Rights			= App.controller.JobOffMan.Rights;
		}      
		
		this.do_lc_show		= function(obj, mode){
			try{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_ENT_HEADER, obj));
				
				let statStr = $("#inp_stat").find("option[value='"+ obj.stat +"']").text();
				 $("#inp_statStr").html(statStr);
				 
				App.controller.UI.Main.do_lc_bind_event_resize();
				do_bind_event_header(mode, obj);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobOffEntHeader: " + e.toString());
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.off", "JobOffEntHeader", "do_lc_show", e.toString()) ;
			}
		}
		
		function do_bind_event_header(mode, obj){
			$(".adminzone").hide();
			$(".rp_validated_zone").hide();
			
			let statStr = $("#inp_stat").find("option[value='" + obj.stat + "']").text();
			$("#inp_statStr").html(statStr);
			
			if(obj.stat == lc_rq_stat_validated || obj.stat == lc_rq_stat_denied){
				$(".rp_validated_zone").show();
			} 

			if(obj.stat == lc_rq_stat_pending){
				var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_U_M);
				if(rightCode != -1){
					$(".rp_validated_zone").show();
					$("#inp_cmt").prop("disabled", false);
				}
			}
			
			if(mode == pr_ctr_Main.var_lc_MODE_NEW){
				$("#h3_header_title").html($.i18n('job_off_label_create_new_request'));
				pr_ctr_Main.do_Request_User_DayOff_Info(App.data.user.id, true);
				var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_U_N);
				if(rightCode != -1){
					$(".adminzone").show();
					do_bind_event_adm(obj);
				}
			}
		}
		
		function do_bind_event_adm(obj){
			$(".selectUser").hide();
			$('input[name="select_uId03"]').change(function(){
				if (this.checked && this.value == '1') {
					$(".selectUser").hide();
					$("#inp_uId03_name").val(App.data.user.fullname);
		        	$("#inp_uId03").val(App.data.user.id);
		        	pr_ctr_Main.do_Request_User_DayOff_Info(App.data.user.id, true);
				} else {
					$(".selectUser").show();
					$("#inp_list_user").val("");
					do_show_select_user_inp(obj);
				}
			});
		}
		
		function do_show_select_user_inp(obj){
			$("#inp_list_user").autocomplete({
			      source: App.data.listUserArray,
			      change: function (event, ui) {
			    	  if(!ui.item){
			              $(event.target).val("");
			              $("#inp_uId03_name").val("");
			              pr_ctr_Main.do_Request_User_DayOff_Info(-1, true);
			          }
			      },
			      focus: function (event, ui) {
			          return false;
			      },
			      select: function (event, ui) {
		        	  $("#inp_uId03_name").val(ui.item.value);
		        	  $("#inp_uId03").val(ui.item.id);
		        	  pr_ctr_Main.do_Request_User_DayOff_Info(ui.item.id, true);
			      }
			 });
		}
	};

	return JobOffEntHeader;
});