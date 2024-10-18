define([
	'text!group/user_team_plan/tmpl/PrjUserTeamPlanning_Ent.html',
	'text!group/user_team_plan/tmpl/PrjUserTeamPlanning_List_Appointment_Popup.html',
	], function(
			PrjUserTeamPlanning_Ent,
			PrjUserTeamPlanning_List_Appointment_Popup
	){
	const UserTeamPlanningEnt = function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		const self					= this;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServiceNsoGroupExt"; //to change by your need
		const pr_SV_USER_PLAN_GET	= "SVUserPlanningGet"; 
		const pr_SV_GROUP_PLAN_GET	= "SVGroupPlanningGet"; 
		
		const pr_SV_GROUP_PLAN_GET_APPOINTMENT_LIST         = "SVGroupPlanningGetAppointmentList";
		const pr_SV_GROUP_PLAN_GET_APPOINTMENT_LIST_BY_DATE = "SVGroupPlanningGetAppointmentListByDate";
		
		const pr_SERVICE_USER_CLASS	= "ServiceAutUser";
		const pr_SV_USER_SEARCH		= "SVLstForCalend";

		const pr_SERVICE_GROUP_CLASS= "ServiceNsoGroup";
		const pr_SV_GROUP_SEARCH	= "SVLstGroup";
		
		const pr_custom_paths	= {
			"css"	: [
				"www/css/prj/custom_treegantt.css",
				"www/js/lib/gantt/dhtmlxgantt.css",
				"www/css/prj/custom_teamplan.css"
			]
		};
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_MEM_TEMP				= {};
		var pr_GROUP_TEMP		    = {};
		var header					= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
		//--------------------APIs--------------------------------------//
		this.do_lc_init	= function(){
			pr_ctr_Main 							   			= App.controller.DBoard.DBoardMain;
			tmplName.PRJ_USERTEAMPLANNING_ENT				   	= "PrjUserTeamPlanning_Ent";
			tmplName.PRJ_USERTEAMPLANNING_LIST_APPOINT_POPUP 	= "PrjUserTeamPlanning_List_Appointment_Popup";
		}
		
		const initialValues = {
				dataBind	: [],
				jobOff      : {},
				holiday     : [],
				dtBegin		: null,
				dtEnd		: null,
				colors      : {
					"A"     : "#e51414",
					"H"     : "#9ae1c7",
					"F"     : "#34c38f",
					"CP"    : "#556ee6"
				},
				team        : [],
		}
		
		var    pr_DURATION = 90;
		const         days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		
		//---------show-----------------------------------------------------------------------------
		var pr_grpPath 		= 'group/user_team_plan';
		var pr_showed		= false;
		this.do_lc_show = function(){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback, []);
				pr_showed = true;
			}else {
				self.do_lc_show_callback();
			}
		};
		
		this.do_lc_show_callback = function(){ 
			try{
					App.router.controller.do_lc_append_custom_tags(pr_custom_paths);
					do_lc_load_view();
					do_lc_init_params()
					do_lc_build_page();
					$(document).prop('title',$.i18n('prj_project_sidebar_team_planning'));
			}catch(e) {				
				console.log(e);
			}
		};

		const do_lc_init_params = () => {
			initialValues.dataBind = [];
			initialValues.jobOff   = {};
			initialValues.holiday  = [];
			initialValues.dtBegin  = null;
			initialValues.dtEnd    = null;
			pr_DURATION            = 90;
			pr_GROUP_TEMP          = {};
			 pr_MEM_TEMP		   = {};
		}
		
		//--------------------------------------------------------------------------------------

		const do_lc_load_view = () => {	
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USERTEAMPLANNING_ENT		                , PrjUserTeamPlanning_Ent);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USERTEAMPLANNING_LIST_APPOINT_POPUP		, PrjUserTeamPlanning_List_Appointment_Popup);
		}
		//--------------------------------------------------------------------------------------

		const do_lc_build_page = () => {
			$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USERTEAMPLANNING_ENT, {}));
			do_init_autocomplete_member();
			do_lc_transfert_data();
			do_lc_get_config_user();
			do_lc_bind_event_filter();
		}
		//--------------------------------------------------------------------------------------

		const do_init_autocomplete_member = () => {
			let el = "#inp_name_member";
			let reqSelectMember = function(event, item){
//				if(pr_MEM_TEMP[item.id])			return false;
				do_lc_get_config_user(item)
				$(el).blur().val("");
				pr_MEM_TEMP[item.id] = item;
			}

			let options = {
				dataService : [pr_SERVICE_USER_CLASS, pr_SV_USER_SEARCH],
				fSelect		: reqSelectMember, 
				svParams	: {wAvatar:true, stats: 1}, 
				customShowList: do_lc_customLst_user_autocomplete
			};
			do_gl_req_autocompleteNew(el, options);
			
			
			let elGrp = "#inp_name_group";
			let reqSelectGroup = function(event, item){
//				if(pr_GROUP_TEMP[item.id])			return false;
				
				do_lc_get_config_user_group(item);
				$(elGrp).blur().val("");
				pr_GROUP_TEMP[item.id] = item;
			}

			let grpOptions = {
					dataService : [pr_SERVICE_GROUP_CLASS, pr_SV_GROUP_SEARCH],
					svParams	: {"typ01s" : "300", stats: 1},
					fSelect: reqSelectGroup,
					customShowList: do_lc_customLst_group_autocomplete
			}
			do_gl_req_autocompleteNew(elGrp, grpOptions);
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
				selOpt		+= `<div class="media align-items-center"><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs mr-2'/>${item.login01}</div>`;
			}
			return selOpt;
		}
		
		var do_lc_customLst_group_autocomplete = function(item, selOpt = ""){
			let name = ""
			if(!item.name)	name = "A";
			else name =  item.name.trim().substr(0,1).toUpperCase();
			 
			if(!item.val01){
				selOpt 		+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div>${item.name}</div>`;
			}else{
				item.val01 = JSON.parse(item.val01);
				if(!item.val01.img) selOpt 		+=  `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div>${item.name}</div>`;
				else selOpt 		+= `<div class="media align-items-center"><img src='${item.val01.img}' class='rounded-circle avatar-xs mr-2'/> ${item.name}</div>`;
			}
			return selOpt;
		}
		
		//--------------------------------------------------------------------------------------

		const do_lc_get_config_user = (user)=> {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_USER_PLAN_GET, {
				uId			: user? user.id : null, 
				dtBegin 	: initialValues.dtBegin ? initialValues.dtBegin : null, 
				dtEnd		: initialValues.dtEnd 	? initialValues.dtEnd 	: null
			});	
			var fSucces		= [];
			fSucces.push(req_gl_funct(this, do_reponse_config_user, [user]));
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, header, ref, 100000, fSucces, fError);
		}

		const do_reponse_config_user = (sharedJson, user) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data 		= sharedJson[App['const'].RES_DATA];
				if(!user){
					pr_MEM_TEMP[App.data.user.id] = App.data.user;
				}
				
				if(!data.config.uId) {
					data.config.user = pr_MEM_TEMP[data.config.id];
				} else {
					data.config.user = pr_MEM_TEMP[data.config.uId];
				}
//				data.config.user = pr_MEM_TEMP[data.config.uId];
			    
				let isExist = initialValues.dataBind.some(item => item.uId ==  data.config.uId && item.uId ==  data.config.id);
				if(!isExist)  initialValues.dataBind.push(data.config);
				
				if(data.joboff){
					if(initialValues.jobOff[data.config.uId]){
						initialValues.jobOff[data.config.uId] = [...initialValues.jobOff[data.config.uId], ...data.joboff]
					}else{
						initialValues.jobOff[data.config.uId] = [];
						initialValues.jobOff[data.config.uId] = [...initialValues.jobOff[data.config.uId], ...data.joboff];
					}
				}
				if(data.holiday) initialValues.holiday = data.holiday; 
				
				do_lc_transfert_data();
			}
		}
		//--------------------------------------------------------------------------------------

		const do_lc_get_config_user_group = (group)=> {
			let ref 			= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GROUP_PLAN_GET, {
				grpId: group 	? group.id : null
			});	
			var fSucces		= [];
			fSucces.push(req_gl_funct(this, do_reponse_config_user_group, [group]));
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);		
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, header, ref, 100000, fSucces, fError);
		}
		
		const do_reponse_config_user_group = (sharedJson, group) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data 		= sharedJson[App['const'].RES_DATA];
				
				if(data.configLst){
					data.configLst = data.configLst.reduce((curr, item) => {
						if(!item.uId){
							let isExist = initialValues.dataBind.some(cf => cf.id == item.id);
							if(isExist) return curr;
							let user = data.userLst.find(u => u.id == item.id);
							if(user){
								item.user  = user;
								item.group = group;
							}
						} else {
							let isExist = initialValues.dataBind.some(cf => cf.uId == item.uId);
							if(isExist) return curr;
							let user = data.userLst.find(u => u.id == item.uId);
							if(user){
								item.user  = user;
								item.group = group;
							}
						}
//						let isExist = initialValues.dataBind.some(cf => cf.uId == item.uId);
//						if(isExist) return curr;
//						let user = data.userLst.find(u => u.id == item.uId);
//						if(user){
//							item.user  = user;
//							item.group = group;
//						}
						
						return [...curr, item];
					}, []);
					
					initialValues.dataBind = [...initialValues.dataBind, ...data.configLst];
				}
				
				if(data.joboffLst){
					let joboffLst = data.joboffLst;
					for(let i =0; i < joboffLst.length; i++){
						let uId = joboffLst[i].uId01;
					    if(initialValues.jobOff[uId]) initialValues.jobOff[uId].push(joboffLst[i]);
					    else{
					    	initialValues.jobOff[uId] = [joboffLst[i]];
					    }
					}
				}
				do_lc_transfert_data();
			} else {   
				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_list.html`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_LIST);
			}
		}
		
		//--------------------------------------------------------------------------------------
		const do_lc_transfert_data = () => {
			let newLst 	= do_lc_build_data_map(initialValues.dataBind);
			initialValues.team = newLst;
			
			do_lc_show_page(newLst, null);
		}
		//--------------------------------------------------------------------------------------

		const do_lc_build_data_map = data => {
			const reqSrcAvatarMember 		= mem => (mem.avatar ?  mem.avatar.urlPrev : "www/img/prj/users/avatar-1.jpg");
			
			const dataRender = data.reduce((curr, item) => {
				var dtBegin = new Date();
				if(initialValues.dtBegin) dtBegin = req_gl_DateObj_From_DateStr(initialValues.dtBegin);
				
				var dayBegin  = dtBegin.getDate();
			    
				//get joboff
				function buildArray(begin, end){
					let a = [];
					for (let i = begin; i <= end; i++) a.push(i);
					return a;
				}
				
				let arrJoboff = [];
				let arrHalfDay = [];
				if(initialValues.jobOff && initialValues.jobOff[item.uId]){
					let jobOff = initialValues.jobOff[item.uId];
					for(let i = 0; i < jobOff.length; i++){
						let totalOffDays = jobOff[i].val03;
						
						let dateBegin  = req_gl_DateObj_From_DateStr(jobOff[i].dt03);
						let dateEnd    = req_gl_DateObj_From_DateStr(jobOff[i].dt04);
						
						let begin 	= dateBegin.getDate(); 
						let end   	= dateEnd.getDate();
						let arr 	= buildArray(begin, end);
						
						dateBegin.setHours(0,0,0,0);
						dtBegin.setHours(0,0,0,0);
						let diffDays = (dateBegin.getTime() - dtBegin.getTime())/(1000 * 3600 * 24); 
						arr = arr.map((item, index) => dayBegin + diffDays + index);
						
						arrJoboff = [...arrJoboff, ...arr];
						
						if(totalOffDays == 1){
				            arrHalfDay.push(arr[0]);
						}else if(totalOffDays == 2){
							arrHalfDay.push(arr[arr.length - 1]);
						}else if(totalOffDays == 3){
							arrHalfDay.push(arr[0]);
							arrHalfDay.push(arr[arr.length - 1]);
						} 
					}
				}
				
				let arrHoliday = [];
				if(initialValues.holiday){
					let holiday = initialValues.holiday;
					for(let i = 0; i < holiday.length; i++){
						let date  = req_gl_DateObj_From_DateStr(holiday[i].dt);
						date.setHours(0,0,0,0);
						dtBegin.setHours(0,0,0,0);
						let diffDays = (date.getTime() - dtBegin.getTime())/(1000 * 3600 * 24); 
						let day   = dayBegin + diffDays;
						
						arrHoliday = [...arrHoliday, day];
					}
				}
				
				let configD = days;
				var dayColors = {
						'Sunday' 	: configD[0],
						'Monday' 	: configD[1],
						'Tuesday' 	: configD[2],
						'Wednesday' : configD[3],
						'Thursday' 	: configD[4],
						'Friday' 	: configD[5],
						'Saturday' 	: configD[6],
				}
				
				let html   = "";
				let width  = 100/pr_DURATION;
				let color  = "";
				let strDay = "";
				let showDay= "";
				
				for(let i=dayBegin; i < dayBegin + pr_DURATION ; i ++){
					let day     = new Date(dtBegin.getFullYear(), dtBegin.getMonth(), i);
					var dayName = days[day.getDay()];
					let codeC   = dayColors[dayName];
					strDay = req_gl_DateStr_From_DateObj(day);
					showDay= req_gl_DateStr_LocalFormatShort(strDay)
					
					let classEvent = "";
					if(arrHoliday.includes(i)){
						color  = initialValues.colors["CP"];
					}else if(arrJoboff.includes(i)){
						if(arrHalfDay.includes(i)){
							color = initialValues.colors["H"];
						}else {
							color  = initialValues.colors["A"];
						}
					}else if (dayName === 'Saturday' || dayName === 'Sunday') {
				        color = initialValues.colors["A"];
					}else {
				        color = initialValues.colors["F"];
				        classEvent = codeC !== "A" ? "li-show-appoint" : "";
				    }
					if(!item.uId){
						html +=  `<li class="li-team-planning ${classEvent}" data-id="${item.id}" style="background-color:${color}; width:${width}%;" data-date="${strDay}" title="${showDay}"></li>`
					} else {
						html +=  `<li class="li-team-planning ${classEvent}" data-id="${item.uId}" style="background-color:${color}; width:${width}%;" data-date="${strDay}" title="${showDay}"></li>`
					}
//					html +=  `<li class="li-team-planning ${classEvent}" data-id="${item.uId}" style="background-color:${color}; width:${width}%;" data-date="${strDay}" title="${showDay}"></li>` 
				}
				
				
				let newItem 			= {};
				newItem["open"] 		= true;
				newItem["start_date"] 	= new Date(dtBegin.getFullYear(), dtBegin.getMonth(), dayBegin); 
				newItem["duration"] 	= pr_DURATION + "";
				newItem["user"]     	= item.user;
				newItem["group"]     	= item.group? item.group: null;
				
				newItem["users"] 		= `<a data-url='view_prj_user_profile.html?id=${item.user.id}&code=${item.user.login01}' data-route="VI_MAIN/prj_user_profile_ent" class='hnv-route cursor-pointer text-dark'>
						<img src="${reqSrcAvatarMember(item.user)}" class="rounded-circle avatar-xxs m-1" title="${item.user.login01}" alt="${item.user.login01}" onerror="this.src='www/img/prj/users/avatar-1.jpg'">
				</a>`;
				
				if(!item.user.avatar){
					let textColor   = null;
					let textAvatar  = null
					let first = item.user.login01.charAt(0);
					let last  = item.user.login01.charAt(item.user.login01.length - 1);
					let index = var_gl_alphabet.indexOf(first.toLowerCase());

					textColor = var_gl_colors[index];
					textAvatar= first + last;
					
					newItem["users"] = `<div class="rounded-circle avatar-xxs text-white text-uppercase text-center mt-1" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div>`;
				}
				
				newItem["text"]  = `<ul class="ul-team-planning">${html}</ul`;
				
				curr.push(newItem);
				return curr;
			}, []);
			
			return dataRender;
		}
		//--------------------------------------------------------------------------------------

		const do_lc_show_page = (newLst, links) => {
			gantt.clearAll();
			
			gantt.config.add_column 		= false;
			gantt.config.columns 			= [
				{
					name	: "Action"	, 
					label	: $.i18n('common_btn_remove')	, 
					align	: "center"	, 
					width	: 50,
					template: item => (	item.group 						?  		`<div class="remove-user cursor-pointer" data-id="${item.user.id}" data-groupid="${item.group.id}"><i class="bx bx-trash text-danger"></i></div>` :  
										item.user.id == App.data.user.id? ""  : `<div class="remove-user cursor-pointer" data-id=${item.user.id}><i class="bx bx-trash text-danger"></i></div>`)
				},
				
				{
					name	: "text"	, 
					label	: $.i18n('prj_project_member')	, 
					align	: "center"	, 
					width	: 60,
					template: item => (item.users ? item.users : "")
				},
				{
					name	: "assigned", 
					label	: ""	, 
					align	: "center"	, 
					width	: 90,
					template: item => (item.user ? item.user.login01 : "")
				},
				{
					name	: "appointment"	, 
					label	: $.i18n('prj_project_sidebar_schedule')			, 
					width	: 50			, 
					align	: "center",
					template: item => `<button class="btn btn-primary btn-show-appointment" data-id=${item.user.id}><i class="bx bx-calendar"></i></button>`
				},
				
				{
					name	: "group"	, 
					label	: $.i18n('prj_chat_group')			, 
					width	: 100			, 
					align	: "center",
					template: item => (item.group ? item.group.name : "")
				},
			];
			
			gantt.config.scales = [
				{unit: "month"	, step: 1, format: "%F, %Y"},
				{unit: "day"	, step: 1, format: "%j, %D"}
			];
			
			gantt.i18n.addLocale("vn", pr_GANTT_CONFIG_VN);
			gantt.i18n.setLocale(App.language);
			
			gantt.init(`gantt_here`);
			gantt.parse({data: newLst, links});//users_data
			
			
			gantt.attachEvent("onGanttReady", function(){
				  gantt.event(gantt.$container, "click", function(e){
					  do_bind_gantt_event(e.target);
				  });
				}, {once: true});
		}
		
		
		const do_bind_gantt_event = (target) => {
			
//			console.log(target.classList.contains("li-team-planning"));
			
			if (target.classList.contains("btn-show-appointment")){
				let {id : uId} = $(target).data();
				uId && do_lc_get_appointement(uId);
				return;
			}
			if (target.classList.contains("li-show-appoint")){
				let {date} = $(target).data();
				let {id :uId} = $(target).data();
				date && do_lc_get_appointement_by_day(date, uId);
				return;
			}
			if (target.classList.contains("remove-user")){
				let {id : uId, groupid : grpId} = $(target).data();
				if(grpId) delete pr_GROUP_TEMP[grpId];
				else if(uId)      delete pr_MEM_TEMP[uId];
				initialValues.dataBind = initialValues.dataBind.filter (item => item.id !== uId && item.uId !== uId);
				do_lc_transfert_data();
				$(".dhtmlx_message_area").hide();
			}
			if (target.classList.contains("rounded-circle")){
				App.router.controller.do_lc_run("VI_MAIN/prj_user_profile_ent", `view_prj_user_profile.html`)
				return;
			}
		}
		
		//--------------------------------------------------------------------------------------
		
		const do_lc_bind_event_filter = () => {
			$(".input-date-begin-search").off("change").on("change", function(){
				var dataDate = req_gl_data({
					dataZoneDom: $("#div_date_period")
				});
				
				do_lc_init_params();
				let dtBegin = dataDate.data.dtBegin;
				let dtEnd   = dataDate.data.dtEnd;
				if(dtEnd){
					var date1 = req_gl_DateObj_From_DateStr(dtBegin);
					var date2 = req_gl_DateObj_From_DateStr(dtEnd);
					
					let diffDays = (date2.getTime() - date1.getTime())/(1000 * 3600 * 24)+1; 
					if(diffDays > 60){
						do_gl_show_Notify_Msg_Error ($.i18n('prj_user_team_planning_msg_day_error'));
						return;
					}
					pr_DURATION = diffDays;
					
				}
				initialValues.dtEnd 	= dtEnd;
				initialValues.dtBegin 	= dtBegin;
				dtBegin && do_lc_get_config_user();
			})
			
			$(".input-date-end-search").off("change").on("change", function(){
				var dataDate = req_gl_data({
					dataZoneDom: $("#div_date_period")
				});
				
				do_lc_init_params();
				let dtBegin = dataDate.data.dtBegin;
				let dtEnd   = dataDate.data.dtEnd;
				
				if(!dtEnd){
					var date = req_gl_DateObj_From_DateStr(dtEnd);
					dtBegin = new Date(date.setDate(date.getDate()-30))
					dtBegin = req_gl_DateStr_From_DateObj(dtBegin);
				}else{
					var date1 = req_gl_DateObj_From_DateStr(dtBegin);
					var date2 = req_gl_DateObj_From_DateStr(dtEnd);
					
					let diffDays = (date2.getTime() - date1.getTime())/(1000 * 3600 * 24)+1; 
					if(diffDays > 60){
						do_gl_show_Notify_Msg_Error ($.i18n('prj_user_team_planning_msg_day_error'));
						return;
					}
					pr_DURATION = diffDays;
					
				}
				initialValues.dtBegin 	= dtBegin;
				initialValues.dtEnd 	= dtEnd;
				
				do_lc_get_config_user();
			})
		}
		//--------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------

		const do_lc_get_appointement = (uId) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GROUP_PLAN_GET_APPOINTMENT_LIST, {
				uId: uId? uId : null, 
				dtBegin : initialValues.dtBegin ? initialValues.dtBegin : null, 
				dtEnd: initialValues.dtEnd ? initialValues.dtEnd : null
			});	
			var fSucces		= [];
			fSucces.push(req_gl_funct(this, do_reponse_appointment_list, []));
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, header, ref, 100000, fSucces, fError);
		}
		
		const do_reponse_appointment_list = (sharedJson) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				do_lc_show_list_appoint_popup(data);
			} else {   
			}
		}
		
		//--------------------------------------------------------------------------------------

		const do_lc_get_appointement_by_day = (date, uId) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GROUP_PLAN_GET_APPOINTMENT_LIST_BY_DATE, {date, uId});	
			var fSucces		= [];
			fSucces.push(req_gl_funct(this, do_reponse_appointment_list_by_date, [date]));
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, header, ref, 100000, fSucces, fError);
		}
		
		const do_reponse_appointment_list_by_date = (sharedJson, date) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				do_lc_show_list_appoint_popup(data, date);
			} else {   
			}
		}
		
		const do_lc_show_list_appoint_popup = (data, date) => {
			let isInDay = false;
			let title = $.i18n("prj_user_team_planning_appoint");
			if(date){
				isInDay = true;
				title = $.i18n("prj_user_team_planning_all_appoint") + " - " + req_gl_DateStr_LocalFormatShort(date);
			}

			data.map(e => {
				if(e.inf02 && typeof e.inf02 === 'string') {
					e.inf02 = JSON.parse(e.inf02)
				}
			})

			App.MsgboxController.do_lc_show({
				title		: title,
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USERTEAMPLANNING_LIST_APPOINT_POPUP, {"data" : data, isInDay}),
				autoclose	: false,
				buttons		: {
					OK: {
						lab			: $.i18n("common_btn_ok"),
						classBtn	: "btn-primary"
					}
				}
			});	
			
			App.router.controller.do_lc_binding_route()
		}
	};

	return UserTeamPlanningEnt;
});