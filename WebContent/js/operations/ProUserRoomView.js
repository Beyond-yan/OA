/**
 * @author:
 * @class ProUserRoomView
 * @extends Ext.Panel
 * @description 宿舍员工管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ProUserRoomView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ProUserRoomView.superclass.constructor.call(this, {
			id : 'ProUserRoomView',
			title : '宿舍员工管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		
		
		this.searchPanel = new Ext.FormPanel({

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
			items : [
					{
						text : '员工姓名'
					},
					{
						xtype : 'textfield',
						name : 'Q_appUser.fullname_S_LK'
					},
					{
						text : '房间号'
					},
					{
						xtype : 'textfield',
						name : 'Q_proDormRoom.code_S_EQ'
					},					
					{
						text : '入住时间'
					},
					{
                        name : 'Q_checkInTime_D_GE',
						xtype : 'datefield',
						format : 'Y-m-d'
					},					
					{
						text : '退宿时间'
					},
					{
						name : 'Q_checkOutTime_D_LE',
						xtype : 'datefield',
						format : 'Y-m-d'
					},
					{
						text : '是否退宿'
					},
					{
						hiddenName : 'Q_isCheckOut_SN_EQ',
						xtype : 'combo',	
						mode : 'local',
						editable : true,
						triggerAction : 'all',
						store : [ [ '1', '未退宿' ], [ '2', '已退宿' ] ]
					},
					{
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler :function() {
							var searchPanel = Ext
									.getCmp('CarSearchForm');
							var gridPanel = Ext
									.getCmp('ProUserRoomGrid');
							if (searchPanel.getForm()
									.isValid()) {
								$search( {
									searchPanel : searchPanel,
									gridPanel : gridPanel
								});
							}
						}
					} ]		
		});
		
		
		
		// 初始化搜索条件Panel
//		this.searchPanel = new HT.SearchPanel( {});// end of searchPanel

		this.topbar = new Ext.Toolbar( {
			items : [ {
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
			} ]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'ProUserRoomGrid',
			url : __ctxPath + "/operations/listProUserRoom.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, {
				name : 'code',
				mapping : 'proDormRoom.code'
			}, {
				name : 'fullname',
				mapping : 'appUser.fullname'
			},
			{
				name : 'username',
				mapping : 'appUser.username'
			},
			{
				name : 'depName',
				mapping : 'appUser.department.depName'
			},{
				name : 'building',
				mapping : 'proDormRoom.building'
			},
			{
				name : 'dorName',
				mapping : 'proDormRoom.proDormitory.name'
			},
			{
				name : 'bedCode',
				mapping : 'proRoomBeds.bedCode'
			},
			'applyId', 'userCode', 'roomId', 'checkInTime', 'checkOutTime',
					'isCheckOut', 'ref1', 'ref2', 'ref3', 'createDate',
					'createBy', 'updateDate', 'updateBy' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '员工姓名',
				dataIndex : 'fullname'
			},
			{
				header : '用户名',
				dataIndex : 'username'
			},
			 {
				header : '所在部门',
				dataIndex : 'depName'
			}, 
			{
				header : '宿舍区',
				dataIndex : 'dorName'
			}, {
				header : '栋别',
				dataIndex : 'building'
			}, {
				header : '房间号',
				dataIndex : 'code'
			},  {
				header : '床铺号',
				dataIndex : 'bedCode'
			},{
				header : '入住时间',
				dataIndex : 'checkInTime'
			}, {
				header : '退宿时间',
				dataIndex : 'checkOutTime'
			}, {
				header : '是否退宿',
				dataIndex : 'isCheckOut',
				renderer : function(value) {
					if (value == '1') {
						return '<font color="blue">未退宿</font>';
					}
					if (value == '2') {
						return '<font color="red">已退宿</font>';
					}

				}
			}, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 100,
				actions : [ {
					iconCls : 'btn-del',
					qtip : '删除',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-edit',
					qtip : '退宿',
					style : 'margin:0 3px 0 3px'
				},{
					iconCls : 'btn-flowView',
					qtip : '换宿',
					style : 'margin:0 3px 0 3px'
				} ],
				listeners : {
					scope : this,
					'action' : this.onRowAction
				}
			}) ]
		// end of columns
				});

//		this.gridPanel.addListener('rowdblclick', this.rowClick);

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
			new ProUserRoomForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new ProUserRoomForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/operations/multiDelProUserRoom.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/operations/multiDelProUserRoom.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new ProUserRoomForm( {
			id : record.data.id
		}).show();
	},
	// 换宿舍Rs
	changeRoomRs : function(record) {
		new ProUserRoomOutForm( {
			id : record.data.id
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			if(record.data.isCheckOut=='1'){
				Ext.MessageBox.show( {
					title : '操作信息',
					msg : '未退宿的信息暂时不能删除！',
					buttons : Ext.MessageBox.OK,
					icon : 'ext-mb-error'
				});
				break;
			}
			this.removeRs.call(this, record.data.id);
			break;
		case 'btn-edit':
			if(record.data.isCheckOut=='2'){
				Ext.MessageBox.show( {
					title : '操作信息',
					msg : '已退宿的信息不能操作！',
					buttons : Ext.MessageBox.OK,
					icon : 'ext-mb-error'
				});
				break;
			}
			this.editRs.call(this, record);
			break;
		case 'btn-flowView':
			if(record.data.isCheckOut=='2'){
				Ext.MessageBox.show( {
					title : '操作信息',
					msg : '该员工已经退宿,不能执行换宿操作！',
					buttons : Ext.MessageBox.OK,
					icon : 'ext-mb-error'
				});
				break;
			}
			this.changeRoomRs.call(this, record);
			break;
		default:
			break;
		}
	}
});
