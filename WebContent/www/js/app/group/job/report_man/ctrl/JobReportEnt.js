define(['jquery'], function($) {

	var JobReportEnt     = function (grpName, header, content, footer) {
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
		var pr_OBJ_TYPE				= 2002;

		var pr_SERVICE_CLASS		= "ServiceJobReport"; //to change by your need

		var pr_SV_GET				= "SVGet"; 
		var pr_SV_NEW				= "SVNew"; 
		var pr_SV_DEL				= "SVDel"; 

		var pr_SV_MOD				= "SVMod"; 	//if not use lock

		var pr_SV_LCK_NEW			= "SVLckReq"; 
		var pr_SV_LCK_END			= "SVLckEnd"; 
		var pr_SV_LCK_DEL			= "SVLckDel";

		var pr_SV_WD				= "SVWorkingDate";
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		var pr_ctr_DateTime			= null;
		var pr_ctr_Rights			= null;
		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;
		var pr_lock					= null;

		var lc_rp_stat_draft		= 0;
		var lc_rp_stat_pending		= 1;
		var lc_rp_stat_validated	= 2;
		var lc_rp_stat_denied		= 3;
		var username				= App.data.user.per;
		if(!username.name03){
			username.name03 = "";
		}
		var lc_username 			= username.name01 + " " + username.name02 + " " + username.name03;

		var currentRpCreated		= 1;

		//	RIGHT ACTION----------------------------------------
		var RIGHT_U_G		= 1;
		var RIGHT_U_N		= 2;
		var RIGHT_U_M		= 3;
		var RIGHT_U_D		= 4;

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobReportMan.Main;
			pr_ctr_List 			= App.controller.JobReportMan.List;

			pr_ctr_Ent				= App.controller.JobReportMan.Ent;
			pr_ctr_EntHeader 		= App.controller.JobReportMan.EntHeader;
			pr_ctr_EntBtn 			= App.controller.JobReportMan.EntBtn;
			pr_ctr_EntTabs 			= App.controller.JobReportMan.EntTabs;
			pr_ctr_DateTime			= App.controller.JobReportMan.DateTime;
			pr_ctr_Rights			= App.controller.JobReportMan.Rights;
		}

		//---------------------------------------------------------------------------------------------
		//SHOW REPORT-----SHOW REPORT-----SHOW REPORT-----SHOW REPORT-----SHOW REPORT-----SHOW REPORT--
		//---------------------------------------------------------------------------------------------
		this.do_lc_show		= function(obj, mode){			
			pr_object 	= obj;
			pr_mode		= mode;		

			if (!obj || pr_mode == pr_ctr_Main.var_lc_MODE_INIT){
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_ENT, {mode : pr_ctr_Main.var_lc_MODE_INIT}));
				obj = {};
				obj.uId03 = App.data.user.id;
				pr_ctr_EntBtn	.do_lc_show(obj, pr_ctr_Main.var_lc_MODE_INIT);
				return;
			}

			if (obj){
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_ENT, obj));				
				pr_ctr_EntBtn		.do_lc_show(obj, mode);
				pr_ctr_EntHeader	.do_lc_show(obj, mode);
				pr_ctr_EntTabs		.do_lc_show(obj, mode);
			}

			pr_ctr_Main.do_lc_binding_pages($(pr_divContent), {
				obj: obj
			});

			if(mode == pr_ctr_Main.var_lc_MODE_NEW || mode == pr_ctr_Main.var_lc_MODE_MOD || mode == pr_ctr_Main.var_lc_MODE_SEL) {
				do_gl_enable_edit($(pr_divContent), ".canEnabled", mode);
			} else {
				do_gl_disable_edit($(pr_divContent), ".canEnabled", mode);
			}

			var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_U_M);
			if(obj.stat == lc_rp_stat_pending && rightCode != -1){
				$(".rp_validated_zone").show();
				$("#inp_cmt").prop("disabled", false);
			}

			App.controller.UI.Main.do_lc_bind_event_resize();

			if(obj.stat == lc_rp_stat_pending && obj.uId03 != App.data.user.id ){
				$("#inp_cmt").attr('disabled', 'disabled');
			}
		}

		function do_show_Obj(sharedJson, mode, localObj){
			var code = sharedJson[App['const'].SV_CODE];
			if(code == App['const'].SV_CODE_API_YES) {
				if (localObj){
					self.do_lc_show(localObj, mode); 
				}else{					
					var object = sharedJson[App['const'].RES_DATA];

					//---reform resume to list for datatable
					do_lc_handle_rp_resume_backToList (object);
					self.do_lc_show(object, mode);  
				}			     		
			} else {
				do_gl_show_Notify_Msg_Error("JobReport: Ent Get Obj > SV CODE :" + code);
			}
		}

		/*this.do_lc_show_ById = function(obj, mode){
			for(var i = 0; i < App.data.lstUser.length; i++){
				var user = App.data.lstUser[i];
				if(user.id == obj.uId03){
					App.data.selectedUser = user;
				}
			}
			pr_ctr_DateTime.req_lc_DayOff(obj.code01, obj.uId03);
			self.do_lc_show(obj, mode);
		}*/


		this.do_lc_show_ById = function(obj, mode){
			//--------------------------------------------------------
			for(var i = 0; i < App.data.lstUser.length; i++){
				var user = App.data.lstUser[i];
				if(user.id == obj.uId03){
					App.data.selectedUser = user;
				}
			}
			pr_ctr_DateTime.req_lc_DayOff(obj.code01, obj.uId03);
			//--------------------------------------------------------

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

		//---------------------------------------------------------------------------------------------
		//DISPLAY USER SUMMARY-----DISPLAY USER SUMMARY-----DISPLAY USER SUMMARY-----DISPLAY USER SUMMA 
		//---------------------------------------------------------------------------------------------
		this.do_lc_show_user_summary = function(objUser){	
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_ENT,  {mode : pr_ctr_Main.var_lc_MODE_SEL}));
			pr_ctr_EntBtn		.do_lc_show(objUser, pr_ctr_Main.var_lc_MODE_INIT);
			pr_ctr_EntHeader	.do_lc_show_user_summary(objUser);
		}

		//---------------------------------------------------------------------------------------------
		//USER WORKING DATE-----USER WORKING DATE-----USER WORKING DATE-----USER WORKING DATE-----USER 
		//---------------------------------------------------------------------------------------------
		this.do_lc_update_user_wd = function(objUser, createRp){
			var wd 				= req_gl_data({
				dataZoneDom		: $("#div_wd_user")
			});

			if(wd.hasError) {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));				
			} else {
				var cf = wd.data;
				var stringWd = cf.sun + cf.mon + cf.tue + cf.wed + cf.thu + cf.fri + cf.sat;

				var whSun = cf.sun == "A" ? "00000000" : cf.sunS + cf.sunE;
				var whMon = cf.mon == "A" ? "00000000" : cf.monS + cf.monE;
				var whTue = cf.tue == "A" ? "00000000" : cf.tueS + cf.tueE;
				var whWed = cf.wed == "A" ? "00000000" : cf.wedS + cf.wedE;
				var whThu = cf.thu == "A" ? "00000000" : cf.thuS + cf.thuE;
				var whFri = cf.fri == "A" ? "00000000" : cf.friS + cf.friE;
				var whSat = cf.sat == "A" ? "00000000" : cf.satS + cf.satE;

				var stringWh = whSun + whMon + whTue + whWed + whThu + whFri + whSat;

				stringWh = stringWh.replace(/:/g, "");
				do_send_workingDate(stringWd, stringWh, objUser, createRp);
			}
		}

		function do_send_workingDate(stringWd, stringWh, objUser, createRp){
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_WD);
			ref["uId02"]= objUser.id;
			ref["wD"]	= stringWd;
			ref["wH"]	= stringWh;

			var fSucces		= [];
			fSucces.push	( req_gl_funct(this, do_update_workingDate, [true, createRp] ));
			var fError 		= req_gl_funct(this, do_update_workingDate, [false]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_update_workingDate = function(sharedJson, ajaxStat, createRp){
			if(ajaxStat){
				var code = sharedJson[App['const'].SV_CODE];
				if(code == App['const'].SV_CODE_API_YES) {
					var u = sharedJson.res_data;
					if(!u.name03) u.name03 = "";
					App.data.selectedUser = u;
					for(var i = 0; i < App.data.lstUser.length; i++){
						if(App.data.lstUser[i].id == u.id){
							App.data.lstUser[i]   = u;
							break;
						}
					}
					if(App.data.monthDataInfo){
						for(var i = 0; i < App.data.monthDataInfo.length; i++){
							var record = App.data.monthDataInfo[i];
							if(App.data.currentReportCode == record.codeReport && u.id == record.uId02){
								App.data.monthDataInfo.splice(i, 1);
								break;
							}
						}
					}
					do_gl_show_Notify_Msg_Success($.i18n("job_report_success_update_wd") + u.name01 + " " 
							+ u.name02 + " " + u.name03);

					if(createRp){
						self.do_lc_new();
					} else {
						pr_ctr_EntHeader.do_bind_event_user_summary();
					}
				} else {
					do_gl_show_Notify_Msg_Error($.i18n("Error update_working_date: SV Code:" + code));
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}

		//---------------------------------------------------------------------------------------------
		//ADD NEW REPORT-----ADD NEW REPORT-----ADD NEW REPORT-----ADD NEW REPORT-----ADD NEW REPORT---
		//---------------------------------------------------------------------------------------------
		this.do_lc_new = function() {
			var u = App.data.selectedUser;
			//if(!u.name03) u.name03 = "";

			pr_ctr_DateTime.req_lc_DayOff(App.data.currentReportCode, u.id);

			var newObj		 = {};
			newObj.uId01     = App.data.user.id;
			newObj.uId01_name=lc_username;
			newObj.uId03     = u.id;
			newObj.uId03_name= u.name01 + " " + u.name02 + " " + u.name03 ;
			newObj.code01	 = App.data.currentReportCode;
			newObj.dt01		 = new Date();
			newObj.stat      = lc_rp_stat_draft;
			newObj.hldrate   = App.data.hldRate;
			newObj.val01	 = App.data.workingDay;
			newObj.val02	 = 0;
			newObj.val03	 = 0;
			newObj.val04     = App.data.hldRate;

			self		.do_lc_show(newObj, pr_ctr_Main.var_lc_MODE_NEW);
		}

		//---------------------------------------------------------------------------------------------
		//SAVE REPORT-----SAVE REPORT-----SAVE REPORT-----SAVE REPORT-----SAVE REPORT-----SAVE REPORT--
		//---------------------------------------------------------------------------------------------
		this.do_lc_Save_Entity = function (pr_divContent, ent, mode){
			if (!pr_divContent) pr_divContent	= "#div_main_content";
			if (!mode)			mode			= pr_ctr_Main.var_lc_MODE_MOD;
//			if(mode == pr_ctr_Main.var_lc_MODE_NEW)	divContent	= pr_divContent;
			if (!ent.files) ent.files = [];		
			let	data	= req_gl_data({
				dataZoneDom		: $(pr_divContent),
			});

			if(data.hasError)	return false;

			if(data.data.lstRpResume) do_lc_handle_rp_resume(data);
			else if(ent.lstRpResume) do_lc_handle_rp_resume(ent);
			data.data 				= $.extend(false, ent, data.data, {files: ent.files});
			
			if(typeof data.data['undefined']) delete data.data['undefined']

			do_send_data (data, mode);
		}
		var do_send_data= function(data, mode){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, mode==pr_ctr_Main.var_lc_MODE_NEW? pr_SV_NEW : pr_SV_MOD);
			ref["obj"]			= data.data

			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_show_msg, ["OK",data.data.stat])); 
			fSucces.push(req_gl_funct(null	, do_lc_afterSave_EntContent	, []));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		var do_lc_afterSave_EntContent = function(sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let data 		= sharedJson[App['const'].RES_DATA];
				App.data.mode 	= pr_ctr_Main.var_lc_MODE_SEL;	
				do_lc_handle_rp_resume_backToList(data);
				self.do_lc_show(data,pr_ctr_Main.var_lc_MODE_SEL);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}


		this.do_lc_save		= function(obj, mode, rpStat, directSave){	//save new object or save with lock	
			// do_gl_req_tab_active($(pr_divContent));

			if (!obj.files) obj.files = [];
			var cra 				= req_gl_data({
				dataZoneDom		: $(pr_divContent),
				oldObject 		: {"files": obj.files},
				removeDeleted	: true				
			});
			cra.data.files = obj.files;

			//check data error
			if(cra.hasError) {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));				
			} else {

				var nbRow = cra.data.lstRp.length;
				//Remove unnecessary data of cra
				if(typeof cra.data['undefined'] !== 'undefined') delete cra.data['undefined']
				if(nbRow > 0){
					for(var i = 0; i < nbRow; i++){
						cra.data.lstRp[i].row_action = null;
						cra.data.lstRp[i].catId01_Select = null;
					}
				}

				if (directSave){
					cra.data.stat = rpStat;
					var msgTitle 	= "";
					var msgCont 	= "";
					var msgBtn 		= "";
					switch(rpStat){
					case lc_rp_stat_draft: 
						msgTitle 	= "job_rp_msgbox_confirm_deny_title"; 
						msgCont 	= "job_rp_msgbox_confirm_deny_message";
						msgBtn		= "job_rp_msgbox_confirm_deny_btn1";
						break;
					case lc_rp_stat_pending :
						msgTitle 	= "job_rp_msgbox_confirm_submit_title"; 
						msgCont 	= "job_rp_msgbox_confirm_submit_message";
						msgBtn		= "job_rp_msgbox_confirm_submit_btn1";
						break;
					}
					
					if (rpStat == lc_rp_stat_pending)  {
						App.MsgboxController.do_lc_show({
							title	: $.i18n(msgTitle),
							content : $.i18n(msgCont),
							buttons	: {
								OK: {
									lab		: 	$.i18n(msgBtn),
									funct	: 	function(){
										do_send_mod_direct(cra);
									}						
								},
								CANCEL: {
									lab		:  	$.i18n("job_rp_msgbox_confirm_deny_btn2")
								}
							}
						});
						return;
					}
					else if (rpStat == lc_rp_stat_draft)  {
						App.MsgboxController.do_lc_show({
							title	: $.i18n(msgTitle),
							content : tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_POPUP_DENY_CONTENT, obj),
							buttons	: {
								OK: {
									lab		: 	$.i18n(msgBtn),
									funct	: 	function(){
										var message 	= $("#messageClient").val();
										cra.data.message = message;
										do_send_mod_direct(cra);
									}						
								},
								CANCEL: {
									lab		:  	$.i18n("job_rp_msgbox_confirm_deny_btn2")
								}
							}
						});
						return;
					}
					if(rpStat == lc_rp_stat_validated){
						do_send_mod_direct(cra);
						return;
					}
				} else {
					if(rpStat == lc_rp_stat_draft){
						do_lc_handle_rp_resume(cra);
						
						App.MsgboxController.do_lc_show({
							title	: $.i18n("msgbox_confirm_title"),
							content : $.i18n("common_msg_mod_confirm"),
							buttons	: {
								SAVE_EXIT: {
									lab		: 	$.i18n("common_btn_save_exit"),
									funct	: 	function(){
										if(mode==pr_ctr_Main.var_lc_MODE_MOD){
											do_send_mod_exit(cra)
										} else if(mode==pr_ctr_Main.var_lc_MODE_NEW){
											do_send_new_exit(cra);
										} else if(mode==pr_ctr_Main.var_lc_MODE_SEL){
											do_send_mod_exit_without_lock(cra);
										}
									}							
								},
								SAVE_CONTINUE: {
									lab		:  	$.i18n("common_btn_save_continue"),
									funct	: 	function(){
										if(mode==pr_ctr_Main.var_lc_MODE_MOD){
											do_send_mod_continue(cra)
										} else if(mode==pr_ctr_Main.var_lc_MODE_NEW){
											do_send_new_continue(cra);	
										}
										else if(mode==pr_ctr_Main.var_lc_MODE_SEL){
											do_send_mod_continue(cra);	
										}
									}
								}
							}
						});
					}

				}

			}	
		}

		//---------------------------------------------------------------------------------------------
		//	HANDLE REPORT RESUME
		//---------------------------------------------------------------------------------------------
		var do_lc_handle_rp_resume = function(cra) {
			let lstRpResume 	= cra.data?cra.data.lstRpResume:cra.lstRpResume;
			if (!lstRpResume) return;

			let objRpResume 	= {};
			let newLstResume 	= [];
			// filter
			lstRpResume.forEach((e) => {
				let attr 	= "t";
				let i 		= e.day;
				if (i < 10) attr = attr + "0" + i;
				else attr = attr + i;
				objRpResume[attr] = e.cmt;
			})

			newLstResume.push(objRpResume);
			if(cra.data) cra.data.lstRpResume = newLstResume;
			else cra.lstRpResume = newLstResume
		}

		var do_lc_handle_rp_resume_backToList = function(cra) {
			let lstRpResume 	= cra.lstRpResume;
			if (!lstRpResume) return; 
			if (lstRpResume.length ==0) return;

			let objRpResume 	= lstRpResume[0];
			let newLstResume 	= [];
			// init obj
			for (let i = 1; i <= 31; i++) {
				let attr = "t";
				if (i < 10) attr = attr + "0" + i;
				else attr = attr + i;

				if (objRpResume[attr])
					newLstResume.push({"day":i, "cmt": objRpResume[attr]});
			}

			cra.lstRpResume = newLstResume;
		}
		//---------------------------------------------------------------------------------------------
		//VALIDATE / REJECT / SUBMIT REPORT IN SELECT MODE-----VALIDATE / REJECT / SUBMIT REPORT IN SEL
		//---------------------------------------------------------------------------------------------

		var do_send_mod_direct = function(cra){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, 'SVModDirect');
			ref['lock_id'] 	= pr_lock.id;
			ref['reportId'] = cra.data.id;
			ref['stat'] 	= cra.data.stat;
			ref['cmt'] 		= cra.data.cmt;
			if(cra.data.message) ref['message'] 		= cra.data.message;
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", cra.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_INIT]));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));

			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		//---------------------------------------------------------------------------------------------
		//SEND NEW-----SEND NEW-----SEND NEW-----SEND NEW-----SEND NEW-----SEND NEW-----SEND NEW-----SE
		//---------------------------------------------------------------------------------------------

		var do_send_new_continue = function(cra) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["lock"]	= 1;
			ref["obj"]	= JSON.stringify(cra.data);

			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", cra.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_MOD]));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));
			fSucces.push(req_gl_funct(null	, do_begin_lock_new		, []));
			fSucces.push(req_gl_funct(null	, do_mark_cra_created	, [cra.data.uId02]));

			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		var do_send_new_exit = function(cra) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["lock"]	= 2;
			ref["obj"]	= JSON.stringify(cra.data);

			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", cra.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));
			fSucces.push(req_gl_funct(null	, do_mark_cra_created	, [cra.data.uId02]));

			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);		
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		var do_mark_cra_created = function(sharedJson, uId02){
			App.data.selectedUser.hasRpCreated = currentRpCreated;
			for(var i = 0; i < App.data.lstUser.length; i++){
				if(App.data.lstUser[i].id == uId02){
					App.data.lstUser[i]   = App.data.selectedUser;
					break;
				}
			}
		}

		//---------------------------------------------------------------------------------------------
		//SEND MOD-----SEND MOD-----SEND MOD-----SEND MOD-----SEND MOD-----SEND MOD-----SEND MOD-----SE
		//---------------------------------------------------------------------------------------------

		var do_send_mod_continue = function(cra) {
			var ref 	= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_MOD);
			ref["obj"]	= JSON.stringify(cra.data);

			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", cra.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_MOD]));

			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		var do_send_mod_exit = function(cra) {
			var ref 			= {};
			ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_END);
			ref['lock_id'] 		= pr_lock.id;
			ref["obj"]	= JSON.stringify(cra.data);

			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", cra.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));

			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		var do_send_mod_exit_without_lock = function(cra) {
			var ref 			= {};
			ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_MOD);
