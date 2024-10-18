define([
	'text!group/nso_email/tmpl/EmailSecu_Menu.html',
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Change_Pwd.html',
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Config_Form.html',
	],
	function(
			EmailSecu_Menu,
			EmailSecu_Msgbox_Change_Pwd,
			EmailSecu_Msgbox_Config_Form
	) {

	var EmailMenu 	= function () {
		const tmplName		= App.template.names;
		const tmplCtrl		= App.template.controller;

		var self 			= this;
		var pr_ctr_Main		= null;
		//--------------------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_SV_CONFIG_MOD		= "SVUserConfMod";
		const pr_SV_FOLDER_LST		= "SVMailFolderLst";
		
		const pr_HASH_PWDCONFIG_01 	= "hash_pwdConfig_01";
		const pr_HASH_PWDCONFIG_02 	= "hash_pwdConfig_02";
		
		const pr_HASH_CONFIG_LST 	= "hash_config_lst";
		//--------------------------------------------------------------------------------------------------	
		this.do_lc_init = function(){
			pr_ctr_Main 							= App.controller.PrjEmail.Main;
			tmplName.EMAIL_SECU_MENU 				= "EmailSecu_Menu";
			tmplName.EMAIL_SECU_MSGBOX_CHANGE_PWD 	= "EmailSecu_Msgbox_Change_Pwd";
			tmplName.EMAIL_SECU_MSGBOX_CONFIG_FORM 	= "EmailSecu_Msgbox_Config_Form";
			tmplName.EMAIL_SECU_MSGBOX_CONFIG_FORM 	= "EmailSecu_Msgbox_Config_Form";
		}

		//--------------------------------------------------------------------------------------------------
		this.do_lc_show	= function(data){
			do_lc_load_view();
			do_lc_build_page(data);
			do_lc_bind_event();
		}

		var do_lc_load_view = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MENU					, EmailSecu_Menu);
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MSGBOX_CHANGE_PWD		, EmailSecu_Msgbox_Change_Pwd);
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MSGBOX_CONFIG_FORM		, EmailSecu_Msgbox_Config_Form);
		}

		var do_lc_build_page = function(data){
			$("#div_EMM_Menu").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MENU		, data))
		}

		var do_lc_bind_event = function(){
			$("#btn_change_password_cfg").off("click").on("click", function() {
				do_lc_show_box_change();
			})

			$("#btn_add_emailBox").off("click").on("click", function() {
				do_lc_show_box_newConfig();
			})
			
			$(".email-item-edit").off("click").on("click", function() {
				let {email} = $(this).data();
				if(!!email){
					let data = App.data.eConfig.find(item => item.email == email) || null;
					!!data && do_lc_show_box_editConfig(data);
				}
			})
			
			$(".email-item-delete").off("click").on("click", function() {
				let {email} = $(this).data();
				if(!!email){
					let lstReste = App.data.eConfig.filter(item => item.email != email) || [];
					!!lstReste && do_lc_script_config(lstReste);
				}
			})
			
			$(".email-item").off("click").on("click", function() {
				let $this 	= $(this);
				let {email} = $this.data();
				if(!!email){
					let data = App.data.eConfig.find(item => item.email == email) || null;
					if(!!data){
						let parent 			= $this.closest("tr");
						$(".tr-mail-list")	.removeClass("active");
						parent				.addClass("active");
						do_lc_get_folder_lst_config(data);
					}
				}
			})
		}
		
		//------------- Start change password ---------------------
		var do_lc_show_box_change = function(){
			App.MsgboxController.do_lc_show({
				title 		: $.i18n("msgbox_confirm_title"),
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MSGBOX_CHANGE_PWD		, {}),
				autoclose	: false,
				buttons 	: {
					SEND 	: {
						lab 		: $.i18n("common_btn_send"),
						funct 		: do_lc_verify_pwd_config,
						autoclose	: false,
						classBtn	: "btn-primary"
					},
					CALCEL 	: {
						lab 		: $.i18n("common_btn_close"),
					}
				}
			});
		}
		
		var do_lc_verify_pwd_config = function(){
			let data = req_gl_data({
				dataZoneDom		: $("#frm_change_pwd")
			})
			
			if(data.hasError)	{
				do_gl_show_Notify_Msg_Error ($.i18n('prj_email_wrong_new_pwd'));	
				return false;
			}
			
			let oldPass 		= data.data.oldPwd;
			
			let old_hash_pwd_01 = rq_gl_Crypto(oldPass.trim());
			let pwdConfig01 	= localStorage.getItem(pr_HASH_PWDCONFIG_01); 
			
			if(old_hash_pwd_01 !== pwdConfig01){
				do_gl_show_Notify_Msg_Error ($.i18n('prj_email_wrong_old_pwd'));	
				return false;
			}
			
			let newPass 		= data.data.newPwd;
			
			let hash_pwd_01 	= rq_gl_Crypto(newPass.trim());
			let hash_pwd_02 	= rq_gl_Crypto(hash_pwd_01);
			let cfgString 		= JSON.stringify(App.data.eConfig);
			
			let dataEnc 		= do_gl_encrypt_aes(hash_pwd_01, cfgString);
			
			do_lc_change_pwd_config(dataEnc, hash_pwd_01, hash_pwd_02);
		}
		
		var do_lc_change_pwd_config = function(dataEnc, hash_pwd_01, hash_pwd_02) {
			let dataSend 	= {email_conf: dataEnc, hash: hash_pwd_02, hash_old: localStorage.getItem(pr_HASH_PWDCONFIG_02), hash01: hash_pwd_01}
			
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_CONFIG_MOD, dataSend);

			let fSucces 	= [];
			fSucces.push(req_gl_funct(null, do_lc_after_change, [hash_pwd_01, hash_pwd_02]));

			let fError 	= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_lc_after_change = function(sharedJson, hash_pwd_01, hash_pwd_02) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				
				localStorage.setItem(pr_HASH_PWDCONFIG_01, hash_pwd_01);
				localStorage.setItem(pr_HASH_PWDCONFIG_02, hash_pwd_02);
				//do something
			} else {
				//do something
			}
			App.MsgboxController.do_lc_close();
		}
		
		//------------- End change password ---------------------
		
		//------------- Start add new mail box ---------------------
		var do_lc_show_box_newConfig = function(){
			App.MsgboxController.do_lc_show({
				title 		: $.i18n("msgbox_confirm_title"),
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MSGBOX_CONFIG_FORM		, {}),
				autoclose	: false,
				buttons 	: {
					SEND 	: {
						lab 		: $.i18n("common_btn_send"),
						funct 		: do_lc_req_info_config,
						autoclose	: false,
						classBtn	: "btn-primary"
					},
					CALCEL 	: {
						lab 		: $.i18n("common_btn_close"),
					}
				},
				bindEvent: function() {
					do_lc_trigger_autocomplete_toForm();
				}
			});
		}
		
		var do_lc_trigger_autocomplete_toForm = function(){
			let optionImaps = {
        			el				: $("#inp_imap_config")	, source	: App.data.emm.cfgMailConfigs	, displayAttrLst : ["host_name"]	, minLength: 1, 
        			renderAttrLst	: ["host_addr"]			, dataZone	: $("#div_imap_config")			, appendTo: ".msg-box"
        	}
        	do_gl_autocomplete_new(optionImaps);
        	
        	let optionSmtps = {
        			el				: $("#inp_smtp_config")	, source	: App.data.emm.cfgMailConfigs	, displayAttrLst : ["host_name"]	, minLength: 1, 
        			renderAttrLst	: ["host_addr"]			, dataZone	: $("#div_smtp_config")			, appendTo: ".msg-box"
        	}
        	do_gl_autocomplete_new(optionSmtps);
		}
		
		var do_lc_req_info_config = function(){
			let config = req_gl_data({
				dataZoneDom		: $("#div_config_form")
			})
			
			if(config.hasError)	return false;
			
			do_lc_save_config(config.data);
		}
		
		var do_lc_save_config = function(data){
			if(!App.data.eConfig)	App.data.eConfig = [];
			App.data.eConfig.push(data);
			
			do_lc_script_config(App.data.eConfig);
		}
		
		var do_lc_script_config = function(listConfig){
			let cfgString 	= JSON.stringify(listConfig);
			let pwdConfig01 = localStorage.getItem(pr_HASH_PWDCONFIG_01);
			
			let dataEnc 	= do_gl_encrypt_aes(pwdConfig01, cfgString);
			do_lc_save_config_data(dataEnc, listConfig);
		}
		
		var do_lc_save_config_data = function(dataEnc, listConfig) {
			let dataSend 		= {
					email_conf	: dataEnc									, hash	: localStorage.getItem(pr_HASH_PWDCONFIG_02), 
					hash_old	: localStorage.getItem(pr_HASH_PWDCONFIG_02), hash01: localStorage.getItem(pr_HASH_PWDCONFIG_01)
			}
			
			let ref 			= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_CONFIG_MOD, dataSend);

			let fSucces 		= [];
			fSucces.push(req_gl_funct(null, do_lc_save_config_ajax, [dataEnc, listConfig]));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_save_config_ajax = function(sharedJson, dataEnc, listConfig) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				localStorage.setItem(pr_HASH_CONFIG_LST, dataEnc);
				App.data.eConfig = listConfig;
				
				self.do_lc_show({lst: listConfig});
			} else {
				App.data.eConfig.length = App.data.eConfig.length - 1;
			}
			App.MsgboxController.do_lc_close();
		}
		//------------- End add new mail box ---------------------
		
		//------------- Start get folder ---------------------
		var do_lc_get_folder_lst_config = function(data){	
			let cfgString 	= JSON.stringify(data);
			let pwdConfig01 = localStorage.getItem(pr_HASH_PWDCONFIG_01);
			let dataEnc 	= do_gl_encrypt_aes(pwdConfig01, cfgString);
			do_lc_get_folder_lst(dataEnc);
		}
		
		var do_lc_get_folder_lst = function(dataEnc){
			let dataSend		= {email_conf: dataEnc, hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), pass: localStorage.getItem(pr_HASH_PWDCONFIG_01)};
			let ref				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_FOLDER_LST, dataSend);
			
			let fSucces 		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_folder_lst, [dataEnc]));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_lc_show_folder_lst = function(sharedJson, dataEnc){
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				App.controller.PrjEmail.Folder.do_lc_show(data, dataEnc);
			} else {

			}
		}
		//------------- End get folder ---------------------
		
		//------------- Start edit emailBox ---------------------
		var do_lc_show_box_editConfig = function(detail){
			App.MsgboxController.do_lc_show({
				title 		: $.i18n("msgbox_confirm_title"),
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MSGBOX_CONFIG_FORM		, detail),
				autoclose	: false,
				buttons 	: {
					SEND 	: {
						lab 		: $.i18n("common_btn_send"),
						funct 		: do_lc_req_edit_config,
						param		: [detail],
						classBtn	: "btn-primary"
					},
					CALCEL 	: {
						lab 		: $.i18n("common_btn_close"),
					}
				},
				bindEvent: function() {
					do_lc_trigger_autocomplete_toForm();
				}
			});
		}
		
		var do_lc_req_edit_config = function(detail){
			let emailList = App.data.eConfig;
			
			let config = req_gl_data({
				dataZoneDom		: $("#div_config_form")
			})				
			if(config.hasError)	return false;
			
			let lstRest = App.data.eConfig.filter(item => item.email != detail.email) || [];
			lstRest = [...lstRest, config.data];
			
			do_lc_script_config(lstRest);
		}
		//------------- End edit emailBox ---------------------
	};

	return EmailMenu;
});