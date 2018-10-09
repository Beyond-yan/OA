/**
 * @author:
 * @class ProRoomEquipmentView
 * @extends Ext.Panel
 * @description [ProRoomEquipment]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ProRoomEquipmentView = Ext.extend(Ext.Window,
{
	// 构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ProRoomEquipmentView.superclass.constructor.call(this,
		{
			id : 'ProRoomEquipmentView',
			title : '房间设备管理',
			region : 'center',
			layout : 'fit',
			height : 400,
			width : 600,
			items : [this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function()
	{	
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
			//使用RowActions
			rowActions : true,
			id : 'ProRoomEquipmentGrid',
			url: __ctxPath + "/operations/getEquProDormRoom.do?id="+this.roomid,
			fields : [
			{
				name : 'id',
				type : 'int'
			}, 'roomId', 'name', 'description', 'quantiry', 'type', 'isDelete',
					'ref1', 'ref2', 'ref3', 'createDate', 'createBy',
					'updateDate', 'updateBy' ],
			columns : [
			{
				header : 'id',
				dataIndex : 'id',
				hidden : true
			},
			{
				header : '名称',
				dataIndex : 'name'
			},
			{
				header : '描述',
				dataIndex : 'description'
			},
			{
				header : '数量',
				dataIndex : 'quantiry'
			},
			{
				header : '类型',
				dataIndex : 'type',
				renderer : function(value) 
				{
				  return  String(value).replace('1','家电').replace('2','家具');		
				}				
			}
			, new Ext.ux.grid.RowActions(
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
		//end of columns
				});

		this.gridPanel.addListener('rowdblclick', this.rowClick);

	},// end of the initComponents()

	//GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e)
	{
		grid.getSelectionModel().each(function(rec)
		{
			new ProRoomEquipmentForm(
			{
				id : rec.data.id
			}).show();
		});
	},
	//创建记录
	createRs : function()
	{
		//new ProRoomEquipmentForm().show();
		

			new ProRoomEquipmentForm(
			{
				roomid : this.roomid
			}).show();

		

	},
	//按ID删除记录
	removeRs : function(id)
	{
		$postDel(
		{
			url : __ctxPath + '/operations/multiDelProRoomEquipment.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	//把选中ID删除
	removeSelRs : function()
	{
		$delGridRs(
		{
			url : __ctxPath + '/operations/multiDelProRoomEquipment.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	//编辑Rs
	editRs : function(record)
	{
		new ProRoomEquipmentForm(
		{
			id : record.data.id
		}).show();
	},
	//行的Action
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
