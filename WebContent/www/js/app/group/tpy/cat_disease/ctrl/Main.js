define([
	'group/tpy/cat_disease/ctrl/List',
	'group/tpy/cat_disease/ctrl/Ent',

	'text!group/tpy/cat_disease/tmpl/Main.html',
	
	'text!group/tpy/cat_disease/tmpl/List.html',
	'text!group/tpy/cat_disease/tmpl/List_Content.html',
	
	'text!group/tpy/cat_disease/tmpl/Ent_Content.html',
	'text!group/tpy/cat_disease/tmpl/Ent_New.html',
	'text!group/tpy/cat_disease/tmpl/Ent_Content_Row.html',
	'text!group/tpy/cat_disease/tmpl/Ent_Content_Row_add.html',
	
	'text!group/tpy/cat_disease/tmpl/Dropzone_File.html',

], function(
	CtrlList,
	CtrlEnt,

	Tmpl_Main,
	Tmpl_List,
	Tmpl_List_Content,
	Tmpl_Ent_Content,
	Tmpl_Ent_New,
	
	Tmpl_Ent_Content_Row,
	Tmpl_Ent_Content_Row_add,
	
	Tmpl_Dropzone_File,
) {
	var Main     		= function (grpName, header,content,footer) {
		
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"TpyCatDisease";
		var pr_grpPath				= 'group/tpy/cat_disease';
		App.template.names[pr_grpName] = {}; //---init only one time in Main ctrl
		
		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;		
		//------------------------------------------------------------------------------------
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName];
			}
			if (!App.controller.TpyCatDisease) App.controller.TpyCatDisease = {};
			
			
			if (!App.controller[pr_grpName].List)  
				App.controller[pr_grpName].List				= new CtrlList		(pr_grpName, null, null, null);
			
			if (!App.controller[pr_grpName].Ent)  
				App.controller[pr_grpName].Ent				= new CtrlEnt		(pr_grpName, null, null, null);
			
			App.controller[pr_grpName].List					.do_lc_init();
			App.controller[pr_grpName].Ent					.do_lc_init();
			
			tmplName.TMPL_MAIN 								= pr_grpName+"Tmpl_Main";
			tmplName.TMPL_LIST								= pr_grpName+"Tmpl_List";
			tmplName.TMPL_LIST_CONTENT						= pr_grpName+"Tmpl_List_Content";
			
			tmplName.TMPL_ENT_NEW  							= pr_grpName+"Tmpl_Ent_New";
			tmplName.TMPL_ENT_CONTENT						= pr_grpName+"Tmpl_Ent_Content";
			tmplName.TMPL_ENT_CONTENT_ROW					= pr_grpName+"Tmpl_Ent_Content_Row";
			tmplName.TMPL_ENT_CONTENT_ROW_ADD				= pr_grpName+"Tmpl_Ent_Content_Row_add";
			
			tmplName.TMPL_DROPZONE_FILE						= pr_grpName+"Tmpl_Dropzone_File";		
						
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_MAIN					, Tmpl_Main); 
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_LIST					, Tmpl_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_LIST_CONTENT			, Tmpl_List_Content); 	
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_NEW				, Tmpl_Ent_New); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_CONTENT			, Tmpl_Ent_Content); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_CONTENT_ROW		, Tmpl_Ent_Content_Row);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_CONTENT_ROW_ADD	, Tmpl_Ent_Content_Row_add);
						
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_DROPZONE_FILE			, Tmpl_Dropzone_File);
		}     
		
		this.do_lc_show = function(){
			do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback);
		};			
		
		this.do_lc_show_callback = function(){
			try { 
				
				var listUserRight = App.data.user.rights;
				if(!listUserRight){
					do_gl_show_Notify_Msg_Error($.i18n("prj_project_not_right_view"));
					return;
				}
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_MAIN, {}));

				App.controller[pr_grpName].List.do_lc_show();
				
				$(document).prop('title',$.i18n('prj_project_sidebar_user_grp'));

			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjUserGroupMain", "do_lc_show", e.toString()) ;
			}
		};
		
	};

	return Main;
});