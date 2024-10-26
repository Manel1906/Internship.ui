define([
	'group/user/client/ctrl/PrjUserList',
	'group/user/client/ctrl/PrjUserEnt',
	'group/dashboard/ctrl/PrjDashboardEnt',
	
	'text!group/user/client/tmpl/PrjUser_Main.html',
	'text!group/user/client/tmpl/PrjUser_List.html', 
	'text!group/user/client/tmpl/PrjUser_List_Content.html', 
	
	'text!group/user/client/tmpl/PrjUser_Ent.html',
	'text!group/user/client/tmpl/PrjUser_Ent_Content.html'	,
	'text!group/user/client/tmpl/PrjUser_Ent_Tab_JobPosition.html'	,
	'text!group/user/client/tmpl/PrjUser_Ent_Tab_Person_Info.html',	
    'text!group/user/client/tmpl/PrjUser_Sel_List_Legal_Status.html'	,
	'text!group/user/client/tmpl/PrjUser_Ent_Tab_Rights.html',
	'text!group/user/client/tmpl/PrjDropzone_File.html'

	], function(
			PrjUserList,
			PrjUserEnt,
			PrjDashboardEnt,
			
			PrjUser_Main,
			PrjUser_List, 
			PrjUser_List_Content,
			
			PrjUser_Ent,
			PrjUser_Ent_Content	,	
			PrjUser_Ent_Tab_JobPosition	,	
			PrjUser_Ent_Tab_Person_Info,
			PrjUser_Sel_List_Legal_Status,
			PrjUser_Ent_Tab_Rights,
			
			PrjDropzone_File
	) {

	var PrjUserMain     			= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"PrjUserClient";
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var self 					= this;
		var var_lc_TYPE_SHOW        = null;
		var var_lc_GROUP_ID         = null;
		
		var RIGHT_U_G	        	= 1000001;
		var RIGHT_ADM	        	= 100;
		var RIGHT_A_G	        	= 101;
		
		var Handlebars		=  require('handlebars');
		const TYP_USER = {
				2: "aut_user_ent_header_type_adm"	,	20: "aut_user_ent_header_type_doctor"	,	30: "aut_user_ent_header_type_agent"
//				40: "aut_user_ent_header_type_patient"
		}
		Handlebars.registerHelper('reqTypOfUser', function(typ) {
			if(!typ)				return $.i18n(TYP_USER[3]);
			if(!TYP_USER[typ])		return $.i18n(TYP_USER[3]);
	
			return $.i18n(TYP_USER[typ]);
		});
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
			
			tmplName.PRJ_USER_MAIN 						= pr_grpName + "PrjUser_Main";
			tmplName.PRJ_USER_LIST						= pr_grpName + "PrjUser_List";
			tmplName.PRJ_USER_LIST_CONTENT				= pr_grpName + "PrjUser_List_Content";
			
			tmplName.PRJ_USER_ENT						= pr_grpName + "PrjUser_Ent";
			tmplName.PRJ_USER_ENT_CONTENT				= pr_grpName + "PrjUser_Ent_Content";
			tmplName.PRJ_USER_ENT_TAB_JOBPOSITION		= pr_grpName + "PrjUser_Ent_Tab_JobPosition";
			tmplName.PRJ_USER_ENT_TAB_RIGHTS			= pr_grpName + "PrjUser_Ent_Tab_Rights";
			tmplName.PRJ_USER_ENT_TAB_PERSON_INFO		= pr_grpName + "PrjUser_Ent_Tab_Person_Info";
			tmplName.PRJ_USER_LEGAL_STAT				= pr_grpName + "PrjUser_Sel_List_Legal_Status";
			tmplName.PRJ_DROPZONE_FILE					= pr_grpName + "PrjDropzone_File"
			
			
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_MAIN					, PrjUser_Main); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_LIST					, PrjUser_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_LIST_CONTENT			, PrjUser_List_Content);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_ENT					, PrjUser_Ent);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_ENT_CONTENT			, PrjUser_Ent_Content);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_ENT_TAB_JOBPOSITION	, PrjUser_Ent_Tab_JobPosition);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_ENT_TAB_RIGHTS		, PrjUser_Ent_Tab_Rights); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_ENT_TAB_PERSON_INFO	, PrjUser_Ent_Tab_Person_Info);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_LEGAL_STAT			, PrjUser_Sel_List_Legal_Status); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_DROPZONE_FILE				, PrjDropzone_File);
			
			//---------------------------------------------------------------------------------------------
			
			if (!App.controller.PrjDashboard)  {
				App.controller.PrjDashboard = {};
			}
			App.controller.PrjDashboard.Ent	= new PrjDashboardEnt	("PrjDashboard", null, null, null);
			App.controller.PrjDashboard.Ent	.do_lc_init();
			
			
			//---------------------------------------------------------------------------------------------
			if (!App.controller.PrjUser) App.controller.PrjUser = {};
			
			if (!App.controller.PrjUser.List)  
				App.controller.PrjUser.List				= new PrjUserList		(grpName, null, null, null);
			
			if (!App.controller.PrjUser.Ent)  
				App.controller.PrjUser.Ent				= new PrjUserEnt		(grpName, null, null, null);
			
			
			
			App.controller.PrjUser.List					.do_lc_init();
			App.controller.PrjUser.Ent					.do_lc_init();
			
			
			
		}     
		
		//--------show-------------------------------------------------------------------
		var pr_grpPath 		= 'group/user/client';
		var pr_showed		= false;
		this.do_lc_show = function(){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback, []);
				pr_showed = true;
			}else {
				self.do_lc_show_callback();
			}
		};
		
		this.do_lc_show_callback = function(){    
			try { 
				App.router.controller.do_lc_append_custom_tags()
				
				var listUserRight = App.data.user.rights;
				if(!listUserRight){
					do_gl_show_Notify_Msg_Error($.i18n("prj_project_not_right_view"));
					return;
				}
				
				var isRight = listUserRight.includes(RIGHT_U_G) || listUserRight.includes(RIGHT_ADM)|| listUserRight.includes(RIGHT_A_G);
				if(!isRight){
					do_gl_show_Notify_Msg_Error($.i18n("prj_project_not_right_view"));
					return;
				}
				
				
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_MAIN, {}));

				App.controller.PrjUser.List.do_lc_show("#div_user_list");
				$(document).prop('title',$.i18n('prj_project_sidebar_user'));

			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjUserMain", "do_lc_show", e.toString()) ;
			}
		}
		
	};

	return PrjUserMain;
});