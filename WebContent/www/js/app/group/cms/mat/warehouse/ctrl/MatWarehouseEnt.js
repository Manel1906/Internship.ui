define([
        'jquery',
        'text!group/mat/warehouse/tmpl/MatWarehouse_Ent.html'

        ],
        function($, 
        		MatWarehouse_Ent) {


	var MatWarehouseEnt     = function (header,content,footer, grpName) {
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

		var self 					= this;		
		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 20100;// change to adapt with back office for lock tool
		
		var pr_SERVICE_CLASS		= "ServiceMatWarehouse"; //to change by your need
				
		var pr_SV_GET				= "SVMatWarehouseGet"; 
		var pr_SV_NEW				= "SVMatWarehouseNew"; 
		var pr_SV_DEL				= "SVMatWarehouseDel"; 
		
		var pr_SV_MOD				= "SVMatWarehouseMod"; 	//if not use lock
				
		var pr_SV_LCK_NEW			= "SVMatWarehouseLckReq"; 
		var pr_SV_LCK_END			= "SVMatWarehouseLckEnd"; 
		var pr_SV_LCK_DEL			= "SVMatWarehouseLckDel"; 
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
		var pr_lock					= null;
		
		var pr_default_new_obj		= {
			name: "",
			inf01: ""
		};
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.MatWarehouse.Main;
			pr_ctr_List 			= App.controller.MatWarehouse.List;
			
			pr_ctr_Ent				= App.controller.MatWarehouse.Ent;
			pr_ctr_EntHeader 		= App.controller.MatWarehouse.EntHeader;
			pr_ctr_EntBtn 			= App.controller.MatWarehouse.EntBtn;
			pr_ctr_EntTabs 			= App.controller.MatWarehouse.EntTabs;
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj, mode){			
			pr_obj 	= obj;
			pr_mode		= mode;
			App.data.mode = mode;
			
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_ENT	, MatWarehouse_Ent); 		
			
			if (pr_mode == App['const'].MODE_INIT){
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_ENT, {mode : App['const'].MODE_INIT}));
				pr_ctr_EntBtn		.do_lc_show(obj, App['const'].MODE_INIT);
//				pr_ctr_Main.do_lc_binding_pages($(pr_divContent));
				return;
			}
			
			if (!obj){
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_ENT, {mode: 0}));
				pr_ctr_EntBtn		.do_lc_show(null, App['const'].MODE_INIT);
			}else{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_ENT, obj));				
				pr_ctr_EntHeader	.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntBtn		.do_lc_show(pr_obj, pr_mode);
