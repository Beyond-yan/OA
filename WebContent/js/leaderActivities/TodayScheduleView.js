/**
 * @author:
 * @class DutySignView
 * @extends Ext.Panel
 * @description 值班签到
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
TodayScheduleView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		TodayScheduleView.superclass.constructor.call(this, {
					id : 'TodayScheduleView',
					title : '领导日程',
					iconCls : 'menu-dutySetting',
					region : 'center',
					layout : 'form',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			id : 'TodayScheduleForm',
			height : 40,
			frame : false,
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
					left : 0
				}
			},
			items : [{
						text : '查询条件:'
					}, {
						text : '领导姓名'
					}, {
						name : 'Q_appUser.fullname_S_LK',
						xtype : 'combo',
						editable : false,
						triggerAction : 'all',
						displayField : 'depname',
						valueField : 'depid',
						mode : 'local',
						store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/system/getmemberAppUser.do?depId='
											+ 100406,
									fields : ['depid', 'depname']
								})
					}, {
						text : '开始日期',
						style : 'padding-left:20px'
					}, {
						xtype : 'datefield',
						format : 'Y-m-d',
						name : 'Q_startTime_D_GE'
					}, {
						text : '至',
						style : 'padding-left:20px'
					}, {
						xtype : 'datefield',
						format : 'Y-m-d',
						listeners : {
							select: function() {
								Ext.getCmp('q_start_D_id').setValue(this
										.getValue().add(Date.DAY, 1)
										.format('Y-m-d'));
							}
						}
					}, {
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext.getCmp('TodayScheduleForm');
							var gridPanel = Ext.getCmp('TodayScheduleGrid');
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
							var searchPanel = Ext.getCmp('TodayScheduleForm');
							searchPanel.getForm().reset();
						}
					}, {
						name : 'Q_startTime_D_LE',
						xtype : 'hidden',
						id : 'q_start_D_id'
					}]
		});// end of searchPanel

		this.topbar = new Ext.Toolbar({
					items : []
				});
		this.topbar.add(new Ext.Button({
					iconCls : 'menu-diary',
					text : '添加领导活动',
					handler : function() {
						new EditScheduleForm();
					}
				}));
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-del',
					text : '删除领导活动',
					handler : function() {
						var grid = Ext.getCmp("TodayScheduleGrid");
						var selectRecords = grid.getSelectionModel()
								.getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = Array();
						for (var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.activeId);
						}
						TodayScheduleView.remove(ids);
					}
				}));
		this.topbar.add(new Ext.Button({
					iconCls : 'menu-cal-plan-view',
					text : '查看日程',
					handler : function() {
						var tabs = Ext.getCmp('centerTabPanel');
						var leaderCalendarView = Ext
								.getCmp('LeaderCalendarView');
						if (leaderCalendarView != null) {
							tabs.remove('LeaderCalendarView');
						}
						leaderCalendarView = new LeaderCalendarView();
						tabs.add(leaderCalendarView);
						tabs.activate(leaderCalendarView);
					}
				}));
		this.rowActions = new Ext.ux.grid.RowActions({
					header : '管理',
					width : 80,
					actions : [{
								iconCls : 'btn-del',
								text : '删除',
								qtip : '删除',
								style : 'margin:0 3px 0 3px'
							}, {
								iconCls : 'btn-edit',
								text : '编辑',
								qtip : '编辑',
								style : 'margin:0 3px 0 3px'
							}]
				});
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
								header : '日期',
								dataIndex : 'sgDate',
								hidden : true
							}, {
								header : '领导姓名',
								dataIndex : 'appUser.fullname'
							}, {
								header : '简单描述',
								dataIndex : 'activeName'
							}, {
								header : '开始日期',
								dataIndex : 'startTime'
							}, {
								header : '持续类型',
								dataIndex : 'timeType',
								renderer : function(value) {
									return String(value).replace('2', '全天')
											.replace('0', '上午').replace('1',
													'下午');
								}
							}/*, {
								header : '备注',
								dataIndex : 'activeDesc'
							}*/, this.rowActions],
					defaults : {
						sortable : true,
						menuDisabled : false,
						width : 100
					}
				});
		var store = new Ext.data.GroupingStore({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath
										+ '/leaderActivities/calendarlistSchedule.do'
							}),
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'id',
								fields : ['activeId', 'activeName',
										'activeDesc', 'startTime', 'endTime',
										'sgDate', 'displayType', 'timeType',
										'appUser.fullname', 'updateUser',
										'updateDate']
							}),
					remoteSort : true,
					sortInfo : {
						field : 'startTime',
						direction : "ASC"
					},
					groupField : 'sgDate'
				});
		store.load({
					params : {
						start : 0,
						limit : 250
					}
				});
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'TodayScheduleGrid',
					tbar : this.topbar,
					store : store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					plugins : this.rowActions,
					autoHeight : true,
					cm : cm,
					sm : sm,
					animCollapse : false,
					view : new Ext.grid.GroupingView({
								forceFit : true,
								groupTextTpl : '{text}'
							}),
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{1}条记录',
								emptyMsg : "当前没有记录"
							})
				});
		this.rowActions.on('action', this.onRowAction, this);
	},// end of the initComponents()
	// 按ID删除记录
	removeRs : function(id) {
		$postDel({
					url : __ctxPath + '/leaderActivities/multiDelSchedule.do',
					ids : id,
					grid : this.gridPanel
				});
	},
	editRs : function(record) {
		new EditScheduleForm(record.data.activeId);
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-del' :
				this.removeRs.call(this, record.data.activeId);
				break;
			case 'btn-edit' :
				this.editRs.call(this, record);
				break;
			default :
				break;
		}
	}
});
TodayScheduleView.remove = function(id) {
	var grid = Ext.getCmp("TodayScheduleGrid");
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
													limit : 250
													
												}
											});
								}
							});
				}
			});
};
