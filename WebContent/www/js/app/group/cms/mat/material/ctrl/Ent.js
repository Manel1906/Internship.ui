define([
	'jquery',
	'text!group/mat/material/tmpl/Ent.html',

    'group/mat/material/ctrl/EntBtn',
    'group/mat/material/ctrl/EntHeader',
    'group/mat/material/ctrl/EntTabs',
	],
	function($, 
			Tmpl_Ent,

			CtrlEntBtn, 
    		CtrlEntHeader, 
    		
    		CtrlEntTabs		
	) {


	var CtrlEnt     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_lock_type			= -1; //--const based on BO
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");

		//------------------------------------------------------------------------------------
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
		var pr_OBJ_TYPE				= -1;// change to adapt with back office for lock tool

		var pr_SERVICE_CLASS		= "ServiceMatMaterial"; //to change by your need

		var pr_SV_GET				= "SVGet"; 
		var pr_SV_NEW				= "SVNew"; 
		var pr_SV_DEL				= "SVDel"; 

		var pr_SV_MOD				= "SVMod"; 	//if not use lock

		var pr_SV_LCK_REQ			= "SVLckReq"; 
		var pr_SV_LCK_SAV			= "SVLckSav";
		var pr_SV_LCK_END			= "SVLckEnd"; 
		var pr_SV_LCK_DEL			= "SVLckDel"; 
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		var pr_ctr_Right 			= null;

		//-----------------------------------------------------------------------------------
		var pr_TYP_01_APP			= 10;
		var pr_TYP_01_ENV			= 30;
		
		var pr_TYP_01_NODE			= 50;
		
		var pr_TYP_01_DBS			= 60;
		var pr_TYP_01_KUN			= 70;
		
		var pr_TYP_01_SA			= 80;
		var pr_TYP_01_CA			= 100;
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		var pr_lock					= null;
		//-----------------------------------------------------------------------------------
		var pr_typ_new				= null;
		var pr_typ_new_exit			= 1;
		var pr_typ_new_continue		= 2;
		//-----------------------------------------------------------------------------------
		var pr_default_new_obj	= {
				typ01 	: 1, //--porduct
				typ02	: null  //--simple
		}
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			tmplName.ENT							= "Ent";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT	, Tmpl_Ent); 
			//------------------------------------------------------------------------------------------
			if (!App.controller[pr_grpName].EntBtn		)  
				 App.controller[pr_grpName].EntBtn			= new CtrlEntBtn			(null, "#div_Ent_Btn"	, null, pr_grpName);
			if (!App.controller[pr_grpName].EntHeader	)  
				 App.controller[pr_grpName].EntHeader		= new CtrlEntHeader			(null, "#div_Ent_Header", null, pr_grpName);
			if (!App.controller[pr_grpName].EntTabs	)  
				 App.controller[pr_grpName].EntTabs			= new CtrlEntTabs			(null, "#div_Ent_Tabs"	, null, pr_grpName);
			
			App.controller[pr_grpName].EntBtn				.do_lc_init();
			App.controller[pr_grpName].EntHeader			.do_lc_init();
			App.controller[pr_grpName].EntTabs				.do_lc_init();

			
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;

			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntHeader 		= App.controller[pr_grpName].EntHeader;
			pr_ctr_EntBtn 			= App.controller[pr_grpName].EntBtn;
			pr_ctr_EntTabs 			= App.controller[pr_grpName].EntTabs;
			pr_ctr_TabDetail		= App.controller[pr_grpName].EntTabDetail;
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show			= function(obj, mode){	
			pr_obj 			= obj?obj:{};
			pr_mode			= (!obj||!mode)?App['const'].MODE_INIT: mode;
			App.data.mode 	= mode;
			try{	
				if (pr_mode == App['const'].MODE_INIT){
					$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT, {mode : pr_mode}));
					pr_ctr_EntBtn		.do_lc_show(pr_obj, pr_mode);
					return;
				}

				$(pr_divContent)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT, pr_obj));		

				pr_ctr_EntHeader	.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntBtn		.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntTabs		.do_lc_show(pr_obj, pr_mode);

				do_gl_enhance_within($(pr_divContent),{
					obj: pr_obj
				});

				if(mode == App['const'].MODE_NEW) {
					do_gl_enable_edit($(pr_divContent), ".objData", pr_mode);

					$("#btn_add_unit")	.show(); 
					
				} else if(mode == App['const'].MODE_MOD) {
					do_gl_enable_edit($(pr_divContent), ".objData", pr_mode);

					$("#div_mat_unit")	.attr("disabled", "disabled");
					$("#btn_mod_unit")	.show();
					$("#btn_add_unit")	.show(); 

					$("#typ01")			.attr("disabled", "disabled");
					$("#typ02")			.attr("disabled", "disabled");
					$("#table_mat_unit_new").find(".ratio").attr("contenteditable", "false");
					
				} else {
					do_gl_disable_edit($(pr_divContent));
				}

				//-------------------------------------------------------------
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
				App.controller.DBoard.DBoardMain.do_lc_prevent_winClosing (pr_mode);

			}catch(e){
				console.log(e);
//				do_gl_exception_send(App.path.BASE_URL_API_PRIV, "mat.material", "Ent", "do_lc_show", e.toString()) ;
			}
		}

		
		//---show after ajax request---------------------------
		var do_show_Obj = function(sharedJson, mode, localObj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				if(localObj){//le cas de calcel action object
					self.do_lc_show(localObj, mode); 
				}else{					
					var mat = sharedJson[App['const'].RES_DATA];
					
					if(!mat){
						mat = {} ;//le cas de delete object
					}
					var lock = sharedJson.lock;
					if(lock != null)	pr_lock = lock;
					
					if(mode !=App['const'].MODE_INIT){
					}
					self.do_lc_show(mat, mode);
				}
				pr_mode = mode;
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}		
		}

		this.do_lc_show_ById = function(objId, mode){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET);			
			ref.id			= objId;

			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_show_Obj, [mode]));	

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		//---------------------------------------------new object-------------------------------------------
		this.do_lc_new = function() {
			var newObj		 		= $.extend(true, {}, pr_default_new_obj);		
			newObj.lstUnitAvailable = $.extend(true, {}, App.data.LstUnitBases);
			
			self		.do_lc_show(newObj, App['const'].MODE_NEW);
		}

		this.do_lc_duplicate = function (obj){
			var newObj 		= $.extend(true,{},obj);
			newObj.id		= null;

			if(newObj.files){
				for(let i=0; i < newObj.files.length; i++){
					newObj.files[i].duplicate = 1;
				}
			}
			
			self		.do_lc_show(newObj, App['const'].MODE_NEW);
		}
		//---------del obj-----------------------------------------------------------------------------
		this.do_lc_delete 	= function (obj){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_DEL);

			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 	//integer
			lock.objectKey 		= obj.id; 		//integer
			ref['lock'	]		= JSON.stringify(lock);
			ref["id"]			= obj.id;

			var fSucces		= [];
			fSucces.push(req_gl_funct(App	, pr_ctr_Main.do_show_Notify_Msg	, [null, null, pr_ctr_Main.var_lc_MODE_DEL]));
			fSucces.push(req_gl_funct(null	, do_show_Obj					, [App['const'].MODE_INIT]));	

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}

		//---------Lock-----------------------------------------------------------------------------
		this.do_lc_save		= function(obj, mode){	//save with lock	
			if(!obj.files)	obj.files = [];
			
			var	data	 		= req_gl_data({
				dataZoneDom		: $("#div_Ent"),
				oldObject 		: {"files": obj.files},
				removeDeleted	: true				
			});
			
			if(data.hasError == true){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));
				return false;
			}
			
			
			//reform category
			data = do_lc_reform_sending_data(data);
			
			//--remove some data before sending to server
			data.data.orderHistories = null;
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
		
		//--------------------------------------------------------------------------------------------------------
		function do_lc_reform_sending_data(originalData) {
			var dataResult 	= originalData;
			var data		= originalData.data;
			if(data.grpCat){
				data.cats = [];
				for(var i in data.grpCat){
					if(data.grpCat[i]==1){
						data.cats.push({"catId" : parseInt(i,10)})
					}
				}
			}
			
			return dataResult;
		}
		
		//--------------------------------------------Lock functions-------------------------------------------------------
		//-------------------------------------------New-------------------------------------------------------------
		var do_send_new_exit = function(data) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["lock"]	= 0;
			
			var fSucces	= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg			, [null, null, App['const'].MODE_NEW])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj					, [App['const'].MODE_SEL]));

			var fError 	= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
			
		}
		
		var do_send_new_continue = function(data) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["lock"]	= 1;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg			, [null, null, App['const'].MODE_NEW])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj				, [App['const'].MODE_MOD]));
			fSucces.push(req_gl_funct(null	, do_lock_begin					, []));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		

		var do_send_mod_continue = function(data) {
			var ref 			= {};
			ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_SAV);
			ref['lock_id'] 		= pr_lock.id;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg			, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj					, [App['const'].MODE_MOD]));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		var do_send_mod_exit = function(data) {
			var ref 			= {};
			ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_END);
			ref['lock_id'] 		= pr_lock.id;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg			, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj					, [App['const'].MODE_SEL]));

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		//-------------------------------------------------------------------------------------------------------------	
		var do_lock_begin = function(sharedJson, obj){
			pr_lock 	= null;
			
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock 		= sharedJson[App['const'].RES_DATA];   
				pr_mode 		= App['const'].MODE_MOD;	
				
				do_gl_req_tab_active($(pr_divContent));
				
				if (obj){
					self.do_lc_show			(obj, pr_mode);
				}
			
			} else if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_NO) {
				var uName 	= sharedJson[App['const'].RES_DATA].inf01;
        		do_gl_show_Notify_Msg_Error ($.i18n('lock_err_begin') + uName);
        		//notify something if the lock is taken by other person
			}else{
        		do_gl_show_Notify_Msg_Error ($.i18n('lock_err_inconnu'));
        	}		
		}
		
		var do_lock_del = function (sharedJson, obj){
			if(sharedJson[App['const'].SV_CODE] != App['const'].SV_CODE_API_YES) {					
				//notify something
				do_gl_show_Notify_Msg_Error ($.i18n('lock_err_inconnu') );
			}
			
			pr_lock = null;
			if (obj){
				self.do_lc_show			(obj, App['const'].MODE_SEL);	
			}
		}
		
		//-------------------------------------------------------------------------------------------------------------		
		this.can_lc_have_lock = function (){
			if (this.pr_lock!=null)
				App.MsgboxController.do_lc_show({
					title	: $.i18n('lock_err_title') ,
					content	: $.i18n('lock_err_msg'),
					width	: window.innerWidth<1024?"95%":"40%",
				});	
			return this.pr_lock!=null;
		}
		
		this.do_lc_Lock_Begin = function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_REQ);		
			ref.id				= obj.id; 

			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_lock_begin, [obj]));

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}


		this.do_lc_Lock_Cancel = function (obj){
			if (!pr_lock){
				pr_mode = App['const'].MODE_INIT;
				do_lc_show ({}, pr_mode);
				return;
			}
			
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_DEL);		

			ref['lock_id'	]	= pr_lock.id;
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_lock_del, []								));	
			fSucces.push(req_gl_funct(null, do_show_Obj, [App['const'].MODE_SEL, obj]	));	

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}	
		//-----------------------------------------------------------------------------------------------
		
		this.do_lc_gen_pdf 	= function(obj){
			var result = req_gl_data({
				dataZoneDom : $("#div_export_options")
			});
			
			if(result.hasError)
				return;
			
			var ref 		= {};		
			ref 			= req_gl_Request_Content_Send("ServiceSysReport", "SVSysReportGen");	
			
			$.extend(true, ref, result.data);
			ref['reportId']	= 23;
			ref['params']	= JSON.stringify({"matId" : obj.id.toString()});
			ref['toPrint']	= false;

			var fSucces		= [];
			fSucces.push(req_gl_funct(null, do_show_File, []));				

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		var do_show_File = function(sharedJSon){
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				do_gl_show_Notify_Msg_Success($.i18n('common_gen_success_msg'));
				var data 	= sharedJSon.res_data;
				var url 	= App.path.BASE_URL_API + "?" +	data.path01;
				window.open(url, "_blank");
			} else {
				do_gl_show_Notify_Msg_Error($.i18n('common_gen_error_msg'));
			}
		}
		
		var do_check_intern_code = function(code, codeTyp, callback, data){
			var ref				= {};
			ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVBarcodeChk");
			ref.bcode 			= code;
			ref.bcodeTyp 		= 2;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_check_intern_code_response, [callback, data]));
		
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		var do_check_intern_code_response = function(sharedJSon, callback, mat, typ){
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES){
				callback (data);
			}else{
				$("#inp_mat_inf01").addClass("inp-error");
				$("#inp_mat_inf03").addClass("inp-error");
				$("#inp_mat_inf04").addClass("inp-error");
				do_gl_show_Notify_Msg_Error($.i18n('mat_material_header_code02_msg_check_err'));
			}
		}
		
		//--------------------------------------------Extraction file--------------------------------------------------------
		this.do_send_extraction_file	= function(obj, mode, objExtract){		
			var ref		= {};
			ref[svClass		] 	= "ServiceMatMaterialSimple"; 
			ref[svName		]	= "SVMatFileExtract";
			ref[userId]			= App.data.user.id;
			ref[sessId]			= App.data.session_id;
			ref["fileId"]		= objExtract.files[0].id;
			
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_after_extraction_file, [obj, mode, objExtract]));
		
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		function do_after_extraction_file(sharedJson, obj, mode, objExtract){		
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				pr_ctr_Main.do_lc_show_lst_material();
        	} else {
        		do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_save'));
        	}		
		}

		//-----------------------------------------------------------------------------------------
		function do_show_success_msg(sharedJson, msg){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) do_gl_show_Notify_Msg_Success (msg);
		}
	}

	return CtrlEnt;
});