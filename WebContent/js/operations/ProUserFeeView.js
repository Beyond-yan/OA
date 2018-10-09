/**
 * @author:
 * @class ProUserFeeView
 * @extends Ext.Panel
 * @description [ProUserFee]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ProUserFeeView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ProUserFeeView.superclass.constructor.call(this, {
			id : 'ProUserFeeView',
			title : '宿舍费用管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel( {
			id : 'CarSearchForm',
			height : 40,
			frame : false,
			region : 'north',
			border : false,
			layout : 'hbox',
			layoutConfig : {
				padding : '5',
				align : 'middle'
			},
			defaults : {
				xtype : 'label',
				margins : {
					top : 0,
					right : 4,
					bottom : 4,
					left : 4
				}
			},
			items : [ {
				text : '员工名称'
			}, {
				name : 'Q_appUser.fullname_S_EQ',
				xtype : 'textfield'
			}, {
				text : '统计月份'
			}, {
				name : 'month',
				xtype : 'numberfield'
			}],
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

		// this.topbar = new Ext.Toolbar( {
		// items : [ {
		// iconCls : 'btn-add',
		// text : '添加[ProUserFee]',
		// xtype : 'button',
		// scope : this,
		// handler : this.createRs
		// }, {
		// iconCls : 'btn-del',
		// text : '删除[ProUserFee]',
		// xtype : 'button',
		// scope : this,
		// handler : this.removeSelRs
		// } ]
		// });

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'ProUserFeeGrid',
			url : __ctxPath + "/operations/listProUserFee.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 
			{
			name:'username',
			mapping:'appUser.username'
			}, 
			{
				name:'fullname',
				mapping:'appUser.fullname'
			}, 
			{
				name:'depName',
				mapping:'appUser.department.depName'
			}
			,'hydropowerDetailId', 'userCode', 'amount', 'type', 'startTime',
					'endTime', 'ref1', 'ref2', 'ref3', 'createDate',
					'createBy', 'updateDate', 'updateBy','waterFee','powerFee','roomFee' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '员工',
				dataIndex : 'username'
			}, 
			{
				header : '员工名称',
				dataIndex : 'fullname'
			}, 
			{
				header : '所在部门',
				dataIndex : 'depName'
			},
			{
				header : '水费',
				dataIndex : 'waterFee'
			},
			{
				header : '电费',
				dataIndex : 'powerFee'
			},
			{
				header : '房费',
				dataIndex : 'roomFee'
			},
			{
				header : '总费用',
				dataIndex : 'amount'
			},  {
				header : '统计开始时间',
				dataIndex : 'startTime'
			}, {
				header : '统计截止时间',
				dataIndex : 'endTime'
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
			new ProUserFeeForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new ProUserFeeForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/operations/multiDelProUserFee.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/operations/multiDelProUserFee.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new ProUserFeeForm( {
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
