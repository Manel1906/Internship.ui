define([
        'jquery',
        'text!group/nso/post/tmpl/Ent_Tabs.html',
		'group/nso/post/ctrl/EntTabComment'
        ],
        function($, 
        		Tmpl_Ent_Tabs,
				CtrlEntTabComment
        		) {


	var CtrlEntTabs     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_lock_type			= -1; //--const based on BO
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
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

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntTabs 			= null;
		
		//-------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntTabDoc 		= App.controller[pr_grpName].EntTabDoc;
//			pr_ctr_EntTabRating 			= App.controller[pr_grpName].EntTabRating;
			
			tmplName.ENT_TABS			= "Tmpl_Ent_Tabs";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TABS, Tmpl_Ent_Tabs); 
		}     
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			var objLink = pr_obj;
			var objFile = pr_obj;
			
			if(obj && mode != App['const'].MODE_MOD){
				if(!obj.link || obj.link.length <= 0){
					if(obj.files){
						var files = obj.files;
						var newFiles = [];
						var newLink  = [];
						for(var i = 0; i < files.length; i++){
							if(files[i].typ02 != 3){
								newFiles.push(files[i]);
							}else{
								newLink.push(files[i]);
							}
						}
						objFile.files = newFiles;
						objLink.link  = newLink;
					}
				}
			}
			
			
			try{
							
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TABS, obj));
				
				//fixed max-height scroll of % height div_ContentView
				do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-tab", 43.6);

				pr_ctr_EntTabDoc .do_lc_show(objFile, mode);
				do_show_comments(obj);
				do_bind_event(obj, mode);
			}catch(e) {	
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "nso.post", "CtrlEntTabs", "do_lc_show", e.toString()) ;
			}
		};

		var do_show_comments = function (data){
			var obj = {
				entTyp 	: 1000,
				entId 	: data.id,
				entCod  : data.code01
			}

			if (!App.controller[pr_grpName].EntTabComment)
				App.controller[pr_grpName].EntTabComment = new CtrlEntTabComment(null, "#div_Ent_Tab_Comment", null, pr_grpName);

			App.controller[pr_grpName].EntTabComment.do_lc_init();
			App.controller[pr_grpName].EntTabComment.do_lc_show(obj);
		}



		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			
		}

	};


	return CtrlEntTabs;
});