define([
	'group/nso_email_camp/ctrl/EmailCamList',
	
	'text!group/nso_email_camp/tmpl/EmailCam_Main.html',
	], function(
			EmailCamList,

			EmailCam_Main) {

	var EmailCamMain     			= function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;
		var self 					= this;
		var var_lc_TYPE_SHOW        = null;
		var var_lc_GROUP_ID         = null;
		
		var RIGHT_U_S	        	= 1000005;

		//--------------------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServiceEmailBox";
		const pr_SV_CFG_CONFIG_LST	= "SVCFGConfigList";
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			
			if (!App.controller.PrjEmailCam) App.controller.PrjEmailCam = {};
			
			
			if (!App.controller.PrjEmailCam.List)  
				App.controller.PrjEmailCam.List				= new EmailCamList		(null, null, null);
			
			App.controller.PrjEmailCam.List					.do_lc_init();
			
			tmplName.EMAIL_CAM_MAIN 						= "EmailCam_Main";
			tmplCtrl										.do_lc_put_tmpl(tmplName.EMAIL_CAM_MAIN, EmailCam_Main); 
		}    
		
		var pr_grpPath 		= 'group/nso_email_camp';
		var pr_showed		= false;
		this.do_lc_show = function(id, code, divContent, typ00, isPopup = false){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback);
				pr_showed = true;
			}else {
				self.do_lc_show_callback();
			}
		};  
		
		this.do_lc_show_callback		= function(){
			try { 
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_CAM_MAIN, {}));
				App.controller.PrjEmailCam.List.do_lc_show();
				$(document).prop('title',$.i18n('prj_project_sidebar_email_campaign'));
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "EmailCamMain", "do_lc_show", e.toString()) ;
			}
		};
		
		//--------------------------------------------------------------------------------------------------
	};

	return EmailCamMain;
});