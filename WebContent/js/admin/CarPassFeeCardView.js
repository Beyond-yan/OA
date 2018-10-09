CarPassFeeCardView = Ext.extend(Ext.Panel,
{
	// 构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		CarPassFeeCardView.superclass.constructor.call(this,
		{
			id : 'CarPassFeeCardView',
			title : '粵通卡管理',
			region : 'center',
			layout : 'fit',
			autoScroll : true,
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
				text : '类型'
			},
			{
				hiddenName : 'Q_type_SN_EQ',
				anchor : '95%',
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				editable:false,
				store : [ [ '1', '记账卡' ], [ '2', '储值卡' ]]

			},
			{
				text : '种类'
			},
			{
				hiddenName : 'Q_category_SN_EQ',
				anchor : '95%',
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				editable:false,
				store : [ [ '1', '粤通卡' ], [ '2', '闽通卡' ]]
			},
			{
				text : '卡号'
			},
			{
				name : 'Q_sn_S_LK',
				xtype : 'textfield'
			},
			{
				text : '状态'
			},
			{
				hiddenName : 'Q_status_SN_EQ',
				anchor : '95%',
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				editable:false,
				store : [ [ '1', '可用' ], [ '0', '不可用' ], [ '2', '已绑定' ] ]
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
			} ]
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
			noSel:true,
			rowActions : true,
			sm: false,
			id : 'CarPassFeeCardGrid',
			url : __ctxPath + "/admin/listCarPassFeeCard.do",
			fields : [
			{
				name : 'id',
				type : 'int'
			}, 'type', 'category', 'code', 'sn', 'remains', 'buyDate',
					'validSDate', 'validEDate', 'remark', 'status',
					'createDate', 'createBy', 'updateDate', 'updateBy' ],
			columns : [
			{
				header : 'id',
				dataIndex : 'id',
				hidden : true
			},
			{
				header : '类型',
				dataIndex : 'type',
				renderer : function(value) 
				{
					return String(value).replace('1', '记账卡').replace(	'2', '储值卡');
				}
			},
			{
				header : '种类',
				dataIndex : 'category',
				renderer : function(value) 
				{
					return String(value).replace('1', '粤通卡').replace(	'2', '闽通卡').replace('3', '其他');
				}
			},
			{
				header : '行政编号',
				dataIndex : 'code'
			},
			{
				header : '卡号',
				dataIndex : 'sn'
			},
			{
				header : '余额',
				dataIndex : 'remains',
				align:'right'
					
			},
		   {
				header : '有效期',
				dataIndex : 'validEDate',
				format : "Y-m-d"
			},
			{
				header : '备注',
				dataIndex : 'remark'
			},
			{
				header : '状态',
				dataIndex : 'status',
				renderer : function(value) 
				{
					return String(value).replace('0', '不可用').replace(	'1', '可用').replace('2', '已绑定');
				}
			}, 
			
			{
				header : '费用管理',
				dataIndex : 'id',
				width : 50,
				renderer : function(value, metadata, record, rowIndex,colIndex) 
				{
					var str = '';
					
					var now = new Date();
					
					if(now.format('Y-m-d')>record.data.validEDate)
					return '卡已过期';
					
					
					if (record.data.status != "0") 
					{
						str += '<button type="button" class="btn-up" onclick="CarPassFeeCardView.plusMoney()"></button>';
					}
					return str;
				
				}
			},
			{
					header : '删除',
					dataIndex : 'id',
					width : 50,
					renderer : function(val, p, record)
					{
						var sts = record.data.status
						var did = record.data.id;			
						var str='';
						if(sts!=2)
						{
						str += '<button title="删除" value=" " class="btn-del" onclick="CarPassFeeCardView.DelRec(' + did + ')">&nbsp</button>';
						}
						return str;
					}
			  }	
				,
			new Ext.ux.grid.RowActions(
			{
				header : '管理',
				width : 100,
				actions : [
//				{
//					iconCls : 'btn-del',
//					qtip : '删除',
//					style : 'margin:0 3px 0 3px'
//				},
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
			new CarPassFeeCardForm(
			{
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function()
	{
		new CarPassFeeCardForm().show();
	},
	// 按ID删除记录
	removeRs : function(id)
	{
		$postDel(
		{
			url : __ctxPath + '/admin/multiDelCarPassFeeCard.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function()
	{
		$delGridRs(
		{
			url : __ctxPath + '/admin/multiDelCarPassFeeCard.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record)
	{
		new CarPassFeeCardForm(
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

CarPassFeeCardView.DelRec = function(id)
{
	var gp = Ext.getCmp('CarPassFeeCardGrid');
	$postDel({
			url : __ctxPath + '/admin/multiDelCarPassFeeCard.do',
			ids : id,
			grid : gp
		}); 
};


CarPassFeeCardView.plusMoney=function(cardid)
{
	var rec = Ext.getCmp('CarPassFeeCardGrid').getSelectionModel().getSelected();	
	
	new Ext.Window
	({
		id:'winCarPassFeeCardViewPlusMoney',
		title:'充值',
		width : 300,
		height : 160,
		items: new Ext.FormPanel
		({
			id : 'feeAddMoneyFormPanel',
			width : 280,
			height : 130,
			url:__ctxPath + '/admin/plusMoneyCarPassFeeCard.do',
			bodyStyle : 'padding : 5px;',

			items : [{
								name : 'carPassFeeCard.id',
								xtype : 'hidden',
								value : rec.data.id
							}, {
								fieldLabel : '类型',
								xtype : 'textfield',
								disabled : true,
								value : '充值'
							}, {
								fieldLabel : '卡号',
								xtype : 'textfield',
								disabled : true,
								value : rec.data.sn
							}, {
								fieldLabel : '金额',
								name : 'carPassFeeCard.remains',
								xtype : 'numberfield',
								allowBlank : false
							}],
			buttonAlign:'center',
			buttons:
				[
					{
						text : '保存',
						iconCls : 'btn-save',
						handler : function()
						{
							var fp = Ext.getCmp('feeAddMoneyFormPanel');
							if (fp.getForm().isValid())
							{
								fp.getForm().submit(
								{
									method : 'post',
									waitMsg : '正在提交数据...',
									success : function(fp, action)
									{
										Ext.ux.Toast.msg('操作信息', '成功保存信息！');						
										Ext.getCmp('winCarPassFeeCardViewPlusMoney').close();									
										Ext.getCmp('CarPassFeeCardGrid').getStore().reload();							
									},
									failure : function(fp, action)
									{
										Ext.MessageBox.show(
										{
											title : '操作信息',
											msg : '信息保存出错，请联系管理员！',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});
										Ext.getCmp('winCarPassFeeCardViewPlusMoney').close();
									}
								});
							}
						}
					},
					{
						text : '取消',
						iconCls : 'btn-cancel',
						handler : function()
						{
							Ext.getCmp('winCarPassFeeCardViewPlusMoney').close();
						}
					} 				
				]//end of the buttons
		})			
	}).show();
};	

	