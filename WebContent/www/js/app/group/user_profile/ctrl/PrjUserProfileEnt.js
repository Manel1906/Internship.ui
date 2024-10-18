define([
	'text!group/user_profile/tmpl/PrjUser_Profile_Ent.html',
	"group/user_profile/ctrl/PrjUserProfileEntBlocks"
	],
	function(	
			PrjUser_Profile_Ent,
			
			{PrjUserProfileEntContent, PrjUserProfileEntAction, PrjUserProfileEntPass}
	){
	
	var PrjUserProfileEnt 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header  ? header : null;
		var pr_divContent 			= "#div_prj_content";
		var pr_divFooter 			= footer  ? footer : null;

		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divTabPerInfo 		= "#div_prj_info_person";

		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;

		var self 					= this;
		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 1000;
		const pr_SERVICE_CLASS		= "ServiceAutUser"; //to change by your need
		const pr_SV_GET				= "SVGet"; 
		var pr_SV_NEW				= "SVNew"; 
		var pr_SV_DEL				= "SVDel"; 

		var pr_SV_MOD				= "SVModSelf"; 	//if not use lock

		var pr_SV_LCK_NEW			= "SVLckReq";
		var pr_SV_LCK_END			= "SVLckEnd";
		var pr_SV_LCK_DEL			= "SVLckDel";
		//------------------------------------------------------------------------------------
		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_adm_all    		= 10;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.DBoard.DBoardMain;
			pr_ctr_List 			= App.controller.UI.List;
			pr_ctr_Ent				= App.controller.UI.Ent;

			if (!App.controller.UserProfile)			App.controller.UserProfile				= {};
			if (!App.controller.UserProfile.Ent)		App.controller.UserProfile.Ent 			= this;

			if(!App.controller.UserProfile.EntContent)	App.controller.UserProfile.EntContent 	= new PrjUserProfileEntContent	(null, null, null);
			if(!App.controller.UserProfile.EntAction)	App.controller.UserProfile.EntAction 	= new PrjUserProfileEntAction	(null, null, null);
			if(!App.controller.UserProfile.EntPass)		App.controller.UserProfile.EntPass 		= new PrjUserProfileEntPass		(null, null, null);
			
			tmplName.PRJ_USER_PROFILE_ENT					= "PrjUser_Profile_Ent";
		}
		//---------show-----------------------------------------------------------------------------
		var pr_grpPath 		= 'group/user_profile';
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
				let user 	= App.data.user;
				let obj 	= {};
				
				const params = req_gl_Url_Params();
				const id = params.id;
				const code01 = params.code;
				
				do_lc_load_view();
				
				if(!id || id === user.id){
					obj = user;
					obj.files 	= user.per && user.per.files ? user.per.files : [];
					do_lc_build_page(obj);
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
			fSucces.push(req_gl_funct(null, do_lc_get_Entity_response, []));
			
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_get_Entity_response = function(sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let data 		= sharedJson[App['const'].RES_DATA];
				do_lc_build_page(data);
			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), () => pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_user_profile.html`));
			}
		}
		
		const do_lc_load_view = function(){			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_PROFILE_ENT			, PrjUser_Profile_Ent);
			$("#div_main_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_PROFILE_ENT	, {}));
		}
		
		var do_lc_build_page = function(obj){
			do_lc_show_prj(obj);
		}
		
		var do_lc_show_prj = function(obj){
			App.controller.UserProfile.EntContent 	.do_lc_show_content(obj, pr_ctr_Main.var_lc_MODE_SEL);
			App.controller.UserProfile.EntAction 	.do_lc_show_action(obj, pr_ctr_Main.var_lc_MODE_SEL);
			App.controller.UserProfile.EntPass 		.do_lc_show_pass(obj);
		}
	};
	
	return PrjUserProfileEnt;
});