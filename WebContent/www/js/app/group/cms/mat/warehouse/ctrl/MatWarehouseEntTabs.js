define([
        'jquery',
        'text!group/mat/warehouse/tmpl/MatWarehouse_Ent_Tabs.html'

        ],
        function($, 
        		MatWarehouse_Ent_Tabs
        		) {


	var MatWarehouseEntTabs     = function (header,content,footer, grpName) {
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

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
		//-------------------------------------------------
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
			pr_ctr_EntTabInfo		= App.controller.MatWarehouse.EntTabInfo;
			pr_ctr_EntTabLoc		= App.controller.MatWarehouse.EntTabLoc;
			
		}     
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_ENT_TABS, MatWarehouse_Ent_Tabs); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_ENT_TABS, obj));
				
				//fixed max-height scroll of % height div_ContentView
				//do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-tab", 43.6);
							
				pr_ctr_EntTabInfo.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntTabLoc.do_lc_show(pr_obj, pr_mode);
				
				do_bind_event(obj, mode);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, "mat.warehouse", "MatWarehouseEntTabs", "do_lc_show", e.toString()) ;
			}
		};
		

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			
		}

	};


	return MatWarehouseEntTabs;
});