define([
	'handlebars'
],
function(	
	Handlebars
){
	const pr_STAT_PRJ_NEW 			= 100100;
	const pr_STAT_PRJ_TODO 			= 100200;
	const pr_STAT_PRJ_INPROGRESS 	= 100300;
	const pr_STAT_PRJ_DONE 			= 100400;
	
	const pr_STAT_PRJ_DEPLOY 		= 100700;
	const pr_STAT_PRJ_TEST 			= 100500;
	const pr_STAT_PRJ_REVIEW 		= 100600;
	
	const pr_STAT_PRJ_CLOSED 		= 100900;
	const pr_STAT_PRJ_UNRESOLVED 	= 100800;
	const pr_ADM					= 2;
	const MainSidebar     			= function (grpName, header,content,footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"Home";
		var pr_grpPath				= 'group/home';
		const tmplName				= App.template.names[pr_grpName];
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Fav 				= null;
		const self					= this;
		const pr_ID_TABLE_PRJ		= 250000;

		const initialValues = {
			lstFav : {}
		}
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 							= App.controller.UI.Main;
			pr_ctr_Fav 								= App.controller.UI.Fav;
		}      

		this.do_lc_show		= function(){
			try{
				do_lc_build_page();
				// do_lc_get_list_favorites();

				/*if (VIEW_PART != "prj_chatroom")
					do_lc_get_minichat();*/
			}catch(e) {				
				console.log(e);
			}
		};

		this.do_lc_show_favorite = () => {
			do_lc_build_page();
		}


		const do_lc_build_page = function(){
			$("#div-menu-sidebar").html(tmplCtrl.req_lc_compile_tmpl(tmplName.VI_SIDEBAR			, initialValues));

			const lstFav = {}
			if(App.data.user.lstFav) {
				Object.keys(App.data.user.lstFav).map(key => {
					if(!App.data.user.lstFav[key].lst || App.data.user.lstFav[key].lst.length <= 0 || +key === 2000) return

					lstFav[key] = App.data.user.lstFav[key]
				})
			}

			$("#li_lst_favorite").html(tmplCtrl.req_lc_compile_tmpl(tmplName.VI_SIDEBAR_FAVORITE	, 
				{lstFav: lstFav}
			));
			
			do_lc_bindEvent_sidebar();
			
			do_gl_apply_right($("#div-menu-sidebar"));
			// do_gl_handle_member_external($("#page-topbar"));
		}

		
		var miniChatCtrl =  {
			grpName		: "MiniChat"								, ctrlName 		: "Ent", 
			ctrlPath    : "group/nso_chatmini/ctrl/MiniChatMain"	, ctrlParams 	: ["MiniChat", null, "#div_mini_chat" 		, null], 
			fInit		: "do_lc_init"								, fInitParams	: [],
			fShow		: null										, fShowParams	: [],
			rights		: "view:"
		};
		
		const do_lc_get_minichat = function() {
			var grpName		 = "MiniChat";
			var ctrlName	 = "Ent";
			if (App.controller[grpName] && App.controller[grpName][ctrlName]){
				App.controller[grpName][ctrlName].do_lc_init();
				App.controller[grpName][ctrlName].do_lc_show_old();
			}else{
				miniChatCtrl.fShow = "do_lc_show_old";
				do_gl_load_JSController_ByRequireJS(App.controller, miniChatCtrl);
			}
		}

		const do_lc_bindEvent_sidebar = () => {
			App.router.controller.do_lc_binding_route();
			
			$("#prj_minichat").off("click").on("click", () => {
				var grpName		 = "MiniChat";
				var ctrlName	 = "Ent";
				if (App.controller[grpName] && App.controller[grpName][ctrlName]){
					App.controller[grpName][ctrlName].do_lc_init();
					App.controller[grpName][ctrlName].do_lc_show("#div_mini_chat");
				}else{
					do_gl_load_JSController_ByRequireJS(App.controller, miniChatCtrl);
				}
			});
			let user = App.data.user.typ01;
			if(user != pr_ADM)
			{
				$(".div-hide").hide();
			}
			

			$(".prj-trash-menu").off("click").on("click", function() {
				let id		= $(this).attr("data-id");
				let type	= $(this).attr("data-type"); //ID_TABLE - 250000: Prj
				id 			= parseInt(id, 10);

				if(!pr_ctr_Fav) pr_ctr_Fav = App.controller.UI.Fav
				if(!pr_ctr_Fav) return;

				pr_ctr_Fav.do_lc_remove_myFavorites({id}, type)
			});

			$("#side-menu").metisMenu();

			$("#sidebar-menu a").each(function() {
				const setActiveMenu = function(){
					$(this).addClass("active");
					$(this).parent().addClass("mm-active");
					$(this).parent().parent().addClass("mm-show");
					$(this).parent().parent().prev().addClass("mm-active");
					$(this).parent().parent().parent().addClass("mm-active");
					$(this).parent().parent().parent().parent().addClass("mm-show");
					$(this).parent().parent().parent().parent().parent().addClass("mm-active");
				}.bind(this);

				let view = window.location.href.split(/[?#]/)[0];

				if(this.href == view){
					setActiveMenu();
					return;
				}

				view = window.location.href.split(/[#]/)[0];
				if(this.href == view){
					setActiveMenu();
					return;
				}
			});

			do_lc_get_open_menu();

			$(".li-has-menu").off("click").on("click", function() {
				const $this		= $(this);
				const {open} 	= $this.data();
				const isOpen 	= $this.hasClass("mm-active");
				let lstOpen 	= JSON.parse(localStorage.getItem(App.keys.KEY_MENU_SIDEBAR_OPEN)) || [];

				if(isOpen){
					!lstOpen.includes(open) && lstOpen.push(open);
				}else{
					lstOpen = lstOpen.filter(o => (o !== open));
				}
				localStorage.setItem(App.keys.KEY_MENU_SIDEBAR_OPEN, JSON.stringify(lstOpen));

				do_lc_get_open_menu();
			})
			
			$(".menu-title").off("click").on("click", function() {
				const 	$this		= $(this);
				const 	data 		= $this.data();
				var 	grp			= data.grp;
				var		open		= data.open;
				
				if (open=="1"){
					data.open = "0";
					$("."+grp).hide();
					$this.addClass('menu-closed');
				}else{
					data.open = "1";
					$("."+grp).show();
					$this.removeClass('menu-closed');
				}
			})
			
			// do_gl_req_right_for_user();
		}

		const do_lc_get_open_menu = () => {
			const menuOpens 	= JSON.parse(localStorage.getItem(App.keys.KEY_MENU_SIDEBAR_OPEN)) || [];
			if(menuOpens.length){
				for(let open of menuOpens){
					const $this		= $(`.li-has-menu[data-open='${open}']`)
					if($this.length){
						const $ul 	= $this.find("ul");
						$this		.addClass("mm-active");
						$ul			.addClass("mm-show");
						$ul			.css("height", "");
						$this		.children("a").attr("aria-expanded", true);
					}
				}
			}
		}

		

		const do_lc_after_remove_favorite_response = (sharedJson, parTyp, parId) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				if(App.data["lstFavorites"])	delete App.data["lstFavorites"][parTyp + "_" + parId];
				do_lc_get_list_favorites();
			}
			App.MsgboxController.do_lc_close();
		}

		const do_lc_get_list_favorites = () => {
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceTpyFavorite", "SVLstByUser");	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_list_favorites, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_after_list_favorites = sharedJson => {
			App.data["lstFavorites"] = {};
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA];
				if(data && data.length){
					App.data["lstFavorites"] = data
						.filter(({entTyp}) => entTyp == pr_ID_TABLE_PRJ)
						.reduce((curr, val) => {
							curr[val.entTyp + "_" + val.entId] 	= val; 
							return curr;
					}, {});
				}
			}

			initialValues.lstFavorite = App.data["lstFavorites"];
			// do_lc_build_page();
		}
	};

	const MainHeader    	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"Home";
		var pr_grpPath				= 'group/home';
		const tmplName				= App.template.names[pr_grpName];
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var self 					= this;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Notify			= null;
		var pr_ctr_Message			= null;

		
		const pr_TYPE_ADMIN_ALL		= 1;
		const pr_TYPE_ADMIN		    = 2;

		const pr_RIGHT_REPORT_SEE	    = 2002001;
		const pr_RIGHT_REPORT_MAN_SEE	= 2002011;
		const pr_RIGHT_HOLIDAY_SEE	    = 2001001;
		const pr_RIGHT_TPY_CAT_SEE	    = 7000001;

		const initialValues 		= {
				isShowSearch : [
					App.router.part.PRJ_PROJECT_LIST, 
					App.router.part.PRJ_EPIC_LIST, 
					App.router.part.PRJ_PARTNER_LIST, 
					App.router.part.PRJ_USER_LIST, 
					App.router.part.PRJ_JOB_HOLIDAY_LIST, 
					App.router.part.PRJ_FILE_LIST
					].includes(VIEW_PART),
		};
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 					= App.controller.UI.Main;
			pr_ctr_Notify					= App.controller.UI.Notify;
			pr_ctr_Message					= App.controller.UI.Message;
		}      

		this.do_lc_show		= function(){
			try{
				do_lc_build_page();
				do_bind_event();
			}catch(e) {				
				console.log(e);
			}
		};

		const do_lc_build_page = function(){
			let user 	= App.data.user;
			if(!user.avatar && user.per.files) user.avatar = user.per.files[0];
			let isAdmin = false;

			if (user.typ01== pr_TYPE_ADMIN_ALL || user.typ01==pr_TYPE_ADMIN){
				isAdmin = true ;
			}

			if (!localStorage.language) localStorage.language= "vi";
			
			$("#page-topbar").html(tmplCtrl.req_lc_compile_tmpl(tmplName.VI_HEADER, {user, url: UI_URL_ROOT, lan: localStorage.language, isAdmin, isShowSearch : initialValues.isShowSearch}));

			pr_ctr_Notify.do_lc_get_CountNew();
			pr_ctr_Notify.do_lc_refresh ();
			
			pr_ctr_Message.do_lc_get_CountMsgNew();
			pr_ctr_Message.do_lc_refresh();
			
			do_lc_get_doc_company_user();

			
			do_gl_apply_right($("#div-menu-functions"));
			do_gl_apply_right($("#div-menu-user-dropdown"));
			
		} 

		//---------private-----------------------------------------------------------------------------
		const do_bind_event = function (){
			App.router.controller.do_lc_binding_route();
			
			$(".a-languge").off("click").on("click", function(){
				let {lan: language, lanid: languageId, loc: locale} 	= $(this).data();

				if (!language || !languageId || !locale) {
					 do_gl_Set_Lang_Build_UI_URL_PATH();
					 locale   	= localStorage.getItem("locale");
					 language 	= localStorage.getItem("language");
					 languageId = localStorage.getItem("languageId");
				}
			        
				$.i18n({locale: language});
				localStorage.locale 	= locale;
				localStorage.language 	= language;
				localStorage.languageId = languageId;
				window.location.reload();
			})

			$("#a_disconnect").off("click").on("click", function(){
				
				const ref 		= req_gl_Request_Content_Send("ServiceAutUser", "SVLogout");	
				let fSucces		= [];
				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
				
				try{
					App.controller.ChatRoom && App.controller.ChatRoom.Socket && App.controller.ChatRoom.Socket.do_lc_close();
				}catch(e){
					
				}
				
				
				App.router.controller.do_lc_run(App.router.routes.LOGOUT);
				
			})
			
			$("#btn_message_dropdown").off("click").on("click", function(){
				pr_ctr_Message.do_lc_show();
				$("#div_message_content").css("display", "");
			})
			
			$("#div_notify_content").off("click").on("click", function(e) {
				e.stopPropagation();
			})
			
			$("#btn_notify_dropdown").off("click").on("click", function(){
				pr_ctr_Notify.do_lc_show();
			})

			$("#btn_page_reload").off("click").on("click", function(){
//				window.open(window.location.href, "_self");
				window.location.reload();
			})
			
			//--------------------------------------------------------------------------------------
			$("#btn_page_max").off("click").on("click", function(){
				do_lc_fullscreen();
			})
			
			$("#btn_page_min").off("click").on("click", function(){
				do_lc_fullscreen();
			})
			
			document.addEventListener("fullscreenchange", function () {
				if (document.fullscreen){
					$("#btn_page_max").hide();
					$("#btn_page_min").show();
					var docElm = document.documentElement;
					docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
				}else{
					$("#btn_page_max").show();
					$("#btn_page_min").hide();
				}
			}, false);

			document.addEventListener("mozfullscreenchange", function () {
				if (document.fullscreen){
					$("#btn_page_max").hide();
					$("#btn_page_min").show();
					var docElm = document.documentElement;
					docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
				}else{
					$("#btn_page_max").show();
					$("#btn_page_min").hide();
				}
			}, false);

			document.addEventListener("webkitfullscreenchange", function () {
				if (document.fullscreen){
					$("#btn_page_max").hide();
					$("#btn_page_min").show();
					var docElm = document.documentElement;
					docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
				}else{
					$("#btn_page_max").show();
					$("#btn_page_min").hide();
				}
			}, false);

			document.addEventListener("msfullscreenchange", function () {
				if (document.fullscreen){
					$("#btn_page_max").hide();
					$("#btn_page_min").show();
					var docElm = document.documentElement;
					docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
				}else{
					$("#btn_page_max").show();
					$("#btn_page_min").hide();
				}
			}, false);
			
			//--------------------------------------------------------------------------------------
			if(App.data.user.rights){
				if(App.data.user.rights.includes(pr_RIGHT_REPORT_SEE))     $("#div_menu_report").removeClass("hide");
				if(App.data.user.rights.includes(pr_RIGHT_REPORT_SEE))     $("#div_menu_dayoff").removeClass("hide");
				if(App.data.user.rights.includes(pr_RIGHT_HOLIDAY_SEE))    $("#div_menu_holiday").removeClass("hide");
				if(App.data.user.rights.includes(pr_RIGHT_TPY_CAT_SEE))    $("#div_menu_tpy_cat").removeClass("hide");
				if(App.data.user.rights.includes(pr_RIGHT_REPORT_MAN_SEE)) {
					$("#div_menu_report_man").removeClass("hide");
					$("#div_menu_dayoff_man").removeClass("hide");
				}
			}

//			if([pr_TYPE_ADMIN_ALL, pr_TYPE_ADMIN].includes(App.data.user.typ)){
//			if(App.data.user.rights.includes(2001001)) $("#div_menu_holiday").show();
//			if(App.data.user.rights.includes(2002011)) $("#div_menu_report_man").show();
//			if(App.data.user.rights.includes(2002011)) $("#div_menu_dayoff_man").show();
//			if(App.data.user.rights.includes(7000001)) $("#div_menu_tpy_cat").show();
//			if(App.data.user.rights.includes(2002001)) $("#div_menu_report").show();
//			}
//			else{
//			$("#div_menu_holiday").hide();
//			$("#div_menu_report_man").hide();
//			$("#div_menu_dayoff_man").hide();
//			$("#div_menu_tpy_cat").hide();
//			if(App.data.user.rights.includes(2002001)) $("#div_menu_report").show();
//			}

//			$("#a_report_man").off("click").on("click", function(){
//			if([pr_TYPE_ADMIN_ALL, pr_TYPE_ADMIN].includes(App.data.user.typ)){
//			window.open("view_prj_job_report_man.html", "_self");
//			}
//			else{
//			window.open("view_prj_job_report.html", "_self");
//			}
//			})
		};

		const do_lc_fullscreen = function() {
		    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
		        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
		        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
		        (document.msFullscreenElement && document.msFullscreenElement !== null);

		    var docElm = document.documentElement;
		    if (!isInFullScreen) {
		        if (docElm.requestFullscreen) {
		            docElm.requestFullscreen();
		        } else if (docElm.mozRequestFullScreen) {
		            docElm.mozRequestFullScreen();
		        } else if (docElm.webkitRequestFullScreen) {
		            docElm.webkitRequestFullScreen();
		        } else if (docElm.msRequestFullscreen) {
		            docElm.msRequestFullscreen();
		        }
		    } else {
		        if (document.exitFullscreen) {
		            document.exitFullscreen();
		        } else if (document.webkitExitFullscreen) {
		            document.webkitExitFullscreen();
		        } else if (document.mozCancelFullScreen) {
		            document.mozCancelFullScreen();
		        } else if (document.msExitFullscreen) {
		            document.msExitFullscreen();
		        }
		    }
		}
		
		const do_lc_get_doc_company_user = () => {
			const dataAvatar  	= localStorage.getItem(App.keys.KEY_COMPANY_DATA_AVATAR);
			const lstDocs 		= dataAvatar ? JSON.parse(dataAvatar) : {};
			if(lstDocs[App.data.user.manId]){
				$(".img-company").attr("src", lstDocs[App.data.user.manId].path01);
			} else {
				do_lc_get_docs_company_user();
			}
		}

		const do_lc_get_docs_company_user = () => {
			const ref 		= req_gl_Request_Content_Send_With_Params("ServicePrjProject", "SVGetDocCompanyUser");	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_get_docs_company, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_after_get_docs_company = sharedJson => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data 			= sharedJson[App['const'].RES_DATA];
				$(".img-company")	.attr("src", data.path01);

				const dataAvatar  	= localStorage.getItem(App.keys.KEY_COMPANY_DATA_AVATAR);
				const lstDocs 		= dataAvatar ? JSON.parse(dataAvatar) : {};

				lstDocs[App.data.user.manId] = data;
				localStorage.setItem(App.keys.KEY_COMPANY_DATA_AVATAR, JSON.stringify(lstDocs));
			} else {

			}
		}
	};
	
	const MainMessage 		= function(grpName, header, content, footer){
		var pr_divHeader 				= header;
		var pr_divContent 				= content;
		var pr_divFooter 				= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName					= grpName?grpName:"Home";
		var pr_grpPath					= 'group/home';
		const tmplName					= App.template.names[pr_grpName];
		const tmplCtrl					= App.template.controller;
		
		//-----------------------------------------------------------------------------------
		const pr_SERVICE_CLASS				= "ServiceMsgMessage"; //to change by your need
		const pr_SV_WAIT_READ				= "SVLstWaitRead";
		const pr_SV_NEW_HISTORY				= "SVChatHistoryNew";
		
		const pr_SERVICE_CLASS_GROUP		= "ServiceNsoGroupChat";
		const pr_SV_GROUP_LIST_CHAT_BY_USER	= "SVLstChatByUser";
		
		const pr_TYP_MSG_PRIVATE		= 200;		
		const pr_NUMBER_MESSAGE			= 40;
		const pr_TIME_REFRESH_MESSAGE 	= 10*60*1000;
		const pr_TYP_CHAT_RELATE		= 3;
		
		var route 						= "VI_MAIN/prj_chatroom";
		var url 						= '';
		
		var List_UnRead 				= [];
		
		var pr_BEGIN_MESSAGE			= 0;
		var self						= this;
		
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 					= App.controller.UI.Main;
		}
		//---------------------------------------------------------------
		this.do_lc_get_CountMsgNew = function(){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_WAIT_READ,{} );	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_CountMsgNew_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_get_CountMsgNew_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data 	= sharedJson[App['const'].RES_DATA];
				var checkGroup = {};
			    var lst = [];
			    for (var i in data){
			        var item = data[i];
			        if (checkGroup[item.id]) continue;
			        checkGroup[item.id] = true;
			        
			        lst.push(item);
			    }
			    
			    const countWait = lst.length;
				if (countWait) {
					$("#span_new_msg"		)	.removeClass("hide").text(countWait);
					$("#sp_nbNew_message"	)	.html(countWait);
				}else{
					$("#span_new_msg"		)	.addClass("hide");
					$("#sp_nbNew_message"	)	.html("");
				}
				
			    lst = lst.reduce((curr, userOrGrp,index)=>{
					List_UnRead[userOrGrp.id] =userOrGrp;
				}, {});
			    
			}
			do_lc_bindEvent_message();
		}
		this.do_lc_refresh = function(){
			setInterval(() => {
				self.do_lc_get_CountMsgNew();
			}, pr_TIME_REFRESH_MESSAGE);
		}
		//------------------------------------------------------------------------
		this.do_lc_show		= function(){
			try{
				do_lc_list_msg();
			}catch(e) {				
				console.log(e);
			}
		};
		//----------------------------------------------------------------------------
		const do_lc_list_msg = function(){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP, pr_SV_GROUP_LIST_CHAT_BY_USER, {number: pr_NUMBER_MESSAGE, begin: pr_BEGIN_MESSAGE, stat:pr_TYP_CHAT_RELATE});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_list_msg_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_list_msg_callback = function(sharedJson){
			App.data["listGroupByUse"]=[];
			if(can_gl_AjaxSuccess(sharedJson)) {
				const list 			= sharedJson[App['const'].RES_DATA];
				
				//App.data["listGroupByUse"]=list.lst;
				var data = list.lst.reduce((curr, userOrGrp,index) => {
					if (userOrGrp.val01){//--build avatar if have one in val01
						try {
							userOrGrp.val01 = JSON.parse(userOrGrp.val01);

							if(userOrGrp.typ01 == pr_TYP_MSG_PRIVATE){
								let uIds = Object.keys(userOrGrp.val01).slice(0, -1);

								let uIdSend = uIds.find(id => id != App.data.user.id)

								if(!uIdSend) uIdSend = App.data.user.id;

								if(userOrGrp.val01[uIdSend].img) userOrGrp.avatar = userOrGrp.val01[uIdSend].img ;

								userOrGrp.login01 = userOrGrp.val01[uIdSend].login? userOrGrp.val01[uIdSend].login : "HNV-TECH.COM";
							}
						} catch (err) {
							console.log (err);
						}
					}
					curr[index] = userOrGrp;
					App.data["listGroupByUse"][userOrGrp.id] =userOrGrp;
					return curr;
				}, {});
				
				data &&	$("#message_list")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.VI_MESSAGE, data));
				List_UnRead.forEach(function(item) {
				    var id = item.id;
				    $("a.chat-item-his[data-id='" + id + "']").css({"background-color": "#cfffff"});
				});

				//set toggle btn new, prev dynamique
			}
			do_lc_bindEvent_message();
		}
		const do_lc_refresh_minichat = function(){
			$("#div_message_content").css("display", "block");
			do_lc_list_msg();
		}
		const do_lc_bindEvent_message = function (){
			$("#btn_room_chat_relate").off("click").on("click", function(){
				url = 'view_prj_chat_room.html?typ=3';
				App.router.controller.do_lc_run(route,url);
			})
			$("#btn_refresh_mes").off("click").on("click", function(){
				do_lc_refresh_minichat();
			})
			$(".chat-item-his").off("click").on("click", function(){
				$("#div_message_content").css("display", "");
				const $this 		= $(this);
				const {id: idChat, typ01} 	= $this.data();
				if(idChat){
					do_lc_read_minichat(idChat);
					
					typ01 == pr_TYP_MSG_PRIVATE ? $("#div_member, #div_member_wait, #div_post").hide() : $("#div_member, #div_member_wait, #div_post").show();

					let obj = App.data["listGroupByUse"][idChat];
					url = `view_prj_chat_room.html?typ=3&id=${idChat}&typchat=${typ01}`;
					App.router.controller.do_lc_run(route,url);
				}				
			});	
		}
		const do_lc_read_minichat= function(idchat){
			let read = {
					group	: idchat,
					msg		: App.data.listGroupByUse[idchat].msgLast.id
			};
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW_HISTORY, {obj: JSON.stringify(read)});	

			const fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_read_chat_success, idchat));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		const do_lc_read_chat_success = function(sharedJson,idchat){
			if(can_gl_AjaxSuccess(sharedJson)) {
				delete List_UnRead[idchat];
				countWait = Object.keys(List_UnRead).length;
				
				if (countWait) {
					$("#span_new_msg"		)	.removeClass("hide").text(countWait);
					$("#sp_nbNew_message"	)	.html(countWait);
				}else{
					$("#span_new_msg"		)	.addClass("hide");
					$("#sp_nbNew_message"	)	.html("");
				}
			}
		}
	}
	
	const MainNotification  = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"Home";
		var pr_grpPath				= 'group/home';
		const tmplName				= App.template.names[pr_grpName];
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;

		const pr_SERVICE_CLASS		= "ServiceMsgMessage"; //to change by your need
		const pr_SV_NOTI_LST		= "SVNotiLst"; 
		const pr_SV_NOTI_DEL		= "SVNotiDel"; 
		const pr_SV_NOTI_DEL_ALL	= "SVNotiDelAll"; 
		const pr_SV_NOTI_READ		= "SVNotiRead"; 
		const pr_SV_NOTI_COUNT		= "SVNotiCount";

		
		const pr_NUMBER_NOTIFY		= 10;
		const pr_TIME_REFRESH_NOTIFY= 10 * 60 * 1000;
		const TYP_00_PRJ 								= 10;
		const TYP_00_PRJ_DATACENTER 					= 20;
		const TYP_00_PRJ_TEST							= 30;
		const TYP_00_PRJ_SPRINT 						= 100;
		const TYP_00_PRJ_WORKFLOW 						= 200;
		
		var pr_BEGIN_NOTIFY			= 0;
		var self					= this;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 					= App.controller.UI.Main;		
		}      

		//---------------------------------------------------------------
		this.do_lc_get_CountNew = function(){
			const ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NOTI_COUNT);	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_CountNew_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_get_CountNew_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data 	= sharedJson[App['const'].RES_DATA];
				data && $("#sp_nbNew_notify").html(data);
			}
			do_lc_bindEvent_notify();
		}


		this.do_lc_refresh = function(){
			setInterval(() => {
				self.do_lc_get_CountNew();
			}, pr_TIME_REFRESH_NOTIFY);
		}
		
		//---------------------------------------------------------------
		this.do_lc_show		= function(){
			try{
				do_lc_list();
			}catch(e) {				
				console.log(e);
			}
		};
		
		const parseNotificationTime = function(noti) {
		    const timeMap = {
		    	"0min":0,
		        "5min": 5 * 60 * 1000, 
		        "15min": 15 * 60 * 1000,
		        "30min": 30 * 60 * 1000, 
		        "45min": 45 * 60 * 1000, 
		        "1hour": 60 * 60 * 1000, 
		        "1day": 24 * 60 * 60 * 1000, 
		    };
		    return timeMap[noti] || 0;
		};

		const do_lc_list = function(){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NOTI_LST, {number: pr_NUMBER_NOTIFY, begin: pr_BEGIN_NOTIFY});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_list_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_list_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data 			= sharedJson[App['const'].RES_DATA];
				console.log(data)
				//---remove notif same prj, same action typ
				const dataFilter = data.reduce(function(curr, item) {
	            const content = item.inf01 ? JSON.parse(item.inf01) : {};
	            item.inf01 = content;
	
	            // Kiểm tra nếu thời gian thông báo khớp
	            const reminderData = item.inf01;
	            if (reminderData && reminderData.main) {
	                const reminderTime = reminderData.main.dtBegin;
	                const noti = JSON.parse(reminderData.main.inf02).noti;
	
	                const reminderDate = new Date(reminderTime);
	                const notiOffset = parseNotificationTime(noti);
	
	                const notifyTime = new Date(reminderDate.getTime() - notiOffset);
	                const currentTime = new Date();
	
	                if (currentTime >= notifyTime && currentTime < reminderDate) {
	                    curr.push(item); 
	                }
	            }
	            return curr;
	        }, []);
	        	if (dataFilter.length > 0) {
				    self.do_lc_get_CountNew(); 
				}

				dataFilter &&	$("#div_notify_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.VI_NOTIFICATION, dataFilter));

				//set toggle btn new, prev dynamique
				do_lc_toggle_btn_view(data);
				
				do_lc_read(null, true);
			}
			do_lc_bindEvent_notify();
		}
		//---------private-----------------------------------------------------------------------------
		const do_lc_bindEvent_notify = function (){
			$(".a_view_prj").off("click").on("click", function() {
			    let data 	= $(this).data();
				let date 	= req_gl_DateStr_From_DateObj(data.date , DateFormat.masks.isoDate);
			
				let gid 	= data.gid;
				let gcode	= data.gcode;
			   
			    let id 		= data.id;
				let code	= data.code;
				
			    let tab 	= data.tab;
			    let typ 	= data.typ;
			    
			 //   let prjId 	= data.prj;
			   
			   
			    let route 	= "";
			    let url 	= "";
			
			    if (tab 	== "meet") {
			        route 	= "VI_MAIN/prj_appointment_list";
			        url 	= `view_prj_appointment_list.html?id=${id}&dt=${date}`;

			    } else if (tab == "prj") {
					switch(typ){
						case TYP_00_PRJ : //---dự án chính ...
							route 	= "VI_MAIN/prj_project_ent";
							url 	= `view_prj_project_content.html?id=${id}&code=${code}`;
							break; 
						case TYP_00_PRJ_WORKFLOW : //---Workflow...
							route 	= "VI_MAIN/prj_workflow";
							url 	= `view_prj_workflow.html?id=${id}&code=${code}`;
							break;
						case TYP_00_PRJ_SPRINT : //---Kế hoạch triển khai ...
							route 	= "VI_MAIN/prj_sprint";
							url 	= `view_prj_sprint.html?groupId=${gid}&groupCode=${gcode}&id=${id}&code=${code}`;
							break; 
						case TYP_00_PRJ_DATACENTER : //---Trung tâm dữ liệu  ...
							route 	= "VI_MAIN/prj_file_ent";
							url 	= `view_prj_file_content.html?id=${id}&code=${code}`;
							break; 
						
					}
				
			        
			    } else if (tab == "post") {
			        route 	= "VI_MAIN/prj_news_list";
			        url 	= `view_prj_news_list.html?id=${id}&code=${code}`;
			    }
			
			    if (route && url) {
					App.router.controller.do_lc_run(route,url);
			    }
				$("#div_notify_content").removeClass("show");
//			    do_lc_read(id);
			});

			$("#btn_view_next").off("click").on("click", function(){
				pr_BEGIN_NOTIFY += pr_NUMBER_NOTIFY;
				do_lc_list();
				return false;//stop toggle dropdown
			})

			$("#btn_view_prev").off("click").on("click", function(){
				pr_BEGIN_NOTIFY -= pr_NUMBER_NOTIFY;
				do_lc_list();
				return false;//stop toggle dropdown
			})

			$("#btn_view_all").off("click").on("click", function(){
				do_lc_read(null, true);
				return false;//stop toggle dropdown
			})

			$("#btn_delete_all").off("click").on("click", function(){
				App.MsgboxController.do_lc_show({
					title 		: $.i18n("prj_project_noti_title_delete"),
					content 	: $.i18n("prj_project_noti_title_delete_content"),
					autoclose	: true,
					css			: {"max-width": "400px"},
					buttons 	: {
						UPDATE : {
							lab 		: $.i18n("common_btn_send"),
							funct 		: do_lc_del_all,
							classBtn	: "btn-primary",
							autoclose	: true
						},
						CALCEL : {
							lab 		: $.i18n("common_btn_cancel"),
						}
					}
				});

				return false;//stop toggle dropdown
			})

			$(".span-delete-notif").off("click").on("click", function() {
				const $this 		= $(this);
				const {id, idsub} 	= $this.data();
				const $itemNotif 	= $this.closest(".div-notif-item");
				const ids 			= idsub && id ? `[${id}, ${idsub}]` : id ? `[${id}]` : "";
				ids && do_lc_del(ids, $itemNotif);
			})

//			$(".span-read-notif", ".a_view_prj" ).off("click").on("click", function() {
//				const $this 		= $(this);
//				const {id, idsub} 	= $this.data();
//
//				do_lc_read(id);
//			})
		};

		const do_lc_read = function(idNotify, isReadAll){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NOTI_READ, {id: idNotify, isReadAll});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_read_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_read_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				$("#sp_nbNew_notify").html(data ? data : "");
			}
		}

		const do_lc_del = (ids, $itemNotif) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NOTI_DEL, {ids});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_del_callback, [$itemNotif]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_del_callback = function(sharedJson, $itemNotif){
			if(can_gl_AjaxSuccess(sharedJson)) {
				$itemNotif.remove();
			}
		}

		const do_lc_del_all = (ids, isDelAll) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NOTI_DEL_ALL, {});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_del_all_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_del_all_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_del'));
				$("#sp_nbNew_notify").html("");
				do_lc_list();
			}
		}

		const do_lc_toggle_btn_view = data => {
			pr_BEGIN_NOTIFY === 0 ?	$("#btn_view_prev").hide() : $("#btn_view_prev").show();

			if(data.length < pr_NUMBER_NOTIFY)	$("#btn_view_next").hide();
		}
	};

	
	const MainFavorite 		= function (grpName, header, content, footer) {
		const pr_divHeader 			= header;
		const pr_divContent 		= content?content:".div-favorite";
		const pr_divFooter 			= footer;
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"Home";
		var pr_grpPath				= 'group/home';
		const tmplName				= App.template.names[pr_grpName];
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------

		const svClass 				= App['const'].SV_CLASS;
		const svName				= App['const'].SV_NAME;
		const sessId				= App['const'].SESS_ID;
		const userId          		= App['const'].USER_ID;

		const fVar					= App['const'].FUNCT_SCOPE;
		const fName					= App['const'].FUNCT_NAME;
		const fParam				= App['const'].FUNCT_PARAM;

		const self 					= this;

		//------------------------------------------------------------------------------------
		const pr_varname			= "lstFav";
		let   pr_thread_sync 		= null;

		const pr_SYNC_INTERVAL 		= 1000 * 59 * 60;// ~1 minute

		var   pr_ctr_Sidebar		= App.controller.UI.Sidebar
		//--------------------APIs--------------------------------------//
		this.do_lc_init	= () => {
			if(App.data.user) {
				App.data.user[pr_varname] =  sessionStorage[pr_varname]?JSON.parse(sessionStorage[pr_varname]):{};
			}
		}

		//--------------------------------------------------------------------------------------------
		this.do_lc_build_myFavorites = (entTyps) => {
			if (!App.data.user) return [];
			
			const ref       = req_gl_Request_Content_Send("ServiceTpyFavorite", "SVLstByUser");

			if(entTyps) {
				ref['entTyps']  = entTyps.join(',');
			}

			const fSucces	= [];
			fSucces.push(req_gl_funct(null, do_lc_build_myFavorites_callback, [entTyps]));

			const fError    = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [ $.i18n("common_err_ajax") ]);

			App.network.do_lc_ajax(
					App.path.BASE_URL_API_PRIV,
					req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL),
					ref, 100000, fSucces, fError);
		}

		//--------------------------------------------------------------------------------------------
		const do_lc_build_myFavorites_callback = (sharedJson, entTyps) => {
			if (sharedJson[App['const'].SV_CODE] === App['const'].SV_CODE_API_YES) {
				var data 					=  sharedJson[App['const'].RES_DATA];
				App.data.user[pr_varname] 	= {};

				$.each(data, function(i, e){
					App.data.user[pr_varname][e.entTyp] = JSON.parse(!e.descr?"{}":e.descr);
					//e.descr = {ids:[1,2,3], lst:[{id:1, name:'abc'}, {}]}
					
					var fav = App.data.user[pr_varname][e.entTyp];
					if (!fav.ids) fav.ids = [];
					if (!fav.lst) fav.lst = [];
					
					for (var ent in fav.lst){
						fav.lst[ent].fav = 1; //add fav
					}
				});

				//save to sessionStorage
				sessionStorage[pr_varname] 		= JSON.stringify(App.data.user[pr_varname]);

				if(App.controller.UI.Sidebar) {
					App.controller.UI.Sidebar.do_lc_show_favorite()
				}

				return;
			}

			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_NO) {
				// do something else
				for (var i in entTyps) 
					App.data.user[pr_varname][entTyps[i]] = {ids:[], lst:[]}
			}

			//doShowBindingUpdateFavorite(obj);
		}
		//--------------------------------------------------------------------------------------------
		this.do_lc_check_myFavorites = (data, entTyp) => {
			if (!App.data.user) return;
			if (!App.data.user[pr_varname]) return;
			if (!App.data.user[pr_varname][entTyp]) return;
			if (!data) return;
			
			const setFav = new Set(App.data.user[pr_varname][entTyp].ids);
			
			for (var i in data){
				var d = data[i];
				if (setFav.has(d.id))
					d.fav = 1;
				else
					d.fav = 0;
			}
		}
		//--------------------------------------------------------------------------------------------
		this.req_lc_myFavorites = (entTyp) => {
			if (!App.data.user) return [];
			if (!App.data.user[pr_varname]) return [];
			if (!App.data.user[pr_varname][entTyp]) return[];
			
			var lst = $.extend(true, [], App.data.user[pr_varname][entTyp].lst); 
			return lst;
		}
		//em khong khai báo this thi làm sao goi từ ben ngoai vào? e chua khai báo pr_Type
		this.req_lc_myFavIds = (entTyp) => {
			if (!App.data.user) return [];
			if (!App.data.user[pr_varname]) return [];
			if (!App.data.user[pr_varname][entTyp]) return[];
			//copy from
			var ids = $.extend(true, [], App.data.user[pr_varname][entTyp].ids); 
			return ids;
		}
		
		this.req_lc_merge_myFavorites = (data, entTyp, sizeMax) => {
			if (!sizeMax) sizeMax = 20;
			
			if (!App.data.user) 					return data;
			if (!App.data.user[pr_varname]) 		return data;
			if (!App.data.user[pr_varname][entTyp]) return data;
			
			var fav = App.data.user[pr_varname][entTyp];
			if (!fav.ids) fav.ids = [];
			const setFav = new Set(fav.ids);
			
			var lst = $.extend(true, [], App.data.user[pr_varname][entTyp].lst); 
			
			for (var i in data){
				var ent = data[i];
				if (setFav.has(ent.id)) continue;
				lst.push (ent);
				if (lst.length>=sizeMax) break;
			}
			
			return lst;
		}
		//--------------------------------------------------------------------------------------------
		this.do_lc_push_myFavorites = (ent, entTyp, savedAttrs = ["id", "name", "code01", "typ00", "typ01", "typ02"], isUpdate = false) => {
			if (!ent || !ent.id) 	return;
			if (!App.data.user) 	return;
			
			if (!App.data.user[pr_varname])				App.data.user[pr_varname] 			= {};
			if (!App.data.user[pr_varname][entTyp]) 	App.data.user[pr_varname][entTyp] 	= {};
			
			
			var fav = App.data.user[pr_varname][entTyp];
			if (!fav.ids) fav.ids = [];
			if (!fav.lst) fav.lst = [];
			
			if(!isUpdate) {
				const setFav = new Set(fav.ids);
				if (setFav.has(ent.id)) return;
			} else {
				const iFav = fav.lst.findIndex(e => e.id === ent.id)
				
				if(iFav >= 0) fav.lst.splice(iFav, 1)
			}
			
			ent.fav = 1;
			fav.ids.push(ent.id);

			const data = {}
			savedAttrs.map(attr => {
				if(!ent.hasOwnProperty(attr)) return
				data[attr] = ent[attr]
			})
			fav.lst.push(data);
			
			do_save_myFavorites (entTyp, fav);
		}
		
		this.do_lc_remove_favorite = (isFav, ID_TABLE, obj) => {
			if(!isFav) {
				do_lc_send_mod_inList(isFav, ID_TABLE, obj)

				return
			}

			App.MsgboxController.do_lc_show({
				title 		: $.i18n("prj_project_favorite_title_delete"),
				content 	: $.i18n("prj_project_favorite_title_delete_content"),
				autoclose	: false,
				buttons 	: {
					UPDATE : {
						lab 		: $.i18n("common_btn_send"),
						funct 		: do_lc_send_mod_inList,
						param 		: [isFav, ID_TABLE, obj],
						classBtn	: "btn-primary",
						autoclose	: true
					},
					CALCEL : {
						lab 		: $.i18n("common_btn_cancel"),
					}
				}
			});
		}

		const do_lc_send_mod_inList = (isFav, parTyp, obj) => {
			if(isFav) self.do_lc_remove_myFavorites(obj, parTyp)
			else self.do_lc_push_myFavorites(obj, parTyp)
		}

		this.do_lc_remove_myFavorites = (ent, entTyp) => {
			if (!ent || !ent.id) 	return;
			if (!App.data.user) 	return;
			
			if (!App.data.user[pr_varname])				App.data.user[pr_varname] 			= {};
			if (!App.data.user[pr_varname][entTyp]) 	App.data.user[pr_varname][entTyp] 	= {};
			
			var fav = App.data.user[pr_varname][entTyp];
			if (!fav.ids) fav.ids = [];
			if (!fav.lst) fav.lst = [];
			
			for (var i in fav.ids){
				if (fav.ids[i]==ent.id){
					fav.ids.splice(i, 1);
					fav.lst.splice(i, 1);
					break;
				}
			}
			do_save_myFavorites (entTyp, fav);
		}
		
		
		const do_save_myFavorites = (entTyp, data) => {
			const ref 		= req_gl_Request_Content_Send("ServiceTpyFavorite", "SVNsoMod");
			ref['entTyp'] 	= entTyp;
			ref['data'] 	= JSON.stringify(data);

			const fSucces	= [];
			fSucces.push(req_gl_funct(null, do_save_myFavorites_callback, []));

			const fError 	= req_gl_funct(null, do_gl_show_Notify_Msg_Error, [ $.i18n("common_err_ajax") ]);

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV,
				req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL),
				ref, 100000, fSucces, fError);
		}

		const do_save_myFavorites_callback = (sharedJson) => {
			if (sharedJson[App['const'].SV_CODE] === App['const'].SV_CODE_API_YES) {
				sessionStorage[pr_varname] 	= JSON.stringify(App.data.user[pr_varname]);
				
				if(!pr_ctr_Sidebar) pr_ctr_Sidebar = App.controller.UI.Sidebar

				if(pr_ctr_Sidebar) {
					pr_ctr_Sidebar.do_lc_show_favorite()
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n ("content_send_not_succes"));
			}
		}
		
		
		//-------------------- FavIds List ------------------------------------------------------------------------
		
		
		
		//-------------------- End ------------------------------------------------------------------------
		
		
		//--------------------------------------------------------------------------------------------
	};
	
	const MainHandlebarsDef     	= function (grpName, header,content,footer) {
		const self 					= this;

		this.do_lc_init				= function(){} 
		//----------------------PRJ-----------------------------------------
		const do_lc_reqRandom_number 	= (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
		const formatFullDate 			= {"en": DateFormat.masks.enFullDate	, "fr": DateFormat.masks.frFullDate	, "vi": DateFormat.masks.viFullDate};
		const formatShortDate 			= {"en": DateFormat.masks.enShortDate	, "fr": DateFormat.masks.frShortDate, "vi": DateFormat.masks.viShortDate};
		const formatFullDateToMM		= {"en": DateFormat.masks.enDate		, "fr": DateFormat.masks.frDate		, "vi": DateFormat.masks.viDate};
		const formatISOTime 			= DateFormat.masks.isoTime;
		const defautNumberFormat 		= "#,###.##";

		

		const paramStats 				= [
			pr_STAT_PRJ_NEW,
			pr_STAT_PRJ_TODO,
			pr_STAT_PRJ_INPROGRESS,
			pr_STAT_PRJ_DONE,
			
			pr_STAT_PRJ_DEPLOY,
			pr_STAT_PRJ_TEST,
			pr_STAT_PRJ_REVIEW,
			
			pr_STAT_PRJ_CLOSED,
			pr_STAT_PRJ_UNRESOLVED,
		]
		

		const PRJ_MEMBER_LEVEL 			= {0: "prj_project_member_level_manager", 10: "prj_project_member_level_reporter", 20: "prj_project_member_level_developer", 30: "prj_project_member_level_tester", 40: "prj_project_member_level_worker", 50: "prj_project_member_level_watcher"};
		const PRJ_MEMBER_TYP 			= {10: "prj_project_member_level_owner", 0: "prj_project_member_level_manager", 2: "prj_project_member_level_worker"};
		const PRJ_MEMBER_TYPE 			= {1: "prj_project_lev_bas"				, 1: "prj_project_lev_haute" , 4: "prj_project_lev_haute"};

		const PRJ_TYP_HISTORY 			= {10: "prj_unit_stat_todo", 20: "prj_unit_stat_executing"	, 60: "prj_unit_stat_fail"	, 40: "prj_unit_stat_pass", 70: "prj_unit_stat_abort", 30: "prj_unit_stat_blocked"	};
		const PRJ_TYP_HISTORY_COLOR 	= {10: "bg_todo", 20: "bg_executing"	, 60: "bg_fail"	, 40: "bg_pass", 70: "bg_abort", 30: "bg_blocked"	};
		const PRJ_TYP_TEST 				= {1: "prj_unit_test_manual", 2: "prj_unit_test_auto"	};
		const PRJ_LEVEL 				= {1: "prj_project_lev_01"	, 2: "prj_project_lev_02"	, 3: "prj_project_lev_03"	, 4: "prj_project_lev_04"};
		const PRJ_TYPE01 				= {1: "prj_project_type_01"	, 2: "prj_project_type_02"	, 3: "prj_project_type_03"	, 4: "prj_project_type_04"};
		const PRJ_STAT 					= {100100: "prj_project_stat_100100", 100200: "prj_project_stat_100200", 100300: "prj_project_stat_100300", 100400: "prj_project_stat_100400", 100500: "prj_project_stat_100500", 100600: "prj_project_stat_100600", 100700: "prj_project_stat_100700", 100800: "prj_project_stat_100800", 100900: "prj_project_stat_100900"};

		const PRJ_FILE_STAT 			= {0: "prj_file_stat_00"	, 1: "prj_file_stat_01"	, 2: "prj_file_stat_02"};

		const USER_TYPE 				= {2: "aut_user_ent_header_type_adm"	, 3: "aut_user_ent_header_type_agent"	, 5: "aut_user_ent_header_type_visistor"	, 6: "aut_user_ent_header_type_mentor", 8: "aut_user_ent_header_type_shipper"};
		const USER_STAT 				= {0: "aut_user_ent_header_stat_0"	    , 1: "aut_user_ent_header_stat_1"	    , 2: "aut_user_ent_header_stat_2"	        , 3: "aut_user_ent_header_stat_3"	, 	10: "aut_user_ent_header_stat_10"};
		const USER_LEGAL_STAT 			= {1020001: "per_person_mr"				, 1020002: "per_person_mrs"};
		
		
		const PARTNER_TYPE_PERSON		= {1000001: "per_person_type_moral"	, 1000002: "per_person_type_physic"};
		const PARTNER_CFGVAL02			= {1020001: "per_person_mr"		    , 1020002: "per_person_mrs",         1020003: "per_enterprise_sarl"	, 1020004: "per_enterprise_sa"	, 1020005: "per_enterprise_group"};
		const PARTNER_TYPE02			= {1010002: "per_person_typ_02"	    , 1010003: "per_person_typ_03"	, 1010004: "per_person_typ_04"	, 1010005: "per_person_typ_05"	, 1010006: "per_person_typ_06", 1010007: "per_person_typ_07", 1010008: "per_person_typ_08"};
		const PARTNER_STAT   			= {0: "per_partner_stat_00"	, 1: "per_partner_stat_01"	, 2: "per_partner_stat_02", 3: "per_partner_stat_03"	, 10: "per_partner_stat_10"	, 11: "per_partner_stat_11"};
		
		const PR_TYP_ADD 				= 1			, PR_TYP_MOD 	= 2			, PR_TYP_DEL = 3	, PR_TYP_JOIN 		= 4		, PR_TYP_MODIFY 	= 5		, PR_TYP_OUT 		= 6			, PR_TYP_COMMENT 	= 7		, PR_TYP_MOVE 		= 9; PR_TYP_LATE   = 10
		const PR_TAB_CONTENT 			= "content"	, PR_TAB_MEMBER = "member"	, PR_TAB_PRJ = "prj", PR_TAB_EPIC 		= "epic", PR_TAB_TASK 		= "task", PR_TAB_COMMENT 	= "comment"	, PR_TAB_FILE 		= "file";
		
		const pr_TABLE_CLASS_FAV		= {
			250000						: {
				"10,2,0"				: "text-primary", 	//Project Main
				"10,3,0"				: "text-primary", 	//Project Main
				"10,4,0"				: "text-primary", 	//Project Main

				"10,2,1"				: "text-danger", 	//Project Epic
				"10,3,1"				: "text-danger", 	//Project Epic
				"10,4,1"				: "text-danger", 	//Project Epic

				"10,2,2"				: "text-success", 	//Project Task
				"10,3,2"				: "text-success", 	//Project Task
				"10,4,2"				: "text-success", 	//Project Task
				
				"20,,0"					: "text-secondary",	//Project DataCenter
				"100,,"					: "text-warning",	//Project Sprint

				"30,1,1"				: "text-info",		//Project Test Unit
				"30,1,2"				: "text-info",		//Project Test Unit

				"30,2,1"				: "text-dark",		//Project Test Group
				"30,2,2"				: "text-dark",		//Project Test Group

				"100,,"					: "text-muted",		//Project Sprint
				"100,11,0"				: "text-muted",		//Project Sprint
				"100,12,0"				: "text-muted",		//Project Sprint
				"100,15,0"				: "text-muted",		//Project Sprint

				"200,,"					: "text-light",		//Project WORKFLOW

				//EMAIL
				"500,,2"				: "text-white-50",	//Project Email
				"500,,0"				: "text-white-50",	//Project Group Email
			},
			1000						: {
				",1,"					: "text-pink",		//User SUP_ADM
				",2,"					: "text-pink",		//User ADM
				",3,100"				: "text-pink",		//User AGENT
				",3,100"				: "text-pink",		//User AGENT
			}
		}

		const pr_TABLE_SRC_PAGE 		= {
			250000						: {
				//PRJ
				"10,2,0"				: "view_prj_project_content.html?id=#id&code=#code",	//IT		- PROJECT
				"10,2,1"				: "view_prj_project_content.html?id=#id&code=#code",	//IT		- EPIC
				"10,2,2"				: "view_prj_project_content.html?id=#id&code=#code",	//IT		- TASK
				"10,3,0"				: "view_prj_project_content.html?id=#id&code=#code",	//COMMERCE	- PROJECT
				"10,3,1"				: "view_prj_project_content.html?id=#id&code=#code",	//IT		- EPIC
				"10,3,2"				: "view_prj_project_content.html?id=#id&code=#code",	//COMMERCE	- TASK
				"10,4,0"				: "view_prj_project_content.html?id=#id&code=#code",	//OTHER		- PROJECT
				"10,4,1"				: "view_prj_project_content.html?id=#id&code=#code",	//IT		- EPIC
				"10,4,2"				: "view_prj_project_content.html?id=#id&code=#code",	//OTHER		- TASK

				//TEST
				"30,1,1"				: "view_prj_test_unit.html?id=#id&code=#code",			//TEST_UNIT
				"30,1,2"				: "view_prj_test_unit.html?id=#id&code=#code",			//TEST_UNIT
				"30,2,1"				: "view_prj_test_campaign.html?id=#id&code=#code",		//TEST_CAMPAIGN
				"30,2,2"				: "view_prj_test_campaign.html?id=#id&code=#code",		//TEST_CAMPAIGN
				
				//DATACENTER
				"20,,0"					: "view_prj_file_content.html?id=#id&code=#code",

				//SPRINT
				"100,,"					: "view_prj_sprint.html?id=#id&code=#code",
				"100,11,0"				: "view_prj_sprint.html?id=#id&code=#code",
				"100,12,0"				: "view_prj_sprint.html?id=#id&code=#code",
				"100,15,0"				: "view_prj_sprint.html?id=#id&code=#code",

				//WORKFLOW
				"200,,"					: "view_prj_workflow.html?id=#id&code=#code",

				//EMAIL
				"500,,2"				: "view_prj_email.html?id=#id&code=#code",
				"500,,0"				: "view_prj_email_group.html?id=#id&code=#code",
			},
			1000						: {
				",1,"					: "view_prj_user_intern.html?id=#id&code=#code",		//User SUP_ADM
				",2,"					: "view_prj_user_intern.html?id=#id&code=#code",		//User ADM
				",3,100"				: "view_prj_user_intern.html?id=#id&code=#code",		//User AGENT
				",3,100"				: "view_prj_user_intern.html?id=#id&code=#code",		//User AGENT
			}
		}

		const pr_ROUTE_PAGE 		= {
			250000						: {
				//PRJ
				"10,2,0"				: "VI_MAIN/prj_project_ent",	//IT		- PROJECT
				"10,2,1"				: "VI_MAIN/prj_project_ent",	//IT		- EPIC
				"10,2,2"				: "VI_MAIN/prj_project_ent",	//IT		- TASK
				"10,3,0"				: "VI_MAIN/prj_project_ent",	//COMMERCE	- PROJECT
				"10,3,1"				: "VI_MAIN/prj_project_ent",	//IT		- EPIC
				"10,3,2"				: "VI_MAIN/prj_project_ent",	//COMMERCE	- TASK
				"10,4,0"				: "VI_MAIN/prj_project_ent",	//OTHER		- PROJECT
				"10,4,1"				: "VI_MAIN/prj_project_ent",	//IT		- EPIC
				"10,4,2"				: "VI_MAIN/prj_project_ent",	//OTHER		- TASK

				//TEST
				"30,1,1"				: "VI_MAIN/prj_test_unit",			//TEST_UNIT
				"30,1,2"				: "VI_MAIN/prj_test_unit",			//TEST_UNIT
				"30,2,1"				: "VI_MAIN/prj_test_campaign",		//TEST_CAMPAIGN
				"30,2,2"				: "VI_MAIN/prj_test_campaign",		//TEST_CAMPAIGN

				//DATACENTER
				"20,,0"					: "VI_MAIN/prj_file_ent",

				//SPRINT
				"100,,"					: "VI_MAIN/prj_sprint",
				"100,11,0"				: "VI_MAIN/prj_sprint",
				"100,12,0"				: "VI_MAIN/prj_sprint",
				"100,15,0"				: "VI_MAIN/prj_sprint",

				//WORKFLOW
				"200,,"					: "VI_MAIN/prj_workflow",

				//EMAIL
				"500,,2"				: "VI_MAIN/prj_email",
				"500,,0"				: "VI_MAIN/prj_email_group",
			},
			1000						: {
				",1,"					: "VI_MAIN/prj_user_intern",		//User SUP_ADM
				",2,"					: "VI_MAIN/prj_user_intern",		//User ADM
				",3,100"				: "VI_MAIN/prj_user_intern",		//User AGENT
				",3,100"				: "VI_MAIN/prj_user_intern",		//User AGENT
			}
		}

		const pr_TYPE02_PRJ				= 0;
		const pr_TYPE02_EPIC			= 1;
		const pr_TYPE02_TASK			= 2;
		
		const pr_EXTENSION_DOC 			= {gif : "gif", jpg : "jpg", png : "png", txt: "txt", md : "md", json : "json", js : "js", css : "css", html : "html", doc : "doc", jpeg : "jpg", docx : "doc", pdf : "pdf"};
		
		const STAT_PARTNER = {
				0: "per_partner_stat_00",	1: "per_partner_stat_01",	2: "per_partner_stat_02",
				3: "per_partner_stat_03",	10: "per_partner_stat_10",	11: "per_partner_stat_11",	100: "per_partner_stat_null"
		}
		
		const PR_ICON_FOLDER = {
				"INBOX"		: "mdi-email-outline"		, "Sent": "mdi-email-check-outline"	, "Trash"			: "mdi-trash-can-outline"	, "[Gmail]"	: "mdi-gmail",
				"Corbeille"	: "mdi-trash-can-outline"	, "Spam": "mdi-bacteria-outline"	, "Objets envoyés"	: "mdi-email-check-outline" , "Brouillons": "mdi-file-outline",
				"Archives"	: "mdi-bag-personal-outline", "folder" : "mdi-folder-outline"
		}

		const PR_LANGUAGE_FOLDER = {
				"INBOX"		: "prj_email_folder_inbox", "Sent": "prj_email_folder_sent", "Trash"			: "prj_email_folder_trash", "[Gmail]"	: "prj_email_folder_gmail",
				"Corbeille"	: "prj_email_folder_trash", "Spam": "prj_email_folder_spam", "Objets envoyés"	: "prj_email_folder_sent" , "Brouillons": "prj_email_folder_draft",
				"Archives"	: "prj_email_folder_archive"
		}
		
		const TYP_USER = {
				2: "aut_user_ent_header_type_adm"	,	3: "aut_user_ent_header_type_agent"	,	5: "aut_user_ent_header_type_member",
				6: "aut_user_ent_header_type_mentor",	8: "aut_user_ent_header_type_shipper", 4: "aut_user_ent_header_type_member_externe"
		}
		
		const SOCIAL_NETWORK = {
				"fb": {label: "Facebook", bgColor: "primary"}, "tw": {label: "Twitter", bgColor: "info"}, "ln": {label: "LinkedIn", bgColor: "info"}, "gg": {label: "Google", bgColor: "danger"}, "ig": {label: "Instagram", bgColor: "pink"}
		}

		const SOCIAL_NETWORK_URL = {
				"fb": {label: "https://www.facebook.com/"}, "tw": {label: "https://twitter.com/"}, "ln": {label: "https://www.linkedin.com/"}, "gg": {label: "https://www.google.com/"}, "ig": {label: "https://www.instagram.com/"}
		}
		
		Handlebars.registerHelper("reqSrcAvatarPrjLst", function(prj) {
			if(!prj.avatar){
				return UI_URL_ROOT + "img/prj/companies/img-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".png";
			}else{
				let path = "";
				path = prj.avatar.urlPrev || prj.avatar.url;
				return  path;
			}
		});
		
		Handlebars.registerHelper("reqSrcAvatarPrj", function(prj) {
			if(!prj.files){
				return UI_URL_ROOT + "img/prj/companies/img-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".png";
			}else{
				let path = "";
				try {
					const file = prj.files.filter(f => f.typ01==1 && f.typ02==1)[0];
					path = file.urlPrev || file.url
				}catch(e){
					return UI_URL_ROOT + "img/prj/companies/img-" 	+ do_lc_reqRandom_number(1, 1) 	+ ".png";
				}
				return  path;
			}
		});
		
		Handlebars.registerHelper("reqSrcAvatarPrjEpic", function(prj) {
			if(!prj.files){
				return UI_URL_ROOT + "img/prj/companies/img-" 		+ do_lc_reqRandom_number(2, 2) 	+ ".png";
			}else{
				let path = "";
				try {
					const file = prj.files.filter(f => f.typ01==1 && f.typ02==1)[0];
					path = file.urlPrev || file.url
				}catch(e){
					return UI_URL_ROOT + "img/prj/companies/img-" 	+ do_lc_reqRandom_number(2, 2) 	+ ".png";
				}
				return  path;
			}
		});
		
		Handlebars.registerHelper("reqSrcAvatarPrjTask", function(prj) {
			if(!prj.files){
				return UI_URL_ROOT + "img/prj/companies/img-" 		+ do_lc_reqRandom_number(3, 3) 	+ ".png";
			}else{
				let path = "";
				try {
					const file = prj.files.filter(f => f.typ01==1 && f.typ02==1)[0];
					path = file.urlPrev || file.url
				}catch(e){
					return UI_URL_ROOT + "img/prj/companies/img-" 	+ do_lc_reqRandom_number(3, 3) 	+ ".png";
				}
				return  path;
			}
		});

		Handlebars.registerHelper("reqSrcAvatarPartner", function(partner) {
			if(!partner.files || !partner.files.length){
				return UI_URL_ROOT + "img/prj/companies/img-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".png";
			}else{
				return App.path.LOCATION_URL_HREF + partner.files[0].path01;
			}
		});
		
		Handlebars.registerHelper("reqSrcAvatarPartnerPrj", function(prj) {
			if(!prj.files){
				return UI_URL_ROOT + "img/prj/companies/img-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".png";
			}else{
				let path = "";
				try {
					path = prj.files.filter(f => f.typ01==2 && f.typ02==1)[0].path01;
				}catch(e){
					return UI_URL_ROOT + "img/prj/companies/img-" 	+ do_lc_reqRandom_number(1, 1) 	+ ".png";
				}
				return App.path.LOCATION_URL_HREF + path;
			}
		});

		Handlebars.registerHelper("reqSrcAvatarMember", function(mem) {
			if(mem.avatar)	
				if (mem.avatar.urlPrev) return mem.avatar.urlPrev;
				else if (mem.avatar.url) return mem.avatar.url;

			if(mem.files && mem.files.length){
				let avatar = mem.files.filter(f => f.typ01==1 && f.typ02==1);
				if(avatar &&  avatar.length){
					if (avatar[0].urlPrev)  return avatar[0].urlPrev;
					else if (avatar[0].url) return avatar[0].url;
				}
			}
			
			return UI_URL_ROOT + "img/prj/users/avatar-" 			+ do_lc_reqRandom_number(1, 1) 	+ ".jpg";
		});
		
		this.reqSrcImg = function (file){
			if(file.urlPrev)	return file.urlPrev;
			else return file.url
		}
		
		Handlebars.registerHelper("reqSrcImg", function(file) {
			return self.reqSrcImg(file);
		});
		
		Handlebars.registerHelper("imageErrorUser", function() {
			return `this.src = 'www/img/prj/users/avatar-1.jpg'`;
		});

		
		this.reqSrcTextAvatar = function (login){
			if(!login)	return UI_URL_ROOT + "img/prj/users/avatar-" 			+ do_lc_reqRandom_number(1, 1) 	+ ".jpg";
			
			let first = login.charAt(0);

			let tok   = login.split(".");
			if (tok.length<=1) 
				tok   = login.split(" ");
			let last  = "";
			if (tok.length>=2) 
				last  = tok[1].trim().charAt(0);
			else
				last  = login.charAt(login.length - 1);

			return first + last;
		}
		Handlebars.registerHelper("reqSrcTextAvatar", function(login) {
			return self.reqSrcTextAvatar(login);
		});

		this.reqSrcTextColor = (login) => {
			if(!login)	return var_gl_colors[0];
			let first = login.charAt(0);
			
			let index = var_gl_alphabet.indexOf(first.toLowerCase());
			return var_gl_colors[index];
		}
		
		Handlebars.registerHelper("reqSrcTextColor", function(login) {
			return self.reqSrcTextColor(login);
		});
		
		Handlebars.registerHelper("reqSrcTextAvatarRelateChat", function(login) {
			if(!login)	return UI_URL_ROOT + "img/prj/users/avatar-" 			+ do_lc_reqRandom_number(1, 1) 	+ ".jpg";
			if(login === "HNV-TECH.COM") login = "H.V"
				
			return self.reqSrcTextAvatar(login);
		});
		
		Handlebars.registerHelper("reqSrcTextColorRelateChat", function(login) {
			if(!login)	return var_gl_colors[0];
			if(login === "HNV-TECH.COM") login = "H.V"
			
			let first = login.charAt(0);
			let index = var_gl_alphabet.indexOf(first.toLowerCase());
			return var_gl_colors[index];
			
		});
		
		Handlebars.registerHelper("reqSrcTextLoginRelateChat", function(login) {
			if(!login)	return "";
			if(login === "HNV-TECH.COM") return "";
			return login;
		});

		Handlebars.registerHelper("reqSrcAvatarUser", function(prj) {
			if(!prj.files){
				return UI_URL_ROOT + "img/prj/users/avatar-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".jpg";
			}else{
				let path = "";
				try {
					path = prj.files.filter(f => f.typ01==1 && f.typ02==1)[0].path01;
				}catch(e){
					return UI_URL_ROOT + "img/prj/users/avatar-" 	+ do_lc_reqRandom_number(1, 1) 	+ ".jpg";
				}
				return App.path.LOCATION_URL_HREF + path;
			}
		});

		Handlebars.registerHelper("reqSrcAvatarUserDashbord", function(user) {
			if(user.avatar)	return App.path.LOCATION_URL_HREF 		+ user.avatar.urlPrev;

			if(user.files){
				let fileAvatar = user.files.find(f => f.typ01 == 1 && f.typ02 == 1);
				if(fileAvatar)	return App.path.LOCATION_URL_HREF 	+ fileavatar.urlPrev;
			}

			return UI_URL_ROOT + "img/prj/users/avatar-" 			+ do_lc_reqRandom_number(1, 1) 	+ ".jpg";
		});

		Handlebars.registerHelper("reqStrTitleChatPrj", function(str) {
			if(!str)	return "";
			if(str && str.length > 30){
				return str.substr(0,30) + "...";
			}
			return str;
		});
		Handlebars.registerHelper('truncate', function(str, len) {
		    if (str.length > 20) {
		        return str.substring(0, 20) + '...';
		    }
		    return str;
		});
		
		Handlebars.registerHelper("reqSubStrDescrPrj", function(str) {
			if(!str)	return "";
			if(str && str.length > 25){
				return str.substr(0,25) + "...";
			}
			return str;
		});
		
		Handlebars.registerHelper('extractMsgHtml', function (msg, length, options) {
			let s = msg;
			if(s && s.length) {
				try{
					let lstStr = s.replace(/<\/?[^>]+(>|$)/g, "^").split("^");
					s = lstStr.filter(Boolean).join(" ");
				}catch(e){
					console.log(e);
				}
				// if (!s.length) s=msg;

				if (s.length > length){
					s = s.substring(0, length) + "...";
				}
			}	
			return s;		
		});

		Handlebars.registerHelper("reqNameFilePrj", function(str) {
			if(!str)	return "";
			let index = str.indexOf(".");
			if(index > 15) {
				return str.substr(0, 15) + "..." + str.substr(index)
			}
			return str;
		});
		
		Handlebars.registerHelper("reqNameFilePrjDataCenter", function(str) {
			if(!str)	return "";
			if(str && str.length > 30){
				let length = str.length;
				return "..." + str.substr(length - 30, length);
			}
			return str;
		});

		Handlebars.registerHelper("reqSizeFile", function(str) {
			return req_gl_FileSize(str);
		});

		Handlebars.registerHelper("reqFormatDate", function(date) {
			if(!date)	return "";
			let local = localStorage.language ? localStorage.language : "en";
			return DateFormat(date, formatFullDate[local]);
		});
		
		Handlebars.registerHelper("reqFormatDateToMM", function(date) {
			if(!date)	return "";
			let local = localStorage.language ? localStorage.language : "en";
			return DateFormat(date, formatFullDateToMM[local]);
		});
		
		
		Handlebars.registerHelper("reqFormatShortDate", function(date) {
			if(!date)	return "";
			let local = localStorage.language ? localStorage.language : "en";
			return DateFormat(date, formatShortDate[local]);
		});
		
		Handlebars.registerHelper("reqFormatISOTime", function(date) {
			if(!date)	return "";
			return DateFormat(date, formatISOTime);
		});

		Handlebars.registerHelper("reqFormatNumber", function(value) {
			if(value == null)		return "";
			if(value == 0)			return 0;
			let local = localStorage.language ? localStorage.language : "en";
			return $.formatNumber(value, {format: defautNumberFormat, local});
		});
		Handlebars.registerHelper('formatDateChat', function(date) {
		    const inputDate = new Date(date);
		    const now = new Date();
		
		    const isToday = inputDate.toDateString() === now.toDateString();
		    
		    const daysOfWeek = {0: 'CN', 1: 'T2', 2: 'T3',3: 'T4',4: 'T5',5: 'T6',6: 'T7'};
		
		    if (isToday) {
		        return inputDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
		    } else {
		        return daysOfWeek[inputDate.getDay()];
		    }
		});
		

		Handlebars.registerHelper("reqBudgtetReal", function(val02, val01, typCurrency) {
			if(!val01 && !val02)	return "";
			let val = val02 ? val02 : val01;
			
			return val;
		});

		Handlebars.registerHelper("reqLevelMember", function(level) {
			if(level === undefined)	return "";
			return $.i18n(PRJ_MEMBER_LEVEL[+level]);
		});

		Handlebars.registerHelper("reqTypMember", function(typ) {
			if(typ === undefined)	return "";
			return $.i18n(PRJ_MEMBER_TYP[+typ]);
		})

		Handlebars.registerHelper("reqTypeMember", function(typ) {
			if(typ === undefined)	return "";
			return $.i18n(PRJ_MEMBER_TYPE[+typ]);
		});

		Handlebars.registerHelper("reqTypPrj", function(typ) {
			if(typ === undefined)	return "";
			return $.i18n(PRJ_TYPE01[+typ]);
		});

		Handlebars.registerHelper("reqTypTest", function(typ) {
			if(typ === undefined)	return "";
			return $.i18n(PRJ_TYP_TEST[+typ]);
		});

		Handlebars.registerHelper("reqTypHistoryColor", function(typ) {
			if(typ === undefined)	return "";
			return PRJ_TYP_HISTORY_COLOR[+typ];
		});
		Handlebars.registerHelper("reqTypHistory", function(typ) {
			if(typ === undefined)	return "";
			return $.i18n(PRJ_TYP_HISTORY[+typ]);
		});

		Handlebars.registerHelper("reqStatPrj", function(stat) {
			if(stat === undefined)	return "";
			if(PRJ_STAT[+stat]) return $.i18n(PRJ_STAT[+stat]);
			return $.i18n("prj_project_stat_undefined");
		});

		Handlebars.registerHelper("reqSelectedStat", function(lstStats, stat) {
			const sInd = !lstStats?-1:lstStats.findIndex(s => +s.id === +stat)

			if(sInd === -1) return $.i18n("prj_project_stat_undefined");

			return lstStats[sInd].trans ? $.i18n(lstStats[sInd].trans) : lstStats[sInd].lab;
		});
		
		Handlebars.registerHelper("reqStatFilePrj", function(stat) {
			if(stat === undefined)	 return "";
			return $.i18n(PRJ_FILE_STAT[+stat]);
		});
		
		Handlebars.registerHelper("reqTypUser", function(typ) {
			if(typ === undefined)	return "";
			return $.i18n(USER_TYPE[+typ]);
		});

		Handlebars.registerHelper("reqStatUser", function(stat) {
			if(stat === undefined)	return "";
			return $.i18n(USER_STAT[+stat]);
		});
		
		Handlebars.registerHelper("reqLegalStatUser", function(cfgVal02) {
			if(cfgVal02 === undefined)	return "";
			return $.i18n(USER_LEGAL_STAT[+cfgVal02]);
		});
		
		Handlebars.registerHelper("reqCfgVal02Partner", function(cfg) {
			if(cfg === undefined)	return "";
			return $.i18n(PARTNER_CFGVAL02[+cfg]);
		});
		
		Handlebars.registerHelper("reqTyp02Partner", function(typ) {
			if(typ === undefined)	return "";
			return $.i18n(PARTNER_TYPE02[+typ]);
		});

		Handlebars.registerHelper("reqStatPartnerPrj", function(stat) {
			if(stat === undefined)	return "";
			return $.i18n(PARTNER_STAT[+stat]);
		});
		
		Handlebars.registerHelper("reqTyp01Partner", function(typ) {
			if(typ === undefined)	return "";
			return $.i18n(PARTNER_TYPE_PERSON[+typ]);
		});

		Handlebars.registerHelper("reqLevPrj", function(lev) {
			if(lev === undefined)	return "";
			return $.i18n(PRJ_LEVEL[+lev]);
		});

		Handlebars.registerHelper("reqLevColor", function(lev) {
			if(lev === undefined)	return "info";
			if(lev == 1)	return "info";
			if(lev == 2)	return "primary";
			if(lev == 3)	return "warning";
			if(lev == 4)	return "danger";

			return "info";
		});

		Handlebars.registerHelper("reqNameMember", function(str) {
			if(!str)	return "";
			if(str && str.length > 10){
				return str.substr(0, 10) + "...";
			}
			return str;
		});

		Handlebars.registerHelper('concat', function(str1, str2) {
			return str1 + str2;
		});

		Handlebars.registerHelper('reqStatColor', function(stat) {
			if(stat === 0)	return "danger";
			if(stat === 1)	return "warning";
			return "success";
		});
		
		Handlebars.registerHelper('getStatColor', function(stat) {
		    const id = typeof stat === 'number' ? stat : parseInt(stat, 10);    
			const stats = [
			  { id: 1, colorBgr: '#c7e2e8' },
			  { id: 2, colorBgr: '#7dd5e8' },
			  { id: 3, colorBgr: '#d6ecdf' },
			  { id: 4, colorBgr: '#acd9af' },
			  { id: 5, colorBgr: '#f1f1ec' },
			  { id: 6, colorBgr: '#f5f6d8' },
			  { id: 7, colorBgr: '#ffffb0' },
			  { id: 8, colorBgr: '#e8ceb8' },
			  { id: 9, colorBgr: '#a89c92' }
			];
		    
		    const statColor = stats.find(statItem => statItem.id === id);
		    
		    if (statColor) return statColor.colorBgr;
		});
		
		Handlebars.registerHelper('reqStatIcon', function(stat) {
			if(stat === 0)	return "lock-open-variant-outline";
			if(stat === 1)	return "lock-clock";
			if(stat === 2)	return "progress-clock";
			if(stat === 3)	return "lock-open-outline";
			if(stat === 4)	return "lock-outline";
			if(stat === 5)	return "lock";
			if(stat === 6)	return "lock-alert";
			if(stat === 7)	return "block-helper";
			return "";
		});

	
		
		
		const strTyp 					= {
				10000000	: "prj_typ_main",
				11000000	: "prj_typ_sub",
				12000000	: "prj_typ_ele",
				
				20000000	: "prj_typ_data_main",
				21000000	: "prj_typ_data_sub",
				
				30000000	: "prj_typ_test_main",
				31000000	: "prj_typ_test_sub",
				32000000	: "prj_typ_test_sub",
				
				100000000	: "prj_typ_sprint_main",
				200000000	: "prj_typ_wf_main",
				
				//----------------------------------------------------------------------------
				101			: "prj_typ_act_new",
				
				103			: "prj_typ_act_add_cmt",
				104			: "prj_typ_act_add_task",
				105			: "prj_typ_act_add_mem",
				106			: "prj_typ_act_add_doc",
				107			: "prj_typ_act_add_rep",
				
				
				110			: "prj_typ_act_mod_cont",
				111			: "prj_typ_act_mod_stat_lev",
				112			: "prj_typ_act_mod_par",
				113			: "prj_typ_act_mod_cmt",
				114			: "prj_typ_act_mod_task",
				115			: "prj_typ_act_mod_mem",
				117			: "prj_typ_act_mod_rep",
				118			: "prj_typ_act_mod_role",
				119			: "prj_typ_act_mod_stat_lst",
				
				120			: "prj_typ_act_del",
				125			: "prj_typ_act_del_mem",
				126			: "prj_typ_act_del_doc",
				127			: "prj_typ_act_del_rep",
				
				150			: "prj_typ_act_soon",
				151			: "prj_typ_act_late",
				
				201			: "meet_typ_act_add",
				210			: "meet_typ_act_mod",
				250			: "meet_typ_act_soon",
				
				301			: "post_typ_act_add",
				303			: "post_typ_act_add_cmt",
				
				310			: "post_typ_act_mod",
				311			: "post_typ_act_mod_stat",
				
				320			: "post_typ_act_del",
				330			: "post_typ_act_like",
				
				//----------------------------------------------------------------------------
				100000		: "prj_stat_undefined",
				100100		: "prj_stat_new",
				100200		: "prj_stat_todo",
				100300		: "prj_stat_inprogress",
				100400		: "prj_stat_done",
				100500		: "prj_stat_test",
				100600		: "prj_stat_review",
				100700		: "prj_stat_deploy",
				100800		: "prj_stat_unresolved",
				100900		: "prj_stat_closed",
				
				1: "prj_project_lev_bas", 
				2: "prj_project_lev_moyen",
				3: "prj_project_lev_haute"				, 
				4: "prj_project_lev_enpriori" ,
			
			}
		
		Handlebars.registerHelper('reqContentHis', function(data) {
			if(!data)		return "";
			
			
			let prjMainTyp 	= data.main	?$.i18n(strTyp[(data.main	.typ00 + data.main	.typ02) * 1000000]):"";
			let prjParTyp 	= data.par	?$.i18n(strTyp[(data.par	.typ00 + data.par 	.typ02) * 1000000]):"";
			let prjChildTyp = data.child?$.i18n(strTyp[(data.child	.typ00 + data.child	.typ02) * 1000000]):"";
			
			let prjStat		= data.main ?$.i18n(strTyp[data.main.stat01]):"";
			if (!prjStat) prjStat		= $.i18n(strTyp[100000]);
			
			let prjYou		= $.i18n("prj_transl_you");
			let prjOpe		= $.i18n(strTyp[data.typ]);
			let str			= "";
			
			if (data.typTab == "prj"){ 
				switch(data.typ){
				case 101: //---Login đã tạo ...
					str = prjOpe.replace ("#login"			, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp)
								
								.replace ("#childId"		, data.child?data.child.id:"")
								.replace ("#childCode"		, data.child?data.child.code:"")
								.replace ("#childName"		, data.child?data.child.name:"")
								.replace ("#childTyp02"		, data.child?data.child.typ02:"")
								.replace ("#prjChildTyp"	, prjChildTyp)
								
								.replace ("#parId"			,  data.par?data.par.id:"")
								.replace ("#parCode"		,  data.par?data.par.code:"")
								.replace ("#parName"		,  data.par?data.par.name:"")
								.replace ("#parTyp"			,  data.par?data.par.typ00:"")
								.replace ("#prjParTyp"		,  prjParTyp);
								
					break; 
				
				case 103: //---Login đã thêm bình luận vào
					str = prjOpe.replace ("#login"			, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp)  
					break;
				case 104:  //---Login đã chuyển task ... vào ...
					str = prjOpe.replace ("#login"		, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp) 
								
								.replace ("#childId"		, data.child?data.child.id:"")
								.replace ("#childCode"		, data.child?data.child.code:"")
								.replace ("#childName"		, data.child?data.child.name:"")
								.replace ("#childTyp02"		, data.child?data.child.typ02:"")
								.replace ("#prjChildTyp"	, prjChildTyp)
								
					break;
				case 105: //---Login đã thêm thành viên  ... vào
					str = prjOpe.replace ("#login"			, data.login)
								.replace ("#typTab"			, data.typTab)
								
								.replace ("#mem"			, data.mem?data.mem:prjYou)
								
								.replace ("#prjId"			, data.main?data.main.id:"")
								.replace ("#prjCode"		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp)
								
								.replace ("#parId"			,  data.par?data.par.id:"")
								.replace ("#parCode"		,  data.par?data.par.code:"")
								.replace ("#parName"		,  data.par?data.par.name:"")
								.replace ("#parTyp"			,  data.par?data.par.typ00:"")
								.replace ("#prjParTyp"		,  prjParTyp);
					break;
				case 106: //---Login đã tạo tệp đính kèm   ...
					str = prjOpe.replace ("#login"			, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp) 
								.replace ("#prjName"		, data.inf01);
					break; 	
				case 107: //---Login đã tạo báo cáo    ...
					str = prjOpe.replace ("#login"			, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp) 
								.replace ("#prjName"		, data.inf01);
					break; 	
				case 110: //---Login đã thay đổi thông tin của task 
					str = prjOpe.replace ("#login"			, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp)
					if (data.field){
						let contSub 	= "<br>" + $.i18n("prj_typ_act_mod_cont_field");
						for (var lab of data.field){
							contSub 	= contSub 	+ " " + $.i18n("prj_typ_act_mod_cont_"+lab) +",";
						}
						contSub = contSub.substring(0,contSub.length-1);
						str		= str+ contSub;
					}
					break;
				case 111: //---Login đã thay đổi trạng thái của task ... về ...
					let contSub ="";
					if (data.field){
						for (var lab of data.field){
							contSub 	= contSub 	+ " " + $.i18n("prj_typ_act_mod_"+lab) +",";
						}
						contSub = contSub.substring(0,contSub.length-1);
					}
					
					str = prjOpe.replace ("#login"			, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace (/#prjTyp/g 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp) 
								.replace ("#prjStat"		, data.statNew? $.i18n(strTyp[data.statNew]):"")
								.replace ("#prjLev"			, data.lev?$.i18n(strTyp[data.lev]):"")
								.replace ("#contSub"		, contSub) ; 
							
					break;
				case 112: //---Login đã di chuyển task ... về ...
					str = prjOpe.replace ("#login"			, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace (/#prjTyp/g 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp) 
								
								.replace ("#prjStat"		, prjStat) 
								  
								.replace ("#parId"			,  data.par?data.par.id:"")
								.replace ("#parCode"		,  data.par?data.par.code:"")
								.replace ("#parName"		,  data.par?data.par.name:"")
								.replace ("#parTyp"			,  data.par?data.par.typ00:"")
								.replace ("#prjParTyp"		,  prjParTyp);
					break;
				case 113: //---Login đã cập nhập bình luận 
				str = prjOpe.replace ("#login"	, data.login)
							.replace (/#typTab/g		, data.typTab)
							.replace (/#prjId/g			, data.main?data.main.id:"")
							.replace (/#prjCode/g		, data.main?data.main.code:"")
							.replace ("#prjName" 		, data.main?data.main.name:"")
							.replace (/#prjTyp/g 		, data.main?data.main.typ00:"")
							.replace ("#prjMainTyp"		, prjMainTyp) 
				break;
				case 114: //---Login đã di chuyển task ... về ...
					str = prjOpe.replace ("#login"		, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace (/#prjTyp/g 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp) 
								
								.replace ("#childId"		, data.child?data.child.id:"")
								.replace ("#childCode"		, data.child?data.child.code:"")
								.replace ("#childName"		, data.child?data.child.name:"")
								.replace ("#childTyp02"		, data.child?data.child.typ02:"")
								.replace ("#prjChildTyp"	, prjChildTyp)
					break;
				case 115: //---Login đã cập nhập quuyền của member
					let membListMod = "";
					if (data.mem){
					   data.mem.forEach((mem , index) => {
					       membListMod += mem; 
						   if (index < data.mem.length - 1) {
				               membListMod += ", ";
				           }
					   });
					}
					str = prjOpe	.replace ("#login"		, data.login)
									.replace (/#typTab/g		, data.typTab)
									.replace (/#prjId/g			, data.main?data.main.id:"")
									.replace (/#prjCode/g		, data.main?data.main.code:"")
									.replace ("#prjName" 		, data.main?data.main.name:"")
									.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
									.replace ("#prjMainTyp"		, prjMainTyp)
									.replace ("#membListMod"	, membListMod) ;
						break;
				case 117: //---Login cập nhập báo cáo 
					str = prjOpe.replace ("#login"		, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp)
					break;		
				case 118: //---Login cập nhập vai trò thành viên  
					str = prjOpe.replace ("#login"		, data.login)
								.replace ("#prjId"		, data.main.id)
								.replace ("#prjCode"	, data.main.code)
								.replace ("#prjName"	, data.main.name)
								.replace ("#prjTyp"		, prjMainTyp)  
					break;		
				case 119: //---Login cập nhập danh sách trạng thái của dự án ....
					str = prjOpe.replace ("#login"		, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp)
							
					break;				
	
				case 120: //---Login đã xóa task ... trong ....
					str = prjOpe.replace ("#login"		, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp)
								
								.replace ("#childId"		, data.child?data.child.id:"")
								.replace ("#childCode"		, data.child?data.child.code:"")
								.replace ("#childName"		, data.child?data.child.name:"")
								.replace ("#childTyp02"		, data.child?data.child.typ02:"")
								.replace ("#prjChildTyp"	, prjChildTyp)
					break;
				case 121: break;
				case 122: break;
				case 123: break;
				case 124: break;
				case 125: //---Login đã xóa thành viên  ... trong ....
					let membListDel = "";
					if (data.mem){
					   data.mem.forEach((mem , index) => {
					       membListDel += mem; 
						   if (index < data.mem.length - 1) {
				               membListDel += ", ";
				           }
					   });
				   	}
					str = prjOpe.replace ("#login"		, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp)
								.replace ("#membListDel", membListDel) ;
					break;
				case 126: //---Login xóa tệp 
				str = prjOpe.replace ("#login"		, data.login)
							.replace (/#typTab/g		, data.typTab)
							.replace (/#prjId/g			, data.main?data.main.id:"")
							.replace (/#prjCode/g		, data.main?data.main.code:"")
							.replace ("#prjName" 		, data.main?data.main.name:"")
							.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
							.replace ("#prjMainTyp"		, prjMainTyp)
					break;
				case 127: //---Login xóa báo cáo  
				str = prjOpe.replace ("#login"		, data.login)
							.replace (/#typTab/g		, data.typTab)
							.replace (/#prjId/g			, data.main?data.main.id:"")
							.replace (/#prjCode/g		, data.main?data.main.code:"")
							.replace ("#prjName" 		, data.main?data.main.name:"")
							.replace ("#prjTyp" 		, data.main?data.main.typ00:"")
							.replace ("#prjMainTyp"		, prjMainTyp) 
					break;
				
				case 150: //---Task .... sắp đến hạn phải hoàn thành
				str = prjOpe.replace ("#login"		, data.login)
							.replace (/#typTab/g		, data.typTab)
							.replace (/#prjId/g			, data.main?data.main.id:"")
							.replace (/#prjCode/g		, data.main?data.main.code:"")
							.replace ("#prjName" 		, data.main?data.main.name:"")
							.replace (/#prjTyp/g 		, data.main?data.main.typ00:"")
							.replace ("#prjMainTyp"		, prjMainTyp) 
							
							.replace ("#childId"		, data.child?data.child.id:"")
							.replace ("#childCode"		, data.child?data.child.code:"")
							.replace ("#childName"		, data.child?data.child.name:"")
							.replace ("#childTyp02"		, data.child?data.child.typ02:"")
							.replace ("#prjChildTyp"	, prjChildTyp)
					break;
				case 151: //---Task .... đã quá hạn được giao
					str = prjOpe.replace ("#login"		, data.login)
								.replace (/#typTab/g		, data.typTab)
								.replace (/#prjId/g			, data.main?data.main.id:"")
								.replace (/#prjCode/g		, data.main?data.main.code:"")
								.replace ("#prjName" 		, data.main?data.main.name:"")
								.replace (/#prjTyp/g 		, data.main?data.main.typ00:"")
								.replace ("#prjMainTyp"		, prjMainTyp) 
								
								.replace ("#childId"		, data.child?data.child.id:"")
								.replace ("#childCode"		, data.child?data.child.code:"")
								.replace ("#childName"		, data.child?data.child.name:"")
								.replace ("#childTyp02"		, data.child?data.child.typ02:"")
								.replace ("#prjChildTyp"	, prjChildTyp)
					break;
				}
				return str;
			}
			
			if (data.typTab == "meet"){
				switch(data.typ){
				case 201: 
					str = prjOpe.replace ("#login"	, data.login)
								.replace ("#meetTab" , data.typTab)
								.replace ("#meetId"	 , data.main.id)
								.replace ("#meetCode", data.main.code)
								.replace ("#meetDate", data.main.dtBegin)
								.replace ("#meetName", data.main.name);
						break;
				case 210: 
					str = prjOpe.replace ("#login"	, data.login)
								.replace ("#meetTab" , data.typTab)
								.replace ("#meetId"	 , data.main.id)
								.replace ("#meetCode", data.main.code)
								.replace ("#meetDate", data.main.dtBegin)
								.replace ("#meetName", data.main.name);
					break;
				case 250: 
					str = prjOpe.replace ("#login"	, data.login)
								.replace ("#meetTab" , data.typTab)
								.replace ("#meetId"	 , data.main.id)
								.replace ("#meetCode", data.main.code)
								.replace ("#meetDate", data.main.dtBegin)
								.replace ("#meetName", data.main.name);
					break;
				}
				return str;
			}
			
			
			if (data.typTab == "post"){
				switch(data.typ){
				case 301: 
					str = prjOpe.replace (/#postTab/g	, data.typTab) 
								.replace ("#login"		, data.login)
								.replace ("#postId"		, data.main.id)
								.replace ("#postCode"	, data.main.code)
								.replace ("#postName"	, data.main.name);
					break; 
				case 303: 
					str = prjOpe.replace (/#postTab/g	, data.typTab) 
								.replace ("#login"		, data.login)
								.replace ("#postId"		, data.main.id)
								.replace ("#postCode"	, data.main.code)
								.replace ("#postName"	, data.main.name);
					break; 
				case 310: 
					str = prjOpe.replace ("#login"		, data.login)
								.replace ("#postId"		, data.main.id)
								.replace ("#postCode"	, data.main.code)
								.replace ("#postName"	, data.main.name);
					break;
				case 311: 
					str = prjOpe.replace (/#postTab/g	, data.typTab)
								.replace ("#login"		, data.login)
								.replace ("#postId"		, data.main.id)
								.replace ("#postCode"	, data.main.code)
								.replace ("#postName"	, data.main.name);
					break;
				case 320: 
					str = prjOpe.replace ("#login"		, data.login)
								.replace ("#postId"		, data.main.id)
								.replace ("#postCode"	, data.main.code)
								.replace ("#postName"	, data.main.name);
					break;
				case 330: 
					str = prjOpe.replace (/#postTab/g	, data.typTab)
								.replace ("#login"		, data.login)
								.replace ("#postId"		, data.main.id)
								.replace ("#postCode"	, data.main.code)
								.replace ("#postName"	, data.main.name);
					break;
				}
				return str;
			}
		});

		Handlebars.registerHelper('reqPercentComplete', function(val05) {
			if(!val05) 		return "0";
			if(val05 > 100)	return "100";
			return Math.floor(+val05);
		});

		Handlebars.registerHelper('reqDateTimeLateTask', function(date, stat) {
			if(stat && (stat == pr_STAT_PRJ_DONE || stat == pr_STAT_PRJ_CLOSED))	return "";
			
			if(!date)			return "";
			
			var today    = new Date();
			var deadLine = new Date(date);
			
			var nbDays 	 = Math.floor(  Math.abs(today - deadLine) / 86400000); // days
			var nbHrs  	 = Math.floor(( Math.abs(today - deadLine) % 86400000) / 3600000); // hours
//			var nbMins   = Math.round(((Math.abs(today - deadLine) % 86400000) % 3600000) / 60000); 
			
			var sTime	 = "";
			if (nbDays>0) 
				sTime	 = sTime + nbDays + $.i18n("prj_project_expired_day") + " ";
			if (nbHrs>0) 
				sTime	 = sTime + nbHrs  + $.i18n("prj_project_expired_hours") + " ";
//			if (nbMins>0) 
//				sTime	 = sTime + nbMins  + $.i18n("prj_project_expired_minutes");
			
			if((deadLine - today) > 0){
				if(nbDays > 5)	return "";
				
				return "<span class='badge badge-warning badge-pill'>" + $.i18n("prj_project_expired_in") + sTime + "</span>";
			}else{
				return "<span class='badge badge-danger badge-pill'>" + $.i18n("prj_project_expired_late") + sTime + "</span>";
			}
		});
		
		Handlebars.registerHelper('reqDateLate', function(date, stat) {
			if(stat && stat == pr_STAT_PRJ_CLOSED)	return "";
			
			if(stat && stat == pr_STAT_PRJ_DONE){
				return "<span class='badge badge-success badge-pill'>" + $.i18n(PRJ_STAT[4]) + "</span>";
			}
			if(!date)			return "";
			let diffDays 		= req_gl_DayDiff(date);
			let nbDays 			= Math.abs(diffDays);

			if(diffDays < 0) 	return "<span class='badge badge-danger badge-pill'>" + $.i18n("prj_project_expired_late") + nbDays + $.i18n("prj_project_expired_day")+ "</span>";
			if(diffDays > 5)	return "";
			
			return "<span class='badge badge-warning badge-pill'>" + $.i18n("prj_project_expired_in") + nbDays + $.i18n("prj_project_expired_day") + "</span>";
		});

		Handlebars.registerHelper("reqNameCustomer", function(str) {
			if(!str)	return "";
			if(str && str.length > 10){
				return str.substr(0, 10) + "...";
			}
			return str;
		});

		Handlebars.registerHelper("reqClassFav", function(ID_TABLE, typ00, typ01, typ02) {
			let key = [typ00, typ01, typ02].join(",")

			if(!pr_TABLE_CLASS_FAV[ID_TABLE] || !pr_TABLE_CLASS_FAV[ID_TABLE][key]) return ""

			return pr_TABLE_CLASS_FAV[ID_TABLE][key];
		});

		Handlebars.registerHelper("reqRoutePage", function(ID_TABLE, typ00, typ01, typ02) {
			let key = [typ00, typ01, typ02].join(",")
			
			if(!pr_ROUTE_PAGE[ID_TABLE] || !pr_ROUTE_PAGE[ID_TABLE][key]) return "#"
			  
			return pr_ROUTE_PAGE[ID_TABLE][key];
		});

		Handlebars.registerHelper("reqSrcPage", function(ID_TABLE, typ00, typ01, typ02, id, code) {
			let key = [typ00, typ01, typ02].join(",")

			const map = {
				'#id': id,
				'#code': code,
			};
			
			if(!pr_TABLE_SRC_PAGE[ID_TABLE] || !pr_TABLE_SRC_PAGE[ID_TABLE][key]) return "#"
			  
			return pr_TABLE_SRC_PAGE[ID_TABLE][key].replace(/#id|#code/gi, m => map[m]);
		});

		Handlebars.registerHelper("reqSrcAvatarCustomer", function(cus) {
			if(!cus.avatar){
				return UI_URL_ROOT + "img/prj/users/avatar-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".jpg";
			}else{
				return App.path.LOCATION_URL_HREF + cus.avatar.urlPrev;
			}
		});

		/*
		Handlebars.registerHelper('reqCodePrjNotify', function(content) {
			if(!content)	return "";
			let data 		= JSON.parse(content);
			if(data && data.title)	return data.title;

			return "";
		});

		Handlebars.registerHelper('reqIdPrjNotify', function(content) {
			if(!content)	return "";
			let data 		= JSON.parse(content);
			if(data && data.title)	return data.parID;

			return "";
		});
		*/
		
		// Handlebars.registerHelper('reqContentNotify', function(cmt, history, entID) {
		// 	if(!cmt)	return "";
		// 	let data 		= cmt; //JSON.parse(cmt);

		// 	let hisData = null; ;
		// 	if (history && history.cmt) {
		// 		hisData 		= JSON.parse(history.cmt);
		// 		hisData			= hisData[hisData.length - 1];
		// 	}
			
		// 	const isPassive = (data.typTab == "comment" || data.typTab == "content" || (data.typTab == "member" && data.typ == 11));
		// 	let str 		= $.i18n(isPassive ? "prj_dashboard_notify_init_comment": "prj_dashboard_history_init") + " ";
		// 	if (isPassive && hisData && hisData.uName && data.typTab == "content") {
		// 		str = hisData.uName +  " ";
		// 	}

		// 	if(data.typ)	str += $.i18n(strTyp[data.typ]) + " ";
		// 	if(data.typTab)	str += $.i18n(strTyp[data.typTab]) + " ";
		// 	if(data.title) {
		// 		if (data.typTab == "report") 
		// 			str += "<a href='view_prj_job_report_man.html'>" +data.title + "</a> ";
		// 		else 
		// 		if (data.typTab == "off") 	
		// 			str += "<a href='view_prj_job_off_man.html'>" +data.title + "</a> ";	
		// 		else 
		// 			str += "<a href='#' class='a_view_prj' data-id='" + entID + "'>" +data.title + "</a> "; 
		// 	}	

		// 	if(data.typ == PR_TYP_MOVE){
		// 		str += $.i18n("prj_dashboard_history_from") + " " + $.i18n(PRJ_STAT[data.statFrom]) + " " + $.i18n("prj_dashboard_history_to") + " " + $.i18n(PRJ_STAT[data.statTo]);
		// 	}

		// 	if(data.typTab == "content" && hisData.statFrom != null){
		// 		str += $.i18n("prj_dashboard_history_from") + " " + $.i18n(PRJ_STAT[hisData.statFrom]) + " " + $.i18n("prj_dashboard_history_to") + " " + $.i18n(PRJ_STAT[hisData.statTo]);
		// 	}

		// 	return str;
		// });

		Handlebars.registerHelper('reqFirstLetter', function(str) {
			if(!str)	return "A";

			return str.trim().substr(0,1).toUpperCase();
		});

		Handlebars.registerHelper('reqTypPerson', function(typ01) {
			if(!typ01)	return "";
			let objTyp = App.data.cfgValListTypePerson.find(item => item.id == typ01);
			if(objTyp)	return $.i18n(objTyp.val01);
			return "";
		});

		Handlebars.registerHelper('reqLegalStatus', function(cfgVal02, typ01) {
			let listLegalStatus   = App.data.cfgValListTypeLegalStatM;
			if(typ01 && typ01 == 1000002){
				listLegalStatus = App.data.cfgValListTypeLegalStatN;
			}


			if(!typ01)	return "";
			let objTyp = listLegalStatus.find(item => item.id == cfgVal02);
			if(objTyp)	return $.i18n(objTyp.val01);
			return "";
		});

		Handlebars.registerHelper('reqTypPartner', function(typ02) {
			if(!typ02)	return "";
			let objTyp = App.data.cfgValListTypePartner.find(item => item.id == typ02);
			if(objTyp)	return $.i18n(objTyp.val01);
			return "";
		});

		Handlebars.registerHelper('reqTypDomain', function(cfgVal01) {
			if(!cfgVal01)	return "";
			let objTyp = App.data.cfgValListTypeDomainPartner.find(item => item.id == cfgVal01);
			if(objTyp)	return $.i18n(objTyp.val01);
			return "";
		});

		Handlebars.registerHelper('reqStatPartner', function(stat) {
			if(!stat)				return $.i18n(STAT_PARTNER[100]);
			if(!STAT_PARTNER[stat])	return $.i18n(STAT_PARTNER[100]);

			return $.i18n(STAT_PARTNER[stat]);
		});

		Handlebars.registerHelper('reqStatBadgePartner', function(stat) {
			if(stat == 11)	return "badge-danger";
			if(stat == 3)	return "badge-success";
			return "badge-info";
		});

		Handlebars.registerHelper('cutStrInfo', function(str) {
			if(!str)	return "";
			if(str.length < 100)	return str;
			return str.substr(0, 100) + "...";
		});

		Handlebars.registerHelper('reqTypUser', function(typ) {
			if(!typ)				return $.i18n(TYP_USER[3]);
			if(!TYP_USER[typ])		return $.i18n(TYP_USER[3]);

			return $.i18n(TYP_USER[typ]);
		});

		Handlebars.registerHelper('reqTypBadgeUser', function(typ) {
			if(typ == 2)	return "badge-danger";
			if(typ == 6)	return "badge-success";
			return "badge-info";
		});

		Handlebars.registerHelper('reqPositionUser', function(pos) {
			if(!pos)	return $.i18n("prj_dashboard_tab_user_info_no_pos");

			return pos.reduce((name, item) => name + " /" + $.i18n("prj_dashboard_tab_user_info_" + item.code.toLowerCase()), "")
		});

		Handlebars.registerHelper('reqNameSocialNetwork', function(code) {
			if(!code)					return "";
			if(!SOCIAL_NETWORK[code])	return "";
			return SOCIAL_NETWORK[code].label;
		});

		Handlebars.registerHelper('reqUrlSocialNetwork', function(code, value) {
			if(!code)						return "";
			if(!SOCIAL_NETWORK_URL[code])	return "";
			
			value = value.toLowerCase();
			if (value.indexOf("http")>=0) return value;
			if (value.indexOf(SOCIAL_NETWORK_URL[code])>=0)   return value;
			
			return SOCIAL_NETWORK_URL[code].label + value;
		});

		Handlebars.registerHelper('reqIconSocialNetwork', function(code) {
			if(!code)					return "";
			if(!SOCIAL_NETWORK[code])	return "";
			return SOCIAL_NETWORK[code].label.toLowerCase();
		});

		Handlebars.registerHelper('reqBgColorSocialNetwork', function(code) {
			if(!code)					return "primary";
			if(!SOCIAL_NETWORK[code])	return "primary";
			return SOCIAL_NETWORK[code].bgColor;
		});

		Handlebars.registerHelper('reqIconFolderMail', function(folder) {
			if(PR_ICON_FOLDER[folder]) return PR_ICON_FOLDER[folder];
			else return PR_ICON_FOLDER["folder"];
		});
		
		Handlebars.registerHelper('reqNameFolderMail', function(name) {
			let folderName = "";
			if(PR_LANGUAGE_FOLDER[name]) folderName = $.i18n(PR_LANGUAGE_FOLDER[name]);
			else folderName = name;
			return folderName;
		});

		Handlebars.registerHelper('reqDestinationMail', function(folder, from, to) {
			if(["Brouillons", "Sent", "Objets envoyés"].includes(folder))	return to;
			return from;
		});

		Handlebars.registerHelper('reqNameEmail', function(name) {
			if(!name)		return "";
			let begin = name.indexOf("<");
			if(begin < 0)	return name;

			return name.slice(0, begin);
		});

		Handlebars.registerHelper('reqEmailEmail', function(name) {
			if(!name)		return "";
			let begin 	= name.indexOf("<");
			if(begin < 0)	return "";
			let end 	= name.indexOf(">");
			return name.slice(begin + 1, end);
		});

		Handlebars.registerHelper('cutStrName', function(str) {
			if(!str)	return "";
			if(str.length < 15)	return str;
			return str.substr(0, 12) + "...";
		});

		Handlebars.registerHelper('reqPathDoc', function(path) {
			if(can_gl_MobileOrTablet()){
				return App.path.LOCATION_URL_HREF + path;
			}

			return path;
		});

		Handlebars.registerHelper('reqCheckStat', function(stat, ...restStats) {
			let options 		= restStats[restStats.length - 1];
			restStats.length 	= restStats.length - 1;

			if(!paramStats.includes(stat)) return options.fn(this)
			
			if(restStats.includes(stat)) return options.fn(this)

			return options.inverse(this)
		});
		
		Handlebars.registerHelper('reqStatClose', function(stat) {
			if(!stat)	return false;
			return stat === pr_STAT_PRJ_CLOSED;
		});
		
		Handlebars.registerHelper('reqClassByStat', function(stat) {
			if(!stat)	return "";
			if(stat === pr_STAT_PRJ_NEW)		return "isPrjNew";
			if(stat === pr_STAT_PRJ_TODO)		return "isPrjTodo";
			if(stat === pr_STAT_PRJ_INPROGRESS)	return "isPrjInprogess";
			if(stat === pr_STAT_PRJ_DONE)		return "isPrjDone";
			
			if(stat === pr_STAT_PRJ_DEPLOY)		return "isPrjDeploy";
			if(stat === pr_STAT_PRJ_TEST)		return "isPrjTest";
			if(stat === pr_STAT_PRJ_REVIEW)		return "isPrjReview";
			
			if(stat === pr_STAT_PRJ_CLOSED)		return "isPrjClose";
			if(stat === pr_STAT_PRJ_UNRESOLVED)	return "isPrjNoCapable";
			
		});
		
		Handlebars.registerHelper('reqLabByStat', function(stat) {
			if(!stat)	return "";
			if(paramStats.includes(stat))	return $.i18n("prj_project_stat_"+stat);
			return stat;
		});
		
		
		
		Handlebars.registerHelper('reqStatNew', function(stat) {
			if(stat === null)	return false;
			return stat === pr_STAT_PRJ_NEW;
		});
		
		Handlebars.registerHelper("cutStrNumber", function(str, number) {
			if(!str)	return "";
			if(str && str.length > number){
				return str.substr(0, number) + "...";
			}
			return str;
		});
		
		Handlebars.registerHelper("getFileExtensionIcon", function(fileName) {
			if(!fileName)	return "blank";
			const extension = fileName.split('.').pop().toLowerCase();
			if(!pr_EXTENSION_DOC[extension])	return "blank";
			
			return pr_EXTENSION_DOC[extension];
		});
		
		Handlebars.registerHelper('isFavorite', function(parTyp, parId){
			if(!App.data["lstFavorites"])	return false;
			return !!App.data["lstFavorites"][parTyp + '_' + parId];
		});
		
		Handlebars.registerHelper('isShowDelCmt', function(data){
			let usesId = App.data.user.id;
			if(data.uId01 != usesId) return true;
			
			let dtAdd = new Date(data.dt01);
			let today = new Date();
				
			var diff = Math.abs(today - dtAdd) / 3600000;
			if (diff > 12) return true;
			
			return false;
		});
		
		Handlebars.registerHelper('getLabelName', function(typ02){
			if(typ02 === pr_TYPE02_PRJ)		return $.i18n("prj_project_project_name");
			if(typ02 === pr_TYPE02_EPIC)	return $.i18n("prj_project_epic_name");
			if(typ02 === pr_TYPE02_TASK)	return $.i18n("prj_project_task_name");
		});
		Handlebars.registerHelper('getPlaceHolderName', function(typ02){
			if(typ02 === pr_TYPE02_PRJ)		return $.i18n("prj_project_enter_project_name");
			if(typ02 === pr_TYPE02_EPIC)	return $.i18n("prj_project_enter_epic_name");
			if(typ02 === pr_TYPE02_TASK)	return $.i18n("prj_project_enter_task_name");
		});
		Handlebars.registerHelper('getLabelCode', function(typ02){
			if(typ02 === pr_TYPE02_PRJ)		return $.i18n("prj_project_code");
			if(typ02 === pr_TYPE02_EPIC)	return $.i18n("prj_project_code_epic");
			if(typ02 === pr_TYPE02_TASK)	return $.i18n("prj_project_code_task");
		});
		Handlebars.registerHelper('getPlaceHolderCode', function(typ02){
			if(typ02 === pr_TYPE02_PRJ)		return $.i18n("prj_project_code_enter");
			if(typ02 === pr_TYPE02_EPIC)	return $.i18n("prj_project_code_epic_enter");
			if(typ02 === pr_TYPE02_TASK)	return $.i18n("prj_project_code_task_enter");
		});
		
		Handlebars.registerHelper('getPlaceHolderFileName', function(typ02){
			if(typ02 === pr_TYPE02_PRJ)		return $.i18n("prj_file_enter_file_name");
			if(typ02 === pr_TYPE02_EPIC)	return $.i18n("prj_file_enter_epic_name");
		});
		
		Handlebars.registerHelper('getPlaceHolderFileCode', function(typ02){
			if(typ02 === pr_TYPE02_PRJ)	    return $.i18n("prj_file_code_enter");
			if(typ02 === pr_TYPE02_EPIC)	return $.i18n("prj_file_code_epic_enter");
		});
		
		const pr_TYPE_GRP_CHAT_OWNER 	= 10;
		const pr_TYPE_GRP_CHAT_ADMIN 	= 0;
		const pr_TYPE_GRP_CHAT_MEMBER 	= 2;
		Handlebars.registerHelper('hasRightTransformChat', function(list){
			if(!list)	return false;
			const me = list.find(item => item.uId === App.data.user.id)
			if(!me)		return false;
			
			if([pr_TYPE_GRP_CHAT_OWNER, pr_TYPE_GRP_CHAT_ADMIN].includes(me.typ))	return true;
			
			return false;
		});
		
		/*
		Handlebars.registerHelper('reqTabPrjNotify', function(content) {
			if(!content)	return "";
			let data 		= JSON.parse(content);
			if(data && data.title && data.typTab)	return data.typTab;

			return "";
		});*/
		
		Handlebars.registerHelper('reqParseJson', function(str) {
			return JSON.parse(str);
		});
		
		const actionHistory = {
				1 : "prj_history_action_add", 
				2 : "prj_history_action_mod", 
				3 : "prj_history_action_del", 
				4 : "prj_history_action_join", 
				6 : "prj_history_action_out", 
				7 : "prj_history_action_comment", 
				9 : "prj_history_action_move"
		}
		
		const contentHistory = {
				"content" 	: "prj_history_content_content", 
				"member" 	: "prj_history_content_member", 
				"prj" 		: "prj_history_content_prj", 
				"epic" 		: "prj_history_content_epic", 
				"task" 		: "prj_history_content_task", 
				"comment" 	: "prj_history_content_comment", 
				"customer" 	: "prj_history_content_cus"
		}

		const levHistory = {
			1 : "prj_project_lev_01", 2 : "prj_project_lev_02", 3 : "prj_project_lev_03", 4 : "prj_project_lev_04"
		}
		
		Handlebars.registerHelper('reqActionHistory', function(typAction) {
			return $.i18n(actionHistory[typAction]);
		});

		Handlebars.registerHelper('reqLevHistory', function(lev) {
			if (lev == null || lev == undefined) return "";
			return $.i18n(levHistory[lev]);
		});
		
		Handlebars.registerHelper('reqContentHistory', function(content) {
			return $.i18n(contentHistory[content]);
		});
		
		// Handlebar from 1001qua
		Handlebars.registerHelper("reqAvatarOfferDeal", function(files) {
			if(!files || !files.length)	return UI_URL_ROOT+ '/img/prj/noImg.jpg';
			let avatar = files.find(o => o.typ01 === 2 && o.typ02 === 1);
			
			if(avatar)	return decodeURIComponent(avatar.urlPrev);
			
			return decodeURIComponent(files[0].path01);
		});

		Handlebars.registerHelper("url_image_err", function(path) {
			// Helper to put planes tails icons for each company
			var errPath = UI_URL_ROOT+ '/img/prj/noImg.jpg'
			return 'this.src = "'+errPath+ '"';
		});

		Handlebars.registerHelper("getNameLogin", function(user) {
			if(!user.login01)	return "";
			return ["GG_", "FB_"].includes(user.login01.substr(0, 3)) ? user.v1 : user.login01;
		});

		Handlebars.registerHelper("decodeFile", function(file) {
			if(!file)	return UI_URL_ROOT+ '/img/prj/noImg.jpg';
			
			return decodeURIComponent(file);
		});

		Handlebars.registerHelper("reqAvatarUserWithPath", function(path) {
			if(!path)	return "../../www/images/default_user.png";
			return path;
		});

		Handlebars.registerHelper("getNameUserLogin", function(name, val01) {
			if(!name)	return "";
			if(name === "visitor")	return $.i18n("deal_list_name_visitor") + " - ";
			
			return ["GG_", "FB_"].includes(name.substr(0, 3)) ? val01 : name + " - ";
		});
		////////////////
		Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
			switch (operator) {
			case '==':
				return (v1 == v2) ? options.fn(this) : options.inverse(this);
			case '===':
				return (v1 === v2) ? options.fn(this) : options.inverse(this);
			case '<':
				return (v1 < v2) ? options.fn(this) : options.inverse(this);
			case '<=':
				return (v1 <= v2) ? options.fn(this) : options.inverse(this);
			case '>':
				return (v1 > v2) ? options.fn(this) : options.inverse(this);
			case '>=':
				return (v1 >= v2) ? options.fn(this) : options.inverse(this);
			case '&&':
				return (v1 && v2) ? options.fn(this) : options.inverse(this);
			case '&&!':
				return (v1 && !v2) ? options.fn(this) : options.inverse(this);
			case '||':
				return (v1 || v2) ? options.fn(this) : options.inverse(this); 
			case '||!':
				return (v1 || !v2) ? options.fn(this) : options.inverse(this); 
			default:
				return options.inverse(this);
			}
		});
		
		Handlebars.registerHelper("reqNameFolderEmail", function(folder) {
			if(!folder)	return false;
			if(folder !== "Objets envoyés")	return false;
			
			return true;
		});
		
		Handlebars.registerHelper("reqTypeEmailSecure", function(mailContent) {
			if(!mailContent.subj)	return false;
			let subj = mailContent.subj;
			
			let firstIdx = subj.lastIndexOf("[");
			let lastIdx  = subj.lastIndexOf("]");
			if(firstIdx < 0 ||  lastIdx < 0 || firstIdx >= lastIdx) return false;
			
			let code = subj.substring(firstIdx + 1, lastIdx);
			
			if(code == null || code.length <= 12) return false;
			
			return true;
		});
		
		const PRJ_STAT_EMAIL_SECU	= {1: "prj_msgbox_secu_stat_send"	, 2: "prj_msgbox_secu_stat_del_ping"};
		Handlebars.registerHelper("reqStatEmailSecu", function(stat) {
			if(stat === undefined)	return "";
			return $.i18n(PRJ_STAT_EMAIL_SECU[+stat]);
		});
		
		Handlebars.registerHelper("isStatSendEmailSecu", function(stat) {
			if(stat === undefined || stat === 2)	return false;
			return true;
		});
		
		const fImage = ['.jpg', '.jpeg', '.png', 'PNG']
		Handlebars.registerHelper("isImage", function(path) {
			if(!path)	return false;
			for(let i=0; i< fImage.length; i++){
				if(path.includes(fImage[i])) return true;
			}
			return false;
		});
		
		const TYP_KINESIS_DEACTIVE	= 0;
		const TYP_KINESIS_ACTIVE	= 1;
		Handlebars.registerHelper("isCallVideoKinesis", function(group) {
			if(!group)	return false;
			if(!group.val02) return false;
			let val02 = JSON.parse(group.val02);
			if(val02.typ == TYP_KINESIS_ACTIVE) return true;
			return false;
		});
		
		Handlebars.registerHelper("reqHSStr", function(date) {
			if(!date) return false;
			return req_gl_DateStr_From_DateStr(date, "", "HH:mm");
		});
		
		Handlebars.registerHelper("reqShortDateStr", function(date) {
			if(!date) return "";
			
			var local = localStorage.language;
			if (!local) local = "en";
			var format = DateFormat.masks.enShortDate;
			
			if (local=="fr")
				format = DateFormat.masks.frShortDate;
			else if (local=="vn")
				format = DateFormat.masks.viShortDate;
			else if (local=="vi")
				format = DateFormat.masks.viShortDate;
			
			
			return req_gl_DateStr_From_DateStr(date, "", format);
		});
		
		const PRJ_STAT_GROUP_EMAIL_CAMPAGNE = {1: "prj_email_campagne_status_new"	, 2: "prj_email_campagne_status_validate"	, 5: "prj_email_campagne_status_delete"};
		Handlebars.registerHelper("reqStatGroupEmailCampagne", function(stat) {
			if(stat === undefined)	return "";
			return $.i18n(PRJ_STAT_GROUP_EMAIL_CAMPAGNE[+stat]);
		});
		
		const PRJ_STAT_GROUP_EMAIL = {1: "nso_group_email_header_status_not_validated"	, 2: "nso_group_email_header_status_validated"	, 3: "nso_group_email_header_status_wait_delete"};
		Handlebars.registerHelper("reqStatGroupEmail", function(stat) {
			if(stat === undefined)	return "";
			return $.i18n(PRJ_STAT_GROUP_EMAIL[+stat]);
		});
		
		Handlebars.registerHelper("reqNameStringFile", function(name) {
			if(!name) return "";
			name = decodeURIComponent(name)
			let index = name.indexOf(".");
			if(index < 20) return name;
			return name.substr(0, 20) + name.substr(index);
		});

		Handlebars.registerHelper("reqConvertTimeZone", function(date) {
			if(!date)	return "";

			date = new Date(date);
			let sysUTC  = App.data.utc;
			let userUTC = 0;
			if (App.data.user && App.data.user.utcZone)
				userUTC = App.data.user.utcZone;

			let int_sysUTC = Math.trunc(sysUTC);
			let float_sysUTC = Number((sysUTC - int_sysUTC).toFixed(2));
			if (Math.abs(float_sysUTC) == 0.5)  float_sysUTC = 30;
			if (Math.abs(float_sysUTC) == 0.75) float_sysUTC = 45;

			let int_userUTC = Math.trunc(userUTC);
			let float_userUTC = Number((userUTC - int_userUTC).toFixed(2));
			if (Math.abs(float_userUTC) == 0.5)  float_userUTC = 30;
			if (Math.abs(float_userUTC) == 0.75) float_userUTC = 45;

			date.setHours(date.getHours() - int_sysUTC + int_userUTC);
			date.setMinutes(date.getMinutes() - float_sysUTC + float_userUTC);

			let local = localStorage.language ? localStorage.language : "en";
			return DateFormat(date, formatFullDateToMM[local]);
		});

		Handlebars.registerHelper("canBeGG", function(name, options) {
			let check = false;
			if (name.includes("GG_") || name.includes("FB_")) check = true;

			if (check) {
				return options.inverse(this);
			} else {
				return options.fn(this);
			}
		});
		
		Handlebars.registerHelper('innerText', function(str, len) {
			if (!str) str = "";
//			var doc 	= new DOMParser().parseFromString(str, "text/html");
//			var isHtml 	= Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
//			var strEnd	= "";
//			if (!isHtml) 
//				strEnd =str;
//			else
//				strEnd = doc.innerText;
			
			
//			if (!strEnd) strEnd = "";
//			if (len>0) strEnd = strEnd.substring (0, len) + "...";
//			return strEnd;
			
			var $el = $('<div />').html(str);
			if ($el.has(".msg-rep")){
				$el.find(".msg-rep").remove();
			}
			
			var cont = $el.text().trim();
			if (!cont) cont= "...";
			else if (len>0) cont = cont.substring (0, len) + "...";
			
			return cont;
		});
		
		Handlebars.registerHelper('countArray', function(array, lev) {
		    let counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
		    let totalCount = 0;

		    array.forEach(function(item) {
		        if (counts[item.lev] !== undefined) {
		            counts[item.lev]++;
		        }
		    });

		    lev.forEach(function(value) {
		        let levValue = parseInt(value);
		        if (counts[levValue] !== undefined) {
		            totalCount += counts[levValue];
		        }
		    });

		    return totalCount;
		});
		
		
	};
	return { MainSidebar, MainHeader, MainMessage, MainNotification, MainFavorite, MainHandlebarsDef};
});