define([
	'text!group/prj/test/tmpl/PrjTestUnit_EntCreate.html',
	'text!group/prj/test/tmpl/PrjTestUnit_EntNew.html',
	],
	function(
			PrjTestUnit_EntCreate,
			PrjTestUnit_EntNew
	) {

	const PrjTestUnitEntNew     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------

		var self 					= this;		
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
		const pr_SV_NEW				= "SVNew"; 
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		//-----------------------------------------------------------------------------------
		const pr_SERVICE_PER_CLASS	= "ServicePersonDyn";
		const pr_SV_USER_SEARCH		= "SVUserLstSearchWithAvatar";

		var members 					= {};
		const pr_member_lev_manager 	= 0;

		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;
		//---------------------------------Const--------------------------------------------------
		const pr_LEVEL_PRJ				= 1;
		const pr_LEVEL_EPIC				= 2;
		const pr_LEVEL_TASK				= 3;

		const pr_TYPE02_PRJ 			= 0;
		const pr_TYPE02_EPIC 			= 1;
		const pr_TYPE02_TASK 			= 2;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 						= App.controller.PrjTestUnit.Main;
			
			
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
			
			tmplName.PRJ_TESTUNIT_ENT_CREATE	= "PrjTestUnit_EntCreate";
			tmplName.PRJ_TESTUNIT_ENT_NEW		= "PrjTestUnit_EntNew";
			
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_TESTUNIT_ENT_CREATE					, PrjTestUnit_EntCreate);
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_TESTUNIT_ENT_NEW						, PrjTestUnit_EntNew);
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj = {files: []}, mode){		
			members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};
			
			$("#div_main_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTUNIT_ENT_CREATE	, {}));
			$("#div_prj_new")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTUNIT_ENT_NEW	, {lev: pr_LEVEL_PRJ, typ02: pr_TYPE02_PRJ, currencys: App.data.currencys}));
			
			do_lc_init_element(obj);
			do_lc_bind_event(obj);
		}

		const do_lc_init_element = obj => {
			let option		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_prj_avatar"), option);
			
			const lstInpFile = do_gl_init_fileDropzone($("#div_prj_docs"), {obj,
				fileinput	: {param : {typ01: 2, typ02: 10} },
			});//file input

			App.SummerNoteController.do_lc_show("#div_create_prj");//text editor
			
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

		const do_lc_convert_date = objDate => objDate.date.substr(0, 10) + " " + objDate.time.substr(0, 5) + ":00";

		const do_lc_req_autocomplete = () => {
			let el = ".inp-name-member";
			members = {}
			let customShowList = function(item, selOpt = ""){
				if(item.avatar)			return	selOpt 			+= `<img src='${item.avatar.urlPrev}' class='rounded-circle avatar-xs'/> ${item.login01}`;
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
				if(item.avatar) selOpt 			+= `<div><img src='${item.avatar.urlPrev}' class='rounded-circle avatar-xs'/> ${item.login01}`;
				else 			selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}`;

				selOpt 				+= `<a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt 				+= `</div></div>`;

				$("#div_list_member").append(selOpt);
				do_lc_bind_event_autocomplete();
				$(el).blur().val("");
			}

			let options = {
					dataService : [pr_SERVICE_PER_CLASS, pr_SV_USER_SEARCH], fSelect: reqSelectMember, customShowList
			}
			do_gl_req_autocompleteNew(el, options);
		}

		const do_lc_bind_event_autocomplete = () => {
			$(".btn-remove-member").off("click").on("click", function(){
				let $this 	= $(this);
				let parent 	= $this.parent();
				let {id} 	= $this.data();

//				if(members.id)	delete members.id;
				if(members[id])	delete members[id];
				parent.remove();
			})
		}

		const do_lc_create_prj = prj => {
			let dataSend	= {obj: JSON.stringify(prj), member: JSON.stringify(Object.values(members))};
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW, dataSend);			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_show_prj, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_show_prj = (sharedJson, prj) => {
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_content.html?id=${data.id}&code=${data.code01}`, "VI_MAIN/"+ App.router.part.PRJ_TESTUNIT_ENT, [data.id]);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		
		const do_lc_bind_event = obj => {
			$("#btn_create_prj").off("click").on("click", function(){ //async
				try {
					let	data	 		= req_gl_data({
						dataZoneDom		: $("#div_create_prj")
					});

					let $projectdesc 	= $("#projectdesc");
					if ($projectdesc.summernote('isEmpty')){
						$projectdesc.parent().append("<div class='errMsg'>" + $.i18n("validator_err_required") + "</div>")
						$projectdesc.parent().find(".note-editor").addClass("inp-error");
						return false;
					}

					if(data.hasError)	return false;
					
//					await do_gl_send_data_with_dropzone(); // if not auto send file, add line and async to function on event

					let prj 	= data.data;
					prj.files 	= obj.files;
					prj.dtBegin = do_lc_convert_date(prj.dtBegin);
					prj.dtEnd 	= do_lc_convert_date(prj.dtEnd);
					prj.typ02 	= pr_TYPE02_PRJ;
					
					do_lc_create_prj(prj);
				} catch (e) {
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
				}
			})

			do_lc_req_autocomplete();
		};
	}

	return PrjTestUnitEntNew;
});