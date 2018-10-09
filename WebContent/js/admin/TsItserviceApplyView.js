/**
 * @author:
 * @class TsItserviceApplyView
 * @extends Ext.Panel
 * @description [TsItserviceApply]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */

function TsItserviceApplyViewProcess(runId, defId, piId, subject) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, subject);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
}

/*
 * 故障处理流程终止
 */
function stopTsItserviceApplyProcess(id, piId) {
	Ext.Msg.confirm('提示', '确定终止该流程？', function(btn, text) {
				if (btn == 'yes') {
					// 终止流程
					Ext.Ajax.request({
								url : __ctxPath + '/flow/stopProcessRun.do',
								params : {
									'piId' : piId
								},
								success : function(resp, options) {
									Ext.ux.Toast.msg('操作信息', '操作成功');
									Ext.getCmp('TsItserviceApplyGrid')
											.getStore().reload();
								},
								failure : function(response) {
									Ext.Msg.alert("提示", "终止失败！");
								}
							});
					// 修改数据库的审核状态
					Ext.Ajax.request({
								url : __ctxPath
										+ '/admin/saveTsItserviceApply.do',
								params : {
									'tsItserviceApply.id' : id,
									'tsItserviceApply.proStatus' : 5,
									'tsItserviceApply.updateBy' : new Date()
											.dateFormat('Y-m-d H:i:s')
								},
								success : function(resp, options) {
									Ext.getCmp('TsItserviceApplyGrid')
											.getStore().reload();
								}
							});
				}
			});
}

TsItserviceApplyView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		TsItserviceApplyView.superclass.constructor.call(this, {
					id : 'TsItserviceApplyView',
					title : 'IT服务申请管理',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		var serviceTypeStore = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath
										+ '/admin/listTsItserviceType.do'
							}),
					idProperty : 'id',
					reader : new Ext.data.JsonReader({
								root : 'result',
								fields : ['itserviceName', 'id']
							}),
					remoteSort : true,
					autoLoad : true
				});

		this.applyStateRenderer = function(val, p, record) {
			// if(val == 1){
			// return '审批中';
			// }else if(val == 2){
			// return '审批通过';
			// }else if(val == 3){
			// return '退回';
			// }else if(val == 4){
			// return '处理完成';
			// }else if(val == 5){
			// return '终止';
			// }
			if (val == 1) {
				return '处理中';
			} else if (val == 2) {
				return '处理完成';
			} else if (val == 3) {
				return '终止';
			}
		};

		// 管理
