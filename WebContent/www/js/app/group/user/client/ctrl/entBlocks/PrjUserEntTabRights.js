define([
	'jquery',
	'text!group/user/client/tmpl/PrjUser_Ent_Tab_Rights.html'     

	],
	function($,
			PrjUser_Ent_Tab_Rights    		
	) {


	var PrjUserEntTabRights     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		
		var pr_divFooter 			= footer;
		var pr_divContent 			= "#div_user_rights";
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
		//------------------------------------------------------------------------------------

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;


		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.AutUser.Main;
			pr_ctr_List 			= App.controller.AutUser.List;

			pr_ctr_Ent				= App.controller.AutUser.Ent;
			pr_ctr_EntHeader 		= App.controller.AutUser.EntHeader;
			pr_ctr_EntBtn 			= App.controller.AutUser.EntBtn;
			pr_ctr_EntTabs 			= App.controller.AutUser.EntTabs;

		}
		
		tmplName.PRJ_USER_ENT_TAB_RIGHTS			= "PrjUser_Ent_Tab_Rights";
		this.do_lc_show		= function(obj, mode){
			pr_object 	= obj;
			pr_mode		= mode;
			try {
				var arr_auth =[
					{	"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0, 
						"rId" :  1000000 , "title" : $.i18n("aut_right_aut_user")},
					
					{	"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
						"rId" : 30000010 , "title" : $.i18n("aut_right_per_client")},					
					
					{	"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
						"rId" : 40000000 , "title" : $.i18n("aut_right_prj_project")},
				]
				arr_auth = req_update_data(arr_auth,obj)
				tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_ENT_TAB_RIGHTS, PrjUser_Ent_Tab_Rights); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_ENT_TAB_RIGHTS, arr_auth));
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "aut.user", "AutUserEntTab01", "do_lc_show", e.toString()) ;
			}
		};


		//---------private-----------------------------------------------------------------------------
		var req_update_data = function (arr,obj){
			if(obj.uRights && obj.uRights.length>0){
				let uRights = obj.uRights;
				for(var i = 0 ;i<uRights.length;i++){
					var  index 	= uRights[i].rId%10;
					var  rId 	= uRights[i].rId-index;							
					
					for(var j = 0 ;j< arr.length;j++){
						if(rId == arr[j].rId){							
							switch (index){
							case 1: arr[j].id1 = uRights[i].id; arr[j].r1 = 1;break;
							case 2: arr[j].id2 = uRights[i].id; arr[j].r2 = 1;break;
							case 3: arr[j].id3 = uRights[i].id; arr[j].r3 = 1;break;
							case 4: arr[j].id4 = uRights[i].id; arr[j].r4 = 1;break;
							case 5: arr[j].id5 = uRights[i].id; arr[j].r5 = 1;break;
							}	
							break;
						}
					}
					
				}
			}
			return arr;
		}
	};


	return PrjUserEntTabRights;
});