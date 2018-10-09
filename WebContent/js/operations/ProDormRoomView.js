/**
 * @author:
 * @class ProDormRoomView
 * @extends Ext.Panel
 * @description [ProDormRoom]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ProDormRoomView = Ext.extend(Ext.Panel,
{
	// 构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ProDormRoomView.superclass.constructor.call(this,
		{
			id : 'ProDormRoomView',
			title : '房间管理',
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
				text : '宿舍'
			},
			{
				hiddenName : 'Q_proDormitory.id_L_EQ',
				xtype : 'combo',
				editable : false,
				triggerAction : 'all',
				displayField : 'name',
				valueField : 'id',
				mode : 'local',
				store : new Ext.data.SimpleStore({
							autoLoad : true,
							url : __ctxPath + "/operations/comboProDormitory.do",
							fields : ['id', 'name']
						})
			},		
			{
				text : '房间编号'
			},
			{
				name : 'Q_code_S_LK',
				flex : 1,
				xtype : 'textfield'
			},
			{
				text : '容纳人数'
			},
			{
				name : 'Q_capacity_SN_EQ',
				flex : 1,
				xtype : 'numberfield'
			},
			{
				text : '剩余床位'
			},
			{
				fieldLabel : '剩余床位',
				name : 'Q_remaining_SN_EQ',
				flex : 1,
				xtype : 'numberfield'
			},
			{
				text : '查询',
				xtype : 'button',
				scope : this,
				iconCls : 'btn-search',
				handler : this.search
			},
			{
				text : '重置',
				scope : this,
				xtype : 'button',
				iconCls : 'btn-reset',
				handler : this.reset
			}]

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
			}
//			,
//			{
//				iconCls : 'btn-del',
//				text : '删除',
//				xtype : 'button',
//				scope : this,
//				handler : this.removeSelRs
//			} 
			]
		});

		this.gridPanel = new HT.GridPanel(
		{
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			noSel:true,
			id : 'ProDormRoomGrid',
			url : __ctxPath + "/operations/listProDormRoom.do",
			fields : [
			{
				name:'dormitory',
				mapping:'proDormitory.name'
			}
			, 'id','dormitoryId', 'code', 'description', 'capacity', 'chargeUser',
					'remaining', 'building', 'proDormitory','ref1', 'ref2', 'ref3',
					'createDate', 'createBy', 'updateDate', 'updateBy' ],
			columns : [
			{
				header : 'id',
				dataIndex : 'id',
				hidden : true
			},
			{
				header : '宿舍',
				dataIndex : 'dormitory'
			},
			{
				header : '栋别',
				dataIndex : 'building'
			},
			{
				header : '编号',
				dataIndex : 'code'
			},

			{
				header : '容纳人数',
				dataIndex : 'capacity'
			},
			{
				header : '剩余床位',
				dataIndex : 'remaining'
			},
			{
				header : '描述',
				dataIndex : 'description'
			},   new Ext.ux.grid.RowActions(
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
				},				
				{
					iconCls : 'btn-task',
					qtip : '床位',
					style : 'margin:0 3px 0 3px'
				},
				
				{
					iconCls : 'btn-shared',
					qtip : '设备',
					style : 'margin:0 3px 0 3px'
				} ,
				{
					iconCls : 'btn-signOff',
					qtip : '入住历史记录',
					style : 'margin:0 3px 0 3px'
				}				
				
				],
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
			new ProDormRoomForm(
			{
				id : rec.data.id
			}).show();
		});
	},
	

	// 创建记录
	createRs : function()
	{
		new ProDormRoomForm().show();
	},
	// 按ID删除记录
	removeRs : function(id)
	{
		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) 
		{
		  if (btn == 'yes') 
		  {
			Ext.Ajax.request
			({
					url :__ctxPath + '/operations/multiDelProDormRoom.do',
					params : {ids : id},method : 'POST',
					success : function(response,options) 
					{
						var obj = Ext.decode(response.responseText);
						if(obj.success==true)
						{
							Ext.ux.Toast.msg('操作信息','成功删除该记录！');
							Ext.getCmp('ProDormRoomGrid').getStore().reload();
						}
						else
						{
							Ext.ux.Toast.msg('操作信息',obj.msg);
						}

				
					},
					failure : function(response,options) {
						Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
					}
			});
		    }
		});
	},
		
//		$postDel(
//		{
//			url : __ctxPath + '/operations/multiDelProDormRoom.do',
//			ids : id,
//			grid : this.gridPanel,
//			callback :function(options, success, response)
//			{
//					alert(response);
//			}
//		});

	// 把选中ID删除
	removeSelRs : function()
	{
		$delGridRs(
		{
			url : __ctxPath + '/operations/multiDelProDormRoom.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record)
	{
		new ProDormRoomForm(
		{
			id : record.data.id
		}).show();
	},
	
	editEqu:function(record)
	{
		new ProRoomEquipmentView(
				{
					roomid : record.data.id
				}).show();
	},
	
	editBed:function(record)
	{
		new ProRoomBedsView(
				{
					roomid : record.data.id
				}).show();
	},

	viewHis:function(record)
	{
		new RoomUserHistory(
				{
					roomid : record.data.id
				}).show();
	}
	,
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
			case 'btn-shared':
				this.editEqu.call(this, record);
				break;
			case 'btn-task':
				this.editBed.call(this, record);
				break;
			case 'btn-signOff':
				this.viewHis.call(this, record);
				break;
				
				
			default:
				break;
		}
	}
});
