define([
	'text!group/prj/treeview/tmpl/PrjTreeGlobal_Ent.html'
	], function(
			PrjTreeGlobal_Ent
	){
	const TreeGlobalEnt = function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
		const pr_SV_TREE_VIEW		= "SVPrjTreeView"; 

		const self					= this;
		//------------------controllers------------------------------------------------------
		const pr_TYPE02_PRJ			= 0;
		const pr_TYPE02_EPIC		= 1;
		const pr_TYPE02_TASK		= 2;
		
		const pr_STAT_PRJ_NEW 			= 100100;
		const pr_STAT_PRJ_TODO 			= 100200;
		const pr_STAT_PRJ_INPROGRESS 	= 100300;
		const pr_STAT_PRJ_DONE 			= 100400;
		const pr_STAT_PRJ_TEST 			= 100500;
		const pr_STAT_PRJ_REVIEW 		= 100600;
		const pr_STAT_PRJ_DEPLOY 		= 100700;
		const pr_STAT_PRJ_UNRESOLVED 	= 100800;
		const pr_STAT_PRJ_CLOSED 		= 100900;
		
		const paramStats 				= {
				[pr_STAT_PRJ_NEW]		: {id: pr_STAT_PRJ_NEW				, show : true 		, colorBgr: "#008FFB"},
				[pr_STAT_PRJ_TODO]		: {id: pr_STAT_PRJ_TODO				, show : true		, colorBgr: "#3F51B5"},
				[pr_STAT_PRJ_INPROGRESS]: {id: pr_STAT_PRJ_INPROGRESS		, show : true		, colorBgr: "#33B2DF"},
				[pr_STAT_PRJ_DONE]		: {id: pr_STAT_PRJ_DONE				, show : true		, colorBgr: "#00E396"},
				
				[pr_STAT_PRJ_DEPLOY]	: {id: pr_STAT_PRJ_DEPLOY			, show : true		, colorBgr: "#F86624"},
				[pr_STAT_PRJ_TEST]		: {id: pr_STAT_PRJ_TEST				, show : true		, colorBgr: "#4ECDC4"},
				[pr_STAT_PRJ_REVIEW]	: {id: pr_STAT_PRJ_REVIEW			, show : true		, colorBgr: "#4AADC4"},
				
				[pr_STAT_PRJ_CLOSED]	: {id: pr_STAT_PRJ_CLOSED			, show : true		, colorBgr: "#D0663D"},
				[pr_STAT_PRJ_UNRESOLVED]: {id: pr_STAT_PRJ_UNRESOLVED		, show : true		, colorBgr: "#D7263D"}
		}

		const pr_custom_paths	= {
			"css"	: [
				"www/js/lib/gantt/dhtmlxgantt.css",
				"www/css/prj/custom_treegantt.css",
			]
		};
		
		var pr_ctr_Main 			= null;
		var pr_OBJID_GLOBAL			= "";
		var pr_OBJCODE_GLOBAL			= "";
		//--------------------APIs--------------------------------------//
		this.do_lc_init	= function(){
			pr_ctr_Main 							= App.controller.DBoard.DBoardMain;
			tmplName.PRJ_TREEGLOBAL_ENT				= "PrjTreeGlobal_Ent";
		}
		
		const initialValues = {
				lstData 	: [],
				dataBind	: [],
				strSearch	: "",
				dtBegin		: null,
				dtEnd		: null,
				stats		: [	pr_STAT_PRJ_NEW		, pr_STAT_PRJ_TODO		, pr_STAT_PRJ_INPROGRESS, pr_STAT_PRJ_DONE, 
								pr_STAT_PRJ_DEPLOY	, pr_STAT_PRJ_TEST		, pr_STAT_PRJ_REVIEW,  
								pr_STAT_PRJ_CLOSED	, pr_STAT_PRJ_UNRESOLVED ],
				bigPrj		: {}
		}
		//---------show-----------------------------------------------------------------------------
		var pr_grpPath 		= 'group/prj/_transl';
		var pr_showed		= false;
		this.do_lc_show = function(id, code){
			App.router.controller.do_lc_append_custom_tags(pr_custom_paths)
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath, self.do_lc_show_callback, [id, code]);
				pr_showed = true;
			}else {
				self.do_lc_show_callback(id, code);
			}
		};
		
		this.do_lc_show_callback = function(id, code){               
			try{
				var params = req_gl_Url_Params();
				if(!id) id = params.id;
				if(!code) code = params.code;
				if (id && code){
					pr_OBJID_GLOBAL = id;
					pr_OBJCODE_GLOBAL = code;
					do_lc_load_view();
					do_lc_build_page(id, code);
				}else{
					pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_list.html`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_LIST);
				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "TreeViewEnt", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_load_view = () => {	
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TREEGLOBAL_ENT		, PrjTreeGlobal_Ent);
		}
		
		const do_lc_build_page = (id, code) => {
			$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TREEGLOBAL_ENT, {idOrigin : pr_OBJID_GLOBAL,codeOrigin : pr_OBJCODE_GLOBAL, paramStats}));
			do_lc_transfert_data();
			do_lc_get_treeview(id, code);
			do_lc_bind_event_filter();
		}
		
		const do_lc_transfert_data = () => {
			let links 	= do_lc_build_link(initialValues.dataBind);
			let newLst 	= do_lc_build_data_map(initialValues.dataBind);
			
			do_lc_show_page(newLst, links);
		}

		const do_lc_req_lstStats = (prj) => {
			Object.keys(paramStats).map(k => {
				if(paramStats[k].custom) delete paramStats[k]
			})

			if(!prj || !prj.inf03) return paramStats

			if(typeof prj.inf03 === 'string') {
				prj.inf03 = JSON.parse(prj.inf03)
			}

			if(!prj.inf03.stats) return paramStats

			const stats = prj.inf03.stats

			for (let i = 0; i < stats.length; i++) {
				const id = stats[i].id

				if(paramStats[id]) {
					paramStats[id].show = stats[i].show
					paramStats[id].ord = stats[i].ord
					continue
				}

				paramStats[id] = {id: id, ord: stats[i].ord, custom: true, lab: stats[i].lab, show: stats[i].show, colorBgr: "black"}
				if(!initialValues.stats.includes(id)) initialValues.stats.push(id)
			}

			return paramStats
		}
		
		const do_lc_get_treeview = (id, code )=> {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_TREE_VIEW, {id, code});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_getTree_response, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_getTree_response = sharedJson => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data 		= sharedJson[App['const'].RES_DATA];
				// const bigPrj 	= data.find(item => item.id == pr_OBJID_GLOBAL);
				const bigPrj 	= data;
				if(bigPrj){
					initialValues.bigPrj = bigPrj;
				}
				
				initialValues.lstData 	= data;
				initialValues.dataBind 	= data;
				do_lc_req_lstStats(data)

				$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TREEGLOBAL_ENT, {idOrigin : pr_OBJID_GLOBAL,codeOrigin : pr_OBJCODE_GLOBAL, paramStats}));
				do_lc_bind_event_filter()
				do_lc_transfert_data();
			} else {   
				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_list.html`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_LIST);
			}
		}

		const do_lc_build_link = data => {
			let links = [];
		
			const exploreEpics = (data, parentId) => {
				if (!data) return;
		
				for (let item of data) {
					links.push({ "source": parentId, "target": item.id, "type": item.typ02 >= 1 ? "2" : "1" });
					if (item.epics && item.epics.length > 0) {
						exploreEpics(item.epics, item.id);
					}
				}
			};
		
			exploreEpics(data.epics, data.id);
		
			return links;
		};
		

		const do_lc_build_data_map = data => {

			const reqSrcAvatarMember = mem => (
					mem.avatar ? 
							`<img src="${App.controller.UI.Def.reqSrcImg(mem.avatar)}" class="rounded-circle avatar-xs" alt="">` : 
							`<div class="rounded-circle avatar-xs text-white text-uppercase" style="background-color:${App.controller.UI.Def.reqSrcTextColor(mem.login01)}">
								<div class="text-middle">${App.controller.UI.Def.reqSrcTextAvatar(mem.login01)}</div>
							</div>`
			);
			
			let newList = [];

			const processEpic = (epic, parentTaskId = null) => {
				let task = {
					open           : true,
					id             : epic.id,
					start_date     : DateFormat(epic.dtBegin, DateFormat.masks.dbShortDateInverse),
					duration       : (-req_gl_DayDiff(epic.dtBegin, epic.dtEnd)) + "",
					progress       : epic.val05 / 100,
					name           : epic.name,
					typ02          : epic.typ02 + "",
					stat           : epic.stat,
					dtBegin		   : epic.dtBegin,
					dtEnd          : epic.dtEnd,
					dtMod          : epic.dtMod,
					parent         : parentTaskId,
					text           : '',
					users          : []
				};
		
				if (epic.typ02 === pr_TYPE02_EPIC) {
					task.text = `<a data-url="view_prj_project_content.html?id=${epic.id}&code=${epic.code01}" data-route="VI_MAIN/prj_project_ent" target='_blank' class='hnv-route text-dark font-weight-bold' title="${epic.name}" data-toggle="tooltip">${epic.name}</a>`;
				} else if (epic.typ02 === pr_TYPE02_PRJ) {
					task.text = `<a data-url="view_prj_project_content.html?id=${epic.id}&code=${epic.code01}" data-route="VI_MAIN/prj_project_ent" target='_blank' class='hnv-route text-success font-weight-bold' title="${epic.name}" data-toggle="tooltip">${epic.name}</a>`;
				} else {
					task.text = `<a data-url="view_prj_project_content.html?id=${epic.id}&code=${epic.code01}" data-route="VI_MAIN/prj_project_ent" target='_blank' class='hnv-route text-dark' title="${epic.name}" data-toggle="tooltip">${epic.name}</a>`;
				}
		
				if (epic.members) {
					task.users = epic.members.map(m => (
//						`<a href='view_prj_user_profile.html?id=${epic.id}' target='_blank' class='text-dark'>
//							${reqSrcAvatarMember(m.ent02)}
//						</a>`
						`${reqSrcAvatarMember(m.ent02)}`
					));
				}
		
				newList.push(task);
		
				if (epic.epics && epic.epics.length > 0) {
					epic.epics.forEach(subEpic => {
						processEpic(subEpic, epic.id);
					});
				}
			};
		
			processEpic(data);
		
			newList.sort((a, b) => {
				if (a.typ02 !== b.typ02) return a.typ02 - b.typ02;
				let nameA = a.name.trim().toLowerCase(),
					nameB = b.name.trim().toLowerCase();
				return nameA > nameB ? 1 : nameA < nameB ? -1 : 0;
			});
		
			return newList;
		};
		
		
		const do_lc_show_page = (newLst, links) => {
			gantt.clearAll();
			
			const reqColor = (start_date, end_date, item) => {
				if([pr_STAT_PRJ_NEW, pr_STAT_PRJ_TODO, pr_STAT_PRJ_INPROGRESS, pr_STAT_PRJ_DEPLOY, pr_STAT_PRJ_TEST, pr_STAT_PRJ_REVIEW].includes(item.id)){
					let diffDays = req_gl_DayDiff(item.dtEnd);
					if(diffDays < 0)	return "red";
				}
				
				if (item.id == pr_STAT_PRJ_DONE) 			return "white";
				if (item.id == pr_STAT_PRJ_CLOSED) 			return "green";
				
				if (item.id == pr_STAT_PRJ_UNRESOLVED) 		return "notCapable";
			};
			gantt.config.add_column 		= false;
			gantt.templates.grid_row_class 	= reqColor;
			gantt.templates.task_row_class 	= reqColor;
			gantt.config.columns 			= [
				{
//					name: "text"	, label:"<div class='div_searchEl'>" + $.i18n('prj_project_project_name') + "<input id='search' type='text' placeholder='...'></div>", 
					name: "text"	, label: $.i18n('prj_project_project_name'), 
					width: '*'		, tree: true, resize: true		
				},
				{
					name: "progress", label: $.i18n('prj_project_percent')		, width: '*'		, resize: true		, align: "right", color: "red",
					template: item => Math.round(item.progress * 100) + "%"
				},
				{
					name: "stat"	, label: $.i18n('prj_project_stat')			, width: '*'		, resize: true		, align: "left",
					template: item => {
				           switch(item.stat){
								case pr_STAT_PRJ_TODO		: return `<div class = "gantt_tree_content">`+ $.i18n('prj_workflow_stat_todo') + `</div>`;
								case pr_STAT_PRJ_NEW		: return `<div class = "gantt_tree_content">`+ $.i18n('prj_workflow_stat_new') + `</div>`;
								case pr_STAT_PRJ_INPROGRESS : return `<div class = "gantt_tree_content">`+ $.i18n('prj_workflow_stat_progress') + `</div>`;
								case pr_STAT_PRJ_DONE		: return `<div class = "gantt_tree_content">`+ $.i18n('prj_workflow_stat_done') + `</div>`;
								case pr_STAT_PRJ_REVIEW		: return `<div class = "gantt_tree_content">`+ $.i18n('prj_workflow_stat_review') + `</div>`;
								case pr_STAT_PRJ_DEPLOY		: return `<div class = "gantt_tree_content">`+ $.i18n('prj_workflow_stat_deploy') + `</div>`;
								case pr_STAT_PRJ_UNRESOLVED	: return `<div class = "gantt_tree_content">`+ $.i18n('prj_workflow_stat_unresolved') + `</div>`;
								case pr_STAT_PRJ_CLOSED		: return `<div class = "gantt_tree_content">`+ $.i18n('prj_workflow_stat_close') + `</div>`;
				                
				            }
				        }
				},		
//				{
//					name: "dtMod"	, label: $.i18n('prj_project_dtmod')		, width: '*'		, resize: true		, align: "left",
//					template: item => item.dtMod ? DateFormat(item.dtMod, DateFormat.masks.viFullDate) : ""
//				},
				{
					name: "assigned", label: $.i18n('prj_project_member')		, width: '*'		, align: "left",	
					template: item => (item.users ? `<div class="d-flex">${item.users.join(" ")}</div>` : "")
				}
			];
			
			gantt.config.scales = [
//				{unit: "month"	, step: 1, format: "%F, %Y"},		
//				{unit: "day"	, step: 1, format: "%j, %D"}
				{unit: "month"	, step: 1, format: "%m/%Y"},		
				{unit: "day"	, step: 1, format: "%d, %D", css: function(date) { 
					var dayOfWeek = date.getDay();
					var isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0);
					if (isWeekend)   return "week-end"; 
				}
				}
				
			];
			
			gantt.templates.task_class = function (start, end, task) {
				let classCss = "";
				switch (task.typ02) {
					case `${pr_TYPE02_PRJ}`		: classCss += "project"	;break;
					case `${pr_TYPE02_EPIC}`	: classCss += "epic"	;break;
					case `${pr_TYPE02_TASK}`	: classCss += "task"	;break;
				}
				
				if(task.stat === pr_STAT_PRJ_UNRESOLVED)	classCss += " notCapable-task";
				
				return classCss;
			};
			gantt.i18n.addLocale("vi", pr_GANTT_CONFIG_VN);
			gantt.i18n.setLocale(App.language);

			gantt.init(`gantt_here`);
			gantt.parse({data: newLst, links});

			gantt.attachEvent("onBeforeTaskDisplay", function (id, task) {
				if(id == pr_OBJID_GLOBAL)	return true;
				return do_lc_is_task_visible(task);
			});

			gantt.attachEvent("onGanttRender", function(){
				App.router.controller.do_lc_binding_route();
			});
		}
		
		const do_lc_bind_event_filter = () => {
			$("#sel_header_stat").multiselect()
			
			$(".input-date-search").off("change").on("change", function(){
				const dataDate = req_gl_data({
					dataZoneDom: $("#div_date_period")
				});
				initialValues.dtBegin 	= dataDate.data.dtBegin;
				initialValues.dtEnd 	= dataDate.data.dtEnd;
				gantt.render()
			})
			
			$(".prj-stat-cbx").off("change").on("change", function(){
				let $this 					= $(this);
				let val						= $this.find("input").val();
				let isChecked 				= $this.hasClass("active");
				paramStats[val].show 		= isChecked? true : false;
				
				initialValues.stats 		= Object.values(paramStats).reduce((curr, item) => {
					if(item.show)	curr.push(item.id);
					return curr;
				}, [])

				gantt.render()
			})
			
			$("#inp_search_filter").off("keyup").on("keyup", function(){
				do_gl_execute_debounce(() => {
					initialValues.strSearch = $(this).val().toLowerCase();
					gantt.render();
				});
			})
		}

		const do_lc_is_task_visible = (task) => {
			const {strSearch, dtBegin, dtEnd, stats}     = initialValues;

			if(!stats.includes(task.stat))	return false;
			if(dtBegin && task.dtBegin){
				if(new Date(task.dtBegin).getTime() < new Date(dtBegin).getTime())	return false;
			}
			if(dtEnd && task.dtEnd){
				if(new Date(task.dtEnd).getTime() > new Date(dtEnd).getTime())		return false;
			}
			
			if(!task.name.toLowerCase().includes(strSearch))	return false;
			
			return true;
		}
	};

	return TreeGlobalEnt;
});