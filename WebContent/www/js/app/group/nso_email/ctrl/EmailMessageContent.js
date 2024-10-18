define([
	'text!group/nso_email/tmpl/EmailSecu_Message_Content.html',
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Mail_Secure.html',
	],
	function(
			EmailSecu_Message_Content,
			EmailSecu_Msgbox_Mail_Secure
	) {
	var EmailMessageContent 	= function () {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		var pr_ctr_Main				= null;
		
		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_MSG_LST			= "SVMailFolderCotentLst";


		const pr_HASH_PWDCONFIG_01 	= "hash_pwdConfig_01";
		const pr_HASH_PWDCONFIG_02 	= "hash_pwdConfig_02";
		
		const pr_STRING_SECURITY	= "with_SECURITY_";

		//--------------------------------------------------------------------------------------------------
		this.do_lc_init = function(){
			pr_ctr_Main 							= App.controller.PrjEmail.Main;
			tmplName.EMAIL_SECU_MESSAGE_CONTENT 	= "EmailSecu_Message_Content";
			tmplName.EMAIL_SECU_MSGBOX_MAIL_SECURE 	= "EmailSecu_Msgbox_Mail_Secure";
		}

		this.do_lc_show	= function(dataEnc, mailContent, folder, folders){		
			do_lc_loadView();	
			do_lc_detect_mail_security(dataEnc, mailContent, folder, folders);
		}

		//--------------------------------------------------------------------------------------------------		
		var do_lc_loadView =  function(){		
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MESSAGE_CONTENT	, EmailSecu_Message_Content);      	
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MSGBOX_MAIL_SECURE	, EmailSecu_Msgbox_Mail_Secure);
		}

		var do_lc_build_page = function(dataEnc, mailContent, folder, folders){
			$("#div_msg_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MESSAGE_CONTENT		, {mailContent, folder}));
			do_gl_scrollToEle("#btn_rep_email");
			do_lc_bind_event(folders, dataEnc, mailContent);
		}

		var do_lc_bind_event = function(folders, dataEnc, mailContent){
			$("#btn_rep_email").off("click").on("click", function() {
				let newMsg = {to: mailContent.from, subj: mailContent.subj};
				App.controller.PrjEmail.MsgCompose.do_lc_show(folders, dataEnc, newMsg);
			})
		}
		
		var do_lc_detect_mail_security = function(dataEnc, mailContent, folder, folders){
			let isMailSecure = mailContent.subj.indexOf(pr_STRING_SECURITY) >= 0;
			if(isMailSecure){
				App.MsgboxController.do_lc_show({
					title 		: $.i18n("prj_email_msg_secure_title"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MSGBOX_MAIL_SECURE		, {}),
					autoclose	: false,
					buttons 	: {
						SEND 	: {
							lab 		: $.i18n("common_btn_send") + "<i class='fab fa-telegram-plane ml-1'></i>",
							funct 		: do_lc_check_mail_secure,
							param		: [dataEnc, mailContent, folder, folders],
							classBtn	: "btn-primary",
							autoclose	: false
						},
						CALCEL 	: {
							lab 		: $.i18n("common_btn_close"),
						}
					}
				});
			} else {
				do_lc_build_page(dataEnc, mailContent, folder, folders);
			}
		}
		
		var do_lc_check_mail_secure = function(dataEnc, mailContent, folder, folders){
			let info_secure = req_gl_data({
				dataZoneDom		: $("#div_pwd_mail_secure")
			})
			
			if(info_secure.hasError)	return false;
			
			let pwd_secure 	= info_secure.data.password;
			let mail		= mailContent.subj.replace(pr_STRING_SECURITY, "");
			
			let hash_pwd 	= rq_gl_Crypto(pwd_secure.trim());
			
			try {
				let content =  do_gl_decrypt_aes(hash_pwd, mail);
				let data 	= JSON.parse(content);
				mailContent = Object.assign(mailContent, data);
				do_lc_build_page(dataEnc, mailContent, folder, folders);
				App.MsgboxController.do_lc_close();
			} catch (e) {
				do_gl_show_Notify_Msg_Error($.i18n('prj_email_msg_secure_pwd_error'));
			}
		}

	};

	return EmailMessageContent;
});