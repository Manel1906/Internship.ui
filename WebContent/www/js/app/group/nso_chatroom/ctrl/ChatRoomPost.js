define(['jquery',
], function() {


	const ChatRoomPost = function(grpName, header, content, footer) {
		var pr_divHeader = header;
		var pr_divContent = content;
		var pr_divFooter = footer;

		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
		const tmplName 				= App.template.names[pr_grpName];
		const tmplCtrl 				= App.template.controller;
		//------------------------------------------------------------------------------------
		//------------------variable pagination post------------------------------------------------------
		const pr_NUMBER_RECORD 		= 8;

		const pr_TYP_MSG_PRIVATE 	= 200;
		const pr_TYP_MSG_PUBLIC 	= 201;

		const pr_TYP_CHAT_USER 		= 1;
		const pr_TYP_CHAT_GROUP 	= 2;
		const pr_TYP_CHAT_CONTACT 	= 3;

		var pr_isLoadMore = false;

		const pr_STAT_VALIDATED 		= 1;
		var pr_ENT_TPY_GROUP 			= 5000;
		var pr_SEARCH_KEY 				= "";
		var catIds 						= "";	
		var pr_TYP_POST 				= 101;
		var multiLang 					= "";

		const pr_KEY_ENTER 				= 13;

		const pr_member_lev_manager 	= 0;
		const pr_member_lev_owner 		= 10;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_User 			= null;
		var pr_ctr_Member 			= null;
		var pr_ctr_ChatWebRTC 		= null;
		const var_lc_STAT_VALIDE    = 2;
		var   var_lc_GROUP_ID       = null;		
		const var_lc_GROUP_TYP 		= 5000;
		var pr_KEY_MANAGER 		= false;
		var   self                  = this;
		let files					= {files: []};
		//--------------------APIs--------------------------------------//
		this.do_lc_init = function() {
			pr_ctr_Main 		= App.controller.ChatRoom.Main;
			pr_ctr_Group 		= App.controller.ChatRoom.Group
			pr_ctr_Chat 		= App.controller.ChatRoom.Chat
			pr_ctr_Member 		= App.controller.ChatRoom.Member;
			pr_ctr_ChatWebRTC 	= App.controller.ChatRoom.WebRTC;
			// pr_ctr_ChatWebChime 	= App.controller.ChatRoom.ChatWebChime;


		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(obj, showDetail) {      //typChat user or group         
			try {
				pr_KEY_MANAGER = showDetail
				do_lc_load_view(obj, showDetail);
			} catch (e) {
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chat", "ChatRoomPost", "do_lc_show", e.toString()) ;
			}
		};
		const do_lc_load_view = function(obj, showDetail) {
			
			$("#div_post").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_POST, {}));
			$("#inp_search_aa").off("input").on("input", function(e){
				e.preventDefault();
				pr_SEARCH_KEY	= $(this).val();
				obj.searchkey=pr_SEARCH_KEY;
				do_gl_execute_debounce(do_lc_get_posts(obj));
			})
			
			$(".btn-resize-post").off("click").on("click", function() {
				let $this = $(this);
				let child = $this.find("i");
				let { divtoggle } = $this.data();

				$(divtoggle).toggle("hide");
				child.toggleClass("mdi-window-maximize mdi-window-minimize")

				$(".btn-vertital-post").toggle("hide");
				do_lc_get_posts(obj);
			})
			
			
			if (showDetail) {
				$(".btn-resize-post").find("i")			.removeClass("mdi-window-maximize");
				$(".btn-resize-post").find("i")			.addClass	("mdi-window-minimize");
				
				let {divtoggle} = $(".btn-resize-post").data();
				$(divtoggle)	.toggle("hide");
				
				do_lc_get_posts(obj);
			}
			
			//----------------------------------------------------------------------------		
			$("#btn_new_post").off('click').click(() => {
				App.MsgboxController.do_lc_close();
				if(!pr_KEY_MANAGER){
					do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"));
					return;
				}
				App.MsgboxController.do_lc_show({
					title: $.i18n("prj_project_new_post"),
					content: tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_NEWPOST, {v01:pr_ENT_TPY_GROUP, v02:obj.id}),
					autoclose: true,
					buttons: {
						SEND: {
							lab: $.i18n("common_btn_save"),
							funct: function () { do_lc_create_post(obj);do_show_fileUploader03(obj);},
							autoclose: true,
							classBtn	: "btn-primary"
						},
						NO: {
							lab: $.i18n("common_btn_cancel"),
						}
					},
					onClose: () => {
						files = { files: [] };
					},
					bindEvent: function() {
						do_show_fileUploader(obj);
						App.SummerNoteController.do_lc_show("#div_create_prj_post", {height : 100});	
					}
					
				});
			});

			//-----------------------------------------------------------------------------
			$('#btn_lst_post').off("click").click(() => {
				if(!pr_KEY_MANAGER){
					do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view_post_all"));
					return;
				}
				do_lc_get_all_posts(obj)
			});
		}
		
		const do_lc_get_all_posts = (obj) => {
			let multiStat = [pr_STAT_VALIDATED].join(",");
			let ref = req_gl_Request_Content_Send_With_Params("ServiceNsoPost", "SVLstPageArtical",
				{ entId: obj.id, entTyp: pr_ENT_TPY_GROUP, searchkey: pr_SEARCH_KEY, multiStat, multiLang, type: pr_TYP_POST, withAva: true,  forced:true  });

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_get_all_post_callback, []));

			let fError = req_gl_funct(App, do_gl_show_MsgAjax, [$.i18n("common_err_ajax")]);

			App.network.do_lc_ajax_bg(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		const do_lc_get_all_post_callback= sharedJson=>{
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				do_lc_show_all_post	(data);
			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view_post"));
			}
		}
		const do_lc_show_all_post = obj => {
			App.MsgboxController.do_lc_show({
				content		: tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_LISTPOST, obj),
				autoclose	: true,
				buttons		: "none",
			});
			$(".container-fluid").css({
				"wigth":"100%",
			})
			//do_lc_bind_event(obj);
		}
		
		
		var do_lc_create_post = obj => {
			let	data	 		= req_gl_data({
				dataZoneDom		: $("#div_create_prj_post"),
				oldObject 		: obj,
				//	removeDeleted	: true
			});
   			obj.entId = obj.id
			if(data.hasError)	return false;
			do_lc_create_prj_post(data, obj)
					
		}
		const do_lc_create_prj_post = (data, obj)=> {
			let ref = req_gl_Request_Content_Send("ServiceNsoPost", "SVNewArtical");
			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_after_new_posts, []));

			let fError = req_gl_funct(App, do_lc_show_Msg, [$.i18n("common_err_ajax")]);
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		const do_lc_after_new_posts = sharedJson=> {
			if(can_gl_AjaxSuccess(sharedJson)) 
			{
				let data = sharedJson[App['const'].RES_DATA];
				do_lc_show_post	(data);
				data.id=data.v02;
				do_lc_get_posts	(data)
				
			}
			else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"));
			}
			
		}
		
		const do_show_fileUploader = obj => {
			if (obj.files) 
			{
				files.files = obj.files;
			}
			let option1 = 	{
				fileinput	: { param: { typ01: 1, typ02: 1, maxFiles: 1 } },//option here
				obj			: obj//read files and insert in files of obj
			}
			do_gl_init_fileDropzone($("#div_file_avatar"), option1);

			let option2 = 	{
				fileinput	: { param: { typ01: 2, typ02: 10 } },//option here
				obj			: obj//read files and insert in files of obj
			}
			do_gl_init_fileDropzone($("#div_file_others"), option2);
		}
		const do_show_fileUploader03 = obj => {
			obj.files = [];
			$("#div_file_avatar").null;
			$("#div_file_others").null;
		}
		
		const do_lc_show_Msg = e => console.log(e);

		const do_lc_get_posts = (obj) => {
			let multiStat = [pr_STAT_VALIDATED].join(",");
			let ref = req_gl_Request_Content_Send_With_Params("ServiceNsoPost", "SVLstPageArtical",
				{ entId: obj.id, entTyp: pr_ENT_TPY_GROUP, searchkey: pr_SEARCH_KEY, multiStat, multiLang, type: pr_TYP_POST, withAva: true, forced:true });

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_show_list_pagination, []));

			let fError = req_gl_funct(App, do_gl_show_MsgAjax, [$.i18n("common_err_ajax")]);

			App.network.do_lc_ajax_bg(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_show_list_pagination = sharedJson => {
			let data = {};
			if (can_gl_AjaxSuccess(sharedJson)) {
				data = sharedJson[App['const'].RES_DATA];
				if (data.lst) {
					data.lst = data.lst.map(item => {
						if (!item.files) return item;
						let files = item.files;
						let avatar = files.find(file => file.typ01 == 1 && file.typ02 == 1);
						item.avatar = avatar ? avatar : null;
						return item;
					})
				} else {
					data.lst = [];
				}
		
				$("#div_post_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_POST_DETAIL, { data: data.lst }));
				do_lc_bind_btn_slide_post(data);
				
			} else {
				$("#div_post_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_POST_DETAIL, {}));
			}
		}
//-----------------------------------------------------------------------------------------------------------------------------------
		
		const do_lc_bind_btn_slide_post = (args) => {
		   	 $(".offer-item").off("click").on("click", function() {
		        let { id } = $(this).data();
		        do_lc_get_post(id);
		    	});
		};
		const do_lc_get_post = (id) => {
			const idObj=id;
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoPost", "SVGetPost", {id, forced:true});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_post_callback, [idObj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		const do_lc_get_post_callback= (sharedJson,idObj)=>{
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 					= sharedJson[App['const'].RES_DATA];
				do_lc_show_post			(data, idObj);
			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"));
			}
		}
		const do_lc_show_post = (obj, idObj) => {
			App.MsgboxController.do_lc_close();
			App.MsgboxController.do_lc_show({
					content		: tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_POSTDETAIL, obj),
					autoclose	: true,
					buttons		: "none",
				});
			if(!pr_KEY_MANAGER){
				$("#btn_modify").addClass("hide")
				$("#btn_star").addClass("hide")
				$("#btn_del").addClass("hide")
			}
			
			do_lc_bind_event(obj,idObj);
		}
//--------------------------------------------------------------------------------------------------------------------------------------------
		const do_lc_bind_event = (obj,idObj) => {
		$('#btn_modify').off("click").click(() => {
			if (App.data.user.id==obj.uId01 || App.data.user.typ01==2 || App.data.user.typ01==1)
			{
					obj.id=idObj;
					App.MsgboxController.do_lc_show({
					content		: tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_MODPOST, obj),
					autoclose	: true,
					buttons: {
						SEND: {
							lab: $.i18n("common_btn_save"),
							funct: function () { do_lc_modify_post(obj)},
							autoclose: true,
							classBtn	: "btn-primary"
						},
						NO: {
							lab: $.i18n("common_btn_cancel"),
						}
					},
					onClose: () => {
						files = { files: [] };
					},
					bindEvent: function() {
						do_show_fileUploader2(obj);
						App.SummerNoteController.do_lc_show("#div_modify_post", {height : 100});	
					}
				
				});
			}
			else{
				do_gl_show_Notify_Msg_Error($.i18n("can_not_modify"));
			}
		});
		
		$("#btn_star").off("click").on("click", function() {
				$("#btn_star_close").show();
				$("#btn_star").hide();
				do_lc_tick_post(idObj);
				do_gl_show_Notify_Msg_Success($.i18n("nso_tick_post"));
			})
		$("#btn_star_close_z").off("click").on("click", function() {
				$("#btn_star_close").hide();
				do_lc_del_tick_post(idObj);
				do_gl_show_Notify_Msg_Success($.i18n("nso_del_tick_post"));
			})
		$("#btn_star_close_two").off("click").on("click", function() {
				$("#btn_star_close_two").hide();
				$("#btn_star").show();
				do_lc_del_tick_post(idObj);
				do_gl_show_Notify_Msg_Success($.i18n("nso_del_tick_post"));
			})
		$("#btn_star_close_th").off("click").on("click", function() {
				$("#btn_star_close_th").hide();
				do_lc_del_tick_post(idObj);
				do_gl_show_Notify_Msg_Success($.i18n("nso_del_tick_post"));
			})
		
		$("#btn_del").off("click").on("click", function() {
			if(App.data.user.id==obj.uId01 || App.data.user.typ01==2 || App.data.user.typ01==1){
				App.MsgboxController.do_lc_show({
						title		: $.i18n("nso_del_post_popup"),
						content 	: $.i18n("nso_del_post_popup_content"),
						autoclose	: true,
						css			:{"max-width": "400px"},	
						buttons		: {
							OK: {
								lab			: $.i18n("common_btn_ok"),
								funct		: function () {do_lc_delete_post(idObj);},
								autoclose	: true,
								classBtn	: "btn-danger"
							},
							NO: {
								lab		:  $.i18n("common_btn_cancel"),
							}
						}
					});
			}
			else{
				do_gl_show_Notify_Msg_Error($.i18n("can_not_delete"));
			}
				
			})
		$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				path && window.open(path, "_blank");
			})
		}
		const do_show_fileUploader2 = function(obj) {
				if (obj.files) {
					files.files = obj.files;
				}
				let option = {
					fileinput: { param: { typ01: 1, typ02: 1, maxFiles: 1 } },//option here
					obj: files//file existing here
				}
				do_gl_init_fileDropzone($("#div_file_avatar"), option);

				let option2 = {
					fileinput: { param: { typ01: 2, typ02: 10 } },//option here
					obj: files//file existing here
				}

				do_gl_init_fileDropzone($("#div_file_others"), option2);
			}
		var do_lc_modify_post = obj => {
			let	data	 		= req_gl_data({
				dataZoneDom		: $("#div_modify_post"),
				oldObject 		: obj,
				//	removeDeleted	: true
			});
			obj.entId = obj.id
			if(data.hasError)	return false;
			do_lc_modify_nso_post(data, obj)
					
		}
		const do_lc_modify_nso_post = (data, obj) => {
				let ref = req_gl_Request_Content_Send_With_Params("ServiceNsoPost", "SVModArtical");

				let fSucces = [];
				fSucces.push(req_gl_funct(null, do_lc_after_mod_posts, []));

				let fError = req_gl_funct(App, do_gl_show_MsgAjax, [$.i18n("common_err_ajax")]);

				data.data.files = files.files;
				data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
			}
		const do_lc_after_mod_posts = sharedJson=> {
			if(can_gl_AjaxSuccess(sharedJson)) 
			{
				let data = sharedJson[App['const'].RES_DATA];
				do_lc_show_post	(data);
				data.id=data.v02;
				do_lc_get_posts	(data)
			}
			else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_modify_post"));
			}
			
		}
		
	//---------------------------------------------------------------------------------------------------------------
		const do_lc_delete_post 	= function (id){
			var ref 		= req_gl_Request_Content_Send("ServiceNsoPost", "SVDelArtical");	
			ref.id			= id;
			
			var lock 		= {};			
			//lock.objectType = pr_TYPE_BLOG; 	//integer
			lock.objectKey 	= id; 		//integer
			ref['lock'	]	= JSON.stringify(lock);
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_lc_res_delete	, [])); //refresh menu
		
			var fError 		= req_gl_funct(App, do_gl_show_MsgAjax, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);		
		}
		
		const do_lc_res_delete = (sharedJson) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n("prj_project_del_post"));
				$(".close").click();
				$(".btn-resize-post").click();
				
			}else{
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}
		const do_lc_tick_post	= function (id){
			var ref 		= req_gl_Request_Content_Send("ServiceNsoPost", "SVTick");	
			ref.id			= id;
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_lc_after_mod_posts	, [])); 
			var fError 		= req_gl_funct(App, do_gl_show_MsgAjax, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		const do_lc_del_tick_post	= function (id){
			var ref 		= req_gl_Request_Content_Send("ServiceNsoPost", "SVDelTick");	
			ref.id			= id;
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_lc_after_mod_posts	, [])); 
		
			var fError 		= req_gl_funct(App, do_gl_show_MsgAjax, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
	}

	return ChatRoomPost;
});
