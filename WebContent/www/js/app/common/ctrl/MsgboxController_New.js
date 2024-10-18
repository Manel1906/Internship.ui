var MsgboxController 	= function () {
	const pr_grpName		= 'MsgBox';
	const tmplName			= App.template.names[pr_grpName] = {};
	const tmplCtrl			= App.template.controller;

	require(['text!common/tmpl/CMS_MsgBox_New.html'], function (tmpl) {
		tmplName	.CMS_MSGBOX_NEW 		= pr_grpName+ "CMS_MsgBox";

		tmplCtrl.do_lc_put_tmplRaw(tmpl, pr_grpName);
	});


	var self 				= this;
	var pr_msgboxDivId		= "#msb_message_box_";

	var pr_msgElts 			= [];
	var pr_curElt			= 0;

	var pr_NUMBER_MSGBOX 	= 0;

	this.BASE_ZINDEX 		= 1040;


	this.do_lc_show = function(params) {
		do_lc_init_modal();
		do_lc_clean_msgBox();
		do_lc_get_content_modal(params);
		do_lc_bind_event_msgBox(params);
		
		//---class declared in _responsive.css
		//---use this class to keep scroll when multi modal opened and close => class modal is remove, then scrolling is disabled
		$('body').addClass('modal-open-hnv');
	};

	this.do_lc_close = function() {		
		$(pr_msgboxDivId + pr_NUMBER_MSGBOX).modal("hide");
		pr_NUMBER_MSGBOX--;

		if (pr_NUMBER_MSGBOX > 0) {
			adjustBackdrop();
			// bootstrap removes the modal-open class when a modal is closed; add it back
			$('body').addClass('modal-open-hnv');
		} else{
			pr_NUMBER_MSGBOX = 0;
			$('body').removeClass('modal-open-hnv');
		}
	};
	
	this.do_lc_refresh = function() {		
		if (pr_NUMBER_MSGBOX > 0) {
			// bootstrap removes the modal-open class when a modal is closed; add it back
			$('body').addClass('modal-open-hnv');
		}else{
			pr_NUMBER_MSGBOX = 0;
			$('body').removeClass('modal-open-hnv');
		}
	};

	this.do_lc_reset = function() {
		if (pr_NUMBER_MSGBOX > 0) {
			for (var i=1;i<=pr_NUMBER_MSGBOX;i++)
				$(pr_msgboxDivId + i).modal("hide");
		}
		pr_NUMBER_MSGBOX =0;
		$('body').removeClass('modal-open-hnv');
	}

	//--------------------------------------------------------------------------------------------
	var bindDefaultEvent = function() {
		$("body").on("keydown", onTabEvent);
	};


	var adjustModal = function($target){
		let modalIndex = pr_NUMBER_MSGBOX - 1;
		$target.css('z-index', this.BASE_ZINDEX + (modalIndex * 20) + 10);
	}

	var adjustBackdrop = function () {
		let modalIndex = pr_NUMBER_MSGBOX - 1;
		$('.modal-backdrop:first').css('z-index', this.BASE_ZINDEX + (modalIndex * 20));
	};

	var do_lc_init_modal = function(){
		pr_NUMBER_MSGBOX++;
		$("body").append(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_MSGBOX_NEW, {num: pr_NUMBER_MSGBOX}));

		let $target = $(pr_msgboxDivId + pr_NUMBER_MSGBOX);
		
		adjustModal($target);
		adjustBackdrop();

		$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .close").on("click", this.do_lc_close);
	}.bind(this);

	var do_lc_clean_msgBox = function(){
		$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-footer")	.html("");
		$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-body")	.html("");
		$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-footer")	.show();
		$("body").off("keydown", onTabEvent);
	}

	var do_lc_get_content_modal = function(params){
		if(params.css) {
			for(let i in params.css){
				$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-dialog" ) .css(i, params.css[i]);
			}
		}

		if(params.title) {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-title").html(params.title);
		}

		if(params.content) {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-body").html(params.content);
		}

		if(params.buttons) {
			var btns = params.buttons;
			if(params.buttons == "none") {
				$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-footer").hide();
			} else {
				Object.keys(params.buttons).forEach(function(key) {
					let btn 		= btns[key];
					let btnlabel 	= btn && btn.lab 		? btn.lab		: key;
					let btnClass 	= btn && btn.classBtn 	? btn.classBtn 	: "btn-default";
					let $btnKey 	= $(pr_msgboxDivId + pr_NUMBER_MSGBOX + " #btn_msgbox_"+key);

					if($btnKey.length > 0) {
						$btnKey.off("click");
						$btnKey.remove();
					}

					$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-footer").append(`<button id='btn_msgbox_${key}' type='button' class='btn ${btnClass}' >${btnlabel}</button>`);

					$btnKey = $(pr_msgboxDivId + pr_NUMBER_MSGBOX + " #btn_msgbox_"+key);

					if(btn != null) {	
						if(!btn.param) {
							btn.param = [];
						}
						if(!btn.context) {
							btn.context = null;
						}

						if(btn.funct) {
							$btnKey.off("click").on("click", function(){  
								btn.funct.apply(btn.context, btn.param);
							});

						} else if(btn.action) {
							$btnKey.off("click").on("click", function(){  
								btn.action.apply(btn.context, btn.param);
							});
						}

//						btn.funct && $btnKey.off("click").on("click", function(){  
//						btn.funct.apply(btn.context, btn.param);
//						});
					}

					if(btn.reload) {
						btn.context = this;
						$btnKey.on("click", function() {
							btn.context.do_lc_show.apply(btn.context, [btn.reload]);
						});
					}

					//always close the dialog box after callback of the button        
					if(btn.autoclose != undefined && btn.autoclose == false) {
						//do nothing
					} else {
						$btnKey.on("click", this.do_lc_close);
					}

				}, this);
			}
		} else {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-footer").append("<button id='btn_msgbox_close' type='button' class='btn btn-default' >"+$.i18n("msgbox_btn_close")+"</button>");
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " #btn_msgbox_close").off("click").on("click", this.do_lc_close);
		}
	}.bind(this);

	var do_lc_bind_event_msgBox = function(params){
		pr_curElt		= 0;
		if(params.css) {
			for (var  ele in params.css){
				$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-dialog").css(params.css[ele].attr, params.css[ele].val);
			}
		}

		if(params.bindEvent) {
			params.bindEvent($(pr_msgboxDivId + pr_NUMBER_MSGBOX));
		}

		if(params.autoclose == false) {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX).modal({
				backdrop: 'static',
				keyboard: false
			});
		} else {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX).modal("show");
		}

		if(params.width) {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-dialog").css("width", params.width);
		}
		if(params.widthMax) {
			$(pr_msgboxDivId + pr_NUMBER_MSGBOX + " .modal-dialog").css("max-width", params.widthMax);
    	}


		//add event when dialog has been closed : delete all buttons
		$(pr_msgboxDivId + pr_NUMBER_MSGBOX).off("hidden.bs.modal").on('hidden.bs.modal', function() {
			$("body").off("keydown",onTabEvent);
			$(this).remove();
			if(params.onClose) {
				params.onClose();
			}
		});

		pr_msgElts = $(pr_msgboxDivId + pr_NUMBER_MSGBOX).find("input, select, textarea, button, a");
		if(pr_msgElts.length > 0) {
			pr_msgElts[0].focus();

			pr_msgElts.each(function(index) {
				$(this).on("focus", function() {
					pr_curElt		= index;
				});
			});
		}

		$(".modal-dialog").draggable({
			handle: ".modal-header"
		});

		bindDefaultEvent();
	}.bind(this);

	var onTabEvent = function(event) {
		if(event.which === 9 && event.shiftKey){
			event.preventDefault();
			pr_curElt -= 1;
			if(pr_curElt < 0) {
				pr_curElt = pr_msgElts.length;
			}
			var count = 0;
			while(!$(pr_msgElts[pr_curElt]).is(":focusable")) {
				pr_curElt -= 1;
				if(pr_curElt <0) {
					pr_curElt = pr_msgElts.length;
				}
				count ++;
				if(count > 100) {
					return;
				}
			}
			pr_msgElts[pr_curElt].focus();
		}
		else if(event.which === 9) {
			event.preventDefault();
			pr_curElt += 1;
			if(pr_curElt >= pr_msgElts.length) {
				pr_curElt = 0;
			}
			var count = 0;
			while(!$(pr_msgElts[pr_curElt]).is(":focusable")) {
				pr_curElt += 1;
				if(pr_curElt >= pr_msgElts.length) {
					pr_curElt = 0;
				}
				count ++;
				if(count > 100) {
					return;
				}
			}
			pr_msgElts[pr_curElt].focus();
		}
	};

};