//		this.managerRenderer = function(val, p, record) {
//			var reHtml = '<img src="images/btn/flow/view.png" style="cursor: pointer" onclick="TsItserviceApplyViewProcess('
//					+ record.data.runId
//					+ ','
//					+ record.data.defId
//					+ ',\''
//					+ record.data.piId
//					+ '\',\''
//					+ record.data.subject
//					+ '\')" qtip="查看流程" />';
//
//			if (record.data.proStatus == 1) {
//				reHtml += '   <img src="images/menus/task/depplan.png" style="cursor: pointer" onclick="stopTsItserviceApplyProcess('
//						+ record.data.id
//						+ ',\''
//						+ record.data.piId
//						+ '\')" qtip="终止流程" />';
//			}
//
//			return reHtml;
//		};

		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
			layout : 'form',
			region : 'north',
			colNums : 1,
			items : [{
				xtype : 'container',
				layout : 'column',
				style : 'padding-left:0px;margin-bottom:4px;',
				items : [{
							xtype : 'label',
							style : 'padding-left:0px;',
							text : '申请人:',
							width : 105
						}, {
							xtype : 'textfield',
							name : 'tsItserviceApplyView.userName',
							id : 'tsItserviceApplyView.userName',
							editable : false,
							readOnly : true,
							width : 320
						}, {
							xtype : 'button',
							iconCls : 'btn-user-sel',
							text : '选择人员',
							handler : function() {
								UserSelector.getView(function(id, name) {
									Ext.getCmp('tsItserviceApplyView.userName')
											.setValue(name);
									Ext
											.getCmp('tsItserviceApplyView_Q_applyUserId_L_EQ')
											.setValue(id);
								}, true, false).show();
							}
						}, {
							xtype : 'button',
							text : '清除记录',
							iconCls : 'reset',
							handler : function() {
								Ext.getCmp('tsItserviceApplyView.userName')
										.setValue('');
								Ext
										.getCmp('tsItserviceApplyView_Q_applyUserId_L_EQ')
										.setValue('');
							}
						}]
			}, {
				fieldLabel : '申请人',
				name : 'Q_appUser.userId_L_EQ',
				id : 'tsItserviceApplyView_Q_applyUserId_L_EQ',
				xtype : 'hidden',
				flex : 1
			}, {
				xtype : "combo",
				// name : "Q_proTypeId_L_EQ",
				id : "Q_proTypeId_L_EQss",
				fieldLabel : "申请类型",
				valueField : 'id',
				displayField : 'itserviceName',
				mode : 'local',
				editable : false,
				typeAhead : true,
				triggerAction : 'all',
				forceSelection : true,
				width : 240,
				// allowBlank : false,
				store : serviceTypeStore,
				listeners : {
					select : function(cbo, record, index) {
						Ext.getCmp('tsItserviceApplyView_proTypeId')
								.setValue(cbo.getValue());
					}
				}
			}, {
				name : 'Q_tsItserviceType.id_L_EQ',
				id : 'tsItserviceApplyView_proTypeId',
				xtype : 'hidden'
			}, {
				xtype : 'radiogroup',
				fieldLabel : '处理状态',
				width : 270,
				flex : 1,
				items : [{
							boxLabel : '所有',
							// name : 'Q_proStatus_SN_EQ',
							name : 'Q_processRun.runStatus_SN_EQ',
							inputValue : null,
							checked : true
						}, {
							// boxLabel : '审批中',
							boxLabel : '处理中',
							name : 'Q_processRun.runStatus_SN_EQ',
							inputValue : 1
						}, {
							// boxLabel : '审批通过',
							boxLabel : '处理完成',
							name : 'Q_processRun.runStatus_SN_EQ',
							inputValue : 2
						}, {
							// boxLabel : '退回',
							boxLabel : '终止',
							name : 'Q_processRun.runStatus_SN_EQ',
							inputValue : 3
						}
				// , {
				// boxLabel : '处理完成',
				// name : 'Q_proStatus_SN_EQ',
				// inputValue : 4
				// }, {
				// boxLabel : '终止',
				// name : 'Q_proStatus_SN_EQ',
				// inputValue : 5
				// }
				]
			}],
			buttons : [{
						text : '查询',
						scope : this,
						iconCls : 'btn-search',
						handler : this.search
					}, {
						text : '重置',
						scope : this,
						iconCls : 'btn-reset',
						handler : this.reset
					}]
		});// end of searchPanel

		// 管理
		this.managerRenderer = function(val, p, record) {
			var reHtml = '<img src="images/btn/flow/view.png" style="cursor: pointer" onclick="TsItserviceApplyViewProcess('
					+ record.data.runId
					+ ','
					+ record.data.defId
					+ ',\''
					+ record.data.piId
					+ '\',\''
					+ record.data.subject
					+ '\')" qtip="查看流程" />';

			//if (record.data.proStatus == 1) {
			if (record.data.runStatus == 1) {
				reHtml += '   <img src="images/menus/task/depplan.png" style="cursor: pointer" onclick="stopTsItserviceApplyProcess('
						+ record.data.id
						+ ',\''
						+ record.data.piId
						+ '\')" qtip="终止流程" />';
			}

			return reHtml;
		};

		// 初始化搜索条件Panel
