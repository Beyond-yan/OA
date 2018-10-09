/**
 * @author:
 * @class OffsupplyApplyDeptView
 * @extends Ext.Panel
 * @description [OffsupplyApplyDept]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
OffsupplyApplyDeptView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		OffsupplyApplyDeptView.superclass.constructor.call(this, {
			id : 'OffsupplyApplyDeptView',
			title : '办公用品申请管理',
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
			items : [/* {
				fieldLabel : 'deptId',
				name : 'Q_deptId_L_EQ',
				flex : 1,
				xtype : 'numberfield'
			},*/ {
				fieldLabel : '申请月份',
				name : 'Q_applyTime_S_EQ',
				flex : 1,
				xtype : 'textfield',
				width:150
			}, {
				fieldLabel : '申请部门',
				name : 'Q_department.depName_S_EQ',
				flex : 1,
				xtype : 'numberfield',
				width:150
			}/*, {
				fieldLabel : '费用总额',
				name : 'Q_feeAmount_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '备注',
				name : 'Q_remark_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
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
			}, {
				fieldLabel : 'applyState',
				name : 'Q_applyState_SN_EQ',
				flex : 1,
				xtype : 'numberfield'
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
			items : [ /*{
				iconCls : 'btn-add',
				text : '添加[OffsupplyApplyDept]',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}, {
				iconCls : 'btn-del',
				text : '删除[OffsupplyApplyDept]',
				xtype : 'button',
				scope : this,
				handler : this.removeSelRs
			}*/ ]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'OffsupplyApplyDeptGrid',
			url : __ctxPath + "/admin/listOffsupplyApplyDept.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'deptId', 'applyTime', 'feeAmount', 'remark', 'isDeleted',
					'processInsId', 'createDate', 'createBy', 'updateDate',
					'updateBy', 'applyState',{name:'depName',mapping:'department.depName'} ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : 'deptId',
				dataIndex : 'deptId',
				hidden : true
			}, {
				header : '申请月份',
				dataIndex : 'applyTime'
			},  {
				header : '申请部门',
				dataIndex : 'depName'
			},{
				header : '费用总额',
				dataIndex : 'feeAmount'
			}, {
				header : '备注',
				dataIndex : 'remark'
			},/*, {
				header : 'isDeleted',
				dataIndex : 'isDeleted'
			}, {
				header : 'processInsId',
				dataIndex : 'processInsId'
			},*/ {
				header : '统计日期',
				dataIndex : 'createDate'
			}, {
				header : '统计人',
				dataIndex : 'createBy'
			}, {
				header : 'updateDate',
				dataIndex : 'updateDate'
			}, {
				header : 'updateBy',
				dataIndex : 'updateBy'
			}, {
				header : '审批状态',
				dataIndex : 'applyState'
			}, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 100,
				actions : [ /*{
					iconCls : 'btn-del',
					qtip : '删除',
					style : 'margin:0 3px 0 3px'
				}, */{
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
			new OffsupplyApplyDeptForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new OffsupplyApplyDeptForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/admin/multiDelOffsupplyApplyDept.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/admin/multiDelOffsupplyApplyDept.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new OffsupplyApplyDeptForm( {
			id : record.data.id,
			deptId:record.data.deptId
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
