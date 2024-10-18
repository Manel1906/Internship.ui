define([
	'text!group/nso_email/tmpl/EmailSecu_Message_List.html',
	],
	function(
			EmailSecu_Message_List
	) {
	var EmailMessageList 	= function () {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		var pr_ctr_Main				= null;
		
		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_MSG_LST			= "SVMailFolderCotentLst";
		
		var pr_BEGIN				= 0;
		const pr_NUMBER_RECORD		= 10;
		
		const pr_HASH_PWDCONFIG_01 	= "hash_pwdConfig_01";
		const pr_HASH_PWDCONFIG_02 	= "hash_pwdConfig_02";

		//--------------------------------------------------------------------------------------------------
		this.do_lc_init = function(){
			pr_ctr_Main 							= App.controller.PrjEmail.Main;
			tmplName.EMAIL_SECU_MESSAGE_LIST 		= "EmailSecu_Message_List";
		}

		this.do_lc_show	= function(dataEnc, folder, folders){		
			pr_BEGIN = 0;
			do_lc_loadView();	
			do_lc_build_page(dataEnc, folder, folders);
		}

		//--------------------------------------------------------------------------------------------------		
		var do_lc_loadView =  function(){		
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MESSAGE_LIST		, EmailSecu_Message_List);
		}
		
		var do_lc_build_page = function(dataEnc, folder, folders){
			do_lc_get_lst_msg_in_folder(dataEnc, folder, folders);
		}
		
		var do_lc_bind_event = function(dataEnc, folder, mailList, folders){
			$("#btn_next_page").off("click").on("click", function() {
				pr_BEGIN += pr_NUMBER_RECORD;
				do_lc_get_lst_msg_in_folder(dataEnc, folder, folders);
			})
			
			$("#btn_prev_page").off("click").on("click", function() {
				pr_BEGIN -= pr_NUMBER_RECORD;
				if(pr_BEGIN < 0)	pr_BEGIN = 0;
				do_lc_get_lst_msg_in_folder(dataEnc, folde, foldersr);
			})
			
			$(".msg_item").off("click").on("click", function() {
				let {id} = $(this).data();
				let mailContent = mailList.listMsg.find(mail => mail.id == id) || null;
				if(!!mailContent){
					App.controller.PrjEmail.MsgContent.do_lc_show(dataEnc, mailContent, folder, folders);
				}
			})
		}
		
		var do_lc_get_lst_msg_in_folder = function(dataEnc, folder, folders){
			let dataSend 		= {
					hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), email_conf		: dataEnc	, folder,
					pass: localStorage.getItem(pr_HASH_PWDCONFIG_01), begin_from_last	: pr_BEGIN	, nb: pr_NUMBER_RECORD
			}
			
			let ref				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_MSG_LST, dataSend);
			
			let fSucces 		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_folder_lst, [dataEnc, folder, folders]));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_lc_show_folder_lst = function(sharedJson, dataEnc, folder, folders){
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				if(!data.listMsg || !data.listMsg.length){
					pr_BEGIN = pr_BEGIN - pr_NUMBER_RECORD < 0 ? 0 : pr_BEGIN - pr_NUMBER_RECORD;
				} else {
					data.listMsg.reverse();
				}
				$("#div_EMM_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MESSAGE_LIST		, data));
				do_lc_bind_event(dataEnc, folder, data, folders);
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
	};

	return EmailMessageList;
});