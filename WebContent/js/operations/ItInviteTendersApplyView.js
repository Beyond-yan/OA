/**
 * @author:
 * @class ItInviteTendersApplyView
 * @extends Ext.Panel
 * @description 运营招标管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ItInviteTendersApplyView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ItInviteTendersApplyView.superclass.constructor.call(this, {
			id : 'ItInviteTendersApplyView',
			title : '运营招标管理',
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
				fieldLabel : '招标名称',
				name : 'Q_itName_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '招标类别',
				name : 'Q_itType_SN_EQ',
				flex : 1,
				xtype : 'numberfield'
			}, {
				fieldLabel : '招标经办人',
				name : 'Q_itOperator_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '招标编号',
				name : 'Q_itCode_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '项目主办人',
				name : 'Q_projectSponsor_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '创建日期',
				name : 'Q_createDate_D_EQ',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d'
			} ],
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
				text : '添加招标',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}, {
				iconCls : 'btn-del',
				text : '删除招标',
				xtype : 'button',
				scope : this,
				handler : this.removeSelRs
			} ]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'ItInviteTendersApplyGrid',
			url : __ctxPath + "/operations/listItInviteTendersApply.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'itName', 'itType', 'itAmount', 'projectNature', 'itOperator',
					'itCode', 'projectSponsor', 'cooprateWay',
					'processInstanceId', 'ref1', 'ref2', 'ref3', 'createDate',
					'createBy', 'updateDate', 'updateBy' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '招标名称',
				dataIndex : 'itName'
			}, {
				header : '招标类别',
				dataIndex : 'itType'
			}, {
				header : '招标金额',
				dataIndex : 'itAmount'
			}, {
				header : '项目性质',
				dataIndex : 'projectNature'
			}, {
				header : '招标经办人',
				dataIndex : 'itOperator'
			}, {
				header : '招标编号',
				dataIndex : 'itCode'
			}, {
				header : '项目主办人',
				dataIndex : 'projectSponsor'
			}, {
				header : '合作方案',
				dataIndex : 'cooprateWay'
			}, {
				header : '创建时间',
				dataIndex : 'createDate'
			}, {
				header : '创建人员',
				dataIndex : 'createBy'
			}, {
				header : '修改时间',
				dataIndex : 'updateDate'
			}, {
				header : '修改人员',
				dataIndex : 'updateBy'
			}, new Ext.ux.grid.RowActions( {
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
			new ItInviteTendersApplyForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new ItInviteTendersApplyForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/operations/multiDelItInviteTendersApply.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/operations/multiDelItInviteTendersApply.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new ItInviteTendersApplyForm( {
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
