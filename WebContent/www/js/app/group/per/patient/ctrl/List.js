define(['jquery'], function($) {

	var List 						= function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;

		var self 					= this;
		//------------------------------------------------------------------------------------
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent 				= null;
		var pr_ctr_List 			= null;
		//-----------------------------------------------------------------------------------
		const pr_NUMBER_RECORD		= 9;
		
		var pr_searchKey			= "";
		
		const TYP_01_MORAL			= 200;
		const TYP_01_NATURAL		= 100;
		
		const TYP_02_CLIENT			= 2000;

		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		
		var RIGHT_ADM	        	= 100;
		var RIGHT_A_G	        	= 102;
		var RIGHT_A_N	        	= 102;
		var RIGHT_A_M	        	= 103;
		var RIGHT_A_D	        	= 104;
		
		var RIGHT_GET	        	= 40000101;
		var RIGHT_NEW	        	= 40000102;
		var RIGHT_MOD	        	= 40000103;
		var RIGHT_DEL	        	= 40000104;
		
		const pr_SERVICE_CLASS		= "ServicePerClient";
		const pr_SV_LIST_PAGE		= "SVLstPage";
		const pr_SV_IMPORT			= "SVImport";
		
		const pr_STAT_ACTIVE    	= 1;
		const pr_STAT_INACTIVE      = 2;
		const pr_STAT_ACTIVE_HIDDEN = 3;
		const pr_STAT_DISABLE 		= 10;
		
		var pr_typ = [
			pr_STAT_ACTIVE,
			pr_STAT_INACTIVE,
			pr_STAT_ACTIVE_HIDDEN,
			pr_STAT_DISABLE
		];
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init				= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(div){               
			try{
				if (!div) div= "#div_list_entity";
				
				$(div).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST, {}));
				do_binding_event();
				
				do_get_list_ByAjax(true);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "List", "do_lc_show", e.toString()) ;
			}
		};

		var do_binding_event = function(){
			var listUserRight 	= App.data.user.rights;
			var isRight 		= listUserRight.includes(RIGHT_A_N) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_NEW)
			if (!isRight) {
				$("#btn_new_entity"	).hide();
				$("#btn_add_doc"	).hide();
			}
						
			$('.typ-select').off('click').on('click',function(){
				const dataCode = $(this).data('code');
				do_lc_get_checked(dataCode);
				do_get_list_ByAjax();
			})
			
			$("#btn_refresh_group").off("click").on("click", function(){
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
			
			
			$("#inp-search").off("keyup").on("keyup", function(e){
				e.preventDefault();
		//		if(VIEW_PART !==  App.router.part.PRJ_USER)	return false;//add foreach view prj search
				
				pr_searchKey	= $(this).val();
				do_gl_execute_debounce(do_get_list_ByAjax);
			})
			
			$("#btn_search_responsive").off("click").on("click", function(e){
				e.preventDefault();
				
				let searchNormal 	= $(".inp-search").hasClass("d-none");
				pr_searchKey 		= searchNormal? $(".inp-search").val() : $(".inp-search-responsive").val();
				
				do_get_list_ByAjax();
			});
			
			$("#btn_new_entity").off("click").on("click", function(){
				let listUserRight = App.data.user.rights;
				if(!listUserRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				
				var isRight = listUserRight.includes(RIGHT_ADM)|| listUserRight.includes(RIGHT_A_N);
				if(!isRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				
				pr_ctr_Ent.do_lc_show({}, var_lc_MODE_NEW);
			})
						
			
			$("#btn_add_doc").off("click").on("click", function(){
				if(!data)	data = [];
				data.files = [];
				let option		= {
						fileinput	: { parallelUploads	: 10, uploadMultiple	: true},//option here
						obj			: data//show empty box
				}
				
				App.MsgboxController.do_lc_show({
					title	: $.i18n("prj_user_list_new_file_title"),
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

			do_lc_save_files(newobj);
		}	
		
		var do_lc_save_files = function(newobj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_IMPORT, {obj: {files: newobj.files}});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_save_files_callback, [newobj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_save_files_callback = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_lc_get_list();
				do_gl_show_Notify_Msg_Success($.i18n('prj_user_group_msg_success') );
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		
		var do_get_list_ByAjax = function(hardLoad = false){
			let divList = $("#div_list_detail");
			let divPan  = $("#div_list_pagination");
			
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST_PAGE, 
			{	typ01		: TYP_01_NATURAL, 
				typ02		: TYP_02_CLIENT, 
				searchKey	: pr_searchKey, 
				stats		: pr_STAT_ACTIVE, 
				forced		: hardLoad
			});
			
			const callbackFunct 	= data => do_get_list_ByAjax_callback(data, divList);
			
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
		
		var do_get_list_ByAjax_callback = function(sharedJson, div){
			let template		=  tmplName.TMPL_LIST_CONTENT;
			let data			= {};
			
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				data		= sharedJson[App['const'].RES_DATA]
			}
			
			$("#div_list_detail")	.html(tmplCtrl.req_lc_compile_tmpl(template		, { "data": data.lst }));
			
			do_binding_event_list();
		}
		
		var do_binding_event_list = function () {
			$(".entity-item").off("click").on("click", function(){
				let listUserRight = App.data.user.rights;
				if(!listUserRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				
				let {id, login} =  $(this).data();
				
//				$("#inp-search").prop('readonly', true);
				
				pr_ctr_Ent.do_lc_show(id, var_lc_MODE_SEL);
				
				$(".entity-item").css("background-color", "#fff")
				$(".entity-item[data-id='" + id + "']").css("background-color", "#f0ffff")
			})
		}
	};

	return List;
});