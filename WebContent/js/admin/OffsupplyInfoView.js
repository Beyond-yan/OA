/**
 * @author:
 * @class OffsupplyInfoView
 * @extends Ext.Panel
 * @description [OffsupplyInfo]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
OffsupplyInfoView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		OffsupplyInfoView.superclass.constructor.call(this, {
			id : 'OffsupplyInfoView',
			title : '办公用品信息管理',
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
				fieldLabel : 'EAM系统编号',
				name : 'Q_eamSysCode_S_EQ',
				flex : 1,
				xtype : 'textfield',
				width:150
			},/* {
				fieldLabel : '类型',
				name : 'Q_type_SN_EQ',
				flex : 1,
				xtype : 'numberfield'
			}, */{
				fieldLabel : '名称',
				name : 'Q_name_S_EQ',
				flex : 1,
				xtype : 'textfield',
				width:150
			},/* {
				fieldLabel : '单位',
				name : 'Q_unit_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '单价',
				name : 'Q_price_S_EQ',
				flex : 1,
				xtype : 'textfield'
			},*//* {
				fieldLabel : '状态',
				name : 'Q_status_SN_EQ',
				flex : 1,
				xtype : 'numberfield'
			}, {
				fieldLabel : '备注',
				name : 'Q_remark_S_EQ',
				flex : 1,
				xtype : 'textfield'
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
			items : [ /*{
				iconCls : 'btn-add',
				text : '添加[OffsupplyInfo]',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}, {
				iconCls : 'btn-del',
				text : '删除[OffsupplyInfo]',
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
			id : 'OffsupplyInfoGrid',
			url : __ctxPath + "/admin/listOffsupplyInfo.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'eamSysCode', 'type', 'name', 'unit', 'price', 'status',
					'remark', 'createDate', 'createBy', 'updateDate',
					'updateBy' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : 'EAM系统编号',
				dataIndex : 'eamSysCode'
			}, {
				header : '类型',
				dataIndex : 'type'
			}, {
				header : '名称',
				dataIndex : 'name'
			}, {
				header : '单位',
				dataIndex : 'unit'
			}, {
				header : '单价',
				dataIndex : 'price'
			}, {
				header : '状态',
				dataIndex : 'status',
				renderer:function(val,metadata, record){
					var status = record.data.status;
					if(status == '0'){
						return '禁止申请';
					}else if(status == '1'){
						return '可申请';
					}
				}
			}, {
				header : '备注',
				dataIndex : 'remark'
			}, /*{
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
			new OffsupplyInfoForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new OffsupplyInfoForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/admin/multiDelOffsupplyInfo.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/admin/multiDelOffsupplyInfo.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new OffsupplyInfoForm( {
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
