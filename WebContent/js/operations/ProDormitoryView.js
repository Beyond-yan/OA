/**
 * @author:
 * @class ProDormitoryView
 * @extends Ext.Panel
 * @description [ProDormitory]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ProDormitoryView = Ext.extend(Ext.Panel,
{
	// 构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ProDormitoryView.superclass.constructor.call(this,
		{
			id : 'ProDormitoryView',
			title : '宿舍管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function()
	{
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel(
		{

			height : 40,
			frame : false,
			region : 'north',
			border : false,
			layout : 'hbox',
			layoutConfig :
			{
				padding : '5',
				align : 'middle'
			},
			defaults :
			{
				xtype : 'label',
				margins :
				{
					top : 0,
					right : 4,
					bottom : 4,
					left : 4
				}
			},

			items : [
			{
				text : '编号'
			},
			{
				name : 'Q_code_S_LK',
				flex : 1,
				xtype : 'textfield'
			},
			{
				text : '名称'
			},
			{
				name : 'Q_name_S_LK',
				flex : 1,
				xtype : 'textfield'
			},
			{
				text : '描述'
			},
			{
				name : 'Q_description_S_LK',
				flex : 1,
				xtype : 'textfield'
			},
			{
				xtype : 'button',
				text : '查询',
				scope : this,
				iconCls : 'btn-search',
				handler : this.search
			},
			{
				xtype : 'button',
				text : '重置',
				scope : this,
				iconCls : 'btn-reset',
				handler : this.reset
			}
			]
		});// end of searchPanel

		this.topbar = new Ext.Toolbar(
		{
			items : [
			{
				iconCls : 'btn-add',
				text : '添加',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			},
			{
				iconCls : 'btn-del',
				text : '删除',
				xtype : 'button',
				scope : this,
				handler : this.removeSelRs
			} ]
		});
		this.gridPanel = new HT.GridPanel(
		{
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'ProDormitoryGrid',
			url : __ctxPath + "/operations/listProDormitory.do",
			fields : [
			{
				name : 'id',
				type : 'int'
			}, 'code', 'name', 'description', 'ref1', 'ref2', 'ref3',
					'createDate', 'createBy', 'updateDate', 'updateBy' ],
			columns : [
			{
				header : 'id',
				dataIndex : 'id',
				hidden : true
			},
			{
				header : '编号',
				dataIndex : 'code'
			},
			{
				header : '名称',
				dataIndex : 'name'
			},
			{
				header : '描述',
				dataIndex : 'description'
			}, new Ext.ux.grid.RowActions(
			{
				header : '管理',
				width : 100,
				actions : [
				{
					iconCls : 'btn-del',
					qtip : '删除',
					style : 'margin:0 3px 0 3px'
				},
				{
					iconCls : 'btn-edit',
					qtip : '编辑',
					style : 'margin:0 3px 0 3px'
				} ],
				listeners :
				{
					scope : this,
					'action' : this.onRowAction
				}
			}) ]
		// end of columns
				});

		this.gridPanel.addListener('rowdblclick', this.rowClick);

	},// end of the initComponents()
	// 重置查询表单
	reset : function()
	{
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function()
	{
		$search(
		{
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e)
	{
		grid.getSelectionModel().each(function(rec)
		{
			new ProDormitoryForm(
			{
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function()
	{
		new ProDormitoryForm().show();
	},
	// 按ID删除记录
	removeRs : function(id)
	{
		$postDel(
		{
			url : __ctxPath + '/operations/multiDelProDormitory.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function()
	{
		$delGridRs(
		{
			url : __ctxPath + '/operations/multiDelProDormitory.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record)
	{
		new ProDormitoryForm(
		{
			id : record.data.id
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col)
	{
		switch (action)
		{
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
