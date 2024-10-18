define(['jquery' ], function($) {

	var JobOffEntBtn     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_Rights			= null;
		var pr_ctr_EntTabDetail		= null;
		
		var lc_rq_stat_draft		= 0;
		var lc_rq_stat_pending		= 1;
		var lc_rq_stat_validate		= 2;
		var lc_rq_stat_denied		= 3;
		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;
		
		//-----------------------------------------------------------------------------------
		var pr_btn_Create 			= "#btn_JobOff_create";
		var pr_btn_Edit 			= "#btn_JobOff_edit";
		var pr_btn_Duplicate 		= "#btn_JobOff_duplicate";
		var pr_btn_Del 				= "#btn_JobOff_del";
		var pr_btn_Export 			= "#btn_JobOff_export";
		var pr_btn_Send 			= "#btn_JobOff_send";
		var pr_btn_Print 			= "#btn_JobOff_print";
		var pr_btn_Save 			= "#btn_JobOff_save";
		var pr_btn_Cancel 			= "#btn_JobOff_cancel";
		var pr_btn_Transform		= "#btn_JobOff_transform";
		var pr_btn_Validate			= "#btn_JobOff_validate";
		var pr_btn_Deny				= "#btn_JobOff_deny";
		
		//	RIGHT ACTION----------------------------------------
//		RIGHT ACTION----------------------------------------
		var RIGHT_U_G		= 1;
		var RIGHT_U_N		= 2;
		var RIGHT_U_M		= 3;
		var RIGHT_U_D		= 4;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobOffMan.Main;
			pr_ctr_Ent				= App.controller.JobOffMan.Ent;
			pr_ctr_Rights			= App.controller.JobOffMan.Rights;
			pr_ctr_EntTabDetail     = App.controller.JobOffMan.EntTabDetail;
		}
		
		this.do_lc_show		= function(obj, mode){
			pr_object 	= obj;
			pr_mode		= mode;
			try{	
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_ENT_BTN, obj));
				
				$(pr_btn_Create		)	.hide();
				$(pr_btn_Edit		)	.hide();
				$(pr_btn_Duplicate	)	.hide();
				$(pr_btn_Del		)	.hide();
				$(pr_btn_Transform	)	.hide();
				$(pr_btn_Export		)	.hide();
				
				$(pr_btn_Send		)	.hide();
				$(pr_btn_Print		)	.hide();

				$(pr_btn_Save		)	.hide();
				$(pr_btn_Cancel		)	.hide();
				
				$(pr_btn_Validate	)	.hide();
				$(pr_btn_Deny		)	.hide();
				
				//---------------------------------------------------------------------------------------------
				//MODE INIT-----MODE INIT-----MODE INIT-----MODE INIT-----MODE INIT-----MODE INIT-----MODE INIT
				//---------------------------------------------------------------------------------------------
				
				if(mode == pr_ctr_Main.var_lc_MODE_INIT){
					$(pr_btn_Create	).show();
				}
				
				//---------------------------------------------------------------------------------------------
				//MODE SELECT-----MODE SELECT-----MODE SELECT-----MODE SELECT-----MODE SELECT-----MODE SELECT--
				//---------------------------------------------------------------------------------------------
				
				if(mode == pr_ctr_Main.var_lc_MODE_SEL){
//					$(pr_btn_Create	).show();

//					if(obj.stat == lc_rq_stat_draft && obj.uId01 == App.data.user.id){
//						$(pr_btn_Edit	).show();
//						$(pr_btn_Del	).show();
//						$(pr_btn_Send	).show();
//					}
					
					if(obj.stat == lc_rq_stat_pending){
						var canAdminValidate = pr_ctr_Rights.req_lc_Right(RIGHT_U_M);
						if(canAdminValidate != -1){
							$(pr_btn_Validate	)	.show();
							$(pr_btn_Deny		)	.show();
						}
					}
					
					if(obj.stat == lc_rq_stat_validate){
						var canAdminValidate = pr_ctr_Rights.req_lc_Right(RIGHT_U_M);
						if(canAdminValidate != -1){
							$(pr_btn_Deny		)	.show();
						}
					}
					
					if(obj.stat == lc_rq_stat_denied){
						var canAdminValidate = pr_ctr_Rights.req_lc_Right(RIGHT_U_M);
						if(canAdminValidate != -1){
							$(pr_btn_Validate		)	.show();
						}
					}
				}
				
				//---------------------------------------------------------------------------------------------
				//MODE NEW/MOD-----MODE NEW/MOD-----MODE NEW/MOD-----MODE NEW/MOD-----MODE NEW/MOD-----MODE NEW
				//---------------------------------------------------------------------------------------------
				
				if(mode==pr_ctr_Main.var_lc_MODE_NEW || mode==pr_ctr_Main.var_lc_MODE_MOD){
					$(pr_btn_Cancel		)	.show();	
					$(pr_btn_Send		)	.show();
					$(pr_btn_Save		)	.show();
				}
					

				do_bind_event_btn_edit  	(obj, mode);
				do_bind_event_btn_send		(obj, mode);

				do_bind_event_btn_save		(obj, mode);
				do_bind_event_btn_cancel	(obj, mode);
				
				do_bind_event_btn_validate	(obj, mode);	
				do_bind_event_btn_deny		(obj, mode);
				
				do_bind_event_btn_del		(obj, mode);
			
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobOff > Btn :" + e.toString());
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, this.var_lc_URL_Header, App.network, "job.off", "JobOffEntBtn", "do_lc_show", e.toString()) ;
			}
		};
		
	
		//---------------------------------------------------------------------------------------------
		//MOD REQUEST-----MOD REQUEST-----MOD REQUEST-----MOD REQUEST-----MOD REQUEST-----MOD REQUEST--
		//---------------------------------------------------------------------------------------------
		
		function do_bind_event_btn_edit(obj){
			$(pr_btn_Edit).off('click');
			$(pr_btn_Edit).click(function(){
				if(obj.stat != lc_rq_stat_draft){
					do_gl_show_Notify_Msg_Error($.i18n("job_off_cant_modify_submitted"));
					return;
				}
				pr_ctr_Ent	.do_lc_Lock_Begin(obj, false, null);
			});	
		}
		
		//---------------------------------------------------------------------------------------------
		//SAVE REQUEST-----SAVE REQUEST-----SAVE REQUEST-----SAVE REQUEST-----SAVE REQUEST-----SAVE REQ
		//---------------------------------------------------------------------------------------------
		
		var do_bind_event_btn_save = function(obj, mode){
			$(pr_btn_Save).off('click');
			$(pr_btn_Save).click(function(){
				var allow = can_submit_request();
				if(allow){
					pr_ctr_Ent.do_lc_save(obj, mode, lc_rq_stat_draft);	
				}		
			});
		}
		
		//---------------------------------------------------------------------------------------------
		//CANCEL REQUEST MODIFICATION-----CANCEL REQUEST MODIFICATION-----CANCEL REQUEST MODIFICATION--
		//---------------------------------------------------------------------------------------------
		
		var do_bind_event_btn_cancel		= function(obj, mode){
			$(pr_btn_Cancel).off('click');
			$(pr_btn_Cancel).click(function(){
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("common_msg_mod_cancel_confirm"),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: doCancel,
							param	: [obj]							
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel")								
						}
					}
				});	
			});
		}

		function doCancel(obj){		
			if(App.data.mode == pr_ctr_Main.var_lc_MODE_NEW) {	
				App.data.mode = pr_ctr_Main.var_lc_MODE_SEL;
				//self		.do_lc_show		({}, App.data.mode);
				pr_ctr_Ent	.do_lc_show		(null, App.data.mode);
			} else if(App.data.mode == pr_ctr_Main.var_lc_MODE_MOD) {				
				pr_ctr_Ent	.do_lc_Lock_Cancel	(obj);			
			} 			
		}
		
		//---------------------------------------------------------------------------------------------
		//VALIDATE/DENY REQUEST-----VALIDATE/DENY REQUEST-----VALIDATE/DENY REQUEST-----VALIDATE/DENY R
		//---------------------------------------------------------------------------------------------

		var do_bind_event_btn_validate		= function(obj, mode){
			$(pr_btn_Validate).off('click');
			$(pr_btn_Validate).click(function(){
				pr_ctr_Ent	.do_lc_Lock_Begin(obj, true, lc_rq_stat_validate);
			});
		}
		
		var do_bind_event_btn_deny		= function(obj, mode){
			$(pr_btn_Deny).off('click');
			$(pr_btn_Deny).click(function(){
				pr_ctr_Ent	.do_lc_Lock_Begin(obj, true, lc_rq_stat_denied);
			});
		}
		
		//---------------------------------------------------------------------------------------------
		//SUBMIT REPORT-----SUBMIT REPORT-----SUBMIT REPORT-----SUBMIT REPORT-----SUBMIT REPORT-----SUB
		//---------------------------------------------------------------------------------------------

		var do_bind_event_btn_send = function(obj, mode){
			$(pr_btn_Send).off('click');
			$(pr_btn_Send).click(function(){
				var allow = can_submit_request(true);
				if(allow){
					if(mode == pr_ctr_Main.var_lc_MODE_SEL){
						pr_ctr_Ent.do_lc_Lock_Begin(obj, true, lc_rq_stat_pending);
					} else {
						pr_ctr_Ent.do_lc_save(obj, mode, lc_rq_stat_pending);
					}
				}
			});
		}
		
		function can_submit_request(){
			if($("#inp_list_user").val() == "" && $('input[name="select_uId03"]:checked').val() == "0"){
				do_gl_show_Notify_Msg_Error($.i18n("job_off_msg_rp_user_missing"));
				return false;
			}
			if($("#inp_reason").val() == ""){
				do_gl_show_Notify_Msg_Error($.i18n("job_off_msg_rp_reason_missing"));
				return false;
			}
			return pr_ctr_EntTabDetail.do_calculate_date();
		}
		
		//---------------------------------------------------------------------------------------------
		//OTHER BUTTONS-----OTHER BUTTONS-----OTHER BUTTONS-----OTHER BUTTONS-----OTHER BUTTONS-----OTH
		//---------------------------------------------------------------------------------------------

		
		var do_bind_event_btn_del			= function(obj){
			$(pr_btn_Del).off('click');
			$(pr_btn_Del).click(function(){				
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"	),
					content : $.i18n("common_msg_del_confirm"	),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: pr_ctr_Ent .do_lc_delete,
							param	: [obj]						
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});				
			});
		}
		
	
	};

	return JobOffEntBtn;
});