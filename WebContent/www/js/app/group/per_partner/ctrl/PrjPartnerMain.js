define([
	'group/per_partner/ctrl/PrjPartnerList02',
	'group/per_partner/ctrl/PrjPartnerEnt',
	'text!group/per_partner/tmpl/PrjPartner_Main.html',
	], function(
			PrjPartnerList02,
			PrjPartnerEnt,
			
			PrjPartner_Main) {

	var PrjPartnerMain     			= function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;
		var self 					= this;
		var var_lc_TYPE_SHOW        = null;
		var var_lc_GROUP_ID         = null;
		
		var RIGHT_U_G	        	= 30000011;

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if (!App.controller.PrjPartner) App.controller.PrjPartner = {};
			
			
			if (!App.controller.PrjPartner.List)  
				App.controller.PrjPartner.List				= new PrjPartnerList02		(null, null, null);
			
			if (!App.controller.PrjPartner.Ent)  
				App.controller.PrjPartner.Ent				= new PrjPartnerEnt		(null, null, null);
			
			App.controller.PrjPartner.List					.do_lc_init();
			App.controller.PrjPartner.Ent					.do_lc_init();
			
			tmplName.PRJ_PARTNER_MAIN = "PrjPartner_Main";
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_MAIN, PrjPartner_Main); 
		}     
		var pr_grpPath 		= 'group/per_partner';
		var pr_showed		= false;
		this.do_lc_show = function(){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback);
				pr_showed = true;
			}else {
				self.do_lc_show_callback();
			}
		};
		this.do_lc_show_callback		= function(){
			try { 
				var listUserRight = App.data.user.rights;
				if(!listUserRight){
					do_gl_show_Notify_Msg_Error($.i18n("prj_project_not_right_view"));
					return;
				}
				
				var isRight = listUserRight.includes(RIGHT_U_G);
				if(!isRight){
					do_gl_show_Notify_Msg_Error($.i18n("prj_project_not_right_view"));
					return;
				}
								
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_MAIN, {}));

				App.controller.PrjPartner.List.do_lc_show("#div_partner_list");
				$(document).prop('title',$.i18n('prj_project_sidebar_partner'));

			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjPartnerMain", "do_lc_show", e.toString()) ;
			}
		};
		
	};

	return PrjPartnerMain;
});