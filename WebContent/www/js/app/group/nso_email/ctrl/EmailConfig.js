define([
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Pwd.html',
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Email.html',
	],
	function(
			EmailSecu_Msgbox_Pwd,
			EmailSecu_Msgbox_Email
	) {
	var EmailConfig 	= function () {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		var pr_ctr_Main				= null;
		var pr_ctr_Menu				= null;
		
		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_SV_CONFIG_GET		= "SVUserConfGet";
		const pr_SV_VIEW_CONFIG		= "SVUserConfView";
		const pr_SV_NEW_PWD			= "SVUserSendNewPwd";
		//--------------------------------------------------------------------------------------------------
		const pr_HASH_PWDCONFIG_01 	= "hash_pwdConfig_01";
		const pr_HASH_PWDCONFIG_02 	= "hash_pwdConfig_02";
		
		const pr_KEY_ENTER			= 13;

		//--------------------------------------------------------------------------------------------------
		this.do_lc_init = function(){
			pr_ctr_Main 						= App.controller.PrjEmail.Main;
			pr_ctr_Menu 						= App.controller.PrjEmail.Menu;
			tmplName.EMMSECU_MSGBOX_PWD			= "EmailSecu_Msgbox_Pwd";
			tmplName.EMMSECU_MSGBOX_EMAIL		= "EmailSecu_Msgbox_Email";
		}

		this.do_lc_show	= function(){		
			do_lc_loadView();	
			do_lc_build_page();
		}

		//--------------------------------------------------------------------------------------------------		
		var do_lc_loadView =  function(){		
			tmplCtrl.do_lc_put_tmpl(tmplName.EMMSECU_MSGBOX_PWD	, EmailSecu_Msgbox_Pwd);  	
			tmplCtrl.do_lc_put_tmpl(tmplName.EMMSECU_MSGBOX_EMAIL	, EmailSecu_Msgbox_Email); 
		}
		
		var do_lc_build_page = function(){
			do_lc_show_req_password();
		}
		
		var do_lc_show_req_password = function(){
			App.MsgboxController.do_lc_show({
				title 		: $.i18n("msgbox_confirm_title"),
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMMSECU_MSGBOX_PWD		, {}),
				autoclose	: false,
				buttons 	: {
					SEND 	: {
						lab 		: $.i18n("common_btn_send"),
						funct 		: do_lc_make_pwd_config,
						autoclose	: false,
						classBtn	: "btn-primary"
					},
					FOGET : {
						lab 		: $.i18n("prj_email_pwd_config_pwd_forget"),
						funct 		: do_lc_forget_pwd_config,
						classBtn	: "btn-info"
					},
					CALCEL : {
						lab 		: $.i18n("common_btn_close"),
					}
				},
				bindEvent: function() {
					do_lc_bindEvent_toForm();
				}
			});
		}
		
		var do_lc_bindEvent_toForm = function(){
			$("#inp_pwd_config").off("keypress").on("keypress", function(event) {
				(event.keyCode == pr_KEY_ENTER) && do_lc_make_pwd_config();
			});
		}
		
		var do_lc_make_pwd_config = function() {
			let pwd = $("#inp_pwd_config").val();
			
			if(pwd && pwd.length){
				let hash_pwd_01 = rq_gl_Crypto(pwd.trim());
				let hash_pwd_02 = rq_gl_Crypto(hash_pwd_01);
				
				localStorage.setItem(pr_HASH_PWDCONFIG_01, hash_pwd_01);
				localStorage.setItem(pr_HASH_PWDCONFIG_02, hash_pwd_02);
				
				do_lc_send_pwd_config(hash_pwd_02);
			}
		}
		
		var do_lc_send_pwd_config = function(hash_pwd_02){
			let ref 	= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_CONFIG_GET, {hash: hash_pwd_02});

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_after_send_pwd_response, []));

			let fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_lc_after_send_pwd_response = function(sharedJson) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data 				= sharedJson[App['const'].RES_DATA];
				if(data){
					let pwdConfig01 	= localStorage.getItem(pr_HASH_PWDCONFIG_01);
					let cfgStr 			= do_gl_decrypt_aes(pwdConfig01, data.info01);
					App.data.eConfig 	= JSON.parse(cfgStr);
					
					pr_ctr_Menu.do_lc_show({lst: App.data.eConfig});
					App.MsgboxController.do_lc_close();
				} else {
					// error pwd
					let $divError = $(".errMsg");
					if($divError.length){
						$divError.html($.i18n("prj_email_pwd_config_error"));
					} else {
						$("#inp_pwd_config").after("<div class='errMsg'>" + $.i18n("prj_email_pwd_config_error") + "</div>")
					}
				}
			} else {
				pr_ctr_Menu.do_lc_show({});
				App.MsgboxController.do_lc_close();
			}
		}
		
		var do_lc_forget_pwd_config = function(id) {
			let ref 	= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_VIEW_CONFIG);

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_after_view_conf_response, []));

			let fError 	= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_after_view_conf_response = function(sharedJson) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				if(data === true){
					do_lc_add_email_toSend_newPwd();
				} else {
					do_gl_show_Notify_Msg_Error($.i18n('prj_email_msg_new_error'));
					do_lc_show_req_password();
				}
			} else {
				//do something
			}
		}
		
		var do_lc_add_email_toSend_newPwd = function(){
			App.MsgboxController.do_lc_show({
				title 		: $.i18n("msgbox_confirm_title"),
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMMSECU_MSGBOX_EMAIL		, {}),
				autoclose	: false,
				buttons 	: {
					SEND : {
						lab 		: $.i18n("common_btn_send"),
						funct 		: do_lc_get_new_pwd,
						autoclose	: false,
						classBtn	: "btn-primary"
					},
					CALCEL : {
						lab 		: $.i18n("common_btn_close"),
					}
				},
				bindEvent: function() {
					do_lc_bindEvent_toForm_Email();
				}
			});
		}
		
		var do_lc_bindEvent_toForm_Email = function(){
			$("#inp_email_config").off("keypress").on("keypress", function(event) {
				(event.keyCode == pr_KEY_ENTER) && do_lc_send_new_pwd();
			});
		}
		
		var do_lc_get_new_pwd = function(){
			let dataEmail = req_gl_data({
				dataZoneDom		: $("#div_conf_email")
			})
			
			if(dataEmail.hasError)	return false;
			
			do_lc_send_new_pwd(dataEmail.data.email);
		}
		
		var do_lc_send_new_pwd = function(email) {
			let ref 	= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW_PWD, {email});

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_after_send_newPwd_response, []));

			let fError 	= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_after_send_newPwd_response = function(sharedJson) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				App.MsgboxController.do_lc_close();
				do_gl_show_Notify_Msg_Success($.i18n('prj_email_pwd_config_pwd_forget_send_success'));
				do_lc_show_req_password();
			} else {
				do_gl_show_Notify_Msg_Error($.i18n('prj_email_pwd_config_pwd_forget_send_error'));
			}
		}
	};

	return EmailConfig;
});