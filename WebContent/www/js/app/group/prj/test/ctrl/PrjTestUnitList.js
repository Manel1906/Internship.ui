define([
	'text!group/prj/test/tmpl/PrjTestUnit_Main.html', 
	'text!group/prj/test/tmpl/PrjTestUnit_List_Tab.html', 
	'text!group/prj/test/tmpl/PrjTestUnit_List_Content.html',

	'text!group/prj/test/tmpl/PrjTestUnit_EntNew.html'
	], function(
			PrjTestUnit_Main, 
			PrjTestUnit_List_Tab,
			PrjTestUnit_List_Content,

			PrjTestUnit_EntNew
	){

	const PrjTestUnitList = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
		const pr_SERVICE_CLASS_DYN	= "ServicePrjProjectDyn"; //to change by your need
		const pr_SV_LIST_PAGE		= "SVLstPage"; 
		const pr_SV_LIST_DYN		= "SVLstDyn"; 
		const pr_SV_LST_PRJ			= "SVPrjListByUser";
		const pr_SV_LIST_SEARCH     = "SVLstSearch"

		const pr_SV_NEW				= "SVNew"; 
		const pr_SERVICE_AUT_CLASS	= "ServiceAutUser";
		const pr_SV_USER_SEARCH		= "SVLst";
		//-----------------------------------------------------------------------------------
		const pr_NUMBER_RECORD			= 20;

		const pr_TYP00_PRJ_TEST 		= 30;
		const pr_TYP01_PRJ_TEST 		= 11;
		const pr_TYP01_GRP_TEST 		= 12;

		const pr_TYPE02_PRJ 			= 0;
		const pr_TYPE02_EPIC 			= 1;
		const pr_TYPE02_TASK 			= 2;
		const pr_TYPE02_TEST_UNIT 		= 3;

		//-----------------------------------------------------------------------------------
		const pr_TYP00_PRJ_PROJECT		= 10;
		
		//-----------------------------------------------------------------------------------

		var pr_ctr_Main 				= null;

		var pr_SEARCHKEY				= "";
		var pr_GROUP					= null;
		var pr_SEARCHKEY_USER			= null;
		
		var pr_DIV_CONTENT              = "#div_task_content_main";
		//--------------------APIs--------------------------------------//
		this.do_lc_init	= function(){
			pr_ctr_Main 					=	 	App.controller.PrjTestUnit.Main;
			
			pr_ctr_PrjTestUnit_Main        	=       App.controller.PrjTestUnit.Main;
			pr_ctr_PrjTestUnit_List        	=       App.controller.PrjTestUnit.List;
			pr_ctr_Ent                	 	=       App.controller.PrjTestUnit.Ent;

			
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
			
			tmplName.PRJ_TESTUNIT_MAIN			= "PrjTestUnit_Main";
			tmplName.PRJ_TESTUNIT_LIST_TAB		= "PrjTestUnit_List_Tab";
			tmplName.PRJ_TESTUNIT_LIST_CONTENT	= "PrjTestUnit_List_Content";

			tmplName.PRJ_TESTUNIT_ENT_NEW		= "PrjTestUnit_EntNew";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTUNIT_LIST_TAB			, PrjTestUnit_List_Tab);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTUNIT_LIST_CONTENT		, PrjTestUnit_List_Content);

			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTUNIT_ENT_NEW			, PrjTestUnit_EntNew);
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(pId, pCode){               
			try{
				pr_GROUP = pId;
				do_lc_load_view();
				do_get_list_ByAjax();
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "PrjTestUnitList", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_load_view = () => {	
			$("#div_task_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTUNIT_LIST_TAB, {"id" : pr_GROUP}));
			do_gl_apply_right($("#div_task_content"));
		}
		
		const do_binding_event_task = () => {
			$(".task-item").off("click").on("click", function(event){
				let {id,code} = $(this).data();
				pr_ctr_Ent.do_lc_show(id, code, pr_DIV_CONTENT);
				
				$(".task-item").css("background-color", "#fff")
				$(this).css("background-color", "#f0ffff")
			});

			// $(".task-item-name").off("click").on("click", function(event){
			// 	if($(event.target).hasClass("task-option"))	return;

			// 	let $this = $(this);
			// 	if ($this.hasClass('ui-draggable-dragging'))	return;

			$(".btn-resize-list").off("click").on("click", function(){
				let $this 		= $(this);
				let child		= $this.find("i");
				let {divtoggle} = $this.data();

				$(divtoggle)	.toggle("hide");
				child			.toggleClass("mdi-window-minimize mdi-window-maximize")
			})	

			$(".btn-refrest-list").off("click").on("click", function(){
				const {id} 	= $(this).data();
				pr_GROUP 	= id;
				do_get_list_ByAjax(true);
			})
			
			$("#inp_search").off("keyup").on("keyup", function(e){
				pr_SEARCHKEY	= $(this).val();
				do_gl_execute_debounce(do_get_list_ByAjax);
			})
			
			$(".btn_new_test_unit").off("click").on("click", function(){
				var obj = {files: []};
				tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTUNIT_ENT_NEW, {epicSelected: pr_GROUP, typ02: pr_TYPE02_TEST_UNIT})
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_test_unit_new"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTUNIT_ENT_NEW, {epicSelected: pr_GROUP, typ02: pr_TYPE02_TEST_UNIT}),
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
						App.SummerNoteController.do_lc_show("#div_projectdesc"	, {dialogsInBody: true});
						App.SummerNoteController.do_lc_show("#div_testResult"	, {dialogsInBody: true});
						do_gl_init_repeater();
						do_lc_bind_event_task_popup_prj();
					}
				});	
			})
		}

		const do_lc_save_new_task = function(prj, obj){
			$("#btn_msgbox_OK").attr("disabled", "disabled");

			if(!$("#projectId").val()){
				$("#projectName").css("border", "1px solid red");
				$("#projectName").parent().append("<div class='errMsg'>" + $.i18n("validator_err_required") + "</div>");
				do_gl_show_Notify_Msg_Error ($.i18n('common_data_error_msg'));
				return false;
			}
			
			let	data	 		= req_gl_data({
				dataZoneDom		: $("#div_create_prj")
			});

			let $projectdesc = $("#projectdesc");
			if ($projectdesc.summernote('isEmpty')){
				$projectdesc.parent().append("<div class='errMsg'>" + $.i18n("validator_err_required") + "</div>")
			}
			
			if ($("#testResult").summernote('isEmpty')){
				$("#testResult").parent().append("<div class='errMsg'>" + $.i18n("validator_err_required") + "</div>")
			}

			if(data.hasError){
				$("#btn_msgbox_OK").removeAttr("disabled", "disabled");
				return false;
			}

			let objNew 		= data.data;
			objNew.parent 	= objNew.grp;//objNew.parent == 0? pr_GROUP: objNew.parent;
			
			objNew.typ00	= pr_TYP00_PRJ_TEST;
			objNew.typ01	= pr_TYP01_PRJ_TEST;
			// objNew.files	= obj.files;

			// objNew.dtBegin 	= do_lc_convert_date(objNew.dtBegin);
			// objNew.dtEnd 	= do_lc_convert_date(objNew.dtEnd);

			do_lc_create_task(objNew, prj);
		}

