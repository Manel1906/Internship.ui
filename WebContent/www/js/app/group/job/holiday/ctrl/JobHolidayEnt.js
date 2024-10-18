define([
        'jquery',
        'text!group/job/holiday/tmpl/JobHoliday_Ent.html'

        ],
        function($, 
        		JobHoliday_Ent) {


	var JobHolidayEnt     = function (header,content,footer) {
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
		var pr_OBJ_TYPE				= 2001;// change to adapt with back office for lock tool
		
		var pr_SERVICE_CLASS		= "ServiceJobHoliday"; //to change by your need
				
		var pr_SV_GET				= "SVGet"; 
		var pr_SV_NEW				= "SVNew"; 
		var pr_SV_DEL				= "SVDel"; 
		
		var pr_SV_MOD				= "SVMod"; 	//if not use lock
				
		var pr_SV_LCK_NEW			= "SVLckReq"; 
		var pr_SV_LCK_END			= "SVLckEnd"; 
		var pr_SV_LCK_DEL			= "SVLckDel"; 
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
			pr_ctr_Main 			= App.controller.JobHoliday.Main;
			pr_ctr_List 			= App.controller.JobHoliday.List;
			
			pr_ctr_Ent				= App.controller.JobHoliday.Ent;
			pr_ctr_EntHeader 		= App.controller.JobHoliday.EntHeader;
			pr_ctr_EntBtn 			= App.controller.JobHoliday.EntBtn;
			pr_ctr_EntTabs 			= App.controller.JobHoliday.EntTabs;			
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj, mode){			
			pr_object 	= obj;
			pr_mode		= mode;
			
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_HOLIDAY_ENT	, JobHoliday_Ent); 		
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_HOLIDAY_ENT, {mode : pr_ctr_Main.var_lc_MODE_INIT}));
			
			if (pr_mode == pr_ctr_Main.var_lc_MODE_INIT){
				pr_ctr_EntBtn		.do_lc_show(obj, pr_ctr_Main.var_lc_MODE_INIT);
				return;
			}
			
			if (!obj){
				obj = {};
				pr_ctr_EntBtn		.do_lc_show({}, pr_ctr_Main.var_lc_MODE_INIT);
			}else{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_HOLIDAY_ENT, obj));				
				pr_ctr_EntBtn		.do_lc_show(obj, mode);
				pr_ctr_EntHeader	.do_lc_show(obj, mode);
				//pr_ctr_EntTabs		.do_lc_show(obj, mode);
			}	
			
			pr_ctr_Main.do_lc_binding_pages($("#div_JobHoliday_Ent"));
		}
		
		//---show after ajax request---------------------------
		function do_show_Obj(sharedJson, mode, localObj){
			var code = sharedJson[App['const'].SV_CODE];
			if(code == App['const'].SV_CODE_API_YES) {					
				if (localObj){
					self.do_lc_show(localObj, mode); 
				}else{					
					var object = sharedJson[App['const'].RES_DATA];        		
					self.do_lc_show(object, mode);  
				}			     		
        	} else {
        		do_gl_show_Notify_Msg_Error("JobHoliday: Ent Get Obj > SV CODE :" + code);
        	}
		}
		
			
		this.do_lc_show_ById = function(objId, mode){
			var svName 		= pr_SV_GET;
			if (pr_mode == pr_ctr_Main.var_lc_MODE_MOD){
				//not use lock
				svName = pr_SV_GET
				
				//use lock
				//svName = pr_SV_LCK_NEW
			}
		
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, svName);			
			ref.id			= objId;
			
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
		}
		
		//---------------------------------------------clone object-------------------------------------------
		this.do_lc_duplicate = function (obj){
			var newObj 	= $.extend(true, {}, obj);
			newObj.id	= null;
			App.data.mode 	= pr_ctr_Main.var_lc_MODE_NEW;
			
			self		.do_lc_show(newObj, App.data.mode);
		}
			
		//---------del obj-----------------------------------------------------------------------------
		this.do_lc_delete 	= function (obj){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_DEL);	
			ref.id			= obj.id;
			
			var lock 		= {};			
			lock.objectType = pr_OBJ_TYPE; 	//integer
			lock.objectKey 	= obj.id; 		//integer
			ref['lock'	]	= JSON.stringify(lock);
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, pr_ctr_Main.var_lc_MODE_DEL])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [pr_ctr_Main.var_lc_MODE_INIT]));	
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []							)); //refresh menu
		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		this.do_lc_duplicate = function (obj){
			var newObj 	= $.extend(true,{},obj);
			newObj.id	= null;
		}
		
		//---------Lock-----------------------------------------------------------------------------
		this.do_lc_save		= function(obj, mode){	//save new object or save with lock	
			//to comeback on tab curent active
			do_gl_req_tab_active($(pr_divContent));
				
			if (!obj.files) obj.files = [];			
			var data 				= req_gl_data({
					dataZoneDom		: $(pr_divContent),
					oldObject 		: {"files": obj.files},
					removeDeleted	: true				
			});
			
			//check data error
			if(data.hasError) {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));				
			} else {
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("common_msg_mod_confirm"),
					width	: "400px",
					buttons	: {
						OK: {
							lab		: 	$.i18n("common_btn_save"),
							funct	: 	function(){
										if(mode==pr_ctr_Main.var_lc_MODE_MOD){
											do_send_mod_exit(data)
										} else if(mode==pr_ctr_Main.var_lc_MODE_NEW){
											do_send_new_exit(data);	
										}
							},
							classBtn	: "btn-primary"							
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),					
						},

					}
				});	
							
			}			
		}
		
		var do_send_new_exit = function(data) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["lock"]	= 2;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg_Error [null, null, pr_ctr_Main.var_lc_MODE_NEW])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj					, [pr_ctr_Main.var_lc_MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list				, []));
		
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}

		var do_send_mod_exit = function(data) {
			var ref 			= {};
			ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_END);
			ref['lock_id'] 		= pr_lock.id;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg_Error [null, null, pr_ctr_Main.var_lc_MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj					, [pr_ctr_Main.var_lc_MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list				, []));

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	

			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError);
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
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
				
		
		this.do_lc_Lock_Cancel = function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_DEL);		
			ref['lock_id'	]	= pr_lock.id; 
			
			var fSucces			= [];
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_del_lock		, [obj]									));	
			fSucces.push(req_gl_funct(null, do_show_Obj		, [pr_ctr_Main.var_lc_MODE_SEL, obj]	));	
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
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
		//-----------------------------------------------------------------------------------------		
		this.do_lc_gen_pdf 	= function(obj){			
			var ref 		= {};		
			ref 			= req_gl_Request_Content_Send("SVSysReportGen", "ServiceSysReport");	
			
			$.extend(true, ref, result.data);
			ref['reportId']	= -1;
			ref['params']	= JSON.stringify({"objId" : obj.id});
			ref['toPrint']	= false;

			var fSucces		= [];			
			fSucces.push(req_gl_funct(null	, do_show_File, []));				

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		var do_show_File = function(sharedJSon){
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {				
				var data 	= sharedJSon.res_data;
				var url 	= App.path.BASE_URL_API_PRIV + "?" +	data.path01;
				window.open(url, "_blank");
			} 
		}
		
		//-----------------------------------------------------------------------------------------
		function do_refresh_list (sharedJSon) {
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				pr_ctr_List.do_lc_show();
			}
		}	
		
	}

	return JobHolidayEnt;
});