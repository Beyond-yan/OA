Ext.ns('AllScheduleView');
AllScheduleView = Ext.extend(Ext.Panel, {
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
		AllScheduleView.superclass.constructor.call(this, {
					id : 'AllScheduleView',
					title : '全部安排',
					iconCls : 'menu-cal-plan-view',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},

	// 初始化组件
	initUIComponents : function() {
		// 查询Panel
		this.searchPanel = new HT.SearchPanel({
					id : 'ScheduleSearchForm',
					layout : 'form',
					region : 'north',
					colNums : 3,
					items : [{
						fieldLabel : '领导姓名',
						name : 'Q_appUser.fullname_S_LK',
						flex : 1,
						xtype : 'combo',
						editable : false,
						triggerAction : 'all',
						displayField : 'depname',
						valueField : 'depid',
						mode : 'local',
						store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/system/getUserByRoleIdAppUser.do?roleId='
											+ roleMap.get('leaderRoleId'),
									fields : ['depid', 'depname']
								})
					}, {
						fieldLabel : '开始日期:',
						xtype : 'datefield',
						editable : false,
						flex : 1,
						format : 'Y-m-d',
						name : 'Q_startTime_D_GE'
					}, {
						name : 'Q_startTime_D_LE',
						id : 'Q_startTime_D_LE_id',
						xtype : 'hidden'
					}, {
						fieldLabel : '至',
						flex : 1,
						xtype : 'datefield',
						editable : false,
						format : 'Y-m-d',
						listeners : {
							change : function() {
								Ext.getCmp('Q_startTime_D_LE_id').setValue(this
										.getValue().add(Date.DAY, 1)
										.format('Y-m-d'));	
							}
						}
					}, {
						fieldLabel : '简单描述',
						name : 'Q_activeName_S_LK',
						flex : 1,
						xtype : 'textfield'
					}, {
						fieldLabel : '结束日期:',
						name : 'Q_endTime_D_GE',
						flex : 1,
						xtype : 'datetimefield',
						format : 'Y-m-d'
					}, {
						name : 'Q_endTime_D_LE',
						id : 'Q_endTime_D_LE_id',
						xtype : 'hidden'
					}, {
						fieldLabel : '至',
						flex : 1,
						xtype : 'datefield',
						format : 'Y-m-d',
						listeners : {
							change : function() {
								Ext.getCmp('Q_endTime_D_LE_id').setValue(this
										.getValue().add(Date.DAY, 1)
										.format('Y-m-d'));
							}
						}
					}],
					buttons : [{
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : function() {
									var searchPanel = Ext
											.getCmp('ScheduleSearchForm');
									var gridPanel = Ext.getCmp('ScheduleGrid');
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
									var searchPanel = Ext
											.getCmp('ScheduleSearchForm');
									searchPanel.getForm().reset();
								}
							}]
				});// end of the searchPanel

		// 数据源
		var store = new Ext.data.JsonStore({
					url : __ctxPath + '/leaderActivities/listSchedule.do',
					root : 'result',
					totalProperty : 'totalCounts',
					fields : ['activeId', 'activeName', 'activeDesc',
							'startTime', 'endTime', 'displayType','timeType','timeNumber','appUser.userId',
							'appUser.fullname','appUser.userlevel', 'updateUser','createUser', 'updateDate']
				});
		store.load({
					params : {
						start : 0,
						limit :25
					}
				});// end of the store

		// ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : '领导姓名',
						dataIndex : 'appUser.fullname'
					}, {
						header : '简单描述',
						dataIndex : 'activeName'
					}, {
						header : '开始日期',
						dataIndex : 'startTime'
					},{
						header : '结束日期',
						dataIndex : 'endTime'
					},/*{
						header : '结束日期',
						dataIndex : 'appUser.userId',
						id:'appUser.userId'
					},*//* {
						header : '持续类型',
						dataIndex : 'timeType',
						renderer : function(value) {
							return String(value).replace('2', '全天').replace(
									'0', '上午').replace('1', '下午');
						}
					}, {
						header : '持续天数',
						dataIndex : 'timeNumber'
					},*//*{
						header : '备注',
						dataIndex : 'activeDesc'
					},*/
					/*{
						header : '重要程度',
						dataIndex : 'displayType',
						renderer : function(value) {
							return String(value)
									.replace('1', '缓急')
									.replace('2', '平急')
									.replace('3', '加急')
									.replace('4', '急件')
									.replace('5', '特急');
						}
					},*/
					{
						header : '管理',
						dataIndex : 'activeId',
						width : 50,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var str = '';
							if(curUserInfo.userId== record.get("appUser.userId") || curUserInfo.isAdmin||curUserInfo.fullname==record.get("createUser")){
								if (isGranted('_LeaderDel')) {
									str = '<a href="#" style="text-decoration:none;color:#3D3D3D" title="删除" value=" " class="btn-del" onclick="AllScheduleView.remove('
											+ value + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</a>';}
								if (isGranted('_LeaderEdit')) {
									str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="编辑" value=" " class="btn-edit" onclick="AllScheduleView.edit('
											+ value + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑</a>';
								}}
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
					id : 'ScheduleFootBar',
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});
		if (isGranted('_LeaderAdd')) {
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-add',
					text : '添加活动安排',
					xtype : 'button',
					handler : function() {
						new EditScheduleForm();
					}
				}));}
		if (isGranted('_LeaderDel')) {
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-del',
					text : '删除活动安排',
					xtype : 'button',
					handler : function() {
						var grid = Ext.getCmp("ScheduleGrid");
						var selectRecords = grid.getSelectionModel()
								.getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = Array();
						for (var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.activeId);
							if(curUserInfo.userId!=selectRecords[i].data["appUser.userId"]&&!curUserInfo.isAdmin&&curUserInfo.fullname!=selectRecords[i].data["createUser"])
								{Ext.ux.Toast.msg("信息", "只能删除自己的记录！");
								return;
								}
						}
						AllScheduleView.remove(ids);
					}
				}));}// end of the topbar
		// gridPanel
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ScheduleGrid',
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
								if (isGranted('_AllScheduleEdit')) {
									AllScheduleView.edit(rec.data.activeId);
								}
							});
				});
	}
});

// 删除
AllScheduleView.remove = function(id) {
	var grid = Ext.getCmp("ScheduleGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath
										+ '/leaderActivities/multiDelSchedule.do',
								params : {
									ids : id
								},
								method : 'post',
								success : function() {
									Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
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
AllScheduleView.edit = function(id) {
	new EditScheduleForm(id);
};
