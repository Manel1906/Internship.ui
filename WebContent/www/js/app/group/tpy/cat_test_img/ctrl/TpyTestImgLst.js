define([
	'text!group/tpy/cat_test_img/tmpl/TpyTestImg_List.html',
	'text!group/tpy/cat_test_img/tmpl/TpyTestImg_List_Content.html',
	'text!group/tpy/cat_test_img/tmpl/TpyTestImg_Ent_Content.html',
	'text!group/tpy/cat_test_img/tmpl/TpyTestImg_New.html',
	'text!group/tpy/cat_test_img/tmpl/TpyDropzone_File.html',
	'text!group/tpy/cat_test_img/tmpl/TpyTestImg_Ent_Content_Row.html',
	'text!group/tpy/cat_test_img/tmpl/TpyTestImg_Ent_Content_Row_add.html'
	
	],
	function(TpyTestImg_List, 
			TpyTestImg_List_Content,
			TpyTestImg_Ent_Content,
			TpyTestImg_New,
			TpyDropzone_File,
			TpyTestImg_Ent_Content_Row,
			TpyTestImg_Ent_Content_Row_add
			) {
	const TpyTestImgList = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Chat		 		= null;

		var RIGHT_U_S	        	= 1000005;
		var RIGHT_ADM	        	= 100;
		var RIGHT_A_S	        	= 105;
		
		var RIGHT_NEW	        	= 50000102;
		//-----------------------------------------------------------------------------------
		
		const pr_SERVICE_CLASS_DYN	= "ServiceTpyCategory";
		const pr_SV_LIST_DYN		= "SVLstPageTestImg"; 
		
		const pr_SERVICE_CLASS		= "ServiceTpyCategory";
		const pr_SV_NEW				= "SVNewTestImg";
		const pr_SV_MOD             = "SVMod";
		const pr_SV_DEL             = "SVDel";
		
		const pr_SV_NEW_SUB			= "SVNewDiseaseSub";
		
		
		var   self                  = this;
		this.pr_member_role			= null;
		
		var pr_SEARCH_KEY			= "";
		
		const pr_TYP01_ADMIN		= 2;
		
		const pr_TYP_MSG_PRIVATE 	= 200;
		const pr_TYP_MSG_PUBLIC 	= 201;
		
		const pr_TYP_TEST_BLOOD 	= 3000;
		const pr_TYP_DISEASE_SUB	= 400;
		
		const pr_KEY_ENTER			= 13;
		const pr_NUMBER_RECORD		= 10;
		
		const pr_member_lev_manager = 0;
		const pr_member_lev_reporter= 10;
		const pr_member_lev_worker 	= 40;
		
		const pr_STAT_DISEASE_ACTIVE    = 1;
		
		const pr_STAT_TEST_1        = 1;
		const pr_STAT_TEST_2     	= 2;
		const pr_STAT_TEST_3 		= 3;
		const pr_STAT_TEST_4 		= 4;
		const pr_STAT_TEST_10 		= 10;
		
		var pr_DISEASE_TEMP			= {};
		
		var pr_CURRENT_GROUP_ID     = null;
		
		var pr_MANAGER              = false;
		var pr_typ = [
			pr_STAT_TEST_1,
			pr_STAT_TEST_2,
			pr_STAT_TEST_3,
			pr_STAT_TEST_4,
			pr_STAT_TEST_10
		];
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_List 			= App.controller.TpyTestImg.List
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
			
			tmplName.TPY_CAT_DISEASE_LIST					= "TpyTestImg_List";
			tmplName.TPY_CAT_DISEASE_LIST_CONTENT			= "TpyTestImg_List_Content";
			tmplName.TPY_CAT_DISEASE_ENT_CONTENT			= "TpyTestImg_Ent_Content";
			tmplName.TPY_CAT_DISEASE_NEW  					= "TpyTestImg_New";
			tmplName.TPY_DROPZONE_FILE						= "TpyDropzone_File";
			tmplName.TPY_CAT_DISEASE_ENT_CONTENT_ROW		= "TpyTestImg_Ent_Content_Row";
			tmplName.TPY_CAT_DISEASE_ENT_CONTENT_ROW_ADD	= "TpyTestImg_Ent_Content_Row_add";
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show	= function(){
			do_lc_load_view();
			do_lc_get_list();
			do_lc_bind_event();
		}
		
		//---------load view-----------------------------------------------------------------------------
		const do_lc_load_view = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.TPY_CAT_DISEASE_LIST					, TpyTestImg_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.TPY_CAT_DISEASE_LIST_CONTENT			, TpyTestImg_List_Content); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.TPY_CAT_DISEASE_ENT_CONTENT			, TpyTestImg_Ent_Content); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.TPY_CAT_DISEASE_NEW					, TpyTestImg_New); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.TPY_DROPZONE_FILE						, TpyDropzone_File);
			tmplCtrl.do_lc_put_tmpl(tmplName.TPY_CAT_DISEASE_ENT_CONTENT_ROW		, TpyTestImg_Ent_Content_Row);
			tmplCtrl.do_lc_put_tmpl(tmplName.TPY_CAT_DISEASE_ENT_CONTENT_ROW_ADD	, TpyTestImg_Ent_Content_Row_add);
			
			$("#div_usergroup_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_DISEASE_LIST, {}));
		}
		
		//----------------------------------------------------------------------------------------------

		const do_lc_get_list = function(hardLoad = false){
			do_get_list_ByAjax(hardLoad);
		}
		
		const do_lc_get_list_member = (group) => {
			App.controller.TpyTestImg.Member.do_lc_show(group);
		};
		
		//----------------------------------------------------------------------------------------------
		
		const do_lc_bind_event = function(obj){
			$('.user-typ-select').off('click').on('click',function(){
				const dataCode = $(this).data('code');
				do_lc_get_checked(dataCode)
				do_get_list_ByAjax()
			})
			$("#inp_search").off("keydown").on("keydown", function(e){
				pr_SEARCH_KEY	= $(this).val();
				do_gl_execute_debounce(do_lc_get_list);
			});
			
			$(".btn-resize").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			});
			
			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				path && window.open(path, "_blank");
			})
			
			$(".item-file-delete").off("click").on("click", function(){
				let fileId			= $(this).data("id");	
				var lineToRemove 	= $(this).parents("tr");
				
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_delete"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: do_lc_del_files_prj,
							param	: [prj, fileId, lineToRemove],
							classBtn: "btn-success"
						},
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
							classBtn: "btn-danger"
						}
					}
				});
			})
			
			$("#btn_add_doc").off("click").on("click", function(){
				if(!obj)	obj = [];
				obj.files = [];
				let option		= {
						fileinput	: { parallelUploads	: 10, uploadMultiple	: true},//option here
						obj			: obj//show empty box
				}
				
				App.MsgboxController.do_lc_show({
					title	: $.i18n("tpy_cat_disease_new_file_title"),
					width	: "500px",
					autoclose	: true,
					content		: tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_DROPZONE_FILE, {}),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: do_lc_dropzone_file,
							param	: [obj],
							classBtn: "btn-primary"
						},
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: []
						}
					}
				});
				do_gl_init_fileDropzone($("#div_dropzone_send"), option);
			})
		}
		
		var do_lc_dropzone_file = function(obj){
			obj.files 		= obj.files ? [...obj.files].filter(Boolean) : [];
			if(!obj.files)	obj.files = [];
			let	data	= req_gl_data({
				dataZoneDom		: $("#div_dropzone_send"),
				skipError		: true
			});

//			if(data.hasError)	return false;

			let newobj 		= data.data;
			
			newobj.files 	= obj.files;

			do_lc_save_files_prj(newobj);
		}	
		
		var do_lc_save_files_prj = function(newobj){
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVImport", {obj: {files: newobj.files}});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_files_prj, [newobj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_files_prj = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_lc_get_list();
				do_gl_show_Notify_Msg_Success($.i18n('prj_user_group_msg_success') );
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		var do_lc_del_files_prj = function(prj, fileId, lineToRemove){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL_FILES, {'id': prj.id, 'code': prj.code01, 'fileId':fileId});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDel_files_prj, [prj, fileId, lineToRemove]));

			let fError 		= req_gl_funct(App, pr_ctr_Main.do_show_Msg, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterDel_files_prj = function(sharedJson, prj, fileId, lineToRemove){
			if(can_gl_AjaxSuccess(sharedJson)) {
				lineToRemove.remove();
				if (prj.files) 
					prj.files = prj.files.filter(f => f.id != fileId);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//----------------------------------------------------------------------------------------------
		
		const do_get_list_ByAjax = function(hardLoad){	
			let divList = $("#div_group_list");
			let divPan  = $("#div_group_pagination");
			
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_DYN, pr_SV_LIST_DYN, {typ01s: pr_TYP_TEST_BLOOD, searchKey: pr_SEARCH_KEY, stats : pr_typ, hardLoad, wChild: true});
			
			const callbackFunct 	= data => do_lc_show_list_ByAjax_Dyn(data, divList);
			
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
		
		//----------------------------------------------------------------------------------------------
		
		const do_lc_show_list_ByAjax_Dyn = function(sharedJson, divList){
			const isSuccess = can_gl_AjaxSuccess(sharedJson);
			if(isSuccess) {
				const list = sharedJson[App['const'].RES_DATA] || {};
				let lstObj = [];
				if(list.lst){
					lstObj = list.lst.map(item => {
				        return {
				            ...item,
				            inf: JSON.parse(item.inf) 
				        };
				    });
				    
				}
				const data = { lst: {} };
				let lst = lstObj;
			
				
				if (!lst.length) {
					$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_DISEASE_LIST_CONTENT, {}));
					do_lc_bind_event__list_header();
					return;
				}

				for (const userOrGrp of lst) {
					try {
						userOrGrp.val01 = JSON.parse(userOrGrp.val01);
						userOrGrp.inf01 = JSON.parse(userOrGrp.inf01);
						userOrGrp.inf02 = JSON.parse(userOrGrp.inf02);
					} catch (error) {}
					data.lst[userOrGrp.id] = userOrGrp;
				}

				App.data["listGroupWork"] = data.lst;
				$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_DISEASE_LIST_CONTENT, { "data": data.lst }));
				do_lc_bind_event_list();
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_get"));
			}
		}
		//----------------------------------------------------------------------------------------------
		 const do_lc_get_checked = (dataCode) => {
  			  pr_typ = []
  		      if (dataCode == 0) {
				  pr_typ = [1,2,3,4,10];
  		      } else {
				pr_typ.push(dataCode);
  		      }
  		}
		const do_lc_bind_event_list = function(){
			do_lc_bind_event__list_header()
			
			$(".chat-item").off("click").on("click", function(){
				const $this 		= $(this);
				const {id: idGroup} 	= $this.data();
				if(idGroup){
					$(".chat-item")	.removeClass("active");
					$this			.addClass("active").removeClass("has-new-msg-item");
					$("#div_chat").css("display", "block");
					
					do_lc_get_info_group(App.data["listGroupWork"][idGroup]);
					do_lc_get_list_member(App.data["listGroupWork"][idGroup]);
				}
			})
		}

		const do_lc_bind_event__list_header = () => {
		//	if(App.data.user.typ01 == pr_TYP01_ADMIN || App.data.user.rights.includes(RIGHT_NEW)){
			//	$("#btn_btn_new_group").removeClass('hide');
			//	$("#btn_add_doc").removeClass('hide');
		//	}
			$("#btn_btn_new_test").off("click").on("click", function(){
				var listUserRight = App.data.user.rights;
				var isRight = listUserRight.includes(RIGHT_A_S) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_U_S)
				if(!isRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_off_msg_cant_create"));
					return;
				}

				$("#div_usergroup_member").html("");
				$("#div_usergroup_ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_DISEASE_NEW, {}));

				App.SummerNoteController.do_lc_show("#div_create_describe");//text editor 
				App.SummerNoteController.do_lc_show("#div_create_reason");//text editor
				App.SummerNoteController.do_lc_show("#div_create_symptom");//text editor
				
				
				do_lc_bind_event_for_group(obj = {files: []});
			})

			$("#btn_refresh_group").off("click").on("click", function(){
				do_lc_get_list(true);
				do_lc_bind_event_list();
			})

			$(".btn-resize-list").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
		}
		
		//----------------------------------------------------------------------------------------------
		
		const do_lc_bind_event_for_group = function(obj){
			$("#btn_create_group").off("click").on("click", function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_creat"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: self.do_lc_save,
							param	: [obj],
							classBtn: "btn-primary"
						}
					}
				});
			})
			
			$("#btn_canel_group").off("click").on("click",function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_cancel_create"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: self.do_lc_cancel,
							param	: [],
							classBtn: "btn-danger"
						}
					}
				});
			})
			
			let option	= {
					obj : obj,
					fileinput		: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here for avatar
			}			
			do_gl_init_fileDropzone($("#frm_dropzone_send"), option);
							
			let option2	= {
					obj : obj,
					fileinput		: {param : {typ01: 2, typ02: 10} },//option here for files
			}			
			do_gl_init_fileDropzone($("#frm_dropzone_send_file"), option2);
		}
		
		this.do_lc_save = function(obj){
			const data = req_gl_data({
				dataZoneDom: $("#frm_new_group")
			});
			console.log(data.data)
			if(data.hasError)	return false;

			if (obj.files){
				data.data.files = obj.files;
			}
			do_lc_new_test_img(data.data);
		}
		
		//-----------------new group-------------------------------------------------------------------------
		
		const do_lc_new_test_img = function(group){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW, {obj: group});

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterCreat_Group, [group]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_afterCreat_Group = function(sharedJson, group){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_lc_show_info_group(data);
					do_lc_get_list_member(data);
					do_lc_get_list(true); // hard Reload list group
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//-----------------get group-------------------------------------------------------------------------
		
		const do_lc_get_info_group = (group) => {
			
			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceTpyCategory", "SVGet", {id: group.id, wChild: true});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_reponse_get_group, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_reponse_get_group = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_lc_show_info_group(data);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		this.do_lc_build_role_user  = (data) => {
			do_lc_build_role_user(data);
		}
		
		const do_lc_build_role_user = (data) => {
			if(App.data["lstGrpWorkMember"]){
				const user = App.data["lstGrpWorkMember"][App.data.user.id];
				if(user) self.pr_member_role 	= user.typ;
				else self.pr_member_role 	    = pr_member_lev_worker;
			}
			
			self.do_lc_reqRole_User();
		}
		
		const do_lc_show_info_group = (data) => {
			
			if(data.inf && typeof data.inf == "string"){
				data.inf = JSON.parse(data.inf);
			}
			
			$("#div_usergroup_ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_DISEASE_ENT_CONTENT, data));
			
			pr_DISEASE_TEMP.child = data.child;
			
			$("#tbody_disease").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_DISEASE_ENT_CONTENT_ROW, data));
			
			$(".info-edit").removeClass('hide');
			$(".inf-disease").addClass('hide');
			do_bind_event_show_group(data);
		}
		
		//-----------------get group-------------------------------------------------------------------------

		const do_bind_event_show_group = function(data){
			if(!data.files)	data.files = [];
			if(data.avatar) data.files.push(data.avatar);
			let option		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj			: data//file existing here
			}
			do_gl_init_fileDropzone($("#frm_dropzone_send"), option);

			
			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				path && window.open(path, "_blank");
			})
			
			$(".info-edit").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-edit")			.addClass("hide");
				$parent.find(".inf-disease")	.removeClass("hide");

				$("#a_btn_sav, #a_btn_canc")	.removeClass("hide");

			})
			
