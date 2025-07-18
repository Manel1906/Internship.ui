define([
        'jquery',
        'text!group/mat/warehouse/tmpl/MatWarehouse_Ent_Header.html'

        ],

        function($, 
        		MatWarehouse_Ent_Header) {


	var MatWarehouseEntHeader     = function (header,content,footer, grpName) {
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
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_ENT_HEADER	, MatWarehouse_Ent_Header); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_ENT_HEADER, {"wh" : obj, "soc" : App.data[pr_ctr_Main.var_lc_warehouseListSocChild]}));
				
				//fixed max-height scroll of % height div_ContentView
				//do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-header", 25);
				
				do_bind_event(obj, mode);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, "mat.warehouse", "MatWarehouseEntHeader", "do_lc_show", e.toString()) ;
			}
		};
			
		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
//			$("#inp_mat_warehouse_typ02").html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_TYP_02));
//			do_gl_select_value($("#inp_mat_warehouse_typ02"), obj.typ02);
//			
//			$("#inp_warehouse_ent_stock").html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_STOCK));
//			do_gl_select_value($("#inp_warehouse_ent_stock"), obj.stock);
			
			do_gl_add_validation_event({dataZone: $(pr_divContent), event: "blur"})
			
			var rightSocMa = pr_ctr_Main.do_verify_user_right_soc_manage();
			if(!rightSocMa)
				$("#div_mat_warehouse_societe").hide();
			else{
				var LstAllSociete = App.data["LstSociete"].concat(App.data["LstSocieteChild"]);
				for(var i=0; i<LstAllSociete.length; i++){
					if(LstAllSociete[i].id == obj.manId){
						$("#inp_mat_warehouse_societe")	.val(LstAllSociete[i].name01);
						break;
					}
				}
				do_gl_input_autocomplete("#inp_mat_warehouse_societe", {
					required: true,
					source: App.data["LstSociete"].concat(App.data["LstSocieteChild"]),
					selectCallback: function(item ) {
						$("#socId")						.val(item.id);
						$("#inp_mat_warehouse_societe")	.val(item.name01);
					},
					renderAttrLst: ["name01"],
					minLength: 0,
				});
			}
		}

	};


	return MatWarehouseEntHeader;
});