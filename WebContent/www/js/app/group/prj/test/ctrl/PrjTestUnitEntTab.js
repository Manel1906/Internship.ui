define([
	'text!group/prj/test/tmpl/PrjTestUnit_Ent.html',
	'text!group/prj/test/tmpl/PrjTestUnit_Ent_Content.html',
	'text!group/prj/test/tmpl/PrjTestUnit_Ent_Tab_Comment.html',
	'text!group/prj/test/tmpl/PrjTestUnit_Ent_Tab_Docs.html',
	'text!group/prj/test/tmpl/PrjTestUnit_Ent_Tab_Member.html',

	'text!group/prj/test/tmpl/PrjTestUnit_EntNew.html',

	],
	function(	
			PrjTestUnit_Ent,
			PrjTestUnit_Ent_Content,
			PrjTestUnit_Ent_Tab_Comment,
			PrjTestUnit_Ent_Tab_Docs,
			PrjTestUnit_Ent_Tab_Member,

			PrjTestUnit_EntNew
	){

	const tmplName				= App.template.names;
	const tmplCtrl				= App.template.controller;
	const pr_ENTITY_TYPE		= 20000;
	const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
	const pr_SV_GET				= "SVGet"; 
	const pr_SV_GET_LST         = "SVLst"
	const pr_SV_GET_MEMBER		= "SVGetMember"; 
	const pr_SV_SAVE_MEMBER		= "SVSaveMember"; 
	const pr_SV_SAVE_CONTENT	= "SVSaveContent"; 
	const pr_SV_NEW				= "SVNew"; 
	const pr_SV_SAVE_FILES		= "SVFileSave"; 
	const pr_SV_GET_COMMENTS	= "SVGetComment";
	const pr_SV_SAVE_COMMENT	= "SVSaveComment"; 
	const pr_SV_LST_PRJ			= "SVPrjListByUser";
	
	const pr_ENTITY_TYPE_PRJ	= 250000;

	const pr_SV_REFRESH_CONTENT	= "SVContentRefresh";

	const pr_SV_DEL				= "SVDel";

	const pr_SERVICE_AUT_CLASS	= "ServiceAutUser";
	const pr_SV_USER_LST		= "SVLst";
	
	const pr_TYP00_PRJ_PROJECT		= 10;
	
	//------------------const object------------------------------------------------------

	const pr_TYPE02_PRJ				= 0;
	const pr_TYPE02_EPIC			= 1;
	const pr_TYPE02_TASK			= 2;

	const pr_STAT_PRJ_NEW 			= 100100;
	const pr_STAT_PRJ_TODO 			= 100200;
	const pr_STAT_PRJ_INPROGRESS 	= 100300;
	const pr_STAT_PRJ_DONE 			= 100400;
	const pr_STAT_PRJ_TEST 			= 100500;
	const pr_STAT_PRJ_REVIEW 		= 100600;
	const pr_STAT_PRJ_DEPLOY 		= 100700;
	const pr_STAT_PRJ_UNRESOLVED 	= 100800;
	const pr_STAT_PRJ_CLOSED 		= 100900;

	// const pr_ctr_Main 				= App.controller.PrjTestUnit.Main;

	tmplName.PRJ_TESTUNIT_ENT							= "PrjTestUnit_Ent";
	tmplName.PRJ_TESTUNIT_ENT_CONTENT					= "PrjTestUnit_Ent_Content";
	tmplName.PRJ_TESTUNIT_ENT_TAB_COMMENT				= "PrjTestUnit_Ent_Tab_Comment";
	tmplName.PRJ_TESTUNIT_ENT_TAB_DOCS					= "PrjTestUnit_Ent_Tab_Docs";
	tmplName.PRJ_TESTUNIT_ENT_TAB_MEMBER				= "PrjTestUnit_Ent_Tab_Member";
	tmplName.PRJ_TESTUNIT_ENT_CONTENT_PATH				= "PrjTestUnit_Ent_Content_Path";
	tmplName.PRJ_TESTUNIT_ENT_NEW						= "PrjTestUnit_EntNew";
	
	var do_lc_bind_event_resize = function(){
		$(".btn-resize").off("click").on("click", function(){
			let $this 		= $(this);
			let {divtoogle} = $this.data();
			let child 		= $this.find("i");
			let label 		= $this.find(".label-resize");
			child			.toggleClass("mdi-window-minimize mdi-window-maximize")
			$(divtoogle)	.toggle("hide");

			label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
		})
	}

	//------------------------------End Epic list-----------------------------------

	//------------------------------Start Member list-----------------------------------
	var PrjTestUnitEntTabMember 	= function (grpName, header, content, footer) {
		//------------------------------Start list member-----------------------------------
		const PRJ_MEMBER_LEVEL 		= {0: "prj_project_member_level_manager", 10: "prj_project_member_level_reporter", 20: "prj_project_member_level_developer", 30: "prj_project_member_level_tester", 40: "prj_project_member_level_worker", 50: "prj_project_member_level_watcher"};
		const PRJ_MEMBER_TYPE 		= {0: "prj_project_lev_bas"				, 1: "prj_project_lev_haute"};
		
		var pr_MEM_TEMP					= {};
		var members 					= {};
		const pr_member_lev_manager 	= 0;
		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;
		
		const pr_ENT_TYP_USER           = 1000;
		
		const pr_ctr_Ent				= App.controller.PrjTestUnit.Ent;
		const pr_ctr_Main 				= App.controller.PrjTestUnit.Main;

		var do_lc_load_view = function(){
			members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_TESTUNIT_ENT_TAB_MEMBER			, PrjTestUnit_Ent_Tab_Member);
		}

		this.do_lc_get_list_member = function(prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_MEMBER, {id: prj.id, code: prj.code01});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_list_member, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_show_list_member = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA];

				const is_Me 		= data.find(m => m.entId02 == App.data.user.id);
				const isSuperAdmin 	= App.controller.PrjTestUnit.Login && App.controller.PrjTestUnit.Login.can_lc_User_SuperAdmin();
				const isOwner		= App.data.user.id === prj.autUser01;
				
				let objData 	= data.reduce((currentObj, mem)=>{
					if(mem.entId02 == prj.autUser01)	mem.isOwner = true;
					
					if(!isSuperAdmin && !isOwner){
						if(is_Me && is_Me.typ <= mem.typ && is_Me.lev >= mem.lev)	mem.notModif = true;
					}
					
					currentObj[mem.entId02] = mem;
					return currentObj;
				}, {});

				do_lc_show_prj_member(objData, prj.id, prj.code01);
				pr_ctr_Ent.do_lc_reqRole_User();
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		var do_lc_bind_event_members_prj = function(members, idPrj, codePrj){
			pr_MEM_TEMP = $.extend(false, {}, members);

			$("#btn_add_member").off("click").on("click", function(){
				$(".action-item-member").removeClass("hide");
				$(this).addClass("hide");
			})

			$("#a_btn_save_member").off("click").on("click", function(){
				do_lc_save_member_prj(members, idPrj, codePrj);
			})

			$("#a_btn_cancel_member").off("click").on("click", function(){
				do_lc_show_prj_member(members, idPrj, codePrj);
			})

			$(".member-edit").off("click").on("click", function(){
				let $this 			= $(this);
				let {memid} 		= $this.data();
				let mem 			= pr_MEM_TEMP[memid];
				if(mem){
					let parentTR 	= $this.closest("tr");
					parentTR.find(".content-member").addClass("hide");
					parentTR.find(".edit-member").removeClass("hide");
					let divLev 		= parentTR.find(".level-edit");
					let divTyp 		= parentTR.find(".typ-edit");
					do_lc_bindEvent_tabMemberEdit(memid, divLev, divTyp);
					$(".action-mem").removeClass("hide");
				}
			})

			$(".member-delete").off("click").on("click", function(){
				let {memid} = $(this).data();
				let mem 	= pr_MEM_TEMP[memid];
				if(mem){
					delete pr_MEM_TEMP[memid];
					$(this).closest("tr").remove();
					$(".action-mem").removeClass("hide");
				}
			})

			let el = "#inp_name_member";
			let reqSelectMember = function(item){
				if(pr_MEM_TEMP[item.id])			return false;

				let lev 		= $("#sel_member_level").val();
				let typ 		= $("#sel_member_type").val();
				let mem 		= {"lev" : lev, "typ": typ, "ent02": item, "entId02": item.id, "entId01": idPrj, "entTyp01": pr_ENT_TYP_USER};
				let strlogin 	= item.login01.length > 4?item.login01.substr(0, 4) + "..." : item.login01;
				
				let textColor   = null;
				let textAvatar  = null
				if(!item.avatar){
					let first = item.login01.charAt(0);
					let last  = item.login01.charAt(item.login01.length - 1);
					let index = var_gl_alphabet.indexOf(first.toLowerCase());
					
					textColor = var_gl_colors[index];
					textAvatar= first + last;
				}

				pr_MEM_TEMP[item.id] = mem;
				let selOpt 		= `<tr>`;
				selOpt 			+= `<td><a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a></td>`;
				
				if(item.avatar) selOpt 			+= `<td style='width: 50px;'><img src='${item.avatar.urlPrev}' class='rounded-circle avatar-xs' alt=''/></td>`;
				else 			selOpt 			+= `<td style='width: 50px;'> <div class="rounded-circle avatar-xs text-white text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div></td>`;
				selOpt 			+= `<td><h5 class='font-size-14 m-0'><a href='' class='text-dark'>${strlogin}</a></h5></td>`;
				selOpt 			+= `<td>` + $.i18n(PRJ_MEMBER_LEVEL[+lev]) 	+`</td>`;
				selOpt 			+= `<td class='hide'>` + $.i18n(PRJ_MEMBER_TYPE[+typ])	+`</td>`;
				selOpt 			+= `</tr>`;

				$("#tabMember table tbody").append(selOpt);
				do_lc_bind_event_autocomplete(pr_MEM_TEMP);
				$(el).blur().val("");
			}

			let options = {
				dataService 	: [pr_SERVICE_AUT_CLASS, pr_SV_USER_LST], 
				dataRes 		: ["login01", "name01"],
				dataReq			: {nbLine: 5, typ01s: '2,3', stats: 1},
				selectCallback	: reqSelectMember, 
				arrSource		: do_lc_customLst_user_autocomplete
			}
			do_gl_set_input_autocomplete(el, options);
		}

		var do_lc_bind_event_autocomplete = function(pr_MEM_TEMP){
			$(".btn-remove-member").off("click").on("click", function(){
				let $this 		= $(this);
				let parentTR 	= $this.closest("tr");
				let {id} 		= $this.data();

				if(pr_MEM_TEMP[id])	delete pr_MEM_TEMP[id];
				parentTR.remove();
			})
		}
		
		var do_lc_save_member_prj = function(members, idPrj, codePrj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_MEMBER, {
				id: idPrj, 
				code: codePrj,
				members: JSON.stringify(Object.values(pr_MEM_TEMP))
			});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_member, [members, idPrj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_member = function(sharedJson, members, idPrj, codePrj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success 	($.i18n('common_success_update'));
				do_lc_show_prj_member(pr_MEM_TEMP, idPrj, codePrj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		var do_lc_bindEvent_tabMemberEdit = function(memid, divLev, divTyp){
			$(divLev).off("change").on("change", function(){
				pr_MEM_TEMP[memid].lev = $(this).val();
			})

			$(divTyp).off("change").on("change", function(){
				pr_MEM_TEMP[memid].typ = $(this).val();;
			})
		}

		var do_lc_customLst_user_autocomplete = function(item, selOpt = ""){
			if(!item.avatar){
				let first = item.login01.charAt(0);
				let last  = item.login01.charAt(item.login01.length - 1);
				let index = var_gl_alphabet.indexOf(first.toLowerCase());
				
				let textColor = var_gl_colors[index];
				let textAvatar= first + last;
				
				selOpt 		+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white text-uppercase text-center mr-2" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}</div>`;
			}else{
				selOpt 		+= `<div class="media align-items-center"><img src='${item.avatar.urlPrev}' class='rounded-circle avatar-xs mr-2'/> ${item.login01}</div>`;
			}
			return selOpt;
		}
		
		var do_lc_show_prj_member = function(members, idPrj, codePrj){
			do_lc_load_view();
			$("#div_prj_member")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTUNIT_ENT_TAB_MEMBER			, members));
			do_lc_bind_event_members_prj(members, idPrj, codePrj);
			do_lc_bind_event_resize();

			do_gl_apply_right($("#div_prj_member"));
		}
		//------------------------------End list member-----------------------------------
	}

	//------------------------------Start Doc list-----------------------------------
	var PrjTestUnitEntTabDoc 	= function (grpName, header, content, footer) {
		//------------------------------Start File list-----------------------------------
		let self			= this;
		const pr_ctr_Ent	= App.controller.PrjTestUnit.Ent;
		const pr_ctr_Main 				= App.controller.PrjTestUnit.Main;

		var do_lc_load_view = function(){
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_TESTUNIT_ENT_TAB_DOCS				, PrjTestUnit_Ent_Tab_Docs);
		}

		this.do_lc_show_prj_docs = function(prj){
			do_lc_load_view();

			$("#div_prj_docs")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTUNIT_ENT_TAB_DOCS, prj));
			do_lc_bind_event_docs_prj(prj);
			do_lc_bind_event_resize();
			
			pr_ctr_Ent.do_lc_reqRole_User();
		}

		var do_lc_bind_event_docs_prj = function(prj){
//			let	obj 		= {files:[]};
			if(!prj.files)	prj.files = [];
			let option		= {
					fileinput	: { 
						parallelUploads	: 10,
			            uploadMultiple	: true,
						param 			: {typ01: 1, typ02: 1, filenameKept: 1},
						addRemoveLinks 	: !pr_ctr_Ent.can_lc_role_user_worker()
					},//option here
					obj			: prj//file existing here
			}
			do_gl_init_fileDropzone($("#div_prj_docs"), option);

			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				path && window.open(path, "_blank");
			})

			$(".item-file-delete").off("click").on("click", function(){
				let id	= $(this).data("id");
				$(this).parents("tr").remove();
			})

			$("#btn_add_doc").off("click").on("click", function(){
				$(".action-item-doc").removeClass("hide");
				$("#div_prj_ent_file_upload").removeClass("hide");
				$(this).addClass("hide");
				$(".item-file-delete").removeClass("hide");
			})

			$("#a_btn_save_doc").off("click").on("click", function(){
				prj.files 		= prj.files ? [...prj.files].filter(Boolean) : [];
				let	data	= req_gl_data({
					dataZoneDom		: $("#div_prj_docs"),
					skipError		: true
				});

				if(data.hasError)	return false;

				let newprj 		= data.data;
				
				newprj.files 		=   prj.files;
				
				newprj = $.extend(false, prj, newprj);

				console.log(prj.files);

				do_lc_save_files_prj(newprj);
			})

			$("#a_btn_cancel_doc").off("click").on("click", function(){
				self.do_lc_show_prj_docs(prj);
			})
		}

		var do_lc_save_files_prj = function(prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_FILES, {obj: JSON.stringify(prj)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_files_prj, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_files_prj = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				prj.files = sharedJson[App['const'].RES_DATA].files;
				self.do_lc_show_prj_docs(prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		//------------------------------End File list-----------------------------------
	}
	//------------------------------End File list-----------------------------------

	//------------------------------Start Comment list-----------------------------------
	var PrjTestUnitEntTabComment 	= function (grpName, header, content, footer) {
		//------------------variable pagination post------------------------------------------------------
		var pr_POST_BEGIN 			= 0;
		const pr_POST_NUMBER 		= 10;
		const pr_POST_TYPE_CMT 		= 110;
		const pr_POST_NO_SUB 		= 1;
		const pr_POST_HAS_SUB 		= 2;
		const pr_POST_KEY_ENTER 	= 13;
		const self					= this;
		const pr_ctr_Main 				= App.controller.PrjTestUnit.Main;
		
		//------------------------------Start comment list-----------------------------------
		var do_lc_load_view = function(){
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_TESTUNIT_ENT_TAB_COMMENT			, PrjTestUnit_Ent_Tab_Comment);
		}

		var do_lc_show_prj_comment = function(dataCmts, prj){
			do_lc_load_view();
			$("#div_comment_list")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTUNIT_ENT_TAB_COMMENT, dataCmts));
			
//			$(".a-delete[data-userid= '" + App.data.user.id +"']").removeClass("d-none");
			
			App.SummerNoteController.do_lc_show("#div_prj_comments", {height : 100}, true);//text editor
			
			do_lc_bind_event_comments_prj(prj);
			do_lc_bind_event_resize();
			
			pr_ctr_Ent.do_lc_reqRole_User();
		}

		this.do_lc_get_list_comments = function(prj, reBuild = false){
			let cond 		= {
					id		: prj.id			, 
					code	: prj.code01		,
					begin	: pr_POST_BEGIN		, 
					number	: pr_POST_NUMBER	, 
					nbLevel	: pr_POST_HAS_SUB	,			
					forced	: true				, 
					reBuild,
			}

			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_COMMENTS, cond);	

			var callbackFunct = function(data) {		//data => sharedJson
				do_lc_show_comment_Dyn(data, prj);
			}

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

		var do_lc_show_comment_Dyn = function(sharedJson, prj){
			let data			= {};
			if (can_gl_AjaxSuccess(sharedJson)) {
				data		= sharedJson[App['const'].RES_DATA];
			}

			do_lc_show_prj_comment(data, prj);
		}

		var do_lc_bind_event_comments_prj = function(prj){
			$("#btn_send_comment").off("click").on("click", function(){
				let comment = $("#inp_comment").val();
				let iParent = $("#inp_parent_reply").val();
				if(!comment || !comment.length)	return false;
				do_lc_send_comment(prj, comment, iParent);
				
				$(this).prop('disabled', true);
			})

			$(".a-reply").off("click").on("click", function(){
				let{parent, user} = $(this).data();
				parent && $("#inp_parent_reply").val(parent);
				if(user)	$("#inp_comment").summernote('code', `@${user} `);
			})
			
			$(".a-delete").off("click").on("click", function(){
				let{id} = $(this).data();
				if(id)	do_lc_delete_comment(id, prj);
			})
			
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
			        
			        do_lc_bindEvent_change_comment(prj,id);
			    }
			});
			
			var do_lc_bindEvent_change_comment = function(prj,id) {

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
					if(comment.trim() !== "") do_lc_send_comment(prj,comment,iParent,id)
				
				 });
			};


			$("#inp_comment").off("keypress").on("keypress", function(e){
				if(e.keyCode == pr_POST_KEY_ENTER){
					$("#btn_send_comment").click();
					return;
				}
				let comment = $(this).val();
				(!comment || !comment.length) && $("#inp_parent_reply").val("");
			})
			
			$("#div_list_item img:not(.avatar-xs)").off("click").on("click", function(){
				let src = $(this).attr("src");
				App.MsgboxController.do_lc_show({
					content 	: `<img src="${src}" style="width: 100%;">`,
					autoclose	: false,
					buttons 	: {
						CALCEL : {
							lab 		: $.i18n("common_btn_cancel"),
							classBtn	: "btn-primary",
						}
					}
				});
			})
		};

		var do_lc_send_comment = function(prj, comment, iParent, cmtId){
			let cond 		= {id: prj.id, code: prj.code01, comment, iParent, cmtId};
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_COMMENT, cond);

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSend_cmts, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_afterSend_cmts = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				data && self.do_lc_get_list_comments(prj, true);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		
		var do_lc_delete_comment = function(idCmt, prj){
			let cond 		= {id: prj.id, code:prj.code01, cmtId: idCmt};
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoPost" , "SVNsoPostDel12H", cond);

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDelete_cmts, [idCmt, prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_afterDelete_cmts = function(sharedJson, idCmt, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				self.do_lc_get_list_comments(prj, true);
				$(".post-lement-content[data-id='"+ idCmt +"']").remove();
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
	}
	//------------------------------End comment list-----------------------------------

	//------------------------------Start Content prj-----------------------------------
	var PrjTestUnitEntTabContent 	= function (grpName, header, content, footer) {
		const self						= this;
		const pr_TYPE01_INDUSTRY		= 1;
		const pr_TYPE01_INFORMATIQUE	= 2;
		const pr_TYPE01_BUISINESS		= 3;
		const pr_TYPE01_TRAVEL			= 4;
		const pr_project				= App.controller.PrjTestUnit;

		const pr_ctr_Ent				= App.controller.PrjTestUnit.Ent;
		
		var members                     = {};
		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;
		const pr_member_lev_worker 		= 40;

		const pr_CHECK_NOT_FINISH 		= 1;
		const pr_CHECK_FINISH 			= 2;
		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		
		const pr_NB_RECORD_HISTORY		= 10;

		const pr_ctr_Main 				= App.controller.PrjTestUnit.Main;

		var pr_DEFAULT_VAL			    = 0;
		var pr_div_rating		        = ['#rating_01'];
		//----------------------Get Path -------------------------------------------------
		const do_lc_get_path_prj = (prj) => {
			if([pr_TYPE02_PRJ].includes(prj.typ02))	return;
			
			do_lc_show_path			(prj);
			do_lc_show_backToParent (prj);
		}

		const do_lc_show_path = function (prj){
			if (!prj.path) return;
			$("#div_prj_path").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_CONTENT_PATH, prj.path));
		}
		
		const do_lc_show_backToParent = function (prj){
			if(!prj.prjPar) return;
			var   cont 	= $("#btn_back").data("url");
			const url 	= cont?cont.replace("#code", prj.prjPar.code01).replace("#id", prj.prjPar.id): "";
			$("#btn_back").data("url", url)
		}
		
		//------------------------------Start content prj-----------------------------------
		var do_lc_load_view = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTUNIT_ENT_CONTENT				, PrjTestUnit_Ent_Content);
		}
		
		this.do_lc_show_prj_content = function(prj, mode){
			do_lc_load_view();
			do_lc_show_content(prj, mode);
			do_lc_get_path_prj(prj);
		}

		var do_lc_show_content = function(prj, mode){		
			$("#div_prj_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTUNIT_ENT_CONTENT, prj));

			do_lc_bind_event_content_prj(prj, mode);
			do_lc_bind_event_resize();

			do_lc_init_element(prj);
			
			pr_ctr_Ent.do_lc_reqRole_User();
			
			if(prj.stat == pr_STAT_PRJ_DONE) {
				let $parent = $(".val05").parent();
				$parent.find(".info-edit")	.off("click");
				$parent.find(".val05")	.removeClass("content-edit");
			}

			do_gl_apply_right($("#div_prj_content"));
		}

		const do_lc_init_element = function(){
			App.SummerNoteController.do_lc_show("#content-edit-description");
			App.SummerNoteController.do_lc_show("#content-edit-resultTest");
			$(".tmpicker").timepicker({//timepicker
				showMeridian: false,
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			})
		}

		var do_lc_bind_event_content_prj = function(prj, mode){
			if(!prj.files)	prj.files = [];
			let option		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1}, acceptedFiles: "image/*" },//option here
					obj			: prj//file existing here
			}
			do_gl_init_fileDropzone($("#div_prj_content"), option);
			
			$(".info-edit").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")		.addClass	("hide");
				$parent.find(".info-content-worker").addClass	("hide");
				$parent.find(".content-edit")		.removeClass("hide");

				if($parent.find(".content-edit").length > 0){
					let $parents = $parent.closest(".card");
					$parents.find("#a_btn_save	, #a_btn_cancel"	).removeClass("hide");
					$parents.find("#a_btn_save02, #a_btn_cancel02"	).removeClass("hide");

				}
				
			});

			$("#resultTest, #info-content-resultTest").on("click", function(){
				let $parent = $(this).parent();
				$parent.find("#info-content-resultTest"	).addClass	 ("hide");
				$parent.find("#content-edit-resultTest"	).removeClass("hide");

				if($parent.find("#content-edit-resultTest").length > 0){
					let $parents = $parent.closest(".card");
					$parents.find("#a_btn_save	, #a_btn_cancel"	)	.removeClass("hide");
					$parents.find("#a_btn_save02, #a_btn_cancel02"	)	.removeClass("hide");

				}

				pr_project.Ent.do_lc_reqRole_User();
			});
			
			$("#info-content-description").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(this						).addClass	 ("hide");
				$parent.find("#content-edit-description"	).removeClass("hide");

				if($parent.find("#content-edit-description").length > 0){
					let $parents = $parent.closest(".card");
					$parents.find("#a_btn_save	, #a_btn_cancel"	)	.removeClass("hide");
					$parents.find("#a_btn_save02, #a_btn_cancel02"	)	.removeClass("hide");

				}

				pr_project.Ent.do_lc_reqRole_User();
			});

			$("#a_btn_save, #a_btn_save02").off("click").on("click", function(){
				let	data	 				= req_gl_data({
					dataZoneDom		: $("#div_prj_content")
				});

				if(data.hasError)	return false;

				let newPrj 			= data.data;
				newPrj.grp			= newPrj.parent;
				
				if(prj && (prj.userRole == pr_member_lev_reporter || prj.userRole == pr_member_lev_worker)){
					newPrj 			= Object.assign({}, prj);
					newPrj.stat 	= data.data.stat;
					newPrj.val05 	= data.data.val05;
				}else{
					newPrj 			= $.extend(false, prj, newPrj);
				}
				
				do_lc_save_prj_content(newPrj, prj)
			})

			$("#a_btn_cancel, #a_btn_cancel02").off("click").on("click", function(){
				self.do_lc_show_prj_content(prj, null);
			})

			$("#btn_refresh_content").off("click").on("click", function() {
				do_lc_refresh_content(prj, prj.id);
			})

			$("#btn_delete").off("click").on("click", function() {
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_test_unit_del"),
					content 	: $.i18n("prj_test_unit_del_content"),
					css			: {"max-width": "400px"},
					autoclose	: false,
					buttons		: {
						OK: {
							lab			: $.i18n("common_btn_ok"),
							funct		: do_lc_delete_content,
							param		: [prj, prj.id],
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});
			})

			$("#btn_duplicate_content").off("click").on("click", function() {
				do_lc_duplicate_content(prj);
			})

			$("#btn_add_avatar").off("click").on("click", function(){
				$("#div_prj_ent_file_avatar").removeClass("hide");
				$(this).addClass("hide");
				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
			})
					
			if(prj.autUser01 == App.data.user.id){
				$("#div_star_eval a").on("click", function() {
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
				})
			}else{
				$("#div_star_eval a").css("pointer-events","none");
			}
			
			
			$("#div_prj_content_01 img").off("click").on("click", function(){
				let src = $(this).attr("src");
				App.MsgboxController.do_lc_show({
					content 	: `<img src="${src}" style="width: 100%;">`,
					autoclose	: false,
					buttons 	: {
						CALCEL : {
							lab 		: $.i18n("common_btn_cancel"),
							classBtn	: "btn-primary",
						}
					}
				});
			})
			
		};
		
		var do_lc_save_prj_content = function(newPrj, prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_CONTENT, {obj: JSON.stringify(newPrj)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_prjContent, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_prjContent = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				prj 		= $.extend(true, prj, data);

				self.do_lc_show_prj_content(prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}

		var do_lc_delete_content = function(prj, prjId){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL, {id: prjId, code : prj.code01});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_del_content, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_after_del_content = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_del'));
				
				$(".btn-refrest-list").trigger("click");
				$("#div_task_content_main").html("");
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_del'));
				do_gl_show_Notify_Msg_Error ($.i18n('sprint_err_msg_del'));
			}
		}

		var do_lc_refresh_content = function(prj, prjId){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_REFRESH_CONTENT, {id: prj.id, code: prj.code01});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_refresh_content, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_after_refresh_content = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				prj = Object.assign(prj, data);
				do_lc_show_content(prj);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		var do_lc_duplicate_content = function(prj){
			let m
			var newObj 			= $.extend(true,{},prj);

			//---duplicate 	record in document and detail		
			newObj = do_duplicate_record(newObj);
			
			self.do_lc_show_prj_content(newObj, var_lc_MODE_NEW)
			pr_project.EntDoc		.do_lc_show_prj_docs(newObj, 1);
			
		}
		
		function do_duplicate_record(obj){
			obj.id			= null;
			obj.code        = null;
			obj.name		= obj.name + " - COPY"  ;
			
			if(obj.files){
				for(let i=0; i < obj.files.length; i++){
					obj.files[i].id 		= null;
				}
			}
			
			obj.dtBegin =  req_gl_DateStr_From_DateObj (new Date());
			obj.dtEnd 	=  req_gl_DateStr_From_DateObj (new Date());
			obj.dtMod	=  null;
			obj.dtNew	=  null;
			
			return obj;
		}	

		//------------------------------End content prj-----------------------------------
	}

	return { PrjTestUnitEntTabMember,  PrjTestUnitEntTabDoc, PrjTestUnitEntTabComment, PrjTestUnitEntTabContent};
});