//		const do_lc_convert_date = objDate => objDate.date.substr(0, 10) + " " + objDate.time.substr(0, 5) + ":00";

		const do_lc_create_task = function(obj, prj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);			
			ref["obj"]		= JSON.stringify(obj);
			ref["member"]	= JSON.stringify(Object.values(members));
			ref["frView"]	= 3;
			// ref["group"]	= JSON.stringify(Object.values(groups));

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

		const do_lc_bind_event_task_popup_prj = function(obj){
			members = {};
			groups  = {};
			do_lc_req_autocompleteEpicTask();
			// let option_ava		= {
			// 		fileinput	: {maxFiles : 1, param : {typ01: 2, typ02: 10} },//option here
			// 		obj			: obj//file existing here
			// }
			// do_gl_init_fileDropzone($("#div_create_prj #div_prj_avatar"), option_ava);

			// let option = {
			// 		fileinput		: {},//option here
			// 		obj				: obj//file existing here
			// }
			// do_gl_init_fileDropzone($("#div_create_prj #div_prj_docs"), option);
			
			// $("#dtpicker_Begin").datepicker().datepicker("setDate", new Date());
			// $("#dtpicker_End").datepicker().datepicker("setDate", new Date());
			
			// $("#tmpicker_Begin").timepicker({//timepicker
			// 	showMeridian: false,
			// 	defaultTime :'7:00',
			// 	icons		: {
			// 		up		: "mdi mdi-chevron-up",
			// 		down	: "mdi mdi-chevron-down"
			// 	}
			// });
			
			// $("#tmpicker_End").timepicker({//timepicker
			// 	showMeridian: false,
			// 	defaultTime :'19:00',
			// 	icons		: {
			// 		up		: "mdi mdi-chevron-up",
			// 		down	: "mdi mdi-chevron-down"
			// 	}
			// });
		}

		const do_lc_req_autocompleteEpicTask = function(){
			let el = ".inp-name-member";
			members = {}
			let reqSelectMember = function(item){
				if(members[item.id])			return false;
				let lev 			= $("#div_create_prj #sel_member_level").val();
				let typ 			= $("#div_create_prj #sel_member_type").val();
				let user 			= {"id": item.id, "lev": +lev, "typ": +typ};

				let textColor   = null;
				let textAvatar  = null
				if(!item.avatar){
					let first = item.login01.charAt(0);
					let last  = item.login01.charAt(item.login01.length - 1);
					let index = var_gl_alphabet.indexOf(first.toLowerCase());
					
					textColor = var_gl_colors[index];
					textAvatar= first + last;
				}
				
				members[item.id] 	= user;

				let selOpt 			= `<div class='member-item'>`;
				if(item.avatar) selOpt 			+= `<div><img src='${item.avatar.urlPrev}' class='rounded-circle avatar-xs'/> ${item.login01}`;
				else 			selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}`;
				selOpt 				+= `<a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt 				+= `</div></div>`;

				$("#div_list_member").append(selOpt);
				do_lc_bind_event_autocompleteEpicTask();
				$(el).blur().val("");
			}

			let typ01Arr 	= [App.data.user.typ01, 2, 3, 4, 5];
			let typ01Str 	= typ01Arr.join(',');
			let options 	= {
				dataService 	: [pr_SERVICE_AUT_CLASS, pr_SV_USER_SEARCH], 
				dataRes 		: ["login01", "name01"], 
				dataReq			: {nbLine:5, typ01s: typ01Str, stats:1},
				selectCallback	: reqSelectMember, 
				// appendTo: ".msg-box",
				// customShowList: do_lc_customLst_user_autocomplete
			}
			do_gl_set_input_autocomplete(el, options);
			//--------------------------------------------------------------------------------------------
			
			
			let elP = ".inp-name-project";

			let reqSelectProject = (item) => {
				$("#projectId").val(item.id);
				$(elP).val(item.name);
			}

			let optionsP = {
				dataService : [pr_SERVICE_CLASS, pr_SV_LST_PRJ], 
				dataRes 	: ["name"], 
				dataReq		: {typ00 : pr_TYP00_PRJ_PROJECT},
				selectCallback: reqSelectProject, 
			}
			do_gl_set_input_autocomplete(elP, optionsP);
		}

		const do_lc_bind_event_autocompleteEpicTask = function(){
			$(".btn-remove-member").off("click").on("click", function(){
				let $this 	= $(this);
				let parent 	= $this.parent();
				let {id} 	= $this.data();

				if(members[id])	delete members[id];
				parent.remove();
			})
		}

		const do_get_list_ByAjax = (forced) => {	
			let dataSend			= {
				isAll		: true, 
				typ00		: pr_TYP00_PRJ_TEST,
				typ01		: pr_TYP01_PRJ_TEST,
				searchKey	: pr_SEARCHKEY, 
				group		: pr_GROUP, 
				searchUser	: (pr_SEARCHKEY_USER && pr_SEARCHKEY_USER.length) ? pr_SEARCHKEY_USER : null, 
				wAva 		: false, 
				forced
			};

			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_DYN, pr_SV_LIST_PAGE, dataSend);

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
				if(tasks.lst)	data = do_lc_remove_mem_same(tasks);
			}

			$(div)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTUNIT_LIST_CONTENT		, data));
			if (data.lst) $("#project_name").html(data.lst[0].project?.name);
			do_binding_event_task();
		}

		const do_lc_remove_mem_same = tasks => {
			tasks.lst = tasks.lst.map(item => {
				if(!item.members) return item;
				let objMem = item.members.reduce((curr, mem) => {
					curr[mem.id] = mem;
					return curr;
				}, {});
				
				item.members = Object.values(objMem);
				return item;
			});
			
			return tasks;
		}

	};

	return PrjTestUnitList;
});