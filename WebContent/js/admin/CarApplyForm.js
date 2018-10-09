/**
 * @author
 * @createtime
 * @class CarApplyForm
 * @extends Ext.Window
 * @description CarApplyForm表单
 * @company 宏天软件
 */
CarApplyForm = Ext
		.extend(
				Ext.Window,
				{
					// 内嵌FormPanel
					formPanel : null,
					// 构造函数
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						// 必须先初始化组件
						this.initUIComponents();
						CarApplyForm.superclass.constructor.call(this, {
							layout : 'fit',
							id : 'CarApplyFormWin',
							title : '车辆申请详细信息',
							iconCls : 'menu-car_apply',
							width : 600,
							height : 480,
							minWidth : 599,
							minHeight : 479,
							items : this.formPanel,
							maximizable : true,
							border : false,
							modal : true,
							plain : true,
							buttonAlign : 'center',
							buttons : this.buttons
						});
					},// end of the constructor
					// 初始化组件
					initUIComponents : function() {
						this.formPanel = new Ext.FormPanel(
								{
									url : __ctxPath + '/admin/saveCarApply.do',
									layout : 'form',
									id : 'CarApplyForm',
									frame : false,
									border : true,
									defaults : {
										width : 400,
										anchor : '98%,98%'
									},
									bodyStyle : 'padding-top:5px;padding-left:5px;',
									formId : 'CarApplyFormId',
									defaultType : 'textfield',
									items : [
											{
												name : 'carApply.applyId',
												id : 'applyId',
												xtype : 'hidden',
												value : this.applyId == null ? ''
														: this.applyId
											},{
												name : 'carApply.userId',
												id : 'userId',
												xtype : 'hidden'
											},
											{
												xtype : 'container',
												style : 'padding-left:0px;margin-bottom:4px;',
												id : 'depContainer',
												layout : 'column',
												items : [
														{
															xtype : 'label',
															style : 'padding-left:0px;',
															text : '用车部门:',
															width : 105
														},
														{
															xtype : 'textfield',
															name : 'carApply.department',
															id : 'department',
															value : curUserInfo.depName,
															allowBlank : false,
															editable : false,
															readOnly : true,
															width : 320
														},
														{
															xtype : 'button',
															iconCls : 'btn-dep-sel',
															text : '选择部门',
															handler : function() {
																DepSelector
																		.getView(
																				function(
																						id,
																						name) {
																					Ext
																							.getCmp(
																									'department')
																							.setValue(
																									name);
																				})
																		.show();
															}
														},
														{
															xtype : 'button',
															text : '清除记录',
															iconCls : 'reset',
															handler : function() {
																Ext
																		.getCmp(
																				'department')
																		.setValue(
																				'');
															}
														} ]
											},
											{
												xtype : 'container',
												style : 'padding-left:0px;margin-bottom:4px;',
												layout : 'column',
												items : [
														{
															xtype : 'label',
															style : 'padding-left:0px;',
															text : '用车人:',
															width : 105
														},
														{
															xtype : 'textfield',
															name : 'carApply.userFullname',
															id : 'userFullname',
															value : curUserInfo.fullname,
															allowBlank : false,
															editable : false,
															readOnly : true,
															width : 320
														},
														{
															xtype : 'button',
															iconCls : 'btn-user-sel',
															text : '选择人员',
															handler : function() {
																UserAllSelector
																		.getView(
																				function(
																						id,
																						name) {
																					Ext
																							.getCmp(
																									'userFullname')
																							.setValue(
																									name);
																				},
																				true)
																		.show();
															}
														},
														{
															xtype : 'button',
															text : '清除记录',
															iconCls : 'reset',
															handler : function() {
																Ext
																		.getCmp(
																				'userFullname')
																		.setValue(
																				'');
															}
														} ]
											},
											{
												xtype : 'container',
												layout : 'column',
												style : 'padding-left:0px;margin-bottom:4px;',
												items : [
														{
															xtype : 'label',
															style : 'padding-left:0px;',
															text : '申请人:',
															width : 105
														},
														{
															xtype : 'textfield',
															name : 'carApply.proposer',
															id : 'proposer',
															editable : false,
															allowBlank : false,
															readOnly : true,
															value : curUserInfo.fullname,
															width : 320
														},
														{
															xtype : 'button',
															iconCls : 'btn-user-sel',
															text : '选择人员',
															handler : function() {
																UserSelector
																		.getView(
																				function(
																						id,
																						name) {
																					Ext
																							.getCmp(
																									'proposer')
																							.setValue(
																									name);
																					Ext
																							.getCmp(
																									'userId')
																							.setValue(
																									id);
																				},
																				true,
																				true)
																		.show();
															}
														},
														{
															xtype : 'button',
															text : '清除记录',
															iconCls : 'reset',
															handler : function() {
																Ext
																		.getCmp(
																				'proposer')
																		.setValue(
																				'');
																Ext
																.getCmp(
																		'userId')
																.setValue(
																		'');
															}
														} ]
											},
											{
												fieldLabel : '是否需要司机',
												hiddenName : 'carApply.ishavecardriver',
												id : 'ishavecardriver',
												xtype : 'combo',
												mode : 'local',
												allowBlank : false,
												editable : false,
												triggerAction : 'all',
												value : '1',
												store : [ [ '1', '需要' ],
														[ '2', '不需要' ] ]
											},
											{
												fieldLabel : '是否长期有效',
												hiddenName : 'carApply.iseffective',
												id : 'iseffective',
												xtype : 'combo',
												mode : 'local',
												allowBlank : false,
												editable : false,
												triggerAction : 'all',
												value : '1',
												store : [ [ '1', '否' ],
														[ '2', '是' ] ],
												listeners : {
															scope : this,
															'select' : function(combo, record, index) {
																if(index=='0'){
//																	 alert(index);
																	 Ext.getCmp('onDutyTime2').hide();
																	 Ext.getCmp('offDutyTime2').hide();
																	
																	 }
																if(index=='1'){
//																	 alert(index);
																	 Ext.getCmp('onDutyTime2').show();
																	 Ext.getCmp('offDutyTime2').show();
																	
																	 }	
			
															}													}
											}, {
												fieldLabel : '原因',
												name : 'carApply.reason',
												id : 'reason',
												allowBlank : false,
												xtype : 'textarea'
											}, {
												fieldLabel : '出发时间',
												name : 'carApply.startTime',
												id : 'startTime',
												xtype : 'datetimefield',
												format : 'Y-m-d H:i:s',
												allowBlank : true,
												editable : false
											}
//											, new Ext.form.TimeField( {
//												fieldLabel : '开始时间',
//												id : 'carApply.onDutyTime2',
//												// name: 'diary.onDutyTime',
//												xtype : 'datetimefield',
//												minValue : '0:00am',
//												maxValue : '23:59pm',
//												format : 'H:i:s'// G标示为24时计时法
//												
//											})
											, {
												xtype : 'container',
												style : 'padding-left:0px;margin-bottom:4px;',
												id : 'onDutyTime2',
												layout : 'column',
												items:[{
													xtype : 'label',
													style : 'padding-left:0px;',
													text : '开始时间',
													width : 105
												},
												{
													xtype : 'datetimefield',
													name : 'carApply.onDutyTime',
													id : 'onDutyTime',

													format : 'H:i',
//													
													width : 400
												}]// G标示为24时计时法]
												
											}, {
												fieldLabel : '返回时间',
												name : 'carApply.endTime',
												id : 'endTime',
												allowBlank : true,
												xtype : 'datetimefield',
												format : 'Y-m-d H:i:s'
											}, {
												xtype : 'container',
												style : 'padding-left:0px;margin-bottom:4px;',
												id : 'offDutyTime2',
												layout : 'column',
												items:[{
													xtype : 'label',
													style : 'padding-left:0px;',
													text : '截止时间',
													width : 105
												},
												{
													xtype : 'datetimefield',
													name : 'carApply.offDutyTime',
													id : 'offDutyTime',
													format : 'H:i',
													width : 400
												}]// G标示为24时计时法]
//												
											}
											
											, {
												fieldLabel : '出发地点',
												name : 'carApply.fromSite',
												id : 'fromSite'
											}, {
												fieldLabel : '到达地点',
												name : 'carApply.toSite',
												id : 'toSite'
											}, {
												fieldLabel : '备注',
												name : 'carApply.notes',
												id : 'notes',
												xtype : 'textarea'
											}

									]
								});// end of the formPanel

						if (this.applyId != null && this.applyId != 'undefined') {
							this.formPanel
									.getForm()
									.load(
											{
												deferredRender : false,
												url : __ctxPath
														+ '/admin/getCarApply.do?applyId='
														+ this.applyId,
												waitMsg : '正在载入数据...',
												success : function(form, action) {
//													Ext
//															.getCmp('carNo')
//															.setValue(
//																	action.result.data.car.carNo);
//													Ext
//															.getCmp('carId')
//															.setValue(
//																	action.result.data.car.carId);
													Ext
															.getCmp('applyDate')
															.setValue(
																	new Date(
																			getDateFromFormat(
																					action.result.data.applyDate,
																					"yyyy-MM-dd")));
													Ext
															.getCmp('startTime')
															.setValue(
																	new Date(
																			getDateFromFormat(
																					action.result.data.startTime,
																					"yyyy-MM-dd")));
													var endTime = action.result.data.endTime;
													if (endTime != null
															&& endTime != '') {
														Ext
																.getCmp(
																		'endTime')
																.setValue(
																		new Date(
																				getDateFromFormat(
																						endTime,
																						"yyyy-MM-dd")));
													}
												},
												failure : function(form, action) {
													Ext.ux.Toast.msg('编辑',
															'载入失败');
												}
											});
						}
						;// end of the load formPanel
						this.buttons = [
								{
									text : '保存',
									iconCls : 'btn-save',
									handler : function() {
									var startTime = Ext.util.Format.date(Ext.getCmp("startTime").getValue(),'Y-m-d');
									var onDutyTime = Ext.getCmp("onDutyTime").getValue();
									var startDateTimeString = startTime.toString() + " "+onDutyTime.toString()+":00";
									var d1 = startDateTimeString.replace(/\-/g,'\/');
									var stratDate =new Date(d1);
									
									var endTime = Ext.util.Format.date(Ext.getCmp("endTime").getValue(),'Y-m-d');
									var offDutyTime = Ext.getCmp("offDutyTime").getValue();
									var endDateString = endTime.toString() + " "+offDutyTime.toString()+":00";
									var d2 = endDateString.replace(/\-/g,'\/');
									var endDate =new Date(d2);
									
									if(stratDate>=endDate){
										Ext.Msg.alert("注意", "开始时间应小于截止时间！");
										return;
									}
										var fp = Ext.getCmp('CarApplyForm');
										if (fp.getForm().isValid()) {
											fp
													.getForm()
													.submit(
															{
																method : 'post',
																waitMsg : '正在提交数据...',
																success : function(
																		fp,
																		action) {
																	Ext.ux.Toast
																			.msg(
																					'操作信息',
																					'成功保存信息！');
																	Ext
																			.getCmp(
																					'CarApplyGrid')
																			.getStore()
																			.reload();
																	Ext
																			.getCmp(
																					'CarApplyFormWin')
																			.close();
																	if (fp != null) {
																		Ext.Ajax
																				.request( {
																					url : __ctxPath + '/flow/saveProcessActivity.do',
																					waitMsg : '正在提交流程表单信息...',
																					params : {
																						defId : 21,
																						// runId:this.runId,
																						// activityName:this.activityName,
																						// 启动工作流
																						startFlow : true
																					},
																					success : function(
																							userform,
																							o) {
																						alert(defId);
																						Ext.ux.Toast
																								.msg(
																										'操作信息',
																										'成功保存信息！');
																						// AppUtil.removeTab(topPanel.getId());
																						// var
																						// runGrid=Ext.getCmp('ProcessRunGrid');
																						// if(runGrid!=null){
																						// runGrid.getStore().reload();
																						// }
																					}

																				});
																	}
																},
																failure : function(
																		fp,
																		action) {
																	var resultResp = Ext.util.JSON
																			.decode(action.response.responseText);
																	if (resultResp.result == 1) {
																		Ext.MessageBox
																				.show( {
																					title : '操作信息',
																					msg : '开始时间不能大于结束时间！',
																					buttons : Ext.MessageBox.OK,
																					icon : 'ext-mb-error'
																				});
																	} else {
																		Ext.MessageBox
																				.show( {
																					title : '操作信息',
																					msg : '信息保存出错，请联系管理员！',
																					buttons : Ext.MessageBox.OK,
																					icon : 'ext-mb-error'
																				});
																	}

																	Ext
																			.getCmp(
																					'CarApplyFormWin')
																			.close();
																}
															});
										}
									}
								}, {
									text : '取消',
									iconCls : 'btn-cancel',
									handler : function() {
										Ext.getCmp('CarApplyFormWin').close();
									}
								} ];// end of the buttons
					}// end of the initUIComponents
				});