//			$(".inf-disease").on("click", function(){
//				let $parent = $(this).parent();
//				$parent.find(".info-content")			.addClass("hide");
//				$parent.find(".content-edit")	.removeClass("hide");
//
//				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
//
//			})
			
			$("#btn_modify").off("click").on("click", function(){
				$("#btn_modify").addClass("hide");
				$("#a_btn_sav").removeClass("hide");
				$("#a_btn_canc").removeClass("hide");
				$('#addRowBtn').removeClass('hide');
				$('#removeRowBtn').removeClass('hide');
				$(".inf-disease").addClass('hide');
				$(".info-edit").addClass('hide');
				do_lc_get_disease_sub(data);
			})
			
			$('#addRowBtn').on('click', function() {
				do_lc_bind_event_new_row_table(data);
		    });
			
			$("#a_btn_save").off("click").on("click", function(){
				data.files 	= data.files ? [...data.files].filter(Boolean) : [];
				
				let	obj	 				= req_gl_data({
					dataZoneDom		: $("#div_usergroup_ent"),
					oldObject 		: data,
				});

				if(obj.hasError)	return false;

				let newGroup 			= obj.data;

				newGroup =  Object.assign(data, newGroup);
				
				newGroup.val01 = { img: newGroup.files.length > 0 ? decodeURIComponent(newGroup.files[0].path01) : null}; 
				
				do_lc_update_chat_group(newGroup);
			})
			
			$(".info-edit").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")			.addClass("hide");
				$parent.find(".info-content-worker")	.addClass("hide");
				$parent.find(".content-edit")	.removeClass("hide");

				if($parent.find(".content-edit").length > 0){
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
				}
			})
			
			$("#a_btn_cancel").off("click").on("click", function(){
				do_lc_show_info_group(data);
			})
			
			$("#btn_add_avatar").off("click").on("click", function(){
				$("#frm_dropzone_send").removeClass("hide");
				$(this).addClass("hide");
				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
			})
			
			$("#btn_edit").off("click").on("click", function(){
				var group = [];
				group = $(this).data();
				do_lc_edit_group(group);
				
			})
			
			$("#btn_del_group").off("click").on("click", function(){
				let {id} = $(this).data();
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_user_group_btn_delete_group"),
					content 	: $.i18n("prj_project_del_user_group_popup_content"),
					autoclose	: false,
					css			: {
						"max-width":"450px"
					},
					buttons		: {
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						},
						OK: {
							lab			: $.i18n("common_btn_ok"),
							funct		: do_lc_del_group,
							param		: [id],
							classBtn	: "btn-primary"
						}
					}
				});
			})
			
			$(".btn-resize-content").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
		}
		
		const do_lc_bind_event_new_row_table = function(data) {
		    $("#a_btn_sav, #a_btn_canc")	.removeClass("hide");
	        var newRow = tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_DISEASE_ENT_CONTENT_ROW_ADD, {});
			
	        $('#tbody_disease').append(newRow);
	        let addedRow = $('#tbody_disease tr').last();
    		addedRow[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//		    do_lc_bind_event_row_budget(data);
//	        do_init_autocomplete_member(prj);
	        $('#removeRowBtn button').on('click', function() {
				$(this).closest('tr').remove();
			});
	       
		};
		
		//-----------------get disease sub-------------------------------------------------------------------------
		const do_lc_get_disease_sub = function(data){
			const ref 				= req_gl_Request_Content_Send_With_Params("ServiceTpyCategory", "SVGet", {id :data.id, wChild: true});
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_get_disease_sub, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_after_get_disease_sub = function(sharedJson, dataArray){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				
//				$('.inf-disease').addClass('hide');
				if (dataArray != null) {
					pr_DISEASE_TEMP = dataArray;
					$("#tbody_disease").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_DISEASE_ENT_CONTENT_ROW, pr_DISEASE_TEMP));
					
					$("#a_btn_sav").addClass("hide");
					$("#a_btn_canc").addClass("hide");
					$("#removeRowBtn").addClass("hide");
					$("#addRowBtn").addClass("hide");
					$(".info-edit").removeClass("hide");
					$(".inf-disease").addClass("hide");$("#btn_modify").removeClass("hide");
				} else {
					$("#tbody_disease").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_DISEASE_ENT_CONTENT_ROW, data));
					$(".info-edit").addClass('hide');
				}
				
				
				
				do_lc_bind_event_new_disease_sub(data);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		const do_lc_bind_event_new_disease_sub = function(data){
			$("#a_btn_sav").off("click").on("click", function(){
				
				let parentID = data.id;
				
				let myObject = {};
				
//				let	obj	 				= req_gl_data({
//					dataZoneDom		: $("#div_usergroup_ent"),
//					oldObject 		: myObject,
//				});

//				if(obj.hasError)	return false;

				const rows = $('#tbody_disease').find('tr');
				const dataArray = [];
				
				
				for (let i = 0; i < rows.length; i++) {
				    const row = rows[i];
				    const inputs = $(row).find('input.inf-disease, select.inf-disease');
				    const dataObject = {};
				
				    inputs.each(function() {
				        const input = $(this);
				        const key = input.data('name');
				        let value = input.val();
				       	value = value.replace(/,/g, '');
				        dataObject[key] = value;
				    });
				    
					dataObject['stat'] = pr_STAT_DISEASE_ACTIVE;
					dataObject['typ01'] = pr_TYP_DISEASE_SUB;
					dataObject['parId'] = parentID;
				    dataArray.push(dataObject); 
				}
								
//				myObject['parId'] = parentID;
				myObject['lst'] = dataArray;
				
				do_lc_save_disease_sub(myObject, dataArray);
			})
			
			$('#a_btn_canc').on('click', function() {
				$("#btn_modify").removeClass("hide");
				$("#a_btn_sav").addClass("hide");
				$("#a_btn_canc").addClass("hide");
				$("#removeRowBtn").addClass("hide");
				$("#addRowBtn").addClass("hide");
				$("#tbody_disease").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_DISEASE_ENT_CONTENT_ROW, pr_DISEASE_TEMP));
				$(".info-edit").removeClass("hide");
				$(".inf-disease").addClass("hide");
//				do_lc_get_disease_sub(data);
			});
			
			$('#removeRowBtn button').on('click', function() {
				$(this).closest('tr').remove();
			});
		}
		
		const do_lc_save_disease_sub = function(myObject, dataArray){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW_SUB, {obj: myObject});
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_get_disease_sub, {dataArray}));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		
		//-----------------edit group-------------------------------------------------------------------------
		
		const do_lc_edit_group = (group) => {
						
			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceTpyCategory", "SVGet", {id: group.id});	
	
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_reponse_edit_group, [group.id]));
	
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_reponse_edit_group = function(sharedJson, id){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					
					if(data.inf && typeof data.inf == "string"){
						data.inf = JSON.parse(data.inf);
					}
					
					var listUserRight = App.data.user.rights;
					var isRight = listUserRight.includes(RIGHT_A_S) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_U_S)
					if(!isRight){
						do_gl_show_Notify_Msg_Error($.i18n("job_off_msg_cant_create"));
						return;
					}

					$("#div_usergroup_member").html("");
					$("#div_usergroup_ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_DISEASE_NEW, data));

					App.SummerNoteController.do_lc_show("#div_create_describe");//text editor 
					App.SummerNoteController.do_lc_show("#div_create_reason");//text editor
					App.SummerNoteController.do_lc_show("#div_create_symptom");//text editor
					App.SummerNoteController.do_lc_show("#div_create_transmission");//text editor
					App.SummerNoteController.do_lc_show("#div_create_subjects");//text editor 
					App.SummerNoteController.do_lc_show("#div_create_prevent");//text editor
					App.SummerNoteController.do_lc_show("#div_create_diagnose");//text editor
					App.SummerNoteController.do_lc_show("#div_create_treatment");//text editor
					
					do_lc_group_showMod_FileUploader(data);
					do_lc_bind_event_mod_group(data, id);
					
					console.log(data)
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		const do_lc_group_showMod_FileUploader = function (data) {
			if (!data.files) {
				data.files = [];
			}	
			
			let option	= {
					obj : data,
					fileinput		: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here for avatar
			}			
			do_gl_init_fileDropzone($("#frm_dropzone_send"), option);
							
			let option2	= {
					obj : data,
					fileinput		: {param : {typ01: 2, typ02: 10} },//option here for files
			}			
			do_gl_init_fileDropzone($("#frm_dropzone_send_file"), option2);
		}
		
		const do_lc_bind_event_mod_group = function(obj){
			$("#btn_create_group").off("click").on("click", function(){
				
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_save"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: self.do_lc_mod,
							param	: [obj],
							classBtn: "btn-primary"
						}
					}
				});
			})
			
			$("#btn_canel_group").off("click").on("click",function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_save_cancel"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: self.do_lc_cancel,
							param	: [],
							classBtn: "btn-primary"
						}
					}
				});
			})
		}
		
		this.do_lc_mod = function(obj){
			const data = req_gl_data({
				dataZoneDom: $("#frm_new_group")
			});

			if(data.hasError)	return false;

			if (obj.files){
				data.data.files = obj.files;
			}
			data.data.id = obj.id;
			do_lc_update_chat_group(data.data);
		}
		
		this.do_lc_cancel = function(){
			pr_ctr_Main.do_lc_show();
		}
		
		//-----------------update group-------------------------------------------------------------------------

		const do_lc_update_chat_group = function(ent) {
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: JSON.stringify(ent)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_update_group_success, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		const do_lc_update_group_success = function(sharedJson, group){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_gl_show_Notify_Msg_Success 	($.i18n("common_success_update") );
					do_lc_show_info_group(data);
					do_lc_get_list(true);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//------------------------------------------------------------------------------------------------
		
		const do_lc_del_group = function(groupId){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL, {id : groupId});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDel_group, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_afterDel_group = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				$("#div_usergroup_ent, #div_usergroup_member").html("");
				do_lc_get_list(true);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		
		//------------------------------------------------------------------------------------------------
		
		this.can_lc_role_user_manager = function() {
			return this.pr_member_role && this.pr_member_role == pr_member_lev_manager;
		}
		
		this.can_lc_role_user_reporter = function() {
			return this.pr_member_role && this.pr_member_role == pr_member_lev_reporter;
		}
		
		this.can_lc_role_user_worker = function() {
			return this.pr_member_role && this.pr_member_role == pr_member_lev_worker;
		}

		this.do_lc_reqRole_User = function(){
			let isAdmin 		= App.controller.common.Login &&
				(
					App.controller.common.Login.can_lc_User_SuperAdmin()||
					App.controller.common.Login.can_lc_User_Admin()		||
					App.controller.common.Login.can_lc_User_Agent()
				);
			if (isAdmin) {
				return;
			}			
			
			//-----------------------------------------------------------------------------------
			//---check role from this entity
			let uRole = self.pr_member_role;
			if(uRole === null || uRole === undefined){
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), null);
				$(".isManager")			.remove();
				$(".info-edit")		    .off("click").removeClass("info-content");
				return;
			}
			
			if(uRole == pr_member_lev_manager){
			}else if(uRole == pr_member_lev_reporter){
			}else if(uRole == pr_member_lev_worker){
				$(".isManager")			.remove();
				$(".info-edit")		    .off("click").removeClass("info-content");
			}else{
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), null);
				$(".isManager")			.remove();
				$(".info-edit")		    .off("click").removeClass("info-content");
			}
		}

	}
	return TpyTestImgList;
});