define(['jquery','prjImageViewer/viewer'], function($,Viewer) {
	
	var EntTabHistMedical 					= function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var pr_ctr_List 			= App.controller[pr_grpName].List;
		var pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		
		var pr_divHeader 			= header  	? header : null;
		var pr_divContent 			= content  	? content : "#div_entity_view";
		var pr_divFooter 			= footer  	? footer : null;
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		
		const pr_SERVICE_CLASS			= "ServicePerClient"; //to change by your need
		const pr_SERVICE_CLASS_CATE		= "ServiceTpyCategory"; //to change by your need
		const pr_SERVICE_CLASS_MEDICINE	= "ServiceMatMaterial";
		const pr_SV_LIST_MEDICINE		= "SVSearch"; 
		const pr_SV_GET_BY_ID			= "SVGetHistMedicineById"; 
		const pr_SV_GET_CAT				= "SVGet"; 
		const pr_SV_GET_LST				= "SVLstPage"; 
		const pr_SV_LIST_PAGE			= "SVGetHistMedicine"; 
		const pr_SV_NEW					= "SVNew"; 
		const pr_SV_MOD					= "SVModHistMedicine"; 
		const pr_SV_DEL					= "SVDel"; 
		//------------------------------------------------------------------------------------
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		const pr_TYP_MEDICINE 		= 200;
		const pr_TYP_NAME_MEDICINE 	= 2;
		const pr_STAT_ACTIVE		= 1;
		
		const pr_typ_sav_draft      = 0;
		const pr_typ_sav_done       = 1;
		var   pr_id_entity			= null;
		var   pr_id_person			= null;
		//------------------const object------------------------------------------------------
		//-----------------------------------------------------------------------------------
		this.do_lc_init				= function(){
			pr_ctr_Main 			= App.controller.UI.Main;

			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(ent, mode){               
			try{
				do_lc_show_entity(ent, mode);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "Ent", "do_lc_show", e.toString()) ;
			}
		};
		
		var do_lc_show_entity 			= function(ent, mode){
			do_lc_show_info_medical 		(ent);
			do_lc_show_his_disease 			(ent);
		}
		
		var do_lc_show_info_medical 			= function(ent){
			pr_id_person = ent.id
			$(pr_divContent				).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL				, ent));
			
			$("#btn_new_entity").off("click").on("click", function () {
				do_lc_show_ent_new(ent)
			})
		}
		var do_lc_show_ent_new 	= function(ent){
	//		pr_id_person = ent.id
			$("#div_ent_his_content").html("");
			do_lc_show_his_content_new		(ent);
			do_lc_show_his_prescription		();
			do_lc_show_his_test_blood		();
			do_lc_show_his_test_img 		();
		}
		var do_lc_show_his_disease 			= function(ent){
			$("#div_entity_his_medical").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_LIST				, ent));
			do_lc_list_ByAjax_his_disease(ent)
		}
		var do_lc_list_ByAjax_his_disease 	= function(ent){
			let divList = $("#list_his_disease");
			let divPan  = $("#div_list_pagination_disease");
			
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST_PAGE, {	perId: ent.entId || ent.id  });
			
			const callbackFunct 	= data => do_get_list_ByAjax_callback(data, ent);
			
			let opt = {
					divMain			: divList,
					divPagination	: divPan,
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: 9,
					pageRange		: 1,
					callback		: callbackFunct
			};
			
			do_gl_init_pagination_opt(opt);
		}
		var do_get_list_ByAjax_callback = function(sharedJson, ent){
			let template		=  tmplName.TMPL_ENT_TAB_HIS_MEDICAL_LIST_CONTENT;
			let data			= {};
			
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				data		= sharedJson[App['const'].RES_DATA]
			}
			
			$("#list_his_disease")	.html(tmplCtrl.req_lc_compile_tmpl(template		, { "data": data.lst }));
		//	$("#list_his_disease")	.html("");
			do_lc_bind_event_his_disease(ent)
		}
		var do_lc_show_his_content_new 	= function(ent,id){
			$("#div_ent_his_content_new").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT_NEW		, ent,{idEnty: id}));
			var now 	= new Date();
			dateNow		= do_lc_handle_date (now);
			$("#dtpicker_exp" ).datepicker( "setDate", dateNow.dt);
			const user = App.data.user
			$("#name_doctor")	.val(user.name);
			$("#code_doctor")	.val(user.per.code01);
			$("#room_medicine")	.val(user.per.inf03);
			App.SummerNoteController.do_lc_show("#div_show_sympton");//text editor
			App.SummerNoteController.do_lc_show("#div_show_dignose");//text editor
			App.SummerNoteController.do_lc_show("#div_show_note");//text editor
			do_get_list_disease_ByAjax()
			do_lc_bind_event_content_new(ent)
		}
		var do_lc_show_his_prescription 			= function(ent,stat){
			$("#div_ent_his_prescription").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_PRESCRIPT		, ent, {stat: stat}));
			$("#btn_mod_prescription").off("click").on("click", function(){
				do_lc_show_entity_prescription(ent);
			});
		}
		var do_lc_show_his_test_blood 			= function(ent,stat){
			$('#div_ent_his_test_blood').removeClass('hide');
			$("#div_ent_his_test_blood").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_BLOOD				, ent, {stat: stat}));
			$("#btn_mod_blood").off("click").on("click", function(){
				do_lc_show_entity_blood(ent);
			});
		}
		var do_lc_show_his_test_img 			= function(ent,stat){
			$('#div_ent_his_test_img').removeClass('hide');
			$("#div_ent_his_test_img").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_IMG				, ent, {stat: stat}));
			$("#btn_mod_img").off("click").on("click", function(){
				do_lc_show_entity_img(ent);
			});
		}
		const do_lc_show_entity_prescription = (data) => {
			$("#btn_mod_prescription"		).addClass("hide");
			$(".info-show-prescription"		).addClass('hide');
			
			$("#a_btn_sav_prescription"		).removeClass("hide");
			$("#a_btn_canc_prescription"	).removeClass("hide");
			
			$('#btnAddPrescription'			).removeClass('hide');
			$('.btnRemoveRowPrescription'	).removeClass('hide');
			$('.inf-entity-prescription'	).removeClass('hide');
			
			$('#btnAddPrescription').on('click', function() {
				do_lc_bind_event_new_prescription(data);
		    });
			
			$('.btnRemoveRowPrescription>button').on('click', function() {
				$(this).closest('tr').remove();
			});
			
			$('#a_btn_canc_prescription'	).on('click', function() {
				do_lc_show_his_prescription 	(data);
			});
			
			$("#a_btn_sav_prescription").off("click").on("click", function(){
				let	obj	 			= req_gl_data({
					dataZoneDom		: $("#table_prescription"),
				});
			
				if(obj.hasError)	return;
				inforPrescription = {}
				idPer = data.id
				inforPrescription.inf05 			= obj.data.inf05;
				if (inforPrescription.inf05)
					inforPrescription.inf05		= inforImg.inf05.filter(element => element !== null && element !== undefined);
				do_lc_save_entity_prescription(inforPrescription,idPer,pr_id_entity, do_lc_show_ent_edit);
			});
		}
		const do_lc_show_entity_blood = (data) => {
			$("#btn_mod_blood"					).addClass("hide");
			$(".info-show-blood"				).addClass('hide');
			
			$("#a_btn_sav_blood"				).removeClass("hide");
			$("#a_btn_canc_blood"				).removeClass("hide");
			
			$('#btnAddBlood'					).removeClass('hide');
			$('.btnRemoveRowBlood'				).removeClass('hide');
			$('.inf-entity-blood'				).removeClass('hide');
			
			$('#btnAddBlood').on('click', function() {
				do_lc_bind_event_new_blood(data);
		    });
			
			$('.btnRemoveRowBlood>button').on('click', function() {
				$(this).closest('tr').remove();
			});
			
			$('#a_btn_canc_blood'	).on('click', function() {
				do_lc_show_his_test_blood 	(data);
			});
			
			$("#a_btn_sav_blood").off("click").on("click", function(){
				let	obj	 			= req_gl_data({
					dataZoneDom		: $("#table_blood"),
				});
			
				if(obj.hasError)	return;
				inforBlood = {}
				idPer = pr_id_person
				inforBlood.inf06 			= obj.data.inf06;
				if (inforBlood.inf06)
					inforBlood.inf06		= inforBlood.inf06.filter(element => element !== null && element !== undefined);
				do_lc_save_entity_blood(inforBlood,idPer,pr_id_entity, do_lc_show_ent_edit);
			});
		}
		const do_lc_show_entity_img = (data) => {
			$(".info-show-img"			).addClass('hide');
			$("#btn_mod_img"			).addClass("hide");
			$("#a_btn_sav_img"			).removeClass("hide");
			$("#a_btn_canc_img"			).removeClass("hide");
			
			$('#btnAddImg'				).removeClass('hide');
			$('.btnRemoveRowImg'		).removeClass('hide');
			$('.inf-entity-img'			).removeClass('hide');
			
			$('#btnAddImg').on('click', function() {
				do_lc_bind_event_new_img(data);
		    });
			
			$('.btnRemoveRowImg>button').on('click', function() {
				$(this).closest('tr').remove();
			});
			
			$('#a_btn_canc_img').on('click', function() {
				do_lc_show_his_test_img 	(data);
			});
			
			$("#a_btn_sav_img").off("click").on("click", function(){
				let	obj	 			= req_gl_data({
					dataZoneDom		: $("#table_img"),
				});
			
				if(obj.hasError)	return;
				inforImg = {}
				idPer = pr_id_person
				inforImg.inf07 			= obj.data.inf07;
				if (inforImg.inf07)
					inforImg.inf07		= inforImg.inf07.filter(element => element !== null && element !== undefined);
				do_lc_save_entity_img(inforImg,idPer,pr_id_entity, do_lc_show_ent_edit);
			});
		}
		const do_lc_bind_event_new_prescription = function(data) {		
		//	do_get_list_medicine_ByAjax()	
		 	const maxIndex 	= Math.max(0, ...$('#tbody_entity_chronic').find('input[data-name="index"]').map(function () {
		        return parseInt($(this).val()) || 0;
		    }).get()) +1;
		    
			const newRow 	= tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_PRESCRIPT_ADD, { index: maxIndex });
		    const addedRow 	= $('#tbody_entity_prescription').append(newRow).find('tr').last();
		
		    addedRow.find('input[data-name="index"]').val(maxIndex).end()[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		    
			$(".btnRemoveRowPrescription>button").off("click").on("click", function () {
		        $(this).closest('tr').remove();
		    });
			 const calculateTotal = function() {	
		        const morning = parseFloat($("#number_morning").val()) || 0;
		        const lunch = parseFloat($("#number_lunch").val()) || 0;
		        const afternoon = parseFloat($("#number_afternoon").val()) || 0;
		        const dark = parseFloat($("#number_dark").val()) || 0;
		        const day = parseFloat($("#number_day").val()) || 0;
		        const total = (morning + lunch + afternoon + dark) * day;
		        $("#total").val(total); 
		    }
			$("#number_morning, #number_lunch, #number_afternoon, #number_dark, #number_day").on("input", calculateTotal);
		    // Pharmaceuticals
			let el = "#inp_pharmaceuticals";
			let reqSelectMedicine = (event, item) => {
				let selOpt 			= `<div class='medicine-item'>`;
				selOpt 				+= `<div class="media align-items-center"><div class="mr-1 text-center"">${item.name01}</div>`;

				selOpt 				+= `<a data-id='${item.id}' class='text-danger btn-remove-medicine' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt 				+= `</div>`;
				
				let selOptIngre 	= `<div class='medicine-item-ingre'>`;
				selOptIngre 				+= `<div class="media align-items-center"><div class="mr-1 text-center"">${item.name02}</div>`;

				selOptIngre 				+= `<a data-id='${item.id}' class='text-danger btn-remove-ingre' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOptIngre 				+= `</div>`;
				
				let selOptCode 		= `<div class='medicine-item-code'>`;
				selOptCode 				+= `<div class="media align-items-center"><div class="mr-1 text-center"">${item.code01}</div>`;

				selOptCode 				+= `<a data-id='${item.id}' class='text-danger btn-remove-code' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOptCode 				+= `</div>`;
				
				$("#selected_medicine").removeClass("hide")
				$("#selected_ingre").removeClass("hide")
				$("#selected_code").removeClass("hide")
				
				$("#selected_medicine").append(selOpt);
				$("#selected_ingre").append(selOptIngre);
				$("#selected_code").append(selOptCode);
				
				$("#inp_pharmaceuticals").hide();
				$("#inp_ingre").hide();
				$("#inp_code").hide();
				
				$("#inp_pharmaceuticals").val(item.name01);
				$("#inp_ingre").val(item.name02);
				$("#inp_code").val(item.code01);
				do_lc_bind_event_autocomplete();
				$(el).blur().val("");
			}
			let options = {
				dataService: [pr_SERVICE_CLASS_MEDICINE, pr_SV_LIST_MEDICINE],
				svParams: { 
					typ03 	: pr_TYP_MEDICINE,
					searchType: pr_TYP_NAME_MEDICINE,
				 },
				fSelect			: reqSelectMedicine, 
				customShowList: do_lc_Lst_medicine_autocomplete,
			};
			do_gl_req_autocompleteNew(el, options);
			
			 // Ingredient
			let elIn = "#inp_ingre";
			let reqSelectMedicineIngre = (event, item) => {
				let selOptIngre 	= `<div class='medicine-item'>`;
				selOpt 				+= `<div class="media align-items-center"><div class="mr-1 text-center"">${item.name02}</div>`;

				selOpt 				+= `<a data-id='${item.id}' class='text-danger btn-remove-medicine' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt 				+= `</div>`;
				
				$("#selected_medicine").removeClass("hide")
				$("#selected_ingre").removeClass("hide")
				$("#selected_code").removeClass("hide")
				
				$("#selected_medicine").append(selOpt);
				$("#selected_ingre").append(selOptIngre);
				$("#selected_ingre").append(selOptCode);
				
				$("#inp_pharmaceuticals").hide();
				$("#inp_ingre").hide();
				$("#inp_code").hide();
				do_lc_bind_event_autocomplete();
				$(elIn).blur().val("");
			}
			let optionsIngre = {
				dataService: [pr_SERVICE_CLASS_MEDICINE, pr_SV_LIST_MEDICINE],
				svParams: { 
					typ03 	: pr_TYP_MEDICINE,
					searchType: pr_TYP_NAME_MEDICINE,
				 },
				fSelect			: reqSelectMedicineIngre, 
				customShowList: do_lc_Lst_medicine_inGre_autocomplete,
			};
			do_gl_req_autocompleteNew(elIn, optionsIngre);
			
		};
		const do_lc_Lst_medicine_autocomplete = function (item, selOpt = "") {
			selOpt += `<div class="media align-items-center"> ${item.name01}</div>`;
		    return selOpt;
		};
		const do_lc_bind_event_new_blood = function(data) {			
		    const maxIndex 	= Math.max(0, ...$('#tbody_entity_blood').find('input[data-name="index"]').map(function () {
		        return parseInt($(this).val()) || 0;
		    }).get()) +1;
		    
			const newRow 	= tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_BLOOD_ADD, { index: maxIndex });
		    const addedRow 	= $('#tbody_entity_blood').append(newRow).find('tr').last();
		
		    addedRow.find('input[data-name="index"]').val(maxIndex).end()[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		    
			$(".btnRemoveRowBlood>button").off("click").on("click", function () {
		        $(this).closest('tr').remove();
		    });
		};
		
		const do_lc_bind_event_new_img = function(data) {			
		    const maxIndex 	= Math.max(0, ...$('#tbody_entity_img').find('input[data-name="index"]').map(function () {
		        return parseInt($(this).val()) || 0;
		    }).get()) +1;
		    
			const newRow 	= tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_IMG_ADD, { index: maxIndex });
		    const addedRow 	= $('#tbody_entity_img').append(newRow).find('tr').last();
		
		    addedRow.find('input[data-name="index"]').val(maxIndex).end()[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		    
			$(".btnRemoveRowImg>button").off("click").on("click", function () {
		        $(this).closest('tr').remove();
		    });
		};
		
		const do_lc_save_entity_prescription = function(myObject,idPer,idEnt, callback){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: myObject,perId:idPer});
			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_save_entity_prescription_callback, [myObject, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_save_entity_prescription_callback = function(sharedJson, entity, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let ent 	= sharedJson[App['const'].RES_DATA];
				do_lc_clean_data(ent)
				pr_id_entity = ent.id
				if (callback) callback (ent);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		const do_lc_save_entity_blood = function(myObject,idPer,idEnt, callback){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: myObject,perId:idPer});
			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_save_entity_blood_callback, [myObject, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_save_entity_blood_callback = function(sharedJson, entity, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let ent 	= sharedJson[App['const'].RES_DATA];
				do_lc_clean_data(ent)
				pr_id_entity = ent.id
				if (callback) callback (ent);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		const do_lc_save_entity_img = function(myObject,idPer,idEnt, callback){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: myObject,perId:idPer});
			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_save_entity_img_callback, [myObject, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_save_entity_img_callback = function(sharedJson, entity, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let ent 	= sharedJson[App['const'].RES_DATA];
				do_lc_clean_data(ent)
				pr_id_entity = ent.id
				if (callback) callback (ent);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		var do_lc_bind_event_his_disease 			= function(ent){
			$(".infor-get").off("click").on("click", function () {
			    let { id, stat } = $(this).data(); 
			    let $span = $(this).find("span"); 
			
			    if ($span.hasClass("mdi-eye-outline")) {
					$span.removeClass("mdi-eye-outline").addClass("mdi-eye-off-outline");
			        $("#div_ent_his_content").html("");
			        $("#div_ent_his_prescription").html("");
			        $("#div_ent_his_test_blood").html("");
			        $("#div_ent_his_test_img").html("");
			    } else {
			        $span.removeClass("mdi-eye-off-outline").addClass("mdi-eye-outline");
			        do_lc_get_his_content(id, stat);
			    }
			});

		}		
		var do_lc_bind_event_content_new 			= function(ent){
			$("#cancel_header").off("click").on("click",function(){
					//---MsgBox
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("msgbox_confirm_cancel_create"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("prj_user_group_new_btn_back"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("prj_user_group_new_btn_cancel"),
								funct	: self.do_lc_cancel,
								param	: [ent],
								classBtn: "btn-danger"
							}
						}
					});
			})
			$("#btn_sav_entity").off("click").on("click",function(){
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("per_person_patient_title"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("prj_user_group_new_btn_cancel"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("prj_user_group_new_btn_save_record"),
								funct	: self.do_lc_mod,
								param	: [pr_id_person,pr_typ_sav_done],
								classBtn: "btn-primary"
							}
						}
					});
			})
			$("#btn_sav_draft_entity").off("click").on("click",function(){
				self.do_lc_mod(pr_id_person,pr_typ_sav_draft)
			})
			$('#radio_remote_checkbox').on('change', function() {
	            if ($(this).prop('checked')) {
	                $('#hist_date')			.removeClass('hide');
	                $('#hist_date_calendar').removeClass('hide');
	            } else {
	                $('#hist_date')			.addClass('hide');
	                $('#hist_date_calendar').addClass('hide');
	            }
        	});
        	
        	$(".infor-get").off("click").on("click", function () {
				let {id} =  $(this).data();
				do_lc_get_his_content		(id);
		//		do_lc_show_his_content		(ent);
		//		do_lc_show_his_prescription	(ent);
		//		do_lc_show_his_test_blood		(ent);
		//		do_lc_show_his_test_img 		(ent);
			})
		}		
		const do_lc_get_his_content = function(id,stat) {
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_BY_ID, {id: id});	
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_his_callback, [stat]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_get_his_callback = function(sharedJson,stat){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					$("#div_ent_his_content_new").html("");
					do_lc_clean_data(data)
					do_lc_show_his_content		(data,stat);
					do_lc_show_his_prescription	(data,stat);
					do_lc_show_his_test_blood	(data,stat);
					do_lc_show_his_test_img 	(data,stat);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		var do_lc_show_his_content 			= function(ent,stat){
			$("#div_ent_his_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT				,ent, {stat: stat}));
			
			$("#cancel_header").off("click").on("click",function(){
					//---MsgBox
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("msgbox_confirm_cancel_create"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("prj_user_group_new_btn_back"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("prj_user_group_new_btn_cancel"),
								funct	: self.do_lc_cancel,
								param	: [ent],
								classBtn: "btn-danger"
							}
						}
					});
			})
			$("#btn_mod_content").off("click").on("click",function(){
				do_lc_show_ent_edit(ent)
			})
		}
		
		//----------------------------------------------------------------------------------------------
		var do_lc_handle_date = (strDate) => {
			let tmp = getDateEN(strDate);
			let res = {};
			res.dt = tmp.slice(0, 10);
			res.tm = tmp.slice(11, 16);
			return res;
		}
		var getDateEN = function(dObj) {
			return req_gl_DateStr_From_DateObj(dObj, DateFormat.masks.enFullDate);		
		}
		this.do_lc_mod = function(id,stat){
			const data = req_gl_data({
				dataZoneDom: $("#frm_entity")
			});

			if(data.hasError)	return false;
			
			data.data.perId = id;
			data.data.stat  = stat;
			data.data.entyId = pr_id_entity;
			do_lc_update_entity(data.data);
		}
		const do_lc_update_entity = function(ent) {
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: JSON.stringify(ent),perId: ent.perId});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_update_entity_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_update_entity_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_lc_clean_data(data)
					do_lc_show_entity(data, var_lc_MODE_SEL);
					do_gl_show_Notify_Msg_Success 	($.i18n("common_success_update") );
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		const do_get_list_disease_ByAjax = function(){	
			var ref 	= req_gl_Request_Content_Send(pr_SERVICE_CLASS_CATE, pr_SV_GET_LST);
			ref.typ01s 	= 300;
			ref.stats = 1;
			ref.hardLoad = false;
			var fSucces	= [];
			fSucces.push(req_gl_funct(		null, do_lc_show_list_disease_ByAjax_Dyn, [true]));
			var fError 		= req_gl_funct(	null, do_lc_show_list_disease_ByAjax_Dyn, [false]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);

		}
		const do_lc_show_list_disease_ByAjax_Dyn = function(sharedJson, divList){
			const isSuccess = can_gl_AjaxSuccess(sharedJson);
			if(isSuccess) {
				const list = sharedJson[App['const'].RES_DATA] || {};
				let lst = list.lst || [];
				const data = { lst: lst };
				$("#select_icd_main").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT_MAIN_SELECT, data));
				do_lc_bind_event_select_icd_main(data)
			//	do_lc_req_autocomplete_all();
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_get"));
			}
		}
		const do_lc_get_disease_sub_entity = (id) => {
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_CATE, pr_SV_GET_CAT, {id: id, wChild: true});	

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_get_disease_sub_callback, []));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
			
		const do_lc_get_disease_sub_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					console.log(data)
					$("#select_icd_sub").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT_SUB_SELECT, data));
					do_lc_bind_event_select_icd_sub(data)
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		var do_lc_bind_event_select_icd_main 			= function(ent){
			$('#select_icd_main').on('change', function () {
		        var selectedValue = $(this).val();
		        var selectedObject = ent.lst.find(function (item) {
		            return item.id == selectedValue;
		        });
		        if (selectedObject) {
		            $('#icd_main').val(selectedObject.name);
		            do_lc_get_disease_sub_entity(selectedObject.id)
		        }
		    });
		}	
		var do_lc_bind_event_select_icd_sub 			= function(ent){
			$('#select_icd_sub').on('change', function () {
		        var selectedValue = $(this).val();
		        var selectedObject = ent.child.find(function (item) {
		            return item.id == selectedValue;
		        });
		        if (selectedObject) {
		            $('#icd_sub').val(selectedObject.name);
		        }
		    });
		}	
		const do_lc_clean_data = function(ent){
			if(Object.keys(ent).length == 0) return;


			if(ent.inf04 && typeof ent.inf04 == "string"){
				ent.inf04 = JSON.parse(ent.inf04);
			}
			
			if(ent.inf06 && typeof ent.inf06 == "string"){
				ent.inf06 = JSON.parse(ent.inf06);
			}
			if(ent.inf01 && typeof ent.inf01 == "string"){
				ent.inf01 = JSON.parse(ent.inf01);
			}
			
			if(ent.inf02 && typeof ent.inf02 == "string"){
				ent.inf02 = JSON.parse(ent.inf02);
			}
			if(ent.inf07 && typeof ent.inf07 == "string"){
				ent.inf07 = JSON.parse(ent.inf07);
			}
			if(ent.inf05 && typeof ent.inf05 == "string"){
				ent.inf05 = JSON.parse(ent.inf05);
			}
			if(ent.inf03 && typeof ent.inf03 == "string"){
				ent.inf03 = JSON.parse(ent.inf03);
			}
		}
		const do_lc_bind_event_autocomplete = () => {
			$(".btn-remove-medicine").off("click").on("click", function(){
			 	$("#selected_medicine").addClass("hide")
				$(this).closest(".medicine-item").remove();
				$("#inp_pharmaceuticals").show();
			})
			$(".btn-remove-ingre").off("click").on("click", function(){
			 	$("#selected_ingre").addClass("hide")
				$(this).closest(".medicine-item-ingre").remove();
				$("#inp_ingre").show();
			})
			$(".btn-remove-code").off("click").on("click", function(){
			 	$("#selected_code").addClass("hide")
				$(this).closest(".member-item-code").remove();
				$("#inp_code").show();
			})
		}
		var do_lc_show_ent_edit 	= function(ent){
	//		pr_id_person = ent.id
			$("#div_ent_his_content").html("");
			do_lc_show_his_content_new		(ent);
			do_lc_show_his_prescription		(ent);
			do_lc_show_his_test_blood		(ent);
			do_lc_show_his_test_img 		(ent);
		}
		//---------------------------------Ajax----------------------------------------------
		this.do_lc_cancel = function(obj){
			do_lc_show_entity(obj, var_lc_MODE_SEL);
		}
	}
		
	return EntTabHistMedical;
});