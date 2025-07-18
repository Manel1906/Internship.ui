define([
        'jquery',
        
        'text!group/mat/warehouse/tmpl/MatWarehouse_Main.html',
//        'text!group/mat/warehouse/tmpl/MatWarehouse_Select_Type_02.html',
//        'text!group/mat/warehouse/tmpl/MatWarehouse_Select_Stock.html',
        
        'group/mat/warehouse/ctrl/MatWarehouseList',
        'group/mat/warehouse/ctrl/MatWarehouseEnt',
        'group/mat/warehouse/ctrl/MatWarehouseEntHeader',
        'group/mat/warehouse/ctrl/MatWarehouseEntBtn'
//        'group/mat/warehouse/ctrl/MatWarehouseEntTabs',       
//        'group/mat/warehouse/ctrl/MatWarehouseEntTabInformation',
//        'group/mat/warehouse/ctrl/MatWarehouseEntTabLocation'          
      
        ],
        function($,         		
        		MatWarehouse_Main, 
//        		MatWarehouse_Sel_Type_02,
//        		MatWarehouse_Sel_Stock,
        		
        		MatWarehouseList, 
        		MatWarehouseEnt, 
        		MatWarehouseEntHeader, 
        		MatWarehouseEntBtn
//        		MatWarehouseEntTabs, 
//        		MatWarehouseEntTabInfo,
//        		MatWarehouseEntTabLoc
        ) {

	var MatWarehouseMain 	= function (header,content,footer, grpName) {
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
		
		this.var_lc_MODE_INIT 		= 0;
		this.var_lc_MODE_NEW 		= 1; //duplicate is the mode new after clone object
		this.var_lc_MODE_MOD 		= 2;
		this.var_lc_MODE_DEL 		= 3;	
		this.var_lc_MODE_SEL 		= 5;
	
		//---------------------------------------------------------------
		this.var_lc_Type			= 1;
		
		//---------------------------------------------------------------
		var societeListChild		= 1010011;
		var societeCompany			= 1010010;
		
		var perMoral				= 1000001;
		var perNatural				= 1000002;
		//---------------------------------------------------------------
		this.pr_right_soc_manage	= [30002001, 30002002, 30002003, 30002004, 30002005];
		
		this.var_lc_warehouseListSocChild	= "warehouseListSocChild";
					
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if (!App.controller.MatWarehouse)				
				 App.controller.MatWarehouse				= {};
			
			if (!App.controller.MatWarehouse.Main)	
				App.controller.MatWarehouse.Main 			= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller.MatWarehouse.List		)  
				 App.controller.MatWarehouse.List			= new MatWarehouseList		("#div_MatWarehouse_List" , "#div_MatWarehouse_List_Header", "#div_MatWarehouse_List_Content");				
			if (!App.controller.MatWarehouse.Ent		)  
				 App.controller.MatWarehouse.Ent			= new MatWarehouseEnt		(null, "#div_MatWarehouse_Ent" , null);
			if (!App.controller.MatWarehouse.EntBtn		)  
				 App.controller.MatWarehouse.EntBtn			= new MatWarehouseEntBtn	(null, "#div_MatWarehouse_Ent_Btn" , null);
			if (!App.controller.MatWarehouse.EntHeader	)  
				 App.controller.MatWarehouse.EntHeader		= new MatWarehouseEntHeader	(null, "#div_MatWarehouse_Ent_Header" , null);
//			if (!App.controller.MatWarehouse.EntTabs	)  
//				 App.controller.MatWarehouse.EntTabs		= new MatWarehouseEntTabs	(null, "#div_MatWarehouse_Ent_Tabs" , null);
			
			//----------tab name----------------------------------------------------------------------------------------
//			if (!App.controller.MatWarehouse.EntTabInfo)  
//				 App.controller.MatWarehouse.EntTabInfo	= new MatWarehouseEntTabInfo	(null, "#div_MatWarehouse_Ent_Tab_Info", null);
//			if (!App.controller.MatWarehouse.EntTabLoc) {
//				App.controller.MatWarehouse.EntTabLoc	= new MatWarehouseEntTabLoc		(null, "#div_MatWarehouse_Ent_Tab_Loc", null);
//			}
			//--------------------------------------------------------------------------------------------------
			
			App.controller.MatWarehouse.List		.do_lc_init();
			App.controller.MatWarehouse.Ent			.do_lc_init();
			App.controller.MatWarehouse.EntBtn		.do_lc_init();
			App.controller.MatWarehouse.EntHeader	.do_lc_init();
//			App.controller.MatWarehouse.EntTabs		.do_lc_init();
//			App.controller.MatWarehouse.EntTabInfo	.do_lc_init();
//			App.controller.MatWarehouse.EntTabLoc	.do_lc_init();
							
			
			tmplName.MAT_WAREHOUSE_MAIN			= "Mat_Warehouse_Main";
			tmplName.MAT_WAREHOUSE_LIST			= "Mat_Warehouse_List";
			tmplName.MAT_WAREHOUSE_LIST_HEADER	= "Mat_Warehouse_List_Header";
			tmplName.MAT_WAREHOUSE_LIST_CONTENT	= "Mat_Warehouse_List_Content";
			tmplName.MAT_WAREHOUSE_ENT			= "Mat_Warehouse_Ent";
			tmplName.MAT_WAREHOUSE_ENT_BTN		= "Mat_Warehouse_Ent_Btn";
			tmplName.MAT_WAREHOUSE_ENT_HEADER	= "Mat_Warehouse_Ent_Header";
//			tmplName.MAT_WAREHOUSE_ENT_TABS		= "Mat_Warehouse_Ent_Tabs";
//			tmplName.MAT_WAREHOUSE_ENT_TAB_INFO	= "Mat_Warehouse_Ent_Tab_Info";
//			tmplName.MAT_WAREHOUSE_ENT_TAB_LOC	= "Mat_Warehouse_Ent_Tab_Loc";

			//common list
//			tmplName.MAT_WAREHOUSE_TYP_02		= "Mat_Warehouse_Select_Type_02";
//			
//			tmplName.MAT_WAREHOUSE_LIST_FILTER_BOX				= "Mat_Warehouse_List_Filter_Box";
//			tmplName.MAT_WAREHOUSE_LIST_FILTER_HEADER			= "Mat_Warehouse_List_Filter_Header";
//			tmplName.MAT_WAREHOUSE_LIST_FILTER_CONTENT			= "Mat_Warehouse_List_Filter_Content";
			
			//begin by fetching all mandatory values 
//			doGetCfgValue('cfgValListTypePerson', 	100, 		null);		//Moral or Natural
//			doGetWarehouseListSocChild(self.var_lc_warehouseListSocChild, 	perMoral,	societeListChild);
//			do_get_per_societe(societeCompany);
//			do_get_per_societe(societeListChild);
			
			do_gl_refresh_SecuHeader (self);
		}
		
		this.do_lc_show = function(){
			try { 
							
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_MAIN	, MatWarehouse_Main); 
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_MAIN, {}));	
//				do_gl_apply_right($(pr_divContent));
				
				App.controller.MatWarehouse.List.do_lc_show();
				
				App.controller.MatWarehouse.Ent.do_lc_show({} , this.var_lc_MODE_INIT);	//init: obj is null
