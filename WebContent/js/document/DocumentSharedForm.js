/**
 * 文档共享表单
 * 
 */
var DocumentSharedForm = function(docId) {
	this.docId = docId;
};
/**
 * 显示视图
 * 
 * @return {}
 */
DocumentSharedForm.prototype.getView = function() {
	var docId = this.docId;
	var formPanel = new Ext.FormPanel({
		id : 'documentSharedForm',
		bodyStyle : 'padding:4px 10px 4px 10px',
		reader : new Ext.data.JsonReader({
						root : 'data'
					}, [{
								name : 'DocumentSharedForm.docId',
								mapping : 'docId'
							}, {
								name : 'DocumentSharedForm.sharedUserIds',
								mapping : 'sharedUserIds'
							}, {
								name : 'DocumentSharedForm.sharedUserNames',
								mapping : 'sharedUserNames'
							}, {
								name : 'DocumentSharedForm.sharedDepIds',
								mapping : 'sharedDepIds'
							}, {
								name : 'DocumentSharedForm.sharedDepNames',
								mapping : 'sharedDepNames'
							}, {
								name : 'DocumentSharedForm.sharedRoleIds',
								mapping : 'sharedRoleIds'
							}, {
								name : 'DocumentSharedForm.sharedRoleNames',
								mapping : 'sharedRoleNames'
							}]),
		items : [{
					xtype : 'hidden',
					name : 'docId',
					id : 'DocumentSharedForm.docId',
					value : this.docId
				}, {
					xtype : 'fieldset',
					border : false,
					layout : 'column',
					items : [{
								xtype : 'label',
								text : '共享人员',
								width : 100
							}, {
								xtype : 'hidden',
								name : 'sharedUserIds',
								id : 'DocumentSharedForm.sharedUserIds'
							}, {
								xtype : 'textarea',
								name : 'sharedUserNames',
								id : 'DocumentSharedForm.sharedUserNames',
								width : 300
							}, {
								xtype : 'button',
								text : '选择',
								iconCls : 'btn-select',
								width : 80,
								handler : function() {
									// 显示选择器，并且设置用户
									UserSelector.getView(
											function(uIds, fnames) {
												var sharedUserIds = Ext
														.getCmp('DocumentSharedForm.sharedUserIds');
												var sharedUserNames = Ext
														.getCmp('DocumentSharedForm.sharedUserNames');

												if (sharedUserIds.getValue() == '') {// 若原没有值，则直接设置
													sharedUserIds.setValue(','
															+ uIds + ',');
													sharedUserNames
															.setValue(fnames);
													return;
												} else {
													// 去掉重复的人员
													var vIds = sharedUserIds
															.getValue()
															.split(',');
													var fnms = sharedUserNames
															.getValue()
															.split(',');
													sharedUserIds
															.setValue(uniqueArray(vIds
																	.concat(uIds
																			.split(',')))
																	+ ',');
													sharedUserNames
															.setValue(uniqueArray(fnms
																	.concat(fnames
																			.split(','))));

												}
											}).show();
								}
							}, {
								xtype : 'button',
								iconCls : 'btn-clear',
								text : '清空',
								handler : function() {
									var sharedUserIds = Ext
											.getCmp('DocumentSharedForm.sharedUserIds');
									var sharedUserNames = Ext
											.getCmp('DocumentSharedForm.sharedUserNames');

									sharedUserIds.setValue('');
									sharedUserNames.setValue('');
								},
								width : 80
							}]
				}, {
					xtype : 'fieldset',
					border : false,
					layout : 'column',
					items : [{
								xtype : 'label',
								text : '共享部门',
								width : 100
							}, {
								name : 'sharedDepIds',
								id : 'DocumentSharedForm.sharedDepIds',
								xtype : 'hidden'
							}, {
								name : 'sharedDepNames',
								id : 'DocumentSharedForm.sharedDepNames',
								xtype : 'textarea',
								width : 300
							}, {
								xtype : 'button',
								text : '选择',
								iconCls : 'btn-select',
								width : 80,
								handler : function() {
									DepSelector.getView(function(formPanel,ids, names) {
										var sharedDepIds = Ext
												.getCmp('DocumentSharedForm.sharedDepIds');
										var sharedDepNames = Ext
												.getCmp('DocumentSharedForm.sharedDepNames');

										if (sharedDepIds.getValue() == '') {// 若原没有值，则直接设置
											sharedDepIds.setValue(',' + ids
													+ ',');
											sharedDepNames.setValue(names);
											return;
										}
										// 去掉重复的部门
										var vIds = sharedDepIds.getValue()
												.split(',');
										var fnms = sharedDepNames.getValue()
												.split(',');

										sharedDepIds.setValue(uniqueArray(vIds
												.concat(ids.split(',')))
												+ ',');
										sharedDepNames
												.setValue(uniqueArray(fnms
														.concat(names
																.split(','))));

									}).show();
								}
							}, {
								xtype : 'button',
								text : '清空',
								iconCls : 'btn-clear',
								handler : function() {
									var sharedDepIds = Ext
											.getCmp('DocumentSharedForm.sharedDepIds');
									var sharedDepNames = Ext
											.getCmp('DocumentSharedForm.sharedDepNames');

									sharedDepIds.setValue('');
									sharedDepNames.setValue('');
								},
								width : 80
							}]
				}, {
					xtype : 'fieldset',
					border : false,
					layout : 'column',
					items : [{
								xtype : 'label',
								text : '共享角色',
								width : 100
							}, {
								xtype : 'hidden',
								id : 'DocumentSharedForm.sharedRoleIds',
								name : 'sharedRoleIds'
							}, {
								name : 'sharedRoleNames',
								id : 'DocumentSharedForm.sharedRoleNames',
								xtype : 'textarea',
								width : 300
							}, {
								xtype : 'button',
								text : '选择',
								iconCls : 'btn-select',
								width : 80,
								handler : function() {
									RoleSelector.getView(function(ids, names) {

										var sharedRoleIds = Ext
												.getCmp('DocumentSharedForm.sharedRoleIds');
										var sharedRoleNames = Ext
												.getCmp('DocumentSharedForm.sharedRoleNames');

										if (sharedRoleIds.getValue() == '') {// 若原没有值，则直接设置
											sharedRoleIds.setValue(',' + ids
													+ ',');
											sharedRoleNames.setValue(names);
											return;
										}

										// 去掉重复的角色
										var vIds = sharedRoleIds.getValue()
												.split(',');
										var fnms = sharedRoleNames.getValue()
												.split(',');

										sharedRoleIds.setValue(uniqueArray(vIds
												.concat(ids.split(',')))
												+ ',');
										sharedRoleNames
												.setValue(uniqueArray(fnms
														.concat(names
																.split(','))));

									}).show();
								}
							}, {
								xtype : 'button',
								text : '清空',
								iconCls : 'btn-clear',
								handler : function() {
									var sharedRoleIds = Ext
											.getCmp('DocumentSharedForm.sharedRoleIds');
									var sharedRoleNames = Ext
											.getCmp('DocumentSharedForm.sharedRoleNames');

									sharedRoleIds.setValue('');
									sharedRoleNames.setValue('');
								},
								width : 80
							}]
				}]
	});

	if (docId != null && docId != '' && docId != 'undefined') {
		formPanel.getForm().load({
					deferredRender : false,
					url : __ctxPath + '/document/getDocument.do?docId=' + docId,
					waitMsg : '正在载入数据...',
					success : function(form, action) {

					},
					failure : function(form, action) {
						Ext.MessageBox.show({
									title : '操作信息',
									msg : '载入信息失败，请联系管理员！',
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
					}
				});
	}
	var window = new Ext.Window({
				title : '文档授权信息',
				width : 620,
				iconCls : 'menu-mail_folder',
				height : 380,
				modal : true,
				layout : 'anchor',
				plain : true,
				bodyStyle : 'padding:5px;',
				scope : this,
				buttonAlign : 'center',
				items : formPanel,
				buttons : [{
					xtype : 'button',
					text : '共享',
					iconCls : 'btn-ok',
					handler : function() {
						formPanel.getForm().submit({
									url : __ctxPath
											+ '/document/shareDocument.do',
									method : 'post',
									waitMsg : '正在提交...',
									success : function(fp, action) {
										/*var result = Ext.util.JSON.decode(action.response.responseText);
										if(result.message=='error'){
											Ext.ux.Toast.msg('提示', '共享空间不足！');
											window.close();
										}else {
											window.close();
										}*/
										Ext.getCmp('DocumentGrid').getStore().reload();
								window.close();
									}
								});
					}
				}, {
					xtype : 'button',
					iconCls : 'btn-cancel',
					text : '关闭',
					handler : function() {
						window.close();
					}
				}]

			});
	return window;
};