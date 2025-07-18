define([
	'jquery',
	'text!group/mat/material/tmpl/Ent_Tab_Cat.html',
	'text!group/mat/material/tmpl/Ent_Tab_Cat_Sub.html'

	],
	function($,
			Ent_Tab_Cat,
			Ent_Tab_Cat_Sub   		
	) {


	var CtrlEntTabCat     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names[pr_grpName];
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
		var pr_default_new_line	= {
				DT_RowClass: "",
				id						: -1,
				topic_id 				: null,
				groupEdu_topic_name_ref	: null,
				topic_group_name_ref	: null,
				groupEdu_number_question: null,
				groupEdu_min_difficulty	: null,
				groupEdu_max_difficulty	: null,
				mode					: 1,
				dbFlag					:0,
		};

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;

		//-------------------------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;

		//--------------------APIs-------------------------------------------------------------------------
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;

			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntHeader 		= App.controller[pr_grpName].EntHeader;
			pr_ctr_EntBtn 			= App.controller[pr_grpName].EntBtn;
			pr_ctr_EntTabs 			= App.controller[pr_grpName].EntTabs;		
			
			tmplName.ENT_TAB_CAT    				= "Ent_Tab_Cat";
			tmplName.ENT_TAB_CAT_SUB    			= "Ent_Tab_Cat_Sub";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TAB_CAT		, Ent_Tab_Cat); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TAB_CAT_SUB	, Ent_Tab_Cat_Sub);
		}

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TAB_CAT, App.data.LstCategories));
				
				do_lc_show_cat("#div_Ent_Tab_Cat_Main", App.data.LstCategories);
				if(obj.cats){
					do_parse_cats(obj, obj.cats);
				}
			}catch(e) {		
				console.log(e);
//				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, "mat.material", "CtrlEntTabCat", "do_lc_show", e.toString()) ;
			}
		}

		//--------------------------------------------------------------------------------------------------
		function do_parse_cats(obj, catMat){
			for(var i=0;i< catMat.length;i++){
				$("#div_"+catMat[i].catId).find("input").prop('checked', true);
			}
		}

		//--------------------------------------------------------------------------------------------------
		
		var do_lc_show_cat = function (div, listCat){
			$(div).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TAB_CAT_SUB, {'child': listCat}));
			do_bind_event_categrory();
			
		}
			
		var do_bind_event_categrory = function (){
			$('.input_sel_Cat').change(function() {
				var catId 	= $(this).attr("data-name");
				var lev		= $(this).attr("data-lev");
				var parId	= $(this).attr("data-par");
				
				if (this.checked) {
					$(this).prop('checked', true);
//					$("#div_Sub_"+catId).show();
					
					
					while (lev>0){
						var ele = $("#div_"+parId).find(".input_lev_"+(lev-1));
						ele.prop('checked', true);
						parId	= ele.attr("data-par");
						lev--;
					}
					
				} else {
					$("#div_Sub_"+catId).find("input").prop('checked', false);
				}
			});
		}
		//--------------------------------------------------------------------------------------------------
	}
	return CtrlEntTabCat;
});