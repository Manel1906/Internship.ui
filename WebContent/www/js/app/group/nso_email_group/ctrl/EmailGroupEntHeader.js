define([
	'jquery',
	'text!group/nso_email_group/tmpl/EmailGroup_Ent_Header.html'

	],

	function($, 
			EmailGroup_Ent_Header) {


	var EmailGroupEntHeader     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

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

		var svClass         			= App['const'].SV_CLASS;
		var svName          			= App['const'].SV_NAME;
		var userId          			= App['const'].USER_ID;
		var sessId          			= App['const'].SESS_ID;
		var fVar            			= App['const'].FUNCT_SCOPE;
		var fName           			= App['const'].FUNCT_NAME;
		var fParam          			= App['const'].FUNCT_PARAM;

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
			pr_ctr_Main 			= App.controller.PrjEmailGroup.Main;
			pr_ctr_List 			= App.controller.PrjEmailGroup.List;

			pr_ctr_Ent				= App.controller.PrjEmailGroup.Ent;
			pr_ctr_EntHeader 		= App.controller.PrjEmailGroup.EntHeader;
			pr_ctr_EntBtn 			= App.controller.PrjEmailGroup.EntBtn;
			pr_ctr_EntTabs 			= App.controller.PrjEmailGroup.EntTabs;

		}      

		this.do_lc_show		= function(obj, mode){
			pr_object 	= obj;
			pr_mode		= mode;

			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_GROUP_ENT_HEADER	, EmailGroup_Ent_Header); 			
				$(pr_divContent)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_GROUP_ENT_HEADER, obj));

				if(mode == pr_ctr_Main.var_lc_MODE_NEW){
					$(".info-content").addClass("hide");
					$(".content-edit").removeClass("hide");
				}

				do_bind_event(obj, mode);
				App.controller.PrjEmailGroup.Main.do_lc_bind_event_resize();
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "tpy.cat", "EmailGroupEntHeader", "do_lc_show", e.toString()) ;
			}
		};

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			$(".info-edit").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")			.addClass("hide");
				$parent.find(".info-content-worker")	.addClass("hide");
				$parent.find(".content-edit")	.removeClass("hide");
				$parent.find(".content-edit")	.prop("disabled", false);
				if($parent.find(".content-edit").length > 0){
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
				}
			})

			$("#a_btn_save").off("click").on("click", function(){
				pr_ctr_Ent.do_lc_save(obj, pr_ctr_Main.var_lc_MODE_MOD);	
			})
			$("#a_btn_cancel").off("click").on("click", function(){
				self.do_lc_show(obj,mode);	
			})
		}

	};


	return EmailGroupEntHeader;
});