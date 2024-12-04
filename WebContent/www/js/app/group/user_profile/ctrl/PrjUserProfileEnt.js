define([
	'text!group/user_profile/tmpl/PrjUser_Profile_Ent.html',
	'text!group/user_profile/tmpl/PrjUser_Profile_Ent_Content.html',
	'text!group/user_profile/tmpl/PrjUser_Profile_Ent_Action.html',
	'text!group/user_profile/tmpl/PrjUser_Profile_Ent_Pass.html',
			
	"group/user_profile/ctrl/PrjUserProfileEntBlocks"
	
	
	],
	function(	
			PrjUser_Profile_Ent,
			PrjUser_Profile_Ent_Content,
			PrjUser_Profile_Ent_Action,
			PrjUser_Profile_Ent_Pass,
			
			{PrjUserProfileEntContent, PrjUserProfileEntAction, PrjUserProfileEntPass}
	){
	
	var PrjUserProfileEnt 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header  ? header : null;
		var pr_divContent 			= "#div_prj_content";
		var pr_divFooter 			= footer  ? footer : null;

		var pr_grpName				= grpName?grpName:"PrjUserProfileEnt";
		var pr_grpPath 				= 'group/user_profile';
		
		App.template.names[pr_grpName] = {}; //---init only one time in Main ctrl

		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;

		var self 					= this;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServiceAutUser"; //to change by your need
		const pr_SV_GET				= "SVGet"; 
		//------------------------------------------------------------------------------------
		//------------------controllers------------------------------------------------------
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if (!App.controller.UserProfile)			App.controller.UserProfile				= {};
			if (!App.controller.UserProfile.Ent)		App.controller.UserProfile.Ent 			= this;

			if(!App.controller.UserProfile.EntContent)	App.controller.UserProfile.EntContent 	= new PrjUserProfileEntContent	(pr_grpName, null, null, null);
			if(!App.controller.UserProfile.EntAction)	App.controller.UserProfile.EntAction 	= new PrjUserProfileEntAction	(pr_grpName, null, null, null);
			if(!App.controller.UserProfile.EntPass)		App.controller.UserProfile.EntPass 		= new PrjUserProfileEntPass		(pr_grpName, null, null, null);
			
			tmplName.PRJ_USER_PROFILE_ENT					= "PrjUser_Profile_Ent";
			tmplName.PRJ_USER_PROFILE_ENT_CONTENT			= "PrjUser_Profile_Ent_Content";
			tmplName.PRJ_USER_PROFILE_ENT_ACTION			= "PrjUser_Profile_Ent_Action";
			tmplName.PRJ_USER_PROFILE_ENT_PASS				= "PrjUser_Profile_Ent_Pass";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_PROFILE_ENT				, PrjUser_Profile_Ent);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_PROFILE_ENT_CONTENT		, PrjUser_Profile_Ent_Content);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_PROFILE_ENT_ACTION		, PrjUser_Profile_Ent_Action);	
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_PROFILE_ENT_PASS			, PrjUser_Profile_Ent_Pass);
		}
		//---------show-----------------------------------------------------------------------------
		
		var pr_showed		= false;
		this.do_lc_show = function(div, type01, type02){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback, [div, type01, type02]);
				pr_showed = true;
			}else {
				self.do_lc_show_callback(div, type01, type02);
			}
		};
		
		this.do_lc_show_callback = function(div, type01, type02){               
			try{
				$("#div_main_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_PROFILE_ENT	, {}));
				
				
				let user 		= App.data.user;
				let obj 		= {};
				
				const params 	= req_gl_Url_Params();
				const id 		= params.id;
				const code01 	= params.code;
				
				if(!id || id === user.id){
					obj = user;
					obj.files 	= user.per && user.per.files ? user.per.files : [];
					do_lc_show_entity(obj);
				}else {
					do_lc_get_Entity(id, code01);
				}
			}catch(e) {
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		};
		
		const do_lc_get_Entity = function(id, code01){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id, code: code01});	
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_Entity_callback, []));
			
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_get_Entity_callback = function(sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let data 		= sharedJson[App['const'].RES_DATA];
				do_lc_show_entity(data);
			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), () => pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_user_profile.html`));
			}
		}
		
		var do_lc_show_entity = function(obj){
			App.controller.UserProfile.EntContent 	.do_lc_show_content	(obj, pr_ctr_Main.var_lc_MODE_SEL);
			App.controller.UserProfile.EntAction 	.do_lc_show_action	(obj, pr_ctr_Main.var_lc_MODE_SEL);
			App.controller.UserProfile.EntPass 		.do_lc_show_pass	(obj);
		}
	};
	
	return PrjUserProfileEnt;
});