//		this.searchPanel = new HT.SearchPanel({
//			layout : 'form',
//			region : 'north',
//			colNums : 1,
//			items : [{
//				xtype : 'container',
//				layout : 'column',
//				style : 'padding-left:0px;margin-bottom:4px;',
//				items : [{
//							xtype : 'label',
//							style : 'padding-left:0px;',
//							text : '申请人:',
//							width : 105
//						}, {
//							xtype : 'textfield',
//							name : 'tsItserviceApplyView.userName',
//							id : 'tsItserviceApplyView.userName',
//							editable : false,
//							readOnly : true,
//							width : 320
//						}, {
//							xtype : 'button',
//							iconCls : 'btn-user-sel',
//							text : '选择人员',
//							handler : function() {
//								UserSelector.getView(function(id, name) {
//									Ext.getCmp('tsItserviceApplyView.userName')
//											.setValue(name);
//									Ext
//											.getCmp('tsItserviceApplyView_Q_applyUserId_L_EQ')
//											.setValue(id);
//								}, true, true).show();
//							}
//						}, {
//							xtype : 'button',
//							text : '清除记录',
//							iconCls : 'reset',
//							handler : function() {
//								Ext.getCmp('tsItserviceApplyView.userName')
//										.setValue('');
//								Ext
//										.getCmp('tsItserviceApplyView_Q_applyUserId_L_EQ')
//										.setValue('');
//							}
//						}]
//			}, {
//				fieldLabel : '申请人',
//				name : 'Q_appUser.userId_L_EQ',
//				id : 'tsItserviceApplyView_Q_applyUserId_L_EQ',
//				xtype : 'hidden',
//				flex : 1
//			}, {
//				xtype : "combo",
//				// name : "Q_proTypeId_L_EQ",
//				id : "Q_proTypeId_L_EQss",
//				fieldLabel : "申请类型",
//				valueField : 'id',
//				displayField : 'itserviceName',
//				mode : 'local',
//				editable : false,
//				typeAhead : true,
//				triggerAction : 'all',
//				forceSelection : true,
//				width : 240,
//				// allowBlank : false,
//				store : serviceTypeStore,
//				listeners : {
//					select : function(cbo, record, index) {
//						Ext.getCmp('tsItserviceApplyView_proTypeId')
//								.setValue(cbo.getValue());
//					}
//				}
//			}, {
//				name : 'Q_tsItserviceType.id_L_EQ',
//				id : 'tsItserviceApplyView_proTypeId',
//				xtype : 'hidden'
//			}, {
//				xtype : 'radiogroup',
//				fieldLabel : '处理状态',
//				width : 500,
//				flex : 1,
//				items : [{
//							boxLabel : '所有',
//							name : 'Q_proStatus_SN_EQ',
//							inputValue : null,
//							checked : true
//						}, {
//							boxLabel : '审批中',
//							name : 'Q_proStatus_SN_EQ',
//							inputValue : 1
//						}, {
//							boxLabel : '审批通过',
//							name : 'Q_proStatus_SN_EQ',
//							inputValue : 2
//						}, {
//							boxLabel : '退回',
//							name : 'Q_proStatus_SN_EQ',
//							inputValue : 3
//						}, {
//							boxLabel : '处理完成',
//							name : 'Q_proStatus_SN_EQ',
//							inputValue : 4
//						}, {
//							boxLabel : '终止',
//							name : 'Q_proStatus_SN_EQ',
//							inputValue : 5
//						}]
//			}],
//			buttons : [{
//						text : '查询',
//						scope : this,
//						iconCls : 'btn-search',
//						handler : this.search
//					}, {
//						text : '重置',
//						scope : this,
//						iconCls : 'btn-reset',
//						handler : this.reset
//					}]
//		});// end of searchPanel

		this.topbar = new Ext.Toolbar({
					items : [{
								iconCls : 'btn-add',
								text : '添加',
								xtype : 'button',
								scope : this,
								handler : this.createRs
							}]
				});

		this.gridPanel = new HT.GridPanel({
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'TsItserviceApplyGrid',
			url : __ctxPath + "/admin/listTsItserviceApply.do",
			fields : [
					{
						name : 'id',
						type : 'int'
					},
					'userId',
					{
						name : 'fullname',
						mapping : 'appUser.fullname'
					},
					{
						name : 'department',
						mapping : 'appUser.department.depName'
					},
					'applyTypeId',
					{
						name : 'tsItserviceTypeName',
						mapping : 'tsItserviceType.itserviceName'
					},
					{
						name : 'dealingUserName',
						mapping : 'dealingAppUser ? obj.dealingAppUser.fullname : null'
					},
					{
						name : 'runId',
						mapping : 'processRun ? obj.processRun.runId : null'
					},
					{
						name : 'defId',
						mapping : 'processRun ? obj.processRun.proDefinition.defId : null'
					}, {
						name : 'piId',
						mapping : 'processRun ? obj.processRun.piId : null'
					}, {
						name : 'subject',
						mapping : 'processRun ? obj.processRun.subject : null'
					}, {
						name : 'runStatus',
						mapping : 'processRun.runStatus'
					}, 'applyDesc', 'proStatus', 'dealingUserId',
					'dealingResult', 'processInstanceId', 'ref1', 'ref2',
					'ref3', 'createDate', 'createBy', 'updateDate', 'updateBy'],
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '申请人',
						dataIndex : 'fullname'
					}, {
						header : '申请部门',
						dataIndex : 'department'
					}, {
						header : '申请类型',
						dataIndex : 'tsItserviceTypeName'
					}, {
						header : '处理人员',
						dataIndex : 'dealingUserName'
					}, {
						header : '处理状态',
						// dataIndex : 'proStatus',
						dataIndex : 'runStatus',
						renderer : this.applyStateRenderer
					}, {
						header : '申请时间',
						dataIndex : 'createDate'
					}, {
						header : '发起人员',
						dataIndex : 'createBy'
					}, {
						header : '管理',
						dataIndex : 'planId',
						renderer : this.managerRenderer
					}, new Ext.ux.grid.RowActions({
								header : '管理',
								width : 100,
								hidden : true,
								actions : [{
											iconCls : 'btn-flowView',
											qtip : '查看',
											style : 'margin:0 10px 0 10px'
										}],
								listeners : {
									scope : this,
									'action' : this.onRowAction
								}
							})]
				// end of columns
		});
	},
	//重置查询表单
	reset : function(){
		this.searchPanel.getForm().reset();
	},
	//按条件搜索
	search : function() {
		$search({
			searchPanel:this.searchPanel,
			gridPanel:this.gridPanel
		});
	},
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
					new TsItserviceApplyForm({
								id : rec.data.id
							}).show();
				});
	},
	// 创建记录
	createRs : function() {
		// new TsItserviceApplyForm().show();
		TsItserviceApplyView.newFlow(FlowDefIdPro.TsItserviceApplydefId,
				FlowDefIdPro.TsItserviceApplyFlowName);
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel({
					url : __ctxPath + '/admin/multiDelTsItserviceApply.do',
					ids : id,
					grid : this.gridPanel
				});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs({
					url : __ctxPath + '/admin/multiDelTsItserviceApply.do',
					grid : this.gridPanel,
					idName : 'id'
				});
	},
	// 编辑Rs
	editRs : function(record) {
		new TsItserviceApplyForm({
					id : record.data.id
				}).show();
	},
	viewProcess : function(record) {
		var runId = record.data.runId;
		var defId = record.data.defId;;
		var piId = record.data.piId;
		var subject = record.data.subject;
		TsItserviceApplyView.proDetail(runId, defId, piId, subject);
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-del' :
				this.removeRs.call(this, record.data.id);
				break;
			case 'btn-edit' :
				this.editRs.call(this, record);
				break;
			case 'btn-flowView' :
				this.viewProcess.call(this, record);
				break;
			default :
				break;
		}
	}
});

/**
 * 显示明细
 * 
 * @param {}
 *            runId
 * @param {}
 *            name
 */
TsItserviceApplyView.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};

/**
 * 新建流程
 * 
 * @param {}
 *            defId
 * @param {}
 *            name
 */
TsItserviceApplyView.newFlow = function(defId, name) {

	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('ProcessRunStart' + defId);

	if (startForm == null) {
		startForm = new ProcessRunStart({
					id : 'ProcessRunStart' + defId,
					defId : defId,
					flowName : name
				});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
};
