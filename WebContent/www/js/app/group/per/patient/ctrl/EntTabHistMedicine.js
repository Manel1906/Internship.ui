define(['jquery','prjImageViewer/viewer'], function($,Viewer) {
	
	var EntTabHistMedicine 					= function (grpName, header, content, footer) {
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
		
		const pr_SERVICE_CLASS			= "ServicePerPatient"; //to change by your need
		const pr_SERVICE_CLASS_CATE		= "ServiceTpyCategory"; //to change by your need
		const pr_SERVICE_CLASS_MEDICINE	= "ServiceMatMaterial";
		const pr_SV_LIST_MEDICINE		= "SVSearch"; 
		const pr_SV_LIST_CAT			= "SVLst"	
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
		const pr_TYP_TEST_BLOOD 	= 2000;
		const pr_STAT_ACTIVE		= 1;
		
		const pr_typ_sav_draft      = 0;
		const pr_typ_sav_done       = 1;
		var   pr_id_entity			= null;
		var   pr_ent_per			= null;
		var   pr_id_person			= null;
		var   pr_obj_person			= null;
		//------------------const object------------------------------------------------------
		//-----------------------------------------------------------------------------------
		this.do_lc_init				= function(){
			pr_ctr_Main 			= App.controller.UI.Main;

			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		}
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(ent){               
			try{
				pr_obj_person = ent;
				do_lc_show_entity(ent);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "Ent", "do_lc_show", e.toString()) ;
			}
		};
		
		var do_lc_show_entity 				= function(entPer){
			pr_id_person 					= entPer.id
			pr_ent_per 						= entPer
			
			$(pr_divContent					).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL				, entPer));
			$("#div_entity_his_medical"		).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_LIST			, entPer));
			
			do_lc_reqLst_his_medicine(entPer)
		}
		
		var do_lc_reqLst_his_medicine 	= function(entPer){
			let divList = $("#div_list_his_medicine");
			let divPan  = $("#div_pagination_his_medicine");
			
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST_PAGE, {perId: entPer.id});
			
			const callbackFunct 	= data => do_lc_reqLst_his_medicine_callback(data);
			
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
		
		var do_lc_reqLst_his_medicine_callback = function(sharedJson){
			let data			= {};
			
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				data		= sharedJson[App['const'].RES_DATA]
			}
			
			$("#div_list_his_medicine")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_LIST_CONTENT, { "data": data.lst }));
			
			do_lc_bind_event_his_medicine();
		}
		
		var do_lc_bind_event_his_medicine 			= function(){
			$("#btn_new_entity").off("click").on("click", function () {
				$("#div_ent_his_content"		).html("");
				do_lc_show_his_content_mod		();
			});
						
			$(".infor-get").off("click").on("click", function (){
				$(".mdi-eye-outline").removeClass	("mdi-eye-outline").addClass("mdi-eye-off-outline");
				
			    let { id } 			= $(this).data(); 
			    let $span 			= $(this).find("span"); 
				$span.removeClass("mdi-eye-off-outline").addClass("mdi-eye-outline");
		       
				do_lc_get_his_content(id);
			});
		}		
				
		//----------------------------------------------------------------------------------------------------------
		
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
					inforPrescription.inf05		= inforPrescription.inf05.filter(element => element !== null && element !== undefined);
				inforPrescription.id			= pr_id_entity
				inforPrescription.entId			= pr_id_person
				do_lc_save_entity_prescription(inforPrescription, do_lc_show_ent_edit);
			});
				do_gl_req_autocompleteMedicine()
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
			
				//check data error
				if(obj.hasError){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_data'));
					return;
				}
				
				inforBlood = {}
				inforBlood.inf06 			= obj.data.inf06;
				if (inforBlood.inf06)
					inforBlood.inf06		= inforBlood.inf06.filter(element => element !== null && element !== undefined);
				inforBlood.id			= pr_id_entity
				inforBlood.entId		= pr_id_person
				do_lc_save_entity_blood(inforBlood, do_lc_show_ent_edit);
			});
			do_gl_req_autocompleteTestBlood()
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
			
				//check data error
				if(obj.hasError){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_data'));
					return;
				}
				
				inforImg = {}
				idPer = pr_id_person
				inforImg.inf07 			= obj.data.inf07;
				if (inforImg.inf07)
					inforImg.inf07		= inforImg.inf07.filter(element => element !== null && element !== undefined);
				inforImg.id			= pr_id_entity
				inforImg.entId		= pr_id_person
				do_lc_save_entity_img(inforImg, do_lc_show_ent_edit);
			});
			do_gl_req_autocompleteTestImg()
		}
		const do_gl_req_autocompleteMedicine = function() {	
			$('#tbody_entity_prescription').off('focus', '.inp_pharmaceuticals').on('focus', '.inp_pharmaceuticals', function() {
			let el = $(this); 
			let selectMedicine  = $(this).closest('tr').find('.selected_medicine'); 
			let selectIngre     = $(this).closest('tr').find('.selected_ingre'); 
			let selectCode 		= $(this).closest('tr').find('.selected_code'); 
			let inp_ingre 		= $(this).closest('tr').find('.inp_ingre'); 
			let inp_code 		= $(this).closest('tr').find('.inp_code'); 
			let reqSelectMedicine = (event, item) => {
				let selOpt 			= `<div class='medicine-item-medicine'>`;
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
				
				selectMedicine.removeClass("hide")
				selectIngre.removeClass("hide")
				selectCode.removeClass("hide")
				
				selectMedicine.append(selOpt);
				selectIngre.append(selOptIngre);
				selectCode.append(selOptCode);
				
				el.addClass('hide');
				inp_ingre.addClass('hide');
				inp_code.addClass('hide');
				
				el.val(item.name01);
				inp_ingre.val(item.name02);
				inp_code.val(item.code01);
				do_lc_bind_event_autocomplete();
				
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
			
			});
		}
		const do_gl_req_autocompleteTestBlood = function() {		
			$('#tbody_entity_blood').off('focus', '.inp_code_service').on('focus', '.inp_code_service', function() {	
			let el = $(this); 
			let selectCode  	= $(this).closest('tr').find('.selected_code_service'); 
			let selectName      = $(this).closest('tr').find('.selected_name'); 
			let inp_code 		= $(this).closest('tr').find('.inp_name'); 
			let reqSelectTestBlood = (event, item) => {
				let selOptCode 		= `<div class='medicine-item-code'>`;
				selOptCode 				+= `<div class="media align-items-center"><div class="mr-1 text-center"">${item.code}</div>`;

				selOptCode 				+= `<a data-id='${item.id}' class='text-danger btn-remove-code' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOptCode 				+= `</div>`;
				
				let selOptName 	= `<div class='medicine-item-name'>`;
				selOptName 				+= `<div class="media align-items-center"><div class="mr-1 text-center"">${item.name}</div>`;

				selOptName 				+= `<a data-id='${item.id}' class='text-danger btn-remove-name' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOptName 				+= `</div>`;
				
				selectCode.removeClass("hide")
				selectName.removeClass("hide")
				
				selectCode.append(selOptCode);
				selectName.append(selOptName);
				
				el.addClass('hide');
				inp_code.addClass('hide');
				
				el.val(item.code);
				inp_code.val(item.name);
				do_lc_bind_event_autocomplete_test_blood();
			}
			var pr_TYP_01_TEST_BLOOD = 2000;
			let options = {
				dataService: [pr_SERVICE_CLASS_CATE, pr_SV_LIST_CAT],
				svParams: { 
					wAvatar: true,
					nbline: 10,
					stat01: 1, 
					typ01: pr_TYP_01_TEST_BLOOD  
				 },
				hintSvParams: {  
					wAvatar: true,
					nbline: 10,
					stat01: 1, 
					typ01: pr_TYP_01_TEST_BLOOD  
				},
				fSelect			: reqSelectTestBlood, 
				customShowList: do_lc_Lst_test_blood_autocomplete,
			};
			do_gl_req_autocompleteNew(el, options);
			});
		}
		const do_gl_req_autocompleteTestImg = function() {	
			$('#tbody_entity_img').off('focus', '.inp_code_service').on('focus', '.inp_code_service', function() {	
			let el = $(this); 
			let selectCode  	= $(this).closest('tr').find('.selected_code_service'); 
			let selectName      = $(this).closest('tr').find('.selected_name'); 
			let inp_code 		= $(this).closest('tr').find('.inp_name'); 	
			let reqSelectTestImg = (event, item) => {
				let reqSelectTestImg 		= `<div class='medicine-item-code'>`;
				reqSelectTestImg 			+= `<div class="media align-items-center"><div class="mr-1 text-center"">${item.code}</div>`;

				reqSelectTestImg 			+= `<a data-id='${item.id}' class='text-danger btn-remove-code' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				reqSelectTestImg 			+= `</div>`;
				
				let selOptNameImg 	= `<div class='medicine-item-name'>`;
				selOptNameImg 				+= `<div class="media align-items-center"><div class="mr-1 text-center"">${item.name}</div>`;

				selOptNameImg 				+= `<a data-id='${item.id}' class='text-danger btn-remove-name' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOptNameImg 				+= `</div>`;
				
				selectCode.removeClass("hide")
				selectName.removeClass("hide")
				
				selectCode.append(reqSelectTestImg);
				selectName.append(selOptNameImg);
				
				el.addClass('hide');
				inp_code.addClass('hide');
				
				el.val(item.code);
				inp_code.val(item.name);
				do_lc_bind_event_autocomplete_test_img();
			}
			var pr_TYP_01_TEST_BLOOD = 3000;
			let options = {
				dataService: [pr_SERVICE_CLASS_CATE, pr_SV_LIST_CAT],
				svParams: { 
					nbline: 10,
					stat01: 1, 
					typ01: pr_TYP_01_TEST_BLOOD  
				 },
				hintSvParams: {  
					nbline: 10,
					stat01: 1, 
					typ01: pr_TYP_01_TEST_BLOOD  
				},
				fSelect			: reqSelectTestImg, 
				customShowList: do_lc_Lst_test_img_autocomplete,
			};
			do_gl_req_autocompleteNew(el, options);
			});
		}
		const do_gl_req_autocompleteIngredient = function() {		
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
		}
		const do_lc_Lst_medicine_autocomplete = function (item, selOpt = "") {
			selOpt += `<div class="media align-items-center"> ${item.name01}</div>`;
		    return selOpt;
		};
		const do_lc_Lst_test_blood_autocomplete = function (item, selOpt = "") {
			selOpt += `<div class="media align-items-center"> ${item.code}</div>`;
		    return selOpt;
		};
		const do_lc_Lst_test_img_autocomplete = function (item, selOpt = "") {
			selOpt += `<div class="media align-items-center"> ${item.code}</div>`;
		    return selOpt;
		};
		const do_lc_Lst_medicine_inGre_autocomplete = function (item, selOpt = "") {
			selOpt += `<div class="media align-items-center"> ${item.name02}</div>`;
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
		    do_gl_req_autocompleteTestBlood()
		};
		const do_lc_bind_event_new_prescription = function(data) {		
		 	const maxIndex 	= Math.max(0, ...$('#tbody_entity_prescription').find('input[data-name="index"]').map(function () {
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
		    do_gl_req_autocompleteMedicine()
			 // Ingredient
			do_gl_req_autocompleteIngredient()
			
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
		    do_gl_req_autocompleteTestImg()
		};
		
		const do_lc_save_entity_prescription = function(myObject, callback){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: myObject});
			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_save_entity_prescription_callback, [myObject, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_save_entity_prescription_callback = function(sharedJson, entity, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let ent 	= sharedJson[App['const'].RES_DATA];
				do_lc_clean_data(ent)
				if (callback) callback (ent);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		const do_lc_save_entity_blood = function(myObject, callback){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: myObject});
			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_save_entity_blood_callback, [myObject, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_save_entity_blood_callback = function(sharedJson, entity, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let ent 	= sharedJson[App['const'].RES_DATA];
				do_lc_clean_data(ent)
				if (callback) callback (ent);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		const do_lc_save_entity_img = function(myObject, callback){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: myObject});
			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_save_entity_img_callback, [myObject, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_save_entity_img_callback = function(sharedJson, entity, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let ent 	= sharedJson[App['const'].RES_DATA];
				do_lc_clean_data(ent)
				if (callback) callback (ent);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		var do_lc_bind_event_content_mod 			= function(ent){
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
							param	: [pr_typ_sav_done],
							classBtn: "btn-primary"
						}
					}
				});
			});
			$("#btn_sav_draft_entity").off("click").on("click",function(){
				self.do_lc_mod(pr_typ_sav_draft)
			})
			
		}		
		
		//----------------------------------------------------------------------------------------------------------
		const do_lc_get_his_content = function(id) {
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_BY_ID, {id: id});	
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_his_content_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_get_his_content_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					pr_id_entity = data.id
					do_lc_show_his_medicine		(data)
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		var do_lc_show_his_medicine 	= function(data){
			do_lc_clean_data			(data)
			
			
			if (!data.stat)
			do_lc_show_his_content_mod	(data);
			else
			do_lc_show_his_content		(data);
			
			do_lc_show_his_prescription	(data);
			do_lc_show_his_test_blood	(data);
			do_lc_show_his_test_img 	(data);
		 	const toPDF = function(){
				 const content = `	<div id="div_ent_his_prescription_file" style="page-break-after: always;">
							            ${$("#div_ent_his_prescription_file").html()}
							        </div>
							        <div id="div_ent_his_test_blood_file" style="page-break-after: always;">
							            ${$("#div_ent_his_test_blood_file").html()}
							        </div>
							        <div id="div_ent_his_test_img_file" style="page-break-after: always;">
							            ${$("#div_ent_his_test_img_file").html()}
							        </div>`;
		 	const window_new = window.open();
		 	window_new.document.write(`
			        <html>
			            <head>
			                <title>Print</title>
			                <style>
			                    @media print {
			                        div {
			                            page-break-inside: avoid;
			                            margin: 20px;
			                        }
			                    }
			                    body {
			                        font-family: Arial, sans-serif;
			                    }
			                </style>
			            </head>
			            <body>
			                ${content}
			            </body>
			        </html>
			    `);
			setTimeout(()=>{
				window_new.print();
				window_new.close();
		 	},200)
		 	}	
			$("#btn_print_entity").off("click").on("click", function() {
				$("#div_ent_his_prescription_file").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_ORDER_MEDICAL_CONTENT_FILE		, {data: data, per: pr_ent_per}));
				$("#div_ent_his_test_blood_file")  .html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_TEST_BLOOD_CONTENT_FILE			, {data: data, per: pr_ent_per}));
				$("#div_ent_his_test_img_file")	   .html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_TEST_IMG_CONTENT_FILE			, {data: data, per: pr_ent_per}));
				toPDF();
			});
		}
		
		var do_lc_show_his_content_mod 	= function(ent){
			const user = App.data.user;
			
			if (ent==null) 
				ent={
					entId 	: pr_id_person,
					stat	: 0, //draft
					dt01	: req_gl_DateStr_From_DateObj (new Date()),
					inf08	: user.per.inf03,
					inf09	: user.per.code01,
					inf10	: user.name,
				};
				
			$("#div_ent_his_content"	).html("");
			$("#div_ent_his_content_new").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT_NEW		, ent));
			
			App.SummerNoteController.do_lc_show("#div_show_sympton"	);//text editor
			App.SummerNoteController.do_lc_show("#div_show_dignose"	);//text editor
			App.SummerNoteController.do_lc_show("#div_show_note"	);//text editor
			
			do_get_list_disease_ByAjax();
			
			if (ent.id){
				do_lc_show_his_prescription	(ent);
				do_lc_show_his_test_blood	(ent);
				do_lc_show_his_test_img 	(ent);
				
				$("#btn_sav_entity").removeClass("hide");
			}
			
			do_lc_bind_event_content_mod(ent);
		}
		
		var do_lc_show_his_content 				= function(ent){
			$("#btn_sav_entity"					).addClass("hide");
			$("#div_ent_his_content_new"		).html("");
			$("#div_ent_his_content"			).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT	, ent));
		}
		
		var do_lc_show_his_prescription 		= function(ent){
			$("#div_ent_his_prescription"		).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_PRESCRIPT	, ent));
			
			$("#btn_mod_prescription"			).off("click").on("click", function(){
				do_lc_show_entity_prescription	(ent);
			});
		}
		var do_lc_show_his_test_blood 			= function(ent){
			$("#div_ent_his_test_blood"			).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_BLOOD		, ent));
			
			$("#btn_mod_blood"					).off("click").on("click", function(){
				do_lc_show_entity_blood(ent);
			});
		}
		var do_lc_show_his_test_img 			= function(ent){
			$("#div_ent_his_test_img"			).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_IMG		, ent));
			
			$("#btn_mod_img"					).off("click").on("click", function(){
				do_lc_show_entity_img(ent);
			});
		}
		//----------------------------------------------------------------------------------------------
		this.do_lc_mod = function(stat){
			const data = req_gl_data({
				dataZoneDom: $("#frm_entity")
			});

			//check data error
			if(data.hasError){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_data'));
				return;
			}
			
			data.data.stat  	= stat;
			
			do_lc_update_entity(data.data);
		}
		const do_lc_update_entity = function(ent) {
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: JSON.stringify(ent)});	

			let fSucces		= [];
			fSucces.push	(req_gl_funct(null, do_lc_update_entity_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_update_entity_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				
				if(data){
					do_lc_show_his_medicine 		(data);
					do_gl_show_Notify_Msg_Success 	($.i18n("common_success_update") );
					
					//---refresh list
					do_lc_show_entity (pr_obj_person);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//-----------------------------------------------------------------------------------------------------------------------------
		const pr_TYPE_01_DISEASE = 1000;
		
		const do_get_list_disease_ByAjax = function(){	
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS_CATE, pr_SV_GET_LST);
			ref.typ01 		= pr_TYPE_01_DISEASE;
			ref.stats 		= 1;
			ref.hardLoad 	= false;
			
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
		
		//-----------------------------------------------------------------------------------------------------------------------------
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
			$(".btn-remove-medicine, .btn-remove-ingre, .btn-remove-code").off("click").on("click", function () {
			    let $this = $(this);
			    let $currentRow = $this.closest('tr');
			    let $parentPharma = $currentRow.find('.medicine-item-medicine');
			    let $parentIngre  = $currentRow.find('.medicine-item-ingre');
			    let $parentCode   = $currentRow.find('.medicine-item-code');
			    let $lastRow 	  = $('#tbody_entity_prescription tr:last');
			
			    if ($parentPharma.length) $parentPharma.remove();
			    if ($parentIngre.length) $parentIngre.remove();
			    if ($parentCode.length) $parentCode.remove();
			
			    let $inputPharmaceuticals = $currentRow.find('.inp_pharmaceuticals');
			    let $selectPharmaceuticals = $currentRow.find('.selected_medicine');
			    let $inputIngre = $currentRow.find('.inp_ingre');
			    let $selectIngrediant = $currentRow.find('.selected_ingre');
			    let $inputCode = $currentRow.find('.inp_code');
			    let $selectCode = $currentRow.find('.selected_code');
			
			    let $inputPharmaceuticalsLast = $lastRow.find('.medicine-item-medicine');
			    let $selectPharmaceuticalsLast = $lastRow.find('.select-name-member');
			    let $inputIngreLast = $lastRow.find('.medicine-item-ingre');
			    let $selectIngreLast = $lastRow.find('.select-name-member');
			    let $inputCodeLast = $lastRow.find('.medicine-item-code');
			    let $selectCodeLast = $lastRow.find('.select-name-member');
			
			    $inputPharmaceuticals.removeClass('hide');
			    $selectPharmaceuticals.addClass('hide');
			
			    $inputIngre.removeClass('hide');
			    $selectIngrediant.addClass('hide');
			
			    $inputCode.removeClass('hide');
			    $selectCode.addClass('hide');
			
			    $inputPharmaceuticalsLast.removeClass('hide');
			    $selectPharmaceuticalsLast.addClass('hide');
			
			    $inputIngreLast.removeClass('hide');
			    $selectIngreLast.addClass('hide');
			
			    $inputCodeLast.removeClass('hide');
			    $selectCodeLast.addClass('hide');
			    
			    $inputPharmaceuticals.val("")
			    $inputIngre.val("")
			    $inputCode.val("")
			});
		}
		const do_lc_bind_event_autocomplete_test_blood = () => {
			$(".btn-remove-code, .btn-remove-name").off("click").on("click", function () {
			    let $this = $(this);
			    let $currentRow = $this.closest('tr');
			    let $parentName = $currentRow.find('.medicine-item-name');
			    let $parentCode  = $currentRow.find('.medicine-item-code');
			    let $lastRow 	  = $('#tbody_entity_blood tr:last');
			
			    if ($parentName.length) $parentName.remove();
			    if ($parentCode.length) $parentCode.remove();
			
			    let $inputCode = $currentRow.find('.inp_code_service');
			    let $selectCode = $currentRow.find('.selected_code_service');
			    let $inputName = $currentRow.find('.inp_name');
			    let $selectName = $currentRow.find('.selected_name');
			
			    let $inputCodeLast = $lastRow.find('.medicine-item-name');
			    let $selectCodeLast = $lastRow.find('.selected_code_service');
			    let $inputNameLast = $lastRow.find('.medicine-item-code');
			    let $selectNameLast = $lastRow.find('.selected_name');
			
			    $inputCode.removeClass('hide');
			    $selectCode.addClass('hide');
			
			    $inputName.removeClass('hide');
			    $selectName.addClass('hide');
			
			    $inputNameLast.removeClass('hide');
			    $selectNameLast.addClass('hide');
			
			    $inputCodeLast.removeClass('hide');
			    $selectCodeLast.addClass('hide');
			    
			    $inputCode.val("")
			    $inputName.val("")
			});
		}
		const do_lc_bind_event_autocomplete_test_img = () => {
			$(".btn-remove-code, .btn-remove-name").off("click").on("click", function () {
			    let $this = $(this);
			    let $currentRow = $this.closest('tr');
			    let $parentName = $currentRow.find('.medicine-item-name');
			    let $parentCode  = $currentRow.find('.medicine-item-code');
			    let $lastRow 	  = $('#tbody_entity_img tr:last');
			
			    if ($parentName.length) $parentName.remove();
			    if ($parentCode.length) $parentCode.remove();
			
			    let $inputCode = $currentRow.find('.inp_code_service');
			    let $selectCode = $currentRow.find('.selected_code_service');
			    let $inputName = $currentRow.find('.inp_name');
			    let $selectName = $currentRow.find('.selected_name');
			
			    let $inputCodeLast = $lastRow.find('.medicine-item-name');
			    let $selectCodeLast = $lastRow.find('.selected_code_service');
			    let $inputNameLast = $lastRow.find('.medicine-item-code');
			    let $selectNameLast = $lastRow.find('.selected_name');
			
			    $inputCode.removeClass('hide');
			    $selectCode.addClass('hide');
			
			    $inputName.removeClass('hide');
			    $selectName.addClass('hide');
			
			    $inputNameLast.removeClass('hide');
			    $selectNameLast.addClass('hide');
			
			    $inputCodeLast.removeClass('hide');
			    $selectCodeLast.addClass('hide');
			    
			    $inputCode.val("")
			    $inputName.val("")
			});
		}
		var do_lc_show_ent_edit 	= function(ent){
	//		pr_id_person = ent.id
			$("#div_ent_his_content").html("");
			do_lc_show_his_content_mod		(ent);
			do_lc_show_his_prescription		(ent);
			do_lc_show_his_test_blood		(ent);
			do_lc_show_his_test_img 		(ent);
		}
		//---------------------------------Ajax----------------------------------------------
		this.do_lc_cancel = function(obj){
			do_lc_show_entity(obj);
		}
	}
		
	return EntTabHistMedicine;
});