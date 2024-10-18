define(['jquery' ], function($) {

	var JobOffEnt     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
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
		var pr_OBJ_TYPE				= 2020;
		
		var pr_SERVICE_CLASS		= "ServiceJobDayoffRequest";
				
		var pr_SV_GET				= "SVGet"; 
		var pr_SV_NEW				= "SVNew"; 
		var pr_SV_DEL				= "SVDel"; 
		
		var pr_SV_MOD				= "SVMod";
		var pr_SV_MOD_DIRECT		= "SVModDirect";
				
		var pr_SV_LCK_NEW			= "SVLckReq"; 
		var pr_SV_LCK_END			= "SVLckEnd"; 
		var pr_SV_LCK_DEL			= "SVLckDel";
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntHeader		= null;
		var pr_ctr_EntTabs			= null;
		
		var lc_rq_stat_draft		= 0;
		var lc_rq_stat_pending		= 1;
		var lc_rq_stat_validate		= 2;
		var lc_rq_stat_denied		= 3;
		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;
		var pr_lock					= null;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobOff.Main;
			pr_ctr_List 			= App.controller.JobOff.List;
			pr_ctr_Ent				= App.controller.JobOff.Ent;
			pr_ctr_EntBtn 			= App.controller.JobOff.EntBtn;
			pr_ctr_EntHeader		= App.controller.JobOff.EntHeader;
			pr_ctr_EntTabs			= App.controller.JobOff.EntTabs;

			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
			
			var u = App.data.user.per;
			if(!u.name03){
				u.name03 = "";
			}
			App.data.user.fullname = u.name01 + " " + u.name02 + " " + u.name03;
		}
		
		//---------------------------------------------------------------------------------------------
		//SHOW REQUEST DAYOFF-----SHOW REQUEST DAYOFF-----SHOW REQUEST DAYOFF-----SHOW REQUEST DAYOFF--
		//---------------------------------------------------------------------------------------------
		
		this.do_lc_show		= function(obj, mode){			
			pr_object 		= obj;
			pr_mode			= mode?mode:pr_ctr_Main.var_lc_MODE_INIT;		
			
			if (pr_mode == pr_ctr_Main.var_lc_MODE_INIT){
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_ENT, {}));
				pr_ctr_EntBtn		.do_lc_show({}, pr_mode);
				return;
			}
			
			
			if (obj){
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_ENT, obj));				
				pr_ctr_EntBtn		.do_lc_show(obj, pr_mode);
				pr_ctr_EntHeader	.do_lc_show(obj, pr_mode);
				pr_ctr_EntTabs		.do_lc_show(obj, pr_mode);
			}

			pr_ctr_Main.do_lc_binding_pages($(pr_divContent), {
				obj: obj
			});
			
			if(pr_mode == pr_ctr_Main.var_lc_MODE_NEW || pr_mode == pr_ctr_Main.var_lc_MODE_MOD) {
				do_gl_enable_edit($(pr_divContent), ".canEnabled", mode);
			} else {
				do_gl_disable_edit($(pr_divContent), ".canEnabled", mode);
			}
		}
		
		function do_show_Obj(sharedJson, mode, localObj){
			var code = sharedJson[App['const'].SV_CODE];
			if(code == App['const'].SV_CODE_API_YES) {					
				if (localObj){
					self.do_lc_show(localObj, mode); 
				}else{					
					var object = sharedJson[App['const'].RES_DATA];        		
					self.do_lc_show(object, mode);  
				}			     		
        	}
		}
			
		this.do_lc_show_ById = function(obj, mode){
			self.do_lc_show(obj, mode);
		}
		
		//---------------------------------------------------------------------------------------------
		//NEW REQUEST DAYOFF-----NEW REQUEST DAYOFF-----NEW REQUEST DAYOFF-----NEW REQUEST DAYOFF-----N
		//---------------------------------------------------------------------------------------------
		
		this.do_lc_new = function() {
			var newObj			= {};		
			newObj.stat 		= lc_rq_stat_draft;
			newObj.ref 			= generateNewRef();
			newObj.uId01 		= App.data.user.id;
			newObj.uId01_name 	= App.data.user.fullname;
			newObj.dt01			= new Date();
			newObj.uId03  		= App.data.user.id;
			newObj.uId03_name   = App.data.user.fullname;
			
			App.data.mode 	= pr_ctr_Main.var_lc_MODE_NEW;
			self		.do_lc_show(newObj, App.data.mode);
		}
		
		function generateNewRef(){
			var char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var numb = "0123456789";
			var code =  char.charAt(Math.floor(Math.random() * char.length));
				code += char.charAt(Math.floor(Math.random() * char.length));
			for (var i = 0; i < 3; i++){
				code += numb.charAt(Math.floor(Math.random() * numb.length));
			}
			return code;
		}
		
		//---------------------------------------------------------------------------------------------
		//SAVE OFF-----SAVE OFF-----SAVE OFF-----SAVE OFF-----SAVE OFF-----SAVE OFF--
		//---------------------------------------------------------------------------------------------
		this.do_lc_Save_Entity = function (pr_divContent, ent, mode){
			if (!divContent) var divContent	= pr_divContent;
			if (!mode)			mode			= pr_ctr_Main.var_lc_MODE_MOD;
			if(mode == pr_ctr_Main.var_lc_MODE_NEW)	var divContent	= pr_divContent;
			
			if (!ent.files) ent.files = [];		
			let	data	= req_gl_data({
				dataZoneDom		: $(divContent),
				extObject		: {"files": ent.files} //--merge oldfile to lst new
			});
			
			if(data.hasError)	return false;
			
			data.data 				= $.extend(false, ent, data.data, {files: ent.files});
			
			do_send_data (data, mode);
		}
		var do_send_data= function(data, mode){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, mode==pr_ctr_Main.var_lc_MODE_NEW? pr_SV_NEW : pr_SV_MOD);
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	,  do_gl_show_Notify_Msg_Error [null, null, pr_ctr_Main.var_lc_MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_lc_afterSave_EntContent	, []));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError);
		}
		var do_lc_afterSave_EntContent = function(sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let data 		= sharedJson[App['const'].RES_DATA];
				App.data.mode 	= pr_ctr_Main.var_lc_MODE_SEL;	
				self.do_lc_show(data,pr_ctr_Main.var_lc_MODE_SEL);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		
		//---------------------------------------------------------------------------------------------
		//SAVE REQUEST-----SAVE REQUEST-----SAVE REQUEST-----SAVE REQUEST-----SAVE REQUEST-----SAVE REQ
		//---------------------------------------------------------------------------------------------
		
		this.do_lc_save		= function(obj, mode, rqStat, submitDirect){	//save new object or save with lock
			do_gl_req_tab_active($(pr_divContent));
				
			if (!obj.files) obj.files = [];			
			var request 				= req_gl_data({
					dataZoneDom		: $(pr_divContent),
					oldObject 		: {"files": obj.files},
					removeDeleted	: true				
			});
			
			if(request.hasError) {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));
				return;
			}
			
			request.data.stat = rqStat;
			
			if (rqStat == lc_rq_stat_validate){
				do_send_mod_direct(request);
				return;
			}
			
			if (rqStat == lc_rq_stat_denied){
				App.MsgboxController.do_lc_show({
					title	: $.i18n("job_off_msgbox_confirm_deny_title"),
					content : $.i18n("job_off_msgbox_confirm_deny_message"),
					buttons	: {
						SAVE_EXIT: {
							lab		: 	$.i18n("job_off_msgbox_confirm_deny_btn1"),
							funct	: 	function(){
											do_send_mod_direct(request);
										}						
						},
						CANCEL : {
							lab		:  	$.i18n("job_off_msgbox_confirm_deny_btn2")
						}
					}
				});
				return;
			}
			
			if(rqStat == lc_rq_stat_pending && submitDirect){
				App.MsgboxController.do_lc_show({
					title	: $.i18n("job_off_msgbox_confirm_submit_title"),
					content : $.i18n("job_off_msgbox_confirm_submit_message"),
					buttons	: {
						SAVE_EXIT: {
							lab		: 	$.i18n("job_rp_msgbox_confirm_submit_btn1"),
							funct	: 	function(){
											do_send_mod_direct(request);
										}							
						},
						CANCEL : {
							lab		:  	$.i18n("job_rp_msgbox_confirm_submit_btn2")
						}
					}
				});
				return;
			}
			
			if(rqStat == lc_rq_stat_pending){
				App.MsgboxController.do_lc_show({
					title	: $.i18n("job_off_msgbox_confirm_submit_title"),
					content : $.i18n("job_off_msgbox_confirm_submit_message"),
					buttons	: {
						SAVE_EXIT: {
							lab		: 	$.i18n("job_rp_msgbox_confirm_submit_btn1"),
							funct	: 	function(){
											if(mode==pr_ctr_Main.var_lc_MODE_MOD){
												do_send_mod_exit(request)
											} else if(mode==pr_ctr_Main.var_lc_MODE_NEW){
												do_send_new_exit(request);
											}
										}							
						},
						CANCEL : {
							lab		:  	$.i18n("job_rp_msgbox_confirm_submit_btn2")
						}
					}
				});
				return;
			}

			if (rqStat == lc_rq_stat_draft){
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("common_msg_mod_confirm"),
					buttons	: {
						SAVE_EXIT: {
							lab			: 	$.i18n("common_btn_save_exit"),
							funct		: 	function(){
												if(mode==pr_ctr_Main.var_lc_MODE_MOD){
													do_send_mod_exit(request)
												} else if(mode==pr_ctr_Main.var_lc_MODE_NEW){
													do_send_new_exit(request);
												}
											}							
						},
						SAVE_CONTINUE	: {
							lab			:  	$.i18n("common_btn_save_continue"),
							funct		: 	function(){
												if(mode==pr_ctr_Main.var_lc_MODE_MOD){
													do_send_mod_continue(request)
												} else if(mode==pr_ctr_Main.var_lc_MODE_NEW){
													do_send_new_continue(request);	
												}
											}
						}
					}
				});		
			}			
		}
		
		//---------------------------------------------------------------------------------------------
		//SEND NEW-----SEND NEW-----SEND NEW-----SEND NEW-----SEND NEW-----SEND NEW-----SEND NEW-----SE
		//---------------------------------------------------------------------------------------------
		
		var do_send_new_continue = function(req) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["lock"]	= 1;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", req.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_MOD]));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));
			fSucces.push(req_gl_funct(null	, do_begin_lock_new		, []));
		
			var fError 			= req_gl_funct(null, do_show_msg	, ["KO"]);
			req.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError);
		}
		
		var do_send_new_exit = function(req) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["lock"]	= 2;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", req.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));
		
			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);	
			req.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		//---------------------------------------------------------------------------------------------
		//SEND MOD-----SEND MOD-----SEND MOD-----SEND MOD-----SEND MOD-----SEND MOD-----SEND MOD-----SE
		//---------------------------------------------------------------------------------------------
		
		var do_send_mod_continue = function(req) {
			var ref 	= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_MOD);
		
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg		, ["OK", req.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj		, [pr_ctr_Main.var_lc_MODE_MOD]));
			
			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);
			req.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError);
		}
		
		var do_send_mod_exit = function(req) {
			var ref 			= {};
			ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_END);
			ref['lock_id'] 		= pr_lock.id;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", req.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));
			
			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);	
			req.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError);
		}
		
		//---------------------------------------------------------------------------------------------
		//VALIDATE / REJECT / SUBMIT REQUEST IN SELECT MODE-----VALIDATE / REJECT / SUBMIT REQUEST IN S
		//---------------------------------------------------------------------------------------------
		
		var do_send_mod_direct = function(request){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_MOD_DIRECT);
			ref['lock_id'] 	= pr_lock.id;
			ref['reqId']	= request.data.id;
			ref['stat'] 	= request.data.stat;
			ref['cmt'] 		= request.data.cmt;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", request.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));
			
			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		//---------------------------------------------------------------------------------------------
		//DELETE REQUEST DAYOFF-----DELETE REQUEST DAYOFF-----DELETE REQUEST DAYOFF-----DELETE REQUEST 
		//---------------------------------------------------------------------------------------------
		
		this.do_lc_delete 	= function (obj){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_DEL);	
			ref.id          = obj.id;
			
			var lock 		= {};			
			lock.objectType = pr_OBJ_TYPE; 	//integer
			lock.objectKey 	= obj.id; 		//integer
			ref['lock'	]	= JSON.stringify(lock);
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", "DEL"]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_INIT]));	
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []							)); //refresh menu
			
			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
				
		//---------------------------------------------------------------------------------------------
		//LOCK-----LOCK-----LOCK-----LOCK-----LOCK-----LOCK-----LOCK-----LOCK-----LOCK-----LOCK-----LOC 
		//---------------------------------------------------------------------------------------------
			
		this.do_lc_Lock_Begin = function (obj, directSubmit, stat){			
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_NEW);
			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 	//integer
			lock.objectKey 		= obj.id; 		//integer
			ref['req_data'	]	= JSON.stringify(lock); 
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_begin_lock, [obj, directSubmit, stat]));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));
			
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

		function do_begin_lock(sharedJson, obj, directSubmit, stat){
		    do_gl_req_tab_active($(pr_divContent));	    
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock 		= sharedJson[App['const'].RES_DATA];   
				if(!directSubmit){
					App.data.mode 	= pr_ctr_Main.var_lc_MODE_MOD;
					pr_ctr_EntBtn.do_lc_show(obj, App.data.mode);
					self.do_lc_show			(obj, App.data.mode);
				} else {
					pr_ctr_Ent.do_lc_save(obj, pr_ctr_Main.var_lc_MODE_SEL, stat, directSubmit);
				}
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
		
		function do_begin_lock_new(sharedJson, obj){  
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock 		= sharedJson[App['const'].RES_LOCK];   
				App.data.mode 	= pr_ctr_Main.var_lc_MODE_MOD;					
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
		
		
		//---------------------------------------------------------------------------------------------
		//DISPLAY NOTIFICATIONS-----DISPLAY NOTIFICATIONS-----DISPLAY NOTIFICATIONS-----DISPLAY NOTIFIC
		//---------------------------------------------------------------------------------------------
		function do_show_msg(sharedJson, ajaxOk, reqStat){
			var stringBase = "job_off_message_";
			var stringMsg  = stringBase + ajaxOk + "_" + reqStat.toString();
			if(ajaxOk == "OK"){
				if (sharedJson.sv_code == App['const'].SV_CODE_OK ){
					do_gl_show_Notify_Msg_Success 	($.i18n(stringMsg));
				} else{
					do_gl_show_Notify_Msg_Error 	($.i18n(stringBase + "KO") + sharedJson.sv_code);
				}
			}
			else{
				do_gl_show_Notify_Msg_Error("Ajax was not sent successfully.");
			}
		}
		
		//---------------------------------------------------------------------------------------------
		//FILES-----FILES-----FILES-----FILES-----FILES-----FILES-----FILES-----FILES-----FILES-----FIL
		//---------------------------------------------------------------------------------------------
		
		this.do_lc_gen_pdf 	= function(obj){			
			var ref 		= {};		
			ref 			= req_gl_Request_Content_Send("SVSysReportGen", "ServiceSysReport");	
			
			$.extend(true, ref, result.data);
			ref['reportId']	= -1;
			ref['params']	= JSON.stringify({"objId" : obj.id});
			ref['toPrint']	= false;

			var fSucces		= [];			
			fSucces.push(req_gl_funct(null	, do_show_File, []));				

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		var do_show_File = function(sharedJSon){
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {				
				var data 	= sharedJSon.res_data;
				var url 	= App.path.BASE_URL_API + "?" +	data.path01;
				window.open(url, "_blank");
			} 
		}
		
		//-----------------------------------------------------------------------------------------
		function do_refresh_list (sharedJSon) {
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				pr_ctr_List.do_lc_show();
			}
		}
		
		//---------------------------------------------clone object-------------------------------------------
		this.do_lc_duplicate = function (obj){
			var newObj 	= $.extend(true, {}, obj);
			newObj.id	= null;
			App.data.mode 	= pr_ctr_Main.var_lc_MODE_NEW;
			
			self		.do_lc_show(newObj, App.data.mode);
		}
		
	}

	return JobOffEnt;
});