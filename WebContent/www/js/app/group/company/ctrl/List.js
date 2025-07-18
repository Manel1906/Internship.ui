define(['jquery'], function($) {

	var List 	= function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		
		const tmplName				= App.template.names[pr_grpName];
		const tmplCtrl				= App.template.controller;

		var self 					= this;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServiceAutUser"; //to change by your need
		const pr_SV_LIST_SEARCH		= "SVLstSearch"; 
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		//-----------------------------------------------------------------------------------
		const pr_NUMBER_RECORD		= 9;
		
		const pr_TYP_GRID			= 1;
		const pr_TYP_LIST			= 2;
		var pr_TYP_SHOW				= 1;
		
		var pr_searchKey			= "";
		
		const TYP_01_MORAL			= 1000001;
		const TYP_01_NATURAL		= 1000002;
		
		const TYP_02_AGENT			= 1010001;
		const TYP_02_CLIENT			= 1010002;
		const TYP_02_SUPPLIER		= 1010003;
		const TYP_02_PRODUCER		= 1010004;	
		const TYP_02_DOCTOR			= 1010005;
		const TYP_02_TPARTY			= 1010006;
		const TYP_02_PROSPECT		= 1010007;
		const TYP_02_CLIENT_PUBLIC	= 1010008;

		const TYP_02_COMPANY		= 1010010;
		const TYP_02_BRANCH			= 1010011;
		const TYP_02_DEPARTMENT		= 1010012;
		
		var pr_List_Type01			= TYP_01_MORAL;
	
		const pr_STAT_ACTIVE        = 1;
		const pr_STAT_INACTIVE      = 2;
		const pr_STAT_ACTIVE_HIDDEN = 3;
		const pr_STAT_DISABLE 		= 10;
		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		
		const RIGHT_U_G				= 1000001;
		const RIGHT_U_N             = 1000002;
		const RIGHT_ADM	        	= 100;
		const RIGHT_A_G				= 101;
		const RIGHT_A_N	        	= 102;
		
//		const TYP_USER_02 			= 2;
//		const TYP_USER_20 			= 20;
//		const TYP_USER_30 			= 30;
		const TYP_USER_200 			= 200;
//		
//		const paramStats 			= {
////			[TYP_USER_02] : {typ: TYP_USER_02				, isShow : true},
////			[TYP_USER_20] : {typ: TYP_USER_20				, isShow : true},
////			[TYP_USER_30] : {typ: TYP_USER_30				, isShow : true},
//			[TYP_USER_200] : {typ: TYP_USER_200				, isShow : true},
//		}
		var pr_typ = [
			pr_STAT_ACTIVE,
			pr_STAT_INACTIVE,
			pr_STAT_ACTIVE_HIDDEN,
			pr_STAT_DISABLE
		];
		
		var pr_DIV_CONTENT          = "#div_user_ent";
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_dashboard		= App.controller.PrjDashboard.Ent
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(div, type01){               
			try{
				if (type01) pr_List_Type01 = type01;
				
//				$(div).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST, paramStats));
				$(div).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST, {}));
				
				do_get_list_ByAjax();
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "List", "do_lc_show", e.toString()) ;
			}
		};

		var do_binding_event = function(div, type01, data){
			$('.user-typ-select').off('click').on('click',function(){
				const dataCode = $(this).data('code');
				do_lc_get_checked(dataCode)
				do_get_list_ByAjax()
			})
			
			$(".user-item-name").off("click").on("click", function(){
				let listUserRight = App.data.user.rights;
				if(!listUserRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				
				var isRight = listUserRight.includes(RIGHT_U_G) || listUserRight.includes(RIGHT_ADM)|| listUserRight.includes(RIGHT_A_G);
				if(!isRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				
				let {id, login} =  $(this).data();
				
	//			$("#inp_search_client").prop('readonly', true);
				
				pr_ctr_Ent.do_lc_show(id, var_lc_MODE_SEL, pr_DIV_CONTENT);
				
				$(".task-item").css("background-color", "#fff")
				$(".task-item[data-id='" + id + "']").css("background-color", "#f0ffff")
			})
			
			$("#btn_btn_new_company").off("click").on("click", function(){
				let listUserRight = App.data.user.rights;
				console.log("client.ctrl.List-> droits user is : "+ listUserRight);
				
				if(!listUserRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				
				var isRight = listUserRight.includes(RIGHT_U_N) || listUserRight.includes(RIGHT_ADM)|| listUserRight.includes(RIGHT_A_N);
				if(!isRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				pr_ctr_Ent.do_lc_show({}, var_lc_MODE_NEW, pr_DIV_CONTENT);
						console.log("var_lc_MODE_NEW : "+ var_lc_MODE_NEW);
								console.log("pr_DIV_CONTENT : "+ pr_DIV_CONTENT);
			})
			
			$("#btn_refresh_entity").off("click").on("click", function(){
				do_get_list_ByAjax(true);
			})
			
			$(".btn-resize").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
			
			$(".btn-view-dashboard").off("click").on("click", function(){
				let {id} =  $(this).data();
				id && pr_ctr_dashboard.do_lc_show(id, pr_DIV_CONTENT);
				
				$(".task-item").css("background-color", "#fff")
				$(".task-item[data-id='" + id + "']").css("background-color", "#f0ffff")
			})
			
			const $inputField 	= $("#inp_search_client");
		    const $clearIcon 	= $("#clear_icon");
		    $inputField.on("input", function(e) {
		        if ($inputField.val().trim() !== "") {
		            $clearIcon.removeClass("hide"); 
		        } else {
		            $clearIcon.addClass("hide");
		        }
		        pr_searchKey	= $inputField.val();
				do_gl_execute_debounce(do_get_list_ByAjax);
		    });
		    $clearIcon.on("click", function() {
		        $inputField.val(""); 
		        $clearIcon.addClass("hide");
		        $inputField.focus(); 
		        pr_searchKey	= $inputField.val();
				do_gl_execute_debounce(do_get_list_ByAjax);
		    });
			
			$("#btn_search_responsive").off("click").on("click", function(e){
				e.preventDefault();
				
				let searchNormal 	= $(".inp-search").hasClass("d-none");
				pr_searchKey 		= searchNormal? $(".inp-search").val() : $(".inp-search-responsive").val();
				
				do_get_list_ByAjax();
			})
			
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
				if(!data)	data = [];
				data.files = [];
				let option		= {
						fileinput	: { parallelUploads	: 10, uploadMultiple	: true},//option here
						obj			: data//show empty box
				}
				
				App.MsgboxController.do_lc_show({
					title	: $.i18n("prj_client_list_new_file_title"),
					width	: "500px",
					autoclose	: true,
					content		: tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_DROPZONE_FILE, {}),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: do_lc_dropzone_file,
							param	: [data],
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
		
		const reqStr_from_to = (m, n) => {
			var list = [m];
			
			for (var i = m + 1; i <= n; i++) {
			  list.push(i);
			}
			
			return list.toString();
		  }
		  

		  const do_lc_get_checked = (dataCode) => {
  			  pr_typ = []
  		      if (dataCode == -1) {
				  pr_typ = [1,2,3,10];
  		      } else {
				pr_typ.push(dataCode);
  		      }
  		  }
		  
		var do_get_list_ByAjax = function(hardLoad = false){
			let divList = $("#div_prj_list");
			let divPan  = $("#div_prj_pagination");
			
			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST_SEARCH, 
				{
					searchKey: pr_searchKey, 
					buildInfo: true, hardLoad, 
					stats: pr_typ,
					typs: TYP_USER_200
				});
			
			const callbackFunct 	= data => do_lc_show_list_ByAjax_Dyn(data, divList);
			
			let opt = {
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
		
		var do_lc_show_list_ByAjax_Dyn = function(sharedJson, div){
			let template		=  tmplName.TMPL_LIST_CONTENT;
			let data			= {};
			
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				data		= sharedJson[App['const'].RES_DATA]
			}
			
			$("#div_prj_list")	.html(tmplCtrl.req_lc_compile_tmpl(template		, data));
			do_binding_event(div);
		}
	};

	return List;
});