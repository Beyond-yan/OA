Ext.ns('OutPersonView');
OutPersonView = Ext.extend(Ext.Panel, {
	// 条件搜索Panel
	searchPanel : null,
	// 数据展示Panel
	gridPanel : null,
	// GridPanel的数据Store
	store : null,
	// 头部工具栏
	topbar : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		OutPersonView.superclass.constructor.call(this, {
					id : 'OutPersonView',
					title : '外出查询',
					iconCls : 'menu-holiday',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},

	// 初始化组件
	initUIComponents : function() {

		// 查询Panel
		this.searchPanel = new HT.SearchPanel({
			id : 'OutPersonSearchForm',
			layout : 'form',
			region : 'north',
			colNums : 5,
			items : [{
						fieldLabel : '外出人员姓名',
						name : 'Q_appUser.fullname_S_LK',
						flex : 1,
						xtype : 'textfield'
					}, {
						fieldLabel : '部门:',
						name : 'Q_depName_S_LK',
						flex : 1,
						xtype : 'combo',
						editable : true,
						allowBlank : true,
						triggerAction : 'all',
						displayField : 'fullname',
						valueField : 'userId',
						mode : 'local',
						store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/system/comboDep3AllDepartment.do',
									fields : ['userId', 'fullname']
								})
					}, {
						fieldLabel : '外出日期从',
						name : 'startDate',
						flex : 1,
						xtype : 'datefield',
						value : new Date(),
						format : 'Y-m-d'
					}, {
						fieldLabel : '至',
						flex : 1,
						name : 'enddate',
						xtype : 'datefield',
						value : new Date(),
						format : 'Y-m-d'
					}, {
						fieldLabel : '状态',
						xtype : 'combo',
						hiddenName : 'Q_deleted_S_EQ',
						id : 'deleted',
						mode : 'local',
						flex : 1,
						editable : false,
						triggerAction : 'all',
						value : '',
						store : [['', '全部'], ['2', '出差中'], ['0', '已返回'],
								['1', '未开始']]
					}],

			buttons : [{
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext.getCmp('OutPersonSearchForm');
							var gridPanel = Ext.getCmp('OutPersonGrid');
							if (searchPanel.getForm().isValid()) {
								$search({
											searchPanel : searchPanel,
											gridPanel : gridPanel

										});
							}

						}
					}, {
						xtype : 'button',
						text : '重置',
						iconCls : 'btn-reseted',
						handler : function() {
							var searchPanel = Ext.getCmp('OutPersonSearchForm');
							searchPanel.getForm().reset();
							Ext.getCmp('deleted').setValue('');
						}
					}]
		});// end of the searchPanel

		// 数据源
		var store = new Ext.data.JsonStore({
					url : __ctxPath + '/Out/listOut.do',
					root : 'result',
					totalProperty : 'totalCounts',
					fields : ['id', 'appUser.userId', 'appUser.fullname',
							'appUser.department.depName', 'outReson',
							'startDate', 'endDate', 'workConsign', 'deleted',
							'createUser', 'updateUser', 'updateDate']
				});
		store.setDefaultSort('startDate', 'desc');
		store.load({
					params : {
						start : 0,
						limit : 25
					}
				});
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						dataIndex : 'Id',
						hidden : true
					}, {
						header : '外出人员名称',
						width : 50,
						dataIndex : 'appUser.fullname'
					}, {
						header : '部门',
						width : 50,
						dataIndex : 'appUser.department.depName'
					}, {
						header : '外出事由',
						dataIndex : 'outReson'
					}, {
						header : '外出日期',
						width : 50,
						dataIndex : 'startDate'
					}, {
						header : '返回日期',
						width : 50,
						dataIndex : 'endDate'
					}, {
						header : '工作托付',
						dataIndex : 'workConsign'
					}, {
						header : '状态',
						width : 50,
						dataIndex : 'deleted',
						renderer : function(value) {
							return String(value).replace('2', '出差中').replace(
									'0', '已返回').replace('1', '未开始');
						}
					}, {
						header : '管理',
						dataIndex : 'id',
						width : 50,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.id;
							var str = '';
							if (curUserInfo.userId == record
									.get("appUser.userId")
									|| curUserInfo.isAdmin
									|| curUserInfo.fullname == record
											.get("createUser")) {
								if (isGranted('_OutDel')) {
									str = '<a href="#" style="text-decoration:none;color:#3D3D3D" title="取消" class="btn-del" onclick="OutPersonView.deleted('
											+ editId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</a>';
								}
								if (isGranted('_OutEdit')) {
									str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="编辑" value="" class="btn-edit" onclick="OutPersonView.edit('
											+ editId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑</a>';
								}
							}
							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});// end of the cm

		// Toolbar
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});
		if (isGranted('_OutAdd')) {
			this.topbar.add(new Ext.Button({
						iconCls : 'btn-add',
						text : '外出登记',
						xtype : 'button',
						handler : function() {
							new EditOutForm().show();
						}
					}));
		}
		if (isGranted('_OutDel')) {
			this.topbar.add(new Ext.Button({
				iconCls : 'btn-del',
				text : '取消外出安排',
				xtype : 'button',
				handler : function() {
					var grid = Ext.getCmp("OutPersonGrid");
					var selectRecords = grid.getSelectionModel()
							.getSelections();
					if (selectRecords.length == 0) {
						Ext.ux.Toast.msg("信息", "请选择要取消的记录！");
						return;
					}
					var ids = Array();
					for (var i = 0; i < selectRecords.length; i++) {
						ids.push(selectRecords[i].data.id);
						if (curUserInfo.userId != selectRecords[i].data["appUser.userId"]
								&& !curUserInfo.isAdmin
								&& curUserInfo.fullname != selectRecords[i].data["createUser"]) {
							Ext.ux.Toast.msg("信息", "只能删除自己的记录！");
							return;
						}
					}
					OutPersonView.deleted(ids);
				}
			}));
		}// end of the topbar
		// gridPanel
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'OutPersonGrid',
					tbar : this.topbar,
					region : 'center',
					store : store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					sm : sm,
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});// end of the gridPaenl

		// 监听器
		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
								if (isGranted('_OutQuery')) {
									OutPersonView.edit(rec.data.Id);
								}
							});
				});
	}
});

// 删除
OutPersonView.deleted = function(id) {

	var grid = Ext.getCmp("OutPersonGrid");
	Ext.Msg.confirm('信息确认', '您确认要取消该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath + '/Out/recoverOut.do',
								params : {
									ids : id
								},
								method : 'post',
								success : function() {
									Ext.ux.Toast.msg("信息提示", "成功取消所选记录！");
									grid.getStore().reload({
												params : {
													start : 0,
													limit : 25
												}
											});
								}
							});
				}
			});
};
OutPersonView.edit = function(id) {
	new EditOutForm({
				Id : id
			}).show();
};
