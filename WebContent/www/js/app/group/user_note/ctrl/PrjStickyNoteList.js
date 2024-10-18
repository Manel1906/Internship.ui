define([
	'text!group/user_note/tmpl/PrjStickyNote_Main.html', 
	'text!group/user_note/tmpl/PrjStickyNote_List_Tab.html', 
	'text!group/user_note/tmpl/PrjStickyNote_List_Content.html',

	'text!group/user_note/tmpl/PrjStickyNote_EntNew.html'
	], function(
			PrjStickyNote_Main, 
			PrjStickyNote_List_Tab,
			PrjStickyNote_List_Content,

			PrjStickyNote_EntNew
	){

	const PrjStickyNoteList = function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS_STICKY_NOTE	= "ServiceTpyFavorite"; //to change by your need
		
		
		const pr_SV_LIST_DYN				= "SVLstByUserIdAndType"; 
		const pr_SV_SAVE_MOVE				= "SVMod";
		const pr_SV_NEW_STICKY_NOTE			= "SVNsoNew"; 
		const pr_SV_DEL_STICKY_NOTE			= "SVDel"; 

		//-----------------------------------------------------------------------------------
		const pr_NUMBER_RECORD			= 20;

		const pr_ENT_TYPE_STICKY_NOTE 	= 300000;
		const pr_STICKY_NOTE_100 		= 100;
		const pr_STICKY_NOTE_200 		= 200;

		var self 						= this;
		const initialValues = {
				lstPrj : []
		}

		var pr_ctr_Main 				= null;

		var pr_SEARCHKEY				= "";
		var pr_GROUP					= null;
		var pr_SEARCHKEY_USER			= null;
		
		var pr_DIV_CONTENT              = "#div_task_content_main";
		//--------------------APIs--------------------------------------//
		this.do_lc_init	= function(){
			pr_ctr_Main 					=	 	App.controller.PrjStickyNote.Main;
			
			pr_ctr_PrjStickyNote_Main       =       App.controller.PrjStickyNote.Main;
			pr_ctr_PrjStickyNote_List       =       App.controller.PrjStickyNote.List;
			pr_ctr_Ent                	 	=       App.controller.PrjStickyNote.Ent;

			tmplName.PRJ_STICKYNOTE_MAIN			= "PrjStickyNote_Main";
			tmplName.PRJ_STICKYNOTE_LIST_TAB		= "PrjStickyNote_List_Tab";
			tmplName.PRJ_STICKYNOTE_LIST_CONTENT	= "PrjStickyNote_List_Content";

			tmplName.PRJ_STICKYNOTE_ENT_NEW			= "PrjStickyNote_EntNew";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_STICKYNOTE_LIST_TAB			, PrjStickyNote_List_Tab);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_STICKYNOTE_LIST_CONTENT		, PrjStickyNote_List_Content);

			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_STICKYNOTE_ENT_NEW			, PrjStickyNote_EntNew);
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(forced){               
			try{
				do_lc_load_view();
				do_get_list_ByAjax(forced);

				pr_ctr_Ent.do_lc_show(forced);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "PrjStickyNoteList", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_load_view = () => {	
			$("#div_task_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_STICKYNOTE_LIST_TAB, {}));
			do_gl_apply_right($("#div_task_content"));
		}
		
		const do_binding_event_task = () => {
			$(".note-item-name").off("click").on("click", function(event){
				let $this 	= $(this);
				let {id} 	= $this.data();
				if(id){
					let obj = {id, typ: pr_STICKY_NOTE_100};
					do_lc_save_change_typ(obj);
				}
			});

			$(".btn-resize-list").off("click").on("click", function(){
				let $this 		= $(this);
				let child		= $this.find("i");
				let {divtoggle} = $this.data();

				$(divtoggle)	.toggle("hide");
				child			.toggleClass("mdi-window-minimize mdi-window-maximize")
			})	


			$(".btn-refresh").off("click").on("click", function(){
				self.do_lc_show(true);
			})
			
			$("#inp_search").off("input").on("input", function(e){
				pr_SEARCHKEY	= e.target.value;
				do_gl_execute_debounce(do_get_list_ByAjax);
			})
			
			$(".btn_new_note").off("click").on("click", function(){
				var obj = {files: []};
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_sticky_note_create"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_STICKYNOTE_ENT_NEW, {}),
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: do_lc_save_new_task,
							param	: [null, obj],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent: function() {
						App.SummerNoteController.do_lc_show("#div_create_prj", {dialogsInBody: true});
//						do_gl_init_repeater();
						do_lc_init_draw_pad();
					}
				});	
			})
			
			$(".remove-note").off("click").on("click", function(){
				let $this 					= $(this);
				let {id} 					= $this.data();
				if(id){
					let params = {id};

					App.MsgboxController.do_lc_show({
						title		: $.i18n("prj_project_sticky_remove_title"),
						content 	: $.i18n("prj_project_sticky_remove_content"),
						autoclose	: false,
						buttons		: {
							OK: {
								lab		: $.i18n("common_btn_ok"),
								funct	: do_lc_del_note,
								param	: [params],
								autoclose	: true,
								classBtn	: "btn-primary"
							},
							NO: {
								lab		:  $.i18n("common_btn_cancel"),
							}
						},
						width: 600
					});	
				}
			})
		}

		const do_lc_init_draw_pad = function() {
			$("#drawPad").drawpad();

			$("#drawNoteNew").off("click").on("click", () => {
				$("#drawPad"		).toggleClass("hide");
				$("#drawNoteAdd"	).toggleClass("hide");
				$("#drawNoteClear"	).toggleClass("hide");
			});

			$("#drawNoteClear").off("click").on("click", () => {
				$("#drawPad").html("");
				$("#drawPad").removeClass("drawPad");
				$("#drawPad").drawpad_clear();
			});
			
			$("#drawNoteAdd").off("click").on("click", () => {
				var canvas = document.getElementById('draw-pad');
				let img = canvas.toDataURL({
					format: 'jpeg',
					quality: 0.5
				 });
				 App.SummerNoteController.do_lc_insert_image_base64("#div_create_prj", img);
			});
		}

		const do_lc_save_new_task = function(prj, obj){
			$("#btn_msgbox_OK").attr("disabled", "disabled");

			let	data	 		= req_gl_data({
				dataZoneDom		: $("#div_create_prj")
			});

			let $projectdesc = $("#projectdesc");
			if ($projectdesc.summernote('isEmpty')){
				$projectdesc.parent().append("<div class='errMsg'>" + $.i18n("validator_err_required") + "</div>")
			}

			if(data.hasError){
				$("#btn_msgbox_OK").removeAttr("disabled", "disabled");
				return false;
			}

			let objNew 		= data.data;

			do_lc_create_task(objNew, prj);
		}

		const do_lc_create_task = function(obj, prj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS_STICKY_NOTE, pr_SV_NEW_STICKY_NOTE);			
			ref["obj"]		= JSON.stringify({...obj, entTyp: pr_ENT_TYPE_STICKY_NOTE, entId: 0});

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_create_task, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_create_task = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_gl_show_Notify_Msg_Success 	($.i18n('common_ok_msg_save'));
				do_get_list_ByAjax(true);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
			App.MsgboxController.do_lc_close();
		}

		const do_get_list_ByAjax = (forced) => {	
			let dataSend = {
				isAll: true,
				searchKey: pr_SEARCHKEY,
				searchUser:
					pr_SEARCHKEY_USER && pr_SEARCHKEY_USER.length
						? pr_SEARCHKEY_USER
						: null,
				forced,
				entTyp: pr_ENT_TYPE_STICKY_NOTE,
			};

			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_STICKY_NOTE, pr_SV_LIST_DYN, dataSend);

			let divMain 			= "#div_prj_list_stat";
			let divPagination 		= "#div_prj_pagination_stat";

			let callbackFunct 		= data => do_lc_show_list_ByAjax_Dyn(data, divMain);

			let opt = {
					divMain			: divMain,
					divPagination	: divPagination,
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: pr_NUMBER_RECORD,
					pageRange		: 1,
					callback		: callbackFunct
			};

			do_gl_init_pagination_opt(opt);
		}

		const do_lc_show_list_ByAjax_Dyn = (sharedJson, div) => {
			let data 			= {};
			if (can_gl_AjaxSuccess(sharedJson)) {
				let tasks		= sharedJson[App['const'].RES_DATA];
				if(tasks.lst)	data = tasks;
			}

			$(div)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_STICKYNOTE_LIST_CONTENT		, data));
			if (data.lst) $("#project_name").html(data.lst[0].title);
			do_binding_event_task();
		}

		const do_lc_save_change_typ = params => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_STICKY_NOTE, pr_SV_SAVE_MOVE);	
			ref["obj"]		= JSON.stringify(params);
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_change_typ, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_change_typ = (sharedJson) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
//				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				pr_ctr_Ent.do_lc_show(true);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		const do_lc_del_note = params => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_STICKY_NOTE, pr_SV_DEL_STICKY_NOTE, params);	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDel_sticky_note, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterDel_sticky_note = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				do_get_list_ByAjax(true);
				pr_ctr_Ent.do_lc_show(true);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}


	};

	return PrjStickyNoteList;
});