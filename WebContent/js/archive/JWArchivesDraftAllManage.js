/**
 * @author:Ropen
 * @class JWArchivesDraftAllManage
 * @extends Ext.Panel
 * @description 拟稿管理
 */
JWArchivesDraftAllManage = Ext.extend(Ext.Panel, {
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
		JWArchivesDraftAllManage.superclass.constructor.call(this, {
					id : 'JWArchivesDraftAllManage',
					iconCls : 'menu-archive-draft-manage',
					title : '发文查询',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		var nowYear = parseInt(new Date().format('Y'));
		var startYear = nowYear - 13;
		var arr = [];
		for (var i = 0; i <= 14; i++) {
			arr[i] = startYear + i;
		}
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			height : 88,
			region : 'north',
			frame : false,
			border : false,
			id : 'JWArchivesDraftAllManageSearchForm',
			layout : 'form',
			defaults : {
				border : false
			},
			bodyStyle : 'padding:5px',
			items : [{
						name : 'startDate',
						xtype : 'hidden',
						id : 'FWCXsentStoredStartDt'
					}, {
						xtype : 'hidden',
						name : 'endDate',
						id : 'FWCXsentStoredendDate'
					}, {
						layout : 'column',
						defaults : {
							border : false
						},
						items : [/*{
							columnWidth : .24,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '稿笺名称',
								width : 180,
								xtype : 'combo',
								listWidth : 450,
								hiddenName : 'defId',
								editable : false,
								triggerAction : 'all',
								displayField : 'name',
								valueField : 'id',
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/flow/comQuickProDefinition.do?typeId=1205686',
									fields : ['id', 'name']
								})
							}

							]
						},*/ {
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										fieldLabel : '标题',
										name : 'subject',
										xtype : 'textfield',
										width : 180
									}]
						},{
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										fieldLabel : '拟稿人',
										name : 'issuerName',
										xtype : 'textfield',
										width : 180
									}]
						}, {
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '拟稿部门',
								width : 180,
								xtype : 'combo',
								hiddenName : 'issuerDepId',
								editable : false,
								triggerAction : 'all',
								displayField : 'name',
								valueField : 'id',
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/system/select3ByComboDepartment.do?depId=100130',
									fields : ['id', 'name'],
									baseParams : {
										start : 0,
										limit : 10000
									}
								})
							}]
						}, {
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{

								width : 60,
								// id : 'sentStoredsnConfigId',
								fieldLabel : '编号办法',
								hiddenName : 'snConfigId',
								xtype : 'combo',
								editable : false,
								mode : 'local',
								triggerAction : 'all',
								displayField : 'name',
								valueField : 'id',
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/snconfig/signComboFileSnConfig.do?snType=0',
									fields : ['id', 'name'],
									baseParams : {
										start : 0,
										limit : 10000
									}
								})
							}]
						},{
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '年份',
								width : 130,
								xtype : 'combo',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								store : arr,
								emptyText : '---年份---',
								listeners : {
									select : function() {
										Ext
												.getCmp('FWCXsentStoredStartDt')
												.setValue((this.getValue() + '-01-01'));
										Ext
												.getCmp('FWCXsentStoredendDate')
												.setValue(Ext.util.Format
														.substr(
																this.getValue(),
																0, 4)
														+ '-12-31');
									}
								}
							}]
						},{
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										width : 60,
										// id : 'sentStoredArchivesNo',
										fieldLabel : '发文编号',
										name : 'archiveNo',
										xtype : 'textfield'
									}]
						}]
					}, {
						xtype : 'panel',
						border : false,
						layout : 'hbox',
						layoutConfig : {
							pack : 'center',
							align : 'middle'
						},
						items : [{
									xtype : 'button',
									text : '查询',
									iconCls : 'search',
									handler : this.search.createCallback(this)
								}, {
									xtype : 'button',
									text : '重置',
									style:'padding-left:5px;',
									iconCls : 'btn-reseted',
									handler : function() {
										var searchPanel = Ext
												.getCmp('JWArchivesDraftAllManageSearchForm');
										searchPanel.getForm().reset();
									}
								}]
					}, {
						xtype : 'hidden',
						name : 'archiveType',
						value : 0
					}, {
						xtype : 'hidden',
						name : 'toDoType',
						value : -1
					}]
		});
		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url :__ctxPath + "/flow/listJWFlowTaskReport.do",
					baseParams : {
						'archiveType' : 0,
						'toDoType' : -1
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'defId',
								type : 'int'
							}, 'runId', 'taskId', 'taskName', 'activityname',
							'runSubject', 'preActivityname', 'preUserId',
							'preUserName', 'assignUserId', 'assignUserName',
							'archiveId', 'issuerId', 'issuer',
							'archCreateTime', 'sendTime', 'isReply',
							'archivesNo', 'orgdepName', 'issuedep', 'curDepId',
							'curDepName', 'flowName', 'dataValue', 'piid',
							'creatorDepName', 'creatorDepId']
				});
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});
		/*
		 * this.rowActions = new Ext.ux.grid.RowActions({ header : '管理', width :
		 * 200, actions : [ // { // iconCls : 'btn-archives-detail', // qtip :
		 * '公文信息', // text : '公文信息', // style : 'margin:4px 3px 4px 3px' // }, {
		 * iconCls : 'btn-flowView', text : '流程信息', qtip : '流程信息', style :
		 * 'margin:4px 3px 4px 3px' }, { hidden:true, disabled:false, iconCls :
		 * 'btn-edit', text : '流程编辑', qtip : '流程编辑', style : 'margin:4px 3px 4px
		 * 3px' }] });
		 */
		// 初始化ColumnModel
		var record_start = 0;
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer({
								header : "序号",
								width : 35,
								renderer : function(value, metadata, record,
										rowIndex) {
									return record_start + 1 + rowIndex;
								}
							}), {
						header : 'archiveId',
						dataIndex : 'archiveId',
						hidden : true
					}, {
						header : '标题',
						dataIndex : 'runSubject',
						width : 250,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							metadata.attr = 'style="white-space:normal;"'; 
							var str = '<a href="#" title="'+value+'"'+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="JWArchivesDraftAllManage.detail('
									+ record.data.archiveId
									+ ','
									+ record.data.runId
									+ ','
									+ record.data.defId
									+ ')">'
									+ value
									+ '</a>';
							return str;
						}
					}, {
						header : '步骤名称',
						dataIndex : 'taskName'
					}, {
						header : '当前办理人',
						dataIndex : 'assignUserName'
					}, {
						header : '当前办理部门',
						dataIndex : 'curDepName'
					}, {
						header : '拟稿人',
						dataIndex : 'issuer'
					}, {
						header : '拟稿人部门',
						dataIndex : 'creatorDepName'
					}, {
						header : '拟稿时间',
						dataIndex : 'archCreateTime'
					}, {
						header : '管理',
						width : 250,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var preUserId = record.data.preUserId;
							var preActivityname = record.data.preActivityname;
							var taskName = record.data.taskName;
							var str = '';
							str += '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="JWArchivesDraftAllManage.proDetail('
									+ record.data.runId
									+ ','
									+ record.data.defId
									+ ',\''
									+ record.data.piid
									+ '\',\''
									+ record.data.runSubject
									+ '\')"><img src="'
									+ __ctxPath
									+ '/images/btn/flow/view.png" />流程信息</a>&nbsp;';
							if (isGranted('_ArchiveRecAllEdit')) {
								str += '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="JWArchivesDraftAllManage.edit('
										+ record.data.taskId
										+ ',\''
										+ record.data.activityname
										+ '\')"><img src="'
										+ __ctxPath
										+ '/images/system/edit.gif" />流程编辑</a>&nbsp;';
							}
							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false
			}
		});
		// 初始化工具栏
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'JWArchivesDraftAllManageGrid',
					region : 'center',
					stripeRows : true,
					/* tbar : this.topbar, */
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					plugins : this.rowActions,
					autoHeight : true,
					cm : cm,
					sm : sm,
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
								emptyMsg : "当前没有记录",
								doLoad : function(start) {
									record_start = start;
									var o = {}, pn = this.getParams();
									o[pn.start] = start;
									o[pn.limit] = this.pageSize;
									this.store.load({
												params : o
											});
								}
							})
				});

		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
							});
				});
		/* this.rowActions.on('action', this.onRowAction, this); */
	},// end of the initComponents()

	/**
	 * 
	 * @param {}
	 *            self 当前窗体对象
	 */
	search : function(self) {
		if (self.searchPanel.getForm().isValid()) {// 如果合法
			$search({
						searchPanel : self.searchPanel,
						gridPanel : self.gridPanel
					});
		}
	},
	/*
	 * //行的Action onRowAction : function(grid, record, action, row, col) {
	 * switch (action) { case 'btn-archives-detail' :
	 * JWArchivesDraftAllManage.detail(record.data.archiveId,record.data.taskId,record.data.defId);
	 * break; case 'btn-flowView' :
	 * JWArchivesDraftAllManage.proDetail(record.data.runId,record.data.defId,record.data.piid,record.data.runSubject);
	 * break; case 'btn-edit' :
	 * JWArchivesDraftAllManage.edit(record.data.taskId,record.data.activityname);
	 * break; case 'menu-holiday' :
	 * JWArchivesDraftAllManage.stopProcess(record.data.archiveId,record.data.piid);
	 * break; default : break; } },
	 */
	/**
	 * 查阅详情
	 * 
	 * @param {}
	 *            record
	 */
	detail : function(record) {
		new ArchivesDetailWin({
					archivesId : record.data.archivesId
				}).show();
	}
});

