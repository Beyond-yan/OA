/**
 * @author:Ropen
 * @class ArchivesIssueManage
 * @extends Ext.Panel
 * @description 拟稿管理
 */
ArchivesIssueManage = Ext.extend(Ext.Panel, {
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
		ArchivesIssueManage.superclass.constructor.call(this, {
					id : 'ArchivesIssueManage',
					iconCls : 'menu-archive-issue-manage',
					title : '公文分发',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		var _url = __ctxPath + '/system/listByDepIdDepartment.do?depId='+roleMap.get('DepartmentCommonId');
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
			id : 'ArchivesIssueManageSearchForm',
			layout : 'form',
			defaults : {
				border : false
			},
			bodyStyle : 'padding:5px',
			items : [{
						name : 'startDate',
						xtype : 'hidden',
						id : 'GWFFsentStoredStartDt'
					}, {
						xtype : 'hidden',
						name : 'endDate',
						id : 'GWFFsentStoredendDate'
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
						}, {
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
						},{
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [/*{
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
							}*/new TreeSelector('depTreeSelector3', _url, '拟稿部门',
									'issuerDepId', true)]
						},  {
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
												.getCmp('GWFFsentStoredStartDt')
												.setValue((this.getValue() + '-01-01'));
										Ext
												.getCmp('GWFFsentStoredendDate')
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
												.getCmp('ArchivesIssueManageSearchForm');
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
						value : 4
					}, {
						xtype : 'hidden',
						name : 'issuerDepId',
						id : 'issuerDepId'
					}]
		});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/flow/listFlowTaskReport.do",
					baseParams : {
						'archiveType' : 0,
						'toDoType' : 4
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
		this.rowActions = new Ext.ux.grid.RowActions({
					header : '管理',
					width : 180,
					actions : [
							// {
							// iconCls : 'btn-archives-detail',
							// qtip : '公文信息',
							// text : '公文信息',
							// style : 'margin:4px 3px 4px 3px'
							// },
						{
						iconCls : 'menu-archive-template',
						text : '公文分发',
						qtip : '公文分发',
						style : 'margin:4px 3px 4px 3px'
					  },{
						iconCls : 'btn-flowView',
						text : '流程信息',
						qtip : '流程信息',
						style : 'margin:4px 3px 4px 3px'
					}]
				});
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
						header : '发文字号',
						dataIndex : 'archivesNo',
						renderer : function(value) {
							if (value == '0') {
								var str = '未生成编号';
								return str;
							} else {
								return value;
							}
						}
					}, {
						header : '拟稿日期',
						dataIndex : 'archCreateTime'
					}, {
						header : '标题',
						dataIndex : 'runSubject',
						width : 300,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							metadata.attr = 'style="white-space:normal;"'; 
							var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchivesIssueManage.detail('
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
					items : []
				});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ArchivesIssueManageGrid',
					region : 'center',
					stripeRows : true,
					// tbar : this.topbar,
					store : this.store,
					trackMouseOver : true,
					plugins : this.rowActions,
					disableSelection : false,
					loadMask : true,
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
						searchPanel : self.searchPanel,
						gridPanel : self.gridPanel
					});
		}
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-archives-detail' :
				ArchivesIssueManage.detail(record.data.archiveId,
						record.data.runId, record.data.defId);
				break;
			case 'btn-flowView' :
				ArchivesIssueManage.proDetail(record.data.runId,
						record.data.defId, record.data.piid,
						record.data.runSubject);
				break;
			case 'menu-archive-template' :
				ArchivesIssueManage.ArchivesShareForm(record.data.archiveId);
				break;
			default :
				break;
		}
	}

});

/**
 * 查阅详情
 * 
 * @param {}
 *            record
 */
ArchivesIssueManage.detail = function(editId, runId, defId) {
	var isGranted=false;
	if(curUserInfo.iscommonAdmin||curUserInfo.isAdmin||curUserInfo.isArchivesManager){
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
 * 显示明细
 * 
 */
ArchivesIssueManage.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
}

ArchivesIssueManage.ArchivesShareForm = function(editId) {
	new ArchivesShareForm(editId);
}
