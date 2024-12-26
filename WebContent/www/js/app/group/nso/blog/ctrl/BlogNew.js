define(['jquery', 'text!group/nso/blog/tmpl/Blog_All.html'],
	function($, Blog_All) {

	const BlogNew 					= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"NsoBlog";
				var tmplName		= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;

		const pr_TYP01_NEWS			= 103;
		
		
		const RIGHT_U_G				= 5000001;
		const RIGHT_U_N				= 5000002;
		const RIGHT_U_M				= 5000003;
		const RIGHT_U_D				= 5000004;
		const RIGHT_U_R				= 5000005;
		
		const RIGHT_ADM	        	= 100;
		const RIGHT_A_G	        	= 101;
		
		var   self                  = this;
		// --------------------APIs--------------------------------------//
		this.do_lc_init = () => {
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName 	= App.template.names[pr_grpName]
			}
			tmplName.TMPL_LIST						= pr_grpName +"Blog_List";	
			
			tmplName.TMPL_LIST_CATEGORY				= pr_grpName +"Blog_List_Category";
			tmplName.TMPL_LIST_CONTENT				= pr_grpName +"Blog_List_Content";
			tmplName.TMPL_LIST_CONTENT_DETAIL		= pr_grpName +"Blog_List_Content_Detail";
			tmplName.TMPL_LIST_NOT_FOUND     		= pr_grpName +"Blog_List_Not_Found";
			
			tmplName.TMPL_ENT						= pr_grpName +"Blog_Ent";	
			tmplName.TMPL_MODIFY    				= pr_grpName +"Blog_Modify";	
			tmplName.TMPL_CREATE    		    	= pr_grpName +"Blog_Create";	

			tmplCtrl.do_lc_put_tmplRaw(Blog_All, pr_grpName);
			
			if (!App.controller[pr_grpName])				
				App.controller[pr_grpName]			= {};
		}
		//--------------------------------------------------------------------------------------------------------------------------------	
		var pr_grpPath 		= 'group/nso/blog';
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
			$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_CREATE, obj));
			
			$("#tmpicker_Begin").timepicker({//timepicker
				showMeridian: false,
				defaultTime :'7:00',
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			});
			
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
				if(!data.data.dt03.date) {
					dateString = new Date().toString();
					var dateObj = new Date(dateString);
					var formattedDate = dateObj.getFullYear() + "-" +
					    ("0" + (dateObj.getMonth() + 1)).slice(-2) + "-" +
					    ("0" + dateObj.getDate()).slice(-2) + " " +
					    ("0" + dateObj.getHours()).slice(-2) + ":" +
					    ("0" + dateObj.getMinutes()).slice(-2) + ":" +
					    ("0" + dateObj.getSeconds()).slice(-2);
					
					var formattedTime = ("0" + dateObj.getHours()).slice(-2) + ":" +
					    ("0" + dateObj.getMinutes()).slice(-2) + ":" +
					    ("0" + dateObj.getSeconds()).slice(-2);	
					// Gán giá trị đã định dạng vào data.data.dt03
					data.data.dt03.date = formattedDate;
					data.data.dt03.time = formattedTime;
				} 
				data.data.dt03			= do_lc_convert_date(data.data.dt03);

				do_lc_new_post		(data);
				
			});
			
			$("#btn_cancel").off('click').on('click', function(e) {
				App.router.controller.do_lc_run("VI_MAIN/prj_news_list","view_prj_news_list.html?groupId=-1");
			});
			
			$("#typ03").on("change", function() {
				var typ03Value = $(this).val();
			    
			    if (typ03Value == '3') {
			        $("#type_question").removeClass('hide');
			    } else {
			        $("#type_question").addClass('hide');
			    }
			});
		}
		
		const do_lc_convert_date = objDate => objDate.date.substr(0, 10) + " " + objDate.time.substr(0, 5) + ":00";
		
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