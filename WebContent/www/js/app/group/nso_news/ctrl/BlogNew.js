define(['jquery', 'text!group/nso_news/tmpl/Blog_All.html'],
	function($, Blog_All) {

	const BlogNew 					= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;

		const pr_TYP01_NEWS			= 103;
		
		
		const 	RIGHT_ADM				= 100;
		
		var   self                  = this;
		// --------------------APIs--------------------------------------//
		this.do_lc_init = () => {
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName 	= App.template.names[pr_grpName]
			}
			tmplName.BLOG_LIST						= pr_grpName +"Blog_List";	
			
			tmplName.BLOG_LIST_CATEGORY				= pr_grpName +"Blog_List_Category";
			tmplName.BLOG_LIST_CONTENT				= pr_grpName +"Blog_List_Content";
			tmplName.BLOG_LIST_CONTENT_DETAIL		= pr_grpName +"Blog_List_Content_Detail";
			tmplName.BLOG_LIST_NOT_FOUND     		= pr_grpName +"Blog_List_Not_Found";
			
			tmplName.BLOG_ENT						= pr_grpName +"Blog_Ent";	
			tmplName.BLOG_MODIFY    				= pr_grpName +"Blog_Modify";	
			tmplName.BLOG_CREATE    		    	= pr_grpName +"Blog_Create";	

			tmplCtrl.do_lc_put_tmplRaw(Blog_All, pr_grpName);
			
			if (!App.controller.Blog)				
				App.controller.Blog			= {};
		}
		//--------------------------------------------------------------------------------------------------------------------------------	
		var pr_grpPath 		= 'group/nso_news';
		var pr_showed		= false;
		this.do_lc_show 	= function(){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback);
			}else {
				self.do_lc_show_callback();
			}
		};  
		
		this.do_lc_show_callback = () => {
			pr_showed 	= true;
			
			let params = req_gl_Url_Params();
					
			let obj = {files : []};
			do_lc_build_page(obj)
			do_lc_bind_event(obj);
			
			$(document).prop('title',$.i18n('prj_project_sidebar_news_new'));
		}

		const do_lc_build_page = obj => {
			$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.BLOG_CREATE, obj));

			do_show_fileUploader(obj);
			App.SummerNoteController.do_lc_show("#div_blog_content", {height : 100});//text editor
		}

		//--------------------------------------------------------------------------------------------------------------------------------
		const do_lc_bind_event = obj => {
			$("#btn_save_blog").off('click').on('click', function(e) {
				let data = req_gl_data({
					dataZoneDom 	: $("#div_blog"),
					oldObject 		: obj
				});

				if(data.hasError) {
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));
					return false;
				}
				
				data.data.typ01      	= pr_TYP01_NEWS;
				data.data.typ02      	= localStorage.languageId;

				do_lc_new_post		(data);
				
			});
			
			$("#btn_cancel").off('click').on('click', function(e) {
				App.router.controller.do_lc_run("VI_MAIN/prj_news_list","view_prj_news_list.html?groupId=-1");
			});
		}

		const do_lc_new_post = data => {
			let ref		= req_gl_Request_Content_Send("ServiceNsoPost", "SVNewNews");

			let fSucces	= [];
			fSucces.push(req_gl_funct(null, do_lc_new_post_callback, []));

			let fError 	= req_gl_funct(App, do_lc_show_Msg , [$.i18n("common_err_msg_unknow")]);

			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}

		const do_lc_new_post_callback = sharedJson => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n("nso_news_post_save_success"));
				
				let data = sharedJson[App['const'].RES_DATA];

				App.router.controller.do_lc_run("VI_MAIN/prj_news_list","view_prj_news_list.html?forced=true&forme=true");
				
			}else{
				do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_unknow"));
			}
		}

		//--------------------------------------------------------------------------------------------------------------------------------
		const do_show_fileUploader = obj => {		
			let option		= {
					fileinput	: { param : {typ01: 1, typ02: 1, maxFiles : 1}},//option here
					obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_avatar"), option);
			
			let option2		= {
					fileinput	: { param : {typ01: 2, typ02: 10}},//option here
					obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_files"), option2);
		}

		//--------------------------------------------------------------------------------------------------------------------------------

		const do_lc_show_Msg  = e => console.log(e);
	};

	return BlogNew;
});