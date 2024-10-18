	var MsgboxTmpl			= require('text!commonTmpl/MsgBox.html');
	var MsgboxController 	= function () {

            var tmplName		= App.template.names;
            var tmplCtrl		= App.template.controller;
            var self = this;
            
            App.data.msgElts 		= [];
            App.data.curElt			= 0;

            this.do_lc_init = function() {
            	try { 
                	$.i18n({
                		locale: localStorage.language
                	});
                	tmplCtrl.do_lc_put_tmpl(tmplName.CMS_MSGBOX				, MsgboxTmpl);
        			$("body").append(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_MSGBOX, {}));
                	                   	
                }
                catch(e) {
                	console.log(e);
                }
    		}
            
            this.do_lc_show = function(params) {
            	/**
            	 * Clean the msgbox
            	 */
            	$("#msb_message_box .modal-title").html("");
            	$("#msb_message_box .modal-body").html("");
            	$("#msb_message_box .modal-footer").html("");
        		
        		$("#msb_message_box .modal-footer").show();
        		$("body").off("keydown",onTabEvent);
        		
        		//reset the tab index to the first input
        		App.data.curElt			= 0;
            	
            	
            	if(params.title) {
            		if(params.title == "none") {
            			$("#msb_message_box .modal-header").hide();
            		} else {
                		$("#msb_message_box .modal-title").html(params.title);
            		}
            	}
            	
            	if(params.content) {
            		if(params.content == "none") {
            			$("#msb_message_box .modal-body").hide();
            		} else {
                		$("#msb_message_box .modal-body").html(params.content);
            		}
            	}
            	
            	if(params.buttons) {
            		var btns = params.buttons;
            		if(params.buttons == "none") {
            			$("#msb_message_box .modal-footer").hide();
            		} else {
            			Object.keys(params.buttons).forEach(function(key) {
                			var btn = btns[key];
                			var btnlabel = key;
                			if(btn != null) {
                				if(btn.lab) {
                    				btnlabel = btn.lab;
                    			}
                			}
                			if($("#msb_message_box #btn_msgbox_"+key).length > 0) {
                				$("#msb_message_box #btn_msgbox_"+key).off("click");
                				$("#msb_message_box #btn_msgbox_"+key).remove();
                			} //else {
                				$("#msb_message_box .modal-footer").append("<button id='btn_msgbox_"+key+"' type='button' class='btn btn-default' >"+btnlabel+"</button>");
                			//}
                    		
                			            			
                    		if(btn != null) {	
                    			if(!btn.param) {
                    				btn.param = [];
                    			}
                    			if(!btn.context) {
                    				btn.context = null;
                    			}
                    			if(btn.funct) {
                    				//$("#msb_message_box #btn_msgbox_"+key).on("click",btn.param, btn.funct);
                    				$("#msb_message_box #btn_msgbox_"+key).off("click");                			
                    				$("#msb_message_box #btn_msgbox_"+key).click(function(){  
                    					btn.funct.apply(btn.context, btn.param);
                    				});
                    			}
                			}
                    		
                    		if(btn.reload) {
                    			btn.context = this;
                    			$("#msb_message_box #btn_msgbox_"+key).on("click", function() {
                    				btn.context.do_lc_show.apply(btn.context, [btn.reload]);
                    			});
                    		}
                			
                			//always close the dialog box after callback of the button        
                    		if(btn.autoclose != undefined && btn.autoclose == false) {
                    			//do nothing
                    		} else {
                    			$("#msb_message_box #btn_msgbox_"+key).on("click", this.close);
                    		}
                		}, this);
            		}
            	} else {
            		$("#msb_message_box .modal-footer").append("<button id='btn_msgbox_close' type='button' class='btn btn-default' >"+$.i18n("msgbox_btn_close")+"</button>");
            		$("#msb_message_box #btn_msgbox_close").off("click");
            		$("#msb_message_box #btn_msgbox_close").on("click",this.close);
            	}
            	
            	if(params.bindEvent) {
            		params.bindEvent($("#msb_message_box"));
            	}
            	
            	if(params.autoclose == false) {
            		$("#msb_message_box").modal({
            			backdrop: 'static',
                        keyboard: false
            		});
            	} else {
            		$("#msb_message_box").modal("show");
            	}
            	
            	if(params.width) {
            		$("#msb_message_box .modal-dialog").css("width", params.width);
            	}
            	else {
            		$("#msb_message_box .modal-dialog").css("width", "100%");
            	}
            	//add event when dialog has been closed : delete all buttons
            	$("#msb_message_box").on('hidden.bs.modal', function() {
                	$("#msb_message_box .modal-title").html("");
                	$("#msb_message_box .modal-body").html("");
                	$("#msb_message_box .modal-footer").html("");
            		$("body").off("keydown",onTabEvent);
            		if(params.onClose) {
            			params.onClose();
            		}
    			});
            	
            	//$(".modal-content").draggable();
            	
            	App.data.msgElts = $("#msb_message_box").find("input, select, textarea, button, a");
            	if(App.data.msgElts.length > 0) {
            		App.data.msgElts[0].focus();
            		
            		App.data.msgElts.each(function(index) {
            			$(this).on("focus", function() {
            				App.data.curElt			= index;
            			});
            		});
            	}
            	
            	this.bindDefaultEvent();
            	
            };
            
            this.do_lc_close = function() {
            	$("#msb_message_box").modal("hide");
            }
            
            
            this.close = function () {
            	$("#msb_message_box").modal("hide");
            };
            
            this.bindDefaultEvent = function() {
            	$("body").on("keydown",onTabEvent);
            };
            
            this.showAlertNewNoSave = function(){
    			this.show({
    				title	: $.i18n('common_alert_err_save_title') ,
    				content	: $.i18n('common_alert_err_msg_new_no_save')
    			});	
    		};
            
            var onTabEvent = function(event) {
            	if(event.which === 9 && event.shiftKey){
            		event.preventDefault();
            		App.data.curElt -= 1;
            		if(App.data.curElt < 0) {
            			App.data.curElt = App.data.msgElts.length;
            		}
            		var count = 0;
            		while(!$(App.data.msgElts[App.data.curElt]).is(":focusable")) {
            			App.data.curElt -= 1;
            			if(App.data.curElt <0) {
            				App.data.curElt = App.data.msgElts.length;
            			}
            			count ++;
            			if(count > 100) {
            				return;
            			}
            		}
            		App.data.msgElts[App.data.curElt].focus();
            	}
            	else if(event.which === 9) {
            		event.preventDefault();
            		App.data.curElt += 1;
            		if(App.data.curElt >= App.data.msgElts.length) {
            			App.data.curElt = 0;
            		}
            		var count = 0;
            		while(!$(App.data.msgElts[App.data.curElt]).is(":focusable")) {
            			App.data.curElt += 1;
            			if(App.data.curElt >= App.data.msgElts.length) {
            				App.data.curElt = 0;
            			}
            			count ++;
            			if(count > 100) {
            				return;
            			}
            		}
            		App.data.msgElts[App.data.curElt].focus();
            	}
            };
            
        };
