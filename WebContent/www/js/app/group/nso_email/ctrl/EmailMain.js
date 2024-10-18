define([
	'text!group/nso_email/tmpl/EmailSecu_Main.html',
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Pwd.html',
	
	'group/nso_email/ctrl/EmailAll',
	], function(
			EmailSecu_Main,
			EmailSecu_Msgbox_Pwd,
			
			{
				EmailMenu,
				EmailFolder,
				EmailMessageList,
				EmailMessageContent,
				EmailMessageCompose,
				EmailConfig
			}
	) {
	var EmailMain 	= function () {
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;

		var self 					= this;
		//--------------------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_SV_CFG_CONFIG_LST	= "SVCFGConfigList";
		//--------------------------------------------------------------------------------------------------
		this.do_lc_init = function(){
			App.data["HttpSecuHeader"]			= req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL);
			//---define div id for all --------------------------------------
			if (!App.data.emm) App.data.emm 	= {};
			
			tmplName.EMMSECU_MAIN				=  "EmailSecu_Main";

			//---define controller-------------------------------------
			let pr_email_ctrl = {
					Menu : EmailMenu, Folder : EmailFolder, MsgList : EmailMessageList, MsgContent : EmailMessageContent, MsgCompose : EmailMessageCompose, Config: EmailConfig
			}
			
			for(let ctrlName in pr_email_ctrl){
				if (!App.controller.PrjEmail[ctrlName]){
					App.controller.PrjEmail[ctrlName] 						= new pr_email_ctrl[ctrlName]();
					App.controller.PrjEmail[ctrlName].do_lc_init();
				}
			}
				
			do_lc_load_common();
		}
		//--------------------------------------------------------------------------------------------------
		this.do_lc_show	= function(){	
			doLoadView();
			do_lc_build_page();
		}
		
		var do_lc_build_page = function(){
			$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMMSECU_MAIN		, {}));  
			App.controller.PrjEmail.Config.do_lc_show();
		}
		//--------------------------------------------------------------------------------------------------
		var doLoadView =  function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.EMMSECU_MAIN			, EmailSecu_Main);
		}

		//--------------------------------------------------------------------------------------------------
		var do_lc_load_common = function (){	
			let ref 	= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_CFG_CONFIG_LST);

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_render_list_cfgConfig, []));

			let fError 	= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;		
		}

		var do_lc_render_list_cfgConfig = function (sharedJson) {
			if (!App.data.emm.eCfgConfigs) App.data.emm.cfgMailConfigs = [];

			if(can_gl_AjaxSuccess(sharedJson)) {
				App.data.emm.cfgMailConfigs 	= sharedJson.res_data;
			}
		}
		//--------------------------------------------------------------------------------------------------
		this.do_show_Msg= function(sharedJson, msg){
			console.log("do_show_Msg::" + msg);
		}
	};

	return EmailMain;
});