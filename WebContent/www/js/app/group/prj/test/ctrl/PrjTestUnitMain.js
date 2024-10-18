define([
	'group/prj/test/ctrl/PrjTestUnitList',
	'group/prj/test/ctrl/PrjTestUnitEnt',
	
	'text!group/prj/test/tmpl/PrjTestUnit_Main.html',
	], function(
			PrjTestUnitList,
			PrjTestUnitEnt,

			PrjTestUnit_Main) {

	var PrjTestUnitMain     			= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		//------------------------------------------------------------------------------------
		var self 					= this;
		var pr_ID					= null;
		var pr_CODE					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if (!App.controller.PrjTestUnit) App.controller.PrjTestUnit = {};
			
			if (!App.controller.PrjTestUnit.Main)  
				App.controller.PrjTestUnit.Main				= this;
			
			if (!App.controller.PrjTestUnit.List)  
				App.controller.PrjTestUnit.List				= new PrjTestUnitList		(pr_grpName, null, null, null);
			
			if (!App.controller.PrjTestUnit.Ent)  
				App.controller.PrjTestUnit.Ent				= new PrjTestUnitEnt		(pr_grpName, null, null, null);
			
			
			App.controller.PrjTestUnit.List					.do_lc_init();
			App.controller.PrjTestUnit.Ent					.do_lc_init();
			
			
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}

			tmplName.PRJ_TESTUNIT_MAIN						= "PrjTestUnit_Main";
			tmplCtrl										.do_lc_put_tmpl(tmplName.PRJ_TESTUNIT_MAIN, PrjTestUnit_Main); 
		}     
		
		//--------show-------------------------------------------------------------------
		const 	pr_grpPath 	= 'group/prj/_transl';
		let 	pr_showed	= false;
		
		this.do_lc_show = function(){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath , self.do_lc_show_callback, []);
				pr_showed = true;
			}else {
				self.do_lc_show_callback();
			}
		};

		this.do_lc_show_callback		= function(){
			try { 
				App.router.controller.do_lc_append_custom_tags()
				
				var param = req_gl_Url_Params(App.data.url);
				if (param && param.id && param.code) {
					pr_ID       = parseInt(param.id);
					pr_CODE     = parseInt(param.code);
				}
			
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTUNIT_MAIN, {}));

				App.controller.PrjTestUnit.List.do_lc_show(pr_ID, pr_CODE);
				$(document).prop('title',$.i18n('prj_project_sidebar_test_unit'));
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjTestUnitMain", "do_lc_show", e.toString()) ;
			}
		};
		
	};

	return PrjTestUnitMain;
});