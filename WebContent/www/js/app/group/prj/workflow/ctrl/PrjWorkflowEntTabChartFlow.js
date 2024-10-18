define([
    "prjFlowChart/jquery.flowchart",
    "prjFlowChart/jquery.panzoom.min",
],  function (
        FlowChart,
        PanZoom
        
    ) {//-------------------------------------------------------------------------------------------------------------------------------
        const PrjWorkflowTabChartFlow = function (grpName, header, content, footer) {
            //------------------------------------------------------------------------------------
            var pr_divHeader = header;
            var pr_divContent = content;
            var pr_divFooter = footer;

            //------------------------------------------------------------------------------------
            var pr_grpName = grpName ? grpName : ((new Date()).getTime() + "");
            var tmplName = App.template.names[pr_grpName];
            var tmplCtrl = App.template.controller;
            //------------------------------------------------------------------------------------

            //------------------------------------------------------------------------------------
            var self = this;
            const pr_ctr_Ent            = App.controller.PrjWorkflow.Ent;

            const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
		    const pr_SV_SAVE_CONTENT	= "SVSaveContent";

		    const pr_STAT_PRJ_NEW 			= 100100;
		    const pr_STAT_PRJ_TODO 			= 100200;
		    const pr_STAT_PRJ_INPROGRESS 	= 100300;
		    const pr_STAT_PRJ_DONE 			= 100400;
		    const pr_STAT_PRJ_TEST 			= 100500;
		    const pr_STAT_PRJ_REVIEW 		= 100600;
		    const pr_STAT_PRJ_DEPLOY 		= 100700;
		    const pr_STAT_PRJ_UNRESOLVED 	= 100800;
		    const pr_STAT_PRJ_CLOSED 		= 100900;

			const lstLevs = {
                "0": { "label": "prj_project_member_level_manager"		, "color": "#005C78" },
               "10": { "label": "prj_project_member_level_reporter"		, "color": "#0087b0" },
               "20": { "label": "prj_project_member_level_developer"	, "color": "#00c4c8" },
               "30": { "label": "prj_project_member_level_tester"		, "color": "#eec966" },
               "40": { "label": "prj_project_member_level_worker"		, "color": "#eeab66" },
               "50": { "label": "prj_project_member_level_watcher"		, "color": "#f18a4d" }
           	}
            let pr_workflowData             = null
            let pr_prj                      = null

            //---------show-----------------------------------------------------------------------------
            this.do_lc_show = function (prj) {
                pr_divContent   = "#div_chart_flow"
                pr_prj          = prj
				if(prj.inf05){
					pr_workflowData = prj.inf05.workflowData ? JSON.parse(prj.inf05.workflowData) : [];
				}else{
					pr_workflowData	= [];
				}
                

                do_lc_init_ChartFlow();
                pr_ctr_Ent.do_lc_reqRole_User();
            }


            const do_lc_init_ChartFlow = () => {
                $(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_WORKFLOW_TAB_CHARTFLOW_MAIN))

                var $flowchart = $('#flowchartworkspace');
                var $container = $flowchart.parent();

                var cx = $flowchart.width() / 2;
                var cy = $flowchart.height() / 2;

                // Apply the plugin on a standard, empty div...
                $flowchart.flowchart({
                    data: req_lc_init_data_ChartFlow(pr_prj),
                    defaultSelectedLinkColor: '#000055',
                    grid: 10,
                    multipleLinksOnInput: true,
                    multipleLinksOnOutput: true
                });

                // Panzoom initialization...
                $flowchart.panzoom();

                // Centering panzoom
                $flowchart.panzoom('pan', -cx + $container.width() / 2, -cy + $container.height() / 2);

                // Panzoom zoom handling...
                var possibleZooms = [0.5, 0.75, 1, 2, 3];
                var currentZoom = 2;
                $container.on('mousewheel.focal', function (e) {
                    e.preventDefault();
                    var delta = (e.delta || e.originalEvent.wheelDelta) || e.originalEvent.detail;
                    var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
                    currentZoom = Math.max(0, Math.min(possibleZooms.length - 1, (currentZoom + (zoomOut * 2 - 1))));
                    $flowchart.flowchart('setPositionRatio', possibleZooms[currentZoom]);
                    $flowchart.panzoom('zoom', possibleZooms[currentZoom], {
                        animate: false,
                        focal: e
                    });
                });

                //-----------------------------------------
                //--- operator and link properties
                //--- start
                var $btnDeleteSelected 	= $('#btn_delete_selected');
                var $btnCreateOutput 	= $('#btn_create_output');
                var $btnDeleteOutput 	= $('#btn_delete_output');
                
                $btnDeleteSelected	.addClass("disabled");
               	$btnCreateOutput	.addClass("disabled");
                $btnDeleteOutput	.addClass("disabled");

				var test_data1 = pr_ctr_Ent.can_lc_role_user_manager()
				var test_data2 = pr_ctr_Ent.can_lc_role_user_reporter()

				if(test_data1 || test_data2 ) {

                    $flowchart.flowchart({
                        onOperatorSelect: function (operatorId) {
                            $btnCreateOutput	.removeClass("disabled");
                            $btnDeleteOutput	.removeClass("disabled");
                            $btnDeleteSelected	.addClass	("disabled");
                            return true;
                        },
                        onOperatorUnselect: function () {
                            $btnDeleteSelected	.addClass("disabled");
                            $btnCreateOutput	.addClass("disabled");
                            $btnDeleteOutput	.addClass("disabled");
                            return true;
                        },
                        onLinkSelect: function (linkId) {
                            $btnDeleteSelected	.removeClass("disabled");
                            $btnCreateOutput	.addClass	("disabled");
                            $btnDeleteOutput	.addClass	("disabled");
                            return true;
                        },
                        onLinkUnselect: function () {
                            $btnDeleteSelected	.addClass("disabled");
                            return true;
                        },
                        onLinkCreate: function (linkId, linkData) {
                            const fromOperator 	= linkData['fromOperator'];
                            const toOperator 	= linkData['toOperator'];
                            const fromOutput 	= linkData['fromConnector'];
    
                            const fromStat 		= fromOperator	.split("_")[1];
                            const toStat 		= toOperator	.split("_")[1];
                            let   outputLevs 	= fromOutput	.split("_")[1];
    
                            if (outputLevs.includes("|")) {
                                outputLevs = outputLevs.split('|');
                            } else 
                            	outputLevs = [outputLevs];
    
                            let flowFinded = pr_workflowData.find(e => e.stat01 === fromStat && e.stat02 === toStat && JSON.stringify(e.uRole) === JSON.stringify(outputLevs))
    
                            if (flowFinded) {
                                return true;
                            }
    
                            flowFinded = {
                                stat01: fromStat,
                                stat02: toStat,
                                uRole: outputLevs
                            }
    
                            pr_workflowData.push(flowFinded);
                            $("#a_btn_save_chartflow"	).removeClass('hide');
                            $("#a_btn_cancel_chartflow"	).removeClass('hide');
    
                            return true
                        },
                        onLinkDelete: function (linkId, forced) {
                            const data 			= $flowchart.flowchart("getData");
                            const selectedLink 	= data['links'][linkId];
                            const fromOperator 	= selectedLink['fromOperator'];
                            const toOperator 	= selectedLink['toOperator'];
                            const fromOutput 	= selectedLink['fromConnector'];
    
                            const fromStat 		= fromOperator	.split("_")[1];
                            const toStat 		= toOperator	.split("_")[1];
                            let   outputLevs 	= fromOutput	.split("_")[1];
    
                            if (outputLevs.includes("|")) {
                            	outputLevs = outputLevs.split('|');
                            } else 
                            	outputLevs = [outputLevs];
    
                            let flowInd = pr_workflowData.findIndex(e => e.stat01 === fromStat && e.stat02 === toStat && JSON.stringify(e.uRole) === JSON.stringify(outputLevs))
    
                            if (flowInd >= 0) {
                                pr_workflowData.splice(flowInd, 1);
                            }
    
                            $("#a_btn_save_chartflow"	).removeClass('hide');
                            $("#a_btn_cancel_chartflow"	).removeClass('hide');
    
                            return true
                        },
                        onOperatorMoved: function (operatorId, position) {
                            $("#a_btn_save_chartflow"	).removeClass('hide');
                            $("#a_btn_cancel_chartflow"	).removeClass('hide');
    
                            return true;
                        }
                    });
                    //--- end
                    //--- operator and link properties
                    //-----------------------------------------
    
                    //-----------------------------------------
                    //--- save and load
                    //--- start
    
                    do_lc_bindEvent($flowchart)
                }
            }

            const req_lc_init_data_ChartFlow = (prj) => {
                const flowChartData = prj.inf04 ? JSON.parse(prj.inf04) : null

                if(flowChartData) {
                    return flowChartData;
                }

                const pr_lstStats = prj.lstStats; 

                const defaultFlowchartData_ = {
                    operators	: {},
                    links		: {}
                }

                pr_lstStats.forEach((s, i) => {
                    const inputs = {
                        input: {
                            label: ""
                        }
                    }
                    const outputs = {
                    }

                    const operator = {
                        top: 50 + 100 * i,
                        left: 100,
                        properties: {
                            title: $.i18n(s['trans'] ? s['trans'] : s['lab']),
                            inputs: inputs,
                            outputs: outputs
                        }
                    }

                    defaultFlowchartData_['operators'][`operator_${s['id']}`] = operator;
                })

                return defaultFlowchartData_;
            }
            
            const do_lc_bindEvent = ($flowchart) => {
                //-----------------------------------------
                //--- delete operator / link button
                //--- start
                $flowchart.parent().siblings('#btn_delete_selected').click(function () {
                    $flowchart.flowchart('deleteSelected');
                });
                //--- end
                //--- delete operator / link button
                //-----------------------------------------

                //-----------------------------------------
                //--- Create output
                //--- start
                $flowchart.parent().siblings('#btn_create_output').click(function () {
                    const selectedId = $flowchart.flowchart('getSelectedOperatorId');
                    const data = $flowchart.flowchart('getData');
                    const selectedOpe = data['operators'][selectedId];

                    if (!selectedOpe) return

                    App.MsgboxController.do_lc_show({
                        title: $.i18n("prj_workflow_create_output_title"),
                        content: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_WORKFLOW_TAB_CHARTFLOW_CREATE_ELEMENT, lstLevs),
                        autoclose: false,
                        buttons: {
                            UPDATE: {
                                lab: $.i18n("common_btn_send"),
                                funct: do_lc_create_output,
                                param: [$flowchart],
                                classBtn: "btn-primary",
                                autoclose: true
                            },
                            CALCEL: {
                                lab: $.i18n("common_btn_cancel"),
                            }
                        }
                    });
                });
                //--- end
                //--- Create output
                //-----------------------------------------

                //-----------------------------------------
                //--- Delete output
                //--- start
                $flowchart.parent().siblings('#btn_delete_output').click(function () {
                    const selectedId = $flowchart.flowchart('getSelectedOperatorId');
                    const stat01 = selectedId.split("_")[1]
                    const data = $flowchart.flowchart('getData');
                    const selectedOpe = data['operators'][selectedId];
					
					const selectedOpe_arr = Object.entries(selectedOpe.properties.outputs);
					for(var i = 0 ; i < selectedOpe_arr.length;i++){
						var ope = selectedOpe_arr[i]
						var label_ope = ope[0]
						var element   = ope[1].label
						
						var opeid = label_ope.split("_")[1].trim()
						if(opeid.includes("|")){
							var label = ""
							var opeid_arr = opeid.split("|")
							for(var j = 0 ; j < opeid_arr.length;j++){
								var keyof_opeid = Number(opeid_arr[j])
								label = label +  `<div style='width: 15px; height: 15px; border-radius: 50%; background-color: ${lstLevs[keyof_opeid].color}; margin-right: 5px;'></div><div>${$.i18n(lstLevs[keyof_opeid].label)}</div>&nbsp`
								ope[1].label = label
							}
						}else{
							var keyof_opeid = Number(opeid)
							ope[1].label  =  `<div style='width: 15px; height: 15px; border-radius: 50%; background-color: ${lstLevs[opeid].color}; margin-right: 5px;'></div><div>${$.i18n(lstLevs[opeid].label)}</div>`
							
						}
						selectedOpe_arr[i] = ope
						
					}


                    if (!selectedOpe) return

                    const outputs = selectedOpe['properties']['outputs']

                    App.MsgboxController.do_lc_show({
                        title: $.i18n("prj_workflow_delete_output_title"),
                        content: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_WORKFLOW_TAB_CHARTFLOW_DELETE_ELEMENT, { outputs, stat01 }),
                        autoclose: false,
                        buttons: {
                            UPDATE: {
                                lab: $.i18n("common_btn_send"),
                                funct: do_lc_delete_output,
                                param: [$flowchart],
                                classBtn: "btn-primary",
                                autoclose: true
                            },
                            CALCEL: {
                                lab: $.i18n("common_btn_cancel"),
                            }
                        }
                    });
                });
                //--- end
                //--- Delete output
                //-----------------------------------------

                //--- Save and cancel button
                $("#a_btn_save_chartflow").off("click").on("click", function () {
                    $(this).addClass("hide");

                    let newPrj 		= {};
				
				    newPrj.files 	= pr_prj.files;
				    newPrj 			= $.extend(false, pr_prj, newPrj);

                    const data      = $flowchart.flowchart("getData")
                    newPrj.inf04    = JSON.stringify(data)
				    do_lc_save_prj(newPrj, pr_prj)
                })

                $("#a_btn_cancel_chartflow").off("click").on("click", function () {
                    $(this).addClass("hide");
                    self.do_lc_show(pr_prj)
                })
                //--- end
            }

            const do_lc_create_output = ($flowchart) => {
                const selectedId = $flowchart.flowchart('getSelectedOperatorId');
                const data = $flowchart.flowchart('getData');
                const selectedOpe = data['operators'][selectedId];

                if (!selectedOpe) return

                const modalBodyCheckboxs = $("#body_create_output input[type=checkbox]")
                const outputs = selectedOpe['properties']['outputs']
                const output = {
                    label: ""
                }
                let levs = []
                let levLabels = []

                modalBodyCheckboxs.each(function () {
                    const isChecked = $(this).is(':checked')

                    if (!isChecked) return

                    const { id } = $(this).data()

                    levs.push(id)
					const label = `<div style="width: 15px; height: 15px; border-radius: 50%; background-color: ${lstLevs[id].color}; margin-right: 5px;"></div>`
					levLabels.push(label)
                });

                if (levs.length <= 0 || outputs[`output_${levs.join("|")}`]) {
                    $("#modal_create_output").modal("hide")
                    return
                }

                output['label'] = levLabels.join("")

                outputs[`output_${levs.join("|")}`] = output

                $flowchart.flowchart('setData', data);
                $("#a_btn_save_chartflow").removeClass('hide')
                $("#a_btn_cancel_chartflow").removeClass('hide')
            }

            const do_lc_delete_output = ($flowchart) => {
                const selectedId = $flowchart.flowchart('getSelectedOperatorId');
                const data = $flowchart.flowchart('getData');
                const selectedOpe = data['operators'][selectedId];

                if (!selectedOpe) return
                const modalBodyOutputs = $("#body_delete_output input[type=checkbox]")
                const outputs = selectedOpe['properties']['outputs']
                const links = data['links']
                const output = {
                    label: ""
                }

                modalBodyOutputs.each(function () {
                    const isChecked = $(this).is(':checked')

                    if (!isChecked) return

                    const { id, stat01 } = $(this).data()

                    for (let key in links) {
                        if (links[key].fromConnector === id) {
                            delete links[key];
                        }
                    }

                    const deleteInds = pr_workflowData.reduce((acc, e, index) => {
                        if (+e.stat01 === +stat01 && e.uRole.join("|") === id.split("_")[1]) acc.push(index);
                        return acc
                    }, [])

                    deleteInds.sort((a, b) => b - a);

                    deleteInds.forEach(i => {
                        pr_workflowData.splice(i, 1);
                    })

                    delete outputs[id]
                });

                $flowchart.flowchart('setData', data);
                $("#a_btn_save_chartflow").removeClass('hide')
                $("#a_btn_cancel_chartflow").removeClass('hide')
            }

            const do_lc_save_prj = function(newPrj, prj){
                let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_CONTENT, {obj: JSON.stringify(newPrj)});	
    
                let fSucces		= [];
                fSucces.push(req_gl_funct(null, do_lc_afterSave_prj, [prj]));
    
                let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
    
                App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
            }
    
            const do_lc_afterSave_prj = function(sharedJson, prj){
                if(can_gl_AjaxSuccess(sharedJson)) {
                    let data 	= sharedJson[App['const'].RES_DATA];
                    prj 		= $.extend(true, prj, data);
                    self.do_lc_show(prj);
                } else {   
                    do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
                }
            }
        };

        return PrjWorkflowTabChartFlow;
    })