define(['jquery', 'text!group/nso_news/tmpl/Tmpl_All.html'],
	function($, Tmpl_All) {

	const BlogNew 					= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"NsoPostBlog";
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
			tmplName.TMPL_LIST						= pr_grpName +"Tmpl_List";	
			
			tmplName.TMPL_LIST_CATEGORY				= pr_grpName +"Tmpl_List_Category";
			tmplName.TMPL_LIST_CONTENT				= pr_grpName +"Tmpl_List_Content";
			tmplName.TMPL_LIST_CONTENT_DETAIL		= pr_grpName +"Tmpl_List_Content_Detail";
			tmplName.TMPL_LIST_NOT_FOUND     		= pr_grpName +"Tmpl_List_Not_Found";
			
			tmplName.TMPL_ENT						= pr_grpName +"Tmpl_Ent";	
			tmplName.TMPL_MODIFY    				= pr_grpName +"Tmpl_Modify";	
			tmplName.TMPL_CREATE    		    	= pr_grpName +"Tmpl_Create";	

			
			tmplName.TMPL_ENT_CONTENT_DETAIL_LIST  	= pr_grpName +"Tmpl_Ent_Content_Detail_List";
			tmplName.TMPL_ENT_CONTENT_READ_MORE		= pr_grpName +"Tmpl_Ent_Content_read_more";
			tmplName.TMPL_LIST_USER_LIKE			= pr_grpName +"Tmpl_List_User_Like";
			
			tmplName.TMPL_ENT_COMMENT_LIST			= pr_grpName +"Tmpl_Ent_Comment_List";	
			tmplName.TMPL_ENT_COMMENT				= pr_grpName +"Tmpl_Ent_Comment";	

			tmplCtrl.do_lc_put_tmplRaw(Tmpl_All, pr_grpName);
			
			if (!App.controller[pr_grpName])				
				App.controller[pr_grpName]			= {};
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
			
			let params 	= req_gl_Url_Params();
			let id		= params.id;
			let code	= params.code;
			do_lc_post_get(id, code)
			
			$(document).prop('title',$.i18n('prj_project_sidebar_news_new'));
		}

		const do_lc_post_get = (id, code) => {
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoPost", "SVGetPost", {id, code, forced: true,});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_post_get_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		const do_lc_post_get_callback= sharedJson=>{
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data	= sharedJson[App['const'].RES_DATA];
				
				do_lc_post_show				(data);
				do_lc_post_others_show		(data);

			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"));
			}
		}

		
		const do_lc_post_show = obj => {
			$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT_READ_MORE, obj));
			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				path && window.open(path, "_blank");
			});
		}

		const do_lc_post_others_show = function (post, forced=false) {
			do_lc_post_comment_lst		(post, forced);	
		}
		
		const do_lc_post_comment_lst = function(post, forced = false){
			let cond 		= {
					entId	: post.id			,
					number	: pr_POST_NUMBER	, 
					nbLevel	: pr_POST_HAS_SUB	, 
					forced	, 
			}

			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_CMT_LST, cond);	

			var callbackFunct = function(data) {		//data => sharedJson
				do_lc_post_comment_Dyn(data, post);
			}

			$("#div_prj_comments")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_COMMENT_LIST, {}));
			var opt = {
					divMain			: "#div_comment_list",
					divPagination	: "#div_comment_pagination",
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: pr_POST_NUMBER,
					pageRange		: 1,
					callback		: callbackFunct
			};
			do_gl_init_pagination_opt(opt);
		}
		
		const do_lc_post_comment_Dyn = function(sharedJson, post){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				data.lst  	= req_lc_post_comment_condDel(data.lst);
				data.lst  	= req_lc_post_comment_condMod(data.lst);
				do_lc_post_comment_show(post, data);
			}

		}
		
		const req_lc_post_comment_condDel = (data) => {
			if(!data) return []
			data = data.map(item => {
				if(App.data.user.id==item.uId01) 
						item.isDelCmt = true;
				else 	item.isDelCmt = false;
				
				if (item.childs) item.childs = req_lc_post_comment_condDel (item.childs);
				
				return item;
			})
			return data;
		}
		
		const req_lc_post_comment_condMod = (data) => {
			if(!data) return [];
			data = data.map(item => {
				if(App.data.user.id==item.uId01) 
						item.isModCmt = true;
				else 	item.isModCmt = false;
				
				if (item.childs) item.childs = req_lc_post_comment_condMod (item.childs);
				
				return item;
			})
			return data;
		}
		
		const do_lc_post_comment_show = function(post, data){
			let isLogin = !App.controller.common.Login.can_lc_User_Guest();
			$("#div_comment_list")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_COMMENT, {data, isLogin}));
			
			App.SummerNoteController.do_lc_show("#div_prj_comments", {height : 100}, true);//text editor		
			do_lc_post_comment_bindEvent(post, data);
		}

		const do_lc_post_comment_bindEvent = (post) => {
			$("#btn_send_comment").off("click").on("click", () => {
				let comment = $("#inp_comment").val();
				let iParent = $("#inp_parent_reply").val();
				if(!comment || !comment.length)	return false;
				do_lc_post_comment_new(post, comment, iParent);
			})

			$(".a-reply").off("click").on("click", function(){
				let{parent, user} = $(this).data();
				parent && $("#inp_parent_reply").val(parent);
				if(user)	$("#inp_comment").val(`@${user} `).focus();
			})

			$(".a-delete").off("click").on("click", function(){
				let{id} = $(this).data();
				if(id)	do_lc_post_comment_del(post, id);

			})

			$("#inp_comment").off("keypress").on("keypress", function(e){
				if(e.keyCode == pr_POST_KEY_ENTER){
					$("#btn_send_comment").click();
				}
			})
			$("#btn_login").off("click").on("click", e => $("#div_login").click());
			$('.a-change').off('click').on('click', function() {
				let {id} = $(this).data();
				let commentText = $(`#comment_text_${id}`);
				let commentTextarea = $(`#change_comment_${id}`);

				if (commentText.length && commentTextarea.length) {

					commentTextarea.removeClass('hide');


					$(`.comment_action_${id}`).addClass('hide');
					let saveButton = $(`a[data-id="${id}"]#a_btn_save_comment`);
					let cancelButton = $(`a[data-id="${id}"]#a_btn_cancel_comment`);

					saveButton.removeClass('hide');
					cancelButton.removeClass('hide');


					commentTextarea.summernote({
						height: 150
					});

					if (commentTextarea.summernote('isEmpty')) {
						commentTextarea.summernote('code', commentText.val());
					}

					$(`a[data-id="${id}"]#a_btn_cancel_comment`).off('click').on('click', function() {
						let id = $(this).data('id');
						let commentText = $(`#comment_text_${id}`);
						let commentTextarea = $(`#change_comment_${id}`);

						commentText.removeClass('hide');
						commentTextarea.addClass('hide');


						commentTextarea.summernote('destroy');

						$(`.comment_action_${id}`).removeClass('hide');
						let saveButton = $(`a[data-id="${id}"]#a_btn_save_comment`);
						let cancelButton = $(`a[data-id="${id}"]#a_btn_cancel_comment`);

						if (saveButton.length) {
							saveButton.addClass('hide');
						}

						if (cancelButton.length) {
							cancelButton.addClass('hide');
						}
					});

					$(`a[data-id="${id}"]#a_btn_save_comment`).off('click').on('click', function() {
						let iParent = $("#inp_parent_reply").val();
						let comment = $(`#change_comment_${id}`).val();
						if(comment.trim() !== "") do_lc_post_comment_mod(post,id, comment)
					});
				}
			});
		};
		
		const do_lc_post_comment_new = function(post, comment, iParent){
			let cond 		= {id: post.id, code: post.code01, obj: {parId:iParent, comment, v01: 200001, v02: post.id}};
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_CMT_NEW, cond);
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_post_comment_act_callback, [post]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_post_comment_mod = function(post, cmtId, comment){
			let cond 		= {id: post.id, code: post.code01, cmtId, comment};
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_CMT_MOD, cond);

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_post_comment_act_callback, [post]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_post_comment_del = function(post, idCmt){

			let cond 		= {id: post.id, code:post.code01, cmtId: idCmt};
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoPost" , "SVNsoPostDel12H", cond);

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_post_comment_act_callback, [post, idCmt]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_post_comment_act_callback = function(sharedJson, post){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_lc_post_comment_lst	(post, true);
				do_lc_build_page		(true);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		//--------------------------------------------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------------------------------------------

		const do_lc_show_Msg  = e => console.log(e);
	};

	return BlogNew;
});