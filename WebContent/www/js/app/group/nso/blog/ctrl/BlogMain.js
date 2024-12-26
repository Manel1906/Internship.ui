define(['jquery', 'text!group/nso/blog/tmpl/Blog_All.html'],
	function($, Blog_All) {

	const BlogMain = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"NsoBlog";
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		const pr_TYPE_BLOG = 17000;

		var pr_SEARCH_KEY			= "";
		var pr_FILTER_TYP03			= null;
		var pr_FILTER_V05			= null;

		var pr_TYP_NEWS  			= 103;
		var pr_TYP03  				= [4];
		let files					= {files: []};

		var self                    = this;

		const pr_STAT_VALIDATED		= 2;
		const pr_STAT_INVALID		= 0;
		
		const pr_NUMBER_RECORD    	= 5;			

		const pr_SERVICE_CLASS		= "ServiceNsoPost";
		const pr_SV_MOD				= "SVMod";
		const pr_SV_CMT_MOD			= "SVModCmt";
		const pr_SV_CMT_NEW			= "SVNewCmt";
		const pr_SV_CMT_LST			= "SVLstCmt";

		const pr_POST_KEY_ENTER		= 13;
		const pr_POST_HAS_SUB 		= 2;
		const pr_POST_NUMBER 		= 10;
		
		
		const RIGHT_U_G				= 5000001;
		const RIGHT_U_N				= 5000002;
		const RIGHT_U_M				= 5000003;
		const RIGHT_U_D				= 5000004;
		const RIGHT_U_R				= 5000005;
		
		const RIGHT_ADM	        	= 100;
		const RIGHT_A_G	        	= 101;
				
		//---------------------------------------------------------------
		this.do_lc_init	= function() {
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName 	= App.template.names[pr_grpName]
			}
			
			if (!App.controller[pr_grpName])				
				App.controller[pr_grpName]			= {};

			if (!App.controller[pr_grpName].Main)				
				App.controller[pr_grpName].Main 	= this;

			tmplName.TMPL_LIST						= pr_grpName +"Blog_List";	
			
			tmplName.TMPL_LIST_CATEGORY				= pr_grpName +"Blog_List_Category";
			tmplName.TMPL_LIST_CONTENT				= pr_grpName +"Blog_List_Content";
			tmplName.TMPL_LIST_CONTENT_DETAIL		= pr_grpName +"Blog_List_Content_Detail";
			tmplName.TMPL_LIST_NOT_FOUND     		= pr_grpName +"Blog_List_Not_Found";
			
			tmplName.TMPL_ENT						= pr_grpName +"Blog_Ent";	
			tmplName.TMPL_MODIFY    				= pr_grpName +"Blog_Modify";	
			tmplName.TMPL_CREATE    		    	= pr_grpName +"Blog_Create";	

			
			tmplName.TMPL_ENT_CONTENT_DETAIL_LIST  	= pr_grpName +"Blog_Ent_Content_Detail_List";
			tmplName.TMPL_ENT_CONTENT_READ_MORE		= pr_grpName +"Blog_Ent_Content_read_more";
			tmplName.TMPL_LIST_USER_LIKE			= pr_grpName +"Blog_List_User_Like";
			tmplName.TMPL_LIST_CONTENT_MANAGER		= pr_grpName +"Blog_List_Content_Manager";
			
			tmplName.TMPL_ENT_COMMENT_LIST			= pr_grpName +"Blog_Ent_Comment_List";	
			tmplName.TMPL_ENT_COMMENT				= pr_grpName +"Blog_Ent_Comment";	

			tmplCtrl.do_lc_put_tmplRaw(Blog_All, pr_grpName);
		}

		var pr_grpPath 		= 'group/nso/blog';
		var pr_showed		= false;
		var	pr_uId			= null;
		var forme			= false;
		
		this.do_lc_show 	= function(){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback);
			}else {
				self.do_lc_show_callback();
			}
		};  
		this.do_lc_show_callback = () => {
			try {
				pr_showed 	= true;
				pr_uId		= null;
				
				let params 	= req_gl_Url_Params();
				var forced	= params.forced;
					forme	= params.forme;
				
				do_lc_build_page(forced, forme);
				
				$(document).prop('title',$.i18n('prj_project_sidebar_news_list'));
			}catch(e) {
				console.log(e);
			}
		};

		const do_lc_build_page = (forced, forme) => {
			$("#div_main_content"		)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST			, {}));
			$("#div_Blog_Block_Content"	)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST_CONTENT	, {}));
			pr_uId = null;
			let multiStat	= [pr_STAT_VALIDATED].join(",");
			if(forme){
				multiStat 	= [pr_STAT_VALIDATED, pr_STAT_INVALID].join(",");
				pr_uId 		= App.data.user.id;
				do_lc_blog_get_manager(forced, multiStat, pr_uId, forme);
			}else {
				do_lc_blog_get(forced, multiStat, pr_uId);
			}
			
			$("#li_search").removeClass("hide");
		}

		const do_lc_blog_get = (forced, multiStat, userID) => {
			let divList = $("#div_blog_grid");
			let divPan  = $("#blog-pagination");
			
			pr_uId		= userID;
			
			
			if(forced == null) forced = true;
			
			let ref 	= req_gl_Request_Content_Send_With_Params("ServiceNsoPost", "SVLstAllNew", {
				type          : pr_TYP_NEWS,
				multiStat	  : multiStat,
				withAva 	  : true,
				userID,
				forced,
				typ03		  : pr_TYP03,
				searchkey     : pr_SEARCH_KEY,
				filtercont05  : pr_FILTER_V05,
			});

			const opt 			= {
					divMain			: divList,
					divPagination	: divPan,
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: pr_NUMBER_RECORD,
					pageRange		: 1,
					callback		: do_lc_blog_show_pagination
			};

			do_gl_init_pagination_opt (opt);
		}
		
		const do_lc_blog_get_manager = (forced, multiStat, userID) => {
			let divList = $("#div_blog_grid1");
			let divPan  = $("#blog-pagination");
			
			pr_uId		= userID;
			
			
			if(forced == null) forced = true;
			
			let ref 	= req_gl_Request_Content_Send_With_Params("ServiceNsoPost", "SVLstPage", {
				type          : pr_TYP_NEWS,
				multiStat	  : multiStat,
				withAva 	  : true,
				userID,
				forced,
				searchkey     : pr_SEARCH_KEY,
				filtertyp03	  : pr_FILTER_TYP03,
			});

			const opt 			= {
					divMain			: divList,
					divPagination	: divPan,
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: pr_NUMBER_RECORD,
					pageRange		: 1,
					callback		: do_lc_blog_show_pagination_manager
			};

			do_gl_init_pagination_opt (opt);
		}
		
		//-------------------------------------------------------------------------------------------
		const do_lc_blog_show_pagination = sharedJson => {
			let data 			= [];
			let templContent 	= tmplName.TMPL_LIST_CONTENT_DETAIL;
			if (App.data.user.rights.includes(RIGHT_U_G) || App.data.user.rights.includes(RIGHT_ADM)) {
				if (can_gl_AjaxSuccess(sharedJson)) {
					data 			=  sharedJson[App['const'].RES_DATA];
					
					if(data.lst) {
						data  = req_lc_blog_cond_delete					(data);
						data  = req_lc_blog_cond_mod					(data);
						data  = req_lc_blog_cond_like					(data);
//						data  = req_lc_blog_cond_readMore				(data); //use if have cont02 = main content
						data  = req_lc_blog_cond_hide					(data);
						data  = req_lc_blog_cond_showBlogTypPeople		(data);
					}else{
						do_gl_show_Notify_Msg_Error ($.i18n('nso_news_result_search'));
					}
				}
				
				if(data.length === 0) do_gl_show_Notify_Msg_Error ($.i18n('nso_news_result_search'));		
				
				$("#div_blog_grid").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST_CONTENT_DETAIL, data));
				
				if (pr_FILTER_V05 == null) {
					$("#div_blog_grid").find("select[name='v05']").val(-1);
				
				}else{
					$("#div_blog_grid").find("select[name='v05']").val(pr_FILTER_V05);
				}
				do_gl_scrollToEle("body");
				do_lc_bind_event_list(data);
				do_gl_initSwiper();
			}
		}
		
		const do_lc_blog_show_pagination_manager = sharedJson => {
			let data 			= [];
			let templContent 	= tmplName.TMPL_LIST_CONTENT_DETAIL;
			if (can_gl_AjaxSuccess(sharedJson)) {
				data 			=  sharedJson[App['const'].RES_DATA];
				if(data.lst) {
					data  = req_lc_blog_cond_delete		(data);
					data  = req_lc_blog_cond_mod		(data);
					data  = req_lc_blog_cond_like		(data);
//					data  = req_lc_blog_cond_readMore	(data); //use if have cont02 = main content
					data  = req_lc_blog_cond_hide		(data);
				} else {
					do_gl_show_Notify_Msg_Error ($.i18n('nso_news_result_search'));
				}
			}
			
			if(data.length === 0) do_gl_show_Notify_Msg_Error ($.i18n('nso_news_result_search'));		
			
			$("#div_blog_grid_manager").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST_CONTENT_MANAGER, data));
			
			if (pr_FILTER_TYP03 == null) {
				$("#div_blog_grid_manager").find("select[name='typ03']").val(-1);
			
			}else{
				$("#div_blog_grid_manager").find("select[name='typ03']").val(pr_FILTER_TYP03);
			}
			
			$("#blog-pagination").removeClass("hide")
			$("#div_blog_grid_manager").removeClass("hide");
			do_gl_scrollToEle("body");
			do_lc_bind_event_list(data);
		}
		
		const req_lc_blog_cond_delete 	= (data) => {
//			if(!data.lst) return []
//			if(!data) return []
			
			if(data.lst) {
				data.lst = data.lst.map(item => {
					if(App.data.user.id==item.uId01){
						item.isDel = true;
						return item;
					}
					
					if((App.data.user.typ01==1 || App.data.user.typ01==2) && App.data.user.rights.includes(RIGHT_U_D)){
						item.isDel = true;
						return item;
					}
					item.isDel = false;
					return item;
				})
			} else {
				data.lst = data.map(item => {
					if(App.data.user.id==item.uId01){
						item.isDel = true;
						return item;
					}
					
					if((App.data.user.typ01==1 || App.data.user.typ01==2) && App.data.user.rights.includes(RIGHT_U_D)){
						item.isDel = true;
						return item;
					}
					item.isDel = false;
					return item;
				})
			}

			return data;
		}
		const req_lc_blog_cond_mod 		= (data) => {
//			if(!data) return []
			
			if(data.lst) {
				data.lst = data.lst.map(item => {
					if(App.data.user.id==item.uId01){
						item.isMod = true;
						return item;
					}
					
					if((App.data.user.typ01==1 || App.data.user.typ01==2) && App.data.user.rights.includes(RIGHT_U_M)){
						item.isMod = true;
						return item;
					}

					item.isMod = false;
					return item;
				})
			} else {
				data.lst = data.map(item => {
					if(App.data.user.id==item.uId01){
						item.isMod = true;
						return item;
					}
					
					if((App.data.user.typ01==1 || App.data.user.typ01==2) && App.data.user.rights.includes(RIGHT_U_M)){
						item.isMod = true;
						return item;
					}

					item.isMod = false;
					return item;
				})
			}

			return data;
		}
		const req_lc_blog_cond_like 	= (data) => {
//			if(!data) return []

			if(data.lst) {
				data.lst = data.lst.map(item => {
					if (item.cont04 && typeof item.cont04==="string") item.cont04 = JSON.parse(item.cont04);
					if (!item.cont04) item.cont04 = [];
					
					item.isLike=false;
					if (item.cont04.includes(App.data.user.id)) item.isLike=true;
					
					return item;
				})
			} else {
				data.lst = data.map(item => {
					if (item.cont04 && typeof item.cont04==="string") item.cont04 = JSON.parse(item.cont04);
					if (!item.cont04) item.cont04 = [];
					
					item.isLike=false;
					if (item.cont04.includes(App.data.user.id)) item.isLike=true;
					
					return item;
				})
			}
			
			return data;
		}
		const req_lc_blog_cond_readMore = (data) => {
			if(!data.lst) return []
			data.lst = data.lst.map(item => {
				item.isRead=false;
				if (item.cont02.length>200) item.isRead=true; 
				return item;
			})
			return data;
		}
		const req_lc_blog_cond_hide	 	= (data) => {
//			if(!data) return []

			if (data.lst) {
				data.lst = data.lst.map(item => {
					if(App.data.user.id==item.uId01){
						item.isHide = true;
						return item;
					}
					
					if((App.data.user.typ01==2 || App.data.user.typ01==1) && App.data.user.rights.includes(RIGHT_U_M)){
						item.isHide = true;
						return item;
					}

					item.isHide = false;
					return item;
				})
			} else {
				data.lst = data.map(item => {
					if(App.data.user.id==item.uId01){
						item.isHide = true;
						return item;
					}
					
					if((App.data.user.typ01==2 || App.data.user.typ01==1) && App.data.user.rights.includes(RIGHT_U_M)){
						item.isHide = true;
						return item;
					}

					item.isHide = false;
					return item;
				})
			}
			
			return data;
		}
		
		const req_lc_blog_cond_showBlogTypPeople	 	= (data) => {
//			if(!data) return []

			if (data.lst) {
				data.lst = data.lst.map(item => {
					
					if(App.data.user.typ01==3){
						if (item.stat02 === 4 || item.stat02 === 10) {
					        return null; // Đánh dấu các bài viết cần loại bỏ
						}
						return item;
					}
					
					if(App.data.user.typ01==4){
						if (item.stat02 === 3 || item.stat02 === 10) {
					        return null; // Đánh dấu các bài viết cần loại bỏ
						}
						return item;
					}
					
					if(App.data.user.typ01==10){
						if (item.stat02 === 3 || item.stat02 === 4) {
					        return null; // Đánh dấu các bài viết cần loại bỏ
						}
						return item;
					}

					return item;
				})
			} else {
				data.lst = data.lst.map(item => {
									
					if(App.data.user.typ01==3){
						if (item.stat02 === 4 || item.stat02 === 10) {
					        return null; // Đánh dấu các bài viết cần loại bỏ
						}
						return item;
					}
					
					if(App.data.user.typ01==4){
						if (item.stat02 === 3 || item.stat02 === 10) {
					        return null; // Đánh dấu các bài viết cần loại bỏ
						}
						return item;
					}
					
					if(App.data.user.typ01==10){
						if (item.stat02 === 3 || item.stat02 === 10) {
					        return null; // Đánh dấu các bài viết cần loại bỏ
						}
						return item;
					}
	
					return item;
				})
			}
			
			return data;
		}
		//-------------------------------------------------------------------------------------------

		//-------------------------------------------------------------------------------------------
		const do_lc_bind_event_list = (data) => {
			$(".read-more").off("click").on("click", function() {
				let {addr, id, end, code} 	= $(this).data();
				if(!addr || (end ? req_gl_DayDiff(end) < 0 : false)){

					if(id && code){
						do_lc_post_get(id)
					}
				//	App.router.controller.do_lc_run("VI_MAIN/prj_news_list", `view_prj_news_list.html?id=${id}&code=${code}`); 
													
								
					
				}
			})
			$(".like-info").off("click").on("click", function() {
				let {id} 	= $(this).data();
				do_lc_post_like_showInfo(id);	
			})
			
			$(".btn-hide").off("click").on("click", function(data) {
				let {id} 	= $(this).data();
				let stat01=pr_STAT_INVALID
				do_lc_post_mod_st01(id,stat01);
				$(".btn-hide").hide();
				$(".btn-show").show();
			})
			
			$(".btn-show").off("click").on("click", function() {
				let {id} 	= $(this).data();
				let stat01	= pr_STAT_VALIDATED
				do_lc_post_mod_st01(id,stat01);
				$(".btn-hide").show();
				$(".btn-show").hide();

			})
			$(".btn-del").off("click").on("click", function() {
				let {id} = $(this).data();
				App.MsgboxController.do_lc_show({
					title		: $.i18n("nso_del_post_popup"),
					content 	: $.i18n("nso_del_post_popup_content"),
					autoclose	: true,
					css			:{
						"max-width": "400px"
					},		
					buttons		: {
						OK: {
							lab			: $.i18n("common_btn_ok"),
							funct		: function () {do_lc_post_delete(id)},
							autoclose	: true,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}

				});
			});
			
			$(".btn_modify").off("click").on("click", function() {
				let {id} 	= $(this).data();
				do_lc_post_showMod(id)	
			})
			$(".btn-addr").off("click").on("click", function() {
				let {addr, id, end, code} 	= $(this).data();
				if(!addr || (end ? req_gl_DayDiff(end) < 0 : false)){
					if(id && code)
					{
						do_lc_post_get(id)
					}
				}
			})
			$(".btn_like").off("click").on("click", function() {
				let {id} 	= $(this).data();
				do_lc_post_like(id);	
			})
			$(".btn_dislike").off("click").on("click", function() {
				let {id} 	= $(this).data();
				do_lc_post_dislike(id);	
			})
			$("#inp_search_blog").off("input").on("input", function(e){
				e.preventDefault();
				pr_SEARCH_KEY	= $(this).val();
				let multiStat 	= [];
					multiStat 	= [pr_STAT_VALIDATED].join(",");
				if(pr_SEARCH_KEY == "") {
					pr_TYP03.push(1,2);
				} else {
					pr_TYP03 = pr_TYP03.filter(function(value) {
				    	return value !== 1 && value !== 2;
					});
					pr_TYP03.push(3);
				}
				
				do_gl_execute_debounce(() => do_lc_blog_get(true, multiStat, pr_uId), 1000);
			})
			$("#inp_search_blog_manager").off("input").on("input", function(e){
				e.preventDefault();
				pr_SEARCH_KEY	= $(this).val();
				let multiStat 	= [];
					multiStat 	= [pr_STAT_VALIDATED, pr_STAT_INVALID].join(",");
					pr_uId 		= App.data.user.id;
				do_gl_execute_debounce(() => do_lc_blog_get_manager(true, multiStat, pr_uId), 1000);
			})
			$("#filter_typ03").on("change", function() {
				var selectedValue = $(this).val();
				let multiStat 	= [];
				if(!forme){
					multiStat 	= [pr_STAT_VALIDATED].join(",");
				} else {
					multiStat 	= [pr_STAT_VALIDATED, pr_STAT_INVALID].join(",");
					pr_uId 		= App.data.user.id;
				}
				if(selectedValue!=null && selectedValue!=-1)
				{
					pr_FILTER_TYP03 = selectedValue;
					pr_SEARCH_KEY = "";
				}
				else if (selectedValue==-1)
				{
					pr_FILTER_TYP03 = null;
					pr_SEARCH_KEY = "";
				}
				do_gl_execute_debounce(do_lc_blog_get_manager(true, multiStat, pr_uId));
			});
			$("#filter_cont05").on("change", function() {
				var selectedValue = $(this).val();
				let multiStat 	= [pr_STAT_VALIDATED].join(",");
				if(selectedValue!=null && selectedValue!=-1)
				{
					pr_FILTER_V05 = selectedValue;
					pr_TYP03.push(1,2);
					pr_TYP03 = pr_TYP03.filter(function(value) {
					    return value !== 3;
					});
					pr_SEARCH_KEY = "";
				}
				else if (selectedValue==-1)
				{
					pr_FILTER_V05 = null;
					pr_TYP03 = pr_TYP03.filter(function(value) {
					    return value !== 1 && value !== 2;
					});
					pr_SEARCH_KEY = "";
				}
				do_gl_execute_debounce(do_lc_blog_get(true, multiStat, pr_uId));
			});
			
			if (App.data.user.rights.includes(RIGHT_U_N) || App.data.user.rights.includes(RIGHT_ADM)){
				$(".btn-new").off("click").on("click", function(){
					App.router.controller.do_lc_run("VI_MAIN/prj_news_new","view_prj_news_new.html");
				})
			} else{
				$(".btn-new").hide();
			}
			
			if (App.data.user.rights.includes(RIGHT_U_M) || App.data.user.rights.includes(RIGHT_A_G)){
				if(!forme){
					$("#btn-manager").removeClass("hide");
				}else{
					$("#btn-manager").addClass("hide");
				}
				
				$("#btn-manager").off("click").on("click", function(data){
					let multiStat 	= [pr_STAT_VALIDATED, pr_STAT_INVALID].join(",");
//					let multiStat 	= [pr_STAT_VALIDATED].join(",");
					App.router.controller.do_lc_run("VI_MAIN/prj_news_list","view_prj_news_list.html?forced=true&forme=true");
					pr_SEARCH_KEY = "";
					do_lc_blog_get_manager(true, multiStat, App.data.user.id);
					$("#div_blog_grid").addClass("hide");
					$("#div_blog_grid1").removeClass("hide");
				})
			} else{
				$("#btn-manager").addClass("hide");
			}
				
			$("#btn-manager").off("click").on("click", function(data){
				let multiStat 	= [pr_STAT_VALIDATED, pr_STAT_INVALID].join(",");
//				let multiStat 	= [pr_STAT_VALIDATED].join(",");
				App.router.controller.do_lc_run("VI_MAIN/prj_news_list","view_prj_news_list.html?forced=true&forme=true");
				pr_SEARCH_KEY = "";
				do_lc_blog_get_manager(true, multiStat, App.data.user.id);
				$("#div_blog_grid").addClass("hide");
				$("#div_blog_grid1").removeClass("hide");
			})
			
			if(!forme){
				$("#btn_back").addClass("hide");
			}else{
				$("#btn_back").removeClass("hide");
			}
			
			$("#btn_back").off("click").on("click", function(data){
//				let multiStat 	= [pr_STAT_VALIDATED, pr_STAT_INVALID].join(",");
				let multiStat 	= [pr_STAT_VALIDATED].join(",");
				App.router.controller.do_lc_run("VI_MAIN/prj_news_list","view_prj_news_list.html?groupId=-1");
				pr_FILTER_TYP03 = null;
				pr_SEARCH_KEY = "";
				do_lc_blog_get(true, multiStat);
			})
			
//			$(".btn-question").off("click").on("click", function(){
//				$("#question").toggleClass("hide");
//			})
			
			//---LOAD MORE---------------------------------------------------------------------------------------------------
			const cardsNoti = document.querySelectorAll('.col-md-6:first-child .card-item');
			const loadMoreButton = document.getElementById('load-more-noti');
			let currentIndex = 0;
			const cardsPerLoad = 5;
			
			// Hiển thị 5 thẻ đầu tiên khi trang được tải
			showCardsNoti(0, cardsPerLoad);
			
			// Hàm để hiển thị các thẻ card
			function showCardsNoti(startIndex, endIndex) {
			  for (let i = startIndex; i < endIndex && i < cardsNoti.length; i++) {
			    cardsNoti[i].classList.remove("hide");
			  }
			}
			function checkLoadMoreButton() {
			  if (cardsNoti.length >= 6) {
			    loadMoreButton.style.display = 'block'; 
			  } else {
			    loadMoreButton.style.display = 'none';
			  }
			}
			checkLoadMoreButton();
			$("#load-more-noti").off("click").on("click", function(){
				// Hàm xử lý khi nhấn nút "Xem thêm"
				currentIndex += cardsPerLoad;
				showCardsNoti(currentIndex, currentIndex + cardsPerLoad);
				
				// Ẩn nút "Xem thêm" khi hết thẻ card
				if (currentIndex + cardsPerLoad >= cardsNoti.length) {
					loadMoreButton.style.display = 'none';
				}
			})
			
			const cardsNews = document.querySelectorAll('.col-md-6:last-child .card-item');
			const loadMoreButton1 = document.getElementById('load-more-news');
			let currentIndex1 = 0;
			function checkLoadMoreButton1() {
			  if (cardsNews.length >= 6) {
			    loadMoreButton1.style.display = 'block'; 
			  } else {
			    loadMoreButton1.style.display = 'none';
			  }
			}
			checkLoadMoreButton1();
			// Hiển thị 5 thẻ đầu tiên khi trang được tải
			showCardsNew(0, cardsPerLoad);
			
			// Hàm để hiển thị các thẻ card
			function showCardsNew(startIndex, endIndex) {
			  for (let i = startIndex; i < endIndex && i < cardsNews.length; i++) {
			    cardsNews[i].classList.remove("hide");
			  }
			}
			
			$("#load-more-news").off("click").on("click", function(){
				// Hàm xử lý khi nhấn nút "Xem thêm"
				currentIndex1 += cardsPerLoad;
			  	showCardsNew(currentIndex1, currentIndex1 + cardsPerLoad);

			  	if (currentIndex1 + cardsPerLoad  >= cardsNews.length) {
			    	loadMoreButton1.style.display = 'none';
			 	}
			})
			
			const cardsQuestion = document.querySelectorAll('#question .card-item');
			const loadMoreButton2 = document.getElementById('load-more-question');
			let currentIndex2 = 0;
			
			// Hiển thị 5 thẻ đầu tiên khi trang được tải
			showCardsQuestion(0, cardsPerLoad);
			
			// Hàm để hiển thị các thẻ card
			function showCardsQuestion(startIndex, endIndex) {
			  for (let i = startIndex; i < endIndex && i < cardsQuestion.length; i++) {
			    cardsQuestion[i].classList.remove("hide");
			  }
			}
			function checkLoadMoreButton2() {
			  if (cardsQuestion.length >= 6) {
			    loadMoreButton2.style.display = 'block'; 
			  } else {
			    loadMoreButton2.style.display = 'none';
			  }
			}
			checkLoadMoreButton2();
			
			$("#load-more-question").off("click").on("click", function(){
				// Hàm xử lý khi nhấn nút "Xem thêm"
				currentIndex2 += cardsPerLoad;
				showCardsQuestion(currentIndex2, currentIndex2 + cardsPerLoad);
	
				// Ẩn nút "Xem thêm" khi hết thẻ card
				if (currentIndex2 + cardsPerLoad >= cardsQuestion.length) {
					loadMoreButton2.style.display = 'none';
				}
			})
			//------------------------------------------------------------------------------------------------------
		}

		//---GET---------------------------------------------------------------------------------------------------
		const do_lc_post_get = (id) => {
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoPost", "SVGetPost", {id, forced: true,});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_post_get_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		const do_lc_post_get_callback= sharedJson=>{
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data	= sharedJson[App['const'].RES_DATA];
				
				do_lc_post_show				(data);
//				do_lc_post_others_show		(data);

			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"));
			}
		}

		const do_lc_post_show = (obj) => {
			App.MsgboxController.do_lc_show({
				title		: $.i18n("nso_detail_post_msg_title")+" "+obj.uN01,
				content		: tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT_READ_MORE, obj),
				autoclose	: true,
				css			: {
					"width"		: "95%",
					"margin"	: "auto",
					"display"	: "block"
				},
				buttons		: "none",
			});
			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				path && window.open(path, "_blank");
			});
		}
		//---CMT---------------------------------------------------------------------------------------------------
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
		//---LIKE---------------------------------------------------------------------------------------------------
		const do_lc_post_like	= function(id){
			var ref 			= req_gl_Request_Content_Send("ServiceNsoPost", "SVLike");	
			ref.id				= id;
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_lc_post_like_callback, [])); //refresh menu

			var fError 		= req_gl_funct(App, do_gl_show_MsgAjax, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		const do_lc_post_dislike= function (id){
			var ref 			= req_gl_Request_Content_Send("ServiceNsoPost", "SVDislike");	
			ref.id				= id;
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, 	do_lc_post_like_callback, [])); //refresh menu

			var fError 		= req_gl_funct(App, do_gl_show_MsgAjax, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_post_like_callback = (sharedJson) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson.res_data;
				do_lc_build_page(true);
			}else{
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}
		
		
		const do_lc_post_like_showInfo	= function(id){
			var ref 			= req_gl_Request_Content_Send("ServiceNsoPost", "SVLstUserLike");	
			ref.id				= id;
			ref.withAva			= true;
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_lc_post_like_showInfo_callback, [])); //refresh menu

			var fError 		= req_gl_funct(App, do_gl_show_MsgAjax, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_post_like_showInfo_callback = (sharedJson) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson.res_data;
				
				App.MsgboxController.do_lc_show({
					title		: $.i18n("nso_list_like_msg_title"),
					content		: tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST_USER_LIKE, data),
					autoclose	: true,
					buttons		: "none",
					css			: {"width":"300px", "margin-left": "auto", "margin-right": "auto"}
				});
				
			}else{
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}
		//---MOD---------------------------------------------------------------
		const do_lc_post_showMod = (id) => {
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoPost", "SVGetPost", {id, forced: true});	

			let fSucces		= [];

			fSucces.push(req_gl_funct(null, do_lc_post_showMod_callback,[]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		const do_lc_post_showMod_callback= (sharedJson)=>{
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				do_lc_post_showMod_Content(data);
			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"));
			}
		}

		const do_lc_post_showMod_Content = (obj) => {
			//let data = {blog, cats : App.data.cats, typs : App.data.offerTyps};		
			$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_MODIFY, obj));
			
			App.SummerNoteController.do_lc_show("#div_blog_content", {height : 100});//text editor
			
			do_lc_post_showMod_FileUploader	(obj);
			do_lc_post_showMod_bindEvent	(obj);
		}
		
		const do_lc_post_showMod_FileUploader = function (obj) {		
			if (obj.files) {
				files.files = obj.files;
			}
			let option		= {
					fileinput	: { param : {typ01: 1, typ02: 1, maxFiles : 1}},//option here
					obj			: files//file existing here
			}
			do_gl_init_fileDropzone($("#div_avatar"), option);

			let option2		= {
					fileinput	: { param : {typ01: 2, typ02: 10}},//option here
					obj			: files//file existing here
			}

			do_gl_init_fileDropzone($("#div_files"), option2);
		}
		
		const do_lc_post_showMod_bindEvent = (obj) => {
			$("#btn_cancel").off("click").on("click", () => {
				App.router.controller.do_lc_run("VI_MAIN/prj_news_list","view_prj_news_list.html");
			})

			$("#btn_save_blog").off("click").on("click", () => {
				let data = req_gl_data({
					dataZoneDom 	: $("#div_blog"),
					oldObject 		: obj,
				});

				if(data.hasError) {
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));
					return false;
				}
				
				data.data.dt03			= do_lc_convert_date(data.data.dt03);

				do_lc_post_mod(data);
			})
			$("#tmpicker_Begin").timepicker({//timepicker
				showMeridian: false,
				defaultTime :'7:00',
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
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
		
		
	
		//-----------POST MOD------------------------------------------------------------------------------------------
		const do_lc_post_mod = (data, lang) => {
			let ref		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD);

			let fSucces	= [];
			fSucces.push(req_gl_funct(null, do_lc_post_mod_callback, []));

			let fError 	= req_gl_funct(App, do_gl_show_MsgAjax, [$.i18n("common_err_ajax")]);

			data.data.files = files.files;
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}

		const do_lc_post_mod_callback = (sharedJson) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n("common_success_update"));
				let data = sharedJson.res_data;
				App.router.controller.do_lc_run("VI_MAIN/prj_news_list","view_prj_news_list.html?forced=true&forme=true");
			}else{
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}
		
		const do_lc_post_mod_st01 = (id, stat01) => {
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoPost", "SVModStat", {id, forced: true, stat01});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_post_mod_st01_callback,[]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		const do_lc_post_mod_st01_callback= sharedJson=>{
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n("nso_news_post_save_success"));
				
				let data 	= sharedJson[App['const'].RES_DATA];
				do_lc_build_page(true, forme);
			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"));
			}
		}
		
		//-----------POST DEL ------------------------------------------------------------------------------------------
		const do_lc_post_delete 	= function (id){
			var ref 		= req_gl_Request_Content_Send("ServiceNsoPost", "SVDel");	
			ref.id			= id;

			var lock 		= {};			
			lock.objectType = pr_TYPE_BLOG; 	//integer
			lock.objectKey 	= id; 		//integer
			ref['lock'	]	= JSON.stringify(lock);

			var fSucces		= [];
			fSucces.push(req_gl_funct(null	, do_lc_post_delete_callback	, [])); //refresh menu

			var fError 		= req_gl_funct(App, do_gl_show_MsgAjax, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);			
		}

		const do_lc_post_delete_callback = (sharedJson) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n('nso_del_post_success'));
				do_lc_build_page(true);
			}else{
				do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_unknow"));
			}
		}
	};

	return BlogMain;
});