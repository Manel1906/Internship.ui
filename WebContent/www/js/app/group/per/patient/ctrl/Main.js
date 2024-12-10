define([
	'group/per/patient/ctrl/List',
	'group/per/patient/ctrl/Ent',
	'group/per/patient/ctrl/EntTabInfo',
	
	'text!group/per/patient/tmpl/Main.html',
	
	'text!group/per/patient/tmpl/List.html', 
	'text!group/per/patient/tmpl/List_Content.html', 
	
	'text!group/per/patient/tmpl/Ent.html',
	
	'text!group/per/patient/tmpl/Ent_Tab_Info_Modify.html',
	'text!group/per/patient/tmpl/Ent_Tab_Info.html'	,
	'text!group/per/patient/tmpl/Ent_Tab_Info_Contact.html',
	'text!group/per/patient/tmpl/Ent_Tab_Info_Contact_Add.html',
	'text!group/per/patient/tmpl/Ent_Tab_Info_Insurance.html',
	'text!group/per/patient/tmpl/Ent_Tab_Info_Insurance_Add.html',
	'text!group/per/patient/tmpl/Ent_Tab_Info_File.html',
		
	'text!group/per/patient/tmpl/Dropzone_File.html'

	], function(
			List,
			Ent,
			EntTabInfo,
			
			Tmpl_Main,
			
			Tmpl_List, 
			Tmpl_List_Content,
			
			Tmpl_Ent,
			Tmpl_Ent_Tab_Info_Modify,
			
			Tmpl_Ent_Tab_Info	,	
			Tmpl_Ent_Tab_Info_Contact,
			Tmpl_Ent_Tab_Info_Contact_Add,
			Tmpl_Ent_Tab_Info_Insurance,
			Tmpl_Ent_Tab_Info_Insurance_Add,
			Tmpl_Ent_Tab_Info_File,
			
			Tmpl_PrjDropzone_File
	) {

	var Main     			= function (grpName, header, content, footer) {
		
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"PerDoctor";
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var pr_grpPath 				= 'group/per/patient';
		
		var self 					= this;
		var Handlebars				= require('handlebars');
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
			
			tmplName.TMPL_MAIN 							= pr_grpName + "Tmpl_Main";
			tmplName.TMPL_LIST							= pr_grpName + "Tmpl_List";
			tmplName.TMPL_LIST_CONTENT					= pr_grpName + "Tmpl_List_Content";
			
			tmplName.TMPL_ENT							= pr_grpName + "Tmpl_Ent";
			
			tmplName.TMPL_ENT_TAB_INFO					= pr_grpName + "Tmpl_Ent_Content";
			tmplName.TMPL_ENT_TAB_INFO_CONTACT			= pr_grpName + "Tmpl_Ent_Tab_Info_Contact";
			tmplName.TMPL_ENT_TAB_INFO_CONTACT_ADD		= pr_grpName + "Tmpl_Ent_Tab_Info_Contact_Add";
			tmplName.TMPL_ENT_TAB_INFO_INSURANCE		= pr_grpName + "Tmpl_Ent_Tab_Info_Insurance";
			tmplName.TMPL_ENT_TAB_INFO_INSURANCE_ADD	= pr_grpName + "Tmpl_Ent_Tab_Info_Contact_Add_Lst";
			tmplName.TMPL_ENT_TAB_INFO_FILE				= pr_grpName + "Tmpl_Ent_Tab_Info_File";
						
			tmplName.TMPL_ENT_TAB_INFO_MOD				= pr_grpName + "Tmpl_Ent_Tab_Info_Modify";
			
			tmplName.TMPL_DROPZONE_FILE					= pr_grpName + "Tmpl_Dropzone_File"
			
			
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_MAIN						, Tmpl_Main); 
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_LIST						, Tmpl_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_LIST_CONTENT				, Tmpl_List_Content);
				
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT						, Tmpl_Ent);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO				, Tmpl_Ent_Tab_Info);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO_CONTACT		, Tmpl_Ent_Tab_Info_Contact);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO_CONTACT_ADD	, Tmpl_Ent_Tab_Info_Contact_Add);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO_INSURANCE	, Tmpl_Ent_Tab_Info_Insurance);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO_INSURANCE_ADD, Tmpl_Ent_Tab_Info_Insurance_Add);
						
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO_FILE			, Tmpl_Ent_Tab_Info_File);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO_MOD			, Tmpl_Ent_Tab_Info_Modify);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_DROPZONE_FILE				, Tmpl_PrjDropzone_File);
			
			//---------------------------------------------------------------------------------------------
			//---------------------------------------------------------------------------------------------
			if (!App.controller[pr_grpName]) App.controller[pr_grpName] = {};
			
			if (!App.controller[pr_grpName].List)  
				App.controller[pr_grpName].List				= new List		(grpName, null, null, null);
			
			if (!App.controller[pr_grpName].Ent)  
				App.controller[pr_grpName].Ent				= new Ent		(grpName, null, null, null);
			
			if (!App.controller[pr_grpName].EntTabInfo)  
				App.controller[pr_grpName].EntTabInfo		= new EntTabInfo	(grpName, null, null, null);
			
			App.controller[pr_grpName].List					.do_lc_init();
			App.controller[pr_grpName].Ent					.do_lc_init();
			App.controller[pr_grpName].EntTabInfo			.do_lc_init();
			
		}     
		
		//--------show-------------------------------------------------------------------
		
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
				
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_MAIN, {}));

				App.controller[pr_grpName].List.do_lc_show();
				
				$(document).prop('title',$.i18n('prj_project_sidebar_user'));

			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjClientMain", "do_lc_show", e.toString()) ;
			}
		}
		
	};

	return Main;
});