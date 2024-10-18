define(['jquery'], function($) {

	const PrjWorkflowList = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
		const pr_SV_GET				= "SVGet";
		const pr_SV_NEW				= "SVNew";
		const pr_SV_TASK_MOVE		= "SVTaskMove";
		const pr_SV_LIST_SEARCH     = "SVLstSearch"
		
		
		const pr_SV_LST_PRJ			= "SVPrjListByUser";

		
		//add params for search parent project
		const pr_SV_LIST_SEARCH_PAR_PRJ	= "SVLstSearchParPrj"
		
		const pr_SERVICE_CLASS_DYN	= "ServicePrjProjectDyn"; //to change by your need
		const pr_SV_LIST_DYN		= "SVLstPage";
		
		const pr_SERVICE_USER_CLASS	= "ServiceAutUser";
		const pr_SV_USER_SEARCH		= "SVLst";

		const pr_SERVICE_GROUP_CLASS= "ServiceNsoGroup";
		const pr_SV_GROUP_SEARCH	= "SVLst";
		//-----------------------------------------------------------------------------------
		const pr_NUMBER_RECORD			= 10;

		const pr_TYP00_WORKFLOW         = 200;
		const pr_TYPE02_PRJ 			= 0;
		const pr_TYPE02_EPIC 			= 1;
		const pr_TYPE02_TASK 			= 2;
		

		const initialValues = {
				lstPrj : []
		}

		var members 					= {};
		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;
		const pr_member_lev_developer 	= 20;
		const pr_member_lev_tester 		= 30;
		const pr_member_lev_worker 		= 40;
		const pr_member_lev_watcher 	= 50;

		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;
		
		const pr_LEVEL_PRJ				= 1;
		
		var pr_ctr_Main           = null;

		var pr_SEARCHKEY          = "";
		var pr_GROUP              = null;
		var pr_ID 				  = null;
		var pr_CODE               = null;
		var pr_PROJECT 		  	  = null;
		var pr_SEARCHKEY_USER     = null;
		
		var groupID						= ""
		
		var pr_DIV_CONTENT              = "#div_task_content_main";
		//--------------------APIs--------------------------------------//
		this.do_lc_init	= function(){
			pr_ctr_Main 					= 	App.controller.UI.Main;
			pr_ctr_List        				=   App.controller.PrjWorkflow.List;
			pr_ctr_Ent                 		=   App.controller.PrjWorkflow.Ent;
		}
		
		const do_lc_get_list_prj_ofUser = () => {
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LST_PRJ);	

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_after_get_list_prj_ofUser, []));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
			}

			const do_lc_after_get_list_prj_ofUser = (sharedJson) => {
				if(can_gl_AjaxSuccess(sharedJson)) {
					let data = sharedJson[App['const'].RES_DATA];
					if(data && data.length)	pr_PROJECT = data;
					if(pr_PROJECT){
						groupID = pr_PROJECT[0].id
					}
				}
			}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(pGroup, pId, pCode){               
			try{
				pr_GROUP 	= pGroup;
				pr_ID 		= pId;
				pr_CODE  	= pCode;
				
				do_lc_get_list_prj_ofUser()
				do_lc_load_view();
				do_get_list_ByAjax();
				do_binding_event();

				if(pr_ID && pr_CODE) {
					pr_ctr_Ent.do_lc_show(pr_ID, pr_CODE, pr_DIV_CONTENT, pr_TYP00_WORKFLOW);
				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "PrjWorkflowList", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_load_view = () => {	
			$("#div_task_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_WORKFLOW_LIST_TAB, {grp:pr_GROUP, code: pr_CODE}));
		}
		
		const do_get_list_ByAjax = (forced) => {	
			let dataSend			= {isAll: true, typ00: pr_TYP00_WORKFLOW,  group: pr_GROUP, searchKey: pr_SEARCHKEY, searchUser: (pr_SEARCHKEY_USER && pr_SEARCHKEY_USER.length) ? pr_SEARCHKEY_USER : null, wA : false, wParent: true,  forced};

			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_DYN, pr_SV_LIST_DYN, dataSend);

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

			$(div)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_WORKFLOW_LIST_CONTENT		, {"data" : data.lst? data : null}));
			$(`.task-item[data-id=${pr_ID}]`).css("background-color", "#f0ffff")

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
			})
			
			return tasks;
		}
		
		const do_binding_event_task = () => {
			$(".task-item").off("click").on("click", function(event){
				let {id, code} = $(this).data();
				
				App.router.controller.do_lc_run("VI_MAIN/prj_workflow", `view_prj_workflow.html?id=${id}&code=${code}`); 
				pr_ctr_Ent.do_lc_show(id,code,  pr_DIV_CONTENT, pr_TYP00_WORKFLOW);
				
				$(".task-item").css("background-color", "#fff")
				$(this).css("background-color", "#f0ffff")
			});
			
			$(".btn-resize-list").off("click").on("click", function(){
				let $this 		= $(this);
				let child		= $this.find("i");
				let {divtoggle} = $this.data();

				$(divtoggle)	.toggle("hide");
				child			.toggleClass("mdi-window-minimize mdi-window-maximize")
			})	
		}
		
		const do_binding_event = () => {
			$(".btn-refrest-list").off("click").on("click", function(){
				do_get_list_ByAjax(true);
			})
			
			$("#inp_search").off("keydown").on("keydown", function(e){
				pr_SEARCHKEY	= $(this).val();
				do_gl_execute_debounce(do_get_list_ByAjax, 1000);
			})
			
			$(".btn_new_workflow").off("click").on("click", function(){
				members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_workflow_name_title"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_WORKFLOW_POPUP_NEW, {lev: pr_LEVEL_PRJ, currencys: App.data.currencys, epics: pr_PROJECT,  epicSelected: groupID || ""}),	
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: do_lc_save_new_workflow,
							param	: [],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent: function() {
						$("#projectepic").select2();
						$(".select2").addClass("maxw");
						do_lc_req_autocomplete();
					}
				});	
				
				do_lc_init_element();				
			})
			$(".prj-toggle-stat").off("click").on("click", () => {
				$(".div-stat").toggleClass("show");
			});

			$(".prj-toggle-search").off("click").on("click", () => {
				$(".div-search").toggleClass("show");
				$(".select2").toggleClass("maxw");
			});
			App.router.controller.do_lc_binding_route()
		}
		
		const do_lc_init_element = () => {
			App.SummerNoteController.do_lc_show("#div_create_prj_workflow");//text editor
			
			
		}

		const do_lc_req_autocomplete = () => {
			let el = ".inp-name-member";
			members = {}
			let customShowList = function(item, selOpt = ""){
				if(item.avatar)			return	selOpt 			+= `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.login01}`;
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

			let reqSelectMember = (event, item) => {
				if(members[item.id])			return false;
				let lev 			= $("#sel_member_level").val();
				let typ 			= $("#sel_member_type").val();
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
				if(item.avatar) selOpt 			+= `<div><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.login01}`;
				else 			selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}`;

				selOpt 				+= `<a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt 				+= `</div></div>`;

				$("#div_list_member").append(selOpt);
				do_lc_bind_event_autocomplete_member();
				$(el).blur().val("");
			}

			let typ01Arr 	= [App.data.user.typ01, 2, 3, 4, 5];
			let typ01Str 	= typ01Arr.join(',');
			let options 	= {
			    dataService 	: [pr_SERVICE_USER_CLASS, pr_SV_USER_SEARCH],
			    svParams		: {wAvatar:true, nbLine:5, typ01s: typ01Str, stats:1}, 
			    fSelect			: reqSelectMember, 
			    dataRes 		: ["login01", "name01"],//stat:1,  // typ01: $("#inp_home_search_typ01_val").val() 
			    appendTo		: ".msg-box", 
			    customShowList	: customShowList
			}
			do_gl_req_autocompleteNew(el, options);	
			
			//let elP = ".inp-name-project";
			//let  customShowProject= function(item, selOpt=""){
				//return selOpt = item.name;
			//}

			//let reqSelectProject = (event, item) => {
				//$("#projectepic").val(item.id);
				//$(elP).val(item.name);
			//}

			//let optionsP = {
					//dataService : [pr_SERVICE_CLASS, pr_SV_LIST_SEARCH], 
					//change pr_SV_LIST_SEARCH to pr_SV_LIST_SEARCH_PAR_PRJ for search parent project
			//		dataService : [pr_SERVICE_CLASS, pr_SV_LIST_SEARCH], 
			//		fSelect: reqSelectProject, 
			//		customShowList : customShowProject
			//}
			//do_gl_req_autocompleteNew(elP, optionsP);
		}
		
		
		
		
		
		


		
		
		
		
		
		
		
		
		
		
		
		var do_lc_bind_event_autocomplete_member = function(){
			$(".btn-remove-member").off("click").on("click", function(){
				let $this 		= $(this);
				let parent 	    = $this.parent();
				let {id} 		= $this.data();

				if(members[id])	delete members[id];
				parent.remove();
			})
		}
		
		const do_lc_save_new_workflow = function(){
			let	data	 	= req_gl_data({
				dataZoneDom		: $("#div_create_prj_workflow")
			});

//			let $projectdesc = $("#projectdesc");
//			if ($projectdesc.summernote('isEmpty')){
//				$projectdesc.parent().append("<div class='errMsg'>" + $.i18n("validator_err_required") + "</div>")
//			}
			
			if(!$("#projectepic").val()){
				$("#projectName").css("border", "1px solid red");
				$("#projectName").parent().append("<div class='errMsg'>" + $.i18n("validator_err_required") + "</div>");
				do_gl_show_Notify_Msg_Error ($.i18n('common_data_error_msg'));
				return false;
			}
			
			if(data.hasError){
				do_gl_show_Notify_Msg_Error ($.i18n('common_data_error_msg'));
				return false;
			}

			let objNew 		= data.data;
			objNew.typ00	= pr_TYP00_WORKFLOW;			
			objNew.typ02	= pr_TYPE02_PRJ;			
			objNew.parent   = objNew.grp;

			do_lc_create_workflow(objNew);
		}

		const do_lc_create_workflow = function(obj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);			
			ref["obj"]		= JSON.stringify(obj);
			ref["member"]	= JSON.stringify(Object.values(members));
			ref["typ00"] 	= pr_TYP00_WORKFLOW;
			ref["frView"]	= 2;

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_create_workflow, []));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_create_workflow = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_gl_show_Notify_Msg_Success 	($.i18n('common_ok_msg_save'));
				let data = sharedJson[App['const'].RES_DATA];
//				data.descr01 = data.descr01.substring(0, 100);
//				prj.epics.push(data);
				do_get_list_ByAjax(true);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
			App.MsgboxController.do_lc_close();
		}

		const do_lc_get_prj = (id, code, forced) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id, code, forced});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_prj_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_get_prj_callback = sharedJson => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 				= sharedJson[App['const'].RES_DATA];
				
				if(data) {
					pr_PROJECT = data;
				}
			}
		}
	};

	return PrjWorkflowList;
});