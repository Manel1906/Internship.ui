define([
        'text!group/home/tmpl/Main.html',
        
        'group/home/ctrl/MainCommon' // return 5 controllers
        ],
        function(	Tmpl,
        		
        		{
		        	MainHeader,
		        	MainNotification,
		        	MainMessage,
		        	MainSidebar,
		        	MainFavorite,
		        	MainHandlebarsDef
        		}
        ) {
	const Main 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"Home";
		var pr_grpPath				= 'group/home';
		const tmplName				= App.template.names[pr_grpName] = {};
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;		
		//------------------------------------------------------------------------------------
		const pr_TYPE02_PRJ 		= 0;
		const pr_TYPE02_EPIC 		= 1;
		const pr_TYPE02_TASK 		= 2;
		
		const pr_GRVAL_CURRENCY		= 15;
		const pr_SYS_TIME			= 5000;
		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		
		//------------------------------------------------------------------------------------
	
		this.pr_LST_USER_ONLINE		= [];
					
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			App.data["HttpSecuHeader"]					= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);

			do_lc_appVersion();
			//-----------------------------------------------------------------------------------------------------------
			tmplName.VI_MAIN							= pr_grpName+"Main";
			tmplName.VI_RIGHTBAR						= pr_grpName+"Main_Rightbar";
			
			tmplName.VI_SIDEBAR							= pr_grpName+"Main_Sidebar";
			tmplName.VI_SIDEBAR_FAVORITE				= pr_grpName+"Main_Sidebar_Favorite";
			tmplName.VI_HEADER							= pr_grpName+"Main_Header";
			tmplName.VI_NOTIFICATION					= pr_grpName+"Main_Notification";
			tmplName.VI_MESSAGE							= pr_grpName+"Main_Message"
			
			tmplCtrl.do_lc_put_tmplRaw(Tmpl, pr_grpName);
			//-----------------------------------------------------------------------------------------------------------
			loadContructor();
			do_lc_get_cfg_group_values();
		}
		
		const loadContructor = () => {
			let pr_CONTROLLER = {Message:MainMessage, Notify: MainNotification, Sidebar: MainSidebar, Header: MainHeader, Fav: MainFavorite, Def: MainHandlebarsDef};
			
			if (!App.controller) 	App.controller 		= {};
			if (!App.controller.UI) App.controller.UI 	= {};
			
			App.controller.UI.Main = this;
			
			for(let name in pr_CONTROLLER){
				if (!App.controller.UI[name]){
					App.controller.UI[name]			= new pr_CONTROLLER[name](pr_grpName, null, null , null);
					App.controller.UI[name]			.do_lc_init();
				}  
			}
			
//			if (!App.controller.ChatRoom.Socket)  
//				 App.controller.ChatRoom.Socket					= new PrjSocketController();
			
		}
		
		this.do_lc_show = function(){
			do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_content_callback);
		};			
		
		this.do_lc_show_content_callback = function(nextView, paramsShow){
			try { 
				$("#layout-wrapper")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.VI_MAIN		, {}));
				$("#div_right_bar")				.html(tmplCtrl.req_lc_compile_tmpl(tmplName.VI_RIGHTBAR	, {url: UI_URL_ROOT}));
				
				App.controller.UI.Header.do_lc_show();
				App.controller.UI.Sidebar.do_lc_show();
				App.controller.UI.Fav.do_lc_build_myFavorites();
				
				$("#login_page")				.html("");
