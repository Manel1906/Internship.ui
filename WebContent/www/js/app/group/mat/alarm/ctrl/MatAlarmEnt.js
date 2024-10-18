define([
        'jquery',
        'text!group/mat/alarm/tmpl/MatAlarm_Ent.html'
        ],
        function($, 
        		MatAlarm_Ent) {


	var MatAlarmEnt     = function (header,content,footer, grpName) {
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
		var pr_OBJ_TYPE				= 7001;// change to adapt with back office for lock tool
		
		var pr_SERVICE_CLASS		= "ServiceTpyInformation"; //to change by your need
				
		var pr_SV_GET				= "SVMatAlarmGet"; 
		var pr_SV_NEW				= "SVMatAlarmNew"; 
		var pr_SV_DEL				= "SVMatAlarmDel";
		var pr_SV_EXT				= "SVMatAlarmExist"; 
		
		var pr_SV_MOD				= "SVMatAlarmMod"; 	//if not use lock
				
		var pr_SV_LCK_NEW			= "SVMatAlarmLckReq"; 
		var pr_SV_LCK_END			= "SVMatAlarmLckEnd"; 
		var pr_SV_LCK_DEL			= "SVMatAlarmLckDel"; 
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
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.MatAlarm.Main;
			pr_ctr_List 			= App.controller.MatAlarm.List;
			
			pr_ctr_Ent				= App.controller.MatAlarm.Ent;
			pr_ctr_EntHeader 		= App.controller.MatAlarm.EntHeader;
			pr_ctr_EntBtn 			= App.controller.MatAlarm.EntBtn;
//			pr_ctr_EntTabs 			= App.controller.MatAlarm.EntTabs;
			
			
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj, mode){			
			pr_obj 	  = obj;
			pr_mode		  = mode;
			App.data.mode = mode;
			
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_ENT	, MatAlarm_Ent); 
			
			if (pr_mode == App['const'].MODE_INIT){
				$("#div_MatAlarm_Ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_ENT, {mode : App['const'].MODE_INIT}));
				pr_ctr_EntBtn				 .do_lc_show({}, App['const'].MODE_INIT);				
				return;
			}
			
			if (!obj){
				$("#div_MatAlarm_Ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_ENT, {mode: 0}));		
				pr_ctr_EntBtn		.do_lc_show(null, App['const'].MODE_INIT);
			}else{
				$("#div_MatAlarm_Ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_ENT, obj));	
				pr_ctr_EntHeader	.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntBtn		.do_lc_show(pr_obj, pr_mode);
//				pr_ctr_EntTabs		.do_lc_show(pr_obj, pr_mode);
			}		
			
			pr_ctr_Main.do_lc_binding_pages($("#div_MatAlarm_Ent"));
			
			if(mode == App['const'].MODE_NEW) {

			} else if(mode == App['const'].MODE_MOD) {
				do_gl_enable_edit($(pr_divContent));
				do_gl_disable_edit($("#inp_mat_inf04"));
				do_gl_disable_edit($("#inp_mat_val01"));
			} else {
				do_gl_disable_edit($(pr_divContent));
			}
		}
		
		//---show after ajax request---------------------------
		function do_show_Obj(sharedJson, mode, localObj, objMod){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				if (localObj){
					self.do_lc_show(localObj, mode); 
				}else{
					var object = sharedJson[App['const'].RES_DATA];  
					if(object == null && objMod != null) object = objMod.data;
					self.do_lc_show(object, mode);  
				}			     		
        	} else {
        		//TODO do something here
        		//notify here
        	}		
		}
		
		function do_update_Lst_Alarm(sharedJson, mode, objMod){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				var alarm = sharedJson[App['const'].RES_DATA];
				var refAlarm = null;
				if(alarm == null && objMod != null) alarm = objMod.data;
				if(alarm != null){
					if(alarm.alarmRef != null){
						var lstAlarmBase = App.data.lst_baseAlarm;
						for(var i=0; i<lstAlarmBase.length;i++){
							if(lstAlarmBase[i].id == alarm.alarmRef){
								refAlarm = lstAlarmBase[i].name;
								break;
							} 
						} 
					} 
					
				} 
				if(mode==App['const'].MODE_NEW){ 	
					$('.table-datatableDyn tbody tr')		.removeClass('selected');
					$("#div_MatAlarm_List").find(".table-datatableDyn tbody").prepend("<tr role='row' class='selected'>" +
							"<td class='sorting_1'>" 	 + alarm.code 	+ "</td>"+
							"<td>" 						 + alarm.name 	+ "</td>"+
							"<td>" 						 + alarm.ratio	+ "</td>"+
							"<td>" 						 + refAlarm		+ "</td>"+
							"<td style='display:none;'>" + alarm.id 		+ "</td>"+
					"</tr>");	
				}else if(mode==App['const'].MODE_MOD){
					$("#div_MatAlarm_List").find(".table-datatableDyn .selected td:eq(0)").html(alarm.code);
					$("#div_MatAlarm_List").find(".table-datatableDyn .selected td:eq(1)").html(alarm.name);
					$("#div_MatAlarm_List").find(".table-datatableDyn .selected td:eq(2)").html(alarm.ratio);
					$("#div_MatAlarm_List").find(".table-datatableDyn .selected td:eq(3)").html(refAlarm);	
				}else if(mode == null){
					$("#div_MatAlarm_List").find(".table-datatableDyn .selected").remove();
				} 
			} else {
				//TODO do something here
				//notify here
			}		
		}
		
			
		this.do_lc_show_ById = function(obj, mode){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET); 			
			ref["id"]		= obj.id;
			
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
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_DEL);	

			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 	//integer
			lock.objectKey 		= obj.id; 		//integer
			ref['lock']	        = JSON.stringify(lock); 
			ref["id"]			= obj.id;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, pr_ctr_Main.var_lc_MODE_DEL])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_INIT]));	
			fSucces.push(req_gl_funct(null	, do_refresh_list					, [])); //refresh menu
		
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		
		//---------Lock-----------------------------------------------------------------------------
		this.do_lc_save		= function(obj, mode){	//save new object or save with lock		
			//to comeback on tab curent active
		    do_gl_req_tab_active($(pr_divContent));
		    
			var data = req_gl_data({
				dataZoneDom : $("#div_MatAlarm_Ent")
			});
			
			if(data.data.check == 0){
				if(!data.data.manId) data.data.manId = App.data.user.manId;
			}
			
			if(data.data.check == 1){
				if(!data.data.manId) data.data.manId = -1;
			}
			
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
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, App['const'].MODE_NEW])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));
		
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], sendableData, 100000, fSucces, fError) ;
		}
		
		var do_send_mod = function(data) {
			var ref 	= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_MOD);
			
			var sendableData	= data.req_sendable_data(ref, "obj");
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_MOD]));
//			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));
			fSucces.push(req_gl_funct(null	, do_Enabled_Edit					, []));
			
		
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], sendableData, 100000, fSucces, fError) ;
		}
		
		var do_check_alarm_exist = function(data, sendFunc) {
			var ref 	= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_EXT);
			
			var sendableData	= data.req_sendable_data(ref, "obj");

			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_check_alarm_response	, [data, sendFunc])); 
		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("mat_alarm_msg_check_exist_err"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], sendableData, 100000, fSucces, fError) ;
		}

		var do_check_alarm_response = function(sharedJSon, data, sendFunc){
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES){
				sendFunc(data);
			}else{
				$("#code03").addClass("inp-error");
				do_gl_show_Notify_Msg_Error($.i18n('mat_alarm_msg_check_exist_err'));
			}
		}
		
		var do_send_lock_end = function(data) {
			var ref 		= {};
			ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_END);
			ref["lock_id"]	= pr_lock.id;
			var sendableData	= data.req_sendable_data(ref, "obj");
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));
		
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], sendableData, 100000, fSucces, fError) ;
		}
		
		var do_send_duplicate_category = function(data) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_DUPLICATE);
			
			var sendableData	= data.req_sendable_data(ref, "obj");
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, App['const'].MODE_NEW])); 
		
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
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
			ref['lock_id'	]	= pr_lock.id; 
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_del_lock, []									));	
			fSucces.push(req_gl_funct(null, do_show_Obj, [App['const'].MODE_SEL, obj]	));	
			
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
			
			App.data.mode 	= App['const'].MODE_SEL;				
			
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
				pr_ctr_Main.do_lc_show_lst_alarm();
			}
		}
		
		var do_Enabled_Edit = function(){
			$("#div_TpyCat_Ent").find("input, select, textarea").removeAttr("disabled");
			//$("#div_TpyCat_Ent").find(".setDisabled").prop("disabled", true);
		}
		
		function do_show_success_msg(sharedJson, msg){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) do_gl_show_Notify_Msg_Success (msg);
		}
	}

	return MatAlarmEnt;
});