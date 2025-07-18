define([
        'jquery',
        'text!group/mat/warehouse/tmpl/MatWarehouse_Ent_Tab_Location.html'      

        ],
        function($,
        		MatWarehouse_Ent_Tab_Loc    		
        		) {


	var MatWarehouseEntTabLocation     = function (header,content,footer, grpName) {
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
		
		var pr_default_new_line	= {
				DT_RowClass: "",
				id 		: null,
				mat		: null,
				code	: null,
				name	: null,
				unit	: null,
				unitlab	: null,
				quant	: null,
				dt01	: null,
				dt02	: null,
				stat	: 1,
				val01	: null,
				val02	: null,
				mode	: 1
		};
		
		//--------------------Cache-------------------------------------
		var pr_cache_material_by_search_key = {};
		var pr_cache_unit_by_mat_id = {};
		
		
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
	
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.MatWarehouse.Main;
			pr_ctr_List 			= App.controller.MatWarehouse.List;
			
			pr_ctr_Ent				= App.controller.MatWarehouse.Ent;
			pr_ctr_EntHeader 		= App.controller.MatWarehouse.EntHeader;
			pr_ctr_EntBtn 			= App.controller.MatWarehouse.EntBtn;
			pr_ctr_EntTabs 			= App.controller.MatWarehouse.EntTabs;
			
		}
		
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_ENT_TAB_LOC, MatWarehouse_Ent_Tab_Loc); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_ENT_TAB_LOC, obj));
				
				do_bind_event (obj, mode);
			}catch(e) {
				console.log(e);
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, "mat.warehouse", "MatWarehouseEntTabLocation", "do_lc_show", e.toString()) ;
			}
		};


		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			pr_mode = mode;
			if(mode == App['const'].MODE_NEW) {
				obj.detail = [];
				do_init_detail_table(obj);
			} else {
//				do_req_list_detail(obj);
			}
		}.bind(this);
		
	};


	return MatWarehouseEntTabLocation;
});