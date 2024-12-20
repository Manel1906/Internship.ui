define([
	'group/per/patient/ctrl/List',
	'group/per/patient/ctrl/Ent',
	'group/per/patient/ctrl/EntTabInfo',
	'group/per/patient/ctrl/EntTabHistDisease',
	'group/per/patient/ctrl/EntTabHistMedical',
	
	'text!group/per/patient/tmpl/Main.html',
	
	'text!group/per/patient/tmpl/List.html', 
	'text!group/per/patient/tmpl/List_Content.html', 
	
	'text!group/per/patient/tmpl/Ent.html',
	
	'text!group/per/patient/tmpl/Ent_Tab_Info_Modify.html',
	'text!group/per/patient/tmpl/Ent_Tab_Info.html'	,
	'text!group/per/patient/tmpl/Ent_Tab_Info_Contact.html',
	'text!group/per/patient/tmpl/Ent_Tab_Info_Contact_Add.html',
	'text!group/per/patient/tmpl/Ent_Tab_Info_Insurance.html',
	'text!group/per/patient/tmpl/Ent_Tab_Info_Insurance_Add.html',
	'text!group/per/patient/tmpl/Ent_Tab_Info_File.html',
	'text!group/per/patient/tmpl/Ent_Tab_Disease_Hist.html'	,
	'text!group/per/patient/tmpl/Ent_Tab_Disease_Hist_Chronic.html'	,	
	'text!group/per/patient/tmpl/Ent_Tab_Disease_Hist_Chronic_Add.html'	,	
	'text!group/per/patient/tmpl/Ent_Tab_Disease_Hist_Family.html'	,
	'text!group/per/patient/tmpl/Ent_Tab_Disease_Hist_Family_Add.html'	,
	'text!group/per/patient/tmpl/Ent_Tab_Disease_Hist_Allergy.html'	,	
	'text!group/per/patient/tmpl/Ent_Tab_Disease_Hist_Allergy_Add.html'	,
	
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical.html'	,
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical_List.html'	,
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical_List_Content.html'	,
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical_Content_New.html',
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical_Content_ICD_Main_Select.html',
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical_Content_ICD_Sub_Select.html',
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical_Content.html',
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical_Prescription.html',
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical_Prescription_Add.html',
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical_Test_Blood.html',
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical_Test_Blood_Add.html',
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical_Test_Img.html',
	'text!group/per/patient/tmpl/Ent_Tab_History_Medical_Test_Img_Add.html',
			
	'text!group/per/patient/tmpl/Dropzone_File.html'

	], function(
			List,
			Ent,
			EntTabInfo,
			EntTabHistDisease,
			EntTabHistMedical,
			
			Tmpl_Main,
			
			Tmpl_List, 
			Tmpl_List_Content,
			
			Tmpl_Ent,
			Tmpl_Ent_Tab_Info_Modify,
			
			Tmpl_Ent_Tab_Info	,	
			Tmpl_Ent_Tab_Info_Contact,
			Tmpl_Ent_Tab_Info_Contact_Add,
			Tmpl_Ent_Tab_Info_Insurance,
			Tmpl_Ent_Tab_Info_Insurance_Add,
			Tmpl_Ent_Tab_Info_File,
			Tmpl_Ent_Tab_Disease_Hist	,	
			Tmpl_Ent_Tab_Disease_Hist_Chronic,
			Tmpl_Ent_Tab_Disease_Hist_Chronic_Add,
			Tmpl_Ent_Tab_Disease_Hist_Family,
			Tmpl_Ent_Tab_Disease_Hist_Family_Add,
			Tmpl_Ent_Tab_Disease_Hist_Allergy,
			Tmpl_Ent_Tab_Disease_Hist_Allergy_Add,
			Tmpl_Ent_Tab_History_Medical,
			Tmpl_Ent_Tab_History_Medical_List,
			Tmpl_Ent_Tab_History_Medical_List_Content,
			Tmpl_Ent_Tab_History_Medical_Content_New,
			Tmpl_Ent_Tab_History_Medical_Content_ICD_Main_Select,
			Tmpl_Ent_Tab_History_Medical_Content_ICD_Sub_Select,
			Tmpl_Ent_Tab_History_Medical_Content,
			Tmpl_Ent_Tab_History_Medical_Prescription,
			Tmpl_Ent_Tab_History_Medical_Prescription_Add,
			Tmpl_Ent_Tab_History_Medical_Test_Blood,
			Tmpl_Ent_Tab_History_Medical_Test_Blood_Add,
			Tmpl_Ent_Tab_History_Medical_Test_Img,
			Tmpl_Ent_Tab_History_Medical_Test_Img_Add,
			
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
		var Handlebars				= require('handlebars');
		const TYP_USER = {
//				2: "aut_user_ent_header_type_adm"	,	20: "aut_user_ent_header_type_doctor"	,	30: "aut_user_ent_header_type_agent"
				40: "aut_user_ent_header_type_patient"
		}
		Handlebars.registerHelper('reqTypeClient', function(typ) {
			if(!typ)				return $.i18n(TYP_USER[3]);
			if(!TYP_USER[typ])		return $.i18n(TYP_USER[3]);
	
			return $.i18n(TYP_USER[typ]);
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
			
			tmplName.TMPL_ENT_TAB_INFO					  		 = pr_grpName + "Tmpl_Ent_Content";
			tmplName.TMPL_ENT_TAB_INFO_CONTACT			  		 = pr_grpName + "Tmpl_Ent_Tab_Info_Contact";
			tmplName.TMPL_ENT_TAB_INFO_CONTACT_ADD		  		 = pr_grpName + "Tmpl_Ent_Tab_Info_Contact_Add";
			tmplName.TMPL_ENT_TAB_INFO_INSURANCE		  		 = pr_grpName + "Tmpl_Ent_Tab_Info_Insurance";
			tmplName.TMPL_ENT_TAB_INFO_INSURANCE_ADD	  		 = pr_grpName + "Tmpl_Ent_Tab_Info_Contact_Add_Lst";
			tmplName.TMPL_ENT_TAB_INFO_FILE				  		 = pr_grpName + "Tmpl_Ent_Tab_Info_File";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS			  		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS_CHRONIC	  		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist_Chronic";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS_CHRONIC_ADD 		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist_Chronic_Add";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS_FAMILY	  		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist_Family";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS_FAMILY_ADD  		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist_Family_Add";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS_ALLERGY	  		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist_Allergy";
			tmplName.TMPL_ENT_TAB_DISEASE_HIS_ALLERGY_ADD 		 = pr_grpName + "Tmpl_Ent_Tab_Disease_Hist_Allergy_Add";
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
			
			tmplName.TMPL_ENT_TAB_INFO_MOD				  		 = pr_grpName + "Tmpl_Ent_Tab_Info_Modify";
			
			
			tmplName.TMPL_DROPZONE_FILE					  		 = pr_grpName + "Tmpl_Dropzone_File"
			
			
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_MAIN						, Tmpl_Main); 
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_LIST						, Tmpl_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_LIST_CONTENT				, Tmpl_List_Content);
				
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT						, Tmpl_Ent);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO				, Tmpl_Ent_Tab_Info);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO_CONTACT		, Tmpl_Ent_Tab_Info_Contact);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO_CONTACT_ADD	, Tmpl_Ent_Tab_Info_Contact_Add);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO_INSURANCE	, Tmpl_Ent_Tab_Info_Insurance);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO_INSURANCE_ADD, Tmpl_Ent_Tab_Info_Insurance_Add);
						
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO_FILE			, Tmpl_Ent_Tab_Info_File);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_INFO_MOD			, Tmpl_Ent_Tab_Info_Modify);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS					, Tmpl_Ent_Tab_Disease_Hist);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS_CHRONIC			, Tmpl_Ent_Tab_Disease_Hist_Chronic);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS_CHRONIC_ADD		, Tmpl_Ent_Tab_Disease_Hist_Chronic_Add);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS_FAMILY			, Tmpl_Ent_Tab_Disease_Hist_Family);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS_FAMILY_ADD		, Tmpl_Ent_Tab_Disease_Hist_Family_Add);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS_ALLERGY			, Tmpl_Ent_Tab_Disease_Hist_Allergy);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS_ALLERGY_ADD		, Tmpl_Ent_Tab_Disease_Hist_Allergy_Add);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL					, Tmpl_Ent_Tab_History_Medical);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_LIST				, Tmpl_Ent_Tab_History_Medical_List);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_LIST_CONTENT		, Tmpl_Ent_Tab_History_Medical_List_Content);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT_NEW		, Tmpl_Ent_Tab_History_Medical_Content_New);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT_MAIN_SELECT, Tmpl_Ent_Tab_History_Medical_Content_ICD_Main_Select);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT_SUB_SELECT, Tmpl_Ent_Tab_History_Medical_Content_ICD_Sub_Select);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT			, Tmpl_Ent_Tab_History_Medical_Content);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_PRESCRIPT			, Tmpl_Ent_Tab_History_Medical_Prescription);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_PRESCRIPT_ADD		, Tmpl_Ent_Tab_History_Medical_Prescription_Add);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_BLOOD		    	, Tmpl_Ent_Tab_History_Medical_Test_Blood);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_BLOOD_ADD			, Tmpl_Ent_Tab_History_Medical_Test_Blood_Add);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_IMG		    	, Tmpl_Ent_Tab_History_Medical_Test_Img);
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_IMG_ADD			, Tmpl_Ent_Tab_History_Medical_Test_Img_Add);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.TMPL_DROPZONE_FILE							, Tmpl_PrjDropzone_File);
			
			//---------------------------------------------------------------------------------------------
			//---------------------------------------------------------------------------------------------
			if (!App.controller[pr_grpName]) App.controller[pr_grpName] = {};
			
			if (!App.controller[pr_grpName].List)  
				App.controller[pr_grpName].List				 = new List		(grpName, null, null, null);
			
			if (!App.controller[pr_grpName].Ent)  
				App.controller[pr_grpName].Ent				 = new Ent		(grpName, null, null, null);
			
			if (!App.controller[pr_grpName].EntTabInfo)  
				App.controller[pr_grpName].EntTabInfo		 = new EntTabInfo	(grpName, null, null, null);
				
			if (!App.controller[pr_grpName].EntTabHistDisease)  
				App.controller[pr_grpName].EntTabHistDisease = new EntTabHistDisease	(grpName, null, null, null);
				
			if (!App.controller[pr_grpName].EntTabHistMedical)  
				App.controller[pr_grpName].EntTabHistMedical = new EntTabHistMedical	(grpName, null, null, null);
			
			App.controller[pr_grpName].List					.do_lc_init();
			App.controller[pr_grpName].Ent					.do_lc_init();
			App.controller[pr_grpName].EntTabInfo			.do_lc_init();
			App.controller[pr_grpName].EntTabHistDisease	.do_lc_init();
			App.controller[pr_grpName].EntTabHistMedical	.do_lc_init();
			
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

			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjClientMain", "do_lc_show", e.toString()) ;
			}
		}
		
	};

	return Main;
});