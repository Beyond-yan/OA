/**
 * @author:
 * @class PublicApplyView
 * @extends Ext.Panel
 * @description [PublicApply]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */

function PublicApplyViewProcess(runId, defId, piId, subject) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, subject);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
}

/*
 * 公关接待流程终止
 */
function stopPublicApplyProcess(id, piId) {
	Ext.Msg.confirm('提示', '确定终止该流程？', function(btn, text) {
				if (btn == 'yes') {
					//终止流程		
					Ext.Ajax.request({
								url : __ctxPath + '/flow/stopProcessRun.do',
								params : {
									'piId' : piId
								},
								success : function(resp, options) {
									Ext.ux.Toast.msg('操作信息', '操作成功');
									Ext.getCmp('PublicApplyGrid').getStore()
											.reload();
								},
								failure : function(response) {
									Ext.Msg.alert("提示", "终止失败！");
								}
							});
					//修改数据库的审核状态		
					Ext.Ajax.request({
								url : __ctxPath + '/admin/savePublicApply.do',
								params : {
									'publicApply.id' : id,
									'publicApply.status' : 4,
									'publicApply.updateBy' : new Date()
											.dateFormat('Y-m-d H:i:s')
								},
								success : function(resp, options) {
									Ext.getCmp('PublicApplyGrid').getStore()
											.reload();
								}
							});
				}
			});
}

