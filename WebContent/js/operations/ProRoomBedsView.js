/**
 * @author:
 * @class ProRoomBedsView
 * @extends Ext.Panel
 * @description [ProRoomBeds]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ProRoomBedsView = Ext.extend(Ext.Window, 
{
	// 构造函数
	constructor : function(_cfg) 
	{
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ProRoomBedsView.superclass.constructor.call(this, {
					id : 'ProRoomBedsView',
					title : '床位管理',
					region : 'center',
					height : 400,
					width : 600,
					layout : 'fit',
					items : [this.gridPanel]
				});
	},// end of constructor
		
	// 初始化组件
	initUIComponents : function() 
	{	
		this.topbar = new Ext.Toolbar
		({
			items : [{
						iconCls : 'btn-add',
						text : '添加',
						xtype : 'button',
						scope : this,
						handler : this.createRs
					}, {
						iconCls : 'btn-del',
						text : '删除',
						xtype : 'button',
						scope : this,
						handler : this.removeSelRs
					}]
		});

		this.gridPanel = new HT.GridPanel({
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'ProRoomBedsGrid',
			url : __ctxPath + "/operations/getBedsProDormRoom.do?id=" + this.roomid,
			fields : [{
						name : 'id',
						type : 'int'
					}, 'roomId', 'bedCode', 'description', 'isFree',
					'createDate', 'createBy', 'updateDate', 'updateBy'],
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, 
//					{
//						header : 'roomId',
//						dataIndex : 'roomId'
//					}, 
					{
						header : '床位编号',
						dataIndex : 'bedCode'
					}, {
						header : '状态',
						dataIndex : 'isFree',
						renderer : function(value)
						 {
									return String(value).replace('1', '可用').replace('0', '不可用');
						 }
					}, 
					{
						header : '所住人员',
						dataIndex : 'updateBy' // 临时使用
					},
						
					{
						header : '描述',
						dataIndex : 'description'
					},
					new Ext.ux.grid.RowActions({
										header : '管理',
										width : 100,
										actions : [{
													iconCls : 'btn-del',
													qtip : '删除',
													style : 'margin:0 3px 0 3px'
												}, {
													iconCls : 'btn-edit',
													qtip : '编辑',
													style : 'margin:0 3px 0 3px'
												},
												{
													iconCls : 'btn-apply',
													qtip : '缴费记录',
													style : 'margin:0 3px 0 3px'													
												}
												],
										listeners : {
											scope : this,
											'action' : this.onRowAction
										}
									})
									]
				// end of columns
		});

	 this.gridPanel.addListener('rowdblclick', this.rowClick);

   },// end of the initComponents()

			// GridPanel行点击处理事件
			rowClick : function(grid, rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
							new ProRoomBedsForm({
										id : rec.data.id
									}).show();
						});
			},
			// 创建记录
			createRs : function() 
			{
				new ProRoomBedsForm(
				{
					roomid : this.roomid
				}).show();
			
			},
			// 按ID删除记录
			removeRs : function(id) 
			{
				Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
					if (btn == 'yes') {
						Ext.Ajax.request({
									url :__ctxPath + '/operations/multiDelProRoomBeds.do',
									params : {
										ids : id
									},
									method : 'POST',
									success : function(response, options) {
										var obj = Ext
												.decode(response.responseText);
										if (obj.success == true) {
											Ext.ux.Toast.msg('操作信息', '成功删除该记录！');

											Ext.getCmp('ProRoomBedsGrid').getStore().reload();
										} 
										else 
										{
											Ext.ux.Toast.msg('操作信息', obj.msg);
										}

									},
									failure : function(response, options) {
										Ext.ux.Toast
												.msg('操作信息', '操作出错，请联系管理员！');
									}
								});
					}
				});
				
				
//				$postDel({
//							url : __ctxPath + '/operations/multiDelProRoomBeds.do',
//							ids : id,
//							grid : this.gridPanel
//						});
			},
			// 把选中ID删除
			removeSelRs : function() {
				$delGridRs({
							url : __ctxPath
									+ '/operations/multiDelProRoomBeds.do',
							grid : this.gridPanel,
							idName : 'id',
							callback:function(response,options)
							{
								alert(response.result.msg);
							}
						});
			},
			// 编辑Rs
			editRs : function(record) {
				new ProRoomBedsForm({
							id : record.data.id
						}).show();
			},
			
			viewFeeHis:function(record)
			{
				var uid = record.data.createBy;

				if(uid==null||uid=='undefined'||uid=='')
				{
					Ext.ux.Toast.msg('操作信息','没有住宿人员！');
				}
				else
				{
						new RoomUserFeeHistory(
						{
							userid : uid,
							roomid:  this.roomid
						}
						).show();
				}
	
			},
			// 行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.removeRs.call(this, record.data.id);
						break;
					case 'btn-edit' :
						this.editRs.call(this, record);
						break;
				case 'btn-apply':
				this.viewFeeHis.call(this, record);
				break;	
					default :
						break;
				}
			}
		});
