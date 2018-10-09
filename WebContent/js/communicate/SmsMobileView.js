/**
 * @author:
 * @class SmsMobileView
 * @extends Ext.Panel
 * @description [SmsMobile]管理
 * @company 广州宏天软件有限公司
 * @createtime:2010-01-16
 */
SmsMobileView = Ext.extend(Ext.Panel, {
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
		SmsMobileView.superclass.constructor.call(this, {
					id : 'SmsMobileView',
					title : '手机短信',
					iconCls : 'menu-conference_zancun',
//					iconCls : 'menu-flowWait',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					height : 35,
					region : 'north',
					frame : false,
					border : false,
					layout : 'hbox',
					layoutConfig : {
						padding : '5',
						align : 'middle'
					},
					defaults : {
						style : 'padding:0px 5px 0px 5px;',
						border : false,
						anchor : '98%,98%',
						labelWidth : 70,
						xtype : 'label'
					},
					items : [{
								text : '部门'
							}, {
								hiddenName : 'depName',
								xtype : 'combo',
								width : 150,
								editable:false,
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
								text : '群组'
							}, {
								hiddenName : 'teamName',
								xtype : 'combo',
								width : 150,
								editable:false,
								allowBlank : true,
								triggerAction : 'all',
								displayField : 'teamName',
								valueField : 'teamId',
								mode : 'local',
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/system/listNameAppTeam.do',
									fields : ['teamId', 'teamName']
								})
							}, {
								text : '发送时间'
							}, {
								name : 'sendTime',
								xtype : 'datefield',
								width : 120,
								format : 'Y-m-d',
								editable:false
							},{
								text : '收信人'
							}, {
								name : 'recipients',
								xtype : 'textfield'
							}, {
								text : '收信号码'
							}, {
								name : 'phoneNumber',
								xtype : 'textfield'
							}, {
								text : '状态'
							}, {
								hiddenName : 'status',
								xtype : 'combo',
								id : 'SmsMobileView.status',
								width : 120,
								editable : false,
								mode : 'local',
								triggerAction : 'all',
								store : [['2','全部'],['1', '已发送'], ['0', '待发送']],
								value : 2
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : this.search.createCallback(this)
							}, {
								iconCls : 'btn-reset',
								xtype : 'button',
								text : '重置',
								handler : this.reset.createCallback(this)
							}]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/communicate/listSmsHistory.do",
					params : {
						start : 0,
						limit : 25
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'smsId',
								type : 'int'
							}, 'sendTime', 'recipients', 'phoneNumber',
							'userId', 'userName', 'smsContent', 'status']
				});
		this.store.setDefaultSort('smsId', 'desc');
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});

		this.rowActions = new Ext.ux.grid.RowActions({
					header : '管理',
					width : 80,
					actions : [{
								iconCls : 'btn-del',
								text : '删除',
								qtip : '删除',
								style : 'margin:0 3px 0 3px'
							},{
								iconCls : 'btn-flowView',
								text : '查看',
								qtip : '查看',
								style : 'margin:0 3px 0 3px'
							}
//							, {
//								iconCls : 'btn-edit',
//								qtip : '编辑',
//								style : 'margin:0 3px 0 3px'
//							}
							]
				});

		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
								header : 'smsId',
								dataIndex : 'smsId',
								hidden : true
							}, {
								header : '发送时间',
								dataIndex : 'sendTime',
								renderer : function(value){
									return value.substring(0,10);
								}
							}, {
								header : '收信人',
								dataIndex : 'recipients'
							}, {
								header : '收信号码',
								dataIndex : 'phoneNumber'
							}, {
								header : '发信人',
								dataIndex : 'userName'
							}, {
								header : '短信内容',
								dataIndex : 'smsContent'
							}, {
								header : '状态',
								dataIndex : 'status',
								renderer : function(value){
									if(value == 1){
										return '<font color="green">已发送</font>';	
									}else{
										return '<font color="red">待发送</font>';
									}
								}
							}, this.rowActions],
					defaults : {
						sortable : true,
						menuDisabled : false,
						width : 100
					}
				});
		// 初始化工具栏
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : [
						{
								iconCls : 'btn-add',
								text : '系统内短信',
								xtype : 'button',
								handler : this.innerRecord
							},{
								iconCls : 'btn-add',
								text : '系统外短信',
								xtype : 'button',
								handler : this.outsideRecord
							},
							{
								iconCls : 'btn-del',
								text : '删除短信',
								xtype : 'button',
								handler : this.delRecords,
								scope : this
							}]
				});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'SmsMobileGrid',
					region : 'center',
					stripeRows : true,
					tbar : this.topbar,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					height : 700,
					cm : cm,
					sm : sm,
					plugins : this.rowActions,
					viewConfig : {
						forceFit : true,
						autoFill : true, // 自动填充
						forceFit : true
						// showPreview : false
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});

		/*this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
								new SmsMobileForm({smsId : rec.data.smsId}).show();
							});
				});*/
		this.rowActions.on('action', this.onRowAction, this);
	},// end of the initComponents()

	/**
	 * 
	 * @param {}
	 *            self 当前窗体对象
	 */
	search : function(self) {
		if (self.searchPanel.getForm().isValid()) {// 如果合法
			$search({
				searchPanel :self.searchPanel,
				gridPanel : self.gridPanel
			});
		}
	},
	
	reset : function(self) {
		self.searchPanel.getForm().reset();
		Ext.getCmp('SmsMobileView.status').setValue(2);
	},

	/**
	 * 添加记录
	 */
	innerRecord : function() {
		new SmsMobileForm({
			isInner : true
		}).show();
	},
	/**
	 * 添加记录
	 */
	outsideRecord : function() {
		new OutMsgForm().show();
	},
	/**
	 * 按IDS删除记录
	 * 
	 * @param {}
	 *            ids
	 */
	delByIds : function(ids, status) {
		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
							url : __ctxPath
									+ '/communicate/multiDelSmsHistory.do',
							params : {
								status : status,
								ids : ids
							},
							method : 'POST',
							success : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '成功删除该短信！');
								Ext.getCmp('SmsMobileGrid').getStore().reload();
							},
							failure : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
							}
						});
			}
		});// end of comfirm
	},
	/**
	 * 删除多条记录
	 */
	delRecords : function() {
		var gridPanel = Ext.getCmp('SmsMobileGrid');
		var selectRecords = gridPanel.getSelectionModel().getSelections();
		if (selectRecords.length == 0) {
			Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
			return;
		}
		var ids = Array();
		for (var i = 0; i < selectRecords.length; i++) {
			ids.push(selectRecords[i].data.smsId);
		}
		var status = selectRecords[0].data.status;
		this.delByIds(ids, status);
	},

	/**
	 * 编辑记录
	 * 
	 * @param {}
	 *            record
	 */
	editRecord : function(record) {
		new SmsMobileForm({
					smsId : record.data.smsId
				}).show();
	},
	viewRecord : function(record) {
		new SmsMobileExamineView({
					smsId : record.data.smsId,
					status : record.data.status
				}).show();
	},
	/**
	 * 管理列中的事件处理
	 * 
	 * @param {}
	 *            grid
	 * @param {}
	 *            record
	 * @param {}
	 *            action
	 * @param {}
	 *            row
	 * @param {}
	 *            col
	 */
	onRowAction : function(gridPanel, record, action, row, col) {
		switch (action) {
			case 'btn-del' :
				this.delByIds(record.data.smsId, record.data.status);
				break;
			case 'btn-edit' :
				this.editRecord(record);
				break;
			case 'btn-flowView' :
				this.viewRecord(record);
				break;
			default :
				break;
		}
	}
});
