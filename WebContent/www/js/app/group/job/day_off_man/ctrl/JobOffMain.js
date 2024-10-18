define([
        'jquery',
        
        'text!group/job/day_off_man/tmpl/JobOff_Main.html',
        'text!group/job/day_off_man/tmpl/JobOff_List.html',
        
        'text!group/job/day_off_man/tmpl/JobOff_Ent.html',
        'text!group/job/day_off_man/tmpl/JobOff_Ent_Btn.html',
        'text!group/job/day_off_man/tmpl/JobOff_Ent_Header.html',
        'text!group/job/day_off_man/tmpl/JobOff_Ent_Tabs.html',
        'text!group/job/day_off_man/tmpl/JobOff_Ent_Tab_Detail.html',
        'text!group/job/day_off_man/tmpl/JobOff_Ent_Tab_Doc.html',
        
        'text!group/job/day_off_man/tmpl/JobOff_List_User_Header.html',
        'text!group/job/day_off_man/tmpl/JobOff_List_User_Content.html',
        'text!group/job/day_off_man/tmpl/JobOff_List_Request_Header.html',
        'text!group/job/day_off_man/tmpl/JobOff_List_Request_Content.html',
        'text!group/job/day_off_man/tmpl/JobOff_List_Request_By_User_Header.html',
        'text!group/job/day_off_man/tmpl/JobOff_List_Request_By_User_Content.html',
        
        
        'group/job/day_off_man/ctrl/JobOffList',
        'group/job/day_off_man/ctrl/JobOffEnt',
        'group/job/day_off_man/ctrl/JobOffEntHeader',
        'group/job/day_off_man/ctrl/JobOffEntBtn',
        'group/job/day_off_man/ctrl/JobOffEntTabs',       
        'group/job/day_off_man/ctrl/JobOffEntTabDetail',
        'group/job/day_off_man/ctrl/JobOffEntTabDoc',
        'group/job/day_off_man/ctrl/JobOffRights'
       
        ],
        function($,
        		JobOff_Main, 
        		JobOff_List,
        		
        		JobOff_Ent,
        		JobOff_Ent_Btn,
        		JobOff_Ent_Header,
        		JobOff_Ent_Tabs,
        		JobOff_Ent_Tab_Detail,
        		JobOff_Ent_Tab_Doc,
        		JobOff_List_User_Header,
        		JobOff_List_User_Content,
        		JobOff_List_Request_Header,
        		JobOff_List_Request_Content,
        		JobOff_List_Request_By_User_Header,
        		JobOff_List_Request_By_User_Content,
 
        	  /*JobOff_Popup_Deny_Content,*/
        		
        		JobOffList, 
        		JobOffEnt, 
        		JobOffEntHeader, 
        		JobOffEntBtn, 
        		JobOffEntTabs, 
        		JobOffEntTabDetail,
        		JobOffEntTabDoc,
        		JobOffRights
        ) {

	var JobOffMain 	= function (grpName, header, content, footer) {
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
		var url_header				= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
		var self 					= this;
		
		var pr_SERVICE_CLASS		= "ServiceJobDayoffRequest";
		var pr_SERVICE_INFOUSER		= "SVInfoUser";
		var pr_SERVICE_LISTUSER		= "SVLstUser";
		
//		RIGHT ACTION----------------------------------------
		var RIGHT_U_G		= 1;
		var RIGHT_U_N		= 2;
		var RIGHT_U_M		= 3;
		var RIGHT_U_D		= 4;
		
		//------------------------------------------------------------------------------------
		this.var_lc_MODE_INIT 		= 0;
		this.var_lc_MODE_NEW 		= 1; //duplicate is the mode new after clone object
		this.var_lc_MODE_MOD 		= 2;
		this.var_lc_MODE_DEL 		= 3;	
		this.var_lc_MODE_SEL 		= 5;
	
		
		var pr_ctr_Rights			= null;
		var pr_ctr_Main				= null;

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName 	= App.template.names[pr_grpName]
			}

			tmplName.JOB_OFF_MAIN			= pr_grpName + "JobOff_Main";
			tmplName.JOB_OFF_LIST			= pr_grpName + "JobOff_List";
			
			
			tmplName.JOB_OFF_LIST_USER_HEADER 				= pr_grpName + "JobOff_List_User_Header";
			tmplName.JOB_OFF_LIST_USER_CONTENT 				= pr_grpName + "JobOff_List_User_Content";
			tmplName.JOB_OFF_LIST_REQUEST_BY_USER_HEADER	= pr_grpName + "JobOff_List_Request_By_User_Header";
			tmplName.JOB_OFF_LIST_REQUEST_BY_USER_CONTENT	= pr_grpName + "JobOff_List_Request_By_User_Content";
			tmplName.JOB_OFF_LIST_REQUEST_HEADER 			= pr_grpName + "JobOff_List_Request_Header";
			tmplName.JOB_OFF_LIST_REQUEST_CONTENT 			= pr_grpName + "JobOff_List_Request_Content";
			
			tmplName.JOB_OFF_ENT					= pr_grpName + "JobOff_Ent";
			tmplName.JOB_OFF_ENT_BTN				= pr_grpName + "JobOff_EntBtn";
			tmplName.JOB_OFF_ENT_HEADER				= pr_grpName + "JobOff_EntHeader";
			tmplName.JOB_OFF_ENT_TABS				= pr_grpName + "JobOff_EntTabs";
			tmplName.JOB_OFF_ENT_TAB_DETAIL 		= pr_grpName + "JobOff_EntTabDetail";
			tmplName.JOB_OFF_ENT_TAB_DOC			= pr_grpName + "JobOff_EntTabDoc";
			
			tmplName.JOB_OFF_POPUP_DENY_CONTENT 	= pr_grpName + "JobOff_Popup_Deny_Content";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_MAIN				, JobOff_Main); 
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_ENT				, JobOff_Ent);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_ENT_BTN			, JobOff_Ent_Btn);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_ENT_HEADER			, JobOff_Ent_Header);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_ENT_TABS			, JobOff_Ent_Tabs); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_ENT_TAB_DETAIL		, JobOff_Ent_Tab_Detail);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_ENT_TAB_DOC		, JobOff_Ent_Tab_Doc);
			
		/*	tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_POPUP_DENY_CONTENT	, JobOff_Popup_Deny_Content);*/
			
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_LIST				, JobOff_List);

			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_LIST_REQUEST_BY_USER_HEADER	, JobOff_List_Request_By_User_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_LIST_REQUEST_BY_USER_CONTENT	, JobOff_List_Request_By_User_Content);

			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_LIST_REQUEST_HEADER	, JobOff_List_Request_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_LIST_REQUEST_CONTENT	, JobOff_List_Request_Content); 
			
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_LIST_USER_HEADER		, JobOff_List_User_Header); 
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_OFF_LIST_USER_CONTENT		, JobOff_List_User_Content); 
			
			if (!App.controller.JobOffMan)				
				 App.controller.JobOffMan				= {};
			
			if (!App.controller.JobOffMan.Main)	
				App.controller.JobOffMan.Main 			= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller.JobOffMan.List			)  
				 App.controller.JobOffMan.List			= new JobOffList			(grpName, "#div_JobOff_List", "#div_JobOff_List_Header", "#div_JobOff_List_Content");				
			if (!App.controller.JobOffMan.Ent			)  
				 App.controller.JobOffMan.Ent			= new JobOffEnt				(grpName, null, "#div_JobOff_Ent", null);
			if (!App.controller.JobOffMan.EntBtn		)  
				 App.controller.JobOffMan.EntBtn		= new JobOffEntBtn			(grpName, null, "#div_JobOff_Ent_Btn", null);
			if (!App.controller.JobOffMan.EntHeader	)  
				 App.controller.JobOffMan.EntHeader		= new JobOffEntHeader		(grpName, null, "#div_JobOff_Ent_Header", null);
			if (!App.controller.JobOffMan.EntTabs		)  
				 App.controller.JobOffMan.EntTabs		= new JobOffEntTabs			(grpName, null, "#div_JobOff_Ent_Tabs", null);
			if (!App.controller.JobOffMan.Rights)	
				 App.controller.JobOffMan.Rights 		=  new JobOffRights			();
			
			//----------tab name----------------------------------------------------------------------------------------
			if (!App.controller.JobOffMan.EntTabDetail)  
				 App.controller.JobOffMan.EntTabDetail	= new JobOffEntTabDetail	(grpName, null, "#div_JobOff_Ent_Tab_Detail", null);
			if (!App.controller.JobOffMan.EntTabDoc)  
				 App.controller.JobOffMan.EntTabDoc	= new JobOffEntTabDoc		(grpName, null, "#div_JobOff_Ent_Tab_Doc", null);
			//--------------------------------------------------------------------------------------------------
			
			App.data["HttpSecuHeader"]			= req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL);
			
			App.controller.JobOffMan.List			.do_lc_init();
			App.controller.JobOffMan.Ent			.do_lc_init();
			App.controller.JobOffMan.EntBtn			.do_lc_init();
			App.controller.JobOffMan.EntHeader		.do_lc_init();
			App.controller.JobOffMan.EntTabs		.do_lc_init();
			App.controller.JobOffMan.EntTabDetail	.do_lc_init();
			App.controller.JobOffMan.EntTabDoc		.do_lc_init();
			
			do_Request_User_DayOff_Info_lc(App.data.user.id, false);
			
			pr_ctr_Main 			= App.controller.JobOffMan.Main;
			pr_ctr_Rights			= App.controller.JobOffMan.Rights;
		}
		
		//---------------------------------------------------------------------------------------------
		//SHOW MAIN PAGE-----SHOW MAIN PAGE-----SHOW MAIN PAGE-----SHOW MAIN PAGE-----SHOW MAIN PAGE---
		//---------------------------------------------------------------------------------------------
		var pr_grpPath 		= 'group/job/day_off_man';
		var pr_showed		= false;
		this.do_lc_show = function(){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback, []);
				pr_showed = true;
			}else {
				self.do_lc_show_callback();
			}
		};
		
		
		this.do_lc_show_callback = function(){
			try {
				App.data["HttpSecuHeader"]				= req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL);
				
				var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_U_G);
				if(rightCode == -1){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				
				//If is Admin, Supervisor: Get List User/Employers:
				var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_U_N);
				if(rightCode != -1){
					do_Request_List_User();
				}
				
				
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_MAIN, {}));	
				
				App.controller.JobOffMan.List	.do_lc_show();
				App.controller.JobOffMan.Ent	.do_lc_show(null);
				
