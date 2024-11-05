define(['require',
	'jquery',
	'pathparser',
	'group/login/ctrl/LoginController'
	],
	function (
			require, $,
			PathParser,
			LoginController
	) {

	var CommonRouteController = function () {
		var htmlHeader  = null;
		var htmlContent = null;
		var htmlFooter  = null;

		var self 		= this;
		var historyURL 	= [];

		//-------------------------------------------------------------------------------------
		this.do_lc_init = function () {
			if (!App.router)
				App.router  		= {};

			App.router.routes = {
					CMS			: "/cms",
					
					

					VI_MAIN		: "VI_MAIN",

		            CMS_MAIN	: "/cms_main",

		            ONLOAD		: "/onLoad",
		            LOGIN 		: "/login",
		            LOGOUT		: "/logout",
			};
			
			
			App.router.part =  {
				PRJ_PROJECT_CREATE				: "prj_project_new",
				PRJ_PROJECT_LIST				: "prj_project_list",
				PRJ_PROJECT_ENT					: "prj_project_ent",

				PRJ_EPIC_LIST					: "prj_epic_list",
				PRJ_APPOINTMENT_LIST			: "prj_appointment_list",
				PRJ_TASK_LIST					: "prj_task_list",
				
				PRJ_PROJECT_TASK_LIST			: "prj_project_task_list",
				
				PRJ_SPRINT   					: "prj_sprint",
				PRJ_WORKFLOW   			     	: "prj_workflow",
				
				PRJ_DASHBOARD					: "prj_dashboard",
				
				PRJ_PARTNER  					: "prj_partner",
				PRJ_PARTNER_CREATE				: "prj_partner_new",
				PRJ_PARTNER_LIST				: "prj_partner_list",
				PRJ_PARTNER_ENT					: "prj_partner_ent",
				
				PRJ_USER						: "prj_user",
				PRJ_USER_LIST					: "prj_user_list",
				PRJ_USER_ENT					: "prj_user_ent",
				PRJ_USER_CREATE					: "prj_user_new",
				PRJ_USER_GROUP					: "prj_user_grp",
				PRJ_USER_CLIENT					: "prj_user_client",
				PRJ_TEAM_PLANNING				: "prj_team_planning",
				
				PRJ_CHATROOM					: "prj_chatroom",
				PRJ_CHATROOM_VIDEO				: "prj_chatroom_video",
				
				PRJ_USER_PROFILE_ENT			: "prj_user_profile_ent",
				
				PRJ_EMAIL						: "prj_email",
				PRJ_EMAIL_GROUP					: "prj_email_group",
				PRJ_EMAIL_CAMPAIGN              : "prj_email_campaign",
				
				PRJ_TREEVIEW					: "prj_treeview",
				PRJ_TREE_GLOBAL					: "prj_tree_global",
				
				PRJ_FILE_CREATE					: "prj_file_new",
				PRJ_FILE_LIST					: "prj_file_list",
				PRJ_FILE_ENT					: "prj_file_ent",

				PRJ_POST						: "prj_post",
				PRJ_POST_LIST					: "prj_post_list",
				PRJ_POST_NEW					: "prj_post_new",
				
				PRJ_JOB_CAT                     : "prj_job_cat",
				PRJ_JOB_HOLIDAY_CREATE          : "prj_job_holiday_new",
				PRJ_JOB_HOLIDAY_LIST			: "prj_job_holiday_List",
				PRJ_JOB_HOLIDAY_ENT             : "prj_job_holiday_ent",
				
				PRJ_JOB_REPORT_CREATE           : "prj_job_report_new",
				
				PRJ_JOB_HOLIDAY					: "prj_job_holiday",
				PRJ_JOB_REPORT					: "prj_job_report",
				PRJ_JOB_REPORT_MAN				: "prj_job_report_man",
				
				PRJ_JOB_OFF						: "prj_job_off",
				PRJ_JOB_OFF_MAN					: "prj_job_off_man",
				
				PRJ_USR_PW_RESET    			: "prj_usr_pw_reset_view",
				
				PRJ_TPY_CAT                     : "prj_tpy_cat",

				PRJ_TEST_UNIT					: "prj_test_unit",
				PRJ_TEST_CAMPAIGN				: "prj_test_campaign",

				PRJ_STICKY_NOTE					: "prj_sticky_note",

				PRJ_NEWS						: "prj_news",
				PRJ_NEWS_LIST					: "prj_news_list",
				PRJ_NEWS_NEW					: "prj_news_new",
				
				PRJ_CFG_GROUP					: "prj_cfg_group",
				
				TPY_CAT_DISEASE					: "tpy_cat_disease",
				
				PRJ_MNG_TEST					: "prj_mng_test",
				PRJ_TEST_IMG					: "prj_test_img"

				
			}


			if (!this.router)
				this.router        	= new PathParser();

			App.router.controller	= this;

			//---init Login ctrl
			if (!App.controller.common) App.controller.common = {};
        	App.controller.common.Login = new LoginController();
        	App.controller.common.Login.do_lc_init();
        	
			//App.router.controller.do_lc_binding_route()
			this.do_router_init();
		};

		this.req_lc_router = function (){
			return this.router;
		}
		//---------------------------------------------------------------------------------------
		this.do_lc_run = function (route, url) {
			var urlObj 	= history.location || document.location;
			
			if (!route && !url) window.open(urlObj.href, "_self");
			
//			if (!url) url = urlObj.href.substring(urlObj.origin.length+1);
			
			if (url){
//				window.history.replaceState({route: route}, "", url);
				pr_mapping_route[url] = route;
				window.history.pushState({state: route}, "", url);
			}
			
			console.log("Router do_lc_run: " + route);
			this.router.run(route);
			
			//---reset some controllers
			if (App.MsgboxController) App.MsgboxController.do_lc_reset();
			
		};
		//---------------------------------------------------------------------------------------
		this.do_lc_consoleRoute = function (route) {
			console.log(route + "...");
		};

		this.do_lc_pushHistory = function (url) {
			historyURL.push(url);
			if (historyURL.lenght > 50) historyURL.shift();
		};

		this.do_lc_clearHistory = function () {
			historyURL = [];
		};

		this.do_lc_append_custom_tags = (paths) => {
			$('.is_custom_tag').remove()

			if(!paths || Object.keys(paths) <= 0) return;

			const do_req_tag = (key, p) => {
				let tag = key === 'js' ? '<script defer src="#path" class="is_custom_tag"></script>' : '<link href="#path" class="is_custom_tag" rel="stylesheet" type="text/css" />';
				return tag.replace("#path", p);
			}

			Object.keys(paths).map(key => {
				paths[key].map(p => {
					const tag = do_req_tag(key, p)
					$('head').append(tag)
				})
			})
		}
		//---------------------------------------------------------------------------------------

		var pr_mapping_route 			=  {};
		var pr_popEventListnerAdded 	= false;
		
		if (!pr_popEventListnerAdded){
			$(window).bind('popstate', function(event) {
				var urlObj 	= history.location || document.location;
				
				var url		= urlObj.href.substring(urlObj.origin.length+1);
//				var url		= urlObj.pathname.substring(1);
				var route	= pr_mapping_route[url];
				if (route)
					self.do_lc_run (route);

//				console.log(
//					`location: ${document.location}, state: ${JSON.stringify(event.state)}`
//				);
			});
			pr_popEventListnerAdded= true;
		}
		

		this.do_lc_binding_route = function (div){
//			console.log("do_lc_binding_route: " + $(".hnv-route").length);
			var ele = null;
			if (div){
				ele= $(div).find(".hnv-route");
			}else{
				ele= $(".hnv-route");
			}

			if (ele)
				ele.off("click").on("click", function(){
					var route 	= $(this).data("route");
					var url		= $(this).data("url");

					if (ctrlIsPressed){
						setTimeout(function(){
							window.open(url, "_blank");
						},300);
						return;
					}
					
					if (route){
						self.do_lc_run (route, url);
					}
					
					
					
					//---add event remove sidebar in mobile when click
					if ($(window).width()<=1024){
						if($("body").hasClass("sidebar-enable")) $("body").toggleClass("sidebar-enable");
//						$("body").removeClass("vertical-collpsed");
					}
				});
		}
		//---------------------------------------------------------------------------------
		this.do_router_init = function () {
			//----Init path
			if (App.router.routes.ONLOAD)
			this.router.add(App.router.routes.ONLOAD + '/:FIRST_VIEW', function () {
				//{tok, login, pass, wHash, wSalt, salt, rem, time, count}
				let  info = req_gl_LS_SecurityInfo(App.keys.KEY_STORAGE_CREDENTIAL);

				if (!info.login || !info.pass || !info.tok) {
					if (this.FIRST_VIEW)
						App.router.controller.do_lc_run(App.router.routes.LOGIN + "/" + this.FIRST_VIEW);
					else
						App.router.controller.do_lc_run(App.router.routes.LOGIN);
				} else {
					App.controller.common.Login.do_lc_Login_Bg(this.FIRST_VIEW, info);
					self.do_lc_pushHistory(this.url);
				}
				
			});
			
			this.router.add(App.router.routes.LOGIN + '/:FIRST_VIEW', function () {
				let {url, FIRST_VIEW} = this;
				App.controller.common.Login.do_lc_show(FIRST_VIEW);
				
				self.do_lc_pushHistory(this.url);
			});
			//-------------------------------------------------------------------------------------------------------
			if (App.router.routes.VI_MAIN)
			this.router.add(App.router.routes.VI_MAIN+ '/:nextView', function () {
				let { url } = this;
				
				if (App.controller.DBoard && App.controller.DBoard.DBoardMain){
					App.controller.DBoard.DBoardMain.do_lc_show_content_afterLogin(this.nextView, null); 
					
				}else{
					let options = {
							grpName		: "DBoard", 
							ctrlName	: "DBoardMain",
							ctrlPath	: "group/home/ctrl/Main", 
							ctrlParams	: [],
							fInit		: "do_lc_init", 
							fInitParams	: [],
							fShow		: "do_lc_show", 
							fShowParams	: [],
							fCallBack  		: null,
							fCallBackParams	: null 
					}

					do_gl_load_JSController_ByRequireJS(App.controller, options);
				}
				
				self.do_lc_pushHistory(this.url);
			});
			//-------------------------------------------------------------------------------------------------------
			if (App.router.routes.CMS)
			this.router.add(App.router.routes.CMS + '/:nextView', function () {
				let mainCtrl = {
						grpName  		: "CMS",
						ctrlName       	: "Main",
						ctrlPath       	: 'group/cms/ctrl/CMSController',
						ctrlParams 		: [null, null, null],
						fInit      		: "do_lc_init",
						fInitParams		: null,
						fShow      		: "do_lc_show",
						fShowParams		: [this.nextView], 
						fCallBack  		: null,
						fCallBackParams	: null
				}

				do_gl_load_JSController_ByRequireJS(App.controller, mainCtrl);
				self.do_lc_pushHistory(this.url);
			});
			
			//------------------------------------------------------------------------------
			if (App.router.routes.LOGOUT)
			this.router.add(App.router.routes.LOGOUT + '/:FIRST_VIEW', function () {
				if (App) {
					App.data            = {};
					App.data.session_id = -1;
				}

				self.do_lc_clearHistory();
				
				do_gl_LS_SecurityInfo_Remove (App.keys.KEY_STORAGE_CREDENTIAL);
				
				var urlObj 	= history.location || document.location;
				window.open (urlObj.origin, "_self");
//				self.do_lc_run(App.router.routes.LOGIN);
			});

		}

	};
	return CommonRouteController;
});
