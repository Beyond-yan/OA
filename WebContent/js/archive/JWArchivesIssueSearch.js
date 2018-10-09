/**
 * @author:Ropen
 * @class JWArchivesIssueSearch
 * @extends Ext.Panel
 * @description 拟稿管理
 */
JWArchivesIssueSearch = Ext
		.extend(
				Ext.Panel,
				{
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
						JWArchivesIssueSearch.superclass.constructor.call(this, {
							id : 'JWArchivesIssueSearch',
							iconCls : 'menu-archive-search',
							title : '发文库',
							region : 'center',
							layout : 'border',
							items : [ this.searchPanel, this.gridPanel ]
						});
					},// end of constructor

					// 初始化组件
					initUIComponents : function() {
						var dir = '';
						var sort = '';
						var nowYear = parseInt(new Date().format('Y'));
						var startYear = nowYear - 13;
						var arr = [];
						for ( var i = 0; i <= 14; i++) {
							arr[i] = startYear + i;
						}
						// 初始化搜索条件Panel
						this.searchPanel = new Ext.FormPanel(
								{
									height : 110,
									region : 'north',
									id : 'SentStoreSearchForm',
									layout : 'form',
									bodyStyle : 'padding:5px',
									defaults : {
										border : false
									},
									items : [
											{
												layout : 'column',
												defaults : {
													border : false
												},
												items : [
														{
															columnWidth : .3,
															layout : 'form',
															defaults : {
																border : false,
																anchor : '96%,96%'
															},
															items : [ {
																fieldLabel : '标题',
																id : 'sentStoredsubject',
																name : 'subject',
																xtype : 'textfield'
															} ]
														},
														{
															columnWidth : .3,
															layout : 'form',
															defaults : {
																border : false,
																anchor : '96%,96%'
															},
															items : [ {
																fieldLabel : '拟稿人',
																id : 'sentIssuerName',
																name : 'issuerName',
																xtype : 'textfield',
																width : 180
															} ]
														},
														{
															columnWidth : 0.3,
															layout : 'form',
															defaults : {
																border : false,
																anchor : '96%,96%'
															},
															items : [
																	{

																		width : 65,
																		fieldLabel : '拟稿部门',
																		id : 'sentOrgDepIds',
																		hiddenName : 'orgdepId',
																		xtype : 'combo',
																		editable : false,
																		mode : 'local',
																		triggerAction : 'all',
																		displayField : 'name',
																		valueField : 'id',
																		store : new Ext.data.SimpleStore(
																				{
																					autoLoad : true,
																					url : __ctxPath
																							+ '/system/select3ByComboDepartment.do?depId=100130',
																					fields : [
																							'id',
																							'name' ],
																					baseParams : {
																						start : 0,
																						limit : 10000
																					}
																				})
																	},
																	{
																		name : 'startDate',
																		xtype : 'hidden',
																		id : 'sentStoredStartDt'
																	} ]
														},
														{
															columnWidth : .3,
															layout : 'form',
															defaults : {
																border : false,
																anchor : '96%,96%'
															},
															items : [ {

																width : 60,
																id : 'sentStoredsnConfigId',
																fieldLabel : '编号办法',
																hiddenName : 'snConfigId',
																xtype : 'combo',
																editable : false,
																triggerAction : 'all',
																displayField : 'name',
																valueField : 'id',
																store : new Ext.data.SimpleStore(
																		{
																			autoLoad : true,
																			url : __ctxPath
																					+ '/snconfig/signComboFileSnConfig.do?snType=0',
																			fields : [
																					'id',
																					'name' ],
																			baseParams : {
																				start : 0,
																				limit : 10000
																			}
																		})
															} ]
														},
														{
															columnWidth : .3,
															layout : 'form',
															defaults : {
																border : false,
																anchor : '96%,96%'
															},
															items : [ {
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
																				.getCmp(
																						'sentStoredStartDt')
																				.setValue(
																						(this
																								.getValue() + '-01-01'));
																		Ext
																				.getCmp(
																						'sentStoredendDate')
																				.setValue(
																						Ext.util.Format
																								.substr(
																										this
																												.getValue(),
																										0,
																										4)
																								+ '-12-31');
																	}
																}
															} ]
														},
														{
															columnWidth : .3,
															layout : 'form',
															defaults : {
																border : false,
																anchor : '96%,96%'
															},
															items : [ {
																width : 60,
																id : 'sentStoredArchivesNo',
																fieldLabel : '发文编号',
																name : 'archiveNo',
																xtype : 'textfield'
															} ]
														},
														{
															columnWidth : .3,
															layout : 'form',
															defaults : {
																border : false,
																anchor : '96%,96%'
															},
															items : [ {
																fieldLabel : '稿笺名称',
																width : 180,
																xtype : 'combo',
																listWidth : 450,
																hiddenName : 'defId',
																editable : false,
																triggerAction : 'all',
																displayField : 'name',
																valueField : 'id',
																store : new Ext.data.SimpleStore(
																		{
																			autoLoad : true,
																			url : __ctxPath
																					+ '/flow/comQuickProDefinition.do?typeId=1205686',
																			fields : [
																					'id',
																					'name' ]
																		})
															}

															]
														} ]
											},
											{
												xtype : 'panel',
												border : false,
												layout : 'hbox',
												layoutConfig : {
													pack : 'center',
													align : 'middle'
												},
												items : [
														{
															xtype : 'button',
															text : '查询',
															iconCls : 'search',
															handler : this.search
																	.createCallback(this)
														},
														{
															xtype : 'button',
															text : '重置',
															style : 'padding-left:10px;',
															iconCls : 'reset',
															handler : function() {
																Ext
																		.getCmp(
																				'SentStoreSearchForm')
																		.getForm()
																		.reset();

															}
														},
														{
															xtype : 'button',
															iconCls : 'excel-cls',
															style : 'padding-left:10px;',
															text : '导出Excel',
															handler : this.tableToExcel
																	.createCallback(this)
														} ]
											},
											{
												xtype : 'hidden',
												name : 'archiveType',
												value : 0
											},
											{
												xtype : 'hidden',
												name : 'toDoType',
												value : -2
											},
											{
												xtype : 'hidden',
												name : 'endDate',
												id : 'sentStoredendDate'
											},
											{
												xtype : 'hidden',
												id : 'JWArchivesIssueSearch.dir',
												value : 'DESC'
											},
											{
												xtype : 'hidden',
												id : 'JWArchivesIssueSearch.sort',
												value : 'archiveId'
											} ]
								});// end of the searchPanel		
						// 加载数据至store
						this.store = new Ext.data.JsonStore({
							url : __ctxPath + "/flow/listJWFlowTaskReport.do",
							baseParams :{
								archiveType : 0,
								toDoType : -2
							},
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							fields : [ 'archiveId', 'archivesNo', 'runSubject',
									'archCreateTime', 'signDate', 'defId',
									'runId', 'signDate' ]
						});
						this.store.setDefaultSort('archiveId', 'desc');
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
							actions : [ {
								iconCls : 'btn-archives-detail',
								qtip : '公文信息',
								text : '公文信息',
								style : 'margin:0 3px 0 3px'
							} ]
						});

						// 初始化ColumnModel
						var record_start = 0;
						var sm = new Ext.grid.CheckboxSelectionModel();
						var cm = new Ext.grid.ColumnModel(
								{
									columns : [
											new Ext.grid.RowNumberer({
												header : "序号",
												width : 35,
												renderer : function(value,
														metadata, record,
														rowIndex) {
													return record_start + 1
															+ rowIndex;
												}
											}),
											{
												header : 'archiveId',
												dataIndex : 'archiveId',
												hidden : true
											},
											{
												header : '标题',
												dataIndex : 'runSubject',
												width : 300,
												renderer : function(value,
														metadata, record,
														rowIndex, colIndex) {
													var str = '<a href="#" title="'
															+ value
															+ '"'
															+ ' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="JWArchivesIssueSearch.detail('
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
												header : '发文编号',
												dataIndex : 'archivesNo',
												width : 100
											}, {
												header : '拟稿日期',
												dataIndex : 'archCreateTime',
												width : 50
											}, {
												header : '签发日期',
												dataIndex : 'signDate',
												width : 50
											}, this.rowActions ],
									defaults : {
										sortable : true,
										menuDisabled : false,
										width : 80
									}
								});

						this.gridPanel = new Ext.grid.GridPanel({
							id : 'ArchivesGrid',
							region : 'center',
							stripeRows : true,
							store : this.store,
							trackMouseOver : true,
							disableSelection : false,
							loadMask : true,
							autoHeight : true,
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
							}),
							listeners : {
								headerclick : function(g, n, e) {
									sort = g.getColumnModel().getDataIndex(n);
									if (sort != Ext.getCmp(
											'JWArchivesIssueSearch.sort')
											.getValue()) {
										dir = '';
									}
									Ext.getCmp('JWArchivesIssueSearch.sort')
											.setValue(sort);
									if ('ASC' == dir) {
										dir = 'DESC';
										Ext.getCmp('JWArchivesIssueSearch.dir')
												.setValue(dir);
									} else {
										dir = 'ASC';
										Ext.getCmp('JWArchivesIssueSearch.dir')
												.setValue(dir);
									}
								}
							}
						});

						this.gridPanel.addListener('rowdblclick', function(
								grid, rowindex, e) {
							grid.getSelectionModel().each(function(rec) {
							});
						});
						this.rowActions.on('action', this.onRowAction, this);
					},// end of the initComponents()

					/**
					 * 
					 * @param {}
					 *            self 当前窗体对象
					 */
					search : function(self) {// alert(Ext.getCmp('sentStoredPrivacyLevel').getValue());
						if (self.searchPanel.getForm().isValid()) {// 如果合法
							$search({
								searchPanel : self.searchPanel,
								gridPanel : self.gridPanel
							});
						}
					},

					// 把表格导出到Excel
					tableToExcel : function(self) {
						var recordCount = self.store.getCount();
						if (recordCount > 0) {

							/*
							 * Ext.getCmp('SentStoreSearchForm').getForm().submit({
							 * url : __ctxPath+
							 * '/flow/sentArchivesToExcelDownLoad.do', method :
							 * 'POST', success : function(fp, action) {
							 * alert(action); alert(fp); //window.location.href =
							 * action. }, failure : function(fp, action) {
							 * Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！'); } })
							 */

							var url = __ctxPath
									+ '/flow/sentArchivesToExcelDownLoad.do?archiveType=0'
									+ '&archiveNo='
									+ Ext.getCmp('sentStoredArchivesNo')
											.getValue()
									+ '&startDate='
									+ Ext.util.Format.date(Ext.getCmp(
											'sentStoredStartDt').getValue(),
											'Y-m-d')
									+ '&endDate='
									+ Ext.util.Format.date(Ext.getCmp(
											'sentStoredendDate').getValue(),
											'Y-m-d')
									+ '&subject='
									+ Ext.getCmp('sentStoredsubject')
											.getValue()
									+ '&orgdepId='
									+ Ext.getCmp('sentOrgDepIds').getValue()
									// + '&snConfigId='
									// +
									// Ext.getCmp('sentStoredsnConfigId').getValue()
									+ '&issuerName='
									+ Ext.getCmp('sentIssuerName').getValue()
									+ '&dir='
									+ Ext.getCmp('JWArchivesIssueSearch.dir')
											.getValue()
									+ '&sort='
									+ Ext.getCmp('JWArchivesIssueSearch.sort')
											.getValue();
							url = encodeURI(url);
							url = encodeURI(url);
							window.location.href = url;
						} else {
							Ext.Msg.alert("提示", "没有数据需要导出！")
						}
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
					onRowAction : function(grid, record, action, row, col) {
						switch (action) {
						case 'btn-archives-detail':
							JWArchivesIssueSearch.detail(record.data.archiveId,
									record.data.runId, record.data.defId);
							break;
						default:
							break;
						}
					}
				});
JWArchivesIssueSearch.detail = function(editId, runId, defId) {
	var isGranted = false;
	if (curUserInfo.isOfficeStaffRole || curUserInfo.isAdmin
			|| curUserInfo.isArchivesManager) {
		isGranted = true;
	}
	new ArchDetailView({
		archivesId : editId,
		runId : runId,
		defId : defId,
		archType : 0,
		isGranted : isGranted
	}).show();
}