//				do_gl_init_Resizable("#div_JobOff_List");	
				App.controller.UI.Main.do_bind_event_btn_vertical_list('#div_JobOff_List', '#div_JobOff_Ent');
				App.controller.UI.Main.do_lc_bind_event_resize();
				App.controller.UI.Main.do_lc_bind_event_minimize('#div_JobOff_List', '#div_JobOff_Ent');
				doBindings();
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobOff > Main :" + e.toString());
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.off", "JobOffMain", "do_lc_show", e.toString()) ;
			}
		};
		
		var doBindings = function() {
        	do_gl_bindingAppLTE();
        }.bind(this);
		
		this.do_lc_binding_pages = function(div, option) {
			try {
				if(div.length>0) do_gl_enhance_within(div, option);
			} catch (e) {
				do_gl_show_Notify_Msg_Error(null, e);
			}
		};
		
		//---------------------------------------------------------------------------------------------
		//GET INFO DAYOFF SELECTED USER-----GET INFO DAYOFF SELECTED USER-----GET INFO DAYOFF SELECTED 
		//---------------------------------------------------------------------------------------------
		
		this.do_Request_User_DayOff_Info = function(uId03, updateHeader){
			if(uId03 == -1 && updateHeader){
				var userInfo = {};
				do_update_header(userInfo);
				return;
			} else if(uId03 == App.data.user.id && updateHeader){
				do_update_header(App.data.user.userInfo);
				return;
			} else {
				do_Request_User_DayOff_Info_lc(uId03, updateHeader);
			}
		}
		
		function do_Request_User_DayOff_Info_lc(uId03, updateHeader){  	
			var ref				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SERVICE_INFOUSER);
			ref["uId03"]   		= uId03;
			
			var fSucces		= [];
			var f01 = {}; 	f01[fVar]	= null; f01[fName] = do_get_info_user; f01[fParam]=[true, updateHeader];			
			fSucces.push(f01);

			var fError 		= {};
			fError[fVar]	= null; fError[fName] 	= do_get_info_user; fError[fParam]  = [false];
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, url_header, ref,100000, fSucces, fError) ;       		
		}
		
		function do_get_info_user(sharedJson, ajaxOk, updateHeader){
			if(ajaxOk == false){
				do_gl_show_Notify_Msg_Error("Ajax was not sent successfully.");
				return;
			}
			if (sharedJson.sv_code == App['const'].SV_CODE_OK){
				var userInfo = sharedJson.res_data;
				App.data.selectedUser = userInfo;
				if(App.data.user.id == userInfo.id){
					App.data.user.userInfo = userInfo;
				}
				if(updateHeader){
					do_update_header(userInfo);
				}
			} else{
				do_gl_show_Notify_Msg_Error("Error get Holidays Resume Of User: " + sharedJson.sv_code);
			}
		}
		
		function do_update_header(userInfo){
			$("#inp_hldT").val(userInfo.hldT);
			$("#inp_hldA").val(userInfo.hldA);
			$("#inp_hldR").val(userInfo.hldR);
			$("#inp_uId03_email").val(userInfo.email);
			$("#inp_uId03_login").val(userInfo.login);
		}
		
		//---------------------------------------------------------------------------------------------
		//GET LIST USER-----GET LIST USER-----GET LIST USER-----GET LIST USER-----GET LIST USER-----GET
		//---------------------------------------------------------------------------------------------
		
		//List: Name and Id only
		function do_Request_List_User(){
			var ref			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SERVICE_LISTUSER);
			var fSucces		= [];
			var f01 = {}; 	f01[fVar]	= null;		f01[fName] = do_get_list_user;		f01[fParam]=[true];			
			fSucces.push(f01);

			var fError 		= {};
			fError[fVar]	= null; fError[fName] 	= do_get_list_user; fError[fParam]  = [false];
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, url_header, ref,100000, fSucces, fError) ;
		}
		
		function do_get_list_user(sharedJson, ajaxOk){
			if(ajaxOk == false){
				do_gl_show_Notify_Msg_Error("Ajax was not sent successfully.");
				return;
			}
			if (sharedJson.sv_code == App['const'].SV_CODE_OK){
				var listUser = sharedJson.res_data;
				App.data.listUser = listUser;
				App.data.listUserArray = [];

				for(var i = 0; i < listUser.length; i++){
					var user = {};
					user.id = listUser[i].id;
					if(!listUser[i].per){
						listUser[i].per = {};
					}
					if(!listUser[i].per.name03){
						listUser[i].per.name03 = " ";
					}
					user.value = listUser[i].per.name01 + " " + listUser[i].per.name02 + " " + listUser[i].per.name03;
					App.data.listUserArray.push(user);
				}
			} else{
				do_gl_show_Notify_Msg_Error("Error get List User: " + sharedJson.sv_code);
			}
		}
	};

	return JobOffMain;
  });