//			ref['lock_id'] 		= pr_lock.id;
			ref["obj"]	= JSON.stringify(cra.data);

			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", cra.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));

			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}		
		//---------------------------------------------------------------------------------------------
		//LOCK-----LOCK-----LOCK-----LOCK-----LOCK-----LOCK-----LOCK-----LOCK-----LOCK-----LOCK-----LOC 
		//---------------------------------------------------------------------------------------------

		this.do_lc_Lock_Begin = function (obj, directSave, stat){			
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_NEW);
			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 	//integer
			lock.objectKey 		= obj.id; 		//integer
			if(obj.message)		lock.message = obj.message
			ref['req_data'	]	= JSON.stringify(lock); 

			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_begin_lock, [obj, directSave, stat]));

			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}	

		this.do_lc_Lock_Cancel = function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_DEL);		
			ref['lock_id'	]	= pr_lock.id; 

			var fSucces			= [];
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_del_lock		, [obj]									));	
			fSucces.push(req_gl_funct(null, do_show_Obj		, [pr_ctr_Main.var_lc_MODE_SEL, obj]	));	

			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		function do_begin_lock(sharedJson, obj, directSave, stat){
			//to comeback on tab curent active
			// do_gl_req_tab_active($(pr_divContent));

			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock = sharedJson[App['const'].RES_DATA];
				if(directSave == false){
					App.data.mode 	= pr_ctr_Main.var_lc_MODE_MOD;
					pr_ctr_EntBtn.do_lc_show(obj, App.data.mode);
					self.do_lc_show			(obj, App.data.mode);
				} else {
					pr_ctr_Ent.do_lc_save(obj, pr_ctr_Main.var_lc_MODE_SEL, stat, directSave);
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
		//DELETE REPORT-----DELETE REPORT-----DELETE REPORT-----DELETE REPORT-----DELETE REPORT-----DEL
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

			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_show_File = function(sharedJSon){
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {				
				var data 	= sharedJSon.res_data;
				var url 	= App.path.BASE_URL_API + "?" +	data.path01;
				window.open(url, "_blank");
			} 
		}

		//---------------------------------------------------------------------------------------------
		//OTHER FUNCTIONS-----OTHER FUNCTIONS-----OTHER FUNCTIONS-----OTHER FUNCTIONS-----OTHER FUNCTIO
		//---------------------------------------------------------------------------------------------
		this.do_lc_duplicate = function (obj){
			var newObj 	= $.extend(true,{},obj);
			newObj.id	= null;
		}

		function do_refresh_list (sharedJSon) {
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				pr_ctr_List.do_lc_show();
			}
		}

		//---------------------------------------------------------------------------------------------
		//DISPLAY NOTIFICATIONS-----DISPLAY NOTIFICATIONS-----DISPLAY NOTIFICATIONS-----DISPLAY NOTIFIC
		//---------------------------------------------------------------------------------------------
		function do_show_msg(sharedJson, ajaxOk, craStat){
			var stringBase = "job_rp_message_";
			var stringMsg  = stringBase + ajaxOk + "_" + craStat.toString();
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

		this.do_lc_duplicate = function (obj){
			var newObj 	= $.extend(true, {}, obj);
			newObj.id	= null;
			App.data.mode 	= pr_ctr_Main.var_lc_MODE_NEW;
			self		.do_lc_show(newObj, App.data.mode);
		}


		this.do_lc_show_popup_list_note_by_user = function(obj){
			App.MsgboxController.do_lc_show({
				title		: $.i18n("job_report_popup_list_notes_title"),
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_POPUP_NOTE, {}),	
				autoclose	: false,
				buttons		: {
					OK: {
						lab		: $.i18n("common_btn_ok"),
						funct	: App.MsgboxController.do_lc_close,
						autoclose	: false,
						classBtn	: "btn-primary"
					}
				}
			});	
			
			if(!App.data.reportCodesLast12Month)	pr_ctr_DateTime.req_lc_ReportCodeLast12Month();
			do_gl_autocomplete_new({
				el: $("#inp_code_month"),
				source: App.data.reportCodesLast12Month,
				selectCallback: function(item) {
					$("#inp_code_month"	).val(item.date);	
					do_lc_get_list_notes_by_users();
					return true;
				},
				renderAttrLst: ["date"],
				minLength: 0,
				placeholder	: $.i18n("job_report_label_code"),
				appendTo    : $(".msg-box"),
				required: true
			});
			
			let date = new Date();
			let currentDay   = date.getDate();
			let currentMonth = date.getMonth() + 1;
			if (currentMonth < 10)currentMonth  = '0' + currentMonth;
			let currentYear  = date.getFullYear();
			
			let codeReport = currentYear + "-" + currentMonth;
			
			$("#inp_code_month").val(codeReport);
			$("#select_day").find("option[value='"+ currentDay +"']").attr("selected", "selected");
			
			do_lc_get_list_notes_by_users();
		}
		
		const do_lc_get_list_notes_by_users = () => {
			var info 			= req_gl_data({
				dataZoneDom		: $("#div_popup_notes"),
				removeDeleted	: true				
			});

			if(info.hasError) {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));	
				return
			}
			
			do_lc_get_data(info.data);
		}
		
		const do_lc_get_data = (obj) => {
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceJobReport", "SVLstByMonth", {"codeReport" : obj.code01, "day" : obj.day});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_response, [obj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_show_response = (sharedJson, obj) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson.res_data;
				do_lc_show_notes(data, obj.day);
				do_lc_bind_event_popup(data, obj.day);
			}
		}
		
		const do_lc_show_notes = (data, day) => {
			if(day.length < 2) day = "t0" + day;
			else day = "t" + day;
			
			for(let i = 0; i < data.length; i++){
				if(data[i].lstRpResume && data[i].lstRpResume[0][day]) data[i].textResume = data[i].lstRpResume[0][day];
				else{
					if(data[i].textResume) delete data[i].textResume;
				}
				
				if(i%2 == 1) data[i].colorB = "background-grid";
			}
			
			$("#div_notes_result").html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_POPUP_NOTE_RESULT, {"data" : data}));
		}
		
		const do_lc_bind_event_popup = (data) => {
			$("#select_day").on("change", function(){
				let day = $(this).val();
				do_lc_show_notes(data, day);
			});
		}

		//---------------------------------------------------------------------------------------------
		//USER WORKING DATE-----USER WORKING DATE-----USER WORKING DATE-----USER WORKING DATE-----USER 
		//---------------------------------------------------------------------------------------------
		this.do_lc_active_userCfg = function (createRp){
			var wdCfg = do_get_wdCfg();
			
			App.MsgboxController.do_lc_show({
				title	: $.i18n("job_rp_show_config_wd_title") + wdCfg.name01 + " " + wdCfg.name02 + " " + wdCfg.name03,
				content : tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_CONFIG_WORKING_DAY, wdCfg),
				buttons	: {
					CANCEL: {
						lab		:  	$.i18n("job_rp_config_btn01")
					},
					SAVE_EXIT: {
						lab		: 	$.i18n("job_rp_config_btn02"),
						funct	: 	function(){
							self.do_lc_update_user_wd(wdCfg, createRp);
						}							
					}
				}
			});
			
			do_gl_enable_edit($("#div_wd_user"));	
			
			
		}
		var do_get_wdCfg = function(){
			var infoWd = App.data.selectedUser.wdCfg;
			var wd = {};
			if(infoWd){
				wd		= JSON.parse(infoWd);
			}else{
				wd.sun = 'A';
				wd.mon = 'F';
				wd.tue = 'F';
				wd.wed = 'F';
				wd.thu = 'F';
				wd.fri = 'F';
				wd.sat = 'A';
				wd.sunS = "00:00";
				wd.sunE = "23:59";
				wd.monS = "08:00";
				wd.monE = "17:00";
				wd.tueS = "08:00";
				wd.tueE = "17:00";
				wd.wedS = "08:00";
				wd.wedE = "17:00";
				wd.thuS = "08:00";
				wd.thuE = "17:00";
				wd.friS = "08:00";
				wd.friE = "17:00";
				wd.satS = "00:00";
				wd.satE = "23:59";
				
			}
			wd.name01 = App.data.selectedUser.name01;
			wd.name02 = App.data.selectedUser.name02;
			wd.name03 = App.data.selectedUser.name03;
			
			return wd;
		}
		
		this.do_lc_update_user_wd = function(wdCfg, createRp){
			var wd 				= req_gl_data({
				dataZoneDom		: $("#div_wd_user")
			});
		
			if(wd.hasError) {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));				
			} else {
				do_send_workingDate( wd.data, App.data.selectedUser, createRp);
			}
		}
		
		var do_send_workingDate = function( wdCfg, objUser, createRp){
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_WD);
			
			ref["uId"]	= objUser.id;
			ref["inf10"]= JSON.stringify(wdCfg);
			
			var fSucces		= [];
			fSucces.push	( req_gl_funct(this, do_send_workingDate_callback, [wdCfg, objUser, createRp] ));
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_send_workingDate_callback = function (sharedJson, wdCfg, objUser, createRp){
			var code = sharedJson[App['const'].SV_CODE];
			if(code == App['const'].SV_CODE_API_YES) {
				var u = objUser;
				do_gl_show_Notify_Msg_Success($.i18n("job_report_success_update_wd") + u.name01 + " " + u.name02 + " " + u.name03);
				
				objUser.wdCfg = JSON.stringify(wdCfg);
				/*
				if(App.data.monthDataInfo){
					for(var i = 0; i < App.data.monthDataInfo.length; i++){
						var record = App.data.monthDataInfo[i];
						if(App.data.currentReportCode == record.codeReport && u.id == record.uId03){
							App.data.monthDataInfo.splice(i, 1);
							break;
						}
					}
				}*/
				
				if(createRp){
					self.do_lc_new();
				} 
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("Error update_working_date: SV Code:" + code));
			}	
		}
	}

	return JobReportEnt;
});