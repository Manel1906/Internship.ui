define(['jquery'],

        function($) {


	var TpyCatEntBtn     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		
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
		var pr_object				= null;
		var pr_mode					= null;
		
		//-----------------------------------------------------------------------------------
		var pr_btn_Create 			= "#btn_TpyCat_create";
		var pr_btn_Edit 			= "#btn_TpyCat_edit";
		var pr_btn_Duplicate 		= "#btn_TpyCat_duplicate";
		var pr_btn_Del 				= "#btn_TpyCat_del";
		var pr_btn_Export 			= "#btn_TpyCat_export";
		var pr_btn_Send 			= "#btn_TpyCat_send";
		var pr_btn_Print 			= "#btn_TpyCat_print";
		var pr_btn_Save 			= "#btn_TpyCat_save";
		var pr_btn_Cancel 			= "#btn_TpyCat_cancel";
		var pr_btn_Transform 		= "#btn_TpyCat_transform";
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.TpyCat.Main;
			pr_ctr_List 			= App.controller.TpyCat.List;
			
			pr_ctr_Ent				= App.controller.TpyCat.Ent;
			pr_ctr_EntHeader 		= App.controller.TpyCat.EntHeader;
			pr_ctr_EntBtn 			= App.controller.TpyCat.EntBtn;
			pr_ctr_EntTabs 			= App.controller.TpyCat.EntTabs;
			pr_ctr_Rights			= App.controller.TpyCat.Rights;
		}
		

		this.do_lc_show		= function(obj, mode){
			pr_object 	= {};
			if(obj)
				pr_object = obj;
			pr_mode		= mode;
			try{
					
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_ENT_BTN, pr_object));

				if(mode==pr_ctr_Main.var_lc_MODE_INIT	){ // no material selected				
					$(pr_btn_Create		)	.show();
					$(pr_btn_Edit		)	.hide();
					$(pr_btn_Duplicate	)	.hide();
					$(pr_btn_Del		)	.hide();

					$(pr_btn_Export		)	.hide();
					$(pr_btn_Send		)	.hide();
					$(pr_btn_Print		)	.hide();

					$(pr_btn_Save		)	.hide();
					$(pr_btn_Cancel		)	.hide();
					$(pr_btn_Transform	)	.hide();				
				}else if(mode==pr_ctr_Main.var_lc_MODE_SEL){ // a object selected				
					$(pr_btn_Create		)	.show();
					$(pr_btn_Edit		)	.show();
					$(pr_btn_Duplicate	)	.show();
					$(pr_btn_Del		)	.show();

					$(pr_btn_Export		)	.hide();
					$(pr_btn_Send		)	.hide();
					$(pr_btn_Print		)	.hide();

					$(pr_btn_Save		)	.hide();
					$(pr_btn_Cancel		)	.hide();	
					$(pr_btn_Transform	)	.hide();	
				}else if(mode==pr_ctr_Main.var_lc_MODE_NEW){ // in creation or duplication		
					$(pr_btn_Create		)	.hide();
					$(pr_btn_Edit		)	.hide();
					$(pr_btn_Duplicate	)	.hide();
					$(pr_btn_Del		)	.hide();
					
					$(pr_btn_Export		)	.hide();
					$(pr_btn_Send		)	.hide();
					$(pr_btn_Print		)	.hide();

					$(pr_btn_Save		)	.show();
					$(pr_btn_Cancel		)	.show();
					$(pr_btn_Transform	)	.hide();	
				}else if(mode==pr_ctr_Main.var_lc_MODE_MOD){ // in modification		
					$(pr_btn_Create		)	.hide();
					$(pr_btn_Edit		)	.hide();
					$(pr_btn_Duplicate	)	.hide();
					$(pr_btn_Del		)	.hide();

					$(pr_btn_Export		)	.hide();
					$(pr_btn_Send		)	.hide();
					$(pr_btn_Print		)	.hide();

					$(pr_btn_Save		)	.hide();
					$(pr_btn_Cancel		)	.show();
					$(pr_btn_Transform	)	.hide();	
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
				
				
				$(pr_btn_Transform	)	.hide();	
				
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, this.var_lc_URL_Header, App.network, "tpy.cat", "TpyCatEntBtn", "do_lc_show", e.toString()) ;
			}
		};


		//---------private-----------------------------------------------------------------------------
		//---------private-----------------------------------------------------------------------------

		var do_bind_event_btn_create		= function(){
			if (!pr_ctr_Main.can_lc_have_right (pr_ctr_Main.RIGHT_U_N)) {
				$(pr_btn_Create).hide();
				return;
			}
			
			$(pr_btn_Create).off('click').on('click', function(){
				pr_ctr_Ent.do_lc_new();
			});
		}	
		
		var do_bind_event_btn_duplicate	= function(obj){
			if (!pr_ctr_Main.can_lc_have_right (pr_ctr_Main.RIGHT_U_N)) {
				$(pr_btn_Create).hide();
				return;
			}
			
			$(pr_btn_Duplicate).off('click').on('click', function(){
				//clone obj
				pr_ctr_Ent.do_lc_duplicate(obj);
			});
		}
		
		var do_bind_event_btn_edit			= function(obj){
			if (!pr_ctr_Main.can_lc_have_right (pr_ctr_Main.RIGHT_U_M)) {
				$(pr_btn_Create).hide();
				return;
			}
			
			$(pr_btn_Edit).off('click').on('click', function(){
				pr_ctr_Ent	.do_lc_Lock_Begin(obj);
			});	
		}
		
		var do_bind_event_btn_del			= function(obj){
			if (!pr_ctr_Main.can_lc_have_right (pr_ctr_Main.RIGHT_U_D)) {
				$(pr_btn_Create).hide();
				return;
			}
			
			$(pr_btn_Del).off('click').on('click', function(){		
				App.MsgboxController.do_lc_show({
					title	: $.i18n("tpy_cat_btn_del_title"),
					content : $.i18n("tpy_cat_btn_del_content"	),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_ok"),
							funct	: pr_ctr_Ent	.do_lc_delete,
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
			$(pr_btn_Save).off('click').on('click', function(){					
				pr_ctr_Ent.do_lc_save(obj, mode);				
			});
		}
		var do_bind_event_btn_cancel		= function(obj, mode){
			$(pr_btn_Cancel).off('click').on('click', function(){		
				App.MsgboxController.do_lc_show({
					title	: $.i18n("tpy_cat_btn_cancel_title"),
					content : $.i18n("tpy_cat_btn_cancel_content"),
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
			$(pr_btn_Export).off('click').on('click', function(){		
			});
		}

		var do_bind_event_btn_send		= function(obj, mode){
			$(pr_btn_Send).off('click').on('click', function(){		
			});
		}

		var do_bind_event_btn_print		= function(obj, mode){
			$(pr_btn_Print).off('click').on('click', function(){		
			});
		}
		
		var do_bind_event_btn_transform		= function(obj, mode){
			$(pr_btn_Transform	).off('click').on('click', function(){		
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

	return TpyCatEntBtn;
});