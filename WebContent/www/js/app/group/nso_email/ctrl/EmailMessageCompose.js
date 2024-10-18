define([
	'text!group/nso_email/tmpl/EmailSecu_Message_Compose.html',
	],
	function(
			EmailSecu_Message_Compose
	) {
	var EmailMessageCompose 	= function () {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_MSG_SEND			= "SVMailSendSimple";
		
		const pr_HASH_PWDCONFIG_01 	= "hash_pwdConfig_01";
		const pr_HASH_PWDCONFIG_02 	= "hash_pwdConfig_02";
		const pr_STRING_SECURITY	= "with_SECURITY_";

		//--------------------------------------------------------------------------------------------------
		this.do_lc_init = function(){
			pr_ctr_Main 							= App.controller.PrjEmail.Main;
			tmplName.EMAIL_SECU_MESSAGE_COMPOSE 	= "EmailSecu_Message_Compose";
		}

		this.do_lc_show	= function(folders, dataEnc, newMsg){		
			do_lc_loadView();	
			do_lc_build_page(folders, dataEnc, newMsg);
		}

		//--------------------------------------------------------------------------------------------------		
		var do_lc_loadView =  function(){		
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MESSAGE_COMPOSE, EmailSecu_Message_Compose);      	
		}
		
		var do_lc_build_page = function(folders, dataEnc, newMsg = {}){
			App.MsgboxController.do_lc_show({
				title 		: $.i18n("prj_email_msg_new_title"),
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MESSAGE_COMPOSE		, newMsg),
				autoclose	: false,
				buttons 	: {
					SEND 	: {
						lab 		: $.i18n("common_btn_send") + "<i class='fab fa-telegram-plane ml-1'></i>",
						funct 		: do_lc_get_msg_info,
						param		: [folders, dataEnc],
						classBtn	: "btn-primary"
					},
					CALCEL 	: {
						lab 		: $.i18n("common_btn_close"),
					}
				},
				bindEvent: function() {
					App.SummerNoteController.do_lc_show("#frm_new_msg");
				}
			});
		}
		
		var do_lc_get_msg_info = function(folders, dataEnc){
			let dataMsg = req_gl_data({
				dataZoneDom		: $("#frm_new_msg")
			})
			
			if(dataMsg.hasError)	return false;
			
			let msg = dataMsg.data;
			if(msg.lock){
				msg = do_lc_get_msg_with_lock(msg);
			}
			do_lc_send_mail(folders, dataEnc, msg)
		}
		
		var do_lc_send_mail = function(folders, dataEnc, msg){
			let dataSend	= {hash : localStorage.getItem(pr_HASH_PWDCONFIG_02), email_conf : dataEnc	, pass: localStorage.getItem(pr_HASH_PWDCONFIG_01), from : folders.mailbox};
			
			let ref			= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_MSG_SEND, msg, dataSend);
			
			let fSucces 	= [];
			fSucces.push(req_gl_funct(null, do_lc_show_folder_lst, [dataEnc, folders]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_lc_show_folder_lst = function(sharedJson, dataEnc, folders){
			if (can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n('prj_email_msg_new_succes'));
			} else {
				do_gl_show_Notify_Msg_Error($.i18n('prj_email_msg_new_error'));
			}
		}
		
		var do_lc_get_msg_with_lock = function(msg){
			let {lock} 		= msg;
			let newMsg 		= {to: msg.to};
			delete msg.to;
			delete msg.lock;
			
			let hash_lock 	= rq_gl_Crypto(lock.trim());
			let mailString 	= JSON.stringify(msg);
			
			let dataEnc 	= do_gl_encrypt_aes(hash_lock, mailString);
			newMsg.subj 	= pr_STRING_SECURITY + dataEnc;
			newMsg.body 	= $.i18n("prj_email_msg_secure_body");
			return newMsg;
		}
	};

	return EmailMessageCompose;
});