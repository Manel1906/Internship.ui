define([
	'text!group/prj/file/tmpl/PrjFiles_Ent.html',
	'text!group/prj/file/tmpl/PrjFiles_Ent_Content.html',
	'text!group/prj/file/tmpl/PrjFiles_Ent_Tab_Docs.html',
	'text!group/prj/file/tmpl/PrjFiles_Ent_Tab_Epic.html',
	'text!group/prj/file/tmpl/PrjFiles_Ent_Tab_Member.html',
	'text!group/prj/file/tmpl/PrjFiles_EntCreateEpic.html',
	'text!group/prj/file/tmpl/PrjFiles_Ent_Tab_Epic_List.html',
	'text!group/prj/file/tmpl/PrjFiles_Ent_Tab_Epic_List_Show_Child.html',
	'text!group/prj/file/tmpl/PrjFiles_Ent_Content_Path.html',
	'text!group/prj/file/tmpl/PrjFiles_EntNew.html',
	'text!group/prj/file/tmpl/PrjFiles_EntPopupSearchFile.html',
	'text!group/prj/file/tmpl/PrjFiles_EntPopupHistory.html',
	'group/prj/treeview/ctrl/TreeViewEntMsgbox',
	],
	function(	
			PrjFiles_Ent,
			PrjFiles_Ent_Content,
			PrjFiles_Ent_Tab_Docs,
			PrjFiles_Ent_Tab_Epic,
			PrjFiles_Ent_Tab_Member,
			PrjFiles_EntCreateEpic,
			PrjFiles_Ent_Tab_Epic_List,
			PrjFiles_Ent_Tab_Epic_List_Show_Child,
			PrjFiles_Ent_Content_Path,
			PrjFiles_EntNew,

			PrjFiles_EntPopupSearchFile,
			PrjFiles_EntPopupHistory,
			TreeViewEntMsgbox
	){

	const tmplName				= App.template.names;
	const tmplCtrl				= App.template.controller;
	const pr_ENTITY_TYPE		= 20000;

	const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
	const pr_SV_GET				= "SVGet"; 
	const pr_SV_NEW				= "SVNew"; 
	const pr_SV_DEL				= "SVDel";
	
	//add params for lock and unlock epic
	const pr_SV_LCK				= "SVLCK";
	const pr_SV_UNLCK			= "SVUNLCK";

	const pr_SV_GET_MEMBER		= "SVGetMember"; 
	const pr_SV_SAVE_MEMBER		= "SVSaveMember"; 
	const pr_SV_SAVE_CONTENT	= "SVSaveContent"; 
	const pr_SV_SAVE_FILES		= "SVFileSave"; 
	const pr_SV_ADD_FILES		= "SVFileAdd"; 
	const pr_SV_DEL_FILES		= "SVFileDel"; 

	const pr_SV_GET_COMMENTS	= "SVGetComment";
	const pr_SV_NEW_COMMENTS	= "SVSaveComment";

	const pr_SV_GET_CUSTOMER	= "SVGetCustomer"; 
	const pr_SV_SAVE_CUSTOMER	= "SVSaveCustomer"; 

	const pr_SV_REFRESH_EPIC	= "SVEpicRefresh";
	const pr_SV_REFRESH_CONTENT	= "SVContentRefresh";

	const pr_SERVICE_USER_CLASS	= "ServiceAutUser";
	const pr_SV_USER_SEARCH		= "SVLst";
	const pr_SV_USER_BY_RELATION= "SVLstByRelation";
	const pr_SV_GET_HISTORY_TASK= "SVGetHistoryTask";
	//------------------const object------------------------------------------------------

	const pr_TYPE02_PRJ				= 0;
	const pr_TYPE02_EPIC			= 1;
	const pr_TYPE02_TASK			= 2;
	
	const pr_TYP00_PRJ_PROJECT 		= 0;
	const pr_TYP00_PRJ_DATACENTER 	= 20;
	
	const pr_STAT_PRJ_NEW 			= 100100;
	const pr_STAT_PRJ_TODO 			= 100200;
	const pr_STAT_PRJ_INPROGRESS 	= 100300;
	const pr_STAT_PRJ_DONE 			= 100400;
	const pr_STAT_PRJ_TEST 			= 100500;
	const pr_STAT_PRJ_REVIEW 		= 100600;
	const pr_STAT_PRJ_DEPLOY 		= 100700;
	const pr_STAT_PRJ_UNRESOLVED 	= 100800;
	const pr_STAT_PRJ_CLOSED 		= 100900;
	const pr_POST_KEY_ENTER 		= 13 ; 

	tmplName.PRJ_FILES_ENT							= "PrjFiles_Ent";
	tmplName.PRJ_FILES_ENT_CONTENT					= "PrjFiles_Ent_Content";
	tmplName.PRJ_FILES_ENT_TAB_COMMENT				= "PrjFiles_Ent_Tab_Comment";
	tmplName.PRJ_FILES_ENT_TAB_DOCS					= "PrjFiles_Ent_Tab_Docs";
	tmplName.PRJ_FILES_ENT_TAB_EPIC					= "PrjFiles_Ent_Tab_Epic";
	tmplName.PRJ_FILES_ENT_TAB_MEMBER				= "PrjFiles_Ent_Tab_Member";
	tmplName.PRJ_FILES_ENT_CREATE_EPIC				= "PrjFiles_EntCreateEpic";
	tmplName.PRJ_FILES_ENT_TAB_EPIC_LIST			= "PrjFiles_Ent_Tab_Epic_List";
	tmplName.PRJ_FILES_ENT_TAB_EPIC_LIST_SHOW_CHILD	= "PrjFiles_Ent_Tab_Epic_List_Show_Child";
	tmplName.PRJ_FILES_ENT_CONTENT_PATH				= "PrjFiles_Ent_Content_Path";
	tmplName.PRJ_FILES_ENT_NEW						= "PrjFiles_EntNew";
	tmplName.PRJ_FILES_ENT_POPUP_SEARCH_FILE		= "PrjFiles_EntPopupSearchFile";
	tmplName.PRJ_FILES_ENT_POPUP_HISTORY			= "PrjFiles_EntPopupHistory";

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
	
	//add function for lock and unlock epic
	const do_lc_lck_unlck_epic= (pr_ctr_Ent, id, code, lck)=>{
		var is_lck 		= pr_SV_UNLCK
		if(lck){
			is_lck		= pr_SV_LCK
		}
		
		let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, is_lck, {id, code});			

		let fSucces		= [];		
		fSucces.push(req_gl_funct(null, do_lc_after_lck_unlck_epic, [pr_ctr_Ent]));	

		let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

		App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
	}

	var do_lc_after_lck_unlck_epic			= function(sharedJson, pr_ctr_Ent){
		
		if(can_gl_AjaxSuccess(sharedJson)) {	
			do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
			//----refresh entity
			pr_ctr_Ent.do_lc_show (true);
		}else{
			do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_save'));
		}
	}

	//------------------------------Start Epic list-----------------------------------
	var PrjFilesEntTabEpic 	= function (grpName, header, content, footer) {
		var pr_divHeader                = header;
		var pr_divContent               = content;
		var pr_divFooter                = footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName                  = grpName?grpName:((new Date()).getTime()+"");
		var tmplCtrl                    = App.template.controller;
		//------------------------------Start Epic list-----------------------------------
		const pr_ctr_Ent                = App.controller.PrjFiles.Ent;

		var members                   = {};
		const pr_member_lev_manager     = 0;

		const pr_member_typ_low         = 0;
		const pr_member_typ_high        = 1;
		
		var do_lc_load_view = function(prj){
			members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};

			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_FILES_ENT_TAB_EPIC					, PrjFiles_Ent_Tab_Epic);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_FILES_ENT_TAB_EPIC_LIST			, PrjFiles_Ent_Tab_Epic_List);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_FILES_ENT_TAB_EPIC_LIST_SHOW_CHILD	, PrjFiles_Ent_Tab_Epic_List_Show_Child);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_FILES_ENT_NEW						, PrjFiles_EntNew);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_FILES_ENT_POPUP_SEARCH_FILE		, PrjFiles_EntPopupSearchFile);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_FILES_ENT_POPUP_HISTORY			, PrjFiles_EntPopupHistory);

			$("#div_prj_epic")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILES_ENT_TAB_EPIC, prj));
			do_lc_bind_event_header_epic(prj);
			do_lc_bind_event_resize();
		}

		const do_lc_transform_descr02 = data => {
			if(!data.descr02)	return;
			const list = Object.values(data.descr02).reduce((curr, item) => {
				(item && item.trim().length) && curr.push({item}); return curr;
			}, [])

			data.descr02 = JSON.stringify(list);
		}

		const do_lc_bind_event_header_epic = prj => {
			const $spanTextFilterEpic = $("#sp_text_filter_epic");

			$("#btn_add_epic").off("click").on("click", function(){
				var obj = {files: []}
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_file_add_epic_popup"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILES_ENT_NEW, {epics : prj.epicInf, epicSelected: prj.id,typ02: pr_TYPE02_EPIC, currencys: App.data.currencys}),	
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: do_lc_save_new_epic,
							param	: [prj, obj],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent	: function() {
						App.SummerNoteController.do_lc_show("#div_create_prj", {dialogsInBody: true});
						do_lc_bind_event_epic_popup_prj(obj);
						do_gl_init_repeater();
					}
				});	
			});

			$("#btn_refresh_epic").off("click").on("click", function() {
				$spanTextFilterEpic.html("");
				$(".epic-filter").css("display", "none");

				pr_ctr_Ent.do_lc_show (true);
			})

			$("#btn_filter_complete_epic").off("click").on("click", e => {
				const epicCompletes = prj.epics.filter(o => o.stat === pr_STAT_PRJ_DONE) || [];
				do_lc_show_ui_epic(prj, epicCompletes);
				$spanTextFilterEpic.html(" | " + $.i18n("prj_project_epic_search_compete"));
			})

			$("#btn_filter_not_complete_epic").off("click").on("click", e =>  {
				const epicNotCompletes = prj.epics.filter(o => o.stat !== pr_STAT_PRJ_DONE) || [];
				do_lc_show_ui_epic(prj, epicNotCompletes);
				$spanTextFilterEpic.html(" | " + $.i18n("prj_project_epic_search_not_compete"));
			})

			$("#btn_filter_search_epic").off("click").on("click", () => {
				$("#div_search_epic").toggle();
				$spanTextFilterEpic.html(" | " + $.i18n("prj_project_epic_search_inp"));
			});

			$("#inp_filter_epic").off("keyup").on("keyup", function() {
				const searchKey = $(this).val();
				const do_lc_filter_epic = () => {
					const epicSearch = prj.epics.filter(o => o.name.includes(searchKey) || o.descr01.includes(searchKey)) || [];
					do_lc_show_ui_epic(prj, epicSearch);
				}

				do_gl_execute_debounce(do_lc_filter_epic);
			})
		}

		this.do_lc_show_prj_epic = function(prj){
			do_lc_load_view(prj);
			do_lc_show_epic(prj);
		}

		var do_lc_show_epic = function(prj){
			if(!prj.epics)	    prj.epics 	= [];
			if(!prj.epicInf)	prj.epicInf = [];
			prj.epics = prj.epicInf ? prj.epicInf.filter(o1 => prj.epics.some(o2 => o1.id === o2.id)) : [];

			do_lc_show_ui_epic(prj, prj.epics);
		}

		const do_lc_show_ui_epic = (prj, epics) => {
			if(epics.length > 0) do_lc_sort_data(epics);
			$("#tabEpic").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILES_ENT_TAB_EPIC_LIST, epics));
			do_lc_bind_event_epics_prj(prj);
		}

		const do_lc_sort_data = (data) => {
			data.sort(function (a, b) {
				return a.stat - b.stat || (a.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") > b.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))*2-1;
			});
		}

		var do_lc_bind_event_epics_prj = function(prj){
//			$(".td-epic").off("click").on("click", function(){
//				let {id : idEpic} = $(this).data();
//				idEpic && pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_file_content.html?id=${idEpic}`, "VI_MAIN/"+ App.router.part.PRJ_FILE_ENT, [idEpic], '_self');
//				return false;
//			});


			$(".span-delete-epic").off("click").on("click", function() {
				const {id, stat, code} = $(this).data();
				if(stat !== pr_STAT_PRJ_NEW)	return;
				if(!id || !code)							return;

				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_del_epic_popup"),
					content 	: $.i18n("prj_project_del_epic_popup_content"),
					autoclose	: true,
					css			: {"max-width":"350px"},
					buttons		: {
						OK: {
							lab			: $.i18n("common_btn_ok"),
							funct		: do_lc_delete_new_epic,
							param		: [id, prj, code],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});	
			})
			
			$(".span-lock-epic").off("click").on("click", function() {
				const {id, stat, code} = $(this).data();
				if(stat !== pr_STAT_PRJ_NEW)	return;
				if(!id || !code)							return;

				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_lock_epic_popup"),
					content 	: $.i18n("prj_project_lock_epic_popup_content"),
					autoclose	: false,
					css			: {"max-width":"350px"},
					buttons		: {
						OK: {
							lab			: $.i18n("common_btn_ok"),
							funct		: do_lc_lck_unlck_epic,
							param		: [pr_ctr_Ent, id, code, true],
							autoclose	: true,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});	
			})
			
			$(".span-unlock-epic").off("click").on("click", function() {
				const {id, stat, code} = $(this).data();
				if(stat !== pr_STAT_PRJ_NEW)	return;
				if(!id || !code)							return;

				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_unlock_epic_popup"),
					content 	: $.i18n("prj_project_unlock_epic_popup_content"),
					autoclose	: true,
					css			: {"max-width":"350px"},
					buttons		: {
						OK: {
							lab			: $.i18n("common_btn_ok"),
							funct		: do_lc_lck_unlck_epic,
							param		: [pr_ctr_Ent, id, code],
							autoclose	: true,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});	
			})
			
			$(".span-show-epic").off("click").on("click", function() {
				const {id, code} = $(this).data();
				if(!id)							return;
				$(this).addClass('d-none');
				$(`.tab_show_epic_detail[data-id=${id}][data-code=${code}]`).removeClass('d-none');
				do_lc_show_epic_det(id, code, prj);
			})
			
			$(".span-hide-epic").off("click").on("click", function() {
				const {id} = $(this).data();
				if(!id)							return;
				$(this).addClass('d-none');
				$(`.span-show-epic[data-id=${id}]`).removeClass('d-none');
				$(`.tab_show_epic_detail[data-id=${id}]`).addClass('d-none');
			})

			App.router.controller.do_lc_binding_route();
		}
		

		const do_lc_delete_new_epic = (id, prj, code) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL, {id, code});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_del_epic, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_after_del_epic = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				pr_ctr_Ent.do_lc_show (true);
			}else{
				do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_save'));
			}
			App.MsgboxController.do_lc_close();
		}
		
		const do_lc_show_epic_det = (id, code, prj) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id, code});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_get_content_epic, [id, code]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax_background (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_get_content_epic = function(sharedJson, id, code){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson.res_data;
				const $element = $(`.tab_show_epic_detail[data-id="${id}"][data-code="${code}"]`);
				if($element.children().length === 0)
					$element.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILES_ENT_TAB_EPIC_LIST_SHOW_CHILD, data));
				$(`.span-hide-epic[data-id=${id}][data-code="${code}"]`).removeClass('d-none');
			}else{
				do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_save'));
			}
			App.MsgboxController.do_lc_close();
		}

		var do_lc_save_new_epic = function(prj, obj){
				$("#btn_msgbox_OK").attr("disabled", "disabled");
			let	data	 	= req_gl_data({
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
			objNew.typ00	= pr_TYP00_PRJ_DATACENTER
			objNew.typ02	= pr_TYPE02_EPIC;
			objNew.files	= obj.files;

            objNew.dtBegin =  req_gl_DateStr_From_DateObj (new Date());
			objNew.dtEnd 	=  req_gl_DateStr_From_DateObj (new Date());
			do_lc_transform_descr02(objNew);

			do_lc_create_epic(objNew, prj);
		}

		const do_lc_convert_date = objDate => objDate.date.substr(0, 10) + " " + objDate.time.substr(0, 5) + ":00";

		var do_lc_create_epic = function(obj, prj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);			
			ref["obj"]		= JSON.stringify(obj);
			ref["member"]	= JSON.stringify(Object.values(members));

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_create_epic, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_after_create_epic = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_gl_show_Notify_Msg_Success 	($.i18n('common_ok_msg_save'));
				let data = sharedJson[App['const'].RES_DATA];
				data.descr01 = data.descr01.substring(0, 100);
				prj.epics.push(data);
				do_lc_show_ui_epic(prj, prj.epics);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
			App.MsgboxController.do_lc_close();
		}

		var do_lc_bind_event_epic_popup_prj = function(obj){
			let option_ava		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_create_prj #div_prj_avatar"), option_ava);

			let option = {
					fileinput	: {param : {typ01: 2, typ02: 10} },//option here
					obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_create_prj #div_prj_docs"), option);
			do_lc_req_autocompleteEpicTask();

			$("#div_create_prj .tmpicker").timepicker({//timepicker
				showMeridian: false,
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			})
		}

		var do_lc_req_autocompleteEpicTask = function(){
			let el = ".inp-name-member";
			members = {}
			let reqSelectMember = (event, item) => {
				if(members[item.id])			return false;
				let lev             = $("#sel_member_level").val();
				let typ             = $("#sel_member_type").val();
				let user            = {"id": item.id, "lev": +lev, "typ": +typ};

				members[item.id]    = user;

				if(!item.avatar){
					let first    = item.login01.charAt(0);
					let last     = item.login01.charAt(item.login01.length - 1);
					let index    = var_gl_alphabet.indexOf(first.toLowerCase());
					
					textColor    = var_gl_colors[index];
					textAvatar   = first + last;
				}

				let selOpt        = `<div class='member-item'>`;
				if(item.avatar) selOpt 	  += `<div><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.login01}`;
				else 			selOpt    += `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}`;

				selOpt            += `<a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt            += `</div></div>`;

				$("#div_list_member").append(selOpt);
				do_lc_bind_event_autocomplete();
				$(el).blur().val("");
			}

			let typ01Arr 	= [App.data.user.typ01, 2, 3, 4, 5];
			let typ01Str 	= typ01Arr.join(',');
			let options 	= {
			    dataService 	: [pr_SERVICE_USER_CLASS, pr_SV_USER_SEARCH],
			    svParams		: {wAvatar:true, nbline:5, typ01s: typ01Str, stats:1}, 
			    fSelect			: reqSelectMember, 
			    dataRes 		: ["login01", "name"],//stat:1,  // typ01: $("#inp_home_search_typ01_val").val() 
			    customShowList	: do_lc_customLst_user_autocomplete
			}
			do_gl_req_autocompleteNew(el, options);
		}

		const do_lc_bind_event_autocomplete = () => {
			$(".btn-remove-member").off("click").on("click", function(){
				let $this   = $(this);
				let parent  = $this.parent();
				let {id}    = $this.data();

				if(members[id])	delete members[id];
				parent.remove();
			})
		}

		var do_lc_customLst_user_autocomplete = function(item, selOpt = ""){
		    // if(!item.avatar)	item.avatar = {path01: UI_URL_ROOT + "img/prj/users/avatar-" 		+ do_gl_reqRandom_number(1, 1) 	+ ".jpg"};
		    // selOpt 		+= `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs avatar-autocomplete'/> ${item.login}`;
		    // return selOpt;


		    if(item.avatar)	return	selOpt 	+= `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.login01}`;
		    if(!item.avatar){
		        let textColor   = null;
		        let textAvatar  = null
		        if(!item.avatar){
		            let first = item.login01.charAt(0);
		            let last  = item.login01.charAt(item.login01.length - 1);
		            let index = var_gl_alphabet.indexOf(first.toLowerCase());
		            
		            textColor = var_gl_colors[index];
		            textAvatar= first + last;
		        }
		        selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white text-uppercase text-center mr-1" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}</div>`;
		        return selOpt;
		    }
		}

		//------------------------------End Epic list-----------------------------------
	}
	//------------------------------End Epic list-----------------------------------

	//------------------------------Start Member list-----------------------------------
	var PrjFilesEntTabMember 	= function (grpName, header, content, footer) {
		var pr_divHeader              = header;
		var pr_divContent             = content;
		var pr_divFooter              = footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName                = grpName?grpName:((new Date()).getTime()+"");
		var tmplCtrl                  = App.template.controller;
		
		const pr_ctr_Ent              = App.controller.PrjFiles.Ent;
		//------------------------------Start list member-----------------------------------
		const PRJ_MEMBER_LEVEL 		  = {0: "prj_project_member_level_manager", 10: "prj_project_member_level_reporter", 20: "prj_project_member_level_developer", 30: "prj_project_member_level_tester", 40: "prj_project_member_level_worker", 50: "prj_project_member_level_watcher"};
		const PRJ_MEMBER_TYPE         = {0: "prj_project_lev_bas"				, 1: "prj_project_lev_haute"};

		var pr_MEM_TEMP               = {};
		var members                   = {};
		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;
		const pr_member_lev_developer 	= 20;
		const pr_member_lev_tester 		= 30;
		const pr_member_lev_worker 		= 40;
		const pr_member_lev_watcher 	= 50;
		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;

		const pr_ENT_TYP_USER         = 1000;

		var	  pr_prj;
		var do_lc_load_view = function(){
			members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_FILES_ENT_TAB_MEMBER				, PrjFiles_Ent_Tab_Member);
		}

		this.do_lc_get_list_member = function(prj){
			pr_prj			= prj;
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_MEMBER, {id: prj.id, code: prj.code01});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_list_member, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_show_list_member = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA];

				let objData 	= data.reduce((currentObj, mem)=>{
					if(mem.entId02 == prj.autUser01)	mem.isOwner = true;
					currentObj[mem.entId02] = mem;
					return currentObj;
				}, {});

				do_lc_show_prj_member(objData, prj);
				
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		var do_lc_bind_event_members_prj = function(members, prj){
			pr_MEM_TEMP = $.extend(false, {}, members);

			$("#btn_add_member").off("click").on("click", function(){
				$(".action-item-member").removeClass("hide");
				$(this).addClass("hide");
			})

			$("#a_btn_save_member").off("click").on("click", function(){
				do_lc_save_member_prj(members, prj);
			})

			$("#a_btn_cancel_member").off("click").on("click", function(){
				do_lc_show_prj_member(members, prj);
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
			
			$(".member-treeview").off("click").on("click", function(){
				let {memid} = $(this).data();
				let mem 	= pr_MEM_TEMP[memid];
				if(mem){
					
					if(!App.controller.PrjTreeView)		App.controller.PrjTreeView 		= {};
					if(!App.controller.PrjTreeView.EntMsgbox){
						App.controller.PrjTreeView.EntMsgbox 	= new TreeViewEntMsgbox();
						App.controller.PrjTreeView.EntMsgbox	.do_lc_init();
					}
					App.controller.PrjTreeView.EntMsgbox		.do_lc_show_with_mem_id(memid, prj.id, prj.id, prj.code01);
				}
			})

			let el = "#inp_name_member";
			let reqSelectMember = (event, item) => {
				if(pr_MEM_TEMP[item.id])			return false;

				let lev 		= $("#sel_member_level").val();
				let typ 		= $("#sel_member_type").val();
				let mem 		= {"lev" : lev, "typ": typ, "ent02": item, "entId02": item.id, "entTyp02": pr_ENT_TYP_USER, "entId01": prj.id};
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
				
				if(item.avatar) selOpt 			+= `<td style='width: 50px;'><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs' alt=''/></td>`;
				else 			selOpt 			+= `<td style='width: 50px;'> <div class="rounded-circle avatar-xs text-white text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div></td>`;
				selOpt 			+= `<td><h5 class='font-size-14 m-0'><a href='' class='text-dark'>${strlogin}</a></h5></td>`;
				selOpt 			+= `<td>` + $.i18n(PRJ_MEMBER_LEVEL[+lev]) 	+`</td>`;
				selOpt 			+= `<td  class='hide'>` + $.i18n(PRJ_MEMBER_TYPE[+typ])	+`</td>`;
				selOpt 			+= `</tr>`;

				$("#tabMember table tbody").append(selOpt);
				do_lc_bind_event_autocomplete(pr_MEM_TEMP);
				$(el).blur().val("");
			}

			let typ01Arr 	= [App.data.user.typ01, 2, 3, 4, 5];
			let typ01Str 	= typ01Arr.join(',');
			let options 	= {
					dataService 	: [pr_SERVICE_USER_CLASS, pr_SV_USER_SEARCH], 
					svParams		: {wAvatar:true, typ01s: typ01Str, stats:1}, 
					hintService 	: [pr_SERVICE_USER_CLASS, pr_SV_USER_BY_RELATION],
					hintSvParams	: {wAvatar:true, typ01s: typ01Str, stats:1, entId01: pr_prj.grp}, 
					fSelect			: reqSelectMember, 
					customShowList	: do_lc_customLst_user_autocomplete
			}
			do_gl_req_autocompleteNew(el, options);
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

		var do_lc_save_member_prj = function(members, prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_MEMBER, {id:prj.id, code:prj.code01, members: JSON.stringify(Object.values(pr_MEM_TEMP))});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_member, [members, prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_member = function(sharedJson, members, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success 	($.i18n('common_success_update'));
				
				var data = []
				for (var i in pr_MEM_TEMP ) data.push(pr_MEM_TEMP[i]);
				do_lc_show_prj_member(data, prj);
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
//			if(!item.avatar)	item.avatar = {path01: UI_URL_ROOT + "img/prj/users/avatar-" 		+ do_gl_reqRandom_number(1, 1) 	+ ".jpg"};
//			selOpt 		+= `<img src='${item.avatar.urlPrev}' class='rounded-circle avatar-xs avatar-autocomplete'/> ${item.login01}`;
			if(!item.avatar){
				let first = item.login01.charAt(0);
				let last  = item.login01.charAt(item.login01.length - 1);
				let index = var_gl_alphabet.indexOf(first.toLowerCase());
				
				let textColor = var_gl_colors[index];
				let textAvatar= first + last;
				
				selOpt 		+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white text-uppercase text-center mr-2" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}</div>`;
			}else{
				selOpt 		+= `<div class="media align-items-center"><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs mr-2'/> ${item.login01}</div>`;
			}
			return selOpt;
		}

		var do_lc_show_prj_member = function(data, prj){
			if(typeof data === 'object' && !Array.isArray(data)) {
				data = Object.values(data)
			}
			const is_Me 		= data.find(m => m.entId02 == App.data.user.id);
			const isSuperAdmin 	= App.controller.common.Login && App.controller.common.Login.can_lc_User_SuperAdmin();
			const isOwner		= App.data.user.id === prj.autUser01;
			
			let 	members 	= data.reduce((currentObj, mem)=>{
				if(mem.entId02 == prj.autUser01)	mem.isOwner = true;
				
				if(!isSuperAdmin && !isOwner){
					if(is_Me && is_Me.typ <= mem.typ && is_Me.lev >= mem.lev)	mem.notModif = true;
				}
				
				currentObj[mem.entId02] = mem;
				return currentObj;
			}, {});
			prj.memb = members
			do_lc_load_view();
			$("#div_prj_member")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILES_ENT_TAB_MEMBER			, prj));
			delete prj.memb
			do_lc_bind_event_members_prj(members, prj);
			do_lc_bind_event_resize();
		}
		//------------------------------End list member-----------------------------------
	}

	//------------------------------Start Doc list-----------------------------------
	var PrjFilesEntTabDoc 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplCtrl				= App.template.controller;
		//------------------------------Start File list-----------------------------------
		let self					= this;
		const pr_ctr_Ent            = App.controller.PrjFiles.Ent;
		
		var do_lc_load_view = function(){
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_FILES_ENT_TAB_DOCS				, PrjFiles_Ent_Tab_Docs);
		}

		this.do_lc_show_prj_docs = function(prj){
			do_lc_load_view();
			
			$("#div_prj_docs")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILES_ENT_TAB_DOCS, prj));
			do_lc_bind_event_docs_prj(prj);
			do_lc_bind_event_resize();
			
		}

		function containsEncodedComponents(x) {
			  return (decodeURI(x) !== decodeURIComponent(x));
			}
		
		var do_lc_bind_event_docs_prj = function(prj){
//			let	obj 		= {files:[]};
//			if(!prj.files)	prj.files = [];
			// add new then set null old
			prj.files = [];
			let option		= {
					fileinput	: { param : {typ01: 2, typ02: 10, filenameKept: 1}},//option here, filenameKept: 1 => not change filename
					obj			: prj//file existing here, 
			}
			do_gl_init_fileDropzone($("#div_prj_docs"), option);

			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				path && window.open(path, "_blank");
			})

			$(".item-file-delete").off("click").on("click", function(){
				let id	= $(this).data("id");	
				var lineToRemove = $(this).parents("tr");
				
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
							param	: [prj, id, lineToRemove],
							classBtn: "btn-success"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
							classBtn: "btn-danger"
						}
					}
				});
				
				//do_lc_del_files_prj(prj.id, id, lineToRemove);
				
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
				newprj.files 	= prj.files;
				
				newprj = $.extend(false, prj, newprj);
				do_lc_add_files_prj(newprj);
			})

			$("#a_btn_cancel_doc").off("click").on("click", function(){
				let	data	= req_gl_data({
					dataZoneDom		: $("#div_prj_docs"),
					skipError		: true
				});
				prj.files = data.data.files;
				self.do_lc_show_prj_docs(prj);
			})
		}

		var do_lc_add_files_prj = function(prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_ADD_FILES, {'id': prj.id, 'code': prj.code01, obj: {files: prj.files}});	

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
		
		var do_lc_del_files_prj = function(prj, fileId, lineToRemove){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL_FILES, {'id': prj.id, 'code': prj.code01, 'fileId':fileId});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDel_files_prj, [prj, fileId, lineToRemove]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);

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
		//------------------------------End File list-----------------------------------
	}
	//------------------------------End File list-----------------------------------
	

	//------------------------------Start Content prj-----------------------------------
	var PrjFilesEntTabContent 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplCtrl				= App.template.controller;
		
		const pr_ctr_Ent                = App.controller.PrjFiles.Ent;
		
		const self						= this;
		const pr_TYPE01_INDUSTRY		= 1;
		const pr_TYPE01_INFORMATIQUE	= 2;
		const pr_TYPE01_BUISINESS		= 3;
		const pr_TYPE01_TRAVEL			= 4;

		var members                     = {};
		const pr_ENT_CONTENT   			= {};
		
		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;
		const pr_member_lev_worker 		= 40;

		const pr_CHECK_NOT_FINISH 		= 1;
		const pr_CHECK_FINISH 			= 2;
		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;

		//----------------------Get Path -------------------------------------------------
		const do_lc_get_path_prj = (prj) => {
			if([pr_TYPE02_PRJ].includes(prj.typ02))	return;
			
			do_lc_show_path			(prj);
			do_lc_show_backToParent (prj);
		}

		const do_lc_show_path = function (prj){
			if (!prj.path) return;
			$("#div_prj_path").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILES_ENT_CONTENT_PATH, prj.path));
		}
		
		const do_lc_show_backToParent = function (prj){
			if(!prj.prjPar) return;
			var   cont 	= $("#btn_back").data("url");
			const url 	= cont?cont.replace("#code", prj.prjPar.code01).replace("#id", prj.prjPar.id): "";
			$("#btn_back").data("url", url)
		}
		
		//------------------------------Start content prj-----------------------------------
		var do_lc_load_view = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_FILES_ENT_CONTENT				, PrjFiles_Ent_Content);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_FILES_ENT_CONTENT_PATH			, PrjFiles_Ent_Content_Path);
