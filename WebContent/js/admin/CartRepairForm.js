/**
 * @author
 * @createtime
 * @class CartRepairForm
 * @extends Ext.Window
 * @description CartRepairForm表单
 * @company 宏天软件
 */
CartRepairForm = Ext
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
						CartRepairForm.superclass.constructor.call(this, {
							layout : 'fit',
							id : 'CartRepairFormWin',
							title : '车辆维修详细信息',
							iconCls : 'menu-car_repair',
							width : 600,
							height : 400,
							minWidth : 599,
							minHeight : 344,
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
									url : __ctxPath + '/admin/saveCartRepair.do',
									layout : 'form',
									id : 'CartRepairForm',
									frame : false,
									bodyStyle : 'padding:5px;',
									defaults : {
										anchor : '100%,100%'
									},
									formId : 'CartRepairFormId',
									defaultType : 'textfield',
									items : [
											{
												name : 'cartRepair.repairId',
												id : 'repairId',
												xtype : 'hidden',
												value : this.repairId == null ? ''
														: this.repairId
											},
											{
												xtype : 'hidden',
												name : 'cartRepair.carId',
												id : 'carId'
											},
											{
												xtype : 'container',
												layout : 'hbox',
												layoutConfigs : {
													align : 'middle'
												},
												defaults : {
													margins : '0 2 0 0'
												},
												height : 26,
												items : [
														{
															xtype : 'label',
															text : '车牌号码:',
															width : 103
														},
														{
															id : 'carno',
															xtype : 'textfield',
															name : 'carno',
															editable : false,
															readOnly : true,
															allowBlank : false,
															width : 130
														},
														{
															xtype : 'button',
															iconCls : 'btn-car',
															text : '选择车辆',
															handler : function() {
																CarSelector
																		.getView(
																				function(
																						id,
																						name) {
																					Ext
																							.getCmp(
																									'carId')
																							.setValue(
																									id);
																					Ext
																							.getCmp(
																									'carno')
																							.setValue(
																									name);
																				},
																				true

																		)
																		.show();
															}

														},
														{
															xtype : 'button',
															text : '消除记录',
															iconCls : 'reset',
															handler : function() {
																Ext
																		.getCmp(
																				'carId')
																		.setValue(
																				'');
																Ext
																		.getCmp(
																				'carno')
																		.setValue(
																				'');
															}
														} ]
											},
											{
												fieldLabel : '维护日期',
												name : 'cartRepair.repairDate',
												id : 'repairDate',
												xtype : 'datetimefield',
												format : 'Y-m-d H:i:s',
												allowBlank : false,
												editable : false
											},
											{
												fieldLabel : '结束日期',
												name : 'cartRepair.endDt',
												id : 'endDt',
												xtype : 'datetimefield',
												format : 'Y-m-d H:i:s',
												allowBlank : false,
												editable : false
											},
											{
												xtype : 'container',
												layout : 'hbox',
												layoutConfigs : {
													align : 'middle'
												},
												defaults : {
													margins : '0 2 0 0'
												},
												height : 30,
												items : [
														{
															xtype : 'label',
															text : '经办人:',
															width : 103
														},
														{
															xtype : 'textfield',
															name : 'cartRepair.executant',
															id : 'executant',
															editable : false,
															allowBlank : false,
															readOnly : true,
															width : 130
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
																									'executant')
																							.setValue(
																									name);
																				},
																				true)
																		.show();
															}
														},
														{
															xtype : 'button',
															text : '清除纪录',
															iconCls : 'reset',
															handler : function() {
																Ext
																		.getCmp(
																				'executant')
																		.setValue(
																				'');
															}
														} ]
											},
											{
												fieldLabel : '维修类型',
												name : 'cartRepair.repairType',
												id : 'repairType',
												xtype : 'combo',
												mode : 'local',
												allowBlank : false,
												editable : false,
												value : '1',
												triggerAction : 'all',
												store : [ [ '1', '保养' ],
														[ '2', '维修' ] ]
											}, {
												fieldLabel : '费用',
												name : 'cartRepair.fee',
												id : 'fee',
												allowBlank : false,
												xtype : 'numberfield'
											}, {
												fieldLabel : '维护原因',
												name : 'cartRepair.reason',
												id : 'reason',
												xtype : 'textarea'
											}, {
												fieldLabel : '备注',
												name : 'cartRepair.notes',
												id : 'notes',
												xtype : 'textarea'
											}

									]
								});// end of the formPanel

						if (this.repairId != null
								&& this.repairId != 'undefined') {
							this.formPanel
									.getForm()
									.load(
											{
												deferredRender : false,
												url : __ctxPath
														+ '/admin/getCartRepair.do?repairId='
														+ this.repairId,
												waitMsg : '正在载入数据...',
												success : function(form, action) {
													Ext
															.getCmp('carno')
															.setValue(
																	action.result.data.car.carno);
													Ext
															.getCmp(
																	'repairDate')
															.setValue(
																	new Date(
																			getDateFromFormat(
																					action.result.data.repairDate,
																					"yyyy-MM-dd HH:mm:ss")));

													Ext
															.getCmp('endDt')
															.setValue(
																	new Date(
																			getDateFromFormat(
																					action.result.data.endDt,
																					"yyyy-MM-dd HH:mm:ss")));
												},
												failure : function(form, action) {
													Ext.ux.Toast.msg('编辑',
															'载入失败');
												}
											});
						}
						;// load formPanel

						this.buttons = [
								{
									text : '保存',
									iconCls : 'btn-save',
									handler : function() {
										var fp = Ext.getCmp('CartRepairForm');
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
																					'CartRepairGrid')
																			.getStore()
																			.reload();
																	Ext
																			.getCmp(
																					'CartRepairFormWin')
																			.close();
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
																					'CartRepairFormWin')
																			.close();
																}
															});
										}
									}
								},
								{
									text : '取消',
									iconCls : 'btn-cancel',
									handler : function() {
										Ext.getCmp('CartRepairFormWin').close();
									}
								} ];// end of the buttons
					}// end of the initUIComponents
				});