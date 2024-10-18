define(['text!group/nso_email/tmpl/EmailSecu_Folder_List.html',
	'text!group/nso_email/tmpl/EmailSecu_Menu.html',
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Change_Pwd.html',
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Config_Form.html',
	'text!group/nso_email/tmpl/EmailSecu_Message_Compose.html',
	'text!group/nso_email/tmpl/EmailSecu_Message_Content.html',
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Mail_Secure.html',
	'text!group/nso_email/tmpl/EmailSecu_Message_List.html',
	'text!group/nso_email/tmpl/EmailSecu_Message_List_Element.html',
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Pwd.html',
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Email.html',
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Reset_Password.html',
	'text!group/nso_email/tmpl/EmailSecu_Msgbox_Pwd_Lock_Email.html',
	'text!group/nso_email/tmpl/EmailSecu_MsgBox_List_Email_Secret.html'],
	function(EmailSecu_Folder_List,
			EmailSecu_Menu,
			EmailSecu_Msgbox_Change_Pwd,
			EmailSecu_Msgbox_Config_Form,
			EmailSecu_Message_Compose,
			EmailSecu_Message_Content,
			EmailSecu_Msgbox_Mail_Secure,
			EmailSecu_Message_List,
			EmailSecu_Message_List_Element,
			EmailSecu_Msgbox_Pwd,
			EmailSecu_Msgbox_Email,
			EmailSecu_Msgbox_Reset_Password,
			EmailSecu_Msgbox_Pwd_Lock_Email,
			EmailSecu_MsgBox_List_Email_Secret){
	var EmailFolder 	= function () {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_MSG_LST			= "SVMailFolderCotentLst";
		const pr_MSG_LST_STAT		="SVMailFolderCotentLstWithStat";
		const pr_MSG_UNREAD			= "SVMailUnRead";
		const pr_MSG_IMPORTANT		= "SVMailImportant";
		const pr_MSG_SPAM			= "SVMailSpam";

		const pr_NUMBER_RECORD		= 20;
		var pr_BEGIN        		= 19;
		
		const pr_typ_unread			= 1;
		const pr_typ_important		= 2;
		const pr_typ_spam			= 3;
		
		const pr_HASH_PWDCONFIG_01 	= "hash_pwdConfig_01";
		const pr_HASH_PWDCONFIG_02 	= "hash_pwdConfig_02";
		
		const pr_FOLDER_EMAIL_LST 	= "folder_email_lst";

		//--------------------------------------------------------------------------------------------------
		this.do_lc_init = function(){
			tmplName.EMAIL_SECU_FOLDER_LIST 		= "EmailSecu_Folder_List";
		}

		this.do_lc_show	= function(folders, dataEnc){			
			do_lc_loadView();	
			do_lc_build_page(folders, dataEnc);
			do_lc_bind_event(folders, dataEnc);
		}

		//--------------------------------------------------------------------------------------------------		
		var do_lc_loadView =  function(){		
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_FOLDER_LIST, EmailSecu_Folder_List);      	
		}

		var do_lc_build_page = function(folders){
			$("#div_email_folder").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_FOLDER_LIST, folders))
		}
		
		var do_format_email_folderEmail = function (folderEmail){
			if (folderEmail.hasOwnProperty("data")){
				if (folderEmail.data.hasOwnProperty("listMsg")){
					folderEmail.data.listMsg.forEach((e) => {
						let str = decodeURIComponent(e.from);
						
					});
				}
			}
			return null;
		}

		var do_lc_bind_event = function(folders, dataEnc){
			$(".folder-item").off("click").on("click", function() {
				let $this 					= $(this);
				let {id: idFolder, folder} 	= $this.data();
				if(idFolder !== null){
					$(".folder-item").removeClass("active");
					$this.addClass("active");

					let folderEmail  = JSON.parse(localStorage.getItem(pr_FOLDER_EMAIL_LST));
					
					if(folderEmail && folderEmail.data.mailBox === folders.mailBox && folderEmail.data.folder === folder && folderEmail.data.begin_from_last == pr_BEGIN){
						App.controller.PrjEmail.MsgList.do_lc_show(folderEmail.data, dataEnc, folder, folders);
					}else{
						App.controller.PrjEmail.MsgList.set_begin_number_record_defaut();
						App.controller.PrjEmail.MsgList.do_lc_get_lst_msg_in_folder(dataEnc, folder, folders);
					}
				}
			})
			
			let folderName = 'INBOX';
			if (can_gl_MobileOrTablet()) {
				let folderEmail  = JSON.parse(localStorage.getItem(pr_FOLDER_EMAIL_LST));
				if(folderEmail) folderName   = folderEmail.data.folder;
			}
			$(`.folder-item[data-folder='${folderName}']`).click();

			$("#btn_new_msg").off("click").on("click", function() {
				App.controller.PrjEmail.MsgCompose.do_lc_show(folders, dataEnc);
			})
			
			$(".btn-resize").off("click").on("click", function(){
				let $this 		= $(this);
				let {divtoogle} = $this.data();
				let child 		= $this.find("i");
				let label 		= $this.find(".label-resize");
				child			.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle)	.toggle("hide");
	
				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
			
			$(".btn-resize-mobile").off("click").on("click", function(){
				let $this 		= $(this);
				let {divtoogle} = $this.data();
				let child 		= $this.find("i");
				let label 		= $this.find(".label-resize");
				child			.toggleClass("mdi-window-maximize mdi-window-minimize")
				$(divtoogle)	.toggle("hide");
	
//				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
			
			if(can_gl_MobileOrTablet){
				$("#div_folder_list_resize").css("display", "none");
			}
		}

	};


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
		
		const pr_FOLDER_EMAIL_LST 	= "folder_email_lst";
		const pr_FOLDER_EMAIL    	= "folder_email";
		//--------------------------------------------------------------------------------------------------	
		this.do_lc_init = function(){
			pr_ctr_Main 									= App.controller.PrjEmail.Main;
			tmplName.EMAIL_SECU_MENU 						= "EmailSecu_Menu";
			tmplName.EMAIL_SECU_MSGBOX_CHANGE_PWD 			= "EmailSecu_Msgbox_Change_Pwd";
			tmplName.EMAIL_SECU_MSGBOX_CONFIG_FORM 			= "EmailSecu_Msgbox_Config_Form";
			tmplName.EMAIL_SECU_MSGBOX_CONFIG_FORM 			= "EmailSecu_Msgbox_Config_Form";
			tmplName.EMAIL_SECU_MSGBOX_LIST_EMAIL_SECRET 	= "EmailSecu_MsgBox_List_Email_Secret";
			
			do_lc_removeLS_lst_folder_email();
		}
		//--------------------------------------------------------------------------------------------------
		var do_lc_removeLS_lst_folder_email = function(){
			let EXPIRE_TIME = 1000*60*60;
			let mailData = JSON.parse(localStorage.getItem(pr_FOLDER_EMAIL)) || {};
			let diff = new Date() - new Date(mailData.time || new Date());
			let timeout = Math.max(EXPIRE_TIME - diff, 0);
			  setTimeout(function() {
			      localStorage.removeItem(pr_FOLDER_EMAIL);
			  }, timeout);
		}

		//--------------------------------------------------------------------------------------------------
		this.do_lc_show	= function(data, hash_pwd_02){
			do_lc_load_view();
			do_lc_build_page(data);
			do_lc_bind_event(hash_pwd_02, data);
		}

		var do_lc_load_view = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MENU							, EmailSecu_Menu);
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MSGBOX_CHANGE_PWD				, EmailSecu_Msgbox_Change_Pwd);
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MSGBOX_CONFIG_FORM				, EmailSecu_Msgbox_Config_Form);
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MSGBOX_LIST_EMAIL_SECRET		, EmailSecu_MsgBox_List_Email_Secret);
		}

		var do_lc_build_page = function(data){
			$("#div_EMM_Menu").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MENU		, data));
			$("#div_EMM_Content").html("");

			if (can_gl_MobileOrTablet()) {
				$("#side-menu-main").attr("href", "javascript: void(0);");
				$("#side-menu-main").parent().addClass("li-has-menu");
				$("#menu-mail-mobile").removeClass("hide");
				$("#menu-mail-mobile").addClass("mm-collapse mm-show");
				
				if(data.lst .length){
					let ul = ``;
					for(let i in data.lst){
						let email = data.lst[i].email;
						ul += `<li data-email="${email}" class="email-item"><a href="javascript: void(0);" class="menu-item-prj cursor-pointer">${email}</a></li>`;
					}
					
					$("#menu-mail-list-mobile").append(ul);
					$("#li-mail-list-mobile").removeClass("hide");
				}
			}
		}

		var do_lc_bind_event = function(hash_pwd_02, data){
			if (can_gl_MobileOrTablet()) {
				$("#btn_change_password_cfg_menu").off("click").on("click", function() {
					do_lc_show_box_change();
				})
	
				$("#btn_add_emailBox_menu").off("click").on("click", function() {
					do_lc_show_box_newConfig(hash_pwd_02);
				})
				
				$("#btn_show_list_mail_secu_menu").off("click").on("click", function() {
					do_lc_get_list_mail_secu();
				})
				
				$("#btn_add_emailBox_menu_mobile").off("click").on("click", function() {
					do_lc_show_box_newConfig(hash_pwd_02);
				})
				
				let folderData = JSON.parse(localStorage.getItem(pr_FOLDER_EMAIL)) || null;
				
				let data = folderData ?  App.data.eConfig.find(config => config.email == folderData.data.mailBox) :  App.data.eConfig.length ? App.data.eConfig[0] : null;
				if(!!data)  do_lc_get_folder_lst_config(data, data.email);
				
					
//				if(App.data.eConfig.length){
//					let data = App.data.eConfig[0];
//					if(!!data){
//						do_lc_get_folder_lst_config(data, data.email);
//					}
//				}
			}

			$("#btn_change_password_cfg").off("click").on("click", function() {
				do_lc_show_box_change();
			})

			$("#btn_add_emailBox").off("click").on("click", function() {
				do_lc_show_box_newConfig(hash_pwd_02);
			})
			
			$("#btn_show_list_mail_secu").off("click").on("click", function() {
				do_lc_get_list_mail_secu();
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
					
					let folderData = JSON.parse(localStorage.getItem(pr_FOLDER_EMAIL)) || null;
					let emailData = JSON.parse(localStorage.getItem(pr_FOLDER_EMAIL_LST)) || null;
					
					if(folderData && folderData.data.mailBox === email) localStorage.removeItem(pr_FOLDER_EMAIL);
					if(emailData && emailData.data.mailBox === email)   localStorage.removeItem(pr_FOLDER_EMAIL_LST);
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
						do_lc_get_folder_lst_config(data, email);
					}
				}
			})
			
			$(".btn-resize").off("click").on("click", function(){
				let $this 		= $(this);
				let {divtoogle} = $this.data();
				let child 		= $this.find("i");
				let label 		= $this.find(".label-resize");
				child			.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle)	.toggle("hide");
	
				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
		}

		
		//--------------------------------------------------------
		var do_lc_get_list_mail_secu = function() {

			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceMsgMessage", "SVNotificationEmailSecretLst", {});

			let fSucces 	= [];
			fSucces.push(req_gl_funct(null, do_lc_get_list_mail_reponse, []));

			let fError 	= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_get_list_mail_reponse = function(sharedJson) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson.res_data;
				App.MsgboxController.do_lc_show({
					title 		: $.i18n("msgbox_confirm_title"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MSGBOX_LIST_EMAIL_SECRET		, data),
					autoclose	: false,
					buttons 	: {
						CALCEL 	: {
							lab 		: $.i18n("common_btn_close"),
						}
					}
				});
				
				if(data.stat == 2) $(".action_delete").find("i").hide();
				do_lc_binding_event_email_secu()
			} else {
			}
		}
		
		const do_lc_binding_event_email_secu = function(){
			$(".action_delete").off("click").on("click", function() {
				let {id, code} = $(this).parent().data();
				do_lc_send_delete_email_secu(id, code);
			})
		}
		
		var do_lc_send_delete_email_secu = function(id, code) {

			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceMsgMessage", "SVNotificationEmailSecretDelete", {code});

			let fSucces 	= [];
			fSucces.push(req_gl_funct(null, do_lc_send_delete_email_secu_reponse, [id]));

			let fError 	= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_lc_send_delete_email_secu_reponse = function(sharedJson, id) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				$(".action_delete[data-id='"+ id +"'").find("i").hide();
				$(".emailSecu_stat[data-id='"+ id +"'").text($.i18n("prj_msgbox_secu_stat_del_ping"));
			} else {
			}
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
		var do_lc_show_box_newConfig = function(hash_pwd_02){
			App.MsgboxController.do_lc_show({
				title 		: $.i18n("msgbox_confirm_title"),
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MSGBOX_CONFIG_FORM		, {}),
				autoclose	: false,
				buttons 	: {
					SEND 	: {
						lab 		: $.i18n("common_btn_send"),
						funct 		: do_lc_req_info_config,
						param       : [hash_pwd_02],
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
					el				: $("#inp_imap_config")	, source	: App.data.emm.cfgMailConfigs	, displayAttrLst : ["host_name"]	, minLength: 0, 
					renderAttrLst	: ["host_addr"]			, dataZone	: $("#div_imap_config")			, appendTo: ".msg-box"
			}
			do_gl_autocomplete_new(optionImaps);

			let optionSmtps = {
					el				: $("#inp_smtp_config")	, source	: App.data.emm.cfgMailConfigs	, displayAttrLst : ["host_name"]	, minLength: 0, 
					renderAttrLst	: ["host_addr"]			, dataZone	: $("#div_smtp_config")			, appendTo: ".msg-box"
			}
			do_gl_autocomplete_new(optionSmtps);
		}

		var do_lc_req_info_config = function(hash_pwd_02){
			let config = req_gl_data({
				dataZoneDom		: $("#div_config_form")
			})

			if(config.hasError)	return false;

			do_lc_save_config(config.data, hash_pwd_02);
		}

		var do_lc_save_config = function(data, hash_pwd_02){
			if(!App.data.eConfig || App.data.eConfig == "{}")	App.data.eConfig = [];
			App.data.eConfig.push(data);

			do_lc_script_config(App.data.eConfig, hash_pwd_02);
		}

		var do_lc_script_config = function(listConfig, hash_pwd_02){
			let cfgString 	= JSON.stringify(listConfig);
			let pwdConfig01 = localStorage.getItem(pr_HASH_PWDCONFIG_01);
		//	let pwdConfigOld = localStorage.getItem(pr_HASH_PWDCONFIG_old);

			let dataEnc 	= do_gl_encrypt_aes(pwdConfig01, cfgString);
			do_lc_save_config_data(dataEnc, listConfig, hash_pwd_02);
		}

		var do_lc_save_config_data = function(dataEnc, listConfig, hash_pwd_02) {
			let dataSend 		= {
					email_conf	: dataEnc									                           , hash  : localStorage.getItem(pr_HASH_PWDCONFIG_02), 
					hash_old	: hash_pwd_02? hash_pwd_02 : localStorage.getItem(pr_HASH_PWDCONFIG_02), hash01: localStorage.getItem(pr_HASH_PWDCONFIG_01)
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
			$(".modal").length && App.MsgboxController.do_lc_close(); //sao close 
		}
		//------------- End add new mail box ---------------------

		//------------- Start get folder ---------------------
		var do_lc_get_folder_lst_config = function(data, email){	
			let cfgString 	= JSON.stringify(data);
			let pwdConfig01 = localStorage.getItem(pr_HASH_PWDCONFIG_01);
			let dataEnc 	= do_gl_encrypt_aes(pwdConfig01, cfgString);
			do_lc_get_folder_lst(dataEnc, email);
		}

		var do_lc_get_folder_lst = function(dataEnc, email){
			let dataSend		= {email_conf: dataEnc, hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), pass: localStorage.getItem(pr_HASH_PWDCONFIG_01)};
			let ref				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_FOLDER_LST, dataSend);

			let fSucces 		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_folder_lst, [dataEnc, email]));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_show_folder_lst = function(sharedJson, dataEnc, email){
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				if(!data.mailBox) data.mailBox = email;
				App.controller.PrjEmail.Folder.do_lc_show(data, dataEnc);
				
				localStorage.setItem(pr_FOLDER_EMAIL, JSON.stringify({
					  "time": new Date(),
					  "data": data
					}));
			} else {
				$("#div_email_folder").html("");
				$("#div_EMM_Content").html("<p class='text-danger'>" + $.i18n("prj_email_msg_no_connect") + "</p>")
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
						classBtn	: "btn-primary",
						autoclose	: false
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


	var EmailMessageCompose 	= function () {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_MSG_SEND			= "SVMailSendSimple";

		const pr_HASH_PWDCONFIG_01 	= "hash_pwdConfig_01";
		const pr_HASH_PWDCONFIG_02 	= "hash_pwdConfig_02";
		const pr_STRING_SECURITY	= "with_SECURITY_";
		
		const pr_prefix_subj_crypto = "[SSN]";
		var pr_list_file_input	= [];
		
		var pr_path_img_noImg 		= "";
		
		var pr_withSecu             = false;

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
			var title = $.i18n("prj_email_msg_new_title");
			if(newMsg.subj)	title= newMsg.subj;
			
			obj = {files: []};
			
			App.MsgboxController.do_lc_show({
				title 		: title,
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MESSAGE_COMPOSE		, newMsg),
				autoclose	: false,
				buttons 	: {
					SEND 	: {
						lab 		: $.i18n("common_btn_send") + "<i class='fab fa-telegram-plane ml-1'></i>",
						funct 		: do_lc_get_msg_info,
						param		: [folders, dataEnc, obj],
						classBtn	: "btn-primary",
						autoclose	: false
					},
					CALCEL 	: {
						lab 		: $.i18n("common_btn_close"),
					}
				},
				bindEvent: function() {
					/*do_gl_init_fileDropzone($("#prj_email_msg_dropzone_send"), {obj,
						fileinput : {
							param : {typ01: 1, typ02: TYPE_02_FILE_ALL_FORMAT},
							autoProcessQueue :false //for not auto send file
						}
					}); */
					pr_list_file_input = do_gl_init_fileDropzone($("#prj_email_msg_dropzone_send"), {obj,
						fileinput : {
							saveDB : false,
							autoProcessQueue :false //for not auto send file
						}	
					});
					App.SummerNoteController.do_lc_show("#frm_new_msg");
				}
			});
		}
		
		var do_lc_get_msg_info = async function(folders, dataEnc, obj){
		
			
			let dataMsg = req_gl_data({
				dataZoneDom		: $("#frm_new_msg")
			})

			if(dataMsg.hasError)	return false;
			
			/*if(dataMsg.data.lock && dataMsg.data.lock > 0) {
			//	dataMsg.data.subj 	= pr_prefix_subj_crypto + CryptoJS.AES.encrypt(dataMsg.data.subj, dataMsg.data.lock);
				dataMsg.data.subj   = pr_prefix_subj_crypto + do_gl_encrypt_aes(dataMsg.data.subj, dataMsg.data.lock);
				dataMsg.data.body   = do_gl_encrypt_aes(dataMsg.data.body, dataMsg.data.lock);
			//	dataMsg.data.body 	= CryptoJS.AES.encrypt(dataMsg.data.body, dataMsg.data.lock);
			}
			*/
			if(dataMsg.data.to)	{
				let splitMail = dataMsg.data.to.split(/[<>]/); 
				if (splitMail.length == 1){
					dataMsg.data.to = splitMail[0]; //case : "adm@gmail.com"
				} else {
					dataMsg.data.to = splitMail[1]; //case : "<ADM Adm> adm@gmail.com"
				}
			}
			
			let msg = dataMsg.data;
			
			if (dataMsg.data.lock && dataMsg.data.lock > 0){
				await do_lc_get_msg_with_lock(folders, dataEnc, msg);
			} else {
				await do_gl_send_data_with_dropzone(); 
				
				tmp = [];
				obj.files.forEach((path)=> {
					obj = {
						path : decodeURIComponent(path)
					}
					tmp.push(obj);
				})
				
				msg.files = JSON.stringify(tmp);
				
				do_lc_send_mail(folders, dataEnc, msg);
				App.MsgboxController.do_lc_close();
				
			}
		}
		
		var do_lc_send_mail = function(folders, dataEnc, msg, withSecu, subj_Orig){			
			
			let dataSend	= {hash : localStorage.getItem(pr_HASH_PWDCONFIG_02), email_conf : dataEnc	, pass: localStorage.getItem(pr_HASH_PWDCONFIG_01), from : folders.mailBox};

			let ref			= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_MSG_SEND, msg, dataSend);
			ref["withSecu"]	= withSecu;
			ref["subj_Orig"]= subj_Orig;

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
	
		var do_lc_encrypt_file = async function (hash_lock, inputs) {
			let files = "";
			//let obj   = {};
			for (let i = 0; i < inputs.length; i++){
				input = inputs[i];
				//if(input.files.length){
					let encrypted  = await do_gl_encrypt_aes_file_new(hash_lock, input)
					.catch(function(err){
						console.error(err);
						return;
					});	
					/*obj = {
						file: encrypted,
						name: input.name
					}
					files.push(obj);*/
					if (i == 0) files +=  encrypted;
					else files += "|$|$|" +  encrypted;
					 
				//}
			}
			/*inputs.each(async (ind, input) => {
				if(input.files.length){
					let encrypted  = await do_gl_encrypt_aes_file_new(hash_lock, input.files[0])
					.catch(function(err){
						console.error(err);
						return;
					});	
					files.push(encrypted);
				}
				
			});*/
			return files;
		}
		
		const do_lc_up_file = function(files, folders, dataEnc, msg, with_secu, subj_Orig){
			let ref = new FormData();
			ref.append('sv_class'	, 'ServiceTpyDocument');
			ref.append('sv_name'	, 'SVTpyDocumentNewPublic');
			ref.append('typ01'		, 1);
			ref.append('typ02'		, 1);
			ref.append(`file0`, files);
			ref.append(`show_Path`, 1);

			let fSucces 	= [];
			fSucces.push(req_gl_funct(null, do_lc_after_upload_file, [folders, dataEnc, msg, with_secu, subj_Orig]));

			let fError 	= req_gl_funct(null, do_lc_upload_error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax_form(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_upload_error = (sharedJson, msg) => do_gl_show_Notify_Msg_Error (msg);

		const do_lc_after_upload_file = function(sharedJson, folders, dataEnc, msg, with_secu, subj_Orig){
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				if(data && data.length){

					let lstImage = [];
					
					obj = {
						path : decodeURIComponent(data[0].path02)
					}
					
					lstImage.push(obj);
					msg.files  	= JSON.stringify(lstImage);
					
					do_lc_send_mail(folders, dataEnc, msg, with_secu, subj_Orig);
					App.MsgboxController.do_lc_close();
				
				}
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n("common_err_ajax"));	
			}
		}
		
		var dataURLtoFile = function (dataurl, filename) {
 
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }


		var do_lc_get_msg_with_lock = async function (folders, dataEnc, msg){
			let subj_Orig   = msg.subj;
			let hash_lock 	= rq_gl_Crypto(msg.lock);
			delete msg.lock;
			
			var num = "["+ req_gl_DateStr_From_DateObj (new Date(), "yyMMddHHmmss") +"]";
			
			msg.subj   = pr_prefix_subj_crypto + num + do_gl_encrypt_aes(hash_lock, msg.subj);
			msg.body   = do_gl_encrypt_aes(hash_lock, JSON.stringify(msg.body));
			
			let files = [];
			
//			let inputs 	= $("#frm_new_msg").find("[type='file']");
//			if(inputs.length>0) {	
//				 files = await do_lc_encrypt_file(hash_lock, inputs);
//			}
			
			if(pr_list_file_input.length>0 && pr_list_file_input[0].files.length > 0) {	
				files = await do_lc_encrypt_file(hash_lock, pr_list_file_input[0].files);

 				files = "data:image/png;base64," + btoa(files);
				var image = dataURLtoFile(files, 'noImg.png', { type: "image/png" });
				do_lc_up_file(image, folders, dataEnc, msg, true, subj_Orig);
				
			} else {
				do_lc_send_mail(folders, dataEnc, msg, true, subj_Orig);
				App.MsgboxController.do_lc_close();
			}
			
			/*newMsg     = {
				body: msg.body, 
				files: files
			}
			msg.body   = do_gl_encrypt_aes(hash_lock, JSON.stringify(newMsg));*/
			
		//	return msg;
		
		}
	};


	var EmailMessageContent 	= function () {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		var pr_ctr_Main				= null;

		const self                  = this;
		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_MSG_LST			= "SVMailFolderCotentLst";
		const pr_MSG_LST_STAT		="SVMailFolderCotentLstWithStat";
		const pr_MSG_GET            = "SVMailGet";
		const pr_MSG_DEL       		= "SVMailDel"
		const pr_LST_MSG_DEL       	= "SVMailDelList"

		const pr_HASH_PWDCONFIG_01 	= "hash_pwdConfig_01";
		const pr_HASH_PWDCONFIG_02 	= "hash_pwdConfig_02";

		const pr_STRING_SECURITY	= "with_SECURITY_";
		
		const pr_prefix_subj_crypto = "[SSN]";
		
		const pr_typ_unread			= 1;
		const pr_typ_important		= 2;
		const pr_typ_spam			= 3;
		
		const pr_MSG_UNREAD			= "SVMailUnRead";
		const pr_MSG_IMPORTANT		= "SVMailImportant";
		const pr_MSG_SPAM			= "SVMailSpam";

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

		this.do_lc_get_msg_by_id = function(dataSend, dataEnc, folder, folders){
			let ref				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_MSG_GET, dataSend);

			let fSucces 		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_msg_content, [dataEnc, folder, folders]));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_lc_add_path_src_html = (data) => {
			if (data.body && data.lstPaths){
				const $div = $(data.body);
				var lstImg = $div.find("img");
				if (lstImg.length > 0){
					for (let i = 0; i < lstImg.length; i++){
						let e = lstImg[i];
						e.src = data.lstPaths[i];
						$div.find("img")[i] = e;
					}
				}
				data.body = $div.html();
			}
			return data;
		}
		
		//---------lam----------
		var do_lc_show_req_password_crypto = (dataEnc, data, folder, folders) => {
			App.MsgboxController.do_lc_show({
				title 		: $.i18n("msgbox_confirm_title"),
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMMSECU_MSGBOX_LOCK_EMAIL		, {}),
				autoclose	: false,
				buttons 	: {
					SEND 	: {
						lab 		: $.i18n("common_btn_send"),
						funct 		: do_lc_check_pwd_crypto,
						param		: [dataEnc, data, folder, folders],
						autoclose	: false,
						classBtn	: "btn-primary"
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
		
		var do_lc_check_pwd_crypto = (dataEnc, data, folder, folders) => {
			let pwd = $("#inp_pwd_crypto").val();

			if(pwd && pwd.length){
				
			}
		}
		
		var do_lc_show_msg_content = function(sharedJson, dataEnc, folder, folders){
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				let dataAddPatj = do_lc_add_path_src_html(data);
				
				self.do_lc_show(dataEnc, data, folder, folders);
				/*if (dataAddPatj.subj.includes(pr_prefix_subj_crypto)) {
					do_lc_show_req_password_crypto(dataEnc, data, folder, folders);
				} else {
					self.do_lc_show(dataEnc, data, folder, folders);
				}*/
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		//--------------------------------------------------------------------------------------------------		
		var do_lc_loadView =  function(){		
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MESSAGE_CONTENT	, EmailSecu_Message_Content);      	
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MSGBOX_MAIL_SECURE	, EmailSecu_Msgbox_Mail_Secure);
		}

		var do_lc_build_page = function(dataEnc, mailContent, folder, folders){
			$("#div_msg_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MESSAGE_CONTENT		, {mailContent, folder}));
			
			if(mailContent.files){
					
				for(let i=0; i < mailContent.files.length; i++){
					let tmpl = "";
					const fileItem = mailContent.files[i];
					
					if(fileItem.isBase64){
						let {file, fileName} = fileItem;
						tmpl =  "<a href='" + file  + "' target='_blank' class='mr-3 text-decoration-underline' download = " + fileName
						+ " >" + fileName + "</a>";
					} else {
						let file = fileItem;
					
						let indice   = file.lastIndexOf("\\");
						let fileName = file.slice(indice + 1);
					
						tmpl =  "<a href='" + file  + "' target='_blank' class='mr-3 text-decoration-underline' >" + fileName + "</a>";
					}
					
					
					$("#div-message-content-files").append(tmpl);
				}
			}
				
           
			do_gl_scrollToEle("#btn_rep_email");
			
			do_lc_bind_event(folder, folders, dataEnc, mailContent);
		}

		var do_lc_bind_event = function(folder, folders, dataEnc, mailContent){
			$("#btn_rep_email").off("click").on("click", function() {
				let newMsg = {to: mailContent.from, subj: "Re:" + mailContent.subj};
				App.controller.PrjEmail.MsgCompose.do_lc_show(folders, dataEnc, newMsg);
			})
			$("#btn_transfer_email").off("click").on("click", function() {
				let newMsg = {from: $.i18n("prj_email_msg_from") +mailContent.from, subj:"Fwd:"+ mailContent.subj,body: mailContent.body};
				App.controller.PrjEmail.MsgCompose.do_lc_show(folders, dataEnc, newMsg);
			})
			$("#btn_delete_email").off("click").on("click", function() {
				let {id, title} = $(this).data();
				
				let data = App.data.eConfig.find( x => x.email = folders.mailBox) || null;
				
				let cfgString 	= JSON.stringify(data);
				let pwdConfig01 = localStorage.getItem(pr_HASH_PWDCONFIG_01);
				let dataEnc 	= do_gl_encrypt_aes(pwdConfig01, cfgString);
				
				
				let dataSend 		= {
						"email_id": id, "email_title": title, "folder" : folder, email_conf: dataEnc, hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), pass: localStorage.getItem(pr_HASH_PWDCONFIG_01)
				}
				
				do_lc_delete_email(dataSend, dataEnc, folder, folders);
			});
			
			$("#btn_delete_email_secure").off("click").on("click", function() {
				let {id, title} = $(this).data();
				
				let data = App.data.eConfig.find( x => x.email = folders.mailBox) || null;
				
				let cfgString 	= JSON.stringify(data);
				let pwdConfig01 = localStorage.getItem(pr_HASH_PWDCONFIG_01);
				let dataEnc 	= do_gl_encrypt_aes(pwdConfig01, cfgString);
				
				
				let dataSend 		= {
						"email_id": id, "email_title": title, "folder" : folder, email_conf: dataEnc, hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), pass: localStorage.getItem(pr_HASH_PWDCONFIG_01)
				}
				
				do_lc_delete_email(dataSend, dataEnc, folder, folders);
				
				
				let code = title.substring(title.lastIndexOf("[") + 1, title.lastIndexOf("]"));
				do_lc_send_notification_delete_email_secure({code});
			});
			
			$("#btn_unread_email").off("click").on("click", function() {
				let {id, title} = $(this).data();
				let data = App.data.eConfig.find( x => x.email = folders.mailBox) || null;
				let cfgString 	= JSON.stringify(data);
				let pwdConfig01 = localStorage.getItem(pr_HASH_PWDCONFIG_01);
				let dataEnc 	= do_gl_encrypt_aes(pwdConfig01, cfgString);
				let dataSend 		= {
						"email_id": id, "email_title": title, "folder" : folder, email_conf: dataEnc, hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), pass: localStorage.getItem(pr_HASH_PWDCONFIG_01)
				}
				
				do_lc_more_option_email(dataSend, dataEnc, folder, folders,pr_typ_unread);
			});
			
			$("#btn_important_email").off("click").on("click", function() {
				let {id, title} = $(this).data();
				let data = App.data.eConfig.find( x => x.email = folders.mailBox) || null;
				let cfgString 	= JSON.stringify(data);
				let pwdConfig01 = localStorage.getItem(pr_HASH_PWDCONFIG_01);
				let dataEnc 	= do_gl_encrypt_aes(pwdConfig01, cfgString);
				let dataSend 		= {
						"email_id": id, "email_title": title, "folder" : folder, email_conf: dataEnc, hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), pass: localStorage.getItem(pr_HASH_PWDCONFIG_01)
				}
				do_lc_more_option_email(dataSend, dataEnc, folder, folders,pr_typ_important);
			});
			
			$("#btn_spam_email").off("click").on("click", function() {
				let {id, title} = $(this).data();
				let data = App.data.eConfig.find( x => x.email = folders.mailBox) || null;
				let cfgString 	= JSON.stringify(data);
				let pwdConfig01 = localStorage.getItem(pr_HASH_PWDCONFIG_01);
				let dataEnc 	= do_gl_encrypt_aes(pwdConfig01, cfgString);
				let dataSend 		= {
						"email_id": id, "email_title": title, "folder" : folder, email_conf: dataEnc, hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), pass: localStorage.getItem(pr_HASH_PWDCONFIG_01)
				}
				do_lc_more_option_email(dataSend, dataEnc, folder, folders,pr_typ_spam);
			});
		}
		
		var do_lc_delete_notification_email_secure = function(dataSend) {
			let ref				= req_gl_Request_Content_Send_With_Params("ServiceMsgMessage", "SVNotificationEmailSecretDelete", dataSend);

			let fSucces 		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_notif_delete_email_reponse, []));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_show_notif_delete_email_reponse = function(sharedJson) {
			if (can_gl_AjaxSuccess(sharedJson)) {
			} else {
				do_gl_show_Notify_Msg_Error($.i18n('prj_email_pwd_config_pwd_forget_send_error'));
			}
		}
		
		var do_lc_more_option_email = function(dataSend, dataEnc, folder, folders,typ) {
			let ref				= {};
			if(typ == pr_typ_unread)	ref = req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_MSG_UNREAD, dataSend);
			if(typ == pr_typ_important)	ref = req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_MSG_IMPORTANT, dataSend);
			if(typ == pr_typ_spam)		ref = req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_MSG_SPAM, dataSend);
			
			let fSucces 		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_option_email_reponse, [dataEnc, folder, folders, typ]));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_show_option_email_reponse = function(sharedJson, dataEnc, folder, folders, typ) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data 				= sharedJson[App['const'].RES_DATA];
				if(data === true){
					do_gl_show_Notify_Msg_Info($.i18n('prj_email_msg_change_stat_success'));
					if(typ == pr_typ_spam)	App.controller.PrjEmail.MsgList.do_lc_get_lst_msg_in_folder(dataEnc, folder, folders);
				} else {
					do_gl_show_Notify_Msg_Error($.i18n('prj_email_msg_new_error'));
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n('prj_email_pwd_config_pwd_forget_send_error'));
			}
		}
		
		
		var do_lc_delete_email = function(dataSend, dataEnc, folder, folders) {
			let ref				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_MSG_DEL, dataSend);

			let fSucces 		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_delete_email_reponse, [dataEnc, folder, folders]));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_show_delete_email_reponse = function(sharedJson, dataEnc, folder, folders) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data 				= sharedJson[App['const'].RES_DATA];
				if(data === true){
				//App.controller.PrjEmail.MsgList.do_lc_show(dataEnc, folder, folders);
					App.controller.PrjEmail.MsgList.do_lc_get_lst_msg_in_folder(dataEnc, folder, folders);
				} else {
					do_gl_show_Notify_Msg_Error($.i18n('prj_email_msg_new_error'));
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n('prj_email_pwd_config_pwd_forget_send_error'));
			}
		}
		
		var do_lc_detect_mail_security = function(dataEnc, mailContent, folder, folders){
			//let isMailSecure = mailContent.subj.indexOf(pr_STRING_SECURITY) >= 0;
			let isMailSecure = mailContent.subj.indexOf(pr_prefix_subj_crypto) >= 0;
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
		
		const do_lc_transfer_base64_to_file = (strBase64) => {
			const urltoFile = (url, filename, mimeType) => {
		        return (fetch(url)
		            .then(function(res){return res.arrayBuffer();})
		            .then(function(buf){return new File([buf], filename,{type:mimeType});})
		        );
		    };

			return new Promise((resolve) => {
				urltoFile(strBase64, 'hello.txt' + new Date().getTime(),'text/plain')
	    		.then(function(file){
						console.log(file);
						resolve(file);
					}
				);
			});
		}

		var do_lc_check_mail_secure = async function(dataEnc, mailContent, folder, folders){
			let info_secure = req_gl_data({
				dataZoneDom		: $("#div_pwd_mail_secure")
			});

			if(info_secure.hasError)	return false;

			let pwd_secure 	= info_secure.data.password;
			let mail		= mailContent.subj.replace(pr_prefix_subj_crypto, "");
			mail            = mail.slice(mail.indexOf("]") + 1);

			let hash_pwd 	= rq_gl_Crypto(pwd_secure.trim());

			try {
				mailContent.subj = do_gl_decrypt_aes(hash_pwd, mail);
				mailContent.body = do_gl_decrypt_aes(hash_pwd, mailContent.body.trim());

				if (mailContent.files && mailContent.files.length > 0){
					let imageFile= await fetch(mailContent.files[0]).then(r => r.blob()).then( blobFile => new File([blobFile], "noImg.jpg", { type: "image/png" }));
					let imageBase64 = await do_lc_open_File(imageFile);
					imageBase64 = imageBase64.replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","");
					imageBase64 = atob(imageBase64);
					
					let objFile = [];
					
					let listImage = imageBase64.split("|$|$|");
					
					for (let i = 0; i < listImage.length; i++){
						e = listImage[i];
						
						let name = e.split("|:|:|")[0];
						let file = e.split("|:|:|")[1];
	
						name	= await do_gl_decrypt_aes_file_new(hash_pwd, name).replace(/\s/g, '');
						file	= await do_gl_decrypt_aes_file_new(hash_pwd, file);
						
						objFile.push({fileName: name, file : file, isBase64: true});	
					} 

					mailContent.files = objFile;
				}
				
				/*let content =  do_gl_decrypt_aes(hash_pwd, mail);
				let data 	= JSON.parse(content);
				mailContent = Object.assign(mailContent, data);*/
				do_lc_build_page(dataEnc, mailContent, folder, folders);
				
				App.MsgboxController.do_lc_close();
			} catch (e) {
				do_gl_show_Notify_Msg_Error($.i18n('prj_email_msg_secure_pwd_error'));
			}
		}

	};


	var EmailMessageList 	= function () {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		var pr_ctr_Main				= null;

		var self                    = this;
		
		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_MSG_LST			= "SVMailFolderCotentLst";
		const pr_MSG_LST_STAT		="SVMailFolderCotentLstWithStat";
		const pr_LST_MSG_DEL       	= "SVMailDelList"

		var pr_BEGIN				= 19;//Begin from last , oldest email has id = 0;
		const pr_NUMBER_RECORD		= 20;

		const pr_HASH_PWDCONFIG_01 	= "hash_pwdConfig_01";
		const pr_HASH_PWDCONFIG_02 	= "hash_pwdConfig_02";
		
		const pr_FOLDER_EMAIL_LST 	= "folder_email_lst";
		
		const FLAG_UNREAD 			= 8;
		const FLAG_RECENT 			= 5;
		const FLAG_SEEN 			= 6;

		//--------------------------------------------------------------------------------------------------
		this.set_begin_number_record_defaut = () => {
			pr_BEGIN = 19;
		}
		this.do_lc_init = function(){
			pr_ctr_Main 								= App.controller.PrjEmail.Main;
			tmplName.EMAIL_SECU_MESSAGE_LIST 			= "EmailSecu_Message_List";
			tmplName.EMAIL_SECU_MESSAGE_LIST_ELEMENT 	= "EmailSecu_Message_List_Element";
			
			do_lc_removeLS_lst_email();
		}

		this.do_lc_show	= function(data, dataEnc, folder, folders, event){
			do_lc_loadView();	
			do_lc_build_page(data, dataEnc, folder, folders, event);
		}
		
		var do_lc_removeLS_lst_email = function(){
			let EXPIRE_TIME = 1000*60*60;
			let mailData = JSON.parse(localStorage.getItem(pr_FOLDER_EMAIL_LST)) || {};
			let diff = new Date() - new Date(mailData.time || new Date());
			let timeout = Math.max(EXPIRE_TIME - diff, 0);
			  setTimeout(function() {
			      localStorage.removeItem(pr_FOLDER_EMAIL_LST);
			  }, timeout);
		}
		//--------------------------------------------------------------------------------------------------		
		var do_lc_loadView =  function(){		
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MESSAGE_LIST		        , EmailSecu_Message_List);
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_SECU_MESSAGE_LIST_ELEMENT		, EmailSecu_Message_List_Element);
		}

		var do_lc_build_page = function(data, dataEnc, folder, folders, event){
//			do_lc_get_lst_msg_in_folder(dataEnc, folder, folders);
			if(event && event == 1){
				$("#div_message_list_element")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MESSAGE_LIST_ELEMENT		, data.listMsg));
			}else{
				$("#div_EMM_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MESSAGE_LIST		, data));
				$("#div_message_list_element")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_SECU_MESSAGE_LIST_ELEMENT		, data.listMsg));
				
				if(data.folder_size <= pr_NUMBER_RECORD) $("#div_panigation").hide();
			}
			
			do_lc_bind_event(dataEnc, folder, data, folders);
		}

		var do_lc_bind_event = function(dataEnc, folder, mailList, folders){
			$("#btn_next_page").off("click").on("click", function() {
				let pr_next = 1;
				pr_BEGIN += pr_NUMBER_RECORD;
				self.do_lc_get_lst_msg_in_folder(dataEnc, folder, folders, pr_next);
			})

			$("#btn_prev_page").off("click").on("click", function() {
				let pr_prev = 2;
				pr_BEGIN -= pr_NUMBER_RECORD;
				if(pr_BEGIN < 0)	pr_BEGIN = 0;
				self.do_lc_get_lst_msg_in_folder(dataEnc, folder, folders, pr_prev);
			})

			$(".msg_item").off("click").on("click", function() {
				let {id, title, date} = $(this).data();
//				let mailContent = mailList.listMsg.find(mail => mail.id == id) || null;
//				if(!!mailContent){
//					App.controller.PrjEmail.MsgContent.do_lc_show(dataEnc, mailContent, folder, folders);
//				}
				let data = App.data.eConfig.find( x => x.email = folders.mailBox) || null;
				
				let cfgString 	= JSON.stringify(data);
				let pwdConfig01 = localStorage.getItem(pr_HASH_PWDCONFIG_01);
				let dataEnc 	= do_gl_encrypt_aes(pwdConfig01, cfgString);
				
				
				let dataSend 		= {
						"email_id": id, "email_title": title, "folder" : folder, email_conf: dataEnc, hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), pass: localStorage.getItem(pr_HASH_PWDCONFIG_01)
				}
				
				App.controller.PrjEmail.MsgContent.do_lc_get_msg_by_id(dataSend, dataEnc, folder, folders);
			})
			
			$("#btn_reload").off("click").on("click", function() {
				pr_BEGIN = 19;
				self.do_lc_get_lst_msg_in_folder(dataEnc, folder, folders);
			})
			
			
			$("#btn_delete_msg").off("click").on("click", function() {
				let lstChecked 	= $(".msg:checked");
				let lstId 		= [];
				let lstTitle	= [];
				
				let obj = {};
				for (let i = 0; i < lstChecked.length; i++){
					let e  = lstChecked[i];
					let id = e.id.match(/\d+/g).map(Number)[0];
					
					obj = {
						idEmail : id
					}
					lstId.push(obj);
					
					for (let j = 0; j < mailList.listMsg.length; j++){
						let m =  mailList.listMsg[j];
						if (m.id == id){
							obj = {
								titleEmail : m.subj
							}
							lstTitle.push(obj); 
							break;
						}
					}
				}
			
				let data = App.data.eConfig.find( x => x.email = folders.mailBox) || null;
				
				let cfgString 	= JSON.stringify(data);
				let pwdConfig01 = localStorage.getItem(pr_HASH_PWDCONFIG_01);
				let dataEnc 	= do_gl_encrypt_aes(pwdConfig01, cfgString);
				
				
				let dataSend 		= {
						"email_id": JSON.stringify(lstId), "email_title": JSON.stringify(lstTitle), "folder" : folder, email_conf: dataEnc, hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), pass: localStorage.getItem(pr_HASH_PWDCONFIG_01)
				}
				
				do_lc_delete_list_email(dataSend, dataEnc, folder, folders);
			})
			
			$("#item_flag_all").off("click").on("click", function() {
				do_lc_change_stat(dataEnc, folder, folders, null);
			})
			
			$("#item_flag_recent").off("click").on("click", function() {
				do_lc_change_stat(dataEnc, folder, folders, FLAG_RECENT);
			})
		
			$("#item_flag_unread").off("click").on("click", function() {
				do_lc_change_stat(dataEnc, folder, folders, FLAG_UNREAD);
			})
			
			$("#item_flag_seen").off("click").on("click", function() {
				do_lc_change_stat(dataEnc, folder, folders, FLAG_SEEN);
			})
			
			$(".btn-resize").off("click").on("click", function(){
				let $this 		= $(this);
				let {divtoogle} = $this.data();
				let child 		= $this.find("i");
				let label 		= $this.find(".label-resize");
				child			.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle)	.toggle("hide");
	
				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
		}
		
		var do_lc_change_stat = (dataEnc, folder, folders, flag) => {
			let dataSend 		= {
					hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), email_conf		: dataEnc	, folder,
					pass: localStorage.getItem(pr_HASH_PWDCONFIG_01), begin_from_last	: pr_BEGIN	, nb: pr_NUMBER_RECORD,
					flag: flag
			}

			let ref				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_MSG_LST_STAT, dataSend);

			let fSucces 		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_folder_lst_by_flag, [dataEnc, folder, folders, event, flag]));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_lc_delete_list_email = function(dataSend, dataEnc, folder, folders) {
			let ref				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_LST_MSG_DEL, dataSend);

			let fSucces 		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_delete_list_email_reponse, [dataEnc, folder, folders]));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_lc_show_delete_list_email_reponse = function(sharedJson, dataEnc, folder, folders) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data 				= sharedJson[App['const'].RES_DATA];
				if(data === true){
					let dataSend 		= {
						hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), email_conf		: dataEnc	, folder,
						pass: localStorage.getItem(pr_HASH_PWDCONFIG_01), begin_from_last	: pr_BEGIN	, nb: pr_NUMBER_RECORD
					}
		
					let ref				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_MSG_LST, dataSend);
		
					let fSucces 		= [];
					fSucces.push(req_gl_funct(null, do_lc_show_folder_lst, [dataEnc, folder, folders, event]));
		
					let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
					App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
				} else {
					do_gl_show_Notify_Msg_Error($.i18n('prj_email_msg_new_error'));
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n('prj_email_pwd_config_pwd_forget_send_error'));
			}
		}
		
		this.do_lc_get_lst_msg_in_folder = function(dataEnc, folder, folders, event){
			let dataSend 		= {
					hash: localStorage.getItem(pr_HASH_PWDCONFIG_02), email_conf		: dataEnc	, folder,
					pass: localStorage.getItem(pr_HASH_PWDCONFIG_01), begin_from_last	: pr_BEGIN	, nb: pr_NUMBER_RECORD
			}

			let ref				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_MSG_LST, dataSend);

			let fSucces 		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_folder_lst, [dataEnc, folder, folders, event]));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_lc_show_folder_lst_by_flag = function(sharedJson, dataEnc, folder, folders, event, flag){
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				if(!data.listMsg || !data.listMsg.length){
					pr_BEGIN = pr_BEGIN - pr_NUMBER_RECORD < 0 ? 0 : pr_BEGIN - pr_NUMBER_RECORD;
				} else {
					data.listMsg.reverse();
				}
				
				
				if (flag == null) { //all 
					if (data.listMsg && data.listMsg.length >= pr_NUMBER_RECORD) {
						data.listMsg = data.listMsg.slice(0, pr_NUMBER_RECORD);
					}
				} else if (flag == FLAG_UNREAD){ //unread
					let lstUnread = Object.assign({}, data);
					lstUnread.listMsg = [];
					for (let i = 0; i< data.listMsg.length; i++){
						if (!data.listMsg[i].flag){
							lstUnread.listMsg.push(data.listMsg[i]);
							if (lstUnread.listMsg.length >= pr_NUMBER_RECORD) {
								break;
							}
						}
					}
					data = Object.assign({}, lstUnread);
				} else { //seen, recent,...
					let lstMsgs = Object.assign({}, data);
					lstMsgs.listMsg = [];
					for (let i = 0; i< data.listMsg.length; i++){
						if (data.listMsg[i].flag && data.listMsg[i].flag[0] == flag){
							lstMsgs.listMsg.push(data.listMsg[i]);
							if (lstMsgs.listMsg.length >= pr_NUMBER_RECORD) {
								break;
							}
						}
					}
					data = Object.assign({}, lstMsgs);
					
				}
				 
				self.do_lc_show(data, dataEnc, folder, folders, event);
				
				localStorage.setItem(pr_FOLDER_EMAIL_LST, JSON.stringify({
					  "time": new Date(),
					  "data": {
						    begin_from_last : pr_BEGIN, 
						  	mailBox : folders.mailBox,
						  	folder  : folder,
						  	listMsg  : data.listMsg
					  		}
					}));
					
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
	


		var do_lc_show_folder_lst = function(sharedJson, dataEnc, folder, folders, event){
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				if(!data.listMsg || !data.listMsg.length){
					pr_BEGIN = pr_BEGIN - pr_NUMBER_RECORD < 0 ? 0 : pr_BEGIN - pr_NUMBER_RECORD;
				} else {
					data.listMsg.reverse();
				}
				
				self.do_lc_show(data, dataEnc, folder, folders, event);
				
				localStorage.setItem(pr_FOLDER_EMAIL_LST, JSON.stringify({
					  "time": new Date(),
					  "data": {
						    begin_from_last : pr_BEGIN, 
						  	mailBox : folders.mailBox,
						  	folder  : folder,
						  	listMsg  : data.listMsg
					  		}
					}));
					
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
	};

	//-----------------------------------------------------------------------------------------------------------------------------		
	//-----------------------------------------------------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------------------
	var EmailConfig 	= function () {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		var self 					= this;
		var pr_ctr_Main				= null;
		var pr_ctr_Menu				= null;
		
		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_SV_CONFIG_GET		= "SVUserConfGet";
		const pr_SV_CONFIG_DEL		= "SVUserConfDel";
		const pr_SV_VIEW_CONFIG		= "SVUserConfView";
		const pr_SV_NEW_PWD			= "SVUserSendNewPwd";
		const pr_SV_CHANGE_PWD		= "SVUserChangePwd"
		
		//--------------------------------------------------------------------------------------------------
		const pr_HASH_PWDCONFIG_01 	= "hash_pwdConfig_01";
		const pr_HASH_PWDCONFIG_02 	= "hash_pwdConfig_02";
		const pr_HASH_PWDCONFIG_OLD = "hash_pwdConfig_old";
		
		const pr_HASH_CONFIG_LST 	= "hash_config_lst";

		const pr_KEY_ENTER			= 13;
		
		const pr_salt				= "HNV";

		//--------------------------------------------------------------------------------------------------
		this.do_lc_init = function(){
			pr_ctr_Main 						= App.controller.PrjEmail.Main;
			pr_ctr_Menu 						= App.controller.PrjEmail.Menu;
			tmplName.EMMSECU_MSGBOX_PWD			= "EmailSecu_Msgbox_Pwd";
			tmplName.EMMSECU_MSGBOX_EMAIL		= "EmailSecu_Msgbox_Email";
			tmplName.EMMSECU_MSGBOX_RESET_PWD   = "EmailSecu_Msgbox_Reset_Password";
			tmplName.EMMSECU_MSGBOX_LOCK_EMAIL	= "EmailSecu_Msgbox_Pwd_Lock_Email";
		}

		this.do_lc_show	= function(){		
			do_lc_loadView();	
			do_lc_build_page();
		}

		//--------------------------------------------------------------------------------------------------		
		var do_lc_loadView =  function(){		
			tmplCtrl.do_lc_put_tmpl(tmplName.EMMSECU_MSGBOX_PWD		, EmailSecu_Msgbox_Pwd);  	
			tmplCtrl.do_lc_put_tmpl(tmplName.EMMSECU_MSGBOX_EMAIL		, EmailSecu_Msgbox_Email); 
			tmplCtrl.do_lc_put_tmpl(tmplName.EMMSECU_MSGBOX_RESET_PWD	, EmailSecu_Msgbox_Reset_Password);
			tmplCtrl.do_lc_put_tmpl(tmplName.EMMSECU_MSGBOX_LOCK_EMAIL	, EmailSecu_Msgbox_Pwd_Lock_Email); 
		}

		var do_lc_build_page = function(){
			do_lc_show_req_password();
		}

		var do_lc_show_req_password = function(mod){
			if(mod) App.MsgboxController.do_lc_close();
			App.MsgboxController.do_lc_show({
				title 		: $.i18n("msgbox_confirm_title"),
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMMSECU_MSGBOX_PWD		, {}),
				autoclose	: false,
				buttons 	: {
					SEND 	: {
						lab 		: $.i18n("common_btn_send"),
						funct 		: do_lc_make_pwd_config,
						param		: [mod],
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
		
		var do_lc_forget_pwd = function(hash, hash01) {
			
			let cfgString 	= JSON.stringify([]);
			let pwdConfig01 = localStorage.getItem(pr_HASH_PWDCONFIG_01);

			let dataEnc 	= do_gl_encrypt_aes(pwdConfig01, cfgString);
			
			let dataSend 		= {
					email_conf	: dataEnc,
					hash  : hash, 
					hash01: hash01
			}

			let ref 			= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_CHANGE_PWD, dataSend);

			let fSucces 		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_send_pwd_response, []));

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

		var do_lc_make_pwd_config = function(mod) {
			let pwd = $("#inp_pwd_config").val();

			if(pwd && pwd.length){
				let hash_pwd_01 = rq_gl_Crypto(pwd.trim());
				let hash_pwd_02 = rq_gl_Crypto(hash_pwd_01);
				
				
				let old_hash_pwd_02 = localStorage.getItem(pr_HASH_PWDCONFIG_02);

				localStorage.setItem(pr_HASH_PWDCONFIG_01, hash_pwd_01);
				localStorage.setItem(pr_HASH_PWDCONFIG_02, hash_pwd_02);
				//localStorage.setItem(pr_HASH_PWDCONFIG_OLD, old_hash_pwd_02);

				if(!mod) do_lc_send_pwd_config(hash_pwd_02);
				else{
					do_lc_forget_pwd(hash_pwd_02, hash_pwd_01);
					pr_ctr_Menu.do_lc_show({}, old_hash_pwd_02);
					App.MsgboxController.do_lc_close();
				}
				
			}
		}

		var do_lc_send_pwd_config = function(hash_pwd_02){
			let salt 				= pr_salt + Math.floor(Math.random() * Math.floor(10000000));	
			let hash_pwd_02_salt 	= rq_gl_Crypto(hash_pwd_02 + salt);
			
			let ref 	= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_CONFIG_GET, {hash: hash_pwd_02_salt, salt: salt});

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
					let cfgStr 			= null;
					if (data.info01){
						cfgStr 				= do_gl_decrypt_aes(pwdConfig01, data.info01);
					}
					if (cfgStr == null) 	cfgStr = "{}"; 
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
//					do_lc_add_email_toSend_newPwd();
					do_lc_confirm_reset_pwd();
				} else {
					do_gl_show_Notify_Msg_Error($.i18n('prj_email_msg_new_error'));
					do_lc_show_req_password();
				}
			} else {
				//do something
			}
		}

		var do_lc_confirm_reset_pwd = function(){
			App.MsgboxController.do_lc_show({
				title 		: $.i18n("msgbox_confirm_title"),
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.EMMSECU_MSGBOX_RESET_PWD		, {}),
				autoclose	: false,
				buttons 	: {
					SEND : {
						lab 		: $.i18n("common_btn_reset"),
						funct 		: do_lc_show_req_password,
						param		: [true],
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
				(event.keyCode == pr_KEY_ENTER) && do_lc_send_remove_config();
			});
		}
//		
//		var do_lc_get_new_pwd = function(){
//			let dataEmail = req_gl_data({
//				dataZoneDom		: $("#div_conf_email")
//			})
//
//			if(dataEmail.hasError)	return false;
//
//			do_lc_send_new_pwd(dataEmail.data.email);
//		}
//
//		var do_lc_send_new_pwd = function(email) {
//			let ref 	= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW_PWD, {email});
//
//			let fSucces = [];
//			fSucces.push(req_gl_funct(null, do_lc_after_send_newPwd_response, []));
//
//			let fError 	= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
//			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
//		}
//
//		var do_lc_after_send_newPwd_response = function(sharedJson) {
//			if (can_gl_AjaxSuccess(sharedJson)) {
//				App.MsgboxController.do_lc_close();
//				do_gl_show_Notify_Msg_Success($.i18n('prj_email_pwd_config_pwd_forget_send_success'));
//				do_lc_show_req_password();
//			} else {
//				do_gl_show_Notify_Msg_Error($.i18n('prj_email_pwd_config_pwd_forget_send_error'));
//			}
//		}
	};


	return { EmailFolder, EmailMenu, EmailMessageCompose, EmailMessageContent, EmailMessageList, EmailConfig};
});