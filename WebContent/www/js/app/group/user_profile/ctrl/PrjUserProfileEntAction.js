define([
	'text!group/user_profile/tmpl/PrjUser_Profile_Ent_Action.html'
	],
	function(	
			PrjUser_Profile_Ent_Action
	){

	var PrjUserProfileEntAction 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header  ? header : null;
		var pr_divContent 			= "#div_prj_action";
		var pr_divFooter 			= footer  ? footer : null;

		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divTabPerInfo 		= "#div_prj_info_person";

		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;

		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		//var url_header				= req_gl_Security_HttpHeader(App.keys.KEY_STORAGE_CREDENTIAL);

		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 1000;
		const pr_SERVICE_CLASS		= "ServiceAutUser"; //to change by your need
		const pr_SV_GET				= "SVAutUserGet"; 
		var pr_SV_NEW				= "SVAutUserNew"; 
		var pr_SV_DEL				= "SVAutUserDel"; 

		var pr_SV_MOD				= "SVAutUserMod"; 	//if not use lock

		var pr_SV_LCK_NEW			= "SVAutUserLckReq";
		var pr_SV_LCK_END			= "SVAutUserLckEnd";
		var pr_SV_LCK_DEL			= "SVAutUserLckDel";
		//------------------const object------------------------------------------------------
		const typeUserClient		= 1010002;
		const societeListCompany	= 1010010;
		const societeListChild		= 1010011;
		const societePartnerSupp	= 1010003;
		const societePartnerOther	= 1010006;
		//-----------------------------------------------------------------------------------
		var pr_right_soc_manage		= [30002001, 30002002, 30002003, 30002004, 30002005];
		
		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_adm_all    		= 10;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			
			tmplName.PRJ_USER_PROFILE_ENT_ACTION				= "PrjUser_Profile_Ent_Action";
			
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(prj, mode){               
			try{
					do_lc_load_view();
					do_lc_show_prj(prj, mode);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		};
		
		var do_lc_load_view = function(){			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_PROFILE_ENT_ACTION		, PrjUser_Profile_Ent_Action);
			
		}
		
		var do_lc_show_prj = function(prj, mode){
			do_lc_show_prj_content(prj, mode);
		}
		
		var do_lc_show_prj_content = function(prj, mode){
			$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_PROFILE_ENT_ACTION, prj));
			
			do_lc_bind_event_content_prj(prj);
		}
		
		var do_lc_bind_event_content_prj = function(prj){
			
		};
		
	};

	return PrjUserProfileEntAction;
});