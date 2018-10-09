/**
 * @author:
 * @class PersonnelLeaveApplyView
 * @extends Ext.Panel
 * @description [PersonnelLeaveApply]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
PersonnelLeaveApplyView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		PersonnelLeaveApplyView.superclass.constructor.call(this, {
			id : 'PersonnelLeaveApplyView',
			title : '请假管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel( {
			layout : 'form',
			region : 'north',
			colNums : 3,
			items : [ {
				fieldLabel : '请假申请ID',
				name : 'Q_applicantId_L_EQ',
				flex : 1,
				xtype : 'numberfield'
			}, {
				fieldLabel : '请假类型',
				name : 'Q_type_SN_EQ',
				flex : 1,
				xtype : 'numberfield'
			}, {
				fieldLabel : '开始日期',
				name : 'Q_startDt_D_GE',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d'
			}, {
				fieldLabel : '结束日期',
				name : 'Q_endDt_D_LE',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d'
			},/* {
				fieldLabel : 'backDt',
				name : 'Q_backDt_D_EQ',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d'
			},*/ {
				fieldLabel : '请假是由',
				name : 'Q_description_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '备注',
				name : 'Q_remark_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, /*{
				fieldLabel : 'isDeleted',
				name : 'Q_isDeleted_SN_EQ',
				flex : 1,
				xtype : 'numberfield'
			}, {
				fieldLabel : 'processInsId',
				name : 'Q_processInsId_L_EQ',
				flex : 1,
				xtype : 'numberfield'
			}, {
				fieldLabel : 'createDate',
				name : 'Q_createDate_D_EQ',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d'
			}, {
				fieldLabel : 'createBy',
				name : 'Q_createBy_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : 'updateDate',
				name : 'Q_updateDate_D_EQ',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d'
			}, {
				fieldLabel : 'updateBy',
				name : 'Q_updateBy_S_EQ',
				flex : 1,
				xtype : 'textfield'
			} */],
			buttons : [ {
				text : '查询',
				scope : this,
				iconCls : 'btn-search',
				handler : this.search
			}, {
				text : '重置',
				scope : this,
				iconCls : 'btn-reset',
				handler : this.reset
			} ]
		});// end of searchPanel

		this.topbar = new Ext.Toolbar( {
			items : [ {
				iconCls : 'btn-add',
				text : '添加申请',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}/*, {
				iconCls : 'btn-del',
				text : '删除[PersonnelLeaveApply]',
				xtype : 'button',
				scope : this,
				handler : this.removeSelRs
			} */]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'PersonnelLeaveApplyGrid',
			url : __ctxPath + "/personal/listPersonnelLeaveApply.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'applicantId', 'type', 'startDt', 'endDt', 'backDt',
					'description', 'remark', 'isDeleted', 'processInsId',
					'createDate', 'createBy', 'updateDate', 'updateBy' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			},/* {
				header : 'applicantId',
				dataIndex : 'applicantId'
			}, */{
				header : '请假类型',
				dataIndex : 'type'
			}, {
				header : '开始日期',
				dataIndex : 'startDt'
			}, {
				header : '结束日期',
				dataIndex : 'endDt'
			},/* {
				header : 'backDt',
				dataIndex : 'backDt'
			},*/ {
				header : '请假是由',
				dataIndex : 'description'
			}, {
				header : '备注',
				dataIndex : 'remark'
			},/* {
				header : 'isDeleted',
				dataIndex : 'isDeleted'
			}, {
				header : 'processInsId',
				dataIndex : 'processInsId'
			}, {
				header : 'createDate',
				dataIndex : 'createDate'
			}, {
				header : 'createBy',
				dataIndex : 'createBy'
			}, {
				header : 'updateDate',
				dataIndex : 'updateDate'
			}, {
				header : 'updateBy',
				dataIndex : 'updateBy'
			},*/ new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 100,
				actions : [ {
					iconCls : 'btn-del',
					qtip : '删除',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-edit',
					qtip : '编辑',
					style : 'margin:0 3px 0 3px'
				} ],
				listeners : {
					scope : this,
					'action' : this.onRowAction
				}
			}) ]
		// end of columns
				});

		this.gridPanel.addListener('rowdblclick', this.rowClick);

	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function() {
		$search( {
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new PersonnelLeaveApplyForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		//new PersonnelLeaveApplyForm().show();
		var defId = FlowDefIdPro.LeaveApplydefId;
		var flowName = FlowDefIdPro.LeaveApplyFlowName;
		PersonnelLeaveApplyView.newFlow(defId,flowName);
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/personal/multiDelPersonnelLeaveApply.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/personal/multiDelPersonnelLeaveApply.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new PersonnelLeaveApplyForm( {
			id : record.data.id
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record.data.id);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		default:
			break;
		}
	}
});
PersonnelLeaveApplyView.newFlow = function(defId, name) {

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