//				pr_ctr_EntTabs		.do_lc_show(pr_obj, pr_mode);
			}	
			
			pr_ctr_Main.do_lc_binding_pages($(pr_divContent));
			
			if(mode == App['const'].MODE_NEW) {
				
			} else if(mode == App['const'].MODE_MOD) {
				do_gl_enable_edit($(pr_divContent));
			} else {
				do_gl_disable_edit($(pr_divContent));
			}
			App.controller.Shp.ShpMain.do_lc_bind_event_div_Minimize();
			
		}
		
		//---show after ajax request---------------------------
		function do_show_Obj(sharedJson, mode, localObj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				if (localObj){
					self.do_lc_show(localObj, mode); 
				}else{					
					var object = sharedJson[App['const'].RES_DATA];
//					localObj = object;
					self.do_lc_show(object, mode);  
				}
        	} else {
        		do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
        	}		
		}
			
		this.do_lc_show_ById = function(obj, mode){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET); 			
			ref.id			= obj.id;
			
			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_show_Obj, [mode]));	
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		//---------------------------------------------new object-------------------------------------------
		this.do_lc_new = function() {
			self		.do_lc_show({}, App['const'].MODE_NEW);
		}

		//---------------------------------------------clone object-------------------------------------------
		this.do_lc_duplicate = function (obj){
			var newObj 		= $.extend(true, {}, obj);
			newObj.id		= null;

			self			.do_lc_show(newObj, App['const'].MODE_NEW);
		}
			
		//---------del obj-----------------------------------------------------------------------------
		this.do_lc_delete 	= function (obj){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_DEL);	
			ref.id			= obj.id;
			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 	//integer
			lock.objectKey 		= obj.id; 		//integer
			ref['lock'	]		= JSON.stringify(lock);
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, pr_ctr_Main.var_lc_MODE_DEL]));
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_INIT]));	
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));
		
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		//---------Lock-----------------------------------------------------------------------------
		this.do_lc_save		= function(obj, mode){	//save new object or save with lock	
			
			var data = req_gl_data({
				dataZoneDom : $(pr_divContent)
			});
			
			//check data error
			if(data.hasError == true){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_data'));
				return false;
			}
			App.MsgboxController.do_lc_show({
				title	: $.i18n("msgbox_save_title"),
				content : $.i18n("msgbox_save_cont"),
				width	: window.innerWidth<1024?"95%":"40%",
				buttons	: {
					SAVE_EXIT: {
						lab		: 	$.i18n("common_btn_save_exit"),
						funct	: 	function(){
									if(mode==App['const'].MODE_MOD){
										do_send_mod_exit(data)
									} else if(mode==App['const'].MODE_NEW){
										do_send_new_exit(data);	
									}
						}							
					},
					SAVE_CONTINUE: {
						lab		:  	$.i18n("common_btn_save_continue"),
						funct	: 	function(){
									if(mode==App['const'].MODE_MOD){
										do_send_mod_continue(data)
									} else if(mode==App['const'].MODE_NEW){
										do_send_new_continue(data);	
									}
						}
					}
				}
			});	
		}
		//-------------------------------------------New-------------------------------------------------------------
		var do_send_new = function(data) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			
			var sendableData	= data.req_sendable_data(ref, "obj");
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, App['const'].MODE_NEW]));
			fSucces.push(req_gl_funct(null, do_show_Obj, [App['const'].MODE_SEL]));
			fSucces.push(req_gl_funct(null, do_refresh_list, []));
		
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], sendableData, 100000, fSucces, fError) ;
		}
		
		//-------------------------------------------Mod-------------------------------------------------------------
		var do_send_mod = function(data) {
			var ref 	= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_MOD);
			
			var sendableData	= data.req_sendable_data(ref, "obj");
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, App['const'].MODE_MOD]));
			fSucces.push(req_gl_funct(null, do_show_Obj, [App['const'].MODE_MOD]));
			fSucces.push(req_gl_funct(null, do_refresh_list, []));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], sendableData, 100000, fSucces, fError) ;
		}
		
		//--------------------------------------------Lock End--------------------------------------------------------
		var do_send_lock_end = function(data) {
			var ref 		= {};
			ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_END);
			ref["lock_id"]	= pr_lock.id;
			var sendableData	= data.req_sendable_data(ref, "obj");
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, App['const'].MODE_MOD]));
			fSucces.push(req_gl_funct(null, do_show_Obj, [App['const'].MODE_SEL]));
			fSucces.push(req_gl_funct(null, do_refresh_list, []));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], sendableData, 100000, fSucces, fError) ;
		}
		
		//-------------------------------------------------------------------------------------------------------------		
		this.do_lc_Lock_Begin = function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_NEW);		
			
			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 	//integer
			lock.objectKey 		= obj.id; 		//integer
			ref['req_data'	]	= JSON.stringify(lock); 
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_begin_lock, [obj]));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
				
		
		this.do_lc_Lock_Cancel = function (obj){
			if (!pr_lock){
				App.data.mode = App['const'].MODE_INIT;
				do_lc_show ({}, App.data.mode);
				return;
			}
			
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_DEL);		
			
			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 			//integer
			lock.objectKey 		= obj.id;			 	//integer
			ref['req_data'	]	= JSON.stringify(lock); 
			ref["lock_id"]		= pr_lock.id;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_del_lock, [obj]	));	
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}	
		
			
		//---------private lock-----------------------------------------------------------------------------
		function do_begin_lock(sharedJson, obj){
			//to comeback on tab curent active
		    do_gl_req_tab_active($(pr_divContent));
		    
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock 		= sharedJson[App['const'].RES_DATA];   
				App.data.mode 	= App['const'].MODE_MOD;
				pr_ctr_EntBtn.do_lc_show(obj, App.data.mode);
				self.do_lc_show			(obj, App.data.mode);
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
			
			App.data.mode 	= App['const'].MODE_SEL;				
			
			pr_ctr_EntBtn.do_lc_show(obj, App.data.mode);
			self.do_lc_show			(obj, App.data.mode);	
        			
		}
		
		this.can_lc_have_lock = function (){
			if (this.pr_lock!=null)
				App.msgBox.do_lc_show({
					title	: $.i18n('lock_err_title') ,
					content	: $.i18n('lock_err_msg')
				});	
			return this.pr_lock!=null;
		}
		
		//-----------------------------------------------------------------------------------------
		function do_refresh_list (sharedJSon) {
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				pr_ctr_List.do_lc_show();
			}
		}
		
		function do_show_success_msg(sharedJson, msg){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) do_gl_show_Notify_Msg_Success (msg);
		}
	}

	return MatWarehouseEnt;
});