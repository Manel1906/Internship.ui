define([
	'group/nso_email_group/ctrl/EmailGroupList',
	
	'text!group/nso_email_group/tmpl/EmailGroup_Main.html',
	], function(
			EmailGroupList,

			EmailGroup_Main) {

	var EmailGroupMain     			= function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;
		
		var pr_grpPath				= 'group/nso_email_group';
		var pr_showed		= false;

		var self 					= this;
		var var_lc_TYPE_SHOW        = null;
		var var_lc_GROUP_ID         = null;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			
			if (!App.controller.PrjEmailGroup) App.controller.PrjEmailGroup = {};
			
			
			if (!App.controller.PrjEmailGroup.List)  
				App.controller.PrjEmailGroup.List				= new EmailGroupList		(null, null, null);
			
			App.controller.PrjEmailGroup.List					.do_lc_init();
			
			tmplName.EMAIL_GROUP_MAIN 					= "EmailGroup_Main";
			tmplCtrl										.do_lc_put_tmpl(tmplName.EMAIL_GROUP_MAIN, EmailGroup_Main); 
		}     
		
		this.do_lc_show = function(sharedJson){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback, [sharedJson]);
				pr_showed = true;
			}else {
				self.do_lc_show_callback(sharedJson);
			}
		};			
		
		this.do_lc_show_callback = function(){
			try { 
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_GROUP_MAIN, {}));
				App.controller.PrjEmailGroup.List.do_lc_show();
				$(document).prop('title',$.i18n('prj_project_sidebar_email_group'));
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "EmailGroupMain", "do_lc_show", e.toString()) ;
			}
		};
		
		//--------------------------------------------------------------------------------------------------
	};

	return EmailGroupMain;
});