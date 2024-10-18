define([
	'text!group/nso_email/tmpl/EmailSecu_Folder_List.html',
	],
	function(
			EmailSecu_Folder_List
	) {
	var EmailFolder 	= function () {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_MSG_LST			= "SVMailFolderCotentLst";
		
		const pr_NUMBER_RECORD		= 10;
		
		const pr_HASH_PWDCONFIG_01 	= "hash_pwdConfig_01";
		const pr_HASH_PWDCONFIG_02 	= "hash_pwdConfig_02";

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
		
		var do_lc_bind_event = function(folders, dataEnc){
			$(".folder-item").off("click").on("click", function() {
				let $this 					= $(this);
				let {id: idFolder, folder} 	= $this.data();
				if(idFolder !== null){
					$(".folder-item").removeClass("active");
					$this.addClass("active");
					
					App.controller.PrjEmail.MsgList.do_lc_show(dataEnc, folder, folders);
				}
			})
			
			$(".folder-item[data-folder='INBOX']").click();
			
			$("#btn_new_msg").off("click").on("click", function() {
				App.controller.PrjEmail.MsgCompose.do_lc_show(folders, dataEnc);
			})
		}
		
	};

	return EmailFolder;
});