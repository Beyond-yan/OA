/**
 * @author
 * @createtime
 * @class UserContractForm
 * @extends Ext.Window
 * @description UserContract表单
 * @company 宏天软件
 */
UserContractForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		UserContractForm.superclass.constructor.call(this, {
					id : 'UserContractFormWin',
					autoScroll : false,
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					items : [this.formPanel, this.detailPanel],
					region : 'center',
					maximizable : true,
					modal : true,
					height : 520,
					width : 650,
					title : '合同管理信息',
					buttonAlign : 'center',
					buttons : this.buttons

				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel({
			region : 'north',
			layout : 'form',
			bodyStyle : 'padding:10px 10px 10px 10px',
			border : false,
			url : __ctxPath + '/hrm/saveUserContract.do',
			id : 'UserContractForm',
			autoHeight : true,
			defaultType : 'textfield',
			

			items : [{
				xtype : 'fieldset',
				title : '合同信息',
				layout : 'form',
				labelWidth : 60,
				defaultType : 'textfield',
				defaults : {
					anchor : '98%,98%'
				},
				items : [{
							name : 'userContract.contractId',
							id : 'contractId',
							xtype : 'hidden',
							value : this.contractId == null
									? ''
									: this.contractId
						}, {
							fieldLabel : '合同编号',
							name : 'userContract.contractNo',
							id : 'contractNo',
							allowBlank : false,
							blankText : '合同编号不可为空!'
						}, {
							fieldLabel : '签约职员ID',
							name : 'userContract.userId',
							id : 'userId',
							xtype : 'hidden'
						}, {
							xtype : 'compositefield',
							fieldLabel : '签约人',
							items : [{
										xtype : 'textfield',
										name : 'userContract.fullname',
										id : 'fullname',
										allowBlank : false,
										blankText : '姓名不能为空！',
										width : 420,
										readOnly : true
									}, {
										xtype : 'button',
										id : 'UserContractSelectEmp',
										text : '选择员工',
										iconCls : 'btn-mail_recipient',
										handler : function() {
											UserSelector.getView(
													function(userId, fullname) {
														Ext
																.getCmp('fullname')
																.setValue(fullname);
														Ext
																.getCmp('userId')
																.setValue(userId);
														Ext.Ajax.request({
															url : __ctxPath
																	+ '/system/getAppUser.do',
															params : {
																userId : userId
															},
															method : 'post'
														})
													}, true).show();
										}
									}]
						}, {
							xtype : 'compositefield',
							fieldLabel : '期限形式',
							items : [{
								width : 200,
								name : 'userContract.timeLimit',
								id : 'timeLimit',
								xtype : 'combo',
								mode : 'local',
								editable : true,
								triggerAction : 'all',
								store : [],
								listeners : {
									focus : function(combo) {
										var _store = Ext.getCmp('timeLimit')
												.getStore();
										if (_store.getCount() <= 0)
											Ext.Ajax.request({
												url : __ctxPath
														+ '/system/loadDictionary.do',
												method : 'post',
												params : {
													itemName : '期限形式'
												},
												success : function(response) {
													var result = Ext.util.JSON
															.decode(response.responseText);
													_store.loadData(result);
												}
											});
									}
								}
							}, {
								xtype : 'displayfield',
								value : '合同状态:',
								width : 64
							}, {
								width : 200,
								hiddenName : 'userContract.status',
								id : 'status',
								xtype : 'combo',
								mode : 'local',
								editable : true,
								triggerAction : 'all',
								store : [['0', '草稿'], ['1', '有效'], ['2', '终止']]
							}]
						}, {
							xtype : 'compositefield',
							fieldLabel : '竞业条款',
							items : [{
								width : 200,
								hiddenName : 'userContract.isCompeted',
								id : 'isCompeted',
								xtype : 'combo',
								mode : 'local',
								editable : true,
								triggerAction : 'all',
								store : [['0', '无'], ['1', '有']]
							},{
								xtype : 'displayfield',
								value : '保密协议:',
								width : 64
							}, {
								width : 200,
								hiddenName : 'userContract.isSecret',
								id : 'isSecret',
								xtype : 'combo',
								mode : 'local',
								editable : true,
								triggerAction : 'all',
								store : [['0', '无'], ['1', '有']]
								}]
							}, {
							xtype : 'compositefield',
							fieldLabel : '合同类型',
							items : [{
								width : 200,
								xtype : 'textfield',
								name : 'userContract.contractType',
								id : 'contractType'
							},{
								xtype : 'displayfield',
								value : '签约日期:',
								width : 64
							}, {
								width : 200,
								name : 'userContract.signDate',
								id : 'signDate',
								xtype : 'datefield',
								format : 'Y-m-d',
								allowBlank : false,
								blankText : '签约日期不可为空!'
							}]
						}, {
							width : 350,
							fieldLabel : '违约责任',
							name : 'userContract.breakBurden',
							id : 'breakBurden'
						}, {
							width : 350,
							fieldLabel : '其他事宜',
							name : 'userContract.otherItems',
							id : 'otherItems'

						}, {
							xtype : 'compositefield',
							fieldLabel : '有效日期',
							items : [{
								xtype : 'datefield',
								width : 200,
								format : 'Y-m-d',
								editable : false,
								name : 'userContract.startDate',
								id : 'startDate',
								allowBlank : false,
								blankText : '合同生效日期不可为空!'
						}, {
							xtype : 'displayfield',
							value : '至',
							width : 20
						}, {
							xtype : 'datefield',
							width : 200,
							format : 'Y-m-d',
							editable : false,
							name : 'userContract.expireDate',
							id : 'expireDate',
							allowBlank : false,
							blankText : '合同满约日期不可为空!'
						}]
						}, {
							xtype : 'container',
							autoHeight : true,
							layout : 'column',
							autoWidth : true,
							defaultType : 'label',
							style : 'padding-left:0px;',
							items : [{
										text : '合同附件:',
										width : 64,
										style : 'padding-left:0px;padding-top:3px;'

									}, {
										xtype : 'hidden',
										id : 'contractAttachId',
										name : 'fileIds'
									}, {
										xtype : 'panel',
										id : 'contractAttachPanel',
										width : 280,
										height : 60,
										frame : false,
										autoScroll : true,
										style : 'padding-left:0px;padding-top:0px;',
										html : ''
									}, {
										xtype : 'button',
										text : '添加附件',
										iconCls : 'menu-attachment',
										handler : function() {
											var dialog = App
													.createUploadDialog({
														file_cat : 'hrm',
														callback : function(
																data) {
															var fileIds = Ext
																	.getCmp("contractAttachId");
															var filePanel = Ext
																	.getCmp('contractAttachPanel');

															for (var i = 0; i < data.length; i++) {
																if (fileIds
																		.getValue() != '') {
																	fileIds
																			.setValue(fileIds
																					.getValue()
																					+ ',');
																}
																fileIds
																		.setValue(fileIds
																				.getValue()
																				+ data[i].fileId);
																Ext.DomHelper
																		.append(
																				filePanel.body,
																				'<span><a href="#" onclick="FileAttachDetail.show('
																						+ data[i].fileId
																						+ ')">'
																						+ data[i].filename
																						+ '</a> <img class="img-delete" src="'
																						+ __ctxPath
																						+ '/images/system/delete.gif" onclick="removeContractAttach(this,'
																						+ data[i].fileId
																						+ ')"/>&nbsp;|&nbsp;</span>');
															}
														}
													});
											dialog.show(this);
										}
									}]
						}]
			}]
		});

		// 加载数据至store
		this.detailStore = new Ext.data.JsonStore({
					fields : [{
								name : 'eventId',
								type : 'int'
							}, 'userContract', 'eventName', 'eventDescp',
							'createTime', 'creator']
				});
		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
								header : 'eventId',
								dataIndex : 'eventId',
								hidden : true
							}, {
								header : '记录名称',
								dataIndex : 'eventName',
								editor : new Ext.form.TextField({
											allowBlank : false,
											blankText : '记录名称不可为空!'
										})
							}, {
								header : '记录理由',
								dataIndex : 'eventDescp',
								editor : new Ext.form.TextField()
							}],
					defaults : {
						sortable : true,
						menuDisabled : false,
						width : 100
					}
				});
		this.topbar = new Ext.Toolbar({
					items : [{
								xtype : 'button',
								iconCls : 'btn-add',
								scope : this,
								text : '添加记录',
								handler : function() {
									var store = this.detailPanel.getStore();
									var Detail = store.recordType;
									store.add(new Detail());
									this.detailPanel.stopEditing();
								}
							}]

				});
		this.detailPanel = new Ext.grid.EditorGridPanel({
					title : '合同记录信息',
					id : 'detailPanel',
					autoScroll : true,
					region : 'center',
					stripeRows : true,
					tbar : this.topbar,
					clicksToEdit : 1,
					store : this.detailStore,
					trackMouseOver : true,
					loadMask : true,
					height : 150,
					cm : cm,
					sm : sm
				});

		var detailStore = this.detailStore;

		// 加载表单对应的数据
		if (this.contractId != null && this.contractId != 'undefined') {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/hrm/getUserContract.do?contractId='
						+ this.contractId,
				waitMsg : '正在载入数据...',

				success : function(form, action) {
					var res = Ext.util.JSON
							.decode(action.response.responseText);

					// 载入附件
					var af = action.result.data.contractAttachs;
					var filePanel = Ext.getCmp('contractAttachPanel');
					var fileIds = Ext.getCmp("contractAttachId");

					for (var i = 0; i < af.length; i++) {
						if (fileIds.getValue() != '') {
							fileIds.setValue(fileIds.getValue() + ',');
						}
						fileIds.setValue(fileIds.getValue() + af[i].fileId);
						Ext.DomHelper
								.append(
										filePanel.body,
										'<span><a href="#" onclick="FileAttachDetail.show('
												+ af[i].fileId
												+ ')">'
												+ af[i].fileName
												+ '</a><img class="img-delete" src="'
												+ __ctxPath
												+ '/images/system/delete.gif" onclick="removeContractAttach(this,'
												+ af[i].fileId
												+ ')"/>&nbsp;|&nbsp;</span>');
					}
					detailStore.loadData(res.data.contractEvents);
					Ext.getCmp('contractNo').getEl().dom.readOnly = true;
				},
				failure : function(form, action) {

				}
			});
		}
		// 初始化功能按钮
		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					handler : this.save.createCallback(this.formPanel, this)
				}, {
					text : '重置',
					iconCls : 'btn-reset',
					handler : this.reset.createCallback(this.formPanel)
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : this.cancel.createCallback(this)
				}];
	},// end of the initcomponents

	/**
	 * 重置
	 * 
	 * @param {}
	 *            formPanel
	 */
	reset : function(formPanel) {
		formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function(window) {
		window.close();
	},
	/**
	 * 保存记录
	 */
	save : function(formPanel, win) {
		var store = win.detailPanel.getStore();
		var params = [];
		if (store.getCount() > 0) {
			for (i = 0, cnt = store.getCount(); i < cnt; i++) {
				var record = store.getAt(i);
				params.push(record.data);
			}
		} else {
			Ext.ux.Toast.msg('提示信息', '请添加合同记录信息！');
			return;
		}
		if (formPanel.getForm().isValid()) {
			formPanel.getForm().submit({
						method : 'POST',
						waitMsg : '正在提交数据...',
						params : {
							details : Ext.encode(params)
						},
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '成功保存信息！');
							var gridPanel = Ext.getCmp('UserContractGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							var eventPanel = Ext.getCmp('ContractEventGrid');
							if (eventPanel != null) {
								eventPanel.getStore().reload();
							}
							win.close();
						},
						failure : function(fp, action) {
							Ext.MessageBox.show({
										title : '操作信息',
										msg : action.result.msg,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	}// end of save

});
function removeContractAttach(obj, fileId) {
	var fileIds = Ext.getCmp("contractAttachId");
	var value = fileIds.getValue();
	if (value.indexOf(',') < 0) {// 仅有一个附件
		fileIds.setValue('');
	} else {
		value = value.replace(',' + fileId, '').replace(fileId + ',', '');
		fileIds.setValue(value);
	}

	var el = Ext.get(obj.parentNode);
	el.remove();
};
