define([
	'text!group/user_note/tmpl/PrjStickyNote_Ent.html',
	'text!group/user_note/tmpl/PrjStickyNote_List_Content_Tab.html',
	'text!group/user_note/tmpl/PrjStickyNote_List_Content_Detail.html',
	
	'text!group/user_note/tmpl/PrjStickyNote_DrawZone.html',
	],
	function(	
			PrjStickyNote_Ent,
			PrjStickyNote_List_Content_Tab,
			PrjStickyNote_List_Content_Detail,
			
			PrjStickyNote_DrawZone
			
	){

	var PrjStickyNoteEnt 	= function (grpName, header, content, footer) {
		var pr_divHeader 				= header  ? header : null;
		var pr_divContent 				= content ? content: null;
		var pr_divFooter 				= footer  ? footer : null;

		//------------------------------------------------------------------------------------
		const tmplName					= App.template.names;
		const tmplCtrl					= App.template.controller;

		const pr_SERVICE_CLASS		= "ServiceTpyFavorite"; 
		
		const pr_SV_LIST_DYN		= "SVLstByUserIdAndType"; 
		const pr_SV_MOD				= "SVMod";
		const pr_SV_SAVE_CONTENT	= "SVNsoMod";

		var self 						= this;
		this.pr_member_role				= null;

		const pr_NUMBER_RECORD			= 10;
		const pr_STICKY_NOTE_100 		= 100;
		const pr_STICKY_NOTE_200 		= 200;

		var pr_doFocus					= false;

		const paramTyp 				= {
				[pr_STICKY_NOTE_100]		: {typ: pr_STICKY_NOTE_100	},
				[pr_STICKY_NOTE_200]		: {typ: pr_STICKY_NOTE_200	},
		}
		
		var pr_DIV_CONTENT              = "#div_main_content";
		var pr_SEARCHKEY				= "";
		var pr_GROUP					= null;
		var pr_SEARCHKEY_USER			= null;

		const pr_ENT_TYPE_STICKY_NOTE 	= 300000;


		//------------------controllers---------------
		//------------------controllers------------------------------------------------------
		const pr_project				= App.controller.PrjStickyNote;
		var pr_ctr_Main 				= null;
		var pr_ctr_Sidebar 				= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 				= pr_project.Main;
			pr_ctr_Sidebar 				= pr_project.Sidebar;

			tmplName.PRJ_STICKYNOTE_ENT						= "PrjStickyNote_Ent";
			tmplName.PRJ_STICKYNOTE_LIST_CONTENT_TAB		= "PrjStickyNote_List_Content_Tab";
			tmplName.PRJ_STICKYNOTE_LIST_CONTENT_DETAIL		= "PrjStickyNote_List_Content_Detail";
			tmplName.PRJ_STICKYNOTE_DRAWZONE				= "PrjStickyNote_DrawZone";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_STICKYNOTE_ENT, 					PrjStickyNote_Ent);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_STICKYNOTE_LIST_CONTENT_TAB, 		PrjStickyNote_List_Content_Tab);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_STICKYNOTE_LIST_CONTENT_DETAIL, 	PrjStickyNote_List_Content_Detail);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_STICKYNOTE_DRAWZONE, 				PrjStickyNote_DrawZone);
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(forced, doFocus){               
			try{
				pr_doFocus = doFocus;
				do_lc_req_list_note_by_typ(forced);
			
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "PrjStickyNoteEnt", "do_lc_show", e.toString()) ;
			}
		};
		
		const do_lc_req_list_note_by_typ = (forced) => {
			$("#div_note_content_main")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_STICKYNOTE_LIST_CONTENT_TAB, {}));
			
			do_gl_initSwiper();

			let div_kanboard = [];
			for(let typ in paramTyp){
				do_get_list_ByAjax(paramTyp[typ], forced);
				div_kanboard.push(document.getElementById(`div_prj_list_sticky_note_${typ}`));
			}

			const drake = dragula(div_kanboard);

			drake.on('drop', (el, target, source, sibling) => {
				let typ 		= $(target).data("typ");
				let idEle 		= $(el).data("id");
				
				let obj			= {id: idEle, typ: typ};
				
				do_lc_save_change_typ(obj);
			})
		}

		const do_get_list_ByAjax = (params, forced) => {	
			let {typ} 				= params;
			let dataSend = {
				searchKey: pr_SEARCHKEY,
				searchUser:
					pr_SEARCHKEY_USER && pr_SEARCHKEY_USER.length
						? pr_SEARCHKEY_USER
						: null,
				typ,
				entTyp: pr_ENT_TYPE_STICKY_NOTE,
				forced,
			};

			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST_DYN, dataSend);

			let divMain 			= `#div_prj_list_sticky_note_${typ}`;
			let divPagination 		= `#div_prj_pagination_sticky_note_${typ}`;

			let callbackFunct 		= (data) => {
				do_lc_show_list_callback(data, divMain);
				if ($("body, html").scrollTop() !=0)	$("body, html").animate({scrollTop :0}, 500);
			}

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

		const do_lc_show_list_callback = (sharedJson, div) => {
			let data 			= {};
			if (can_gl_AjaxSuccess(sharedJson)) {
				let tasks		= sharedJson[App['const'].RES_DATA];
				// if(tasks.lst) data = do_lc_remove_mem_same(tasks);
				if(tasks.lst) data = tasks;
				$(div)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_STICKYNOTE_LIST_CONTENT_DETAIL		, data));
				
				do_binding_event_task();
			}		
			
		}

		const do_binding_event_task = () => {
			if (pr_doFocus) $("#div-sticky-note_100").addClass("border-fc");
			$("#div-sticky-note_100").off("click").on("click", function(){
				$("#div-sticky-note_100").addClass("border-fc");
				$("#div-sticky-note_200").removeClass("border-fc");
			});

			$("#div-sticky-note_200").off("click").on("click", function(){
				$("#div-sticky-note_200").addClass("border-fc");
				$("#div-sticky-note_100").removeClass("border-fc");
			});

			$(".horizontal-menu-btn-1").off("click").on("click", function(e){
				$("#d-sticky-note_100").toggleClass('col-md-8 col-sm-8').toggleClass('col-md-10 col-sm-10');
				$("#d-sticky-note_200").toggleClass('col-md-4 col-sm-4').toggleClass('col-md-2 col-sm-2');
			})

			$(".horizontal-menu-btn-2").off("click").on("click", function(e){
				$("#d-sticky-note_200").toggleClass('col-md-10 col-sm-10').toggleClass('col-md-4 col-sm-4');
				$("#d-sticky-note_100").toggleClass('col-md-2 col-sm-2').toggleClass('col-md-8 col-sm-8');
			})
			
			$(".btn-resize").off("click").on("click", function(){
				let $this 		= $(this);
				let child		= $this.find("i");
				let {divtoggle} = $this.data();

				$(divtoggle)	.toggle("hide");
				child			.toggleClass("mdi-window-minimize mdi-window-maximize")
			})	


			$(".btn-close-list").off("click").on("click", function(){
				let $this 		= $(this);
				let {id} 		= $this.data();
				if(id){
					let params = {id, typ: null};
					do_lc_save_change_typ(params);
				}
				$(`#div_prj_stick_note_det_${id}`).remove();
			})

			$(".info-edit").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")	.addClass("hide");
				$parent.find(".content-edit")	.removeClass("hide");

				let $this 		= $(this);
				let {id} 		= $this.data();
				App.SummerNoteController.do_lc_show(`.info-content-description-${id}`);

//				$(`.drawPad-${id}`).drawpad();

				if($parent.find(".content-edit").length > 0){
					let $parents = $parent.closest(".card");
					$parents.find(".a_btn_save02, .a_btn_cancel02")	.removeClass("hide");
				}
			})

			$(".a_btn_save02").off("click").on("click", function(){
				let $this 		= $(this);
				let {id} 		= $this.data();

				let	data	 	= req_gl_data({
					dataZoneDom		: $(`#div_prj_stick_note_det_${id}`)
				});

				if(data.hasError)	return false;

				let newPrj 			= data.data;
		
				do_lc_save_sticky_note_content(newPrj, null)
			})

			$(".a_btn_cancel02").off("click").on("click", function(){
				self.do_lc_show();
			})
			
			$(".a_btn_drawing").off("click").on("click", function(){
				let $this 		= $(this);
				let {id} 		= $this.data();
			})
			$(".btn_new_draw").off("click").on("click", function(){
				let div = $(this).data("div");
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_sticky_note_create"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_STICKYNOTE_DRAWZONE, {dest: div}),
					autoclose	: false,
					buttons		: {
						NO: {
							lab	:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent: function() {
						do_lc_init_draw_pad();
					}
				});	
			})

			$(".descr-note img").css({
				width: "100%",
				objectFit: "cover"
			});
		}
		
		const do_lc_init_draw_pad = function() {
			$("#drawPad").drawpad();

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
				 let div = $("#drawNoteAdd").data("dest");
				 App.SummerNoteController.do_lc_insert_image_base64(div, img);
				 App.MsgboxController.do_lc_close();
			});
		}

	
		const do_lc_save_change_typ = params => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD);	
			ref["obj"]		= JSON.stringify(params);
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_change_typ, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_change_typ = (sharedJson) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
//				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				// self.do_lc_show(true);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		var do_lc_save_sticky_note_content = function(obj, prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD);	
			ref["obj"]		= JSON.stringify(obj);

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_sticky_note, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_sticky_note = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				self.do_lc_show(true);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}

		
	};

	return PrjStickyNoteEnt;
});