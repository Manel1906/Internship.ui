define([
        'jquery',
        'text!group/mat/alarm/tmpl/MatAlarm_Ent_Btn.html'

        ],

        function($, 
        		MatAlarm_Ent_Btn) {


	var MatAlarmEntBtn     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header  ? $(header) : null;
		var pr_divContent 			= content ? $(content): null;
		var pr_divFooter 			= footer  ? $(footer) : null;

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
		//------------------------------------------------------------------------------------
	
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
		
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.MatAlarm.Main;
			pr_ctr_List 			= App.controller.MatAlarm.List;
			
			pr_ctr_Ent				= App.controller.MatAlarm.Ent;
			pr_ctr_EntHeader 		= App.controller.MatAlarm.EntHeader;
			pr_ctr_EntBtn 			= App.controller.MatAlarm.EntBtn;
			pr_ctr_EntTabs 			= App.controller.MatAlarm.EntTabs;
			
		}
		

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_ENT_BTN	, MatAlarm_Ent_Btn); 			
				$("#div_MatAlarm_Ent_Btn"	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_ENT_BTN, obj));

				if(mode==App['const'].MODE_INIT	){ // no material selected				
					$("#btn_MatAlarm_create"	)	.show();
					$("#btn_MatAlarm_edit"	)	.hide();
					$("#btn_MatAlarm_duplicate")	.hide();
					$("#btn_MatAlarm_del"		)	.hide();

					$("#btn_MatAlarm_export"	)	.hide();
					$("#btn_MatAlarm_send"	)	.hide();
					$("#btn_MatAlarm_print"	)	.hide();

					$("#btn_MatAlarm_save"	)	.hide();
					$("#btn_MatAlarm_cancel"	)	.hide();					
				}else if(mode==App['const'].MODE_SEL){ // a object selected				
					$("#btn_MatAlarm_create"	)	.show();
					$("#btn_MatAlarm_edit"	)	.show();
					$("#btn_MatAlarm_duplicate")	.show();
					$("#btn_MatAlarm_del"		)	.show();

					$("#btn_MatAlarm_export"	)	.hide();
					$("#btn_MatAlarm_send"	)	.hide();
					$("#btn_MatAlarm_print"	)	.hide();

					$("#btn_MatAlarm_save"	)	.hide();
					$("#btn_MatAlarm_cancel"	)	.hide();					
				}else if(mode==App['const'].MODE_NEW){ // in creation or duplication		
					$("#btn_MatAlarm_create"	)	.hide();
					$("#btn_MatAlarm_edit"	)	.hide();
					$("#btn_MatAlarm_duplicate")	.hide();
					$("#btn_MatAlarm_del"		)	.hide();

					$("#btn_MatAlarm_export"	)	.hide();
					$("#btn_MatAlarm_send"	)	.hide();
					$("#btn_MatAlarm_print"	)	.hide();

					$("#btn_MatAlarm_save"	)	.show();
					$("#btn_MatAlarm_cancel"	)	.show();
				}else if(mode==App['const'].MODE_MOD){ // in modification		
					$("#btn_MatAlarm_create"	)	.hide();
					$("#btn_MatAlarm_edit"	)	.hide();
					$("#btn_MatAlarm_duplicate")	.hide();
					$("#btn_MatAlarm_del"		)	.hide();

					$("#btn_MatAlarm_export"	)	.hide();
					$("#btn_MatAlarm_send"	)	.hide();
					$("#btn_MatAlarm_print"	)	.hide();

					$("#btn_MatAlarm_save"	)	.show();
					$("#btn_MatAlarm_cancel"	)	.show();					
				}

				do_bind_event_btn_create	(obj, mode);
				do_bind_event_btn_edit		(obj, mode);
				do_bind_event_btn_duplicate	(obj, mode);
				do_bind_event_btn_del		(obj, mode);

				do_bind_event_btn_export	(obj, mode);
				do_bind_event_btn_send		(obj, mode);
				do_bind_event_btn_print		(obj, mode);

				do_bind_event_btn_save		(obj, mode);
				do_bind_event_btn_cancel	(obj, mode);			
			}catch(e) {				
				console.log(e);
			}
		};


		//---------private-----------------------------------------------------------------------------
		//---------private-----------------------------------------------------------------------------

		var do_bind_event_btn_create		= function(){
			$("#btn_MatAlarm_create").off('click');
			$("#btn_MatAlarm_create").click(function(){
				var newObj		 = {};				
				//action mode
				App.data.mode 	= App['const'].MODE_NEW;
				
				self		.do_lc_show(newObj, App.data.mode);
				pr_ctr_Ent	.do_lc_show(newObj, App.data.mode);
				do_Enabled_Edit();
			});
		}	
		
		var do_bind_event_btn_duplicate	= function(obj){
			$("#btn_MatAlarm_duplicate").off('click');
			$("#btn_MatAlarm_duplicate").click(function(){
				pr_ctr_Ent.do_lc_duplicate(obj);
			});
		}
		
		var do_bind_event_btn_edit			= function(obj){
			$("#btn_MatAlarm_edit").off('click');
			$("#btn_MatAlarm_edit").click(function(){
				pr_ctr_Ent	.do_lc_Lock_Begin(obj);
			});	
		}
		
		var do_bind_event_btn_del			= function(obj){
			$("#btn_MatAlarm_del").off('click');
			$("#btn_MatAlarm_del").click(function(){				
				App.MsgboxController.do_lc_show({
					title	: $.i18n("mat_alarm_btn_del_title"),
					content : $.i18n("mat_alarm_btn_del_content"),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_ok"),
							funct	: pr_ctr_Ent.do_lc_delete,
							param	: [obj]						
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});				
			});
		}
		
		var do_bind_event_btn_save			= function(obj, mode){
			$("#btn_MatAlarm_save").off('click');
			$("#btn_MatAlarm_save").click(function(){				
				pr_ctr_Ent.do_lc_save(obj, mode);
			});
		}
		var do_bind_event_btn_cancel		= function(obj, mode){
			$("#btn_MatAlarm_cancel").off('click');
			$("#btn_MatAlarm_cancel").click(function(){
				App.MsgboxController.do_lc_show({
					title	: $.i18n("mat_alarm_btn_cancel_title"),
					content : $.i18n("mat_alarm_btn_cancel_content"),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_ok"),
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

		var do_bind_event_btn_export		= function(obj, mode){
			$("#btn_MatAlarm_export").off('click');
			$("#btn_MatAlarm_export").click(function(){
			});
		}

		var do_bind_event_btn_send		= function(obj, mode){
			$("#btn_MatAlarm_send").off('click');
			$("#btn_MatAlarm_send").click(function(){
			});
		}

		var do_bind_event_btn_print		= function(obj, mode){
			$("#btn_MatAlarm_print").off('click');
			$("#btn_MatAlarm_print").click(function(){
			});
		}

		var do_bind_event_btn_export		= function(obj, mode){
			$("#btn_MatAlarm_export").off('click');
			$("#btn_MatAlarm_export").click(function(){
			});
		}
		
		var do_Enabled_Edit = function(){
			$("#div_frm_alarm_header").find("input, select, textarea").removeAttr("disabled");

		} 
		
		//----------------------------------------------------------------------------------------------
		function doCancel(obj){		
			if(App.data.mode == App['const'].MODE_NEW) {	
				App.data.mode = App['const'].MODE_INIT;
				///self		.do_lc_show		(null, App.data.mode);
				pr_ctr_Ent	.do_lc_show		(null, App.data.mode);
			} else if(App.data.mode == App['const'].MODE_MOD) {				
				pr_ctr_Ent	.do_lc_Lock_Cancel	(obj);			
			} 			
		}
	};

	return MatAlarmEntBtn;
});