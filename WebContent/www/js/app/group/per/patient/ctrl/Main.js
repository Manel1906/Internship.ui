define([
	'group/per/patient/ctrl/List',
	'group/per/patient/ctrl/Ent',
	'group/per/patient/ctrl/EntTabInfo',
	'group/per/patient/ctrl/EntTabHistDisease',
	'group/per/patient/ctrl/EntTabHistMedicine',
	'group/per/patient/ctrl/EntTabOrderMedicine',
	'group/per/patient/ctrl/EntTabOrderBloodTest',
	'group/per/patient/ctrl/EntTabOrderImgTest',
	
	'text!group/per/patient/tmpl/Main.html',
	
	'text!group/per/patient/tmpl/List.html', 
	'text!group/per/patient/tmpl/List_Content.html', 
	
	'text!group/per/patient/tmpl/Ent.html',
	
	'text!group/per/patient/tmpl/Ent_Tab_Info.html'	,
	'text!group/per/patient/tmpl/Ent_Tab_Disease_Hist.html'	,
	
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical.html'	,
	
	'text!group/per/patient/tmpl/Ent_Tab_Order_Medical.html',
	'text!group/per/patient/tmpl/Ent_Tab_Order_Test_Blood.html',
	'text!group/per/patient/tmpl/Ent_Tab_Order_Test_Img.html',
	
	'text!group/per/patient/tmpl/Dropzone_File.html'

	], function(
			List,
			Ent,
			EntTabInfo,
			EntTabHistDisease,
			EntTabHistMedicine,
			EntTabOrderMedicine,
			EntTabOrderBloodTest,
			EntTabOrderImgTest,
			
			Tmpl_Main,
			
			Tmpl_List, 
			Tmpl_List_Content,
			
			Tmpl_Ent,
			
			Tmpl_Ent_Tab_Info	,	
			Tmpl_Ent_Tab_Disease_Hist	,	
			
			Tmpl_Ent_Tab_History_Medical,
			
			Tmpl_Ent_Tab_Order_Medical,
			Tmpl_Ent_Tab_Order_Test_Blood,
			Tmpl_Ent_Tab_Order_Test_Img,
			Tmpl_PrjDropzone_File
	) {

	var Main     			= function (grpName, header, content, footer) {
		
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:"PerDoctor";
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var pr_grpPath 				= 'group/per/patient';
		
		var self 					= this;
		var Handlebars		=  require('handlebars');
		Handlebars.registerHelper("reqFormatAge", function(date) {
		    if (!date) return "";
		    const formattedDate = date.split(" ")[0]; // Lấy phần "YYYY-MM-DD"
		    const birthDate = new Date(formattedDate);
		    const currentDate = new Date();
		
		    let age = currentDate.getFullYear() - birthDate.getFullYear();
		    if (
		        currentDate.getMonth() < birthDate.getMonth() || 
		        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
		    ) age--;
		
		    return age;
		});

		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
			
			tmplName.TMPL_MAIN 							  		 = pr_grpName + "Tmpl_Main";
			tmplName.TMPL_LIST							  		 = pr_grpName + "Tmpl_List";
			tmplName.TMPL_LIST_CONTENT					  		 = pr_grpName + "Tmpl_List_Content";
			
			tmplName.TMPL_ENT							  		 = pr_grpName + "Tmpl_Ent";
			tmplName.TMPL_DROPZONE_FILE					  		 = pr_grpName + "Tmpl_Dropzone_File";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_MAIN			, Tmpl_Main); 
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_LIST			, Tmpl_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_LIST_CONTENT	, Tmpl_List_Content);
				
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT			, Tmpl_Ent);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_DROPZONE_FILE	, Tmpl_PrjDropzone_File);
						
			tmplName.TMPL_ENT_TAB_INFO					  		 = pr_grpName + "Tmpl_Ent_Tab_Info";
			tmplName.TMPL_ENT_TAB_INFO_CONTACT			  		 = pr_grpName + "Tmpl_Ent_Tab_Info_Contact";
			tmplName.TMPL_ENT_TAB_INFO_CONTACT_ADD		  		 = pr_grpName + "Tmpl_Ent_Tab_Info_Contact_Add";
			tmplName.TMPL_ENT_TAB_INFO_INSURANCE		  		 = pr_grpName + "Tmpl_Ent_Tab_Info_Insurance";
			tmplName.TMPL_ENT_TAB_INFO_INSURANCE_ADD	  		 = pr_grpName + "Tmpl_Ent_Tab_Info_Insurance_Add";
			tmplName.TMPL_ENT_TAB_INFO_MOD				  		 = pr_grpName + "Tmpl_Ent_Tab_Info_Modify";
			tmplName.TMPL_ENT_TAB_INFO_FILE				  		 = pr_grpName + "Tmpl_Ent_Tab_Info_File";
			
			tmplCtrl.do_lc_put_tmplRaw(Tmpl_Ent_Tab_Info		, pr_grpName);
			
			tmplName.TMPL_ENT_TAB_DISEASE_HIS			  		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS_CHRONIC	  		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist_Chronic";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS_CHRONIC_ADD 		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist_Chronic_Add";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS_FAMILY	  		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist_Family";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS_FAMILY_ADD  		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist_Family_Add";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS_ALLERGY	  		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist_Allergy";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS_ALLERGY_ADD 		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist_Allergy_Add";
			
			tmplCtrl.do_lc_put_tmplRaw(Tmpl_Ent_Tab_Disease_Hist , pr_grpName);
			
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL 			  		 = pr_grpName + "Tmpl_Ent_Tab_History_Medical";
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL_LIST 		  		 = pr_grpName + "Tmpl_Ent_Tab_History_Medical_List";
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL_LIST_CONTENT		 = pr_grpName + "Tmpl_Ent_Tab_History_Medical_List_Content";
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT_NEW 		 = pr_grpName + "Tmpl_Ent_Tab_History_Medical_Content_New";
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT_MAIN_SELECT= pr_grpName + "Tmpl_Ent_Tab_History_Medical_Content_ICD_Main_Select";
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT_SUB_SELECT = pr_grpName + "Tmpl_Ent_Tab_History_Medical_Content_ICD_Sub_Select";
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT 	  		 = pr_grpName + "Tmpl_Ent_Tab_History_Medical_Content";
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL_PRESCRIPT   		 = pr_grpName + "Tmpl_Ent_Tab_History_Medical_Prescription";
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL_PRESCRIPT_ADD		 = pr_grpName + "Tmpl_Ent_Tab_History_Medical_Prescription_Add";
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL_BLOOD 	  		 = pr_grpName + "Tmpl_Ent_Tab_History_Medical_Test_Blood";
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL_BLOOD_ADD    		 = pr_grpName + "Tmpl_Ent_Tab_History_Medical_Test_Blood_Add";
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL_IMG   	  		 = pr_grpName + "Tmpl_Ent_Tab_History_Medical_Test_Img";
			tmplName.TMPL_ENT_TAB_HIS_MEDICAL_IMG_ADD     		 = pr_grpName + "Tmpl_Ent_Tab_History_Medical_Test_Img_Add";
			
			tmplCtrl.do_lc_put_tmplRaw(Tmpl_Ent_Tab_History_Medical, pr_grpName);
			
			tmplName.TMPL_ENT_TAB_ORDER_MEDICAL 			  	 = pr_grpName + "Tmpl_Ent_Tab_Order_Medical";
			tmplName.TMPL_ENT_TAB_ORDER_MEDICAL_LIST 		  	 = pr_grpName + "Tmpl_Ent_Tab_Order_Medical_List";
			tmplName.TMPL_ENT_TAB_ORDER_MEDICAL_LIST_CONTENT	 = pr_grpName + "Tmpl_Ent_Tab_Order_Medical_List_Content";
			tmplName.TMPL_ENT_TAB_ORDER_MEDICAL_CONTENT 		 = pr_grpName + "Tmpl_Ent_Tab_Order_Medical_Content";
			tmplName.TMPL_ENT_TAB_ORDER_MEDICAL_CONTENT_FILE 	 = pr_grpName + "Tmpl_Ent_Tab_Order_Medical_Content_File";
			
			tmplCtrl.do_lc_put_tmplRaw(Tmpl_Ent_Tab_Order_Medical, pr_grpName);
			
			tmplName.TMPL_ENT_TAB_TEST_BLOOD 			  	 	 = pr_grpName + "Tmpl_Ent_Tab_Order_Test_Blood";
			tmplName.TMPL_ENT_TAB_TEST_BLOOD_LIST 		  	     = pr_grpName + "Tmpl_Ent_Tab_Order_Test_Blood_List";
			tmplName.TMPL_ENT_TAB_TEST_BLOOD_LIST_CONTENT	     = pr_grpName + "Tmpl_Ent_Tab_Order_Test_Blood_List_Content";
			tmplName.TMPL_ENT_TAB_TEST_BLOOD_CONTENT 		     = pr_grpName + "Tmpl_Ent_Tab_Order_Test_Blood_Content";
			tmplName.TMPL_ENT_TAB_TEST_BLOOD_CONTENT_FILE 		 = pr_grpName + "Tmpl_Ent_Tab_Order_Test_Blood_Content_File";
			
			tmplCtrl.do_lc_put_tmplRaw(Tmpl_Ent_Tab_Order_Test_Blood, pr_grpName);
			
			tmplName.TMPL_ENT_TAB_TEST_IMG 			  	 	 	 = pr_grpName + "Tmpl_Ent_Tab_Order_Test_Img";
			tmplName.TMPL_ENT_TAB_TEST_IMG_LIST 		  	     = pr_grpName + "Tmpl_Ent_Tab_Order_Test_Img_List";
			tmplName.TMPL_ENT_TAB_TEST_IMG_LIST_CONTENT	     	 = pr_grpName + "Tmpl_Ent_Tab_Order_Test_Img_List_Content";
			tmplName.TMPL_ENT_TAB_TEST_IMG_CONTENT 		     	 = pr_grpName + "Tmpl_Ent_Tab_Order_Test_Img_Content";
			tmplName.TMPL_ENT_TAB_TEST_IMG_CONTENT_FILE 		 = pr_grpName + "Tmpl_Ent_Tab_Order_Test_Img_Content_File";
			
			tmplCtrl.do_lc_put_tmplRaw(Tmpl_Ent_Tab_Order_Test_Img, pr_grpName);
			
			//---------------------------------------------------------------------------------------------
			//---------------------------------------------------------------------------------------------
			if (!App.controller[pr_grpName]) App.controller[pr_grpName] = {};
			
			App.controller[pr_grpName].List				 	= new List					(pr_grpName, null, null, null);
			App.controller[pr_grpName].Ent				 	= new Ent					(pr_grpName, null, null, null);
			App.controller[pr_grpName].EntTabInfo		 	= new EntTabInfo			(pr_grpName, null, null, null);
			App.controller[pr_grpName].EntTabHistDisease 	= new EntTabHistDisease		(pr_grpName, null, null, null);
			App.controller[pr_grpName].EntTabHistMedicine 	= new EntTabHistMedicine	(pr_grpName, null, null, null);
			App.controller[pr_grpName].EntTabOrderMedicine 	= new EntTabOrderMedicine	(pr_grpName, null, null, null);
			App.controller[pr_grpName].EntTabOrderBloodTest = new EntTabOrderBloodTest	(pr_grpName, null, null, null);
			App.controller[pr_grpName].EntTabOrderImgTest 	= new EntTabOrderImgTest	(pr_grpName, null, null, null);
			
			App.controller[pr_grpName].List					.do_lc_init();
			App.controller[pr_grpName].Ent					.do_lc_init();
			App.controller[pr_grpName].EntTabInfo			.do_lc_init();
			App.controller[pr_grpName].EntTabHistDisease	.do_lc_init();
			App.controller[pr_grpName].EntTabHistMedicine	.do_lc_init();
			App.controller[pr_grpName].EntTabOrderMedicine	.do_lc_init();
			App.controller[pr_grpName].EntTabOrderBloodTest	.do_lc_init();
			App.controller[pr_grpName].EntTabOrderImgTest	.do_lc_init();
		}     
		
		//--------show-------------------------------------------------------------------
		
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
			try { 
				
				App.router.controller.do_lc_append_custom_tags()
				
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_MAIN, {}));

				App.controller[pr_grpName].List.do_lc_show();
				
				$(document).prop('title',$.i18n('prj_project_sidebar_user'));
				
		//		let 		params 	= req_gl_Url_Params();
		//		if (params.id) App.controller[pr_grpName].Ent.do_lc_show();;

			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjClientMain", "do_lc_show", e.toString()) ;
			}
		}
		
	};

	return Main;
});