PublicApplyView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		PublicApplyView.superclass.constructor.call(this, {
					id : 'PublicApplyView',
					title : '公关接待申请管理',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
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
									name : 'publicApplyView.userName',
									id : 'publicApplyView.userName',
									editable : false,
									readOnly : true,
									width : 320
								}, {
									xtype : 'button',
									iconCls : 'btn-user-sel',
									text : '选择人员',
									handler : function() {
										UserSelector.getView(
												function(id, name) {
													Ext
															.getCmp('publicApplyView.userName')
															.setValue(name);
													Ext
															.getCmp('publicApplyView_applyUserId')
															.setValue(id);
												}, true, true).show();
									}
								}, {
									xtype : 'button',
									text : '清除记录',
									iconCls : 'reset',
									handler : function() {
										Ext.getCmp('publicApplyView.userName')
												.setValue('');
										Ext
												.getCmp('publicApplyView_applyUserId')
												.setValue('');
									}
								}]
					}, {
						fieldLabel : '申请人',
						name : 'Q_appUser.userId_L_EQ',
						id : 'publicApplyView_applyUserId',
						xtype : 'hidden',
						flex : 1
					}, {
						xtype : 'container',
						style : 'padding-left:0px;margin-bottom:4px;',
						id : 'depContainer',
						layout : 'column',
						items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '申请部门:',
									width : 105
								}, {
									xtype : 'textfield',
									name : 'publicApplyView.department',
									id : 'publicApplyView.department',
									editable : false,
									readOnly : true,
									width : 320
								}, {
									xtype : 'button',
									iconCls : 'btn-dep-sel',
									text : '选择部门',
									handler : function() {
										DepSelector.getView(function(id, name) {
											Ext
													.getCmp('publicApplyView.department')
													.setValue(name);
											Ext
													.getCmp('publicApplyView_departmentId')
													.setValue(id);
										}, true).show();
									}
								}, {
									xtype : 'button',
									text : '清除记录',
									iconCls : 'reset',
									handler : function() {
										Ext.getCmp('publicApply.department')
												.setValue('');
										Ext
												.getCmp('publicApplyView_departmentId')
												.setValue('');
									}
								}]
					}, {
						fieldLabel : 'departmentId',
						name : 'Q_department.depId_L_EQ',
						id : 'publicApplyView_departmentId',
						flex : 1,
						xtype : 'hidden'
					}, {
						xtype : 'radiogroup',
						fieldLabel : '审批状态',
						width : 280,
						flex : 1,
						items : [{
									boxLabel : '所有',
									name : 'Q_status_SN_EQ',
									inputValue : null,
									checked : true
								}, {
									boxLabel : '审批中',
									name : 'Q_status_SN_EQ',
									inputValue : 1
								}, {
									boxLabel : '审批通过',
									name : 'Q_status_SN_EQ',
									inputValue : 2
								}, {
									boxLabel : '退回',
									name : 'Q_status_SN_EQ',
									inputValue : 3
								}]
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

		this.topbar = new Ext.Toolbar({
					items : [{
								iconCls : 'btn-add',
								text : '添加',
								xtype : 'button',
								scope : this,
								handler : this.createRs
							}]
				});
		this.applyStateRenderer = function(val, p, record) {
			if (val == 1) {
				return '审批中';
			} else if (val == 2) {
				return '审批通过';
			} else if (val == 3) {
                return '流程终止';
				//return '退回';
			}/* else if (val == 4) {
				return '终止';
			}*/
		};
		this.levelRenderer = function(val, p, record) {
			if (val == 1) {
				return '一级';
			} else if (val == 2) {
				return '二级';
			} else if (val == 3) {
				return '三级';
			}
		};
		//管理
		this.managerRenderer = function(val, p, record) {
			var reHtml = '<img src="images/btn/flow/view.png" style="cursor: pointer" onclick="PublicApplyViewProcess('
					+ record.data.runId
					+ ','
					+ record.data.defId
					+ ',\''
					+ record.data.piId
					+ '\',\''
					+ record.data.subject
					+ '\')" qtip="查看流程" />';

			if (record.data.status == 2) {
				if (val == null) {
					reHtml += '   <img src="images/system/edit.gif" style="cursor: pointer" onclick="new PublicApplyForm({applyId : '
							+ record.data.id + '}).show();" qtip="创建接待方案" />';
				} else {
					reHtml += '   <img src="images/btn/mail/mail_edit.png" style="cursor: pointer" onclick="new PublicApplyForm({applyId : '
							+ record.data.id
							+ ', planId : '
							+ record.data.planId
							+ '}).show();" qtip="修改接待方案" />';
				}
			}

			if (record.data.status == 1 || record.data.status == 3) {
				reHtml += '   <img src="images/menus/task/depplan.png" style="cursor: pointer" onclick="stopPublicApplyProcess('
						+ record.data.id
						+ ',\''
						+ record.data.piId
						+ '\')" qtip="终止流程" />';
			}

			return reHtml;
		};

		this.gridPanel = new HT.GridPanel({
			region : 'center',
			tbar : this.topbar,
			//使用RowActions
			rowActions : true,
			id : 'PublicApplyGrid',
			url : __ctxPath + "/admin/listPublicApply.do",
			fields : [
					{
						name : 'id',
						type : 'int'
					},
					'appUser.userId',
					'applyUserId',
					{
						name : 'fullname',
						mapping : 'appUser.fullname'
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
						name : 'department',
						mapping : 'department.depName'
					},{
                        name:'status',
                        mapping:'processRun ? obj.processRun.runStatus : null'
                    },'departmentId', 'receptionTime', 'receptionAddress',
					'reason', 'guestName', 'guestLd', 'guestTotaldays',
					'cpuser', 'moneyTotal', 'planId', 'processInsId',
					'level', 'createDate', 'createBy', 'updateDate', 'updateBy'],
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
						header : '接待时间',
						dataIndex : 'receptionTime'
					}, {
						header : '接待地点',
						dataIndex : 'receptionAddress'
					}, {
						header : '来宾单位',
						dataIndex : 'guestName'
					}

					, {
						header : '来宾天数',
						dataIndex : 'guestTotaldays'
					}, {
						header : '计划费用',
						dataIndex : 'moneyTotal'
					}, {
						header : '接待等级',
						dataIndex : 'level',
						renderer : this.levelRenderer
					}, {
						header : '审批状态',
						dataIndex : 'status',
						renderer : this.applyStateRenderer
					}, {
						header : '申请时间',
						dataIndex : 'createDate'
					}, {

						header : '管理',
						dataIndex : 'planId',
						renderer : this.managerRenderer

					}

					, new Ext.ux.grid.RowActions({
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
				//end of columns
		});

		//this.gridPanel.addListener('rowdblclick',this.rowClick);

	},// end of the initComponents()
	//重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	//按条件搜索
	search : function() {
		$search({
					searchPanel : this.searchPanel,
					gridPanel : this.gridPanel
				});
	},
	//GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
					new PublicApplyForm({
								id : rec.data.id
							}).show();
				});
	},
	//创建记录
	createRs : function() {
		//new PublicApplyForm().show();
		PublicApplyView.newFlow(FlowDefIdPro.PublicApplydefId,
				FlowDefIdPro.PublicApplyFlowName)
	},
	//按ID删除记录
	removeRs : function(id) {
		$postDel({
					url : __ctxPath + '/admin/multiDelPublicApply.do',
					ids : id,
					grid : this.gridPanel
				});
	},
	//把选中ID删除
	removeSelRs : function() {
		$delGridRs({
					url : __ctxPath + '/admin/multiDelPublicApply.do',
					grid : this.gridPanel,
					idName : 'id'
				});
	},
	//编辑Rs
	editRs : function(record) {
		new PublicApplyForm({
					id : record.data.id
				}).show();
	},
	viewProcess : function(record) {
		var runId = record.data.runId;
		var defId = record.data.defId;;
		var piId = record.data.piId;
		var subject = record.data.subject;
		PublicApplyView.proDetail(runId, defId, piId, subject)
	},
	//行的Action
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
PublicApplyView.proDetail = function(runId, defId, piId, name) {
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
PublicApplyView.newFlow = function(defId, name) {

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

var publicPlanFormPanel = new Ext.FormPanel({
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			//id : 'PublicPlanForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [{
						name : 'publicPlan.id',
						xtype : 'hidden',
						value : this.id == null ? '' : this.id
					}, {
						fieldLabel : 'PLAN_USER_ID',
						name : 'publicPlan.planUserId',
						allowBlank : false,
						xtype : 'numberfield'
					}, {
						fieldLabel : 'PLAN_TIME',
						name : 'publicPlan.planTime',
						xtype : 'datefield',
						format : 'Y-m-d',
						value : new Date()
					}, {
						fieldLabel : 'MONEY_TOTAL',
						name : 'publicPlan.moneyTotal',
						maxLength : 18
					}, {
						fieldLabel : 'CREATE_DATE',
						name : 'publicPlan.createDate',
						xtype : 'datefield',
						format : 'Y-m-d',
						value : new Date()
					}, {
						fieldLabel : 'CREATE_BY',
						name : 'publicPlan.createBy',
						maxLength : 50
					}, {
						fieldLabel : 'UPDATE_DATE',
						name : 'publicPlan.updateDate',
						xtype : 'datefield',
						format : 'Y-m-d',
						value : new Date()
					}, {
						fieldLabel : 'UPDATE_BY',
						name : 'publicPlan.updateBy',
						maxLength : 50
					}]
		});