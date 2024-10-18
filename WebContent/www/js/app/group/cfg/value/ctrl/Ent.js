define([
		'jquery',
		'text!group/cfg/value/tmpl/Ent.html',
		'text!group/cfg/value/tmpl/Ent_Header_Table_Row.html',
		
		'group/cfg/value/ctrl/EntHeader',
	    'group/cfg/value/ctrl/EntBtn', 
		'group/cfg/value/ctrl/EntTabValue' 

		],
		function($, 
				Tmpl_Ent,
				Tmpl_Ent_Header_Table_Row,
				CtrlEntHeader, 
	    		CtrlEntBtn,
	    		CtrlEntTabValue
	    ) {


		var CtrlEnt     = function (grpName, header, content, footer) {
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
			var pr_SERVICE_CLASS		= "ServiceCfgValue"; //to change by your need

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
			var pr_ctr_EntBtn 			= null;
			var pr_ctr_EntHeader 		= null;
			var pr_ctr_EntTabValue 		= null;

			//-----------------------------------------------------------------------------------
			var pr_obj				= null;
			var pr_mode					= null;
			var pr_lock					= null;
			
			//--------------------APIs--------------------------------------//
			this.do_lc_init		= function(){
				if (!tmplName) {
				  App.template.names[pr_grpName] = {};
				  tmplName = App.template.names[pr_grpName];
				}
				tmplName.ENT							= "Ent";
				tmplCtrl.do_lc_put_tmpl(tmplName.ENT	, Tmpl_Ent); 
				
				//--------------------------------------------------------------------
				if (!App.controller.CfgGroup.EntBtn		)  
					 App.controller.CfgGroup.EntBtn			= new CtrlEntBtn			(null, "#div_Ent_Btn"	, null, pr_grpName);
				if (!App.controller.CfgGroup.EntHeader	)  
					 App.controller.CfgGroup.EntHeader		= new CtrlEntHeader			(null, "#div_Ent_Header", null, pr_grpName);
				if (!App.controller.CfgGroup.EntTabValue	)  
					 App.controller.CfgGroup.EntTabValue		= new CtrlEntTabValue		(null, "#div_Ent_TabValue", null, pr_grpName);
				
				App.controller.CfgGroup.EntBtn		.do_lc_init();
				App.controller.CfgGroup.EntHeader	.do_lc_init();
				App.controller.CfgGroup.EntTabValue	.do_lc_init();
				//--------------------------------------------------------------------
				pr_ctr_Main 			= App.controller.CfgGroup.Main;
				pr_ctr_List 			= App.controller.CfgGroup.List;
				pr_ctr_Ent				= App.controller.CfgGroup.Ent;
				
				pr_ctr_EntHeader 		= App.controller.CfgGroup.EntHeader;
				pr_ctr_EntBtn			= App.controller.CfgGroup.EntBtn;
				pr_ctr_EntTabValue 		= App.controller.CfgGroup.EntTabValue;
				
			}

			//---------show-----------------------------------------------------------------------------
			var checkData = function (obj){
				try{
					if (obj.inf02){
						obj.inf02 = JSON.parse(obj.inf02);
					}
				}catch(e){
					console.log(e);
				}
			}
			//-----------------------------------------------------------------------------------------
			this.do_lc_show		= function(obj, mode){	
				try{
					pr_obj 			= obj?obj:{};
					pr_mode			= (!obj||!mode)?App['const'].MODE_INIT: mode;
					App.data.mode	= pr_mode;
	
					if (pr_mode == App['const'].MODE_INIT){
						$("#div_Ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT, {mode : pr_mode}));
						pr_ctr_EntBtn		.do_lc_show(pr_obj, App['const'].MODE_INIT);
						return;
					}
	
					checkData(pr_obj);
					
					$(pr_divContent)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT, pr_obj));				
					pr_ctr_EntHeader	.do_lc_show(pr_obj, pr_mode);
					pr_ctr_EntBtn		.do_lc_show(pr_obj, pr_mode);
					pr_ctr_EntTabValue	.do_lc_show(pr_obj, pr_mode);
	
					//---------------------------------------------------------------------------------------
					do_gl_enhance_within($("#div_Ent_Header"),{
						obj: pr_obj
					});
	
					if(mode == App['const'].MODE_NEW) {
						$('.action_item_cfg').removeClass('hide');
					} else if(mode == App['const'].MODE_MOD) {
						do_gl_enable_edit($("#div_Ent_Header"));
						$('.action_item_cfg').removeClass('hide');
					} else {
						do_gl_disable_edit($("#div_Ent_Header"));


					}
					do_bind_event_table_config();
					//-------------------------------------------------------------
					App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
					App.controller.DBoard.DBoardMain.do_lc_prevent_winClosing (pr_mode);
				}catch(e){
					console.log(e);
				}
			}

			//---show after ajax request---------------------------
			var pr_Count	= 0;
			var do_show_Obj = function (sharedJson, mode, oldObj, langOpt){
				if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
					pr_mode				= mode;
					var object 			= sharedJson[App['const'].RES_DATA]; 
					if(object)  {
						object.inf01 		= JSON.parse(object.inf01);
						var arr 			= [];
						for(var i in object.inf01){
							arr.push({key: i, value: object.inf01[i]});						
						}
						object.inf01 = arr;
						pr_Count	 = arr.length;
					}
					

					
					if (!object) object = oldObj; //--use in case of  canceling the MOD
					self.do_lc_show(object, pr_mode);  
						
				} else if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_ERROR){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
					return;
				}		
			}
			
			this.do_lc_show_ById = function(obj, mode, langOpt){
				var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET);			
				ref.id			= obj.id;
				ref["forced"]   = true;

				var fSucces		= [];		
				fSucces.push(req_gl_funct(null, do_show_Obj, [mode, langOpt]));	

				var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

				App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
			}
			var do_bind_event_table_config = function() {
			    $('#btn_add_row').off("click").on("click", function() {
	
			        pr_Count++;
			        

					var newRow = Tmpl_Ent_Header_Table_Row.replace(/{gindex}/g, pr_Count);
			        
			        $('#table_config tbody').append(newRow);
					
					// Bind click event for delete buttons in the newly added rows
					$('.btn_delete_row').off("click").on("click", function() {
					    $(this).closest('tr').remove();
					});
			    });
				
			    $('.btn_delete_row').off("click").on("click", function() {
			        $(this).closest('tr').remove();
			    });
			};




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
			this.do_lc_delete 		= function (obj){
				var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_DEL);

				var lock 			= {};			
				lock.objectType 	= pr_lock_type;  //integer
				lock.objectKey 		= obj.id; 		 //integer
				ref['lock'	]		= JSON.stringify(lock);
				ref["id"]			= obj.id;
				
				var fSucces			= [];
				fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg				, [null, null, App['const'].MODE_DEL])); 
				fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_INIT]));	
				fSucces.push(req_gl_funct(null	, do_refresh_list					, [obj])); //refresh menu

				var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

				App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
			}


			//---------Lock-----------------------------------------------------------------------------
			this.do_lc_save		= function(obj, mode){	//save new object or save with lock		
				//to comeback on tab curent active
				do_gl_req_tab_active($(pr_divContent));
						
				if(!obj.files) obj.files = [];
				var	data = req_gl_data({
					dataZoneDom		: $("#div_config_content"),
//					oldObject 		: {"files": obj.files},
//					removeDeleted	: true				
				});
				console.log(data.data)
				//check data error
				if(data.hasError){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_data'));
					return;
				}
				
//				data.data.files		= obj.files;
//				if (!data.data.files && data.data.logo) data.data.files = [];
//				if (data.data.files && data.data.logo) 	data.data.files.push(data.data.logo);



				//data.data.inf01 = arr => json
				var info = {}
				for (var i in data.data.inf01) {
				    if (!data.data.inf01[i]) continue;

				    var key = data.data.inf01[i].key;
				    var value = data.data.inf01[i].value;

				    if (key.trim() === "" || value.trim() === "") continue;

				    info[key] = value;
				}

				data.data.inf01 = info;

				App.MsgboxController.do_lc_show({
					title	: $.i18n("cfg_save_title"),
					content : $.i18n("cfg_save_cont"),
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
			var do_send_new_exit = function(data) {
				var ref		= {};
				ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
				ref["lock"]	= 0;
				
				var fSucces	= [];
				fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg			, [null, null, App['const'].MODE_NEW])); 
				fSucces.push(req_gl_funct(null	, do_show_Obj					, [App['const'].MODE_SEL]));
				fSucces.push(req_gl_funct(null	, do_refresh_list				, [data.data]));

				var fError 	= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

				data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
				
			}
			
			var do_send_new_continue = function(data) {
				var ref		= {};
				ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
				ref["lock"]	= 1;
				
				var fSucces			= [];
				fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg			, [null, null, App['const'].MODE_NEW])); 
				fSucces.push(req_gl_funct(null	, do_show_Obj					, [App['const'].MODE_MOD]));
				fSucces.push(req_gl_funct(null	, do_refresh_list				, [data.data]));
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
//				fSucces.push(req_gl_funct(null	, do_refresh_list				, []));
				
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
				fSucces.push(req_gl_funct(null	, do_refresh_list				, [data.data]));

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


			//---------private lock-----------------------------------------------------------------------------
			

			var do_refresh_list = function(sharedJSon, obj) {
				if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
					pr_ctr_List.do_lc_show_byTypeStat("#div_List_Stat_All","List_Stat_All", null,[0,1,5,10]);
					pr_ctr_List.do_lc_show_byTypeStat("#div_List_Stat_New","List_Stat_New", null,[0]);
					pr_ctr_List.do_lc_show_byTypeStat("#List_Stat_Act","List_Stat_Act", null,[1]);
				}
			}

//			var do_Enabled_Edit = function(){
//				$(pr_divContent).find("input, select, textarea").removeAttr("disabled");
//			}
		}
		return CtrlEnt;
	});