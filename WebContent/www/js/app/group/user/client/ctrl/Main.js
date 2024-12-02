define([
	'group/dashboard/ctrl/PrjDashboardEnt',
	
	'group/user/client/ctrl/List',
	'group/user/client/ctrl/Ent',
	
	'text!group/user/client/tmpl/Main.html',
	'text!group/user/client/tmpl/List.html', 
	'text!group/user/client/tmpl/List_Content.html', 
	
	'text!group/user/client/tmpl/Ent.html',
	'text!group/user/client/tmpl/Ent_Content.html'	,
	'text!group/user/client/tmpl/Ent_Tab_JobPosition.html'	,
	'text!group/user/client/tmpl/Ent_Tab_Person_Info.html',	
	'text!group/user/client/tmpl/Ent_Tab_Rights.html',
	
	'text!group/user/client/tmpl/Sel_List_Legal_Status.html'	,
	'text!group/user/client/tmpl/Dropzone_File.html'

	], function(
			PrjDashboardEnt,
			
			CtrlList,
			CtrlEnt,
			
			Tmpl_Main,
			Tmpl_List, 
			Tmpl_List_Content,
			
			Tmpl_Ent,
			Tmpl_Ent_Content	,	
			Tmpl_Ent_Tab_JobPosition,	
			Tmpl_Ent_Tab_Person_Info,
			Tmpl_Ent_Tab_Rights,
			
			Tmpl_Sel_List_Legal_Status,
			Tmpl_Dropzone_File
	) {

	var PrjUserMain     			= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"UserClient";
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
//				2: "aut_user_ent_header_type_adm"	,	20: "aut_user_ent_header_type_doctor"	,	30: "aut_user_ent_header_type_agent"
				40: "aut_user_ent_header_type_patient"
		}
		Handlebars.registerHelper('reqTypeClient', function(typ) {
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
			
			tmplName.TMPL_MAIN 						= pr_grpName + "Tmpl_Main";
			tmplName.TMPL_LIST						= pr_grpName + "Tmpl_List";
			tmplName.TMPL_LIST_CONTENT				= pr_grpName + "Tmpl_List_Content";
			
			tmplName.TMPL_ENT						= pr_grpName + "Tmpl_Ent";
			tmplName.TMPL_ENT_CONTENT				= pr_grpName + "Tmpl_Ent_Content";
			tmplName.TMPL_ENT_TAB_JOBPOSITION		= pr_grpName + "Tmpl_Ent_Tab_JobPosition";
			tmplName.TMPL_ENT_TAB_RIGHTS			= pr_grpName + "Tmpl_Ent_Tab_Rights";
			tmplName.TMPL_ENT_TAB_PERSON_INFO		= pr_grpName + "Tmpl_Ent_Tab_Person_Info";
			tmplName.TMPL_LEGAL_STAT				= pr_grpName + "Tmpl_Sel_List_Legal_Status";
			tmplName.TMPL_DROPZONE_FILE				= pr_grpName + "Tmpl_Dropzone_File"
			
			
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_MAIN					, Tmpl_Main); 
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_LIST					, Tmpl_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_LIST_CONTENT			, Tmpl_List_Content);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT					, Tmpl_Ent);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_CONTENT			, Tmpl_Ent_Content);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_JOBPOSITION	, Tmpl_Ent_Tab_JobPosition);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_RIGHTS		, Tmpl_Ent_Tab_Rights); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_PERSON_INFO	, Tmpl_Ent_Tab_Person_Info);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_LEGAL_STAT			, Tmpl_Sel_List_Legal_Status); 
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_DROPZONE_FILE			, Tmpl_Dropzone_File);
			
			//---------------------------------------------------------------------------------------------
			
			if (!App.controller.PrjDashboard)  {
				App.controller.PrjDashboard = {};
			}
			App.controller.PrjDashboard.Ent	= new PrjDashboardEnt	("PrjDashboard", null, null, null);
			App.controller.PrjDashboard.Ent	.do_lc_init();
			
			
			//---------------------------------------------------------------------------------------------
			if (!App.controller[pr_grpName]) App.controller[pr_grpName] = {};
			
			if (!App.controller[pr_grpName].List)  
				App.controller[pr_grpName].List				= new CtrlList		(grpName, null, null, null);
			
			if (!App.controller[pr_grpName].Ent)  
				App.controller[pr_grpName].Ent				= new CtrlEnt		(grpName, null, null, null);
			
			
			App.controller[pr_grpName].List					.do_lc_init();
			App.controller[pr_grpName].Ent					.do_lc_init();
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
				
				
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_MAIN, {}));

				App.controller[pr_grpName].List.do_lc_show("#div_user_list");
				$(document).prop('title',$.i18n('prj_project_sidebar_user'));

			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjClientMain", "do_lc_show", e.toString()) ;
			}
		}
		
	};

	return PrjUserMain;
});