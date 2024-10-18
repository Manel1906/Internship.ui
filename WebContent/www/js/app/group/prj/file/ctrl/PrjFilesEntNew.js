define([
	'text!group/prj/file/tmpl/PrjFiles_EntCreate.html',
	'text!group/prj/file/tmpl/PrjFiles_EntNew.html',
	],
	function(
			PrjFiles_EntCreate,
			PrjFiles_EntNew
	) {

	const PrjFilesEntNew     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;

		var self 					= this;		
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
		const pr_SV_NEW				= "SVNew"; 
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		//-----------------------------------------------------------------------------------
		const pr_SERVICE_USER_CLASS	= "ServiceAutUser";
		const pr_SV_USER_SEARCH		= "SVLst";

		var members 					= {};
		const pr_member_lev_manager 	= 0;

		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;
		//---------------------------------Const--------------------------------------------------
		const pr_LEVEL_PRJ				= 1;
		const pr_LEVEL_EPIC				= 2;
		const pr_LEVEL_TASK				= 3;

		const pr_TYP02_PRJ_MAIN         = 0;
    	const pr_TYP02_PRJ_SUB          = 1;
    	const pr_TYP02_PRJ_ELE          = 2;
		
		const pr_TYP00_PRJ_PROJECT      = 10;
		const pr_TYP00_PRJ_DATACENTER   = 20;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 						= App.controller.DBoard.DBoardMain;
			tmplName.PRJ_FILE_ENT_CREATE		= "PrjFiles_EntCreate";
			tmplName.PRJ_FILE_ENT_NEW		    = "PrjFiles_EntNew";
		}

		//---------show-----------------------------------------------------------------------------
		var pr_grpPath 		= 'group/prj/_transl';
		var pr_showed		= false;
		this.do_lc_show = function(obj = {files: []}, mode){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath, self.do_lc_show_callback, [obj, mode]);
				pr_showed = true;
			}else {
				self.do_lc_show_callback(obj, mode);
			}
		};
		
		this.do_lc_show_callback		= function(obj = {files: []}, mode){	
			App.router.controller.do_lc_append_custom_tags()
			
			members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_FILE_ENT_CREATE						, PrjFiles_EntCreate);
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_FILE_ENT_NEW						, PrjFiles_EntNew);
			$("#div_main_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILE_ENT_CREATE	, {}));
			$("#div_prj_new")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILE_ENT_NEW	, {lev: pr_LEVEL_PRJ, typ02: pr_TYP02_PRJ_MAIN, currencys: App.data.currencys}));
			
			do_lc_init_element(obj);
			do_lc_bind_event(obj);
		}

		const do_lc_init_element = obj => {
			let option_avatar		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1}, acceptedFiles: "image/*" },//option here
					obj			: obj//file existing here
			}
			let option_docs		= {
					fileinput	: {param : {typ01: 2, typ02: 10} },//option here
					obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_prj_avatar"	), option_avatar);
			do_gl_init_fileDropzone($("#div_prj_docs"	), option_docs);//file input

			App.SummerNoteController.do_lc_show("#div_create_prj");//text editor
			
		}

		const do_lc_bind_event = obj => {
			$("#btn_create_prj").off("click").on("click", function(){
				let	data	 		= req_gl_data({
					dataZoneDom		: $("#div_create_prj")
				});

				let $projectdesc 	= $("#projectdesc");
				if ($projectdesc.summernote('isEmpty')){
					$projectdesc.parent().append("<div class='errMsg'>" + $.i18n("validator_err_required") + "</div>")
				}

				if(data.hasError)	return false;

				let prj 	= data.data;
				prj.files 	= obj.files;
//				prj.dtBegin = do_lc_convert_date(prj.dtBegin);
//				prj.dtEnd 	= do_lc_convert_date(prj.dtEnd);
				
				prj.typ00 	= pr_TYP00_PRJ_DATACENTER;
				prj.typ02 	= pr_TYP02_PRJ_MAIN;

				do_lc_create_prj(prj);
			})

			do_lc_req_autocomplete();
		};

//		const do_lc_convert_date = objDate => objDate.date.substr(0, 10) + " " + objDate.time.substr(0, 5) + ":00";

		const do_lc_req_autocomplete = () => {
			let el = ".inp-name-member";
			members = {}
			let customShowList = function(item, selOpt = ""){
			    // if(!item.avatar)	item.avatar = {path01: UI_URL_ROOT + "img/prj/users/avatar-" 		+ do_gl_reqRandom_number(1, 1) 	+ ".jpg"};
			    // selOpt 			+= `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs avatar-autocomplete'/> ${item.login01}`;
			    // return selOpt;


			    if(item.avatar)			return	selOpt 			+= `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.login01}`;
			    if(!item.avatar){
			        let textColor   = null;
			        let textAvatar  = null
			        if(!item.avatar){
			            let first = item.login01.charAt(0);
			            let last  = item.login01.charAt(item.login01.length - 1);
			            let index = var_gl_alphabet.indexOf(first.toLowerCase());
			            
			            textColor = var_gl_colors[index];
			            textAvatar= first + last;
			        }
			        selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white text-uppercase text-center mr-1" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}</div>`;
			        return selOpt;
			    }
			}

			let reqSelectMember = (event, item) => {
				if(members[item.id])			return false;
				let lev             = $("#sel_member_level").val();
				let typ             = $("#sel_member_type").val();
				let user            = {"id": item.id, "lev": +lev, "typ": +typ};

				members[item.id]    = user;

				if(!item.avatar){
					let first    = item.login01.charAt(0);
					let last     = item.login01.charAt(item.login01.length - 1);
					let index    = var_gl_alphabet.indexOf(first.toLowerCase());
					
					textColor    = var_gl_colors[index];
					textAvatar   = first + last;
				}

				let selOpt        = `<div class='member-item'>`;
				if(item.avatar) selOpt 	  += `<div><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.login01}`;
				else 			selOpt    += `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}`;

				selOpt            += `<a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt            += `</div></div>`;

				$("#div_list_member").append(selOpt);
				do_lc_bind_event_autocomplete();
				$(el).blur().val("");
			}

			let typ01Arr 	= [App.data.user.typ01, 2, 3, 4, 5];
			let typ01Str 	= typ01Arr.join(',');
			let options 	= {
			    dataService 	: [pr_SERVICE_USER_CLASS, pr_SV_USER_SEARCH],
			    svParams		: {wAvatar:true, nbline:5, typ01s: typ01Str, stats:1}, 
			    fSelect			: reqSelectMember, 
			    dataRes 		: ["login01", "name"],//stat:1,  // typ01: $("#inp_home_search_typ01_val").val() 
			    customShowList	: customShowList
			}
			do_gl_req_autocompleteNew(el, options);
		}

		const do_lc_bind_event_autocomplete = () => {
			$(".btn-remove-member").off("click").on("click", function(){
				let $this   = $(this);
				let parent  = $this.parent();
				let {id}    = $this.data();

				if(members[id])	delete members[id];
				parent.remove();
			})
		}

		const do_lc_create_prj = prj => {
			let dataSend	= {
				obj           : JSON.stringify(prj),
				member        : JSON.stringify(Object.values(members))
			};
			let ref        = req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW, dataSend);

			let fSucces    = [];
			fSucces.push(req_gl_funct(null, do_lc_show_prj, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_show_prj = (sharedJson, prj) => {
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				const {id, code01} = data;
				App.router.controller.do_lc_run("VI_MAIN/prj_file_ent", `view_prj_file_content.html?id=${id}&code=${code01}`)
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
	}

	return PrjFilesEntNew;
});