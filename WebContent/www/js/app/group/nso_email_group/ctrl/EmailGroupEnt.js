define([
        'jquery',
        'text!group/nso_email_group/tmpl/EmailGroup_Ent.html'

        ],
        function($, 
        		EmailGroup_Ent) {


	var EmailGroupEnt     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
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

		var self 						= this;		
		//------------------------------------------------------------------------------------
		var   pr_OBJ_TYPE			= 15000;// change to adapt with back office for lock tool
		const pr_TYP_01				= 101;// change to adapt with back office for lock tool
		
		var pr_SERVICE_CLASS		= "ServiceNsoGroup"; //to change by your need
		
		var pr_SV_GET				= "SVNsoGroupGet"; 
		var pr_SV_NEW				= "SVNsoGroupNew"; 
		var pr_SV_DEL				= "SVNsoGroupDel"; 
		
		var pr_SV_MOD				= "SVNsoGroupMod"; 	//if not use lock
		var pr_SV_MOD_TRANSL		= "SVNsoGroupModTransl";
		
		var pr_SV_LCK_NEW			= "SVNsoGroupLckReq"; 
		var pr_SV_LCK_END			= "SVNsoGroupLckEnd"; 
		var pr_SV_LCK_DEL			= "SVNsoGroupLckDel"; 
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
		var pr_lock					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.PrjEmailGroup.Main;
			pr_ctr_List 			= App.controller.PrjEmailGroup.List;
			
			pr_ctr_Ent				= App.controller.PrjEmailGroup.Ent;
			pr_ctr_EntHeader 		= App.controller.PrjEmailGroup.EntHeader;
			pr_ctr_EntBtn 			= App.controller.PrjEmailGroup.EntBtn;
			
			
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj, mode){			
			pr_object 	= obj;
			pr_mode		= mode;
			
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_GROUP_ENT	, EmailGroup_Ent); 		
			
			if (pr_mode == pr_ctr_Main.var_lc_MODE_INIT){
				$("#div_PrjEmailGroup_Ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_GROUP_ENT, {mode : pr_ctr_Main.var_lc_MODE_INIT}));
				pr_ctr_EntBtn		.do_lc_show(obj, pr_ctr_Main.var_lc_MODE_INIT);
				return;
			}
			
			if (!obj){
				$("#div_PrjEmailGroup_Ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_GROUP_ENT, {mode: 0}));		
				pr_ctr_EntBtn		.do_lc_show(null, pr_ctr_Main.var_lc_MODE_INIT);
			}else{
				$("#div_PrjEmailGroup_Ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_GROUP_ENT, obj));				
				pr_ctr_EntHeader	.do_lc_show(obj, mode);
				pr_ctr_EntBtn		.do_lc_show(obj, mode);
			}	
			
			pr_ctr_Main.do_lc_binding_pages($("#div_PrjEmailGroup_Ent"));
			
			if(mode == pr_ctr_Main.var_lc_MODE_NEW) {

			} else if(mode == pr_ctr_Main.var_lc_MODE_MOD) {
				do_gl_enable_edit($(pr_divContent));
			} else {
				do_gl_disable_edit($(pr_divContent));
			}
		}
		
		//---show after ajax request---------------------------
		function do_show_Obj(sharedJson, mode, localObj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				App.data.mode		= mode;
				if (localObj){
					self.do_lc_show(localObj, mode); 
				}else{
					var object = sharedJson[App['const'].RES_DATA];        		
					self.do_lc_show(object, mode);  
				}			     		
        	} else if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_ERROR){
        		do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
        		return;
        	}		
		}
		
			
		this.do_lc_show_ById = function(obj, mode){
			var svName 		= pr_SV_GET;
			if (pr_mode == pr_ctr_Main.var_lc_MODE_MOD){
				//not use lock
				svName = pr_SV_GET
				
				//use lock
				//svName = pr_SV_LCK_NEW
			}
		
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, svName);			
			ref.id			= obj.id;
			
			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_show_Obj, [mode]));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		//---------------------------------------------new object-------------------------------------------
		this.do_lc_new = function() {

			var newObj		 = {};		
			//action mode
			App.data.mode 	= pr_ctr_Main.var_lc_MODE_NEW;
			
			self		.do_lc_show(newObj, App.data.mode);
			//pr_ctr_Ent	.do_lc_show(newObj, App.data.mode);
			do_Enabled_Edit();
		}
		
		//---------------------------------------------clone object-------------------------------------------
		this.do_lc_duplicate = function (obj){
			var newObj 	= $.extend(true, {}, obj);
			newObj.id	= null;
			newObj.code	= null;
			App.data.mode 	= pr_ctr_Main.var_lc_MODE_NEW;
			
			self		.do_lc_show(newObj, App.data.mode);
			//pr_ctr_Ent	.do_lc_show(newObj, App.data.mode);
			do_Enabled_Edit();
		}
			
		//---------del obj-----------------------------------------------------------------------------
		this.do_lc_delete 	= function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_DEL);	
			ref.id				= obj.id;
			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 	//integer
			lock.objectKey 		= obj.id; 		//integer
			ref['lock'	]	= JSON.stringify(lock); 
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, pr_ctr_Main.var_lc_MODE_DEL])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [pr_ctr_Main.var_lc_MODE_INIT]));	
			fSucces.push(req_gl_funct(null	, do_refresh_list					, [])); //refresh menu
		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		
		//---------Lock-----------------------------------------------------------------------------
		this.do_lc_save		= function(obj, mode){	//save new object or save with lock		
			//to comeback on tab curent active
		    do_gl_req_tab_active($(pr_divContent));
		    
			var data = req_gl_data({
				dataZoneDom : $("#div_PrjEmailGroup_Ent")
			});
			//check data error
			if(data.hasError) {
				do_gl_show_Notify_Msg_Error ($.i18n('tpy_cat_data_error_msg'));
				return;
			} else {
				
				if(!data.data.ref){
					let date = new Date();
					let strDate = req_gl_DateStr_From_DateObj(date);
					
					data.data.ref = "GRP_" + req_gl_DateStr_From_DateStr(strDate, null, "yyyyMMddHHmmss");
				}
				if(mode == pr_ctr_Main.var_lc_MODE_NEW){ 	
					do_send_new(data);
				}else if(mode == pr_ctr_Main.var_lc_MODE_MOD){
					do_send_mod(data);
				}else{
					//do_notify_error here
					return;
				}
			}
		}
		
		this.do_lc_duplicate_category		= function(obj){	//save new object or save with lock		
			var data = req_gl_data({
				dataZoneDom : $("#div_tpy_cat_popup_duplicate_societe")
			});
			//check data error
			if(data.hasError) {
				do_gl_show_Notify_Msg_Error ($.i18n('tpy_cat_data_error_msg'));
				return;
			} else {
				do_send_duplicate_category(data);
			}
		}
		//-------------------------------------------New-------------------------------------------------------------
		var do_send_new = function(data) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			
			var sendableData	= data.req_sendable_data(ref, "obj");
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, pr_ctr_Main.var_lc_MODE_NEW])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [pr_ctr_Main.var_lc_MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));
		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], sendableData, 100000, fSucces, fError) ;
		}
		
		var do_send_mod = function(data) {
			var ref 	= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_MOD);
			
			var sendableData	= data.req_sendable_data(ref, "obj");
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, pr_ctr_Main.var_lc_MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [pr_ctr_Main.var_lc_MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));
			fSucces.push(req_gl_funct(null	, do_Enabled_Edit					, []));
			
		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], sendableData, 100000, fSucces, fError) ;
		}
		
		
		var do_send_lock_end = function(data) {
			var ref 		= {};
			ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_END);
			ref["lock_id"]	= pr_lock.id;
			var sendableData	= data.req_sendable_data(ref, "obj");
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, pr_ctr_Main.var_lc_MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [pr_ctr_Main.var_lc_MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));
		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], sendableData, 100000, fSucces, fError) ;
		}
		
		var do_send_duplicate_category = function(data) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_DUPLICATE);
			
			var sendableData	= data.req_sendable_data(ref, "obj");
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, pr_ctr_Main.var_lc_MODE_NEW])); 
		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], sendableData, 100000, fSucces, fError) ;
		}
		
		//-------------------------------------------------------------------------------------------------------------		
		//-------------------------------------------------------------------------------------------------------------		
		this.do_lc_Lock_Begin = function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_NEW);		
			
			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 	//integer
			lock.objectKey 		= obj.id; 		//integer
			ref['req_data'	]	= JSON.stringify(lock); 
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_begin_lock, [obj]));
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
				
		
		this.do_lc_Lock_Cancel = function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_DEL);		
			
			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 			//integer
			lock.objectKey 		= obj.id;			 	//integer
			ref['req_data'	]	= JSON.stringify(lock); 
			ref['lock_id'	]	= pr_lock.id; 
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_del_lock, []									));	
			fSucces.push(req_gl_funct(null, do_show_Obj, [pr_ctr_Main.var_lc_MODE_SEL, obj]	));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}	
		
			
		//---------private lock-----------------------------------------------------------------------------
		function do_begin_lock(sharedJson, obj){
			//to comeback on tab curent active
		    do_gl_req_tab_active($(pr_divContent));
		    
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock 		= sharedJson[App['const'].RES_DATA];   
				App.data.mode 	= pr_ctr_Main.var_lc_MODE_MOD;				
								
				pr_ctr_EntBtn.do_lc_show(obj, App.data.mode);
				self.do_lc_show			(obj, App.data.mode);
//				do_Enabled_Edit();
			} else if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_NO) {
				pr_lock 	= null;
				var uName 	= sharedJson[App['const'].RES_DATA].username;
        		do_gl_show_Notify_Msg_Error ($.i18n('lock_err_begin') + uName);
			}else{
        		pr_lock = null;
        		do_gl_show_Notify_Msg_Error ($.i18n('lock_err_inconnu'));
        		//notify something if the lock is taken by other person
        		//show lock.information
        	}		
		}
		
		function do_del_lock(sharedJson, obj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock = null;				
			} else {   
				pr_lock = null;
				//notify something
				do_gl_show_Notify_Msg_Error ($.i18n('lock_err_inconnu') );
			}
			
			App.data.mode 	= pr_ctr_Main.var_lc_MODE_SEL;				
			
			pr_ctr_EntBtn.do_lc_show(obj, App.data.mode);
			self.do_lc_show			(obj, App.data.mode);	
        			
		}
		
		this.can_lc_have_lock = function (){
			if (this.pr_lock!=null)
				App.MsgboxController.do_lc_show({
					title	: $.i18n('lock_err_title') ,
					content	: $.i18n('lock_err_msg')
				});	
			return this.pr_lock!=null;
		}
		
		var do_refresh_list = function(sharedJSon) {
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				App.controller.PrjEmailGroup.List.do_lc_show();
			}
		}
		
		var do_Enabled_Edit = function(){
			$("#div_PrjEmailGroup_Ent").find("input, select, textarea").removeAttr("disabled");
			//$("#div_PrjEmailGroup_Ent").find(".setDisabled").prop("disabled", true);
		}
		
		function do_show_success_msg(sharedJson, msg){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) do_gl_show_Notify_Msg_Success (msg);
		}
		
	}

	return EmailGroupEnt;
});