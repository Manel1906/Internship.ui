define([
	'group/user_note/ctrl/PrjStickyNoteList',
	'group/user_note/ctrl/PrjStickyNoteEnt',
	
	'text!group/user_note/tmpl/PrjStickyNote_Main.html',
	
	'prjSignatureDrawPad/jquery-drawpad',
	], function(
			PrjStickyNoteList,
			PrjStickyNoteEnt,

			PrjStickyNote_Main) {

	var PrjStickyNoteMain     			= function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;
		var self 					= this;
		var pr_GROUP				= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if (!App.controller.PrjStickyNote) App.controller.PrjStickyNote = {};
			
			if (!App.controller.PrjStickyNote.Main)  
				App.controller.PrjStickyNote.Main				= this;
			
			if (!App.controller.PrjStickyNote.List)  
				App.controller.PrjStickyNote.List				= new PrjStickyNoteList		(null, null, null);
			
			if (!App.controller.PrjStickyNote.Ent)  
				App.controller.PrjStickyNote.Ent				= new PrjStickyNoteEnt			(null, null, null);
			
			
			App.controller.PrjStickyNote.List					.do_lc_init();
			App.controller.PrjStickyNote.Ent					.do_lc_init();

			tmplName.PRJ_STICKYNOTE_MAIN						= "PrjStickyNote_Main";
			tmplCtrl										.do_lc_put_tmpl(tmplName.PRJ_STICKYNOTE_MAIN, PrjStickyNote_Main); 
		}   
		var pr_grpPath 		= 'group/user_note';
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
				let params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
				if (!params || !params.groupId)		
					pr_GROUP       = null;
				else
					pr_GROUP       = parseInt(param.groupId);

				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_STICKYNOTE_MAIN, {}));

				App.controller.PrjStickyNote.List.do_lc_show(pr_GROUP);
				$(document).prop('title',$.i18n('prj_project_sidebar_sticky_note'));
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjStickyNoteMain", "do_lc_show", e.toString()) ;
			}
		};
		
	};

	return PrjStickyNoteMain;
});