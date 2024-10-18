define(['jquery'], function($) {

	const PrjSprintEntList = function (grpName, header, content, footer) {
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

		const pr_TYP00_SPRINT           = 100;
		const pr_TYP00_PRJ				= 10;
		
		const pr_TYPE02_PRJ 			= 0;
		const pr_TYPE02_EPIC 			= 1;
		const pr_TYPE02_TASK 			= 2;
		
		

		const paramStat 				= {
		}

		const initialValues = {
				lstPrj : []
		}

		var members 					= {};
		var groups                      = {};
		const pr_member_lev_manager 	= 0;

		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;
		
		const pr_LEVEL_PRJ				= 1;
		
		var pr_SEARCHKEY          = "";
		var pr_GROUP_ID           = null;
		var pr_GROUP_CODE         = null;
		var pr_ID 				  = null;
		var pr_CODE               = null;
		var pr_PROJECT 		  	  = null;
		var pr_SEARCHKEY_USER     = null;
		
		var groupID						= ""
		
		var pr_DIV_CONTENT              = "#div_task_content_main";
		//--------------------APIs--------------------------------------//
		this.do_lc_init	= function(){
			pr_ctr_Main        	=   App.controller.PrjSprint.Main;
			pr_ctr_List        	=   App.controller.PrjSprint.List;
			pr_ctr_Ent          =   App.controller.PrjSprint.Ent;
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
		this.do_lc_show = function(pGroupId, pGroupCode, pId, pCode){               
			try{
				pr_GROUP_ID 	= pGroupId;
				pr_GROUP_CODE 	= pGroupCode;
				pr_ID 			= pId;
				pr_CODE  		= pCode;
				
				do_lc_get_list_prj_ofUser()
				do_lc_load_view();
				//do_get_prj_filter_ByAjax();//call function get prj filte
				do_get_list_ByAjax();
				do_binding_event();

				if(pr_ID && pr_CODE) {
					pr_ctr_Ent.do_lc_show(pr_ID, pr_CODE, pr_DIV_CONTENT, pr_TYP00_SPRINT);
				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "PrjSprintEntList", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_load_view = () => {
			$("#div_task_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_SPRINT_LIST_TAB, {grp:pr_GROUP_ID, code: pr_GROUP_CODE}));
		}
		
		//function for get prject filter
		const do_get_prj_filter_ByAjax = (forced) => {
			let dataSend			= {isAll: true, typ00: pr_TYP00_PRJ, typ02: pr_TYPE02_PRJ , group: null, wA : false, wParent: true,  forced};

			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_DYN, pr_SV_LIST_DYN, dataSend);

			const divMain			= "#filter_prj_select_forsearch"
			let callbackFunct 		= data => do_lc_show_prj_filter_Dyn(data, divMain);
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null,callbackFunct , []));
			
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, null)
		}
		
		//function for init prject filter
		const do_lc_show_prj_filter_Dyn = (sharedJson, div) => {
			let data 			= {};
			if (can_gl_AjaxSuccess(sharedJson)) {
				let tasks		= sharedJson[App['const'].RES_DATA];
				console.log(tasks.lst)
				if(tasks.lst)	data = tasks;
			}

			$(div)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_SPRINT_PRJ_FILTER, {"prj" : data? data : null}));
			do_binding_filter_prj()
		}
		
		// binding event for filter
		const do_binding_filter_prj = () => {
			$('#filter_prj_select').on('change',function(e) {
		        pr_GROUP_ID = $(this).val();
				console.log(e)
				pr_SEARCHKEY	= $("#inp_search").val();
				do_gl_execute_debounce(do_get_list_ByAjax, 500);
			 });
		}
		
		const do_get_list_ByAjax = (forced) => {
			var gr					= null
			if(pr_GROUP_ID !== "-1" && pr_GROUP_ID !== null){
				 gr 				=  pr_GROUP_ID
			}
			let dataSend			= {isAll: true, typ00: pr_TYP00_SPRINT,  group: gr, searchKey: pr_SEARCHKEY, searchUser: (pr_SEARCHKEY_USER && pr_SEARCHKEY_USER.length) ? pr_SEARCHKEY_USER : null, wA : false, wParent: true,  forced};

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

			$(div)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_SPRINT_LIST_CONTENT		, {"data" : data.lst? data : null}));
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
				let {id, code , gid , gcode} = $(this).data();
				App.router.controller.do_lc_run("VI_MAIN/prj_sprint", `view_prj_sprint.html?groupId=${gid}&groupCode=${gcode}&id=${id}&code=${code}`); 
							
				pr_ctr_Ent.do_lc_show(id,code,  pr_DIV_CONTENT, pr_TYP00_SPRINT);
				
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
			
			$("#inp_search").on("keydown", function(e){
				setTimeout(()=>{
					var lastsearch = pr_SEARCHKEY
					pr_SEARCHKEY	= $(this).val();
					if(pr_SEARCHKEY.trim() !== lastsearch.trim()){
						lastsearch = pr_SEARCHKEY
						do_gl_execute_debounce(do_get_list_ByAjax, 500);
					}
				}, 5)
			})
			
			
			
			$(".btn_new_sprint").off("click").on("click", function(){
				members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};
				var obj = {files: []}
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_sprint_name_title"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_SPRINT_POPUP_NEW, {lev: pr_LEVEL_PRJ, currencys: App.data.currencys, epics : pr_PROJECT,  epicSelected: pr_GROUP_ID || ""}),	
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: do_lc_save_new_sprint,
							param	: [obj],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},bindEvent: function() {
						$("#projectepic").select2();
						$(".select2").addClass("maxw");
					}
				});	
				
				do_lc_init_element(obj);				
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
		
		const do_lc_init_element = obj => {
			let option		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_prj_avatar_new"), option);
			
			let option2		= {
					fileinput	: {param : {typ01: 2, typ02: 10} },
					obj			: obj//file existing here
			}
			
			do_gl_init_fileDropzone($("#div_prj_doc_new"), option2);

			App.SummerNoteController.do_lc_show("#div_create_prj_sprint");//text editor
			
			do_lc_req_autocomplete();			
			//do_lc_req_autocomplete_group()
			$("#dtpicker_Begin").datepicker().datepicker("setDate", new Date());
			$("#dtpicker_End").datepicker().datepicker("setDate", new Date());
			
			$("#tmpicker_Begin").timepicker({//timepicker
				showMeridian: false,
				defaultTime :'7:00',
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			});
			
			$("#tmpicker_End").timepicker({//timepicker
				showMeridian: false,
				defaultTime :'19:00',
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			});
			
			do_lc_bind_event_dtInput()
		}
		
		const do_lc_bind_event_dtInput = () => {
			$( "#dtpicker_Begin" ).off("change").on("change", function() {
				const sDate = $(this).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate < sDate) $( "#dtpicker_End" ).val(sDate)
			})
			$("#tmpicker_Begin").off("change").on("change", function() {
				const sDate = $( "#dtpicker_Begin" ).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate != sDate) return;
				
				let sTimeArr = $(this).val().split(":")
				let eTimeArr = $( "#tmpicker_End" ).val().split(":")

				if(sTimeArr.length <= 0 || eTimeArr.length <= 0) return

				const sHour = +sTimeArr[0]
				const sMinutes = +sTimeArr[1]
				const eHour = +eTimeArr[0]
				const eMinutes = +eTimeArr[1]

				const sMinutesStr = sMinutes < 10 ? `0${sMinutes}` : sMinutes

				if(eHour < sHour) $( "#tmpicker_End" ).val(`${sHour}:${sMinutesStr}`)
				if(sHour == eHour && eMinutes < sMinutes) $( "#tmpicker_End" ).val(`${sHour}:${sMinutesStr}`)
			})

			
			$( "#dtpicker_End" ).off("change").on("change", function() {
				const eDate = $(this).val()
				const sDate = $( "#dtpicker_Begin" ).val()

				if(eDate < sDate) $( "#dtpicker_Begin" ).val(eDate)
			})
			$("#tmpicker_End").off("change").on("change", function() {
				const sDate = $( "#dtpicker_Begin" ).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate != sDate) return;
				
				let sTimeArr = $( "#tmpicker_Begin" ).val().split(":")
				let eTimeArr = $(this).val().split(":")

				if(sTimeArr.length <= 0 || eTimeArr.length <= 0) return

				const sHour = +sTimeArr[0]
				const sMinutes = +sTimeArr[1]
				const eHour = +eTimeArr[0]
				const eMinutes = +eTimeArr[1]

				const eMinutesStr = eMinutes < 10 ? `0${eMinutes}` : eMinutes

				if(eHour < sHour) $( "#tmpicker_Begin" ).val(`${eHour}:${eMinutesStr}`)
				if(sHour == eHour && eMinutes < sMinutes) $( "#tmpicker_Begin" ).val(`${sHour}:${eMinutesStr}`)
			})
			
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
			//	return selOpt = item.name;
			//}

			//let reqSelectProject = (event, item) => {
				//$("#projectId").val(item.id);
			//	$(elP).val(item.name);
			//}

			//let optionsP = {
					//dataService : [pr_SERVICE_CLASS, pr_SV_LIST_SEARCH], fSelect: reqSelectProject, customShowList : customShowProject
					//change pr_SV_LIST_SEARCH to pr_SV_LIST_SEARCH_PAR_PRJ for search parent project
					//dataService : [pr_SERVICE_CLASS, pr_SV_LIST_SEARCH_PAR_PRJ], fSelect: reqSelectProject, customShowList : customShowProject
			//}
			//do_gl_req_autocompleteNew(elP, optionsP);
			
			let elG = ".inp-name-group";
			let customShowListGroup = function(item, selOpt = ""){
				let name = ""
				if(!item.name)	name = "A";
				else name =  item.name.trim().substr(0,1).toUpperCase();
				 
				if(!item.val01){
					selOpt 		+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div>${item.name}</div>`;
				}else{
					item.val01 = JSON.parse(item.val01);
					if(!item.val01.img) selOpt 		+=  `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div>${item.name}</div>`;
					else selOpt 		+= `<div class="media align-items-center"><img src='${item.val01.img}' class='rounded-circle avatar-xs mr-2'/>${item.name}</div>`;
				}
				return selOpt;
			}

			let reqSelectGroup = (item) => {
				if(groups[item.id])			return false;

				let typ 		= $("#sel_group_type").val();
				let mem 		= {"typ": +typ, "ent02": item, "entId02": item.id, "entTyp02": 40000};
				
				let name = ""
				if(!item.name)	name = "A";
				else name =  item.name.trim().substr(0,1).toUpperCase();

				let strName = item.name.length > 10?item.name.substr(0, 10) + "..." : item.name;
				
				groups[item.id] = mem;
				let selOpt 		= `<div class='member-item'>`;
				if(!item.val01) selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div> ${strName}`;
				else{
					if(!item.val01.img) selOpt 	+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div> ${strName}`;
					else                selOpt 	+= `<div class="media align-items-center"><img src='${item.val01.img}' class='rounded-circle avatar-xs mr-1' alt=''/> ${strName}`;
				}
				selOpt 			+= `<a data-id='${item.id}' class='text-danger btn-remove-group' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt 				+= `</div></div>`;
				
				$("#div_list_group").append(selOpt);
				$(elG).blur().val("");
				do_lc_bind_event_autocomplete_group();
			}
			let optionsG = {
					dataService 	: [pr_SERVICE_GROUP_CLASS, pr_SV_GROUP_SEARCH], 
					fSelect			: reqSelectGroup, 
					dataRes 		: ["name"], 
					svParams		: {nbLine:5, typ01s: 300},
					appendTo		: ".msg-box", 
					customShowList	: customShowListGroup
			}
			do_gl_req_autocompleteNew(elG, optionsG);
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
		
		var do_lc_bind_event_autocomplete_group = function(){
			$(".btn-remove-group").off("click").on("click", function(){
				let $this 		= $(this);
				let parent 	    = $this.parent();
				let {id} 		= $this.data();

				if(groups[id])	delete groups[id];
				parent.remove();
			})
		}
		
		const do_lc_save_new_sprint = function(obj){
			let	data	 	= req_gl_data({
				dataZoneDom		: $("#div_create_prj_sprint")
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
			objNew.typ00	= pr_TYP00_SPRINT;			
			objNew.typ02	= pr_TYPE02_PRJ;			
			objNew.files	= obj.files;
			objNew.parent   = objNew.grp;

			objNew.dtBegin 	= do_lc_convert_date(objNew.dtBegin);
			objNew.dtEnd 	= do_lc_convert_date(objNew.dtEnd);

			do_lc_create_sprint(objNew);
		}

		const do_lc_convert_date = objDate => objDate.date.substr(0, 10) + " " + objDate.time.substr(0, 5) + ":00";

		const do_lc_create_sprint = function(obj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);			
			ref["obj"]		= JSON.stringify(obj);
			ref["member"]	= JSON.stringify(Object.values(members));
			ref["group"]	= JSON.stringify(Object.values(groups));
			ref["typ00"] 	= pr_TYP00_SPRINT;
			ref["frView"]	= 2;

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_create_sprint, []));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_create_sprint = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_gl_show_Notify_Msg_Success 	($.i18n('common_ok_msg_save'));
				let data = sharedJson[App['const'].RES_DATA];
//				data.descr01 = data.descr01.substring(0, 100);
//				prj.epics.push(data);
//				do_lc_show_ui_epic(prj, prj.epics);
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

	return PrjSprintEntList;
});