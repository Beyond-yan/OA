/**
 * @author
 * @createtime
 * @class AppRoleForm
 * @extends Ext.Window
 * @description AppRoleForm表单
 * @company 宏天软件
 */
AppRoleForm = Ext
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
						AppRoleForm.superclass.constructor.call(this, {
							layout : 'fit',
							items : this.formPanel,
							border : false,
							modal : true,
							plain : true,
							id : 'AppRoleFormWin',
							title : '角色详细信息',
							iconCls : 'menu-role',
							width : 370,
							height : 280,
							minWidth : 300,
							minHeight : 200,
							bodyStyle : 'padding:5px;',
							buttonAlign : 'center',
							buttons : this.buttons
						});
					},// end of the constructor
					// 初始化组件
					initUIComponents : function() {

						this.formPanel = new Ext.FormPanel( {
							url : __ctxPath + '/system/saveAppRole.do?isCopy='
									+ this.isCopy,
							layout : 'form',
							id : 'AppRoleForm',
							frame : true,
							defaults : {
								widht : 400,
								anchor : '100%,100%'
							},
							formId : 'AppRoleFormId',
							defaultType : 'textfield',
							items : [ {
								name : 'appRole.roleId',
								id : 'roleId',
								xtype : 'hidden',
								value : this.roleId == null ? '' : this.roleId
							}, {
								fieldLabel : '角色名称',
								name : 'appRole.roleName',
								allowBlank:false,
								id : 'roleName'
							}, {
								fieldLabel : '角色描述',
								xtype : 'textarea',
								name : 'appRole.roleDesc',
								id : 'roleDesc'
							}, {
								fieldLabel : '状态',
								hiddenName : 'appRole.status',
								id : 'status',
								xtype : 'combo',
								mode : 'local',
								editable : true,
								triggerAction : 'all',
								store : [ [ '0', '禁用' ], [ '1', '可用' ] ],
								value : 0
							} ,{
								fieldLabel : '角色等级',
								hiddenName : 'appRole.roleLevel',
								id : 'roleLevel',
								xtype : 'combo',
								mode : 'local',
								editable : true,
								triggerAction : 'all',
								store : [ [ '0', '0' ],[ '1', '1' ], [ '2', '2' ], [ '3', '3' ], [ '4', '4' ] , [ '5', '5' ], [ '6', '6' ], [ '7', '7' ], [ '8', '8' ], [ '9', '9' ], [ '10', '10' ]],
								value : 0
							}]
						});

						if (this.roleId != null && this.roleId != 'undefined') {
							this.formPanel
									.getForm()
									.load(
											{
												deferredRender : false,
												url : __ctxPath
														+ '/system/getAppRole.do?roleId='
														+ this.roleId,
												//waitMsg : '正在载入数据...',
												success : function(form, action) {
												},
												failure : function(form, action) {
												}
											});
						}

						this.buttons = [
								{
									text : '保存',
									iconCls : 'btn-save',
									handler : function() {
										var fp = Ext.getCmp('AppRoleForm');
										if (this.isCopy == 1) {
											var roleName = Ext.getCmp(
													'roleName').getValue();
											Ext.Ajax
													.request( {
														url : __ctxPath + '/system/checkAppRole.do',
														params : {
															roleName : roleName
														},
														method : 'post',
														success : function(
																response) {
															var result = Ext.util.JSON
																	.decode(response.responseText);
															if (result.success) {
																if (fp
																		.getForm()
																		.isValid()) {
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
																											'成功信息保存！');
																							Ext
																									.getCmp(
																											'AppRoleGrid')
																									.getStore()
																									.reload();
																							window
																									.close();
																						},
																						failure : function(
																								fp,
																								action) {
																							Ext.MessageBox
																									.show( {
																										title : '操作信息',
																										msg : '信息保存出错，请联系管理员！',
																										buttons : Ext.MessageBox.OK,
																										icon : 'ext-mb-error'
																									});
																							Ext
																									.getCmp(
																											'AppRoleFormWin')
																									.close();
																						}
																					});
																}
															} else {
																Ext.ux.Toast
																		.msg(
																				'提示信息',
																				'该角色名字已经存在，请更改！');
															}
														},
														failure : function() {
															// .......
													}
													});
										} else {
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
																						'成功信息保存！');
																		Ext
																				.getCmp(
																						'AppRoleGrid')
																				.getStore()
																				.reload();
																		Ext
																				.getCmp(
																						'AppRoleFormWin')
																				.close();
																	},
																	failure : function(
																			fp,
																			action) {
																		Ext.MessageBox
																				.show( {
																					title : '操作信息',
																					msg : '信息保存出错，请联系管理员！',
																					buttons : Ext.MessageBox.OK,
																					icon : 'ext-mb-error'
																				});
																		Ext
																				.getCmp(
																						'AppRoleFormWin')
																				.close();
																	}
																});
											}
										}

									}
								}, {
									text : '取消',
									iconCls : 'btn-cancel',
									handler : function() {
										Ext.getCmp('AppRoleFormWin').close();
									}
								} ]
					}
				});