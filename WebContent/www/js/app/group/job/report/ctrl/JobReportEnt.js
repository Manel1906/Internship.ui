define(['jquery'],
        function($) {


	var JobReportEnt     = function (grpName,header,content,footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
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
		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;
		var pr_lock					= null;
		
		const lc_rp_stat_draft		= 0;
		const lc_rp_stat_pending	= 1;
		const lc_rp_stat_validated	= 2;
		const lc_rp_stat_denied		= 3;
		var username				= App.data.user.per;
		if(!username.name03){
			username.name03 = "";
		}
		
		
		var currentRpCreated		= 1;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobReport.Main;
			pr_ctr_List 			= App.controller.JobReport.List;
			
			pr_ctr_Ent				= App.controller.JobReport.Ent;
			pr_ctr_EntHeader 		= App.controller.JobReport.EntHeader;
			pr_ctr_EntBtn 			= App.controller.JobReport.EntBtn;
			pr_ctr_EntTabs 			= App.controller.JobReport.EntTabs;
			pr_ctr_DateTime			= App.controller.JobReport.DateTime;
		}
		
		//---------------------------------------------------------------------------------------------
		//SHOW REPORT-----SHOW REPORT-----SHOW REPORT-----SHOW REPORT-----SHOW REPORT-----SHOW REPORT--
		//---------------------------------------------------------------------------------------------
		this.do_lc_show		= function(obj, mode){			
			pr_object 		= obj;
			pr_mode			= mode;		
			
			if (obj){
				switch (obj.stat){
				case lc_rp_stat_draft		: if (pr_mode!=pr_ctr_Main.var_lc_MODE_NEW && pr_mode!=pr_ctr_Main.var_lc_MODE_MOD) pr_mode= pr_ctr_Main.var_lc_MODE_MOD;break;
				case lc_rp_stat_denied		: pr_mode= pr_ctr_Main.var_lc_MODE_MOD;break;
				case lc_rp_stat_pending		: pr_mode= pr_ctr_Main.var_lc_MODE_SEL;break;
				case lc_rp_stat_validated	: pr_mode= pr_ctr_Main.var_lc_MODE_SEL;break;
				}
			}else{
				pr_mode == pr_ctr_Main.var_lc_MODE_INIT
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_ENT, {mode : pr_ctr_Main.var_lc_MODE_INIT}));
				
				obj = {};
				obj.uId03 = App.data.user.id;
				pr_ctr_EntBtn	.do_lc_show(obj, pr_ctr_Main.var_lc_MODE_INIT);
				return;
			}
			
			
			do_lc_handle_rp_resume_backToList (obj);

			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_ENT, obj));				
			pr_ctr_EntBtn		.do_lc_show(obj, pr_mode);
			pr_ctr_EntHeader	.do_lc_show(obj, pr_mode);
			pr_ctr_EntTabs		.do_lc_show(obj, pr_mode);

			pr_ctr_Main.do_lc_binding_pages($(pr_divContent), {
				obj: obj
			});
			
			if(pr_mode == pr_ctr_Main.var_lc_MODE_NEW || pr_mode == pr_ctr_Main.var_lc_MODE_MOD) {
				do_gl_enable_edit($(pr_divContent), ".canEnabled", pr_mode);
			} else {
				do_gl_disable_edit($(pr_divContent), ".canEnabled", pr_mode);
			}
			
			if(obj.stat == lc_rp_stat_pending||obj.stat == lc_rp_stat_validated){
				$("#div_JobReport_Ent_Tab_Report_Detail td").prop("disabled", true);
				$("#btn_add_obs").hide();
				$("#btn_add_doc").hide();
			}
			
			
		}
		
		function do_show_Obj(sharedJson, mode, localObj){
			var code = sharedJson[App['const'].SV_CODE];
			if(code == App['const'].SV_CODE_API_YES) {
				if (localObj){
					self.do_lc_show(localObj, mode); 
				} else{					
					var object = sharedJson[App['const'].RES_DATA];        		
					self.do_lc_show(object, mode);  
				}			     		
        	} else {
                do_gl_show_Notify_Msg_Error("JobReport: Ent Get Obj > SV CODE :" + code);
            }
		}
			

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
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET);			
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
		
		//---------------------------------------------------------------------------------------------
		//ADD NEW REPORT-----ADD NEW REPORT-----ADD NEW REPORT-----ADD NEW REPORT-----ADD NEW REPORT---
		//---------------------------------------------------------------------------------------------
		this.do_lc_new = function() {
			if(App.data.selectedUser.hasLatestReport == currentRpCreated){
				do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_rp_new_exist"));
				return;
			}
			
			var u = App.data.selectedUser;
			if(!u.name03) u.name03 = "";
			
			var newObj		 = {};
			newObj.uId01     = u.id;
			newObj.uId01_name= u.name01 + " " + u.name02 + " " + u.name03;
			newObj.uId03     = u.id;
			newObj.uId03_name= u.name01 + " " + u.name02 + " " + u.name03 ;
			newObj.code01	 = App.data.currentReportCode;
			newObj.dt01		 = new Date();
			newObj.stat      = lc_rp_stat_draft;
			newObj.val02	 = 0;
			newObj.val03	 = 0;
			newObj.val04     = App.data.hldRate;
			newObj.hldrate   = App.data.hldRate;
			
			pr_ctr_DateTime.req_lc_DayOff(newObj.code01, newObj.uId03);
			self		.do_lc_show(newObj, pr_ctr_Main.var_lc_MODE_NEW);
		}
		
		//---------------------------------------------------------------------------------------------
		//SAVE REPORT-----SAVE REPORT-----SAVE REPORT-----SAVE REPORT-----SAVE REPORT-----SAVE REPORT--
		//---------------------------------------------------------------------------------------------
		this.do_lc_save		= function(obj, mode, rpStat, directSave){	//save new object or save with lock	
			do_gl_req_tab_active($(pr_divContent));
				
			if (!obj.files) obj.files = [];
			var cra 			= req_gl_data({
				dataZoneDom		: $(pr_divContent),
				extObject		: {"files": obj.files} //--merge oldfile to lst new
			});
			
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

				cra.data.stat = rpStat;
				
				//-----------------------------------------------------------------
				if(rpStat == lc_rp_stat_validated){
					return;
				}
				
				if(rpStat == lc_rp_stat_draft||rpStat == lc_rp_stat_denied||rpStat == lc_rp_stat_pending){
					do_lc_handle_rp_resume(cra);
					if(mode==pr_ctr_Main.var_lc_MODE_MOD){
						do_send_mod_continue(cra)
					} else if(mode==pr_ctr_Main.var_lc_MODE_NEW){
						do_send_new_continue(cra);	
					}
				}
			}	
		}

		//---------------------------------------------------------------------------------------------
		//	HANDLE REPORT RESUME
		//---------------------------------------------------------------------------------------------
		var do_lc_handle_rp_resume = function(cra) {
			let lstRpResume 	= cra.data?cra.data.lstRpResume :cra.lstRpResume;
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
		//SEND NEW-----SEND NEW-----SEND NEW-----SEND NEW-----SEND NEW-----SEND NEW-----SEND NEW-----SE
		//---------------------------------------------------------------------------------------------
		
		var do_send_new_continue = function(cra) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["obj"]	= JSON.stringify(cra.data);
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", cra.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_MOD]));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));
			fSucces.push(req_gl_funct(null	, do_mark_cra_created	, [cra.data.uId03]));
		
			var fError 			= req_gl_funct(null, do_show_msg, ["KO"]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		
		var do_mark_cra_created = function(sharedJson, uId03){
			App.data.selectedUser.hasLatestReport = currentRpCreated;
			for(var i = 0; i < App.data.lstUser.length; i++){
				if(App.data.lstUser[i].id == uId03){
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
			ref['obj']	= JSON.stringify(cra.data)
			
		
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_show_msg			, ["OK", cra.data.stat]));
			fSucces.push(req_gl_funct(null	, do_show_Obj			, [pr_ctr_Main.var_lc_MODE_MOD]));
			fSucces.push(req_gl_funct(null	, do_refresh_list		, []));
			
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
				var url 	= App.path.BASE_URL_API_PRIV + "?" +	data.path01;
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
		
		
		
		
	}

	return JobReportEnt;
});