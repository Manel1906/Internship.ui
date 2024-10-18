define([
	'jquery',
	'text!group/mat/bcode/tmpl/MatBcode_Ent_Header.html'

	],

	function($, 
			MatBcode_Ent_Header) {


	var MatBcodeEntHeader     = function (header,content,footer, grpName) {
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
		var lst_mat					= [];

		var pr_mode_line			= null;
		var pr_mode_plus			= 0;
		var pr_mode_less			= 1;
		var pr_mode_del				= 2;
		var pr_mode_new				= 3;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.MatBcode.Main;
			pr_ctr_List 			= App.controller.MatBcode.List;

			pr_ctr_Ent				= App.controller.MatBcode.Ent;
			pr_ctr_EntHeader 		= App.controller.MatBcode.EntHeader;
			pr_ctr_EntBtn 			= App.controller.MatBcode.EntBtn;
		}      

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_BCODE_ENT_HEADER	, MatBcode_Ent_Header); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_BCODE_ENT_HEADER, lst_mat));

				do_bind_event(obj, mode);
			}catch(e) {				
				console.log(e);
			}
		};

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			$("#div_lst_bcode_mat").prop("droppable", true);

			$("#div_MatBcode_Ent").on("drop" , "#div_lst_bcode_mat", function(event){
				event.preventDefault();
				var data = JSON.parse(event.originalEvent.dataTransfer.getData("data"));
				self.do_lc_get_list(data);
				self.do_lc_show_list();
			})

			$("#div_MatBcode_Ent").on("dragover", "#div_lst_bcode_mat", function(event){
				event.preventDefault();
			})

			$("#div_MatBcode_Ent").on("click", ".a_delete", function(){
				var id = $(this).data("id");
				App.MsgboxController.do_lc_show({
					title	: $.i18n("mat_bcode_btn_del_title"),
					content : $.i18n("mat_bcode_btn_del_msg"),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_ok"),
							funct	: function(){
								pr_mode_line = pr_mode_del;
								do_lc_action_mat(id, pr_mode_line)
							}
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});	
			})

			$("#div_MatBcode_Ent").on("click", ".a_add", function(){
				var id = $(this).data("id");
				pr_mode_line = pr_mode_plus;
				do_lc_action_mat(id, pr_mode_line);
			})

			$("#div_MatBcode_Ent").on("click", ".a_less", function(){
				var id = $(this).data("id");
				pr_mode_line = pr_mode_less;
				do_lc_action_mat(id, pr_mode_line);
			})

			$("#div_MatBcode_Ent").on("blur", ".input_quant", function(){
				var id = $(this).data("id");
				var val = $(this).val();
				pr_mode_line = pr_mode_new;
				do_lc_action_mat(id, pr_mode_line, val, this);
			})

		}

		var do_lc_action_mat = function(id, mode, val, input){
			for(var i = 0; i<lst_mat.length; i++){
				var item = lst_mat[i];
				if(item.id == id){
					switch (mode) {
					case pr_mode_del:
						lst_mat.splice(i, 1);
						break;
					case pr_mode_plus:
						item.quantity = parseInt(item.quantity) + 1;
						break;
					case pr_mode_less:
						item.quantity = parseInt(item.quantity) - 1;
						if(item.quantity == 0){
							lst_mat.splice(i, 1);
						}
						break;
					case pr_mode_new:
						if(val > 0){
							if(val%1 === 0){
								item.quantity = val;
							} else {
								$(input).val(item.quantity);
							}
						} else {
							$(input).val(item.quantity);
						}
						break;
					}
					break;
				}
			}
			self.do_lc_show_list();
		}

		this.do_lc_get_list = function(data){
			var k = 0;
			$.each(lst_mat, function(i,o){
				if(o.id == data.id){
					o.quantity = parseInt(o.quantity) +1;
				}else {
					k++;
				}
			})

			if(k == lst_mat.length){
				data.quantity = 1 ;
				lst_mat.unshift(data);
			}
		}

		this.do_lc_show_list = function(obj){
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_BCODE_ENT_HEADER, lst_mat));

			App.data.lst_mat = lst_mat;
			do_gl_render_datatable($(pr_divContent), {
				"obj"		: obj,
				"datatable"	:{"pageLength": 100}
			});
		}

		this.doEmptyList = function(){
			lst_mat = [];
			self.do_lc_show_list();
		}

	};

	return MatBcodeEntHeader;
});