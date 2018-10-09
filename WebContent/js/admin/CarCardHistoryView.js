/**
 * @author:
 * @class CarCardHistoryView
 * @extends Ext.Panel
 * @description [CarCardHistory]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
CarCardHistoryView = Ext.extend(Ext.Panel,
{
	// 构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		CarCardHistoryView.superclass.constructor.call(this,
		{
			id : 'CarCardHistoryView',
			title : '油卡/粤通卡使用记录',
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
				text : '卡类型'
			},
			{
				width:200,
				hiddenName : 'type',
				anchor : '95%',
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				editable:false,
				value:1,
				store : [ [ '1', '油卡' ], [ '2', '粤通卡' ] ]
			},
			{
				text : '卡号'
			},
			{
				width:200,
				name : 'code',
				flex : 1,
				xtype : 'textfield'
			},
			{
				text : '使用类型'
			},
			{
				width:200,
				hiddenName : 'usetype',
				anchor : '95%',
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				value:0,
				editable:false,
				store : [[ '0', '全部' ], [ '1', '充值' ], [ '2', '消费' ] ]
			}
			,
			{
				xtype:'button',
				text : '查询',
				scope : this,
				iconCls : 'btn-search',
				handler : this.search
			},
			{
				xtype:'button',
				text : '重置',
				scope : this,
				iconCls : 'btn-reset',
				handler : this.reset
			} 
			
			]

		});// end of searchPanel

		this.gridPanel = new HT.GridPanel(
		{
			region : 'center',
			noSel:true,
			// 使用RowActions
			id : 'CarCardHistoryGrid',
			url : __ctxPath + "/admin/findCarCardHistory.do",
			//url : __ctxPath + "/admin/listCarCardHistory.do",
			fields : [
			{
				name : 'id',
				type : 'int'
			}, 'SN', 'AMOUNT', 'CARD_TYPE', 'USE_DATE', 'USE_TYPE',
					'DESCRIPTION' ],
			columns : [
					{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					},
					{
						header : '卡类型',
						dataIndex : 'CARD_TYPE',
						renderer : function(value)
						{
							return String(value).replace('1', '油卡').replace(
									'2', '粤通卡');
						}
					},

					{
						header : '卡号',
						dataIndex : 'SN'
					},
					{
						header : '使用类型',
						dataIndex : 'USE_TYPE',
						renderer : function(value)
						{
							return String(value).replace('1', '充值').replace(
									'2', '消费');
						}
					},

					{
						header : '金额',
						dataIndex : 'AMOUNT',
						align :'right'
					},
					{
						header : '使用日期',
						dataIndex : 'USE_DATE',
						align:'center'
					},
					{
						header : '描述',
						dataIndex : 'DESCRIPTION'
					}
					
					]
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
			new CarCardHistoryForm(
			{
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function()
	{
		new CarCardHistoryForm().show();
	},
	// 按ID删除记录
	removeRs : function(id)
	{
		$postDel(
		{
			url : __ctxPath + '/admin/multiDelCarCardHistory.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function()
	{
		$delGridRs(
		{
			url : __ctxPath + '/admin/multiDelCarCardHistory.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record)
	{
		new CarCardHistoryForm(
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