//				App.controller.ChatRoom.Socket.do_gl_init_SocketChat(App.data.user.login);
				
				self.do_lc_show_content_afterLogin (nextView, paramsShow);
				
			}catch(e) {				
				console.log(e);
			}
		};
		
		this.do_lc_show_content_afterLogin = function(nextView, paramsShow){
			try { 
//				$("#layout-wrapper")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.VI_MAIN		, {}));
//				$("#div_right_bar")				.html(tmplCtrl.req_lc_compile_tmpl(tmplName.VI_RIGHTBAR	, {url: UI_URL_ROOT}));
//				
//				App.controller.UI.Header.do_lc_show();
//				App.controller.UI.Sidebar.do_lc_show();
//				App.controller.UI.Fav.do_lc_build_myFavorites();
//				
//				$("#login_page")				.html("");
//				App.controller.ChatRoom.Socket.do_gl_init_SocketChat(App.data.user.login);
				
				//---remove all loader
				App.network.do_lc_reset_loader ();
				
				self.do_lc_show_content(nextView, paramsShow);
				
			}catch(e) {				
				console.log(e);
			}
		};
		
		this.do_lc_switch_mobile_or_pc = function(url, view_part, paramsShow, target = '_self'){
//			if(can_gl_MobileOrTablet()){
//				VIEW_PART = view_part;
//				do_lc_show_content(paramsShow);
//			} else {
//				window.open(url, target);
//			}
			
			App.router.controller.do_lc_run (view_part, url);
		}
		
		this.do_lc_load_Ctrl = function(ctrlJson) {
			if (!ctrlJson) return null;
			var rightToAccess = ctrlJson.rights;
			if(!can_gl_access_withRights(rightToAccess)) return null;
			
			var grpName =  ctrlJson? ctrlJson.grpName : "";
			var ctrName =  ctrlJson? ctrlJson.ctrlName: "";
			
			do_gl_load_JSController_ByRequireJS(App.controller, ctrlJson);
		}
		
		this.do_lc_show_content = function(nextView, paramsShow) {
			if (nextView){
				VIEW_PART = nextView;
			}
			
			if (!pr_DATA_CTRL[VIEW_PART]) VIEW_PART = App.router.part.PRJ_DASHBOARD;
			
			var rightToAccess = pr_DATA_CTRL[VIEW_PART].rights;
			if(!can_gl_access_withRights(rightToAccess)) VIEW_PART = App.router.part.PRJ_DASHBOARD;
				
			var grpName =  pr_DATA_CTRL[VIEW_PART]? pr_DATA_CTRL[VIEW_PART].grpName : "";
			var ctrName =  pr_DATA_CTRL[VIEW_PART]? pr_DATA_CTRL[VIEW_PART].ctrlName: "";
			
			if (App.controller[grpName] && App.controller[grpName][ctrName]){
				var fInit = pr_DATA_CTRL[VIEW_PART].fInit;
				if (fInit		) 	App.controller[grpName][ctrName][fInit]();
				
				var fShow = pr_DATA_CTRL[VIEW_PART].fShow;
				if (!paramsShow	)	paramsShow		=  []; 
				if (fShow		) 	App.controller[grpName][ctrName][fShow](...paramsShow);
			}else{
				pr_DATA_CTRL[VIEW_PART].fShowParams = paramsShow;
				do_gl_load_JSController_ByRequireJS(App.controller, pr_DATA_CTRL[VIEW_PART]);
			}
			do_lc_bind_event_main(); ///---cần xem lại vì content build sau khi được gọi
		}
		
		const do_lc_bind_event_main = () => {
//			$(".menu-item-prj").off("click").on("click", function() {
//				let {href, viewpart} = $(this).data();
//				(href && viewpart) && self.do_lc_switch_mobile_or_pc(href, viewpart);
//			})
			
			App.router.controller.do_lc_binding_route();
			
			do_gl_bind_page();
		};
		
		const pr_DATA_CTRL = {
				//-------USER----------------------------------------------------------------------------------------------
				[App.router.part.PRJ_USER_CLIENT]		: {
					grpName		: "PrjUser"									, ctrlName 		: "Main", 
					ctrlPath    : "group/user/client/ctrl/PrjUserMain"		, ctrlParams 	: ["PrjUserClient", null, null , null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_USER_LIST_CLIENT]		: {
					grpName		: "PrjUser"									, ctrlName 		: "List", 
					ctrlPath    : "group/user/client/ctrl/PrjUserList"		, ctrlParams 	: ["PrjUserClient", null, "#div_Prj_User_List" , null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_USER_ENT_CLIENT]		: {
					grpName		: "PrjUser"									, ctrlName 		: "Ent", 
					ctrlPath    : "group/user/client/ctrl/PrjUserEnt"		, ctrlParams 	: ["PrjUserClient", null, "#div_Prj_User_Ent" 	, null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [null, var_lc_MODE_SEL],
					rights		: "view:"
				},
				[App.router.part.PRJ_USER_CREATE_CLIENT]	: {
					grpName		: "PrjUser"									, ctrlName 		: "Ent", 
					ctrlPath    : "group/user/client/ctrl/PrjUserEnt"		, ctrlParams 	: ["PrjUserClient", null, "#div_Prj_User_Ent" 	, null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [null, var_lc_MODE_NEW],
					rights		: "view:"
				},
				[App.router.part.PRJ_USER]		: {
					grpName		: "PrjUser"									, ctrlName 		: "Main", 
					ctrlPath    : "group/user/intern/ctrl/PrjUserMain"		, ctrlParams 	: ["PrjUser", null, null , null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_USER_LIST]		: {
					grpName		: "PrjUser"									, ctrlName 		: "List", 
					ctrlPath    : "group/user/intern/ctrl/PrjUserList"		, ctrlParams 	: ["PrjUser", null, "#div_Prj_User_List" , null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_USER_ENT]		: {
					grpName		: "PrjUser"									, ctrlName 		: "Ent", 
					ctrlPath    : "group/user/intern/ctrl/PrjUserEnt"		, ctrlParams 	: ["PrjUser", null, "#div_Prj_User_Ent" 	, null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [null, var_lc_MODE_SEL],
					rights		: "view:"
				},
				[App.router.part.PRJ_USER_CREATE]	: {
					grpName		: "PrjUser"									, ctrlName 		: "Ent", 
					ctrlPath    : "group/user/intern/ctrl/PrjUserEnt"		, ctrlParams 	: ["PrjUser", null, "#div_Prj_User_Ent" 	, null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [null, var_lc_MODE_NEW],
					rights		: "view:"
				},
				[App.router.part.PRJ_USER_GROUP]	: {
					grpName		: "PrjUserGroup"							, ctrlName 		: "Main", 
					ctrlPath    : "group/user_group/ctrl/PrjUserGroupMain"	, ctrlParams 	: ["PrjUserGroup", null, null, null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				
				[App.router.part.PRJ_USER_PROFILE_ENT]		: {
					grpName		: "PrjUserProfile"							, ctrlName 		: "Ent", 
					ctrlPath    : "group/user_profile/ctrl/PrjUserProfileEnt", ctrlParams 	: ["PrjUserProfile", null, "#div_Prj_User_Ent" , null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				
				
				//------DASHBOARD-----------------------------------------------------------------------------------------------
				[App.router.part.PRJ_DASHBOARD]		: {
					grpName		: "PrjDashboard"							, ctrlName 		: "Ent", 
					ctrlPath    : "group/dashboard/ctrl/PrjDashboardEnt"	, ctrlParams 	: ["PrjDashboard", null, null, null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				
				[App.router.part.PRJ_STICKY_NOTE]		: {
					grpName		: "PrjStickyNote"									, ctrlName 		: "StickyNote", 
					ctrlPath    : "group/user_note/ctrl/PrjStickyNoteMain"			, ctrlParams 	: ["PrjStickyNote", null, "#div_main_content" , null, ], 
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					rights		: "view:"
				},
				
				[App.router.part.PRJ_APPOINTMENT_LIST]		: {
					grpName		: "PrjAppointmentList"									, ctrlName 		: "List", 
					ctrlPath    : "group/user_appointment/ctrl/PrjAppointmentList"		, ctrlParams 	: ["PrjAppointmentList", null, null , null, ], 
					fInit		: "do_lc_init"											, fInitParams	: [],
					fShow		: "do_lc_show"											, fShowParams	: [],
					rights		: "view:"
				},
				
				//------PARTNER-----------------------------------------------------------------------------------------------
				[App.router.part.PRJ_PARTNER]	: {
					grpName		: "PrjPartner"								, ctrlName 		: "Main", 
					ctrlPath    : "group/per_partner/ctrl/PrjPartnerMain"	, ctrlParams 	: ["PrjPartner", null, null , null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_PARTNER_LIST]	: {
					grpName		: "PrjPartner"								, ctrlName 		: "List", 
					ctrlPath    : "group/per_partner/ctrl/PrjPartnerList"	, ctrlParams 	: ["PrjPartner", null, "#div_Prj_Partner_List" , null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_PARTNER_ENT]	: {
					grpName		: "PrjPartner"								, ctrlName 		: "Ent", 
					ctrlPath    : "group/per_partner/ctrl/PrjPartnerEnt"	, ctrlParams 	: ["PrjPartner", null, "#div_Prj_Partner_Ent_Header"	, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [null, var_lc_MODE_SEL],
					rights		: "view:"
				},
				[App.router.part.PRJ_PARTNER_CREATE]: {
					grpName		: "PrjPartner"								, ctrlName 		: "Ent", 
					ctrlPath    : "group/per_partner/ctrl/PrjPartnerEnt"	, ctrlParams 	: ["PrjPartner", null, "#div_Prj_Partner_Ent" 		, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [null, var_lc_MODE_NEW],
					rights		: "view:"
				},
				//----------------------------------------------------------------------------------------------------------------------
				[App.router.part.PRJ_PROJECT_CREATE]: {
					grpName		: "PrjProject"								, ctrlName 		: "EntNew", 
					ctrlPath    : "group/prj/project/ctrl/PrjProjectEntNew"	, ctrlParams 	: ["PrjProject", null, "#div_PrjProject_Ent" 			, null],
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_PROJECT_LIST]	: {
					grpName		: "PrjProject"								, ctrlName 		: "List", 
					ctrlPath    : "group/prj/project/ctrl/PrjProjectList"	, ctrlParams 	: ["PrjProject", null, "#div_PrjProject_List" 		, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_PROJECT_ENT]	: {
					grpName		: "PrjProject"								, ctrlName 		: "Ent", 
					ctrlPath    : "group/prj/project/ctrl/PrjProjectEnt"	, ctrlParams 	: ["PrjProject", null, "#div_PrjProject_Ent_Header" 	, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					fCallBack	: function(){},
					rights		: "view:"
				},
				[App.router.part.PRJ_EPIC_LIST]		: {
					grpName		: "PrjProject"								, ctrlName 		: "List", 
					ctrlPath    : "group/prj/project/ctrl/PrjProjectList"	, ctrlParams 	: ["PrjProject", null, "#div_PrjProject_List" 		, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [pr_TYPE02_EPIC],
					rights		: "view:"
				},
				
				//---------------------------------------------------------------------------------------------------------------------------
				[App.router.part.PRJ_TASK_LIST]		: {
					grpName		: "PrjKanban"									, ctrlName 		: "List", 
					ctrlPath    : "group/prj/kanban/ctrl/PrjTaskList"			, ctrlParams 	: ["PrjKanban", null, "#div_Prj_Task_List" 			, null], 
					fInit		: "do_lc_init"									, fInitParams	: [],
					fShow		: "do_lc_show"									, fShowParams	: [],
					rights		: "view:"
				},
				
				[App.router.part.PRJ_PROJECT_TASK_LIST]		: {
					grpName		: "PrjProjectTask"										, ctrlName 		: "Main", 
					ctrlPath    : "group/prj/task/ctrl/PrjProjectTaskMain"				, ctrlParams 	: ["PrjProjectTask", null, "#div_main_content" 	, null], 
					fInit		: "do_lc_init"											, fInitParams	: [],
					fShow		: "do_lc_show"											, fShowParams	: [],
					rights		: "view:"
				},
				
				[App.router.part.PRJ_SPRINT]		: {
					grpName		: "PrjSprint"											, ctrlName 		: "Main", 
					ctrlPath    : "group/prj/sprint/ctrl/PrjSprintMain"					, ctrlParams 	: ["PrjSprint", null, "#div_main_content" , null], 
					fInit		: "do_lc_init"											, fInitParams	: [],
					fShow		: "do_lc_show"											, fShowParams	: [],
					rights		: "view:"
				},	
			
				[App.router.part.PRJ_WORKFLOW]		: {
					grpName		: "PrjWorkflow"											, ctrlName 		: "Main", 
					ctrlPath    : "group/prj/workflow/ctrl/PrjWorkflowMain"		, ctrlParams 	: ["PrjWorkflow", null, "#div_main_content" 			, null], 
					fInit		: "do_lc_init"											, fInitParams	: [],
					fShow		: "do_lc_show"											, fShowParams	: [],
					rights		: "view:"
				},	
				
				//-----------------------------------------------------------------------------------------------
				
				[App.router.part.PRJ_TREEVIEW]		: {
					grpName		: "PrjTreeView"								, ctrlName 		: "Ent", 
					ctrlPath    : "group/prj/treeview/ctrl/TreeViewEnt"		, ctrlParams 	: ["PrjTreeView", null, null 							, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_TREE_GLOBAL]		: {
					grpName		: "PrjTreeGlobal"							, ctrlName 		: "Ent", 
					ctrlPath    : "group/prj/treeview/ctrl/TreeGlobalEnt"	, ctrlParams 	: ["PrjTreeGlobal", null, null 							, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				//-----------------------------------------------------------------------------------------------
				
				[App.router.part.PRJ_TEAM_PLANNING]		: {
					grpName		: "PrjUserTeamPlanning"								, ctrlName 		: "Ent", 
					ctrlPath    : "group/user_team_plan/ctrl/UserTeamPlanningEnt"	, ctrlParams 	: ["PrjUserTeamPlanning", null, null 	, null], 
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					rights		: "view:"
				},
				
				[App.router.part.PRJ_CHATROOM]		: {
					grpName		: "ChatRoom"								, ctrlName 		: "Main", 
					ctrlPath    : "group/nso_chatroom/ctrl/ChatRoomMain"	, ctrlParams 	: ["ChatRoom", null, "#div_ChatRoom_Main" 			, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				
				[App.router.part.PRJ_CHATROOM_VIDEO]		: {
					grpName		: "ChatRoom"									, ctrlName 		: "Main", 
					ctrlPath    : "group/nso_chatroom_video/ctrl/ChatRoomMain"	, ctrlParams 	: ["ChatRoom", null, "#div_ChatRoom_Main" 			, null], 
					fInit		: "do_lc_init"									, fInitParams	: [],
					fShow		: "do_lc_show"									, fShowParams	: [],
					rights		: "view:"
				},
				
				//---------------------------------------------------------------------------------------------------------------------------
				[App.router.part.PRJ_EMAIL]		: {
					grpName		: "PrjEmail"								, ctrlName 		: "Main", 
					ctrlPath    : "group/nso_email/ctrl/EmailMain"			, ctrlParams 	: ["PrjEmail", null, null 							, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_EMAIL_GROUP]		: {
					grpName		: "PrjEmailGroup"								, ctrlName 		: "Main", 
					ctrlPath    : "group/nso_email_group/ctrl/EmailGroupMain"  , ctrlParams 	: ["PrjEmailGroup", null, "#div_main_content" 			, null], 
					fInit		: "do_lc_init"									, fInitParams	: [],
					fShow		: "do_lc_show"									, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_EMAIL_CAMPAIGN]		: {
					grpName		: "PrjEmailCam"							    , ctrlName 		: "Main", 
//					ctrlPath    : "group/nso_email/ctrlcam/PrjEmailCamMain" , ctrlParams 	: [null, "#div_main_content" 			, null], 
					ctrlPath    : "group/nso_email_camp/ctrl/EmailCamMain" 	, ctrlParams 	: ["PrjEmailCam", null, "#div_main_content" 			, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				
				//---------------------------------------------------------------------------------------------------------------------------
				[App.router.part.PRJ_FILE_CREATE]: {
					grpName		: "PrjFiles"								, ctrlName 		: "EntNew", 
					ctrlPath    : "group/prj/file/ctrl/PrjFilesEntNew"	    , ctrlParams 	: ["PrjFiles", null, "#div_PrjProject_Ent" 			, null],
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_FILE_LIST]	: {
					grpName		: "PrjFiles"								, ctrlName 		: "List", 
					ctrlPath    : "group/prj/file/ctrl/PrjFilesList"	    , ctrlParams 	: ["PrjFiles", null, "#div_PrjProject_List" 		, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_FILE_ENT]	: {
					grpName		: "PrjFiles"								, ctrlName 		: "Ent", 
					ctrlPath    : "group/prj/file/ctrl/PrjFilesEnt"	    	, ctrlParams 	: ["PrjFiles", null, "#div_PrjProject_Ent_Header" 	, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					fCallBack	: function(){},
					rights		: "view:"
				},
				//---------------------------------------------------------------------------------------------------------------------------
				// [App.router.part.PRJ_TPY_CAT]	: {
				// 	grpName		: "TpyCat"									        , ctrlName 		: "Main", 
				// 	ctrlPath    : "group/job/category/ctrl/TpyCatMain"			, ctrlParams 	: ["TpyCat", null, "#div_main_content" , null], 
				// 	fInit		: "do_lc_init"										, fInitParams	: [],
				// 	fShow		: "do_lc_show"										, fShowParams	: [],
				// 	fCallBack	: function(){}
				// },

				[App.router.part.PRJ_JOB_CAT]	: {
					grpName		: "PrjJobCat"									    , ctrlName 		: "Main", 
					ctrlPath    : "group/job/category/ctrl/TpyCatMain"				, ctrlParams 	: ["PrjJobCat", null, "#div_main_content" , null], 
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					fCallBack	: function(){},
					rights		: "view:"
				},
				
				[App.router.part.PRJ_JOB_REPORT_CREATE]: {
					grpName		: "PrjJobReport"									, ctrlName 		: "Ent", 
					ctrlPath    : "group/job/report/ctrl/PrjJobReportEnt"	    	, ctrlParams 	: ["PrjJobReport", null, "#div_Prj_JobReport_Ent" , null],
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_check_acive_msg_config_user"				, fShowParams	: [],
					rights		: "view:"
				},
				
				[App.router.part.PRJ_JOB_REPORT]	: {
					grpName		: "PrjJobReport"									, ctrlName 		: "Main", 
					ctrlPath    : "group/job/report/ctrl/JobReportMain"				, ctrlParams 	: ["PrjJobReport", null, "#div_main_content" , null], 
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					fCallBack	: function(){},
					rights		: "view:"
				},
				
				[App.router.part.PRJ_JOB_REPORT_MAN]	: {
					grpName		: "PrjJobReportMan"									, ctrlName 		: "Main", 
					ctrlPath    : "group/job/report_man/ctrl/JobReportMain"			, ctrlParams 	: ["PrjJobReportMan", null, "#div_main_content" , null], 
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					fCallBack	: function(){},
					rights		: "view:"
				},
				
				[App.router.part.PRJ_JOB_HOLIDAY_CREATE]: {
					grpName		: "PrjJobHoliday"									, ctrlName 		: "EntNew", 
					ctrlPath    : "group/job/holiday/ctrl/PrjJobHolidayEntNew"		, ctrlParams 	: ["PrjJobHoliday", null, "#div_Prj_JobHoliday_Ent" , null],
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					rights		: "view:"
				},
				
				[App.router.part.PRJ_JOB_HOLIDAY_LIST]	: {
					grpName		: "PrjJobHoliday"									, ctrlName 		: "List", 
					ctrlPath    : "group/job/holiday/ctrl/PrjJobHolidayList"		, ctrlParams 	: ["PrjJobHoliday", null, "#div_Prj_JobHoliday_List" , null], 
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					fCallBack	: function(){},
					rights		: "view:"
				},
				[App.router.part.PRJ_JOB_HOLIDAY_ENT]	: {
					grpName		: "PrjJobHoliday"									, ctrlName 		: "Ent", 
					ctrlPath    : "group/job/holiday/ctrl/PrjJobHolidayEnt"			, ctrlParams 	: ["PrjJobHoliday", null, "#div_Prj_JobHoliday_Ent" 	, null], 
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					fCallBack	: function(){},
					rights		: "view:"
				},

				[App.router.part.PRJ_JOB_HOLIDAY]	: {
					grpName		: "PrjJobHoliday"									, ctrlName 		: "Main", 
					ctrlPath    : "group/job/holiday/ctrl/JobHolidayMain"			, ctrlParams 	: ["PrjJobHoliday", null, "#div_main_content" , null], 
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					fCallBack	: function(){},
					rights		: "view:"
				},

				

				[App.router.part.PRJ_JOB_OFF]	: {
					grpName		: "PrjJobOff"									    , ctrlName 		: "Main", 
					ctrlPath    : "group/job/day_off/ctrl/JobOffMain"		    	, ctrlParams 	: ["PrjJobOff", null, "#div_main_content" , null], 
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					fCallBack	: function(){},
					rights		: "view:"
				},
				
				[App.router.part.PRJ_JOB_OFF_MAN]	: {
					grpName		: "PrjJobOffMan"									, ctrlName 		: "Main", 
					ctrlPath    : "group/job/day_off_man/ctrl/JobOffMain"			, ctrlParams 	: ["PrjJobOffMan", null, "#div_main_content" , null], 
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					fCallBack	: function(){},
					rights		: "view:"
				},
				
				
				
				[App.router.part.PRJ_USR_PW_RESET]	: {
					grpName		: "PrjUsr"									        , ctrlName 		: "PwReset", 
					ctrlPath    : "group/auth/ctrl/PrjUsrPwReset"					, ctrlParams 	: ["PrjUsr", null, "#div_main_content" , null], 
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					fCallBack	: function(){},
					rights		: "view:"
				},
				
				[App.router.part.PRJ_TEST_UNIT]		: {
					grpName		: "PrjProjecTestUnit"									, ctrlName 		: "Main", 
					ctrlPath    : "group/prj/test/ctrl/PrjTestUnitMain"					, ctrlParams 	: ["PrjProjecTestUnit", null, "#div_main_content" 	, null], 
					fInit		: "do_lc_init"											, fInitParams	: [],
					fShow		: "do_lc_show"											, fShowParams	: [],
					rights		: "view:"
				},	
				[App.router.part.PRJ_TEST_CAMPAIGN]		: {
					grpName		: "PrjProjecTestGroup"									, ctrlName 		: "Main", 
					ctrlPath    : "group/prj/test/ctrl/PrjTestGroupMain"				, ctrlParams 	: ["PrjProjecTestGroup", null, "#div_main_content" 	, null], 
					fInit		: "do_lc_init"											, fInitParams	: [],
					fShow		: "do_lc_show"											, fShowParams	: [],
					rights		: "view:"
				},
			
				[App.router.part.PRJ_NEWS]		: {
					grpName		: "PrjNews"												, ctrlName 		: "News", 
					ctrlPath    : "group/nso_news/ctrl/BlogEnt"					     	, ctrlParams 	: ["PrjNews", null, null 							, null], 
					fInit		: "do_lc_init"											, fInitParams	: [],
					fShow		: "do_lc_show"											, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_NEWS_LIST]		: {
					grpName		: "PrjNews"												, ctrlName 		: "NewsList", 
					ctrlPath    : "group/nso_news/ctrl/BlogMain"						, ctrlParams 	: ["PrjNews", null, null 							, null], 
					fInit		: "do_lc_init"											, fInitParams	: [],
					fShow		: "do_lc_show"											, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_NEWS_NEW]	: {
					grpName		: "PrjNews"												, ctrlName 		: "NewsNew", 
					ctrlPath    : "group/nso_news/ctrl/BlogNew"						    , ctrlParams 	: ["PrjNews", null, null 							, null], 
					fInit		: "do_lc_init"											, fInitParams	: [],
					fShow		: "do_lc_show"											, fShowParams	: [],
					rights		: "view:"
				},
				
				[App.router.part.PRJ_VIDEO_CALL]	: {
					grpName		: "PrjVideoCall"										, ctrlName 		: "VideoCall", 
					ctrlPath    : "group/nso_chatroom/ctrl/Video/Main"					, ctrlParams 	: ["PrjVideoCall", null, null 							, null], 
					fInit		: "do_lc_init"											, fInitParams	: [],
					fShow		: "do_lc_show"											, fShowParams	: [],
					rights		: "view:"
				},
				
				//---------------------------------------------------------------------------------------------------------------------------
				[App.router.part.PRJ_CFG_GROUP]		: {
					grpName		: "CfgGroup"								, ctrlName 		: "Main", 
					ctrlPath    : "group/cfg/value/ctrl/Main"				, ctrlParams 	: ["CfgGroup", null, null , null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				
				//---------------------------------------------------------------------------------------------------------------------------
				[App.router.part.TPY_CAT_DISEASE]	: {
					grpName		: "TpyCatDisease"									, ctrlName 		: "Main", 
					ctrlPath    : "group/tpy/cat_disease/ctrl/TpyCatDiseaseMain"	, ctrlParams 	: ["TpyCatDisease", null, null, null, ], 
					fInit		: "do_lc_init"										, fInitParams	: [],
					fShow		: "do_lc_show"										, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_MNG_TEST]		: {
					grpName		: "PrjManaTest"								, ctrlName 		: "Main", 
					ctrlPath    : "group/test/blood/ctrl/TpyCatBloodMain"	, ctrlParams 	: ["PrjManaTest", null, null , null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
				[App.router.part.PRJ_TEST_IMG]		: {
					grpName		: "PrjTestImg"								, ctrlName 		: "Main", 
					ctrlPath    : "group/test/img/ctrl/TpyTestImgMain"		, ctrlParams 	: ["PrjTestImg", null, null , null, ], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					rights		: "view:"
				},
		}
		
		//--------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
		this.do_show_Msg= function(sharedJson, msg){
			console.log("do_show_Msg::" + msg);
		}
		
		const do_lc_get_cfg_group_values = () => {
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceCfgValuePubl", "SVLst", {ids: JSON.stringify([pr_GRVAL_CURRENCY, pr_SYS_TIME]), withValue: true});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_get_currency, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PUBL, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_after_get_currency = sharedJson => {
			App.data.currencys = {};
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA];
				let currency 	= data.find(val => val.id === pr_GRVAL_CURRENCY);
				if(currency && currency.vals){
					App.data.currencys 	= currency.vals.reduce((curr, val) => {
						curr[val.id] 	= val; return curr;
					}, {});
				}

				let utc 	= data.find(val => val.id === pr_SYS_TIME);
				if(utc && utc.descr){
					try {
						App.data.utc 	= parseFloat(utc.descr, 10);
					} catch (e) {
					}
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}

		this.do_bind_event_btn_vertical_list = function (div_list, div_ent) {

			$("#vertical-list-btn").on("click", function (e) {

				e.preventDefault(),
					$(div_list).toggleClass('col-lg-3 col-md-3');
				$(div_list).toggleClass('col-lg-6 col-md-6');

				$(div_ent).toggleClass('col-lg-9 col-md-9');
				$(div_ent).toggleClass('col-lg-6 col-md-6');

			})
		}

		this.do_lc_bind_event_resize = function () {
			$(".btn-resize").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
		}

		this.do_lc_bind_event_minimize = function (div_list, div_ent) {
			$(".btn-minimize-list").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				$('#vertical-list-btn').toggleClass("hide");

				$(div_list).hasClass('col-lg-3 col-md-3') ? $(div_list).removeClass('col-lg-3 col-md-3') :
					$(div_list).hasClass('col-lg-6 col-md-6') ? $(div_list).removeClass('col-lg-6 col-md-6') : $(div_list).addClass('col-lg-3 col-md-3');;

				$(div_list).toggleClass('col-lg-1 col-md-1');

				$(div_ent).hasClass('col-lg-9 col-md-9') ? $(div_ent).removeClass('col-lg-9 col-md-9') :
					$(div_ent).hasClass('col-lg-6 col-md-6') ? $(div_ent).removeClass('col-lg-6 col-md-6') : $(div_ent).addClass('col-lg-9 col-md-9');;

				$(div_ent).toggleClass('col-lg-11 col-md-11');


				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
		}
		
		//----------------------------------------------------------------------------------------------------------
		var do_lc_appVersion = function(){
			let ref 			= req_gl_Request_Content_Send("ServicePubl", "SVVersion");	

			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_lc_saveAppVersion, []));
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PUBL, header, ref, 100000, fSucces, null) ;	
		}
		var do_lc_saveAppVersion = function (sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let appVers 		= sharedJson[App['const'].RES_DATA];
				localStorage.setItem("appVersion", appVers);
				if (appVersion == "1.25") return;
				if (appVers != appVersion) window.location.reload();
			} else {
			}
		}
	};

	return Main;
  });