/**
 * 展示公文详细信息
 * 
 * @param {}
 *            editId
 */
JWArchivesDraftAllManage.detail = function(editId, runId, defId) {
	var isGranted=false;
	if(curUserInfo.isOfficeStaffRole||curUserInfo.isAdmin||curUserInfo.isArchivesManager)
		{
		  isGranted=true;
		}
	new ArchDetailView({
				archivesId : editId,
				runId : runId,
				defId : defId,
				archType : 0,
				isGranted:isGranted
			}).show();
}

/**
 * 
 * 流程编辑功能
 * 
 * @param {}
 * 
 */
JWArchivesDraftAllManage.edit = function(taskId, activityname) {
	new ArchivesFreeJumpWin({
				taskId : taskId,
				activityName : activityname
			}).show();
}

/**
 * 展示公文子收文明细
 * 
 * @param {}
 *            editId
 */
JWArchivesDraftAllManage.subDetail = function(editId) {
	new ArchSubDetailForm({
				parentArchId : editId
			});
}

JWArchivesDraftAllManage.stopProcess = function(editId, piId) {
	Ext.Msg.confirm('提示', '确定撤销该流程？', function(btn, text) {
				if (btn == 'yes') {
					// 终止流程
					Ext.Ajax.request({
								url : __ctxPath + '/flow/stopProcessRun.do',
								params : {
									'piId' : piId
								},
								method : 'post',
								success : function(resp, options) {
									Ext.ux.Toast.msg('操作信息', '操作成功');
									Ext.getCmp('JWArchivesDraftAllManageGrid')
											.getStore().reload()
								},
								failure : function(response) {
									Ext.Msg.alert("提示", "终止失败！");
								}
							});
				}
			})
}

/**
 * 显示明细
 * 
 * @param {}
 *            runId
 * @param {}
 *            name
 */
JWArchivesDraftAllManage.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};