//			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_FILES_ENT_CONTENT_CHECK_LIST	, PrjFiles_Ent_Content_Check_List);
		}

		this.do_lc_show_prj_content = function(prj, mode){
			do_lc_load_view();
			do_lc_show_content(prj, mode);
			do_lc_get_path_prj(prj);
		}

		var do_lc_show_content = function(prj, mode){
			if(prj.epicInf){
				let epics = prj.epicInf;
				let obj = epics.reduce((currentEpic, epic)=>{
					currentEpic[epic.id] = epic;
					return currentEpic;
				}, {});

				if(obj[prj.parent]) prj.epicName = obj[prj.parent].name;
			}

			$("#div_prj_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILES_ENT_CONTENT, prj));
			
			$("#projectepic").find("option[value="+ prj.parent	+"]")	.attr("selected","selected");


			prj.lstClone = prj.descr02 ? JSON.parse(prj.descr02) : [];
//			do_lc_show_checkList(prj);

			do_lc_bind_event_content_prj(prj, mode);
			do_lc_bind_event_resize();

			do_lc_init_element(prj);

			//--- if business , load client, if not, hide div
//			if(prj.typ01 == pr_TYPE01_BUISINESS){
//				App.controller.PrjFiles.EntCustomer.do_lc_get_list_customers(prj.id);
//			} else {
//				$("#div_prj_customers")	.html("");
//			}

		}

		const do_lc_show_checkList = (prj) => {
			//clone list check list
			$("#div_check_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILES_ENT_CONTENT_CHECK_LIST, prj));
			do_lc_bind_event_checkList(prj);
		}

		const do_lc_bind_event_checkList = (prj) => {
			$(".item-chk-box").off("change").on("change", function(){
				const $this 	= $(this);
				const isCheck 	= $this.is(":checked");
				const {index} 	= $this.data();
				prj.lstClone[index].stat = isCheck ? pr_CHECK_FINISH : pr_CHECK_NOT_FINISH;
				do_lc_show_checkList(prj);
				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
			})

			$(".remove-item-chk").off("click").on("click", function(){
				const {index} 	= $(this).data();
				index > -1 && prj.lstClone.splice(index, 1);
				do_lc_show_checkList(prj);
				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
			})

			$("#btn_add_chk_lst").off("click").on("click", function() {
				const do_lc_add_chk_lst = () => {
					const _content_chk = $("#inp_chk_lst").val();
					if(!_content_chk || !_content_chk.trim().length)	return false;

					prj.lstClone.push({item: _content_chk.trim()});
					do_lc_show_checkList(prj);
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
					App.MsgboxController.do_lc_close();
				}

				App.MsgboxController.do_lc_show({
					title 		: $.i18n("prj_project_descr02_msgbox_add"),
					content 	: `<div class="mb-4"><input class="form-control" id="inp_chk_lst" type="text" placeholder="${$.i18n("prj_project_descr02_enter_inp")}"></div>`,
					autoclose	: false,
					buttons 	: {
						UPDATE : {
							lab 		: $.i18n("prj_project_descr02_add"),
							funct 		: do_lc_add_chk_lst,
							classBtn	: "btn-primary",
							autoclose	: false
						},
						CALCEL : {
							lab 		: $.i18n("common_btn_cancel"),
						}
					}
				});
			})

			$(".edit-item-chk").off("click").on("click", function() {
				const {index} 		= $(this).data();
				let _content_chk 	= prj.lstClone[index].item;
				if(!_content_chk)	return false;

				const do_lc_edit_chk_lst = () => {
					const _content_chk_new = $("#inp_chk_lst").val();
					if(!_content_chk_new || !_content_chk_new.trim().length)	return false;

					prj.lstClone[index].item = _content_chk_new.trim();
					do_lc_show_checkList(prj);
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
					App.MsgboxController.do_lc_close();
				}

				App.MsgboxController.do_lc_show({
					title 		: $.i18n("prj_project_descr02_msgbox_edit"),
					content 	: `<div class="mb-4"><input class="form-control" id="inp_chk_lst" value="${_content_chk}" type="text" placeholder="${$.i18n("prj_project_descr02_enter_inp")}"></div>`,
					autoclose	: false,
					buttons 	: {
						UPDATE : {
							lab 		: $.i18n("prj_project_descr02_edit"),
							funct 		: do_lc_edit_chk_lst,
							classBtn	: "btn-primary",
							autoclose	: false
						},
						CALCEL : {
							lab 		: $.i18n("common_btn_cancel"),
						}
					}
				});
			})
		
		}

		const do_lc_init_element = function(){
			App.SummerNoteController.do_lc_show("#div_prj_info");
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
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj			: prj//file existing here
			}
			do_gl_init_fileDropzone($("#div_prj_content"), option);

			if(mode && mode == var_lc_MODE_NEW){
				$(".action-item-duplicate").remove();

				$("#div_prj_member"		).remove();
//				$("#div_prj_docs"		).remove();				
				$("#div_prj_comments"	).remove();
				$("#div_prj_epic"		).remove();
				$("#div_prj_task"		).remove();
				$("#div_prj_evaluation"	).remove();
				
//				$(".info-content").addClass("hide");			
//				$(".content-edit").removeClass("hide");
//				$("#div_prj_ent_file_avatar").removeClass("hide");
				
				$("#div_partner_funct").removeClass("hide");
				$("#btn_save").off("click").on("click", function(){
					prj.files 	= prj.files ? [...prj.files].filter(Boolean) : [];
					
					let	data	 				= req_gl_data({
						dataZoneDom		: $("#div_prj_content"),
						oldObject 		: prj,
					});

					if(data.hasError)	return false;

					let newPrj 			= data.data;

					
//					newPrj.files	= newPrj.files.concat(obj.files);

					newPrj.dtBegin 	= do_lc_convert_date(newPrj.dtBegin);
					newPrj.dtEnd 	= do_lc_convert_date(newPrj.dtEnd);

					newPrj.parent 	= newPrj.parent == 0? prj.grp: newPrj.parent;

					if(newPrj.lstClone)	newPrj.descr02 = JSON.stringify(newPrj.lstClone);

					do_lc_create_prj(newPrj)
				})
				
				$(".info-edit").on("click", function(){
					let $parent = $(this).parent();
					$parent.find(".info-content")			.addClass("hide");
					$parent.find(".info-content-worker")	.addClass("hide");
					$parent.find(".content-edit")			.removeClass("hide");

					if($parent.find(".content-edit").length > 0){
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
					}
				})
				
			}else{
				$("#btn_lock").off("click").on("click", function() {
					App.MsgboxController.do_lc_show({
						title		: $.i18n("prj_project_lock_epic_popup"),
						content 	: $.i18n("prj_project_lock_epic_popup_content"),
						autoclose	: false,
						css			: {"max-width":"350px"},
						buttons		: {
							OK: {
								lab			: $.i18n("common_btn_ok"),
								funct		: do_lc_lck_unlck_epic,
								param		: [pr_ctr_Ent, prj.id, prj.code01, true],
								autoclose	: true,
								classBtn	: "btn-primary"
							},
							NO: {
								lab		:  $.i18n("common_btn_cancel"),
							}
						}
					});	
				})
				
				$("#btn_unlock").off("click").on("click", function() {
					App.MsgboxController.do_lc_show({
						title		: $.i18n("prj_project_unlock_epic_popup"),
						content 	: $.i18n("prj_project_unlock_epic_popup_content"),
						autoclose	: false,
						css			: {"max-width":"350px"},
						buttons		: {
							OK: {
								lab			: $.i18n("common_btn_ok"),
								funct		: do_lc_lck_unlck_epic,
								param		: [pr_ctr_Ent, prj.id, prj.code01, false],
								autoclose	: true,
								classBtn	: "btn-primary"
							},
							NO: {
								lab		:  $.i18n("common_btn_cancel"),
							}
						}
					});	
				});

				$(".info-edit").on("click", function(){
					let $parent = $(this).parent();
					$parent.find(".info-content")			.addClass("hide");
					$parent.find(".info-content-worker")	.addClass("hide");
					$parent.find(".content-edit")	.removeClass("hide");

					if($parent.find(".content-edit").length > 0){
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
					}
				})

				$("#a_btn_save").off("click").on("click", function(){
					prj.files 	= prj.files ? [...prj.files].filter(Boolean) : [];
					let	data	 				= req_gl_data({
						dataZoneDom		: $("#div_prj_content")
					});

					if(data.hasError)	return false;

					let newPrj 			= data.data;

					if(prj && (prj.userRole == pr_member_lev_reporter || prj.userRole == pr_member_lev_worker)){
						newPrj 			= Object.assign({}, prj);
						newPrj.stat 	= data.data.stat;
					}else{
						newPrj 			= $.extend(false, prj, newPrj);
					}

					newPrj.parent 	= newPrj.parent == 0? prj.grp: newPrj.parent;

					if(newPrj.lstClone)	newPrj.descr02 = JSON.stringify(newPrj.lstClone);

					do_lc_save_prj_content(newPrj, prj)
				})

				$("#btn_duplicate_content").off("click").on("click", function() {
					do_lc_duplicate_content(prj);
				})

				$("#btn_add_avatar").off("click").on("click", function(){
					$("#div_prj_ent_file_avatar").removeClass("hide");
					$(this).addClass("hide");
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
				})
				
				$("#btn_delete").off("click").on("click", function() {
					App.MsgboxController.do_lc_show({
						title 		: $.i18n("prj_project_del_task_popup"),
						content 	: $.i18n("prj_project_del_task_popup_content"),
						css			: {"max-width": "400px"},
						autoclose	: false,
						buttons 	: {
							OK : {
								lab 		: $.i18n("common_btn_ok"),
								funct 		: do_lc_delete_content,
								param		: [prj, prj.id],
								classBtn	: "btn-primary",
							},
							CANCEL : {
								lab 		: $.i18n("common_btn_cancel"),
							}
						}
					});


				})

				$("#a_btn_cancel").off("click").on("click", function(){
					self.do_lc_show_prj_content(prj);
				})

				$(".btn-reload").off("click").on("click", function(){
					let {name: typLoad} = $(this).data();
					do_lc_get_content_reload(prj, typLoad);
				})

				$("#btn_refresh_content").off("click").on("click", function() {
					pr_ctr_Ent.do_lc_show (true);
				})

				$("#btn_search_file").off("click").on("click", function(){
					App.MsgboxController.do_lc_show({
						title		: $.i18n("prj_project_find_file"),
						content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILES_ENT_POPUP_SEARCH_FILE, {}),
						autoclose	: false,
						buttons		: {
							OK: {
								lab			: $.i18n("common_btn_ok"),
								funct		: do_lc_search_file,
								param		: [prj],
								autoclose	: false,
								classBtn	: "btn-primary"
							},
						}
					});	
				})
				$("#btn_show_history").off("click").on("click", function() {
					do_gl_init_msgbox_annonce(`<div id="div_history_list"></div><div id="div_history_pagination"></div>`, null, $.i18n("prj_history_title"));
					do_lc_get_history(prj);
				})
			}
				

		};
		const do_lc_get_history = function(prj){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_HISTORY_TASK, {id :prj.id, typ : prj.typ02});
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_req_history, [prj]));
	
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
	
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
	
		const do_lc_after_req_history = function(sharedJson){
			const data = can_gl_AjaxSuccess(sharedJson) ? sharedJson[App['const'].RES_DATA] :  {};
			do_lc_show_listHistory(data , null , null );
		}
		const do_lc_show_listHistory = function(data, dtBegin, dtEnd) {
		    let obj = {arrChild: []};
	
		    data.forEach((e) => {
		        if(e.typ01 == 100 && e.typ02 == null) {
		            let cmt = JSON.parse(e.inf01);
		            cmt = cmt.reverse();
	
		            cmt.forEach((item) => {    
		                obj.arrChild.push(item);
		            });
	
		        } else {
		            e.dt = e.dt01;
		            obj.arrChild.push(e);
		        }
		    });
	
			if (dtBegin != null || dtEnd != null) {
			       obj.arrChild = obj.arrChild.filter((e) => {
			           let itemDate = e.dt;
					   if(itemDate >= dtBegin && itemDate <= dtEnd) {
						return itemDate ;
						}
			       });
			}
	
		    $("#div_history_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILES_ENT_POPUP_HISTORY, obj));
		    do_lc_bind_event_filter_history(data);
			}
	const do_lc_bind_event_filter_history = (data) => {
			$("#inp_dt_end_history").off("change").on("change", function(){
						
				var dataDate = req_gl_data({
					dataZoneDom: $("#div_date_period")
				});
				let dtBegin = dataDate.data.dtBegin;
				let dtEnd 	= dataDate.data.dtEnd ;
				do_lc_show_listHistory(data , dtBegin , dtEnd );
									
			});
			$("#inp_filter_history").off("keypress").on("keypress", function(e){
				if(e.keyCode == pr_POST_KEY_ENTER){
					let searchKey = $(this).val().toLowerCase();
					$(".event-list").each(function() {
						var str = $(this).text();
						if (!str.includes(searchKey)) $(this).hide(); else $(this).show();
				    });
					
					//do_lc_show_listHistory(data , null , searchKey );
				}
			
			});
			$(".a_view_prj").off("click").on("click", function(){
				let {id, code , gid , gcode , typ } = $(this).data();
				if(typ == 0 ) {
					App.router.controller.do_lc_run("VI_MAIN/prj_sprint", `view_prj_sprint.html?groupId=${gid}&groupCode=${gcode}&id=${id}&code=${code}`);
				}else{
					!!id && pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_content.html?id=${id}&code=${code}`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_ENT, [id, code]);
				}
			});
	}

		var do_lc_delete_content = function(prj, prjId){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL, {id: prjId, code: prj.code01 });			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_del_content, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_after_del_content = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_del'));
				
				var url 	= "view_prj_file_list.html";
				var route	= "VI_MAIN/prj_file_list";
				App.router.controller.do_lc_run(route, url);
			
				
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_del'));
			}
		}

		var do_lc_search_file = (prj) => {
			let ref              = req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVFileSearch");
			ref["id"]         	 = prj.id;
			ref["code"]          = prj.code01;
			ref["searchName"]    = $("#inp_name_file").val();

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_search_file_success, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		var do_lc_search_file_success = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				$("#div_list_file").html("");
				let lst 	= sharedJson[App['const'].RES_DATA];
				let divFile = "";
				lst.forEach((e) => {
					tmpl 	=  "<div class='mt-1 ml-2'><a href='" + e.url  + "' target='_blank' class='mr-3 text-decoration-underline'>" + e.fName + "</a></div><br/>";
					divFile += tmpl;
				});
				if (lst.length === 0){
					divFile += "<p>"+ $.i18n("prj_file_can_not_found") +"</>";
				}
				$("#div_list_file").append(divFile);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}

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

		var do_lc_get_content_reload = function(prj, typLoad){
			if(!typLoad)	return false;
			let pr_SV_NAME_RELOAD 	= typLoad === "val02" ? pr_SV_EVAL_GET_BUDGET : pr_SV_EVAL_GET_PERCENT;

			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_EVAL_CLASS, pr_SV_NAME_RELOAD, {id: prj.id});	

			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_after_Reload, [prj]));

			let fError 				= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_after_Reload = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				if(data){
					prj = $.extend(true, prj, data);
					self.do_lc_show_prj_content(prj);
				}
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
			pr_ctr_Ent.EntDoc		.do_lc_show_prj_docs(newObj, 1);
			
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
		
		const do_lc_create_prj = prj => {
			let dataSend	= {obj: JSON.stringify(prj), member : Object.values(members)};
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW, dataSend);			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_show_prj, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_show_prj = (sharedJson, prj) => {
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				App.router.controller.do_lc_run("VI_MAIN/prj_file_ent", `view_prj_file_content.html?id=${id}&code=${code01}`)
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		//------------------------------End content prj-----------------------------------
	}
	//------------------------------End content prj-----------------------------------

	return {PrjFilesEntTabEpic, PrjFilesEntTabMember, PrjFilesEntTabDoc, PrjFilesEntTabContent};
});