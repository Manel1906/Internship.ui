define(['jquery'], function($) {

	const ChatRoomDocs 	= function (grpName, header, content, footer) {
		var pr_divHeader              = header;
		var pr_divContent             = content;
		var pr_divFooter              = footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName
		const tmplName				= App.template.names[pr_grpName];
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------

		const pr_SERVICE_CLASS		= "ServiceTpyDocument"; //to change by your need
		
		const pr_SV_GET_FILE		= "SVListPage";
		
		//------------------variable pagination post------------------------------------------------------
		const pr_NUMBER_RECORD 		= 8;
		
		const pr_TYP_MSG_PRIVATE 	= 200;
		const pr_TYP_MSG_PUBLIC 	= 201;
		
		const pr_TYP_CHAT_USER		= 1;
		const pr_TYP_CHAT_GROUP		= 2;
		const pr_TYP_CHAT_CONTACT	= 3;
		
		var   pr_isLoadMore         = false;
		
		const pr_KEY_ENTER 			= 13;
		const pr_ENT_TYP_MSG 		= 9000;
		
		const pr_member_lev_manager 			= 0;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_User 			= null;
		var pr_ctr_Member			= null;
		var pr_ctr_ChatWebRTC		= null;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.ChatRoom.Main;
			pr_ctr_Person 			= App.controller.ChatRoom.Group
			pr_ctr_Chat 			= App.controller.ChatRoom.Chat
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(obj, showDetail){      //typChat user or group         
			try{
				do_lc_load_view(obj, showDetail);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chat", "ChatRoomDocs", "do_lc_show", e.toString()) ;
			}
		};
		
		const do_lc_load_view = function(obj, showDetail){
			$("#div_files"		).html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_DOC_MAIN	, {}));
			$("#div_docs_list"	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_DOC_DETAIL, {"files" : {}}));
			
			$(".btn-resize-docs").off("click").on("click", function(){
				let $this 		= $(this);
				let child		= $this.find("i");
				let {divtoggle} = $this.data();

				$(divtoggle)	.toggle("hide");
				child			.toggleClass("mdi-window-maximize mdi-window-minimize")
				
				$(".btn-vertital-docs").toggle("hide");
				if (child.hasClass("mdi-window-minimize")) do_lc_get_files_by_ajax(obj);
			})	
			
			if (showDetail) {
				$(".btn-resize-docs").find("i")			.removeClass("mdi-window-maximize");
				$(".btn-resize-docs").find("i")			.addClass	("mdi-window-minimize");
				
				let {divtoggle} = $(".btn-resize-docs").data();
				$(divtoggle)	.toggle("hide");
				
				do_lc_get_files_by_ajax(obj);
			}
		}
		
		function do_lc_getExtension_from_name(filename) {
			var parts = filename.split('.');
		  	return parts[parts.length - 1];
		}
		
		
		function do_lc_check_image(filename) {
			  var ext = do_lc_getExtension_from_name(filename);
			  switch (ext.toLowerCase()) {
			    case 'jpg':
			    case 'jpeg':
			    case 'gif':
			    case 'bmp':
			    case 'png':
				case 'webp':
			      //etc
			      return true;
			  }
			  return false;
		}
		
		function req_lc_fileType(filename) {
			  var ext = do_lc_getExtension_from_name(filename);
			  switch (ext.toLowerCase()) {
			    case 'jpg':
			    case 'jpeg':
			    case 'gif':
			    case 'bmp':
			    case 'png':
				case 'webp': return 'img';
				case  'doc':
				case  'docx': return 'doc';				
				case  'xls': 
				case  'xlsx': return 'xls';
				case  'pptx': 
				case  'ppt':  return 'ppt';
				case  'pdf':  return 'pdf';
			  }
			  return 'file';
		}
		
		
		const do_lc_get_files_by_ajax = function(obj, loadAjaxBG){
			let divList = "#div_docs_list";
			let divPan  = "#div_docs_pagination";
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_FILE, {entId : obj.id, entTyp: pr_ENT_TYP_MSG});
			const callbackFunct 	= data => do_lc_show_list_ByAjax_Dyn(data, divList, obj);
			const opt 				= {
					divMain			: divList,
					divPagination	: divPan,
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: pr_NUMBER_RECORD,
					pageRange		: 1,
					callback		: callbackFunct
			};
			
			do_gl_init_pagination_opt(opt);
		}
		

		const do_lc_show_list_ByAjax_Dyn = function(sharedJson, divList, obj){
			if (can_gl_AjaxSuccess(sharedJson)  && sharedJson[App['const'].RES_DATA].lst) {
				const data		= sharedJson[App['const'].RES_DATA];

				data.lst.forEach((e) => {
					e.fileType = req_lc_fileType(e.fName);
					if (do_lc_check_image(e.fName)){
						e.isImage = true;		
					} else {
						e.isImage = false;
					}
				});

				$(divList)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_DOC_DETAIL	, {"files" : data.lst}));

				if(data.lst.length < data.total) $("#div_docs_pagination").show();
				else $("#div_docs_pagination").hide();

				do_lc_refresh_files(obj);
				do_lc_bind_event(obj);

				
			}else{
				$(divList)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_DOC_DETAIL	, {"files" : null}));
			}

		}

		const do_lc_bind_event = function(obj){
			$(".img_group_chat").off("click").on("click", function() {
				let {path01} = $(this).data();
				App.MsgboxController.do_lc_show({
					content 	: `<img src="${path01}" class="img_group_chat_popup"/>`,
					autoclose	: true,
					buttons		: "none",
				});	
			})
		}
		
		const do_lc_refresh_files = (obj) => {
			$("#btn_refresh_doc").off("click").on("click", function(e, loadAjaxBG) {
				do_lc_get_files_by_ajax(obj, loadAjaxBG);
			})
		}
		
	}

	return ChatRoomDocs;
});