//				do_gl_init_Resizable("#div_MatWarehouse_List");
				App.controller.Shp.ShpMain.do_lc_bind_event_div_MaxResize('#div_MatWarehouse_List', '#div_MatWarehouse_Ent');
				App.controller.Shp.ShpMain.do_lc_bind_event_div_Minimize();
				App.controller.Shp.ShpMain.do_lc_bind_event_div_MinResize('#div_MatWarehouse_List', '#div_MatWarehouse_Ent');
								
			}catch(e) {
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV, "mat.warehouse", "MatWarehouseMain", "do_lc_show", e.toString()) ;
			}
		};
		
		this.do_lc_binding_pages = function(div) {
			try {
				if(div.length>0) do_gl_enhance_within(div);
			} catch (e) {
				do_gl_show_Notify_Msg_Error(null, e);
			}
		};
		
		this.do_verify_user_right_soc_manage = function(){
			for(var i = 0; i< this.pr_right_soc_manage.length; i++){
				if(App.data.user.rights.includes(this.pr_right_soc_manage[i]))
					return true;
			}
			return false;
		}

		//---------private-----------------------------------------------------------------------------
		//---------GetCFG Value---------
		function doGetCfgValue(varname, idGroup, val02){	
			var ref 		= req_gl_Request_Content_Send('ServicePerPerson', 'SVPersonGetCfg');
			ref['idGroup']	= idGroup;
			ref['val02']	= val02;
			var fSucces		= [];		
			fSucces.push(req_gl_funct(App, App.funct.put, [varname]));
//			fSucces.push(req_gl_funct(null, translateCFGValue, varname));
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
//		function translateCFGValue(sharedJson, varname){
//			var list =  App.data[varname];
//			for(var i = 0; i <list.length; i++){
//				list[i].name = $.i18n(list[i].val01);			
//			}
//		}
		
		function doGetWarehouseListSocChild(varname, typ01, typ02){	
			var ref 		= req_gl_Request_Content_Send('ServicePersonDyn', 'SVPerLstChildNotDyn');
			ref['typ01']	= typ01;
			ref['typ02']	= typ02;
			var fSucces		= [];		
			fSucces.push(req_gl_funct(App, App.funct.put, [varname]));
//			fSucces.push(req_gl_funct(null, translateCFGValue, varname));
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		var do_get_per_societe = function(typeSoc) {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServicePerPerson', 'SVPersonLst');
			ref["typ02"]	= typeSoc;
			
			var fSucces		= [];
			if(typeSoc == societeCompany)
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstSociete']));
			if(typeSoc == societeListChild)
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstSocieteChild']));
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		var do_build_common_template = function(sharedJson, varname) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = App.data[varname];
				
				var lstType02 		= data[0];
				var lstWarehouse	= data[1];
				
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_TYP_02		, MatWarehouse_Sel_Type_02); 
				tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_TYP_02	, lstType02);
				
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_STOCK		, MatWarehouse_Sel_Stock); 
				tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_STOCK	, lstWarehouse);
				
			}
		}
		
		//--------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
		this.do_show_Msg= function(sharedJson, msg){
			//alert(msg);
			console.log("do_show_Msg::" + msg);
		}
			
	};

	return MatWarehouseMain;
  });