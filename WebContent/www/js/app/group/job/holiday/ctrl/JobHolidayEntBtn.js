define([
        'jquery',
        'text!group/job/holiday/tmpl/JobHoliday_Ent_Btn.html'

        ],

        function($, 
        		JobHoliday_Ent_Btn) {


	var JobHolidayEntBtn     = function (header,content,footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		
		//RIGHT ACTION----------------------------------------
		var RIGHT_G		= 1;
		var RIGHT_N		= 2;
		var RIGHT_M		= 3;
		var RIGHT_D		= 4;
		
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;
		
		//-----------------------------------------------------------------------------------
		var pr_btn_Create 			= "#btn_JobHoliday_create";
		var pr_btn_Edit 			= "#btn_JobHoliday_edit";
		var pr_btn_Duplicate 		= "#btn_JobHoliday_duplicate";
		var pr_btn_Del 				= "#btn_JobHoliday_del";
		var pr_btn_Export 			= "#btn_JobHoliday_export";
		var pr_btn_Send 			= "#btn_JobHoliday_send";
		var pr_btn_Print 			= "#btn_JobHoliday_print";
		var pr_btn_Save 			= "#btn_JobHoliday_save";
		var pr_btn_Cancel 			= "#btn_JobHoliday_cancel";
		var pr_btn_Transform		= "#btn_JobHoliday_transform";
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobHoliday.Main;
			pr_ctr_List 			= App.controller.JobHoliday.List;
			
			pr_ctr_Ent				= App.controller.JobHoliday.Ent;
			pr_ctr_EntHeader 		= App.controller.JobHoliday.EntHeader;
			pr_ctr_EntBtn 			= App.controller.JobHoliday.EntBtn;
			pr_ctr_EntTabs 			= App.controller.JobHoliday.EntTabs;
			pr_ctr_Rights			= App.controller.JobHoliday.Rights;
		}
		
		this.do_lc_show		= function(obj, mode){
			pr_object 	= obj;
			pr_mode		= mode;
			try{
				
				tmplCtrl.do_lc_put_tmpl(tmplName.JOB_HOLIDAY_ENT_BTN	, JobHoliday_Ent_Btn); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_HOLIDAY_ENT_BTN, obj));
				
				$(pr_btn_Create		)	.hide();
				$(pr_btn_Edit		)	.hide();
				$(pr_btn_Duplicate	)	.hide();
				$(pr_btn_Del		)	.hide();

				$(pr_btn_Export		)	.hide();
				$(pr_btn_Send		)	.hide();
				$(pr_btn_Print		)	.hide();
				$(pr_btn_Duplicate	)	.hide()
				
				$(pr_btn_Save		)	.hide();
				$(pr_btn_Cancel		)	.hide();
				
				if(mode==pr_ctr_Main.var_lc_MODE_INIT	){ // no material selected				
					$(pr_btn_Create		)	.show();
				}else if(mode==pr_ctr_Main.var_lc_MODE_SEL){ // a object selected				
					$(pr_btn_Create		)	.show();
					$(pr_btn_Edit		)	.show();
					$(pr_btn_Del		)	.show();				
				}else if(mode==pr_ctr_Main.var_lc_MODE_NEW){ // in creation or duplication		
					$(pr_btn_Save		)	.show();
					$(pr_btn_Cancel		)	.show();
				}else if(mode==pr_ctr_Main.var_lc_MODE_MOD){ // in modification		
					$(pr_btn_Save		)	.show();
					$(pr_btn_Cancel		)	.show();					
				}
				
				$(pr_btn_Transform)	.hide() //Don't need this button in Job Holiday View
				 //Don't need this button in Job Holiday View
				
				do_bind_event_btn_create	(obj, mode);
				do_bind_event_btn_edit		(obj, mode);
				do_bind_event_btn_del		(obj, mode);
				
				do_bind_event_btn_save		(obj, mode);
				do_bind_event_btn_cancel	(obj, mode);	
				
				//do_bind_event_btn_duplicate	(obj, mode);
				//do_bind_event_btn_export		(obj, mode);
				//do_bind_event_btn_send		(obj, mode);
				//do_bind_event_btn_print		(obj, mode);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobHoliday: EntBtn :" + e.toString());
				do_gl_send_exception(App.path.BASE_URL_API_PRIV, this.var_lc_URL_Header, App.network, "job.holiday", "JobHolidayEntBtn", "do_lc_show", e.toString()) ;
			}
		};

		//---------private-----------------------------------------------------------------------------
		var do_bind_event_btn_create = function(){
			$(pr_btn_Create).off('click');
			$(pr_btn_Create).click(function(){
				var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_N);
				if(rightCode == -1){
					do_gl_show_Notify_Msg_Error($.i18n("job_hld_msg_user_right_error_N"));
					return;
				} else {
					pr_ctr_Ent.do_lc_new();
				}
			});
		}
		
		var do_bind_event_btn_edit	= function(obj){
			$(pr_btn_Edit).off('click');
			$(pr_btn_Edit).click(function(){
				var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_M);
				if(rightCode == -1){
					do_gl_show_Notify_Msg_Error($.i18n("job_hld_msg_user_right_error_M"));
					return;
				} else {
					pr_ctr_Ent	.do_lc_Lock_Begin(obj);
				}
			});	
		}
		
		var do_bind_event_btn_del = function(obj){
			$(pr_btn_Del).off('click');
			$(pr_btn_Del).click(function(){
				var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_D);
				if(rightCode == -1){
					do_gl_show_Notify_Msg_Error($.i18n("job_hld_msg_user_right_error_D"));
					return;
				} else {
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"	),
						content : $.i18n("common_msg_del_confirm"	),
						width	: "400px",
						buttons	: {
							OK: {
								lab		: $.i18n("common_btn_yes"),
								funct	: pr_ctr_Ent	.do_lc_delete,
								param	: [obj],
								classBtn	: "btn-primary"						
							},
							NO: {
								lab		:  $.i18n("common_btn_cancel"),
							}
						}
					});
				}			
			});
		}
		
		var do_bind_event_btn_save			= function(obj, mode){
			$(pr_btn_Save).off('click');
			$(pr_btn_Save).click(function(){				
				pr_ctr_Ent.do_lc_save(obj, mode);				
			});
		}
		var do_bind_event_btn_cancel		= function(obj, mode){
			$(pr_btn_Cancel).off('click');
			$(pr_btn_Cancel).click(function(){
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("common_msg_mod_cancel_confirm"),
					width	: "400px",
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: doCancel,
							param	: [obj, mode],
							classBtn	: "btn-primary"								
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),					
						}
					}
				});	
			});
		}
		
		var do_bind_event_btn_duplicate	= function(obj){
			$(pr_btn_Duplicate).off('click');
			$(pr_btn_Duplicate).click(function(){
				pr_ctr_Ent.do_lc_duplicate(obj);
			});
		}

		var do_bind_event_btn_export		= function(obj, mode){
			$(pr_btn_Export).off('click');
			$(pr_btn_Export).click(function(){
			});
		}

		var do_bind_event_btn_send		= function(obj, mode){
			$(pr_btn_Send).off('click');
			$(pr_btn_Send).click(function(){
			});
		}

		var do_bind_event_btn_print		= function(obj, mode){
			$(pr_btn_Print).off('click');
			$(pr_btn_Print).click(function(){
			});
		}

		//----------------------------------------------------------------------------------------------
		function doCancel(obj){		
			if(App.data.mode == pr_ctr_Main.var_lc_MODE_NEW) {	
				App.data.mode = pr_ctr_Main.var_lc_MODE_SEL;
				self		.do_lc_show		(null, App.data.mode);
				pr_ctr_Ent	.do_lc_show		(null, App.data.mode);
			} else if(App.data.mode == pr_ctr_Main.var_lc_MODE_MOD) {				
				pr_ctr_Ent	.do_lc_Lock_Cancel	(obj);			
			} 			
		}
	};

	return JobHolidayEntBtn;
});