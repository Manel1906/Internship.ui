define([
	'jquery',
	'text!group/mat/bcode/tmpl/MatBcode_Ent_Btn.html',
	'text!group/mat/bcode/tmpl/MatBcode_Receipt.html'
	],

	function($, 
			MatBcode_Ent_Btn,
			MatBcode_Receipt
			) {


	var MatBcodeEntBtn     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content
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
		const C128					= 1;
		const EAN13					= 2;
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

		//-----------------------------------------------------------------------------------
		var pr_btn_Create 			= "#btn_MatBcode_create";
		var pr_btn_Edit 			= "#btn_MatBcode_edit";
		var pr_btn_Duplicate 		= "#btn_MatBcode_duplicate";
		var pr_btn_Del 				= "#btn_MatBcode_del";
		var pr_btn_Export 			= "#btn_MatBcode_export";
		var pr_btn_Send 			= "#btn_MatBcode_send";
		var pr_btn_Print 			= "#btn_MatBcode_print";
		var pr_btn_Save 			= "#btn_MatBcode_save";
		var pr_btn_Cancel 			= "#btn_MatBcode_cancel";
		var pr_btn_Transform 		= "#btn_MatBcode_transform";

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.MatBcode.Main;
			pr_ctr_List 			= App.controller.MatBcode.List;

			pr_ctr_Ent				= App.controller.MatBcode.Ent;
			pr_ctr_EntHeader 		= App.controller.MatBcode.EntHeader;
			pr_ctr_EntBtn 			= App.controller.MatBcode.EntBtn;
//			pr_ctr_EntTabs 			= App.controller.MatBcode.EntTabs;

		}


		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_BCODE_ENT_BTN	, MatBcode_Ent_Btn); 	
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_BCODE_RECEIPT	, MatBcode_Receipt);
				
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_BCODE_ENT_BTN, obj));

				if(mode==App['const'].MODE_INIT	){ // no material selected				
					$(pr_btn_Create		)	.hide();
					$(pr_btn_Edit		)	.hide();
					$(pr_btn_Duplicate	)	.hide();
					$(pr_btn_Del		)	.hide();

					$(pr_btn_Export		)	.hide();
					$(pr_btn_Send		)	.hide();
					$(pr_btn_Print		)	.show();
					$(pr_btn_Transform	)	.hide();

					$(pr_btn_Save		)	.hide();
					$(pr_btn_Cancel		)	.hide();					
				}else if(mode==App['const'].MODE_SEL){ // a object selected				
					$(pr_btn_Create		)	.show();
					$(pr_btn_Edit		)	.show();
					$(pr_btn_Duplicate	)	.show();
					$(pr_btn_Del		)	.show();

					$(pr_btn_Export		)	.hide();
					$(pr_btn_Send		)	.hide();
					$(pr_btn_Print		)	.hide();
					$(pr_btn_Transform	)	.hide();

					$(pr_btn_Save		)	.hide();
					$(pr_btn_Cancel		)	.hide();					
				}else if(mode==App['const'].MODE_NEW){ // in creation or duplication		
					$(pr_btn_Create		)	.hide();
					$(pr_btn_Edit		)	.hide();
					$(pr_btn_Duplicate	)	.hide();
					$(pr_btn_Del		)	.hide();
					$(pr_btn_Transform	)	.hide();

					$(pr_btn_Save		)	.show();
					$(pr_btn_Cancel		)	.show();
				}else if(mode==App['const'].MODE_MOD){ // in modification		
					$(pr_btn_Create		)	.hide();
					$(pr_btn_Edit		)	.hide();
					$(pr_btn_Duplicate	)	.hide();
					$(pr_btn_Del		)	.hide();

					$(pr_btn_Export		)	.hide();
					$(pr_btn_Send		)	.hide();
					$(pr_btn_Print		)	.hide();
					$(pr_btn_Transform	)	.hide();

					$(pr_btn_Save		)	.show();
					$(pr_btn_Cancel		)	.show();					
				}

				do_bind_event_btn_create	(obj, mode);
				do_bind_event_btn_edit		(obj, mode);
				do_bind_event_btn_duplicate	(obj, mode);
				do_bind_event_btn_del		(obj, mode);

				do_bind_event_btn_export	(obj, mode);
				do_bind_event_btn_send		(obj, mode);
				do_bind_event_btn_print		(obj, mode);

				do_bind_event_btn_save		(obj, mode);
				do_bind_event_btn_cancel	(obj, mode);			
			}catch(e) {				
				console.log(e);
			}
		};


		//---------private-----------------------------------------------------------------------------
		//---------private-----------------------------------------------------------------------------

		var do_bind_event_btn_create		= function(){
			$(pr_btn_Create).off('click');
			$(pr_btn_Create).click(function(){
				pr_ctr_Ent.do_lc_new();
			});
		}	

		var do_bind_event_btn_duplicate	= function(obj){
			$(pr_btn_Duplicate).off('click');
			$(pr_btn_Duplicate).click(function(){
				//clone obj
				pr_ctr_Ent.do_lc_duplicate(obj);
			});
		}

		var do_bind_event_btn_edit			= function(obj){
			$(pr_btn_Edit).off('click');
			$(pr_btn_Edit).click(function(){
				pr_ctr_Ent	.do_lc_Lock_Begin(obj);
			});	
		}

		var do_bind_event_btn_del			= function(obj){
			$(pr_btn_Del).off('click');
			$(pr_btn_Del).click(function(){				
				App.MsgboxController.do_lc_show({
					title	: $.i18n("page_[PCK_M]_[PRJ_M]_btn_del_title"	),
					content : $.i18n("page_[PCK_M]_[PRJ_M]_btn_del_content"	),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: pr_ctr_Ent	.do_lc_delete,
							param	: [obj]						
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});				
			});
		}

		var do_bind_event_btn_save			= function(obj, mode){
			$(pr_btn_Save).off('click');
			$(pr_btn_Save).click(function(){				
				pr_ctr_Ent.do_lc_save(obj, mode);				
			});
		}
		var do_bind_event_btn_cancel		= function(obj, mode){
			$(pr_btn_Cancel).off('click');
			$(pr_btn_Cancel).click(function(){
				App.MsgboxController.do_lc_show({
					title	: $.i18n("page_[PCK_M]_[PRJ_M]_btn_cancel_title	 "),
					content : $.i18n("page_[PCK_M]_[PRJ_M]_btn_cancel_content"),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: doCancel,
							param	: []							
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel")								
						}
					}
				});	
			});
		}

		var do_bind_event_btn_export		= function(obj, mode){
			$(pr_btn_Export).off('click');
			$(pr_btn_Export).click(function(){
			});
		}

		var do_bind_event_btn_send		= function(obj, mode){
			$(pr_btn_Send).off('click');
			$(pr_btn_Send).click(function(){
			});
		}

		var do_bind_event_btn_print		= function(obj, mode){
			$(pr_btn_Print).off('click');
			$(pr_btn_Print).click(function(){
				var div = newWinToPrint(EAN13); // for EAN13 font
				var w = window.open('','__blank');
				$(w.document.body).html(div);
				// Set time enough for rendering base64 font
				setTimeout(() => {
					w.print();
				}, 50);
			});
		}


		function newWinToPrint(type) {
			let obj = [...App.data.lst_mat];
			
			let res =  [];
			for (var i in obj){
				var x = obj[i];
				for (var j=0;j<x.quantity; j++){
					res.push(JSON.parse(JSON.stringify(x)));
				}
			}
			
			if (type == EAN13) {
			}

			let div = tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_BCODE_RECEIPT	, res)

			return div
		}

		//----------------------------------------------------------------------------------------------
		function doCancel(obj){		
			if(App.data.mode == App['const'].MODE_NEW) {	
				App.data.mode = App['const'].MODE_SEL;
				self		.do_lc_show		(null, App.data.mode);
				pr_ctr_Ent	.do_lc_show		(null, App.data.mode);
			} else if(App.data.mode == App['const'].MODE_MOD) {				
				pr_ctr_Ent	.do_lc_Lock_Cancel	(obj);			
			} 			
		}

		function doGetString(){
			var strLstBCode = "";
			var list 		= App.data.lst_mat;
			if(!list || list.length == 0 || list == undefined || list == null) return;
			strLstBCode 	= strLstBCode + "SELECT " + list[0].id + " AS val ";
			list[0].quantity--;
			for(var j = 0; j < list.length; j++){
				var o 		= list[j];
				var quant 	= o.quantity;
				var id 		= o.id;
				var k 		= 0;
				while (k< quant) {
					strLstBCode = strLstBCode+"UNION ALL SELECT " + id +" ";
					k++;
				}
			}
			list[0].quantity++;
			strLstBCode = strLstBCode.slice(0, -1);
			pr_ctr_Ent.do_lc_print(strLstBCode);
		}

	};

	return MatBcodeEntBtn;
});